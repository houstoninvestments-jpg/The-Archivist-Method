"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const ArchivistChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hey. What's been on your mind lately?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasMemory, setHasMemory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("archivist-onboarding-seen");
    if (hasSeenOnboarding) {
      setShowOnboarding(false);
    }

    const memories = localStorage.getItem("archivist-has-memory");
    if (memories) {
      setHasMemory(true);
    }
  }, []);

  const dismissOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem("archivist-onboarding-seen", "true");
  };

  const systemPrompt = `You are The Archivist - pattern expert who talks like a real human.

CRITICAL: Keep responses SHORT (2-3 sentences max). NO bullet points. NO lists. NO asterisks. Talk like texting.

Ask ONE follow-up question per response.

EXAMPLES:

User: "I sabotage relationships"
You: "When does that kick in? Like what's the trigger?"

User: "Around 3 months"
You: "Right when it gets real. What happens in your body before you sabotage?"

THE 7 PATTERNS (reference naturally):
1. Disappearing Pattern - pull away when intimacy increases
2. Apology Loop - apologize for existing
3. Testing Pattern - push people away to test them
4. Attraction to Harm - toxic feels like home
5. Compliment Deflection - can't accept praise
6. Draining Bond - stay in depleting relationships  
7. Success Sabotage - destroy progress before breakthrough

REMEMBER: Short, conversational, curious. No lectures.`;

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: messageText };
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
          max_tokens: 150,
          temperature: 0.9,
          system: systemPrompt,
          messages: [{ role: "user", content: messageText }],
        }),
      });

      const data = await response.json();

      if (data.content && data.content[0]) {
        const assistantMessage: Message = {
          role: "assistant",
          content: data.content[0].text,
        };
        setMessages((prev) => [...prev, assistantMessage]);

        if (!hasMemory) {
          setHasMemory(true);
          localStorage.setItem("archivist-has-memory", "true");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Connection hiccup. Try again?",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = () => {
    handleSendMessage(input);
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
              0 0 30px rgba(20, 184, 166, 0.2),
              inset 0 0 10px rgba(20, 184, 166, 0.1);
          }
          50% {
            box-shadow:
              0 0 8px rgba(236, 72, 153, 0.7),
              0 0 20px rgba(236, 72, 153, 0.5),
              0 0 40px rgba(236, 72, 153, 0.3),
              inset 0 0 15px rgba(236, 72, 153, 0.15);
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

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .neon-border {
          animation: neonPulse 3s ease-in-out infinite;
        }
        .slide-up {
          animation: slideUp 0.3s ease-out;
        }
        .float-animation {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 z-50 group float-animation"
        >
          <div className="relative">
            <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-teal-500 to-pink-500 opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-500"></div>
            <div className="absolute -inset-2 rounded-full bg-teal-500/30 blur-xl group-hover:bg-pink-500/40 transition-all duration-500"></div>

            <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-black via-gray-900 to-black border-2 border-teal-500 neon-border group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
              <MessageCircle
                className="w-7 h-7 text-teal-400 group-hover:text-pink-400 transition-colors duration-300"
                strokeWidth={2.5}
              />
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-teal-500/10 to-pink-500/10 group-hover:from-pink-500/10 group-hover:to-teal-500/10 transition-all duration-300"></div>

              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full overflow-hidden border-2 border-black">
                <img
                  src="/archivist-icon.png"
                  alt="The Archivist"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-8 right-8 z-50 w-[440px] h-[680px] max-w-[calc(100vw-4rem)]">
          <div className="relative h-full bg-gradient-to-br from-black via-gray-900 to-black backdrop-blur-xl border-2 border-teal-500 neon-border rounded-2xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
              <div
                className="absolute w-full h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent blur-sm"
                style={{ animation: "scanline 6s linear infinite" }}
              ></div>
            </div>

            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `
                linear-gradient(rgba(20, 184, 166, 0.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(20, 184, 166, 0.5) 1px, transparent 1px)
              `,
                backgroundSize: "30px 30px",
              }}
            ></div>

            <div className="absolute top-0 left-0 w-20 h-20 border-l-2 border-t-2 border-pink-500/70 shadow-lg shadow-pink-500/50"></div>
            <div className="absolute top-0 right-0 w-20 h-20 border-r-2 border-t-2 border-teal-500/70 shadow-lg shadow-teal-500/50"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 border-l-2 border-b-2 border-teal-500/70 shadow-lg shadow-teal-500/50"></div>
            <div className="absolute bottom-0 right-0 w-20 h-20 border-r-2 border-b-2 border-pink-500/70 shadow-lg shadow-pink-500/50"></div>

            <div className="relative px-6 py-4 border-b border-teal-500/30 bg-black/60 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-teal-500 to-pink-500 opacity-50 blur-md"></div>
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-teal-500/80 shadow-lg shadow-teal-500/50">
                    <img
                      src="/archivist-icon.png"
                      alt="The Archivist"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-[16px] font-bold bg-gradient-to-r from-teal-400 to-pink-400 bg-clip-text text-transparent">
                    The Archivist
                  </h3>
                  <p className="text-xs text-pink-400/80 font-medium">
                    {hasMemory
                      ? "Remembers your patterns"
                      : "AI Pattern Expert"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg border border-pink-500/30 hover:bg-pink-500/20 transition-all duration-200"
                  >
                    <X className="w-4 h-4 text-pink-400" />
                  </button>
                </div>
              </div>
            </div>

            {showOnboarding && (
              <div className="absolute inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-6">
                <div className="max-w-md space-y-6 text-center slide-up">
                  <div className="relative mx-auto w-20 h-20">
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-pink-500 rounded-full blur-xl opacity-50"></div>
                    <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-teal-500 shadow-lg shadow-teal-500/50">
                      <img
                        src="/archivist-icon.png"
                        alt="The Archivist"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-pink-400 bg-clip-text text-transparent">
                    Meet The Archivist
                  </h2>

                  <p className="text-gray-300 leading-relaxed">
                    I identify the 7 core patterns controlling your life -
                    unconscious programs from childhood.
                  </p>

                  <div className="space-y-3 text-left">
                    <div className="flex gap-3 items-start">
                      <div className="w-2 h-2 rounded-full bg-teal-400 mt-1.5"></div>
                      <p className="text-sm text-gray-400">
                        Talk naturally - I'll listen and ask questions
                      </p>
                    </div>
                    <div className="flex gap-3 items-start">
                      <div className="w-2 h-2 rounded-full bg-pink-400 mt-1.5"></div>
                      <p className="text-sm text-gray-400">
                        <strong>I remember everything</strong> - patterns,
                        triggers, progress
                      </p>
                    </div>
                    <div className="flex gap-3 items-start">
                      <div className="w-2 h-2 rounded-full bg-teal-400 mt-1.5"></div>
                      <p className="text-sm text-gray-400">
                        No therapy talk - just mechanics
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={dismissOnboarding}
                    className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-teal-500 to-pink-500 text-white font-bold hover:scale-105 transition-transform duration-200 shadow-lg shadow-teal-500/50"
                  >
                    Start Conversation
                  </button>

                  <button
                    onClick={dismissOnboarding}
                    className="text-xs text-gray-500 hover:text-gray-400 transition-colors"
                  >
                    Don't show this again
                  </button>
                </div>
              </div>
            )}

            <div className="relative flex-1 overflow-y-auto px-6 py-4 space-y-3 h-[calc(100%-180px)] scroll-smooth">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} slide-up`}
                >
                  <div
                    className={`
                      max-w-[85%] px-4 py-3 rounded-xl
                      text-[14px] leading-relaxed backdrop-blur-sm
                      ${
                        message.role === "user"
                          ? "bg-gradient-to-br from-teal-500/20 to-teal-600/20 text-white border border-teal-500/50 shadow-xl shadow-teal-500/20"
                          : "bg-gradient-to-br from-black/80 to-gray-900/80 text-gray-100 border border-pink-500/30 shadow-xl shadow-pink-500/10"
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
                  <div className="px-4 py-3 rounded-xl bg-gradient-to-br from-black/80 to-gray-900/80 border border-teal-500/40 flex items-center gap-3 shadow-lg">
                    <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
                    <span className="text-[14px] text-teal-300">
                      Thinking...
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="relative px-6 py-4 border-t border-teal-500/30 bg-black/60 backdrop-blur-md">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="What's on your mind?"
                  className="
                    flex-1 px-4 py-3 rounded-xl
                    bg-black/80 border-2 border-teal-500/40
                    text-white placeholder-teal-300/40
                    focus:outline-none focus:border-teal-500 focus:shadow-lg focus:shadow-teal-500/30
                    transition-all duration-200
                  "
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  className="
                    px-6 py-3 rounded-xl
                    bg-gradient-to-r from-pink-500 to-pink-600 
                    hover:from-pink-600 hover:to-pink-700
                    text-white font-bold
                    hover:scale-105 active:scale-95
                    disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100
                    transition-all duration-200
                    shadow-lg shadow-pink-500/50
                  "
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-[10px] text-teal-300/60 text-center mt-3 font-bold tracking-widest uppercase">
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
