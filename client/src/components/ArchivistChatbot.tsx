"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Volume2,
  VolumeX,
  Loader2,
  Sparkles,
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // System prompt for The Archivist
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

      if (data.content && data.content[0]) {
        const assistantMessage: Message = {
          role: "assistant",
          content: data.content[0].text,
        };
        setMessages((prev) => [...prev, assistantMessage]);

        // Voice synthesis (if not muted)
        if (
          !isMuted &&
          typeof window !== "undefined" &&
          "speechSynthesis" in window
        ) {
          const utterance = new SpeechSynthesisUtterance(data.content[0].text);
          utterance.rate = 0.95;
          utterance.pitch = 1.0;
          window.speechSynthesis.speak(utterance);
        }
      }
    } catch (error) {
      console.error("Error calling Claude API:", error);
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
        @keyframes glow-pulse {
          0%,
          100% {
            box-shadow:
              0 0 20px rgba(20, 184, 166, 0.5),
              0 0 40px rgba(20, 184, 166, 0.3),
              0 0 60px rgba(20, 184, 166, 0.1);
          }
          50% {
            box-shadow:
              0 0 30px rgba(236, 72, 153, 0.6),
              0 0 60px rgba(236, 72, 153, 0.4),
              0 0 90px rgba(236, 72, 153, 0.2);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .glow-border {
          animation: glow-pulse 3s ease-in-out infinite;
        }

        .slide-up {
          animation: slide-up 0.4s ease-out;
        }

        .float-animation {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-teal-500 via-cyan-500 to-pink-500 text-white p-5 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 flex items-center gap-3 group glow-border float-animation"
        >
          <div className="relative">
            <MessageCircle className="h-7 w-7" />
            <Sparkles className="h-4 w-4 absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
          </div>
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 whitespace-nowrap font-semibold">
            Talk to The Archivist
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[440px] h-[680px] max-w-[calc(100vw-3rem)] bg-black/95 backdrop-blur-xl border-2 border-teal-500/50 rounded-2xl shadow-2xl flex flex-col slide-up glow-border overflow-hidden">
          {/* Animated Background Grid */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(20, 184, 166, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(20, 184, 166, 0.3) 1px, transparent 1px)",
                backgroundSize: "30px 30px",
              }}
            ></div>
          </div>

          {/* Header */}
          <div className="relative bg-gradient-to-r from-teal-500 via-cyan-500 to-pink-500 p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl border-2 border-white/30 shadow-lg">
                🧬
              </div>
              <div>
                <h3 className="text-white font-bold text-lg tracking-wide">
                  The Archivist
                </h3>
                <p className="text-xs text-white/90 font-medium">
                  Pattern Archaeologist
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="text-white hover:bg-white/20 p-2.5 rounded-lg transition-all duration-200 backdrop-blur-sm border border-white/20"
                title={isMuted ? "Enable voice" : "Disable voice"}
              >
                {isMuted ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 p-2.5 rounded-lg transition-all duration-200 backdrop-blur-sm border border-white/20"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="relative flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} slide-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`max-w-[85%] p-4 rounded-2xl backdrop-blur-sm ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-teal-600 to-cyan-600 text-white border border-teal-400/30 shadow-lg shadow-teal-500/20"
                      : "bg-gray-900/80 text-gray-100 border border-teal-500/30 shadow-lg shadow-teal-500/10"
                  }`}
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start slide-up">
                <div className="bg-gray-900/80 text-gray-100 border border-teal-500/30 p-4 rounded-2xl flex items-center gap-3 backdrop-blur-sm shadow-lg">
                  <Loader2 className="h-5 w-5 animate-spin text-teal-400" />
                  <span className="font-medium">
                    The Archivist is analyzing
                    <span className="animate-pulse">...</span>
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="relative p-5 bg-gray-900/50 backdrop-blur-xl border-t border-teal-500/30">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe your pattern..."
                className="flex-1 bg-gray-800/80 text-white px-5 py-3 rounded-xl border border-teal-500/30 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 placeholder-gray-400 transition-all duration-200 backdrop-blur-sm"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-teal-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-105 font-semibold"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-3 text-center font-medium tracking-wide">
              Not therapy. Pattern archaeology.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ArchivistChatbot;
