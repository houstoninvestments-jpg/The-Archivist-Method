import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';

// ─── Design tokens (match NewPortal exactly) ──────────────────────
const FONT_HEADING = "'Bebas Neue', sans-serif";
const FONT_MONO    = "'JetBrains Mono', monospace";
const FONT_BODY    = "'Inter', sans-serif";

const C_BG      = "#0A0A0A";
const C_TEAL    = "#00FFC2";
const C_MAGENTA = "#EC4899";
const C_TEXT    = "#F5F5F5";
const C_MUTED   = "#A3A3A3";
const C_DIM     = "#666666";

// ─── Pattern data (mirrors NewPortal) ────────────────────────────
const PATTERN_NAMES: Record<string, string> = {
  disappearing:         "THE DISAPPEARING PATTERN",
  apologyLoop:          "THE APOLOGY LOOP",
  testing:              "THE TESTING PATTERN",
  attractionToHarm:     "ATTRACTION TO HARM",
  complimentDeflection: "COMPLIMENT DEFLECTION",
  drainingBond:         "THE DRAINING BOND",
  successSabotage:      "SUCCESS SABOTAGE",
  perfectionism:        "THE PERFECTIONISM PATTERN",
  rage:                 "THE RAGE PATTERN",
};

const BODY_SIGNATURES: Record<string, string> = {
  disappearing:         "Tightness in chest. Urge to physically leave. Numbness spreading through limbs.",
  apologyLoop:          "Shoulders hunching. Voice getting quieter. Stomach dropping before you speak.",
  testing:              "Restless energy. Scanning for threats. Jaw clenching during calm moments.",
  attractionToHarm:     "Boredom with safety. Excitement with instability. Confusing love with adrenaline.",
  complimentDeflection: "Heat in your face. Urge to look away. Immediate list of why they're wrong.",
  drainingBond:         "Guilt when considering boundaries. Physical heaviness near the person. Exhaustion mistaken for love.",
  successSabotage:      "Anxiety increasing as the deadline approaches. Sudden urge to destroy what you built. Feeling like a fraud.",
  perfectionism:        "Paralysis. Dread. A widening gap between the vision in your head and what's on the page.",
  rage:                 "Heat rising from chest to face. Jaw tight. Pressure building behind your eyes.",
};

const CIRCUIT_BREAKS: Record<string, string> = {
  disappearing:         "When you feel the pull to vanish, name it out loud: 'The pattern is running.' Stay 5 more minutes. That's the interrupt.",
  apologyLoop:          "Catch the 'sorry' before it leaves your mouth. Replace it with a statement: 'I need...' or 'I want...' That's the interrupt.",
  testing:              "When you create a test, ask: 'Am I testing or trusting?' Choose trust for 24 hours. That's the interrupt.",
  attractionToHarm:     "When 'boring' appears, reframe: 'This is what safe feels like.' Sit with safe for one hour. That's the interrupt.",
  complimentDeflection: "When a compliment lands, say only: 'Thank you.' Nothing else. No qualifier. That's the interrupt.",
  drainingBond:         "Ask: 'If a friend described this situation, what would I tell them?' Listen to your own advice. That's the interrupt.",
  successSabotage:      "When the urge to sabotage hits, finish one more step. Just one. Don't evaluate — execute. That's the interrupt.",
  perfectionism:        "Perfectionism is telling you it's not ready. Done is better than perfect. Ship it. That's the interrupt.",
  rage:                 "You feel the anger rising. Don't say anything for 10 seconds. Breathe. That's the interrupt.",
};

// ─── Day content ──────────────────────────────────────────────────
interface Day {
  label: string;
  title: string;
  directive: string;
  body: (pattern: string) => string[];
  taskLabel: string;
  task: string;
}

const DAYS: Day[] = [
  {
    label: "DAY 1",
    title: "FOCUS",
    directive: "See the pattern running.",
    body: (p) => [
      `${PATTERN_NAMES[p] || 'Your pattern'} does not announce itself. It runs in the background — a program executing before you are aware it started.`,
      `Today's work is not to stop it. It is to see it.`,
      `This is the first step. Focus. The pattern cannot be interrupted until it can be observed. You cannot catch what you cannot see.`,
    ],
    taskLabel: "TODAY'S PROTOCOL",
    task: "When you feel any activation today — body tightening, urge to act, familiar dread — say one sentence. Out loud or in writing: \"The pattern is running.\" That is all. Just name it.",
  },
  {
    label: "DAY 2",
    title: "BODY SIGNATURE",
    directive: "Learn your physical tell.",
    body: (_p) => [
      `The pattern always speaks through the body before the mind catches up. By the time you are thinking about what to do, the program has already launched.`,
      `Your body signature is the early warning system. The physical sensations that precede the behavior. Learn them and you gain seconds. Those seconds are everything.`,
      `Read your body signature below. This is your tell. Memorize it.`,
    ],
    taskLabel: "TODAY'S PROTOCOL",
    task: "Read your body signature once now. Read it again before bed. When you feel even one of these sensations today, name it out loud: \"That's the body signature.\" Nothing else required.",
  },
  {
    label: "DAY 3",
    title: "THE ORIGINAL ROOM",
    directive: "Find where the program was installed.",
    body: (_p) => [
      `Between the ages of 2 and 12, your brain encountered a threat. It wrote a survival program. The program worked — you survived. But the program never updated.`,
      `You are now an adult running a child's code.`,
      `The Original Room is the moment of installation. The first time the pattern ran. You don't need to relive it. You need to locate it. Name it. Then close the file.`,
    ],
    taskLabel: "TODAY'S PROTOCOL",
    task: "Ask yourself one question: When did I first need this pattern to survive? You have 10 seconds to answer. Write whatever comes first. Do not edit it. Do not analyze it. That is the room.",
  },
  {
    label: "DAY 4",
    title: "THE 3-7 SECOND WINDOW",
    directive: "Find the gap.",
    body: (_p) => [
      `Between the trigger and the behavior, there is a window. Research places it at 3 to 7 seconds. In that window, the pattern has launched but behavior has not yet locked in.`,
      `That gap is where interruption is possible. Everything in this system is built to operate inside that window.`,
      `Today you learn to find it. Not to use it yet. Just to feel it exist.`,
    ],
    taskLabel: "TODAY'S PROTOCOL",
    task: "The next time you feel your body signature, count internally: one, two, three. Notice that the urge has not disappeared — but it has not won either. You just found the window.",
  },
  {
    label: "DAY 5",
    title: "CIRCUIT BREAK REHEARSAL",
    directive: "Say it out loud. Right now.",
    body: (_p) => [
      `The circuit break is a verbal interrupt. A specific sentence you say at the moment of activation. It works because it forces the prefrontal cortex to re-engage. You cannot run automatic behavior and deliberate language simultaneously.`,
      `This only works if you have rehearsed it before you need it. Athletes practice on rest days. You practice on pattern-quiet days.`,
      `Your circuit break is below. Read it. Then say it out loud.`,
    ],
    taskLabel: "TODAY'S PROTOCOL",
    task: "Say your circuit break out loud three times right now. Not in your head. Out loud. Then say it once before bed. You are building the muscle memory that will be available in the 3-7 second window.",
  },
  {
    label: "DAY 6",
    title: "LIVE ACTIVATION",
    directive: "Catch one in real time.",
    body: (_p) => [
      `Days 1 through 5 were preparation. Today is the field test.`,
      `You are not trying to stop the pattern perfectly. You are not trying to be different than you are. You are trying to catch one activation — body signature, window, circuit break — in sequence.`,
      `Once. That is the entire mission today.`,
    ],
    taskLabel: "TODAY'S PROTOCOL",
    task: "When the pattern activates today: name the body signature, count to three, say the circuit break. One attempt. Whether it works or not is not the point. The catch is the point.",
  },
  {
    label: "DAY 7",
    title: "FIRST INTERRUPT",
    directive: "The pattern ran. You caught it.",
    body: (_p) => [
      `Seven days ago you could not see the pattern while it ran. You could only see it after — in the wreckage, the apology, the withdrawal, the regret.`,
      `Now you have a name for it. A body signature. An Original Room. A window. A circuit break.`,
      `One successful interrupt is proof the pattern can be broken. Not healed. Not processed. Interrupted.`,
    ],
    taskLabel: "YOUR NEXT STEP",
    task: "The 7-day protocol is complete. The pattern has been running for years. One week of awareness is the foundation — not the finish line. The Field Guide is 90 days. Your pattern. Full depth. One permanent interrupt at a time.",
  },
];

// ─── Shared UI ────────────────────────────────────────────────────
function Divider() {
  return (
    <div style={{
      width: '100%',
      height: '1px',
      background: C_TEAL,
      opacity: 0.2,
      margin: '24px 0',
    }} />
  );
}

function Label({ children, color = C_TEAL }: { children: React.ReactNode; color?: string }) {
  return (
    <p style={{
      fontFamily: FONT_MONO,
      fontSize: '10px',
      color,
      margin: '0 0 8px',
      letterSpacing: '0.15em',
      textTransform: 'uppercase',
    }}>
      {children}
    </p>
  );
}

function BlinkingCursor() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setVisible(v => !v), 530);
    return () => clearInterval(t);
  }, []);
  return (
    <span style={{
      display: 'inline-block',
      width: '0.55em',
      height: '1em',
      background: visible ? C_TEAL : 'transparent',
      verticalAlign: 'text-bottom',
      marginLeft: '4px',
    }} />
  );
}

// ─── Day nav tabs ─────────────────────────────────────────────────
function DayNav({ currentDay, completedThrough, onSelect }: {
  currentDay: number;
  completedThrough: number;
  onSelect: (d: number) => void;
}) {
  return (
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '32px' }}>
      {DAYS.map((d, i) => {
        const dayNum = i + 1;
        const isActive = currentDay === dayNum;
        const isComplete = dayNum <= completedThrough;
        return (
          <button
            key={dayNum}
            onClick={() => onSelect(dayNum)}
            style={{
              fontFamily: FONT_MONO,
              fontSize: '11px',
              letterSpacing: '0.08em',
              padding: '6px 12px',
              borderRadius: '2px',
              border: isActive ? `1px solid ${C_TEAL}` : isComplete ? `1px solid #2a2a2a` : `1px solid #1a1a1a`,
              background: isActive ? C_TEAL : 'transparent',
              color: isActive ? '#000' : isComplete ? C_MUTED : C_DIM,
              cursor: 'pointer',
            }}
          >
            {isComplete && !isActive ? '✓ ' : ''}{d.label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Day 7 upgrade screen ─────────────────────────────────────────
function UpgradeScreen({ pattern }: { pattern: string }) {
  const [, navigate] = useLocation();
  return (
    <div style={{ animation: 'fadeIn 0.6s ease forwards' }}>
      <p style={{ fontFamily: FONT_MONO, fontSize: '10px', color: C_DIM, margin: '0 0 24px', letterSpacing: '0.15em' }}>
        PROTOCOL COMPLETE — DAY 7 OF 7
      </p>

      <p style={{ fontFamily: FONT_HEADING, fontSize: 'clamp(40px, 10vw, 64px)', color: C_TEAL, margin: '0 0 0', letterSpacing: '0.03em', lineHeight: 1 }}>
        YOU INTERRUPTED
      </p>
      <p style={{ fontFamily: FONT_HEADING, fontSize: 'clamp(40px, 10vw, 64px)', color: C_TEXT, margin: '0 0 32px', letterSpacing: '0.03em', lineHeight: 1 }}>
        THE PATTERN.
      </p>

      <Divider />

      <p style={{ fontFamily: FONT_BODY, fontSize: '15px', color: C_MUTED, margin: '0 0 12px', lineHeight: 1.75 }}>Once.</p>
      <p style={{ fontFamily: FONT_BODY, fontSize: '15px', color: C_MUTED, margin: '0 0 12px', lineHeight: 1.75 }}>
        That took 7 days of attention and one moment of choice.
      </p>
      <p style={{ fontFamily: FONT_BODY, fontSize: '15px', color: C_MUTED, margin: '0 0 32px', lineHeight: 1.75 }}>
        {PATTERN_NAMES[pattern] || 'The pattern'} has been running for years.
      </p>

      <Divider />

      <Label>THE FIELD GUIDE — 90 DAYS</Label>
      <p style={{ fontFamily: FONT_BODY, fontSize: '15px', color: C_TEXT, margin: '0 0 8px', lineHeight: 1.75 }}>
        Your pattern. Full depth. One permanent interrupt at a time.
      </p>
      <p style={{ fontFamily: FONT_BODY, fontSize: '15px', color: C_MUTED, margin: '0 0 32px', lineHeight: 1.75 }}>
        $67. One time. Yours forever.
      </p>

      <a
        href="/checkout?product=quickstart"
        style={{
          display: 'block',
          width: '100%',
          background: C_MAGENTA,
          color: '#fff',
          fontFamily: FONT_HEADING,
          fontSize: '18px',
          letterSpacing: '0.15em',
          textAlign: 'center',
          padding: '18px',
          borderRadius: '2px',
          textDecoration: 'none',
          marginBottom: '16px',
          boxSizing: 'border-box',
        }}
      >
        CONTINUE THE WORK — $67 →
      </a>

      <button
        onClick={() => navigate('/portal')}
        style={{
          display: 'block',
          width: '100%',
          background: 'transparent',
          color: C_DIM,
          fontFamily: FONT_MONO,
          fontSize: '11px',
          letterSpacing: '0.12em',
          textAlign: 'center',
          padding: '12px',
          border: '1px solid #1a1a1a',
          borderRadius: '2px',
          cursor: 'pointer',
          boxSizing: 'border-box',
        }}
      >
        RETURN TO FILE
      </button>
    </div>
  );
}

// ─── Single day view ──────────────────────────────────────────────
function DayView({ dayIndex, pattern, completedThrough, onComplete }: {
  dayIndex: number;
  pattern: string;
  completedThrough: number;
  onComplete: () => void;
}) {
  const day = DAYS[dayIndex];
  const dayNum = dayIndex + 1;
  const isCompleted = dayNum <= completedThrough;
  const isDay7 = dayNum === 7;
  const bodyText = day.body(pattern);
  const showBodySig = dayIndex === 1;
  const showCircuitBreak = dayIndex === 4;

  return (
    <div style={{ animation: 'fadeIn 0.4s ease forwards' }}>

      <p style={{ fontFamily: FONT_MONO, fontSize: '10px', color: C_DIM, margin: '0 0 8px', letterSpacing: '0.15em' }}>
        {day.label} — {PATTERN_NAMES[pattern] || 'YOUR PATTERN'} <BlinkingCursor />
      </p>

      <p style={{ fontFamily: FONT_HEADING, fontSize: 'clamp(36px, 9vw, 52px)', color: C_TEXT, margin: '0 0 4px', letterSpacing: '0.03em', lineHeight: 1.05 }}>
        {day.title}
      </p>

      <p style={{ fontFamily: FONT_MONO, fontSize: '12px', color: C_TEAL, margin: '0 0 28px', letterSpacing: '0.08em' }}>
        {day.directive}
      </p>

      <Divider />

      {bodyText.map((para, i) => (
        <p key={i} style={{ fontFamily: FONT_BODY, fontSize: '15px', color: C_MUTED, margin: '0 0 16px', lineHeight: 1.75 }}>
          {para}
        </p>
      ))}

      {showBodySig && BODY_SIGNATURES[pattern] && (
        <div style={{ border: `1px solid ${C_TEAL}`, borderRadius: '2px', padding: '20px', margin: '8px 0 24px', background: 'rgba(0,255,194,0.04)' }}>
          <Label>BODY SIGNATURE — {PATTERN_NAMES[pattern] || 'YOUR PATTERN'}</Label>
          <p style={{ fontFamily: FONT_BODY, fontSize: '15px', color: C_TEXT, margin: 0, lineHeight: 1.75 }}>
            {BODY_SIGNATURES[pattern]}
          </p>
        </div>
      )}

      {showCircuitBreak && CIRCUIT_BREAKS[pattern] && (
        <div style={{ border: `1px solid ${C_MAGENTA}`, borderRadius: '2px', padding: '20px', margin: '8px 0 24px', background: 'rgba(236,72,153,0.04)' }}>
          <Label color={C_MAGENTA}>CIRCUIT BREAK — {PATTERN_NAMES[pattern] || 'YOUR PATTERN'}</Label>
          <p style={{ fontFamily: FONT_BODY, fontSize: '15px', color: C_TEXT, fontStyle: 'italic', margin: 0, lineHeight: 1.75 }}>
            {CIRCUIT_BREAKS[pattern]}
          </p>
        </div>
      )}

      <Divider />

      <Label>{day.taskLabel}</Label>
      <p style={{ fontFamily: FONT_BODY, fontSize: '15px', color: C_TEXT, margin: '0 0 32px', lineHeight: 1.75, borderLeft: `2px solid ${C_TEAL}`, paddingLeft: '16px' }}>
        {day.task}
      </p>

      {!isCompleted && (
        <button
          onClick={onComplete}
          style={{
            display: 'block',
            width: '100%',
            background: C_TEAL,
            color: '#000',
            fontFamily: FONT_HEADING,
            fontSize: '17px',
            letterSpacing: '0.15em',
            border: 'none',
            borderRadius: '2px',
            padding: '16px',
            cursor: 'pointer',
            marginBottom: '16px',
            boxSizing: 'border-box',
          }}
        >
          {isDay7 ? 'COMPLETE THE PROTOCOL →' : 'MARK COMPLETE — NEXT DAY →'}
        </button>
      )}

      {isCompleted && (
        <p style={{ fontFamily: FONT_MONO, fontSize: '11px', color: C_TEAL, letterSpacing: '0.1em', margin: '0 0 16px' }}>
          ✓ COMPLETE
        </p>
      )}
    </div>
  );
}

// ─── Loading ──────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div style={{ minHeight: '100vh', background: C_BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <BlinkingCursor />
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────
export default function CrashCourse() {
  const [, navigate] = useLocation();
  const [loading, setLoading]            = useState(true);
  const [pattern, setPattern]            = useState<string>('');
  const [completedThrough, setCompleted] = useState(0);
  const [currentDay, setCurrentDay]      = useState(1);
  const [showUpgrade, setShowUpgrade]    = useState(false);

  useEffect(() => {
    fetch('/api/portal/crash-course/status', { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error('unauthorized');
        return res.json();
      })
      .then(data => {
        setPattern(data.primaryPattern || '');
        const day = data.crashCourseDay || 0;
        setCompleted(day);
        if (day >= 7) {
          setCurrentDay(7);
          setShowUpgrade(true);
        } else {
          setCurrentDay(Math.max(1, day + 1));
        }
        setLoading(false);
      })
      .catch(() => navigate('/portal/login'));
  }, []);

  const handleComplete = async () => {
    try {
      await fetch('/api/portal/crash-course/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ day: currentDay }),
      });
    } catch (_) { /* non-fatal */ }

    setCompleted(prev => Math.max(prev, currentDay));

    if (currentDay === 7) {
      setShowUpgrade(true);
    } else {
      setCurrentDay(prev => prev + 1);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div style={{ minHeight: '100vh', background: C_BG, padding: '40px 20px 80px' }}>
      <div style={{ maxWidth: '480px', margin: '0 auto' }}>

        {/* Top nav */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
          <p style={{ fontFamily: FONT_MONO, fontSize: '10px', color: C_DIM, margin: 0, letterSpacing: '0.15em' }}>
            THE ARCHIVIST METHOD // CRASH COURSE
          </p>
          <button
            onClick={() => navigate('/portal')}
            style={{ fontFamily: FONT_MONO, fontSize: '10px', color: C_DIM, background: 'transparent', border: 'none', cursor: 'pointer', letterSpacing: '0.1em' }}
          >
            ← FILE
          </button>
        </div>

        {!showUpgrade && (
          <DayNav
            currentDay={currentDay}
            completedThrough={completedThrough}
            onSelect={setCurrentDay}
          />
        )}

        {showUpgrade ? (
          <UpgradeScreen pattern={pattern} />
        ) : (
          <DayView
            key={currentDay}
            dayIndex={currentDay - 1}
            pattern={pattern}
            completedThrough={completedThrough}
            onComplete={handleComplete}
          />
        )}

      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
