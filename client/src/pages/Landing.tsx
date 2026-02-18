import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState, useCallback, lazy, Suspense } from "react";
import { apiRequest } from "@/lib/queryClient";

const ParticleField = lazy(() => import("@/components/ParticleField"));

const patternCards = [
  { num: "01", name: "DISAPPEARING", desc: "You pull away the moment someone gets close. Not because you don't care. Because closeness feels like danger.", trigger: "They're getting too close. I need to leave before they see the real me." },
  { num: "02", name: "APOLOGY LOOP", desc: "You apologize for existing. For having needs. For taking up space. You've been doing it so long it feels normal.", trigger: "I'm sorry. I shouldn't have said anything. I'm sorry for being sorry." },
  { num: "03", name: "TESTING", desc: "You push people to their limit to see if they'll stay. Then hate yourself when they leave.", trigger: "If they really loved me, they'd stay no matter what I do." },
  { num: "04", name: "ATTRACTION TO HARM", desc: "You're drawn to people and situations that hurt you. Not because you're broken. Because chaos feels like home.", trigger: "I know this person is bad for me. I can't stop going back." },
  { num: "05", name: "COMPLIMENT DEFLECTION", desc: "Someone says something good about you and your entire body rejects it. You literally cannot let it in.", trigger: "They don't mean it. And if they do, they're wrong." },
  { num: "06", name: "DRAINING BOND", desc: "You stay connected to people who drain you. You know you should leave. You physically can't.", trigger: "I should leave. I know I should leave. I'll leave tomorrow." },
  { num: "07", name: "SUCCESS SABOTAGE", desc: "You destroy things right before they work. Promotions, relationships, projects. The closer you get, the harder you burn it down.", trigger: "It's actually going well. Something's about to go wrong. I'll just end it myself." },
  { num: "08", name: "PERFECTIONISM TRAP", desc: "Nothing is ever good enough to ship, share, or finish. You'd rather abandon it than release it imperfect.", trigger: "It's not ready. It'll never be ready. I'd rather not ship it than ship it wrong." },
  { num: "09", name: "RAGE PATTERN", desc: "The anger comes fast and hot and disproportionate. Afterward you wonder who that was. It was the pattern.", trigger: "That was nothing. Why am I this angry. What's wrong with me." },
];

const archivesCaseFiles = [
  {
    num: "0041",
    pattern: "DISAPPEARING",
    reportBody: "Subject identified pattern on Day 3 of Crash Course. First body signature recognition: chest tightness before urge to ghost. First successful interrupt: Day 11.",
    breakthrough: "Subject stayed in the conversation. First time in 14 years.",
    status: "PATTERN WEAKENING",
  },
  {
    num: "0087",
    pattern: "SUCCESS SABOTAGE",
    reportBody: "Subject recognized pre-sabotage body signature (hands shaking, impulse to delete project) 4 seconds before pattern executed. Applied circuit break.",
    breakthrough: "Did not destroy 6 months of work.",
    status: "INTERRUPT CONFIRMED",
  },
  {
    num: "0113",
    pattern: "APOLOGY LOOP",
    reportBody: "Subject caught herself mid-apology for asking a question at work. Recognized throat tightening as body signature. Used circuit break: 'I don't need to apologize for this.'",
    breakthrough: "Reports reduced unnecessary apologies by 60% in 3 weeks.",
    status: "PATTERN DISRUPTED",
  },
  {
    num: "0156",
    pattern: "TESTING",
    reportBody: "Subject recognized testing behavior mid-argument with partner. Body signature: jaw clenching, urge to escalate. Applied interrupt. Chose to communicate need directly instead of testing.",
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
  { name: "THE RAGE PATTERN", color: "#14B8A6", desc: "The anger comes fast and disproportionate." },
];

const therapyRows = [
  ["Asks why you do it", "Teaches you to catch it happening"],
  ["Processes the past", "Interrupts the present"],
  ["Weekly sessions for months", "Works in 3-7 seconds"],
  ["Talks about feelings", "Reads body signatures"],
  ["Explores your childhood", "Interrupts your Tuesday"],
  ["Builds understanding", "Builds muscle memory"],
];

const forYou = [
  "You watch yourself repeat the same destructive behavior and can't figure out how to stop",
  "You've done therapy and understand WHY but nothing changes",
  "You're smart enough to see the pattern but stuck enough to keep running it",
  "You're tired of \"just try harder\" advice that ignores how your nervous system actually works",
  "You want something that works in the moment, not after six months of processing",
];

const notForYou = [
  "You're looking for a therapist (we're not that)",
  "You want someone to tell you you're fine (you already know you're not)",
  "You're not ready to look at your own patterns honestly",
  "You need crisis intervention (call 988)",
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
        className="cta-glow-inner inline-block text-white tracking-[0.15em] uppercase transition-all duration-300 hover:bg-white hover:text-black"
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "15px", padding: "18px 48px" }}
      >
        {text} <ArrowRight className="inline w-4 h-4 ml-1" />
      </Link>
    </div>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="reveal" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "#14B8A6", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "16px" }}>
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
        background: "rgba(255,255,255,0.03)",
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
      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "2rem", color: "#EC4899", marginBottom: "12px" }}>{card.num}</p>
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
    <div className="reveal gut-pattern" style={{ transitionDelay: `${index * 0.15}s`, textAlign: "center" }}>
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
            color: "#666",
            fontStyle: "italic",
            opacity: active ? 1 : 0,
            height: active ? "20px" : "0",
            overflow: "hidden",
            transition: "opacity 0.3s ease, height 0.3s ease, margin 0.3s ease",
            marginTop: active ? "4px" : "0",
            whiteSpace: "nowrap",
          }}
        >
          {pattern.desc}
        </p>
      </div>
      {!isLast && (
        <div
          style={{
            width: "60px",
            height: "1px",
            background: "#14B8A6",
            opacity: 0.2,
            margin: "12px auto",
          }}
        />
      )}
    </div>
  );
}

function CaseFileCard({ file, index }: { file: typeof archivesCaseFiles[0]; index: number }) {
  const [declassified, setDeclassified] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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
      className="reveal"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.08)",
        padding: "28px",
        transitionDelay: `${(index % 2) * 0.15}s`,
      }}
      data-testid={`card-case-file-${file.num}`}
      onMouseEnter={!isMobile ? handleDeclassify : undefined}
      onClick={isMobile ? handleDeclassify : undefined}
    >
      <div style={{ marginBottom: "16px" }}>
        <div className="flex items-center gap-3 flex-wrap" style={{ marginBottom: "8px" }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#14B8A6", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            CASE FILE {file.num}
          </span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#737373" }}>|</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#999", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            PATTERN: {file.pattern}
          </span>
        </div>
        <div style={{ background: "#000", height: "12px", width: "120px", marginTop: "8px" }} aria-label="Redacted name" />
      </div>
      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "#999", lineHeight: 1.7, marginBottom: "12px" }}>
        "{file.reportBody}"
      </p>
      <div style={{ position: "relative", marginBottom: "8px", overflow: "hidden" }}>
        <p
          data-testid={`text-breakthrough-${file.num}`}
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "12px",
            color: "#14B8A6",
            lineHeight: 1.7,
            fontWeight: 600,
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
            background: "#000",
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
      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#555", textTransform: "uppercase", letterSpacing: "0.1em" }}>
        STATUS: {file.status}
      </p>
    </div>
  );
}

const patternCycles = [
  {
    trigger: "Someone says I love you.",
    signature: "Your chest tightens. Your hands go cold.",
    pull: "You're already planning how to leave.",
  },
  {
    trigger: "You ask a question in a meeting.",
    signature: "Your throat closes. Stomach drops.",
    pull: "You're already apologizing for speaking.",
  },
  {
    trigger: "The project is almost finished.",
    signature: "Your hands start shaking. Restless heat.",
    pull: "You're about to delete six months of work.",
  },
  {
    trigger: "Things are going well with them.",
    signature: "Jaw clenches. Pulse quickens.",
    pull: "You're about to start a fight to see if they'll stay.",
  },
  {
    trigger: "They hurt you again.",
    signature: "Numbness spreads. Familiar warmth.",
    pull: "You're going back. You already know you are.",
  },
];

type WindowPhase =
  | { type: "idle" }
  | { type: "intro"; step: number }
  | { type: "cycle"; index: number; lineStep: number; fading: boolean }
  | { type: "payoff"; step: number };

function TheWindowSection({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  const [phase, setPhase] = useState<WindowPhase>({ type: "idle" });
  const [introFaded, setIntroFaded] = useState(false);
  const hasPlayed = useRef(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
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

          schedule(() => setPhase({ type: "intro", step: 0 }), 500);
          schedule(() => setPhase({ type: "intro", step: 1 }), 1500);
          schedule(() => setPhase({ type: "intro", step: 2 }), 3000);
          schedule(() => setIntroFaded(true), 4500);

          const cycleStart = 5000;
          const cycleDuration = 4000;

          patternCycles.forEach((_, ci) => {
            const base = cycleStart + ci * cycleDuration;
            schedule(() => setPhase({ type: "cycle", index: ci, lineStep: 0, fading: false }), base);
            schedule(() => setPhase({ type: "cycle", index: ci, lineStep: 1, fading: false }), base + 800);
            schedule(() => setPhase({ type: "cycle", index: ci, lineStep: 2, fading: false }), base + 1600);
            schedule(() => setPhase({ type: "cycle", index: ci, lineStep: 2, fading: true }), base + 3200);
          });

          const payoffStart = cycleStart + patternCycles.length * cycleDuration + 1000;
          schedule(() => setPhase({ type: "payoff", step: 0 }), payoffStart);
          schedule(() => setPhase({ type: "payoff", step: 1 }), payoffStart + 1500);
          schedule(() => setPhase({ type: "payoff", step: 2 }), payoffStart + 3000);
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      timersRef.current.forEach(clearTimeout);
    };
  }, [schedule]);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const introVisible = phase.type === "intro" || phase.type === "cycle" || phase.type === "payoff";
  const introOpacity = introFaded ? 0.4 : 1;

  const currentCycle = phase.type === "cycle" ? patternCycles[phase.index] : null;
  const cycleLineStep = phase.type === "cycle" ? phase.lineStep : -1;
  const cycleFading = phase.type === "cycle" && phase.fading;

  const payoffStep = phase.type === "payoff" ? phase.step : -1;

  return (
    <section
      ref={setRefs}
      className="px-6"
      data-testid="section-window"
      style={{ position: "relative", background: "#0A0A0A", paddingTop: "120px", paddingBottom: "120px" }}
    >
      <div className="thread-node" />
      <div className="thread-node-label">Mechanism</div>
      <SectorLabel text="TEMPORAL ANALYSIS // WINDOW: 3.2-6.8s // THRESHOLD: ACTIVE" />
      <div style={{ maxWidth: "500px", margin: "0 auto", textAlign: "center" }}>

        <div style={{ opacity: introVisible ? introOpacity : 0, transition: "opacity 0.4s ease", marginBottom: "48px" }}>
          <p
            data-testid="text-window-label"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "12px",
              color: "#14B8A6",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              marginBottom: "32px",
              opacity: introVisible && (phase.type !== "intro" || phase.step >= 0) ? 1 : 0,
              transition: "opacity 0.4s ease",
            }}
          >
            THE WINDOW
          </p>
          <p
            data-testid="text-window-intro-1"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: isMobile ? "1.8rem" : "2.2rem",
              color: "white",
              margin: 0,
              marginBottom: "20px",
              lineHeight: 1.3,
              opacity: phase.type !== "intro" || phase.step >= 1 ? (introVisible ? 1 : 0) : 0,
              transition: "opacity 0.4s ease",
            }}
          >
            "Every pattern has a signature."
          </p>
          <p
            data-testid="text-window-intro-2"
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: isMobile ? "1rem" : "1.1rem",
              color: "#999",
              margin: 0,
              lineHeight: 1.5,
              opacity: phase.type !== "intro" || phase.step >= 2 ? (introVisible ? 1 : 0) : 0,
              transition: "opacity 0.4s ease",
            }}
          >
            "Your body sends it 3-7 seconds before the behavior runs."
          </p>
        </div>

        <div style={{ minHeight: "120px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "16px" }}>
          {currentCycle && (
            <>
              <p
                data-testid="text-cycle-trigger"
                style={{
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: isMobile ? "1rem" : "1.15rem",
                  color: "#777",
                  margin: 0,
                  lineHeight: 1.5,
                  opacity: cycleFading ? 0 : (cycleLineStep >= 0 ? 1 : 0),
                  transition: "opacity 0.4s ease",
                }}
              >
                {currentCycle.trigger}
              </p>
              <p
                data-testid="text-cycle-signature"
                style={{
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: isMobile ? "1rem" : "1.15rem",
                  color: "white",
                  margin: 0,
                  lineHeight: 1.5,
                  opacity: cycleFading ? 0 : (cycleLineStep >= 1 ? 1 : 0),
                  transition: "opacity 0.4s ease",
                }}
              >
                {currentCycle.signature}
              </p>
              <p
                data-testid="text-cycle-pull"
                style={{
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: isMobile ? "1rem" : "1.15rem",
                  color: "#eee",
                  margin: 0,
                  lineHeight: 1.5,
                  opacity: cycleFading ? 0 : (cycleLineStep >= 2 ? 1 : 0),
                  transition: "opacity 0.4s ease",
                }}
              >
                {currentCycle.pull}
              </p>
            </>
          )}

          {phase.type === "payoff" && (
            <>
              <p
                data-testid="text-payoff-hit"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: isMobile ? "1.8rem" : "2rem",
                  color: "white",
                  margin: 0,
                  lineHeight: 1.3,
                  opacity: payoffStep >= 0 ? 1 : 0,
                  transition: "opacity 0.8s ease",
                }}
              >
                "Did one of those hit?"
              </p>
              <p
                data-testid="text-payoff-window"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: isMobile ? "2rem" : "2.5rem",
                  color: "#14B8A6",
                  fontWeight: "bold",
                  margin: 0,
                  lineHeight: 1.3,
                  opacity: payoffStep >= 1 ? 1 : 0,
                  transition: "opacity 0.8s ease",
                }}
              >
                "That was your window."
              </p>
              <p
                data-testid="text-payoff-method"
                style={{
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: isMobile ? "1rem" : "1.1rem",
                  color: "#999",
                  margin: 0,
                  lineHeight: 1.5,
                  opacity: payoffStep >= 2 ? 1 : 0,
                  transition: "opacity 0.6s ease",
                }}
              >
                "This method teaches you what to do inside it."
              </p>
            </>
          )}
        </div>

      </div>
    </section>
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
    const nodeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("thread-node-visible");
          }
        });
      },
      { threshold: 0.5 }
    );

    const labelObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("thread-node-visible");
          }
        });
      },
      { threshold: 0.5 }
    );

    const page = pageRef.current;
    if (page) {
      page.querySelectorAll(".thread-node").forEach((el) => nodeObserver.observe(el));
      page.querySelectorAll(".thread-node-label").forEach((el) => labelObserver.observe(el));
    }

    return () => {
      nodeObserver.disconnect();
      labelObserver.disconnect();
    };
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen thread-page" style={{ background: "#0A0A0A", color: "#F5F5F5", fontFamily: "'Source Sans 3', sans-serif" }}>
      <Suspense fallback={null}>
        <ParticleField />
      </Suspense>

      <div className="bg-grain" />
      <div className="bg-grid" />

      {!sessionStorage.getItem('archivistLoaded') && (
        <div className="skeleton-overlay" data-testid="skeleton-loading" ref={(el) => { if (el) setTimeout(() => sessionStorage.setItem('archivistLoaded', '1'), 800); }}>
          <div style={{ position: "relative", width: "clamp(200px, 50vw, 400px)", height: "24px" }} className="skeleton-bar"><div className="skeleton-bar-outline" /></div>
          <div style={{ position: "relative", width: "clamp(140px, 35vw, 260px)", height: "14px" }} className="skeleton-bar"><div className="skeleton-bar-outline" /></div>
          <div style={{ position: "relative", width: "clamp(100px, 20vw, 160px)", height: "40px", marginTop: "8px" }} className="skeleton-bar"><div className="skeleton-bar-outline" /></div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Source+Sans+3:wght@400;600&family=JetBrains+Mono:wght@400&display=swap');

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

        .thread-node {
          position: absolute;
          left: 40px;
          top: 0;
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #0A0A0A;
          border: 1.5px solid rgba(20, 184, 166, 0.4);
          transform: translate(-50%, -50%) scale(0);
          opacity: 0;
          transition: opacity 0.5s ease-out, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          z-index: 41;
          pointer-events: none;
        }

        .thread-node.thread-node-visible {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
          background: #14B8A6;
          border-color: #14B8A6;
          box-shadow: 0 0 8px rgba(20, 184, 166, 0.5);
        }

        .thread-node-label {
          position: absolute;
          left: 40px;
          transform: translate(14px, -50%);
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(20, 184, 166, 0);
          white-space: nowrap;
          z-index: 41;
          pointer-events: none;
          transition: color 0.6s ease-out 0.2s;
        }

        .thread-node-label.thread-node-visible {
          color: rgba(20, 184, 166, 0.35);
        }

        @media (max-width: 1024px) {
          .thread-page::before,
          .thread-page::after {
            display: none !important;
          }
          .thread-node,
          .thread-node-label {
            display: none !important;
          }
          .reveal { transition-delay: 0s !important; transition-duration: 0.5s; }
        }

        @keyframes logFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .bg-grain {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: 200px 200px;
          opacity: calc(1 - var(--scroll-progress, 0) * 3);
          transition: opacity 0.1s linear;
        }

        .bg-grid {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background-image:
            linear-gradient(rgba(20,184,166,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(20,184,166,0.025) 1px, transparent 1px);
          background-size: 80px 80px;
          opacity: calc(
            clamp(0, (var(--scroll-progress, 0) - 0.15) * 4, 1) *
            clamp(0, (0.7 - var(--scroll-progress, 0)) * 4, 1)
          );
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

        @keyframes heroFadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes ctaGlowSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .cta-glow-wrap {
          position: relative;
          display: inline-block;
          padding: 1px;
          overflow: hidden;
        }
        .cta-glow-border {
          position: absolute;
          inset: -50%;
          background: conic-gradient(
            from 0deg,
            transparent 0deg,
            transparent 340deg,
            rgba(236, 72, 153, 0.6) 350deg,
            #EC4899 355deg,
            rgba(236, 72, 153, 0.6) 358deg,
            transparent 360deg
          );
          animation: ctaGlowSpin 3s linear infinite;
          filter: blur(1px);
          pointer-events: none;
        }
        .cta-glow-inner {
          position: relative;
          z-index: 1;
          background: #000;
          border: 1px solid rgba(255,255,255,0.3);
        }

        @keyframes heroWordReveal {
          0% { opacity: 0; color: #14B8A6; }
          15% { opacity: 1; color: #14B8A6; }
          40% { color: #14B8A6; }
          100% { opacity: 1; color: #F5F5F5; }
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
          .thread-node { transition: none !important; display: none !important; }
          .thread-node-label { transition: none !important; display: none !important; }
          .gut-pattern { transition-duration: 0.01ms !important; opacity: 1 !important; transform: none !important; }
          .skeleton-overlay { display: none !important; }
          .bg-grain, .bg-grid { display: none !important; }
          .hero-stagger { opacity: 1 !important; animation: none !important; transform: none !important; }
          .hero-word { opacity: 1 !important; animation: none !important; color: #F5F5F5 !important; }
          .cta-glow-border { animation: none !important; display: none !important; }
        }
      `}</style>

      {/* ========== SECTION 1: HERO ========== */}
      <section className="min-h-screen flex items-center justify-center relative px-6" data-testid="section-hero">
        <div className="text-center max-w-3xl mx-auto relative z-10">
          <p
            className="hero-stagger tracking-[0.3em] uppercase"
            style={{ color: "#14B8A6", fontFamily: "'JetBrains Mono', monospace", fontSize: "14px", marginBottom: "48px", animationName: "heroFadeIn", animationDuration: "0.6s", animationDelay: "1.2s" }}
            data-testid="text-brand-name"
          >
            THE ARCHIVIST METHOD&trade;
          </p>

          <p
            className="font-bold"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.5rem, 7vw, 4.5rem)", lineHeight: 1.15, marginBottom: "0" }}
            data-testid="text-brand-title"
          >
            {["You", "know", "exactly", "what", "you're", "doing."].map((word, i) => (
              <span key={i} className="hero-word" style={{ animationDelay: `${2.8 + i * 0.22}s`, marginRight: "0.3em" }}>{word}</span>
            ))}
          </p>
          <p
            className="font-bold"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.5rem, 7vw, 4.5rem)", lineHeight: 1.15 }}
            data-testid="text-brand-title-2"
          >
            {["You", "just", "can't", "stop."].map((word, i) => (
              <span key={i} className="hero-word" style={{ animationDelay: `${4.3 + i * 0.22}s`, marginRight: "0.3em" }}>{word}</span>
            ))}
          </p>

          <p
            className="hero-stagger leading-relaxed mx-auto"
            style={{ color: "#999", fontSize: "1.15rem", maxWidth: "580px", marginTop: "32px", animationName: "heroFadeIn", animationDuration: "0.6s", animationDelay: "7.0s" }}
            data-testid="text-hero-positioning"
          >
            The first pattern interruption system that works in real-time — not in retrospect.
          </p>

          <p
            className="hero-stagger leading-relaxed mx-auto"
            style={{ color: "#F5F5F5", fontSize: "1.05rem", maxWidth: "540px", marginTop: "24px", marginBottom: "48px", animationName: "heroFadeIn", animationDuration: "0.6s", animationDelay: "7.6s" }}
            data-testid="text-hero-mechanism"
          >
            Your body warns you 3-7 seconds before every destructive pattern runs. Therapy never taught you to listen. This does.
          </p>

          <div className="hero-stagger" style={{ animationName: "heroFadeIn", animationDuration: "0.6s", animationDelay: "8.2s" }}>
            <CTAButton text="FIND YOUR PATTERN" />
          </div>

          <p className="hero-stagger" style={{ color: "#737373", fontFamily: "'Source Sans 3', sans-serif", fontSize: "13px", marginTop: "16px", animationName: "heroFadeIn", animationDuration: "0.6s", animationDelay: "8.7s" }}>
            Free · 2 Minutes · Instant Results
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
        <div className="thread-node" />
        <div className="thread-node-label">Recognition</div>
        <SectorLabel text="SECTOR 01 // EMOTIONAL SCAN // STATUS: ACTIVE" />
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="reveal" style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: "white", marginBottom: "48px" }} data-testid="text-gut-check-headline">
            Which one makes your stomach drop?
          </h2>

          <div style={{ marginBottom: "48px" }}>
            {gutCheckPatterns.map((p, i) => (
              <GutCheckItem key={p.name} pattern={p} index={i} isLast={i === gutCheckPatterns.length - 1} />
            ))}
          </div>

          <p className="reveal" style={{ color: "#999", fontStyle: "italic", fontSize: "1rem", maxWidth: "500px", margin: "0 auto" }}>
            "If you felt something reading one of those — that's your body signature. That's the thread."
          </p>
        </div>
      </section>

      {/* ========== SECTION 3: THE 9 PATTERNS ========== */}
      <section ref={sectionRefs.patterns} className="py-24 md:py-32 px-6" data-testid="section-patterns" style={{ position: "relative" }}>
        <div className="thread-node" />
        <div className="thread-node-label">Patterns</div>
        <SectorLabel text="ARCHIVE REF: 09-CORE // CLASSIFICATION: PRIMARY" />
        <div className="max-w-6xl mx-auto">
          <div className="text-center" style={{ marginBottom: "48px" }}>
            <SectionLabel>THE PATTERNS</SectionLabel>
            <h2 className="reveal reveal-delay-1" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 4vw, 2.5rem)", color: "white" }} data-testid="text-patterns-headline">
              9 Destructive Patterns. You're Running at Least One.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {patternCards.map((p, i) => (
              <PatternCard key={p.num} card={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ========== SECTION 4: CTA BREAK ========== */}
      <section ref={sectionRefs.ctaBreak} className="py-24 md:py-32 px-6" data-testid="section-cta-break" style={{ position: "relative" }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="reveal" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", color: "white", marginBottom: "32px" }}>
            Recognize yourself?
          </h2>
          <div className="reveal reveal-delay-1">
            <CTAButton text="FIND YOUR PATTERN" />
          </div>
        </div>
      </section>

      {/* ========== SECTION 5: THE WINDOW (Timed Text Sequence) ========== */}
      <TheWindowSection sectionRef={sectionRefs.window} />

      {/* ========== SECTION 6: THIS IS FOR YOU / NOT FOR YOU ========== */}
      <section ref={sectionRefs.whoFor} className="py-24 md:py-32 px-6" data-testid="section-who-for" style={{ position: "relative" }}>
        <div className="thread-node" />
        <div className="thread-node-label">Validation</div>
        <div className="max-w-5xl mx-auto">
          <div className="text-center" style={{ marginBottom: "48px" }}>
            <SectionLabel>WHO THIS IS FOR</SectionLabel>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* For You */}
            <div className="reveal" style={{ borderLeft: "3px solid #14B8A6", padding: "32px" }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: "white", marginBottom: "24px" }}>
                This Is For You If:
              </h3>
              <div className="space-y-4">
                {forYou.map((item, i) => (
                  <p key={i} style={{ color: "#ccc", fontSize: "1rem", lineHeight: 1.6 }}>
                    <span style={{ color: "#14B8A6", marginRight: "8px" }}>&mdash;</span>
                    {item}
                  </p>
                ))}
              </div>
            </div>

            {/* Not For You */}
            <div className="reveal reveal-delay-2" style={{ borderLeft: "3px solid #EC4899", padding: "32px" }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: "white", marginBottom: "24px" }}>
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
        <div className="thread-node" />
        <div className="thread-node-label">Method</div>
        <SectorLabel text="PROTOCOL: FEIR-4 // CLEARANCE: STANDARD" />
        <div className="max-w-6xl mx-auto">
          <div className="text-center" style={{ marginBottom: "48px" }}>
            <SectionLabel>THE METHOD</SectionLabel>
            <h2 className="reveal reveal-delay-1" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 4vw, 2.5rem)", color: "white" }} data-testid="text-method-headline">
              How Pattern Interruption Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { num: "1", name: "IDENTIFY", desc: "Take the free assessment. Discover which of the 9 patterns is running your behavior. See your specific triggers, body signatures, and the origin of the pattern." },
              { num: "2", name: "INTERRUPT", desc: "Learn your 3-7 second window. Recognize the body signature. Apply the circuit break before the pattern finishes executing. One successful interrupt changes everything." },
              { num: "3", name: "REWRITE", desc: "Repetition weakens the pattern. Each interrupt builds a new neural pathway. The pattern doesn't disappear — it loses its grip. You get your choices back." },
            ].map((step, i) => (
              <div
                key={step.num}
                className={`reveal reveal-delay-${i + 1}`}
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", padding: "32px" }}
                data-testid={`card-step-${step.num}`}
              >
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "3rem", color: "#14B8A6", marginBottom: "16px" }}>{step.num}</p>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", color: "white", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>{step.name}</p>
                <p style={{ color: "#999", fontSize: "0.95rem", lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== SECTION 8: NOT THERAPY ========== */}
      <section ref={sectionRefs.notTherapy} className="py-24 md:py-32 px-6" data-testid="section-not-therapy" style={{ position: "relative" }}>
        <div className="thread-node" />
        <div className="thread-node-label">Difference</div>
        <div className="max-w-4xl mx-auto">
          <div className="text-center" style={{ marginBottom: "48px" }}>
            <SectionLabel>THE DIFFERENCE</SectionLabel>
            <h2 className="reveal reveal-delay-1" style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: "white" }} data-testid="text-therapy-headline">
              Pattern Archaeology vs. Traditional Therapy
            </h2>
          </div>

          <div className="reveal reveal-delay-2">
            {/* Table header */}
            <div className="grid grid-cols-2 gap-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "16px", marginBottom: "8px" }}>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem", color: "#737373", textTransform: "uppercase", letterSpacing: "0.1em" }}>THERAPY</p>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem", color: "#14B8A6", textTransform: "uppercase", letterSpacing: "0.1em" }}>THE ARCHIVIST METHOD</p>
            </div>
            {/* Table rows */}
            {therapyRows.map((row, i) => (
              <div key={i} className="grid grid-cols-2 gap-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "16px 0" }}>
                <p style={{ color: "#737373", fontSize: "0.95rem" }}>{row[0]}</p>
                <p style={{ color: "white", fontSize: "0.95rem", borderLeft: "2px solid rgba(20, 184, 166, 0.3)", paddingLeft: "16px" }}>{row[1]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== SECTION 8.5: FROM THE ARCHIVES ========== */}
      <section className="py-24 md:py-32 px-6" data-testid="section-archives" style={{ position: "relative" }}>
        <div className="thread-node" />
        <div className="thread-node-label">Evidence</div>
        <div className="max-w-4xl mx-auto">
          <div className="text-center" style={{ marginBottom: "48px" }}>
            <SectionLabel>FROM THE ARCHIVES</SectionLabel>
            <h2 className="reveal reveal-delay-1" style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: "white" }} data-testid="text-archives-headline">
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
        <div className="thread-node" />
        <div className="thread-node-label">System</div>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div className="text-center" style={{ marginBottom: "48px" }}>
            <SectionLabel>INSIDE THE SYSTEM</SectionLabel>
            <h2 className="reveal reveal-delay-1" style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: "white" }} data-testid="text-bento-headline">
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
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "14px", color: "white", marginBottom: "12px" }}>THE DISAPPEARING PATTERN</p>
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
              <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "11px", color: "#666", marginTop: "14px", textAlign: "center" }}>Your pattern has a physical signature. Learn to read it.</p>
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
        <div className="thread-node" />
        <div className="thread-node-label">Access</div>
        <div className="max-w-6xl mx-auto">
          <div className="text-center" style={{ marginBottom: "48px" }}>
            <SectionLabel>CHOOSE YOUR DEPTH</SectionLabel>
            <h2 className="reveal reveal-delay-1" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 4vw, 2.5rem)", color: "white" }} data-testid="text-pricing-headline">
              Start Free. Go Deeper When You're Ready.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* Crash Course */}
            <div className="reveal flex flex-col" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", padding: "40px 32px" }} data-testid="card-pricing-crash-course">
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem", color: "#14B8A6", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "8px" }}>FREE</p>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.5rem", color: "white", marginBottom: "16px" }}>$0</p>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: "white", marginBottom: "16px" }}>The Crash Course</p>
              <p style={{ color: "#999", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "32px", flex: 1 }}>
                Your pattern identified. 7-day introduction to pattern interruption. Body signature basics. Your first circuit break.
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

            {/* Field Guide - emphasized */}
            <div className="reveal reveal-delay-1 flex flex-col" style={{ background: "rgba(255,255,255,0.03)", border: "2px solid #14B8A6", padding: "40px 32px", transform: "scale(1.02)" }} data-testid="card-pricing-field-guide">
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem", color: "#14B8A6", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "8px" }}>YOUR PATTERN</p>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.5rem", color: "white", marginBottom: "16px" }}>$47</p>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: "white", marginBottom: "16px" }}>The Field Guide</p>
              <p style={{ color: "#999", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "32px", flex: 1 }}>
                Everything about YOUR specific pattern. Complete body signature mapping. Custom interrupt protocols. Relationship pattern analysis. 90+ pages. AI pattern coach access.
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

            {/* Complete Archive */}
            <div className="reveal reveal-delay-2 flex flex-col" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", padding: "40px 32px" }} data-testid="card-pricing-archive">
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem", color: "#14B8A6", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "8px" }}>ALL 9 PATTERNS</p>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.5rem", color: "white", marginBottom: "16px" }}>$197</p>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: "white", marginBottom: "16px" }}>The Complete Archive</p>
              <p style={{ color: "#999", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "32px", flex: 1 }}>
                The entire Archivist Method. All 9 patterns fully documented. Cross-pattern analysis. Advanced protocols. The Four Doors system. Full Vault access. 600+ pages.
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

          <p className="reveal reveal-delay-3 text-center" style={{ color: "#737373", fontSize: "13px", marginTop: "32px" }}>
            One-time purchase. No subscriptions. No recurring charges. Yours forever.
          </p>
        </div>
      </section>

      {/* ========== SECTION 11: FOUNDER ========== */}
      <section ref={sectionRefs.founder} className="px-6" data-testid="section-founder" style={{ position: "relative", paddingTop: "120px", paddingBottom: "120px" }}>
        <div className="thread-node" />
        <div className="thread-node-label">Origin</div>
        <div className="max-w-3xl mx-auto">
          <div className="text-center" style={{ marginBottom: "48px" }}>
            <p className="reveal" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "#737373", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "16px" }}>
              FIELD NOTES
            </p>
            <h2 className="reveal reveal-delay-1" style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: "white" }} data-testid="text-founder-headline">
              About The Founder
            </h2>
          </div>

          <div className="reveal reveal-delay-2 text-center" style={{ lineHeight: 1.8 }}>
            <p style={{ color: "#ccc", fontSize: "1.1rem", marginBottom: "24px" }}>
              I built this because I was watching patterns destroy something I cared about deeply. Someone I love was running the same loops I was — and neither of us knew how to stop. We could see it happening. We could name it. We just couldn't interrupt it.
            </p>
            <p style={{ color: "#ccc", fontSize: "1.1rem", marginBottom: "24px" }}>
              So I started researching. Obsessively. Tearing apart every framework I could find. Looking for the one thing underneath all of it that actually worked. Not in six months. Not in theory. Right now. In the middle of the fight. In the middle of the flood.
            </p>
            <p style={{ color: "#ccc", fontSize: "1.1rem", marginBottom: "48px" }}>
              This method is what I found. I built it for us. I'm sharing it because I know we're not the only ones.
            </p>
            <p style={{ color: "#F5F5F5", fontSize: "1.1rem", fontStyle: "italic", marginBottom: "16px" }}>
              For her.
            </p>
            <p style={{ color: "#999", fontSize: "1rem" }}>
              — Aaron
            </p>
          </div>
        </div>
      </section>

      {/* ========== SECTION 12: FINAL CTA ========== */}
      <section ref={sectionRefs.finalCta} className="py-24 md:py-32 px-6" data-testid="section-final-cta" style={{ position: "relative" }}>
        <div className="thread-node" />
        <div className="thread-node-label">Interrupt</div>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="reveal" style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: "white", marginBottom: "32px" }} data-testid="text-final-cta-headline">
            You found the thread. Now pull it.
          </h2>
          <div className="reveal reveal-delay-1">
            <CTAButton text="FIND YOUR PATTERN" />
          </div>
          <p className="reveal reveal-delay-2" style={{ color: "#737373", fontSize: "13px", marginTop: "16px" }}>
            Free · 2 Minutes · Instant Results
          </p>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer style={{ padding: "48px 24px" }}>
        <div className="max-w-4xl mx-auto text-center">
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: "#14B8A6", fontStyle: "italic", opacity: 0.6 }}>
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
