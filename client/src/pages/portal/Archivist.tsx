import { useCallback, useEffect, useRef, useState } from "react";
import { X, Send, Mic, Lightbulb, LightbulbOff } from "lucide-react";
import type { PatternDetail } from "./patterns";
import { RequireTier } from "@/components/RequireTier";

const SUGGESTION_PROMPTS = [
  "What's happening right now?",
  "I just ran my pattern",
  "Help me map the circuit",
  "What's the 3-7 second window?",
];

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
  speaking?: boolean;
}

interface ArchivistPanelProps {
  open: boolean;
  onClose: () => void;
  pattern: PatternDetail;
  patternKey: string | null;
  tier: string;
}

// Web Speech API minimal typing (not in lib.dom).
type Rec = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((e: any) => void) | null;
  onerror: ((e: any) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

function getSpeechRecognition(): { new (): Rec } | null {
  const w = window as any;
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

// Gentle ~400ms volume ramp so audio never starts abruptly.
function fadeVolume(audio: HTMLAudioElement, to: number, ms: number): Promise<void> {
  return new Promise((resolve) => {
    const from = audio.volume;
    const start = performance.now();
    const tick = () => {
      const t = Math.min(1, (performance.now() - start) / ms);
      audio.volume = from + (to - from) * t;
      if (t < 1) requestAnimationFrame(tick);
      else resolve();
    };
    tick();
  });
}

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
  const [muted, setMuted] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  // voiceEngaged = user has started using their voice at least once, or audio
  // is currently playing. Used to decide when to auto-reactivate the mic after
  // audio ends (continuous conversation rhythm) and when to fade the ambient
  // room tone in.
  const [voiceEngaged, setVoiceEngaged] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<Rec | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ambientRef = useRef<HTMLAudioElement | null>(null);
  const autoSendTimerRef = useRef<number | null>(null);
  const mutedRef = useRef(muted);
  const voiceEngagedRef = useRef(voiceEngaged);
  mutedRef.current = muted;
  voiceEngagedRef.current = voiceEngaged;

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open]);

  // Typewriter: animate the already-received reply char-by-char so the reader
  // has time to absorb it before the voice comes in over the top.
  const streamAssistantText = useCallback(
    (full: string) =>
      new Promise<void>((resolve) => {
        setMessages((m) => [...m, { role: "assistant", content: "", streaming: true }]);
        let i = 0;
        // ~22ms/char → feels considered, not mechanical.
        const step = () => {
          i += 1;
          setMessages((m) => {
            const next = m.slice();
            const last = next[next.length - 1];
            if (last && last.role === "assistant") {
              next[next.length - 1] = { ...last, content: full.slice(0, i) };
            }
            return next;
          });
          if (i < full.length) {
            window.setTimeout(step, 22);
          } else {
            setMessages((m) => {
              const next = m.slice();
              const last = next[next.length - 1];
              if (last && last.role === "assistant") {
                next[next.length - 1] = { ...last, streaming: false };
              }
              return next;
            });
            resolve();
          }
        };
        step();
      }),
    [],
  );

  // Request TTS audio, fade it in, and dim the last message while it plays.
  const playVoice = useCallback(async (text: string) => {
    if (mutedRef.current) return;
    try {
      const res = await fetch("/api/portal/voice/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ text }),
      });
      if (!res.ok) return;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      const audio = new Audio(url);
      audio.volume = 0;
      audioRef.current = audio;

      setSpeaking(true);
      setVoiceEngaged(true);
      setMessages((m) => {
        const next = m.slice();
        const last = next[next.length - 1];
        if (last && last.role === "assistant") {
          next[next.length - 1] = { ...last, speaking: true };
        }
        return next;
      });

      const cleanup = () => {
        URL.revokeObjectURL(url);
        setSpeaking(false);
        setMessages((m) => {
          const next = m.slice();
          const last = next[next.length - 1];
          if (last && last.role === "assistant") {
            next[next.length - 1] = { ...last, speaking: false };
          }
          return next;
        });
      };

      audio.addEventListener("ended", () => {
        cleanup();
        // Continuous conversation: if the user was using voice, hand the mic
        // back automatically so they can just keep talking.
        if (voiceEngagedRef.current && !mutedRef.current) {
          window.setTimeout(() => startListening(), 250);
        }
      });
      audio.addEventListener("error", cleanup);

      await audio.play().catch(() => {});
      fadeVolume(audio, 1, 420);
    } catch {
      /* voice is enhancement — silent failure is fine */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const send = useCallback(
    async (text: string, fromVoice = false) => {
      const trimmed = text.trim();
      if (!trimmed || sending) return;
      setSending(true);
      setShowSuggestions(false);
      setMessages((m) => [...m, { role: "user", content: trimmed }]);
      setInput("");
      if (fromVoice) setVoiceEngaged(true);
      try {
        const res = await fetch("/api/portal/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ message: trimmed, pattern: patternKey || undefined, tier }),
        });
        if (res.status === 403) {
          await streamAssistantText("The Pocket Archivist is part of the Field Guide and Complete Archive.");
        } else if (!res.ok) {
          await streamAssistantText("Connection disrupted. Try again.");
        } else {
          const data = await res.json();
          const reply = data.message || "...";
          await streamAssistantText(reply);
          // Audio strictly after the text has finished streaming.
          void playVoice(reply);
        }
      } catch {
        await streamAssistantText("Connection disrupted. Try again.");
      } finally {
        setSending(false);
      }
    },
    [patternKey, sending, streamAssistantText, playVoice, tier],
  );

  const startListening = useCallback(() => {
    if (listening || sending) return;
    const SR = getSpeechRecognition();
    if (!SR) return; // Silent fallback — typing still works.
    try {
      // Stop any in-flight TTS so the user doesn't talk over the Archivist.
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
      }

      const rec = new SR();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = "en-US";

      let finalText = "";

      rec.onresult = (e: any) => {
        let interim = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const r = e.results[i];
          if (r.isFinal) finalText += r[0].transcript;
          else interim += r[0].transcript;
        }
        setInput((finalText + interim).trim());

        // Debounce an auto-send 1s after the last transcription event so the
        // user can pause mid-sentence without the mic cutting them off.
        if (autoSendTimerRef.current) window.clearTimeout(autoSendTimerRef.current);
        autoSendTimerRef.current = window.setTimeout(() => {
          try {
            rec.stop();
          } catch {
            /* ignore */
          }
        }, 1000);
      };

      rec.onerror = () => {
        setListening(false);
      };

      rec.onend = () => {
        setListening(false);
        recognitionRef.current = null;
        if (autoSendTimerRef.current) {
          window.clearTimeout(autoSendTimerRef.current);
          autoSendTimerRef.current = null;
        }
        const text = finalText.trim();
        if (text) {
          void send(text, true);
        }
      };

      recognitionRef.current = rec;
      setListening(true);
      setVoiceEngaged(true);
      rec.start();
    } catch {
      setListening(false);
    }
  }, [listening, sending, send]);

  const stopListening = useCallback(() => {
    const rec = recognitionRef.current;
    if (rec) {
      try {
        rec.stop();
      } catch {
        /* ignore */
      }
    }
  }, []);

  // Ambient room tone — fades in once voice is engaged, fades out on mute.
  // File lives at /public/room-tone.mp3. If it's missing, the element quietly
  // fails to load and nothing breaks.
  useEffect(() => {
    const shouldPlay = voiceEngaged && !muted;
    if (shouldPlay) {
      if (!ambientRef.current) {
        const a = new Audio("/room-tone.mp3");
        a.loop = true;
        a.volume = 0;
        ambientRef.current = a;
      }
      const a = ambientRef.current;
      a.play().catch(() => {});
      void fadeVolume(a, 0.08, 2400);
    } else if (ambientRef.current) {
      const a = ambientRef.current;
      void fadeVolume(a, 0, 900).then(() => {
        if (a.volume < 0.005) a.pause();
      });
    }
  }, [voiceEngaged, muted]);

  // When muted mid-playback, silence the current utterance too.
  useEffect(() => {
    if (muted && audioRef.current && !audioRef.current.paused) {
      void fadeVolume(audioRef.current, 0, 300).then(() => {
        audioRef.current?.pause();
        setSpeaking(false);
      });
    }
  }, [muted]);

  // Cleanup on unmount.
  useEffect(() => {
    return () => {
      if (audioRef.current) audioRef.current.pause();
      if (ambientRef.current) ambientRef.current.pause();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          /* ignore */
        }
      }
    };
  }, []);

  const hasMic = !!getSpeechRecognition();

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
        position: "relative",
      }}
    >
      {/* Dimming overlay while the user is speaking. Very subtle — just enough
          to tell them the room is listening. No pulse rings, no labels. */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: "#000",
          opacity: listening ? 0.18 : 0,
          transition: "opacity 280ms ease",
          pointerEvents: "none",
          zIndex: 5,
        }}
      />

      {/* Header */}
      <div style={{ padding: "20px 22px", borderBottom: "1px solid #1C1A24", display: "flex", alignItems: "center", gap: 14, justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
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
                objectPosition: "50% 22%",
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
          {/* Speaking waveform — four warm-gold bars next to the avatar. Minimal
              presence; appears only while TTS audio is playing. */}
          <div
            aria-hidden={!speaking}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              height: 18,
              opacity: speaking ? 1 : 0,
              transition: "opacity 320ms ease",
              marginLeft: 2,
            }}
          >
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="archivist-wave-bar"
                style={{
                  width: 2,
                  background: "#E1C378",
                  borderRadius: 1,
                  animationDelay: `${i * 0.12}s`,
                }}
              />
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {/* Lamp toggle — lit when voice is on, dim when muted. */}
          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            aria-label={muted ? "Turn voice on" : "Turn voice off"}
            aria-pressed={!muted}
            title={muted ? "Voice off" : "Voice on"}
            style={{
              background: "transparent",
              border: "1px solid #2A2830",
              color: muted ? "#5A5550" : "#E1C378",
              padding: 8,
              borderRadius: 4,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "color 240ms ease, box-shadow 240ms ease",
              boxShadow: muted ? "none" : "0 0 10px rgba(225,195,120,0.25)",
            }}
          >
            {muted ? <LightbulbOff size={14} /> : <Lightbulb size={14} />}
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{ background: "transparent", border: "1px solid #2A2830", color: "#9A958D", padding: 8, borderRadius: 4, cursor: "pointer", flexShrink: 0 }}
          >
            <X size={14} />
          </button>
        </div>
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
        @keyframes archivist-wave {
          0%, 100% { height: 3px; opacity: 0.55; }
          50% { height: 14px; opacity: 1; }
        }
        .archivist-wave-bar {
          animation: archivist-wave 1.1s ease-in-out infinite;
        }
        @keyframes archivist-listen-pulse {
          0%   { box-shadow: 0 0 0 0 rgba(225,195,120,0.32); }
          70%  { box-shadow: 0 0 0 10px rgba(225,195,120,0);  }
          100% { box-shadow: 0 0 0 0 rgba(225,195,120,0);     }
        }
        .archivist-mic-listening {
          animation: archivist-listen-pulse 2.2s ease-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .portal-archivist-avatar,
          .archivist-wave-bar,
          .archivist-mic-listening { animation: none; }
        }
      `}</style>

      {/* Messages */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "22px", position: "relative", zIndex: 6 }}>
        {messages.map((m, i) => {
          const isLast = i === messages.length - 1;
          // Dim the currently-speaking message so focus shifts from reading
          // to listening. Never dim user messages.
          const dim = m.role === "assistant" && isLast && m.speaking;
          return (
            <div key={i} style={{ marginBottom: 16 }}>
              {m.role === "assistant" ? (
                <div
                  style={{
                    padding: "14px 16px",
                    background: "#141218",
                    border: "1px solid #2A2228",
                    borderRadius: 6,
                    opacity: dim ? 0.55 : 1,
                    transition: "opacity 420ms ease",
                  }}
                >
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "0.22em", color: "#D4A574", fontWeight: 500, marginBottom: 8 }}>
                    THE ARCHIVIST
                  </div>
                  <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 16, lineHeight: 1.55, color: "#E8E3DC" }}>
                    {m.content}
                    {m.streaming && (
                      <span
                        aria-hidden="true"
                        style={{
                          display: "inline-block",
                          width: 7,
                          height: 17,
                          marginLeft: 2,
                          background: "#D4A574",
                          verticalAlign: "-2px",
                          animation: "archivist-breathe 1s steps(2) infinite",
                        }}
                      />
                    )}
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
          );
        })}

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

        {sending && !messages[messages.length - 1]?.streaming && (
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
        style={{ padding: "16px 18px", borderTop: "1px solid #1C1A24", display: "flex", gap: 10, alignItems: "center", flexShrink: 0, position: "relative", zIndex: 6 }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={listening ? "" : "Tell the Archivist..."}
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
        {hasMic && (
          <button
            type="button"
            onClick={() => (listening ? stopListening() : startListening())}
            disabled={sending}
            aria-label={listening ? "Stop listening" : "Speak"}
            aria-pressed={listening}
            className={listening ? "archivist-mic-listening" : ""}
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: "transparent",
              border: `1px solid ${listening ? "#E1C378" : "#2A2830"}`,
              color: listening ? "#E1C378" : "#8A857D",
              cursor: sending ? "not-allowed" : "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "color 200ms ease, border-color 200ms ease",
              flexShrink: 0,
            }}
          >
            <Mic size={14} />
          </button>
        )}
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

  return (
    <div
      className={`portal-archivist ${open ? "portal-archivist-open" : ""}`}
      aria-hidden={!open}
    >
      <RequireTier required="free" mode="chat" inline currentPattern={patternKey}>
        {panelContent}
      </RequireTier>
    </div>
  );
}
