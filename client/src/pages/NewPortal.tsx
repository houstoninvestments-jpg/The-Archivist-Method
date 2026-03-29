import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'wouter';
import { Lock } from 'lucide-react';

// ─── Fonts / Colors ───────────────────────────────────────────────
const FONT_HEADING = "'Bebas Neue', sans-serif";
const FONT_MONO = "'JetBrains Mono', monospace";
const FONT_BODY = "'Inter', sans-serif";

const C_BG       = "#0A0A0A";
const C_TEAL     = "#00FFC2";
const C_MAGENTA  = "#EC4899";
const C_TEXT     = "#F5F5F5";
const C_MUTED    = "#A3A3A3";
const C_DIM      = "#666666";
const C_DARK     = "#444444";

// ─── Pattern Details ──────────────────────────────────────────────
const patternDetails: Record<string, { name: string; bodySignature: string; circuitBreak: string }> = {
  disappearing: {
    name: "THE DISAPPEARING PATTERN",
    bodySignature: "Tightness in chest, urge to physically leave, numbness spreading through limbs.",
    circuitBreak: "When you feel the pull to vanish, name it: 'The pattern is running.' Stay 5 more minutes. That's the interrupt."
  },
  apologyLoop: {
    name: "THE APOLOGY LOOP",
    bodySignature: "Shoulders hunching, voice getting quieter, stomach dropping before speaking.",
    circuitBreak: "Catch the 'sorry' before it leaves your mouth. Replace it with a statement: 'I need...' or 'I want...' That's the interrupt."
  },
  testing: {
    name: "THE TESTING PATTERN",
    bodySignature: "Restless energy, scanning for threats, jaw clenching during calm moments.",
    circuitBreak: "When you create a test, ask: 'Am I testing or trusting?' Choose trust for 24 hours. That's the interrupt."
  },
  attractionToHarm: {
    name: "ATTRACTION TO HARM",
    bodySignature: "Boredom with safety, excitement with instability, confusion between love and adrenaline.",
    circuitBreak: "When 'boring' appears, reframe: 'This is what safe feels like.' Sit with safe for one hour. That's the interrupt."
  },
  complimentDeflection: {
    name: "COMPLIMENT DEFLECTION",
    bodySignature: "Heat in face, urge to look away, immediate mental list of why they're wrong.",
    circuitBreak: "When a compliment lands, say only: 'Thank you.' Nothing else. No qualifier. That's the interrupt."
  },
  drainingBond: {
    name: "THE DRAINING BOND",
    bodySignature: "Guilt when considering boundaries, physical heaviness when near the person, exhaustion mistaken for love.",
    circuitBreak: "Ask: 'If a friend described this exact situation, what would I tell them?' Listen to your own advice. That's the interrupt."
  },
  successSabotage: {
    name: "SUCCESS SABOTAGE",
    bodySignature: "Anxiety increasing as deadline approaches, sudden urge to destroy what you've built, feeling like a fraud.",
    circuitBreak: "When the urge to sabotage hits, finish one more step. Just one. Don't evaluate — execute. That's the interrupt."
  },
  perfectionism: {
    name: "THE PERFECTIONISM PATTERN",
    bodySignature: "Paralysis. Dread. A widening gap between the vision in your head and reality on the page.",
    circuitBreak: "Perfectionism is telling you it's not ready. Done is better than perfect. Ship it. That's the interrupt."
  },
  rage: {
    name: "THE RAGE PATTERN",
    bodySignature: "Heat rising from chest to face. Jaw tight. Pressure building behind your eyes like a dam about to break.",
    circuitBreak: "You feel the anger rising. This is the Rage Pattern. Don't say anything for 10 seconds. Breathe. That's the interrupt."
  }
};

// ─── Intro lines ──────────────────────────────────────────────────
const INTRO_LINES = [
  { text: "You already know you have a pattern.", pause: 800 },
  { text: "", pause: 600 },
  { text: "You've watched yourself do it.", pause: 0 },
  { text: "You've tried to stop.", pause: 0 },
  { text: "You did it anyway.", pause: 900 },
  { text: "", pause: 600 },
  { text: "This isn't a character flaw.", pause: 0 },
  { text: "It isn't trauma you haven't processed.", pause: 0 },
  { text: "It isn't 'just who you are.'", pause: 900 },
  { text: "", pause: 600 },
  { text: "It's a program.", pause: 0 },
  { text: "And programs can be interrupted.", pause: 900 },
  { text: "", pause: 600 },
  { text: "You have 3 to 7 seconds.", pause: 900 },
  { text: "", pause: 600 },
  { text: "That's always been enough.", pause: 0 },
  { text: "You just didn't know it yet.", pause: 0 },
];

// ─── Helpers ──────────────────────────────────────────────────────
function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric'
    }).toUpperCase();
  } catch {
    return 'UNKNOWN DATE';
  }
}

function accessLabel(level: string) {
  if (level === 'archive')    return 'THE COMPLETE ARCHIVE // FULL ACCESS';
  if (level === 'quickstart') return 'FIELD GUIDE // QUICKSTART ACCESS';
  return 'CRASH COURSE // FREE ACCESS';
}

// ─── Blinking Cursor Component ────────────────────────────────────
function BlinkingCursor({ color = C_TEAL }: { color?: string }) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setVisible(v => !v), 530);
    return () => clearInterval(t);
  }, []);
  return (
    <span style={{
      display: 'inline-block',
      width: '0.55em',
      height: '1.1em',
      background: visible ? color : 'transparent',
      verticalAlign: 'text-bottom',
      marginLeft: '4px',
    }} />
  );
}

// ─── Loading Screen ───────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div style={{
      minHeight: '100vh',
      background: C_BG,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <BlinkingCursor color={C_TEAL} />
    </div>
  );
}

// ─── Error Screen ─────────────────────────────────────────────────
function ErrorScreen() {
  const [, navigate] = useLocation();
  return (
    <div style={{
      minHeight: '100vh',
      background: C_BG,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      textAlign: 'center',
    }}>
      <p style={{
        fontFamily: FONT_HEADING,
        fontSize: '48px',
        color: C_TEAL,
        margin: '0 0 16px',
        letterSpacing: '0.05em',
      }}>
        ACCESS DENIED.
      </p>
      <p style={{
        fontFamily: FONT_MONO,
        fontSize: '13px',
        color: C_MUTED,
        margin: '0 0 32px',
        lineHeight: 1.6,
      }}>
        Session expired. Request a new access link.
      </p>
      <button
        onClick={() => navigate('/portal/login')}
        style={{
          fontFamily: FONT_HEADING,
          fontSize: '16px',
          letterSpacing: '0.15em',
          background: C_TEAL,
          color: '#000',
          border: 'none',
          borderRadius: '2px',
          padding: '14px 28px',
          cursor: 'pointer',
        }}
      >
        GET ACCESS LINK →
      </button>
    </div>
  );
}

// ─── Intro Screen ─────────────────────────────────────────────────
function IntroScreen({ onComplete }: { onComplete: () => void }) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [showRule, setShowRule] = useState(false);
  const [showHeader, setShowHeader] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let delay = 400;

    INTRO_LINES.forEach((line, i) => {
      const charDelay = line.text.length * 28;
      timerRef.current = setTimeout(() => {
        setVisibleCount(i + 1);
      }, delay);
      delay += charDelay + (line.pause || 300);
    });

    // After all lines: show rule
    const ruleDelay = delay + 1500;
    timerRef.current = setTimeout(() => setShowRule(true), ruleDelay);

    // Show header
    timerRef.current = setTimeout(() => setShowHeader(true), ruleDelay + 600);

    // Complete → transition to pattern file
    timerRef.current = setTimeout(() => onComplete(), ruleDelay + 1800);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{
      minHeight: '100vh',
      background: C_BG,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'center',
      padding: '40px 24px',
      maxWidth: '560px',
      margin: '0 auto',
    }}>
      {INTRO_LINES.map((line, i) => (
        <TypeLine
          key={i}
          text={line.text}
          visible={visibleCount > i}
        />
      ))}

      {showRule && (
        <div style={{
          width: '100%',
          height: '1px',
          background: C_TEAL,
          opacity: 0.6,
          margin: '32px 0',
          animation: 'fadeIn 0.6s ease forwards',
        }} />
      )}

      {showHeader && (
        <p style={{
          fontFamily: FONT_HEADING,
          fontSize: 'clamp(36px, 8vw, 56px)',
          color: C_TEAL,
          margin: 0,
          letterSpacing: '0.04em',
          animation: 'fadeIn 0.7s ease forwards',
        }}>
          YOUR FILE IS OPEN.
        </p>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ─── Character-by-character typing line ───────────────────────────
function TypeLine({ text, visible }: { text: string; visible: boolean }) {
  const [chars, setChars] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!visible) return;
    if (text === '') { setChars(0); return; }

    let i = 0;
    const tick = () => {
      i++;
      setChars(i);
      if (i < text.length) {
        timerRef.current = setTimeout(tick, 26);
      }
    };
    timerRef.current = setTimeout(tick, 0);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [visible, text]);

  if (text === '') return <div style={{ height: '1.2em' }} />;
  if (!visible) return null;

  return (
    <p style={{
      fontFamily: FONT_BODY,
      fontSize: 'clamp(15px, 4vw, 18px)',
      color: C_TEXT,
      margin: '0 0 10px',
      lineHeight: 1.65,
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.4s ease',
    }}>
      {text.slice(0, chars)}
    </p>
  );
}

// ─── Pattern File Screen ──────────────────────────────────────────
interface UserData {
  email: string;
  primaryPattern: string | null;
  patternScores: Record<string, number> | null;
  accessLevel: string;
  createdAt?: string;
}

function PatternFileScreen({ userData, isReturn }: { userData: UserData; isReturn: boolean }) {
  const pattern = userData.primaryPattern ? patternDetails[userData.primaryPattern] : null;
  const accessLvl = userData.accessLevel || 'free';
  const isLocked = accessLvl === 'free';

  const identifiedDate = userData.createdAt
    ? formatDate(userData.createdAt)
    : formatDate(new Date().toISOString());

  return (
    <div style={{
      minHeight: '100vh',
      background: C_BG,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 20px 80px',
    }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>

        {/* ── Welcome header ─────────────────────── */}
        {isReturn ? (
          <div style={{ marginBottom: '32px' }}>
            <p style={{
              fontFamily: FONT_HEADING,
              fontSize: '32px',
              color: C_TEXT,
              margin: '0 0 4px',
              letterSpacing: '0.04em',
            }}>
              WELCOME BACK.
            </p>
            <p style={{
              fontFamily: FONT_MONO,
              fontSize: '11px',
              color: C_DIM,
              margin: 0,
              letterSpacing: '0.08em',
            }}>
              Your file is still open.
            </p>
          </div>
        ) : (
          <div style={{ marginBottom: '32px' }}>
            <p style={{
              fontFamily: FONT_MONO,
              fontSize: '10px',
              color: C_DIM,
              margin: '0 0 8px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}>
              File activated.
            </p>
          </div>
        )}

        {/* ── Subject label ──────────────────────── */}
        <p style={{
          fontFamily: FONT_MONO,
          fontSize: '10px',
          color: C_DIM,
          margin: '0 0 12px',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          SUBJECT FILE — ACTIVE <BlinkingCursor color={C_DIM} />
        </p>

        {/* ── Pattern name ───────────────────────── */}
        {pattern ? (
          <p style={{
            fontFamily: FONT_HEADING,
            fontSize: 'clamp(36px, 10vw, 48px)',
            color: C_TEXT,
            margin: '0 0 8px',
            letterSpacing: '0.02em',
            lineHeight: 1.05,
          }}>
            {pattern.name}
          </p>
        ) : (
          <p style={{
            fontFamily: FONT_HEADING,
            fontSize: '36px',
            color: C_DIM,
            margin: '0 0 8px',
          }}>
            PATTERN UNIDENTIFIED
          </p>
        )}

        {/* ── Identified date ────────────────────── */}
        <p style={{
          fontFamily: FONT_MONO,
          fontSize: '11px',
          color: C_DIM,
          margin: '0 0 20px',
          letterSpacing: '0.08em',
        }}>
          IDENTIFIED: {identifiedDate}
        </p>

        {/* ── Divider ────────────────────────────── */}
        <Divider />

        {/* ── Body Signature ─────────────────────── */}
        {pattern && (
          <>
            <Label>BODY SIGNATURE</Label>
            <p style={{
              fontFamily: FONT_BODY,
              fontSize: '14px',
              color: C_MUTED,
              margin: '0 0 24px',
              lineHeight: 1.7,
            }}>
              {pattern.bodySignature}
            </p>
          </>
        )}

        {/* ── Circuit Break ──────────────────────── */}
        {pattern && (
          <>
            <Label>CIRCUIT BREAK</Label>
            <p style={{
              fontFamily: FONT_BODY,
              fontSize: '14px',
              color: C_TEXT,
              fontStyle: 'italic',
              margin: '0 0 24px',
              lineHeight: 1.7,
            }}>
              {pattern.circuitBreak}
            </p>
          </>
        )}

        {/* ── Access Level ───────────────────────── */}
        <p style={{
          fontFamily: FONT_MONO,
          fontSize: '10px',
          color: C_DIM,
          margin: '0 0 4px',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
        }}>
          ACCESS LEVEL
        </p>
        <p style={{
          fontFamily: FONT_MONO,
          fontSize: '12px',
          color: C_TEXT,
          margin: '0 0 24px',
          letterSpacing: '0.08em',
        }}>
          {accessLabel(accessLvl)}
        </p>

        {/* ── Divider ────────────────────────────── */}
        <Divider />

        {/* ── CTA Button ─────────────────────────── */}
        <a
          href="/portal/crash-course"
          style={{
            display: 'block',
            width: '100%',
            background: C_TEAL,
            color: '#000',
            fontFamily: FONT_HEADING,
            fontSize: '16px',
            letterSpacing: '0.15em',
            textAlign: 'center',
            padding: '16px',
            borderRadius: '2px',
            textDecoration: 'none',
            marginBottom: '40px',
          }}
        >
          BEGIN YOUR PROTOCOL →
        </a>

        {/* ── Pocket Archivist teaser ────────────── */}
        <div style={{
          borderTop: `1px solid #1a1a1a`,
          paddingTop: '28px',
        }}>
          <p style={{
            fontFamily: FONT_MONO,
            fontSize: '10px',
            color: C_DIM,
            margin: '0 0 10px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <Lock size={12} color={C_DARK} />
            POCKET ARCHIVIST
          </p>

          {isLocked ? (
            <>
              <p style={{
                fontFamily: FONT_BODY,
                fontSize: '13px',
                color: C_MUTED,
                margin: '0 0 16px',
                lineHeight: 1.6,
              }}>
                Real-time pattern interruption. Available with Field Guide.
              </p>
              <a
                href="/checkout?product=quickstart"
                style={{
                  display: 'inline-block',
                  fontFamily: FONT_HEADING,
                  fontSize: '14px',
                  letterSpacing: '0.12em',
                  color: C_TEAL,
                  border: `1px solid ${C_TEAL}`,
                  borderRadius: '2px',
                  padding: '10px 20px',
                  textDecoration: 'none',
                }}
              >
                UNLOCK FIELD GUIDE — $47 →
              </a>
            </>
          ) : (
            <p style={{
              fontFamily: FONT_BODY,
              fontSize: '13px',
              color: C_MUTED,
              lineHeight: 1.6,
              margin: 0,
            }}>
              Your Pocket Archivist is active. Access it in the portal.
            </p>
          )}
        </div>

      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ─── Small shared components ──────────────────────────────────────
function Divider() {
  return (
    <div style={{
      width: '100%',
      height: '1px',
      background: C_TEAL,
      opacity: 0.3,
      margin: '0 0 20px',
    }} />
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: FONT_MONO,
      fontSize: '10px',
      color: C_TEAL,
      margin: '0 0 6px',
      letterSpacing: '0.15em',
      textTransform: 'uppercase',
    }}>
      {children}
    </p>
  );
}

// ─── Main Component ───────────────────────────────────────────────
const LS_FIRST_VISIT_KEY = "tam_portal_first_visit";

export default function NewPortal() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showIntro, setShowIntro] = useState(false);
  const [showPattern, setShowPattern] = useState(false);
  const [isReturn, setIsReturn] = useState(false);

  useEffect(() => {
    const isFirstVisit = !localStorage.getItem(LS_FIRST_VISIT_KEY);

    const savedToken = localStorage.getItem('quiz_auth_token');
    fetch('/api/portal/user-data', {
      credentials: 'include',
      headers: savedToken ? { Authorization: `Bearer ${savedToken}` } : {},
    })
      .then(res => {
        if (!res.ok) throw new Error('unauthorized');
        return res.json();
      })
      .then((data: UserData) => {
        setUserData(data);
        setLoading(false);

        if (isFirstVisit) {
          localStorage.setItem(LS_FIRST_VISIT_KEY, '1');
          setShowIntro(true);
        } else {
          setIsReturn(true);
          setShowPattern(true);
        }
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
    setShowPattern(true);
  };

  if (loading) return <LoadingScreen />;
  if (error)   return <ErrorScreen />;
  if (showIntro && userData) return <IntroScreen onComplete={handleIntroComplete} />;
  if (showPattern && userData) return <PatternFileScreen userData={userData} isReturn={isReturn} />;

  return <LoadingScreen />;
}
