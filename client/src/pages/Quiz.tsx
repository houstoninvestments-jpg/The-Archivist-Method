import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { quizQuestions, calculatePatternScores, determineQuizResult } from '@/lib/quizData';

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [, setLocation] = useLocation();

  const question = quizQuestions[currentQuestion];
  const selectedOptions = answers[question.id] || [];
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  const handleOptionToggle = (optionId: string, isNone?: boolean) => {
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
  };

  const canProceed = selectedOptions.length > 0;

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
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
      }, 2500);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center px-6">
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 border-4 border-teal-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-teal-500 rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-4 border-transparent border-t-pink-500 rounded-full animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}></div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Analyzing Your Patterns</h2>
          <p className="text-gray-400 max-w-md">Cross-referencing your responses against 7 core survival patterns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-pink-500/10"></div>
      </div>

      <div className="relative max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-8 md:py-12 flex-1 flex flex-col">
        {/* Progress header - compact on mobile */}
        <div className="mb-4 sm:mb-8">
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <span className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider">Pattern Quiz</span>
            <span className="text-xs sm:text-sm text-teal-400 font-medium">{currentQuestion + 1} / {quizQuestions.length}</span>
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Quiz card - optimized for mobile viewport */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6 md:p-8 flex-1 flex flex-col">
          {/* Question header - reduced margins on mobile */}
          <div className="mb-4 sm:mb-6 md:mb-8">
            <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">{question.title}</h2>
            <p className="text-gray-300 text-sm sm:text-base md:text-lg">{question.subtitle}</p>
            <p className="text-xs sm:text-sm text-teal-400 mt-2 sm:mt-4">Choose all that apply</p>
          </div>

          {/* Options - compact spacing on mobile */}
          <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 md:mb-8 flex-1">
            {question.options.map((option) => {
              const isSelected = selectedOptions.includes(option.id);
              return (
                <button
                  key={option.id}
                  data-testid={`quiz-option-${option.id}`}
                  onClick={() => handleOptionToggle(option.id, option.isNone)}
                  className={`w-full text-left px-3 py-2.5 sm:p-4 rounded-xl border-2 transition-all duration-200 group min-h-[44px] ${
                    isSelected
                      ? 'border-teal-500 bg-teal-500/10'
                      : option.isNone
                      ? 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                      : 'border-white/10 bg-white/5 hover:border-teal-500/50 hover:bg-teal-500/5'
                  }`}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      isSelected
                        ? 'border-teal-500 bg-teal-500'
                        : 'border-white/30 group-hover:border-teal-500/50'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 sm:w-4 sm:h-4 text-black" />}
                    </div>
                    <span className={`text-sm sm:text-base leading-tight ${isSelected ? 'text-white' : 'text-gray-300'} ${option.isNone ? 'italic' : ''}`}>
                      {option.text}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation buttons - compact on mobile */}
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <button
              data-testid="quiz-back-btn"
              onClick={handleBack}
              disabled={currentQuestion === 0}
              className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium transition-all min-h-[44px] ${
                currentQuestion === 0
                  ? 'text-gray-600 cursor-not-allowed'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Back</span>
            </button>
            
            <button
              data-testid="quiz-next-btn"
              onClick={handleNext}
              disabled={!canProceed}
              className={`flex items-center gap-1 sm:gap-2 px-4 sm:px-8 py-2.5 sm:py-3 rounded-xl font-semibold transition-all min-h-[44px] ${
                canProceed
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-400 text-black hover:opacity-90'
                  : 'bg-white/10 text-gray-500 cursor-not-allowed'
              }`}
            >
              <span className="text-sm sm:text-base">{currentQuestion === quizQuestions.length - 1 ? 'See Results' : 'Next'}</span>
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
