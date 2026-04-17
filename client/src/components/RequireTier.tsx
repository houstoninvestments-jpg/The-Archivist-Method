// ============================================================
// RequireTier (client app copy)
// Mirrors /src/components/RequireTier.tsx — kept in-tree so it
// stays inside the Vite root (client/). Paywall copy matches the
// source component exactly.
// ============================================================

import { useEffect, useState, type ReactNode } from 'react';
import {
  fetchTierStatus,
  meetsTier,
  redirectToCheckout,
  type AccessTier,
  type TierStatus,
} from '@/lib/stripe';

interface RequireTierProps {
  required: AccessTier;
  children: ReactNode;
  currentPattern?: string | null;
  upgradeTo?: Exclude<AccessTier, 'free'>;
  // "chat" lets free users through until they hit the server-enforced session cap.
  mode?: 'tier' | 'chat';
  // If true, render the paywall without taking up the full viewport. Useful when
  // embedding inside a sidebar/panel (e.g. the Pocket Archivist chat).
  inline?: boolean;
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

export function RequireTier({
  required,
  children,
  currentPattern,
  upgradeTo = 'complete_archive',
  mode = 'tier',
  inline = false,
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
    return (
      <div
        style={{
          background: '#0a0908',
          minHeight: inline ? 120 : '100vh',
        }}
      />
    );
  }

  const userTier: AccessTier = status?.accessTier ?? 'free';
  const tierMet = meetsTier(userTier, required);

  if (mode === 'chat') {
    const limit = status?.chatSessionLimit ?? null;
    const used = status?.chatSessionsUsed ?? 0;
    const sessionsRemaining = limit === null || used < limit;
    if (tierMet && (userTier !== 'free' || sessionsRemaining)) {
      return <>{children}</>;
    }
  } else if (tierMet) {
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
        minHeight: inline ? 'auto' : '100vh',
        height: inline ? '100%' : undefined,
        background: '#0a0908',
        color: '#f4ead5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: inline ? '32px 20px' : '48px 24px',
      }}
    >
      <div style={{ maxWidth: 520, width: '100%', textAlign: 'center' }}>
        <p
          style={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontStyle: 'italic',
            fontSize: inline ? 'clamp(18px, 2.4vw, 22px)' : 'clamp(22px, 3vw, 30px)',
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
            marginTop: 32,
            padding: '14px 28px',
            background: 'transparent',
            border: '1px solid #c8a96a',
            color: '#c8a96a',
            fontFamily: '"JetBrains Mono", "Courier New", monospace',
            fontSize: 11,
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
              marginTop: 18,
              color: '#c97b6a',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 10,
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
                marginTop: 28,
                color: '#8a7a55',
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 10,
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
