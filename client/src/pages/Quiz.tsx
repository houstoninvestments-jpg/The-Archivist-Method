import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { quizQuestions, calculatePatternScores, determineQuizResult } from '@/lib/quizData';

// Spring animation config
const springConfig = { type: "spring", stiffness: 300, damping: 30 };

// Slide variants for question cards
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0
  })
};

export default function Quiz() {
  const [screen, setScreen] = useState<'intro' | 'quiz' | 'analyzing'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  const [direction, setDirection] = useState(0);
  const [, setLocation] = useLocation();

  const question = quizQuestions[currentQuestion];
  const selectedOptions = answers[question?.id] || [];
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
    if (currentQuestion < quizQuestions.length - 1) {
      setDirection(1);
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setScreen('analyzing');
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
  }, [currentQuestion, answers, setLocation]);

  const handleBack = useCallback(() => {
    if (currentQuestion > 0) {
      setDirection(-1);
      setCurrentQuestion(currentQuestion - 1);
    }
  }, [currentQuestion]);

  // Keyboard navigation
  useEffect(() => {
    if (screen !== 'quiz') return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
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
  }, [screen, question, canProceed, handleNext, handleBack, handleOptionToggle, currentQuestion]);

  // INTRO SCREEN
  if (screen === 'intro') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-lg"
        >
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            THE ARCHIVIST
          </h1>
          <p className="text-xl text-teal-400 font-semibold mb-8">
            Pattern Identification Quiz
          </p>
          <p className="text-slate-400 mb-12 leading-relaxed">
            15 questions to identify which survival patterns are running your life.
            Answer honestly — there are no wrong answers.
          </p>
          
          <motion.button
            data-testid="quiz-start-btn"
            onClick={() => setScreen('quiz')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-teal-500 hover:bg-teal-400 text-black font-bold text-lg rounded-xl transition-colors"
          >
            Begin Assessment
          </motion.button>
          
          <p className="mt-6 text-slate-500 text-sm">
            Takes about 3-5 minutes
          </p>
        </motion.div>
      </div>
    );
  }

  // ANALYZING SCREEN
  if (screen === 'analyzing') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center px-6"
        >
          <div className="relative w-20 h-20 mx-auto mb-8">
            <div className="absolute inset-0 border-4 border-teal-500/20 rounded-full"></div>
            <motion.div 
              className="absolute inset-0 border-4 border-transparent border-t-teal-500 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            />
            <motion.div 
              className="absolute inset-2 border-4 border-transparent border-t-pink-500 rounded-full"
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Analyzing Your Patterns</h2>
          <p className="text-slate-400 max-w-md">
            Cross-referencing your responses against 7 core survival patterns...
          </p>
        </motion.div>
      </div>
    );
  }

  // QUIZ SCREEN
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Progress bar at top */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-sm">
        <div className="h-1 bg-slate-800">
          <motion.div 
            className="h-full bg-teal-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="flex items-center justify-between px-4 py-2">
          <span className="text-xs text-slate-500 uppercase tracking-wider">Pattern Quiz</span>
          <span className="text-xs text-teal-400 font-semibold">{currentQuestion + 1} / {quizQuestions.length}</span>
        </div>
      </div>

      {/* Question cards with slide animation */}
      <div className="flex-1 flex flex-col pt-16 pb-4">
        <div className="flex-1 flex items-center justify-center px-4">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentQuestion}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={springConfig}
              className="w-full max-w-xl"
            >
              {/* Question card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-2">{question.title}</h2>
                <p className="text-slate-300 mb-2">{question.subtitle}</p>
                <p className="text-sm text-teal-400 mb-6">Choose all that apply</p>

                {/* Options */}
                <div className="space-y-3">
                  {question.options.map((option) => {
                    const isSelected = selectedOptions.includes(option.id);
                    return (
                      <motion.button
                        key={option.id}
                        data-testid={`quiz-option-${option.id}`}
                        onClick={() => handleOptionToggle(option.id, option.isNone)}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-colors ${
                          isSelected
                            ? 'border-teal-500 bg-teal-500/15'
                            : 'border-slate-700 bg-slate-800 hover:bg-slate-700 hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${
                            isSelected
                              ? 'border-teal-500 bg-teal-500'
                              : 'border-slate-600'
                          }`}>
                            {isSelected && <Check className="w-3 h-3 text-black" strokeWidth={3} />}
                          </div>
                          <span className={`text-sm ${isSelected ? 'text-white font-medium' : 'text-slate-300'} ${option.isNone ? 'italic text-slate-400' : ''}`}>
                            {option.text}
                          </span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation buttons - fixed at bottom 40% area */}
        <div className="px-4 pb-8 pt-4">
          <div className="max-w-xl mx-auto flex gap-3">
            <motion.button
              data-testid="quiz-back-btn"
              onClick={handleBack}
              disabled={currentQuestion === 0}
              whileTap={{ scale: 0.95 }}
              className={`flex-1 py-4 rounded-xl font-semibold transition-colors ${
                currentQuestion === 0
                  ? 'bg-slate-800/50 text-slate-600 cursor-not-allowed'
                  : 'bg-slate-800 hover:bg-slate-700 text-white'
              }`}
            >
              Back
            </motion.button>
            
            <motion.button
              data-testid="quiz-next-btn"
              onClick={handleNext}
              disabled={!canProceed}
              whileTap={{ scale: 0.95 }}
              className={`flex-[2] py-4 rounded-xl font-bold transition-colors ${
                canProceed
                  ? 'bg-teal-500 hover:bg-teal-400 text-black'
                  : 'bg-slate-800/50 text-slate-600 cursor-not-allowed'
              }`}
            >
              {currentQuestion === quizQuestions.length - 1 ? 'See Results' : 'Next'}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
