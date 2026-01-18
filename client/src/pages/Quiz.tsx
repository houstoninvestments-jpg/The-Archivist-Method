import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'wouter';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { quizQuestions, calculatePatternScores, determineQuizResult } from '@/lib/quizData';

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [, setLocation] = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);

  const question = quizQuestions[currentQuestion];
  const selectedOptions = answers[question.id] || [];
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  const handleOptionToggle = useCallback((optionId: string, isNone?: boolean) => {
    const currentSelections = answers[question.id] || [];
    
    if (isNone) {
      setAnswers({ ...answers, [question.id]: [optionId] });
    } else {
      const noneOption = question.options.find(o => o.isNone);
      const newSelections = currentSelections.filter(id => id !== noneOption?.id);
      
      if (newSelections.includes(optionId)) {
        setAnswers({ ...answers, [question.id]: newSelections.filter(id => id !== optionId) });
      } else {
        setAnswers({ ...answers, [question.id]: [...newSelections, optionId] });
      }
    }
  }, [answers, question]);

  const canProceed = selectedOptions.length > 0;

  const handleNext = useCallback(() => {
    if (isTransitioning) return;
    
    if (currentQuestion < quizQuestions.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
        setIsTransitioning(false);
      }, 150);
    } else {
      setIsAnalyzing(true);
      setTimeout(() => {
        const scores = calculatePatternScores(answers);
        const result = determineQuizResult(scores);
        
        const resultData = encodeURIComponent(JSON.stringify(result));
        
        if (result.type === "fallback") {
          setLocation(`/quiz/result/select?data=${resultData}`);
        } else {
          setLocation(`/quiz/result/${result.primaryPattern}?data=${resultData}`);
        }
      }, 2000);
    }
  }, [currentQuestion, answers, isTransitioning, setLocation]);

  const handleBack = useCallback(() => {
    if (currentQuestion > 0 && !isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentQuestion(currentQuestion - 1);
        setIsTransitioning(false);
      }, 150);
    }
  }, [currentQuestion, isTransitioning]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnalyzing || isTransitioning) return;
      
      if (e.key >= '1' && e.key <= '6') {
        const optionIndex = parseInt(e.key) - 1;
        if (optionIndex < question.options.length) {
          const option = question.options[optionIndex];
          handleOptionToggle(option.id, option.isNone);
        }
      }
      
      if (e.key === 'Enter' && canProceed) {
        e.preventDefault();
        handleNext();
      }
      
      if (e.key === 'Backspace' && currentQuestion > 0) {
        e.preventDefault();
        handleBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [question, canProceed, handleNext, handleBack, handleOptionToggle, isAnalyzing, isTransitioning, currentQuestion]);

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center" role="alert" aria-live="polite">
        <div className="text-center px-6">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 sm:mb-8">
            <div className="absolute inset-0 border-4 border-teal-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-teal-500 rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-4 border-transparent border-t-pink-500 rounded-full animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}></div>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3 tracking-tight">Analyzing Your Patterns</h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-md">Cross-referencing your responses against 7 core survival patterns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-pink-500/10"></div>
      </div>

      <div ref={containerRef} className="relative max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-8 md:py-12 flex-1 flex flex-col">
        {/* Progress header - compact on mobile */}
        <div className="mb-4 sm:mb-8">
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <span className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider font-medium">Pattern Quiz</span>
            <span className="text-xs sm:text-sm text-teal-400 font-semibold tabular-nums">{currentQuestion + 1} / {quizQuestions.length}</span>
          </div>
          <div 
            className="h-1.5 bg-white/10 rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={currentQuestion + 1}
            aria-valuemin={1}
            aria-valuemax={quizQuestions.length}
            aria-label={`Question ${currentQuestion + 1} of ${quizQuestions.length}`}
          >
            <div 
              className="h-full bg-gradient-to-r from-teal-500 via-cyan-400 to-pink-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Quiz card - optimized for mobile viewport with premium styling */}
        <div 
          className={`bg-[#0a0a0a] backdrop-blur-xl border border-teal-500/10 rounded-2xl p-4 sm:p-6 md:p-8 flex-1 flex flex-col transition-opacity duration-150 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}
          role="form"
          aria-label="Pattern identification quiz"
        >
          {/* Question header - reduced margins on mobile */}
          <div className="mb-4 sm:mb-6 md:mb-8">
            <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2 tracking-tight">{question.title}</h2>
            <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed">{question.subtitle}</p>
            <p className="text-xs sm:text-sm text-teal-400 mt-2 sm:mt-4 font-medium">Choose all that apply</p>
          </div>

          {/* Options - compact spacing on mobile with premium hover states */}
          <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 md:mb-8 flex-1" role="group" aria-label="Answer options">
            {question.options.map((option, index) => {
              const isSelected = selectedOptions.includes(option.id);
              const keyNumber = index + 1;
              return (
                <button
                  key={option.id}
                  data-testid={`quiz-option-${option.id}`}
                  onClick={() => handleOptionToggle(option.id, option.isNone)}
                  aria-label={`Option ${keyNumber}: ${option.text}${isSelected ? ' (selected)' : ''}`}
                  aria-pressed={isSelected}
                  className={`w-full text-left px-3 py-2.5 sm:p-4 rounded-xl border-2 transition-all duration-200 group min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
                    isSelected
                      ? 'border-teal-500 bg-teal-500/15 shadow-[0_0_20px_rgba(20,184,166,0.15)]'
                      : option.isNone
                      ? 'border-white/10 bg-[#1a1a1a] hover:border-white/25 hover:bg-white/10 hover:translate-x-1'
                      : 'border-white/10 bg-[#1a1a1a] hover:border-teal-500/50 hover:bg-teal-500/5 hover:translate-x-1'
                  }`}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                      isSelected
                        ? 'border-teal-500 bg-teal-500 scale-110'
                        : 'border-white/30 group-hover:border-teal-500/60'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 sm:w-4 sm:h-4 text-black" strokeWidth={3} />}
                    </div>
                    <span className={`text-sm sm:text-base leading-tight transition-colors ${isSelected ? 'text-white font-medium' : 'text-slate-300'} ${option.isNone ? 'italic text-slate-400' : ''}`}>
                      {option.text}
                    </span>
                    <span className="hidden sm:inline-block ml-auto text-xs text-gray-600 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                      {keyNumber}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation buttons - compact on mobile with premium styling */}
          <div className="flex items-center justify-between gap-2 sm:gap-4 pt-2">
            <button
              data-testid="quiz-back-btn"
              onClick={handleBack}
              disabled={currentQuestion === 0 || isTransitioning}
              aria-label="Go to previous question"
              className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium transition-all min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
                currentQuestion === 0 || isTransitioning
                  ? 'text-gray-600 cursor-not-allowed opacity-50'
                  : 'text-gray-300 hover:text-white hover:bg-white/10 active:scale-95'
              }`}
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Back</span>
            </button>
            
            <button
              data-testid="quiz-next-btn"
              onClick={handleNext}
              disabled={!canProceed || isTransitioning}
              aria-label={currentQuestion === quizQuestions.length - 1 ? 'See your results' : 'Go to next question'}
              className={`flex items-center gap-1 sm:gap-2 px-5 sm:px-8 py-2.5 sm:py-3 rounded-xl font-bold transition-all min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
                canProceed && !isTransitioning
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-400 text-black hover:shadow-[0_0_24px_rgba(20,184,166,0.4)] hover:scale-[1.02] active:scale-[0.98]'
                  : 'bg-white/10 text-gray-500 cursor-not-allowed opacity-60'
              }`}
            >
              <span className="text-sm sm:text-base tracking-wide">{currentQuestion === quizQuestions.length - 1 ? 'See Results' : 'Next'}</span>
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Progress dots - hidden on mobile to save space */}
        <div className="mt-4 sm:mt-6 hidden sm:flex justify-center gap-2">
          {quizQuestions.map((_, idx) => (
            <div
              key={idx}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentQuestion
                  ? 'bg-teal-500 w-4'
                  : idx < currentQuestion
                  ? 'bg-teal-500/50'
                  : 'bg-white/20'
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
