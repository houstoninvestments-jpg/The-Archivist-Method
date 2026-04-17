// ============================================================
// RequireTier
// Wraps a subtree and only renders it if the current user meets
// the required access tier. If they don't, a Cormorant-Garamond
// paywall screen is shown with a gold-framed CTA to Stripe Checkout.
// ============================================================

import { useEffect, useState, type ReactNode } from 'react';
import {
  meetsTier,
  normalizeTier,
  redirectToCheckout,
  type AccessTier,
} from '../lib/stripe';

interface TierStatus {
  accessTier: AccessTier;
  primaryPattern: string | null;
  chatSessionsUsed: number;
  chatSessionLimit: number | null;
}

interface RequireTierProps {
  required: AccessTier;
  children: ReactNode;
  // Optional override for the pattern mentioned in the paywall copy.
  // Defaults to the user's primary pattern from the server.
  currentPattern?: string | null;
  // When true, the paywall CTA sends them to the Field Guide tier.
  // Otherwise defaults to Complete Archive (the fuller upgrade path).
  upgradeTo?: Exclude<AccessTier, 'free'>;
}

const patternDisplayNames: Record<string, string> = {
  disappearing: 'The Disappearing Pattern',
  apologyLoop: 'The Apology Loop',
  testing: 'The Testing Pattern',
  attractionToHarm: 'Attraction to Harm',
  complimentDeflection: 'Compliment Deflection',
  drainingBond: 'The Draining Bond',
  successSabotage: 'Success Sabotage',
  perfectionism: 'Perfectionism',
  rage: 'Rage',
};

async function fetchTierStatus(): Promise<TierStatus | null> {
  try {
    const res = await fetch('/api/portal/tier-status', {
      credentials: 'include',
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

export function RequireTier({
  required,
  children,
  currentPattern,
  upgradeTo = 'complete_archive',
}: RequireTierProps) {
  const [status, setStatus] = useState<TierStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutPending, setCheckoutPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    fetchTierStatus().then((s) => {
      if (!mounted) return;
      setStatus(s);
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return <div style={{ background: '#000', minHeight: '100vh' }} />;
  }

  const userTier: AccessTier = status?.accessTier ?? 'free';
  if (meetsTier(userTier, required)) {
    return <>{children}</>;
  }

  const patternKey = currentPattern ?? status?.primaryPattern ?? '';
  const patternLabel =
    patternDisplayNames[patternKey] || 'pattern you were given';

  const handleUpgrade = async () => {
    setCheckoutPending(true);
    setError(null);
    try {
      await redirectToCheckout(upgradeTo);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Could not open checkout. Try again.',
      );
      setCheckoutPending(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0a0908',
        color: '#f4ead5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
      }}
    >
      <div style={{ maxWidth: 620, width: '100%', textAlign: 'center' }}>
        <p
          style={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontStyle: 'italic',
            fontSize: 'clamp(22px, 3vw, 30px)',
            lineHeight: 1.55,
            color: '#f4ead5',
            margin: 0,
          }}
        >
          The Archivist can see what's happening, but your current access only
          covers the {patternLabel}. Unlock the full archive to work with all 9
          patterns.
        </p>

        <button
          type="button"
          onClick={handleUpgrade}
          disabled={checkoutPending}
          style={{
            marginTop: 40,
            padding: '16px 32px',
            background: 'transparent',
            border: '1px solid #c8a96a',
            color: '#c8a96a',
            fontFamily: '"JetBrains Mono", "Courier New", monospace',
            fontSize: 12,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            cursor: checkoutPending ? 'progress' : 'pointer',
            opacity: checkoutPending ? 0.6 : 1,
            transition: 'border-color 160ms ease, color 160ms ease',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = '#e4c98d';
            (e.currentTarget as HTMLButtonElement).style.color = '#e4c98d';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = '#c8a96a';
            (e.currentTarget as HTMLButtonElement).style.color = '#c8a96a';
          }}
        >
          {checkoutPending ? 'Opening checkout…' : 'Unlock the full archive'}
        </button>

        {error && (
          <p
            style={{
              marginTop: 20,
              color: '#c97b6a',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 11,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            {error}
          </p>
        )}

        {status?.accessTier === 'free' &&
          status.chatSessionLimit !== null &&
          status.chatSessionsUsed >= status.chatSessionLimit && (
            <p
              style={{
                marginTop: 32,
                color: '#8a7a55',
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 11,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
              }}
            >
              Free sessions used: {status.chatSessionsUsed} of{' '}
              {status.chatSessionLimit}
            </p>
          )}
      </div>
    </div>
  );
}

export default RequireTier;
