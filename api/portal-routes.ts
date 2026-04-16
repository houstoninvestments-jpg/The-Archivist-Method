import express, { Request, Response } from "express";
import Stripe from "stripe";
import { readFile } from "fs/promises";
import { join } from "path";
import crypto from "crypto";
import { userProgress, bookmarks, highlights, downloadLogs, pdfChatHistory, testUsers, portalChatHistory, interruptLog } from "../shared/schema.js";
import { eq, and, desc, asc } from "drizzle-orm";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { Resend } from "resend";
import { db } from "./_db.js";

// ── Inline: auth ──────────────────────────────────────────────────────────────
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
function generateAuthToken(userId: string, email: string): string {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: "7d" });
}
function verifyAuthToken(token: string): { userId: string; email: string } | null {
  try { return jwt.verify(token, JWT_SECRET) as { userId: string; email: string }; }
  catch { return null; }
}
function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}
async function generateMagicLink(email: string, userId: string, baseUrl: string): Promise<string> {
  const token = generateAuthToken(userId, email);
  // Store hashed token + 1hr expiry so we can invalidate after single use
  const expires = new Date(Date.now() + 60 * 60 * 1000);
  await db
    .update(quizUsers)
    .set({ magicLinkToken: hashToken(token), magicLinkExpires: expires })
    .where(eq(quizUsers.email, email.toLowerCase()))
    .catch(() => {}); // non-fatal if user not in quiz_users (test users)
  return `${baseUrl}/api/portal/auth/verify?token=${token}`;
}

// ── Test-user allowlist ──────────────────────────────────────────────────────
// If ADMIN_EMAIL or TEST_USER_EMAILS (comma-separated) matches a login attempt,
// the user is auto-provisioned into test_users + quiz_users on the fly. This
// survives database resets — set the env var once in Vercel and the owner can
// always log in.
function getAllowlistedEmails(): string[] {
  const raw = [
    process.env.ADMIN_EMAIL,
    process.env.TEST_USER_EMAILS,
    process.env.TEST_USER_EMAIL,
  ]
    .filter(Boolean)
    .join(",");
  return raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter((s) => s.includes("@"));
}

function isEmailAllowlisted(email: string): boolean {
  return getAllowlistedEmails().includes(email.toLowerCase());
}

function getBaseUrl(req?: Request): string {
  if (process.env.PORTAL_BASE_URL) return process.env.PORTAL_BASE_URL.replace(/\/$/, "");
  if (req) {
    const proto = (req.headers["x-forwarded-proto"] as string) || req.protocol || "https";
    const host = (req.headers["x-forwarded-host"] as string) || req.headers.host;
    if (host) return `${proto}://${host}`;
  }
  return "http://localhost:5000";
}

async function autoProvisionAllowlistedUser(
  normalizedEmail: string,
): Promise<{ id: string; email: string } | undefined> {
  // Default pattern / name derivation
  const defaultPattern =
    process.env.TEST_USER_PRIMARY_PATTERN?.trim() || "disappearing";
  const localPart = normalizedEmail.split("@")[0] || "admin";
  const derivedName =
    process.env.TEST_USER_NAME?.trim() ||
    localPart
      .split(/[._-]/)
      .filter(Boolean)
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(" ") ||
    "Test User";

  // 1. Insert (or fetch existing) test_users row with archive access + god mode
  let testUserRow:
    | { id: string; email: string }
    | undefined;
  try {
    const [inserted] = await db
      .insert(testUsers)
      .values({
        email: normalizedEmail,
        accessLevel: "archive",
        godMode: true,
        note: "Auto-provisioned from allowlist (ADMIN_EMAIL / TEST_USER_EMAILS)",
      })
      .onConflictDoNothing({ target: testUsers.email })
      .returning({ id: testUsers.id, email: testUsers.email });
    testUserRow = inserted;
  } catch (err) {
    console.error("[allowlist] testUsers insert failed:", err);
  }

  // If nothing inserted (already existed), fetch it
  if (!testUserRow) {
    try {
      [testUserRow] = await db
        .select({ id: testUsers.id, email: testUsers.email })
        .from(testUsers)
        .where(eq(testUsers.email, normalizedEmail));
    } catch (err) {
      console.error("[allowlist] testUsers fetch failed:", err);
    }
  }

  // 2. Upsert quiz_users row so pattern + name populate the portal UI.
  try {
    const existing = await db
      .select()
      .from(quizUsers)
      .where(eq(quizUsers.email, normalizedEmail));

    if (existing.length === 0) {
      await db.insert(quizUsers).values({
        email: normalizedEmail,
        name: derivedName,
        primaryPattern: defaultPattern,
        accessLevel: "archive",
      });
      console.log(
        `[allowlist] quiz_users row created for ${normalizedEmail} pattern=${defaultPattern}`,
      );
    } else {
      // Only fill missing fields — don't clobber whatever the owner set.
      const [row] = existing;
      const patch: Partial<typeof quizUsers.$inferInsert> = {};
      if (!row.primaryPattern) patch.primaryPattern = defaultPattern;
      if (!row.name) patch.name = derivedName;
      if (!row.accessLevel || row.accessLevel === "free") patch.accessLevel = "archive";
      if (Object.keys(patch).length > 0) {
        await db.update(quizUsers).set(patch).where(eq(quizUsers.email, normalizedEmail));
        console.log(
          `[allowlist] quiz_users patched for ${normalizedEmail} keys=${Object.keys(patch).join(",")}`,
        );
      }
    }
  } catch (err) {
    console.error("[allowlist] quiz_users upsert failed:", err);
  }

  return testUserRow;
}

// ── Inline: products ──────────────────────────────────────────────────────────
interface Product {
  id: string; name: string; price: number;
  stripeProductId: string; stripePriceId: string;
  description: string; features: string[]; pdfFileName: string;
}
const PRODUCTS: Record<string, Product> = {
  "crash-course": { id: "crash-course", name: "The Crash Course", price: 0, stripeProductId: "", stripePriceId: "", description: "Free pattern interruption crash course", features: ["Identify your destructive pattern","Learn body signatures and triggers","Circuit break scripts for all 9 patterns","First interrupt attempt protocol","Guided program"], pdfFileName: "THE-ARCHIVIST-METHOD-CRASH-COURSE.pdf" },
  "quick-start": { id: "quick-start", name: "The Field Guide", price: 67, stripeProductId: "prod_quick_start", stripePriceId: "price_1Scurl11kGDis0LrLDIjwDc9", description: "The Field Guide — Your complete interrupt protocol.", features: ["Complete Four Doors framework","Pattern-specific Field Guide PDF","Quick-win strategies for immediate pattern interruption","Essential worksheets and tracking tools","Emergency brake techniques"], pdfFileName: "THE-ARCHIVIST-METHOD-FIELD-GUIDE-DISAPPEARING.pdf" },
  "complete-archive": { id: "complete-archive", name: "The Complete Archive", price: 297, stripeProductId: "prod_complete_archive", stripePriceId: "price_1ScuuG11kGDis0LrWdBlpZ5w", description: "The Complete Archive — Every pattern. Every scenario. The complete system.", features: ["All 9 destructive patterns fully mapped","Complete rewrite protocol","Advanced pattern archaeology techniques","Lifetime pattern tracking system","Crisis management protocols","Pattern intersection analysis","Custom rewrite frameworks","Everything from The Field Guide"], pdfFileName: "THE-ARCHIVIST-METHOD-COMPLETE-ARCHIVE.pdf" },
};
interface UserAccess { hasQuickStart: boolean; hasCompleteArchive: boolean; purchases: { productId: string; productName: string; purchasedAt: string }[]; }
function calculateUserAccess(purchases: any[]): UserAccess {
  return { hasQuickStart: purchases.some(p => p.product_id === "quick-start"), hasCompleteArchive: purchases.some(p => p.product_id === "complete-archive"), purchases: purchases.map(p => ({ productId: p.product_id, productName: p.product_name, purchasedAt: p.purchased_at })) };
}
function getAvailableUpgrades(userAccess: UserAccess): Product[] {
  const upgrades: Product[] = [];
  if (!userAccess.hasQuickStart && !userAccess.hasCompleteArchive) upgrades.push(PRODUCTS["quick-start"]);
  if (!userAccess.hasCompleteArchive) upgrades.push(PRODUCTS["complete-archive"]);
  return upgrades;
}

// ── Inline: supabase helpers ──────────────────────────────────────────────────
import { portalUsers, purchases, quizUsers } from "../shared/schema.js";
interface PortalUser { id: string; email: string; name?: string | null; created_at: string; stripe_customer_id?: string | null; }
interface Purchase { id: string; user_id: string; product_id: string; product_name: string; amount_paid: number; purchased_at: string; stripe_payment_intent_id: string; }
function toPortalUser(row: typeof portalUsers.$inferSelect): PortalUser {
  return { id: row.id, email: row.email, name: row.name, created_at: row.createdAt?.toISOString() || new Date().toISOString(), stripe_customer_id: row.stripeCustomerId };
}
function toPurchase(row: typeof purchases.$inferSelect): Purchase {
  return { id: row.id, user_id: row.userId, product_id: row.productId, product_name: row.productName, amount_paid: row.amountPaid, purchased_at: row.purchasedAt?.toISOString() || new Date().toISOString(), stripe_payment_intent_id: row.stripePaymentIntentId };
}
async function getUserByEmail(email: string): Promise<PortalUser | null> {
  const [row] = await db.select().from(portalUsers).where(eq(portalUsers.email, email));
  return row ? toPortalUser(row) : null;
}
async function createUser(email: string, stripeCustomerId?: string, name?: string): Promise<PortalUser> {
  const [row] = await db.insert(portalUsers).values({ email, name: name || null, stripeCustomerId: stripeCustomerId || null }).returning();
  return toPortalUser(row);
}
async function updateUserName(userId: string, name: string): Promise<PortalUser | null> {
  const [row] = await db.update(portalUsers).set({ name }).where(eq(portalUsers.id, userId)).returning();
  return row ? toPortalUser(row) : null;
}
async function getUserById(userId: string): Promise<PortalUser | null> {
  const [row] = await db.select().from(portalUsers).where(eq(portalUsers.id, userId));
  return row ? toPortalUser(row) : null;
}
async function getUserPurchases(userId: string): Promise<Purchase[]> {
  const rows = await db.select().from(purchases).where(eq(purchases.userId, userId)).orderBy(desc(purchases.purchasedAt));
  return rows.map(toPurchase);
}
async function createPurchase(userId: string, productId: string, productName: string, amountPaid: number, stripePaymentIntentId: string): Promise<Purchase> {
  const [row] = await db.insert(purchases).values({ userId, productId, productName, amountPaid, stripePaymentIntentId }).returning();
  return toPurchase(row);
}

// ── Inline: email ─────────────────────────────────────────────────────────────
const patternDisplayNames: Record<string, string> = { disappearing: "The Disappearing Pattern", apologyLoop: "The Apology Loop", testing: "The Testing Pattern", attractionToHarm: "Attraction to Harm", complimentDeflection: "Compliment Deflection", drainingBond: "The Draining Bond", successSabotage: "Success Sabotage", perfectionism: "The Perfectionism Pattern", rage: "The Rage Pattern" };
async function sendPurchaseConfirmationEmail(data: { email: string; firstName?: string; patternName?: string | null; productName: string; portalLink: string }): Promise<boolean> {
  const firstName = data.firstName || "there";
  const subject = `Your archive is open, ${firstName}.`;
  const patternLine = data.patternName ? `<p style="color:#14B8A6;font-size:14px;margin:16px 0;">Your identified pattern: <strong>${patternDisplayNames[data.patternName] || data.patternName}</strong></p>` : "";
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;background:#000;font-family:'Helvetica Neue',Arial,sans-serif;"><div style="max-width:560px;margin:0 auto;padding:48px 24px;"><p style="font-size:11px;text-transform:uppercase;letter-spacing:0.2em;color:#737373;margin-bottom:32px;">The Archivist Method</p><h1 style="color:#FAFAFA;font-size:24px;font-weight:700;margin-bottom:24px;">Your archive is open, ${firstName}.</h1>${patternLine}<p style="color:#A3A3A3;font-size:15px;line-height:1.7;margin-bottom:8px;">Your purchase: <strong style="color:#FAFAFA;">${data.productName}</strong></p><div style="margin:32px 0;"><a href="${data.portalLink}" style="display:inline-block;padding:14px 32px;background:#14B8A6;color:#000;text-decoration:none;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">Enter Your Portal</a></div></div></body></html>`;
  if (process.env.NODE_ENV === "development") { console.log("[EMAIL] Dev mode - skipping send"); return true; }
  try {
    const _resendForEmail = new Resend(process.env.RESEND_API_KEY);
    await _resendForEmail.emails.send({ from: "The Archivist <hello@archiebase.com>", to: [data.email], subject, html });
    return true;
  } catch (err) { console.error("Email send failed:", err); return false; }
}

function getResend() { return new Resend(process.env.RESEND_API_KEY || "placeholder"); }

// Validation schemas for PDF viewer routes - aligned with DB defaults
const progressSchema = z.object({
  documentId: z.string().min(1).max(50),
  currentPage: z.number().int().min(1),
  totalPages: z.number().int().min(1).optional(),
  percentComplete: z.number().int().min(0).max(100).optional().default(0),
  pagesViewed: z.array(z.number().int().min(1)).optional().default([]),
});

const bookmarkSchema = z.object({
  documentId: z.string().min(1).max(50),
  pageNumber: z.number().int().min(1),
  pageLabel: z.string().max(50).optional().nullable(),
  note: z.string().max(500).optional().nullable(),
});

const highlightSchema = z.object({
  documentId: z.string().min(1).max(50),
  pageNumber: z.number().int().min(1),
  text: z.string().min(1).max(5000),
  color: z.string().max(20).optional(),
  position: z.object({ start: z.number(), end: z.number() }).optional(),
});

const chatSchema = z.object({
  message: z.string().min(1).max(4000),
  documentId: z.string().min(1).max(50),
  currentPage: z.number().int().min(1).optional(),
});

const router = express.Router();
function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not configured");
  return new Stripe(key, { apiVersion: "2025-11-17.clover" as const });
}

// Send magic login link
router.post("/auth/send-login-link", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Valid email required" });
    }

    const normalizedEmail = email.toLowerCase();
    console.log(`[send-login-link] attempt for ${normalizedEmail}`);

    // ── Hardcoded owner override ─────────────────────────────────────────────
    // Bypass all DB lookups + env-var allowlists for the owner account so we
    // can always log in even if test_users / quiz_users / portal_users are
    // empty or ADMIN_EMAIL is misconfigured. Runs BEFORE any other lookup.
    if (normalizedEmail === "houstoninvestments@gmail.com") {
      console.log(`[send-login-link] hardcoded owner override → ${normalizedEmail}`);

      const logErr = (label: string, err: unknown) => {
        const msg = err instanceof Error ? err.message : String(err);
        const stack = err instanceof Error && err.stack ? err.stack : "(no stack)";
        console.error(`[send-login-link][owner-override][${label}] ${msg}\n${stack}`);
      };

      // Each DB op is independently fenced. If the DB itself is unreachable
      // (e.g. Neon "Tenant or user not found"), we still mint a session token
      // and let the owner into the portal with a bypass id.
      let ownerId: string | null = null;

      // 1. Upsert test_users (archive + god mode)
      try {
        await db
          .insert(testUsers)
          .values({
            email: normalizedEmail,
            accessLevel: "archive",
            godMode: true,
            note: "Hardcoded owner override",
          })
          .onConflictDoUpdate({
            target: testUsers.email,
            set: { accessLevel: "archive", godMode: true },
          });
        console.log(`[send-login-link][owner-override] test_users upsert ok`);
      } catch (err) {
        logErr("test_users-upsert", err);
      }

      // 2. Upsert quiz_users (disappearing pattern, archive, "Aaron Houston")
      try {
        await db
          .insert(quizUsers)
          .values({
            email: normalizedEmail,
            name: "Aaron Houston",
            primaryPattern: "disappearing",
            accessLevel: "archive",
          })
          .onConflictDoUpdate({
            target: quizUsers.email,
            set: {
              name: "Aaron Houston",
              primaryPattern: "disappearing",
              accessLevel: "archive",
            },
          });
        console.log(`[send-login-link][owner-override] quiz_users upsert ok`);
      } catch (err) {
        logErr("quiz_users-upsert", err);
      }

      // 3. Fetch the test_users row id (best effort)
      try {
        const [ownerTestUser] = await db
          .select({ id: testUsers.id })
          .from(testUsers)
          .where(eq(testUsers.email, normalizedEmail));
        if (ownerTestUser?.id) ownerId = ownerTestUser.id;
      } catch (err) {
        logErr("test_users-fetch", err);
      }

      // 4. Fallback id when the DB is unreachable. The verify-token + auth
      // middleware short-circuits any id prefixed with "test_" so the bypass
      // id passes auth without further DB lookups.
      if (!ownerId) {
        ownerId = "owner-bypass";
        console.warn(`[send-login-link][owner-override] using fallback id=${ownerId}`);
      }

      // 5. Always mint the cookie + return the redirect. This must succeed
      // regardless of any prior DB failure.
      try {
        const sessionToken = generateAuthToken(`test_${ownerId}`, normalizedEmail);
        res.cookie("auth_token", sessionToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        console.log(`[send-login-link][owner-override] instant access id=${ownerId}`);
        return res.json({ status: "instant", redirect: "/portal" });
      } catch (err) {
        // JWT signing should never fail, but if it does, surface a clear
        // error so we know the JWT_SECRET env var is missing.
        logErr("jwt-sign", err);
        return res.status(500).json({
          error: "Owner override failed at JWT sign",
          detail: err instanceof Error ? err.message : String(err),
        });
      }
    }

    // Resend + environment diagnostics
    const resendKey = process.env.RESEND_API_KEY;
    const resendConfigured = Boolean(
      resendKey && resendKey !== "placeholder" && resendKey.trim() !== "",
    );
    const isDev = process.env.NODE_ENV !== "production";
    console.log(
      `[send-login-link] resendConfigured=${resendConfigured} isDev=${isDev} NODE_ENV=${process.env.NODE_ENV}`,
    );

    // Derive base URL from request headers (falls back to env or localhost)
    const proto = (req.headers["x-forwarded-proto"] as string) || req.protocol || "http";
    const host =
      (req.headers["x-forwarded-host"] as string) ||
      req.headers.host ||
      process.env.PORTAL_BASE_URL?.replace(/^https?:\/\//, "") ||
      "localhost:5000";
    const baseUrl = process.env.PORTAL_BASE_URL || `${proto}://${host}`;

    // 1. Test user path → instant auth cookie, no magic link
    let testUser: { id: string; email: string } | undefined;
    try {
      [testUser] = await db.select().from(testUsers).where(eq(testUsers.email, normalizedEmail));
      console.log(`[send-login-link] testUsers found=${!!testUser}`);
    } catch (err) {
      console.error(`[send-login-link] testUsers query failed:`, err);
    }

    // 1b. Auto-provision test users on the allowlist. Safe to re-run on every
    // call — we only insert if the user isn't already present.
    if (!testUser && isEmailAllowlisted(normalizedEmail)) {
      try {
        testUser = await autoProvisionAllowlistedUser(normalizedEmail);
        console.log(
          `[send-login-link] auto-provisioned allowlisted user ${normalizedEmail} id=${testUser?.id}`,
        );
      } catch (err) {
        console.error(`[send-login-link] auto-provision failed:`, err);
      }
    }

    if (testUser) {
      const sessionToken = generateAuthToken(`test_${testUser.id}`, normalizedEmail);
      res.cookie("auth_token", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      console.log(`[send-login-link] test user ${normalizedEmail} → instant access`);
      return res.json({
        message: "Access granted. Redirecting...",
        isTestUser: true,
        instantAccess: true,
      });
    }

    // 2. Find user via portal_users (purchases) or quiz_users (took quiz)
    let userId: string | null = null;
    try {
      const portalUser = await getUserByEmail(email);
      if (portalUser) {
        userId = portalUser.id;
        console.log(`[send-login-link] portal user match id=${userId}`);
      }
    } catch (err) {
      console.error(`[send-login-link] portal users query failed:`, err);
    }

    if (!userId) {
      try {
        const [quizUser] = await db
          .select()
          .from(quizUsers)
          .where(eq(quizUsers.email, normalizedEmail));
        if (quizUser) {
          userId = quizUser.id;
          console.log(`[send-login-link] quiz user match id=${userId}`);
        }
      } catch (err) {
        console.error(`[send-login-link] quiz users query failed:`, err);
      }
    }

    if (!userId) {
      console.log(`[send-login-link] no account for ${normalizedEmail}`);
      return res.status(404).json({
        error: "No account found with this email. Take the quiz or purchase a product first.",
      });
    }

    // 3. Generate magic link
    const magicLink = await generateMagicLink(email, userId, baseUrl);
    console.log(`[send-login-link] magicLink generated for ${normalizedEmail}`);

    // 4. Try to send email if Resend is configured
    let emailSent = false;
    let emailError: string | null = null;
    if (resendConfigured) {
      try {
        await getResend().emails.send({
          from: "The Archivist <hello@archiebase.com>",
          to: [email],
          subject: "Your access link — The Archivist Method",
          html: `
            <div style="background:#0a0a0a;color:#fff;padding:40px;font-family:sans-serif;">
              <p style="color:#00FFD1;font-size:12px;letter-spacing:3px;">THE ARCHIVIST METHOD</p>
              <h2 style="font-size:28px;">Your access link is ready.</h2>
              <p style="color:#94A3B8;">Click below to access your portal. Link expires in 1 hour.</p>
              <a href="${magicLink}"
                 style="display:inline-block;background:#00FFD1;color:#0a0a0a;padding:14px 32px;text-decoration:none;font-weight:bold;margin-top:20px;">
                ACCESS MY PORTAL →
              </a>
              <p style="color:#475569;font-size:12px;margin-top:40px;">
                If you didn't request this, ignore it.
              </p>
            </div>
          `,
        });
        emailSent = true;
        console.log(`[send-login-link] email dispatched to ${normalizedEmail}`);
      } catch (err) {
        emailError = err instanceof Error ? err.message : String(err);
        console.error(`[send-login-link] email send failed:`, err);
      }
    } else {
      console.warn(`[send-login-link] RESEND_API_KEY not configured — skipping email send`);
    }

    // 5. Respond. If email failed OR Resend isn't configured OR dev mode, return the link in-band.
    const includeDevLink = !emailSent || isDev || !resendConfigured;
    if (includeDevLink) {
      return res.json({
        message: emailSent
          ? "Login link sent — check your email. (Dev preview link included below.)"
          : "Email delivery unavailable. Use the link below to enter your portal.",
        devLink: magicLink,
        emailSent,
        emailError: isDev ? emailError : undefined,
        resendConfigured,
      });
    }

    res.json({ message: "Login link sent to your email" });
  } catch (error) {
    console.error("[send-login-link] fatal error:", error);
    const detail =
      process.env.NODE_ENV !== "production"
        ? error instanceof Error
          ? `${error.message}${error.stack ? "\n" + error.stack : ""}`
          : String(error)
        : undefined;
    res.status(500).json({ error: "Failed to send login link", detail });
  }
});

// Verify magic link token — single-use
router.get("/auth/verify", async (req: Request, res: Response) => {
  const { token } = req.query;

  if (!token || typeof token !== "string") {
    return res.redirect("/portal/login?error=invalid");
  }

  const authData = verifyAuthToken(token);

  if (!authData) {
    return res.redirect("/portal/login?error=expired");
  }

  // For real users: verify token hasn't been used and isn't expired
  if (!authData.userId.startsWith("test_")) {
    const [user] = await db
      .select()
      .from(quizUsers)
      .where(eq(quizUsers.email, authData.email));

    if (user) {
      const tokenHash = hashToken(token);
      const now = new Date();

      if (
        user.magicLinkToken !== tokenHash ||
        !user.magicLinkExpires ||
        user.magicLinkExpires < now
      ) {
        return res.redirect("/portal/login?error=expired");
      }

      // Invalidate — token is now single-use
      await db
        .update(quizUsers)
        .set({ magicLinkToken: null, magicLinkExpires: null })
        .where(eq(quizUsers.email, authData.email));
    }
  }

  // Issue a fresh 7-day session cookie
  const sessionToken = generateAuthToken(authData.userId, authData.email);
  res.cookie("auth_token", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7 * 1000, // 7 days
  });

  res.redirect("/portal");
});

// Get user data and purchases
router.get("/user-data", async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.quiz_token || req.cookies?.auth_token || req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const authData = verifyAuthToken(token);

    if (!authData) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    // Check if this is a test user (userId prefixed with "test_")
    if (authData.userId.startsWith("test_")) {
      const testUserId = authData.userId.replace("test_", "");
      const [testUser] = await db.select().from(testUsers).where(eq(testUsers.id, testUserId));

      if (!testUser) {
        return res.status(401).json({ error: "Test user not found" });
      }

      // Map test user access level to purchases
      const hasQuickStart = testUser.accessLevel === "quick-start" || testUser.accessLevel === "archive";
      const hasCompleteArchive = testUser.accessLevel === "archive";

      return res.json({
        email: testUser.email,
        name: null,
        isTestUser: true,
        purchases: [],
        hasQuickStart,
        hasCompleteArchive,
        availableUpgrades: [],
      });
    }

    // Always fetch quiz user for primaryPattern and accessLevel
    const [quizUser] = await db
      .select()
      .from(quizUsers)
      .where(eq(quizUsers.email, authData.email));

    const primaryPattern = quizUser?.primaryPattern || null;
    const accessLevel = quizUser?.accessLevel || 'free';

    let userData;
    try {
      const [userPurchases, user] = await Promise.all([
        getUserPurchases(authData.userId),
        getUserById(authData.userId),
      ]);
      if (!user) throw new Error('Not a portal user');
      const userAccess = calculateUserAccess(userPurchases);
      const availableUpgrades = getAvailableUpgrades(userAccess);

      userData = {
        email: authData.email,
        name: user.name || null,
        primaryPattern,
        accessLevel,
        purchases: userAccess.purchases,
        hasQuickStart: userAccess.hasQuickStart,
        hasCompleteArchive: userAccess.hasCompleteArchive,
        availableUpgrades: availableUpgrades.map((u) => ({
          id: u.id,
          name: u.name,
          price: u.price,
          description: u.description,
          features: u.features,
        })),
      };
    } catch {
      if (!quizUser) {
        return res.status(401).json({ error: "User not found" });
      }

      userData = {
        email: quizUser.email,
        name: quizUser.name || null,
        primaryPattern,
        accessLevel,
        purchases: [],
        hasQuickStart: false,
        hasCompleteArchive: false,
        availableUpgrades: [],
      };
    }

    res.json(userData);
  } catch (error) {
    console.error("User data error:", error);
    res.status(500).json({ error: "Failed to load user data" });
  }
});

// Download PDF with access control
router.get("/download/:productId", async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.quiz_token || req.cookies?.auth_token || req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const authData = verifyAuthToken(token);

    if (!authData) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const { productId } = req.params;
    const product = PRODUCTS[productId];

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (productId === "crash-course") {
      // Crash course is free for all authenticated users
    } else if (authData.userId.startsWith("test_")) {
      const testUserId = authData.userId.replace("test_", "");
      const [testUser] = await db.select().from(testUsers).where(eq(testUsers.id, testUserId));

      if (!testUser) {
        return res.status(401).json({ error: "Test user not found" });
      }

      const hasQuickStart = testUser.accessLevel === "quick-start" || testUser.accessLevel === "archive";
      const hasCompleteArchive = testUser.accessLevel === "archive";

      const hasAccess = (productId === "quick-start" && hasQuickStart) ||
                       (productId === "complete-archive" && hasCompleteArchive);

      if (!hasAccess) {
        return res.status(403).json({ error: "Access denied for your access level." });
      }
    } else {
      const purchases = await getUserPurchases(authData.userId);
      const hasPurchased = purchases.some((p) => p.product_id === productId);

      if (!hasPurchased) {
        return res.status(403).json({
          error: "Access denied. You have not purchased this product.",
        });
      }
    }

    let pdfFileName = product.pdfFileName;

    if (productId === "quick-start") {
      const patternToFieldGuide: Record<string, string> = {
        disappearing: "THE-ARCHIVIST-METHOD-FIELD-GUIDE-DISAPPEARING.pdf",
        apologyLoop: "THE-ARCHIVIST-METHOD-FIELD-GUIDE-APOLOGY-LOOP.pdf",
        testing: "THE-ARCHIVIST-METHOD-FIELD-GUIDE-TESTING.pdf",
        attractionToHarm: "THE-ARCHIVIST-METHOD-FIELD-GUIDE-ATTRACTION-TO-HARM.pdf",
        complimentDeflection: "THE-ARCHIVIST-METHOD-FIELD-GUIDE-COMPLIMENT-DEFLECTION.pdf",
        drainingBond: "THE-ARCHIVIST-METHOD-FIELD-GUIDE-DRAINING-BOND.pdf",
        successSabotage: "THE-ARCHIVIST-METHOD-FIELD-GUIDE-SUCCESS-SABOTAGE.pdf",
        perfectionism: "THE-ARCHIVIST-METHOD-FIELD-GUIDE-PERFECTIONISM.pdf",
        rage: "THE-ARCHIVIST-METHOD-FIELD-GUIDE-RAGE.pdf",
      };

      try {
        const { quizUsers } = await import("../shared/schema.js");
        const [quizUser] = await db
          .select()
          .from(quizUsers)
          .where(eq(quizUsers.email, authData.email));

        if (quizUser?.primaryPattern && patternToFieldGuide[quizUser.primaryPattern]) {
          pdfFileName = patternToFieldGuide[quizUser.primaryPattern];
        }
      } catch (err) {
        console.log("Could not resolve pattern-specific Field Guide, using default");
      }
    }

    const pdfPath = join(
      process.cwd(),
      "public",
      "downloads",
      pdfFileName,
    );
    const pdfBuffer = await readFile(pdfPath);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${pdfFileName}"`,
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ error: "Failed to download file" });
  }
});

// Create checkout session for Quick-Start upsell ($37)
router.post("/checkout/quick-start-upsell", async (req: Request, res: Response) => {
  try {
    const baseUrl = getBaseUrl(req);

    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: "price_1SpdpX11kGDis0LriTWyDo1f", // $37 upsell price
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/portal`,
      cancel_url: `${baseUrl}/portal`,
      metadata: {
        product_id: "quick-start",
        product_name: "The Field Guide",
        price_type: "upsell",
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Checkout session error:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

// Create checkout session for Quick-Start regular ($67)
router.post("/checkout/quick-start", async (req: Request, res: Response) => {
  try {
    const baseUrl = getBaseUrl(req);

    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: "price_1Scurl11kGDis0LrLDIjwDc9", // Quick-Start $67
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/portal`,
      cancel_url: `${baseUrl}/`,
      metadata: {
        product_id: "quick-start",
        product_name: "The Field Guide",
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Checkout session error:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

// Create checkout session for Complete Archive ($297)
router.post("/checkout/complete-archive", async (req: Request, res: Response) => {
  try {
    const baseUrl = getBaseUrl(req);

    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: "price_1ScuuG11kGDis0LrWdBlpZ5w", // Complete Archive $297
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/portal`,
      cancel_url: `${baseUrl}/`,
      metadata: {
        product_id: "complete-archive",
        product_name: "The Complete Archive",
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Checkout session error:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

// Create checkout session for Archive Upgrade ($150 - for existing Quick-Start owners)
router.post("/checkout/archive-upgrade", async (req: Request, res: Response) => {
  try {
    const baseUrl = getBaseUrl(req);

    // Use price_data to create a one-time $150 upgrade price
    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Complete Archive Upgrade",
              description: "The Complete Archive — Every pattern. Every scenario. The complete system. (Upgrade pricing)",
            },
            unit_amount: 15000, // $150 in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/portal`,
      cancel_url: `${baseUrl}/portal`,
      metadata: {
        product_id: "complete-archive",
        product_name: "Complete Archive (Upgrade)",
        upgrade_from: "quick-start",
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Upgrade checkout session error:", error);
    res.status(500).json({ error: "Failed to create upgrade checkout session" });
  }
});

// Test purchase endpoint (development only)
router.post("/test-purchase", async (req: Request, res: Response) => {
  if (process.env.NODE_ENV !== "development") {
    return res.status(403).json({ error: "Test purchases are only available in development mode" });
  }

  try {
    const { email, productId, productName, amount } = req.body;

    if (!email || !productId) {
      return res.status(400).json({ error: "Email and productId are required" });
    }

    let user = await getUserByEmail(email);
    if (!user) {
      user = await createUser(email, `test_cus_${Date.now()}`, undefined);
    }

    await createPurchase(
      user.id,
      productId,
      productName || "Test Purchase",
      amount || 0,
      `test_pi_${Date.now()}`,
    );

    const sessionToken = generateAuthToken(user.id, email);

    res.cookie("auth_token", sessionToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    console.log(`[TEST] Purchase simulated: ${productId} for ${email} ($${amount || 0})`);

    const baseUrl = getBaseUrl(req);

    const magicLink = await generateMagicLink(email, user.id, baseUrl);

    const { quizUsers } = await import("../shared/schema.js");
    const [quizUser] = await db.select().from(quizUsers).where(eq(quizUsers.email, email));

    await sendPurchaseConfirmationEmail({
      email,
      firstName: user.name?.split(" ")[0] || undefined,
      patternName: quizUser?.primaryPattern || null,
      productName: productName || productId,
      portalLink: magicLink,
    });

    res.json({
      success: true,
      message: `Test purchase of ${productName || productId} completed`,
      userId: user.id,
      redirectTo: "/portal",
    });
  } catch (error) {
    console.error("Test purchase error:", error);
    res.status(500).json({ error: "Test purchase failed" });
  }
});

// Stripe webhook handler
router.post(
  "/webhooks/stripe",
  express.raw({ type: "application/json" }),
  async (req: Request, res: Response) => {
    try {
      const signature = req.headers["stripe-signature"];

      if (!signature) {
        return res.status(400).json({ error: "No signature" });
      }

      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
      let event: Stripe.Event;

      try {
        event = getStripe().webhooks.constructEvent(
          req.body,
          signature,
          webhookSecret,
        );
      } catch (err) {
        console.error("Webhook signature verification failed:", err);
        return res.status(400).json({ error: "Invalid signature" });
      }

      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;

        const customerEmail =
          session.customer_email || session.customer_details?.email;
        const customerName = session.customer_details?.name || null;
        const stripeCustomerId = session.customer as string;
        const paymentIntentId = session.payment_intent as string;
        const amountTotal = session.amount_total || 0;

        const productId = session.metadata?.product_id;
        const productName = session.metadata?.product_name;

        if (!customerEmail || !productId || !productName) {
          console.error("Missing required data from Stripe session");
          return res.status(400).json({ error: "Missing data" });
        }

        let user;
        try {
          user = await getUserByEmail(customerEmail);
          if (!user) {
            user = await createUser(customerEmail, stripeCustomerId, customerName || undefined);
            console.log(`Created new user: ${user.id} (${customerName || 'no name'})`);
          } else if (customerName && !user.name) {
            user = await updateUserName(user.id, customerName);
            if (user) console.log(`Updated user name: ${customerName}`);
          }
        } catch (error) {
          user = await createUser(customerEmail, stripeCustomerId, customerName || undefined);
          console.log(`Created new user: ${user.id} (${customerName || 'no name'})`);
        }

        if (!user) throw new Error('Not a portal user');

        await createPurchase(
          user.id,
          productId,
          productName,
          amountTotal / 100,
          paymentIntentId,
        );

        console.log(`Purchase recorded for user ${user.id}: ${productName}`);

        const baseUrl = getBaseUrl(req);

        const magicLink = await generateMagicLink(
          customerEmail,
          user.id,
          baseUrl,
        );
        console.log(`Magic link for ${customerEmail}: ${magicLink}`);

        const { quizUsers } = await import("../shared/schema.js");
        const [quizUser] = await db.select().from(quizUsers).where(eq(quizUsers.email, customerEmail));

        await sendPurchaseConfirmationEmail({
          email: customerEmail,
          firstName: customerName?.split(" ")[0] || undefined,
          patternName: quizUser?.primaryPattern || null,
          productName: productName,
          portalLink: magicLink,
        });
      }

      res.json({ received: true });
    } catch (error) {
      console.error("Webhook error:", error);
      res.status(500).json({ error: "Webhook processing failed" });
    }
  },
);

// ============================================
// PDF VIEWER API ROUTES
// ============================================

// Helper to get authenticated user ID
const getAuthUserId = (req: Request): string | null => {
  const token = req.cookies?.quiz_token || req.cookies?.auth_token || req.headers.authorization?.replace('Bearer ', '');
  if (!token) return null;
  const authData = verifyAuthToken(token);
  return authData?.userId || null;
};

// Get user progress for a document
router.get("/reader/progress/:documentId", async (req: Request, res: Response) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) return res.status(401).json({ error: "Not authenticated" });

    const { documentId } = req.params;
    const [progress] = await db
      .select()
      .from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.documentId, documentId)));

    res.json(progress || { currentPage: 1, percentComplete: 0, pagesViewed: [] });
  } catch (error) {
    console.error("Get progress error:", error);
    res.status(500).json({ error: "Failed to get progress" });
  }
});

// Save/update user progress
router.post("/reader/progress", async (req: Request, res: Response) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) return res.status(401).json({ error: "Not authenticated" });

    const validation = progressSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: "Invalid data", details: validation.error.errors });
    }

    const { documentId, currentPage, totalPages, percentComplete, pagesViewed } = validation.data;

    const [existing] = await db
      .select()
      .from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.documentId, documentId)));

    if (existing) {
      await db
        .update(userProgress)
        .set({
          currentPage,
          totalPages,
          percentComplete,
          pagesViewed,
          lastAccessed: new Date(),
        })
        .where(eq(userProgress.id, existing.id));
    } else {
      await db.insert(userProgress).values({
        userId,
        documentId,
        currentPage,
        totalPages,
        percentComplete,
        pagesViewed,
      });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Save progress error:", error);
    res.status(500).json({ error: "Failed to save progress" });
  }
});

// Get bookmarks for a document
router.get("/reader/bookmarks/:documentId", async (req: Request, res: Response) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) return res.status(401).json({ error: "Not authenticated" });

    const { documentId } = req.params;
    const userBookmarks = await db
      .select()
      .from(bookmarks)
      .where(and(eq(bookmarks.userId, userId), eq(bookmarks.documentId, documentId)));

    res.json(userBookmarks);
  } catch (error) {
    console.error("Get bookmarks error:", error);
    res.status(500).json({ error: "Failed to get bookmarks" });
  }
});

// Add a bookmark
router.post("/reader/bookmarks", async (req: Request, res: Response) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) return res.status(401).json({ error: "Not authenticated" });

    const validation = bookmarkSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: "Invalid data", details: validation.error.errors });
    }

    const { documentId, pageNumber, pageLabel, note } = validation.data;

    const [newBookmark] = await db
      .insert(bookmarks)
      .values({ userId, documentId, pageNumber, pageLabel, note })
      .returning();

    res.json(newBookmark);
  } catch (error) {
    console.error("Add bookmark error:", error);
    res.status(500).json({ error: "Failed to add bookmark" });
  }
});

// Delete a bookmark
router.delete("/reader/bookmarks/:id", async (req: Request, res: Response) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) return res.status(401).json({ error: "Not authenticated" });

    const { id } = req.params;
    await db.delete(bookmarks).where(and(eq(bookmarks.id, id), eq(bookmarks.userId, userId)));

    res.json({ success: true });
  } catch (error) {
    console.error("Delete bookmark error:", error);
    res.status(500).json({ error: "Failed to delete bookmark" });
  }
});

// Get highlights for a document
router.get("/reader/highlights/:documentId", async (req: Request, res: Response) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) return res.status(401).json({ error: "Not authenticated" });

    const { documentId } = req.params;
    const userHighlights = await db
      .select()
      .from(highlights)
      .where(and(eq(highlights.userId, userId), eq(highlights.documentId, documentId)));

    res.json(userHighlights);
  } catch (error) {
    console.error("Get highlights error:", error);
    res.status(500).json({ error: "Failed to get highlights" });
  }
});

// Add a highlight
router.post("/reader/highlights", async (req: Request, res: Response) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) return res.status(401).json({ error: "Not authenticated" });

    const validation = highlightSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: "Invalid data", details: validation.error.errors });
    }

    const { documentId, pageNumber, text, color, position } = validation.data;

    const [newHighlight] = await db
      .insert(highlights)
      .values({ userId, documentId, pageNumber, text, color, position })
      .returning();

    res.json(newHighlight);
  } catch (error) {
    console.error("Add highlight error:", error);
    res.status(500).json({ error: "Failed to add highlight" });
  }
});

// Delete a highlight
router.delete("/reader/highlights/:id", async (req: Request, res: Response) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) return res.status(401).json({ error: "Not authenticated" });

    const { id } = req.params;
    await db.delete(highlights).where(and(eq(highlights.id, id), eq(highlights.userId, userId)));

    res.json({ success: true });
  } catch (error) {
    console.error("Delete highlight error:", error);
    res.status(500).json({ error: "Failed to delete highlight" });
  }
});

// Track download
router.post("/reader/track-download", async (req: Request, res: Response) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) return res.status(401).json({ error: "Not authenticated" });

    const { documentId } = req.body;

    await db.insert(downloadLogs).values({ userId, documentId });

    res.json({ success: true });
  } catch (error) {
    console.error("Track download error:", error);
    res.status(500).json({ error: "Failed to track download" });
  }
});

// PDF-aware AI chat - verify API key exists
const anthropic = process.env.ANTHROPIC_API_KEY ? new Anthropic() : null;

router.post("/reader/chat", async (req: Request, res: Response) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) return res.status(401).json({ error: "Not authenticated" });

    // Check if AI is available
    if (!anthropic) {
      return res.status(503).json({ error: "AI service unavailable" });
    }

    const validation = chatSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: "Invalid data", details: validation.error.errors });
    }

    const { message, documentId, currentPage } = validation.data;

    // Save user message to history
    await db.insert(pdfChatHistory).values({
      userId,
      documentId,
      role: "user",
      message,
      currentPage,
    });

    // Get chat history for context
    const history = await db
      .select()
      .from(pdfChatHistory)
      .where(and(eq(pdfChatHistory.userId, userId), eq(pdfChatHistory.documentId, documentId)))
      .orderBy(pdfChatHistory.timestamp)
      .limit(10);

    // Build messages for Claude
    const messages = history.slice(-8).map((h) => ({
      role: h.role as "user" | "assistant",
      content: h.message,
    }));

    // Add current message if not already in history
    if (messages.length === 0 || messages[messages.length - 1].content !== message) {
      messages.push({ role: "user" as const, content: message });
    }

    const documentName = documentId === "quick-start" ? "The Field Guide" : "The Complete Archive";

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: `You are The Archivist, a helpful guide for The Archivist Method. You help users understand the "${documentName}" PDF they are reading.

The user is currently on page ${currentPage || 1}.

Be concise, supportive, and reference specific sections or concepts from the methodology. If asked about specific page numbers, be helpful but note that you don't have the exact PDF content - instead offer to explain concepts or patterns they might be reading about.

Key topics in The Field Guide:
- The 9 core psychological patterns (Disappearing, Apology Loop, Testing, Attraction to Harm, Compliment Deflection, Draining Bond, Success Sabotage, Perfectionism, Rage)
- Body signature identification
- Pattern recognition exercises
- Breaking pattern cycles
- 90-day implementation timeline`,
      messages,
    });

    // Extract text from response, handle non-text content gracefully
    let assistantMessage = "";
    for (const block of response.content) {
      if (block.type === "text") {
        assistantMessage = block.text;
        break;
      }
    }

    // Only save if we got a valid text response
    if (assistantMessage) {
      await db.insert(pdfChatHistory).values({
        userId,
        documentId,
        role: "assistant",
        message: assistantMessage,
        currentPage,
      });
    } else {
      assistantMessage = "I'm sorry, I couldn't generate a response. Please try again.";
    }

    res.json({ message: assistantMessage });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Failed to process chat message" });
  }
});

// Get chat history for a document
router.get("/reader/chat/:documentId", async (req: Request, res: Response) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) return res.status(401).json({ error: "Not authenticated" });

    const { documentId } = req.params;
    const history = await db
      .select()
      .from(pdfChatHistory)
      .where(and(eq(pdfChatHistory.userId, userId), eq(pdfChatHistory.documentId, documentId)))
      .orderBy(pdfChatHistory.timestamp);

    res.json(history);
  } catch (error) {
    console.error("Get chat history error:", error);
    res.status(500).json({ error: "Failed to get chat history" });
  }
});

// ============================================
// PORTAL AI CHAT ROUTES
// ============================================

const portalChatSchema = z.object({
  message: z.string().min(1).max(4000),
});

router.get("/chat/history", async (req: Request, res: Response) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) return res.status(401).json({ error: "Not authenticated" });

    const history = await db
      .select()
      .from(portalChatHistory)
      .where(eq(portalChatHistory.userId, userId))
      .orderBy(asc(portalChatHistory.createdAt))
      .limit(100);

    res.json(history);
  } catch (error) {
    console.error("Get portal chat history error:", error);
    res.status(500).json({ error: "Failed to get chat history" });
  }
});

router.post("/chat", async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.quiz_token || req.cookies?.auth_token || req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: "Not authenticated" });
    const authData = verifyAuthToken(token);
    if (!authData) return res.status(401).json({ error: "Invalid or expired token" });

    const { tier } = await resolveUserTier(authData);
    if (tier === "free") {
      return res.status(403).json({ error: "The Pocket Archivist requires a Field Guide or Complete Archive purchase." });
    }

    const userId = authData.userId;

    if (!anthropic) {
      return res.status(503).json({ error: "AI service unavailable" });
    }

    const validation = portalChatSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: "Invalid data", details: validation.error.errors });
    }

    const { message } = validation.data;

    await db.insert(portalChatHistory).values({
      userId,
      role: "user",
      message,
    });

    const history = await db
      .select()
      .from(portalChatHistory)
      .where(eq(portalChatHistory.userId, userId))
      .orderBy(asc(portalChatHistory.createdAt))
      .limit(50);

    const messages = history.slice(-20).map((h) => ({
      role: h.role as "user" | "assistant",
      content: h.message,
    }));

    if (messages.length === 0 || messages[messages.length - 1].content !== message) {
      messages.push({ role: "user" as const, content: message });
    }

    const { pattern, tier: clientTier, streak } = req.body;
    const patternName = pattern || "unknown";
    const userTier = tier || clientTier || "free";
    const streakCount = streak || 0;

    let tierAccess = "";
    if (userTier === "quick-start") {
      tierAccess = `If user_tier == "field_guide":
- You know ALL 9 patterns fully
- You can help with implementation, circuit breaks, 90-day protocol
- If they ask about advanced topics (combinations, relationships, workplace): "That's in the Complete Archive—want the short version?"`;
    } else {
      tierAccess = `If user_tier == "complete_archive":
- Full access to everything
- No gates, no upsells
- Pattern combinations, relationship protocols, workplace applications, parenting, advanced techniques`;
    }

    const systemPrompt = `You are not a chatbot. You are a precision pattern intervention tool. You know this user's specific pattern, body signature, and circuit break protocol from their quiz results and purchase history. Reference their specific pattern by name immediately. Do not ask them to explain their situation from scratch. Meet them where they are. Your only job is to help them interrupt the pattern that is firing right now.

You are The Archivist. A pattern archaeologist. Not a therapist.

USER CONTEXT:
- Primary Pattern: ${patternName}
- Tier: ${userTier}
- Streak: ${streakCount} days

VOICE:
- Short responses. Conversational. Like texting a wise friend who doesn't waste words.
- Never more than 3-4 sentences unless they ask for depth.
- Warm but direct. Never soft. Never clinical cold either.
- Vary how you explain things — never say the same thing the same way twice.
- Never start with "I". Never say "Great question", "Certainly", "As an AI", "I understand", "That resonates."
- No bullet points in conversation. Ever.
- Sound like a person who has seen everything and is no longer surprised by any of it.

MEMORY AND PERSONALIZATION:
- Track everything the user shares across the conversation — their pattern, their body signatures, their language, their specific situations, names of people they mention.
- Reference what they've told you naturally. "You mentioned your sister earlier — that sounds like the same loop."
- Adapt your tone to match theirs. If they're brief, be brief. If they go deep, go deeper.
- Make them feel like you actually know them. Because by the end of the conversation, you do.
- Never ask for information you've already been given.

RECOGNITION OVER VALIDATION:
- Don't tell them they're brave or strong. Tell them what you see.
- "That's the Testing pattern running. You already knew that." lands better than "Wow, that took courage to share."
- They should feel seen, not praised.
- Recognition feels like: "You do this thing. Here's exactly how it works. Here's where it fires."
- Validation feels like therapy. Don't do therapy.

PATTERN WORK IN CONVERSATION:
- If they describe a behavior, name the pattern. Fast. Don't circle it for three messages.
- If they're in the middle of a pattern moment, help them identify the body signature right now.
- If they've interrupted a pattern successfully, acknowledge it briefly and move forward.
- Keep pattern work practical and present tense. Not "why you got here" but "what to do right now."

KNOWLEDGE BASE:
- 9 patterns: Disappearing, Apology Loop, Testing, Attraction to Harm, Compliment Deflection, Draining Bond, Success Sabotage, Perfectionism, Rage
- Four Doors: Focus (name it), Excavation (find the origin), Interruption (use the window), Rewrite (install new response)
- 3-7 second window: biological veto point before pattern executes
- Body signatures: physical sensations that precede each pattern
- Circuit breaks: specific interruption protocols

${tierAccess}

SAFETY:
- If someone is in crisis, stop everything and give them 988 directly.
- Never diagnose. Never replace therapy for trauma.
- If something feels beyond patterns into clinical territory, say so clearly and kindly.

BANNED WORDS:
journey, healing, toxic, triggers (say body signature), boundaries, self-care, empower, transform, validate, hold space, unpack, trauma response (unless clinical context is clear)

STREAK ACKNOWLEDGMENT:
- At 7 days: "One week of interrupts. The pattern is losing its grip."
- At 30 days: "30 days. You're rewiring the circuit. This is real progress."
- At 90 days: "90 days. You've done what most people never do. The pattern doesn't run you anymore."`;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 800,
      system: systemPrompt,
      messages,
    });

    let assistantMessage = "";
    for (const block of response.content) {
      if (block.type === "text") {
        assistantMessage = block.text;
        break;
      }
    }

    if (assistantMessage) {
      await db.insert(portalChatHistory).values({
        userId,
        role: "assistant",
        message: assistantMessage,
      });
    } else {
      assistantMessage = "Connection disrupted. Try again.";
    }

    res.json({ message: assistantMessage });
  } catch (error) {
    console.error("Portal chat error:", error);
    res.status(500).json({ error: "Failed to process chat message" });
  }
});

router.delete("/chat/history", async (req: Request, res: Response) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) return res.status(401).json({ error: "Not authenticated" });

    await db.delete(portalChatHistory).where(eq(portalChatHistory.userId, userId));
    res.json({ success: true });
  } catch (error) {
    console.error("Clear chat history error:", error);
    res.status(500).json({ error: "Failed to clear chat history" });
  }
});

// ============================================
// STREAK TRACKING ROUTES
// ============================================

router.get("/streak", async (req: Request, res: Response) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) return res.status(401).json({ error: "Not authenticated" });

    const logs = await db
      .select()
      .from(interruptLog)
      .where(eq(interruptLog.userId, userId))
      .orderBy(desc(interruptLog.date));

    const today = new Date().toISOString().split("T")[0];
    const checkedToday = logs.some((l) => l.date === today);

    let streakCount = 0;
    if (logs.length > 0) {
      const sortedDates = logs.map((l) => l.date).sort().reverse();
      const todayDate = new Date(today);
      let checkDate = new Date(todayDate);

      if (!checkedToday) {
        checkDate.setDate(checkDate.getDate() - 1);
      }

      let graceDays = 0;
      for (let i = 0; i < sortedDates.length && graceDays <= 2; i++) {
        const logDate = new Date(sortedDates[i]);
        const diffDays = Math.floor((checkDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
          streakCount++;
          checkDate.setDate(checkDate.getDate() - 1);
          graceDays = 0;
        } else if (diffDays <= 2) {
          graceDays += diffDays;
          if (graceDays <= 2) {
            streakCount++;
            checkDate = new Date(logDate);
            checkDate.setDate(checkDate.getDate() - 1);
          }
        } else {
          break;
        }
      }
    }

    res.json({ streakCount, checkedToday, totalInterrupts: logs.length });
  } catch (error) {
    console.error("Get streak error:", error);
    res.status(500).json({ error: "Failed to get streak" });
  }
});

router.post("/interrupt", async (req: Request, res: Response) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) return res.status(401).json({ error: "Not authenticated" });

    const today = new Date().toISOString().split("T")[0];

    const existing = await db
      .select()
      .from(interruptLog)
      .where(and(eq(interruptLog.userId, userId), eq(interruptLog.date, today)));

    if (existing.length > 0) {
      return res.json({ success: true, alreadyChecked: true });
    }

    await db.insert(interruptLog).values({
      userId,
      date: today,
    });

    res.json({ success: true, alreadyChecked: false });
  } catch (error) {
    console.error("Record interrupt error:", error);
    res.status(500).json({ error: "Failed to record interrupt" });
  }
});

// Get user pattern from quiz_users (for portal context)
router.get("/user-pattern", async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.quiz_token || req.cookies?.auth_token || req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: "Not authenticated" });
    const authData = verifyAuthToken(token);
    if (!authData) return res.status(401).json({ error: "Invalid token" });

    // Try quiz_users table for pattern data
    const { quizUsers } = await import("../shared/schema.js");
    const [quizUser] = await db
      .select()
      .from(quizUsers)
      .where(eq(quizUsers.email, authData.email));

    if (quizUser) {
      return res.json({
        pattern: quizUser.primaryPattern,
        patternScores: quizUser.patternScores,
        secondaryPatterns: quizUser.secondaryPatterns,
      });
    }

    res.json({ pattern: null, patternScores: null, secondaryPatterns: null });
  } catch (error) {
    console.error("Get user pattern error:", error);
    res.status(500).json({ error: "Failed to get user pattern" });
  }
});

router.get("/onboarding-status", async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.quiz_token || req.cookies?.auth_token || req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: "Not authenticated" });
    const authData = verifyAuthToken(token);
    if (!authData) return res.status(401).json({ error: "Invalid token" });

    const { quizUsers } = await import("../shared/schema.js");
    const [quizUser] = await db
      .select()
      .from(quizUsers)
      .where(eq(quizUsers.email, authData.email));

    res.json({
      completed: quizUser?.onboardingCompleted ?? false,
      primaryPattern: quizUser?.primaryPattern || null,
    });
  } catch (error) {
    console.error("Onboarding status error:", error);
    res.status(500).json({ error: "Failed to get onboarding status" });
  }
});

router.post("/onboarding-complete", async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.quiz_token || req.cookies?.auth_token || req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: "Not authenticated" });
    const authData = verifyAuthToken(token);
    if (!authData) return res.status(401).json({ error: "Invalid token" });

    const { quizUsers } = await import("../shared/schema.js");
    await db
      .update(quizUsers)
      .set({ onboardingCompleted: true })
      .where(eq(quizUsers.email, authData.email));

    res.json({ success: true });
  } catch (error) {
    console.error("Onboarding complete error:", error);
    res.status(500).json({ error: "Failed to complete onboarding" });
  }
});

router.post("/onboarding-update-pattern", async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.quiz_token || req.cookies?.auth_token || req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: "Not authenticated" });
    const authData = verifyAuthToken(token);
    if (!authData) return res.status(401).json({ error: "Invalid token" });

    const { pattern } = req.body;
    if (!pattern || typeof pattern !== "string") {
      return res.status(400).json({ error: "Valid pattern required" });
    }

    const { quizUsers } = await import("../shared/schema.js");
    await db
      .update(quizUsers)
      .set({ primaryPattern: pattern })
      .where(eq(quizUsers.email, authData.email));

    res.json({ success: true, pattern });
  } catch (error) {
    console.error("Update pattern error:", error);
    res.status(500).json({ error: "Failed to update pattern" });
  }
});

// ==========================================
// CONTENT READER ROUTES
// ==========================================

import {
  getTocForTier,
  getCompleteArchiveToc,
  canAccessSection,
  getSectionContent,
  findSectionById,
  getAdjacentSections,
  getFirstSectionId,
} from "./_content.js";
import { readerNotes, readingProgress } from "../shared/schema.js";

function getAuthToken(req: Request): string | null {
  return req.cookies?.quiz_token || req.cookies?.auth_token || req.headers.authorization?.replace('Bearer ', '') || null;
}

async function resolveUserTier(authData: { userId: string; email: string }): Promise<{
  tier: "free" | "quick-start" | "archive";
  primaryPattern: string | null;
  userId: string;
}> {
  const userId = authData.userId;

  if (userId.startsWith("test_")) {
    const testUserId = userId.replace("test_", "");
    const [testUser] = await db.select().from(testUsers).where(eq(testUsers.id, testUserId));
    if (testUser) {
      const tier = testUser.godMode ? "archive" : testUser.accessLevel === "archive" ? "archive" : testUser.accessLevel === "quick-start" ? "quick-start" : "free";
      const { quizUsers } = await import("../shared/schema.js");
      const [qu] = await db.select().from(quizUsers).where(eq(quizUsers.email, authData.email));
      return { tier: tier as "free" | "quick-start" | "archive", primaryPattern: qu?.primaryPattern || null, userId };
    }
  }

  let hasQuickStart = false;
  let hasCompleteArchive = false;
  try {
    const purchases = await getUserPurchases(userId);
    const access = calculateUserAccess(purchases);
    hasQuickStart = access.hasQuickStart;
    hasCompleteArchive = access.hasCompleteArchive;
  } catch {}

  const tier = hasCompleteArchive ? "archive" : hasQuickStart ? "quick-start" : "free";

  const { quizUsers } = await import("../shared/schema.js");
  const [qu] = await db.select().from(quizUsers).where(eq(quizUsers.email, authData.email));

  return { tier: tier as "free" | "quick-start" | "archive", primaryPattern: qu?.primaryPattern || null, userId };
}

router.get("/reader/toc", async (req: Request, res: Response) => {
  try {
    const token = getAuthToken(req);
    if (!token) return res.status(401).json({ error: "Not authenticated" });
    const authData = verifyAuthToken(token);
    if (!authData) return res.status(401).json({ error: "Invalid token" });

    const { tier, primaryPattern, userId } = await resolveUserTier(authData);
    const toc = getTocForTier(tier, primaryPattern || undefined);

    const fullToc = getCompleteArchiveToc(primaryPattern || undefined);

    const accessibleIds = new Set<string>();
    for (const g of toc.groups) {
      for (const s of g.sections) {
        accessibleIds.add(s.id);
      }
    }

    const allSectionIds: string[] = [];
    const annotatedGroups = fullToc.groups.map((g) => ({
      ...g,
      sections: g.sections.map((s) => {
        allSectionIds.push(s.id);
        return { ...s, locked: !accessibleIds.has(s.id) };
      }),
    }));

    const progressRows = await db
      .select()
      .from(readingProgress)
      .where(eq(readingProgress.userId, userId));

    const progressMap: Record<string, { completed: boolean; lastPosition: number }> = {};
    for (const row of progressRows) {
      progressMap[row.sectionId] = {
        completed: row.completed || false,
        lastPosition: row.lastPosition || 0,
      };
    }

    const completedCount = progressRows.filter((r) => r.completed).length;
    const totalAccessible = accessibleIds.size;

    res.json({
      tier,
      primaryPattern,
      groups: annotatedGroups,
      progress: progressMap,
      stats: {
        completedSections: completedCount,
        totalSections: totalAccessible,
        percentComplete: totalAccessible > 0 ? Math.round((completedCount / totalAccessible) * 100) : 0,
      },
      firstSectionId: getFirstSectionId(tier, primaryPattern || undefined),
    });
  } catch (error) {
    console.error("Reader TOC error:", error);
    res.status(500).json({ error: "Failed to load table of contents" });
  }
});

router.get("/reader/section/:sectionId", async (req: Request, res: Response) => {
  try {
    const token = getAuthToken(req);
    if (!token) return res.status(401).json({ error: "Not authenticated" });
    const authData = verifyAuthToken(token);
    if (!authData) return res.status(401).json({ error: "Invalid token" });

    const { tier, primaryPattern, userId } = await resolveUserTier(authData);
    const { sectionId } = req.params;

    const section = findSectionById(sectionId);
    if (!section) return res.status(404).json({ error: "Section not found" });

    const hasAccess = canAccessSection(sectionId, tier, primaryPattern || undefined);

    if (!hasAccess) {
      return res.json({
        sectionId,
        title: section.title,
        content: `# ${section.title}\n\nThis section requires a higher access tier to read.`,
        readMinutes: 0,
        locked: true,
        prev: null,
        next: null,
      });
    }

    const result = await getSectionContent(sectionId);
    if (!result) return res.status(404).json({ error: "Content not found" });

    const adjacent = getAdjacentSections(sectionId, tier, primaryPattern || undefined);

    res.json({
      sectionId,
      title: section.title,
      content: result.content,
      readMinutes: result.readMinutes,
      locked: false,
      prev: adjacent.prev,
      next: adjacent.next,
    });
  } catch (error) {
    console.error("Reader section error:", error);
    res.status(500).json({ error: "Failed to load section" });
  }
});

// ── DEV BYPASS READER ROUTES ────────────────────────────────────────────────
// Public, no-auth, no-DB versions of /reader/toc and /reader/section. Backs
// the /portal/dev page so the owner can read the real markdown content even
// when auth or the database are completely down. Hardcoded as the
// "disappearing" pattern, archive tier, "Aaron Houston".
router.get("/dev/reader/toc", async (_req: Request, res: Response) => {
  try {
    const tier = "archive" as const;
    const primaryPattern = "disappearing";
    const toc = getCompleteArchiveToc(primaryPattern);
    const annotatedGroups = toc.groups.map((g) => ({
      ...g,
      sections: g.sections.map((s) => ({ ...s, locked: false })),
    }));
    const totalSections = annotatedGroups.reduce(
      (acc, g) => acc + g.sections.length,
      0,
    );
    res.json({
      tier,
      primaryPattern,
      groups: annotatedGroups,
      progress: {},
      stats: { completedSections: 0, totalSections, percentComplete: 0 },
      firstSectionId: getFirstSectionId(tier, primaryPattern),
      // Hardcoded user shell, in case the client wants to display it
      user: { name: "Aaron Houston", email: "houstoninvestments@gmail.com", accessLevel: "archive" },
    });
  } catch (error) {
    console.error("[dev reader toc] error:", error);
    res.status(500).json({ error: "Failed to load dev TOC", detail: error instanceof Error ? error.message : String(error) });
  }
});

router.get("/dev/reader/section/:sectionId", async (req: Request, res: Response) => {
  try {
    const tier = "archive" as const;
    const primaryPattern = "disappearing";
    const { sectionId } = req.params;
    const section = findSectionById(sectionId);
    if (!section) return res.status(404).json({ error: "Section not found" });
    const result = await getSectionContent(sectionId);
    if (!result) return res.status(404).json({ error: "Content not found" });
    const adjacent = getAdjacentSections(sectionId, tier, primaryPattern);
    res.json({
      sectionId,
      title: section.title,
      content: result.content,
      readMinutes: result.readMinutes,
      locked: false,
      prev: adjacent.prev,
      next: adjacent.next,
    });
  } catch (error) {
    console.error("[dev reader section] error:", error);
    res.status(500).json({ error: "Failed to load dev section", detail: error instanceof Error ? error.message : String(error) });
  }
});

router.get("/reader/notes/:sectionId", async (req: Request, res: Response) => {
  try {
    const token = getAuthToken(req);
    if (!token) return res.status(401).json({ error: "Not authenticated" });
    const authData = verifyAuthToken(token);
    if (!authData) return res.status(401).json({ error: "Invalid token" });

    const { tier, primaryPattern, userId } = await resolveUserTier(authData);
    const { sectionId } = req.params;

    if (!canAccessSection(sectionId, tier, primaryPattern || undefined)) {
      return res.status(403).json({ error: "Access denied" });
    }

    const notes = await db
      .select()
      .from(readerNotes)
      .where(and(eq(readerNotes.userId, userId), eq(readerNotes.sectionId, sectionId)))
      .orderBy(desc(readerNotes.createdAt));

    res.json({ notes });
  } catch (error) {
    console.error("Reader notes error:", error);
    res.status(500).json({ error: "Failed to load notes" });
  }
});

router.post("/reader/notes", async (req: Request, res: Response) => {
  try {
    const token = getAuthToken(req);
    if (!token) return res.status(401).json({ error: "Not authenticated" });
    const authData = verifyAuthToken(token);
    if (!authData) return res.status(401).json({ error: "Invalid token" });

    const { sectionId, content, highlightText } = req.body;
    if (!sectionId) return res.status(400).json({ error: "sectionId required" });
    if (!content && !highlightText) return res.status(400).json({ error: "content or highlightText required" });

    const { tier, primaryPattern } = await resolveUserTier(authData);
    if (!canAccessSection(sectionId, tier, primaryPattern || undefined)) {
      return res.status(403).json({ error: "Access denied" });
    }

    const [note] = await db
      .insert(readerNotes)
      .values({
        userId: authData.userId,
        sectionId,
        content: content || null,
        highlightText: highlightText || null,
      })
      .returning();

    res.json({ note });
  } catch (error) {
    console.error("Create note error:", error);
    res.status(500).json({ error: "Failed to create note" });
  }
});

router.delete("/reader/notes/:noteId", async (req: Request, res: Response) => {
  try {
    const token = getAuthToken(req);
    if (!token) return res.status(401).json({ error: "Not authenticated" });
    const authData = verifyAuthToken(token);
    if (!authData) return res.status(401).json({ error: "Invalid token" });

    const { noteId } = req.params;
    await db
      .delete(readerNotes)
      .where(and(eq(readerNotes.id, noteId), eq(readerNotes.userId, authData.userId)));

    res.json({ success: true });
  } catch (error) {
    console.error("Delete note error:", error);
    res.status(500).json({ error: "Failed to delete note" });
  }
});

router.post("/reader/progress", async (req: Request, res: Response) => {
  try {
    const token = getAuthToken(req);
    if (!token) return res.status(401).json({ error: "Not authenticated" });
    const authData = verifyAuthToken(token);
    if (!authData) return res.status(401).json({ error: "Invalid token" });

    const { sectionId, completed, lastPosition } = req.body;
    if (!sectionId) return res.status(400).json({ error: "sectionId required" });

    const { tier, primaryPattern } = await resolveUserTier(authData);
    if (!canAccessSection(sectionId, tier, primaryPattern || undefined)) {
      return res.status(403).json({ error: "Access denied" });
    }

    const existing = await db
      .select()
      .from(readingProgress)
      .where(and(eq(readingProgress.userId, authData.userId), eq(readingProgress.sectionId, sectionId)));

    if (existing.length > 0) {
      const updates: Record<string, any> = { updatedAt: new Date() };
      if (typeof completed === "boolean") updates.completed = completed;
      if (typeof lastPosition === "number") updates.lastPosition = lastPosition;

      await db
        .update(readingProgress)
        .set(updates)
        .where(and(eq(readingProgress.userId, authData.userId), eq(readingProgress.sectionId, sectionId)));
    } else {
      await db.insert(readingProgress).values({
        userId: authData.userId,
        sectionId,
        completed: completed || false,
        lastPosition: lastPosition || 0,
      });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Save progress error:", error);
    res.status(500).json({ error: "Failed to save progress" });
  }
});

router.get("/reader/progress", async (req: Request, res: Response) => {
  try {
    const token = getAuthToken(req);
    if (!token) return res.status(401).json({ error: "Not authenticated" });
    const authData = verifyAuthToken(token);
    if (!authData) return res.status(401).json({ error: "Invalid token" });

    const rows = await db
      .select()
      .from(readingProgress)
      .where(eq(readingProgress.userId, authData.userId));

    const progressMap: Record<string, { completed: boolean; lastPosition: number }> = {};
    for (const row of rows) {
      progressMap[row.sectionId] = {
        completed: row.completed || false,
        lastPosition: row.lastPosition || 0,
      };
    }

    res.json({ progress: progressMap });
  } catch (error) {
    console.error("Get progress error:", error);
    res.status(500).json({ error: "Failed to load progress" });
  }
});

// ─── Crash Course: Get Status ────────────────────────────────────────────────
router.get("/crash-course/status", async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.quiz_token || req.cookies?.auth_token || req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: "Not authenticated" });
    const authData = verifyAuthToken(token);
    if (!authData) return res.status(401).json({ error: "Invalid or expired token" });

    const [user] = await db.select().from(quizUsers).where(eq(quizUsers.email, authData.email));
    if (!user) return res.status(401).json({ error: "User not found" });

    res.json({
      primaryPattern: user.primaryPattern || null,
      accessLevel: user.accessLevel || 'free',
      crashCourseDay: user.crashCourseDay || 0,
      crashCourseStarted: user.crashCourseStarted || null,
    });
  } catch (error) {
    console.error("Crash course status error:", error);
    res.status(500).json({ error: "Failed to load crash course status" });
  }
});

// ─── Crash Course: Save Progress ─────────────────────────────────────────────
router.post("/crash-course/progress", async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.quiz_token || req.cookies?.auth_token || req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: "Not authenticated" });
    const authData = verifyAuthToken(token);
    if (!authData) return res.status(401).json({ error: "Invalid or expired token" });

    const { day } = req.body;
    if (typeof day !== 'number' || day < 1 || day > 7) {
      return res.status(400).json({ error: "Invalid day" });
    }

    const [user] = await db.select().from(quizUsers).where(eq(quizUsers.email, authData.email));
    if (!user) return res.status(401).json({ error: "User not found" });

    const currentDay = user.crashCourseDay || 0;
    const newDay = Math.max(currentDay, day);

    await db
      .update(quizUsers)
      .set({
        crashCourseDay: newDay,
        crashCourseStarted: user.crashCourseStarted || new Date(),
      })
      .where(eq(quizUsers.email, authData.email));

    res.json({ crashCourseDay: newDay });
  } catch (error) {
    console.error("Crash course progress error:", error);
    res.status(500).json({ error: "Failed to save progress" });
  }
});

export default router;
