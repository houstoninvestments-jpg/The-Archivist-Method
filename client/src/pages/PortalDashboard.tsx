import { useEffect, useState, useRef, useCallback } from 'react';
import { useLocation } from 'wouter';
import { 
  Download, BookOpen, MessageCircle, Lock, Loader2, 
  Settings, LogOut, FileText, Send, 
  Check, Target, Layers, Flame, 
  FolderOpen, ChevronRight, ArrowRight,
  Zap, PenLine
} from 'lucide-react';
import { patternDisplayNames, type PatternKey } from '@/lib/quizData';
import ArchivistIcon from '@/components/ArchivistIcon';

const FONT_PLAYFAIR = "'Playfair Display', serif";
const FONT_BODY = "'Source Sans 3', sans-serif";
const FONT_MONO = "'JetBrains Mono', monospace";
const CARD_BG = "rgba(255,255,255,0.03)";
const CARD_BORDER = "rgba(255,255,255,0.06)";
const COLOR_BG = "#0A0A0A";
const COLOR_TEXT = "#F5F5F5";
const COLOR_MUTED = "#737373";
const COLOR_TEAL = "#14B8A6";
const COLOR_PINK = "#EC4899";

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

function Tooltip({ text, children }: { text: string; children: React.ReactNode }) {
  return (
    <span className="portal-tooltip-trigger">
      {children}
      <span className="portal-tooltip">{text}</span>
    </span>
  );
}

function LockedModal({ 
  product, 
  onClose, 
  onCheckout 
}: { 
  product: "quick-start" | "complete-archive";
  onClose: () => void;
  onCheckout: (id: string) => void;
}) {
  const isFieldGuide = product === "quick-start";
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }} onClick={onClose}>
      <div 
        className="max-w-md w-full p-8 relative rounded-md animate-fade-in"
        style={{ background: COLOR_BG, border: `1px solid ${CARD_BORDER}` }}
        onClick={(e) => e.stopPropagation()}
        data-testid="modal-locked-product"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 transition-colors p-1"
          style={{ color: COLOR_MUTED }}
          data-testid="button-close-modal"
        >
          <span className="text-xl">&times;</span>
        </button>
        
        <h3 className="text-2xl font-bold text-center mb-3" style={{ fontFamily: FONT_PLAYFAIR, color: COLOR_TEXT }}>
          {isFieldGuide ? "THE FIELD GUIDE" : "THE COMPLETE ARCHIVE"} — ${isFieldGuide ? "47" : "197"}
        </h3>
        
        <p className="text-center mb-6 text-sm" style={{ color: COLOR_MUTED }}>
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
            <li key={i} className="flex items-start gap-3 text-sm" style={{ color: "#A3A3A3" }}>
              <Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: COLOR_TEAL }} />
              {feature}
            </li>
          ))}
        </ul>
        
        <p className="text-center text-sm mb-6 italic" style={{ color: COLOR_MUTED }}>
          {isFieldGuide ? "You proved it works. This makes it stick." : "The full system. No gates. No limits."}
        </p>
        
        <button
          onClick={() => onCheckout(product)}
          className="w-full py-3 rounded-md font-medium tracking-wider uppercase text-sm transition-all cursor-pointer"
          style={{ background: COLOR_TEAL, color: COLOR_BG, fontFamily: FONT_MONO }}
          data-testid={`button-unlock-${product}`}
        >
          Unlock {isFieldGuide ? "The Field Guide" : "The Complete Archive"} <ArrowRight className="w-4 h-4 inline ml-1" />
        </button>
        
        <button
          onClick={() => onClose()}
          className="w-full text-center text-sm mt-3 py-2 transition-colors cursor-pointer"
          style={{ color: COLOR_MUTED }}
          data-testid="button-dismiss-modal"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}

export default function PortalDashboard() {
  const [, setLocation] = useLocation();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [patternData, setPatternData] = useState<{ pattern: PatternKey | null }>({ pattern: null });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"content" | "chat">("content");
  const [lockedModal, setLockedModal] = useState<"quick-start" | "complete-archive" | null>(null);
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatHistoryLoaded, setChatHistoryLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [streakData, setStreakData] = useState<StreakData>({ streakCount: 0, checkedToday: false, totalInterrupts: 0 });
  const [interruptLoading, setInterruptLoading] = useState(false);
  const [activeContent, setActiveContent] = useState<string | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, scrollToBottom]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, patternRes, streakRes] = await Promise.all([
          fetch("/api/portal/user-data", { credentials: "include" }),
          fetch("/api/portal/user-pattern", { credentials: "include" }),
          fetch("/api/portal/streak", { credentials: "include" }),
        ]);

        if (!userRes.ok) { setLocation("/quiz"); return; }
        setUserData(await userRes.json());
        if (patternRes.ok) setPatternData(await patternRes.json());
        if (streakRes.ok) setStreakData(await streakRes.json());
      } catch { setLocation("/quiz"); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [setLocation]);

  useEffect(() => {
    if (chatHistoryLoaded) return;
    const loadHistory = async () => {
      try {
        const res = await fetch("/api/portal/chat/history", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setChatMessages(data.messages || []);
        }
      } catch {}
      setChatHistoryLoaded(true);
    };
    loadHistory();
  }, [chatHistoryLoaded]);

  const handleLogout = async () => {
    try {
      await fetch("/api/portal/logout", { method: "POST", credentials: "include" });
    } catch {}
    setLocation("/quiz");
  };

  const handleInterrupt = async () => {
    if (streakData.checkedToday || interruptLoading) return;
    setInterruptLoading(true);
    try {
      await fetch("/api/portal/streak/check-in", { method: "POST", credentials: "include" });
      const streakRes = await fetch("/api/portal/streak", { credentials: "include" });
      if (streakRes.ok) setStreakData(await streakRes.json());
    } catch {}
    setInterruptLoading(false);
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || chatLoading) return;
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", message: text }]);
    setChatLoading(true);
    try {
      const tier = userData?.hasCompleteArchive ? "archive" : userData?.hasQuickStart ? "quick-start" : "free";
      const res = await fetch("/api/portal/chat", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, pattern: patternData.pattern, tier, streak: streakData.streakCount }),
      });
      if (res.ok) {
        const data = await res.json();
        setChatMessages((prev) => [...prev, { role: "assistant", message: data.message }]);
      }
    } catch {}
    setChatLoading(false);
  };

  const handleDownload = (productId: string) => {
    window.open(`/api/portal/download/${productId}`, '_blank');
  };

  const handleCheckout = async (productId: string) => {
    try {
      const endpoint = productId === "quick-start" ? "/api/portal/checkout/quick-start" : "/api/portal/checkout/complete-archive";
      const res = await fetch(endpoint, { method: "POST", credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        if (data.url) window.location.href = data.url;
      }
    } catch {}
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center" style={{ background: COLOR_BG }}>
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: COLOR_TEAL }} />
      </div>
    );
  }

  if (!userData) return null;

  const pattern = patternData.pattern;
  const patternName = pattern ? (patternDisplayNames[pattern] || pattern) : "Unknown Pattern";
  const hasQuickStart = userData.hasQuickStart;
  const hasCompleteArchive = userData.hasCompleteArchive;
  const tierLabel = getTierLabel(hasQuickStart, hasCompleteArchive);
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
    ? `THE POCKET ARCHIVIST IS READY.\n\nIt knows your pattern. It knows your body signature. It knows your circuit break sequence.\n\nWhat's firing right now — in your body, not your thoughts?`
    : "THE POCKET ARCHIVIST IS READY.\n\nIt knows your pattern. It knows your body signature. It knows your circuit break sequence. Tell it what's happening right now.";

  const SidebarLabel = ({ children }: { children: string }) => (
    <p
      className="text-[10px] uppercase tracking-[0.2em] px-3 mb-2 mt-1"
      style={{ color: COLOR_MUTED, fontFamily: FONT_MONO }}
    >
      {children}
    </p>
  );

  const NavButton = ({ active, locked, onClick, icon: Icon, label, testId, external, tooltipText }: {
    active?: boolean; locked?: boolean; onClick: () => void;
    icon: any; label: string; testId: string; external?: boolean; tooltipText?: string;
  }) => {
    const btn = (
      <button
        onClick={onClick}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left transition-colors"
        style={{
          fontFamily: FONT_BODY,
          color: active ? COLOR_TEAL : "#A3A3A3",
          background: active ? "rgba(20,184,166,0.08)" : "transparent",
          borderLeft: active ? `2px solid ${COLOR_TEAL}` : "2px solid transparent",
        }}
        data-testid={testId}
      >
        <Icon className="w-4 h-4 flex-shrink-0" style={{ color: active ? COLOR_TEAL : COLOR_MUTED }} />
        <span className="text-sm flex-1">{label}</span>
        {locked && <Lock className="w-3.5 h-3.5" style={{ color: "rgba(115,115,115,0.5)" }} />}
        {external && <ArrowRight className="w-3.5 h-3.5" style={{ color: COLOR_MUTED }} />}
      </button>
    );

    if (tooltipText) {
      return <Tooltip text={tooltipText}>{btn}</Tooltip>;
    }
    return btn;
  };

  const EmergencyInterruptCards = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
      <a
        href="/vault/workbench"
        className="block p-7 rounded-md transition-all group emergency-card-teal"
        style={{
          background: "linear-gradient(135deg, rgba(20,184,166,0.08) 0%, rgba(20,184,166,0.02) 100%)",
          border: `2px solid ${COLOR_TEAL}`,
          boxShadow: "0 0 20px rgba(20,184,166,0.08), inset 0 1px 0 rgba(20,184,166,0.1)",
        }}
        data-testid="card-im-activated"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-md flex items-center justify-center emergency-icon-teal" style={{ background: "rgba(20,184,166,0.15)", boxShadow: "0 0 12px rgba(20,184,166,0.2)" }}>
            <Zap className="w-6 h-6" style={{ color: COLOR_TEAL }} />
          </div>
          <div>
            <h3 className="text-xl font-bold leading-tight" style={{ fontFamily: FONT_PLAYFAIR, color: COLOR_TEXT }}>I'm Activated</h3>
            <p className="text-[10px] uppercase tracking-[0.2em] mt-0.5" style={{ color: COLOR_TEAL, fontFamily: FONT_MONO }}>WORKBENCH</p>
          </div>
        </div>
        <p className="text-sm leading-relaxed mb-3" style={{ color: "#A3A3A3", fontFamily: FONT_BODY }}>
          Pattern running right now? Open the Workbench to start your interrupt sequence.
        </p>
        <span className="inline-flex items-center gap-1 text-xs tracking-wider uppercase" style={{ color: COLOR_TEAL, fontFamily: FONT_MONO }}>
          Start interrupt <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </a>
      <a
        href="/vault/workbench#braindump"
        className="block p-7 rounded-md transition-all group emergency-card-pink"
        style={{
          background: "linear-gradient(135deg, rgba(236,72,153,0.08) 0%, rgba(236,72,153,0.02) 100%)",
          border: `2px solid ${COLOR_PINK}`,
          boxShadow: "0 0 20px rgba(236,72,153,0.08), inset 0 1px 0 rgba(236,72,153,0.1)",
        }}
        data-testid="card-brain-dump"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-md flex items-center justify-center emergency-icon-pink" style={{ background: "rgba(236,72,153,0.15)", boxShadow: "0 0 12px rgba(236,72,153,0.2)" }}>
            <PenLine className="w-6 h-6" style={{ color: COLOR_PINK }} />
          </div>
          <div>
            <h3 className="text-xl font-bold leading-tight" style={{ fontFamily: FONT_PLAYFAIR, color: COLOR_TEXT }}>Brain Dump</h3>
            <p className="text-[10px] uppercase tracking-[0.2em] mt-0.5" style={{ color: COLOR_PINK, fontFamily: FONT_MONO }}>UNLOAD</p>
          </div>
        </div>
        <p className="text-sm leading-relaxed mb-3" style={{ color: "#A3A3A3", fontFamily: FONT_BODY }}>
          Get it out of your head. No filter. No judgment. Just write.
        </p>
        <span className="inline-flex items-center gap-1 text-xs tracking-wider uppercase" style={{ color: COLOR_PINK, fontFamily: FONT_MONO }}>
          Start writing <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </a>
    </div>
  );

  const LeftPanel = () => (
    <div className="flex flex-col h-full" style={{ background: COLOR_BG, borderRight: `1px solid ${CARD_BORDER}` }}>
      <div className="p-5" style={{ borderBottom: `1px solid ${CARD_BORDER}` }}>
        <SidebarLabel>YOUR PATTERN</SidebarLabel>
        <h3
          className="text-lg font-bold leading-tight mt-1"
          style={{ fontFamily: FONT_PLAYFAIR, color: COLOR_TEXT }}
          data-testid="text-pattern-name"
        >
          {patternName}
        </h3>
        <span
          className="inline-block mt-2 px-2.5 py-1 text-[10px] uppercase tracking-[0.15em] rounded-sm"
          style={{
            fontFamily: FONT_MONO,
            color: COLOR_TEAL,
            background: "transparent",
            border: `1px solid rgba(20,184,166,0.3)`,
          }}
          data-testid="badge-tier"
        >
          {tierLabel}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        <NavButton active={activeContent === "crash-course"} onClick={() => setActiveContent("crash-course")} icon={FolderOpen} label="The Crash Course" testId="nav-crash-course" />
        <NavButton
          active={activeContent === "field-guide"}
          locked={!hasQuickStart && !hasCompleteArchive}
          onClick={() => hasQuickStart || hasCompleteArchive ? setActiveContent("field-guide") : setLockedModal("quick-start")}
          icon={FolderOpen}
          label="The Field Guide"
          testId="nav-field-guide"
          tooltipText={!hasQuickStart && !hasCompleteArchive ? "Your pattern-specific deep dive. Includes body signature mapping, interrupt scripts, and relationship analysis. $47 one-time." : undefined}
        />
        <NavButton
          active={activeContent === "complete-archive"}
          locked={!hasCompleteArchive}
          onClick={() => hasCompleteArchive ? setActiveContent("complete-archive") : setLockedModal("complete-archive")}
          icon={FolderOpen}
          label="The Complete Archive"
          testId="nav-complete-archive"
          tooltipText={!hasCompleteArchive ? "All 9 patterns fully documented. The entire system. $197 one-time." : undefined}
        />
        <NavButton active={activeContent === "all-patterns"} onClick={() => setActiveContent("all-patterns")} icon={Layers} label="All 9 Patterns" testId="nav-all-patterns" />

        <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
          <SidebarLabel>THE VAULT</SidebarLabel>
          <a href="/portal/reader" className="block" data-testid="nav-reader">
            <NavButton onClick={() => {}} icon={BookOpen} label="Content Reader" testId="nav-reader-btn" external tooltipText="Read all your unlocked content with notes, highlights, and progress tracking." />
          </a>
          <a href="/vault/workbench" className="block" data-testid="nav-workbench">
            <NavButton onClick={() => {}} icon={Target} label="The Workbench" testId="nav-workbench-btn" external tooltipText="Your real-time pattern interruption toolkit. Use when a pattern is activating." />
          </a>
          <a href="/vault/archive" className="block" data-testid="nav-archive">
            <NavButton onClick={() => {}} icon={FolderOpen} label="The Archive" testId="nav-archive-btn" external tooltipText="Your complete pattern library. Browse all content, research, and protocols." />
          </a>
        </div>

        <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
          <SidebarLabel>AI ASSISTANT</SidebarLabel>
          <NavButton
            active={activeContent === "chat"}
            onClick={() => setActiveContent("chat")}
            icon={MessageCircle}
            label="Talk to The Archivist"
            testId="nav-talk-archivist"
          />
        </div>

        <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
          <SidebarLabel>TODAY</SidebarLabel>
          <button
            onClick={handleInterrupt}
            disabled={streakData.checkedToday || interruptLoading}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left transition-colors"
            style={{ fontFamily: FONT_BODY, color: streakData.checkedToday ? COLOR_TEAL : "#A3A3A3" }}
            data-testid="button-interrupt"
          >
            <div
              className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
              style={{
                border: streakData.checkedToday ? `2px solid ${COLOR_TEAL}` : "2px solid rgba(115,115,115,0.4)",
                background: streakData.checkedToday ? "rgba(20,184,166,0.15)" : "transparent",
              }}
            >
              {streakData.checkedToday && <Check className="w-3 h-3" style={{ color: COLOR_TEAL }} />}
              {interruptLoading && <Loader2 className="w-3 h-3 animate-spin" style={{ color: COLOR_TEAL }} />}
            </div>
            <span className="text-sm" style={{ fontFamily: FONT_BODY }}>I interrupted my pattern</span>
          </button>
          
          {streakData.streakCount > 0 && (
            <Tooltip text="How many consecutive days you've logged an interrupt. Keep it going.">
              <div className="flex items-center gap-2 px-3 mt-2" data-testid="text-streak">
                <Flame className="w-4 h-4" style={{ color: COLOR_TEAL }} />
                <span className="text-sm font-bold" style={{ color: COLOR_TEAL, fontFamily: FONT_MONO }}>
                  {streakData.streakCount} day streak
                </span>
              </div>
            </Tooltip>
          )}
        </div>

        <div className="mt-4 pt-4 space-y-1" style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
          <NavButton active={activeContent === "downloads"} onClick={() => setActiveContent("downloads")} icon={Download} label="My Downloads" testId="nav-downloads" />
          <NavButton active={activeContent === "settings"} onClick={() => setActiveContent("settings")} icon={Settings} label="Settings" testId="nav-settings" />
        </div>
      </div>
    </div>
  );

  const ChatPanel = () => (
    <div className="flex flex-col h-full" style={{ background: COLOR_BG }}>
      <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: `1px solid ${CARD_BORDER}`, background: COLOR_BG }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden" style={{ border: `1px solid rgba(20,184,166,0.3)` }}>
            <ArchivistIcon size={32} />
          </div>
          <h3 className="text-sm font-bold tracking-wider uppercase" style={{ fontFamily: FONT_MONO, color: COLOR_TEXT }}>THE POCKET ARCHIVIST</h3>
        </div>
        <span className="text-[10px] uppercase tracking-[0.15em] px-2.5 py-1 rounded-sm" style={{ fontFamily: FONT_MONO, color: COLOR_TEAL, border: `1px solid rgba(20,184,166,0.3)` }}>
          {tierLabel}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4" data-testid="chat-messages">
        {isFirstVisit && (
          <div className="flex justify-start animate-fade-in">
            <div className="max-w-[85%] px-4 py-3 rounded-md text-sm leading-relaxed whitespace-pre-line" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, color: "#A3A3A3", fontFamily: FONT_BODY }}>
              {firstLoginGreeting}
            </div>
          </div>
        )}
        {chatMessages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className="max-w-[85%] px-4 py-3 rounded-md text-sm leading-relaxed whitespace-pre-line" style={{
              fontFamily: FONT_BODY,
              background: msg.role === "user" ? "rgba(255,255,255,0.06)" : CARD_BG,
              border: `1px solid ${CARD_BORDER}`,
              color: msg.role === "user" ? COLOR_TEXT : "#A3A3A3",
            }}>
              {msg.message}
            </div>
          </div>
        ))}
        {chatLoading && (
          <div className="flex justify-start">
            <div className="px-4 py-3 rounded-md flex items-center gap-2" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
              <Loader2 className="w-4 h-4 animate-spin" style={{ color: COLOR_TEAL }} />
              <span className="text-sm" style={{ color: COLOR_MUTED, fontFamily: FONT_MONO, fontSize: "12px" }}>Analyzing...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {(isFirstVisit || chatMessages.length < 2) && (
        <div className="px-5 pb-2 flex flex-wrap gap-2">
          {starterPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="px-3 py-1.5 rounded-md text-xs transition-colors cursor-pointer"
              style={{ border: `1px solid rgba(20,184,166,0.25)`, color: COLOR_TEAL, fontFamily: FONT_BODY, background: "transparent" }}
              data-testid={`button-starter-prompt-${i}`}
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      <div className="px-5 py-4" style={{ borderTop: `1px solid ${CARD_BORDER}`, background: COLOR_BG }}>
        <div className="flex gap-3">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(chatInput); } }}
            placeholder="Ask me anything about your pattern..."
            className="flex-1 px-4 py-3 rounded-md text-sm focus:outline-none transition-colors"
            style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, color: COLOR_TEXT, fontFamily: FONT_BODY }}
            disabled={chatLoading}
            data-testid="input-chat"
          />
          <button
            onClick={() => handleSendMessage(chatInput)}
            disabled={chatLoading || !chatInput.trim()}
            className="px-4 py-3 rounded-md disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            style={{ background: COLOR_TEAL, color: COLOR_BG }}
            data-testid="button-send-chat"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-center mt-2" style={{ fontSize: "10px", color: COLOR_MUTED, fontFamily: FONT_MONO, letterSpacing: "0.15em", textTransform: "uppercase" as const }}>
          Pattern Archaeology, <span style={{ color: COLOR_PINK }}>NOT</span> Therapy
        </p>
      </div>
    </div>
  );

  const SectionLabel = ({ children }: { children: string }) => (
    <h4 className="text-xs uppercase tracking-[0.15em] font-bold mb-2" style={{ color: COLOR_TEAL, fontFamily: FONT_MONO }}>{children}</h4>
  );

  const ContentView = () => {
    const BackLink = () => (
      <button onClick={() => setActiveContent(null)} className="text-xs transition-colors cursor-pointer" style={{ color: COLOR_MUTED, fontFamily: FONT_MONO }} data-testid="button-back-to-home">
        Back
      </button>
    );

    const DownloadButton = ({ productId, testId }: { productId: string; testId: string }) => (
      <button
        onClick={() => handleDownload(productId)}
        className="inline-flex items-center gap-2 px-5 py-3 rounded-md text-sm tracking-wider uppercase transition-all cursor-pointer"
        style={{ border: "1px solid rgba(255,255,255,0.3)", color: COLOR_TEXT, fontFamily: FONT_MONO, background: "transparent" }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#000"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = COLOR_TEXT; }}
        data-testid={testId}
      >
        <Download className="w-4 h-4" /> DOWNLOAD PDF
      </button>
    );

    const renderContent = () => {
      switch (activeContent) {
        case "crash-course":
          return (
            <div className="p-6 space-y-6 animate-fade-in">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-2xl font-bold" style={{ fontFamily: FONT_PLAYFAIR, color: COLOR_TEXT }}>The Crash Course</h2>
                <BackLink />
              </div>
              <p className="text-sm" style={{ color: COLOR_MUTED, fontFamily: FONT_BODY }}>Your 7-day pattern interruption crash course. Free for all members.</p>
              
              {pattern && patternDetails[pattern] && (
                <div className="p-6 space-y-5 rounded-md" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
                  <h3 className="text-lg font-bold" style={{ fontFamily: FONT_PLAYFAIR, color: COLOR_TEXT }}>Your Pattern: {patternName}</h3>
                  <div>
                    <SectionLabel>Triggers</SectionLabel>
                    <ul className="space-y-1.5">
                      {patternDetails[pattern].triggers.map((t, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "#A3A3A3", fontFamily: FONT_BODY }}>
                          <ChevronRight className="w-3 h-3 mt-1 flex-shrink-0" style={{ color: COLOR_TEAL }} />
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <SectionLabel>Behaviors</SectionLabel>
                    <ul className="space-y-1.5">
                      {patternDetails[pattern].behaviors.map((b, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "#A3A3A3", fontFamily: FONT_BODY }}>
                          <ChevronRight className="w-3 h-3 mt-1 flex-shrink-0" style={{ color: COLOR_TEAL }} />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <SectionLabel>Origin</SectionLabel>
                    <p className="text-sm" style={{ color: "#A3A3A3", fontFamily: FONT_BODY }}>{patternDetails[pattern].origin}</p>
                  </div>
                  <div>
                    <Tooltip text="The physical sensation your body produces 3-7 seconds before a pattern runs. Learning yours is how you catch it.">
                      <SectionLabel>Body Signature</SectionLabel>
                    </Tooltip>
                    <p className="text-sm" style={{ color: "#A3A3A3", fontFamily: FONT_BODY }}>{patternDetails[pattern].bodySignature}</p>
                  </div>
                  <div>
                    <Tooltip text="The moment you catch the pattern and choose not to let it finish running.">
                      <SectionLabel>The Interrupt</SectionLabel>
                    </Tooltip>
                    <p className="text-sm" style={{ color: "#A3A3A3", fontFamily: FONT_BODY }}>{patternDetails[pattern].interrupt}</p>
                  </div>
                </div>
              )}
              
              <DownloadButton productId="crash-course" testId="button-download-crash-course" />
            </div>
          );
          
        case "field-guide":
          return (
            <div className="p-6 space-y-6 animate-fade-in">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-2xl font-bold" style={{ fontFamily: FONT_PLAYFAIR, color: COLOR_TEXT }}>The Field Guide</h2>
                <BackLink />
              </div>
              <p className="text-sm" style={{ color: COLOR_MUTED, fontFamily: FONT_BODY }}>Full 90-day protocol. Deep pattern analysis. All 9 patterns explained.</p>
              
              <div className="p-6 space-y-3 rounded-md" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
                <h3 className="text-lg font-bold" style={{ fontFamily: FONT_PLAYFAIR, color: COLOR_TEXT }}>What's Included</h3>
                {["Full pattern deep dive for YOUR pattern", "90-day interruption protocol", "All 9 patterns overview", "Circuit break scripts", "Crisis protocols"].map((f, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm" style={{ color: "#A3A3A3", fontFamily: FONT_BODY }}>
                    <Check className="w-4 h-4 flex-shrink-0" style={{ color: COLOR_TEAL }} />
                    {f}
                  </div>
                ))}
              </div>
              
              <DownloadButton productId="quick-start" testId="button-download-field-guide" />
            </div>
          );

        case "complete-archive":
          return (
            <div className="p-6 space-y-6 animate-fade-in">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-2xl font-bold" style={{ fontFamily: FONT_PLAYFAIR, color: COLOR_TEXT }}>The Complete Archive</h2>
                <BackLink />
              </div>
              <p className="text-sm" style={{ color: COLOR_MUTED, fontFamily: FONT_BODY }}>Every pattern. Every protocol. Every tool. The full excavation.</p>
              
              <div className="p-6 space-y-3 rounded-md" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
                <h3 className="text-lg font-bold" style={{ fontFamily: FONT_PLAYFAIR, color: COLOR_TEXT }}>Full Library</h3>
                {["All 9 patterns — full depth", "Pattern combination analysis", "Relationship protocols", "Workplace applications", "Parenting patterns", "Lifetime updates"].map((f, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm" style={{ color: "#A3A3A3", fontFamily: FONT_BODY }}>
                    <Check className="w-4 h-4 flex-shrink-0" style={{ color: COLOR_TEAL }} />
                    {f}
                  </div>
                ))}
              </div>
              
              <DownloadButton productId="complete-archive" testId="button-download-complete-archive" />
            </div>
          );

        case "all-patterns":
          return (
            <div className="p-6 space-y-6 animate-fade-in">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-2xl font-bold" style={{ fontFamily: FONT_PLAYFAIR, color: COLOR_TEXT }}>All 9 Patterns</h2>
                <BackLink />
              </div>
              <div className="space-y-3">
                {(Object.entries(patternDetails) as [PatternKey, typeof patternDetails[PatternKey]][]).map(([key, details]) => {
                  const isUserPattern = key === pattern;
                  const canExpand = hasCompleteArchive || hasQuickStart || isUserPattern;
                  return (
                    <div key={key} className="p-4 rounded-md" style={{ background: CARD_BG, border: isUserPattern ? `1px solid rgba(20,184,166,0.4)` : `1px solid ${CARD_BORDER}` }}>
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-sm" style={{ color: COLOR_TEXT, fontFamily: FONT_BODY }}>
                          {patternDisplayNames[key]}
                          {isUserPattern && <span className="text-xs ml-2" style={{ color: COLOR_TEAL }}>(yours)</span>}
                        </h3>
                        {!canExpand && <Lock className="w-3.5 h-3.5" style={{ color: "rgba(115,115,115,0.5)" }} />}
                      </div>
                      {canExpand ? (
                        <div className="mt-2 space-y-2">
                          <p className="text-xs" style={{ color: COLOR_MUTED, fontFamily: FONT_BODY }}>{details.origin}</p>
                          <p className="text-xs italic" style={{ color: COLOR_TEAL, fontFamily: FONT_BODY }}>{details.interrupt}</p>
                        </div>
                      ) : (
                        <p className="text-xs mt-1" style={{ color: COLOR_MUTED }}>Unlock the Field Guide for full details</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );

        case "downloads":
          return (
            <div className="p-6 space-y-6 animate-fade-in">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-2xl font-bold" style={{ fontFamily: FONT_PLAYFAIR, color: COLOR_TEXT }}>My Downloads</h2>
                <BackLink />
              </div>
              <div className="space-y-3">
                <div className="p-4 flex items-center justify-between rounded-md" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5" style={{ color: COLOR_TEAL }} />
                    <div>
                      <p className="text-sm font-medium" style={{ color: COLOR_TEXT, fontFamily: FONT_BODY }}>Pattern Crash Course</p>
                      <p className="text-xs" style={{ color: COLOR_MUTED }}>Free - Always available</p>
                    </div>
                  </div>
                  <button onClick={() => handleDownload("crash-course")} className="transition-colors cursor-pointer" style={{ color: COLOR_TEAL }} data-testid="button-dl-crash-course">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
                
                {hasQuickStart && (
                  <div className="p-4 flex items-center justify-between rounded-md" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5" style={{ color: COLOR_TEAL }} />
                      <div>
                        <p className="text-sm font-medium" style={{ color: COLOR_TEXT, fontFamily: FONT_BODY }}>The Field Guide</p>
                        <p className="text-xs" style={{ color: COLOR_MUTED }}>$47 - Purchased</p>
                      </div>
                    </div>
                    <button onClick={() => handleDownload("quick-start")} className="transition-colors cursor-pointer" style={{ color: COLOR_TEAL }} data-testid="button-dl-field-guide">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                )}
                
                {hasCompleteArchive && (
                  <div className="p-4 flex items-center justify-between rounded-md" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5" style={{ color: COLOR_TEAL }} />
                      <div>
                        <p className="text-sm font-medium" style={{ color: COLOR_TEXT, fontFamily: FONT_BODY }}>The Complete Archive</p>
                        <p className="text-xs" style={{ color: COLOR_MUTED }}>$197 - Purchased</p>
                      </div>
                    </div>
                    <button onClick={() => handleDownload("complete-archive")} className="transition-colors cursor-pointer" style={{ color: COLOR_TEAL }} data-testid="button-dl-archive">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );

        case "settings":
          return (
            <div className="p-6 space-y-6 animate-fade-in">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-2xl font-bold" style={{ fontFamily: FONT_PLAYFAIR, color: COLOR_TEXT }}>Settings</h2>
                <BackLink />
              </div>
              
              <div className="p-5 space-y-4 rounded-md" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.15em] mb-1" style={{ color: COLOR_MUTED, fontFamily: FONT_MONO }}>Email</p>
                  <p className="text-sm" style={{ color: COLOR_TEXT, fontFamily: FONT_BODY }} data-testid="text-user-email">{userData.email}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.15em] mb-1" style={{ color: COLOR_MUTED, fontFamily: FONT_MONO }}>Name</p>
                  <p className="text-sm" style={{ color: COLOR_TEXT, fontFamily: FONT_BODY }}>{userData.name || "Not set"}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.15em] mb-1" style={{ color: COLOR_MUTED, fontFamily: FONT_MONO }}>Tier</p>
                  <p className="text-sm" style={{ color: COLOR_TEXT, fontFamily: FONT_BODY }}>{tierLabel}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.15em] mb-1" style={{ color: COLOR_MUTED, fontFamily: FONT_MONO }}>Pattern Interrupts</p>
                  <p className="text-sm" style={{ color: COLOR_TEXT, fontFamily: FONT_BODY }}>{streakData.totalInterrupts} total</p>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2.5 rounded-md text-sm transition-colors cursor-pointer"
                style={{ border: "1px solid rgba(239,68,68,0.3)", color: "#EF4444", fontFamily: FONT_BODY }}
                data-testid="button-logout"
              >
                <LogOut className="w-4 h-4" /> Log Out
              </button>
            </div>
          );

        case "chat":
          return null;

        default:
          return null;
      }
    };

    return (
      <div className="flex flex-col h-full overflow-y-auto" style={{ background: COLOR_BG }}>
        {renderContent()}
      </div>
    );
  };

  const HomeView = () => (
    <div className="flex flex-col h-full overflow-y-auto" style={{ background: COLOR_BG }}>
      <div className="p-6 space-y-6 animate-fade-in">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] mb-2" style={{ color: COLOR_MUTED, fontFamily: FONT_MONO }}>EMERGENCY INTERRUPT</p>
          <EmergencyInterruptCards />
        </div>

        {pattern && patternDetails[pattern] && (
          <div className="p-6 rounded-md" style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h3 className="text-lg font-bold" style={{ fontFamily: FONT_PLAYFAIR, color: COLOR_TEXT }}>Your Pattern: {patternName}</h3>
              <button
                onClick={() => setActiveContent("crash-course")}
                className="text-xs transition-colors cursor-pointer flex items-center gap-1"
                style={{ color: COLOR_TEAL, fontFamily: FONT_MONO }}
                data-testid="link-view-crash-course"
              >
                View Crash Course <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <Tooltip text="The physical sensation your body produces 3-7 seconds before a pattern runs. Learning yours is how you catch it.">
                  <p className="text-[10px] uppercase tracking-[0.15em] font-bold mb-1" style={{ color: COLOR_TEAL, fontFamily: FONT_MONO }}>Body Signature</p>
                </Tooltip>
                <p className="text-sm" style={{ color: "#A3A3A3", fontFamily: FONT_BODY }}>{patternDetails[pattern].bodySignature}</p>
              </div>
              <div>
                <Tooltip text="A specific statement you say out loud or internally to interrupt a pattern mid-activation.">
                  <p className="text-[10px] uppercase tracking-[0.15em] font-bold mb-1" style={{ color: COLOR_TEAL, fontFamily: FONT_MONO }}>Circuit Break</p>
                </Tooltip>
                <p className="text-sm italic" style={{ color: COLOR_TEXT, fontFamily: FONT_BODY }}>{patternDetails[pattern].interrupt}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => setActiveContent("crash-course")}
            className="p-5 rounded-md text-left transition-all cursor-pointer"
            style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
            data-testid="card-crash-course-home"
          >
            <FolderOpen className="w-5 h-5 mb-2" style={{ color: COLOR_TEAL }} />
            <h4 className="text-sm font-bold mb-1" style={{ color: COLOR_TEXT, fontFamily: FONT_BODY }}>The Crash Course</h4>
            <p className="text-xs" style={{ color: COLOR_MUTED }}>Your 7-day protocol</p>
          </button>
          <button
            onClick={() => setActiveContent("chat")}
            className="p-5 rounded-md text-left transition-all cursor-pointer"
            style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
            data-testid="card-chat-home"
          >
            <MessageCircle className="w-5 h-5 mb-2" style={{ color: COLOR_TEAL }} />
            <h4 className="text-sm font-bold mb-1" style={{ color: COLOR_TEXT, fontFamily: FONT_BODY }}>Talk to The Archivist</h4>
            <p className="text-xs" style={{ color: COLOR_MUTED }}>AI pattern recognition assistant</p>
          </button>
        </div>
      </div>
    </div>
  );

  const resolveMainContent = () => {
    if (activeContent === "chat") return <ChatPanel />;
    if (activeContent && activeContent !== "chat") return <ContentView />;
    return <HomeView />;
  };

  return (
    <>
      <style>{`
        @keyframes portal-fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: portal-fade-in 0.4s ease-out;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in { animation: none; }
          .emergency-icon-teal, .emergency-icon-pink { animation: none !important; }
        }

        @keyframes subtle-pulse-teal {
          0%, 100% { box-shadow: 0 0 12px rgba(20,184,166,0.2); }
          50% { box-shadow: 0 0 18px rgba(20,184,166,0.35); }
        }
        @keyframes subtle-pulse-pink {
          0%, 100% { box-shadow: 0 0 12px rgba(236,72,153,0.2); }
          50% { box-shadow: 0 0 18px rgba(236,72,153,0.35); }
        }
        .emergency-icon-teal {
          animation: subtle-pulse-teal 3s ease-in-out infinite;
        }
        .emergency-icon-pink {
          animation: subtle-pulse-pink 3s ease-in-out infinite;
          animation-delay: 1.5s;
        }
        .emergency-card-teal:hover {
          box-shadow: 0 0 30px rgba(20,184,166,0.15), inset 0 1px 0 rgba(20,184,166,0.15) !important;
          border-color: rgba(20,184,166,0.8) !important;
          transform: translateY(-1px);
        }
        .emergency-card-pink:hover {
          box-shadow: 0 0 30px rgba(236,72,153,0.15), inset 0 1px 0 rgba(236,72,153,0.15) !important;
          border-color: rgba(236,72,153,0.8) !important;
          transform: translateY(-1px);
        }

        .portal-tooltip-trigger {
          position: relative;
          display: inline-block;
        }
        .portal-tooltip {
          visibility: hidden;
          opacity: 0;
          position: absolute;
          left: 50%;
          bottom: calc(100% + 8px);
          transform: translateX(-50%);
          z-index: 50;
          max-width: 250px;
          min-width: 180px;
          padding: 10px 12px;
          border-radius: 4px;
          background: #1a1a1a;
          border-left: 3px solid ${COLOR_TEAL};
          color: ${COLOR_TEXT};
          font-family: ${FONT_BODY};
          font-size: 13px;
          line-height: 1.5;
          white-space: normal;
          pointer-events: none;
          transition: opacity 0.2s ease-out, visibility 0.2s ease-out;
          transition-delay: 0.3s;
          box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        }
        .portal-tooltip-trigger:hover .portal-tooltip {
          visibility: visible;
          opacity: 1;
        }
      `}</style>
      <div className="h-screen flex flex-col" style={{ background: COLOR_BG, fontFamily: FONT_BODY }}>
        <header className="flex items-center justify-between px-5 h-14 flex-shrink-0" style={{ borderBottom: `1px solid ${CARD_BORDER}`, background: COLOR_BG }}>
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-sm leading-none" style={{ color: COLOR_TEXT }}>
                <span style={{ fontFamily: FONT_PLAYFAIR, fontWeight: 700 }}>Pattern Archive</span>
                <span className="mx-2" style={{ color: COLOR_MUTED }}>/</span>
                <span className="text-xs" style={{ color: COLOR_MUTED, fontFamily: FONT_BODY }}>The Archivist Method</span>
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs hidden sm:block" style={{ color: COLOR_MUTED, fontFamily: FONT_MONO }} data-testid="text-header-email">{userData.email}</span>
            <button 
              onClick={() => setActiveContent("settings")} 
              className="p-2 transition-colors cursor-pointer"
              style={{ color: COLOR_MUTED }}
              data-testid="button-header-settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button 
              onClick={handleLogout} 
              className="p-2 transition-colors cursor-pointer"
              style={{ color: COLOR_MUTED }}
              data-testid="button-header-logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        <div className="hidden md:flex flex-1 overflow-hidden">
          <div className="w-[300px] flex-shrink-0 overflow-hidden">
            <LeftPanel />
          </div>
          <div className="flex-1 overflow-hidden">
            {resolveMainContent()}
          </div>
        </div>

        <div className="flex md:hidden flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden">
            {activeTab === "content" ? (
              activeContent ? (
                activeContent === "chat" ? (
                  <ChatPanel />
                ) : (
                  <div className="h-full overflow-y-auto"><ContentView /></div>
                )
              ) : (
                <div className="h-full overflow-y-auto">
                  <div className="p-4">
                    <div className="mb-4">
                      <p className="text-xs uppercase tracking-[0.2em] mb-2" style={{ color: COLOR_MUTED, fontFamily: FONT_MONO }}>EMERGENCY INTERRUPT</p>
                      <EmergencyInterruptCards />
                    </div>
                  </div>
                  <LeftPanel />
                </div>
              )
            ) : (
              <ChatPanel />
            )}
          </div>
          
          <div className="flex flex-shrink-0" style={{ borderTop: `1px solid ${CARD_BORDER}`, background: COLOR_BG }}>
            <button
              onClick={() => { setActiveTab("content"); setActiveContent(null); }}
              className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors cursor-pointer"
              style={{ color: activeTab === "content" ? COLOR_TEAL : COLOR_MUTED, borderTop: activeTab === "content" ? `2px solid ${COLOR_TEAL}` : "2px solid transparent" }}
              data-testid="tab-content"
            >
              <FolderOpen className="w-4 h-4" />
              Content
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors cursor-pointer"
              style={{ color: activeTab === "chat" ? COLOR_TEAL : COLOR_MUTED, borderTop: activeTab === "chat" ? `2px solid ${COLOR_TEAL}` : "2px solid transparent" }}
              data-testid="tab-archivist"
            >
              <MessageCircle className="w-4 h-4" />
              The Archivist
            </button>
          </div>
        </div>
      </div>

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
