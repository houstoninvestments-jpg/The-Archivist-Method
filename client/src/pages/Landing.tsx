import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { apiRequest } from "@/lib/queryClient";
import { quizQuestions, calculatePatternScores, determineQuizResult, calculateMatchPercent, patternDisplayNames, patternDescriptions, PatternKey } from '@/lib/quizData';
import { Check } from 'lucide-react';
import heroSeatedImg from "@assets/hero-archivist-seated.png";
import productCrashCourse from "@assets/product-crash-course.jpg";
import productFieldGuide from "@assets/product-field-guide.png";
import productCompleteArchive from "@assets/product-complete-archive.png";
import archivistPortrait from "@assets/archivist-portrait.jpg";

const StarField = ({ count = 200 }: { count?: number }) => {
  const stars = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 1.8 + 0.5,
    opacity: Math.random() * 0.6 + 0.15,
  }));
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none", overflow: "hidden" }}>
      {stars.map((s) => (
        <div
          key={s.id}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            background: "#fff",
            opacity: s.opacity,
          }}
        />
      ))}
    </div>
  );
};

const PARTICLE_COLORS = ["#ffffff", "#ffffff", "#14B8A6", "#14B8A6", "#EC4899"];

const FloatingParticles = ({ count = 40 }: { count?: number }) => {
  const rnd = (min: number, max: number) => Math.random() * (max - min) + min;
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: rnd(5, 95),
    y: rnd(5, 95),
    size: rnd(1, 3),
    opacity: rnd(0.1, 0.4),
    duration: rnd(15, 25),
    delay: rnd(-25, 0),
    color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
    x1: rnd(-30, 30), y1: rnd(-30, 30),
    x2: rnd(-30, 30), y2: rnd(-30, 30),
    x3: rnd(-30, 30), y3: rnd(-30, 30),
  }));
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 2, pointerEvents: "none", overflow: "hidden" }}>
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: p.color,
            opacity: p.opacity,
            animation: `particleDrift ${p.duration}s ease-in-out ${p.delay}s infinite`,
            ["--x1" as string]: `${p.x1}px`,
            ["--y1" as string]: `${p.y1}px`,
            ["--x2" as string]: `${p.x2}px`,
            ["--y2" as string]: `${p.y2}px`,
            ["--x3" as string]: `${p.x3}px`,
            ["--y3" as string]: `${p.y3}px`,
          }}
        />
      ))}
    </div>
  );
};

const patternCards = [
  { num: "01", name: "DISAPPEARING", desc: "You pull away the moment someone gets close. Not because you don't care. Because closeness feels like danger.", trigger: "They're getting too close. I need to leave before they see the real me." },
  { num: "02", name: "APOLOGY LOOP", desc: "You say sorry for being alive. For having needs. For taking up space. You've done it so long it feels normal.", trigger: "I'm sorry. I shouldn't have said anything. I'm sorry for being sorry." },
  { num: "03", name: "TESTING", desc: "You push people to their limit to see if they'll stay. Then hate yourself when they leave.", trigger: "If they really loved me, they'd stay no matter what I do." },
  { num: "04", name: "ATTRACTION TO HARM", desc: "You're drawn to people and things that hurt you. Not because you're broken. Because chaos feels like home.", trigger: "I know this person is bad for me. I can't stop going back." },
  { num: "05", name: "COMPLIMENT DEFLECTION", desc: "Someone says something good about you and your whole body fights it. You can't let it in.", trigger: "They don't mean it. And if they do, they're wrong." },
  { num: "06", name: "DRAINING BOND", desc: "You stay tied to people who drain you. You know you should leave. You can't make yourself go.", trigger: "I should leave. I know I should leave. I'll leave tomorrow." },
  { num: "07", name: "SUCCESS SABOTAGE", desc: "You wreck things right before they work. Jobs, love, projects. The closer you get, the harder you burn it down.", trigger: "It's actually going well. Something's about to go wrong. I'll just end it myself." },
  { num: "08", name: "PERFECTIONISM TRAP", desc: "Nothing is ever good enough to ship, share, or finish. You'd rather scrap it than put it out there flawed.", trigger: "It's not ready. It'll never be ready. I'd rather not ship it than ship it wrong." },
  { num: "09", name: "RAGE PATTERN", desc: "The anger comes fast and hot and way too big. After, you wonder who that was. It was the pattern.", trigger: "That was nothing. Why am I this angry. What's wrong with me." },
];

const archivesCaseFiles = [
  {
    num: "0041",
    pattern: "DISAPPEARING",
    reportBody: "Subject found pattern on Day 3 of Crash Course. First body signal caught: chest tightness before urge to ghost. First clean interrupt: Day 11.",
    breakthrough: "Subject stayed in the talk. First time in 14 years.",
    status: "PATTERN WEAKENING",
  },
  {
    num: "0087",
    pattern: "SUCCESS SABOTAGE",
    reportBody: "Subject caught pre-sabotage body signal (hands shaking, urge to delete project) 4 seconds before pattern fired. Applied circuit break.",
    breakthrough: "Did not destroy 6 months of work.",
    status: "INTERRUPT CONFIRMED",
  },
  {
    num: "0113",
    pattern: "APOLOGY LOOP",
    reportBody: "Subject caught herself mid-apology for asking a question at work. Felt throat tighten — body signal. Used circuit break: 'I don't need to say sorry for this.'",
    breakthrough: "Cut needless apologies by 60% in 3 weeks.",
    status: "PATTERN DISRUPTED",
  },
  {
    num: "0156",
    pattern: "TESTING",
    reportBody: "Subject caught testing behavior mid-fight with partner. Body signal: jaw clenching, urge to push harder. Applied interrupt. Chose to say what she needed instead of testing.",
    breakthrough: "Partner responded. Relationship intact.",
    status: "ACTIVE INTERRUPTION",
  },
];

const gutCheckPatterns = [
  { name: "THE DISAPPEARING PATTERN", color: "#14B8A6", desc: "You pull away the moment someone gets close." },
  { name: "THE APOLOGY LOOP", color: "#EC4899", desc: "You apologize for existing." },
  { name: "THE TESTING PATTERN", color: "#14B8A6", desc: "You push until they break." },
  { name: "ATTRACTION TO HARM", color: "#EC4899", desc: "Chaos feels like home." },
  { name: "COMPLIMENT DEFLECTION", color: "#14B8A6", desc: "You can't let anything good in." },
  { name: "THE DRAINING BOND", color: "#EC4899", desc: "You stay when you know you should leave." },
  { name: "SUCCESS SABOTAGE", color: "#14B8A6", desc: "You destroy it before it works." },
  { name: "THE PERFECTIONISM TRAP", color: "#EC4899", desc: "Nothing is ever good enough to finish." },
  { name: "THE RAGE PATTERN", color: "#14B8A6", desc: "The anger comes fast and way too big." },
];

const therapyRows = [
  ["Asks why you do it", "Teaches you to catch it happening"],
  ["Processes the past", "Interrupts the present"],
  ["Weekly sessions for months", "Works in 3-7 seconds"],
  ["Talks about feelings", "Reads body signatures"],
  ["Explores your childhood", "Interrupts your Tuesday"],
  ["Builds understanding", "Builds muscle memory"],
];

const forYouProse = [
  "You've named it. Picked it apart. Swore you'd stop. You did it again anyway.",
  "You're not looking for more insight. You're looking for something that works in the middle of the flood.",
];

const notForYou = [
  "You want a therapist.",
  "You want someone to tell you you're fine.",
  "You're not ready to look honestly.",
  "You need crisis support (call 988).",
];

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    if (ref.current) {
      ref.current.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    }
    return () => observer.disconnect();
  }, []);
  return ref;
}

function handleCheckout(product: string) {
  const endpoint = product === "quick-start"
    ? "/api/portal/checkout/quick-start"
    : "/api/portal/checkout/complete-archive";
  apiRequest("POST", endpoint)
    .then((res) => res.json())
    .then((data) => {
      if (data.url) window.location.href = data.url;
    })
    .catch(() => {});
}

function CTAButton({ text }: { text: string }) {
  return (
    <div className="cta-glow-wrap" data-testid="button-cta-wrap">
      <div className="cta-glow-border" />
      <Link
        href="/quiz"
        data-testid="button-cta"
        className="cta-glow-inner block text-center text-white tracking-[0.15em] uppercase"
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "15px", padding: "18px 48px" }}
      >
        {text} <ArrowRight className="inline w-4 h-4 ml-1" />
      </Link>
    </div>
  );
}

const feelSeenCopy: Record<PatternKey, string[]> = {
  disappearing: [
    "You leave before they can leave you. Three months in and your chest gets tight. You feel the walls closing. You're already planning your exit before they even know something's wrong.",
    "It's not that you don't care. You care so much it terrifies you. So you run. Every time."
  ],
  apologyLoop: [
    "Sorry. Sorry. Sorry. You apologize for asking. For needing. For taking up space. You make yourself small before anyone can tell you you're too much.",
    "You've turned \"sorry\" into a reflex. It leaves your mouth before you even know why. And every time, you shrink a little more."
  ],
  testing: [
    "You don't ask if they love you. You make them prove it. You pick fights at midnight. You push them away to see if they'll fight to stay.",
    "You already know how it ends. They leave. And part of you is relieved\u2014because at least you were right."
  ],
  attractionToHarm: [
    "The safe ones bore you. The red flags feel like chemistry. You know they're bad for you\u2014that's what makes it exciting.",
    "You've confused danger with desire so many times you don't know the difference anymore. Calm feels suspicious. Chaos feels like home."
  ],
  complimentDeflection: [
    "\"You're so talented.\" You flinch. You deflect. You explain why it wasn't that good. Visibility feels dangerous. Being seen feels like being a target.",
    "You've gotten so good at disappearing in plain sight that people don't even notice when you leave the room."
  ],
  drainingBond: [
    "You know you should leave. Everyone tells you to leave. Your body tells you to leave. You stay. The guilt of going feels worse than the pain of staying.",
    "You've forgotten what it feels like to have energy for yourself. Everything goes to them. Everything."
  ],
  successSabotage: [
    "You get close. Then you blow it up. Right before the win, something in you pulls the pin. You're not afraid of failure\u2014you're afraid of what happens if you actually succeed.",
    "You've snatched defeat from victory so many times it almost feels intentional. Because it is. You just don't know why yet."
  ],
  perfectionism: [
    "If it's not perfect, it's garbage. So you tweak endlessly. Or you don't start at all. You're not lazy\u2014you're terrified of the gap between your vision and your output.",
    "You have a graveyard of almost-finished things. Years of work no one has ever seen. Not because it isn't good\u2014because it isn't perfect."
  ],
  rage: [
    "It comes fast. One second you're fine, the next you're saying things you can't take back. The anger takes over. Afterward, you barely recognize who that was.",
    "The shame hits harder than the anger ever did. You promise it won't happen again. Until it does."
  ],
};

const bodyHighlightRegions: Record<string, { cx: number; cy: number; rx: number; ry: number }> = {
  "15a": { cx: 12, cy: 14, rx: 4, ry: 3 },
  "15b": { cx: 12, cy: 10, rx: 3, ry: 2 },
  "15c": { cx: 12, cy: 14, rx: 4, ry: 3 },
  "15d": { cx: 12, cy: 5, rx: 4, ry: 4 },
  "15e": { cx: 12, cy: 22, rx: 6, ry: 12 },
  "15f": { cx: 12, cy: 20, rx: 4, ry: 3 },
  "15g": { cx: 12, cy: 26, rx: 5, ry: 4 },
  "15h": { cx: 12, cy: 14, rx: 4, ry: 3 },
  "15i": { cx: 12, cy: 22, rx: 8, ry: 16 },
};

function BodySilhouette({ optionId, hovered }: { optionId: string; hovered: boolean }) {
  const region = bodyHighlightRegions[optionId];
  const isFullBody = optionId === "15e" || optionId === "15i";
  return (
    <svg width="24" height="40" viewBox="0 0 24 40" fill="none" style={{ flexShrink: 0 }}>
      <path
        d="M12 2 C14 2 15.5 3.5 15.5 5.5 C15.5 7.5 14 9 12 9 C10 9 8.5 7.5 8.5 5.5 C8.5 3.5 10 2 12 2 Z M12 9.5 C14.5 9.5 17 11 17 13.5 L17 22 C17 22.5 16.5 23 16 23 L15.5 23 L15.5 33 C15.5 34 14.5 35 13.5 35 L10.5 35 C9.5 35 8.5 34 8.5 33 L8.5 23 L8 23 C7.5 23 7 22.5 7 22 L7 13.5 C7 11 9.5 9.5 12 9.5 Z"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="0.5"
        fill="none"
      />
      {hovered && region && (
        <ellipse
          cx={region.cx}
          cy={region.cy}
          rx={region.rx}
          ry={region.ry}
          fill="#14B8A6"
          opacity={isFullBody ? 0.15 : 0.4}
        />
      )}
    </svg>
  );
}

function EmbeddedQuiz() {
  const [phase, setPhase] = useState<'quiz' | 'analyzing' | 'glitch' | 'reveal' | 'emailCapture'>('quiz');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [primaryPattern, setPrimaryPattern] = useState<PatternKey | null>(null);
  const [scores, setScores] = useState<Record<PatternKey, number> | null>(null);
  const [glitchText, setGlitchText] = useState('');
  const [typewriterDone, setTypewriterDone] = useState(false);
  const [copyVisible, setCopyVisible] = useState(false);
  const [slideDir, setSlideDir] = useState<'left' | 'right'>('left');
  const [sliding, setSliding] = useState(false);
  const [showManualSelect, setShowManualSelect] = useState(false);
  const [confirmedPattern, setConfirmedPattern] = useState<PatternKey | null>(null);
  const [buttonsVisible, setButtonsVisible] = useState(false);
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const typewriterRef = useRef<HTMLSpanElement>(null);

  const question = quizQuestions[currentQuestion];
  const isLastQuestion = currentQuestion === 14;
  const progressPct = ((currentQuestion + 1) / 15) * 100;

  const handleAnswer = useCallback((optionId: string) => {
    const newAnswers = { ...answers, [question.id]: optionId };
    setAnswers(newAnswers);

    setTimeout(() => {
      if (isLastQuestion) {
        setPhase('analyzing');
      } else {
        setSlideDir('left');
        setSliding(true);
        setTimeout(() => {
          setCurrentQuestion(prev => prev + 1);
          setSliding(false);
        }, 200);
      }
    }, 400);
  }, [answers, question, isLastQuestion]);

  const handleBack = useCallback(() => {
    if (currentQuestion > 0) {
      setSlideDir('right');
      setSliding(true);
      setTimeout(() => {
        setCurrentQuestion(prev => prev - 1);
        setSliding(false);
      }, 200);
    }
  }, [currentQuestion]);

  useEffect(() => {
    if (phase === 'analyzing') {
      const timer = setTimeout(() => {
        const calcScores = calculatePatternScores(answers);
        const result = determineQuizResult(calcScores);
        setScores(calcScores);
        setPrimaryPattern(result.primaryPattern);
        setPhase('glitch');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [phase, answers]);

  useEffect(() => {
    if (phase === 'glitch' && primaryPattern) {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&";
      const targetLen = patternDisplayNames[primaryPattern]?.length || 12;

      const scrambleInterval = setInterval(() => {
        let s = "";
        for (let j = 0; j < targetLen; j++) s += chars[Math.floor(Math.random() * chars.length)];
        setGlitchText(s);
      }, 30);

      const timer = setTimeout(() => {
        clearInterval(scrambleInterval);
        setGlitchText('');
        setPhase('reveal');
      }, 300);

      return () => { clearInterval(scrambleInterval); clearTimeout(timer); };
    }
  }, [phase, primaryPattern]);

  useEffect(() => {
    if (phase === 'reveal' && primaryPattern) {
      setTypewriterDone(false);
      setCopyVisible(false);
      setButtonsVisible(false);

      const el = typewriterRef.current;
      if (el) {
        el.textContent = '';
        let i = 0;
        const text = patternDisplayNames[primaryPattern];
        const speed = Math.max(30, 200 / text.length);
        const interval = setInterval(() => {
          if (i < text.length) {
            el.textContent += text[i];
            i++;
          } else {
            clearInterval(interval);
            setTypewriterDone(true);
            setTimeout(() => setCopyVisible(true), 200);
            setTimeout(() => setButtonsVisible(true), 600);
          }
        }, speed);
        return () => clearInterval(interval);
      }
    }
  }, [phase, primaryPattern]);

  const handleConfirmYes = useCallback(() => {
    setConfirmedPattern(primaryPattern);
    setPhase('emailCapture');
  }, [primaryPattern]);

  const handleNotQuite = useCallback(() => {
    setShowManualSelect(true);
  }, []);

  const handleManualSelect = useCallback((pattern: PatternKey) => {
    setConfirmedPattern(pattern);
    setPrimaryPattern(pattern);
    setShowManualSelect(false);
    setPhase('emailCapture');
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    const finalPattern = confirmedPattern || primaryPattern;
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email,
          primaryPattern: finalPattern,
          secondaryPatterns: [],
          patternScores: scores || {},
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save results');
      }

      localStorage.setItem('quizResultPattern', finalPattern || '');
      localStorage.setItem('userEmail', email);
      if (scores) localStorage.setItem('quizScores', JSON.stringify(scores));

      window.location.href = '/portal';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setSubmitting(false);
    }
  }, [email, confirmedPattern, primaryPattern, scores]);

  const containerStyle: React.CSSProperties = {
    background: "#0D0D0D",
    border: "1px solid #14B8A6",
    padding: "32px",
    maxWidth: "580px",
    margin: "0 auto",
    position: "relative",
    overflow: "hidden",
  };

  if (phase === 'analyzing') {
    return (
      <div style={containerStyle} data-testid="embedded-quiz-analyzing">
        <div style={{ textAlign: "center", padding: "48px 0" }}>
          <div style={{
            width: "32px", height: "32px", border: "2px solid rgba(20,184,166,0.3)",
            borderTopColor: "#14B8A6", borderRadius: "50%", margin: "0 auto 24px",
            animation: "spin 1s linear infinite",
          }} />
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "#14B8A6", textTransform: "uppercase", letterSpacing: "0.15em" }}>
            Analyzing Your Patterns...
          </p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (phase === 'glitch') {
    return (
      <div style={containerStyle} data-testid="embedded-quiz-glitch">
        <div style={{ position: "absolute", left: 0, right: 0, top: "30%", height: "1px", background: "rgba(255,255,255,0.2)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: "60%", height: "1px", background: "rgba(255,255,255,0.15)", pointerEvents: "none" }} />
        <div style={{ textAlign: "center", padding: "48px 0" }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "clamp(1.2rem, 3vw, 1.8rem)", color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em" }} data-testid="text-embedded-glitch">
            {glitchText}
          </p>
        </div>
      </div>
    );
  }

  if (phase === 'reveal' && primaryPattern) {
    const currentCopy = feelSeenCopy[primaryPattern] || [];
    const patternScore = (scores?.[primaryPattern] as number) || 0;
    const totalAnswered = scores ? (Object.values(scores) as number[]).reduce((a, b) => a + b, 0) : 0;
    const matchPct = calculateMatchPercent(patternScore, totalAnswered);

    if (showManualSelect) {
      const allPatterns: PatternKey[] = [
        'disappearing', 'apologyLoop', 'testing', 'attractionToHarm',
        'complimentDeflection', 'drainingBond', 'successSabotage', 'perfectionism', 'rage'
      ];
      return (
        <div style={containerStyle} data-testid="embedded-quiz-manual-select">
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <p style={{ fontFamily: "'Schibsted Grotesk', sans-serif", fontWeight: 700, fontSize: "1.3rem", color: "white", marginBottom: "8px" }}>
              Which pattern do you recognize?
            </p>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", color: "#999" }}>
              Select the one that lives in your body.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
            {allPatterns.map((pattern) => (
              <button
                key={pattern}
                data-testid={`embedded-pattern-card-${pattern}`}
                onClick={() => handleManualSelect(pattern)}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(20,184,166,0.3)",
                  padding: "12px 8px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 200ms ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#14B8A6"; e.currentTarget.style.background = "rgba(20,184,166,0.08)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(20,184,166,0.3)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
              >
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "white", marginBottom: "4px" }}>
                  {patternDisplayNames[pattern]}
                </p>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "11px", color: "#777", lineHeight: 1.4 }}>
                  {patternDescriptions[pattern].slice(0, 60)}...
                </p>
              </button>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div style={containerStyle} data-testid="embedded-quiz-reveal">
        <div style={{ textAlign: "center" }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "#737373", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "24px" }}>
            Pattern Identified
          </p>

          <div style={{ transition: "all 500ms", opacity: typewriterDone ? 1 : 0, transform: typewriterDone ? "translateY(0)" : "translateY(8px)" }}>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "clamp(2rem, 4vw, 3rem)", color: "#14B8A6", fontWeight: 700, marginBottom: "12px" }} data-testid="text-embedded-match-pct">
              {matchPct}% MATCH
            </p>
            <div style={{ maxWidth: "360px", margin: "0 auto 20px", height: "4px", background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
              <div style={{ width: `${matchPct}%`, height: "100%", background: "#14B8A6", transition: "width 1s ease-out" }} data-testid="bar-embedded-match" />
            </div>
          </div>

          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)", color: "white", fontWeight: 700, marginBottom: "8px" }} data-testid="text-embedded-pattern-name">
            <span ref={typewriterRef} />
            {!typewriterDone && <span style={{ color: "#14B8A6", animation: "blink 0.8s step-end infinite" }}>|</span>}
          </h3>

          <div style={{ height: "2px", width: "64px", background: "#14B8A6", margin: "0 auto 24px", opacity: typewriterDone ? 1 : 0, transition: "opacity 300ms" }} />

          <div style={{ opacity: copyVisible ? 1 : 0, transform: copyVisible ? "translateY(0)" : "translateY(12px)", transition: "all 300ms", marginBottom: "32px" }}>
            {currentCopy.map((paragraph, i) => (
              <p key={i} style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "1.05rem", color: "#ccc", lineHeight: 1.7, maxWidth: "460px", margin: "0 auto 12px" }}>
                {paragraph}
              </p>
            ))}
          </div>

          <div style={{ opacity: buttonsVisible ? 1 : 0, transform: buttonsVisible ? "translateY(0)" : "translateY(12px)", transition: "all 300ms" }}>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: "white", fontWeight: 500, marginBottom: "16px" }} data-testid="text-embedded-confirmation">
              Does this sound like you?
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                data-testid="button-embedded-yes"
                onClick={handleConfirmYes}
                style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", textTransform: "uppercase",
                  letterSpacing: "0.1em", border: "1px solid rgba(20,184,166,0.5)", background: "transparent",
                  color: "white", padding: "12px 28px", cursor: "pointer", transition: "all 200ms ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#14B8A6"; e.currentTarget.style.background = "rgba(20,184,166,0.08)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(20,184,166,0.5)"; e.currentTarget.style.background = "transparent"; }}
              >
                Yes, that's me
              </button>
              <button
                data-testid="button-embedded-not-quite"
                onClick={handleNotQuite}
                style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", textTransform: "uppercase",
                  letterSpacing: "0.1em", border: "1px solid rgba(255,255,255,0.15)", background: "transparent",
                  color: "#999", padding: "12px 28px", cursor: "pointer", transition: "all 200ms ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; e.currentTarget.style.color = "white"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = "#999"; }}
              >
                Not quite
              </button>
            </div>
          </div>
        </div>
        <style>{`@keyframes blink { 50% { opacity: 0; } }`}</style>
      </div>
    );
  }

  if (phase === 'emailCapture') {
    const finalPattern = confirmedPattern || primaryPattern;
    const finalName = finalPattern ? patternDisplayNames[finalPattern] : '';

    return (
      <div style={containerStyle} data-testid="embedded-quiz-email">
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.2em", color: "#14B8A6", fontWeight: 600, marginBottom: "12px" }}>
            Pattern Confirmed
          </p>
          <h3 style={{ fontFamily: "'Schibsted Grotesk', sans-serif", fontWeight: 700, fontSize: "1.5rem", color: "white", marginBottom: "8px" }}>
            {finalName}
          </h3>
          <div style={{ height: "2px", width: "48px", background: "#14B8A6", margin: "0 auto 12px" }} />
          <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem", color: "#999" }}>
            Your full breakdown is waiting in your personal portal.
          </p>
        </div>

        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", padding: "16px", marginBottom: "20px" }}>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[
              'Complete pattern analysis',
              'Your body signature (the 3-7 second warning)',
              'The Four Doors Protocol for your pattern',
              'AI Pattern Coach (24/7)',
              'The Crash Course (free)',
            ].map((item, i) => (
              <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: i < 4 ? "10px" : 0 }}>
                <Check style={{ width: "14px", height: "14px", color: "#14B8A6", marginTop: "2px", flexShrink: 0 }} />
                <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: "#ccc" }}>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            data-testid="input-embedded-email"
            style={{
              width: "100%", padding: "14px 16px", background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.15)", color: "white", fontSize: "0.95rem",
              fontFamily: "'Source Sans 3', sans-serif", marginBottom: "12px", outline: "none",
              boxSizing: "border-box",
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "#14B8A6"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}
          />
          <button
            type="submit"
            disabled={submitting}
            data-testid="button-embedded-submit"
            style={{
              width: "100%", padding: "14px", background: "#14B8A6", color: "#000",
              fontFamily: "'JetBrains Mono', monospace", fontSize: "14px", fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "0.1em", border: "none", cursor: "pointer",
              opacity: submitting ? 0.5 : 1, transition: "opacity 200ms",
            }}
          >
            {submitting ? 'Opening Archive...' : 'Send Magic Link'}
          </button>
          {error && <p style={{ color: "#EF4444", fontSize: "0.85rem", textAlign: "center", marginTop: "8px" }} role="alert">{error}</p>}
        </form>

        <p style={{ textAlign: "center", fontFamily: "'Source Sans 3', sans-serif", fontSize: "12px", color: "#666", marginTop: "16px" }}>
          {"Free access \u00b7 No spam \u00b7 Instant portal entry"}
        </p>
      </div>
    );
  }

  return (
    <div style={containerStyle} data-testid="embedded-quiz">
      <div style={{ height: "3px", background: "rgba(255,255,255,0.06)", marginBottom: "24px", overflow: "hidden" }}>
        <div style={{ width: `${progressPct}%`, height: "100%", background: "#14B8A6", transition: "width 300ms ease" }} data-testid="bar-quiz-progress" />
      </div>

      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#EC4899", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "12px" }} data-testid="text-question-counter">
        QUESTION {currentQuestion + 1} OF 15
      </p>

      <div style={{ overflow: "hidden" }}>
        <div style={{
          transform: sliding ? (slideDir === 'left' ? 'translateX(-100%)' : 'translateX(100%)') : 'translateX(0)',
          transition: sliding ? 'transform 200ms ease' : 'none',
          opacity: sliding ? 0 : 1,
        }}>
          <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "1.15rem", color: "white", marginBottom: "8px", lineHeight: 1.4 }} data-testid="text-question-title">
            {question.title}
          </p>

          {question.weight === 2 && (
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#14B8A6", marginBottom: "12px" }}>
              counts 2x
            </p>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "16px" }}>
            {question.options.map((option) => {
              const isQ15 = question.id === 15;
              const isHovered = hoveredOption === option.id;
              return (
                <button
                  key={option.id}
                  data-testid={`button-option-${option.id}`}
                  onClick={() => handleAnswer(option.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: isQ15 ? "12px" : "0",
                    background: answers[question.id] === option.id ? "rgba(20,184,166,0.2)" : isHovered ? "rgba(20,184,166,0.15)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${isHovered ? "#14B8A6" : "rgba(20,184,166,0.3)"}`,
                    color: isHovered ? "#14B8A6" : "white",
                    padding: "12px 16px",
                    fontFamily: "'Source Sans 3', sans-serif",
                    fontSize: "0.9rem",
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "all 200ms ease",
                    width: "100%",
                  }}
                  onMouseEnter={() => setHoveredOption(option.id)}
                  onMouseLeave={() => setHoveredOption(null)}
                >
                  {isQ15 && <BodySilhouette optionId={option.id} hovered={isHovered} />}
                  <span>{option.text}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {currentQuestion > 0 && (
        <button
          onClick={handleBack}
          data-testid="button-quiz-back"
          style={{
            background: "none", border: "none", color: "#666", fontSize: "12px",
            fontFamily: "'JetBrains Mono', monospace", cursor: "pointer", marginTop: "16px",
            padding: "4px 0", transition: "color 200ms",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#999"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "#666"; }}
        >
          &larr; Back
        </button>
      )}
    </div>
  );
}

function SectionLabel({ children }: { children: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const glitched = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !glitched.current) {
          glitched.current = true;
          el.classList.add("scanline-glitch");
          setTimeout(() => el.classList.remove("scanline-glitch"), 300);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <p ref={ref} className="reveal" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "#14B8A6", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "16px" }}>
      {children}
    </p>
  );
}

function PatternCard({ card, index }: { card: typeof patternCards[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={cardRef}
      className="reveal"
      style={{
        position: "relative",
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
        padding: "32px",
        transition: "border-color 0.3s",
        transitionDelay: `${(index % 3) * 0.1}s`,
        cursor: "pointer",
      }}
      data-testid={`card-pattern-${card.num}`}
      onMouseEnter={() => {
        setHovered(true);
        if (cardRef.current) cardRef.current.style.borderColor = index % 2 === 0 ? "#14B8A6" : "#EC4899";
      }}
      onMouseLeave={() => {
        setHovered(false);
        if (cardRef.current) cardRef.current.style.borderColor = "rgba(255,255,255,0.06)";
      }}
      onClick={() => setHovered(prev => !prev)}
    >
      <p style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "2rem",
        color: "#EC4899",
        marginBottom: "12px",
        textShadow: "0 0 6px rgba(236,72,153,0.3)",
        letterSpacing: "0.05em",
      }}>{card.num}</p>
      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", color: "white", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>{card.name}</p>
      <div style={{ position: "relative", minHeight: "4.5em" }}>
        <p
          style={{
            color: "#999",
            fontSize: "0.95rem",
            lineHeight: 1.6,
            transition: "opacity 0.3s ease",
            opacity: hovered ? 0 : 1,
            position: hovered ? "absolute" : "relative",
            inset: hovered ? 0 : undefined,
          }}
        >
          {card.desc}
        </p>
        <p
          data-testid={`text-trigger-${card.num}`}
          style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontStyle: "italic",
            color: "white",
            fontSize: "0.95rem",
            lineHeight: 1.6,
            transition: "opacity 0.3s ease",
            opacity: hovered ? 1 : 0,
            position: hovered ? "relative" : "absolute",
            inset: hovered ? undefined : 0,
          }}
        >
          "{card.trigger}"
        </p>
      </div>
    </div>
  );
}


function SectorLabel({ text }: { text: string }) {
  return (
    <span
      className="hidden md:block"
      style={{
        position: "absolute",
        top: "16px",
        right: "24px",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "9px",
        color: "rgba(255,255,255,0.12)",
        letterSpacing: "0.05em",
        pointerEvents: "none",
        zIndex: 1,
      }}
    >
      {text}
    </span>
  );
}

function GutCheckItem({ pattern, index, isLast }: { pattern: typeof gutCheckPatterns[0]; index: number; isLast: boolean }) {
  const [active, setActive] = useState(false);

  return (
    <div className="gut-pattern-slide reveal" style={{ transitionDelay: `${index * 0.15}s`, textAlign: "center" }}>
      <div
        style={{ cursor: "pointer", padding: "8px 0" }}
        data-testid={`text-gut-pattern-${index}`}
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
        onClick={() => setActive(prev => !prev)}
      >
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "1.1rem",
            textTransform: "uppercase",
            color: pattern.color,
            transition: "transform 0.3s ease, text-shadow 0.3s ease",
            transform: active ? "scale(1.05)" : "scale(1)",
            textShadow: active ? `0 0 20px ${pattern.color}60` : "none",
            margin: 0,
          }}
        >
          {pattern.name}
        </p>
        <p
          data-testid={`text-gut-desc-${index}`}
          style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: "13px",
            color: "#888",
            fontStyle: "italic",
            opacity: active ? 1 : 0,
            maxHeight: active ? "30px" : "0",
            overflow: "hidden",
            transition: "opacity 0.4s ease, max-height 0.4s ease, margin 0.4s ease",
            marginTop: active ? "6px" : "0",
            whiteSpace: "nowrap",
          }}
        >
          {pattern.desc}
        </p>
      </div>
      {!isLast && (
        <div style={{ position: "relative", margin: "14px auto", width: "120px", height: "1px" }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(20,184,166,0.15)" }} />
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "5px", height: "5px", borderRadius: "50%", background: "#14B8A6", opacity: 0.5 }} />
        </div>
      )}
    </div>
  );
}

function CaseFileCard({ file, index }: { file: typeof archivesCaseFiles[0]; index: number }) {
  const [declassified, setDeclassified] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const archiveRef = useMemo(() => String(Math.floor(100000 + Math.random() * 900000)), []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleDeclassify = () => {
    if (!declassified) setDeclassified(true);
  };

  return (
    <div
      className="reveal candle-flicker"
      style={{
        position: "relative",
        background: "#1a1510",
        padding: "28px",
        transitionDelay: `${(index % 2) * 0.15}s`,
        boxShadow: "3px 2px 0 rgba(0,0,0,0.4), -1px -1px 0 rgba(255,255,255,0.03), inset 0 0 30px rgba(0,0,0,0.3)",
        animationName: `candleFlicker${(index % 3) + 1}`,
        animationDuration: `${3 + (index * 0.7)}s`,
      }}
      data-testid={`card-case-file-${file.num}`}
      onMouseEnter={!isMobile ? handleDeclassify : undefined}
      onClick={isMobile ? handleDeclassify : undefined}
    >
      <div style={{
        position: "absolute",
        top: "12px",
        right: "16px",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "9px",
        color: "#EC4899",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        opacity: 0.7,
        transform: "rotate(-2deg)",
      }}>
        ARCHIVE REF: {archiveRef}
      </div>
      <div style={{ marginBottom: "16px" }}>
        <div className="flex items-center gap-3 flex-wrap" style={{ marginBottom: "8px" }}>
          <span style={{ fontFamily: "'Special Elite', cursive", fontSize: "13px", color: "#14B8A6", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            CASE FILE {file.num}
          </span>
          <span style={{ fontFamily: "'Special Elite', cursive", fontSize: "13px", color: "#737373" }}>|</span>
          <span style={{ fontFamily: "'Special Elite', cursive", fontSize: "13px", color: "#999", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            PATTERN: {file.pattern}
          </span>
        </div>
        <div style={{ background: "#0D0D0D", height: "12px", width: "120px", marginTop: "8px" }} aria-label="Redacted name" />
      </div>
      <p style={{ fontFamily: "'Special Elite', cursive", fontSize: "14px", color: "#b0a890", lineHeight: 1.8, marginBottom: "12px" }}>
        "{file.reportBody}"
      </p>
      <div style={{ position: "relative", marginBottom: "8px", overflow: "hidden" }}>
        <p
          data-testid={`text-breakthrough-${file.num}`}
          style={{
            fontFamily: "'Special Elite', cursive",
            fontSize: "14px",
            color: "#14B8A6",
            lineHeight: 1.8,
            fontWeight: 400,
          }}
        >
          "{file.breakthrough}"
        </p>
        <div
          data-testid={`redaction-bar-${file.num}`}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "#1a1510",
            transform: declassified ? "translateX(101%)" : "translateX(0)",
            transition: "transform 0.6s ease",
          }}
        />
      </div>
      <p
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "10px",
          color: "#555",
          marginBottom: "16px",
          transition: "opacity 0.3s",
          opacity: declassified ? 0 : 1,
        }}
      >
        {isMobile ? "[ TAP TO DECLASSIFY ]" : "[ HOVER TO DECLASSIFY ]"}
      </p>
      <p style={{ fontFamily: "'Special Elite', cursive", fontSize: "12px", color: "#666", textTransform: "uppercase", letterSpacing: "0.1em" }}>
        STATUS: {file.status}
      </p>
    </div>
  );
}

type WindowPhase = "idle" | "preIntro" | "circuit" | "barTrigger" | "barSignature" | "barGap" | "barGapText1" | "barGapText2" | "aftermath1" | "aftermath2" | "threeSecTest" | "done";

const patternFileCards = [
  { stamp: "TRIGGER", caseNum: "01", headline: "Something happens.", body: "A look. A tone. A silence. Your nervous system flags it as danger before you hear a word.", side: "left" as const, rotate: -1.5 },
  { stamp: "AMYGDALA FIRE", caseNum: "02", headline: "Your survival brain takes over.", body: "80,000x faster than thought. The pattern is already loading. Your CEO hasn't even been notified yet.", side: "right" as const, rotate: 2 },
  { stamp: "BODY SIGNATURE", caseNum: "03", headline: "Your body knows before you do.", body: "Jaw tightens. Chest drops. Stomach clenches. That sensation is not anxiety. It's data.", side: "left" as const, rotate: -1 },
  { stamp: "THE WINDOW", caseNum: "04", headline: "3 to 7 seconds.", body: "This is the only moment interruption is biologically possible. Most people live their entire lives never knowing it exists.", side: "right" as const, rotate: 1.5 },
  { stamp: "PATTERN EXECUTES", caseNum: "05", headline: "Without the method \u2014 it runs.", body: "The message gets sent. The fight starts. The opportunity collapses. The loop tightens. Again.", side: "left" as const, rotate: -2 },
  { stamp: "THE INTERRUPT", caseNum: "06", headline: "With the method \u2014 you choose.", body: "You recognize the signature. You apply the circuit break. For the first time \u2014 the pattern does not complete.", side: "right" as const, rotate: 1 },
];

function PatternFileSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const [activePin, setActivePin] = useState(0);
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" && window.innerWidth < 768);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleCards(prev => { const next = new Set(Array.from(prev)); next.add(i); return next; });
            setActivePin(i);
          }
        },
        { threshold: 0.3 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  const pinPositions = [
    { y: 80 }, { y: 240 }, { y: 400 }, { y: 560 }, { y: 720 }, { y: 880 }
  ];
  const threadHeight = 960;

  return (
    <section
      ref={sectionRef}
      className="px-6"
      data-testid="section-pattern-file"
      style={{
        position: "relative",
        background: "#0A0A0A",
        paddingTop: "100px",
        paddingBottom: "100px",
        backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"200\" height=\"200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"n\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.65\" numOctaves=\"3\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23n)\" opacity=\"0.04\"/%3E%3C/svg%3E')",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center", marginBottom: "80px" }}>
        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "11px",
          color: "#EC4899",
          textTransform: "uppercase",
          letterSpacing: "0.2em",
          marginBottom: "16px",
        }}>
          CLASSIFIED RESEARCH
        </p>
        <h2 style={{
          fontFamily: "'Schibsted Grotesk', sans-serif",
          fontWeight: 900,
          textTransform: "uppercase",
          fontSize: "clamp(2rem, 5vw, 3.5rem)",
          color: "white",
          marginBottom: "20px",
          lineHeight: 1.1,
        }}>
          THE PATTERN FILE
        </h2>
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)",
          color: "#14B8A6",
          maxWidth: "600px",
          margin: "0 auto",
          lineHeight: 1.5,
        }}>
          How a destructive pattern runs &mdash; and the one moment it can be stopped.
        </p>
      </div>

      <div style={{ position: "relative", maxWidth: "700px", margin: "0 auto" }}>
        {!isMobile && (
          <svg
            style={{ position: "absolute", left: "50%", top: 0, transform: "translateX(-50%)", width: "4px", height: threadHeight, zIndex: 1, overflow: "visible" }}
            viewBox={`0 0 4 ${threadHeight}`}
          >
            <line
              x1="2" y1="0" x2="2" y2={threadHeight}
              stroke="#14B8A6"
              strokeWidth="1.5"
              strokeDasharray="6 4"
              opacity="0.5"
            />
            {pinPositions.map((pin, i) => (
              <circle
                key={i}
                cx="2"
                cy={pin.y}
                r="4"
                fill={i <= activePin ? "#14B8A6" : "#1a1a1a"}
                stroke="#14B8A6"
                strokeWidth="1"
              />
            ))}
            <circle
              cx="2"
              cy={pinPositions[Math.min(activePin, 5)]?.y || 80}
              r="6"
              fill="#14B8A6"
              opacity="0.8"
              style={{ transition: "cy 0.6s ease" }}
            >
              <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle
              cx="2"
              cy={pinPositions[Math.min(activePin, 5)]?.y || 80}
              r="12"
              fill="none"
              stroke="#14B8A6"
              strokeWidth="0.5"
              opacity="0.3"
              style={{ transition: "cy 0.6s ease" }}
            >
              <animate attributeName="r" values="8;16;8" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
            </circle>
          </svg>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "24px" : "40px", position: "relative", zIndex: 2 }}>
          {patternFileCards.map((card, i) => {
            const isVisible = visibleCards.has(i);
            const isLeft = card.side === "left";
            return (
              <div
                key={i}
                ref={(el) => { cardRefs.current[i] = el; }}
                data-testid={`pattern-file-card-${i}`}
                className={`case-file-card${isVisible ? " case-file-visible" : " case-file-hidden"}`}
                style={{
                  width: isMobile ? "100%" : "280px",
                  alignSelf: isMobile ? "center" : isLeft ? "flex-start" : "flex-end",
                  "--init-rotate": `${card.rotate}deg`,
                } as React.CSSProperties}
              >
                <div style={{
                  position: "absolute",
                  top: "-6px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: "#14B8A6",
                  border: "2px solid #0A0A0A",
                  display: isMobile ? "none" : "block",
                }} />

                <p style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "9px",
                  color: "#14B8A6",
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  marginBottom: "12px",
                  opacity: 0.9,
                }}>
                  {card.stamp} &mdash; CASE FILE {card.caseNum}
                </p>

                <h3 style={{
                  fontFamily: "'Schibsted Grotesk', sans-serif",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  fontSize: "1rem",
                  color: "white",
                  marginBottom: "10px",
                  lineHeight: 1.3,
                }}>
                  {card.headline}
                </h3>

                <p style={{
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: "0.85rem",
                  color: "rgba(255,255,255,0.7)",
                  lineHeight: 1.6,
                  margin: 0,
                }}>
                  {card.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ maxWidth: "500px", margin: "80px auto 0", textAlign: "center" }}>
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          fontSize: "1.2rem",
          color: "#14B8A6",
          marginBottom: "32px",
          lineHeight: 1.5,
        }}>
          The Archivist Method was built for this window.
        </p>
        <CTAButton text="FIND YOUR PATTERN" />
      </div>
    </section>
  );
}

function ExitInterviewSection({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  const [countdown, setCountdown] = useState(7);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const sectionObserverRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = sectionObserverRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCountdown(7);
            if (timerRef.current) clearInterval(timerRef.current);
            timerRef.current = setInterval(() => {
              setCountdown((prev) => {
                if (prev <= 0) {
                  if (timerRef.current) clearInterval(timerRef.current);
                  return 0;
                }
                return prev - 1;
              });
            }, 1000);
          } else {
            if (timerRef.current) clearInterval(timerRef.current);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const setRefs = useCallback((node: HTMLElement | null) => {
    sectionObserverRef.current = node;
    if (sectionRef && "current" in sectionRef) {
      (sectionRef as React.MutableRefObject<HTMLElement | null>).current = node;
    }
  }, [sectionRef]);

  return (
    <section ref={setRefs} className="py-24 md:py-32 px-6" data-testid="section-final-cta" style={{ position: "relative" }}>
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="reveal" style={{ fontFamily: "'Schibsted Grotesk', sans-serif", fontWeight: 900, textTransform: "uppercase", fontSize: "clamp(2.5rem, 6vw, 4rem)", color: "white", marginBottom: "24px", lineHeight: 1.1 }} data-testid="text-final-cta-headline">
          The window is closing.
        </h2>
        <p className="reveal reveal-delay-1" style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "1.2rem", color: "#14B8A6", maxWidth: "520px", margin: "0 auto 40px", lineHeight: 1.5 }} data-testid="text-final-cta-subtext">
          You have 7 seconds before your brain convinces you to stay exactly as you are.
        </p>
        <div className="reveal reveal-delay-1" style={{ marginBottom: "32px" }}>
          <span
            data-testid="text-countdown"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "3rem",
              color: countdown <= 2 ? "#EC4899" : "#14B8A6",
              transition: "color 0.3s ease",
              letterSpacing: "0.1em",
            }}
          >
            {countdown}
          </span>
        </div>
        <div className="reveal reveal-delay-2">
          <CTAButton text="INTERRUPT THE CYCLE NOW" />
        </div>
        <p className="reveal reveal-delay-2" style={{ color: "#737373", fontSize: "13px", marginTop: "16px" }}>
          Free · 2 Minutes · Instant Results
        </p>
      </div>
    </section>
  );
}

function TheWindowSection({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  const [phase, setPhase] = useState<WindowPhase>("idle");
  const [counter, setCounter] = useState(0);
  const [desat, setDesat] = useState(false);
  const hasPlayed = useRef(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const rafRef = useRef<number>(0);
  const localRef = useRef<HTMLElement | null>(null);

  const setRefs = useCallback((el: HTMLElement | null) => {
    localRef.current = el;
    if (sectionRef && "current" in sectionRef) {
      (sectionRef as React.MutableRefObject<HTMLElement | null>).current = el;
    }
  }, [sectionRef]);

  const schedule = useCallback((fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms);
    timersRef.current.push(t);
    return t;
  }, []);

  useEffect(() => {
    const el = localRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasPlayed.current) {
          hasPlayed.current = true;

          const introDelay = 0;
          const circuitDelay = 1500;
          const barStart = 3500;

          schedule(() => setPhase("preIntro"), introDelay);
          schedule(() => setPhase("circuit"), circuitDelay);
          schedule(() => {
            setPhase("barTrigger");
            const countStart = performance.now();
            const tick = () => {
              const elapsed = Math.min((performance.now() - countStart) / 1000, 7.0);
              setCounter(elapsed);
              if (elapsed < 4.0) {
                rafRef.current = requestAnimationFrame(tick);
              }
            };
            rafRef.current = requestAnimationFrame(tick);
          }, barStart);
          schedule(() => setPhase("barSignature"), barStart + 2000);
          schedule(() => {
            setPhase("barGap");
            setDesat(true);
            schedule(() => setDesat(false), 200);
          }, barStart + 4000);
          schedule(() => setPhase("barGapText1"), barStart + 5000);
          schedule(() => setPhase("barGapText2"), barStart + 6000);
          schedule(() => setPhase("aftermath1"), barStart + 9000);
          schedule(() => setPhase("aftermath2"), barStart + 10500);
          schedule(() => setPhase("threeSecTest"), barStart + 12500);
          schedule(() => setPhase("done"), barStart + 13000);
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      timersRef.current.forEach(clearTimeout);
      cancelAnimationFrame(rafRef.current);
    };
  }, [schedule]);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const phaseOrder: WindowPhase[] = ["idle", "preIntro", "circuit", "barTrigger", "barSignature", "barGap", "barGapText1", "barGapText2", "aftermath1", "aftermath2", "threeSecTest", "done"];
  const phaseIdx = phaseOrder.indexOf(phase);
  const past = (p: WindowPhase) => phaseIdx >= phaseOrder.indexOf(p);

  const barPercent = !past("barTrigger") ? 0
    : past("barGap") ? 57
    : past("barSignature") ? 57
    : 28;

  const barColor = past("barGap") ? "#14B8A6" : past("barSignature") ? "#F59E0B" : "#EC4899";

  const barLabel = past("barGap") ? "THE GAP" : past("barSignature") ? "BODY SIGNATURE DETECTED" : past("barTrigger") ? "SYSTEM TRIGGERED" : "";
  const labelColor = past("barGap") ? "#14B8A6" : past("barSignature") ? "#F59E0B" : "#EC4899";
  const labelSize = past("barGap") ? "15px" : "13px";

  const counterDisplay = past("barGap") ? "4.0" : counter.toFixed(1);
  const counterBlink = past("barGap") && !past("aftermath1");

  const barFaded = past("aftermath1");

  return (
    <section
      ref={setRefs}
      className="px-6"
      data-testid="section-window"
      style={{
        position: "relative",
        background: "#0A0A0A",
        paddingTop: "120px",
        paddingBottom: "120px",
        filter: desat ? "saturate(0.3)" : "saturate(1)",
        transition: "filter 0.2s ease",
        backgroundImage: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(20,184,166,0.06) 0%, transparent 70%)",
      }}
    >
      <SectorLabel text="TEMPORAL ANALYSIS // WINDOW: 3.2-6.8s // THRESHOLD: ACTIVE" />
      <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>

        <p
          data-testid="text-window-label"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "12px",
            color: "#14B8A6",
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            marginBottom: "32px",
            opacity: past("preIntro") ? 1 : 0,
            transition: "opacity 0.4s ease",
          }}
        >
          THE WINDOW
        </p>

        <p
          data-testid="text-window-preintro"
          style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: isMobile ? "0.9rem" : "1rem",
            color: "#777",
            margin: "0 0 32px 0",
            lineHeight: 1.5,
            opacity: past("preIntro") ? 1 : 0,
            transition: "opacity 0.4s ease",
          }}
        >
          "Willpower lives in the thinking part of your brain. Your pattern fires from the survival part. You're bringing a spreadsheet to a knife fight."
        </p>

        <p
          data-testid="text-window-circuit"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontSize: isMobile ? "1.8rem" : "2.2rem",
            color: "#14B8A6",
            margin: "0 0 48px 0",
            lineHeight: 1.3,
            opacity: past("circuit") ? 1 : 0,
            transition: "opacity 0.4s ease",
          }}
        >
          "Every pattern follows the same circuit."
        </p>

        <div style={{ marginBottom: "48px", opacity: !past("barTrigger") ? 0 : (barFaded ? 0.2 : 1), transition: "opacity 1s ease", pointerEvents: past("barTrigger") ? "auto" : "none" }}>
          <p
            data-testid="text-bar-label"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: labelSize,
              color: labelColor,
              fontWeight: past("barGap") ? "bold" : "normal",
              marginBottom: "12px",
              transition: "color 0.3s ease",
              minHeight: "20px",
            }}
          >
            {barLabel}
          </p>

          <div
            data-testid="bar-container"
            style={{
              height: "4px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "2px",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              data-testid="bar-fill"
              className={phase === "barSignature" ? "bar-vibrate" : ""}
              style={{
                height: "4px",
                borderRadius: "2px",
                width: `${barPercent}%`,
                background: barColor,
                transition: past("barGap") ? "background 0.3s ease" : "width 2s linear, background 0.5s ease",
                animation: past("barGap") && !barFaded ? "barPulse 1s ease-in-out infinite" : (phase === "barTrigger" ? "barTriggerPulse 0.5s ease-in-out infinite" : "none"),
              }}
            />
          </div>

          <p
            data-testid="text-bar-counter"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "11px",
              color: "#555",
              marginTop: "8px",
              animation: counterBlink ? "counterBlink 0.5s step-end infinite" : "none",
              visibility: past("barTrigger") ? "visible" : "hidden",
            }}
          >
            {counterDisplay}s
          </p>

          <div style={{ minHeight: "80px" }}>
            {past("barTrigger") && !past("barSignature") && (
              <p
                data-testid="text-phase1-desc"
                style={{
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: isMobile ? "0.9rem" : "1rem",
                  color: "#777",
                  marginTop: "20px",
                  opacity: 1,
                  transition: "opacity 0.4s ease",
                }}
              >
                "Something happens. A text. A compliment. Closeness."
              </p>
            )}

            {past("barSignature") && !past("barGap") && (
              <p
                data-testid="text-phase2-desc"
                style={{
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: isMobile ? "0.9rem" : "1rem",
                  color: "white",
                  marginTop: "20px",
                  opacity: 1,
                  transition: "opacity 0.4s ease",
                }}
              >
                "Chest tightens. Stomach drops. Hands go cold. Your body is screaming."
              </p>
            )}

            {past("barGapText1") && (
              <p
                data-testid="text-gap-choose"
                style={{
                  fontFamily: "'Schibsted Grotesk', sans-serif",
                  fontWeight: 900,
                  textTransform: "uppercase" as const,
                  fontSize: isMobile ? "1.5rem" : "1.8rem",
                  color: "white",
                  marginTop: "24px",
                  opacity: 1,
                  transition: "opacity 0.4s ease",
                  lineHeight: 1.3,
                }}
              >
                "Right here. Right now. You can still choose."
              </p>
            )}

            {past("barGapText2") && (
              <p
                data-testid="text-gap-interrupt"
                style={{
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: isMobile ? "0.9rem" : "1rem",
                  color: "#14B8A6",
                  marginTop: "12px",
                  opacity: 1,
                  transition: "opacity 0.4s ease",
                }}
              >
                "This is where your pattern already won."
              </p>
            )}
          </div>
        </div>

        {past("aftermath1") && (
          <div style={{ marginBottom: "48px" }}>
            <p
              data-testid="text-aftermath-bet"
              style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: isMobile ? "1rem" : "1.1rem",
                color: "#777",
                margin: 0,
                lineHeight: 1.5,
                opacity: past("aftermath1") ? 1 : 0,
                transition: "opacity 0.6s ease",
              }}
            >
              "The pattern bets everything on you letting that bar finish."
            </p>

            <p
              data-testid="text-aftermath-plug"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic",
                fontSize: isMobile ? "1.6rem" : "2rem",
                color: "#14B8A6",
                margin: 0,
                marginTop: "24px",
                lineHeight: 1.3,
                opacity: past("aftermath2") ? 1 : 0,
                transition: "opacity 0.8s ease",
              }}
            >
              "The Archivist Method is what happens when you pull the plug."
            </p>
          </div>
        )}

        {past("threeSecTest") && (
          <div data-testid="three-sec-test" style={{ opacity: past("threeSecTest") ? 1 : 0, transition: "opacity 0.8s ease" }}>
            <p
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "12px",
                color: "#14B8A6",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                marginBottom: "20px",
              }}
            >
              THE 3-SECOND TEST
            </p>
            <p
              data-testid="text-three-sec-body"
              style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: isMobile ? "1rem" : "1.1rem",
                color: "#ccc",
                maxWidth: "500px",
                margin: "0 auto 32px",
                lineHeight: 1.7,
              }}
            >
              "You had 3 seconds. Now you know."
            </p>
            <CTAButton text="SHOW ME HOW TO USE THEM" />
          </div>
        )}

      </div>
    </section>
  );
}

function ScrollProgressThread({ sectionRefs }: { sectionRefs: Record<string, React.RefObject<HTMLDivElement | null>> }) {
  const sections = [
    { key: "hero", label: "Hero" },
    { key: "gutCheck", label: "Gut Check" },
    { key: "patterns", label: "Patterns" },
    { key: "window", label: "The Window" },
    { key: "whoFor", label: "For You" },
    { key: "howItWorks", label: "The Method" },
    { key: "notTherapy", label: "Not Therapy" },
    { key: "pricing", label: "Pricing" },
    { key: "founder", label: "Founder" },
    { key: "finalCta", label: "Exit" },
  ];

  const [activeKey, setActiveKey] = useState("hero");
  const [positions, setPositions] = useState<Record<string, number>>({});
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  useEffect(() => {
    const calculate = () => {
      const docHeight = document.documentElement.scrollHeight;
      if (docHeight === 0) return;
      const newPositions: Record<string, number> = {};
      sections.forEach((s) => {
        if (s.key === "hero") {
          newPositions[s.key] = 0.03;
          return;
        }
        const ref = sectionRefs[s.key];
        if (ref?.current) {
          const rect = ref.current.getBoundingClientRect();
          const absTop = rect.top + window.scrollY;
          newPositions[s.key] = Math.min(Math.max(absTop / docHeight, 0.03), 0.97);
        }
      });
      setPositions(newPositions);

      const scrollY = window.scrollY;
      const viewCenter = scrollY + window.innerHeight * 0.4;
      let closest = "hero";
      let closestDist = Infinity;
      sections.forEach((s) => {
        let sectionTop: number;
        if (s.key === "hero") {
          sectionTop = 0;
        } else {
          const ref = sectionRefs[s.key];
          if (!ref?.current) return;
          sectionTop = ref.current.getBoundingClientRect().top + scrollY;
        }
        const dist = viewCenter - sectionTop;
        if (dist >= 0 && dist < closestDist) {
          closestDist = dist;
          closest = s.key;
        }
      });
      setActiveKey(closest);
    };

    calculate();
    window.addEventListener("scroll", calculate, { passive: true });
    window.addEventListener("resize", calculate, { passive: true });
    return () => {
      window.removeEventListener("scroll", calculate);
      window.removeEventListener("resize", calculate);
    };
  }, [sectionRefs]);

  const handleClick = (key: string) => {
    if (key === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const ref = sectionRefs[key];
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className="scroll-progress-thread"
      style={{
        position: "fixed",
        left: "40px",
        top: 0,
        width: "1px",
        height: "100vh",
        zIndex: 42,
        pointerEvents: "none",
      }}
    >
      {sections.map((s) => {
        const top = positions[s.key];
        if (top === undefined) return null;
        const isActive = activeKey === s.key;
        const isHovered = hoveredKey === s.key;
        return (
          <div
            key={s.key}
            style={{
              position: "absolute",
              left: "50%",
              top: `${top * 100}%`,
              transform: "translate(-50%, -50%)",
              pointerEvents: "auto",
              cursor: "pointer",
              padding: "4px",
            }}
            onMouseEnter={() => setHoveredKey(s.key)}
            onMouseLeave={() => setHoveredKey(null)}
            onClick={() => handleClick(s.key)}
            data-testid={`thread-node-${s.key}`}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: isActive ? "#14B8A6" : "#0A0A0A",
                border: `1.5px solid ${isActive ? "#14B8A6" : "rgba(20,184,166,0.4)"}`,
                boxShadow: isActive ? "0 0 8px rgba(20,184,166,0.5)" : "none",
                animation: isActive ? "threadNodePulse 2s ease-in-out infinite" : "none",
                transition: "background 0.3s, border-color 0.3s, box-shadow 0.3s",
              }}
            />
            <span
              style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "9px",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: "rgba(20,184,166,0.6)",
                whiteSpace: "nowrap",
                opacity: isHovered ? 1 : 0,
                transition: "opacity 0.2s ease",
                pointerEvents: "none",
              }}
            >
              {s.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function Landing() {
  const sectionRefs = {
    gutCheck: useScrollReveal(),
    patterns: useScrollReveal(),
    ctaBreak: useScrollReveal(),
    window: useScrollReveal(),
    whoFor: useScrollReveal(),
    howItWorks: useScrollReveal(),
    notTherapy: useScrollReveal(),
    pricing: useScrollReveal(),
    credibility: useScrollReveal(),
    founder: useScrollReveal(),
    finalCta: useScrollReveal(),
  };

  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const img = new Image();
    img.src = heroSeatedImg;
  }, []);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
        document.documentElement.style.setProperty("--scroll-progress", String(progress));
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const headlineGlitchObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !entry.target.getAttribute("data-glitched")) {
            entry.target.setAttribute("data-glitched", "1");
            entry.target.classList.add("headline-glitch");
            setTimeout(() => entry.target.classList.remove("headline-glitch"), 300);
          }
        });
      },
      { threshold: 0.3 }
    );

    const page = pageRef.current;
    if (page) {
      page.querySelectorAll("h2").forEach((el) => headlineGlitchObserver.observe(el));
    }

    return () => {
      headlineGlitchObserver.disconnect();
    };
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen thread-page" style={{ background: "#0A0A0A", color: "#F5F5F5", fontFamily: "'Source Sans 3', sans-serif", overflowX: "hidden" }}>
      <StarField />
      <FloatingParticles />
      <div className="bg-fog" />
      <div className="bg-grain" />
      <div className="bg-grid" />
      <ScrollProgressThread sectionRefs={sectionRefs} />

      {!sessionStorage.getItem('archivistLoaded') && (
        <div className="skeleton-overlay" data-testid="skeleton-loading" ref={(el) => { if (el) setTimeout(() => sessionStorage.setItem('archivistLoaded', '1'), 800); }}>
          <div style={{ position: "relative", width: "clamp(200px, 50vw, 400px)", height: "24px" }} className="skeleton-bar"><div className="skeleton-bar-outline" /></div>
          <div style={{ position: "relative", width: "clamp(140px, 35vw, 260px)", height: "14px" }} className="skeleton-bar"><div className="skeleton-bar-outline" /></div>
          <div style={{ position: "relative", width: "clamp(100px, 20vw, 160px)", height: "40px", marginTop: "8px" }} className="skeleton-bar"><div className="skeleton-bar-outline" /></div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,400;1,400;1,500&family=Source+Sans+3:wght@400;600&family=JetBrains+Mono:wght@400&display=swap');

        .reveal {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .reveal.revealed {
          opacity: 1;
          transform: translateY(0);
        }
        .reveal-delay-1 { transition-delay: 0.1s; }
        .reveal-delay-2 { transition-delay: 0.2s; }
        .reveal-delay-3 { transition-delay: 0.3s; }
        .reveal-delay-4 { transition-delay: 0.4s; }
        .reveal-delay-5 { transition-delay: 0.5s; }
        .reveal-delay-6 { transition-delay: 0.6s; }
        .reveal-delay-7 { transition-delay: 0.7s; }
        .reveal-delay-8 { transition-delay: 0.8s; }

        .gut-pattern {
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.5s ease-out, transform 0.5s ease-out;
        }
        .gut-pattern.revealed {
          opacity: 1;
          transform: translateY(0);
        }

        .interrupt-pulse {
          animation: pulse-subtle 2s ease-in-out infinite;
        }
        @keyframes pulse-subtle {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        .thread-page::before {
          content: '';
          position: fixed;
          left: 40px;
          top: 0;
          width: 1px;
          height: 100vh;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            rgba(20, 184, 166, 0.15) 10%,
            rgba(20, 184, 166, 0.4) 50%,
            rgba(20, 184, 166, 0.15) 90%,
            transparent 100%
          );
          z-index: 40;
          pointer-events: none;
        }

        .thread-page::after {
          content: '';
          position: fixed;
          left: 40px;
          top: 0;
          width: 1px;
          height: 100vh;
          background: #14B8A6;
          box-shadow: 0 0 6px rgba(20, 184, 166, 0.4), 0 0 20px rgba(20, 184, 166, 0.1);
          transform-origin: top;
          transform: scaleY(var(--scroll-progress, 0));
          opacity: calc(
            clamp(0, (var(--scroll-progress, 0) - 0.02) * 10, 1) *
            clamp(0, (1 - var(--scroll-progress, 0)) * 10, 1)
          );
          z-index: 40;
          pointer-events: none;
          transition: none;
        }

        @keyframes threadNodePulse {
          0%, 100% { box-shadow: 0 0 8px rgba(20,184,166,0.5); }
          50% { box-shadow: 0 0 14px rgba(20,184,166,0.8), 0 0 4px rgba(20,184,166,0.3); }
        }

        @media (max-width: 1024px) {
          .thread-page::before,
          .thread-page::after {
            display: none !important;
          }
          .scroll-progress-thread {
            display: none !important;
          }
          .reveal { transition-delay: 0s !important; transition-duration: 0.5s; }
        }

        @keyframes logFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes particleDrift {
          0% { transform: translate(0, 0); }
          25% { transform: translate(var(--x1), var(--y1)); }
          50% { transform: translate(var(--x2), var(--y2)); }
          75% { transform: translate(var(--x3), var(--y3)); }
          100% { transform: translate(0, 0); }
        }

        .bg-grain {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 9999;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.12'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: 50px 50px;
          opacity: calc(0.035 * clamp(0, (0.45 - var(--scroll-progress, 0)) * 3, 1));
          animation: grainFlicker 0.3s steps(3) infinite;
          transition: opacity 0.3s linear;
        }
        @keyframes grainFlicker {
          0% { background-position: 0 0; }
          33% { background-position: -17px 13px; }
          66% { background-position: 11px -23px; }
          100% { background-position: 0 0; }
        }

        @keyframes fogDrift {
          0% {
            background-position: 0% 50%, 100% 50%;
          }
          33% {
            background-position: 15% 40%, 85% 60%;
          }
          66% {
            background-position: 5% 55%, 95% 45%;
          }
          100% {
            background-position: 0% 50%, 100% 50%;
          }
        }

        .bg-fog {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          background-image:
            radial-gradient(ellipse 60% 50% at 0% 50%, rgba(20,184,166,0.06) 0%, transparent 70%),
            radial-gradient(ellipse 60% 50% at 100% 50%, rgba(236,72,153,0.05) 0%, transparent 70%);
          background-size: 100% 100%;
          animation: fogDrift 35s ease-in-out infinite;
          opacity: calc(1 - var(--scroll-progress, 0) * 2);
          transition: opacity 0.3s linear;
        }

        .bg-grid {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background-image:
            linear-gradient(rgba(20,184,166,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(20,184,166,0.03) 1px, transparent 1px);
          background-size: 80px 80px;
          opacity: calc(
            clamp(0, (var(--scroll-progress, 0) - 0.2) * 4, 1) *
            clamp(0, (0.7 - var(--scroll-progress, 0)) * 3, 1)
          );
          transition: opacity 0.3s linear;
        }

        .skeleton-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: #0A0A0A;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          animation: skeletonFadeOut 0.4s ease-out 0.8s forwards;
          pointer-events: none;
        }
        .skeleton-bar {
          background: rgba(255,255,255,0.03);
          animation: skeletonPulse 1s ease-in-out infinite;
        }
        .skeleton-bar-outline {
          position: absolute;
          inset: 0;
          border: 1px solid transparent;
          animation: skeletonTrace 0.8s ease-out forwards;
        }
        @keyframes skeletonPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        @keyframes skeletonTrace {
          0% { border-color: transparent; clip-path: inset(0 100% 0 0); }
          100% { border-color: rgba(20,184,166,0.15); clip-path: inset(0 0 0 0); }
        }
        @keyframes skeletonFadeOut {
          to { opacity: 0; visibility: hidden; }
        }

        @keyframes barTriggerPulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        @keyframes barPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes barVibrate {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-1px); }
          75% { transform: translateX(1px); }
        }
        .bar-vibrate {
          animation: barVibrate 50ms linear infinite !important;
        }
        @keyframes counterBlink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }

        @keyframes heroSectionFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .hero-section-fade {
          animation: heroSectionFadeIn 1.2s ease-out forwards;
        }
        .hero-bg-image {
          opacity: 0;
          animation: heroSectionFadeIn 1.2s ease-out 0.1s forwards;
        }
        .hero-overlay {
          background: linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.95) 100%);
          animation: heroOverlayLighten 1.2s ease-out 0.1s forwards;
        }
        @keyframes heroOverlayLighten {
          from { background: linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.85) 60%, rgba(0,0,0,0.98) 100%); }
          to { background: linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.90) 100%); }
        }

        @keyframes heroFadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes ctaSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .cta-glow-wrap {
          position: relative;
          display: block;
          width: 100%;
        }
        @media (min-width: 768px) {
          .cta-glow-wrap {
            display: inline-block;
            width: auto;
          }
        }
        .cta-glow-border {
          position: absolute;
          inset: -1px;
          border-radius: 2px;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
        }
        .cta-glow-border::before {
          content: '';
          position: absolute;
          inset: -50%;
          background: conic-gradient(
            from 0deg,
            transparent 0deg,
            transparent 350deg,
            rgba(236, 72, 153, 0.8) 355deg,
            rgba(236, 72, 153, 1) 357.5deg,
            rgba(236, 72, 153, 0.8) 360deg
          );
          animation: ctaSpin 3.75s linear infinite;
        }
        .cta-glow-border::after {
          content: '';
          position: absolute;
          inset: 1px;
          background: #000;
          border-radius: 1px;
        }
        .cta-glow-inner {
          position: relative;
          z-index: 1;
          background: #000;
          border: 1px solid rgba(255,255,255,0.15);
        }

        .headline-glitch {
          animation: headlineGlitch 0.3s ease-out;
        }
        @keyframes headlineGlitch {
          0% { transform: translateX(-4px); opacity: 0.7; }
          25% { transform: translateX(4px); opacity: 0.85; }
          50% { transform: translateX(-2px); opacity: 0.95; }
          75% { transform: translateX(2px); opacity: 1; }
          100% { transform: translateX(0); opacity: 1; }
        }

        @keyframes scanlineGlitch {
          0% { transform: translateX(0); }
          20% { transform: translateX(-3px); }
          40% { transform: translateX(3px); }
          60% { transform: translateX(-2px); }
          80% { transform: translateX(2px); }
          100% { transform: translateX(0); }
        }
        .scanline-glitch {
          animation: scanlineGlitch 0.3s ease-out;
        }

        .case-file-card {
          transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
          background: #1a1510;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 2px;
          padding: 24px 20px;
          position: relative;
          cursor: default;
          box-shadow: none;
          opacity: 1;
          transform: rotate(0deg) translateY(0);
          background-image: url('data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="n"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23n)" opacity="0.06"/%3E%3C/svg%3E');
        }
        .case-file-hidden {
          opacity: 0;
          transform: rotate(var(--init-rotate, 0deg)) translateY(30px);
        }
        .case-file-visible {
          opacity: 1;
          transform: rotate(0deg) translateY(0);
          border-color: rgba(20, 184, 166, 0.3);
          box-shadow: 0 0 20px rgba(20, 184, 166, 0.08);
        }
        .case-file-visible:hover {
          transform: rotate(0deg) translateY(-6px);
          box-shadow: 0 8px 30px rgba(236, 72, 153, 0.15);
          border-color: rgba(236, 72, 153, 0.4);
        }

        @keyframes myelinStreak {
          0%, 80% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .myelin-pulse {
          background-image: linear-gradient(
            90deg,
            transparent 0%,
            transparent 40%,
            rgba(255,255,255,0.6) 48%,
            rgba(255,255,255,0.9) 50%,
            rgba(255,255,255,0.6) 52%,
            transparent 60%,
            transparent 100%
          );
          background-size: 200% 100%;
          background-clip: text;
          -webkit-background-clip: text;
          animation: myelinStreak 6s ease-in-out 8s infinite;
        }
        .myelin-pulse .hero-word {
          -webkit-text-fill-color: currentColor;
        }

        @keyframes candleFlicker1 {
          0%, 100% { opacity: 0.88; }
          20% { opacity: 0.95; }
          40% { opacity: 0.85; }
          60% { opacity: 1; }
          80% { opacity: 0.9; }
        }
        @keyframes candleFlicker2 {
          0%, 100% { opacity: 0.92; }
          25% { opacity: 0.87; }
          50% { opacity: 1; }
          75% { opacity: 0.9; }
        }
        @keyframes candleFlicker3 {
          0%, 100% { opacity: 0.9; }
          33% { opacity: 1; }
          66% { opacity: 0.86; }
        }
        .candle-flicker { animation-timing-function: ease-in-out; animation-iteration-count: infinite; }

        @keyframes heroWordReveal {
          0% { opacity: 0; color: #14B8A6; }
          15% { opacity: 1; color: #14B8A6; }
          40% { color: #14B8A6; }
          100% { opacity: 1; color: #F5F5F5; }
        }
        @keyframes heroWordRevealTeal {
          0% { opacity: 0; color: #14B8A6; }
          100% { opacity: 1; color: #14B8A6; }
        }
        .hero-stagger {
          opacity: 0;
          animation-fill-mode: forwards;
          animation-timing-function: ease-out;
        }
        .hero-word {
          opacity: 0;
          animation-name: heroWordReveal;
          animation-duration: 1.2s;
          animation-fill-mode: forwards;
          animation-timing-function: ease-out;
          display: inline-block;
        }

        @media (prefers-reduced-motion: reduce) {
          .reveal { transition-duration: 0.01ms !important; opacity: 1 !important; transform: none !important; }
          .interrupt-pulse { animation: none !important; opacity: 1 !important; }
          .thread-page::before, .thread-page::after { transition: none !important; display: none !important; }
          .scroll-progress-thread { display: none !important; }
          .gut-pattern { transition-duration: 0.01ms !important; opacity: 1 !important; transform: none !important; }
          .skeleton-overlay { display: none !important; }
          .bg-grain, .bg-grid, .bg-fog { display: none !important; }
          .hero-stagger { opacity: 1 !important; animation: none !important; transform: none !important; }
          .hero-word { opacity: 1 !important; animation: none !important; }
          [data-testid="text-brand-title"] .hero-word { color: #F5F5F5 !important; }
          [data-testid="text-brand-title-2"] .hero-word { color: #14B8A6 !important; }
          .cta-glow-border::before { animation: none !important; }
          .scanline-glitch, .headline-glitch { animation: none !important; }
          .myelin-pulse { animation: none !important; }
        }
      `}</style>

      {/* ========== SECTION 1: HERO ========== */}
      <section className="min-h-screen flex items-center justify-center relative px-6 hero-section-fade" data-testid="section-hero">
        <div
          className="absolute inset-0 z-0 hero-bg-image"
          style={{
            backgroundImage: `url(${heroSeatedImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center top",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div className="absolute inset-0 z-0 hero-overlay" />
        <div className="text-center max-w-3xl mx-auto relative z-10">
          <p
            className="hero-stagger tracking-[0.3em] uppercase"
            style={{ color: "#14B8A6", fontFamily: "'JetBrains Mono', monospace", fontSize: "14px", marginBottom: "48px", animationName: "heroFadeIn", animationDuration: "0.6s", animationDelay: "1.2s" }}
            data-testid="text-brand-name"
          >
            THE ARCHIVIST METHOD&trade;
          </p>

          <p
            className="myelin-pulse"
            style={{ fontFamily: "'Schibsted Grotesk', sans-serif", fontWeight: 900, fontStyle: "normal", fontSize: "clamp(2.2rem, 6vw, 4rem)", lineHeight: 1.1, marginBottom: "4px", textTransform: "uppercase" }}
            data-testid="text-brand-title"
          >
            {["YOU", "KNOW", "EXACTLY", "WHAT", "YOU'RE", "DOING."].map((word, i) => (
              <span key={i} className="hero-word" style={{ animationDelay: `${2.8 + i * 0.22}s`, marginRight: "0.3em" }}>{word}</span>
            ))}
          </p>
          <p
            className="myelin-pulse"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontStyle: "italic", fontSize: "clamp(2.4rem, 6.5vw, 4.4rem)", lineHeight: 1.15 }}
            data-testid="text-brand-title-2"
          >
            {["You", "just", "can't", "stop."].map((word, i) => (
              <span key={i} className="hero-word" style={{ animationName: "heroWordRevealTeal", animationDelay: `${4.3 + i * 0.22}s`, marginRight: "0.3em" }}>{word}</span>
            ))}
          </p>

          <p
            className="hero-stagger leading-relaxed mx-auto"
            style={{ color: "#999", fontSize: "1.15rem", maxWidth: "580px", marginTop: "32px", animationName: "heroFadeIn", animationDuration: "0.6s", animationDelay: "7.0s" }}
            data-testid="text-hero-positioning"
          >
            You keep doing the thing you hate doing. You know what it is. You've tried to stop. This shows you how to catch it before it happens.
          </p>

          <p
            className="hero-stagger leading-relaxed mx-auto"
            style={{ color: "#F5F5F5", fontSize: "1.05rem", maxWidth: "540px", marginTop: "24px", marginBottom: "48px", animationName: "heroFadeIn", animationDuration: "0.6s", animationDelay: "7.6s" }}
            data-testid="text-hero-mechanism"
          >
            Your body gives you a 3-second warning every single time. Nobody taught you to use it. Until now.
          </p>

          <div className="hero-stagger" style={{ animationName: "heroFadeIn", animationDuration: "0.6s", animationDelay: "8.2s" }}>
            <CTAButton text="FIND YOUR PATTERN" />
          </div>

          <p className="hero-stagger" style={{ color: "#737373", fontFamily: "'Source Sans 3', sans-serif", fontSize: "13px", marginTop: "16px", animationName: "heroFadeIn", animationDuration: "0.6s", animationDelay: "8.7s" }}>
            Free · 2 Minutes · Instant Results
          </p>

          <p className="hero-stagger" style={{ marginTop: "20px", animationName: "heroFadeIn", animationDuration: "0.6s", animationDelay: "9.0s" }}>
            <a
              href="#section-window"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('[data-testid="section-window"]')?.scrollIntoView({ behavior: "smooth" });
              }}
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: "#14B8A6", cursor: "pointer", textDecoration: "none", opacity: 0.8, transition: "opacity 0.3s" }}
              onMouseOver={(e) => { e.currentTarget.style.opacity = "1"; }}
              onMouseOut={(e) => { e.currentTarget.style.opacity = "0.8"; }}
              data-testid="link-science-first"
            >
              I want to understand the science first <ArrowRight className="inline w-3 h-3 ml-1" style={{ verticalAlign: "middle" }} />
            </a>
          </p>

          <div className="hero-stagger" style={{ marginTop: "48px", animationName: "heroFadeIn", animationDuration: "0.6s", animationDelay: "9.2s" }}>
            <p
              className="tracking-[0.2em] uppercase"
              style={{ color: "#14B8A6", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", opacity: 0.7 }}
              data-testid="text-brand-tagline"
            >
              Pattern archaeology, <span style={{ color: "#EC4899" }}>not</span> therapy.
            </p>
          </div>
        </div>
      </section>

      {/* ========== SECTION 2: GUT CHECK ========== */}
      <section ref={sectionRefs.gutCheck} className="py-24 md:py-32 px-6" data-testid="section-gut-check" style={{ position: "relative" }}>
        <SectorLabel text="SECTOR 01 // EMOTIONAL SCAN // STATUS: ACTIVE" />
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="reveal" style={{ fontFamily: "'Schibsted Grotesk', sans-serif", fontWeight: 900, textTransform: "uppercase", fontSize: "2rem", color: "white", marginBottom: "48px" }} data-testid="text-gut-check-headline">
            Which one makes your stomach drop?
          </h2>

          <div style={{ marginBottom: "48px" }}>
            {gutCheckPatterns.map((p, i) => (
              <GutCheckItem key={p.name} pattern={p} index={i} isLast={i === gutCheckPatterns.length - 1} />
            ))}
          </div>

          <p className="reveal" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#14B8A6", fontStyle: "italic", fontSize: "1rem", maxWidth: "500px", margin: "0 auto" }}>
            "If you felt something reading one of those — that's your body signal. That's the thread."
          </p>
        </div>
      </section>

      {/* ========== SECTION 3: THE 9 PATTERNS ========== */}
      <section ref={sectionRefs.patterns} className="py-24 md:py-32 px-6" data-testid="section-patterns" style={{ position: "relative" }}>
        <SectorLabel text="ARCHIVE REF: 09-CORE // CLASSIFICATION: PRIMARY" />
        <div className="max-w-6xl mx-auto">
          <div className="text-center" style={{ marginBottom: "48px" }}>
            <SectionLabel>THE PATTERNS</SectionLabel>
            <h2 className="reveal reveal-delay-1" style={{ fontFamily: "'Schibsted Grotesk', sans-serif", fontWeight: 900, textTransform: "uppercase", fontSize: "clamp(1.8rem, 4vw, 2.5rem)", color: "white" }} data-testid="text-patterns-headline">
              9 Destructive Patterns. You're Running at Least One.
            </h2>
            <p className="reveal reveal-delay-2 mx-auto" style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "1.05rem", color: "#14B8A6", maxWidth: "500px", marginTop: "20px", marginBottom: "40px" }} data-testid="text-patterns-subline">
              "The pattern is not you. It is a program that runs through you. It was installed to protect a child. You are no longer that child."
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {patternCards.map((p, i) => (
              <PatternCard key={p.num} card={p} index={i} />
            ))}
          </div>

          <p className="reveal reveal-delay-3 text-center mx-auto" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", color: "#14B8A6", fontStyle: "italic", maxWidth: "500px", marginTop: "48px" }} data-testid="text-patterns-footer">
            If you felt something reading one of those — that's your body signal firing right now.
          </p>
        </div>
      </section>

      {/* ========== SECTION 4: CTA BREAK ========== */}
      <section ref={sectionRefs.ctaBreak} className="py-24 md:py-32 px-6" data-testid="section-cta-break" style={{ position: "relative" }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="reveal" style={{ fontFamily: "'Schibsted Grotesk', sans-serif", fontWeight: 900, textTransform: "uppercase", fontSize: "2rem", color: "white", marginBottom: "32px" }}>
            One interrupt changes everything.
          </h2>
          <p className="reveal" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#999", textAlign: "center", marginBottom: "16px" }}>Takes 2 minutes. No email required.</p>
          <EmbeddedQuiz />
        </div>
      </section>

      {/* ========== SECTION 4.5: THE PATTERN FILE (Detective Board) ========== */}
      <PatternFileSection />

      {/* ========== SECTION 5: THE WINDOW (Timed Text Sequence) ========== */}
      <TheWindowSection sectionRef={sectionRefs.window} />

      {/* ========== SECTION 6: THIS IS FOR YOU / NOT FOR YOU ========== */}
      <section ref={sectionRefs.whoFor} className="py-24 md:py-32 px-6" data-testid="section-who-for" style={{ position: "relative" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center" style={{ marginBottom: "48px" }}>
            <SectionLabel>WHO THIS IS FOR</SectionLabel>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* For You */}
            <div className="reveal" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", padding: "32px" }}>
              <h3 style={{ fontFamily: "'Schibsted Grotesk', sans-serif", fontWeight: 900, textTransform: "uppercase", fontSize: "1.5rem", color: "white", marginBottom: "24px" }}>
                This Is For You If:
              </h3>
              <div className="space-y-5">
                {forYouProse.map((item, i) => (
                  <p key={i} style={{ fontFamily: "'Source Sans 3', sans-serif", color: "#bbb", fontSize: "0.95rem", lineHeight: 1.7 }}>
                    {item}
                  </p>
                ))}
              </div>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#14B8A6", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "32px", opacity: 0.7 }}>
                — Field Notes, The Archivist
              </p>
            </div>

            {/* Not For You */}
            <div className="reveal reveal-delay-2" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", padding: "32px" }}>
              <h3 style={{ fontFamily: "'Schibsted Grotesk', sans-serif", fontWeight: 900, textTransform: "uppercase", fontSize: "1.5rem", color: "white", marginBottom: "24px" }}>
                This Is Not For You If:
              </h3>
              <div className="space-y-4">
                {notForYou.map((item, i) => (
                  <p key={i} style={{ color: "#999", fontSize: "1rem", lineHeight: 1.6 }}>
                    <span style={{ color: "#EC4899", marginRight: "8px" }}>&mdash;</span>
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== SECTION 7: HOW IT WORKS ========== */}
      <section ref={sectionRefs.howItWorks} className="py-24 md:py-32 px-6" data-testid="section-how-it-works" style={{ position: "relative" }}>
        <SectorLabel text="PROTOCOL: FEIR-4 // CLEARANCE: STANDARD" />
        <div className="max-w-6xl mx-auto">
          <div className="text-center" style={{ marginBottom: "48px" }}>
            <SectionLabel>THE METHOD</SectionLabel>
            <h2 className="reveal reveal-delay-1" style={{ fontFamily: "'Schibsted Grotesk', sans-serif", fontWeight: 900, textTransform: "uppercase", fontSize: "clamp(1.8rem, 4vw, 2.5rem)", color: "white" }} data-testid="text-method-headline">
              The Method
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { num: "1", name: "MAP THE PATTERN", desc: "Take the free quiz. Find out which of the 9 patterns is running your life. See your triggers, your body signals, and where the pattern started." },
              { num: "2", name: "CATCH THE SIGNATURE", desc: "Learn your 3-second window. Spot the body signal. Apply the circuit break before the pattern runs. One clean interrupt changes everything." },
              { num: "3", name: "INSTALL THE OVERRIDE", desc: "Each interrupt weakens the pattern. Every one builds a new path in your brain. The pattern doesn't vanish — it loses its grip. You get your choices back." },
            ].map((step, i) => (
              <div
                key={step.num}
                className={`reveal reveal-delay-${i + 1}`}
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", padding: "32px" }}
                data-testid={`card-step-${step.num}`}
              >
                <p style={{ fontFamily: "'Schibsted Grotesk', sans-serif", fontWeight: 900, fontSize: "3rem", color: "#14B8A6", marginBottom: "16px" }}>{step.num}</p>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", color: "white", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>{step.name}</p>
                <p style={{ color: "#999", fontSize: "0.95rem", lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== SECTION 8: NOT THERAPY ========== */}
      <section ref={sectionRefs.notTherapy} className="py-24 md:py-32 px-6" data-testid="section-not-therapy" style={{ position: "relative" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center" style={{ marginBottom: "48px" }}>
            <SectionLabel>THE DIFFERENCE</SectionLabel>
            <h2 className="reveal reveal-delay-1" style={{ fontFamily: "'Schibsted Grotesk', sans-serif", fontWeight: 900, textTransform: "uppercase", fontSize: "2rem", color: "white" }} data-testid="text-therapy-headline">
              Pattern Archaeology vs. Traditional Therapy
            </h2>
            <p className="reveal reveal-delay-2 mx-auto" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", color: "#14B8A6", fontStyle: "italic", maxWidth: "550px", marginTop: "24px" }} data-testid="text-therapy-subline">
              "Knowing why you do it doesn't stop you from doing it. This does."
            </p>
          </div>

          <p className="reveal reveal-delay-2" style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "1.1rem", color: "#999", textAlign: "center", maxWidth: "550px", margin: "0 auto 40px", lineHeight: 1.6 }} data-testid="text-therapy-intro">
            Inspiration is not a mechanism. Understanding is not interruption. This is the difference.
          </p>

          <div className="reveal reveal-delay-2">
            <div className="grid grid-cols-2 gap-0" style={{ background: "rgba(20,184,166,0.15)", borderBottom: "2px solid #14B8A6", padding: "14px 16px" }}>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem", color: "#14B8A6", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>THERAPY</p>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem", color: "#14B8A6", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>THE ARCHIVIST METHOD</p>
            </div>
            {therapyRows.map((row, i) => (
              <div key={i} className="grid grid-cols-2 gap-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "14px 16px", background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", color: "#737373", fontSize: "0.85rem" }}>{row[0]}</p>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", color: "white", fontSize: "0.85rem" }}>{row[1]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== SECTION 8.5: FROM THE ARCHIVES ========== */}
      <section className="py-24 md:py-32 px-6" data-testid="section-archives" style={{ position: "relative" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center" style={{ marginBottom: "48px" }}>
            <SectionLabel>FROM THE ARCHIVES</SectionLabel>
            <h2 className="reveal reveal-delay-1" style={{ fontFamily: "'Schibsted Grotesk', sans-serif", fontWeight: 900, textTransform: "uppercase", fontSize: "2rem", color: "white" }} data-testid="text-archives-headline">
              Field Reports
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {archivesCaseFiles.map((file, i) => (
              <CaseFileCard key={file.num} file={file} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ========== SECTION 8.6: CREDIBILITY BAR ========== */}
      <section ref={sectionRefs.credibility} className="py-16 md:py-20 px-6" data-testid="section-credibility" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", position: "relative" }}>
        <SectorLabel text="DATASET: 685 PAGES // PATTERNS: 9 // CONFIDENCE: 0.97" />
        <div className="max-w-5xl mx-auto">
          <div className="reveal grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { stat: "685+", label: "Pages of Research" },
              { stat: "9", label: "Documented Patterns" },
              { stat: "3-7", label: "Second Window" },
              { stat: "24/7", label: "AI Pattern Coach" },
            ].map((item) => (
              <div key={item.label}>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.5rem", color: "#14B8A6", marginBottom: "4px" }}>{item.stat}</p>
                <p style={{ color: "#999", fontSize: "0.85rem" }}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== SECTION 8.7: BENTO DASHBOARD PREVIEW ========== */}
      <section className="py-24 md:py-32 px-6" data-testid="section-bento-preview" style={{ position: "relative" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div className="text-center" style={{ marginBottom: "48px" }}>
            <SectionLabel>INSIDE THE SYSTEM</SectionLabel>
            <h2 className="reveal reveal-delay-1" style={{ fontFamily: "'Schibsted Grotesk', sans-serif", fontWeight: 900, textTransform: "uppercase", fontSize: "2rem", color: "white" }} data-testid="text-bento-headline">
              This Is What You Get
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* PANEL 1: Pattern Dashboard */}
            <div
              className="reveal md:col-span-1"
              data-testid="panel-dashboard"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                padding: "24px",
                transition: "border-color 0.3s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
            >
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#14B8A6", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "16px" }}>Your Pattern Dashboard</p>
              <div style={{ background: "rgba(0,0,0,0.4)", padding: "16px", border: "1px solid rgba(255,255,255,0.04)" }}>
                <p style={{ fontFamily: "'Schibsted Grotesk', sans-serif", fontWeight: 900, fontSize: "14px", color: "white", marginBottom: "12px" }}>THE DISAPPEARING PATTERN</p>
                <div className="flex items-center gap-2 flex-wrap" style={{ marginBottom: "8px" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#EC4899", display: "inline-block" }} />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#999" }}>Chest tightness — active</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#14B8A6" strokeWidth="2"><path d="M12 2c.5 3.5 3 6 6 6.5-3 .5-5.5 3-6 6.5-.5-3.5-3-6-6-6.5 3-.5 5.5-3 6-6.5z"/></svg>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#14B8A6" }}>12 day streak</span>
                </div>
              </div>
            </div>

            {/* PANEL 2: AI Pattern Coach */}
            <div
              className="reveal"
              data-testid="panel-ai-coach"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                padding: "24px",
                transition: "border-color 0.3s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
            >
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#14B8A6", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "16px" }}>AI Pattern Coach</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ alignSelf: "flex-end", background: "rgba(255,255,255,0.06)", padding: "10px 14px", maxWidth: "85%" }}>
                  <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "12px", color: "#ccc" }}>I just ghosted her again</p>
                </div>
                <div style={{ alignSelf: "flex-start", borderLeft: "2px solid #14B8A6", padding: "10px 14px", maxWidth: "85%", background: "rgba(20,184,166,0.04)" }}>
                  <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "12px", color: "#ccc" }}>Disappearing pattern. What did you feel in your chest right before you pulled away?</p>
                </div>
              </div>
            </div>

            {/* PANEL 3: Body Signature Map */}
            <div
              className="reveal"
              data-testid="panel-body-map"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                padding: "24px",
                transition: "border-color 0.3s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
            >
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#14B8A6", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "16px" }}>Body Signature Map</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "20px" }}>
                <svg viewBox="0 0 60 140" width="50" height="120" style={{ flexShrink: 0 }}>
                  <ellipse cx="30" cy="14" rx="10" ry="12" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
                  <line x1="30" y1="26" x2="30" y2="80" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
                  <line x1="30" y1="40" x2="8" y2="65" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
                  <line x1="30" y1="40" x2="52" y2="65" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
                  <line x1="30" y1="80" x2="15" y2="130" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
                  <line x1="30" y1="80" x2="45" y2="130" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
                  <circle cx="30" cy="42" r="3" fill="#14B8A6" opacity="0.8"/>
                  <circle cx="30" cy="62" r="3" fill="#14B8A6" opacity="0.8"/>
                  <circle cx="8" cy="65" r="2.5" fill="#14B8A6" opacity="0.8"/>
                </svg>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {[{ label: "Tightness", area: "Chest" }, { label: "Drop", area: "Stomach" }, { label: "Cold", area: "Hands" }].map((sig) => (
                    <div key={sig.area} className="flex items-center gap-2">
                      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#14B8A6", display: "inline-block" }} />
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "white" }}>{sig.label}</span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#555" }}>({sig.area})</span>
                    </div>
                  ))}
                </div>
              </div>
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "11px", color: "#666", marginTop: "14px", textAlign: "center" }}>Your pattern has a physical signal. Learn to read it.</p>
            </div>

            {/* PANEL 4: Interrupt Protocol */}
            <div
              className="reveal"
              data-testid="panel-interrupt"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                padding: "24px",
                transition: "border-color 0.3s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
            >
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#14B8A6", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "16px" }}>The Interrupt Protocol</p>
              <div style={{ background: "rgba(0,0,0,0.4)", padding: "14px", border: "1px solid rgba(255,255,255,0.04)", marginBottom: "12px" }}>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#EC4899", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>CIRCUIT BREAK — Disappearing Pattern</p>
                <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "12px", color: "#ccc", fontStyle: "italic", lineHeight: 1.6 }}>
                  "The pattern is running. I feel the tightness. I'm choosing to stay."
                </p>
              </div>
              <div>
                <div className="flex items-center justify-between gap-2 flex-wrap" style={{ marginBottom: "4px" }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#999" }}>Progress</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#14B8A6" }}>Day 11 of 90</span>
                </div>
                <div style={{ height: "3px", background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                  <div style={{ width: "12%", height: "100%", background: "#14B8A6" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== SECTION 9: PRICING ========== */}
      <section ref={sectionRefs.pricing} className="py-24 md:py-32 px-6" data-testid="section-pricing" style={{ position: "relative" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center" style={{ marginBottom: "48px" }}>
            <SectionLabel>CHOOSE YOUR DEPTH</SectionLabel>
            <h2 className="reveal reveal-delay-1" style={{ fontFamily: "'Schibsted Grotesk', sans-serif", fontWeight: 900, textTransform: "uppercase", fontSize: "clamp(1.8rem, 4vw, 2.5rem)", color: "white" }} data-testid="text-pricing-headline">
              Start Free. Go Deeper When You're Ready.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* Crash Course */}
            <div className="reveal flex flex-col" style={{ background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden", position: "relative" }} data-testid="card-pricing-crash-course">
              <div style={{ position: "relative", height: "250px", overflow: "hidden" }}>
                <img src={productCrashCourse} alt="The Crash Course" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.7 }} data-testid="img-product-crash-course" />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, #0D0D0D 100%)" }} />
              </div>
              <div style={{ padding: "0 32px 40px", position: "relative", zIndex: 1, marginTop: "-40px" }}>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem", color: "#14B8A6", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "8px" }}>FREE</p>
                <p style={{ fontFamily: "'Schibsted Grotesk', sans-serif", fontWeight: 900, fontSize: "2.5rem", color: "white", marginBottom: "16px" }}>$0</p>
                <p style={{ fontFamily: "'Schibsted Grotesk', sans-serif", fontWeight: 900, textTransform: "uppercase", fontSize: "1.2rem", color: "white", marginBottom: "16px" }}>The Crash Course</p>
                <p style={{ color: "#999", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "32px", flex: 1 }}>
                  Your pattern found. 7-day intro to pattern breaking. Body signal basics. Your first circuit break.
                </p>
                <Link
                  href="/quiz"
                  className="block w-full text-center py-3 border border-white/80 text-white tracking-wider uppercase transition-all duration-300 hover:bg-white hover:text-black"
                  style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem" }}
                  data-testid="button-pricing-free"
                >
                  START FREE <ArrowRight className="inline w-3 h-3 ml-1" />
                </Link>
              </div>
            </div>

            {/* Field Guide - emphasized */}
            <div className="reveal reveal-delay-1 flex flex-col" style={{ background: "#0D0D0D", border: "2px solid #14B8A6", overflow: "hidden", position: "relative", transform: "scale(1.02)" }} data-testid="card-pricing-field-guide">
              <div style={{ position: "relative", height: "250px", overflow: "hidden" }}>
                <img src={productFieldGuide} alt="The Field Guide" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.75 }} data-testid="img-product-field-guide" />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, #0D0D0D 100%)" }} />
                <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 60px rgba(20, 184, 166, 0.15)", pointerEvents: "none" }} />
              </div>
              <div style={{ padding: "0 32px 40px", position: "relative", zIndex: 1, marginTop: "-40px" }}>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem", color: "#14B8A6", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "8px" }}>YOUR PATTERN</p>
                <p style={{ fontFamily: "'Schibsted Grotesk', sans-serif", fontWeight: 900, fontSize: "2.5rem", color: "white", marginBottom: "16px" }}>$47</p>
                <p style={{ fontFamily: "'Schibsted Grotesk', sans-serif", fontWeight: 900, textTransform: "uppercase", fontSize: "1.2rem", color: "white", marginBottom: "16px" }}>The Field Guide</p>
                <p style={{ color: "#999", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "20px" }}>
                  Everything about YOUR pattern. Full body signal mapping. Custom interrupt steps. How your pattern shows up in love. 90+ pages. AI pattern coach access.
                </p>
                <p style={{ color: "#ccc", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "24px" }}>
                  The Pocket Archivist — included free during the founding period. ($27/month value when it launches publicly.) Pull it out when the pattern fires. It responds in seconds.
                </p>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#14B8A6", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "24px", lineHeight: 1.6 }} data-testid="text-founding-field-guide">
                  FOUNDING PERIOD PRICING — THIS CHANGES WHEN WE LAUNCH PUBLICLY
                </p>
                <button
                  onClick={() => handleCheckout("quick-start")}
                  className="block w-full text-center py-3 text-white tracking-wider uppercase transition-all duration-300 cursor-pointer"
                  style={{ border: "2px solid #14B8A6", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem", background: "transparent" }}
                  onMouseEnter={(e) => { const el = e.currentTarget; el.style.background = "#14B8A6"; el.style.color = "#0A0A0A"; }}
                  onMouseLeave={(e) => { const el = e.currentTarget; el.style.background = "transparent"; el.style.color = "white"; }}
                  data-testid="button-pricing-field-guide"
                >
                  GET YOUR FIELD GUIDE <ArrowRight className="inline w-3 h-3 ml-1" />
                </button>
              </div>
            </div>

            {/* Complete Archive */}
            <div className="reveal reveal-delay-2 flex flex-col" style={{ background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden", position: "relative" }} data-testid="card-pricing-archive">
              <div style={{ position: "relative", height: "250px", overflow: "hidden" }}>
                <img src={productCompleteArchive} alt="The Complete Archive" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.7 }} data-testid="img-product-complete-archive" />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, #0D0D0D 100%)" }} />
              </div>
              <div style={{ padding: "0 32px 40px", position: "relative", zIndex: 1, marginTop: "-40px" }}>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem", color: "#14B8A6", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "8px" }}>ALL 9 PATTERNS</p>
                <p style={{ fontFamily: "'Schibsted Grotesk', sans-serif", fontWeight: 900, fontSize: "2.5rem", color: "white", marginBottom: "16px" }}>$197</p>
                <p style={{ fontFamily: "'Schibsted Grotesk', sans-serif", fontWeight: 900, textTransform: "uppercase", fontSize: "1.2rem", color: "white", marginBottom: "16px" }}>The Complete Archive</p>
                <p style={{ color: "#999", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "20px" }}>
                  The full Archivist Method. All 9 patterns mapped out. How patterns feed each other. Advanced tools. The Four Doors system. Full Vault access. 600+ pages.
                </p>
                <p style={{ color: "#ccc", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "24px" }}>
                  Full Pocket Archivist access across all 9 patterns. Every scenario. Every trigger. Every circuit break. Available 24 hours a day. ($27/month value — included permanently with your purchase.)
                </p>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#14B8A6", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "24px", lineHeight: 1.6 }} data-testid="text-founding-archive">
                  FOUNDING PERIOD PRICING — THIS CHANGES WHEN WE LAUNCH PUBLICLY
                </p>
                <button
                  onClick={() => handleCheckout("complete-archive")}
                  className="block w-full text-center py-3 border border-white/80 text-white tracking-wider uppercase transition-all duration-300 hover:bg-white hover:text-black cursor-pointer"
                  style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem" }}
                  data-testid="button-pricing-archive"
                >
                  GET THE COMPLETE ARCHIVE <ArrowRight className="inline w-3 h-3 ml-1" />
                </button>
              </div>
            </div>
          </div>

          <p className="reveal reveal-delay-3 text-center" style={{ color: "#737373", fontSize: "13px", marginTop: "32px" }}>
            One-time purchase. No subscriptions. No recurring charges. Yours forever.
          </p>
          <p className="reveal reveal-delay-3 text-center" style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "1rem", color: "#14B8A6", marginTop: "16px", opacity: 0.8 }} data-testid="text-guarantee">
            If you can't identify your primary body signature within 7 days, full refund. No explanation needed.
          </p>
        </div>
      </section>

      {/* ========== SECTION 11: FOUNDER ========== */}
      <section ref={sectionRefs.founder} className="px-6 candle-flicker" data-testid="section-founder" style={{ position: "relative", paddingTop: "120px", paddingBottom: "120px", backgroundImage: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(217,168,88,0.04) 0%, transparent 70%)", animationName: "candleFlicker2", animationDuration: "5s" }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center" style={{ marginBottom: "48px" }}>
            <p className="reveal" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "#737373", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "16px" }}>
              FIELD NOTES
            </p>
            <h2 className="reveal reveal-delay-1" style={{ fontFamily: "'Schibsted Grotesk', sans-serif", fontWeight: 900, textTransform: "uppercase", fontSize: "2rem", color: "white" }} data-testid="text-founder-headline">
              About The Founder
            </h2>
          </div>

          <div className="reveal reveal-delay-2 text-center" style={{ lineHeight: 1.8 }}>
            <p style={{ color: "#ccc", fontSize: "1.1rem", marginBottom: "24px" }}>
              I built this because I was watching patterns tear apart something I cared about deeply. Someone I love was stuck in the same loops I was — and neither of us knew how to stop. We could see it happening. We could name it. We just couldn't break the cycle.
            </p>
            <p style={{ color: "#ccc", fontSize: "1.1rem", marginBottom: "24px" }}>
              So I started digging. Hard. Pulling apart every system I could find. Looking for the one thing under all of it that actually worked. Not in six months. Not in theory. Right now. In the middle of the fight. In the middle of the flood.
            </p>
            <p style={{ color: "#ccc", fontSize: "1.1rem", marginBottom: "48px" }}>
              This method is what I found. I built it for us. I'm sharing it because I know we're not the only ones.
            </p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", color: "#F5F5F5", fontStyle: "italic", marginBottom: "20px", letterSpacing: "0.02em" }}>
              For her.
            </p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem", color: "#888", fontStyle: "italic", letterSpacing: "0.04em", transform: "rotate(-1.5deg)", display: "inline-block" }}>
              — Aaron
            </p>
          </div>
        </div>
      </section>

      {/* ========== SECTION 12: FINAL CTA - EXIT INTERVIEW ========== */}
      <ExitInterviewSection sectionRef={sectionRefs.finalCta} />

      {/* ========== RESEARCH CITATIONS ========== */}
      <div style={{ padding: "32px 24px 0", borderTop: "1px solid rgba(255,255,255,0.04)" }} data-testid="section-citations">
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#666", textAlign: "center", maxWidth: "700px", margin: "0 auto", lineHeight: 1.8 }}>
          Research Foundation: Libet, B. (1983). Time of conscious intention to act. <em>Brain</em>. · LeDoux, J. (1996). <em>The Emotional Brain</em>. · van der Kolk, B. (2014). <em>The Body Keeps the Score</em>. · Porges, S. (2011). <em>The Polyvagal Theory</em>. · Duhigg, C. (2012). <em>The Power of Habit</em>.
        </p>
      </div>

      {/* ========== FOOTER ========== */}
      <footer style={{ padding: "48px 24px" }}>
        <div className="max-w-4xl mx-auto text-center">
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "13px", color: "#14B8A6", fontStyle: "italic", opacity: 0.6 }}>
            "The archive is open. Don't close the door."
          </p>

          <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "12px", color: "#555", marginTop: "32px" }}>
            &copy; 2026 The Archivist Method&trade; · Pattern archaeology, <span style={{ color: "#EC4899" }}>not</span> therapy.
          </p>

          <div className="flex justify-center gap-4" style={{ marginTop: "16px" }}>
            <Link href="/terms" className="transition-colors hover:text-white" style={{ fontFamily: "'Source Sans 3', sans-serif", color: "#444", fontSize: "12px" }} data-testid="link-terms">Terms</Link>
            <span style={{ color: "#333", fontSize: "12px" }}>&middot;</span>
            <Link href="/privacy" className="transition-colors hover:text-white" style={{ fontFamily: "'Source Sans 3', sans-serif", color: "#444", fontSize: "12px" }} data-testid="link-privacy">Privacy</Link>
            <span style={{ color: "#333", fontSize: "12px" }}>&middot;</span>
            <Link href="/contact" className="transition-colors hover:text-white" style={{ fontFamily: "'Source Sans 3', sans-serif", color: "#444", fontSize: "12px" }} data-testid="link-contact">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
