import { useState } from "react";
import { ArrowRight, Loader2, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type PatternType = 
  | "disappearing"
  | "apology-loop"
  | "testing"
  | "attraction-to-harm"
  | "compliment-deflection"
  | "draining-bond"
  | "success-sabotage";

interface PatternInfo {
  name: string;
  shortName: string;
  description: string;
  driver: string;
}

const PATTERNS: Record<PatternType, PatternInfo> = {
  "disappearing": {
    name: "The Disappearing Pattern",
    shortName: "Disappearing",
    description: "You vanish when relationships get close. When someone says 'I love you,' your chest tightens and you're mentally booking a flight by Tuesday.",
    driver: "Intimacy was unsafe in your past. Someone getting close meant getting hurt. So your nervous system learned: distance = safety. Now closeness triggers flight."
  },
  "apology-loop": {
    name: "The Apology Loop",
    shortName: "Apology Loop",
    description: "You apologize for existing. 'Sorry to bother you.' 'Sorry, quick question.' You minimize yourself before anyone else can.",
    driver: "You learned early that your needs were 'too much.' So you shrink preemptively—apologizing for taking up space that was never safely yours to begin with."
  },
  "testing": {
    name: "The Testing Pattern",
    shortName: "Testing",
    description: "You create loyalty tests, push people away, and watch to see who fights to stay. You pick fights at 11pm to see if they'll still be there at breakfast.",
    driver: "Someone important failed you when it mattered. Now you test everyone before you trust them—creating the very abandonment you're trying to prevent."
  },
  "attraction-to-harm": {
    name: "Attraction to Harm",
    shortName: "Attraction to Harm",
    description: "The nice ones feel boring. The unavailable ones feel like chemistry. You see red flags and feel attraction, not warning.",
    driver: "Chaos was normalized in your formative years. Your nervous system learned to equate unpredictability with love. Calm feels wrong because it wasn't modeled as safe."
  },
  "compliment-deflection": {
    name: "Compliment Deflection",
    shortName: "Compliment Deflection",
    description: "Someone says 'nice work' and you immediately minimize it. 'Oh, it was nothing.' Visibility triggers panic. Being seen feels dangerous.",
    driver: "Standing out was punished—through criticism, jealousy, or having your accomplishments used against you. Now success feels like a target on your back."
  },
  "draining-bond": {
    name: "The Draining Bond",
    shortName: "Draining Bond",
    description: "You know you should leave. Your friends tell you to leave. But the guilt of abandoning them keeps you stuck in relationships that drain you.",
    driver: "You were made responsible for someone else's emotions too young. Now leaving feels like betrayal—even when staying is destroying you."
  },
  "success-sabotage": {
    name: "Success Sabotage",
    shortName: "Success Sabotage",
    description: "You're one week from launching. Everything's going well. Suddenly you blow it up, quit, or create a crisis that makes finishing impossible.",
    driver: "Success meant separation from your family or origin group. Winning felt like leaving them behind. So you stay stuck to stay connected."
  }
};

interface Question {
  id: number;
  pattern: PatternType;
  prompt: string;
  options: string[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    pattern: "disappearing",
    prompt: "You've been dating someone for 3 months. It's going well. They text: 'I think I'm falling for you.' What happens next?",
    options: [
      "My chest gets tight and I need space immediately",
      "I start finding reasons they're wrong for me",
      "I ghost for a few days then come back with an excuse"
    ]
  },
  {
    id: 2,
    pattern: "apology-loop",
    prompt: "You're 5 minutes late to meet a friend. When you arrive, what's your opening line?",
    options: [
      "\"I'm so sorry\" (and you apologize 3 more times in the next 10 minutes)",
      "\"Sorry I exist\" (joking but also not joking)",
      "You apologize for things that aren't even your fault during the hangout"
    ]
  },
  {
    id: 3,
    pattern: "testing",
    prompt: "Someone you care about says 'I'll always be here for you.' Your immediate thought is:",
    options: [
      "\"Let's see how long that lasts\"",
      "You create a small crisis to see if they mean it",
      "You push them away to prove they'll leave"
    ]
  },
  {
    id: 4,
    pattern: "attraction-to-harm",
    prompt: "You meet someone new. Red flags everywhere—they're emotionally unavailable, hot/cold, slight edge of danger. You feel:",
    options: [
      "Electric. This is chemistry.",
      "Like you've known them forever (trauma bond)",
      "Drawn to 'fix' them or 'earn' their consistency"
    ]
  },
  {
    id: 5,
    pattern: "compliment-deflection",
    prompt: "Your boss publicly praises your work in front of the team. Your response is:",
    options: [
      "\"It was nothing\" / \"Anyone could have done it\"",
      "Immediately point out everything you did wrong",
      "Physically uncomfortable, need to change the subject"
    ]
  },
  {
    id: 6,
    pattern: "draining-bond",
    prompt: "You're in a relationship/friendship that exhausts you. It's been harmful for months. Why are you still there?",
    options: [
      "Leaving feels like abandoning them (even though they hurt you)",
      "You keep hoping they'll change back to who they were",
      "The idea of being alone feels worse than staying"
    ]
  },
  {
    id: 7,
    pattern: "success-sabotage",
    prompt: "You're one week from launching something important—business, project, goal. What happens?",
    options: [
      "You blow it up / quit / 'pivot' to something new",
      "You pick a fight with someone close to you",
      "You create a crisis that makes finishing impossible"
    ]
  }
];

type QuizPhase = "intro" | "questions" | "analyzing" | "result" | "fallback";

export default function PatternQuiz() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [phase, setPhase] = useState<QuizPhase>("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [firstPatternSelected, setFirstPatternSelected] = useState<PatternType | null>(null);
  const [noneCount, setNoneCount] = useState(0);
  const [result, setResult] = useState<PatternType | null>(null);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStart = () => {
    setPhase("questions");
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setFirstPatternSelected(null);
    setNoneCount(0);
  };

  const handleSelectAnswer = (index: number) => {
    setSelectedAnswer(index);
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;

    const isNoneSelected = selectedAnswer === 3;
    const currentNoneCount = isNoneSelected ? noneCount + 1 : noneCount;
    
    if (!isNoneSelected && firstPatternSelected === null) {
      setFirstPatternSelected(QUESTIONS[currentQuestion].pattern);
    }

    if (isNoneSelected) {
      setNoneCount(currentNoneCount);
    }

    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      setPhase("analyzing");
      
      const finalFirstPattern = !isNoneSelected && firstPatternSelected === null 
        ? QUESTIONS[currentQuestion].pattern 
        : firstPatternSelected;
      
      setTimeout(() => {
        if (currentNoneCount >= 5) {
          setPhase("fallback");
        } else if (finalFirstPattern) {
          setResult(finalFirstPattern);
          setPhase("result");
        } else {
          setPhase("fallback");
        }
      }, 2500);
    }
  };

  const handleSelectFallbackPattern = (pattern: PatternType) => {
    setResult(pattern);
    setPhase("result");
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !result) return;
    
    setIsSubmitting(true);
    try {
      await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          pattern: result,
          timestamp: new Date().toISOString()
        })
      });
      
      window.location.href = `/thank-you?pattern=${result}`;
    } catch (error) {
      console.error("Failed to submit quiz:", error);
      window.location.href = `/thank-you?pattern=${result}`;
    }
  };

  const progress = phase === "questions" 
    ? ((currentQuestion + 1) / QUESTIONS.length) * 100 
    : phase === "analyzing" || phase === "result" || phase === "fallback"
      ? 100 
      : 0;

  return (
    <section className="py-24 px-4 bg-black relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(20, 184, 166, 0.15) 0%, transparent 70%)',
        }}
      />
      
      <div className="max-w-3xl mx-auto relative">
        <AnimatePresence mode="wait">
          {!isExpanded ? (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div 
                className="relative rounded-3xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.4) 0%, rgba(236, 72, 153, 0.4) 100%)',
                  padding: '2px',
                }}
              >
                <div 
                  className="absolute -inset-2 rounded-3xl opacity-40 blur-2xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.5) 0%, rgba(236, 72, 153, 0.5) 100%)',
                    animation: 'pulseGlow 4s ease-in-out infinite',
                  }}
                />
                
                <div 
                  className="relative rounded-3xl py-16 px-8 md:px-16 text-center"
                  style={{
                    background: 'rgba(3, 3, 3, 0.97)',
                    backdropFilter: 'blur(32px)',
                  }}
                >
                  <div className="flex justify-center mb-8">
                    <div className="relative">
                      <div 
                        className="absolute -inset-1 rounded-full"
                        style={{ 
                          background: 'linear-gradient(135deg, #14B8A6 0%, #EC4899 100%)',
                          padding: '3px',
                        }}
                      />
                      <img
                        src="/archivist-icon.png"
                        alt="The Archivist"
                        className="relative w-20 h-20 object-contain rounded-full"
                        style={{ 
                          background: '#030303',
                          boxShadow: '0 0 40px rgba(20, 184, 166, 0.3)'
                        }}
                      />
                      <div 
                        className="absolute -inset-3 rounded-full opacity-40 blur-xl -z-10"
                        style={{ background: 'linear-gradient(135deg, #14B8A6 0%, #EC4899 100%)' }}
                      />
                    </div>
                  </div>

                  <p className="text-gray-400 text-xs uppercase tracking-[0.2em] mb-6">Pattern Archaeology Session</p>

                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Which Pattern Is Running Your Life?
                  </h3>
                  
                  <p className="text-gray-400 text-base md:text-lg mb-12 max-w-md mx-auto">
                    Find yours in under 2 minutes — then get the free crash course to interrupt it.
                  </p>

                  <div className="max-w-sm mx-auto mb-12">
                    <div className="relative">
                      <div 
                        className="absolute left-[11px] top-[24px] w-[2px] h-[calc(100%-48px)]"
                        style={{ background: 'linear-gradient(180deg, rgba(20, 184, 166, 0.4) 0%, rgba(20, 184, 166, 0.1) 100%)' }}
                      />
                      
                      <div className="flex items-start gap-4 mb-6">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-500/20 border border-teal-500/50 flex items-center justify-center">
                          <span className="text-teal-400 text-xs font-medium">1</span>
                        </div>
                        <p className="text-gray-300 text-sm text-left pt-0.5">Take the 2-minute pattern quiz</p>
                      </div>
                      
                      <div className="flex items-start gap-4 mb-6">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-500/20 border border-teal-500/50 flex items-center justify-center">
                          <span className="text-teal-400 text-xs font-medium">2</span>
                        </div>
                        <p className="text-gray-300 text-sm text-left pt-0.5">Get your result + what's driving it</p>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-500/20 border border-teal-500/50 flex items-center justify-center">
                          <span className="text-teal-400 text-xs font-medium">3</span>
                        </div>
                        <p className="text-gray-300 text-sm text-left pt-0.5">Start the free 7-day crash course to interrupt it</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsExpanded(true)}
                    className="inline-flex items-center gap-3 px-10 py-4 rounded-xl text-lg font-semibold text-black transition-all hover:scale-105 hover:shadow-2xl"
                    style={{
                      background: 'linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)',
                      boxShadow: '0 8px 32px rgba(20, 184, 166, 0.4)',
                    }}
                    data-testid="button-start-quiz"
                  >
                    Start the Quiz
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  <p className="text-gray-500 text-sm mt-6">
                    Free • Private • Brutally Honest
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div 
                className="relative rounded-3xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.3) 0%, rgba(236, 72, 153, 0.3) 100%)',
                  padding: '1px',
                }}
              >
                <div 
                  className="relative rounded-3xl overflow-hidden"
                  style={{
                    background: 'rgba(3, 3, 3, 0.98)',
                    backdropFilter: 'blur(32px)',
                  }}
                >
                  {phase !== "intro" && (
                    <div className="h-1 bg-white/10">
                      <motion.div 
                        className="h-full"
                        style={{ background: 'linear-gradient(90deg, #14B8A6 0%, #EC4899 100%)' }}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  )}

                  <div 
                    className="flex items-center justify-between px-6 py-4 border-b border-white/10"
                    style={{ background: 'rgba(255, 255, 255, 0.02)' }}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src="/archivist-icon.png"
                        alt="The Archivist"
                        className="w-10 h-10 object-contain rounded-full"
                      />
                      <div>
                        <h4 className="text-white font-semibold">Pattern Archaeology Session</h4>
                        {phase === "questions" && (
                          <p className="text-teal-400 text-xs">Question {currentQuestion + 1} of {QUESTIONS.length}</p>
                        )}
                        {phase === "analyzing" && (
                          <p className="text-pink-400 text-xs animate-pulse">Analyzing your responses...</p>
                        )}
                        {phase === "result" && (
                          <p className="text-teal-400 text-xs">Pattern identified</p>
                        )}
                        {phase === "fallback" && (
                          <p className="text-pink-400 text-xs">Manual identification required</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="min-h-0 p-4 sm:p-6 md:p-8">
                    <AnimatePresence mode="wait">
                      {phase === "intro" && (
                        <motion.div
                          key="intro"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="flex flex-col items-center justify-center h-full text-center py-6 sm:py-12"
                        >
                          <div className="mb-8">
                            <img
                              src="/archivist-icon.png"
                              alt="The Archivist"
                              className="w-20 h-20 object-contain rounded-full mx-auto mb-6"
                              style={{ boxShadow: '0 0 30px rgba(20, 184, 166, 0.4)' }}
                            />
                            <p className="text-gray-300 text-lg leading-relaxed max-w-md mx-auto">
                              I'm The Archivist. I've catalogued over 10,000 destructive patterns. 
                              Answer 7 scenarios honestly and I'll identify which one is running your life.
                            </p>
                          </div>
                          
                          <Button
                            onClick={handleStart}
                            className="px-10 py-4 text-lg font-semibold"
                            style={{
                              background: 'linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)',
                            }}
                            data-testid="button-quiz-start"
                          >
                            Begin
                            <ArrowRight className="w-5 h-5 ml-2" />
                          </Button>
                        </motion.div>
                      )}

                      {phase === "questions" && (
                        <motion.div
                          key={`question-${currentQuestion}`}
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -50 }}
                          transition={{ duration: 0.3 }}
                          className="flex flex-col"
                        >
                          <div className="flex-1">
                            <p className="text-gray-200 text-base sm:text-lg md:text-xl leading-relaxed mb-4 sm:mb-6 md:mb-8">
                              {QUESTIONS[currentQuestion].prompt}
                            </p>
                            
                            <div className="space-y-2 sm:space-y-3">
                              {QUESTIONS[currentQuestion].options.map((option, index) => (
                                <motion.button
                                  key={index}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.1 * index }}
                                  onClick={() => handleSelectAnswer(index)}
                                  className={`w-full text-left px-3 py-3 sm:px-5 sm:py-4 rounded-xl border transition-all min-h-[44px] ${
                                    selectedAnswer === index 
                                      ? 'border-teal-500 bg-teal-500/10' 
                                      : 'border-white/10 hover:border-white/30 hover:bg-white/5'
                                  }`}
                                  data-testid={`button-answer-${index}`}
                                >
                                  <span className={`transition-colors text-sm sm:text-base ${
                                    selectedAnswer === index ? 'text-teal-300' : 'text-gray-300'
                                  }`}>
                                    {option}
                                  </span>
                                </motion.button>
                              ))}
                              
                              <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                onClick={() => handleSelectAnswer(3)}
                                className={`w-full text-left px-3 py-3 sm:px-5 sm:py-4 rounded-xl border transition-all min-h-[44px] ${
                                  selectedAnswer === 3 
                                    ? 'border-gray-500 bg-gray-500/10' 
                                    : 'border-white/5 hover:border-white/15 hover:bg-white/3'
                                }`}
                                data-testid="button-answer-none"
                              >
                                <span className={`transition-colors text-sm sm:text-base ${
                                  selectedAnswer === 3 ? 'text-gray-300' : 'text-gray-500'
                                }`}>
                                  None of these
                                </span>
                              </motion.button>
                            </div>
                          </div>
                          
                          <div className="flex justify-end mt-4 sm:mt-6 md:mt-8">
                            <Button
                              onClick={handleNext}
                              disabled={selectedAnswer === null}
                              className={`px-8 py-3 text-base font-semibold transition-all ${
                                selectedAnswer === null ? 'opacity-40 cursor-not-allowed' : ''
                              }`}
                              style={{
                                background: selectedAnswer !== null 
                                  ? 'linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)' 
                                  : 'rgba(255,255,255,0.1)',
                              }}
                              data-testid="button-next"
                            >
                              {currentQuestion === QUESTIONS.length - 1 ? 'See My Result' : 'Next'}
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </div>
                        </motion.div>
                      )}

                      {phase === "analyzing" && (
                        <motion.div
                          key="analyzing"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex flex-col items-center justify-center h-full text-center py-16"
                        >
                          <div className="relative mb-8">
                            <Loader2 className="w-16 h-16 text-teal-400 animate-spin" />
                            <div 
                              className="absolute inset-0 blur-xl opacity-50"
                              style={{ background: 'radial-gradient(circle, #14B8A6 0%, transparent 70%)' }}
                            />
                          </div>
                          <p className="text-gray-300 text-lg">Analyzing your responses...</p>
                          <p className="text-gray-500 text-sm mt-2">Cross-referencing with the archive</p>
                        </motion.div>
                      )}

                      {phase === "result" && result && (
                        <motion.div
                          key="result"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="space-y-8"
                        >
                          <div className="text-center">
                            <p className="text-teal-400 text-sm uppercase tracking-widest mb-3">Your Primary Pattern</p>
                            <h3 
                              className="text-3xl md:text-4xl font-bold mb-6"
                              style={{
                                background: 'linear-gradient(135deg, #14B8A6 0%, #EC4899 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                              }}
                            >
                              {PATTERNS[result].name}
                            </h3>
                            
                            <p className="text-gray-300 text-base leading-relaxed mb-6 max-w-lg mx-auto">
                              {PATTERNS[result].description}
                            </p>
                            
                            <div 
                              className="rounded-xl p-5 border border-teal-500/20 mb-8 max-w-lg mx-auto"
                              style={{ background: 'rgba(20, 184, 166, 0.05)' }}
                            >
                              <p className="text-teal-400 text-sm font-medium mb-2">Here's what's driving it:</p>
                              <p className="text-gray-400 text-sm leading-relaxed">
                                {PATTERNS[result].driver}
                              </p>
                            </div>
                          </div>
                          
                          <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto space-y-4">
                            <label className="block text-center text-white font-medium mb-4">
                              Get the free 7-day crash course
                            </label>
                            <div className="relative">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                              <Input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-12 py-6 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                                required
                                data-testid="input-email"
                              />
                            </div>
                            <Button
                              type="submit"
                              disabled={isSubmitting || !email}
                              className="w-full py-6 text-lg font-semibold"
                              style={{
                                background: 'linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)',
                              }}
                              data-testid="button-submit-email"
                            >
                              {isSubmitting ? (
                                <>
                                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                  Starting...
                                </>
                              ) : (
                                'Start Free Course'
                              )}
                            </Button>
                            <p className="text-gray-500 text-sm text-center">
                              Free • Private • Brutally Honest
                            </p>
                          </form>
                        </motion.div>
                      )}

                      {phase === "fallback" && (
                        <motion.div
                          key="fallback"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="space-y-6"
                        >
                          <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold text-white mb-3">
                              I can't identify your primary pattern from those responses.
                            </h3>
                            <p className="text-gray-400">
                              Let me show you all 7 — read through them and pick the one that made your stomach drop.
                            </p>
                          </div>
                          
                          <div className="grid gap-3 max-h-[400px] overflow-y-auto pr-2">
                            {(Object.entries(PATTERNS) as [PatternType, PatternInfo][]).map(([key, pattern], index) => (
                              <motion.button
                                key={key}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.05 * index }}
                                onClick={() => handleSelectFallbackPattern(key)}
                                className="w-full text-left p-4 rounded-xl border border-white/10 hover:border-teal-500/50 hover:bg-white/5 transition-all group"
                                data-testid={`button-pattern-${key}`}
                              >
                                <h4 className="text-white font-medium group-hover:text-teal-300 transition-colors">
                                  {pattern.name}
                                </h4>
                                <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                                  {pattern.description}
                                </p>
                              </motion.button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
