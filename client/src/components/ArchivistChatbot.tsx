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
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || "",
          "anthropic-version": "2023-06-01",
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
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-teal-500 to-pink-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-200 flex items-center gap-2 group"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
            Talk to The Archivist
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[400px] h-[600px] max-w-[calc(100vw-3rem)] bg-gray-900 border-2 border-teal-500/50 rounded-lg shadow-2xl flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-500 to-pink-500 p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-2xl">
                🧬
              </div>
              <div>
                <h3 className="text-white font-bold">The Archivist</h3>
                <p className="text-xs text-white/80">Pattern Archaeologist</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="text-white hover:bg-white/20 p-2 rounded transition-colors"
                title={isMuted ? "Enable voice" : "Disable voice"}
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 p-2 rounded transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900/50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === "user"
                      ? "bg-teal-600 text-white"
                      : "bg-gray-800 text-gray-100 border border-teal-500/30"
                  }`}
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 text-gray-100 border border-teal-500/30 p-3 rounded-lg flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>The Archivist is analyzing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-gray-800 border-t border-teal-500/30 rounded-b-lg">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe your pattern..."
                className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg border border-teal-500/30 focus:outline-none focus:border-teal-500 placeholder-gray-400"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-teal-500 to-pink-500 text-white p-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Not therapy. Pattern archaeology.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ArchivistChatbot;
