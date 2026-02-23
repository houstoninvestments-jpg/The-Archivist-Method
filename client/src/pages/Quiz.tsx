import { useState, useEffect, useCallback, useRef, useMemo, lazy, Suspense } from 'react';
import { useLocation } from 'wouter';
import { quizQuestions, calculatePatternScores, determineQuizResult } from '@/lib/quizData';

const ParticleField = lazy(() => import("@/components/ParticleField"));

export default function Quiz() {
  const [screen, setScreen] = useState<'intro' | 'quiz' | 'analyzing'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [, setLocation] = useLocation();
  const [selectedFlash, setSelectedFlash] = useState<string | null>(null);
  const [slideState, setSlideState] = useState<'enter' | 'visible' | 'exit'>('visible');
  const [isAdvancing, setIsAdvancing] = useState(false);
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const question = quizQuestions[currentQuestion];
  const progress = ((currentQuestion) / quizQuestions.length) * 100;
  const progressAfterAnswer = ((currentQuestion + 1) / quizQuestions.length) * 100;
  const currentAnswer = answers[question?.id];
  const isFinalQuestion = currentQuestion === quizQuestions.length - 1;

  const goToNext = useCallback(() => {
    if (currentQuestion < quizQuestions.length - 1) {
      setSlideState('exit');
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
        setSlideState('enter');
        setSelectedFlash(null);
        setIsAdvancing(false);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setSlideState('visible');
          });
        });
      }, 200);
    } else {
      setScreen('analyzing');
      setIsAdvancing(false);
      setTimeout(() => {
        const scores = calculatePatternScores(answers);
        const result = determineQuizResult(scores);

        if (result.primaryPattern) {
          localStorage.setItem('quizResultPattern', result.primaryPattern);
        }
        localStorage.setItem('quizScores', JSON.stringify(result.scores));

        const resultData = encodeURIComponent(JSON.stringify(result));
        setLocation(`/results?data=${resultData}`);
      }, 2500);
    }
  }, [currentQuestion, answers]);

  const handleSelect = useCallback((optionId: string) => {
    if (isAdvancing) return;

    setSelectedFlash(optionId);
    setAnswers(prev => ({ ...prev, [question.id]: optionId }));
    setIsAdvancing(true);

    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    advanceTimerRef.current = setTimeout(() => {
      goToNext();
    }, 400);
  }, [question, goToNext, isAdvancing]);

  const handleBack = useCallback(() => {
    if (currentQuestion > 0 && !isAdvancing) {
      setSlideState('exit');
      setTimeout(() => {
        setCurrentQuestion(prev => prev - 1);
        setSelectedFlash(null);
        setIsAdvancing(false);
        setSlideState('enter');
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setSlideState('visible');
          });
        });
      }, 150);
    }
  }, [currentQuestion, isAdvancing]);

  useEffect(() => {
    if (screen !== 'quiz') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAdvancing) return;
      const num = parseInt(e.key);
      if (num >= 1 && num <= question.options.length) {
        const option = question.options[num - 1];
        handleSelect(option.id);
      }
      if (e.key === 'Backspace' && currentQuestion > 0) {
        e.preventDefault();
        handleBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [screen, question, handleSelect, handleBack, currentQuestion, isAdvancing]);

  useEffect(() => {
    return () => {
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    };
  }, []);

  if (screen === 'intro') {
    return (
      <div
        className="quiz-screen min-h-screen flex flex-col items-center justify-center px-6"
        style={{ background: '#0A0A0A' }}
      >
        <Suspense fallback={null}>
          <ParticleField />
        </Suspense>

        <div className="quiz-intro-content text-center relative z-10" style={{ maxWidth: '600px' }}>
          <p
            data-testid="text-quiz-brand"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '12px',
              color: '#14B8A6',
              textTransform: 'uppercase',
              letterSpacing: '0.3em',
            }}
          >
            THE ARCHIVIST METHOD&trade;
          </p>

          <h1
            data-testid="text-quiz-headline"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(2.8rem, 5vw, 3.5rem)',
              color: 'white',
              fontWeight: 700,
              lineHeight: 1.15,
              marginTop: '32px',
            }}
          >
            Discover Your Pattern
          </h1>

          <p
            data-testid="text-quiz-subhead-1"
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: '1.1rem',
              color: '#999',
              marginTop: '24px',
              maxWidth: '480px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            You watch yourself do it. You know it's happening.
          </p>

          <p
            data-testid="text-quiz-subhead-2"
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: '1.1rem',
              color: 'white',
              marginTop: '8px',
            }}
          >
            You do it anyway.
          </p>

          <p
            data-testid="text-quiz-meta"
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: '1rem',
              color: '#999999',
              marginTop: '32px',
            }}
          >
            15 questions. 2 minutes.
          </p>

          <button
            data-testid="quiz-start-btn"
            onClick={() => {
              setScreen('quiz');
              setSlideState('enter');
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  setSlideState('visible');
                });
              });
            }}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '15px',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              background: 'transparent',
              color: 'white',
              padding: '18px 48px',
              marginTop: '32px',
              cursor: 'pointer',
              transition: 'all 300ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.color = 'black';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'white';
            }}
          >
            BEGIN &rarr;
          </button>

          <p
            data-testid="text-quiz-privacy"
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: '13px',
              color: '#999999',
              marginTop: '16px',
            }}
          >
            Free &middot; Private &middot; Instant Results
          </p>

          <p
            data-testid="text-quiz-tagline"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '12px',
              color: '#14B8A6',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              marginTop: '48px',
              opacity: 0.7,
            }}
          >
            Pattern archaeology, not therapy.
          </p>
        </div>
      </div>
    );
  }

  if (screen === 'analyzing') {
    return (
      <div className="quiz-screen min-h-screen flex items-center justify-center" style={{ background: '#0A0A0A' }}>
        <div className="quiz-analyzing-content text-center px-6 relative z-10">
          <div className="relative w-20 h-20 mx-auto mb-8">
            <div className="absolute inset-0 border-4 rounded-full" style={{ borderColor: 'rgba(20, 184, 166, 0.2)' }} />
            <div className="absolute inset-0 border-4 border-transparent rounded-full quiz-spin" style={{ borderTopColor: '#14B8A6' }} />
            <div className="absolute inset-2 border-4 border-transparent rounded-full quiz-spin-reverse" style={{ borderTopColor: '#999999' }} />
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: 'white', marginBottom: '12px' }}>
            Analyzing Your Patterns
          </h2>
          <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: '#999999', maxWidth: '400px', margin: '0 auto' }}>
            Cross-referencing your responses against 9 core survival patterns...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`quiz-screen min-h-screen flex flex-col ${isFinalQuestion ? 'quiz-final-question' : ''}`}
      style={{ background: '#0A0A0A' }}
    >
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="h-[3px]" style={{ background: 'rgba(255, 255, 255, 0.06)' }}>
          <div
            className="quiz-progress-bar h-full"
            style={{
              width: `${currentAnswer ? progressAfterAnswer : progress}%`,
            }}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col pt-6 pb-4 relative z-10">
        <div className="flex-1 flex items-center justify-center px-4">
          <div
            className={`w-full max-w-xl quiz-slide quiz-slide-${slideState}`}
          >
            <div className="p-5 md:p-7">
              <div className="flex items-center gap-3 mb-5">
                <span
                  data-testid={`quiz-question-badge-${currentQuestion + 1}`}
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '11px',
                    color: '#14B8A6',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                  }}
                >
                  {currentQuestion + 1} / {quizQuestions.length}
                </span>
                {isFinalQuestion && (
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'rgba(20, 184, 166, 0.5)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                    counts 2x
                  </span>
                )}
              </div>

              <h2
                data-testid="quiz-question-title"
                style={{
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: 'clamp(1.15rem, 2.5vw, 1.35rem)',
                  color: 'white',
                  fontWeight: 400,
                  lineHeight: 1.5,
                  marginBottom: '28px',
                }}
              >
                {question.title}
              </h2>

              <div className="space-y-3">
                {question.options.map((option) => {
                  const isSelected = currentAnswer === option.id;
                  const isFlashing = selectedFlash === option.id;
                  return (
                    <button
                      key={option.id}
                      data-testid={`quiz-option-${option.id}`}
                      onClick={() => handleSelect(option.id)}
                      disabled={isAdvancing}
                      className={`quiz-option w-full text-left px-4 py-3.5 transition-all duration-200 ${isFlashing ? 'quiz-option-flash' : ''} ${isAdvancing && !isSelected ? 'opacity-50' : ''}`}
                      style={{
                        border: isSelected ? '1px solid #14B8A6' : '1px solid rgba(255, 255, 255, 0.12)',
                        background: isSelected ? 'rgba(20, 184, 166, 0.08)' : 'transparent',
                        fontFamily: "'Source Sans 3', sans-serif",
                        fontSize: '0.95rem',
                        color: isSelected ? 'white' : '#ccc',
                        lineHeight: 1.5,
                      }}
                    >
                      {option.text}
                    </button>
                  );
                })}
              </div>
            </div>

            {currentQuestion > 0 && !isAdvancing && (
              <button
                data-testid="quiz-back-btn"
                onClick={handleBack}
                style={{
                  display: 'block',
                  margin: '8px auto 0',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '12px',
                  color: '#999999',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textTransform: 'lowercase',
                  letterSpacing: '0.1em',
                  transition: 'color 200ms ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#999'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#999999'; }}
              >
                back
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
