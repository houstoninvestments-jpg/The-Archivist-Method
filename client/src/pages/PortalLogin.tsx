import { useState, useMemo } from 'react';

const FONT_HEADING = "'Bebas Neue', sans-serif";
const FONT_MONO    = "'JetBrains Mono', monospace";
const FONT_BODY    = "'Inter', sans-serif";

const C_BG    = "#0A0A0A";
const C_TEAL  = "#00FFC2";
const C_TEXT  = "#F5F5F5";
const C_MUTED = "#A3A3A3";
const C_DIM   = "#666666";
const C_BORDER = "#2a2a2a";

// ── DEVELOPER ACCESS BYPASS ───────────────────────────────────────────────────
// Pre-signed HS256 JWT for the owner. Signed with the JWT_SECRET fallback used
// in api/portal-routes.ts ("your-secret-key-change-in-production"). Payload:
//   userId: "test_owner-bypass", email: "houstoninvestments@gmail.com"
//   exp:    iat + 10 years
// The verify-token + auth middleware short-circuits any userId starting with
// "test_", so this passes server-side auth with no DB lookup. Portal.tsx also
// honors the localStorage "dev_bypass" flag and skips API calls entirely so
// the portal renders even if /api is down.
const OWNER_BYPASS_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0X293bmVyLWJ5cGFzcyIsImVtYWlsIjoiaG91c3RvbmludmVzdG1lbnRzQGdtYWlsLmNvbSIsImlhdCI6MTc3NjI5MDIyNCwiZXhwIjoyMDkxNjUwMjI0fQ.6NcP1K0537n1_TqU28CR1SdinTcASWdqbruuNBv44kM";

function activateDeveloperAccess() {
  try {
    localStorage.setItem("quiz_auth_token", OWNER_BYPASS_JWT);
    localStorage.setItem("auth_token", OWNER_BYPASS_JWT);
    localStorage.setItem("dev_bypass", "true");
    // Also drop a non-httpOnly cookie so server-credentialed fetches that
    // happen to work get the JWT. Matches the cookie name the API uses.
    document.cookie = `auth_token=${OWNER_BYPASS_JWT}; path=/; max-age=${10 * 365 * 24 * 60 * 60}; SameSite=Lax`;
  } catch {
    /* ignore — still navigate */
  }
  window.location.href = "/portal";
}

export default function PortalLogin() {
  const [email, setEmail]     = useState('');
  const [status, setStatus]   = useState<'idle' | 'sending' | 'sent' | 'error' | 'instant' | 'devlink'>('idle');
  const [errMsg, setErrMsg]   = useState('');
  const [devLink, setDevLink] = useState<string | null>(null);

  // Item 16: graceful returning-user flow. /api/portal/auth/verify redirects
  // here with ?error=expired or ?error=invalid when a magic link or session
  // cookie has expired. Detect that and switch to the welcome-back copy
  // instead of bouncing the user to a generic error screen.
  const expiredReason = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const p = new URLSearchParams(window.location.search).get('error');
    if (p === 'expired') return 'expired';
    if (p === 'invalid') return 'invalid';
    return null;
  }, []);
  const isReturning = expiredReason !== null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('sending');
    setErrMsg('');
    setDevLink(null);

    try {
      const res = await fetch('/api/portal/auth/send-login-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
        credentials: 'include',
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const detail = data?.detail ? ` (${data.detail})` : '';
        throw new Error((data?.error || 'Failed to send link.') + detail);
      }

      const data = await res.json().catch(() => ({}));

      // Test user: instant access — redirect straight into the portal
      if (data?.instantAccess) {
        setStatus('instant');
        window.location.href = '/portal';
        return;
      }

      // Dev / email unavailable: surface the link in the UI for click-through
      if (data?.devLink) {
        setDevLink(data.devLink);
        setStatus('devlink');
        return;
      }

      setStatus('sent');
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : 'Something went wrong.');
      setStatus('error');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: C_BG,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>

        {/* Header */}
        <p style={{
          fontFamily: FONT_MONO,
          fontSize: '10px',
          color: C_DIM,
          margin: '0 0 16px',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
        }}>
          THE ARCHIVIST METHOD // ACCESS
        </p>

        <p style={{
          fontFamily: FONT_HEADING,
          fontSize: 'clamp(36px, 9vw, 48px)',
          color: C_TEXT,
          margin: '0 0 8px',
          letterSpacing: '0.03em',
          lineHeight: 1.05,
        }}>
          {isReturning ? 'WELCOME BACK.' : 'REQUEST ACCESS LINK'}
        </p>

        <p style={{
          fontFamily: FONT_BODY,
          fontSize: '14px',
          color: C_MUTED,
          margin: '0 0 40px',
          lineHeight: 1.6,
        }}>
          {isReturning
            ? expiredReason === 'expired'
              ? 'Your previous link expired. Enter your email for a new access link — we\u2019ll drop you back where you left off.'
              : 'That link couldn\u2019t be verified. Enter your email for a fresh access link.'
            : 'Enter your email. We\u2019ll send a secure link — no password required.'}
        </p>

        {/* Divider */}
        <div style={{
          width: '100%',
          height: '1px',
          background: C_TEAL,
          opacity: 0.25,
          marginBottom: '32px',
        }} />

        {status === 'sent' ? (
          <div>
            <p style={{
              fontFamily: FONT_HEADING,
              fontSize: '28px',
              color: C_TEAL,
              margin: '0 0 12px',
              letterSpacing: '0.04em',
            }}>
              LINK SENT.
            </p>
            <p style={{
              fontFamily: FONT_BODY,
              fontSize: '14px',
              color: C_MUTED,
              lineHeight: 1.6,
              margin: 0,
            }}>
              Check your inbox. The link expires in 1 hour.
            </p>
          </div>
        ) : status === 'instant' ? (
          <p style={{
            fontFamily: FONT_HEADING,
            fontSize: '28px',
            color: C_TEAL,
            margin: 0,
            letterSpacing: '0.04em',
          }}>
            ACCESS GRANTED. REDIRECTING...
          </p>
        ) : status === 'devlink' && devLink ? (
          <div>
            <p style={{
              fontFamily: FONT_HEADING,
              fontSize: '28px',
              color: C_TEAL,
              margin: '0 0 12px',
              letterSpacing: '0.04em',
            }}>
              LINK READY.
            </p>
            <p style={{
              fontFamily: FONT_BODY,
              fontSize: '13px',
              color: C_MUTED,
              lineHeight: 1.6,
              margin: '0 0 20px',
            }}>
              Email delivery is unavailable right now. Click the button below to enter your portal (expires in 1 hour).
            </p>
            <a
              href={devLink}
              style={{
                display: 'block',
                textAlign: 'center',
                background: C_TEAL,
                color: '#000',
                fontFamily: FONT_HEADING,
                fontSize: '16px',
                letterSpacing: '0.15em',
                borderRadius: '2px',
                padding: '16px',
                textDecoration: 'none',
              }}
            >
              ENTER PORTAL →
            </a>
            <p style={{
              fontFamily: FONT_MONO,
              fontSize: '9px',
              color: C_DIM,
              marginTop: '16px',
              letterSpacing: '0.12em',
              wordBreak: 'break-all',
            }}>
              {devLink}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Email input */}
            <label style={{
              display: 'block',
              fontFamily: FONT_MONO,
              fontSize: '10px',
              color: C_DIM,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: '8px',
            }}>
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={status === 'sending'}
              style={{
                display: 'block',
                width: '100%',
                background: '#111',
                border: `1px solid ${C_BORDER}`,
                borderRadius: '2px',
                color: C_TEXT,
                fontFamily: FONT_MONO,
                fontSize: '14px',
                padding: '14px 16px',
                marginBottom: '20px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />

            {/* Error message */}
            {status === 'error' && (
              <p style={{
                fontFamily: FONT_MONO,
                fontSize: '11px',
                color: '#ef4444',
                margin: '0 0 16px',
                letterSpacing: '0.05em',
              }}>
                {errMsg}
              </p>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={status === 'sending' || !email.trim()}
              style={{
                display: 'block',
                width: '100%',
                background: status === 'sending' ? '#005a45' : C_TEAL,
                color: '#000',
                fontFamily: FONT_HEADING,
                fontSize: '16px',
                letterSpacing: '0.15em',
                border: 'none',
                borderRadius: '2px',
                padding: '16px',
                cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                opacity: status === 'sending' ? 0.7 : 1,
              }}
            >
              {status === 'sending' ? 'SENDING...' : 'SEND ACCESS LINK →'}
            </button>

            {/* Developer access bypass — pure client-side, no API, no DB */}
            <button
              type="button"
              onClick={activateDeveloperAccess}
              style={{
                display: 'block',
                width: '100%',
                marginTop: '16px',
                background: 'transparent',
                color: C_DIM,
                fontFamily: FONT_MONO,
                fontSize: '11px',
                letterSpacing: '0.18em',
                border: `1px dashed ${C_BORDER}`,
                borderRadius: '2px',
                padding: '12px',
                cursor: 'pointer',
                textTransform: 'uppercase',
              }}
            >
              DEVELOPER ACCESS
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
