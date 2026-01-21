import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, BookOpen, MessageCircle, Lock, ArrowRight, Loader2, 
  Settings, LogOut, ChevronDown, ChevronUp, FileText, Send, 
  X, Check, Sparkles, Target, Layers, Eye
} from 'lucide-react';
import { patternDisplayNames, patternDescriptions, type PatternKey } from '@/lib/quizData';

interface UserData {
  email: string;
  name: string | null;
  pattern?: PatternKey;
  purchases: Array<{
    productId: string;
    productName: string;
    purchasedAt: string;
  }>;
  availableUpgrades: Array<{
    id: string;
    name: string;
    price: number;
    description: string;
  }>;
}

const patternDetails: Record<PatternKey, {
  triggers: string[];
  behaviors: string[];
  origin: string;
}> = {
  disappearing: {
    triggers: ["Emotional intimacy increases", "Someone expresses deep feelings", "Relationships become 'real'"],
    behaviors: ["Ghosting or slow fading", "Creating distance through conflict", "Finding reasons to leave"],
    origin: "Early experiences where closeness meant danger or disappointment taught your nervous system that escape equals safety."
  },
  apologyLoop: {
    triggers: ["Taking up space", "Having needs", "Existing in someone's awareness"],
    behaviors: ["Preemptive apologizing", "Over-explaining simple requests", "Making yourself small"],
    origin: "When your presence was treated as a burden, you learned to apologize for existing."
  },
  testing: {
    triggers: ["Things going well", "Trust beginning to form", "Vulnerability moments"],
    behaviors: ["Creating tests of loyalty", "Pushing people away", "Sabotaging good situations"],
    origin: "Unpredictable early relationships taught you to test people before trusting them."
  },
  attractionToHarm: {
    triggers: ["Meeting 'safe' people", "Stability in relationships", "Calm, predictable connection"],
    behaviors: ["Choosing unavailable partners", "Feeling bored by kindness", "Mistaking chaos for passion"],
    origin: "When chaos was normal, your nervous system learned to read danger as excitement."
  },
  complimentDeflection: {
    triggers: ["Receiving praise", "Being seen positively", "Moments of recognition"],
    behaviors: ["Deflecting with humor", "Pointing out flaws", "Feeling physically uncomfortable"],
    origin: "Praise that came with strings or was later withdrawn taught you that positive attention is dangerous."
  },
  drainingBond: {
    triggers: ["Opportunity to leave harmful situations", "Recognizing dysfunction", "Others pointing out problems"],
    behaviors: ["Staying past the point of harm", "Making excuses for others", "Feeling responsible for their emotions"],
    origin: "Bonding to harmful situations was once necessary for survival. Leaving felt like dying."
  },
  successSabotage: {
    triggers: ["Approaching success", "Things going well", "Recognition or achievement looming"],
    behaviors: ["Creating crises before breakthroughs", "Procrastination near finish lines", "Self-destructive choices"],
    origin: "Success may have meant danger, attention, or the removal of something precious. Your system learned: don't succeed."
  }
};

const onboardingScreens = [
  {
    title: "Welcome to Your Pattern Archive",
    subtitle: "You made it through the first door.",
    content: "This is where your excavation begins. Not healing—archaeology. We're here to map the code that's been running your life."
  },
  {
    title: "What You'll Find Here",
    subtitle: "Your pattern breakdown, resources, and The Archivist.",
    content: "Pattern analysis based on your quiz. Downloadable resources when you unlock them. And an AI that understands the code you're running."
  },
  {
    title: "Ready to Begin?",
    subtitle: "One pattern at a time. One insight at a time.",
    content: "Scroll down to see your pattern breakdown. Then explore what's available to you. The archive is always open."
  }
];

function OnboardingModal({ onComplete }: { onComplete: () => void }) {
  const [currentScreen, setCurrentScreen] = useState(0);
  
  const handleNext = () => {
    if (currentScreen < onboardingScreens.length - 1) {
      setCurrentScreen(currentScreen + 1);
    } else {
      onComplete();
    }
  };
  
  const screen = onboardingScreens[currentScreen];
  
  return (
    <motion.div 
      className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="max-w-lg w-full bg-slate-900 border border-slate-700/50 rounded-2xl p-8 relative"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <button 
          onClick={onComplete}
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
          data-testid="button-close-onboarding"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="flex gap-2 mb-8">
          {onboardingScreens.map((_, i) => (
            <div 
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i <= currentScreen ? 'bg-teal-500' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="text-2xl font-bold text-white mb-2">{screen.title}</h2>
            <p className="text-teal-400 mb-4">{screen.subtitle}</p>
            <p className="text-slate-300 leading-relaxed mb-8">{screen.content}</p>
          </motion.div>
        </AnimatePresence>
        
        <button
          onClick={handleNext}
          className="w-full py-4 bg-teal-500 hover:bg-teal-600 text-black font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
          data-testid="button-onboarding-next"
        >
          {currentScreen === onboardingScreens.length - 1 ? (
            <>
              <span>Enter Archive</span>
              <ArrowRight className="w-5 h-5" />
            </>
          ) : (
            <>
              <span>Continue</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </motion.div>
    </motion.div>
  );
}

function ExcavationCard({ isCollapsed, onToggle }: { isCollapsed: boolean; onToggle: () => void }) {
  const steps = [
    { icon: Eye, title: "Review Your Pattern", description: "Understand the code running your life", link: "#pattern-breakdown" },
    { icon: FileText, title: "Access Resources", description: "Download guides and materials", link: "#products" },
    { icon: MessageCircle, title: "Consult The Archivist", description: "AI-powered pattern analysis", link: "#archivist" }
  ];
  
  return (
    <div className="bg-gradient-to-br from-teal-500/10 to-cyan-500/10 border border-teal-500/30 rounded-2xl overflow-hidden">
      <button 
        onClick={onToggle}
        className="w-full p-6 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
        data-testid="button-toggle-excavation"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center">
            <Target className="w-6 h-6 text-teal-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Begin Your Excavation</h3>
            <p className="text-slate-400">Three steps to start mapping your patterns</p>
          </div>
        </div>
        {isCollapsed ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronUp className="w-5 h-5 text-slate-400" />}
      </button>
      
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {steps.map((step, i) => (
                <a
                  key={i}
                  href={step.link}
                  className="p-4 bg-slate-900/50 border border-slate-700/50 rounded-xl hover:border-teal-500/50 hover:bg-slate-900 transition-all group"
                  data-testid={`link-excavation-step-${i + 1}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-pink-500 font-bold">{i + 1}.</span>
                    <step.icon className="w-5 h-5 text-teal-400 group-hover:text-teal-300" />
                  </div>
                  <h4 className="font-semibold text-white mb-1">{step.title}</h4>
                  <p className="text-sm text-slate-400">{step.description}</p>
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PatternBreakdown({ pattern }: { pattern: PatternKey }) {
  const details = patternDetails[pattern];
  const displayName = patternDisplayNames[pattern];
  const description = patternDescriptions[pattern];
  
  return (
    <div id="pattern-breakdown" className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-pink-500/20 rounded-xl flex items-center justify-center">
          <Layers className="w-5 h-5 text-pink-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Your Pattern Breakdown</h3>
          <p className="text-sm text-slate-400">Based on your quiz results</p>
        </div>
      </div>
      
      <div className="mb-8">
        <h4 className="text-2xl font-bold text-pink-400 mb-3">{displayName}</h4>
        <p className="text-slate-300 leading-relaxed">{description}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-800/50 rounded-xl p-5">
          <h5 className="text-sm font-bold text-teal-400 uppercase tracking-wider mb-4">Triggers</h5>
          <ul className="space-y-2">
            {details.triggers.map((trigger, i) => (
              <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                <span className="text-teal-500 mt-1">•</span>
                {trigger}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-slate-800/50 rounded-xl p-5">
          <h5 className="text-sm font-bold text-pink-400 uppercase tracking-wider mb-4">Behaviors</h5>
          <ul className="space-y-2">
            {details.behaviors.map((behavior, i) => (
              <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                <span className="text-pink-500 mt-1">•</span>
                {behavior}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-slate-800/80 to-slate-800/40 rounded-xl p-5 border-l-4 border-teal-500">
        <h5 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Origin</h5>
        <p className="text-slate-300 italic leading-relaxed">{details.origin}</p>
      </div>
    </div>
  );
}

function ProductCard({ 
  title, 
  description, 
  price, 
  isUnlocked, 
  onAction, 
  loading,
  actionLabel 
}: { 
  title: string; 
  description: string; 
  price?: number; 
  isUnlocked: boolean; 
  onAction: () => void;
  loading?: boolean;
  actionLabel: string;
}) {
  return (
    <div className={`relative bg-slate-900/50 border rounded-2xl p-6 transition-all ${
      isUnlocked ? 'border-teal-500/50' : 'border-slate-700/50 hover:border-pink-500/30'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isUnlocked ? 'bg-teal-500/20' : 'bg-slate-800'
          }`}>
            {isUnlocked ? (
              <Check className="w-5 h-5 text-teal-400" />
            ) : (
              <Lock className="w-5 h-5 text-slate-500" />
            )}
          </div>
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${
            isUnlocked 
              ? 'bg-teal-500/20 text-teal-400' 
              : 'bg-slate-800 text-slate-400'
          }`}>
            {isUnlocked ? 'UNLOCKED' : 'LOCKED'}
          </span>
        </div>
        {price && !isUnlocked && (
          <span className="text-xl font-bold text-pink-400">${price}</span>
        )}
      </div>
      
      <h4 className="text-lg font-bold text-white mb-2">{title}</h4>
      <p className="text-sm text-slate-400 mb-6 leading-relaxed">{description}</p>
      
      <button
        onClick={onAction}
        disabled={loading}
        className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
          isUnlocked
            ? 'bg-teal-500 hover:bg-teal-600 text-black'
            : 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-pink-400 hover:from-pink-500/30 hover:to-purple-500/30'
        } ${loading ? 'opacity-60 cursor-wait' : ''}`}
        data-testid={`button-product-${title.toLowerCase().replace(/\s+/g, '-')}`}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Processing...</span>
          </>
        ) : isUnlocked ? (
          <>
            <Download className="w-5 h-5" />
            <span>{actionLabel}</span>
          </>
        ) : (
          <>
            <span>{actionLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  );
}

function ArchivistAISection({ isUnlocked }: { isUnlocked: boolean }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    { role: 'assistant', content: "I see you. The pattern you're running—I recognize it. Ask me anything about what you're experiencing." }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [, setLocation] = useLocation();
  
  const handleSend = async () => {
    if (!message.trim() || isLoading) return;
    
    const userMessage = message.trim();
    setMessage('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/archivist/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, history: messages })
      });
      
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response || "I'm processing that pattern..." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Connection interrupted. The archive is still here." }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  if (!isUnlocked) {
    return (
      <div id="archivist" className="relative bg-slate-900/50 border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 backdrop-blur-md bg-slate-900/80 flex items-center justify-center z-10">
          <div className="text-center p-8 max-w-md">
            <div className="w-16 h-16 bg-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-pink-400" />
            </div>
            <h4 className="text-xl font-bold text-white mb-2">Unlock The Archivist AI</h4>
            <p className="text-slate-400 mb-6">Get unlimited access to AI-powered pattern analysis with Quick-Start or Complete Archive.</p>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => setLocation('/quick-start')}
                className="px-6 py-3 bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-pink-400 rounded-xl font-semibold hover:from-pink-500/30 hover:to-purple-500/30 transition-all"
                data-testid="button-unlock-ai-quickstart"
              >
                Quick-Start - $47
              </button>
              <button 
                onClick={() => setLocation('/complete-archive')}
                className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-black rounded-xl font-semibold transition-colors"
                data-testid="button-unlock-ai-archive"
              >
                Full Archive - $197
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-6 opacity-30">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-pink-500/20 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-pink-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">The Archivist AI</h3>
              <p className="text-sm text-slate-400">Pattern archaeology, on demand</p>
            </div>
          </div>
          <div className="h-48 bg-slate-800/50 rounded-xl" />
        </div>
      </div>
    );
  }
  
  return (
    <div id="archivist" className="bg-slate-900/50 border border-teal-500/30 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-teal-500/20 rounded-xl flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-teal-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">The Archivist AI</h3>
          <p className="text-sm text-slate-400">Pattern archaeology, on demand</p>
        </div>
      </div>
      
      <div className="h-80 bg-slate-800/50 rounded-xl p-4 overflow-y-auto mb-4">
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-xl ${
                msg.role === 'user'
                  ? 'bg-teal-500/20 text-white'
                  : 'bg-slate-700/50 text-slate-200'
              }`}>
                <p className="text-sm leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-700/50 p-3 rounded-xl">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="flex gap-3">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about your pattern..."
          className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
          data-testid="input-archivist-message"
        />
        <button
          onClick={handleSend}
          disabled={!message.trim() || isLoading}
          className="px-6 py-3 bg-teal-500 hover:bg-teal-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-black font-semibold rounded-xl transition-colors flex items-center gap-2"
          data-testid="button-archivist-send"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default function PortalDashboard() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [upgradingId, setUpgradingId] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [excavationCollapsed, setExcavationCollapsed] = useState(false);

  useEffect(() => {
    loadUserData();
    
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
    
    const excavationDismissed = localStorage.getItem('excavationCollapsed');
    if (excavationDismissed) {
      setExcavationCollapsed(true);
    }
  }, []);

  const loadUserData = async () => {
    try {
      const response = await fetch('/api/portal/user-data');

      if (!response.ok) {
        if (response.status === 401) {
          setLocation('/portal/login');
          return;
        }
        throw new Error('Failed to load user data');
      }

      const data = await response.json();
      
      const storedPattern = localStorage.getItem('quizResultPattern') as PatternKey | null;
      data.pattern = storedPattern || 'disappearing';
      
      setUserData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
  };

  const handleExcavationToggle = () => {
    const newState = !excavationCollapsed;
    setExcavationCollapsed(newState);
    if (newState) {
      localStorage.setItem('excavationCollapsed', 'true');
    }
  };

  const handleLogout = () => {
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    localStorage.removeItem('hasSeenOnboarding');
    setLocation('/portal/login');
  };

  const handleDownload = (productId: string) => {
    window.open(`/api/portal/download/${productId}`, '_blank');
  };

  const handlePurchase = async (productType: 'quick-start' | 'archive') => {
    if (upgradingId) return;
    setUpgradingId(productType);
    
    try {
      const endpoint = productType === 'archive' 
        ? '/api/portal/checkout/complete-archive'
        : '/api/portal/checkout/quick-start';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('No checkout URL returned');
        setUpgradingId(null);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setUpgradingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Accessing your archive...</p>
        </div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md p-8 bg-red-500/5 border border-red-500/30 rounded-2xl text-center">
          <p className="text-red-400 mb-6">{error || 'Unable to access archive'}</p>
          <button
            onClick={() => setLocation('/portal/login')}
            className="px-6 py-3 bg-teal-500 hover:bg-teal-600 rounded-lg text-black font-semibold transition-colors"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  const hasCrashCourse = true;
  const hasQuickStart = userData.purchases.some(p => 
    p.productName.toLowerCase().includes('quick') || p.productId === 'quick-start'
  );
  const hasArchive = userData.purchases.some(p => 
    p.productName.toLowerCase().includes('archive') || p.productId === 'complete-archive'
  );
  const hasAIAccess = hasQuickStart || hasArchive;

  return (
    <div className="min-h-screen bg-black">
      <AnimatePresence>
        {showOnboarding && (
          <OnboardingModal onComplete={handleOnboardingComplete} />
        )}
      </AnimatePresence>
      
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-pink-500/10"></div>
      </div>

      <div className="relative">
        <header className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <img src="/archivist-icon.png" alt="The Archivist" className="w-10 h-10" />
                <div>
                  <h1 className="text-lg font-bold text-white">Pattern Archive</h1>
                  <p className="text-xs text-slate-500">The Archivist Method</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setLocation('/portal/settings')}
                  className="p-2 text-slate-400 hover:text-white transition-colors"
                  data-testid="button-settings"
                >
                  <Settings className="w-5 h-5" />
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-slate-400 hover:text-white border border-slate-700 hover:border-slate-600 rounded-lg transition-all"
                  data-testid="button-logout"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
              Welcome, <span className="text-teal-400">{userData.name ? userData.name.split(' ')[0] : 'Archivist'}</span>
            </h2>
            <p className="text-slate-500">{userData.email}</p>
          </div>

          <ExcavationCard 
            isCollapsed={excavationCollapsed} 
            onToggle={handleExcavationToggle} 
          />

          {userData.pattern && (
            <PatternBreakdown pattern={userData.pattern} />
          )}

          <section id="products">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-1 h-6 bg-gradient-to-b from-teal-500 to-cyan-500 rounded-full"></span>
              <h3 className="text-xl font-bold text-white">Your Resources</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ProductCard
                title="Pattern Crash Course"
                description="Quick-reference guide to recognizing your pattern in real time."
                isUnlocked={hasCrashCourse}
                onAction={() => handleDownload('crash-course')}
                actionLabel="View PDF"
              />
              
              <ProductCard
                title="Quick-Start System"
                description="7-day guided system to interrupt your pattern at the source."
                price={47}
                isUnlocked={hasQuickStart}
                onAction={() => hasQuickStart ? handleDownload('quick-start') : handlePurchase('quick-start')}
                loading={upgradingId === 'quick-start'}
                actionLabel={hasQuickStart ? "Download" : "Unlock - $47"}
              />
              
              <ProductCard
                title="Complete Archive"
                description="Full pattern excavation system with AI support and all materials."
                price={197}
                isUnlocked={hasArchive}
                onAction={() => hasArchive ? handleDownload('complete-archive') : handlePurchase('archive')}
                loading={upgradingId === 'archive'}
                actionLabel={hasArchive ? "Download All" : "Unlock - $197"}
              />
            </div>
          </section>

          <ArchivistAISection isUnlocked={hasAIAccess} />
        </div>
      </div>
    </div>
  );
}
