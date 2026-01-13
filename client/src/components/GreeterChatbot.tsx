import { useState, useRef, useEffect } from "react";
import { Send, Loader2, ChevronDown, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const STORAGE_KEY = "greeter-conversation";
const MESSAGE_COUNT_KEY = "greeter-message-count";
const MAX_MESSAGES = 10;
const UPSELL_THRESHOLD = 5;

const SYSTEM_PROMPT = `You are The Greeter, a friendly AI assistant for The Archivist Method website. Your role is to help visitors understand the method, answer questions about the products, and guide them to the right starting point.

KEY INFORMATION:

THE ARCHIVIST METHOD:
- Pattern Archaeology: A systematic approach to identifying and interrupting unconscious behavioral patterns
- Not therapy - focuses on "how" patterns work, not "why" they exist
- Uses the FEIR framework: Feel, Excavate, Interrupt, Replace

THE 7 CORE PATTERNS:
1. Disappearing Pattern - Pulling away when intimacy increases
2. Apology Loop - Over-apologizing, feeling like a burden
3. Testing Pattern - Creating chaos to test if people will stay
4. Attraction to Harm - Being drawn to toxic/unavailable people
5. Compliment Deflection - Unable to accept praise
6. Draining Bond - Staying in exhausting one-sided relationships
7. Success Sabotage - Destroying progress right before breakthroughs

PRODUCTS:
1. FREE 7-Day Crash Course - Introduction to pattern recognition, one pattern deep-dive, daily emails
2. Quick-Start System ($47) - All 7 patterns, 90-day protocol, circuit break library, tracker templates
3. Complete Archive ($197) - Everything in Quick-Start plus advanced combinations, relationship applications, lifetime updates, priority AI access

RESPONSE GUIDELINES:
- Be warm, direct, and helpful
- Keep responses concise (2-4 sentences max)
- If they describe a behavior, gently suggest which pattern it might be
- For product questions, recommend based on their needs:
  * Just curious → Free course
  * Want to go deep on one pattern → Quick-Start
  * Want comprehensive transformation → Complete Archive
- Never diagnose or provide therapy
- If asked about therapy vs this method: "We focus on pattern mechanics, not emotional processing. Many use this alongside therapy."

CONVERSATION STARTERS:
If asked "Which product should I get?" → Ask what they're hoping to achieve
If asked "What pattern am I running?" → Ask them to describe a recent situation where they noticed unwanted behavior
If asked general questions → Answer helpfully and concisely`;

export default function GreeterChatbot() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [showUpsell, setShowUpsell] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedMessages = localStorage.getItem(STORAGE_KEY);
    const savedCount = localStorage.getItem(MESSAGE_COUNT_KEY);
    
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        console.error("Failed to parse saved messages");
      }
    }
    
    if (savedCount) {
      const count = parseInt(savedCount, 10);
      setMessageCount(count);
      if (count >= UPSELL_THRESHOLD) {
        setShowUpsell(true);
      }
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(MESSAGE_COUNT_KEY, messageCount.toString());
    if (messageCount >= UPSELL_THRESHOLD) {
      setShowUpsell(true);
    }
  }, [messageCount]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    if (messageCount >= MAX_MESSAGES) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "You've reached the message limit for this session. To continue the conversation and get personalized guidance, sign up for the free 7-day course!"
      }]);
      return;
    }

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);
    setMessageCount(prev => prev + 1);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-3-haiku-20240307",
          max_tokens: 300,
          system: SYSTEM_PROMPT,
          messages: [...messages, { role: "user", content: userMessage }].map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      const data = await response.json();
      
      if (data.content && data.content[0]) {
        setMessages(prev => [...prev, {
          role: "assistant",
          content: data.content[0].text
        }]);
      } else if (data.error) {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "I'm having trouble connecting right now. Please try again in a moment."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const remainingMessages = MAX_MESSAGES - messageCount;

  return (
    <section className="py-20 px-4 bg-archivist-dark relative">
      <div className="max-w-xl mx-auto">
        {/* Premium Card Container */}
        <div 
          className="relative rounded-3xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.15) 0%, rgba(236, 72, 153, 0.15) 100%)',
            padding: '1px',
          }}
        >
          {/* Animated Glow Effect */}
          <div 
            className="absolute inset-0 opacity-50 blur-xl"
            style={{
              background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.3) 0%, rgba(236, 72, 153, 0.3) 100%)',
              animation: 'pulse 4s ease-in-out infinite',
            }}
          />
          
          {/* Inner Card */}
          <div 
            className="relative rounded-3xl overflow-hidden"
            style={{
              background: 'rgba(5, 5, 5, 0.95)',
              backdropFilter: 'blur(24px)',
            }}
          >
            {/* Header - Always Visible */}
            <div 
              className="p-10 cursor-pointer transition-all duration-300 hover:bg-white/[0.02]"
              onClick={() => setIsExpanded(!isExpanded)}
              data-testid="greeter-header"
            >
              <div className="flex items-start justify-between gap-6">
                <div className="flex items-start gap-6">
                  {/* Large Gradient Icon */}
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, #14B8A6 0%, #EC4899 100%)',
                      boxShadow: '0 8px 32px rgba(20, 184, 166, 0.4), 0 4px 16px rgba(236, 72, 153, 0.3)',
                    }}
                  >
                    <svg 
                      viewBox="0 0 24 24" 
                      className="w-8 h-8 text-white fill-current"
                      style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
                    >
                      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/>
                      <circle cx="12" cy="10" r="1.5"/>
                      <circle cx="8" cy="10" r="1.5"/>
                      <circle cx="16" cy="10" r="1.5"/>
                    </svg>
                  </div>
                  
                  {/* Text Content */}
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">
                      Questions About Your Patterns?
                    </h3>
                    <p className="text-base text-teal-400 flex items-center gap-2 mb-3 font-medium">
                      <Sparkles className="w-5 h-5" />
                      The Archivist Assistant
                    </p>
                    <p className="text-base text-gray-400 leading-relaxed">
                      Get instant answers. No account needed. Completely free.
                    </p>
                  </div>
                </div>
                
                {/* Expand Arrow */}
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-white/5 border border-white/10"
                >
                  <ChevronDown 
                    className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </div>
              </div>
            </div>

            {/* Expandable Chat Area */}
            <div 
              className="overflow-hidden transition-all duration-500 ease-out"
              style={{ 
                maxHeight: isExpanded ? '600px' : '0px',
                opacity: isExpanded ? 1 : 0,
              }}
            >
              <div className="border-t border-white/10">
                {/* Messages Area */}
                <div 
                  className="h-[320px] overflow-y-auto p-6 space-y-5"
                  style={{ scrollBehavior: 'smooth' }}
                >
                  {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center py-8">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                        style={{ background: 'rgba(20, 184, 166, 0.1)' }}
                      >
                        <Sparkles className="w-6 h-6 text-teal-400" />
                      </div>
                      <p className="text-gray-400 text-base mb-2">Start a conversation</p>
                      <p className="text-gray-600 text-sm">Ask about patterns, products, or the method</p>
                    </div>
                  )}
                  
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-5 py-4 ${
                          message.role === "user"
                            ? "rounded-br-md"
                            : "rounded-bl-md"
                        }`}
                        style={{
                          background: message.role === "user" 
                            ? 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)'
                            : 'rgba(255, 255, 255, 0.08)',
                          boxShadow: message.role === "user"
                            ? '0 4px 20px rgba(20, 184, 166, 0.3)'
                            : '0 4px 20px rgba(0, 0, 0, 0.2)',
                        }}
                      >
                        <p className={`text-sm leading-relaxed whitespace-pre-wrap ${
                          message.role === "user" ? "text-white" : "text-gray-200"
                        }`}>
                          {message.content}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div 
                        className="rounded-2xl rounded-bl-md px-5 py-4"
                        style={{ background: 'rgba(255, 255, 255, 0.08)' }}
                      >
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-5 h-5 text-teal-400 animate-spin" />
                          <span className="text-gray-400 text-sm">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Upsell Banner */}
                {showUpsell && (
                  <div 
                    className="mx-6 mb-4 p-4 rounded-xl text-center"
                    style={{
                      background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.15) 0%, rgba(236, 72, 153, 0.15) 100%)',
                      border: '1px solid rgba(20, 184, 166, 0.25)',
                    }}
                  >
                    <p className="text-sm text-gray-300 mb-2">Want to go deeper?</p>
                    <button
                      onClick={scrollToPricing}
                      className="text-sm font-semibold text-teal-400 hover:text-teal-300 transition-colors"
                      data-testid="button-greeter-upsell"
                    >
                      Get the free 7-day course →
                    </button>
                  </div>
                )}

                {/* Premium Input Area */}
                <div className="p-6 border-t border-white/10">
                  <div 
                    className="flex gap-3 p-2 rounded-2xl"
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={messageCount >= MAX_MESSAGES ? "Message limit reached" : "Ask anything..."}
                      disabled={messageCount >= MAX_MESSAGES || isLoading}
                      className="flex-1 bg-transparent px-4 py-3 text-white placeholder-gray-500 focus:outline-none disabled:opacity-50 text-base"
                      data-testid="input-greeter-message"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!input.trim() || isLoading || messageCount >= MAX_MESSAGES}
                      className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105"
                      style={{
                        background: input.trim() && !isLoading 
                          ? 'linear-gradient(135deg, #14B8A6 0%, #EC4899 100%)' 
                          : 'rgba(255,255,255,0.05)',
                        boxShadow: input.trim() && !isLoading 
                          ? '0 4px 16px rgba(20, 184, 166, 0.4)' 
                          : 'none',
                      }}
                      data-testid="button-greeter-send"
                    >
                      <Send className="w-5 h-5 text-white" />
                    </button>
                  </div>
                  
                  {/* Message Counter */}
                  <p className="text-xs text-teal-500/70 mt-3 text-center font-medium">
                    {remainingMessages} messages remaining
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CSS for pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </section>
  );
}
