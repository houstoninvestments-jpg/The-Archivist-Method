import { useState } from 'react';
import { useLocation } from 'wouter';
import { Check, ArrowRight, AlertTriangle } from 'lucide-react';
import { PatternKey, patternDisplayNames, QuizResult as QuizResultType } from '@/lib/quizData';

const memoryAnchors: Record<PatternKey, string> = {
  disappearing: "You're not avoiding them. You're protecting them from the version of you that you can't stand.",
  apologyLoop: "You're not sorry for what you did. You're sorry for taking up space.",
  testing: "You're not checking if they care. You're collecting evidence that they don't.",
  attractionToHarm: "You don't love chaos. You trust it more than peace.",
  complimentDeflection: "You're not being humble. You're being loyal to the story you tell yourself.",
  drainingBond: "You're not helping them. You're hiding from yourself.",
  successSabotage: "You're not afraid of failure. You're afraid of having no excuse left.",
  perfectionism: "You're not pursuing excellence. You're avoiding the vulnerability of being seen as less than flawless.",
  rage: "You're not angry at them. You're drowning in feelings you were never allowed to have.",
};

const whyTherapyDoesntFix: Record<PatternKey, { reasons: string[]; bodySignal: string; interrupt: string; redirect?: string; closing: string }> = {
  disappearing: {
    reasons: ["Childhood abandonment.", "Attachment wounds.", "Fear of intimacy."],
    bodySignal: "That specific tightness in your chest, that urge to check your phone one more time, that thought: \"They're better off without me\"—",
    interrupt: "Before you ghost.\nBefore you disappear.\nBefore the damage.",
    closing: "That's not therapy.\nThat's real-time pattern interruption.",
  },
  apologyLoop: {
    reasons: ["Low self-worth.", "People-pleasing conditioning.", "Trauma response."],
    bodySignal: "That automatic \"sorry\" for existing, for taking up space, for having needs—",
    interrupt: "And interrupt it before it leaves your mouth.",
    redirect: "Then redirect: What do I actually need to say here?",
    closing: "That's not therapy.\nThat's pattern interruption in action.",
  },
  testing: {
    reasons: ["Abandonment fears.", "Trust issues.", "Anxious attachment."],
    bodySignal: "That urge to cancel plans, to create distance, to see if they'll chase you—",
    interrupt: "And interrupt it before you sabotage another relationship.",
    redirect: "Then redirect: What do I actually need? Can I ask for it directly?",
    closing: "That's not therapy.\nThat's real-time recognition.",
  },
  attractionToHarm: {
    reasons: ["Familiar dysfunction.", "Learned associations.", "Trauma bonding."],
    bodySignal: "That excitement that feels like chemistry, that drama that feels like passion—",
    interrupt: "And recognize it as pattern activation, not attraction.",
    redirect: "Then interrupt before you commit.",
    closing: "That's not therapy.\nThat's pattern recognition that saves you years.",
  },
  complimentDeflection: {
    reasons: ["Low self-esteem.", "Imposter syndrome.", "Worthiness wounds."],
    bodySignal: "That urge to minimize, to joke it away, to redirect to someone else—",
    interrupt: "And interrupt it before it leaves your mouth.",
    redirect: "Then redirect: \"Thank you\" and nothing else.",
    closing: "That's not therapy.\nThat's reprogramming in real-time.",
  },
  drainingBond: {
    reasons: ["Caretaker conditioning.", "Boundary issues.", "Self-abandonment patterns."],
    bodySignal: "That urgency, that \"they need me,\" that familiar role—",
    interrupt: "And interrupt it before you abandon yourself again.",
    redirect: "Then redirect: What do I need right now?",
    closing: "That's not therapy.\nThat's boundary enforcement through pattern recognition.",
  },
  successSabotage: {
    reasons: ["Fear of success.", "Worthiness issues.", "Comfort zone attachment."],
    bodySignal: "That sudden \"new idea\" that feels more exciting, that urge to pivot, that voice saying \"this isn't good enough\"—",
    interrupt: "And interrupt it before you kill another dream.",
    redirect: "Then redirect: What's one small step forward on THIS project?",
    closing: "That's not therapy.\nThat's completion through interruption.",
  },
  perfectionism: {
    reasons: ["Conditional love.", "Performance-based worth.", "Fear of being seen as less than."],
    bodySignal: "That paralysis before starting, that dread when it's almost done, that voice saying \"it's not ready yet\"—",
    interrupt: "And interrupt it before you spend another year polishing something no one will see.",
    redirect: "Then redirect: Ship it. Done is better than perfect.",
    closing: "That's not therapy.\nThat's completion through interruption.",
  },
  rage: {
    reasons: ["Suppressed emotions.", "Invisible boundaries.", "Powerlessness in childhood."],
    bodySignal: "That heat rising from your chest to your face, the jaw clenching, the pressure building—",
    interrupt: "And interrupt it before you say something you can't take back.",
    redirect: "Then redirect: 10 seconds of silence. Breathe. Choose your words.",
    closing: "That's not therapy.\nThat's real-time de-escalation.",
  },
};

const fourDoorsProtocol: Record<PatternKey, {
  feel: { whatToFeel: string[]; context: string };
  engage: string;
  interrupt: string[];
  redirect: { action: string; result: string };
}> = {
  disappearing: {
    feel: {
      whatToFeel: [
        "Tightness in your chest",
        "Urge to check your phone compulsively",
        "Thought forming: \"They're better off without me\"",
        "Restlessness, need to create distance"
      ],
      context: "This feeling usually comes after connection or vulnerability. Learn to recognize THIS specific sensation."
    },
    engage: "This is Disappearing Act activating.",
    interrupt: [
      "Do NOT ghost.",
      "Do NOT send the distancing text.",
      "Do NOT make excuses to cancel.",
      "Close your phone. Breathe. Wait 90 seconds.",
      "The urge to run will peak and then start to fade."
    ],
    redirect: {
      action: "I'm feeling overwhelmed and need some space. Can we reconnect Friday?",
      result: "Same need for distance. Different method. This preserves the relationship instead of destroying it."
    }
  },
  apologyLoop: {
    feel: {
      whatToFeel: [
        "The word \"sorry\" forming in your throat",
        "Before you even think about whether you need to apologize",
        "Automatic, reflexive sensation",
        "Anxiety about taking up space"
      ],
      context: "This happens in normal conversations, not just when you've done something wrong."
    },
    engage: "This is Apology Loop.",
    interrupt: [
      "Do NOT say \"sorry.\"",
      "Pause. Breathe. Let the word dissolve.",
      "It will feel wrong. You'll feel rude.",
      "You'll feel like you're breaking a rule.",
      "You're not."
    ],
    redirect: {
      action: "Thank you for your patience",
      result: "Or 'I appreciate you' — or just say what you actually mean to say. Same acknowledgment of the other person. Different frame. No self-erasure."
    }
  },
  testing: {
    feel: {
      whatToFeel: [
        "Urge to cancel plans",
        "Impulse to create distance \"to see what they do\"",
        "Thought: \"If they cared, they would...\"",
        "Restlessness, need to \"test\" the relationship"
      ],
      context: "This usually comes when things are going well. That's the trigger."
    },
    engage: "This is Testing Pattern. I'm about to push them away to see if they'll stay.",
    interrupt: [
      "Do NOT cancel.",
      "Do NOT create artificial distance.",
      "Do NOT send the \"testing\" text.",
      "Sit with the insecurity for 60 seconds."
    ],
    redirect: {
      action: "I'm feeling insecure. Can you reassure me you want to hang out?",
      result: "Vulnerability instead of manipulation. Same need for reassurance. Healthier method."
    }
  },
  attractionToHarm: {
    feel: {
      whatToFeel: [
        "Excitement toward chaos (feels like chemistry)",
        "Boredom with stability (feels flat)",
        "Pull toward red flags",
        "Distrust of anything that feels peaceful"
      ],
      context: "This is a body-level attraction. Learn your specific signature."
    },
    engage: "This is Attraction to Harm. I'm confusing familiar with safe.",
    interrupt: [
      "Do NOT move toward the chaotic option.",
      "Do NOT text the red flag person.",
      "Do NOT choose the drama.",
      "Pause. The pull will feel magnetic. Wait it out."
    ],
    redirect: {
      action: "What would safe actually look like?",
      result: "Then choose the boring option deliberately. Not because it's exciting. Because it's actually safe."
    }
  },
  complimentDeflection: {
    feel: {
      whatToFeel: [
        "Discomfort when praised",
        "Urge to minimize, joke away, or redirect",
        "Thought: \"They don't really mean it\"",
        "Physical need to escape the attention"
      ],
      context: "This happens in the second after receiving a compliment."
    },
    engage: "This is Compliment Deflection. I'm about to minimize this.",
    interrupt: [
      "Do NOT deflect.",
      "Do NOT say \"Oh, it was nothing.\"",
      "Do NOT redirect to someone else.",
      "Pause. Sit with the discomfort of being seen."
    ],
    redirect: {
      action: "Thank you.",
      result: "Nothing else. Just \"Thank you.\" Let the compliment land. Sit with it. This is reprogramming."
    }
  },
  drainingBond: {
    feel: {
      whatToFeel: [
        "Pull to \"help\" someone who never changes",
        "Urgency: \"They need me\"",
        "Familiar exhaustion",
        "Thought: \"I'm the only one who understands them\""
      ],
      context: "This feels like purpose. It's not."
    },
    engage: "This is Draining Bond. I'm about to abandon myself to rescue them.",
    interrupt: [
      "Do NOT answer the 2 AM crisis call.",
      "Do NOT drop everything to fix their problem.",
      "Do NOT sacrifice your needs.",
      "Breathe. The urgency will feel overwhelming. Wait."
    ],
    redirect: {
      action: "What do I need right now?",
      result: "Then do that instead. Set the boundary. Turn off your phone. Take care of yourself first."
    }
  },
  successSabotage: {
    feel: {
      whatToFeel: [
        "Sudden \"better idea\" excitement",
        "Boredom with current project (especially near completion)",
        "Perfectionism spike",
        "Thought: \"This isn't good enough\""
      ],
      context: "This happens around 80-90% completion. Always."
    },
    engage: "This is Success Sabotage. I'm about to abandon this.",
    interrupt: [
      "Do NOT open a new document.",
      "Do NOT start planning the \"better\" version.",
      "Do NOT pivot.",
      "Close the laptop. Walk away. Come back tomorrow."
    ],
    redirect: {
      action: "I can explore new ideas AFTER I finish this.",
      result: "Set a date to revisit the new idea. Then do ONE small task on the current project. Complete instead of abandon."
    }
  },
  perfectionism: {
    feel: {
      whatToFeel: [
        "Paralysis before starting",
        "Dread when approaching completion",
        "Gap between the vision in your head and reality",
        "Thought: \"It's not ready yet\""
      ],
      context: "This activates before deadlines, before sharing work, and before anything that could be judged."
    },
    engage: "This is the Perfectionism Pattern. I'm about to not-start or not-finish.",
    interrupt: [
      "Do NOT revise it one more time.",
      "Do NOT wait until it's perfect.",
      "Do NOT compare to an impossible standard.",
      "Set a timer for 10 minutes. Work on it. Then ship it."
    ],
    redirect: {
      action: "Done is better than perfect. I'm shipping this now.",
      result: "Imperfect and finished beats perfect and invisible. Every time."
    }
  },
  rage: {
    feel: {
      whatToFeel: [
        "Heat rising from chest to face",
        "Jaw clenching tight",
        "Pressure building behind your eyes",
        "Words forming that you know will cause damage"
      ],
      context: "This happens when you feel dismissed, contradicted, or when you lose control of a situation."
    },
    engage: "This is the Rage Pattern. I'm about to say something I can't take back.",
    interrupt: [
      "Do NOT speak for 10 seconds.",
      "Do NOT send the text.",
      "Do NOT escalate.",
      "Breathe. Let the pressure peak and start to drop."
    ],
    redirect: {
      action: "I need a minute before I respond.",
      result: "Same emotion. Different delivery. The anger is valid. The destruction isn't."
    }
  }
};

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
  perfectionism: {
    recognition: "If it's not perfect, it's garbage. So you don't finish. Or you don't start. You have a graveyard of almost-finished projects, ideas that died in your head, years spent polishing things no one ever sees. You revise endlessly. You delay indefinitely. You watch yourself refusing to ship anything less than flawless. You know it's paralyzing you. You do it anyway.",
    insight: "Here's what's actually happening: You are not \"detail-oriented.\" You are not \"just thorough.\" You are running a survival program that was installed when love or safety was conditional on performance. Somewhere in your history, good enough wasn't. Mistakes were punished. Your worth was measured by output. Your nervous system learned: imperfection is rejection. Now it runs the program automatically.",
    cost: "You've never finished the things that matter most. You've watched less talented people succeed because they could tolerate imperfection. You've spent years perfecting things that nobody asked for.",
  },
  rage: {
    recognition: "It comes out of nowhere. One second you're fine, the next you're saying things you can't take back. The anger is disproportionate. You know it while it's happening. You can feel yourself crossing lines. Afterward, shame. Apologies. Promises it won't happen again. Until it does. You watch yourself exploding at people you love. You know it's destroying trust. You do it anyway.",
    insight: "Here's what's actually happening: You are not \"angry.\" You are not \"out of control.\" You are running a survival program that was installed when your boundaries were invisible. Somewhere in your history, the only way to be heard was to scream. Or anger was the only emotion that felt powerful instead of vulnerable. Your nervous system learned: rage is protection. Now it runs the program automatically.",
    cost: "Damaged relationships. Trust that takes years to rebuild. A version of yourself you're ashamed of. People walking on eggshells around you.",
  },
};

export default function QuizResult() {
  const [location, setLocation] = useLocation();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const resultData = searchParams.get('data');
  
  let result: QuizResultType | null = null;
  try {
    if (resultData) {
      result = JSON.parse(decodeURIComponent(resultData));
    }
  } catch {}

  const patternKey = (result?.primaryPattern || localStorage.getItem('quizResultPattern') || '') as PatternKey;

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

        {/* Why Therapy Doesn't Fix This Pattern Section */}
        <div className="bg-zinc-900/80 border border-zinc-700 rounded-2xl p-6 md:p-10 mb-8" data-testid="section-why-therapy">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-6 text-center">
            Why Therapy Doesn't Fix This Pattern
          </h2>
          
          <div className="text-gray-300 leading-relaxed space-y-4">
            <p>Therapy will help you understand WHY you {patternKey === 'disappearing' ? 'disappear' : patternKey === 'apologyLoop' ? 'apologize excessively' : patternKey === 'testing' ? 'test people' : patternKey === 'attractionToHarm' ? 'chaos feels safe' : patternKey === 'complimentDeflection' ? "can't accept praise" : patternKey === 'drainingBond' ? 'your codependency' : 'self-sabotage'}.</p>
            
            <ul className="space-y-1 pl-2">
              {whyTherapyDoesntFix[patternKey].reasons.map((reason, i) => (
                <li key={i} className="text-slate-400">• {reason}</li>
              ))}
            </ul>
            
            <p>All true. All valid.</p>
            
            <p>But understanding WHY doesn't stop the pattern from running {patternKey === 'disappearing' ? 'three days from now' : patternKey === 'apologyLoop' ? 'five times in the next conversation' : patternKey === 'testing' ? 'when you push people away' : patternKey === 'attractionToHarm' ? 'tomorrow night' : patternKey === 'complimentDeflection' ? 'on the next compliment you receive' : patternKey === 'drainingBond' ? 'at 2 AM' : 'at 87% complete'}.</p>
            
            <p>
              The Archivist Method teaches you to{' '}
              <span className="text-white font-semibold italic">FEEL the pattern activating in your body</span>—
            </p>
            
            <p className="text-white italic">{whyTherapyDoesntFix[patternKey].bodySignal}</p>
            
            <p>{whyTherapyDoesntFix[patternKey].interrupt.split('\n').map((line, i) => (
              <span key={i}>{line}<br /></span>
            ))}</p>
            
            {whyTherapyDoesntFix[patternKey].redirect && (
              <p className="text-teal-400">{whyTherapyDoesntFix[patternKey].redirect}</p>
            )}
            
            <p className="text-white font-semibold text-lg pt-4 border-t border-zinc-700">
              {whyTherapyDoesntFix[patternKey].closing.split('\n').map((line, i) => (
                <span key={i}>{line}<br /></span>
              ))}
            </p>
          </div>
        </div>

        {/* Four Doors Protocol Section */}
        <div className="bg-slate-950 border border-slate-700 rounded-2xl p-6 md:p-10 mb-8" data-testid="section-four-doors">
          <h2 className="text-xl md:text-2xl font-bold text-teal-400 mb-6 text-center">
            HOW THE FOUR DOORS PROTOCOL INTERRUPTS THIS PATTERN
          </h2>
          
          <div className="space-y-6">
            {/* Door 1: FEEL */}
            <div className="bg-zinc-900/50 p-5 rounded-lg">
              <h3 className="text-lg font-bold text-white mb-3">
                <span className="text-teal-400">DOOR 1 - FEEL:</span> What to feel for
              </h3>
              <ul className="space-y-1 mb-3">
                {fourDoorsProtocol[patternKey].feel.whatToFeel.map((item, i) => (
                  <li key={i} className="text-slate-300">• {item}</li>
                ))}
              </ul>
              <p className="text-slate-400 text-sm italic">{fourDoorsProtocol[patternKey].feel.context}</p>
            </div>
            
            {/* Door 2: ENGAGE */}
            <div className="bg-zinc-900/50 p-5 rounded-lg">
              <h3 className="text-lg font-bold text-white mb-3">
                <span className="text-teal-400">DOOR 2 - ENGAGE:</span> Name it
              </h3>
              <p className="text-white italic">"{fourDoorsProtocol[patternKey].engage}"</p>
              <p className="text-slate-400 text-sm mt-2">Don't judge it. Don't analyze it. Just recognize: "Oh, there it is."</p>
            </div>
            
            {/* Door 3: INTERRUPT */}
            <div className="bg-zinc-900/50 p-5 rounded-lg">
              <h3 className="text-lg font-bold text-white mb-3">
                <span className="text-teal-400">DOOR 3 - INTERRUPT:</span> Stop the action
              </h3>
              <ul className="space-y-1">
                {fourDoorsProtocol[patternKey].interrupt.map((item, i) => (
                  <li key={i} className={item.startsWith('Do NOT') ? 'text-pink-400 font-medium' : 'text-slate-300'}>{item}</li>
                ))}
              </ul>
            </div>
            
            {/* Door 4: REDIRECT */}
            <div className="bg-zinc-900/50 p-5 rounded-lg">
              <h3 className="text-lg font-bold text-white mb-3">
                <span className="text-teal-400">DOOR 4 - REDIRECT:</span> Channel the energy
              </h3>
              <p className="text-teal-400 italic mb-2">"{fourDoorsProtocol[patternKey].redirect.action}"</p>
              <p className="text-slate-400 text-sm">{fourDoorsProtocol[patternKey].redirect.result}</p>
            </div>
          </div>
          
          <div className="text-center mt-6 pt-4 border-t border-slate-700">
            <a 
              href="/four-doors"
              className="text-teal-400 hover:text-teal-300 font-semibold transition-colors"
              data-testid="link-four-doors-full"
            >
              Learn the complete Four Doors methodology →
            </a>
          </div>
        </div>

        {/* Memory Anchor Section */}
        <div className="my-12 py-10 px-6 md:px-10 bg-zinc-900/60 border-l-4 border-teal-500 rounded-r-xl" data-testid="section-memory-anchor">
          <p className="text-xs uppercase tracking-[0.2em] text-teal-400 font-semibold mb-4 text-center">
            The One Thing to Remember:
          </p>
          <p className="text-xl md:text-2xl font-semibold text-white text-center leading-relaxed italic">
            "{memoryAnchors[patternKey]}"
          </p>
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
              <span>The Crash Course specific to {patternName}</span>
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
                {submitting ? 'Processing...' : 'Enter The Archive'}
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
              href="/portal"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/20 rounded-xl text-white hover:bg-white/5 hover:border-teal-500/50 transition-all"
            >
              The Field Guide
              <span className="text-teal-400 font-bold">$47</span>
            </a>
            <a
              href="/portal"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-pink-500/30 bg-pink-500/5 rounded-xl text-white hover:bg-pink-500/10 hover:border-pink-500/50 transition-all"
            >
              The Complete Archive
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
