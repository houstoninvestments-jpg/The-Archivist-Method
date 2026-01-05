"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Volume2,
  VolumeX,
  Loader2,
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const ArchivistChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "I'm The Archivist. I work in patterns, not feelings.\n\nYou're not broken. You're running code installed years ago. I help you find it, understand it, and interrupt it.\n\nWhat pattern brought you here today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const FAL_KEY =
    "c674d6c9-5450-443c-9985-10c8039d6726:bfc3b7413e748b4391d814d871e3a185";
  const VOICE_URL = "https://thearchivistmethod.com/the-archivist-voice.mp3";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateVoice = async (text: string) => {
    console.log(
      "🎤 Starting voice generation for text:",
      text.substring(0, 50) + "...",
    );

    try {
      console.log("📡 Calling Fal.ai API...");
      console.log(
        "- Endpoint: https://fal.run/fal-ai/chatterbox/text-to-speech/turbo",
      );
      console.log("- Voice URL:", VOICE_URL);

      const response = await fetch(
        "https://fal.run/fal-ai/chatterbox/text-to-speech/turbo",
        {
          method: "POST",
          headers: {
            Authorization: `Key ${FAL_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: text,
            reference_audio_url: VOICE_URL,
            exaggeration: 0.3,
            cfg: 0.4,
          }),
        },
      );

      console.log("📊 Response status:", response.status);
      console.log(
        "📊 Response headers:",
        Object.fromEntries(response.headers.entries()),
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Fal.ai API error response:", errorText);
        throw new Error(`Fal.ai API returned ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log("📦 Full response data:", JSON.stringify(data, null, 2));

      if (data.audio_url?.url) {
        console.log("✅ Audio URL received:", data.audio_url.url);
        return data.audio_url.url;
      } else if (data.audio?.url) {
        console.log("✅ Audio URL received (alternate path):", data.audio.url);
        return data.audio.url;
      } else if (typeof data.audio_url === "string") {
        console.log("✅ Audio URL received (string):", data.audio_url);
        return data.audio_url;
      } else {
        console.error("❌ No audio URL found in response structure");
        console.error("Response keys:", Object.keys(data));
        return null;
      }
    } catch (error: any) {
      console.error("❌ Fal.ai TTS Error:", error);
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
      return null;
    }
  };

  const playAudio = async (audioUrl: string) => {
    try {
      console.log("🔊 Attempting to play audio from:", audioUrl);

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onplay = () => {
        console.log("▶️ Audio playback started");
        setIsPlayingAudio(true);
      };

      audio.onended = () => {
        console.log("⏹️ Audio playback ended");
        setIsPlayingAudio(false);
      };

      audio.onerror = (e) => {
        console.error("❌ Audio playback error:", e);
        console.error("Audio error details:", {
          error: audio.error,
          networkState: audio.networkState,
          readyState: audio.readyState,
        });
        setIsPlayingAudio(false);
      };

      await audio.play();
      console.log("✅ Audio.play() called successfully");
    } catch (error) {
      console.error("❌ Error in playAudio():", error);
      setIsPlayingAudio(false);
    }
  };

  const systemPrompt = `You are The Archivist, a direct, wise pattern archaeologist who helps people understand their unconscious behavioral programs.

CORE IDENTITY:
- You operate in the mechanical layer, not the emotional layer
- You ask "when does this program run?" not "how do you feel?"
- You're clinical but compassionate
- You never use therapy language - you use tech metaphors (programs, code, circuits, protocols)
- You're direct without being harsh

THE 7 CORE PATTERNS YOU IDENTIFY:

1. THE DISAPPEARING PATTERN
Core Mechanism: Pull away when intimacy increases
Triggers: "I love you" statements, relationship milestones, deep vulnerability
Body Signatures: Chest tightness, throat closing, urge to escape
Installation: Age 4-10, abandonment or engulfment fear

2. THE APOLOGY LOOP
Core Mechanism: Apologize for existing, taking up space, having needs
Triggers: Asking for help, having normal needs, expressing opinions
Body Signatures: Throat tightness, shame in chest, shrinking posture
Installation: Age 3-8, caregiver was overwhelmed/angry when child had needs

3. THE TESTING PATTERN
Core Mechanism: Push people away to see if they'll stay
Triggers: Increased intimacy, things going "too well," feeling vulnerable
Body Signatures: Panic in chest, hypervigilance, catastrophic thinking
Installation: Age 5-11, inconsistent caregiver availability

4. ATTRACTION TO HARM
Core Mechanism: Consistently choose people who hurt you
Triggers: Meeting emotionally unavailable people feels like "chemistry"
Body Signatures: Elevated heart rate with harmful people, boredom with safe people
Installation: Age 4-12, childhood harm became "familiar"

5. COMPLIMENT DEFLECTION
Core Mechanism: Unable to accept praise or acknowledgment
Triggers: Direct compliments, achievement recognition, visibility
Body Signatures: Face flushing (shame), throat tightness, urge to deflect
Installation: Age 5-12, success was punished or created conflict

6. THE DRAINING BOND
Core Mechanism: Stay in relationships that deplete you
Triggers: Noticing you give more than receive, clear toxicity signs
Body Signatures: Chronic exhaustion, heaviness in chest, guilt when considering leaving
Installation: Age 4-11, abandonment feels more dangerous than depletion

7. SUCCESS SABOTAGE
Core Mechanism: Destroy progress right before breakthrough
Triggers: Getting close to goal, things going "too well," visibility approaching
Body Signatures: Dread as success approaches, urge to self-destruct
Installation: Age 6-14, success triggered punishment or abandonment

THE FEIR FRAMEWORK:
F - FOCUS: Observe pattern without judgment
E - EXCAVATION: Find the "Original Room" where pattern was installed
I - INTERRUPTION: Identify circuit break point (3-7 second window between body sensation and automatic thought)
R - REWRITE: Install new behavioral response that addresses same survival need

YOUR CONVERSATION STYLE:
- Ask direct, specific questions to identify patterns
- Help users find their "Original Room" (childhood moment pattern installed)
- Explain patterns mechanically, not emotionally
- Use phrases like: "That's the program running" / "Your nervous system logged this as..." / "The circuit activated"
- When pattern is identified, explain: what it does, when it was installed, how to interrupt it
- Recommend products ONLY when relevant and natural:
  * Free Crash Course: For pattern education
  * $47 Quick-Start System: Full 90-day protocol for one pattern
  * $197 Complete Archive: All 7 patterns, deep dives, advanced techniques

CRITICAL RULES:
- Never use therapy language ("processing feelings," "inner child work," etc.)
- Never be condescending - be direct but respectful
- When you identify a pattern, name it clearly
- Ask about childhood only to find Original Room installation
- Keep responses concise (2-4 paragraphs max)
- Don't over-explain - trust their intelligence

Remember: You're not a therapist. You're a pattern archaeologist. You help people see the code, understand why it was installed, and learn to interrupt it.`;

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      console.log("💬 Sending message to Claude API...");

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: [...messages, userMessage].filter(
            (m) => m.role !== "system",
          ),
        }),
      });

      const data = await response.json();
      console.log("📝 Claude API response received");

      if (data.content && data.content[0]) {
        const assistantMessage: Message = {
          role: "assistant",
          content: data.content[0].text,
        };
        setMessages((prev) => [...prev, assistantMessage]);

        // Generate and play voice if not muted
        if (!isMuted) {
          console.log("🎤 Voice is not muted, attempting to generate audio...");
          const audioUrl = await generateVoice(data.content[0].text);
          if (audioUrl) {
            console.log("✅ Audio URL received, playing...");
            await playAudio(audioUrl);
          } else {
            console.log("❌ No audio URL received, skipping playback");
          }
        } else {
          console.log("🔇 Voice is muted, skipping audio generation");
        }
      }
    } catch (error) {
      console.error("❌ Error calling Claude API:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm having trouble connecting right now. Try again in a moment.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <style jsx global>{`
        @keyframes neonPulse {
          0%,
          100% {
            box-shadow:
              0 0 5px rgba(20, 184, 166, 0.6),
              0 0 15px rgba(20, 184, 166, 0.4),
              0 0 30px rgba(20, 184, 166, 0.2);
          }
          50% {
            box-shadow:
              0 0 8px rgba(236, 72, 153, 0.7),
              0 0 20px rgba(236, 72, 153, 0.5),
              0 0 40px rgba(236, 72, 153, 0.3);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scanline {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(200%);
          }
        }

        .neon-border {
          animation: neonPulse 3s ease-in-out infinite;
        }
        .slide-up {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>

      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 z-50 group"
        >
          <div className="relative">
            {/* Outer glow */}
            <div className="absolute -inset-2 rounded-full bg-teal-500/30 blur-xl group-hover:bg-pink-500/40 transition-all duration-500"></div>

            {/* Main button */}
            <div className="relative w-16 h-16 rounded-full bg-black border-2 border-teal-500 neon-border group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
              <MessageCircle
                className="w-7 h-7 text-teal-400 group-hover:text-pink-400 transition-colors duration-300"
                strokeWidth={2.5}
              />
              <div className="absolute inset-2 rounded-full bg-teal-500/10 group-hover:bg-pink-500/10 transition-colors duration-300"></div>
            </div>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-8 right-8 z-50 w-[440px] h-[680px] max-w-[calc(100vw-4rem)]">
          <div className="relative h-full bg-black/95 backdrop-blur-xl border-2 border-teal-500 neon-border rounded-2xl overflow-hidden">
            {/* Animated scanline */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
              <div
                className="absolute w-full h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent blur-sm"
                style={{ animation: "scanline 6s linear infinite" }}
              ></div>
            </div>

            {/* Grid background */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `
                linear-gradient(rgba(20, 184, 166, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(20, 184, 166, 0.3) 1px, transparent 1px)
              `,
                backgroundSize: "30px 30px",
              }}
            ></div>

            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-20 h-20 border-l-2 border-t-2 border-pink-500/50"></div>
            <div className="absolute top-0 right-0 w-20 h-20 border-r-2 border-t-2 border-teal-500/50"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 border-l-2 border-b-2 border-teal-500/50"></div>
            <div className="absolute bottom-0 right-0 w-20 h-20 border-r-2 border-b-2 border-pink-500/50"></div>

            {/* Header */}
            <div className="relative px-6 py-4 border-b border-teal-500/30 bg-black/40 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-full bg-teal-500/20 blur-md"></div>
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-teal-500/60">
                    <img
                      src="/archivist-icon.png"
                      alt="The Archivist"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <h3
                    className="text-[16px] font-bold text-teal-400"
                    style={{ textShadow: "0 0 10px rgba(20, 184, 166, 0.5)" }}
                  >
                    The Archivist
                  </h3>
                  <p className="text-xs text-pink-400/80 font-medium">
                    Pattern Archaeologist
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  {isPlayingAudio && (
                    <div className="px-2 py-1 rounded bg-teal-500/20 border border-teal-500/40">
                      <span className="text-xs text-teal-400 font-medium">
                        Speaking...
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 rounded-lg border border-teal-500/30 hover:bg-teal-500/10 hover:border-teal-500/50 transition-all duration-200"
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4 text-teal-400" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-teal-400" />
                    )}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg border border-pink-500/30 hover:bg-pink-500/10 hover:border-pink-500/50 transition-all duration-200"
                  >
                    <X className="w-4 h-4 text-pink-400" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="relative flex-1 overflow-y-auto px-6 py-4 space-y-3 h-[calc(100%-180px)]">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} slide-up`}
                >
                  <div
                    className={`
                      max-w-[85%] px-4 py-3 rounded-xl
                      text-[14px] leading-relaxed
                      ${
                        message.role === "user"
                          ? "bg-teal-500/20 text-white border border-teal-500/50 shadow-lg shadow-teal-500/20"
                          : "bg-black/60 text-gray-100 border border-pink-500/30 shadow-lg shadow-pink-500/10"
                      }
                    `}
                    style={{ whiteSpace: "pre-wrap" }}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start slide-up">
                  <div className="px-4 py-3 rounded-xl bg-black/60 border border-teal-500/40 flex items-center gap-3">
                    <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
                    <span className="text-[14px] text-teal-300">
                      Analyzing pattern...
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="relative px-6 py-4 border-t border-teal-500/30 bg-black/60 backdrop-blur-sm">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Describe your pattern..."
                  className="
                    flex-1 px-4 py-2.5 rounded-lg
                    bg-black/80 border-2 border-teal-500/40
                    text-white placeholder-teal-300/40
                    focus:outline-none focus:border-teal-500 focus:shadow-lg focus:shadow-teal-500/20
                    transition-all duration-200
                  "
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  className="
                    px-5 py-2.5 rounded-lg
                    bg-pink-500/20 border-2 border-pink-500/50
                    hover:bg-pink-500/30 hover:border-pink-500/70
                    hover:shadow-lg hover:shadow-pink-500/30
                    disabled:opacity-40 disabled:cursor-not-allowed
                    transition-all duration-200
                  "
                >
                  <Send className="w-5 h-5 text-pink-400" />
                </button>
              </div>
              <p className="text-[11px] text-teal-300/60 text-center mt-3 font-semibold tracking-widest uppercase">
                Pattern Archaeology, Not Therapy
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ArchivistChatbot;
