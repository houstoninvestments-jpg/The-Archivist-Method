// ============================================================
// Stripe Client (client app copy)
// Mirrors /src/lib/stripe.ts — kept in-tree so it stays inside
// the Vite root (client/).
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

export interface TierStatus {
  accessTier: AccessTier;
  primaryPattern: string | null;
  chatSessionsUsed: number;
  chatSessionLimit: number | null;
}

export async function fetchTierStatus(): Promise<TierStatus | null> {
  try {
    // On /portal/dev, send the dev bypass header so this endpoint resolves
    // without a session. Accepted by the server when NODE_ENV !== production
    // or when ARCHIVIST_BYPASS_KEY env var matches the header value.
    const isDevRoute =
      typeof window !== "undefined" &&
      window.location.pathname === "/portal/dev";
    const res = await fetch('/api/portal/tier-status', {
      credentials: 'include',
      headers: isDevRoute ? { "X-Dev-Bypass": "1" } : {},
    });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      accessTier: normalizeTier(data.accessTier),
      primaryPattern: data.primaryPattern ?? null,
      chatSessionsUsed: data.chatSessionsUsed ?? 0,
      chatSessionLimit: data.chatSessionLimit ?? null,
    };
  } catch {
    return null;
  }
}
