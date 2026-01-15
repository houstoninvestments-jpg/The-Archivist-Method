import { useState, useEffect } from "react";
import { ArrowRight, Sparkles, Loader2, Mail, Check } from "lucide-react";
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
  description: string;
  costs: string;
}

const PATTERNS: Record<PatternType, PatternInfo> = {
  "disappearing": {
    name: "The Disappearing Pattern",
    description: "You vanish when relationships get close. When someone says 'I love you,' your chest tightens and you're mentally booking a flight by Tuesday. Intimacy triggers an overwhelming urge to flee.",
    costs: "Chronic loneliness. Serial almost-relationships. You can't maintain connections past 3 months because you ghost before they can leave you."
  },
  "apology-loop": {
    name: "The Apology Loop",
    description: "You apologize for existing. 'Sorry to bother you.' 'Sorry, quick question.' You minimize yourself before anyone else can, convinced you're fundamentally a burden.",
    costs: "You can't negotiate salary, state boundaries, or ask for what you need. People walk over you because you've trained them to."
  },
  "testing": {
    name: "The Testing Pattern",
    description: "You pick fights at 11pm to see if they'll still be there at breakfast. You create loyalty tests, push people away, and watch to see who fights to stay.",
    costs: "You exhaust partners who love you. The self-fulfilling prophecy plays out: you push until they leave, confirming your fear that no one stays."
  },
  "attraction-to-harm": {
    name: "Attraction to Harm",
    description: "The nice ones feel boring. The unavailable ones feel like chemistry. You see red flags and feel attraction, not warning. Chaos feels like home.",
    costs: "Serial toxic relationships. You can't stay attracted to healthy partners. The good ones feel wrong, so you keep choosing people who hurt you."
  },
  "compliment-deflection": {
    name: "Compliment Deflection",
    description: "Someone says 'nice work' and you immediately minimize it. 'Oh, it was nothing. Anyone could have done it.' Visibility triggers panic. Being seen feels dangerous.",
    costs: "Career stagnation. You're underpaid despite talent. Invisible to people who could help you. Passed over for promotions you deserve."
  },
  "draining-bond": {
    name: "The Draining Bond",
    description: "You know you should leave. Your friends tell you to leave. Your therapist tells you to leave. But the guilt of abandoning them keeps you stuck.",
    costs: "Years in toxic jobs or relationships. Chronic depletion. You watch your life pass while staying bonded to people and situations that drain you."
  },
  "success-sabotage": {
    name: "Success Sabotage",
    description: "You're three weeks from launching. Everything's going well. Suddenly you stop working on it. Or pick a fight with your partner. Or miss the deadline. Success feels dangerous.",
    costs: "A pattern of almost-success then failure. Perpetual struggle. You watch people with less talent succeed because they can tolerate winning."
  }
};

interface Question {
  id: number;
  text: string;
  options: {
    text: string;
    scores: Partial<Record<PatternType, number>>;
  }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "When someone gets emotionally close to you, what's your first instinct?",
    options: [
      { text: "Pull away or create distance", scores: { "disappearing": 2 } },
      { text: "Test if they really mean it", scores: { "testing": 2 } },
      { text: "Feel uncomfortable but stay", scores: { "compliment-deflection": 1, "apology-loop": 1 } }
    ]
  },
  {
    id: 2,
    text: "How do you feel when someone genuinely compliments your work?",
    options: [
      { text: "Immediately minimize it", scores: { "compliment-deflection": 2 } },
      { text: "Suspicious of their motives", scores: { "testing": 1, "attraction-to-harm": 1 } },
      { text: "Apologize for not doing better", scores: { "apology-loop": 2 } }
    ]
  },
  {
    id: 3,
    text: "You're 3 weeks from achieving a big goal. What typically happens?",
    options: [
      { text: "I find a way to sabotage it", scores: { "success-sabotage": 2 } },
      { text: "I lose interest or get distracted", scores: { "success-sabotage": 1, "disappearing": 1 } },
      { text: "Anxiety that something bad will happen", scores: { "success-sabotage": 2 } }
    ]
  },
  {
    id: 4,
    text: "When you need to ask for help, how do you typically start?",
    options: [
      { text: "'Sorry to bother you, but...'", scores: { "apology-loop": 2 } },
      { text: "I avoid asking at all", scores: { "disappearing": 1, "apology-loop": 1 } },
      { text: "I test if they'll offer first", scores: { "testing": 2 } }
    ]
  },
  {
    id: 5,
    text: "Safe, emotionally stable people feel...",
    options: [
      { text: "Boring or lacking chemistry", scores: { "attraction-to-harm": 2 } },
      { text: "Too good to be true", scores: { "testing": 1, "attraction-to-harm": 1 } },
      { text: "Like I don't deserve them", scores: { "apology-loop": 1, "compliment-deflection": 1 } }
    ]
  },
  {
    id: 6,
    text: "When thinking about leaving a toxic situation, you feel...",
    options: [
      { text: "Overwhelming guilt", scores: { "draining-bond": 2 } },
      { text: "Like you can't survive without it", scores: { "draining-bond": 2 } },
      { text: "That you caused it somehow", scores: { "apology-loop": 1, "draining-bond": 1 } }
    ]
  },
  {
    id: 7,
    text: "Your partner says 'I love you' for the first time. Your chest feels...",
    options: [
      { text: "Tight, like I need to escape", scores: { "disappearing": 2 } },
      { text: "Suspicious - waiting for the catch", scores: { "testing": 2 } },
      { text: "Warm but undeserving", scores: { "compliment-deflection": 1, "apology-loop": 1 } }
    ]
  }
];

type QuizPhase = "intro" | "questioning" | "analyzing" | "result" | "email";

export default function PatternQuiz() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [phase, setPhase] = useState<QuizPhase>("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<Record<PatternType, number>>({
    "disappearing": 0,
    "apology-loop": 0,
    "testing": 0,
    "attraction-to-harm": 0,
    "compliment-deflection": 0,
    "draining-bond": 0,
    "success-sabotage": 0
  });
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
    }, 25);
  };

  useEffect(() => {
    if (phase === "intro" && isExpanded) {
      typeText("I'm The Archivist. I can identify which pattern is destroying your life in under 2 minutes. Ready to find out which one you're running?");
    }
  }, [phase, isExpanded]);

  useEffect(() => {
    if (phase === "questioning" && currentQuestion < QUESTIONS.length) {
      typeText(QUESTIONS[currentQuestion].text);
    }
  }, [phase, currentQuestion]);

  const handleStart = () => {
    setPhase("questioning");
    setCurrentQuestion(0);
  };

  const handleAnswer = (optionIndex: number) => {
    const question = QUESTIONS[currentQuestion];
    const selectedOption = question.options[optionIndex];
    
    const newScores = { ...scores };
    Object.entries(selectedOption.scores).forEach(([pattern, score]) => {
      newScores[pattern as PatternType] += score;
    });
    setScores(newScores);

    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setPhase("analyzing");
      setTimeout(() => {
        const topPattern = Object.entries(newScores).reduce((a, b) => 
          a[1] > b[1] ? a : b
        )[0] as PatternType;
        setResult(topPattern);
        setPhase("result");
      }, 2000);
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

  const progress = phase === "questioning" 
    ? ((currentQuestion + 1) / QUESTIONS.length) * 100 
    : phase === "analyzing" || phase === "result" || phase === "email" 
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
                    <img
                      src="/archivist-icon.png"
                      alt="The Archivist"
                      className="w-20 h-20 object-contain"
                      style={{ background: 'transparent' }}
                    />
                  </div>

                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">
                    Which Pattern Is Destroying Your Life?
                  </h3>
                  
                  <p 
                    className="text-xl md:text-2xl font-medium mb-6"
                    style={{
                      background: 'linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Find Out in 2 Minutes
                  </p>

                  <p className="text-gray-300 text-lg leading-relaxed max-w-lg mx-auto mb-10">
                    Answer 7 quick questions and I'll identify the unconscious pattern sabotaging your relationships, career, or wellbeing.
                  </p>

                  <button
                    onClick={() => setIsExpanded(true)}
                    className="inline-flex items-center gap-3 px-10 py-4 rounded-xl text-lg font-semibold text-black transition-all hover:scale-105 hover:shadow-2xl"
                    style={{
                      background: 'linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)',
                      boxShadow: '0 8px 32px rgba(20, 184, 166, 0.4)',
                    }}
                    data-testid="button-start-quiz"
                  >
                    Take the Quiz
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  <p className="text-teal-500 text-sm mt-6 flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Free • Private • Instant Results
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
                        className="w-10 h-10 object-contain"
                      />
                      <div>
                        <h4 className="text-white font-semibold">Pattern Identification Quiz</h4>
                        {phase === "questioning" && (
                          <p className="text-teal-400 text-xs">Question {currentQuestion + 1} of {QUESTIONS.length}</p>
                        )}
                        {phase === "analyzing" && (
                          <p className="text-pink-400 text-xs">Analyzing patterns...</p>
                        )}
                        {(phase === "result" || phase === "email") && (
                          <p className="text-teal-400 text-xs">Results ready</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="min-h-[400px] md:min-h-[450px] p-6">
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
                          <div className="flex gap-3">
                            <div 
                              className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center"
                              style={{ background: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)' }}
                            >
                              <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div
                              className="max-w-[85%] rounded-2xl rounded-tl-md px-5 py-4 border-l-2 border-teal-500/50"
                              style={{ background: 'rgba(255, 255, 255, 0.06)' }}
                            >
                              <p className="text-gray-200 text-[15px] leading-relaxed">
                                {displayedText}
                                {showTyping && <span className="animate-pulse">|</span>}
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
                                Let's Do It
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </Button>
                            </motion.div>
                          )}
                        </motion.div>
                      )}

                      {/* QUESTIONING PHASE */}
                      {phase === "questioning" && (
                        <motion.div
                          key={`question-${currentQuestion}`}
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -50 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-6"
                        >
                          <div className="flex gap-3">
                            <div 
                              className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center"
                              style={{ background: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)' }}
                            >
                              <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div
                              className="max-w-[85%] rounded-2xl rounded-tl-md px-5 py-4 border-l-2 border-teal-500/50"
                              style={{ background: 'rgba(255, 255, 255, 0.06)' }}
                            >
                              <p className="text-gray-200 text-[15px] leading-relaxed">
                                {displayedText}
                                {showTyping && <span className="animate-pulse">|</span>}
                              </p>
                            </div>
                          </div>
                          
                          {!showTyping && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 }}
                              className="space-y-3 pl-12"
                            >
                              {QUESTIONS[currentQuestion].options.map((option, index) => (
                                <motion.button
                                  key={index}
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.1 * index }}
                                  onClick={() => handleAnswer(index)}
                                  className="w-full text-left px-5 py-4 rounded-xl border border-white/10 hover:border-teal-500/50 hover:bg-white/5 transition-all group"
                                  data-testid={`button-answer-${index}`}
                                >
                                  <span className="text-gray-300 group-hover:text-white transition-colors">
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
                          className="flex flex-col items-center justify-center h-[350px] space-y-6"
                        >
                          <div className="relative">
                            <div 
                              className="w-20 h-20 rounded-full flex items-center justify-center"
                              style={{ background: 'linear-gradient(135deg, #14B8A6 0%, #EC4899 100%)' }}
                            >
                              <Loader2 className="w-10 h-10 text-white animate-spin" />
                            </div>
                            <div 
                              className="absolute -inset-4 rounded-full opacity-50 blur-xl animate-pulse"
                              style={{ background: 'linear-gradient(135deg, #14B8A6 0%, #EC4899 100%)' }}
                            />
                          </div>
                          <p className="text-xl text-gray-300 font-medium">Analyzing your patterns...</p>
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
                          <div className="text-center mb-8">
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", delay: 0.2 }}
                              className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4"
                              style={{ background: 'linear-gradient(135deg, #14B8A6 0%, #EC4899 100%)' }}
                            >
                              <Check className="w-8 h-8 text-white" />
                            </motion.div>
                            <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">Your Primary Pattern</p>
                            <h3 
                              className="text-2xl md:text-3xl font-bold mb-4"
                              style={{
                                background: 'linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                              }}
                            >
                              {PATTERNS[result].name}
                            </h3>
                          </div>

                          <div 
                            className="rounded-xl p-5 space-y-4"
                            style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
                          >
                            <div>
                              <p className="text-pink-400 text-xs uppercase tracking-wider mb-2">What This Means</p>
                              <p className="text-gray-300 text-sm leading-relaxed">{PATTERNS[result].description}</p>
                            </div>
                            <div>
                              <p className="text-pink-400 text-xs uppercase tracking-wider mb-2">What It's Costing You</p>
                              <p className="text-gray-400 text-sm leading-relaxed">{PATTERNS[result].costs}</p>
                            </div>
                          </div>

                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                          >
                            <Button
                              onClick={() => setPhase("email")}
                              className="w-full py-4 text-base font-semibold"
                              style={{
                                background: 'linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)',
                              }}
                              data-testid="button-get-protocol"
                            >
                              Get the 7-Day Interrupt Protocol
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                            <p className="text-center text-gray-500 text-xs mt-3">
                              Free crash course to start interrupting this pattern
                            </p>
                          </motion.div>
                        </motion.div>
                      )}

                      {/* EMAIL PHASE */}
                      {phase === "email" && result && (
                        <motion.div
                          key="email"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="space-y-6"
                        >
                          <div className="text-center">
                            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                              Get Your Free 7-Day Protocol
                            </h3>
                            <p className="text-gray-400">
                              Learn to interrupt <span className="text-teal-400">{PATTERNS[result].name}</span> starting today
                            </p>
                          </div>

                          <form onSubmit={handleEmailSubmit} className="space-y-4">
                            <div className="relative">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                              <Input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="pl-12 py-6 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-teal-500"
                                data-testid="input-quiz-email"
                              />
                            </div>
                            <Button
                              type="submit"
                              disabled={isSubmitting || !email}
                              className="w-full py-4 text-base font-semibold disabled:opacity-50"
                              style={{
                                background: 'linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)',
                              }}
                              data-testid="button-submit-email"
                            >
                              {isSubmitting ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Sending...
                                </>
                              ) : (
                                <>
                                  Send My Protocol
                                  <ArrowRight className="w-4 h-4 ml-2" />
                                </>
                              )}
                            </Button>
                          </form>

                          <p className="text-center text-gray-500 text-xs">
                            You'll receive the 7-Day Crash Course + personalized pattern insights. No spam.
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
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.02); }
        }
      `}</style>
    </section>
  );
}
