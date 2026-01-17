import express, { Request, Response } from "express";
import {
  getUserByEmail,
  createUser,
  getUserPurchases,
  createPurchase,
  getUserById,
  updateUserName,
} from "./supabase";
import { generateAuthToken, verifyAuthToken, generateMagicLink } from "./auth";
import {
  PRODUCTS,
  calculateUserAccess,
  getAvailableUpgrades,
} from "./products";
import Stripe from "stripe";
import { readFile } from "fs/promises";
import { join } from "path";
import { db } from "../db";
import { userProgress, bookmarks, highlights, downloadLogs, pdfChatHistory } from "@shared/schema";
import { eq, and } from "drizzle-orm";
import Anthropic from "@anthropic-ai/sdk";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-11-17.clover" as const,
});

// Send magic login link
router.post("/auth/send-login-link", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Valid email required" });
    }

    let user;
    try {
      user = await getUserByEmail(email);
    } catch (error) {
      return res.status(404).json({
        error:
          "No account found with this email. Please purchase a product first.",
      });
    }

    const baseUrl = process.env.REPL_SLUG
      ? `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`
      : "http://localhost:5000";

    const magicLink = await generateMagicLink(email, user.id, baseUrl);

    console.log(`Magic link for ${email}: ${magicLink}`);

    // TODO: Send email via your email service
    // For development, return the link
    if (process.env.NODE_ENV === "development") {
      return res.json({
        message: "Login link generated",
        devLink: magicLink,
      });
    }

    res.json({ message: "Login link sent to your email" });
  } catch (error) {
    console.error("Login link error:", error);
    res.status(500).json({ error: "Failed to send login link" });
  }
});

// Verify magic link token
router.get("/auth/verify", (req: Request, res: Response) => {
  const { token } = req.query;

  if (!token || typeof token !== "string") {
    return res.redirect("/portal/login?error=invalid");
  }

  const authData = verifyAuthToken(token);

  if (!authData) {
    return res.redirect("/portal/login?error=expired");
  }

  res.cookie("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7 * 1000, // 7 days
  });

  res.redirect("/portal/dashboard");
});

// Get user data and purchases
router.get("/user-data", async (req: Request, res: Response) => {
  try {
    const token = req.cookies.auth_token;

    if (!token) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const authData = verifyAuthToken(token);

    if (!authData) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const [purchases, user] = await Promise.all([
      getUserPurchases(authData.userId),
      getUserById(authData.userId),
    ]);
    const userAccess = calculateUserAccess(purchases);
    const availableUpgrades = getAvailableUpgrades(userAccess);

    res.json({
      email: authData.email,
      name: user.name || null,
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
    });
  } catch (error) {
    console.error("User data error:", error);
    res.status(500).json({ error: "Failed to load user data" });
  }
});

// Download PDF with access control
router.get("/download/:productId", async (req: Request, res: Response) => {
  try {
    const token = req.cookies.auth_token;

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

    const purchases = await getUserPurchases(authData.userId);
    const hasPurchased = purchases.some((p) => p.product_id === productId);

    if (!hasPurchased) {
      return res.status(403).json({
        error: "Access denied. You have not purchased this product.",
      });
    }

    const pdfPath = join(
      process.cwd(),
      "public",
      "downloads",
      product.pdfFileName,
    );
    const pdfBuffer = await readFile(pdfPath);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${product.pdfFileName}"`,
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
    const baseUrl = process.env.REPLIT_DEV_DOMAIN 
      ? `https://${process.env.REPLIT_DEV_DOMAIN}`
      : process.env.REPLIT_DOMAINS
        ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}`
        : "http://localhost:5000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: "price_1SpdpX11kGDis0LriTWyDo1f", // $37 upsell price
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/success/quick-start`,
      cancel_url: `${baseUrl}/thank-you`,
      metadata: {
        product_id: "quick-start",
        product_name: "Quick-Start System",
        price_type: "upsell",
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Checkout session error:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

// Create checkout session for Quick-Start regular ($47)
router.post("/checkout/quick-start", async (req: Request, res: Response) => {
  try {
    const baseUrl = process.env.REPLIT_DEV_DOMAIN 
      ? `https://${process.env.REPLIT_DEV_DOMAIN}`
      : process.env.REPLIT_DOMAINS
        ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}`
        : "http://localhost:5000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: "price_1Scurl11kGDis0LrLDIjwDc9", // Quick-Start $47
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/success/quick-start`,
      cancel_url: `${baseUrl}/`,
      metadata: {
        product_id: "quick-start",
        product_name: "Quick-Start System",
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Checkout session error:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

// Create checkout session for Complete Archive ($197)
router.post("/checkout/complete-archive", async (req: Request, res: Response) => {
  try {
    const baseUrl = process.env.REPLIT_DEV_DOMAIN 
      ? `https://${process.env.REPLIT_DEV_DOMAIN}`
      : process.env.REPLIT_DOMAINS
        ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}`
        : "http://localhost:5000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: "price_1ScuuG11kGDis0LrWdBlpZ5w", // Complete Archive $197
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/success/complete-archive`,
      cancel_url: `${baseUrl}/`,
      metadata: {
        product_id: "complete-archive",
        product_name: "Complete Archive",
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Checkout session error:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
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
        event = stripe.webhooks.constructEvent(
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
          if (customerName && !user.name) {
            user = await updateUserName(user.id, customerName);
            console.log(`Updated user name: ${customerName}`);
          }
        } catch (error) {
          user = await createUser(customerEmail, stripeCustomerId, customerName || undefined);
          console.log(`Created new user: ${user.id} (${customerName || 'no name'})`);
        }

        await createPurchase(
          user.id,
          productId,
          productName,
          amountTotal / 100,
          paymentIntentId,
        );

        console.log(`Purchase recorded for user ${user.id}: ${productName}`);

        const baseUrl = process.env.REPL_SLUG
          ? `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`
          : "http://localhost:5000";

        const magicLink = await generateMagicLink(
          customerEmail,
          user.id,
          baseUrl,
        );
        console.log(`Magic link for ${customerEmail}: ${magicLink}`);

        // TODO: Send welcome email with magic link
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
  const token = req.cookies.auth_token;
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

    const { documentId, currentPage, totalPages, percentComplete, pagesViewed } = req.body;

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

    const { documentId, pageNumber, pageLabel, note } = req.body;

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

    const { documentId, pageNumber, text, color, position } = req.body;

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

// PDF-aware AI chat
const anthropic = new Anthropic();

router.post("/reader/chat", async (req: Request, res: Response) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) return res.status(401).json({ error: "Not authenticated" });

    const { message, documentId, currentPage } = req.body;

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

    const documentName = documentId === "quick-start" ? "90-Day Quick-Start System" : "Complete Pattern Archive";

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: `You are The Archivist, a helpful guide for The Archivist Method. You help users understand the "${documentName}" PDF they are reading.

The user is currently on page ${currentPage}.

Be concise, supportive, and reference specific sections or concepts from the methodology. If asked about specific page numbers, be helpful but note that you don't have the exact PDF content - instead offer to explain concepts or patterns they might be reading about.

Key topics in the Quick-Start System:
- The 7 core psychological patterns (Disappearing, Apology Loop, Testing, Attraction to Harm, Compliment Deflection, Draining Bond, Success Sabotage)
- Body signature identification
- Pattern recognition exercises
- Breaking pattern cycles
- 90-day implementation timeline`,
      messages,
    });

    const assistantMessage = response.content[0].type === "text" ? response.content[0].text : "";

    // Save assistant response
    await db.insert(pdfChatHistory).values({
      userId,
      documentId,
      role: "assistant",
      message: assistantMessage,
      currentPage,
    });

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

export default router;
