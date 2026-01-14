import { useState, useRef, useEffect } from "react";
import { Send, Loader2, X, Sparkles, MessageCircle, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const STORAGE_KEY = "greeter-conversation";
const MESSAGE_COUNT_KEY = "greeter-message-count";
const MAX_MESSAGES = 10;

const GREETING_MESSAGE = "Hey! I'm The Archivist Assistant. I can help you understand the patterns, figure out which system is right for you, or answer any questions. What's on your mind?";

const SYSTEM_PROMPT = `You are The Archivist Assistant, a warm and knowledgeable guide for The Archivist Method website. You speak like a supportive friend who happens to be an expert on behavioral patterns - direct, empathetic, never clinical.

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
6. Success Sabotage - Destroying progress right before breakthroughs
7. Draining Bond - Staying in exhausting one-sided relationships

PRODUCTS:
1. FREE 7-Day Crash Course - Introduction to pattern recognition, one pattern deep-dive, daily emails
2. Quick-Start System ($47) - All 7 patterns, 90-day protocol, circuit break library, tracker templates
3. Complete Archive ($197) - Everything in Quick-Start plus advanced combinations, relationship applications, lifetime updates, priority AI access

RESPONSE STYLE:
- Speak like a knowledgeable friend, not a corporate chatbot
- Keep responses concise (2-4 sentences max)
- Use casual but clear language
- If they describe a behavior, gently suggest which pattern it might be
- For product questions, recommend based on their needs:
  * Just curious → Free course
  * Want to go deep → Quick-Start
  * Want comprehensive transformation → Complete Archive
- Never diagnose or provide therapy
- Be warm and encouraging`;

export default function GreeterChatbot() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [hasGreeted, setHasGreeted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load saved conversation
  useEffect(() => {
    const savedMessages = localStorage.getItem(STORAGE_KEY);
    const savedCount = localStorage.getItem(MESSAGE_COUNT_KEY);
    
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed);
        if (parsed.length > 0) setHasGreeted(true);
      } catch (e) {
        console.error("Failed to parse saved messages");
      }
    }
    
    if (savedCount) {
      setMessageCount(parseInt(savedCount, 10));
    }
  }, []);

  // Save conversation
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(MESSAGE_COUNT_KEY, messageCount.toString());
  }, [messageCount]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  // Send greeting when chat opens for first time
  useEffect(() => {
    if (isExpanded && !hasGreeted && messages.length === 0) {
      setHasGreeted(true);
      setMessages([{ role: "assistant", content: GREETING_MESSAGE }]);
    }
  }, [isExpanded, hasGreeted, messages.length]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    if (messageCount >= MAX_MESSAGES) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "You've reached the message limit for this session. To continue our conversation and get personalized guidance, grab the free 7-day course - I'll be there with more to share!"
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
        content: "I'm having a moment - give me a second and try again."
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

  const handleStartConversation = () => {
    setIsExpanded(true);
  };

  const remainingMessages = MAX_MESSAGES - messageCount;

  return (
    <section className="py-24 px-4 bg-black relative overflow-hidden">
      {/* Background Glow */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(20, 184, 166, 0.15) 0%, transparent 70%)',
        }}
      />
      
      <div className="max-w-3xl mx-auto relative">
        <AnimatePresence mode="wait">
          {!isExpanded ? (
            /* COLLAPSED STATE */
            <motion.div
              key="collapsed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {/* Premium Card Container */}
              <div 
                className="relative rounded-3xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.4) 0%, rgba(236, 72, 153, 0.4) 100%)',
                  padding: '2px',
                }}
              >
                {/* Animated Glow */}
                <div 
                  className="absolute -inset-2 rounded-3xl opacity-40 blur-2xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.5) 0%, rgba(236, 72, 153, 0.5) 100%)',
                    animation: 'pulseGlow 4s ease-in-out infinite',
                  }}
                />
                
                {/* Inner Card */}
                <div 
                  className="relative rounded-3xl py-16 px-8 md:px-16 text-center"
                  style={{
                    background: 'rgba(3, 3, 3, 0.97)',
                    backdropFilter: 'blur(32px)',
                  }}
                >
                  {/* Icon */}
                  <div className="flex justify-center mb-8">
                    <div 
                      className="w-20 h-20 rounded-2xl flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, #14B8A6 0%, #EC4899 100%)',
                        boxShadow: '0 12px 40px rgba(20, 184, 166, 0.4), 0 6px 20px rgba(236, 72, 153, 0.3)',
                      }}
                    >
                      <MessageCircle className="w-10 h-10 text-white" strokeWidth={1.5} />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">
                    Have Questions?
                  </h3>
                  
                  {/* Subtitle */}
                  <p 
                    className="text-xl md:text-2xl font-medium mb-6"
                    style={{
                      background: 'linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Talk to The Archivist
                  </p>

                  {/* Description */}
                  <p className="text-gray-300 text-lg leading-relaxed max-w-lg mx-auto mb-10">
                    I can help you understand the patterns, choose the right system, and get started on your journey.
                  </p>

                  {/* CTA Button */}
                  <button
                    onClick={handleStartConversation}
                    className="inline-flex items-center gap-3 px-10 py-4 rounded-xl text-lg font-semibold text-black transition-all hover:scale-105 hover:shadow-2xl"
                    style={{
                      background: 'linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)',
                      boxShadow: '0 8px 32px rgba(20, 184, 166, 0.4)',
                    }}
                    data-testid="button-start-conversation"
                  >
                    Start Conversation
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  {/* Badge */}
                  <p className="text-teal-500 text-sm mt-6 flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Free • Private • Instant answers
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            /* EXPANDED STATE */
            <motion.div
              key="expanded"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {/* Chat Card Container */}
              <div 
                className="relative rounded-3xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.3) 0%, rgba(236, 72, 153, 0.3) 100%)',
                  padding: '1px',
                }}
              >
                {/* Inner Card */}
                <div 
                  className="relative rounded-3xl overflow-hidden"
                  style={{
                    background: 'rgba(3, 3, 3, 0.98)',
                    backdropFilter: 'blur(32px)',
                  }}
                >
                  {/* Header */}
                  <div 
                    className="flex items-center justify-between px-6 py-4 border-b border-white/10"
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{
                          background: 'linear-gradient(135deg, #14B8A6 0%, #EC4899 100%)',
                        }}
                      >
                        <MessageCircle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">The Archivist Assistant</h4>
                        <p className="text-teal-400 text-xs">Here to help</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsExpanded(false)}
                      className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
                      data-testid="button-minimize-chat"
                    >
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>

                  {/* Messages Area */}
                  <div 
                    className="h-[400px] md:h-[450px] overflow-y-auto p-6 space-y-4"
                    style={{ scrollBehavior: 'smooth' }}
                  >
                    {messages.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                      >
                        {/* Avatar */}
                        <div 
                          className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${
                            message.role === "assistant" 
                              ? "" 
                              : "bg-gradient-to-br from-gray-600 to-gray-700"
                          }`}
                          style={message.role === "assistant" ? {
                            background: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
                          } : {}}
                        >
                          {message.role === "assistant" ? (
                            <Sparkles className="w-4 h-4 text-white" />
                          ) : (
                            <span className="text-white text-xs font-medium">You</span>
                          )}
                        </div>

                        {/* Message Bubble */}
                        <div
                          className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                            message.role === "user"
                              ? "rounded-tr-md"
                              : "rounded-tl-md border-l-2 border-teal-500/50"
                          }`}
                          style={{
                            background: message.role === "user" 
                              ? 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)'
                              : 'rgba(255, 255, 255, 0.06)',
                            boxShadow: message.role === "user"
                              ? '0 4px 20px rgba(20, 184, 166, 0.25)'
                              : 'none',
                          }}
                        >
                          <p className={`text-[15px] leading-relaxed whitespace-pre-wrap ${
                            message.role === "user" ? "text-white" : "text-gray-200"
                          }`}>
                            {message.content}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                    
                    {/* Typing Indicator */}
                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-3"
                      >
                        <div 
                          className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center"
                          style={{
                            background: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
                          }}
                        >
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <div 
                          className="rounded-2xl rounded-tl-md px-5 py-3 border-l-2 border-teal-500/50"
                          style={{ background: 'rgba(255, 255, 255, 0.06)' }}
                        >
                          <div className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      </motion.div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Area */}
                  <div className="p-4 border-t border-white/10">
                    <div 
                      className="flex gap-3 p-2 rounded-xl"
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
                        placeholder={messageCount >= MAX_MESSAGES ? "Message limit reached" : "Type your message..."}
                        disabled={messageCount >= MAX_MESSAGES || isLoading}
                        className="flex-1 bg-transparent px-4 py-3 text-white text-base placeholder-gray-500 focus:outline-none disabled:opacity-50"
                        data-testid="input-greeter-message"
                      />
                      <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading || messageCount >= MAX_MESSAGES}
                        className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                        style={{
                          background: input.trim() && !isLoading 
                            ? 'linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)' 
                            : 'rgba(255,255,255,0.05)',
                          boxShadow: input.trim() && !isLoading 
                            ? '0 4px 16px rgba(20, 184, 166, 0.4)' 
                            : 'none',
                        }}
                        data-testid="button-greeter-send"
                      >
                        {isLoading ? (
                          <Loader2 className="w-5 h-5 text-white animate-spin" />
                        ) : (
                          <Send className="w-5 h-5 text-white" />
                        )}
                      </button>
                    </div>
                    
                    {/* Message Counter */}
                    <div className="flex items-center justify-center gap-2 mt-3">
                      <span className="text-teal-500 text-sm font-medium">
                        {remainingMessages} messages remaining
                      </span>
                      <span className="text-gray-600 text-sm">•</span>
                      <span className="text-gray-500 text-sm">Free</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* CSS for animations */}
      <style>{`
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.02); }
        }
      `}</style>
    </section>
  );
}
