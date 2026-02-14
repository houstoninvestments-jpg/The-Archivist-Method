import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { Check } from 'lucide-react';
import { PatternKey, patternDisplayNames, QuizResult as QuizResultType } from '@/lib/quizData';

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

export default function QuizResult() {
  const [location, setLocation] = useLocation();
  const [phase, setPhase] = useState<'reveal' | 'confirm' | 'secondPattern' | 'manualSelect' | 'emailCapture'>('reveal');
  const [confirmedPattern, setConfirmedPattern] = useState<PatternKey | null>(null);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [typewriterDone, setTypewriterDone] = useState(false);
  const [copyVisible, setCopyVisible] = useState(false);
  const [buttonsVisible, setButtonsVisible] = useState(false);
  const [emailSlideUp, setEmailSlideUp] = useState(false);
  const typewriterRef = useRef<HTMLSpanElement>(null);

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

  useEffect(() => {
    if (phase === 'reveal' || phase === 'secondPattern') {
      setTypewriterDone(false);
      setCopyVisible(false);
      setButtonsVisible(false);

      const el = typewriterRef.current;
      if (el) {
        el.textContent = '';
        let i = 0;
        const text = currentName;
        const speed = Math.max(30, 200 / text.length);
        const interval = setInterval(() => {
          if (i < text.length) {
            el.textContent += text[i];
            i++;
          } else {
            clearInterval(interval);
            setTypewriterDone(true);
            setTimeout(() => setCopyVisible(true), 200);
            setTimeout(() => {
              setButtonsVisible(true);
              if (phase === 'reveal') setPhase('confirm');
            }, 600);
          }
        }, speed);
        return () => clearInterval(interval);
      }
    }
  }, [phase, currentName]);

  useEffect(() => {
    if (phase === 'emailCapture') {
      setTimeout(() => setEmailSlideUp(true), 50);
    }
  }, [phase]);

  const handleConfirm = (pattern: PatternKey) => {
    setConfirmedPattern(pattern);
    setPhase('emailCapture');
  };

  const handleNotQuite = () => {
    if (phase === 'confirm' && secondPattern) {
      setPhase('secondPattern');
    } else {
      setPhase('manualSelect');
    }
  };

  const handleManualSelect = (pattern: PatternKey) => {
    setConfirmedPattern(pattern);
    setPhase('emailCapture');
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

      if (data.token) {
        document.cookie = `quiz_token=${data.token}; path=/; max-age=${60 * 60 * 24 * 7}`;
      }

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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 mb-4">No pattern data found.</p>
          <button
            onClick={() => setLocation('/quiz')}
            className="text-teal-400 hover:text-teal-300 transition-colors"
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
      <div className="min-h-screen bg-black">
        <div className="quiz-fog" />
        <div className="relative max-w-3xl mx-auto px-4 py-12 md:py-16 z-10">
          <div className="results-fade-in text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Which pattern do you recognize?
            </h2>
            <p className="text-slate-400">
              Select the one that lives in your body.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {allPatterns.map((pattern, i) => (
              <button
                key={pattern}
                data-testid={`pattern-card-${pattern}`}
                onClick={() => handleManualSelect(pattern)}
                className="results-pattern-card text-left p-4 bg-slate-900/70 border border-slate-700/40 rounded-md hover-elevate"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <h3 className="text-white font-bold text-sm mb-1.5">
                  {patternDisplayNames[pattern]}
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  {feelSeenCopy[pattern]?.[0]}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'emailCapture') {
    const finalPattern = confirmedPattern || primaryPattern;
    const finalName = patternDisplayNames[finalPattern];

    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="quiz-fog" />
        <div className={`results-email-capture max-w-md w-full relative z-10 ${emailSlideUp ? 'results-email-visible' : ''}`}>
          <div className="text-center mb-8">
            <p className="text-xs uppercase tracking-[0.2em] text-teal-400 font-semibold mb-3">
              Pattern Confirmed
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {finalName}
            </h2>
            <div className="h-0.5 w-16 bg-teal-500 mx-auto mb-4" />
            <p className="text-slate-400 text-sm">
              Your full breakdown is waiting in your personal portal.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-700/40 rounded-md p-5 mb-6">
            <ul className="space-y-3">
              {[
                'Complete pattern analysis',
                'Your body signature (the 2.7 second warning)',
                'The Four Doors Protocol for your pattern',
                'AI Pattern Coach (24/7)',
                'The Crash Course (free)',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-teal-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              data-testid="input-email"
              className="w-full px-4 py-3.5 bg-slate-800/80 border border-slate-600 rounded-md text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
            />
            <button
              type="submit"
              disabled={submitting}
              data-testid="button-submit-email"
              className="results-cta-btn w-full px-6 py-3.5 bg-teal-500 text-black font-bold rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Opening Archive...' : 'Send Magic Link'}
            </button>
            {error && <p className="text-red-400 text-sm text-center" role="alert">{error}</p>}
          </form>

          <p className="text-center text-slate-500 text-xs mt-5">
            {"Free access \u2022 No spam \u2022 Instant portal entry"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="quiz-fog" />
      <div className="max-w-xl w-full relative z-10">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold mb-6 results-fade-in">
            Pattern Identified
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2" data-testid="text-pattern-name">
            <span ref={typewriterRef} className="results-typewriter" />
            {!typewriterDone && <span className="results-cursor">|</span>}
          </h1>

          <div className={`h-0.5 w-20 bg-teal-500 mx-auto mb-8 transition-all duration-300 ${typewriterDone ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`} />

          <div className={`space-y-4 mb-10 transition-all duration-300 ${copyVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
            {currentCopy.map((paragraph, i) => (
              <p key={i} className="text-slate-300 text-lg leading-relaxed max-w-lg mx-auto">
                {paragraph}
              </p>
            ))}
          </div>

          <div className={`transition-all duration-300 ${buttonsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
            <p className="text-white font-medium mb-5" data-testid="text-confirmation">
              Does this sound like you?
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                data-testid="button-yes"
                onClick={() => handleConfirm(currentPattern)}
                className="results-confirm-btn px-8 py-3 border border-teal-500/50 text-white rounded-md font-medium transition-all"
              >
                Yes, that's me
              </button>
              <button
                data-testid="button-not-quite"
                onClick={handleNotQuite}
                className="results-confirm-btn px-8 py-3 border border-slate-600 text-slate-300 rounded-md font-medium transition-all"
              >
                Not quite
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
