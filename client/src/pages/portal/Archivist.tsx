import { useEffect, useRef, useState } from "react";
import { X, Send } from "lucide-react";
import type { PatternDetail } from "./patterns";

const ARCHIVIST_AVATAR = "/hero-archivist-seated.webp";

const ROTATING_PROMPTS = [
  "Pattern running?",
  "Log an interrupt",
  "Map the circuit",
  "What happened?",
  "Need help?",
];

const SUGGESTION_PROMPTS = [
  "What's happening right now?",
  "I just ran my pattern",
  "Help me map the circuit",
  "What's the 3-7 second window?",
];

interface PresenceCardProps {
  onOpen: () => void;
  hidden: boolean;
}

export function PresenceCard({ onOpen, hidden }: PresenceCardProps) {
  const [promptIdx, setPromptIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setPromptIdx((i) => (i + 1) % ROTATING_PROMPTS.length), 3500);
    return () => clearInterval(t);
  }, []);
  if (hidden) return null;
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="Open Pocket Archivist"
      style={{
        position: "fixed",
        right: 24,
        bottom: 24,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 16px 10px 10px",
        background: "rgba(11, 13, 16, 0.78)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(0,255,194,0.22)",
        borderRadius: 999,
        cursor: "pointer",
        boxShadow: "0 12px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,255,194,0.04) inset",
        transition: "border-color 0.2s, transform 0.2s",
        fontFamily: "inherit",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(0,255,194,0.45)")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(0,255,194,0.22)")}
    >
      <span
        style={{
          position: "relative",
          width: 36,
          height: 36,
          borderRadius: "50%",
          overflow: "hidden",
          flexShrink: 0,
          background: "#1A1820",
          border: "1px solid rgba(0,255,194,0.3)",
          boxShadow: "0 0 0 0 rgba(0,255,194,0.3)",
          animation: "archivistBreath 3s ease-in-out infinite",
        }}
      >
        <img
          src={ARCHIVIST_AVATAR}
          alt=""
          style={{
            width: "240%",
            height: "240%",
            objectFit: "cover",
            objectPosition: "50% 22%",
            position: "absolute",
            left: "-70%",
            top: "-60%",
            filter: "contrast(1.05) saturate(0.9)",
          }}
          onError={(e) => ((e.currentTarget.style.display = "none"))}
        />
      </span>
      <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", lineHeight: 1.1 }}>
        <span
          style={{
            fontFamily: "'EB Garamond', serif",
            fontStyle: "italic",
            fontSize: 14,
            color: "#E8E3DC",
            transition: "opacity 0.3s",
          }}
        >
          {ROTATING_PROMPTS[promptIdx]}
        </span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 7, letterSpacing: "0.26em", color: "#00FFC2", marginTop: 3, fontWeight: 500 }}>
          POCKET ARCHIVIST
        </span>
      </span>
    </button>
  );
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatPanelProps {
  open: boolean;
  onClose: () => void;
  pattern: PatternDetail;
  patternKey: string | null;
  tier: string;
}

export function ChatPanel({ open, onClose, pattern, patternKey, tier }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: `I'm here. You're working ${pattern.name.toLowerCase()}. Tell me what's happening — or pick one below to start.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setSending(true);
    setShowSuggestions(false);
    setMessages((m) => [...m, { role: "user", content: trimmed }]);
    setInput("");
    try {
      const res = await fetch("/api/portal/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message: trimmed, pattern: patternKey || undefined, tier }),
      });
      if (res.status === 403) {
        setMessages((m) => [...m, { role: "assistant", content: "The Pocket Archivist is part of the Field Guide and Complete Archive." }]);
      } else if (!res.ok) {
        setMessages((m) => [...m, { role: "assistant", content: "Connection disrupted. Try again." }]);
      } else {
        const data = await res.json();
        setMessages((m) => [...m, { role: "assistant", content: data.message || "..." }]);
      }
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Connection disrupted. Try again." }]);
    } finally {
      setSending(false);
    }
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label="Pocket Archivist"
      style={{
        position: "fixed",
        right: 0,
        top: 0,
        bottom: 0,
        width: "min(420px, 100vw)",
        background: "#0B0D10",
        borderLeft: "1px solid #1C1A24",
        zIndex: 80,
        display: "flex",
        flexDirection: "column",
        boxShadow: "-24px 0 48px rgba(0,0,0,0.5)",
        animation: "archivistSlideIn 0.28s ease-out",
      }}
    >
      {/* Header */}
      <div style={{ padding: "20px 22px", borderBottom: "1px solid #1C1A24", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.22em", color: "#00FFC2", fontWeight: 500 }}>
            POCKET ARCHIVIST
          </div>
          <div style={{ fontFamily: "'EB Garamond', serif", fontStyle: "italic", fontSize: 13, color: "#8A857D", marginTop: 4 }}>
            Real-time pattern interruption
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{ background: "transparent", border: "1px solid #2A2830", color: "#9A958D", padding: 8, borderRadius: 4, cursor: "pointer" }}
        >
          <X size={14} />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "22px" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 16 }}>
            {m.role === "assistant" ? (
              <div style={{ padding: "14px 16px", background: "#141218", border: "1px solid #2A2228", borderRadius: 6 }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "0.22em", color: "#D4A574", fontWeight: 500, marginBottom: 8 }}>
                  THE ARCHIVIST
                </div>
                <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 16, lineHeight: 1.55, color: "#E8E3DC" }}>
                  {m.content}
                </div>
              </div>
            ) : (
              <div style={{ padding: "12px 14px", background: "rgba(0,255,194,0.06)", borderRadius: 6, border: "1px solid rgba(0,255,194,0.12)" }}>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, lineHeight: 1.55, color: "#D8D3CC" }}>
                  {m.content}
                </div>
              </div>
            )}
          </div>
        ))}

        {showSuggestions && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
            {SUGGESTION_PROMPTS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => send(p)}
                style={{
                  textAlign: "left",
                  padding: "10px 14px",
                  background: "transparent",
                  border: "1px solid #2A2830",
                  borderRadius: 999,
                  color: "#C8C0B2",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 13,
                  cursor: "pointer",
                  transition: "border-color 0.15s, background 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#D4A574";
                  e.currentTarget.style.background = "rgba(212,165,116,0.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#2A2830";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {sending && (
          <div style={{ padding: "10px 14px", color: "#5A5550", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.2em" }}>
            ARCHIVIST IS WRITING...
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        style={{ padding: "16px 18px", borderTop: "1px solid #1C1A24", display: "flex", gap: 10, alignItems: "center" }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tell the Archivist..."
          disabled={sending}
          style={{
            flex: 1,
            padding: "12px 14px",
            background: "#141218",
            border: "1px solid #2A2228",
            borderRadius: 6,
            color: "#F0EDE8",
            fontFamily: "'Inter', sans-serif",
            fontSize: 14,
            outline: "none",
          }}
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          style={{
            padding: "12px 14px",
            background: "rgba(0,255,194,0.12)",
            border: "1px solid rgba(0,255,194,0.4)",
            borderRadius: 6,
            color: "#00FFC2",
            cursor: sending || !input.trim() ? "not-allowed" : "pointer",
            opacity: sending || !input.trim() ? 0.5 : 1,
          }}
          aria-label="Send"
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}

interface InterruptButtonProps {
  onOpen: () => void;
  hidden: boolean;
}

export function InterruptButton({ onOpen, hidden }: InterruptButtonProps) {
  if (hidden) return null;
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="Interrupt pattern"
      style={{
        position: "fixed",
        right: 24,
        bottom: 76,
        zIndex: 49,
        width: 40,
        height: 40,
        borderRadius: "50%",
        background: "rgba(236,72,153,0.12)",
        border: "1.5px solid #EC4899",
        color: "#EC4899",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10,
        letterSpacing: "0.15em",
        fontWeight: 600,
        animation: "interruptPulse 2.6s ease-in-out infinite",
        boxShadow: "0 8px 20px rgba(236,72,153,0.25)",
      }}
    >
      !
    </button>
  );
}

interface InterruptScreenProps {
  open: boolean;
  onClose: () => void;
  onOpenChat: () => void;
  pattern: PatternDetail;
}

export function InterruptScreen({ open, onClose, onOpenChat, pattern }: InterruptScreenProps) {
  const [logging, setLogging] = useState(false);

  const handleInterrupted = async () => {
    if (logging) return;
    setLogging(true);
    try {
      await fetch("/api/portal/interrupt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({}),
      });
    } catch {
      // non-blocking
    } finally {
      setLogging(false);
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label="Pattern interrupt"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 90,
        background: "#050608",
        overflowY: "auto",
        animation: "fadeIn 0.25s ease-out",
      }}
    >
      {/* Library background */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url(/hero-archivist-seated.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.07,
          filter: "blur(2px)",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, rgba(5,6,8,0.55) 0%, rgba(5,6,8,0.92) 70%, #050608 100%)",
        }}
      />

      <div style={{ position: "relative", maxWidth: 620, margin: "0 auto", padding: "72px 28px 40px", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{ position: "absolute", top: 20, right: 20, background: "transparent", border: "1px solid #2A2830", color: "#9A958D", padding: 8, borderRadius: 4, cursor: "pointer" }}
        >
          <X size={14} />
        </button>

        {/* Gothic arch */}
        <svg aria-hidden="true" viewBox="0 0 200 60" style={{ width: 120, height: 40, opacity: 0.18, marginBottom: 24 }}>
          <path d="M20,60 L20,32 Q20,6 100,6 Q180,6 180,32 L180,60" stroke="#EC4899" strokeWidth="1" fill="none" />
          <path d="M50,60 L50,38 Q50,18 100,18 Q150,18 150,38 L150,60" stroke="#EC4899" strokeWidth="0.6" fill="none" />
        </svg>

        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.28em", color: "#EC4899", marginBottom: 14, fontWeight: 500 }}>
          // PATTERN DETECTED
        </div>

        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 48, letterSpacing: "0.04em", color: "#F0EDE8", textAlign: "center", lineHeight: 1.05, marginBottom: 40 }}>
          THE PATTERN IS RUNNING.
        </h1>

        <div style={{ width: "100%", marginBottom: 28 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "0.26em", color: "#D4A574", marginBottom: 10, fontWeight: 500 }}>
            // YOUR BODY SIGNATURE
          </div>
          <div style={{ fontFamily: "'EB Garamond', serif", fontStyle: "italic", fontSize: 19, lineHeight: 1.5, color: "#E8E3DC" }}>
            {pattern.bodySignature}
          </div>
        </div>

        <div style={{ width: "100%", marginBottom: 28, padding: "22px 24px", borderLeft: "3px solid #EC4899", background: "rgba(236,72,153,0.05)", borderRadius: "0 6px 6px 0" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "0.26em", color: "#EC4899", marginBottom: 10, fontWeight: 500 }}>
            // CIRCUIT BREAK
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, lineHeight: 1.6, color: "#F0EDE8" }}>
            {pattern.circuitBreak}
          </div>
        </div>

        <div style={{ fontFamily: "'EB Garamond', serif", fontStyle: "italic", fontSize: 16, color: "#9A958D", marginBottom: 32, textAlign: "center" }}>
          Say it out loud.
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", width: "100%", justifyContent: "center" }}>
          <button
            type="button"
            onClick={() => { onClose(); onOpenChat(); }}
            style={{
              padding: "14px 22px",
              background: "transparent",
              border: "1px solid #00FFC2",
              color: "#00FFC2",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              letterSpacing: "0.2em",
              fontWeight: 500,
              borderRadius: 4,
              cursor: "pointer",
              textTransform: "uppercase",
            }}
          >
            Talk to Archivist
          </button>
          <button
            type="button"
            onClick={handleInterrupted}
            disabled={logging}
            style={{
              padding: "14px 22px",
              background: "#EC4899",
              border: "1px solid #EC4899",
              color: "#0A0A0A",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              letterSpacing: "0.2em",
              fontWeight: 700,
              borderRadius: 4,
              cursor: logging ? "not-allowed" : "pointer",
              textTransform: "uppercase",
              opacity: logging ? 0.7 : 1,
            }}
          >
            I Interrupted It
          </button>
        </div>
      </div>
    </div>
  );
}
