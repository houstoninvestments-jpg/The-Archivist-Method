import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, ChevronDown, Sparkles } from "lucide-react";

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

  const handleQuickQuestion = (question: string) => {
    setInput(question);
    setIsExpanded(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 px-4 bg-archivist-dark">
      <div className="max-w-2xl mx-auto">
        <div 
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(10, 10, 10, 0.6)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Header */}
          <div 
            className="p-6 cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
            data-testid="greeter-header"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #14B8A6 0%, #EC4899 100%)'
                  }}
                >
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    Not Sure Where To Start?
                  </h3>
                  <p className="text-sm text-gray-400 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-teal-400" />
                    Ask The Archivist <span className="text-xs text-gray-500">(Beta)</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Get instant answers about the method, patterns, and which product is right for you
                  </p>
                  {!isExpanded && (
                    <p className="text-xs text-teal-400/70 mt-2">
                      Free • No signup required
                    </p>
                  )}
                </div>
              </div>
              <ChevronDown 
                className={`w-5 h-5 text-gray-400 transition-transform duration-300 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
              />
            </div>
          </div>

          {/* Expandable Chat Area with smooth animation */}
          <div 
            className="overflow-hidden transition-all duration-300 ease-in-out"
            style={{ 
              maxHeight: isExpanded ? '500px' : '0px',
              opacity: isExpanded ? 1 : 0
            }}
          >
            <div className="border-t border-white/10">
              {/* Messages */}
              <div 
                className="h-[300px] overflow-y-auto p-4 space-y-4"
                style={{ scrollBehavior: 'smooth' }}
              >
                {messages.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    <p className="text-sm">Ask me anything about The Archivist Method</p>
                  </div>
                )}
                
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-teal-600 to-teal-500 text-white"
                          : "bg-white/10 text-gray-200"
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white/10 rounded-2xl px-4 py-3">
                      <Loader2 className="w-5 h-5 text-teal-400 animate-spin" />
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Upsell Banner */}
              {showUpsell && (
                <div 
                  className="mx-4 mb-4 p-3 rounded-xl text-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%)',
                    border: '1px solid rgba(20, 184, 166, 0.3)'
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

              {/* Input */}
              <div className="p-4 border-t border-white/10">
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={messageCount >= MAX_MESSAGES ? "Message limit reached" : "Ask..."}
                    disabled={messageCount >= MAX_MESSAGES || isLoading}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-teal-500/50 disabled:opacity-50"
                    data-testid="input-greeter-message"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading || messageCount >= MAX_MESSAGES}
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: input.trim() && !isLoading ? 'linear-gradient(135deg, #14B8A6 0%, #EC4899 100%)' : 'rgba(255,255,255,0.1)'
                    }}
                    data-testid="button-greeter-send"
                  >
                    <Send className="w-5 h-5 text-white" />
                  </button>
                </div>
                <p className="text-xs text-gray-600 mt-2 text-center">
                  {MAX_MESSAGES - messageCount} messages remaining this session
                </p>
              </div>
            </div>
          </div>

          {/* Quick Questions (collapsed state) */}
          {!isExpanded && (
            <div className="px-6 pb-6 pt-0">
              <p className="text-xs text-gray-500 mb-3">Common questions:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Which product should I get?",
                  "How is this different from therapy?",
                  "What pattern am I running?"
                ].map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question)}
                    className="text-xs px-3 py-2 rounded-full bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all border border-white/10"
                    data-testid={`button-quick-question-${index}`}
                  >
                    "{question}"
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
