import { useState } from 'react';
import { useLocation, useRoute } from 'wouter';
import { Check, ArrowRight, AlertTriangle } from 'lucide-react';
import { PatternKey, patternDisplayNames, QuizResult as QuizResultType } from '@/lib/quizData';

const patternTeasers: Record<PatternKey, { recognition: string; insight: string; cost: string }> = {
  disappearing: {
    recognition: "You pull away when intimacy increases. The moment someone gets too close—when they start to matter—your chest tightens and you need space. You've ended relationships that were going well. You've ghosted people who cared about you. You've created distance in ways that confused everyone, including yourself. You watch yourself do it. You know it's happening. You do it anyway.",
    insight: "Here's what's actually happening: You are not \"afraid of commitment.\" You are not \"avoidant.\" You are running a survival program that was installed when intimacy meant danger. Somewhere in your history, closeness led to pain. Someone you loved disappeared. Or someone who got close consumed you. Or trust was followed by betrayal. Your nervous system learned: intimacy is unsafe. Now it runs the program automatically.",
    cost: "You've lost relationships that could have worked. You've hurt people who didn't understand why you left. You feel disconnected even in good relationships because part of you is always calculating the exit.",
  },
  apologyLoop: {
    recognition: "You apologize for existing. For having needs. For taking up space. For asking questions at work. For wanting things in relationships. \"Sorry\" comes out before you even know why. You make yourself small to be safe. You minimize your needs so you won't be \"too much.\" You've turned \"sorry\" into a verbal tic. You watch yourself do it. You know it's excessive. You do it anyway.",
    insight: "Here's what's actually happening: You are not \"just being polite.\" You are not \"low maintenance.\" You are running a survival program that was installed when your needs created problems. Somewhere in your history, having needs led to punishment, rejection, or someone else's pain. Your nervous system learned: needs are dangerous. Now it runs the program automatically.",
    cost: "You don't ask for raises. You don't set boundaries. You don't express preferences. You've trained everyone around you to ignore what you want because you never tell them.",
  },
  testing: {
    recognition: "You create tests. Not consciously—but you do it. You push to see if people will stay. You pick fights to prove they really love you. You disappear to see if they'll pursue. You create situations that force them to prove their commitment. You watch yourself do it. You know it's exhausting everyone. You do it anyway.",
    insight: "Here's what's actually happening: You are not \"high maintenance.\" You are not \"needy.\" You are running a survival program that was installed when people left without warning. Somewhere in your history, you were blindsided by abandonment. Now you try to predict it before it happens. Your nervous system learned: test everyone. Find out who will leave. Now it runs the program automatically.",
    cost: "You exhaust people who would have stayed. You create the abandonment you're trying to prevent. Your relationships feel like hostage negotiations instead of partnerships.",
  },
  attractionToHarm: {
    recognition: "You're attracted to unavailable people. Chaotic people. People with red flags so obvious your friends stage interventions. Safe people feel boring. Stable feels suspicious. You've rejected good relationships because there was \"no chemistry.\" You watch yourself choosing the wrong person—again. You know it's a pattern. You do it anyway.",
    insight: "Here's what's actually happening: You are not \"attracted to bad boys/girls.\" You are not \"self-destructive.\" You are running a survival program that was installed when love came packaged with chaos. Somewhere in your history, chemistry meant unpredictability. Affection came from someone harmful. Your nervous system learned: this is what love feels like. Now it runs the program automatically.",
    cost: "You've wasted years on people who were never going to be healthy partners. You've rejected people who could have loved you well. You keep recreating the chaos you grew up in.",
  },
  complimentDeflection: {
    recognition: "You can't accept a compliment. Praise makes you squirm. Recognition feels like exposure. When someone says something good about you, you minimize it, deflect it, or explain why they're wrong. \"It was nothing.\" \"Anyone could have done it.\" \"You should have seen what I did wrong.\" You watch yourself reject positive acknowledgment. You know it's self-defeating. You do it anyway.",
    insight: "Here's what's actually happening: You are not \"just modest.\" You are not \"humble.\" You are running a survival program that was installed when visibility was dangerous. Somewhere in your history, being seen led to punishment. Praise was followed by a \"but.\" Achievement triggered jealousy or raised expectations. Your nervous system learned: visibility is unsafe. Now it runs the program automatically.",
    cost: "You don't get promoted because you minimize your achievements. You reject compliments from people who love you. You've convinced everyone—including yourself—that you're less capable than you are.",
  },
  drainingBond: {
    recognition: "You stay in harmful situations long past when you should leave. Toxic relationships. Soul-crushing jobs. Friendships that drain you. Everyone tells you to leave. You know you should leave. You stay anyway. You feel obligated. Responsible. Like leaving would make you the villain. You watch yourself staying in things that are killing you. You know it's destructive. You stay anyway.",
    insight: "Here's what's actually happening: You are not \"loyal.\" You are not \"committed.\" You are running a survival program that was installed when leaving felt impossible or catastrophic. Somewhere in your history, you couldn't leave someone who depended on you. Or leaving was punished. Or you never learned that leaving was an option. Your nervous system learned: leaving is betrayal. Now it runs the program automatically.",
    cost: "You've lost years to situations that were never going to improve. Your health has suffered. Your happiness has been sacrificed on the altar of obligation.",
  },
  successSabotage: {
    recognition: "You destroy things right before they succeed. Quit jobs before the promotion. Create crises in relationships that are going well. Abandon projects at 90% completion. The closer you get to breakthrough, the more you want to burn it down. You watch yourself sabotaging your own success. You know it doesn't make sense. You do it anyway.",
    insight: "Here's what's actually happening: You are not \"self-destructive.\" You are not \"afraid of success.\" You are running a survival program that was installed when success was dangerous. Somewhere in your history, achievement led to punishment. Or success threatened your belonging. Or you were assigned the role of failure. Your nervous system learned: success is unsafe. Now it runs the program automatically.",
    cost: "You've quit before the finish line more times than you can count. You've created chaos when things were finally stable. You've proven the world wrong by being the one who stopped yourself.",
  },
};

export default function QuizResult() {
  const [, params] = useRoute('/quiz/result/:pattern');
  const [location, setLocation] = useLocation();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const patternKey = params?.pattern as PatternKey;
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const resultData = searchParams.get('data');
  
  let result: QuizResultType | null = null;
  try {
    if (resultData) {
      result = JSON.parse(decodeURIComponent(resultData));
    }
  } catch {}

  const teaser = patternTeasers[patternKey];
  const patternName = patternDisplayNames[patternKey];

  if (!teaser || !patternName) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400">Pattern not found</p>
          <button onClick={() => setLocation('/quiz')} className="mt-4 text-teal-400 hover:underline">
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          primaryPattern: patternKey,
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
      
      setLocation('/portal/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-pink-500/10"></div>
      </div>

      <div className="relative max-w-3xl mx-auto px-4 py-12 md:py-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/10 border border-pink-500/30 rounded-full mb-6">
            <AlertTriangle className="w-4 h-4 text-pink-400" />
            <span className="text-sm text-pink-400 font-medium">Primary Pattern Identified</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{patternName}</h1>
          {result?.secondaryPatterns && result.secondaryPatterns.length > 0 && (
            <p className="text-gray-400">
              Also detected: {result.secondaryPatterns.map(p => patternDisplayNames[p]).join(', ')}
            </p>
          )}
        </div>

        <div className="space-y-8 mb-12">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold text-teal-400 mb-4">You Recognize This</h2>
            <p className="text-gray-300 leading-relaxed">{teaser.recognition}</p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold text-white mb-4">What's Actually Happening</h2>
            <p className="text-gray-300 leading-relaxed">{teaser.insight}</p>
          </div>

          <div className="bg-pink-500/5 backdrop-blur-xl border border-pink-500/20 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold text-pink-400 mb-4">What It's Costing You</h2>
            <p className="text-gray-300 leading-relaxed">{teaser.cost}</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-teal-500/10 to-cyan-500/10 border border-teal-500/30 rounded-2xl p-6 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-6">
            Get Your Complete Pattern Analysis
          </h2>
          
          <p className="text-gray-300 text-center mb-8">
            Your full breakdown is ready in your personal portal:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="flex items-center gap-3 text-gray-300">
              <Check className="w-5 h-5 text-teal-400 flex-shrink-0" />
              <span>What's driving this pattern (The Original Room)</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <Check className="w-5 h-5 text-teal-400 flex-shrink-0" />
              <span>Your body signature (the 3-7 second warning)</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <Check className="w-5 h-5 text-teal-400 flex-shrink-0" />
              <span>Secondary patterns you're also running</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <Check className="w-5 h-5 text-teal-400 flex-shrink-0" />
              <span>How to interrupt it (your custom protocol)</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <Check className="w-5 h-5 text-teal-400 flex-shrink-0" />
              <span>7-Day Crash Course specific to {patternName}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <Check className="w-5 h-5 text-teal-400 flex-shrink-0" />
              <span>AI Pattern Coach (ask questions 24/7)</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                data-testid="input-email"
                aria-label="Email address"
                className="flex-1 px-5 py-4 bg-black/50 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
              />
              <button
                type="submit"
                data-testid="button-submit-email"
                disabled={submitting}
                className="px-6 py-4 bg-gradient-to-r from-teal-500 to-cyan-400 text-black font-bold rounded-xl hover:shadow-[0_0_24px_rgba(20,184,166,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2 whitespace-nowrap min-h-[56px]"
              >
                {submitting ? 'Processing...' : 'Start 7-Day Crash Course'}
                {!submitting && <ArrowRight className="w-5 h-5" />}
              </button>
            </div>
            {error && <p className="text-red-400 text-sm text-center mt-3" role="alert">{error}</p>}
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">Free • Private • Brutally Honest • Instant Access</p>
          </div>
        </div>

        {/* Secondary CTA for ready buyers */}
        <div className="mt-10 text-center">
          <p className="text-gray-400 text-sm mb-4">Ready for the complete system?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/quick-start"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/20 rounded-xl text-white hover:bg-white/5 hover:border-teal-500/50 transition-all"
            >
              Quick-Start System
              <span className="text-teal-400 font-bold">$47</span>
            </a>
            <a
              href="/complete-archive"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-pink-500/30 bg-pink-500/5 rounded-xl text-white hover:bg-pink-500/10 hover:border-pink-500/50 transition-all"
            >
              Complete Archive
              <span className="text-pink-400 font-bold">$197</span>
            </a>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 inline-block max-w-lg">
            <p className="text-sm text-gray-400 uppercase tracking-wider mb-2">Pattern Archaeology, Not Therapy</p>
            <p className="text-gray-300">
              This launched January 2026. No fake testimonials. No inflated numbers.
              Just a method that either works for your nervous system or doesn't.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
