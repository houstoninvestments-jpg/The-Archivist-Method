import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { quizQuestions, calculatePatternScores, determineQuizResult, patternDisplayNames, type PatternKey } from '@/lib/quizData';

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
  const [screen, setScreen] = useState<'intro' | 'quiz' | 'analyzing' | 'emailCapture'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  const [direction, setDirection] = useState(0);
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState<{ type: string; primaryPattern: string | null; scores: Record<string, number> } | null>(null);

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
        setQuizResult(result);
        setScreen('emailCapture');
      }, 2500);
    }
  }, [currentQuestion, answers]);
  
  const handleEmailSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !quizResult) return;
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Store quiz result data in localStorage for portal access
      if (quizResult.primaryPattern) {
        localStorage.setItem('quizResultPattern', quizResult.primaryPattern);
      }
      localStorage.setItem('userEmail', email);
      // Store full scores for fallback/select flow context
      localStorage.setItem('quizScores', JSON.stringify(quizResult.scores));
      
      // Redirect to result page with encoded data
      const resultData = encodeURIComponent(JSON.stringify(quizResult));
      if (quizResult.type === "fallback" || !quizResult.primaryPattern) {
        setLocation(`/quiz/result/select?data=${resultData}`);
      } else {
        setLocation(`/quiz/result/${quizResult.primaryPattern}?data=${resultData}`);
      }
    } catch (error) {
      console.error('Error submitting email:', error);
      setIsSubmitting(false);
      // Show user-facing error feedback by resetting state
      alert('Something went wrong. Please try again.');
    }
  }, [email, quizResult, setLocation]);

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
        {/* Subtle background gradient */}
        <div className="fixed inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-pink-500/5 pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl relative z-10"
        >
          {/* Brand title */}
          <h2 className="text-2xl font-bold text-white tracking-widest mb-4">
            THE ARCHIVIST METHOD™
          </h2>
          
          {/* Pink divider line */}
          <div className="h-0.5 w-24 bg-pink-500 mx-auto mb-8" />
          
          {/* Main headline with glow */}
          <h1 
            className="text-4xl md:text-5xl font-black mb-6 tracking-tight"
            style={{ 
              color: '#14B8A6',
              textShadow: '0 0 30px rgba(20, 184, 166, 0.3)'
            }}
          >
            DISCOVER YOUR PATTERN
          </h1>
          
          {/* Body copy */}
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
              Pattern archaeology, not therapy.
            </p>
          </div>
          
          {/* CTA Button */}
          <motion.button
            data-testid="quiz-start-btn"
            onClick={() => setScreen('quiz')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="px-10 py-4 bg-teal-500 hover:bg-teal-600 text-black font-bold text-lg rounded-xl transition-all"
          >
            Discover Your Pattern →
          </motion.button>
          
          {/* Subtext */}
          <p className="mt-6 text-slate-500 text-sm">
            Free • 2 Minutes • Instant Results
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

  // EMAIL CAPTURE SCREEN
  if (screen === 'emailCapture') {
    const patternName = quizResult?.primaryPattern 
      ? patternDisplayNames[quizResult.primaryPattern as PatternKey] || 'Your Pattern'
      : 'Your Pattern';
    
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
        <div className="fixed inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-pink-500/5 pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-xl w-full relative z-10"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Get Your Pattern Analysis
            </h2>
            <p className="text-slate-300 text-lg">
              Your full breakdown is ready in your personal portal:
            </p>
          </div>
          
          <div className="bg-slate-900/80 border border-slate-700/50 rounded-2xl p-6 md:p-8 mb-8">
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" />
                <span className="text-slate-300">What's driving this pattern <span className="text-slate-500 italic">(The Original Room)</span></span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" />
                <span className="text-slate-300">Your body signature <span className="text-slate-500 italic">(the 2.7 second warning)</span></span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" />
                <span className="text-slate-300">Secondary patterns you're also running</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" />
                <span className="text-slate-300">7-Day Crash Course specific to <span className="text-pink-400 font-medium">{patternName}</span></span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" />
                <span className="text-slate-300">How to interrupt it <span className="text-slate-500 italic">(your custom protocol)</span></span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" />
                <span className="text-slate-300">AI Pattern Coach <span className="text-slate-500 italic">(ask questions 24/7)</span></span>
              </li>
            </ul>
          </div>
          
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full px-5 py-4 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
              data-testid="input-email"
            />
            
            <motion.button
              type="submit"
              disabled={isSubmitting || !email}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-8 py-4 bg-teal-500 hover:bg-teal-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-black font-bold text-lg rounded-xl transition-all"
              data-testid="button-submit-email"
            >
              {isSubmitting ? 'Opening Archive...' : 'Enter The Archive →'}
            </motion.button>
          </form>
          
          <p className="text-center text-slate-500 text-sm mt-6">
            Free • Private • Brutally Honest • Instant Access
          </p>
        </motion.div>
      </div>
    );
  }

  // QUIZ SCREEN
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Subtle background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-pink-500/5 pointer-events-none" />
      
      {/* Progress bar at top - teal to pink gradient */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-sm border-b border-slate-800/50">
        <div className="h-1.5 bg-slate-800">
          <motion.div 
            className="h-full bg-gradient-to-r from-teal-500 via-teal-400 to-pink-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
            style={{ boxShadow: '0 0 10px rgba(20, 184, 166, 0.5)' }}
          />
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-xs text-slate-400 uppercase tracking-widest font-medium">Pattern Quiz</span>
          <div className="flex items-center gap-2">
            <span 
              className="text-sm font-bold"
              style={{ color: '#EC4899' }}
            >
              {currentQuestion + 1}
            </span>
            <span className="text-slate-500">/</span>
            <span className="text-sm text-slate-400">{quizQuestions.length}</span>
          </div>
        </div>
      </div>

      {/* Question cards with slide animation */}
      <div className="flex-1 flex flex-col pt-20 pb-4 relative z-10">
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
              {/* Question card with premium styling */}
              <div 
                className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 md:p-8"
                style={{ boxShadow: '0 0 40px rgba(0, 0, 0, 0.3), 0 0 80px rgba(20, 184, 166, 0.05)' }}
              >
                {/* Question number badge */}
                <div className="flex items-center gap-3 mb-4">
                  <span 
                    className="text-xs font-bold px-3 py-1 rounded-full"
                    style={{ 
                      background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(20, 184, 166, 0.2))',
                      border: '1px solid rgba(236, 72, 153, 0.3)',
                      color: '#EC4899'
                    }}
                  >
                    Q{currentQuestion + 1}
                  </span>
                </div>
                
                <h2 className="text-xl md:text-2xl font-bold text-white mb-2">{question.title}</h2>
                <p className="text-slate-300 mb-2 leading-relaxed">{question.subtitle}</p>
                <p className="text-sm mb-6">
                  <span className="text-teal-400">Choose all that apply</span>
                </p>

                {/* Options with improved styling */}
                <div className="space-y-3">
                  {question.options.map((option) => {
                    const isSelected = selectedOptions.includes(option.id);
                    return (
                      <motion.button
                        key={option.id}
                        data-testid={`quiz-option-${option.id}`}
                        onClick={() => handleOptionToggle(option.id, option.isNone)}
                        whileHover={{ scale: 1.01, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all duration-200 ${
                          isSelected
                            ? 'border-teal-500 bg-teal-500/10'
                            : 'border-slate-700/50 bg-slate-800/50 hover:bg-slate-800 hover:border-slate-600'
                        }`}
                        style={isSelected ? { 
                          boxShadow: '0 0 20px rgba(20, 184, 166, 0.15), inset 0 0 20px rgba(20, 184, 166, 0.05)' 
                        } : {}}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                            isSelected
                              ? 'border-teal-500 bg-teal-500 scale-110'
                              : 'border-slate-600'
                          }`}>
                            {isSelected && <Check className="w-3 h-3 text-black" strokeWidth={3} />}
                          </div>
                          <span className={`text-sm leading-relaxed ${isSelected ? 'text-white font-medium' : 'text-slate-300'} ${option.isNone ? 'italic text-slate-400' : ''}`}>
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

        {/* Navigation buttons with pink accent */}
        <div className="px-4 pb-8 pt-4">
          <div className="max-w-xl mx-auto flex gap-3">
            <motion.button
              data-testid="quiz-back-btn"
              onClick={handleBack}
              disabled={currentQuestion === 0}
              whileHover={currentQuestion > 0 ? { scale: 1.02 } : {}}
              whileTap={currentQuestion > 0 ? { scale: 0.95 } : {}}
              className={`flex-1 py-4 rounded-xl font-semibold transition-all ${
                currentQuestion === 0
                  ? 'bg-slate-800/30 text-slate-600 cursor-not-allowed'
                  : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
              }`}
            >
              Back
            </motion.button>
            
            <motion.button
              data-testid="quiz-next-btn"
              onClick={handleNext}
              disabled={!canProceed}
              whileHover={canProceed ? { scale: 1.02 } : {}}
              whileTap={canProceed ? { scale: 0.95 } : {}}
              className={`flex-[2] py-4 rounded-xl font-bold transition-all ${
                canProceed
                  ? 'text-black'
                  : 'bg-slate-800/30 text-slate-600 cursor-not-allowed'
              }`}
              style={canProceed ? {
                background: 'linear-gradient(135deg, #14B8A6, #0D9488)',
                boxShadow: '0 0 20px rgba(20, 184, 166, 0.3), 0 0 40px rgba(236, 72, 153, 0.1)'
              } : {}}
            >
              {currentQuestion === quizQuestions.length - 1 ? 'See Results →' : 'Next →'}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
