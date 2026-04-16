import { useEffect, useRef, useState } from "react";
import { X, Send } from "lucide-react";
import type { PatternDetail } from "./patterns";

const SUGGESTION_PROMPTS = [
  "What's happening right now?",
  "I just ran my pattern",
  "Help me map the circuit",
  "What's the 3-7 second window?",
];

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ArchivistPanelProps {
  open: boolean;
  onClose: () => void;
  pattern: PatternDetail;
  patternKey: string | null;
  tier: string;
}

// Persistent Archivist chat panel. Desktop: collapsible right panel, built into
// the portal layout via portal-archivist-panel CSS. Mobile: full-screen overlay.
// Mounted at all times so conversation state persists across chapter navigation.
export function ArchivistPanel({ open, onClose, pattern, patternKey, tier }: ArchivistPanelProps) {
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

  const panelContent = (
    <div
      role="dialog"
      aria-label="Pocket Archivist"
      style={{
        width: "100%",
        height: "100%",
        background: "#0B0D10",
        borderLeft: "1px solid #1C1A24",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div style={{ padding: "20px 22px", borderBottom: "1px solid #1C1A24", display: "flex", alignItems: "center", gap: 14, justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
          {/* Archivist face avatar — crops to the face area of the seated image
              with a breathing teal glow ring to suggest a real presence. */}
          <div
            aria-hidden="true"
            className="portal-archivist-avatar"
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              flexShrink: 0,
              overflow: "hidden",
              position: "relative",
              border: "1px solid rgba(0,255,194,0.4)",
            }}
          >
            <img
              src="/hero-archivist-seated.webp"
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                // Pull the crop toward the Archivist's face (upper portion of the scene).
                objectPosition: "50% 22%",
                // Scale up so the face fills the circle without peripheral detail.
                transform: "scale(2.1)",
                transformOrigin: "50% 28%",
                filter: "saturate(1.05) contrast(1.05)",
              }}
            />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.22em", color: "#00FFC2", fontWeight: 500 }}>
              POCKET ARCHIVIST
            </div>
            <div style={{ fontFamily: "'EB Garamond', serif", fontStyle: "italic", fontSize: 13, color: "#8A857D", marginTop: 4 }}>
              Real-time pattern interruption
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{ background: "transparent", border: "1px solid #2A2830", color: "#9A958D", padding: 8, borderRadius: 4, cursor: "pointer", flexShrink: 0 }}
        >
          <X size={14} />
        </button>
      </div>
      <style>{`
        @keyframes archivist-breathe {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(0,255,194,0.35), 0 0 10px 1px rgba(0,255,194,0.15) inset;
          }
          50% {
            box-shadow: 0 0 0 4px rgba(0,255,194,0.08), 0 0 14px 2px rgba(0,255,194,0.35) inset;
          }
        }
        .portal-archivist-avatar {
          animation: archivist-breathe 3s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .portal-archivist-avatar { animation: none; }
        }
      `}</style>

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
        style={{ padding: "16px 18px", borderTop: "1px solid #1C1A24", display: "flex", gap: 10, alignItems: "center", flexShrink: 0 }}
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

  // Single rendered panel. CSS in Portal.tsx sets position/width responsively:
  //   desktop: fixed right, width 300px, transform for open/close
  //   mobile: full-screen overlay when open, hidden otherwise
  return (
    <div
      className={`portal-archivist ${open ? "portal-archivist-open" : ""}`}
      aria-hidden={!open}
    >
      {panelContent}
    </div>
  );
}
