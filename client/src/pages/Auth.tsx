import { useState, type FormEvent } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { isSupabaseConfigured } from '@/lib/supabase';

const FONT_HEADING = "'Bebas Neue', sans-serif";
const FONT_MONO = "'JetBrains Mono', monospace";
const FONT_BODY = "'Inter', sans-serif";

const C_BG = '#0A0A0A';
const C_TEAL = '#00FFC2';
const C_TEXT = '#F5F5F5';
const C_MUTED = '#A3A3A3';
const C_DIM = '#666666';
const C_BORDER = '#2a2a2a';
const C_ERR = '#ef4444';

type Mode = 'signin' | 'signup';
type Status = 'idle' | 'working' | 'error' | 'confirm-sent';

export default function Auth() {
  const [, navigate] = useLocation();
  const { signInWithPassword, signUpWithPassword, user } = useAuth();

  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errMsg, setErrMsg] = useState('');

  if (user) {
    navigate('/portal', { replace: true });
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    if (!isSupabaseConfigured) {
      setStatus('error');
      setErrMsg('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
      return;
    }

    setStatus('working');
    setErrMsg('');

    const run = mode === 'signin' ? signInWithPassword : signUpWithPassword;
    const { error } = await run(email.trim().toLowerCase(), password);

    if (error) {
      setStatus('error');
      setErrMsg(error.message || 'Authentication failed.');
      return;
    }

    if (mode === 'signup') {
      setStatus('confirm-sent');
      return;
    }

    navigate('/portal', { replace: true });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: C_BG,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
      }}
    >
      <div style={{ width: '100%', maxWidth: 400 }}>
        <p
          style={{
            fontFamily: FONT_MONO,
            fontSize: 10,
            color: C_DIM,
            margin: '0 0 16px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}
        >
          THE ARCHIVIST METHOD // {mode === 'signin' ? 'SIGN IN' : 'CREATE ACCOUNT'}
        </p>

        <p
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 'clamp(36px, 9vw, 48px)',
            color: C_TEXT,
            margin: '0 0 8px',
            letterSpacing: '0.03em',
            lineHeight: 1.05,
          }}
        >
          {mode === 'signin' ? 'ENTER THE ARCHIVE' : 'OPEN A FILE'}
        </p>

        <p
          style={{
            fontFamily: FONT_BODY,
            fontSize: 14,
            color: C_MUTED,
            margin: '0 0 32px',
            lineHeight: 1.6,
          }}
        >
          {mode === 'signin'
            ? 'Email and password. No magic links.'
            : 'Create an account to save your patterns and sessions.'}
        </p>

        <div
          style={{
            width: '100%',
            height: 1,
            background: C_TEAL,
            opacity: 0.25,
            marginBottom: 32,
          }}
        />

        {status === 'confirm-sent' ? (
          <div>
            <p
              style={{
                fontFamily: FONT_HEADING,
                fontSize: 28,
                color: C_TEAL,
                margin: '0 0 12px',
                letterSpacing: '0.04em',
              }}
            >
              CHECK YOUR INBOX.
            </p>
            <p
              style={{
                fontFamily: FONT_BODY,
                fontSize: 14,
                color: C_MUTED,
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              We sent a confirmation email to {email}. Click the link to activate your account, then sign in.
            </p>
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setStatus('idle');
                setPassword('');
              }}
              style={{
                marginTop: 24,
                background: 'transparent',
                color: C_DIM,
                fontFamily: FONT_MONO,
                fontSize: 11,
                letterSpacing: '0.18em',
                border: `1px dashed ${C_BORDER}`,
                borderRadius: 2,
                padding: 12,
                cursor: 'pointer',
                textTransform: 'uppercase',
                width: '100%',
              }}
            >
              BACK TO SIGN IN
            </button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <label
              style={{
                display: 'block',
                fontFamily: FONT_MONO,
                fontSize: 10,
                color: C_DIM,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                marginBottom: 8,
              }}
            >
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              autoComplete="email"
              required
              disabled={status === 'working'}
              style={inputStyle}
            />

            <label
              style={{
                display: 'block',
                fontFamily: FONT_MONO,
                fontSize: 10,
                color: C_DIM,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                marginBottom: 8,
                marginTop: 16,
              }}
            >
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="at least 8 characters"
              minLength={8}
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              required
              disabled={status === 'working'}
              style={inputStyle}
            />

            {status === 'error' && (
              <p
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 11,
                  color: C_ERR,
                  margin: '16px 0 0',
                  letterSpacing: '0.05em',
                }}
              >
                {errMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'working' || !email.trim() || !password}
              style={{
                display: 'block',
                width: '100%',
                marginTop: 24,
                background: 'transparent',
                color: C_TEAL,
                fontFamily: FONT_HEADING,
                fontSize: 16,
                letterSpacing: '0.15em',
                border: `1px solid ${C_TEAL}`,
                borderRadius: 2,
                padding: 16,
                cursor: status === 'working' ? 'not-allowed' : 'pointer',
                opacity: status === 'working' ? 0.6 : 1,
              }}
            >
              {status === 'working'
                ? mode === 'signin'
                  ? 'SIGNING IN...'
                  : 'CREATING ACCOUNT...'
                : mode === 'signin'
                  ? 'SIGN IN →'
                  : 'CREATE ACCOUNT →'}
            </button>

            <button
              type="button"
              onClick={() => {
                setMode(mode === 'signin' ? 'signup' : 'signin');
                setStatus('idle');
                setErrMsg('');
              }}
              style={{
                display: 'block',
                width: '100%',
                marginTop: 16,
                background: 'transparent',
                color: C_MUTED,
                fontFamily: FONT_MONO,
                fontSize: 11,
                letterSpacing: '0.18em',
                border: 'none',
                padding: 8,
                cursor: 'pointer',
                textTransform: 'uppercase',
              }}
            >
              {mode === 'signin'
                ? 'NO ACCOUNT? CREATE ONE'
                : 'ALREADY HAVE AN ACCOUNT? SIGN IN'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  background: '#111',
  border: `1px solid ${C_BORDER}`,
  borderRadius: 2,
  color: C_TEXT,
  fontFamily: FONT_MONO,
  fontSize: 14,
  padding: '14px 16px',
  outline: 'none',
  boxSizing: 'border-box',
};
