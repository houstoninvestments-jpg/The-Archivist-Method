import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useLocation } from 'wouter';
import { quizQuestions, calculatePatternScores, determineQuizResult } from '@/lib/quizData';

function useParticles(count: number) {
  return useMemo(() =>
    Array.from({ length: count }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 12}s`,
      duration: `${10 + Math.random() * 15}s`,
    })), [count]);
}

export default function Quiz() {
  const [screen, setScreen] = useState<'intro' | 'quiz' | 'analyzing'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [, setLocation] = useLocation();
  const [selectedFlash, setSelectedFlash] = useState<string | null>(null);
  const [slideState, setSlideState] = useState<'enter' | 'visible' | 'exit'>('visible');
  const [isAdvancing, setIsAdvancing] = useState(false);
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const introParticles = useParticles(20);
  const quizParticles = useParticles(15);
  const finalParticles = useParticles(30);

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
      <div className="quiz-screen min-h-screen bg-black flex flex-col items-center justify-center px-6">
        <div className="quiz-fog" />
        <div className="quiz-particles" aria-hidden="true">
          {introParticles.map((p, i) => (
            <span key={i} className="quiz-particle" style={{
              left: p.left, top: p.top,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }} />
          ))}
        </div>

        <div className="quiz-intro-content text-center max-w-2xl relative z-10">
          <h2 className="text-2xl font-bold text-white tracking-widest mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            THE ARCHIVIST METHOD™
          </h2>

          <div className="h-0.5 w-24 bg-pink-500 mx-auto mb-8" />

          <h1
            className="text-4xl md:text-5xl font-black mb-6 tracking-tight"
            style={{
              color: '#14B8A6',
              textShadow: '0 0 30px rgba(20, 184, 166, 0.3)'
            }}
          >
            DISCOVER YOUR PATTERN
          </h1>

          <div className="text-lg text-slate-300 leading-relaxed mb-8 max-w-xl mx-auto">
            <p className="mb-4">
              You watch yourself do it. You know it's happening.
              <br />
              <span
                className="font-bold"
                style={{
                  color: '#EC4899',
                  textShadow: '0 0 20px rgba(236, 72, 153, 0.4)'
                }}
              >
                You do it anyway.
              </span>
            </p>
            <p
              className="mb-4 font-bold"
              style={{
                color: '#EC4899',
                textShadow: '0 0 15px rgba(236, 72, 153, 0.3)'
              }}
            >
              Disappear. Apologize. Test. Sabotage. Repeat.
            </p>
            <p className="text-white">
              15 questions. 2 minutes.
              <br />
              Pattern archaeology, <span style={{ color: '#EC4899' }}>NOT</span> therapy.
            </p>
          </div>

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
            className="quiz-cta-btn px-10 py-4 bg-teal-500 text-black font-bold text-lg rounded-md transition-all"
          >
            Discover Your Pattern
          </button>

          <p className="mt-6 text-slate-500 text-sm">
            {"Free \u2022 2 Minutes \u2022 Instant Results"}
          </p>
        </div>
      </div>
    );
  }

  if (screen === 'analyzing') {
    return (
      <div className="quiz-screen min-h-screen bg-black flex items-center justify-center">
        <div className="quiz-fog" />
        <div className="quiz-analyzing-content text-center px-6 relative z-10">
          <div className="relative w-20 h-20 mx-auto mb-8">
            <div className="absolute inset-0 border-4 border-teal-500/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-transparent border-t-teal-500 rounded-full quiz-spin" />
            <div className="absolute inset-2 border-4 border-transparent border-t-pink-500 rounded-full quiz-spin-reverse" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Analyzing Your Patterns</h2>
          <p className="text-slate-400 max-w-md mx-auto">
            Cross-referencing your responses against 9 core survival patterns...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`quiz-screen min-h-screen bg-black flex flex-col ${isFinalQuestion ? 'quiz-final-question' : ''}`}>
      <div className="quiz-fog" />
      <div className="quiz-particles" aria-hidden="true">
        {(isFinalQuestion ? finalParticles : quizParticles).map((p, i) => (
          <span key={i} className="quiz-particle" style={{
            left: p.left, top: p.top,
            animationDelay: p.delay,
            animationDuration: isFinalQuestion ? `${6 + parseFloat(p.duration) * 0.3}s` : p.duration,
          }} />
        ))}
      </div>

      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="h-[3px] bg-slate-800/80">
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
            <div
              className={`bg-slate-900/70 backdrop-blur-sm border rounded-md p-5 md:p-7 ${isFinalQuestion ? 'quiz-final-card border-teal-500/30' : 'border-slate-700/40'}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <span
                  className="text-xs font-bold px-3 py-1 rounded-full"
                  style={{
                    background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(20, 184, 166, 0.15))',
                    border: '1px solid rgba(236, 72, 153, 0.25)',
                    color: '#EC4899'
                  }}
                  data-testid={`quiz-question-badge-${currentQuestion + 1}`}
                >
                  Q{currentQuestion + 1}
                </span>
                {isFinalQuestion && (
                  <span className="text-xs text-teal-400/70 uppercase tracking-widest">counts 2x</span>
                )}
              </div>

              <h2 className="text-xl md:text-2xl font-bold text-white mb-5 leading-snug" data-testid="quiz-question-title">{question.title}</h2>

              <div className="space-y-2.5">
                {question.options.map((option) => {
                  const isSelected = currentAnswer === option.id;
                  const isFlashing = selectedFlash === option.id;
                  return (
                    <button
                      key={option.id}
                      data-testid={`quiz-option-${option.id}`}
                      onClick={() => handleSelect(option.id)}
                      disabled={isAdvancing}
                      className={`quiz-option w-full text-left px-4 py-3 rounded-md border transition-all duration-200 ${
                        isSelected
                          ? 'quiz-option-selected border-teal-500/80 bg-teal-500/10'
                          : 'border-slate-700/40 bg-slate-800/40'
                      } ${isFlashing ? 'quiz-option-flash' : ''} ${isAdvancing && !isSelected ? 'opacity-50' : ''}`}
                    >
                      <span className={`text-sm leading-relaxed ${isSelected ? 'text-white font-medium' : 'text-slate-300'}`}>
                        {option.text}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {currentQuestion > 0 && !isAdvancing && (
              <button
                data-testid="quiz-back-btn"
                onClick={handleBack}
                className="mt-4 text-sm text-slate-500 hover:text-slate-300 transition-colors mx-auto block"
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
