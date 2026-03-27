import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import {
  PatternKey,
  patternDisplayNames,
  QuizResult as QuizResultType,
  feelSeenCopy,
  breadcrumbData,
  circuitBreakData,
} from '@/lib/quizData';

// ─────────────────────────────────────────────
// MAIN RESULTS PAGE
// ─────────────────────────────────────────────
export default function QuizResult() {
  const [location, setLocation] = useLocation();

  // ── Parse result data
  const searchParams = new URLSearchParams(window.location.search);
  const resultData = searchParams.get('data');
  let result: QuizResultType | null = null;
  try {
    if (resultData) result = JSON.parse(decodeURIComponent(resultData));
  } catch {}

  const primaryPattern = (result?.primaryPattern || '') as PatternKey;
  const scores: Record<PatternKey, number> = result?.scores || {};

  // Build sorted pattern list for display
  const sortedPatterns = (Object.entries(scores) as [PatternKey, number][])
    .sort((a, b) => b[1] - a[1])
    .filter(([_, score]) => score > 0)
    .map(([p]) => p);

  const secondaryPatterns = result?.secondaryPatterns || sortedPatterns.slice(1, 3);
  const secondaryPattern1 = secondaryPatterns[0] || null;
  const secondaryPattern2 = secondaryPatterns[1] || null;

  const primaryScore = scores[primaryPattern] || 0;

  // ── Reveal sequence state
  // 0 = bars animating
  // 1 = "PATTERN IDENTIFIED" label appears
  // 2 = name crashes in
  // 3 = secondary patterns
  // 4 = pattern selection question
  const [revealStep, setRevealStep] = useState(0);
  const [focusPattern, setFocusPattern] = useState<PatternKey | null>(null);

  // Email gate state
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Name crash-in state
  const [nameCrashed, setNameCrashed] = useState(false);

  // Bar animation state
  const [barsReady, setBarsReady] = useState(false);

  // Content visibility
  const [breadcrumbsVisible, setBreadcrumbsVisible] = useState(false);
  const [circuitVisible, setCircuitVisible] = useState(false);
  const [gateVisible, setGateVisible] = useState(false);

  // ── Bar fill trigger
  useEffect(() => {
    const t = setTimeout(() => {
      setBarsReady(true);
      setTimeout(() => setRevealStep(1), 1200);
    }, 200);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── After label: name crashes in
  useEffect(() => {
    if (revealStep === 1) {
      const t = setTimeout(() => {
        setRevealStep(2);
        setTimeout(() => setNameCrashed(true), 50);
      }, 400);
      return () => clearTimeout(t);
    }
    if (revealStep === 2) {
      const t = setTimeout(() => setRevealStep(3), 1200);
      return () => clearTimeout(t);
    }
    if (revealStep === 3) {
      const t = setTimeout(() => setRevealStep(4), 1000);
      return () => clearTimeout(t);
    }
  }, [revealStep]);

  // ── Show content sections when focus pattern selected
  useEffect(() => {
    if (!focusPattern) return;
    const t1 = setTimeout(() => setBreadcrumbsVisible(true), 300);
    const t2 = setTimeout(() => setCircuitVisible(true), 700);
    const t3 = setTimeout(() => setGateVisible(true), 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [focusPattern]);

  // ── Scroll to content when focus pattern selected
  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (focusPattern && contentRef.current) {
      setTimeout(() => {
        contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    }
  }, [focusPattern]);

  // ── Email submit
  const handleSubmit = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail.includes('@')) return;
    const finalPattern = focusPattern || primaryPattern || 'disappearing';
    setSubmitting(true);
    setError('');
    try {
      const response = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: trimmedEmail,
          primaryPattern: finalPattern,
          secondaryPatterns: result?.secondaryPatterns || [],
          patternScores: scores,
        }),
      });
      if (!response.ok) {
        const raw = await response.text(); let data = null; try { data = raw ? JSON.parse(raw) : null; } catch {}
        throw new Error(data?.error || 'Failed to save results');
      }
      try {
        const data = await response.json();
        if (data.token) localStorage.setItem('quiz_auth_token', data.token);
      } catch {}
      localStorage.setItem('quizResultPattern', finalPattern);
      localStorage.setItem('userEmail', trimmedEmail);
      if (scores) localStorage.setItem('quizScores', JSON.stringify(scores));
      window.location.assign('/portal');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setSubmitting(false);
    }
  };

  // ── No pattern guard
  if (!primaryPattern || !patternDisplayNames[primaryPattern]) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#000000' }}>
        <div className="text-center">
          <p style={{ color: '#64748B', marginBottom: '16px' }}>No pattern data found.</p>
          <button
            onClick={() => setLocation('/quiz')}
            style={{ color: '#00FFD1', cursor: 'pointer', background: 'none', border: 'none', fontFamily: "'JetBrains Mono', monospace" }}
            data-testid="link-retake-quiz"
          >
            Take the Quiz
          </button>
        </div>
      </div>
    );
  }

  const activePattern = focusPattern || primaryPattern;
  const crumbs = breadcrumbData[activePattern];
  const circuitBreak = circuitBreakData[activePattern];
  const feelSeen = feelSeenCopy[activePattern];

  // Proportional bar widths — primary is always 100%, secondaries relative to it
  const maxScore = primaryScore || 1;
  const secondary1Score = secondaryPattern1 ? (scores[secondaryPattern1] || 0) : 0;
  const secondary2Score = secondaryPattern2 ? (scores[secondaryPattern2] || 0) : 0;
  const secondary1BarPct = Math.round((secondary1Score / maxScore) * 100);
  const secondary2BarPct = Math.round((secondary2Score / maxScore) * 100);

  // Three patterns to offer as focus choices
  const focusChoices: PatternKey[] = [
    primaryPattern,
    ...(secondaryPattern1 ? [secondaryPattern1] : []),
    ...(secondaryPattern2 ? [secondaryPattern2] : []),
  ].slice(0, 3);

  return (
    <div style={{ background: '#000000', minHeight: '100vh' }}>

      {/* ── SECTION 1: Reveal */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
      }}>
        <div style={{ maxWidth: '560px', width: '100%' }}>

          {/* "PATTERN IDENTIFIED" label */}
          <p
            data-testid="text-pattern-label"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.7rem',
              color: '#00d4aa',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              marginBottom: '20px',
              opacity: revealStep >= 1 ? 1 : 0,
              transition: 'opacity 400ms ease',
              textAlign: 'center',
            }}
          >
            PATTERN IDENTIFIED
          </p>

          {/* ── PRIMARY SIGNAL card */}
          <div style={{
            background: '#0a0a0a',
            border: '1px solid rgba(0, 212, 170, 0.2)',
            borderRadius: '4px',
            padding: '28px',
            marginBottom: '10px',
          }}>
            <p style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.6rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#00d4aa',
              marginBottom: '14px',
            }}>
              PRIMARY SIGNAL
            </p>

            {/* Pattern name — crashes in */}
            <h1
              data-testid="text-pattern-name"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 'clamp(2.2rem, 7vw, 4.5rem)',
                color: 'white',
                lineHeight: 1.0,
                marginBottom: '20px',
                opacity: revealStep >= 2 ? 1 : 0,
                transform: nameCrashed ? 'translateY(0)' : 'translateY(-30px)',
                transition: 'opacity 300ms ease, transform 500ms cubic-bezier(0.16,1,0.3,1)',
              }}
            >
              {patternDisplayNames[primaryPattern]}
            </h1>

            {/* Bar track */}
            <div style={{
              height: '12px',
              background: 'rgba(236, 72, 153, 0.1)',
              borderRadius: '3px',
              overflow: 'hidden',
              marginBottom: '10px',
            }}>
              <div style={{
                height: '100%',
                width: barsReady ? '100%' : '0%',
                background: '#EC4899',
                borderRadius: '3px',
                transition: 'width 1200ms cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: '0 0 8px rgba(236, 72, 153, 0.4)',
              }} />
            </div>

            {/* Percentage — supporting data */}
            <p style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.6rem',
              color: 'rgba(0, 212, 170, 0.45)',
              letterSpacing: '0.15em',
            }}>
              {primaryScore}%
            </p>
          </div>

          {/* ── SECONDARY pattern cards */}
          {[
            secondaryPattern1 ? { pattern: secondaryPattern1, barPct: secondary1BarPct, score: secondary1Score } : null,
            secondaryPattern2 ? { pattern: secondaryPattern2, barPct: secondary2BarPct, score: secondary2Score } : null,
          ].filter(Boolean).map((item, idx) => (
            <div
              key={item!.pattern}
              style={{
                background: '#0a0a0a',
                border: '1px solid #161616',
                borderRadius: '4px',
                padding: '20px 28px',
                marginBottom: '10px',
                opacity: revealStep >= 3 ? 1 : 0,
                transition: `opacity 500ms ease ${idx * 150}ms`,
              }}
            >
              <p style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.6rem',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: '#3d4f5c',
                marginBottom: '10px',
              }}>
                ALSO ACTIVE
              </p>
              <h3 style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 'clamp(1.4rem, 4vw, 2rem)',
                color: '#7A8FA6',
                lineHeight: 1.0,
                marginBottom: '14px',
              }}>
                {patternDisplayNames[item!.pattern]}
              </h3>

              {/* Bar track */}
              <div style={{
                height: '12px',
                background: 'rgba(236, 72, 153, 0.08)',
                borderRadius: '3px',
                overflow: 'hidden',
                marginBottom: '8px',
              }}>
                <div style={{
                  height: '100%',
                  width: revealStep >= 3 ? `${item!.barPct}%` : '0%',
                  background: 'rgba(236, 72, 153, 0.45)',
                  borderRadius: '3px',
                  transition: `width 1000ms cubic-bezier(0.16, 1, 0.3, 1) ${200 + idx * 150}ms`,
                }} />
              </div>

              {/* Percentage — supporting data */}
              <p style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.6rem',
                color: '#3d4f5c',
                letterSpacing: '0.1em',
              }}>
                {item!.score}%
              </p>
            </div>
          ))}

          {/* Pattern selection question */}
          {revealStep >= 4 && (
            <div style={{
              opacity: revealStep >= 4 ? 1 : 0,
              transition: 'opacity 600ms ease',
              textAlign: 'center',
              paddingTop: '8px',
            }}>
              <p style={{
                fontFamily: "'EB Garamond', Georgia, serif",
                fontStyle: 'italic',
                fontSize: '1.1rem',
                color: '#94A3B8',
                marginBottom: '20px',
              }}>
                Which pattern do you want to understand first?
              </p>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '12px',
                flexWrap: 'wrap',
              }}>
                {focusChoices.map(p => (
                  <button
                    key={p}
                    onClick={() => setFocusPattern(p)}
                    style={{
                      border: focusPattern === p
                        ? '1px solid #00FFD1'
                        : '1px solid rgba(0,255,209,0.3)',
                      background: focusPattern === p
                        ? 'rgba(0,255,209,0.1)'
                        : 'transparent',
                      color: focusPattern === p ? '#00FFD1' : 'white',
                      padding: '14px 28px',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.8rem',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      transition: 'all 200ms ease',
                    }}
                    onMouseEnter={e => {
                      if (focusPattern !== p) {
                        e.currentTarget.style.background = 'rgba(0,255,209,0.1)';
                        e.currentTarget.style.borderColor = '#00FFD1';
                        e.currentTarget.style.color = '#00FFD1';
                      }
                    }}
                    onMouseLeave={e => {
                      if (focusPattern !== p) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.borderColor = 'rgba(0,255,209,0.3)';
                        e.currentTarget.style.color = 'white';
                      }
                    }}
                  >
                    {patternDisplayNames[p]}
                  </button>
                ))}
              </div>

              {/* Share */}
              <div style={{ marginTop: '32px' }}>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I just discovered my ${patternDisplayNames[primaryPattern]} pattern with The Archivist Method. It named something I've never been able to explain. thearchivistmethod.com`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="button-share-pattern"
                  style={{
                    display: 'inline-block',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    border: '1px solid rgba(0,255,209,0.4)',
                    color: '#00FFD1',
                    padding: '10px 24px',
                    cursor: 'pointer',
                    transition: 'all 200ms ease',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,255,209,0.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                  Share Your Pattern
                </a>
                <p style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.65rem',
                  color: '#475569',
                  marginTop: '8px',
                }}>
                  Share anonymously — no name, just your pattern.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── SECTIONS BELOW: appear after focusPattern selected */}
      <div ref={contentRef}>

        {/* Feel-seen copy */}
        {focusPattern && feelSeen && (
          <section style={{ padding: '64px 24px', maxWidth: '600px', margin: '0 auto' }}>
            {/* Spirit layer — comfort before data */}
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.75rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#00FFD1',
              marginBottom: '24px',
              opacity: 0.7,
            }}>
              Before we go further
            </p>
            <p style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: '1.35rem',
              fontStyle: 'italic',
              fontWeight: 300,
              color: '#ffffff',
              lineHeight: 1.7,
              marginBottom: '32px',
            }}>
              What you're about to read is not a verdict.
              It is not a flaw. It is not who you are.
            </p>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '1.05rem',
              color: '#CBD5E1',
              lineHeight: 1.75,
              marginBottom: '20px',
            }}>
              It is a pattern. And patterns can be interrupted.
            </p>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '1.05rem',
              color: '#CBD5E1',
              lineHeight: 1.75,
              marginBottom: '40px',
            }}>
              You came here because something in you already knew that.
              That part of you was right.
            </p>
            {/* Divider */}
            <div style={{
              width: '40px',
              height: '1px',
              background: '#00FFD1',
              marginBottom: '40px',
              opacity: 0.4,
            }} />
            {feelSeen.map((para, i) => (
              <p key={i} style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '1.05rem',
                color: '#CBD5E1',
                lineHeight: 1.75,
                marginBottom: '20px',
              }}>
                {para}
              </p>
            ))}
            {/* Spirit fingerprint */}
            <p style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: '1.15rem',
              fontStyle: 'italic',
              fontWeight: 300,
              color: '#94A3B8',
              lineHeight: 1.7,
              marginTop: '32px',
            }}>
              This pattern has been protecting you in the only way it knew how.
              It was never the enemy. It was just waiting to be understood.
            </p>
          </section>
        )}

        {/* ── SECTION 2: Breadcrumb cards */}
        {focusPattern && crumbs && (
          <section
            className="px-4 py-16 md:py-24"
            style={{
              opacity: breadcrumbsVisible ? 1 : 0,
              transform: breadcrumbsVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 0.6s ease, transform 0.6s ease',
            }}
          >
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div
                  data-testid="card-breadcrumb-triggers"
                  style={{
                    background: '#0a0a0a',
                    border: '1px solid #1a1a1a',
                    borderRadius: '16px',
                    padding: '32px',
                  }}
                >
                  <p style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.65rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em',
                    color: '#00FFD1',
                    marginBottom: '16px',
                  }}>
                    WHAT TRIGGERS IT
                  </p>
                  <p style={{
                    fontFamily: "'Inter', sans-serif",
                    color: '#CBD5E1',
                    fontSize: '0.95rem',
                    lineHeight: 1.7,
                  }}>
                    {crumbs.triggers}
                  </p>
                </div>

                <div
                  data-testid="card-breadcrumb-costs"
                  style={{
                    background: '#0a0a0a',
                    border: '1px solid #1a1a1a',
                    borderRadius: '16px',
                    padding: '32px',
                  }}
                >
                  <p style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.65rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em',
                    color: '#EC4899',
                    marginBottom: '16px',
                  }}>
                    WHAT IT COSTS YOU
                  </p>
                  <p style={{
                    fontFamily: "'Inter', sans-serif",
                    color: '#CBD5E1',
                    fontSize: '0.95rem',
                    lineHeight: 1.7,
                  }}>
                    {crumbs.costs}
                  </p>
                </div>

                <div
                  data-testid="card-breadcrumb-willpower"
                  style={{
                    background: '#0a0a0a',
                    border: '1px solid #1a1a1a',
                    borderRadius: '16px',
                    padding: '32px',
                  }}
                >
                  <p style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.65rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em',
                    color: 'white',
                    marginBottom: '16px',
                  }}>
                    WHY WILLPOWER FAILS
                  </p>
                  <p style={{
                    fontFamily: "'Inter', sans-serif",
                    color: '#CBD5E1',
                    fontSize: '0.95rem',
                    lineHeight: 1.7,
                  }}>
                    {crumbs.whyWillpowerFails}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── SECTION 3: Circuit Break */}
        {focusPattern && circuitBreak && (
          <section
            className="px-4 py-16 md:py-24"
            style={{
              opacity: circuitVisible ? 1 : 0,
              transform: circuitVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 0.6s ease, transform 0.6s ease',
            }}
          >
            <div className="max-w-xl mx-auto text-center">
              <p
                data-testid="text-circuit-break-label"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.65rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  color: '#00FFD1',
                  marginBottom: '24px',
                }}
              >
                COMPLIMENTARY CIRCUIT BREAK
              </p>
              <h2
                data-testid="text-circuit-break-headline"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  textTransform: 'uppercase',
                  color: 'white',
                  fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
                  lineHeight: 1.2,
                  marginBottom: '28px',
                }}
              >
                Here's one thing you can do the moment you feel it.
              </h2>
              <div
                data-testid="card-circuit-break"
                style={{
                  background: '#0a0a0a',
                  border: '1px solid #1a1a1a',
                  borderRadius: '16px',
                  padding: '32px',
                  textAlign: 'left',
                  marginBottom: '28px',
                }}
              >
                <p
                  data-testid="text-circuit-break-technique"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    color: '#CBD5E1',
                    fontSize: '1.05rem',
                    lineHeight: 1.75,
                  }}
                >
                  {circuitBreak}
                </p>
              </div>
              <p
                data-testid="text-circuit-break-teaser"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontStyle: 'italic',
                  fontSize: '0.95rem',
                  color: '#00FFD1',
                  lineHeight: 1.6,
                  maxWidth: '480px',
                  margin: '0 auto',
                }}
              >
                This is one of 47 protocols in your pattern's full interrupt sequence.
              </p>
            </div>
          </section>
        )}

        {/* ── SECTION 4: Email gate */}
        {focusPattern && (
          <section
            className="px-4 py-16 md:py-24"
            style={{
              opacity: gateVisible ? 1 : 0,
              transform: gateVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 0.6s ease, transform 0.6s ease',
            }}
          >
            <div className="max-w-lg mx-auto text-center">
              <h2
                data-testid="text-gate-headline"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  textTransform: 'uppercase',
                  color: 'white',
                  fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                  lineHeight: 1.2,
                  marginBottom: '16px',
                }}
              >
                The pattern has a name. The exit has a door.
              </h2>
              {/* Spirit fingerprint */}
              <p style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: '1.1rem',
                fontStyle: 'italic',
                fontWeight: 300,
                color: '#94A3B8',
                lineHeight: 1.7,
                marginBottom: '12px',
              }}>
                You were never as lost as you felt.
              </p>
              <p style={{
                fontFamily: "'Inter', sans-serif",
                color: '#64748B',
                fontSize: '1rem',
                lineHeight: 1.6,
                marginBottom: '32px',
                maxWidth: '480px',
                margin: '0 auto 32px',
              }}>
                Your free Crash Course walks you through the first step of the FEIR method &mdash; built specifically for your pattern.
              </p>

              <div className="space-y-3">
                <input
                  type="text"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  data-testid="input-email"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: '#0a0a0a',
                    border: '1px solid #1a1a1a',
                    borderRadius: '2px',
                    color: 'white',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 200ms ease',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#00FFD1'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#1a1a1a'; }}
                />
                <div style={{ marginTop: '16px', marginBottom: '16px', textAlign: 'left' }}>
                  <p style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.65rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    color: '#475569',
                    marginBottom: '10px',
                  }}>
                    What you'll receive:
                  </p>
                  {["Your pattern's trigger sequence", "Your body signal map", "Your first interrupt protocol"].map((item, i) => (
                    <div key={i} className="flex items-center gap-2" style={{ marginBottom: '6px' }}>
                      <span style={{ color: '#00FFD1', fontSize: '13px', fontWeight: 700 }}>&#10003;</span>
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', color: '#94A3B8' }}>{item}</span>
                    </div>
                  ))}
                </div>
                <div className="cta-glow-wrap cta-glow-full" style={{ display: 'block', width: '100%' }}>
                  <div className="cta-glow-border" />
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    data-testid="button-submit-email"
                    className="cta-glow-inner results-cta-btn w-full"
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.85rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'white',
                      fontWeight: 700,
                      padding: '14px 24px',
                      cursor: submitting ? 'not-allowed' : 'pointer',
                      opacity: submitting ? 0.5 : 1,
                      width: '100%',
                      transition: 'all 200ms ease',
                    }}
                  >
                    {submitting ? 'Opening Archive...' : 'SEND ME THE FIRST STEP'}
                  </button>
                </div>
                {error && (
                  <p style={{ color: '#f87171', fontSize: '0.875rem', textAlign: 'center' }} role="alert">
                    {error}
                  </p>
                )}
              </div>

              <p
                data-testid="text-no-spam"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.65rem',
                  color: '#475569',
                  marginTop: '20px',
                }}
              >
                No sales sequence. Just the work.
              </p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
