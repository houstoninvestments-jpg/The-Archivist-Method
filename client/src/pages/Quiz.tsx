import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'wouter';
import {
  quizQuestions,
  calculatePatternScores,
  determineQuizResult,
  type PatternKey,
} from '@/lib/quizData';

// ── Pattern key order (index = dot position in constellation)
const PATTERN_KEYS: PatternKey[] = [
  'disappearing', 'apologyLoop', 'testing', 'attractionToHarm',
  'complimentDeflection', 'drainingBond', 'successSabotage', 'perfectionism', 'rage',
];

// ── Constellation dot positions (9 dots in a circle, SVG 100×100 viewport)
const DOT_COUNT = 9;
const DOT_POSITIONS = Array.from({ length: DOT_COUNT }, (_, i) => {
  const angle = ((i * 360) / DOT_COUNT - 90) * (Math.PI / 180);
  return { x: 50 + 38 * Math.cos(angle), y: 50 + 38 * Math.sin(angle) };
});

// Adjacent + cross connections for the constellation lines
const LINES: [number, number][] = [
  [0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,0], // ring
  [0,4],[1,5],[2,6],[3,7],[4,8], // cross
];

// ─────────────────────────────────────────────
// OPENING RITUAL
// ─────────────────────────────────────────────
function OpeningRitual({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 800),
      setTimeout(() => setStep(2), 1600),
      setTimeout(() => setStep(3), 2200),
      setTimeout(() => { setStep(4); onComplete(); }, 3500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <>
      <style>{`
        @keyframes pulseRing {
          0% { transform: translate(-50%,-50%) scale(0.3); opacity: 0.7; }
          100% { transform: translate(-50%,-50%) scale(2.2); opacity: 0; }
        }
      `}</style>
      <div
        onClick={onComplete}
        style={{
          position: 'fixed', inset: 0,
          background: '#000000',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', zIndex: 100,
        }}
      >
        {/* Pulse rings */}
        <div style={{ position: 'relative', width: '120px', height: '120px', marginBottom: '48px' }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              position: 'absolute',
              top: '50%', left: '50%',
              width: '80px', height: '80px',
              border: '1px solid #00FFD1',
              borderRadius: '50%',
              animation: 'pulseRing 2s ease-out infinite',
              animationDelay: `${i * 0.6}s`,
            }} />
          ))}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            width: '8px', height: '8px',
            background: '#00FFD1', borderRadius: '50%',
          }} />
        </div>

        {/* Text sequence */}
        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.75rem',
          color: '#00FFD1',
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
          marginBottom: '24px',
          opacity: step >= 1 ? 1 : 0,
          transition: 'opacity 600ms ease',
        }}>
          PATTERN ARCHAEOLOGY INITIATED
        </p>

        <p style={{
          fontFamily: "'EB Garamond', Georgia, serif",
          fontStyle: 'italic',
          fontSize: '1.3rem',
          color: '#FAFAFA',
          marginBottom: '12px',
          opacity: step >= 2 ? 1 : 0,
          transform: step >= 2 ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 600ms ease, transform 600ms ease',
        }}>
          Your nervous system already knows the answers.
        </p>

        <p style={{
          fontFamily: "'EB Garamond', Georgia, serif",
          fontStyle: 'italic',
          fontSize: '1.3rem',
          color: '#EC4899',
          opacity: step >= 3 ? 1 : 0,
          transform: step >= 3 ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 600ms ease, transform 600ms ease',
        }}>
          Just tell the truth.
        </p>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────
// CALCULATING / CONSTELLATION SCREEN
// ─────────────────────────────────────────────
function ConstellationScreen({
  primaryPattern,
  secondaryPatterns,
  onDone,
}: {
  primaryPattern: PatternKey | null;
  secondaryPatterns: PatternKey[];
  onDone: () => void;
}) {
  const [calcPhase, setCalcPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setCalcPhase(1), 800),   // lines draw
      setTimeout(() => setCalcPhase(2), 1500),  // dots dim
      setTimeout(() => setCalcPhase(3), 2200),  // primary blazes
      setTimeout(() => setCalcPhase(4), 2800),  // "PATTERN IDENTIFIED"
      setTimeout(() => setCalcPhase(5), 3500),  // "ROUTING TO YOUR RESULTS"
      setTimeout(() => onDone(), 4000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  const primaryIdx = primaryPattern ? PATTERN_KEYS.indexOf(primaryPattern) : -1;
  const secondaryIdxs = secondaryPatterns.map(p => PATTERN_KEYS.indexOf(p));

  const getDotOpacity = (i: number) => {
    if (calcPhase < 2) return 0.3;
    if (calcPhase < 3) {
      // Dimming phase
      if (i === primaryIdx) return 0.3;
      return 0.08;
    }
    // Phase 3+: primary blazes, secondary glow, rest dim
    if (i === primaryIdx) return 1;
    if (secondaryIdxs.includes(i)) return 0.6;
    return 0.1;
  };

  const getDotSize = (i: number) => {
    if (calcPhase >= 3 && i === primaryIdx) return 16;
    return 8;
  };

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#000000',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      zIndex: 100,
    }}>
      {/* Constellation SVG */}
      <div style={{ width: '200px', height: '200px', marginBottom: '48px' }}>
        <svg viewBox="0 0 100 100" width="200" height="200">
          {/* Lines */}
          {calcPhase >= 1 && LINES.map(([a, b], i) => (
            <line
              key={i}
              x1={DOT_POSITIONS[a].x} y1={DOT_POSITIONS[a].y}
              x2={DOT_POSITIONS[b].x} y2={DOT_POSITIONS[b].y}
              stroke="rgba(0,255,209,0.2)"
              strokeWidth="0.5"
              style={{
                opacity: calcPhase >= 1 ? 1 : 0,
                transition: `opacity 400ms ease ${i * 30}ms`,
              }}
            />
          ))}
          {/* Dots */}
          {DOT_POSITIONS.map((pos, i) => {
            const size = getDotSize(i);
            const opacity = getDotOpacity(i);
            return (
              <circle
                key={i}
                cx={pos.x}
                cy={pos.y}
                r={size / 2}
                fill={i === primaryIdx && calcPhase >= 3 ? '#00FFD1' : 'rgba(0,255,209,0.6)'}
                style={{
                  opacity,
                  transition: 'opacity 600ms ease, r 600ms ease',
                  filter: i === primaryIdx && calcPhase >= 3 ? 'drop-shadow(0 0 6px #00FFD1)' : 'none',
                }}
              />
            );
          })}
        </svg>
      </div>

      {/* Text */}
      <div style={{ textAlign: 'center' }}>
        <p style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '3rem',
          color: 'white',
          letterSpacing: '0.05em',
          marginBottom: '16px',
          opacity: calcPhase >= 4 ? 1 : 0,
          transform: calcPhase >= 4 ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 400ms ease, transform 400ms ease',
        }}>
          PATTERN IDENTIFIED
        </p>
        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.7rem',
          color: '#00FFD1',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          opacity: calcPhase >= 5 ? 1 : 0,
          transition: 'opacity 400ms ease',
        }}>
          ROUTING TO YOUR RESULTS
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN QUIZ COMPONENT
// ─────────────────────────────────────────────
export default function Quiz() {
  const [screen, setScreen] = useState<'opening' | 'quiz' | 'calculating'>('opening');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  const [, setLocation] = useLocation();

  // Typing effect
  const [typedText, setTypedText] = useState('');
  const [typingComplete, setTypingComplete] = useState(false);
  const [visibleAnswers, setVisibleAnswers] = useState(0);

  // Recognition line
  const [recognition, setRecognition] = useState<{ optionId: string; text: string; visible: boolean } | null>(null);
  const recognitionTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Quiz result (stored when transitioning to calculating)
  const [quizResult, setQuizResult] = useState<ReturnType<typeof determineQuizResult> | null>(null);

  // Slide state for question transitions
  const [slideVisible, setSlideVisible] = useState(false);

  const question = quizQuestions[currentQuestion];
  const isQ20 = question?.id === 20;
  const currentSelections = answers[question?.id] || [];
  const maxSelections = isQ20 ? 1 : 3;
  const isAtMax = currentSelections.length >= maxSelections;
  const hasSelection = currentSelections.length > 0;
  const meterProgress = currentQuestion / 19;

  // ── Start question slide-in + typing on question change
  useEffect(() => {
    if (screen !== 'quiz') return;
    setSlideVisible(false);
    setTypedText('');
    setTypingComplete(false);
    setVisibleAnswers(0);
    setRecognition(null);

    const slideTimer = setTimeout(() => setSlideVisible(true), 50);
    return () => clearTimeout(slideTimer);
  }, [currentQuestion, screen]);

  // ── Typing effect
  useEffect(() => {
    if (screen !== 'quiz' || !slideVisible) return;
    const text = question.title;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTypedText(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setTypingComplete(true);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [currentQuestion, screen, slideVisible, question]);

  // ── Stagger answer reveal after typing
  useEffect(() => {
    if (!typingComplete) return;
    const delay = isQ20 ? 400 : 100;
    const timers: ReturnType<typeof setTimeout>[] = [];
    question.options.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleAnswers(i + 1), (i + 1) * delay));
    });
    return () => timers.forEach(clearTimeout);
  }, [typingComplete, isQ20, currentQuestion, question]);

  // ── Recognition line trigger
  const triggerRecognition = useCallback((optionId: string, text: string) => {
    recognitionTimers.current.forEach(clearTimeout);
    setRecognition({ optionId, text, visible: false });
    const t1 = setTimeout(() => setRecognition(r => r ? { ...r, visible: true } : null), 16);
    const t2 = setTimeout(() => setRecognition(r => r ? { ...r, visible: false } : null), 1816);
    const t3 = setTimeout(() => setRecognition(null), 2116);
    recognitionTimers.current = [t1, t2, t3];
  }, []);

  useEffect(() => () => recognitionTimers.current.forEach(clearTimeout), []);

  // ── Handle answer selection
  const handleSelect = useCallback((optionId: string) => {
    const qId = question.id;
    const current = answers[qId] || [];

    if (current.includes(optionId)) {
      // Deselect
      setAnswers(prev => ({ ...prev, [qId]: current.filter(id => id !== optionId) }));
      return;
    }

    if (isAtMax) return;

    const option = question.options.find(o => o.id === optionId);
    if (!option) return;

    const newSelections = [...current, optionId];
    setAnswers(prev => ({ ...prev, [qId]: newSelections }));
    triggerRecognition(optionId, option.recognition);
  }, [question, answers, isAtMax, triggerRecognition]);

  // ── Navigate to next question or calculating screen
  const goToNext = useCallback(() => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      const rawScores = calculatePatternScores(answers);
      const result = determineQuizResult(rawScores);
      setQuizResult(result);
      setScreen('calculating');
    }
  }, [currentQuestion, answers]);

  // ── Keyboard: number keys to select, Enter to advance
  useEffect(() => {
    if (screen !== 'quiz') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const num = parseInt(e.key);
      if (num >= 1 && num <= question.options.length) {
        handleSelect(question.options[num - 1].id);
      }
      if (e.key === 'Enter' && hasSelection) goToNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [screen, question, handleSelect, goToNext, hasSelection]);

  // ── Constellation done → navigate to results
  const handleCalculatingDone = useCallback(() => {
    if (!quizResult) return;
    if (quizResult.primaryPattern) {
      localStorage.setItem('quizResultPattern', quizResult.primaryPattern);
    }
    localStorage.setItem('quizScores', JSON.stringify(quizResult.scores));
    const resultData = encodeURIComponent(JSON.stringify(quizResult));
    setLocation(`/results?data=${resultData}`);
  }, [quizResult, setLocation]);

  // ─────────────────
  // SCREENS
  // ─────────────────
  if (screen === 'opening') {
    return <OpeningRitual onComplete={() => setScreen('quiz')} />;
  }

  if (screen === 'calculating') {
    return (
      <ConstellationScreen
        primaryPattern={quizResult?.primaryPattern || null}
        secondaryPatterns={quizResult?.secondaryPatterns || []}
        onDone={handleCalculatingDone}
      />
    );
  }

  // ── QUIZ SCREEN
  const progressPct = (currentQuestion / quizQuestions.length) * 100;
  const progressAfterPct = ((currentQuestion + 1) / quizQuestions.length) * 100;

  return (
    <>
      <style>{`
        @keyframes pulseRing {
          0% { transform: translate(-50%,-50%) scale(0.3); opacity: 0.7; }
          100% { transform: translate(-50%,-50%) scale(2.2); opacity: 0; }
        }
        @keyframes q20Fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      <div
        className="quiz-screen min-h-screen"
        style={{ background: '#000000', position: 'relative' }}
      >
        {/* Q20 dark overlay */}
        {isQ20 && (
          <div style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.4)',
            animation: 'q20Fade 800ms ease forwards',
            zIndex: 1, pointerEvents: 'none',
          }} />
        )}

        {/* Progress bar */}
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          height: '3px', background: 'rgba(255,255,255,0.06)',
        }}>
          <div className="quiz-progress-bar" style={{
            height: '100%',
            width: `${hasSelection ? progressAfterPct : progressPct}%`,
          }} />
        </div>

        {/* Depth meter */}
        <div style={{
          position: 'fixed',
          left: '24px',
          top: '50%',
          transform: 'translateY(-50%)',
          height: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          zIndex: 10,
        }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.6rem',
            color: '#00FFD1',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            transform: 'rotate(180deg)',
            opacity: 0.7,
          }}>SURFACE</span>
          <div style={{
            flex: 1,
            width: '2px',
            background: 'rgba(0,255,209,0.15)',
            position: 'relative',
          }}>
            {/* Filled portion */}
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0,
              height: `${meterProgress * 100}%`,
              background: '#EC4899',
              transition: 'height 600ms ease',
            }} />
            {/* Position dot */}
            <div style={{
              position: 'absolute',
              left: '50%',
              top: `${meterProgress * 100}%`,
              transform: 'translate(-50%, -50%)',
              width: '8px',
              height: '8px',
              background: '#EC4899',
              borderRadius: '50%',
              transition: 'top 600ms ease',
              boxShadow: '0 0 6px rgba(236,72,153,0.6)',
            }} />
          </div>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.6rem',
            color: '#00FFD1',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            transform: 'rotate(180deg)',
            opacity: 0.7,
          }}>CORE SIGNAL</span>
        </div>

        {/* Main question area */}
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 24px 60px 80px',
          position: 'relative',
          zIndex: 2,
        }}>
          <div style={{
            maxWidth: '640px',
            width: '100%',
            opacity: slideVisible ? 1 : 0,
            transform: slideVisible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 400ms ease, transform 400ms ease',
          }}>
            {/* Question counter */}
            <p style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.7rem',
              color: '#00FFD1',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: '24px',
              opacity: 0.7,
            }}>
              {currentQuestion + 1} / {quizQuestions.length}
              {isQ20 && (
                <span style={{ marginLeft: '12px', color: 'rgba(0,255,209,0.5)' }}>
                  TRIPLE WEIGHT
                </span>
              )}
            </p>

            {/* Q20 special header */}
            {isQ20 && (
              <div style={{ marginBottom: '32px' }}>
                <p style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.75rem',
                  color: '#00FFD1',
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  marginBottom: '12px',
                  opacity: slideVisible ? 1 : 0,
                  transition: 'opacity 800ms ease',
                }}>
                  FINAL SIGNAL
                </p>
                <p style={{
                  fontFamily: "'EB Garamond', Georgia, serif",
                  fontStyle: 'italic',
                  fontSize: '1.1rem',
                  color: '#FAFAFA',
                  lineHeight: 1.6,
                  marginBottom: '0',
                  opacity: slideVisible ? 1 : 0,
                  transition: 'opacity 800ms ease 200ms',
                }}>
                  This is the one your body runs without asking permission.
                </p>
              </div>
            )}

            {/* Question text — typing effect */}
            <h2 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              color: 'white',
              lineHeight: 1.2,
              marginBottom: '20px',
              minHeight: '1.2em',
            }}>
              {typedText}
              {!typingComplete && (
                <span style={{
                  display: 'inline-block',
                  width: '2px',
                  height: '1em',
                  background: '#00FFD1',
                  marginLeft: '2px',
                  verticalAlign: 'middle',
                  animation: 'none',
                  opacity: 0.8,
                }} />
              )}
            </h2>

            {/* Instruction line */}
            {typingComplete && !isQ20 && (
              <p style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.7rem',
                color: '#00FFD1',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                marginBottom: '2rem',
              }}>
                PICK EVERY ANSWER THAT LANDS. DON'T THINK.
              </p>
            )}

            {/* Selection counter */}
            {hasSelection && !isQ20 && (
              <p style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.75rem',
                color: '#00FFD1',
                letterSpacing: '0.2em',
                marginBottom: '16px',
              }}>
                {currentSelections.length} OF 3 SELECTED
              </p>
            )}

            {/* Answer options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {question.options.map((option, idx) => {
                const isSelected = currentSelections.includes(option.id);
                const isDimmed = isAtMax && !isSelected;
                const isVisible = idx < visibleAnswers;
                const showRecognition = recognition?.optionId === option.id;

                return (
                  <div key={option.id}>
                    <button
                      data-testid={`quiz-option-${option.id}`}
                      onClick={() => handleSelect(option.id)}
                      disabled={isDimmed}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '16px 20px',
                        background: isSelected
                          ? 'rgba(0,255,209,0.08)'
                          : 'rgba(255,255,255,0.03)',
                        border: isSelected
                          ? '1px solid rgba(0,255,209,0.3)'
                          : '1px solid rgba(255,255,255,0.08)',
                        borderLeft: isSelected
                          ? '3px solid #00FFD1'
                          : '3px solid transparent',
                        borderRadius: '4px',
                        color: isSelected ? 'white' : '#CBD5E1',
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '0.95rem',
                        cursor: isDimmed ? 'not-allowed' : 'pointer',
                        transition: 'all 200ms ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px',
                        opacity: isVisible ? (isDimmed ? 0.3 : 1) : 0,
                        transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
                      }}
                      onMouseEnter={e => {
                        if (!isDimmed && !isSelected) {
                          e.currentTarget.style.background = 'rgba(0,255,209,0.05)';
                          e.currentTarget.style.borderLeftColor = 'rgba(0,255,209,0.4)';
                          e.currentTarget.style.color = 'white';
                        }
                      }}
                      onMouseLeave={e => {
                        if (!isDimmed && !isSelected) {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                          e.currentTarget.style.borderLeftColor = 'transparent';
                          e.currentTarget.style.color = '#CBD5E1';
                        }
                      }}
                    >
                      <span>{option.text}</span>
                      {isSelected && (
                        <span style={{
                          color: '#00FFD1',
                          fontSize: '0.85rem',
                          flexShrink: 0,
                          fontFamily: "'JetBrains Mono', monospace",
                        }}>
                          ✓
                        </span>
                      )}
                    </button>

                    {/* Recognition line */}
                    {showRecognition && (
                      <p style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '0.75rem',
                        color: '#00FFD1',
                        letterSpacing: '0.15em',
                        fontStyle: 'italic',
                        paddingLeft: '20px',
                        marginTop: '6px',
                        marginBottom: '2px',
                        opacity: recognition?.visible ? 1 : 0,
                        transition: 'opacity 300ms ease',
                      }}>
                        {recognition?.text}
                      </p>
                    )}
                  </div>
                );
              })}

              {/* "This doesn't apply to me" — not on Q20 */}
              {!isQ20 && typingComplete && (
                <button
                  onClick={() => {
                    const newAnswers = { ...answers, [question.id]: [] };
                    setAnswers(newAnswers);
                    setRecognition(null);
                    if (currentQuestion < quizQuestions.length - 1) {
                      setTimeout(() => setCurrentQuestion(prev => prev + 1), 80);
                    } else {
                      const rawScores = calculatePatternScores(newAnswers);
                      const result = determineQuizResult(rawScores);
                      setQuizResult(result);
                      setScreen('calculating');
                    }
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '12px 20px',
                    background: 'transparent',
                    border: '1px dotted rgba(255,255,255,0.1)',
                    borderLeft: '3px solid transparent',
                    borderRadius: '4px',
                    color: '#64748B',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 200ms ease',
                    marginTop: '4px',
                    opacity: visibleAnswers >= question.options.length ? 1 : 0,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#94A3B8'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#64748B'; }}
                >
                  This doesn't apply to me
                </button>
              )}
            </div>

            {/* NEXT button */}
            {hasSelection && (
              <button
                data-testid="quiz-next-btn"
                onClick={goToNext}
                style={{
                  display: 'block',
                  marginTop: '2rem',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.85rem',
                  color: '#0a0a0a',
                  background: '#00FFD1',
                  border: 'none',
                  padding: '14px 40px',
                  cursor: 'pointer',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  transition: 'background 200ms ease, transform 200ms ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#00C9A7';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#00FFD1';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                NEXT →
              </button>
            )}

            {/* Back button */}
            {currentQuestion > 0 && (
              <button
                data-testid="quiz-back-btn"
                onClick={() => setCurrentQuestion(prev => prev - 1)}
                style={{
                  display: 'block',
                  marginTop: '16px',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.75rem',
                  color: '#475569',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  letterSpacing: '0.1em',
                  transition: 'color 200ms ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = '#94A3B8'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#475569'; }}
              >
                back
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
