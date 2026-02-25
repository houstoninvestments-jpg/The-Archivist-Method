import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ArrowRight, ArrowLeft, Play, Check } from 'lucide-react';
import { patternDisplayNames, type PatternKey } from '@/lib/quizData';

const FONT_HEADING = "'Schibsted Grotesk', sans-serif";
const FONT_BODY = "'Source Sans 3', sans-serif";
const FONT_MONO = "'JetBrains Mono', monospace";
const COLOR_TEAL = "#14B8A6";
const COLOR_PINK = "#EC4899";

const ALL_PATTERNS: { key: PatternKey; name: string }[] = Object.entries(patternDisplayNames).map(
  ([key, name]) => ({ key: key as PatternKey, name })
);

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-3" style={{ paddingTop: "32px", paddingBottom: "48px" }} data-testid="onboarding-progress">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center gap-3">
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: step <= current ? COLOR_TEAL : "#333",
              transition: "background 0.3s ease",
              boxShadow: step === current ? `0 0 8px ${COLOR_TEAL}` : "none",
            }}
            data-testid={`dot-step-${step}`}
          />
          {step < 3 && (
            <div style={{ width: "40px", height: "1px", background: step < current ? COLOR_TEAL : "#333", transition: "background 0.3s ease" }} />
          )}
        </div>
      ))}
      <p style={{ fontFamily: FONT_MONO, fontSize: "11px", color: "#666", marginLeft: "16px", letterSpacing: "0.1em" }}>
        STEP {current} OF 3
      </p>
    </div>
  );
}

function StepOne({
  storedPattern,
  onConfirm,
  onReselect,
}: {
  storedPattern: string | null;
  onConfirm: () => void;
  onReselect: () => void;
}) {
  const [selectedPattern, setSelectedPattern] = useState<PatternKey | "">("");
  const hasPattern = !!storedPattern;
  const displayName = storedPattern ? patternDisplayNames[storedPattern as PatternKey] || storedPattern : "";

  return (
    <div style={{ animation: "fadeInUp 0.5s ease-out" }}>
      <p style={{ fontFamily: FONT_MONO, fontSize: "11px", color: COLOR_TEAL, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "24px" }}>
        YOUR PATTERN
      </p>
      <h2 style={{ fontFamily: FONT_HEADING, fontWeight: 900, fontSize: "clamp(1.8rem, 5vw, 2.5rem)", color: "white", textTransform: "uppercase", lineHeight: 1.1, marginBottom: "16px" }} data-testid="text-step1-headline">
        First. Let's confirm your pattern.
      </h2>
      <p style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: "italic", fontSize: "1.1rem", color: COLOR_TEAL, lineHeight: 1.6, marginBottom: "48px", maxWidth: "480px" }} data-testid="text-step1-subhead">
        Everything in this system is built around one pattern. Yours.
      </p>

      {hasPattern ? (
        <div style={{ animation: "fadeInUp 0.4s ease-out 0.2s both" }}>
          <p style={{ fontFamily: FONT_BODY, fontSize: "0.95rem", color: "#999", marginBottom: "12px" }}>Your identified pattern:</p>
          <div style={{
            background: "#111",
            borderRadius: "12px",
            padding: "24px 28px",
            marginBottom: "32px",
          }}>
            <p style={{ fontFamily: FONT_HEADING, fontWeight: 900, fontSize: "1.5rem", color: "white", textTransform: "uppercase" }} data-testid="text-stored-pattern">
              {displayName}
            </p>
          </div>
          <button
            onClick={onConfirm}
            style={{
              background: COLOR_TEAL,
              color: "black",
              border: "none",
              borderRadius: "8px",
              padding: "14px 32px",
              fontFamily: FONT_MONO,
              fontSize: "0.85rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              cursor: "pointer",
              textTransform: "uppercase",
              width: "100%",
              maxWidth: "360px",
            }}
            data-testid="button-confirm-pattern"
          >
            Yes, this is mine
          </button>
          <p
            onClick={onReselect}
            style={{
              fontFamily: FONT_BODY,
              fontSize: "13px",
              color: "#666",
              marginTop: "16px",
              cursor: "pointer",
              textDecoration: "underline",
              textUnderlineOffset: "4px",
            }}
            data-testid="link-reselect-pattern"
          >
            This isn't right — let me reselect
          </p>
        </div>
      ) : (
        <PatternSelector
          selected={selectedPattern}
          onSelect={setSelectedPattern}
          onConfirm={() => {
            if (selectedPattern) onConfirm();
          }}
          selectedPattern={selectedPattern}
        />
      )}
    </div>
  );
}

function PatternSelector({
  selected,
  onSelect,
  onConfirm,
  selectedPattern,
}: {
  selected: PatternKey | "";
  onSelect: (p: PatternKey) => void;
  onConfirm: () => void;
  selectedPattern: PatternKey | "";
}) {
  return (
    <div style={{ animation: "fadeInUp 0.4s ease-out 0.2s both" }}>
      <p style={{ fontFamily: FONT_BODY, fontSize: "0.95rem", color: "#999", marginBottom: "20px" }}>
        Select your primary pattern to continue
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: "10px", marginBottom: "32px" }}>
        {ALL_PATTERNS.map(({ key, name }) => (
          <button
            key={key}
            onClick={() => onSelect(key)}
            style={{
              background: selected === key ? "rgba(20,184,166,0.15)" : "#111",
              border: selected === key ? `1px solid ${COLOR_TEAL}` : "1px solid #1a1a1a",
              borderRadius: "10px",
              padding: "14px 16px",
              fontFamily: FONT_BODY,
              fontSize: "0.9rem",
              color: selected === key ? COLOR_TEAL : "#ccc",
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.2s ease",
            }}
            data-testid={`button-pattern-${key}`}
          >
            {name}
          </button>
        ))}
      </div>
      <button
        onClick={onConfirm}
        disabled={!selectedPattern}
        style={{
          background: selectedPattern ? COLOR_TEAL : "#333",
          color: selectedPattern ? "black" : "#666",
          border: "none",
          borderRadius: "8px",
          padding: "14px 32px",
          fontFamily: FONT_MONO,
          fontSize: "0.85rem",
          fontWeight: 700,
          letterSpacing: "0.1em",
          cursor: selectedPattern ? "pointer" : "not-allowed",
          textTransform: "uppercase",
          width: "100%",
          maxWidth: "360px",
          transition: "all 0.2s ease",
        }}
        data-testid="button-select-pattern"
      >
        This Is My Pattern <ArrowRight className="inline w-3 h-3 ml-1" />
      </button>
    </div>
  );
}

function StepTwo({ onNext }: { onNext: () => void }) {
  return (
    <div style={{ animation: "fadeInUp 0.5s ease-out" }}>
      <p style={{ fontFamily: FONT_MONO, fontSize: "11px", color: COLOR_TEAL, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "24px" }}>
        60 SECOND BRIEF
      </p>
      <h2 style={{ fontFamily: FONT_HEADING, fontWeight: 900, fontSize: "clamp(1.8rem, 5vw, 2.5rem)", color: "white", textTransform: "uppercase", lineHeight: 1.1, marginBottom: "16px" }} data-testid="text-step2-headline">
        Before you begin. Watch this.
      </h2>
      <p style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: "italic", fontSize: "1.1rem", color: COLOR_TEAL, lineHeight: 1.6, marginBottom: "48px", maxWidth: "480px" }} data-testid="text-step2-subhead">
        60 seconds. This is the only orientation you need.
      </p>

      <div
        style={{
          background: "#111",
          borderRadius: "12px",
          width: "100%",
          aspectRatio: "16/9",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "32px",
          position: "relative",
          overflow: "hidden",
        }}
        data-testid="video-placeholder"
      >
        <div style={{
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          background: "rgba(20,184,166,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "20px",
          border: `2px solid ${COLOR_TEAL}`,
        }}>
          <Play size={28} style={{ color: COLOR_TEAL, marginLeft: "4px" }} />
        </div>
        <p style={{ fontFamily: FONT_MONO, fontSize: "12px", color: COLOR_TEAL, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Video coming soon
        </p>
        <p style={{ fontFamily: FONT_BODY, fontSize: "13px", color: "#666", marginTop: "8px" }}>
          Check back shortly
        </p>
      </div>

      <button
        onClick={onNext}
        style={{
          background: COLOR_TEAL,
          color: "black",
          border: "none",
          borderRadius: "8px",
          padding: "14px 32px",
          fontFamily: FONT_MONO,
          fontSize: "0.85rem",
          fontWeight: 700,
          letterSpacing: "0.1em",
          cursor: "pointer",
          textTransform: "uppercase",
          width: "100%",
          maxWidth: "360px",
        }}
        data-testid="button-watched-video"
      >
        I watched it. Let's go. <ArrowRight className="inline w-3 h-3 ml-1" />
      </button>
      <p style={{ fontFamily: FONT_BODY, fontSize: "12px", color: "#555", marginTop: "12px" }}>
        You can rewatch this anytime in your settings.
      </p>
    </div>
  );
}

function StepThree({ onComplete }: { onComplete: () => void }) {
  const [demoStep, setDemoStep] = useState<1 | 2 | 3 | 'done'>(1);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const [aiResponses, setAiResponses] = useState<string[]>([]);
  const [history, setHistory] = useState<Array<{role: string; content: string}>>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const prompts: Record<number, string> = {
    1: "Think about the last time your pattern ran. What did your body feel right before it happened? — chest, throat, stomach, hands. Just describe the sensation.",
    2: "Now go one layer deeper. Where does that sensation live in your body — and how long has it been living there?",
    3: "Last one. When that signal fires, what do you usually do in the first 3 seconds?",
  };

  const handleSubmit = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    const currentStep = demoStep as number;
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
      if (currentStep === 1) setDemoStep(2);
      else if (currentStep === 2) setDemoStep(3);
      else if (currentStep === 3) setDemoStep('done');
    } catch {
      setAiResponses(prev => [...prev, "Signal received. Your archive is mapping."]);
      if (currentStep === 1) setDemoStep(2);
      else if (currentStep === 2) setDemoStep(3);
      else if (currentStep === 3) setDemoStep('done');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ animation: "fadeInUp 0.5s ease-out" }} ref={containerRef}>
      <p style={{ fontFamily: FONT_MONO, fontSize: "11px", color: COLOR_TEAL, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "24px" }}>
        FIRST SIGNAL
      </p>
      <h2 style={{ fontFamily: FONT_HEADING, fontWeight: 900, fontSize: "clamp(1.8rem, 5vw, 2.5rem)", color: "white", textTransform: "uppercase", lineHeight: 1.1, marginBottom: "16px" }} data-testid="text-step3-headline">
        Now. Meet your signal.
      </h2>
      <p style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: "italic", fontSize: "1.1rem", color: COLOR_TEAL, lineHeight: 1.6, marginBottom: "48px", maxWidth: "520px" }} data-testid="text-step3-subhead">
        The Pocket Archivist is going to map your body signal. This takes 2 minutes and it's the most important thing you'll do today.
      </p>

      {demoStep === 'done' ? (
        <div style={{ animation: "fadeInUp 0.6s ease-out" }}>
          {aiResponses[aiResponses.length - 1] && (
            <div style={{
              fontFamily: FONT_BODY,
              fontSize: "1.05rem",
              color: "#ccc",
              lineHeight: 1.7,
              borderLeft: `2px solid ${COLOR_TEAL}`,
              paddingLeft: "20px",
              marginBottom: "48px",
              textAlign: "left",
            }} data-testid="text-ai-final-response">
              {aiResponses[aiResponses.length - 1]}
            </div>
          )}

          <div style={{
            background: "#111",
            borderRadius: "12px",
            padding: "32px",
            marginBottom: "32px",
            textAlign: "center",
          }}>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "rgba(20,184,166,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              border: `2px solid ${COLOR_TEAL}`,
            }}>
              <Check size={24} style={{ color: COLOR_TEAL }} />
            </div>
            <h3 style={{ fontFamily: FONT_HEADING, fontWeight: 900, fontSize: "1.3rem", color: "white", textTransform: "uppercase", marginBottom: "8px" }} data-testid="text-signal-mapped">
              Your signal is mapped.
            </h3>
            <p style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: "italic", fontSize: "1rem", color: COLOR_TEAL }}>
              Your archive is open.
            </p>
          </div>

          <button
            onClick={onComplete}
            style={{
              background: COLOR_TEAL,
              color: "black",
              border: "none",
              borderRadius: "8px",
              padding: "14px 32px",
              fontFamily: FONT_MONO,
              fontSize: "0.85rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              cursor: "pointer",
              textTransform: "uppercase",
              width: "100%",
              maxWidth: "360px",
            }}
            data-testid="button-start-day1"
          >
            Start Day 1 <ArrowRight className="inline w-3 h-3 ml-1" />
          </button>
        </div>
      ) : (
        <div>
          {aiResponses.map((resp, i) => (
            <div key={i} style={{
              fontFamily: FONT_BODY,
              fontSize: "1rem",
              color: "#ccc",
              lineHeight: 1.7,
              borderLeft: `2px solid ${COLOR_TEAL}`,
              paddingLeft: "20px",
              marginBottom: "24px",
              animation: "fadeInUp 0.4s ease-out",
            }}>
              {resp}
            </div>
          ))}

          <p style={{ fontFamily: FONT_BODY, fontSize: "1.05rem", color: "white", lineHeight: 1.7, marginBottom: "24px" }}>
            {prompts[demoStep as number]}
          </p>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
            placeholder="Type your response..."
            style={{
              width: "100%",
              background: "#111",
              border: "1px solid #1a1a1a",
              borderRadius: "12px",
              color: "white",
              fontFamily: FONT_BODY,
              fontSize: "1rem",
              padding: "16px",
              resize: "none",
              outline: "none",
              minHeight: "80px",
              marginBottom: "16px",
            }}
            disabled={loading}
            data-testid="input-archivist-demo"
          />

          <button
            onClick={handleSubmit}
            disabled={loading || !input.trim()}
            style={{
              background: loading || !input.trim() ? "#333" : COLOR_TEAL,
              color: loading || !input.trim() ? "#666" : "black",
              border: "none",
              borderRadius: "8px",
              padding: "12px 24px",
              fontFamily: FONT_MONO,
              fontSize: "0.8rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              cursor: loading || !input.trim() ? "not-allowed" : "pointer",
              textTransform: "uppercase",
              transition: "all 0.2s ease",
            }}
            data-testid="button-submit-response"
          >
            {loading ? "READING SIGNAL..." : "SUBMIT"}
          </button>

          <div style={{ marginTop: "16px" }}>
            <p style={{ fontFamily: FONT_MONO, fontSize: "11px", color: "#555" }}>
              Question {demoStep as number} of 3
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PortalOnboarding() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [storedPattern, setStoredPattern] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSelector, setShowSelector] = useState(false);
  const [selectedNewPattern, setSelectedNewPattern] = useState<PatternKey | "">("");

  useEffect(() => {
    fetch('/api/portal/onboarding-status', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.completed) {
          setLocation('/portal');
          return;
        }
        setStoredPattern(data.primaryPattern || null);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [setLocation]);

  const handlePatternConfirm = async () => {
    if (showSelector && selectedNewPattern) {
      await fetch('/api/portal/onboarding-update-pattern', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ pattern: selectedNewPattern }),
      });
      setStoredPattern(selectedNewPattern);
      setShowSelector(false);
    }
    setStep(2);
  };

  const handleComplete = async () => {
    await fetch('/api/portal/onboarding-complete', {
      method: 'POST',
      credentials: 'include',
    });
    setLocation('/portal');
  };

  if (isLoading) {
    return (
      <div style={{ background: "#0A0A0A", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: "13px", color: COLOR_TEAL, letterSpacing: "0.1em", animation: "pulse 1.5s ease infinite" }}>
          INITIALIZING ARCHIVE...
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#0A0A0A", minHeight: "100vh", color: "white" }}>
      <StepIndicator current={step} />

      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "0 24px 80px" }}>
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            style={{
              background: "none",
              border: "none",
              color: "#666",
              fontFamily: FONT_MONO,
              fontSize: "12px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              marginBottom: "32px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#999")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#666")}
            data-testid="button-back"
          >
            <ArrowLeft size={14} /> Back
          </button>
        )}

        {step === 1 && (
          <>
            {showSelector ? (
              <div style={{ animation: "fadeInUp 0.5s ease-out" }}>
                <p style={{ fontFamily: FONT_MONO, fontSize: "11px", color: COLOR_TEAL, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "24px" }}>
                  YOUR PATTERN
                </p>
                <h2 style={{ fontFamily: FONT_HEADING, fontWeight: 900, fontSize: "clamp(1.8rem, 5vw, 2.5rem)", color: "white", textTransform: "uppercase", lineHeight: 1.1, marginBottom: "16px" }}>
                  Select your pattern.
                </h2>
                <p style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: "italic", fontSize: "1.1rem", color: COLOR_TEAL, lineHeight: 1.6, marginBottom: "48px", maxWidth: "480px" }}>
                  Choose the one that runs most often.
                </p>
                <PatternSelector
                  selected={selectedNewPattern}
                  onSelect={setSelectedNewPattern}
                  onConfirm={handlePatternConfirm}
                  selectedPattern={selectedNewPattern}
                />
              </div>
            ) : storedPattern ? (
              <StepOne
                storedPattern={storedPattern}
                onConfirm={handlePatternConfirm}
                onReselect={() => setShowSelector(true)}
              />
            ) : (
              <div style={{ animation: "fadeInUp 0.5s ease-out" }}>
                <p style={{ fontFamily: FONT_MONO, fontSize: "11px", color: COLOR_TEAL, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "24px" }}>
                  YOUR PATTERN
                </p>
                <h2 style={{ fontFamily: FONT_HEADING, fontWeight: 900, fontSize: "clamp(1.8rem, 5vw, 2.5rem)", color: "white", textTransform: "uppercase", lineHeight: 1.1, marginBottom: "16px" }} data-testid="text-step1-headline">
                  First. Let's confirm your pattern.
                </h2>
                <p style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: "italic", fontSize: "1.1rem", color: COLOR_TEAL, lineHeight: 1.6, marginBottom: "48px", maxWidth: "480px" }}>
                  Everything in this system is built around one pattern. Yours.
                </p>
                <PatternSelector
                  selected={selectedNewPattern}
                  onSelect={setSelectedNewPattern}
                  onConfirm={async () => {
                    if (selectedNewPattern) {
                      await fetch('/api/portal/onboarding-update-pattern', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({ pattern: selectedNewPattern }),
                      });
                      setStoredPattern(selectedNewPattern);
                      setStep(2);
                    }
                  }}
                  selectedPattern={selectedNewPattern}
                />
              </div>
            )}
          </>
        )}

        {step === 2 && <StepTwo onNext={() => setStep(3)} />}
        {step === 3 && <StepThree onComplete={handleComplete} />}
      </div>
    </div>
  );
}
