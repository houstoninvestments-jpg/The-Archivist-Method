import { useState } from 'react';

const FONT_HEADING = "'Bebas Neue', sans-serif";
const FONT_MONO    = "'JetBrains Mono', monospace";
const FONT_BODY    = "'Inter', sans-serif";

const C_BG    = "#0A0A0A";
const C_TEAL  = "#00FFC2";
const C_TEXT  = "#F5F5F5";
const C_MUTED = "#A3A3A3";
const C_DIM   = "#666666";
const C_BORDER = "#2a2a2a";

export default function PortalLogin() {
  const [email, setEmail]     = useState('');
  const [status, setStatus]   = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errMsg, setErrMsg]   = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('sending');
    setErrMsg('');

    try {
      const res = await fetch('/api/portal/auth/send-login-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
        credentials: 'include',
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Failed to send link.');
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
          REQUEST ACCESS LINK
        </p>

        <p style={{
          fontFamily: FONT_BODY,
          fontSize: '14px',
          color: C_MUTED,
          margin: '0 0 40px',
          lineHeight: 1.6,
        }}>
          Enter your email. We'll send a secure link — no password required.
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
              Check your inbox. The link expires in 24 hours.
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
          </form>
        )}
      </div>
    </div>
  );
}
