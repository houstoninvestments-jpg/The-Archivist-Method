import { useState, useEffect } from "react";
import { ArrowRight, Loader2, Mail, Check, ChevronRight } from "lucide-react";
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
  costs: string;
  lifeArea: string;
}

const PATTERNS: Record<PatternType, PatternInfo> = {
  "disappearing": {
    name: "The Disappearing Pattern",
    shortName: "Disappearing",
    description: "You vanish when relationships get close. When someone says 'I love you,' your chest tightens and you're mentally booking a flight by Tuesday. Intimacy triggers an overwhelming urge to flee.",
    costs: "Chronic loneliness. Serial almost-relationships. You can't maintain connections past 3 months because you ghost before they can leave you.",
    lifeArea: "relationships"
  },
  "apology-loop": {
    name: "The Apology Loop",
    shortName: "Apology Loop",
    description: "You apologize for existing. 'Sorry to bother you.' 'Sorry, quick question.' You minimize yourself before anyone else can, convinced you're fundamentally a burden.",
    costs: "You can't negotiate salary, state boundaries, or ask for what you need. People walk over you because you've trained them to.",
    lifeArea: "career and boundaries"
  },
  "testing": {
    name: "The Testing Pattern",
    shortName: "Testing",
    description: "You pick fights at 11pm to see if they'll still be there at breakfast. You create loyalty tests, push people away, and watch to see who fights to stay.",
    costs: "You exhaust partners who love you. The self-fulfilling prophecy plays out: you push until they leave, confirming your fear that no one stays.",
    lifeArea: "relationships"
  },
  "attraction-to-harm": {
    name: "Attraction to Harm",
    shortName: "Attraction to Harm",
    description: "The nice ones feel boring. The unavailable ones feel like chemistry. You see red flags and feel attraction, not warning. Chaos feels like home.",
    costs: "Serial toxic relationships. You can't stay attracted to healthy partners. The good ones feel wrong, so you keep choosing people who hurt you.",
    lifeArea: "love life"
  },
  "compliment-deflection": {
    name: "Compliment Deflection",
    shortName: "Compliment Deflection",
    description: "Someone says 'nice work' and you immediately minimize it. 'Oh, it was nothing. Anyone could have done it.' Visibility triggers panic. Being seen feels dangerous.",
    costs: "Career stagnation. You're underpaid despite talent. Invisible to people who could help you. Passed over for promotions you deserve.",
    lifeArea: "career"
  },
  "draining-bond": {
    name: "The Draining Bond",
    shortName: "Draining Bond",
    description: "You know you should leave. Your friends tell you to leave. Your therapist tells you to leave. But the guilt of abandoning them keeps you stuck.",
    costs: "Years in toxic jobs or relationships. Chronic depletion. You watch your life pass while staying bonded to people and situations that drain you.",
    lifeArea: "entire life"
  },
  "success-sabotage": {
    name: "Success Sabotage",
    shortName: "Success Sabotage",
    description: "You're three weeks from launching. Everything's going well. Suddenly you stop working on it. Or pick a fight with your partner. Or miss the deadline. Success feels dangerous.",
    costs: "A pattern of almost-success then failure. Perpetual struggle. You watch people with less talent succeed because they can tolerate winning.",
    lifeArea: "success"
  }
};

interface Scenario {
  id: number;
  prompt: string;
  options: {
    text: string;
    pattern: PatternType | null;
  }[];
}

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    prompt: "You meet someone. Three months in, they say 'I love you.' Choose what happens next:",
    options: [
      { text: "My chest gets tight, I need space", pattern: "disappearing" },
      { text: "I wonder if they really mean it", pattern: "testing" },
      { text: "I feel uncomfortable but stay", pattern: "attraction-to-harm" },
      { text: "None of these", pattern: null }
    ]
  },
  {
    id: 2,
    prompt: "Someone compliments your work publicly. Your immediate reaction:",
    options: [
      { text: "Minimize it — 'anyone could have done this'", pattern: "compliment-deflection" },
      { text: "Feel suspicious of their motives", pattern: "testing" },
      { text: "Apologize for something unrelated", pattern: "apology-loop" },
      { text: "None of these", pattern: null }
    ]
  },
  {
    id: 3,
    prompt: "You're approaching a major milestone. What typically happens?",
    options: [
      { text: "I sabotage it right before success", pattern: "success-sabotage" },
      { text: "I stay stuck in a situation holding me back", pattern: "draining-bond" },
      { text: "I pull away from the people supporting me", pattern: "disappearing" },
      { text: "None of these", pattern: null }
    ]
  },
  {
    id: 4,
    prompt: "When you need to ask for help, you typically:",
    options: [
      { text: "Start with 'Sorry to bother you...'", pattern: "apology-loop" },
      { text: "Avoid asking entirely", pattern: "disappearing" },
      { text: "Test if they'll offer first", pattern: "testing" },
      { text: "None of these", pattern: null }
    ]
  }
];

type QuizPhase = "intro" | "scenario" | "analyzing" | "result" | "select-pattern" | "email";

export default function PatternQuiz() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [phase, setPhase] = useState<QuizPhase>("intro");
  const [currentScenario, setCurrentScenario] = useState(0);
  const [patternCounts, setPatternCounts] = useState<Record<PatternType, number>>({
    "disappearing": 0,
    "apology-loop": 0,
    "testing": 0,
    "attraction-to-harm": 0,
    "compliment-deflection": 0,
    "draining-bond": 0,
    "success-sabotage": 0
  });
  const [noneCount, setNoneCount] = useState(0);
  const [result, setResult] = useState<PatternType | null>(null);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const [displayedText, setDisplayedText] = useState("");

  const typeText = (text: string, callback?: () => void) => {
    setShowTyping(true);
    setDisplayedText("");
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setShowTyping(false);
        if (callback) setTimeout(callback, 300);
      }
    }, 20);
  };

  useEffect(() => {
    if (phase === "intro" && isExpanded) {
      typeText("I'm The Archivist. I've catalogued over 10,000 destructive patterns. In the next 90 seconds, I'll identify which one is running your life. This works better if you're honest. Ready?");
    }
  }, [phase, isExpanded]);

  useEffect(() => {
    if (phase === "scenario" && currentScenario < SCENARIOS.length) {
      typeText(SCENARIOS[currentScenario].prompt);
    }
  }, [phase, currentScenario]);

  const handleStart = () => {
    setPhase("scenario");
    setCurrentScenario(0);
  };

  const handleAnswer = (pattern: PatternType | null) => {
    const nextNoneCount = pattern === null ? noneCount + 1 : noneCount;
    const nextPatternCounts = pattern === null 
      ? patternCounts 
      : { ...patternCounts, [pattern]: patternCounts[pattern] + 1 };

    if (pattern === null) {
      setNoneCount(nextNoneCount);
    } else {
      setPatternCounts(nextPatternCounts);
    }

    if (currentScenario < SCENARIOS.length - 1) {
      setCurrentScenario(prev => prev + 1);
    } else {
      setPhase("analyzing");
      setTimeout(() => {
        const topPattern = Object.entries(nextPatternCounts).reduce((a, b) => 
          a[1] > b[1] ? a : b
        );
        
        if (topPattern[1] >= 2) {
          setResult(topPattern[0] as PatternType);
          setPhase("result");
        } else if (nextNoneCount >= 3) {
          setPhase("select-pattern");
        } else {
          setPhase("select-pattern");
        }
      }, 2500);
    }
  };

  const handleSelectPattern = (pattern: PatternType) => {
    setResult(pattern);
    setPhase("result");
  };

  const handleConfirmPattern = (confirmed: boolean) => {
    if (confirmed) {
      setPhase("email");
    } else {
      setPhase("select-pattern");
    }
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

  const progress = phase === "scenario" 
    ? ((currentScenario + 1) / SCENARIOS.length) * 100 
    : phase === "analyzing" || phase === "result" || phase === "email" || phase === "select-pattern"
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
                  {/* Avatar with gradient ring */}
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

                  {/* Label */}
                  <p className="text-gray-400 text-xs uppercase tracking-[0.2em] mb-6">Pattern Archaeology Session</p>

                  {/* Headline */}
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Which Pattern Is Running Your Life?
                  </h3>
                  
                  {/* Subhead */}
                  <p className="text-gray-400 text-base md:text-lg mb-12 max-w-md mx-auto">
                    Find yours in under 2 minutes — then get the free crash course to interrupt it.
                  </p>

                  {/* Steps Section */}
                  <div className="max-w-sm mx-auto mb-12">
                    <div className="relative">
                      {/* Vertical connecting line */}
                      <div 
                        className="absolute left-[11px] top-[24px] w-[2px] h-[calc(100%-48px)]"
                        style={{ background: 'linear-gradient(180deg, rgba(20, 184, 166, 0.4) 0%, rgba(20, 184, 166, 0.1) 100%)' }}
                      />
                      
                      {/* Step 1 */}
                      <div className="flex items-start gap-4 mb-6">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-500/20 border border-teal-500/50 flex items-center justify-center">
                          <span className="text-teal-400 text-xs font-medium">1</span>
                        </div>
                        <p className="text-gray-300 text-sm text-left pt-0.5">Take the 2-minute pattern quiz</p>
                      </div>
                      
                      {/* Step 2 */}
                      <div className="flex items-start gap-4 mb-6">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-500/20 border border-teal-500/50 flex items-center justify-center">
                          <span className="text-teal-400 text-xs font-medium">2</span>
                        </div>
                        <p className="text-gray-300 text-sm text-left pt-0.5">Get your result + what's driving it</p>
                      </div>
                      
                      {/* Step 3 */}
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-500/20 border border-teal-500/50 flex items-center justify-center">
                          <span className="text-teal-400 text-xs font-medium">3</span>
                        </div>
                        <p className="text-gray-300 text-sm text-left pt-0.5">Start the free 7-day crash course to interrupt it</p>
                      </div>
                    </div>
                  </div>

                  {/* CTA Button */}
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

                  {/* Trust line */}
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
                  {/* Progress Bar */}
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

                  {/* Header */}
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
                        {phase === "scenario" && (
                          <p className="text-teal-400 text-xs">Scenario {currentScenario + 1} of {SCENARIOS.length}</p>
                        )}
                        {phase === "analyzing" && (
                          <p className="text-pink-400 text-xs animate-pulse">Analysis in progress...</p>
                        )}
                        {(phase === "result" || phase === "email") && (
                          <p className="text-teal-400 text-xs">Pattern identified</p>
                        )}
                        {phase === "select-pattern" && (
                          <p className="text-pink-400 text-xs">Manual identification required</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="min-h-[450px] md:min-h-[500px] p-6">
                    <AnimatePresence mode="wait">
                      {/* INTRO PHASE */}
                      {phase === "intro" && (
                        <motion.div
                          key="intro"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="space-y-6"
                        >
                          <div className="flex gap-4 items-start">
                            <div className="relative flex-shrink-0">
                              <img
                                src="/archivist-icon.png"
                                alt="The Archivist"
                                className="w-12 h-12 object-contain rounded-full"
                                style={{ boxShadow: '0 0 20px rgba(20, 184, 166, 0.3)' }}
                              />
                            </div>
                            <div
                              className="flex-1 rounded-2xl rounded-tl-md px-5 py-4 border-l-2 border-teal-500/50"
                              style={{ background: 'rgba(255, 255, 255, 0.06)' }}
                            >
                              <p className="text-gray-200 text-[15px] leading-relaxed">
                                {displayedText}
                                {showTyping && <span className="animate-pulse text-teal-400">|</span>}
                              </p>
                            </div>
                          </div>
                          
                          {!showTyping && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex justify-end"
                            >
                              <Button
                                onClick={handleStart}
                                className="px-8 py-3 text-base font-semibold"
                                style={{
                                  background: 'linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)',
                                }}
                                data-testid="button-quiz-start"
                              >
                                Yes, analyze me
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </Button>
                            </motion.div>
                          )}
                        </motion.div>
                      )}

                      {/* SCENARIO PHASE */}
                      {phase === "scenario" && (
                        <motion.div
                          key={`scenario-${currentScenario}`}
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -50 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-6"
                        >
                          <div className="flex gap-4 items-start">
                            <div className="relative flex-shrink-0">
                              <img
                                src="/archivist-icon.png"
                                alt="The Archivist"
                                className="w-12 h-12 object-contain rounded-full"
                                style={{ boxShadow: '0 0 20px rgba(20, 184, 166, 0.3)' }}
                              />
                            </div>
                            <div
                              className="flex-1 rounded-2xl rounded-tl-md px-5 py-4 border-l-2 border-teal-500/50"
                              style={{ background: 'rgba(255, 255, 255, 0.06)' }}
                            >
                              <p className="text-gray-200 text-[15px] leading-relaxed">
                                {displayedText}
                                {showTyping && <span className="animate-pulse text-teal-400">|</span>}
                              </p>
                            </div>
                          </div>
                          
                          {!showTyping && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 }}
                              className="space-y-3 pl-16"
                            >
                              {SCENARIOS[currentScenario].options.map((option, index) => (
                                <motion.button
                                  key={index}
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.1 * index }}
                                  onClick={() => handleAnswer(option.pattern)}
                                  className={`w-full text-left px-5 py-4 rounded-xl border transition-all group ${
                                    option.pattern === null 
                                      ? 'border-white/5 hover:border-white/20 hover:bg-white/3' 
                                      : 'border-white/10 hover:border-teal-500/50 hover:bg-white/5'
                                  }`}
                                  data-testid={`button-answer-${index}`}
                                >
                                  <span className={`transition-colors ${
                                    option.pattern === null 
                                      ? 'text-gray-500 group-hover:text-gray-400' 
                                      : 'text-gray-300 group-hover:text-white'
                                  }`}>
                                    {option.text}
                                  </span>
                                </motion.button>
                              ))}
                            </motion.div>
                          )}
                        </motion.div>
                      )}

                      {/* ANALYZING PHASE */}
                      {phase === "analyzing" && (
                        <motion.div
                          key="analyzing"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex flex-col items-center justify-center h-[400px] space-y-6"
                        >
                          <div className="relative">
                            <div 
                              className="w-24 h-24 rounded-full flex items-center justify-center"
                              style={{ background: 'linear-gradient(135deg, #14B8A6 0%, #EC4899 100%)' }}
                            >
                              <Loader2 className="w-12 h-12 text-white animate-spin" />
                            </div>
                            <div 
                              className="absolute -inset-6 rounded-full opacity-40 blur-2xl animate-pulse"
                              style={{ background: 'linear-gradient(135deg, #14B8A6 0%, #EC4899 100%)' }}
                            />
                          </div>
                          <p className="text-2xl text-gray-200 font-medium">Analyzing patterns...</p>
                          <p className="text-gray-500 text-sm">Cross-referencing behavioral signatures</p>
                        </motion.div>
                      )}

                      {/* RESULT PHASE */}
                      {phase === "result" && result && (
                        <motion.div
                          key="result"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          className="space-y-6"
                        >
                          <div className="text-center py-4">
                            <p className="text-gray-500 text-sm uppercase tracking-widest mb-3">Pattern Identified</p>
                            <motion.h3 
                              className="text-3xl md:text-4xl font-bold mb-6"
                              style={{
                                background: 'linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                              }}
                              initial={{ scale: 0.8 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 200 }}
                              data-testid="text-pattern-title"
                            >
                              You're running the {PATTERNS[result].shortName}.
                            </motion.h3>
                          </div>

                          <div 
                            className="rounded-2xl p-6 border border-white/10"
                            style={{ background: 'rgba(255, 255, 255, 0.03)' }}
                          >
                            <p className="text-gray-300 leading-relaxed mb-4">
                              {PATTERNS[result].description}
                            </p>
                            <div className="pt-4 border-t border-white/10">
                              <p className="text-pink-400 font-medium mb-2">What It Costs You:</p>
                              <p className="text-gray-400 text-sm leading-relaxed" data-testid="text-pattern-consequence">
                                {PATTERNS[result].costs}
                              </p>
                            </div>
                          </div>

                          <div className="text-center py-2">
                            <p className="text-gray-400 mb-4">This pattern has been running for years. Sound right?</p>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Button
                              onClick={() => handleConfirmPattern(true)}
                              className="px-8 py-3 text-base font-semibold"
                              style={{
                                background: 'linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)',
                              }}
                              data-testid="button-confirm-pattern"
                            >
                              <Check className="w-4 h-4 mr-2" />
                              Yes, that's me
                            </Button>
                            <Button
                              onClick={() => handleConfirmPattern(false)}
                              variant="outline"
                              className="px-8 py-3 text-base border-white/20 hover:bg-white/5"
                              data-testid="button-show-all-patterns"
                            >
                              No, show me all patterns
                            </Button>
                          </div>
                        </motion.div>
                      )}

                      {/* SELECT PATTERN PHASE */}
                      {phase === "select-pattern" && (
                        <motion.div
                          key="select-pattern"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="space-y-5"
                        >
                          <div className="flex gap-4 items-start mb-6">
                            <div className="relative flex-shrink-0">
                              <img
                                src="/archivist-icon.png"
                                alt="The Archivist"
                                className="w-12 h-12 object-contain rounded-full"
                                style={{ boxShadow: '0 0 20px rgba(20, 184, 166, 0.3)' }}
                              />
                            </div>
                            <div
                              className="flex-1 rounded-2xl rounded-tl-md px-5 py-4 border-l-2 border-pink-500/50"
                              style={{ background: 'rgba(255, 255, 255, 0.06)' }}
                            >
                              <p className="text-gray-200 text-[15px] leading-relaxed">
                                I can't identify your primary pattern from those responses. Let me show you all 7 — read through them and pick the one that made your stomach drop.
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                            {(Object.entries(PATTERNS) as [PatternType, PatternInfo][]).map(([key, pattern]) => (
                              <motion.button
                                key={key}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                onClick={() => handleSelectPattern(key)}
                                className="w-full text-left p-4 rounded-xl border border-white/10 hover:border-teal-500/50 hover:bg-white/5 transition-all group"
                                data-testid={`button-pattern-${key}`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-teal-400 font-medium group-hover:text-teal-300">
                                    {pattern.name}
                                  </span>
                                  <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-teal-400" />
                                </div>
                                <p className="text-gray-500 text-sm mt-1 line-clamp-2 group-hover:text-gray-400">
                                  {pattern.description.split('.')[0]}.
                                </p>
                              </motion.button>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* EMAIL CAPTURE PHASE */}
                      {phase === "email" && result && (
                        <motion.div
                          key="email"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="space-y-6"
                        >
                          <div className="text-center py-4">
                            <p className="text-gray-500 text-sm uppercase tracking-widest mb-3">Free Protocol</p>
                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                              Your {PATTERNS[result].shortName} is destroying your {PATTERNS[result].lifeArea}.
                            </h3>
                            <p className="text-gray-400 leading-relaxed">
                              I can teach you to interrupt it in 7 days. Want the protocol?
                            </p>
                          </div>

                          <form onSubmit={handleEmailSubmit} className="space-y-4">
                            <div className="relative">
                              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                              <Input
                                type="email"
                                placeholder="Your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-12 py-4 h-14 text-base bg-white/5 border-white/10 focus:border-teal-500/50 rounded-xl"
                                required
                                data-testid="input-quiz-email"
                              />
                            </div>
                            <Button
                              type="submit"
                              disabled={isSubmitting || !email}
                              className="w-full py-4 h-14 text-base font-semibold rounded-xl"
                              style={{
                                background: email && !isSubmitting 
                                  ? 'linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)' 
                                  : 'rgba(255,255,255,0.1)',
                              }}
                              data-testid="button-submit-email"
                            >
                              {isSubmitting ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                <>
                                  Send Me The Free Course
                                  <ArrowRight className="w-4 h-4 ml-2" />
                                </>
                              )}
                            </Button>
                          </form>

                          <p className="text-gray-600 text-xs text-center">
                            Your email is kept private. Unsubscribe anytime.
                          </p>
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

      <style>{`
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.02); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(20, 184, 166, 0.3);
          border-radius: 2px;
        }
      `}</style>
    </section>
  );
}
