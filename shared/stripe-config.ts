// ============================================================
// Stripe mode-aware configuration (server-side).
// Mode resolves from STRIPE_MODE ("test" | "live"). When unset
// and STRIPE_SECRET_KEY starts with sk_test_, mode auto-detects
// as "test"; otherwise defaults to "live" so existing production
// behavior is unchanged.
// ============================================================

export type StripeMode = "live" | "test";

const LIVE_PRICES = {
  fieldGuide: "price_1TOlJr11kGDis0LrBP8ITvIC",
  completeArchive: "price_1TOlGX11kGDis0LrvJl0SBhm",
  fieldGuideUpsell: "price_1SpdpX11kGDis0LriTWyDo1f",
} as const;

export function getStripeMode(): StripeMode {
  const explicit = (process.env.STRIPE_MODE || "").toLowerCase();
  if (explicit === "test") return "test";
  if (explicit === "live") return "live";
  // Auto-detect from secret key prefix when STRIPE_MODE is unset.
  const key = process.env.STRIPE_SECRET_KEY || "";
  if (key.startsWith("sk_test_")) return "test";
  return "live";
}

export function getStripeSecretKey(): string {
  const mode = getStripeMode();
  if (mode === "test") {
    return (
      process.env.STRIPE_TEST_SECRET_KEY ||
      process.env.STRIPE_SECRET_KEY ||
      ""
    );
  }
  return process.env.STRIPE_SECRET_KEY || "";
}

// Every webhook signing secret currently configured. The webhook handler
// attempts each in turn so a single endpoint can verify events from both
// live and test Stripe accounts without redeploying.
export function getStripeWebhookSecrets(): string[] {
  const live = process.env.STRIPE_WEBHOOK_SECRET || "";
  const test = process.env.STRIPE_TEST_WEBHOOK_SECRET || "";
  return [live, test].filter(Boolean);
}

export interface StripePriceIds {
  fieldGuide: string;
  completeArchive: string;
  fieldGuideUpsell: string;
}

export function getStripePriceIds(): StripePriceIds {
  if (getStripeMode() === "test") {
    return {
      fieldGuide:
        process.env.STRIPE_TEST_PRICE_FIELD_GUIDE || LIVE_PRICES.fieldGuide,
      completeArchive:
        process.env.STRIPE_TEST_PRICE_COMPLETE_ARCHIVE ||
        LIVE_PRICES.completeArchive,
      fieldGuideUpsell:
        process.env.STRIPE_TEST_PRICE_FIELD_GUIDE_UPSELL ||
        LIVE_PRICES.fieldGuideUpsell,
    };
  }
  return { ...LIVE_PRICES };
}
