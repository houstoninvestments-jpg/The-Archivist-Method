import { Link } from "wouter"; //
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import ImmersiveFrames from "@/components/ImmersiveFrames";
import { apiRequest } from "@/lib/queryClient";
import { quizQuestions, calculatePatternScores, determineQuizResult, calculateMatchPercent, patternDisplayNames, patternDescriptions, PatternKey } from '@/lib/quizData';
import { Check } from 'lucide-react';
const heroSeatedImg = "/hero-archivist-seated.webp";
import productCrashCourse from "@assets/product-crash-course.webp";
import productFieldGuide from "@assets/product-field-guide.webp";
import productCompleteArchive from "@assets/product-complete-archive.webp";

function HeroWordReveal({ text, color, onComplete }: { text: string; color: string; onComplete?: () => void }) {
  const words = text.split(" ");
  const stagger = 0.15;
  const duration = 0.6;
  const totalMs = ((words.length - 1) * stagger + duration) * 1000;

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isBot = document.documentElement.classList.contains("is-bot");
    const delay = prefersReduced || isBot ? 0 : totalMs;
    const timer = setTimeout(() => onComplete?.(), delay);
    return () => clearTimeout(timer);
  }, [onComplete, totalMs]);

  return (
    <span style={{ display: "inline" }}>
      {words.map((word, i) => (
        <span key={i} style={{ display: "inline-block", whiteSpace: "nowrap", marginRight: "0.3em" }}>
          <span className="hero-word-drop" style={{ display: "inline-block", color, animationDelay: `${i * stagger}s` }}>
            {word}
          </span>
        </span>
      ))}
    </span>
  );
}

function useProximityGlow(ctaRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(hover: none)").matches;
    if (prefersReduced || isMobile) return;

    const el = ctaRef.current;
    if (!el) return;

    let frame: number;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dist = Math.sqrt((e.clientX - cx) ** 2 + (e.clientY - cy) ** 2);
        const maxDist = 150;
        if (dist > maxDist) {
          el.style.boxShadow = "";
          return;
        }
        const intensity = 1 - dist / maxDist;
        const spread = 8 + intensity * 20;
        const alpha = 0.08 + intensity * 0.35;
        el.style.boxShadow = `0 0 ${spread}px rgba(0, 212, 170, ${alpha})`;
      });
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("mousemove", onMove);
      if (el) el.style.boxShadow = "";
    };
  }, [ctaRef]);
}

function ArchivistDemoModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [step, setStep] = useState<1 | 2 | 3 | 'done'>(1);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const [aiResponses, setAiResponses] = useState<string[]>([]);
  const [history, setHistory] = useState<Array<{role: string; content: string}>>([]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    const currentStep = step as number;
    const userInput = input.trim();
    setInput('');

    try {
      const res = await fetch('/api/archivist-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: currentStep, userInput, history }),
      });
      const data = await res.json();
      const aiText = data.response || "Your pattern is speaking. The method is listening.";
      setAiResponses(prev => [...prev, aiText]);
      setHistory(prev => [
        ...prev,
        { role: 'user', content: userInput },
        { role: 'assistant', content: aiText },
      ]);
      if (currentStep === 1) setStep(2);
      else if (currentStep === 2) setStep('done');
    } catch {
      setAiResponses(prev => [...prev, "__ERROR__"]);
      if (currentStep === 1) setStep(2);
      else if (currentStep === 2) setStep('done');
    } finally {
      setLoading(false);
    }
  };

  const handleQuizCta = () => {
    onClose();
    setTimeout(() => {
      const quizSection = document.querySelector('[data-testid="section-final-cta"]');
      if (quizSection) quizSection.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  if (!isOpen) return null;

  const promptStyle: React.CSSProperties = { fontFamily: "'Inter', sans-serif", fontSize: "1.05rem", color: "white", lineHeight: 1.7, marginBottom: "24px" };
  const aiStyle: React.CSSProperties = { fontFamily: "'Inter', sans-serif", fontSize: "1.05rem", color: "#ccc", lineHeight: 1.7, borderLeft: "2px solid #14B8A6", paddingLeft: "20px", marginBottom: "32px", animation: "fadeInUp 0.6s ease-out" };
  const inputStyle: React.CSSProperties = { width: "100%", background: "#111", border: "1px solid #1a1a1a", borderRadius: "12px", color: "white", fontFamily: "'Inter', sans-serif", fontSize: "1rem", padding: "16px", resize: "none", outline: "none", minHeight: "80px", marginBottom: "16px" };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center"
      style={{ background: "rgba(10,10,10,0.97)", backdropFilter: "blur(12px)", overflowY: "auto" }}
      data-testid="modal-archivist-demo"
    >
      <button
        onClick={onClose}
        style={{ position: "fixed", top: "24px", right: "24px", background: "none", border: "none", color: "#14B8A6", fontSize: "28px", cursor: "pointer", zIndex: 60, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}
        data-testid="button-close-demo-modal"
      >
        &times;
      </button>

      <div style={{ maxWidth: "640px", width: "100%", padding: "80px 24px 64px", margin: "0 auto" }}>
        <div className="text-center" style={{ marginBottom: "48px" }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 900, fontSize: "clamp(2rem, 5vw, 3rem)", color: "white", textTransform: "uppercase", lineHeight: 1.1, marginBottom: "16px" }}>
            MEET YOUR PATTERN.
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontStyle: "italic", fontSize: "1.05rem", color: "#14B8A6", maxWidth: "480px", margin: "0 auto", lineHeight: 1.7 }}>
            Three questions. That's all it takes to feel the difference between insight and interruption.
          </p>
        </div>

        {step === 'done' ? (
          <div style={{ animation: "fadeInUp 0.6s ease-out" }} className="text-center">
            {aiResponses[1] && aiResponses[1] !== "__ERROR__" && (
              <div style={{ ...aiStyle, textAlign: "left", marginBottom: "48px" }}>{aiResponses[1]}</div>
            )}
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 900, fontSize: "clamp(1.5rem, 4vw, 2.25rem)", color: "white", textTransform: "uppercase", lineHeight: 1.1, marginBottom: "32px" }}>
              Your pattern has a name. The exit has a door.
            </h3>
            <div style={{ maxWidth: "320px", margin: "0 auto 16px" }}>
              <div className="cta-glow-wrap" style={{ display: "block", width: "100%" }}>
                <div className="cta-glow-border" />
                <button
                  onClick={handleQuizCta}
                  className="cta-glow-inner block w-full text-center py-3 text-white tracking-wider uppercase"
                  style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem", cursor: "pointer", border: "none" }}
                  data-testid="button-demo-take-quiz"
                >
                  TAKE THE FULL QUIZ <ArrowRight className="inline w-3 h-3 ml-1" />
                </button>
              </div>
            </div>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#999", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "16px" }}>
              Free. 2 minutes. No email required until you're ready.
            </p>
          </div>
        ) : (
          <div>
            {aiResponses[0] && step === 2 && (
              <div style={aiStyle}>
                {aiResponses[0] === "__ERROR__" ? (
                  <div className="flex items-center gap-3">
                    <span style={{ color: "#999" }}>The signal dropped.</span>
                    <button
                      onClick={() => { setAiResponses([]); setHistory([]); setStep(1); }}
                      style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "#14B8A6", background: "none", border: "1px solid rgba(20,184,166,0.4)", padding: "6px 14px", cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.1em" }}
                      data-testid="button-demo-retry"
                    >
                      Try again
                    </button>
                  </div>
                ) : aiResponses[0]}
              </div>
            )}

            <p style={promptStyle}>
              {step === 1
                ? "Think of the last time you did the thing you're trying to stop. What did you feel in your body right before it happened?"
                : "How long has that feeling been your starting gun?"
              }
            </p>

            <textarea
              style={inputStyle}
              value={input}
              onChange={(e) => setInput(e.target.value.slice(0, 200))}
              placeholder={step === 1 ? "Describe the sensation..." : "How long..."}
              maxLength={200}
              onFocus={(e) => { e.target.style.borderColor = "#14B8A6"; }}
              onBlur={(e) => { e.target.style.borderColor = "#1a1a1a"; }}
              data-testid={`input-demo-step-${step}`}
            />

            {loading ? (
              <div className="text-center" style={{ padding: "20px 0" }}>
                <span className="animate-pulse" style={{ fontFamily: "'Inter', sans-serif", fontStyle: "italic", fontSize: "1rem", color: "#14B8A6" }}>
                  Reading your signal...
                </span>
              </div>
            ) : (
              <div style={{ maxWidth: "240px" }}>
                <div className="cta-glow-wrap" style={{ display: "block", width: "100%" }}>
                  <div className="cta-glow-border" />
                  <button
                    onClick={handleSubmit}
                    disabled={!input.trim()}
                    className="cta-glow-inner block w-full text-center py-3 text-white tracking-wider uppercase"
                    style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem", cursor: input.trim() ? "pointer" : "default", opacity: input.trim() ? 1 : 0.4, border: "none" }}
                    data-testid={`button-demo-submit-${step}`}
                  >
                    {step === 1 ? "I FELT..." : "ABOUT..."} <ArrowRight className="inline w-3 h-3 ml-1" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const StarField = ({ count = 40 }: { count?: number }) => {
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

const FloatingParticles = ({ count = 12 }: { count?: number }) => {
  const rnd = (min: number, max: number) => Math.random() * (max - min) + min;
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: rnd(5, 95),
    y: rnd(5, 95),
    size: rnd(1, 3),
    opacity: rnd(0.1, 0.4),
    duration: rnd(10.5, 17.5),
    delay: rnd(-18, 0),
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
            willChange: 'transform',
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
  { num: "01", name: "DISAPPEARING", desc: "You leave before they can.\nNot physically — emotionally.\nThe door closes inside you first.", trigger: "They're getting too close. I need to leave before they see the real me.", signal: "Your chest tightens the moment they say 'we need to talk.' You're already planning the exit.", interrupt: "Notice the tightening. Name it. You don't have to move yet." },
  { num: "02", name: "APOLOGY LOOP", desc: "You say sorry before you know\nwhat you did. Their discomfort\nfeels like your fault by default.", trigger: "I'm sorry. I shouldn't have said anything. I'm sorry for being sorry.", signal: "You feel their mood shift and your stomach drops. The apology forms before you know what you did.", interrupt: "Ask yourself — did I actually do something wrong? Wait for the answer." },
  { num: "03", name: "TESTING", desc: "You push to see if they'll stay.\nThen hate yourself when they don't.\nThen do it again.", trigger: "If they really loved me, they'd stay no matter what I do.", signal: "You say something sharp and watch their face. You need to know if they'll leave.", interrupt: "Say the sharp thing silently. Give yourself 7 seconds." },
  { num: "04", name: "ATTRACTION TO HARM", desc: "They feel electric. That feeling\nis familiarity — not chemistry.\nYou've been here before.", trigger: "I know this person is bad for me. I can't stop going back.", signal: "Something about them feels electric. That electricity is familiarity — not chemistry.", interrupt: "Ask — does this feel exciting or does it feel like home?" },
  { num: "05", name: "COMPLIMENT DEFLECTION", desc: "Something good lands and your\nbody rejects it. You can't let\nit in. You don't know why.", trigger: "They don't mean it. And if they do, they're wrong.", signal: "They say something kind and your body rejects it before your mind can process it.", interrupt: "Say thank you. Just that. Nothing after it." },
  { num: "06", name: "DRAINING BOND", desc: "You stay because leaving feels\nlike abandonment. Even when\nstaying is destroying you.", trigger: "I should leave. I know I should leave. I'll leave tomorrow.", signal: "You feel responsible for their emotional state. You can't leave without fixing them first.", interrupt: "Their feelings are information. Not a task assigned to you." },
  { num: "07", name: "SUCCESS SABOTAGE", desc: "The closer it gets to working,\nthe harder you burn it down.\nEvery time. Right before.", trigger: "It's actually going well. Something's about to go wrong. I'll just end it myself.", signal: "Things are going well. Your body starts looking for what's wrong.", interrupt: "The search for danger is the pattern. Name it before it finds something." },
  { num: "08", name: "PERFECTIONISM TRAP", desc: "It's not ready. It's never ready.\nShipping means someone can\njudge it. Safer to keep building.", trigger: "It's not ready. It'll never be ready. I'd rather not ship it than ship it wrong.", signal: "It's not ready. It's never ready. You keep working so you never have to ship.", interrupt: "Done and out is worth more than perfect and hidden." },
  { num: "09", name: "RAGE PATTERN", desc: "The heat moves before you decide\nto be angry. After, you wonder\nwho that was.", trigger: "That was nothing. Why am I this angry. What's wrong with me.", signal: "Something small happens and the heat moves up from your chest before you decide to be angry.", interrupt: "The heat is the signal. You have 3 seconds before the pattern takes over." },
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

function useGlobalFadeIn() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".fade-section").forEach((el) => observer.observe(el));
    document.querySelectorAll(".bento-panel").forEach((el) => observer.observe(el));

    const failsafe = setTimeout(() => {
      document.querySelectorAll(".fade-section, .bento-panel").forEach((el) => el.classList.add("visible"));
      document.querySelectorAll('[style*="opacity: 0"]').forEach((el) => {
        (el as HTMLElement).style.opacity = "1";
        (el as HTMLElement).style.transform = "none";
      });
    }, 2000);

    return () => {
      observer.disconnect();
      clearTimeout(failsafe);
    };
  }, []);
}

const STRIPE_PAYMENT_LINKS: Record<string, string> = {
  "quick-start": "https://buy.stripe.com/cNidR1eKi8cb16qalY6c001",
  "complete-archive": "https://buy.stripe.com/8x214f7hQdwv2augKm6c002",
};

function handleCheckout(product: string) {
  const stripeUrl = STRIPE_PAYMENT_LINKS[product];
  if (stripeUrl) {
    window.open(stripeUrl, "_blank", "noopener,noreferrer");
    return;
  }
}

function CTAButton({ text, variant, glowRef }: { text: string; variant?: "teal"; glowRef?: React.RefObject<HTMLDivElement | null> }) {
  const isTeal = variant === "teal";
  const [hovered, setHovered] = useState(false);

  if (isTeal) {
    return (
      <div className={`cta-glow-wrap ${glowRef ? "cta-proximity-glow" : ""}`} data-testid="button-cta-wrap" ref={glowRef || undefined}>
        <div className="cta-glow-border" />
        <Link
          href="/quiz"
          data-testid="button-cta"
          className="cta-glow-inner block text-center tracking-[0.15em] uppercase"
          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "15px", padding: "18px 48px" }}
        >
          {text}
        </Link>
      </div>
    );
  }

  return (
    <div className={`cta-glow-wrap ${glowRef ? "cta-proximity-glow" : ""}`} data-testid="button-cta-wrap" ref={glowRef || undefined}>
      <div className="cta-glow-border" />
      <Link
        href="/quiz"
        data-testid="button-cta"
        className="cta-glow-inner block text-center tracking-[0.15em] uppercase"
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "15px", padding: "18px 48px" }}
      >
        {text}
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

const embeddedScanLines = [
  "Scanning 9 behavioral patterns...",
  "Cross-referencing your response signature...",
  "Identifying your primary loop...",
  "Checking for secondary reinforcement patterns...",
  "Your Archivist file is being compiled...",
];

function EmbeddedSequentialLoading({ containerStyle }: { containerStyle: React.CSSProperties }) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [showFinal, setShowFinal] = useState(false);
  const [progressWidth, setProgressWidth] = useState(0);

  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setProgressWidth(100);
      });
    });

    const timers: ReturnType<typeof setTimeout>[] = [];
    embeddedScanLines.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleLines(i + 1), (i + 1) * 1500));
    });
    timers.push(setTimeout(() => setShowFinal(true), embeddedScanLines.length * 1500 + 500));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={containerStyle} data-testid="embedded-quiz-analyzing">
      <div style={{ padding: '24px 0' }}>
        <div style={{ marginBottom: '32px' }}>
          {embeddedScanLines.map((line, i) => (
            <p
              key={i}
              data-testid={`text-embedded-scan-line-${i + 1}`}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '12px',
                color: '#999',
                marginBottom: '14px',
                opacity: i < visibleLines ? 1 : 0,
                transform: i < visibleLines ? 'translateY(0)' : 'translateY(8px)',
                transition: 'opacity 600ms ease, transform 600ms ease',
              }}
            >
              {line}
            </p>
          ))}
        </div>

        <div
          data-testid="text-embedded-scan-final"
          style={{
            opacity: showFinal ? 1 : 0,
            transform: showFinal ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 800ms ease, transform 800ms ease',
            textAlign: 'center',
            marginBottom: '32px',
          }}
        >
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontStyle: 'italic',
              fontSize: '1rem',
              color: '#14B8A6',
              lineHeight: 1.6,
            }}
          >
            Your pattern has a name. And a way out.
          </p>
        </div>

        <div
          style={{
            height: '2px',
            background: 'rgba(255, 255, 255, 0.06)',
            width: '100%',
            overflow: 'hidden',
          }}
          data-testid="bar-embedded-analyzing-progress"
        >
          <div
            style={{
              height: '100%',
              background: '#14B8A6',
              width: `${progressWidth}%`,
              transition: 'width 7.5s linear',
            }}
          />
        </div>
      </div>
    </div>
  );
}

function EmbeddedQuiz() {
  const [phase, setPhase] = useState<'quiz' | 'analyzing' | 'reveal' | 'emailCapture'>('quiz');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [primaryPattern, setPrimaryPattern] = useState<PatternKey | null>(null);
  const [scores, setScores] = useState<Record<PatternKey, number> | null>(null);
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
        setPhase('reveal');
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [phase, answers]);

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
    return <EmbeddedSequentialLoading containerStyle={containerStyle} />;
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
            <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 700, fontSize: "1.3rem", color: "white", marginBottom: "8px" }}>
              Which pattern do you recognize?
            </p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", color: "#999" }}>
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
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: "white", marginBottom: "4px" }}>
                  {patternDisplayNames[pattern]}
                </p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "#AAAAAA", lineHeight: 1.4 }}>
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
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: "#999999", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "24px" }}>
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

          <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)", color: "white", fontWeight: 700, marginBottom: "8px" }} data-testid="text-embedded-pattern-name">
            <span ref={typewriterRef} />
            {!typewriterDone && <span style={{ color: "#14B8A6", animation: "blink 0.8s step-end infinite" }}>|</span>}
          </h3>

          <div style={{ height: "2px", width: "64px", background: "#14B8A6", margin: "0 auto 24px", opacity: typewriterDone ? 1 : 0, transition: "opacity 300ms" }} />

          <div style={{ opacity: copyVisible ? 1 : 0, transform: copyVisible ? "translateY(0)" : "translateY(12px)", transition: "all 300ms", marginBottom: "32px" }}>
            {currentCopy.map((paragraph, i) => (
              <p key={i} style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.05rem", color: "#ccc", lineHeight: 1.7, maxWidth: "460px", margin: "0 auto 12px" }}>
                {paragraph}
              </p>
            ))}
          </div>

          <div style={{ opacity: buttonsVisible ? 1 : 0, transform: buttonsVisible ? "translateY(0)" : "translateY(12px)", transition: "all 300ms" }}>
            <p style={{ fontFamily: "'Inter', sans-serif", color: "white", fontWeight: 500, marginBottom: "16px" }} data-testid="text-embedded-confirmation">
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
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.2em", color: "#14B8A6", fontWeight: 600, marginBottom: "12px" }}>
            Pattern Confirmed
          </p>
          <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 700, fontSize: "1.5rem", color: "white", marginBottom: "8px" }}>
            {finalName}
          </h3>
          <div style={{ height: "2px", width: "48px", background: "#14B8A6", margin: "0 auto 12px" }} />
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", color: "#999" }}>
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
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: "#ccc" }}>{item}</span>
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
              fontFamily: "'Inter', sans-serif", marginBottom: "12px", outline: "none",
              boxSizing: "border-box",
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "#14B8A6"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}
          />
          <div className="cta-glow-wrap cta-glow-full" style={{ display: "block", width: "100%" }}>
            <div className="cta-glow-border" />
            <button
              type="submit"
              disabled={submitting}
              data-testid="button-embedded-submit"
              className="cta-glow-inner"
              style={{
                width: "100%", padding: "14px", color: "white",
                fontFamily: "'JetBrains Mono', monospace", fontSize: "14px", fontWeight: 700,
                textTransform: "uppercase", letterSpacing: "0.1em", border: "none", cursor: "pointer",
                opacity: submitting ? 0.5 : 1, transition: "opacity 200ms",
              }}
            >
              {submitting ? 'Opening Archive...' : 'Send Magic Link'}
            </button>
          </div>
          {error && <p style={{ color: "#EF4444", fontSize: "0.85rem", textAlign: "center", marginTop: "8px" }} role="alert">{error}</p>}
        </form>

        <p style={{ textAlign: "center", fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#AAAAAA", marginTop: "16px" }}>
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

      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: "#EC4899", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "12px" }} data-testid="text-question-counter">
        QUESTION {currentQuestion + 1} OF 15
      </p>

      <div style={{ overflow: "hidden" }}>
        <div style={{
          transform: sliding ? (slideDir === 'left' ? 'translateX(-100%)' : 'translateX(100%)') : 'translateX(0)',
          transition: sliding ? 'transform 200ms ease' : 'none',
          opacity: sliding ? 0 : 1,
        }}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.15rem", color: "white", marginBottom: "8px", lineHeight: 1.4 }} data-testid="text-question-title">
            {question.title}
          </p>

          {question.weight === 2 && (
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: "#14B8A6", marginBottom: "12px" }}>
              counts 2x
            </p>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "16px" }}>
            {question.options.map((option) => {
              const isQ15 = question.id === 15;
              const isHovered = hoveredOption === option.id;
              const isNeutral = option.id.endsWith('n');
              return (
                <button
                  key={option.id}
                  data-testid={`button-option-${option.id}`}
                  onClick={() => handleAnswer(option.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: isQ15 ? "12px" : "0",
                    background: answers[question.id] === option.id ? "rgba(20,184,166,0.2)" : isHovered && !isNeutral ? "rgba(20,184,166,0.15)" : "rgba(255,255,255,0.03)",
                    border: isNeutral
                      ? `1px dotted ${isHovered ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.08)"}`
                      : `1px solid ${isHovered ? "#14B8A6" : "rgba(20,184,166,0.3)"}`,
                    color: isNeutral ? "#999" : isHovered ? "#14B8A6" : "white",
                    padding: "12px 16px",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: isNeutral ? "0.82rem" : "0.9rem",
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "all 200ms ease",
                    width: "100%",
                    ...(isNeutral ? { marginTop: "4px" } : {}),
                  }}
                  onMouseEnter={() => setHoveredOption(option.id)}
                  onMouseLeave={() => setHoveredOption(null)}
                >
                  {isQ15 && !isNeutral && <BodySilhouette optionId={option.id} hovered={isHovered} />}
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
            background: "none", border: "none", color: "#AAAAAA", fontSize: "13px",
            fontFamily: "'JetBrains Mono', monospace", cursor: "pointer", marginTop: "16px",
            padding: "4px 0", transition: "color 200ms",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#999"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "#AAAAAA"; }}
        >
          &larr; Back
        </button>
      )}
    </div>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="fade-section" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: "#14B8A6", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "16px" }}>
      {children}
    </p>
  );
}

function PatternCard({ card, index, isOpen, onToggle }: { card: typeof patternCards[0]; index: number; isOpen: boolean; onToggle: () => void }) {
  return (
    <div
      className="bento-panel"
      style={{
        position: "relative",
        background: "rgba(255,255,255,0.02)",
        border: isOpen ? "1px solid rgba(0,255,209,0.5)" : "1px solid rgba(255,255,255,0.06)",
        boxShadow: isOpen ? "0 0 30px rgba(0,255,209,0.1)" : undefined,
        padding: "32px",
        paddingBottom: "48px",
        transitionDelay: `${index * 0.15}s`,
        cursor: "pointer",
        transition: "border 0.3s ease, box-shadow 0.3s ease",
      }}
      data-testid={`card-pattern-${card.num}`}
      onClick={onToggle}
    >
      <p style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "2rem",
        color: "#EC4899",
        marginBottom: "12px",
        letterSpacing: "0.05em",
      }}>{card.num}</p>
      <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 900, fontSize: "1rem", color: "white", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>{card.name}</p>
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontStyle: "italic",
        color: "#14B8A6",
        fontSize: "1rem",
        lineHeight: 1.6,
        whiteSpace: "pre-line",
      }}>
        {card.desc}
      </p>
      <div style={{
        overflow: "hidden",
        maxHeight: isOpen ? "400px" : "0px",
        transition: "max-height 400ms ease",
      }}>
        <div style={{
          borderTop: "1px solid rgba(0,255,209,0.2)",
          marginTop: "1rem",
          paddingTop: "1rem",
        }}>
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.7rem",
            color: "#00FFD1",
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            marginBottom: "0.4rem",
          }}>THE SIGNAL:</p>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontStyle: "normal",
            color: "#CBD5E1",
            fontSize: "0.85rem",
            lineHeight: 1.7,
            fontWeight: 400,
            marginBottom: "0.75rem",
          }}>{card.signal}</p>
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.7rem",
            color: "#FF2D9B",
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            marginBottom: "0.4rem",
          }}>THE INTERRUPT:</p>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontStyle: "normal",
            color: "#CBD5E1",
            fontSize: "0.85rem",
            lineHeight: 1.7,
            fontWeight: 400,
          }}>{card.interrupt}</p>
        </div>
      </div>
      <div style={{
        position: "absolute",
        bottom: "16px",
        right: "16px",
        fontFamily: "monospace",
        fontSize: "1.2rem",
        color: "#00FFD1",
        lineHeight: 1,
        userSelect: "none",
      }}>
        {isOpen ? "−" : "+"}
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
        fontSize: "13px",
        color: "#AAAAAA",
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
  const [hovered, setHovered] = useState(false);
  return (
    <div className="gut-pattern-slide fade-section" style={{ transitionDelay: `${index * 0.15}s`, textAlign: "center" }}>
      <div
        data-testid={`text-gut-pattern-${index}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          padding: "8px 0",
          paddingLeft: hovered ? "12px" : "0px",
          borderLeft: hovered ? "2px solid #00FFD1" : "2px solid transparent",
          transform: hovered ? "translateX(4px)" : "translateX(0)",
          transition: "all 300ms ease",
          cursor: "default",
        }}
      >
        <p
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontWeight: 900,
            fontSize: "1.2rem",
            textTransform: "uppercase",
            color: hovered ? "#00FFD1" : "white",
            margin: 0,
            transition: "all 300ms ease",
          }}
        >
          {pattern.name}
        </p>
        <p
          data-testid={`text-gut-desc-${index}`}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontStyle: "italic",
            fontSize: "1rem",
            color: hovered ? "#FF2D9B" : "#14B8A6",
            marginTop: "6px",
            transition: "all 300ms ease",
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



const countdownBeats = [
  { number: "Seven.", sub: null },
  { number: "Six.", sub: null },
  { number: "Five.", sub: "The pattern is loading." },
  { number: "Four.", sub: "Your body already knows." },
  { number: "Three.", sub: "This is the window." },
  { number: "Two.", sub: "Most people miss it." },
  { number: "One.", sub: "You just used it." },
  { number: "", sub: null },
  { number: "HEADLINE", sub: null },
];

function ExitInterviewSection() {
  const [beatIndex, setBeatIndex] = useState(-1);
  const [visible, setVisible] = useState(false);
  const [sequenceComplete, setSequenceComplete] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);
  const hasPlayedRef = useRef(false);
  const sectionObserverRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = sectionObserverRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasPlayedRef.current) {
            hasPlayedRef.current = true;
            setBeatIndex(0);
            setVisible(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (beatIndex < 0) return;
    if (beatIndex >= countdownBeats.length) {
      setSequenceComplete(true);
      setVisible(true);
      setTimeout(() => setCtaVisible(true), 400);
      return;
    }

    setVisible(true);
    const fadeOutTimer = setTimeout(() => {
      setVisible(false);
    }, 700);
    const nextBeatTimer = setTimeout(() => {
      setBeatIndex((prev) => prev + 1);
    }, 1000);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(nextBeatTimer);
    };
  }, [beatIndex]);

  const currentBeat = beatIndex >= 0 && beatIndex < countdownBeats.length ? countdownBeats[beatIndex] : null;
  const isBlankBeat = currentBeat?.number === "";
  const isHeadlineBeat = currentBeat?.number === "HEADLINE" || sequenceComplete;

  return (
    <section ref={sectionObserverRef} className="py-24 md:py-32 px-6" data-testid="section-final-cta" style={{ position: "relative" }}>
      <div className="max-w-3xl mx-auto text-center" style={{ minHeight: "280px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>

        {!sequenceComplete && currentBeat && !isBlankBeat && !isHeadlineBeat && (
          <div
            data-testid="text-countdown"
            style={{
              opacity: visible ? 1 : 0,
              transition: "opacity 300ms ease",
            }}
          >
            <h2
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontWeight: 900,
                textTransform: "uppercase",
                fontSize: "clamp(3rem, 8vw, 5rem)",
                color: "white",
                lineHeight: 1.1,
                marginBottom: currentBeat.sub ? "12px" : "0",
              }}
            >
              {currentBeat.number}
            </h2>
            {currentBeat.sub && (
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
                  color: "#14B8A6",
                  lineHeight: 1.5,
                }}
              >
                {currentBeat.sub}
              </p>
            )}
          </div>
        )}

        {!sequenceComplete && isBlankBeat && (
          <div style={{ opacity: 0 }}>&nbsp;</div>
        )}

        {(isHeadlineBeat || sequenceComplete) && (
          <>
            <h2
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontWeight: 900,
                textTransform: "uppercase",
                fontSize: "clamp(2.5rem, 6vw, 4rem)",
                color: "white",
                marginBottom: "24px",
                lineHeight: 1.1,
                opacity: visible ? 1 : 0,
                transition: "opacity 300ms ease",
              }}
              data-testid="text-final-cta-headline"
            >
              The window is closing.
            </h2>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontStyle: "italic",
                fontSize: "1.2rem",
                color: "#14B8A6",
                maxWidth: "520px",
                margin: "0 auto 40px",
                lineHeight: 1.5,
                opacity: visible ? 1 : 0,
                transition: "opacity 300ms ease 100ms",
              }}
              data-testid="text-final-cta-subtext"
            >
              You have 7 seconds before your brain convinces you to stay exactly as you are.
            </p>
            <div
              style={{
                opacity: ctaVisible ? 1 : 0,
                transform: ctaVisible ? "translateY(0)" : "translateY(12px)",
                transition: "opacity 400ms ease, transform 400ms ease",
              }}
            >
              <CTAButton text="INTERRUPT THE CYCLE NOW" />
              <p style={{ color: "#999999", fontSize: "13px", marginTop: "16px" }}>
                Free · 2 Minutes · Instant Results
              </p>
            </div>
          </>
        )}

        {beatIndex < 0 && (
          <div style={{ opacity: 0 }}>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 900, fontSize: "clamp(2.5rem, 6vw, 4rem)", color: "white" }}>
              The window is closing.
            </h2>
          </div>
        )}
      </div>
    </section>
  );
}

function TheWindowSection() {
  return (
    <section
      className="px-6"
      data-testid="section-window"
      style={{
        position: "relative",
        background: "#000",
        paddingTop: "120px",
        paddingBottom: "120px",
      }}
    >
      <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>

        <p className="fade-section" data-testid="text-window-label" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: "#EC4899", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "80px" }}>
          THE WINDOW
        </p>

        <h2 className="fade-section" data-testid="text-window-line1" style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 900, fontSize: "clamp(52px, 8vw, 72px)", color: "white", textTransform: "uppercase", lineHeight: 1.1, marginBottom: "48px" }}>
          YOUR BODY KNEW.
        </h2>

        <p className="fade-section" data-testid="text-window-line2" style={{ fontFamily: "'Inter', sans-serif", fontStyle: "italic", fontSize: "clamp(20px, 3vw, 24px)", color: "#14B8A6", lineHeight: 1.7, maxWidth: "560px", margin: "0 auto", paddingBottom: "80px" }}>
          Before the thought formed. Before the words came out. Before you did the thing you swore you wouldn't do again.
        </p>

        <h2 className="fade-section" data-testid="text-window-line3" style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 900, fontSize: "clamp(64px, 10vw, 96px)", color: "white", textTransform: "uppercase", lineHeight: 1.1, marginBottom: "48px" }}>
          3 TO 7 SECONDS.
        </h2>

        <p className="fade-section" data-testid="text-window-line4" style={{ fontFamily: "'Inter', sans-serif", fontSize: "18px", color: "#F5F5F5", lineHeight: 1.7, maxWidth: "560px", margin: "0 auto", paddingBottom: "80px" }}>
          When a pattern activates, your amygdala fires before your conscious mind catches up. In the seconds that follow — while your brain is fighting to regain control — there's a window. Most people never learn to use it. The Archivist Method is built for exactly that moment.
        </p>

        <h3 className="fade-section" data-testid="text-window-line5" style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 900, fontSize: "clamp(36px, 5vw, 48px)", color: "white", textTransform: "uppercase", lineHeight: 1.2, marginBottom: "48px" }}>
          WILLPOWER LIVES IN THE THINKING PART OF YOUR BRAIN.
        </h3>

        <p className="fade-section" data-testid="text-window-line6" style={{ fontFamily: "'Inter', sans-serif", fontStyle: "italic", fontSize: "clamp(20px, 3vw, 24px)", color: "#14B8A6", lineHeight: 1.7, maxWidth: "520px", margin: "0 auto", paddingBottom: "80px" }}>
          Your pattern doesn't live in your thoughts. It lives in your body — processed by the Insular Cortex before a single conscious word loads. Antonio Damasio proved this in 1994. Your body signal isn't anxiety. It's the announcement.
        </p>

        <h3 className="fade-section" data-testid="text-window-line7" style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 900, fontSize: "clamp(36px, 5vw, 48px)", color: "white", textTransform: "uppercase", lineHeight: 1.2 }}>
          THE ARCHIVIST METHOD TEACHES YOU WHAT TO DO INSIDE THAT WINDOW.
        </h3>

      </div>
    </section>
  );
}

const scrollSections = [
  { key: "hero", label: "Hero", testId: "section-hero" },
  { key: "gutCheck", label: "Gut Check", testId: "section-gut-check" },
  { key: "patterns", label: "Patterns", testId: "section-patterns" },
  { key: "ctaBreak", label: "Pattern File", testId: "section-cta-break" },
  { key: "window", label: "The Window", testId: "section-window" },
  { key: "whoFor", label: "For You", testId: "section-who-for" },
  { key: "howItWorks", label: "The Method", testId: "section-how-it-works" },
  { key: "notTherapy", label: "Not Therapy", testId: "section-not-therapy" },
  { key: "credibility", label: "The Archives", testId: "section-credibility" },
  { key: "pricing", label: "Pricing", testId: "section-pricing" },
  { key: "founder", label: "Founder", testId: "section-founder" },
  { key: "finalCta", label: "Exit", testId: "section-final-cta" },
];

function ScrollProgressThread() {
  const [activeKey, setActiveKey] = useState("hero");
  const [positions, setPositions] = useState<Record<string, number>>({});
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  useEffect(() => {
    let ticking = false;
    const calculate = () => {
      const docHeight = document.documentElement.scrollHeight;
      if (docHeight === 0) return;
      const scrollY = window.scrollY;
      const viewCenter = scrollY + window.innerHeight * 0.4;
      const newPositions: Record<string, number> = {};
      let closest = "hero";
      let closestDist = Infinity;
      scrollSections.forEach((s) => {
        if (s.key === "hero") {
          newPositions[s.key] = 0.03;
          const dist = viewCenter;
          if (dist >= 0 && dist < closestDist) { closestDist = dist; closest = s.key; }
          return;
        }
        const el = document.querySelector(`[data-testid="${s.testId}"]`);
        if (!el) return;
        const absTop = el.getBoundingClientRect().top + scrollY;
        newPositions[s.key] = Math.min(Math.max(absTop / docHeight, 0.03), 0.97);
        const dist = viewCenter - absTop;
        if (dist >= 0 && dist < closestDist) { closestDist = dist; closest = s.key; }
      });
      setPositions(newPositions);
      setActiveKey(closest);
    };
    const onScrollOrResize = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        calculate();
        ticking = false;
      });
    };

    calculate();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, []);

  const handleClick = (key: string) => {
    if (key === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const s = scrollSections.find((sec) => sec.key === key);
    if (s) {
      const el = document.querySelector(`[data-testid="${s.testId}"]`);
      if (el) el.scrollIntoView({ behavior: "smooth" });
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
      {scrollSections.map((s) => {
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
                boxShadow: isActive ? "0 0 10px rgba(20,184,166,0.6), 0 0 20px rgba(20,184,166,0.3)" : "none",
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
                fontSize: "13px",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: isActive ? "#14B8A6" : "#AAAAAA",
                whiteSpace: "nowrap",
                opacity: isActive ? 1 : isHovered ? 0.8 : 0.4,
                transition: "opacity 0.3s ease, color 0.3s ease",
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
  useGlobalFadeIn();
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [scrambleDone, setScrambleDone] = useState(false);
  const [openCardNum, setOpenCardNum] = useState<string | null>(null);
  const ctaGlowRef = useRef<HTMLDivElement>(null);
  useProximityGlow(ctaGlowRef);

  const pageRef = useRef<HTMLDivElement>(null);


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
        const parallaxOffset = scrollTop * 0.15;
        document.documentElement.style.setProperty("--hero-parallax", `${parallaxOffset}px`);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);


  return (
    <div ref={pageRef} className="min-h-screen thread-page" style={{ background: "#0A0A0A", color: "#F5F5F5", fontFamily: "'Inter', sans-serif", overflowX: "hidden" }}>
      <StarField />
      <FloatingParticles />
      <div className="bg-fog" />
      <div className="bg-grain" />
      <div className="bg-grid" />
      <ScrollProgressThread />



      {import.meta.env.DEV && (
        <div data-testid="test-mode-banner" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999, background: "#FACC15", color: "#000", textAlign: "center", padding: "6px 16px", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>
          TEST MODE ACTIVE
        </div>
      )}

      {/* ========== SECTION 1: HERO ========== */}
      <section className="min-h-screen flex items-center justify-center relative px-6 hero-section-fade" data-testid="section-hero" style={{ overflow: "hidden" }}>
        <div className="hero-parallax-bg" style={{ position: "absolute", inset: "-30% 0", zIndex: 0, willChange: "transform" }}>
          <img
            src={heroSeatedImg}
            loading="eager"
            decoding="sync"
            // @ts-ignore - fetchpriority is valid HTML but React doesn't recognize it
            fetchpriority="high"
            width={1920}
            height={1080}
            alt="The Archivist Method"
            className="lcp-image"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
            }}
          />
        </div>
        <div className="absolute inset-0 z-0 hero-overlay" />
        <div className="text-center max-w-3xl mx-auto relative z-10">
          <p
            className="hero-stagger tracking-[0.3em] uppercase"
            style={{ color: "#14B8A6", fontFamily: "'JetBrains Mono', monospace", fontSize: "14px", marginBottom: "48px" }}
            data-testid="text-brand-name"
          >
            THE ARCHIVIST METHOD&trade;
          </p>

          <p
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 400, textTransform: "uppercase", letterSpacing: "0.05em", color: "#ffffff", fontSize: "clamp(2rem, 5.5vw, 6rem)", lineHeight: 1, whiteSpace: "normal", wordBreak: "break-word" }}
            data-testid="text-brand-title"
          >
            <HeroWordReveal text="YOU KNOW EXACTLY WHAT YOU'RE DOING." color="#ffffff" onComplete={() => setScrambleDone(true)} />
          </p>
          <p
            style={{ fontFamily: "'EB Garamond', serif", fontStyle: "italic", fontWeight: 500, fontSize: "clamp(1.5rem, 3vw, 3rem)", color: "#00FFC2", textShadow: "0 0 10px rgba(0, 255, 194, 0.5)", marginTop: "-8px", opacity: scrambleDone ? 1 : 0, transition: "opacity 0.6s ease" }}
            data-testid="text-brand-title-2"
          >
            {["You", "just", "can't", "stop."].map((word, i) => (
              <span key={i} className="hero-word" style={{ marginRight: "0.3em" }}>{word}</span>
            ))}
          </p>

          <p
            className="hero-stagger leading-relaxed mx-auto"
            style={{ color: "#999", fontSize: "1.15rem", maxWidth: "580px", marginTop: "32px", marginBottom: "48px" }}
            data-testid="text-hero-positioning"
          >
            Your body sends a signal 3 to 7 seconds before the pattern executes. The Archivist Method teaches you to read it — and what to do inside that window.
          </p>

          <div className="hero-stagger">
            <CTAButton text="FIND MY PATTERN →" variant="teal" glowRef={ctaGlowRef} />
          </div>

          <p className="hero-stagger" style={{ color: "#999999", fontFamily: "'Inter', sans-serif", fontSize: "13px", marginTop: "16px" }}>
            Free · 2 Minutes · Instant Results
          </p>
          <p className="hero-stagger" style={{ color: "#999", fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", marginTop: "8px" }}>
            A self-paced digital system. No sessions. No subscriptions. Works in real time.
          </p>

          <p className="hero-stagger" style={{ marginTop: "20px" }}>
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

          <div className="hero-stagger" style={{ marginTop: "48px" }}>
            <p
              className="tracking-[0.2em] uppercase"
              style={{ color: "#14B8A6", fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", opacity: 0.7 }}
              data-testid="text-brand-tagline"
            >
              Pattern archaeology, <span style={{ color: "#EC4899" }}>not</span> therapy.
            </p>
          </div>
        </div>
      </section>

      {/* ========== SECTION 2: GUT CHECK ========== */}
      <section className="py-24 md:py-32 px-6" data-testid="section-gut-check" style={{ position: "relative" }}>
        <SectorLabel text="SECTOR 01 // EMOTIONAL SCAN // STATUS: ACTIVE" />
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="fade-section" style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 900, textTransform: "uppercase", fontSize: "2rem", color: "white", marginBottom: "48px" }} data-testid="text-gut-check-headline">
            You already know which one is yours.
          </h2>

          <div style={{ marginBottom: "48px" }}>
            {gutCheckPatterns.map((p, i) => (
              <GutCheckItem key={p.name} pattern={p} index={i} isLast={i === gutCheckPatterns.length - 1} />
            ))}
          </div>

          <p className="fade-section" style={{ fontFamily: "'Inter', sans-serif", color: "#14B8A6", fontStyle: "italic", fontSize: "1.125rem", maxWidth: "500px", margin: "0 auto", lineHeight: 1.5 }}>
            That feeling isn't guilt. It's recognition. It's the starting gun for everything that comes next.
          </p>
        </div>
      </section>

      {/* ========== SECTION 3: THE 9 PATTERNS ========== */}
      <section className="py-24 md:py-32" data-testid="section-patterns" style={{ position: "relative" }}>
        <SectorLabel text="ARCHIVE REF: 09-CORE // CLASSIFICATION: PRIMARY" />
        <div className="px-8 md:px-16" style={{ marginLeft: "auto", marginRight: "auto", maxWidth: "1100px", width: "100%" }}>
          <div className="text-center" style={{ marginBottom: "48px" }}>
            <SectionLabel>THE PATTERNS</SectionLabel>
            <h2 className="fade-section fade-delay-1" style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 900, textTransform: "uppercase", fontSize: "clamp(1.8rem, 4vw, 2.5rem)", color: "white" }} data-testid="text-patterns-headline">
              9 Destructive Patterns. You're Running at Least One.
            </h2>
            <p className="fade-section fade-delay-2 mx-auto" style={{ fontFamily: "'Inter', sans-serif", fontStyle: "italic", fontSize: "1.125rem", color: "#14B8A6", maxWidth: "500px", marginTop: "20px", marginBottom: "40px" }} data-testid="text-patterns-subline">
              "The pattern is not you. It is a program that runs through you. It was installed to protect a child. You are no longer that child."
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {patternCards.map((p, i) => (
              <PatternCard
                key={p.num}
                card={p}
                index={i}
                isOpen={openCardNum === p.num}
                onToggle={() => setOpenCardNum(openCardNum === p.num ? null : p.num)}
              />
            ))}
          </div>

          <p className="fade-section fade-delay-3 text-center mx-auto" style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.125rem", color: "#14B8A6", fontStyle: "italic", maxWidth: "500px", marginTop: "48px" }} data-testid="text-patterns-footer">
            If you felt something reading one of those — that's your body signal firing right now.
          </p>
        </div>
      </section>

      {/* ========== SECTION 4: CTA BREAK ========== */}
      <section className="py-24 md:py-32 px-6" data-testid="section-cta-break" style={{ position: "relative" }}>
        <div className="max-w-3xl mx-auto text-center">
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.7rem',
              color: '#00FFD1',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              marginBottom: '1.5rem',
              opacity: 0.8,
            }}
          >
            PATTERN IDENTIFICATION · 2 MINUTES · FREE
          </div>

          <h2
            className="fade-section"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              color: '#ffffff',
              lineHeight: 0.95,
              marginBottom: '1.25rem',
              textTransform: 'uppercase',
            }}
          >
            IN 2 MINUTES YOU'LL KNOW<br />
            WHY YOU KEEP DOING IT.
          </h2>

          <p
            className="fade-section"
            style={{
              fontFamily: "'EB Garamond', serif",
              fontStyle: 'italic',
              fontSize: 'clamp(1rem, 1.8vw, 1.25rem)',
              color: '#FF2D9B',
              marginBottom: '2rem',
              lineHeight: 1.6,
            }}
          >
            Not a personality type. Not a diagnosis.<br />
            The exact pattern wired into your nervous system —<br />
            and the interrupt that stops it.
          </p>

          <div
            className="fade-section"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.6rem',
              marginBottom: '2rem',
            }}
          >
            {[
              '› Your dominant pattern — identified by name',
              '› The body signal that fires 3 seconds before it runs',
              '› One interrupt you can use in the next 24 hours',
            ].map((item) => (
              <div
                key={item}
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.78rem',
                  color: '#00FFD1',
                  letterSpacing: '0.1em',
                  textAlign: 'left',
                  width: '100%',
                  maxWidth: '400px',
                }}
              >
                {item}
              </div>
            ))}
          </div>

          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.65rem',
              color: '#475569',
              letterSpacing: '0.2em',
              marginBottom: '2.5rem',
              textTransform: 'uppercase',
            }}
          >
            FREE · NO ACCOUNT · NO EMAIL REQUIRED
          </div>

          <EmbeddedQuiz />
        </div>
      </section>


      {/* ========== SECTION 4.75: THE COST OF WAITING ========== */}
      <section className="py-24 md:py-32 px-6" data-testid="section-cost-of-waiting" style={{ position: "relative", overflow: "hidden", background: "#0A0A0A" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(20,184,166,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div className="max-w-3xl mx-auto text-center relative" style={{ zIndex: 2 }}>
          <p className="fade-section" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: "#EC4899", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "24px" }}>
            THE COST
          </p>

          <h2 className="fade-section fade-delay-1" style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 900, textTransform: "uppercase", fontSize: "clamp(1.6rem, 4vw, 2.4rem)", color: "white", lineHeight: 1.15, marginBottom: "24px" }} data-testid="text-cost-headline">
            THE PATTERN ISN'T GETTING WORSE. YOU'RE JUST GETTING BETTER AT HIDING IT.
          </h2>

          <p className="fade-section fade-delay-2" style={{ fontFamily: "'Inter', sans-serif", fontStyle: "italic", fontSize: "clamp(1.2rem, 3vw, 1.6rem)", color: "#14B8A6", lineHeight: 1.5, maxWidth: "600px", margin: "0 auto 56px" }} data-testid="text-cost-subheadline">
            Every year it runs, the cost compounds. Not in money. In the relationships you kept at arm's length. The versions of yourself you abandoned right before breakthrough.
          </p>

          <div className="fade-section fade-delay-2" style={{ display: "flex", flexDirection: "column", gap: "0", maxWidth: "520px", margin: "0 auto 56px" }}>
            {[
              "Your pattern fires 3\u20137 seconds before you can stop it.",
              "Without the method \u2014 it runs every single time.",
              "With the method \u2014 you get to choose.",
            ].map((stat, i) => (
              <div key={i} style={{ padding: "20px 0", borderTop: i === 0 ? "1px solid rgba(20,184,166,0.25)" : "1px solid rgba(20,184,166,0.15)", borderBottom: i === 2 ? "1px solid rgba(20,184,166,0.25)" : "none" }}>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", color: i === 2 ? "#14B8A6" : "#ccc", letterSpacing: "0.02em", lineHeight: 1.6 }} data-testid={`text-cost-stat-${i}`}>
                  {stat}
                </p>
              </div>
            ))}
          </div>

          <h2 className="fade-section" style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 900, textTransform: "uppercase", fontSize: "clamp(1.4rem, 3.5vw, 2rem)", color: "white", lineHeight: 1.2, marginBottom: "32px" }} data-testid="text-cost-heavy-line">
            YOU KNOW EXACTLY WHAT IT'S COSTING YOU.
          </h2>

          <p className="fade-section" style={{ fontFamily: "'Inter', sans-serif", fontStyle: "italic", fontSize: "clamp(1.1rem, 2.5vw, 1.35rem)", color: "#14B8A6", lineHeight: 1.5, maxWidth: "550px", margin: "0 auto 48px" }} data-testid="text-cost-closing">
            The method doesn't ask you to change who you are. It asks you to catch the signal before the pattern does.
          </p>

          <div className="fade-section">
            <CTAButton text="FIND YOUR PATTERN" />
          </div>
        </div>
      </section>

      {/* ========== SECTION 5: THE WINDOW (Timed Text Sequence) ========== */}
      <TheWindowSection />

      {/* ========== SECTION 6: THIS IS FOR YOU / NOT FOR YOU ========== */}
      <section className="py-24 md:py-32 px-6" data-testid="section-who-for" style={{ position: "relative" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center" style={{ marginBottom: "48px" }}>
            <SectionLabel>WHO THIS IS FOR</SectionLabel>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* For You */}
            <div className="fade-section" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", padding: "32px" }}>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 900, textTransform: "uppercase", fontSize: "1.5rem", color: "white", marginBottom: "24px" }}>
                This Is For You If:
              </h3>
              <div className="space-y-5">
                {forYouProse.map((item, i) => (
                  <p key={i} style={{ fontFamily: "'Inter', sans-serif", color: "#bbb", fontSize: "0.95rem", lineHeight: 1.7 }}>
                    {item}
                  </p>
                ))}
              </div>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: "#14B8A6", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "32px", opacity: 0.7 }}>
                — Field Notes, The Archivist
              </p>
            </div>

            {/* Not For You */}
            <div className="fade-section fade-delay-2" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", padding: "32px" }}>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 900, textTransform: "uppercase", fontSize: "1.5rem", color: "white", marginBottom: "24px" }}>
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
      <section className="py-24 md:py-32 px-6" data-testid="section-how-it-works" style={{ position: "relative" }}>
        <SectorLabel text="PROTOCOL: FEIR-4 // CLEARANCE: STANDARD" />
        <div className="max-w-6xl mx-auto">
          <div className="text-center" style={{ marginBottom: "48px" }}>
            <SectionLabel>THE METHOD</SectionLabel>
            <h2 className="fade-section fade-delay-1" style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 900, textTransform: "uppercase", fontSize: "clamp(1.8rem, 4vw, 2.5rem)", color: "white" }} data-testid="text-method-headline">
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
                className={`fade-section fade-delay-${i + 1}`}
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", padding: "32px" }}
                data-testid={`card-step-${step.num}`}
              >
                <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 900, fontSize: "3rem", color: "#14B8A6", marginBottom: "16px" }}>{step.num}</p>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", color: "white", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>{step.name}</p>
                <p style={{ color: "#999", fontSize: "0.95rem", lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== SECTION 8: IMMERSIVE FRAMES ========== */}
      <ImmersiveFrames />


      {/* ========== SECTION 8.6: THE ARCHIVES ========== */}
      <section className="py-24 md:py-32 px-6" data-testid="section-credibility" style={{ position: "relative", background: "#0A0A0A", overflow: "hidden" }}>
        {/* Subtle dot-grid background */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(20,184,166,0.07) 1px, transparent 1px)", backgroundSize: "32px 32px", pointerEvents: "none" }} />
        {/* Teal radial glow, top-right */}
        <div style={{ position: "absolute", top: "-120px", right: "-80px", width: "500px", height: "500px", background: "radial-gradient(ellipse at center, rgba(20,184,166,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div className="max-w-6xl mx-auto" style={{ position: "relative" }}>
          {/* Top classification bar */}
          <div className="fade-section" style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "56px" }}>
            <div style={{ height: "1px", flex: 1, background: "rgba(20,184,166,0.2)" }} />
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#14B8A6", textTransform: "uppercase", letterSpacing: "0.25em", whiteSpace: "nowrap" }}>
              THE ARCHIVES &nbsp;·&nbsp; SYSTEM RECORD &nbsp;·&nbsp; CLEARANCE: STANDARD
            </p>
            <div style={{ height: "1px", flex: 1, background: "rgba(20,184,166,0.2)" }} />
          </div>

          {/* Two-column editorial layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* LEFT: Headline + copy */}
            <div className="fade-section">
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#EC4899", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "20px" }}>THE ARCHIVES</p>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 900, textTransform: "uppercase", fontSize: "clamp(2.75rem, 5.5vw, 4rem)", color: "white", lineHeight: 1.0, marginBottom: "28px" }}>
                BUILT<br />AROUND<br />ONE THING.
              </h2>
              <div style={{ width: "40px", height: "2px", background: "#14B8A6", marginBottom: "28px" }} />
              <p style={{ fontFamily: "'Inter', sans-serif", fontStyle: "italic", fontSize: "1.15rem", color: "#14B8A6", lineHeight: 1.65, marginBottom: "20px" }}>
                The moment before you do it again.
              </p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.95rem", color: "#888", lineHeight: 1.75 }}>
                Every component exists for one purpose — to give you what you need in the 7 seconds that decide everything. The science behind this window has been documented across decades of peer-reviewed research. TAM is the first consumer system built specifically to use it.
              </p>
              <div style={{ marginTop: "28px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { ref: "LIBET · 1985", finding: "Identified the brain's inhibitory veto window — the biological basis for the 3–7 second interrupt." },
                  { ref: "DAMASIO · 1994", finding: "Somatic Marker Hypothesis — physiological signals precede conscious awareness by several seconds." },
                  { ref: "GRAYBIEL · 2008", finding: "Behavioral patterns are stored as neural chunks in the Basal Ganglia — not thoughts, circuits." },
                  { ref: "DOIDGE · 2007", finding: "Validates the 90-day neuroplasticity cycle and competitive inhibition of existing habit pathways." },
                ].map((cite, i) => (
                  <div key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start", paddingTop: "10px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#EC4899", textTransform: "uppercase", letterSpacing: "0.15em", whiteSpace: "nowrap", marginTop: "2px", minWidth: "110px" }}>{cite.ref}</p>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "#666", lineHeight: 1.6 }}>{cite.finding}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: Stats as classified field record */}
            <div className="fade-section fade-delay-2" style={{ position: "relative" }}>
              {/* Corner brackets */}
              <div style={{ position: "absolute", top: 0, left: 0, width: "18px", height: "18px", borderTop: "1.5px solid rgba(20,184,166,0.5)", borderLeft: "1.5px solid rgba(20,184,166,0.5)" }} />
              <div style={{ position: "absolute", top: 0, right: 0, width: "18px", height: "18px", borderTop: "1.5px solid rgba(20,184,166,0.5)", borderRight: "1.5px solid rgba(20,184,166,0.5)" }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, width: "18px", height: "18px", borderBottom: "1.5px solid rgba(20,184,166,0.5)", borderLeft: "1.5px solid rgba(20,184,166,0.5)" }} />
              <div style={{ position: "absolute", bottom: 0, right: 0, width: "18px", height: "18px", borderBottom: "1.5px solid rgba(20,184,166,0.5)", borderRight: "1.5px solid rgba(20,184,166,0.5)" }} />

              <div style={{ padding: "32px 28px" }}>
                {/* Table header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", paddingBottom: "12px", borderBottom: "1px solid rgba(20,184,166,0.25)" }}>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#14B8A6", textTransform: "uppercase", letterSpacing: "0.2em" }}>FIELD</p>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#14B8A6", textTransform: "uppercase", letterSpacing: "0.2em" }}>RECORD</p>
                </div>

                {/* Stat rows */}
                {[
                  { value: "4",    label: "FEIR DOORS",           desc: "The four entry points of pattern intervention" },
                  { value: "9",    label: "DOCUMENTED PATTERNS",  desc: "Catalogued behavioral sequences, fully mapped" },
                  { value: "3–7",  label: "SECOND WINDOW",        desc: "The only moment where the pattern can be broken" },
                  { value: "24/7", label: "POCKET ARCHIVIST",     desc: "Precision AI deployed inside the window, in real time" },
                ].map((item, i) => (
                  <div
                    key={item.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "20px",
                      padding: "18px 0",
                      borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none",
                    }}
                  >
                    <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 900, fontSize: "clamp(2.2rem, 4vw, 2.8rem)", color: "white", lineHeight: 1, minWidth: "72px" }}>
                      {item.value}
                    </p>
                    <div>
                      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#14B8A6", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "4px" }}>
                        {item.label}
                      </p>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "#666", lineHeight: 1.5 }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}

                {/* File reference footer */}
                <div style={{ marginTop: "20px", paddingTop: "12px", borderTop: "1px solid rgba(20,184,166,0.15)", display: "flex", justifyContent: "space-between" }}>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#333", letterSpacing: "0.1em" }}>FILE: TAM-CORE-001</p>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#333", letterSpacing: "0.1em" }}>STATUS: ACTIVE</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========== SECTION 8.7: BENTO — INSIDE THE ARCHIVE ========== */}
      <section className="py-24 md:py-32 px-6" data-testid="section-bento-preview" style={{ position: "relative" }}>
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>
          <div className="text-center" style={{ marginBottom: "56px" }}>
            <p className="fade-section" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#EC4899", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "16px" }}>WHAT YOU GET</p>
            <h2 className="fade-section fade-delay-1" style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 900, textTransform: "uppercase", fontSize: "clamp(2.5rem, 5vw, 3.5rem)", color: "white", marginBottom: "16px" }} data-testid="text-bento-headline">
              BUILT FOR THE MOMENT. NOT THE MORNING AFTER.
            </h2>
            <p className="fade-section fade-delay-2" style={{ fontFamily: "'Inter', sans-serif", fontStyle: "italic", color: "#14B8A6", fontSize: "clamp(1.1rem, 2.5vw, 1.25rem)", maxWidth: "580px", margin: "0 auto" }}>
              Most systems teach you what happened. This one intercepts what's about to.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* PANEL 1: The Pattern File — teal glow border */}
            <div
              className="bento-panel"
              data-testid="panel-dashboard"
              style={{
                background: "#111",
                border: "1px solid #14B8A6",
                borderRadius: "16px",
                padding: "32px",
                boxShadow: "0 0 20px rgba(20,184,166,0.08)",
                transitionDelay: "0s",
              }}
            >
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#EC4899", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "14px" }}>THE PATTERN FILE</p>
              <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 700, fontSize: "1rem", color: "white", marginBottom: "10px" }}>YOUR PATTERN. FULLY MAPPED.</p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "#aaa", lineHeight: 1.6, marginBottom: "16px" }}>
                Not a label. A complete behavioral map — your triggers, your body signals, your specific interrupt sequence. Documented so you can use it in real time, not reconstruct it after.
              </p>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#14B8A6" }}>Included in all tiers · Pattern-specific</p>
            </div>

            {/* PANEL 2: The Pocket Archivist */}
            <div
              className="bento-panel"
              data-testid="panel-ai-coach"
              style={{
                background: "#111",
                border: "1px solid #1a1a1a",
                borderRadius: "16px",
                padding: "32px",
                transitionDelay: "0.15s",
              }}
            >
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#EC4899", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "14px" }}>THE POCKET ARCHIVIST</p>
              <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 700, fontSize: "1rem", color: "white", marginBottom: "14px" }}>IT ALREADY KNOWS.</p>
              <div style={{ marginBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "8px" }}>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#ccc", background: "#1e1e1e", borderRadius: "12px 12px 2px 12px", padding: "8px 12px", maxWidth: "80%", lineHeight: 1.5 }}>I almost walked out again</p>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#14B8A6", background: "rgba(20,184,166,0.08)", border: "1px solid rgba(20,184,166,0.2)", borderRadius: "2px 12px 12px 12px", padding: "8px 12px", maxWidth: "90%", lineHeight: 1.5 }}>That's the Disappearing pattern loading. What did you feel in your chest the second before you stood up?</p>
                </div>
              </div>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#14B8A6" }}>Trained on your pattern. Deployed in the window. · $47 and $197</p>
            </div>

            {/* PANEL 3: Body Signature Map */}
            <div
              className="bento-panel"
              data-testid="panel-body-map"
              style={{
                background: "#111",
                border: "1px solid #1a1a1a",
                borderRadius: "16px",
                padding: "32px",
                transitionDelay: "0.3s",
              }}
            >
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#EC4899", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "14px" }}>BODY SIGNATURE MAP</p>
              <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 700, fontSize: "1rem", color: "white", marginBottom: "14px" }}>YOUR BODY KNEW FIRST.</p>
              <svg viewBox="0 0 280 24" width="100%" height="24" style={{ marginBottom: "18px", display: "block" }} preserveAspectRatio="none">
                <polyline points="0,12 60,12 80,12 90,4 100,20 110,8 120,16 130,12 140,12 280,12" fill="none" stroke="#14B8A6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div style={{ marginBottom: "14px" }}>
                {["THROAT CLOSES", "CHEST DROPS", "HANDS GO COLD"].map((signal) => (
                  <div key={signal} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#14B8A6", flexShrink: 0, display: "inline-block" }} />
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#14B8A6", letterSpacing: "0.1em" }}>{signal}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "#aaa", lineHeight: 1.6, marginBottom: "16px" }}>
                Your nervous system broadcasts the pattern 3–7 seconds before your conscious mind catches up. That gap is the only place interruption is possible. This map teaches you to live in it.
              </p>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#14B8A6" }}>Included in $47 and $197 · Pattern-specific</p>
            </div>

            {/* PANEL 4: The Interrupt Protocol */}
            <div
              className="bento-panel"
              data-testid="panel-interrupt"
              style={{
                background: "#111",
                border: "1px solid #1a1a1a",
                borderRadius: "16px",
                padding: "32px",
                transitionDelay: "0.45s",
              }}
            >
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#EC4899", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "14px" }}>THE INTERRUPT PROTOCOL</p>
              <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 700, fontSize: "1rem", color: "white", marginBottom: "10px" }}>CIRCUIT BREAK.</p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontStyle: "italic", fontSize: "13px", color: "#14B8A6", lineHeight: 1.5, marginBottom: "12px" }}>
                "The pattern is running. I feel the tightness. I'm choosing to stay."
              </p>
              <div style={{ height: "4px", background: "rgba(255,255,255,0.06)", borderRadius: "2px", overflow: "hidden", marginBottom: "14px" }}>
                <div style={{ width: "62%", height: "100%", background: "#14B8A6", borderRadius: "2px" }} />
              </div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "#aaa", lineHeight: 1.6, marginBottom: "16px" }}>
                Not a mantra. Not a reframe. A physical sequence trained into the nervous system through repetition — so that when the signal fires, the response is already loaded.
              </p>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#14B8A6" }}>Included in $47 and $197 · Pattern-specific</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== SECTION 9: PRICING ========== */}
      <section className="py-24 md:py-32 px-6" data-testid="section-pricing" style={{ position: "relative" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center" style={{ marginBottom: "48px" }}>
            <SectionLabel>CHOOSE YOUR DEPTH</SectionLabel>
            <h2 className="fade-section fade-delay-1" style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 900, textTransform: "uppercase", fontSize: "clamp(1.8rem, 4vw, 2.5rem)", color: "white" }} data-testid="text-pricing-headline">
              START WITH YOUR PATTERN. GO AS DEEP AS YOU NEED.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* Crash Course */}
            <div className="pricing-card fade-section flex flex-col" style={{ background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden", position: "relative" }} data-testid="card-pricing-crash-course">
              <div style={{ position: "relative", height: "250px", overflow: "hidden" }}>
                <img src={productCrashCourse} alt="The Crash Course" width={400} height={400} loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.7, maskImage: "linear-gradient(to bottom, black 0%, black 40%, transparent 85%)", WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 40%, transparent 85%)" }} data-testid="img-product-crash-course" />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, #0D0D0D 100%)" }} />
              </div>
              <div style={{ padding: "0 32px 40px", position: "relative", zIndex: 1, marginTop: "-40px", display: "flex", flexDirection: "column", flex: 1 }}>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem", color: "#14B8A6", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "8px" }}>FREE</p>
                <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 900, fontSize: "2.5rem", color: "white", marginBottom: "16px" }}>$0</p>
                <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 900, textTransform: "uppercase", fontSize: "1.2rem", color: "white", marginBottom: "16px" }}>THE CRASH COURSE</p>
                <p style={{ color: "#999", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "20px" }}>
                  Name the thing you keep doing. Understand why it won't stop on its own.
                </p>
                <div style={{ marginBottom: "24px", flex: 1 }}>
                  {["Pattern identification quiz", "Primary pattern identified + named", "7-day pattern-specific email sequence", "Body signal primer"].map((item, i) => (
                    <div key={i} className="flex items-start gap-2" style={{ marginBottom: "8px" }}>
                      <Check className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: "#14B8A6" }} />
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: "#aaa" }}>{item}</span>
                    </div>
                  ))}
                  {["Pocket Archivist", "Full interrupt protocol", "Body signature map"].map((item, i) => (
                    <div key={i} className="flex items-start gap-2" style={{ marginBottom: "8px", opacity: 0.35 }}>
                      <span className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 inline-flex items-center justify-center" style={{ color: "#666", fontSize: "10px" }}>&times;</span>
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: "#666" }}>{item}</span>
                    </div>
                  ))}
                </div>
                <div className="cta-glow-wrap" style={{ display: "block", width: "100%" }}>
                  <div className="cta-glow-border" />
                  <Link
                    href="/quiz"
                    className="cta-glow-inner block w-full text-center py-3 text-white tracking-wider uppercase"
                    style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem" }}
                    data-testid="button-pricing-free"
                  >
                    START FREE <ArrowRight className="inline w-3 h-3 ml-1" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Field Guide - emphasized */}
            <div className="pricing-card pricing-card-featured fade-section fade-delay-1 flex flex-col" style={{ background: "#0D0D0D", border: "2px solid #14B8A6", overflow: "hidden", position: "relative", transform: "scale(1.02)" }} data-testid="card-pricing-field-guide">
              <div style={{ position: "relative", height: "250px", overflow: "hidden" }}>
                <img src={productFieldGuide} alt="The Field Guide" width={400} height={400} loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.7, maskImage: "linear-gradient(to bottom, black 0%, black 40%, transparent 85%)", WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 40%, transparent 85%)" }} data-testid="img-product-field-guide" />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, #0D0D0D 100%)", zIndex: 1 }} />
                <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 60px rgba(20, 184, 166, 0.15)", pointerEvents: "none", zIndex: 0 }} />
              </div>
              <div style={{ padding: "0 32px 40px", position: "relative", zIndex: 1, marginTop: "-40px", display: "flex", flexDirection: "column", flex: 1 }}>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem", color: "#14B8A6", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "8px" }}>YOUR PATTERN</p>
                <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 900, fontSize: "2.5rem", color: "white", marginBottom: "4px" }}>$47</p>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#999", marginBottom: "16px" }}>One-time payment. No subscription. Yours forever.</p>
                <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 900, textTransform: "uppercase", fontSize: "1.2rem", color: "white", marginBottom: "16px" }}>THE FIELD GUIDE</p>
                <p style={{ color: "#999", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "20px" }}>
                  You know what it is. Now get everything you need to stop it — before it fires.
                </p>
                <div style={{ marginBottom: "24px", flex: 1 }}>
                  {["Everything in the Crash Course", "Full interrupt protocol (your pattern)", "Body signature map (your pattern)", "Pocket Archivist — your pattern only"].map((item, i) => (
                    <div key={i} className="flex items-start gap-2" style={{ marginBottom: "8px" }}>
                      <Check className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: "#14B8A6" }} />
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: "#aaa" }}>{item}</span>
                    </div>
                  ))}
                  {["All 9 pattern protocols", "Cross-pattern reference guide"].map((item, i) => (
                    <div key={i} className="flex items-start gap-2" style={{ marginBottom: "8px", opacity: 0.35 }}>
                      <span className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 inline-flex items-center justify-center" style={{ color: "#666", fontSize: "10px" }}>&times;</span>
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: "#666" }}>{item}</span>
                    </div>
                  ))}
                </div>
                <div className="cta-glow-wrap" style={{ display: "block", width: "100%" }}>
                  <div className="cta-glow-border" />
                  <button
                    onClick={() => handleCheckout("quick-start")}
                    className="cta-glow-inner block w-full text-center py-3 text-white tracking-wider uppercase cursor-pointer"
                    style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem" }}
                    data-testid="button-pricing-field-guide"
                  >
                    GET YOUR FIELD GUIDE <ArrowRight className="inline w-3 h-3 ml-1" />
                  </button>
                </div>
              </div>
            </div>

            {/* Complete Archive */}
            <div className="pricing-card fade-section fade-delay-2 flex flex-col" style={{ background: "#0D0D0D", border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden", position: "relative" }} data-testid="card-pricing-archive">
              <div style={{ position: "relative", height: "250px", overflow: "hidden" }}>
                <img src={productCompleteArchive} alt="The Complete Archive" width={400} height={400} loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.7, maskImage: "linear-gradient(to bottom, black 0%, black 40%, transparent 85%)", WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 40%, transparent 85%)" }} data-testid="img-product-complete-archive" />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, #0D0D0D 100%)" }} />
              </div>
              <div style={{ padding: "0 32px 40px", position: "relative", zIndex: 1, marginTop: "-40px", display: "flex", flexDirection: "column", flex: 1 }}>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem", color: "#14B8A6", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "8px" }}>ALL 9 PATTERNS</p>
                <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 900, fontSize: "2.5rem", color: "white", marginBottom: "4px" }}>$197</p>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#999", marginBottom: "16px" }}>One-time payment. No subscription. Yours forever.</p>
                <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 900, textTransform: "uppercase", fontSize: "1.2rem", color: "white", marginBottom: "16px" }}>THE COMPLETE ARCHIVE</p>
                <p style={{ color: "#999", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "20px" }}>
                  You've handled yours. Now you can see everyone else's — and your own from every angle.
                </p>
                <div style={{ marginBottom: "24px", flex: 1 }}>
                  {["Everything in the Field Guide", "All 9 interrupt protocols", "All 9 body signature maps", "Pocket Archivist — all 9 patterns", "Pattern cross-reference guide", "Lifetime updates"].map((item, i) => (
                    <div key={i} className="flex items-start gap-2" style={{ marginBottom: "8px" }}>
                      <Check className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: "#14B8A6" }} />
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: "#aaa" }}>{item}</span>
                    </div>
                  ))}
                </div>
                <div className="cta-glow-wrap" style={{ display: "block", width: "100%" }}>
                  <div className="cta-glow-border" />
                  <button
                    onClick={() => handleCheckout("complete-archive")}
                    className="cta-glow-inner block w-full text-center py-3 text-white tracking-wider uppercase cursor-pointer"
                    style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem" }}
                    data-testid="button-pricing-archive"
                  >
                    GET THE COMPLETE ARCHIVE <ArrowRight className="inline w-3 h-3 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <p className="fade-section fade-delay-3 text-center" style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 900, color: "white", fontSize: "1.1rem", textTransform: "uppercase", marginTop: "40px", letterSpacing: "0.05em" }} data-testid="text-one-time">
            One-time purchase. No subscriptions. Yours forever.
          </p>
          <p className="fade-section fade-delay-3 text-center" style={{ fontFamily: "'Inter', sans-serif", fontStyle: "italic", fontSize: "1.125rem", color: "#14B8A6", marginTop: "16px", opacity: 0.8 }} data-testid="text-guarantee">
            If you can't name your primary body signal within 7 days, full refund. No explanation needed. No searching required.
          </p>

          {import.meta.env.DEV && (
            <div style={{ marginTop: "48px", padding: "24px", border: "2px dashed #EC4899", background: "rgba(236,72,153,0.05)" }} data-testid="test-purchase-panel">
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: "#EC4899", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "16px", textAlign: "center" }}>
                DEV MODE: Test Purchase Simulator
              </p>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: "#999999", textAlign: "center", marginBottom: "16px" }}>
                Card: 4242 4242 4242 4242 | Exp: 12/34 | CVC: 123
              </p>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                {([
                  { id: "crash-course", name: "The Crash Course", amount: 0, label: "FREE" },
                  { id: "quick-start", name: "The Field Guide", amount: 47, label: "$47" },
                  { id: "complete-archive", name: "The Complete Archive", amount: 197, label: "$197" },
                ] as const).map((product) => (
                  <button
                    key={product.id}
                    data-testid={`test-purchase-${product.id}`}
                    onClick={async () => {
                      const email = prompt("Enter test email for purchase:");
                      if (!email) return;
                      try {
                        const res = await fetch("/api/portal/test-purchase", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            email,
                            productId: product.id,
                            productName: product.name,
                            amount: product.amount,
                          }),
                        });
                        const data = await res.json();
                        if (data.success) {
                          alert(`Test purchase successful: ${product.name}\nRedirecting to portal...`);
                          window.location.href = "/portal";
                        } else {
                          alert(`Error: ${data.error}`);
                        }
                      } catch (err) {
                        alert("Test purchase failed");
                      }
                    }}
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "12px",
                      padding: "10px 20px",
                      background: "transparent",
                      border: "1px solid #EC4899",
                      color: "#EC4899",
                      cursor: "pointer",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}
                  >
                    TEST {product.label} Purchase
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========== SECTION 10.5: THE POCKET ARCHIVIST ========== */}
      <section className="px-6" data-testid="section-pocket-archivist" style={{ position: "relative", paddingTop: "120px", paddingBottom: "120px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <SectorLabel text="THE POCKET ARCHIVIST" />
        <div className="max-w-3xl mx-auto">
          <p className="fade-section text-center" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#EC4899", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "24px" }}>
            THE POCKET ARCHIVIST
          </p>
          <h2 className="fade-section text-center" style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 900, fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "white", textTransform: "uppercase", lineHeight: 1.1, marginBottom: "24px" }}>
            IT ALREADY KNOWS WHAT YOU'RE ABOUT TO DO.
          </h2>
          <p className="fade-section text-center" style={{ fontFamily: "'Inter', sans-serif", fontStyle: "italic", fontSize: "1.125rem", color: "#14B8A6", maxWidth: "700px", margin: "0 auto 64px", lineHeight: 1.7 }}>
            This isn't a chatbot. It's a precision instrument trained on one thing — the exact moment your pattern fires and what to do inside the 3-7 second window before you lose it.
          </p>

          <div className="fade-section" style={{ maxWidth: "700px", margin: "0 auto" }}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.05rem", color: "#ccc", lineHeight: 1.7, marginBottom: "24px" }}>
              You already know the feeling. The chest drop. The throat tighten. The pull toward the thing you said you wouldn't do again. Most tools want to talk about it later. The Pocket Archivist is built for right now.
            </p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.05rem", color: "#ccc", lineHeight: 1.7, marginBottom: "24px" }}>
              It's been trained exclusively on The Archivist Method framework — pattern architecture, body signal sequencing, interrupt protocols, and circuit break language. It doesn't give you generic advice. It knows your pattern's specific trigger sequence and responds with the exact language your nervous system can actually use in that moment.
            </p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.05rem", color: "#ccc", lineHeight: 1.7, marginBottom: "24px" }}>
              The problems it solves are the ones nobody names. The 11pm spiral. The shutdown before the conversation starts. The moment you watch yourself do it anyway. That's what it was built for.
            </p>
          </div>

          <p className="fade-section text-center" style={{ fontFamily: "'Inter', sans-serif", fontStyle: "italic", fontSize: "1.125rem", color: "#14B8A6", maxWidth: "600px", margin: "64px auto 0", lineHeight: 1.7 }}>
            Not a companion. A circuit breaker.
          </p>

          <div className="fade-section text-center" style={{ marginTop: "40px" }}>
            <button
              onClick={() => setDemoModalOpen(true)}
              style={{
                background: "transparent",
                border: "1px solid #14B8A6",
                borderRadius: "8px",
                padding: "14px 32px",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.8rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "#14B8A6",
                cursor: "pointer",
                textTransform: "uppercase",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(20,184,166,0.1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              data-testid="button-experience-demo"
            >
              EXPERIENCE IT FREE <ArrowRight className="inline w-3 h-3 ml-1" />
            </button>
          </div>
        </div>
      </section>

      <ArchivistDemoModal isOpen={demoModalOpen} onClose={() => setDemoModalOpen(false)} />

      {/* ========== SECTION 11: FOUNDER ========== */}
      <section className="px-6" data-testid="section-founder" style={{ position: "relative", paddingTop: "120px", paddingBottom: "120px", backgroundImage: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(217,168,88,0.04) 0%, transparent 70%)" }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center" style={{ marginBottom: "48px" }}>
            <p className="fade-section" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "#999999", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "16px" }}>
              FIELD NOTES
            </p>
            <h2 className="fade-section fade-delay-1" style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 900, textTransform: "uppercase", fontSize: "2rem", color: "white" }} data-testid="text-founder-headline">
              About The Founder
            </h2>
          </div>

          <div className="fade-section fade-delay-2 text-center" style={{ lineHeight: 1.8 }}>
            <p style={{ color: "#ccc", fontSize: "1.1rem", marginBottom: "24px" }}>
              I built this because I was watching patterns tear apart something I cared about deeply. Someone I love was stuck in the same loops I was — and neither of us knew how to stop. We could see it happening. We could name it. We just couldn't break the cycle.
            </p>
            <p style={{ color: "#ccc", fontSize: "1.1rem", marginBottom: "24px" }}>
              So I started digging. Hard. Pulling apart every system I could find. Looking for the one thing under all of it that actually worked. Not in six months. Not in theory. Right now. In the middle of the fight. In the middle of the flood.
            </p>
            <p style={{ color: "#ccc", fontSize: "1.1rem", marginBottom: "48px" }}>
              This method is what I found. I built it for us. I'm sharing it because I know we're not the only ones.
            </p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.4rem", color: "#F5F5F5", fontStyle: "italic", marginBottom: "20px", letterSpacing: "0.02em" }}>
              For her.
            </p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.15rem", color: "#AAAAAA", fontStyle: "italic", letterSpacing: "0.04em", transform: "rotate(-1.5deg)", display: "inline-block" }}>
              — Aaron
            </p>
          </div>
        </div>
      </section>

      {/* ========== SECTION 12: FINAL CTA - EXIT INTERVIEW ========== */}
      <ExitInterviewSection />

      {/* ========== EVIDENCE BASE ========== */}
      <section style={{ padding: "64px 24px 32px" }} data-testid="section-citations">
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#14B8A6", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "20px", textAlign: "center" }}>THE SCIENCE BEHIND THE WINDOW</p>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#666", textAlign: "center", lineHeight: 1.7, marginBottom: "32px", maxWidth: "560px", margin: "0 auto 32px" }} data-testid="text-evidence-intro">The Archivist Method is built on four decades of peer-reviewed neuroscience. We didn't invent the window. We built the tool to use it.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: "14px" }}>
            {[
              { year: "1983", finding: "The brain initiates action 350ms before conscious awareness.", researcher: "Libet, B. · Brain Research" },
              { year: "1996", finding: "Emotional memory fires faster than rational thought.", researcher: "LeDoux, J. · The Emotional Brain" },
              { year: "2011", finding: "The body signals threat before the mind registers it.", researcher: "Porges, S. · Polyvagal Theory" },
              { year: "2014", finding: "Trauma lives in the body, not the story.", researcher: "van der Kolk, B. · The Body Keeps the Score" },
              { year: "2012", finding: "Habits form through neurological loops the conscious mind cannot override.", researcher: "Duhigg, C. · The Power of Habit" },
              { year: "2000", finding: "The window between stimulus and response is where all change lives.", researcher: "Schwartz, J. · The Mind and the Brain" },
            ].map((card, i) => (
              <div key={i} style={{ background: "#111", borderRadius: "12px", padding: "24px" }} data-testid={`card-evidence-${i}`}>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.1rem", color: "#14B8A6", fontWeight: 700, marginBottom: "10px" }}>{card.year}</p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", color: "white", lineHeight: 1.55, marginBottom: "12px" }}>"{card.finding}"</p>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#EC4899", letterSpacing: "0.05em" }}>— {card.researcher}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "28px" }}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "white", lineHeight: 1.6, marginBottom: "10px" }} data-testid="text-evidence-statement">The 3-7 second window is not a metaphor. It is a measurable neurological event.</p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "#666", lineHeight: 1.7, maxWidth: "520px", margin: "0 auto" }} data-testid="text-evidence-detail">Every protocol in The Archivist Method is designed to operate inside this window — not before it, not after it. Inside it.</p>
          </div>
          <div style={{ width: "80px", height: "1px", background: "#14B8A6", margin: "32px auto", opacity: 0.4 }} />
          <div className="flex flex-wrap justify-center" style={{ gap: "12px" }}>
            {[
              { label: "Neuroscience-Based", icon: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a4 4 0 0 1 4 4c0 1.5-.8 2.8-2 3.5V11h1a3 3 0 0 1 3 3v1h1a2 2 0 0 1 0 4h-1v1a3 3 0 0 1-3 3h-1v-1.5a4 4 0 0 1-4 0V22h-1a3 3 0 0 1-3-3v-1H5a2 2 0 0 1 0-4h1v-1a3 3 0 0 1 3-3h1V9.5A4 4 0 0 1 8 6a4 4 0 0 1 4-4z"/><circle cx="12" cy="6" r="1.5"/></svg>) },
              { label: "Body-Signal Indexed", icon: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="2 12 5 12 8 6 11 18 14 8 17 12 22 12"/></svg>) },
              { label: "Pattern-Specific Protocols", icon: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>) },
            ].map((badge, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", border: "1px solid rgba(20,184,166,0.3)", borderRadius: "999px", padding: "8px 16px", background: "rgba(20,184,166,0.05)" }} data-testid={`badge-credential-${i}`}>
                {badge.icon}
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "white", letterSpacing: "0.05em" }}>{badge.label}</span>
              </div>
            ))}
          </div>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#14B8A6", textAlign: "center", marginTop: "24px", letterSpacing: "0.05em" }} data-testid="text-evidence-tagline">This is not self-help. This is applied neuroscience.</p>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer style={{ padding: "48px 24px" }}>
        <div className="max-w-4xl mx-auto text-center">
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#14B8A6", fontStyle: "italic", opacity: 0.6 }}>
            "The archive is open. Don't close the door."
          </p>

          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "#AAAAAA", marginTop: "32px" }}>
            &copy; 2026 The Archivist Method&trade; · Pattern archaeology, <span style={{ color: "#EC4899" }}>not</span> therapy.
          </p>

          <div className="flex justify-center gap-4" style={{ marginTop: "16px" }}>
            <Link href="/terms" className="transition-colors hover:text-white" style={{ fontFamily: "'Inter', sans-serif", color: "#AAAAAA", fontSize: "12px" }} data-testid="link-terms">Terms</Link>
            <span style={{ color: "#AAAAAA", fontSize: "12px" }}>&middot;</span>
            <Link href="/privacy" className="transition-colors hover:text-white" style={{ fontFamily: "'Inter', sans-serif", color: "#AAAAAA", fontSize: "12px" }} data-testid="link-privacy">Privacy</Link>
            <span style={{ color: "#AAAAAA", fontSize: "12px" }}>&middot;</span>
            <Link href="/contact" className="transition-colors hover:text-white" style={{ fontFamily: "'Inter', sans-serif", color: "#AAAAAA", fontSize: "12px" }} data-testid="link-contact">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
