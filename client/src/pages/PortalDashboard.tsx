import { useEffect, useState, useRef, useCallback } from 'react';
import { useLocation } from 'wouter';
import { 
  Download, BookOpen, MessageCircle, Lock, Loader2, 
  Settings, LogOut, FileText, Send, 
  Check, Target, Layers, Flame, 
  FolderOpen, ChevronRight, ArrowRight
} from 'lucide-react';
import { patternDisplayNames, type PatternKey } from '@/lib/quizData';
import { Badge } from '@/components/ui/badge';

interface UserData {
  email: string;
  name: string | null;
  isTestUser?: boolean;
  purchases: Array<{
    productId: string;
    productName: string;
    purchasedAt: string;
  }>;
  hasQuickStart: boolean;
  hasCompleteArchive: boolean;
  availableUpgrades: Array<{
    id: string;
    name: string;
    price: number;
    description: string;
    features: string[];
  }>;
}

interface ChatMessage {
  role: "user" | "assistant";
  message: string;
}

interface StreakData {
  streakCount: number;
  checkedToday: boolean;
  totalInterrupts: number;
}

const patternDetails: Record<PatternKey, {
  triggers: string[];
  behaviors: string[];
  origin: string;
  bodySignature: string;
  interrupt: string;
}> = {
  disappearing: {
    triggers: ["Emotional intimacy increases", "Someone expresses deep feelings", "Relationships become 'real'"],
    behaviors: ["Ghosting or slow fading", "Creating distance through conflict", "Finding reasons to leave"],
    origin: "Early experiences where closeness meant danger or disappointment taught your nervous system that escape equals safety.",
    bodySignature: "Tightness in chest, urge to physically leave, numbness spreading through limbs.",
    interrupt: "When you feel the pull to vanish, name it: 'The pattern is running.' Stay 5 more minutes. That's the interrupt."
  },
  apologyLoop: {
    triggers: ["Taking up space", "Having needs", "Existing in someone's awareness"],
    behaviors: ["Preemptive apologizing", "Over-explaining simple requests", "Making yourself small"],
    origin: "When your presence was treated as a burden, you learned to apologize for existing.",
    bodySignature: "Shoulders hunching, voice getting quieter, stomach dropping before speaking.",
    interrupt: "Catch the 'sorry' before it leaves your mouth. Replace it with a statement: 'I need...' or 'I want...' That's the interrupt."
  },
  testing: {
    triggers: ["Things going well", "Trust beginning to form", "Vulnerability moments"],
    behaviors: ["Creating tests of loyalty", "Pushing people away", "Sabotaging good situations"],
    origin: "Unpredictable early relationships taught you to test people before trusting them.",
    bodySignature: "Restless energy, scanning for threats, jaw clenching during calm moments.",
    interrupt: "When you create a test, ask: 'Am I testing or trusting?' Choose trust for 24 hours. That's the interrupt."
  },
  attractionToHarm: {
    triggers: ["Meeting 'safe' people", "Stability in relationships", "Calm, predictable connection"],
    behaviors: ["Choosing unavailable partners", "Feeling bored by kindness", "Mistaking chaos for passion"],
    origin: "When chaos was normal, your nervous system learned to read danger as excitement.",
    bodySignature: "Boredom with safety, excitement with instability, confusion between love and adrenaline.",
    interrupt: "When 'boring' appears, reframe: 'This is what safe feels like.' Sit with safe for one hour. That's the interrupt."
  },
  complimentDeflection: {
    triggers: ["Receiving praise", "Being seen positively", "Moments of recognition"],
    behaviors: ["Deflecting with humor", "Pointing out flaws", "Feeling physically uncomfortable"],
    origin: "Praise that came with strings or was later withdrawn taught you that positive attention is dangerous.",
    bodySignature: "Heat in face, urge to look away, immediate mental list of why they're wrong.",
    interrupt: "When a compliment lands, say only: 'Thank you.' Nothing else. No qualifier. That's the interrupt."
  },
  drainingBond: {
    triggers: ["Opportunity to leave harmful situations", "Recognizing dysfunction", "Others pointing out problems"],
    behaviors: ["Staying past the point of harm", "Making excuses for others", "Feeling responsible for their emotions"],
    origin: "Bonding to harmful situations was once necessary for survival. Leaving felt like dying.",
    bodySignature: "Guilt when considering boundaries, physical heaviness when near the person, exhaustion mistaken for love.",
    interrupt: "Ask: 'If a friend described this exact situation, what would I tell them?' Listen to your own advice. That's the interrupt."
  },
  successSabotage: {
    triggers: ["Approaching success", "Things going well", "Recognition or achievement looming"],
    behaviors: ["Creating crises before breakthroughs", "Procrastination near finish lines", "Self-destructive choices"],
    origin: "Success may have meant danger, attention, or the removal of something precious. Your system learned: don't succeed.",
    bodySignature: "Anxiety increasing as deadline approaches, sudden urge to destroy what you've built, feeling like a fraud.",
    interrupt: "When the urge to sabotage hits, finish one more step. Just one. Don't evaluate—execute. That's the interrupt."
  },
  perfectionism: {
    triggers: ["Deadline approaching", "About to share work", "Receiving feedback"],
    behaviors: ["Endless revision cycles", "Not finishing or not starting", "Treating 'good enough' as failure"],
    origin: "When love or safety was conditional on performance, your system learned that anything less than perfect means rejection.",
    bodySignature: "Paralysis. Dread. A widening gap between the vision in your head and reality on the page.",
    interrupt: "Perfectionism is telling you it's not ready. Done is better than perfect. Ship it. That's the interrupt."
  },
  rage: {
    triggers: ["Feeling dismissed", "Being contradicted", "Losing control of a situation"],
    behaviors: ["Explosive anger out of nowhere", "Saying things you can't take back", "Disproportionate reactions"],
    origin: "When your boundaries were invisible, rage became the only signal loud enough to be heard.",
    bodySignature: "Heat rising from chest to face. Jaw tight. Pressure building behind your eyes like a dam about to break.",
    interrupt: "You feel the anger rising. This is the Rage Pattern. Don't say anything for 10 seconds. Breathe. That's the interrupt."
  }
};

function getTierLabel(hasQuickStart: boolean, hasCompleteArchive: boolean): string {
  if (hasCompleteArchive) return "COMPLETE ARCHIVE";
  if (hasQuickStart) return "FIELD GUIDE";
  return "CRASH COURSE";
}

function getTierBadgeColor(hasQuickStart: boolean, hasCompleteArchive: boolean): string {
  if (hasCompleteArchive) return "bg-amber-500/20 text-amber-400 border-amber-500/30";
  if (hasQuickStart) return "bg-teal-500/20 text-teal-400 border-teal-500/30";
  return "bg-slate-700/50 text-slate-300 border-slate-600/30";
}

// ============================================
// LOCKED PRODUCT MODAL
// ============================================
function LockedModal({ 
  product, 
  onClose, 
  onCheckout 
}: { 
  product: "quick-start" | "complete-archive";
  onClose: () => void;
  onCheckout: (id: string) => void;
}) {
  const [, setLocation] = useLocation();
  const isFieldGuide = product === "quick-start";
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
      <div 
        className="bg-[#1E1E1E] border border-slate-700/50 rounded-2xl max-w-md w-full p-8 relative"
        onClick={(e) => e.stopPropagation()}
        data-testid="modal-locked-product"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors p-1"
          data-testid="button-close-modal"
        >
          <span className="text-xl">&times;</span>
        </button>
        
        <h3 className="text-2xl font-bold text-white text-center mb-3">
          {isFieldGuide ? "THE FIELD GUIDE" : "THE COMPLETE ARCHIVE"} — ${isFieldGuide ? "47" : "197"}
        </h3>
        
        <p className="text-slate-400 text-center mb-6">
          {isFieldGuide 
            ? "Your pattern isn't a mystery anymore. Now make the interrupt permanent."
            : "Every pattern. Every protocol. Every tool. The full excavation."
          }
        </p>
        
        <ul className="space-y-3 mb-6">
          {(isFieldGuide ? [
            "Full 90-day protocol for YOUR pattern",
            "All 9 patterns explained",
            "Circuit break scripts for every trigger",
            "The Archivist AI — unlimited access",
            "Crisis protocols for when it hits hard"
          ] : [
            "All 9 patterns — full depth",
            "Pattern combination analysis",
            "Relationship protocols",
            "Workplace applications",
            "Lifetime updates",
            "Priority AI access — everything unlocked"
          ]).map((feature, i) => (
            <li key={i} className="flex items-start gap-3 text-slate-300 text-sm">
              <span className="text-teal-400 mt-0.5"><Check className="w-4 h-4" /></span>
              {feature}
            </li>
          ))}
        </ul>
        
        <p className="text-slate-500 text-center text-sm mb-6 italic">
          {isFieldGuide ? "You proved it works. This makes it stick." : "The full system. No gates. No limits."}
        </p>
        
        <button
          onClick={() => onCheckout(product)}
          className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-bold transition-colors"
          data-testid={`button-unlock-${product}`}
        >
          Unlock {isFieldGuide ? "The Field Guide" : "The Complete Archive"} <ArrowRight className="w-4 h-4 inline ml-1" />
        </button>
        
        <button
          onClick={() => onClose()}
          className="w-full text-center text-slate-500 hover:text-slate-300 text-sm mt-3 py-2 transition-colors"
          data-testid="button-dismiss-modal"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}

// ============================================
// MAIN PORTAL DASHBOARD
// ============================================
export default function PortalDashboard() {
  const [, setLocation] = useLocation();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [patternData, setPatternData] = useState<{ pattern: PatternKey | null }>({ pattern: null });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"content" | "chat">("content");
  const [lockedModal, setLockedModal] = useState<"quick-start" | "complete-archive" | null>(null);
  
  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatHistoryLoaded, setChatHistoryLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Streak state
  const [streakData, setStreakData] = useState<StreakData>({ streakCount: 0, checkedToday: false, totalInterrupts: 0 });
  const [interruptLoading, setInterruptLoading] = useState(false);

  // Content view state
  const [activeContent, setActiveContent] = useState<string | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, scrollToBottom]);

  // Load user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, patternRes, streakRes] = await Promise.all([
          fetch("/api/portal/user-data", { credentials: "include" }),
          fetch("/api/portal/user-pattern", { credentials: "include" }),
          fetch("/api/portal/streak", { credentials: "include" }),
        ]);

        if (!userRes.ok) {
          setLocation("/quiz");
          return;
        }

        const user = await userRes.json();
        setUserData(user);

        if (patternRes.ok) {
          const pData = await patternRes.json();
          setPatternData(pData);
        }

        if (streakRes.ok) {
          const sData = await streakRes.json();
          setStreakData(sData);
        }
      } catch {
        setLocation("/quiz");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [setLocation]);

  // Load chat history
  useEffect(() => {
    if (!userData || chatHistoryLoaded) return;
    const loadChat = async () => {
      try {
        const res = await fetch("/api/portal/chat/history", { credentials: "include" });
        if (res.ok) {
          const history = await res.json();
          setChatMessages(history.map((h: any) => ({ role: h.role, message: h.message })));
        }
      } catch {
        // silently fail
      }
      setChatHistoryLoaded(true);
    };
    loadChat();
  }, [userData, chatHistoryLoaded]);

  const handleLogout = async () => {
    document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setLocation("/");
  };

  const handleCheckout = async (productId: string) => {
    try {
      const res = await fetch(`/api/portal/checkout/${productId}`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      console.error("Checkout failed");
    }
  };

  const handleInterrupt = async () => {
    if (streakData.checkedToday || interruptLoading) return;
    setInterruptLoading(true);
    try {
      const res = await fetch("/api/portal/interrupt", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const streakRes = await fetch("/api/portal/streak", { credentials: "include" });
        if (streakRes.ok) {
          setStreakData(await streakRes.json());
        }
      }
    } catch {
      // silently fail
    }
    setInterruptLoading(false);
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || chatLoading) return;
    
    const userMsg: ChatMessage = { role: "user", message: text };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setChatLoading(true);

    try {
      const tier = userData?.hasCompleteArchive ? "archive" : userData?.hasQuickStart ? "quick-start" : "free";
      const res = await fetch("/api/portal/chat", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          pattern: patternData.pattern,
          tier,
          streak: streakData.streakCount,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setChatMessages(prev => [...prev, { role: "assistant", message: data.message }]);
      } else {
        setChatMessages(prev => [...prev, { role: "assistant", message: "Connection disrupted. Try again." }]);
      }
    } catch {
      setChatMessages(prev => [...prev, { role: "assistant", message: "Connection error. Try again." }]);
    }
    setChatLoading(false);
  };

  const handleDownload = (productId: string) => {
    window.open(`/api/portal/download/${productId}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-400" />
      </div>
    );
  }

  if (!userData) return null;

  const pattern = patternData.pattern;
  const patternName = pattern ? (patternDisplayNames[pattern] || pattern) : "Unknown Pattern";
  const hasQuickStart = userData.hasQuickStart;
  const hasCompleteArchive = userData.hasCompleteArchive;
  const tierLabel = getTierLabel(hasQuickStart, hasCompleteArchive);
  const tierBadgeColor = getTierBadgeColor(hasQuickStart, hasCompleteArchive);
  const isFirstVisit = chatMessages.length === 0;

  const starterPrompts = hasCompleteArchive ? [
    "What triggers my pattern?",
    "How do my patterns combine?",
    "How does this show up in my relationship?",
    "How do I stop running this at work?"
  ] : hasQuickStart ? [
    "What triggers my pattern?",
    "How do I interrupt it when I feel it starting?",
    "Do I have more than one pattern?",
    "What's the 90-day protocol?"
  ] : [
    "What triggers my pattern?",
    "How do I interrupt it when I feel it starting?",
    "What does my pattern cost me?"
  ];

  const firstLoginGreeting = pattern && patternDetails[pattern] 
    ? `You have ${patternName}.\n\n${patternDetails[pattern].origin}\n\nBut you're here now. That's the first interrupt.\n\nYour Crash Course is ready. Ask me anything about your pattern, or start with one of the prompts below.`
    : "Welcome to the archive. I'm The Archivist. Tell me what pattern brought you here, and we'll start the excavation.";

  // ============================================
  // LEFT PANEL CONTENT
  // ============================================
  const LeftPanel = () => (
    <div className="flex flex-col h-full bg-[#111111] border-r border-slate-800/50">
      {/* Pattern Display */}
      <div className="p-5 border-b border-slate-800/50">
        <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Your Pattern</p>
        <h3 className="text-lg font-bold text-white leading-tight" data-testid="text-pattern-name">{patternName}</h3>
        <Badge className={`mt-2 text-[10px] uppercase tracking-wider border ${tierBadgeColor}`} data-testid="badge-tier">
          {tierLabel}
        </Badge>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {/* Crash Course - always unlocked */}
        <button
          onClick={() => setActiveContent("crash-course")}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
            activeContent === "crash-course" ? "bg-teal-500/10 text-teal-400" : "text-slate-300 hover:bg-slate-800/50"
          }`}
          data-testid="nav-crash-course"
        >
          <FolderOpen className="w-4 h-4 text-teal-400 flex-shrink-0" />
          <span className="text-sm font-medium">The Crash Course</span>
        </button>

        {/* Field Guide */}
        <button
          onClick={() => hasQuickStart || hasCompleteArchive ? setActiveContent("field-guide") : setLockedModal("quick-start")}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
            activeContent === "field-guide" ? "bg-teal-500/10 text-teal-400" : "text-slate-300 hover:bg-slate-800/50"
          }`}
          data-testid="nav-field-guide"
        >
          <FolderOpen className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm font-medium flex-1">The Field Guide</span>
          {!hasQuickStart && !hasCompleteArchive && <Lock className="w-3.5 h-3.5 text-slate-500" />}
        </button>

        {/* Complete Archive */}
        <button
          onClick={() => hasCompleteArchive ? setActiveContent("complete-archive") : setLockedModal("complete-archive")}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
            activeContent === "complete-archive" ? "bg-teal-500/10 text-teal-400" : "text-slate-300 hover:bg-slate-800/50"
          }`}
          data-testid="nav-complete-archive"
        >
          <FolderOpen className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm font-medium flex-1">The Complete Archive</span>
          {!hasCompleteArchive && <Lock className="w-3.5 h-3.5 text-slate-500" />}
        </button>

        {/* All 9 Patterns */}
        <button
          onClick={() => setActiveContent("all-patterns")}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
            activeContent === "all-patterns" ? "bg-teal-500/10 text-teal-400" : "text-slate-300 hover:bg-slate-800/50"
          }`}
          data-testid="nav-all-patterns"
        >
          <Layers className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm font-medium">All 9 Patterns</span>
        </button>

        {/* Vault Links */}
        <div className="mt-4 pt-4 border-t border-slate-800/50">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-bold px-3 mb-2">The Vault</p>
          <a
            href="/vault/workbench"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors text-slate-300 hover:bg-slate-800/50"
            data-testid="nav-workbench"
          >
            <Target className="w-4 h-4 text-teal-400 flex-shrink-0" />
            <span className="text-sm font-medium">The Workbench</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 ml-auto" />
          </a>
          <a
            href="/vault/archive"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors text-slate-300 hover:bg-slate-800/50"
            data-testid="nav-archive"
          >
            <FolderOpen className="w-4 h-4 text-teal-400 flex-shrink-0" />
            <span className="text-sm font-medium">The Archive</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 ml-auto" />
          </a>
        </div>

        {/* Streak Tracker */}
        <div className="mt-4 pt-4 border-t border-slate-800/50">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-bold px-3 mb-2">Today</p>
          <button
            onClick={handleInterrupt}
            disabled={streakData.checkedToday || interruptLoading}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
              streakData.checkedToday 
                ? "bg-teal-500/10 text-teal-400" 
                : "text-slate-300 hover:bg-slate-800/50"
            }`}
            data-testid="button-interrupt"
          >
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
              streakData.checkedToday ? "border-teal-400 bg-teal-500/20" : "border-slate-600"
            }`}>
              {streakData.checkedToday && <Check className="w-3 h-3 text-teal-400" />}
              {interruptLoading && <Loader2 className="w-3 h-3 animate-spin text-teal-400" />}
            </div>
            <span className="text-sm">I interrupted my pattern</span>
          </button>
          
          {streakData.streakCount > 0 && (
            <div className="flex items-center gap-2 px-3 mt-2" data-testid="text-streak">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-orange-400 font-bold">{streakData.streakCount} day streak</span>
            </div>
          )}
        </div>

        {/* Downloads & Settings */}
        <div className="mt-4 pt-4 border-t border-slate-800/50 space-y-1">
          <button
            onClick={() => setActiveContent("downloads")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
              activeContent === "downloads" ? "bg-teal-500/10 text-teal-400" : "text-slate-300 hover:bg-slate-800/50"
            }`}
            data-testid="nav-downloads"
          >
            <Download className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm font-medium">My Downloads</span>
          </button>
          
          <button
            onClick={() => setActiveContent("settings")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
              activeContent === "settings" ? "bg-teal-500/10 text-teal-400" : "text-slate-300 hover:bg-slate-800/50"
            }`}
            data-testid="nav-settings"
          >
            <Settings className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm font-medium">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );

  // ============================================
  // RIGHT PANEL - AI CHAT
  // ============================================
  const RightPanel = () => (
    <div className="flex flex-col h-full bg-[#0A0A0A]">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800/50 bg-[#111111]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-teal-500/50">
            <img src="/archivist-icon.png" alt="The Archivist" className="w-full h-full object-cover" />
          </div>
          <h3 className="text-sm font-bold text-white">THE ARCHIVIST</h3>
        </div>
        <Badge className={`text-[10px] uppercase tracking-wider border ${tierBadgeColor}`}>
          {tierLabel}
        </Badge>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4" data-testid="chat-messages">
        {/* First Login Greeting */}
        {isFirstVisit && (
          <div className="flex justify-start">
            <div className="max-w-[85%] px-4 py-3 rounded-xl bg-[#1A1A1A] border border-slate-700/50 text-slate-200 text-sm leading-relaxed whitespace-pre-line">
              {firstLoginGreeting}
            </div>
          </div>
        )}

        {/* Message History */}
        {chatMessages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] px-4 py-3 rounded-xl text-sm leading-relaxed whitespace-pre-line ${
              msg.role === "user"
                ? "bg-slate-700/50 text-white"
                : "bg-[#1A1A1A] border border-slate-700/50 text-slate-200"
            }`}>
              {msg.message}
            </div>
          </div>
        ))}

        {chatLoading && (
          <div className="flex justify-start">
            <div className="px-4 py-3 rounded-xl bg-[#1A1A1A] border border-slate-700/50 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
              <span className="text-sm text-slate-400">Analyzing...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Starter Prompts */}
      {(isFirstVisit || chatMessages.length < 2) && (
        <div className="px-5 pb-2 flex flex-wrap gap-2">
          {starterPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="px-3 py-1.5 rounded-full border border-teal-500/30 text-teal-400 text-xs hover:bg-teal-500/10 transition-colors"
              data-testid={`button-starter-prompt-${i}`}
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="px-5 py-4 border-t border-slate-800/50 bg-[#111111]">
        <div className="flex gap-3">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(chatInput);
              }
            }}
            placeholder="Ask me anything about your pattern..."
            className="flex-1 px-4 py-3 rounded-xl bg-[#1A1A1A] border border-slate-700/50 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-teal-500/50 transition-colors"
            disabled={chatLoading}
            data-testid="input-chat"
          />
          <button
            onClick={() => handleSendMessage(chatInput)}
            disabled={chatLoading || !chatInput.trim()}
            className="px-4 py-3 rounded-xl bg-teal-500 hover:bg-teal-600 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors"
            data-testid="button-send-chat"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-slate-600 text-center mt-2 font-bold tracking-widest uppercase">
          Pattern Archaeology, <span className="text-pink-500">NOT</span> Therapy
        </p>
      </div>
    </div>
  );

  // ============================================
  // CONTENT VIEWS (when left panel item is selected)
  // ============================================
  const ContentView = () => {
    if (!activeContent) return <RightPanel />;

    const renderContent = () => {
      switch (activeContent) {
        case "crash-course":
          return (
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">The Crash Course</h2>
                <button onClick={() => setActiveContent(null)} className="text-slate-500 hover:text-white text-sm" data-testid="button-back-to-chat">Back to Chat</button>
              </div>
              <p className="text-slate-400">Your 7-day pattern interruption crash course. Free for all members.</p>
              
              {pattern && patternDetails[pattern] && (
                <div className="bg-[#1A1A1A] border border-slate-700/50 rounded-xl p-6 space-y-4">
                  <h3 className="text-lg font-bold text-white">Your Pattern: {patternName}</h3>
                  <div>
                    <h4 className="text-teal-400 font-bold text-sm mb-2">Triggers</h4>
                    <ul className="space-y-1">
                      {patternDetails[pattern].triggers.map((t, i) => (
                        <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                          <ChevronRight className="w-3 h-3 text-teal-400 mt-1 flex-shrink-0" />
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-teal-400 font-bold text-sm mb-2">Behaviors</h4>
                    <ul className="space-y-1">
                      {patternDetails[pattern].behaviors.map((b, i) => (
                        <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                          <ChevronRight className="w-3 h-3 text-teal-400 mt-1 flex-shrink-0" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-teal-400 font-bold text-sm mb-2">Origin</h4>
                    <p className="text-slate-300 text-sm">{patternDetails[pattern].origin}</p>
                  </div>
                  <div>
                    <h4 className="text-teal-400 font-bold text-sm mb-2">Body Signature</h4>
                    <p className="text-slate-300 text-sm">{patternDetails[pattern].bodySignature}</p>
                  </div>
                  <div>
                    <h4 className="text-teal-400 font-bold text-sm mb-2">The Interrupt</h4>
                    <p className="text-slate-300 text-sm">{patternDetails[pattern].interrupt}</p>
                  </div>
                </div>
              )}
              
              <button
                onClick={() => handleDownload("crash-course")}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 hover:bg-teal-500/20 transition-colors text-sm"
                data-testid="button-download-crash-course"
              >
                <Download className="w-4 h-4" /> Download PDF
              </button>
            </div>
          );
          
        case "field-guide":
          return (
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">The Field Guide</h2>
                <button onClick={() => setActiveContent(null)} className="text-slate-500 hover:text-white text-sm" data-testid="button-back-to-chat">Back to Chat</button>
              </div>
              <p className="text-slate-400">Full 90-day protocol. Deep pattern analysis. All 9 patterns explained.</p>
              
              <div className="bg-[#1A1A1A] border border-slate-700/50 rounded-xl p-6 space-y-3">
                <h3 className="text-lg font-bold text-white">What's Included</h3>
                {["Full pattern deep dive for YOUR pattern", "90-day interruption protocol", "All 9 patterns overview", "Circuit break scripts", "Crisis protocols"].map((f, i) => (
                  <div key={i} className="flex items-center gap-3 text-slate-300 text-sm">
                    <Check className="w-4 h-4 text-teal-400 flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
              
              <button
                onClick={() => handleDownload("quick-start")}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 hover:bg-teal-500/20 transition-colors text-sm"
                data-testid="button-download-field-guide"
              >
                <Download className="w-4 h-4" /> Download PDF
              </button>
            </div>
          );

        case "complete-archive":
          return (
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">The Complete Archive</h2>
                <button onClick={() => setActiveContent(null)} className="text-slate-500 hover:text-white text-sm" data-testid="button-back-to-chat">Back to Chat</button>
              </div>
              <p className="text-slate-400">Every pattern. Every protocol. Every tool. The full excavation.</p>
              
              <div className="bg-[#1A1A1A] border border-slate-700/50 rounded-xl p-6 space-y-3">
                <h3 className="text-lg font-bold text-white">Full Library</h3>
                {["All 9 patterns — full depth", "Pattern combination analysis", "Relationship protocols", "Workplace applications", "Parenting patterns", "Lifetime updates"].map((f, i) => (
                  <div key={i} className="flex items-center gap-3 text-slate-300 text-sm">
                    <Check className="w-4 h-4 text-teal-400 flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
              
              <button
                onClick={() => handleDownload("complete-archive")}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 hover:bg-teal-500/20 transition-colors text-sm"
                data-testid="button-download-complete-archive"
              >
                <Download className="w-4 h-4" /> Download PDF
              </button>
            </div>
          );

        case "all-patterns":
          return (
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">All 9 Patterns</h2>
                <button onClick={() => setActiveContent(null)} className="text-slate-500 hover:text-white text-sm" data-testid="button-back-to-chat">Back to Chat</button>
              </div>
              <div className="space-y-3">
                {(Object.entries(patternDetails) as [PatternKey, typeof patternDetails[PatternKey]][]).map(([key, details]) => {
                  const isUserPattern = key === pattern;
                  const canExpand = hasCompleteArchive || (hasQuickStart) || isUserPattern;
                  return (
                    <div key={key} className={`bg-[#1A1A1A] border rounded-xl p-4 ${isUserPattern ? "border-teal-500/50" : "border-slate-700/50"}`}>
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-white text-sm">
                          {patternDisplayNames[key]}
                          {isUserPattern && <span className="text-teal-400 text-xs ml-2">(yours)</span>}
                        </h3>
                        {!canExpand && <Lock className="w-3.5 h-3.5 text-slate-500" />}
                      </div>
                      {canExpand ? (
                        <div className="mt-2 space-y-2">
                          <p className="text-slate-400 text-xs">{details.origin}</p>
                          <p className="text-teal-400 text-xs italic">{details.interrupt}</p>
                        </div>
                      ) : (
                        <p className="text-slate-500 text-xs mt-1">Unlock the Field Guide for full details</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );

        case "downloads":
          return (
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">My Downloads</h2>
                <button onClick={() => setActiveContent(null)} className="text-slate-500 hover:text-white text-sm" data-testid="button-back-to-chat">Back to Chat</button>
              </div>
              <div className="space-y-3">
                <div className="bg-[#1A1A1A] border border-slate-700/50 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-teal-400" />
                    <div>
                      <p className="text-white text-sm font-medium">Pattern Crash Course</p>
                      <p className="text-slate-500 text-xs">Free - Always available</p>
                    </div>
                  </div>
                  <button onClick={() => handleDownload("crash-course")} className="text-teal-400 hover:text-teal-300 text-sm" data-testid="button-dl-crash-course">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
                
                {hasQuickStart && (
                  <div className="bg-[#1A1A1A] border border-slate-700/50 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-teal-400" />
                      <div>
                        <p className="text-white text-sm font-medium">The Field Guide</p>
                        <p className="text-slate-500 text-xs">$47 - Purchased</p>
                      </div>
                    </div>
                    <button onClick={() => handleDownload("quick-start")} className="text-teal-400 hover:text-teal-300 text-sm" data-testid="button-dl-field-guide">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                )}
                
                {hasCompleteArchive && (
                  <div className="bg-[#1A1A1A] border border-slate-700/50 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-teal-400" />
                      <div>
                        <p className="text-white text-sm font-medium">The Complete Archive</p>
                        <p className="text-slate-500 text-xs">$197 - Purchased</p>
                      </div>
                    </div>
                    <button onClick={() => handleDownload("complete-archive")} className="text-teal-400 hover:text-teal-300 text-sm" data-testid="button-dl-archive">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );

        case "settings":
          return (
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Settings</h2>
                <button onClick={() => setActiveContent(null)} className="text-slate-500 hover:text-white text-sm" data-testid="button-back-to-chat">Back to Chat</button>
              </div>
              
              <div className="bg-[#1A1A1A] border border-slate-700/50 rounded-xl p-5 space-y-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Email</p>
                  <p className="text-white text-sm" data-testid="text-user-email">{userData.email}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Name</p>
                  <p className="text-white text-sm">{userData.name || "Not set"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Tier</p>
                  <p className="text-white text-sm">{tierLabel}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Pattern Interrupts</p>
                  <p className="text-white text-sm">{streakData.totalInterrupts} total</p>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors text-sm"
                data-testid="button-logout"
              >
                <LogOut className="w-4 h-4" /> Log Out
              </button>
            </div>
          );

        default:
          return <RightPanel />;
      }
    };

    return (
      <div className="flex flex-col h-full bg-[#0A0A0A] overflow-y-auto">
        {renderContent()}
      </div>
    );
  };

  return (
    <>
      <div className="h-screen flex flex-col bg-[#0A0A0A]">
        {/* Header */}
        <header className="flex items-center justify-between px-4 h-14 border-b border-slate-800/50 bg-[#111111] flex-shrink-0">
          <div className="flex items-center gap-3">
            <img src="/archivist-icon.png" alt="The Archivist" className="w-8 h-8 rounded-full" />
            <div>
              <h1 className="text-sm font-bold text-white leading-none">Pattern Archive</h1>
              <p className="text-[10px] text-slate-500">The Archivist Method</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 hidden sm:block" data-testid="text-header-email">{userData.email}</span>
            <button 
              onClick={() => setActiveContent("settings")} 
              className="p-2 text-slate-500 hover:text-white transition-colors"
              data-testid="button-header-settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button 
              onClick={handleLogout} 
              className="p-2 text-slate-500 hover:text-white transition-colors"
              data-testid="button-header-logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Desktop Layout - Two Panel */}
        <div className="hidden md:flex flex-1 overflow-hidden">
          <div className="w-[300px] flex-shrink-0 overflow-hidden">
            <LeftPanel />
          </div>
          <div className="flex-1 overflow-hidden">
            {activeContent ? <ContentView /> : <RightPanel />}
          </div>
        </div>

        {/* Mobile Layout - Tabs */}
        <div className="flex md:hidden flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden">
            {activeTab === "content" ? (
              activeContent ? (
                <div className="h-full overflow-y-auto">
                  <ContentView />
                </div>
              ) : (
                <LeftPanel />
              )
            ) : (
              <RightPanel />
            )}
          </div>
          
          {/* Mobile Tab Bar */}
          <div className="flex border-t border-slate-800/50 bg-[#111111] flex-shrink-0">
            <button
              onClick={() => { setActiveTab("content"); setActiveContent(null); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                activeTab === "content" ? "text-teal-400 border-t-2 border-teal-400" : "text-slate-500"
              }`}
              data-testid="tab-content"
            >
              <FolderOpen className="w-4 h-4" />
              Content
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                activeTab === "chat" ? "text-teal-400 border-t-2 border-teal-400" : "text-slate-500"
              }`}
              data-testid="tab-archivist"
            >
              <MessageCircle className="w-4 h-4" />
              The Archivist
            </button>
          </div>
        </div>
      </div>

      {/* Locked Product Modal */}
      {lockedModal && (
        <LockedModal 
          product={lockedModal} 
          onClose={() => setLockedModal(null)} 
          onCheckout={handleCheckout}
        />
      )}
    </>
  );
}
