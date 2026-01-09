import express, { Request, Response } from "express";
import {
  getUserByEmail,
  createUser,
  getUserPurchases,
  createPurchase,
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

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-11-20.acacia",
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

    const purchases = await getUserPurchases(authData.userId);
    const userAccess = calculateUserAccess(purchases);
    const availableUpgrades = getAvailableUpgrades(userAccess);

    res.json({
      email: authData.email,
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
        } catch (error) {
          user = await createUser(customerEmail, stripeCustomerId);
          console.log(`Created new user: ${user.id}`);
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

export default router;
