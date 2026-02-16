import { Link } from "wouter";
import { Check, X, ArrowRight, ChevronRight } from "lucide-react";
import { useEffect, useRef, lazy, Suspense } from "react";
import { apiRequest } from "@/lib/queryClient";

const ParticleField = lazy(() => import("@/components/ParticleField"));

const patterns = [
  { number: 1, name: "DISAPPEARING", description: "You ghost when relationships get close. Three months in, they say \"I love you\" — your chest gets tight. Every time." },
  { number: 2, name: "APOLOGY LOOP", description: "You apologize for existing. \"Sorry to bother you.\" Twenty times a day for things that need no apology." },
  { number: 3, name: "TESTING", description: "You push people away to see if they'll stay. They pass? You create a bigger test. You don't trust \"I'm not leaving\" until you've tested it 47 ways." },
  { number: 4, name: "ATTRACTION TO HARM", description: "Safe people feel boring. Chaos feels like chemistry. Red flags don't register as warnings — they register as attraction." },
  { number: 5, name: "COMPLIMENT DEFLECTION", description: "You can't accept praise. Someone says \"great work\" — you deflect, minimize, redirect. Visibility makes you squirm." },
  { number: 6, name: "DRAINING BOND", description: "You can't leave. Toxic job, harmful relationship, depleting friendship. You know you should go. Everyone tells you to leave. You stay." },
  { number: 7, name: "SUCCESS SABOTAGE", description: "You destroy things right before they succeed. Three weeks from launch, you quit. One week from promotion, you blow it up." },
  { number: 8, name: "PERFECTIONISM", description: "If it's not perfect, it's garbage. So you don't finish. Or you don't start. Years of almost-finished projects, ideas that died in your head." },
  { number: 9, name: "RAGE", description: "It comes out of nowhere. One second you're fine, the next you're saying things you can't take back. Afterward: shame, apologies, promises." },
];

const therapyComparison = [
  ["Asks \"Why do you do this?\"", "Asks \"What pattern is running right now?\""],
  ["Explores your past", "Interrupts your present"],
  ["Builds understanding", "Builds pattern recognition"],
  ["Weekly sessions over months/years", "7-day protocol with daily practice"],
  ["Focuses on emotions", "Focuses on body signatures"],
  ["Therapist-guided insight", "Self-directed interruption"],
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
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );
    if (ref.current) {
      ref.current.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    }
    return () => observer.disconnect();
  }, []);
  return ref;
}

function CTAButton({ text, className = "" }: { text: string; className?: string }) {
  return (
    <Link
      href="/quiz"
      data-testid="button-cta"
      className={`inline-block border border-white/80 text-white font-medium tracking-[0.2em] uppercase text-sm px-10 py-4 transition-all duration-300 hover:bg-white hover:text-black font-mono ${className}`}
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
    >
      {text} <ArrowRight className="inline w-4 h-4 ml-1" />
    </Link>
  );
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

function ThreadWord({ children }: { children: string }) {
  return <span className="thread-word">{children}</span>;
}

export default function Landing() {
  const sectionRefs = {
    gutCheck: useScrollReveal(),
    whoFor: useScrollReveal(),
    patterns: useScrollReveal(),
    window: useScrollReveal(),
    notTherapy: useScrollReveal(),
    howItWorks: useScrollReveal(),
    pricing: useScrollReveal(),
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

    const wordObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("thread-word-visible");
            wordObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.8 }
    );

    const page = pageRef.current;
    if (page) {
      page.querySelectorAll(".thread-node").forEach((el) => nodeObserver.observe(el));
      page.querySelectorAll(".thread-node-label").forEach((el) => labelObserver.observe(el));
      page.querySelectorAll(".thread-word").forEach((el) => wordObserver.observe(el));
    }

    return () => {
      nodeObserver.disconnect();
      labelObserver.disconnect();
      wordObserver.disconnect();
    };
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen thread-page" style={{ background: "#0A0A0A", color: "#F5F5F5", fontFamily: "'Source Sans 3', sans-serif" }}>
      <Suspense fallback={null}>
        <ParticleField />
      </Suspense>

      <style>{`
        .reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
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
        .ticker-track {
          display: flex;
          animation: ticker-scroll 30s linear infinite;
          width: max-content;
        }
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes pulse-subtle {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .interrupt-pulse {
          animation: pulse-subtle 2s ease-in-out infinite;
        }

        /* ================================
           THREAD SYSTEM
           ================================ */

        /* Vertical thread line */
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

        /* Active thread overlay that grows with scroll */
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

        /* Thread nodes */
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

        /* Thread node label */
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

        /* Thread word underlines */
        .thread-word {
          position: relative;
          display: inline;
        }

        .thread-word::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -2px;
          height: 1.5px;
          width: 0%;
          background: #14B8A6;
          box-shadow: 0 1px 4px rgba(20, 184, 166, 0.2);
          transition: width 0.6s ease-out;
        }

        .thread-word.thread-word-visible::after {
          width: 100%;
        }

        /* Mobile: hide thread line and nodes */
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

        @media (prefers-reduced-motion: reduce) {
          .reveal { transition-duration: 0.01ms !important; opacity: 1 !important; transform: none !important; }
          .ticker-track { animation: none !important; }
          .interrupt-pulse { animation: none !important; opacity: 1 !important; }
          .thread-page::before, .thread-page::after { transition: none !important; display: none !important; }
          .thread-node { transition: none !important; display: none !important; }
          .thread-node-label { transition: none !important; display: none !important; }
          .thread-word::after { transition: none !important; }
        }
      `}</style>

      {/* SECTION 1: HERO */}
      <section className="min-h-screen flex items-center justify-center relative px-6" data-testid="section-hero" style={{ position: "relative" }}>
        <div className="text-center max-w-3xl mx-auto relative z-10">
          <p
            className="text-sm md:text-base tracking-[0.3em] uppercase mb-4"
            style={{ color: "#14B8A6", fontFamily: "'JetBrains Mono', monospace", fontWeight: 500 }}
            data-testid="text-brand-name"
          >
            THE ARCHIVIST METHOD&trade;
          </p>
          <p
            className="text-xs tracking-[0.35em] uppercase mb-12"
            style={{ color: "#737373", fontFamily: "'JetBrains Mono', monospace" }}
            data-testid="text-brand-tagline"
          >
            PATTERN ARCHAEOLOGY, <span style={{ color: "#EC4899" }}>NOT</span> THERAPY
          </p>

          <h1
            className="font-bold leading-[1.1] mb-8"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.8rem, 8vw, 5.5rem)" }}
            data-testid="text-brand-title"
          >
            You already know<br />what you're doing.<br />
            <span style={{ color: "#14B8A6" }}>This teaches you how to stop.</span>
          </h1>

          <p className="text-lg md:text-xl leading-relaxed mb-3 max-w-[600px] mx-auto" style={{ color: "#737373" }}>
            A pattern interruption system for people who understand their destructive patterns but can't stop running them.
          </p>

          <p className="text-lg mb-12 tracking-wide" style={{ color: "#14B8A6", letterSpacing: "0.05em" }}>
            Discover your pattern. <ThreadWord>Interrupt it</ThreadWord> in 7–90 days.
          </p>

          <CTAButton text="DISCOVER YOUR PATTERN" />

          <p className="mt-6 text-xs" style={{ color: "#737373", fontFamily: "'JetBrains Mono', monospace" }}>
            Free  ·  2 Minutes  ·  Instant Results
          </p>
        </div>
      </section>

      {/* SECTION 2: GUT CHECK */}
      <section ref={sectionRefs.gutCheck} className="py-24 md:py-32 px-6" data-testid="section-gut-check" style={{ position: "relative" }}>
        <div className="thread-node" />
        <div className="thread-node-label">Recognition</div>
        <div className="max-w-5xl mx-auto text-center">
          <p className="reveal text-lg mb-10" style={{ color: "#737373" }}>
            One of these is running your life right now:
          </p>

          <div className="reveal reveal-delay-1 overflow-hidden mb-10">
            <div className="ticker-track">
              {[...patterns, ...patterns].map((p, i) => (
                <span
                  key={i}
                  className="text-2xl md:text-4xl font-bold mx-4 md:mx-6 whitespace-nowrap"
                  style={{ fontFamily: "'Playfair Display', serif", color: "#EC4899" }}
                >
                  {p.name}
                  {i < patterns.length * 2 - 1 && (
                    <span className="mx-4 md:mx-6" style={{ color: "#737373" }}>·</span>
                  )}
                </span>
              ))}
            </div>
          </div>

          <p className="reveal reveal-delay-2 text-xl" style={{ color: "#14B8A6" }}>
            Which one made your <ThreadWord>stomach drop</ThreadWord>?
          </p>
        </div>
      </section>

      {/* SECTION 3: WHO THIS IS FOR */}
      <section ref={sectionRefs.whoFor} className="py-24 md:py-32 px-6" data-testid="section-who-for" style={{ position: "relative" }}>
        <div className="thread-node" />
        <div className="thread-node-label">Qualification</div>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div
              className="reveal p-8 rounded-md"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderLeft: "3px solid #14B8A6" }}
            >
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2" style={{ color: "#14B8A6" }}>
                <Check className="w-5 h-5" /> THIS IS FOR YOU IF:
              </h3>
              <ul className="space-y-4 text-base" style={{ color: "#A3A3A3" }}>
                <li>You watch yourself do destructive things and can't stop</li>
                <li>You've been in therapy for years but still run the same patterns</li>
                <li>You understand WHY you do it but can't stop DOING it</li>
                <li>You sabotage relationships, success, or stability</li>
                <li>You're tired of insight and ready for interruption</li>
              </ul>
            </div>

            <div
              className="reveal reveal-delay-1 p-8 rounded-md"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderLeft: "3px solid #EC4899" }}
            >
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2" style={{ color: "#EC4899" }}>
                <X className="w-5 h-5" /> THIS IS NOT FOR YOU IF:
              </h3>
              <ul className="space-y-4 text-base" style={{ color: "#A3A3A3" }}>
                <li>You're in crisis and need immediate professional help</li>
                <li>You want someone else to fix you</li>
                <li>You're looking for a quick fix with no effort</li>
                <li>You want to understand your childhood (get therapy)</li>
                <li>You're not ready to see your patterns clearly</li>
              </ul>
            </div>
          </div>

          <div className="reveal reveal-delay-2 text-center">
            <p className="text-lg" style={{ color: "#A3A3A3" }}>
              This method requires you to <span className="font-semibold" style={{ color: "#F5F5F5" }}>watch yourself</span>,{" "}
              <span className="font-semibold" style={{ color: "#F5F5F5" }}>name what you see</span>, and{" "}
              <span className="font-semibold" style={{ color: "#F5F5F5" }}>interrupt it in real-time</span>.
            </p>
            <p className="mt-2 italic" style={{ color: "#14B8A6" }}>
              That's the work. That's all of it.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 4: THE 9 DESTRUCTIVE PATTERNS */}
      <section ref={sectionRefs.patterns} className="py-24 md:py-32 px-6" data-testid="section-patterns" style={{ position: "relative" }}>
        <div className="thread-node" />
        <div className="thread-node-label">Identification</div>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="reveal text-xs tracking-[0.3em] uppercase mb-4" style={{ color: "#737373", fontFamily: "'JetBrains Mono', monospace" }}>
              CLASSIFIED — 9 IDENTIFIED PATTERNS
            </p>
            <h2 className="reveal reveal-delay-1 text-3xl md:text-5xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }} data-testid="text-patterns-headline">
              The 9 Destructive Patterns
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {patterns.map((p, i) => (
              <div
                key={p.number}
                className={`reveal reveal-delay-${Math.min(i + 1, 8)} p-6 rounded-md transition-colors duration-300 group`}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
                data-testid={`card-pattern-${p.number}`}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#14B8A6")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)")}
              >
                <span
                  className="text-3xl font-bold block mb-2"
                  style={{ color: "#EC4899", fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {String(p.number).padStart(2, "0")}
                </span>
                <h3 className="text-lg font-bold mb-3 tracking-wide" style={{ color: "#F5F5F5" }}>
                  {p.name}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#737373" }}>
                  {p.description}
                </p>
              </div>
            ))}
          </div>

          <div className="reveal text-center mt-12">
            <Link
              href="/quiz"
              className="inline-flex items-center gap-2 text-base font-medium transition-colors"
              style={{ color: "#14B8A6" }}
              data-testid="link-discover-pattern"
            >
              Discover your pattern <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 5: THE 3-7 SECOND WINDOW */}
      <section ref={sectionRefs.window} className="py-24 md:py-32 px-6" data-testid="section-window" style={{ position: "relative" }}>
        <div className="thread-node" />
        <div className="thread-node-label">The Window</div>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="reveal text-xs tracking-[0.3em] uppercase mb-4" style={{ color: "#737373", fontFamily: "'JetBrains Mono', monospace" }}>
              THE SCIENCE
            </p>
            <h2 className="reveal reveal-delay-1 text-3xl md:text-5xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }} data-testid="text-window-headline">
              You have 3-7 seconds.
            </h2>
          </div>

          <p className="reveal reveal-delay-2 text-center text-lg mb-16 max-w-2xl mx-auto" style={{ color: "#A3A3A3" }}>
            Right now, your patterns run in a 3-7 second window:
          </p>

          {/* Flow diagram */}
          <div className="reveal reveal-delay-3">
            {/* Desktop: horizontal */}
            <div className="hidden md:flex items-center justify-center gap-0 mb-6">
              {[
                { label: "TRIGGER", sub: "Event occurs", highlight: false },
                { label: "BODY SIGNATURE", sub: "Physical sensation", highlight: true },
                { label: "THOUGHT", sub: "Story activates", highlight: false },
                { label: "PATTERN EXECUTES", sub: "Behavior runs", highlight: false },
              ].map((step, i) => (
                <div key={i} className="flex items-center">
                  <div
                    className="px-6 py-5 rounded-md text-center min-w-[180px]"
                    style={{
                      background: step.highlight ? "rgba(20,184,166,0.1)" : "rgba(255,255,255,0.03)",
                      border: step.highlight ? "2px solid #14B8A6" : "1px solid rgba(255,255,255,0.06)",
                      boxShadow: step.highlight ? "0 0 30px rgba(20,184,166,0.15)" : "none",
                    }}
                  >
                    <p className="text-xs tracking-widest uppercase mb-1" style={{ fontFamily: "'JetBrains Mono', monospace", color: step.highlight ? "#14B8A6" : "#737373" }}>
                      {step.label === "BODY SIGNATURE" ? <><ThreadWord>Body Signature</ThreadWord></> : step.label}
                    </p>
                    <p className="text-sm" style={{ color: "#A3A3A3" }}>{step.sub}</p>
                  </div>
                  {i < 3 && (
                    <div className="flex flex-col items-center mx-2 relative">
                      {i === 1 && (
                        <span
                          className="interrupt-pulse absolute -top-8 text-xs font-bold tracking-wider whitespace-nowrap"
                          style={{ color: "#EC4899", fontFamily: "'JetBrains Mono', monospace" }}
                        >
                          INTERRUPT HERE
                        </span>
                      )}
                      <ArrowRight className="w-5 h-5" style={{ color: i === 1 ? "#EC4899" : "#737373" }} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile: vertical */}
            <div className="md:hidden flex flex-col items-center gap-0 mb-6">
              {[
                { label: "TRIGGER", sub: "Event occurs", highlight: false },
                { label: "BODY SIGNATURE", sub: "Physical sensation", highlight: true },
                { label: "THOUGHT", sub: "Story activates", highlight: false },
                { label: "PATTERN EXECUTES", sub: "Behavior runs", highlight: false },
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div
                    className="px-6 py-5 rounded-md text-center w-full max-w-[280px]"
                    style={{
                      background: step.highlight ? "rgba(20,184,166,0.1)" : "rgba(255,255,255,0.03)",
                      border: step.highlight ? "2px solid #14B8A6" : "1px solid rgba(255,255,255,0.06)",
                      boxShadow: step.highlight ? "0 0 30px rgba(20,184,166,0.15)" : "none",
                    }}
                  >
                    <p className="text-xs tracking-widest uppercase mb-1" style={{ fontFamily: "'JetBrains Mono', monospace", color: step.highlight ? "#14B8A6" : "#737373" }}>
                      {step.label === "BODY SIGNATURE" ? <><ThreadWord>Body Signature</ThreadWord></> : step.label}
                    </p>
                    <p className="text-sm" style={{ color: "#A3A3A3" }}>{step.sub}</p>
                  </div>
                  {i < 3 && (
                    <div className="flex flex-col items-center my-2 relative">
                      {i === 1 && (
                        <span
                          className="interrupt-pulse text-xs font-bold tracking-wider mb-1"
                          style={{ color: "#EC4899", fontFamily: "'JetBrains Mono', monospace" }}
                        >
                          INTERRUPT HERE
                        </span>
                      )}
                      <ArrowRight className="w-5 h-5 rotate-90" style={{ color: i === 1 ? "#EC4899" : "#737373" }} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Window badge */}
            <div className="flex justify-center mb-12">
              <span
                className="px-4 py-2 text-xs tracking-[0.2em] uppercase rounded-sm"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  color: "#F5F5F5",
                  background: "rgba(236,72,153,0.15)",
                  border: "1px solid rgba(236,72,153,0.3)",
                }}
              >
                3-7 SECOND WINDOW
              </span>
            </div>
          </div>

          <div className="reveal reveal-delay-4 max-w-2xl mx-auto text-center">
            <p className="text-lg leading-relaxed" style={{ color: "#A3A3A3" }}>
              Pattern archaeology teaches you to recognize the pattern BEFORE it runs.
              In that 3-7 second window. In that recognition, you create a gap.
            </p>
            <p className="mt-2 text-lg" style={{ color: "#F5F5F5" }}>
              In that gap, you can interrupt the code.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 6: THIS IS NOT THERAPY */}
      <section ref={sectionRefs.notTherapy} className="py-24 md:py-32 px-6" data-testid="section-not-therapy" style={{ position: "relative" }}>
        <div className="thread-node" />
        <div className="thread-node-label">Distinction</div>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="reveal text-3xl md:text-5xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: "#14B8A6" }} data-testid="text-not-therapy-headline">
              This is not therapy.
            </h2>
            <p className="reveal reveal-delay-1 mt-4 text-lg" style={{ color: "#737373" }}>
              Here's the difference.
            </p>
          </div>

          <div className="reveal reveal-delay-2">
            <div className="grid grid-cols-2 gap-0" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="px-4 py-3 text-xs tracking-[0.2em] uppercase" style={{ color: "#737373", fontFamily: "'JetBrains Mono', monospace", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                THERAPY
              </div>
              <div className="px-4 py-3 text-xs tracking-[0.2em] uppercase" style={{ color: "#F5F5F5", fontFamily: "'JetBrains Mono', monospace", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                THE ARCHIVIST METHOD
              </div>
              {therapyComparison.map(([therapy, method], i) => (
                <div key={i} className="contents">
                  <div className="px-4 py-4 text-sm" style={{ color: "#737373", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    {therapy}
                  </div>
                  <div className="px-4 py-4 text-sm font-semibold" style={{ color: "#F5F5F5", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    {method}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="reveal reveal-delay-3 text-center mt-12">
            <p className="text-base" style={{ color: "#A3A3A3" }}>
              Both have value. They solve different problems.
            </p>
            <p className="mt-2 font-semibold" style={{ color: "#F5F5F5" }}>
              If you need to understand your past, get therapy.
            </p>
            <p className="mt-1" style={{ color: "#14B8A6" }}>
              If you need to interrupt your present, get this.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 7: HOW IT WORKS */}
      <section ref={sectionRefs.howItWorks} className="py-24 md:py-32 px-6" data-testid="section-how-it-works" style={{ position: "relative" }}>
        <div className="thread-node" />
        <div className="thread-node-label">Protocol</div>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="reveal text-xs tracking-[0.3em] uppercase mb-4" style={{ color: "#737373", fontFamily: "'JetBrains Mono', monospace" }}>
              THE PROTOCOL
            </p>
            <h2 className="reveal reveal-delay-1 text-3xl md:text-5xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }} data-testid="text-how-it-works-headline">
              How Pattern Interruption Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              { num: "01", title: "IDENTIFY YOUR PATTERN", desc: "Take the 2-minute assessment. Get the specific survival code running your life." },
              { num: "02", title: "LEARN YOUR BODY SIGNATURE", desc: "Your body signals the pattern 3-7 seconds before it runs. Learn to recognize your warning." },
              { num: "03", title: "INTERRUPT & TRACK", desc: "When you feel it activate, speak your circuit break statement. Track attempts. You get better every time." },
            ].map((step, i) => (
              <div
                key={i}
                className={`reveal reveal-delay-${i + 2} p-8 rounded-md`}
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <span
                  className="text-4xl font-bold block mb-4"
                  style={{ color: "#14B8A6", fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {step.num}
                </span>
                <h3 className="text-base font-bold mb-3 tracking-wide" style={{ color: "#F5F5F5" }}>
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#737373" }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          <p className="reveal text-center text-base" style={{ color: "#A3A3A3" }}>
            The 7-day protocol gives you proof of concept.<br />
            <span className="font-semibold" style={{ color: "#F5F5F5" }}>One successful interrupt = the method works for you.</span>
          </p>
        </div>
      </section>

      {/* SECTION 8: CHOOSE YOUR PATH */}
      <section ref={sectionRefs.pricing} className="py-24 md:py-32 px-6" data-testid="section-pricing" style={{ position: "relative" }}>
        <div className="thread-node" />
        <div className="thread-node-label">Access</div>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="reveal text-3xl md:text-5xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }} data-testid="text-pricing-headline">
              Choose Your Path
            </h2>
            <p className="reveal reveal-delay-1 mt-4 text-lg" style={{ color: "#737373" }}>
              Pattern interruption at every level
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free */}
            <div
              className="reveal reveal-delay-1 p-8 rounded-md flex flex-col"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
              data-testid="card-pricing-free"
            >
              <p className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: "#737373", fontFamily: "'JetBrains Mono', monospace" }}>
                THE CRASH COURSE
              </p>
              <p className="text-4xl font-bold mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>Free</p>
              <p className="text-sm mb-8" style={{ color: "#737373" }}>Start here. See if you recognize yourself.</p>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  "2-minute pattern assessment",
                  "Your primary pattern identified",
                  "7-day Crash Course protocol",
                  "Body signature guide",
                  "Circuit break statement",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm" style={{ color: "#A3A3A3" }}>
                    <Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#14B8A6" }} />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/quiz"
                className="block w-full text-center py-3 rounded-md text-sm font-medium tracking-wider uppercase transition-colors"
                style={{
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "#F5F5F5",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
                data-testid="button-pricing-free"
              >
                START FREE
              </Link>
            </div>

            {/* Field Guide $47 */}
            <div
              className="reveal reveal-delay-2 p-8 rounded-md flex flex-col relative"
              style={{
                background: "rgba(20,184,166,0.05)",
                border: "2px solid #14B8A6",
                backdropFilter: "blur(10px)",
              }}
              data-testid="card-pricing-field-guide"
            >
              <span
                className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-xs tracking-widest uppercase rounded-sm"
                style={{
                  background: "#14B8A6",
                  color: "#0A0A0A",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                MOST POPULAR
              </span>
              <p className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: "#14B8A6", fontFamily: "'JetBrains Mono', monospace" }}>
                THE FIELD GUIDE
              </p>
              <p className="text-4xl font-bold mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>$47</p>
              <p className="text-sm mb-8" style={{ color: "#A3A3A3" }}>Go deeper. Get your pattern-specific field guide.</p>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  "Everything in Crash Course",
                  "Your pattern's complete field guide (PDF)",
                  "Detailed body signature mapping",
                  "Pattern-specific interrupt scripts",
                  "Relationship pattern analysis",
                  "The Archivist AI access",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm" style={{ color: "#A3A3A3" }}>
                    <Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#14B8A6" }} />
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleCheckout("quick-start")}
                className="block w-full text-center py-3 rounded-md text-sm font-medium tracking-wider uppercase transition-colors cursor-pointer"
                style={{
                  background: "#14B8A6",
                  color: "#0A0A0A",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
                data-testid="button-pricing-field-guide"
              >
                GET THE FIELD GUIDE
              </button>
            </div>

            {/* Complete Archive $197 */}
            <div
              className="reveal reveal-delay-3 p-8 rounded-md flex flex-col"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                backdropFilter: "blur(10px)",
              }}
              data-testid="card-pricing-archive"
            >
              <p className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: "#EC4899", fontFamily: "'JetBrains Mono', monospace" }}>
                THE COMPLETE ARCHIVE
              </p>
              <p className="text-4xl font-bold mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>$197</p>
              <p className="text-sm mb-8" style={{ color: "#A3A3A3" }}>All 9 patterns. Full documentation. Total access.</p>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  "Everything in Field Guide",
                  "All Four Doors, fully documented",
                  "All 9 patterns mapped",
                  "Cross-pattern analysis",
                  "Advanced protocols",
                  "Lifetime access",
                  "Archivist AI access",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm" style={{ color: "#A3A3A3" }}>
                    <Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#EC4899" }} />
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleCheckout("complete-archive")}
                className="block w-full text-center py-3 rounded-md text-sm font-medium tracking-wider uppercase transition-colors cursor-pointer"
                style={{
                  background: "#EC4899",
                  color: "#F5F5F5",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
                data-testid="button-pricing-archive"
              >
                ENTER THE ARCHIVE
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9: ABOUT THE ARCHIVIST */}
      <section ref={sectionRefs.founder} className="py-24 md:py-32 px-6" data-testid="section-founder" style={{ position: "relative" }}>
        <div className="thread-node" />
        <div className="thread-node-label">Origin</div>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="reveal text-xs tracking-[0.3em] uppercase mb-4" style={{ color: "#737373", fontFamily: "'JetBrains Mono', monospace" }}>
              FIELD NOTES
            </p>
            <h2 className="reveal reveal-delay-1 text-3xl md:text-5xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }} data-testid="text-founder-headline">
              About The Founder
            </h2>
          </div>

          <div className="reveal reveal-delay-2 space-y-6 text-base leading-relaxed" style={{ color: "#A3A3A3" }}>
            <p>
              I built this because I was watching patterns<br />
              destroy something I cared about deeply.<br />
              Someone I love was running the same loops I was —<br />
              and neither of us knew how to stop.<br />
              We could see it happening. We could name it.<br />
              We just couldn't interrupt it.
            </p>
            <p>
              So I started researching. Obsessively.<br />
              Tearing apart every framework I could find.<br />
              Looking for the one thing underneath all of it<br />
              that actually worked.<br />
              Not in six months. Not in theory. Right now.<br />
              In the middle of the fight. In the middle of the flood.
            </p>
            <p>
              This method is what I found.<br />
              I built it for us. I'm sharing it because<br />
              I know we're not the only ones.
            </p>
            <p className="italic" style={{ color: "#F5F5F5" }}>
              <ThreadWord>For her.</ThreadWord>
            </p>
            <p className="italic" style={{ color: "#737373" }}>
              — Aaron
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 10: FINAL CTA */}
      <section ref={sectionRefs.finalCta} className="py-32 md:py-40 px-6" data-testid="section-final-cta" style={{ position: "relative" }}>
        <div className="thread-node" />
        <div className="thread-node-label">Interrupt</div>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="reveal text-3xl md:text-5xl font-bold mb-8" style={{ fontFamily: "'Playfair Display', serif" }} data-testid="text-final-cta-headline">
            Stop running the pattern.
          </h2>

          <p className="reveal reveal-delay-1 text-lg leading-relaxed mb-12" style={{ color: "#737373" }}>
            Take the 2-minute assessment.<br />
            Get your 7-day protocol.<br />
            Start breaking the cycle today.
          </p>

          <div className="reveal reveal-delay-2">
            <CTAButton text="TAKE THE FREE ASSESSMENT" />
          </div>

          <p className="reveal reveal-delay-3 mt-6 text-xs" style={{ color: "#737373", fontFamily: "'JetBrains Mono', monospace" }}>
            Free  ·  2 Minutes  ·  Instant Results
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <p className="text-sm leading-relaxed" style={{ color: "#737373" }}>
            Built in the fire. Years of observation. Systematized December 2025.
          </p>
          <p className="text-xs italic" style={{ color: "#525252" }}>
            — The Archivist
          </p>
          <div className="pt-6">
            <p className="text-xs" style={{ color: "#525252" }}>
              &copy; 2026 The Archivist Method&trade;. Pattern archaeology, <span style={{ color: "#EC4899" }}>not</span> therapy.
            </p>
          </div>
          <div className="flex justify-center gap-6 pt-2">
            <Link href="/terms" className="text-xs transition-colors" style={{ color: "#525252" }} data-testid="link-terms">Terms</Link>
            <Link href="/privacy" className="text-xs transition-colors" style={{ color: "#525252" }} data-testid="link-privacy">Privacy</Link>
            <Link href="/contact" className="text-xs transition-colors" style={{ color: "#525252" }} data-testid="link-contact">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
