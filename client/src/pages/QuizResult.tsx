import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { PatternKey, patternDisplayNames, QuizResult as QuizResultType, calculateMatchPercent } from '@/lib/quizData';

const feelSeenCopy: Record<PatternKey, string[]> = {
  disappearing: [
    "You leave before they can leave you. Three months in and your chest gets tight. You feel the walls closing. You're already planning your exit before they even know something's wrong.",
    "It's not that you don't care. You care so much it terrifies you. So you run. Every time."
  ],
  apologyLoop: [
    "Sorry. Sorry. Sorry. You apologize for asking. For needing. For taking up space. You make yourself small before anyone can tell you you're too much.",
    "You've turned \"sorry\" into a reflex. It leaves your mouth before you even know why. And every time, you shrink a little more."
  ],
  testing: [
    "You don't ask if they love you. You make them prove it. You pick fights at midnight. You push them away to see if they'll fight to stay.",
    "You already know how it ends. They leave. And part of you is relieved\u2014because at least you were right."
  ],
  attractionToHarm: [
    "The safe ones bore you. The red flags feel like chemistry. You know they're bad for you\u2014that's what makes it exciting.",
    "You've confused danger with desire so many times you don't know the difference anymore. Calm feels suspicious. Chaos feels like home."
  ],
  complimentDeflection: [
    "\"You're so talented.\" You flinch. You deflect. You explain why it wasn't that good. Visibility feels dangerous. Being seen feels like being a target.",
    "You've gotten so good at disappearing in plain sight that people don't even notice when you leave the room."
  ],
  drainingBond: [
    "You know you should leave. Everyone tells you to leave. Your body tells you to leave. You stay. The guilt of going feels worse than the pain of staying.",
    "You've forgotten what it feels like to have energy for yourself. Everything goes to them. Everything."
  ],
  successSabotage: [
    "You get close. Then you blow it up. Right before the win, something in you pulls the pin. You're not afraid of failure\u2014you're afraid of what happens if you actually succeed.",
    "You've snatched defeat from victory so many times it almost feels intentional. Because it is. You just don't know why yet."
  ],
  perfectionism: [
    "If it's not perfect, it's garbage. So you tweak endlessly. Or you don't start at all. You're not lazy\u2014you're terrified of the gap between your vision and your output.",
    "You have a graveyard of almost-finished things. Years of work no one has ever seen. Not because it isn't good\u2014because it isn't perfect."
  ],
  rage: [
    "It comes fast. One second you're fine, the next you're saying things you can't take back. The anger takes over. Afterward, you barely recognize who that was.",
    "The shame hits harder than the anger ever did. You promise it won't happen again. Until it does."
  ],
};

const breadcrumbData: Record<PatternKey, { triggers: string; costs: string; whyWillpowerFails: string }> = {
  disappearing: {
    triggers: "Intimacy crosses a threshold. Someone gets close enough to actually see you. Three months in, the chest tightens. You feel the walls before you even know you're building them.",
    costs: "Every relationship has an expiration date you set before it starts. You've lost people who actually loved you. The loneliness isn't the worst part\u2014it's knowing you chose it.",
    whyWillpowerFails: "You can't just decide to stay. The exit reflex is wired into your nervous system. It fires before your conscious mind even registers what's happening. Willpower can't outrun a survival response.",
  },
  apologyLoop: {
    triggers: "Having a need. Taking up space. Saying something that lands wrong. Existing too loudly. The trigger is almost anything\u2014because the real trigger is visibility itself.",
    costs: "You've made yourself so small that people forget you're in the room. Your needs go unmet because you never voice them. Resentment builds in the silence you created.",
    whyWillpowerFails: "You can't just stop apologizing. The reflex is a survival strategy from when making yourself small kept you safe. Your body still believes that being seen is dangerous.",
  },
  testing: {
    triggers: "Someone says they love you. Things get too good. Too stable. Too safe. Your nervous system reads peace as the calm before the storm\u2014so you create the storm yourself.",
    costs: "You've driven away people who meant it. Every test has an expiration date, and eventually, they stop trying to pass. Then you point to their leaving as proof you were right.",
    whyWillpowerFails: "The testing isn't a choice\u2014it's a compulsion. Your attachment system is wired to expect abandonment, so it manufactures evidence. You can't think your way out of a nervous system pattern.",
  },
  attractionToHarm: {
    triggers: "Safety. Boredom. The absence of chaos. When things are calm, your body reads it as wrong. The dangerous ones feel like electricity because your nervous system confused threat with connection early.",
    costs: "Your body is a map of relationships that hurt you. You've normalized pain as the price of passion. The safe ones never stood a chance\u2014not because they weren't enough, but because enough felt like nothing.",
    whyWillpowerFails: "You can't just choose the safe person. Your attraction template was written before you had language. Chemistry isn't a preference\u2014it's a trauma signature. The pull toward harm feels like desire because that's how your brain learned love.",
  },
  complimentDeflection: {
    triggers: "Someone sees you. Really sees you. A compliment. Recognition. Being put in the spotlight. Your body reads visibility as exposure, and exposure as danger.",
    costs: "Years of work no one has seen. Promotions you didn't apply for. Relationships you ended because being known felt like being hunted. You've hidden from the very thing you want most.",
    whyWillpowerFails: "You can't force yourself to accept praise. The deflection is a reflex, not a decision. Your nervous system learned early that being seen made you a target. Until you rewire that association, willpower just creates a performance of acceptance.",
  },
  drainingBond: {
    triggers: "Guilt. Obligation. The look on their face when you consider leaving. The voice that says you're the only one who understands them. You stay because leaving feels like destroying someone.",
    costs: "You've given yourself away in pieces until there's nothing left. Your health, your friendships, your ambitions\u2014all sacrificed on the altar of someone else's need. You forgot what you wanted years ago.",
    whyWillpowerFails: "The bond isn't rational\u2014it's biochemical. Trauma bonds hijack the same reward pathways as addiction. Your brain gets withdrawal symptoms when you try to leave. Willpower can't override chemistry.",
  },
  successSabotage: {
    triggers: "The finish line. The moment right before the win. The promotion. The relationship that's actually working. Success itself is the trigger\u2014because your system doesn't have a template for what comes after.",
    costs: "A trail of almost-victories. Jobs you left at the worst time. Relationships you detonated right when they got good. You've built a life-sized monument to the gap between your potential and your reality.",
    whyWillpowerFails: "The sabotage happens at the neurological level. Your identity was formed around struggle, not success. When you get close to the win, your brain treats it as an identity threat. You can't willpower yourself into becoming someone your nervous system doesn't recognize.",
  },
  perfectionism: {
    triggers: "The gap between your vision and your output. The first draft. The imperfect attempt. Starting something where failure is possible. Your standards are the cage\u2014impossibly high, perfectly designed to keep you frozen.",
    costs: "Years of unfinished work. Ideas that never left your head. The ache of watching less talented people succeed because they shipped while you perfected. You're not protecting quality\u2014you're protecting yourself from judgment.",
    whyWillpowerFails: "You can't just lower your standards. Perfectionism isn't about quality\u2014it's about control. It's the illusion that if you make it perfect enough, no one can hurt you. The real fear isn't imperfection. It's being seen as you actually are.",
  },
  rage: {
    triggers: "Disrespect. Feeling unheard. Boundaries crossed. The trigger is almost never the thing that sets it off\u2014it's the accumulation of everything you swallowed before. The explosion comes when the pressure exceeds your capacity to contain it.",
    costs: "Relationships ended in a single conversation. Words you can never take back. The look on their face that you see every time you close your eyes. The shame spiral that follows is worse than whatever triggered the rage.",
    whyWillpowerFails: "The rage bypasses your prefrontal cortex entirely. By the time you're aware you're angry, your amygdala has already hijacked the controls. Willpower works in the calm moments\u2014not in the 3-7 second window where the pattern fires.",
  },
};

const circuitBreakData: Record<PatternKey, string> = {
  disappearing: "When the chest tightens and your hand reaches for the exit — stop. Put both feet flat on the floor. Name one thing you can see, one thing you can hear. You're not leaving yet. You're just standing still for ten seconds. That's the entire protocol: don't move until the wave passes.",
  apologyLoop: "Next time 'sorry' rises in your throat — hold it for five seconds. Replace it with what you actually mean: 'Thank you for waiting,' 'I have a question,' 'I need something.' The apology is a shield. Put it down once and feel what happens when you take up the space you already deserve.",
  testing: "The next time you feel the urge to test someone — text them something honest instead. Not a trap. Not a riddle. One true sentence: 'I'm scared you'll leave.' The test is a question you already know the answer to. Ask the real one instead.",
  attractionToHarm: "When the dangerous one lights you up — pause. Put your hand on your sternum and say: 'This is recognition, not love.' Your body learned to call alarm bells chemistry. Name the sensation for what it is. Familiar is not the same as safe.",
  complimentDeflection: "Next time someone compliments you, do not speak for three seconds. Let the words land. Don't deflect, don't explain, don't minimize. Just say 'Thank you' — and sit in the discomfort of being seen. The flinch will come. Let it pass through you without acting on it.",
  drainingBond: "Set one boundary this week that costs you nothing but guilt. 'I can't talk after 10pm.' That's it. Say it once. Don't explain. Don't apologize. The guilt you feel is the pattern fighting to survive — it is not evidence that you're a bad person.",
  successSabotage: "The next time something goes well — do nothing. Don't celebrate, don't deflect, don't blow it up. Just sit with the win for sixty seconds and notice what your body does. The itch to sabotage is loudest right after success. Name it: 'There's the pull.' Then don't follow it.",
  perfectionism: "Finish one thing at 80%. Send it, post it, ship it — before the revision voice kicks in. Set a timer for the amount of work left and when it rings, you're done. The gap between your vision and your output is not a flaw. It's where the work lives.",
  rage: "When you feel the heat rising — before you speak, press your tongue to the roof of your mouth and exhale through your nose for four seconds. You have a three-to-seven-second window before the pattern takes the wheel. This one breath is the entire gap. Use it.",
};

export default function QuizResult() {
  const [location, setLocation] = useLocation();
  const [phase, setPhase] = useState<'reveal' | 'confirmed' | 'secondPattern' | 'manualSelect'>('reveal');
  const [confirmedPattern, setConfirmedPattern] = useState<PatternKey | null>(null);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [fadeIn, setFadeIn] = useState(false);
  const [breadcrumbsVisible, setBreadcrumbsVisible] = useState(false);
  const [microWinVisible, setMicroWinVisible] = useState(false);
  const [gateVisible, setGateVisible] = useState(false);

  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const resultData = searchParams.get('data');

  let result: QuizResultType | null = null;
  try {
    if (resultData) {
      result = JSON.parse(decodeURIComponent(resultData));
    }
  } catch {}

  const primaryPattern = (result?.primaryPattern || localStorage.getItem('quizResultPattern') || '') as PatternKey;

  const scores = result?.scores || (() => {
    try {
      const cached = localStorage.getItem('quizScores');
      return cached ? JSON.parse(cached) : null;
    } catch { return null; }
  })();

  const sortedPatterns = scores
    ? (Object.entries(scores) as [PatternKey, number][])
        .sort((a, b) => b[1] - a[1])
        .filter(([_, score]) => score > 0)
        .map(([pattern]) => pattern)
    : [primaryPattern];

  const secondPattern = sortedPatterns.length > 1 ? sortedPatterns[1] : null;

  const currentPattern = phase === 'secondPattern' && secondPattern ? secondPattern : primaryPattern;
  const currentName = patternDisplayNames[currentPattern] || '';
  const currentCopy = feelSeenCopy[currentPattern] || [];

  const patternScore = (scores?.[currentPattern] as number) || 0;
  const totalAnswered = scores ? (Object.values(scores) as number[]).reduce((a, b) => a + b, 0) : 0;
  const matchPct = calculateMatchPercent(patternScore, totalAnswered);

  useEffect(() => {
    const t = setTimeout(() => setFadeIn(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase === 'confirmed') {
      const t1 = setTimeout(() => setBreadcrumbsVisible(true), 300);
      const t2 = setTimeout(() => setMicroWinVisible(true), 600);
      const t3 = setTimeout(() => setGateVisible(true), 1100);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }
  }, [phase]);

  const handleConfirm = (pattern: PatternKey) => {
    setConfirmedPattern(pattern);
    setPhase('confirmed');
  };

  const handleNotQuite = () => {
    if ((phase === 'reveal' || phase === 'secondPattern') && secondPattern && phase !== 'secondPattern') {
      setPhase('secondPattern');
    } else {
      setPhase('manualSelect');
    }
  };

  const handleManualSelect = (pattern: PatternKey) => {
    setConfirmedPattern(pattern);
    setPhase('confirmed');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    const finalPattern = confirmedPattern || primaryPattern;
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email,
          primaryPattern: finalPattern,
          secondaryPatterns: result?.secondaryPatterns || [],
          patternScores: result?.scores || {},
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save results');
      }

      const data = await response.json();

      localStorage.setItem('quizResultPattern', finalPattern);
      localStorage.setItem('userEmail', email);
      if (result?.scores) {
        localStorage.setItem('quizScores', JSON.stringify(result.scores));
      }

      setLocation('/portal');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setSubmitting(false);
    }
  };

  if (!primaryPattern || !patternDisplayNames[primaryPattern]) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0A0A0A' }}>
        <div className="text-center">
          <p style={{ color: '#999', marginBottom: '16px' }}>No pattern data found.</p>
          <button
            onClick={() => setLocation('/quiz')}
            style={{ color: '#14B8A6', cursor: 'pointer', background: 'none', border: 'none' }}
            data-testid="link-retake-quiz"
          >
            Take the Quiz
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'manualSelect') {
    const allPatterns: PatternKey[] = [
      'disappearing', 'apologyLoop', 'testing', 'attractionToHarm',
      'complimentDeflection', 'drainingBond', 'successSabotage', 'perfectionism', 'rage'
    ];

    return (
      <div className="min-h-screen" style={{ background: '#0A0A0A' }}>
        <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
          <div className="text-center mb-12">
            <p
              data-testid="text-manual-select-label"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: '#14B8A6',
                marginBottom: '24px',
              }}
            >
              SELECT YOUR PATTERN
            </p>
            <h2
              style={{
                fontFamily: "'Schibsted Grotesk', sans-serif",
                fontWeight: 900,
                textTransform: 'uppercase',
                color: 'white',
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                marginBottom: '12px',
              }}
            >
              Which pattern do you recognize?
            </h2>
            <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: '#999', fontSize: '1rem' }}>
              Select the one that lives in your body.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allPatterns.map((pattern, i) => (
              <button
                key={pattern}
                data-testid={`pattern-card-${pattern}`}
                onClick={() => handleManualSelect(pattern)}
                className="text-left results-pattern-card"
                style={{
                  animationDelay: `${i * 50}ms`,
                  background: '#111',
                  border: '1px solid #1a1a1a',
                  borderRadius: '16px',
                  padding: '24px',
                  cursor: 'pointer',
                  transition: 'border-color 200ms ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(20, 184, 166, 0.5)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1a1a1a'; }}
              >
                <h3
                  style={{
                    fontFamily: "'Schibsted Grotesk', sans-serif",
                    fontWeight: 700,
                    color: 'white',
                    fontSize: '0.95rem',
                    marginBottom: '8px',
                  }}
                >
                  {patternDisplayNames[pattern]}
                </h3>
                <p
                  style={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    color: '#999',
                    fontSize: '0.85rem',
                    lineHeight: 1.5,
                  }}
                >
                  {feelSeenCopy[pattern]?.[0]?.slice(0, 120)}...
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const crumbs = breadcrumbData[confirmedPattern || currentPattern];

  return (
    <div className="min-h-screen" style={{ background: '#0A0A0A' }}>

      {/* SECTION 1 — The Reveal */}
      <section className="flex items-center justify-center px-4" style={{ minHeight: '100vh' }}>
        <div
          className="max-w-xl w-full text-center"
          style={{
            opacity: fadeIn ? 1 : 0,
            transform: fadeIn ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          <p
            data-testid="text-pattern-label"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: '#14B8A6',
              marginBottom: '24px',
            }}
          >
            PATTERN IDENTIFIED
          </p>

          <p
            data-testid="text-match-percent"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
              color: '#14B8A6',
              fontWeight: 700,
              marginBottom: '16px',
            }}
          >
            {matchPct}%
          </p>

          <h1
            data-testid="text-pattern-name"
            style={{
              fontFamily: "'Schibsted Grotesk', sans-serif",
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 900,
              textTransform: 'uppercase',
              color: 'white',
              marginBottom: '20px',
              lineHeight: 1.1,
            }}
          >
            {currentName}
          </h1>

          <div
            style={{
              width: '80px',
              height: '2px',
              background: '#14B8A6',
              margin: '0 auto 32px',
            }}
          />

          <div style={{ marginBottom: '32px' }}>
            {currentCopy.map((paragraph, i) => (
              <p
                key={i}
                style={{
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: '1.1rem',
                  color: '#ccc',
                  lineHeight: 1.7,
                  maxWidth: '550px',
                  margin: '0 auto 16px',
                }}
              >
                {paragraph}
              </p>
            ))}
          </div>

          <p
            data-testid="text-closing-line"
            style={{
              fontFamily: "'Libre Baskerville', serif",
              fontStyle: 'italic',
              fontSize: '1.1rem',
              color: '#14B8A6',
              maxWidth: '550px',
              margin: '0 auto 40px',
              lineHeight: 1.6,
            }}
          >
            You've been running this pattern longer than you think. And there's a reason it still works on you.
          </p>

          {phase !== 'confirmed' && (
            <div className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap">
              <button
                data-testid="button-yes"
                onClick={() => handleConfirm(currentPattern)}
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '13px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  border: '1px solid rgba(20, 184, 166, 0.5)',
                  background: 'transparent',
                  color: 'white',
                  padding: '14px 36px',
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                  borderRadius: '2px',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#14B8A6'; e.currentTarget.style.background = 'rgba(20, 184, 166, 0.08)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(20, 184, 166, 0.5)'; e.currentTarget.style.background = 'transparent'; }}
              >
                Yes, that's me
              </button>
              <button
                data-testid="button-not-quite"
                onClick={handleNotQuite}
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '13px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  background: 'transparent',
                  color: '#999',
                  padding: '14px 36px',
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                  borderRadius: '2px',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.color = 'white'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = '#999'; }}
              >
                Not quite
              </button>
            </div>
          )}

          <div style={{ marginTop: '32px' }} className="text-center">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I just discovered my ${currentName} pattern with The Archivist Method. It named something I've never been able to explain. thearchivistmethod.com`)}`}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="button-share-pattern"
              style={{
                display: 'inline-block',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                border: '1px solid rgba(20, 184, 166, 0.4)',
                background: 'transparent',
                color: '#14B8A6',
                padding: '10px 24px',
                cursor: 'pointer',
                transition: 'all 200ms ease',
                borderRadius: '2px',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#14B8A6'; e.currentTarget.style.background = 'rgba(20, 184, 166, 0.08)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(20, 184, 166, 0.4)'; e.currentTarget.style.background = 'transparent'; }}
            >
              Share Your Pattern
            </a>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#666', marginTop: '8px' }}>
              Share anonymously — no name, just your pattern.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2 — Breadcrumbs (3 bento cards) */}
      {phase === 'confirmed' && crumbs && (
        <section
          className="px-4 py-16 md:py-24"
          style={{
            opacity: breadcrumbsVisible ? 1 : 0,
            transform: breadcrumbsVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div
                data-testid="card-breadcrumb-triggers"
                style={{
                  background: '#111',
                  border: '1px solid #1a1a1a',
                  borderRadius: '16px',
                  padding: '32px',
                }}
              >
                <p
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em',
                    color: '#14B8A6',
                    marginBottom: '16px',
                  }}
                >
                  WHAT TRIGGERS IT
                </p>
                <p
                  style={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    color: '#ccc',
                    fontSize: '0.95rem',
                    lineHeight: 1.7,
                  }}
                >
                  {crumbs.triggers}
                </p>
              </div>

              <div
                data-testid="card-breadcrumb-costs"
                style={{
                  background: '#111',
                  border: '1px solid #1a1a1a',
                  borderRadius: '16px',
                  padding: '32px',
                }}
              >
                <p
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em',
                    color: '#EC4899',
                    marginBottom: '16px',
                  }}
                >
                  WHAT IT COSTS YOU
                </p>
                <p
                  style={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    color: '#ccc',
                    fontSize: '0.95rem',
                    lineHeight: 1.7,
                  }}
                >
                  {crumbs.costs}
                </p>
              </div>

              <div
                data-testid="card-breadcrumb-willpower"
                style={{
                  background: '#111',
                  border: '1px solid #1a1a1a',
                  borderRadius: '16px',
                  padding: '32px',
                }}
              >
                <p
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em',
                    color: 'white',
                    marginBottom: '16px',
                  }}
                >
                  WHY WILLPOWER FAILS
                </p>
                <p
                  style={{
                    fontFamily: "'Source Sans 3', sans-serif",
                    color: '#ccc',
                    fontSize: '0.95rem',
                    lineHeight: 1.7,
                  }}
                >
                  {crumbs.whyWillpowerFails}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 2.5 — Micro-Win Circuit Break */}
      {phase === 'confirmed' && confirmedPattern && circuitBreakData[confirmedPattern] && (
        <section
          className="px-4 py-16 md:py-24"
          style={{
            opacity: microWinVisible ? 1 : 0,
            transform: microWinVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          <div className="max-w-xl mx-auto text-center">
            <p
              data-testid="text-circuit-break-label"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: '#14B8A6',
                marginBottom: '24px',
              }}
            >
              COMPLIMENTARY CIRCUIT BREAK
            </p>

            <h2
              data-testid="text-circuit-break-headline"
              style={{
                fontFamily: "'Schibsted Grotesk', sans-serif",
                fontWeight: 900,
                textTransform: 'uppercase',
                color: 'white',
                fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
                lineHeight: 1.2,
                marginBottom: '28px',
              }}
            >
              Here's one thing you can do the moment you feel it.
            </h2>

            <div
              data-testid="card-circuit-break"
              style={{
                background: '#111',
                border: '1px solid #1a1a1a',
                borderRadius: '16px',
                padding: '32px',
                textAlign: 'left',
                marginBottom: '28px',
              }}
            >
              <p
                data-testid="text-circuit-break-technique"
                style={{
                  fontFamily: "'Source Sans 3', sans-serif",
                  color: '#ccc',
                  fontSize: '1.05rem',
                  lineHeight: 1.75,
                }}
              >
                {circuitBreakData[confirmedPattern]}
              </p>
            </div>

            <p
              data-testid="text-circuit-break-teaser"
              style={{
                fontFamily: "'Libre Baskerville', serif",
                fontStyle: 'italic',
                fontSize: '0.95rem',
                color: '#14B8A6',
                lineHeight: 1.6,
                maxWidth: '480px',
                margin: '0 auto',
              }}
            >
              This is one of 47 protocols in your pattern's full interrupt sequence.
            </p>
          </div>
        </section>
      )}

      {/* SECTION 3 — The Gate (email capture) */}
      {phase === 'confirmed' && (
        <section
          className="px-4 py-16 md:py-24"
          style={{
            opacity: gateVisible ? 1 : 0,
            transform: gateVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          <div className="max-w-lg mx-auto text-center">
            <h2
              data-testid="text-gate-headline"
              style={{
                fontFamily: "'Schibsted Grotesk', sans-serif",
                fontWeight: 900,
                textTransform: 'uppercase',
                color: 'white',
                fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                lineHeight: 1.2,
                marginBottom: '16px',
              }}
            >
              The pattern has a name. The exit has a door.
            </h2>
            <p
              style={{
                fontFamily: "'Source Sans 3', sans-serif",
                color: '#999',
                fontSize: '1rem',
                lineHeight: 1.6,
                marginBottom: '32px',
                maxWidth: '480px',
                margin: '0 auto 32px',
              }}
            >
              Your free Crash Course walks you through the first step of the FEIR method &mdash; built specifically for your pattern.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                data-testid="input-email"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: '#111',
                  border: '1px solid #1a1a1a',
                  borderRadius: '2px',
                  color: 'white',
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 200ms ease',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#14B8A6'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = '#1a1a1a'; }}
              />
              <div style={{ marginTop: "16px", marginBottom: "16px", textAlign: "left" }}>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.15em", color: "#999", marginBottom: "10px" }}>What you'll receive:</p>
                {["Your pattern's trigger sequence", "Your body signal map", "Your first interrupt protocol"].map((item, i) => (
                  <div key={i} className="flex items-center gap-2" style={{ marginBottom: "6px" }}>
                    <span style={{ color: "#14B8A6", fontSize: "13px", fontWeight: 700 }}>&#10003;</span>
                    <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.85rem", color: "#aaa" }}>{item}</span>
                  </div>
                ))}
              </div>
              <div className="cta-glow-wrap cta-glow-full" style={{ display: "block", width: "100%" }}>
                <div className="cta-glow-border" />
                <button
                  type="submit"
                  disabled={submitting}
                  data-testid="button-submit-email"
                  className="cta-glow-inner results-cta-btn w-full"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.85rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'white',
                    fontWeight: 700,
                    padding: '14px 24px',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    opacity: submitting ? 0.5 : 1,
                    width: '100%',
                    transition: 'all 200ms ease',
                  }}
                >
                  {submitting ? 'Opening Archive...' : 'SEND ME THE FIRST STEP'}
                </button>
              </div>
              {error && <p style={{ color: '#f87171', fontSize: '0.875rem', textAlign: 'center' }} role="alert">{error}</p>}
            </form>

            <p
              data-testid="text-no-spam"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '11px',
                color: '#999',
                marginTop: '20px',
              }}
            >
              No sales sequence. Just the work.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
