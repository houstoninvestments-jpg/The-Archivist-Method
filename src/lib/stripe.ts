// ============================================================
// Stripe Client
// Initialized from VITE_STRIPE_PUBLISHABLE_KEY. Used to kick the
// browser off to Stripe Checkout for tier upgrades. Tier names
// here align with the access_tier values stored in Supabase.
// ============================================================

import { loadStripe, type Stripe as StripeClient } from '@stripe/stripe-js';

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? '';

let stripePromise: Promise<StripeClient | null> | null = null;

export function getStripe(): Promise<StripeClient | null> {
  if (!stripePromise) {
    stripePromise = publishableKey
      ? loadStripe(publishableKey)
      : Promise.resolve(null);
  }
  return stripePromise;
}

export type AccessTier = 'free' | 'field_guide' | 'complete_archive';

// Product-to-tier map. Prices/products live in the Stripe dashboard;
// these are the live price IDs already configured on the account.
export const TIER_PRICE_IDS: Record<Exclude<AccessTier, 'free'>, string> = {
  field_guide: 'price_1TOlJr11kGDis0LrBP8ITvIC',
  complete_archive: 'price_1TOlGX11kGDis0LrvJl0SBhm',
};

const TIER_ORDER: Record<AccessTier, number> = {
  free: 0,
  field_guide: 1,
  complete_archive: 2,
};

export function meetsTier(
  userTier: AccessTier | null | undefined,
  required: AccessTier,
): boolean {
  return TIER_ORDER[userTier ?? 'free'] >= TIER_ORDER[required];
}

// Normalize any legacy access-level string (e.g. "quick-start", "archive")
// into the canonical AccessTier used throughout the UI.
export function normalizeTier(raw: string | null | undefined): AccessTier {
  switch (raw) {
    case 'complete_archive':
    case 'archive':
      return 'complete_archive';
    case 'field_guide':
    case 'quick-start':
    case 'quickstart':
      return 'field_guide';
    default:
      return 'free';
  }
}

// Kick the browser to a Checkout Session created by the server.
// The server endpoint returns a Stripe-hosted checkout URL.
export async function redirectToCheckout(
  tier: Exclude<AccessTier, 'free'>,
): Promise<void> {
  const endpoint =
    tier === 'field_guide'
      ? '/api/portal/checkout/quick-start'
      : '/api/portal/checkout/complete-archive';

  const res = await fetch(endpoint, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    throw new Error(`Failed to create checkout session (${res.status})`);
  }

  const { url } = await res.json();
  if (!url) throw new Error('Checkout URL missing from response');

  window.location.href = url;
}
