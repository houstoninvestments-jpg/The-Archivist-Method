import { Link } from "wouter";
import { Heart, Eye, Zap, RefreshCw, ArrowRight } from "lucide-react";

export default function FourDoors() {
  return (
    <div className="min-h-screen bg-black text-white font-['Inter',sans-serif]">
      {/* Hero Section */}
      <section className="py-20 md:py-28 px-5 bg-gradient-to-b from-slate-950 to-black">
        <div className="max-w-[800px] mx-auto text-center">
          <h1 
            className="text-4xl md:text-5xl font-black tracking-widest uppercase mb-4"
            style={{ color: '#14B8A6' }}
            data-testid="text-four-doors-title"
          >
            THE FOUR DOORS PROTOCOL
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-8">
            The Complete Methodology for Pattern Interruption
          </p>
        </div>
      </section>

      {/* The Problem With Willpower */}
      <section className="py-16 px-5 bg-zinc-950">
        <div className="max-w-[700px] mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
            THE PROBLEM WITH WILLPOWER
          </h2>
          
          <div className="space-y-6 text-slate-300 leading-relaxed">
            <p>You've tried to stop before.</p>
            
            <p>
              You've promised yourself: "This time will be different."<br />
              You've white-knuckled your way through situations.<br />
              You've used every ounce of self-control you have.
            </p>
            
            <p className="text-pink-400 font-semibold text-lg">
              And the pattern ran anyway.
            </p>
            
            <p>
              Not because you're weak.<br />
              Not because you lack discipline.
            </p>
            
            <p className="text-white font-semibold">
              Because willpower tries to fight patterns at the wrong stage.
            </p>
            
            <p>
              By the time you're consciously trying NOT to do something, the pattern has already activated. You're trying to stop a train that's already left the station.
            </p>
            
            <p className="text-teal-400 font-semibold text-lg pt-4 border-t border-zinc-800">
              The Four Doors Protocol works differently.
            </p>
            
            <p className="text-white">
              It teaches you to interrupt patterns BEFORE they become actions.
            </p>
          </div>
        </div>
      </section>

      {/* How Patterns Actually Run */}
      <section className="py-16 px-5 bg-black">
        <div className="max-w-[700px] mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
            HOW PATTERNS ACTUALLY RUN
          </h2>
          
          <div className="space-y-6 text-slate-300 leading-relaxed">
            <p>Every pattern follows the same sequence:</p>
            
            <div className="bg-slate-900 p-6 rounded-lg text-center">
              <p className="text-lg font-mono text-teal-400">
                TRIGGER → FEELING → ACTION → OUTCOME → REPEAT
              </p>
            </div>
            
            <p>Most people only notice the ACTION and the OUTCOME.</p>
            
            <ul className="space-y-2 text-slate-400">
              <li>They ghost someone (action) and feel guilty after (outcome).</li>
              <li>They apologize excessively (action) and feel weak after (outcome).</li>
              <li>They sabotage success (action) and feel frustrated after (outcome).</li>
            </ul>
            
            <p className="text-white font-semibold">
              But the pattern is already complete by then.
            </p>
            
            <p>
              The real intervention point is earlier:<br />
              <span className="text-teal-400 font-semibold">Between FEELING and ACTION.</span>
            </p>
            
            <p className="text-white font-semibold">
              That's where the Four Doors Protocol lives.
            </p>
          </div>
        </div>
      </section>

      {/* Door 1: FEEL */}
      <section className="py-16 px-5 bg-slate-950">
        <div className="max-w-[800px] mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-teal-500/20 rounded-xl flex items-center justify-center">
              <Heart className="w-7 h-7 text-teal-400" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">DOOR 1: FEEL</h2>
              <p className="text-teal-400 uppercase tracking-widest text-sm">Recognize the pattern activating in your body</p>
            </div>
          </div>
          
          <div className="space-y-6 text-slate-300 leading-relaxed">
            <p>Every pattern has a signature feeling.</p>
            
            <p>
              Not an emotion like "sad" or "angry."<br />
              A somatic sensation. A body-level signal.
            </p>
            
            <div className="space-y-4 bg-zinc-900 p-6 rounded-lg">
              <div>
                <p className="text-pink-400 font-semibold mb-2">THE DISAPPEARING ACT feels like:</p>
                <ul className="text-slate-400 space-y-1 pl-4">
                  <li>• Tightness in your chest</li>
                  <li>• Urge to check your phone compulsively</li>
                  <li>• Thought: "They're better off without me"</li>
                </ul>
              </div>
              
              <div>
                <p className="text-pink-400 font-semibold mb-2">THE APOLOGY LOOP feels like:</p>
                <ul className="text-slate-400 space-y-1 pl-4">
                  <li>• The word "sorry" forming in your throat</li>
                  <li>• Before you even think about whether you need to apologize</li>
                  <li>• Automatic, reflexive, unconscious</li>
                </ul>
              </div>
              
              <div>
                <p className="text-pink-400 font-semibold mb-2">SUCCESS SABOTAGE feels like:</p>
                <ul className="text-slate-400 space-y-1 pl-4">
                  <li>• Sudden excitement about a "new, better" idea</li>
                  <li>• Boredom or perfectionism about the current project</li>
                  <li>• Restlessness that says "this isn't good enough"</li>
                </ul>
              </div>
            </div>
            
            <p className="text-white font-semibold">
              DOOR 1 teaches you to recognize YOUR specific signature feeling for each pattern.
            </p>
            
            <p>
              Not after the fact.<br />
              In real-time.<br />
              Before the action.
            </p>
            
            <p className="text-slate-400 italic border-l-4 border-teal-500 pl-4">
              This is the foundation. If you can't feel it activating, you can't interrupt it.
            </p>
          </div>
        </div>
      </section>

      {/* Door 2: ENGAGE */}
      <section className="py-16 px-5 bg-black">
        <div className="max-w-[800px] mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-teal-500/20 rounded-xl flex items-center justify-center">
              <Eye className="w-7 h-7 text-teal-400" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">DOOR 2: ENGAGE</h2>
              <p className="text-teal-400 uppercase tracking-widest text-sm">Name the pattern when it's happening</p>
            </div>
          </div>
          
          <div className="space-y-6 text-slate-300 leading-relaxed">
            <p>Once you feel the pattern activating, you name it.</p>
            
            <p>
              Not out loud (unless you want to).<br />
              Just consciously recognize it:
            </p>
            
            <div className="bg-slate-900 p-6 rounded-lg space-y-2">
              <p className="text-white italic">"Oh. This is Disappearing Act."</p>
              <p className="text-white italic">"I'm running Apology Loop right now."</p>
              <p className="text-white italic">"This is Testing Pattern activating."</p>
            </div>
            
            <p>That's it.</p>
            
            <p>
              No analysis.<br />
              No wondering why.<br />
              No digging into your past.
            </p>
            
            <p className="text-white font-semibold">Just: "There it is."</p>
            
            <div className="bg-zinc-900 p-6 rounded-lg border-l-4 border-teal-500">
              <p className="text-teal-400 font-semibold mb-3">Why does this work?</p>
              <p className="text-slate-300">
                Because patterns run on autopilot. They require unconsciousness to complete.
              </p>
              <p className="text-white font-semibold mt-3">
                The moment you NAME the pattern, you've brought consciousness to it. You've interrupted the automaticity.
              </p>
            </div>
            
            <p className="text-slate-400">
              Think of it like catching yourself mid-lie. Suddenly you're aware of what you're doing. The pattern doesn't disappear, but it loses some of its power.
            </p>
          </div>
        </div>
      </section>

      {/* Door 3: INTERRUPT */}
      <section className="py-16 px-5 bg-slate-950">
        <div className="max-w-[800px] mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-teal-500/20 rounded-xl flex items-center justify-center">
              <Zap className="w-7 h-7 text-teal-400" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">DOOR 3: INTERRUPT</h2>
              <p className="text-teal-400 uppercase tracking-widest text-sm">Stop the action before it happens</p>
            </div>
          </div>
          
          <div className="space-y-6 text-slate-300 leading-relaxed">
            <p className="text-pink-400 font-semibold text-lg">This is the hardest door.</p>
            
            <p>Because your body is SCREAMING to complete the pattern.</p>
            
            <ul className="space-y-2 text-slate-400">
              <li>The urge to ghost is overwhelming.</li>
              <li>The word "sorry" is already in your mouth.</li>
              <li>The impulse to cancel plans is intense.</li>
              <li>The desire to abandon the project feels urgent.</li>
            </ul>
            
            <p className="text-white font-semibold">Every part of you wants to DO THE THING.</p>
            
            <div className="bg-zinc-900 p-6 rounded-lg text-center">
              <p className="text-teal-400 font-semibold text-lg mb-4">DOOR 3 asks you to pause.</p>
              <p className="text-white text-xl">
                Just pause.<br />
                Breathe.<br />
                Wait.
              </p>
            </div>
            
            <p>
              Don't ghost. Not yet.<br />
              Don't apologize. Not yet.<br />
              Don't cancel. Not yet.<br />
              Don't quit. Not yet.
            </p>
            
            <p className="text-white font-semibold">Sit with the discomfort for 60-90 seconds.</p>
            
            <p className="text-slate-400">
              The feeling will peak. It will be intense. You'll think you can't stand it.
            </p>
            
            <p className="text-teal-400 font-semibold">And then it will start to fade.</p>
            
            <p>
              Not because you "processed" it. Not because you "healed" anything.<br />
              Because feelings are waves. They rise, peak, and fall.<br />
              But only if you don't feed them with action.
            </p>
            
            <p className="text-white font-semibold border-l-4 border-pink-500 pl-4">
              Every time you successfully interrupt a pattern, you weaken its grip. You're creating new neural pathways. You're proving to your brain that the pattern is optional.
            </p>
          </div>
        </div>
      </section>

      {/* Door 4: REDIRECT */}
      <section className="py-16 px-5 bg-black">
        <div className="max-w-[800px] mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-teal-500/20 rounded-xl flex items-center justify-center">
              <RefreshCw className="w-7 h-7 text-teal-400" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">DOOR 4: REDIRECT</h2>
              <p className="text-teal-400 uppercase tracking-widest text-sm">Channel the energy somewhere that serves you</p>
            </div>
          </div>
          
          <div className="space-y-6 text-slate-300 leading-relaxed">
            <p>Here's what most people get wrong about pattern interruption:</p>
            
            <p className="text-white font-semibold">They think it's about STOPPING.</p>
            
            <p className="text-slate-400">
              Just... don't do the thing. Use willpower. Resist.
            </p>
            
            <p>
              But patterns have ENERGY behind them. Real, powerful, physiological energy.
            </p>
            
            <p className="text-pink-400 font-semibold">
              If you just try to suppress it, it will come out somewhere else. Usually somewhere worse.
            </p>
            
            <p className="text-white font-semibold text-lg">DOOR 4 is about redirection, not suppression.</p>
            
            <div className="space-y-6 mt-8">
              <div className="bg-slate-900 p-6 rounded-lg">
                <p className="text-pink-400 font-semibold mb-3">DISAPPEARING ACT → REDIRECT:</p>
                <p className="text-slate-400 mb-2">Instead of ghosting:</p>
                <p className="text-teal-400 italic">"I'm feeling overwhelmed and need space. Can we reconnect Friday?"</p>
                <p className="text-slate-500 text-sm mt-2">Same need for space. Different method.</p>
              </div>
              
              <div className="bg-slate-900 p-6 rounded-lg">
                <p className="text-pink-400 font-semibold mb-3">APOLOGY LOOP → REDIRECT:</p>
                <p className="text-slate-400 mb-2">Instead of "I'm so sorry":</p>
                <p className="text-teal-400 italic">"Thank you for your patience" or "I appreciate you"</p>
                <p className="text-slate-500 text-sm mt-2">Same acknowledgment. Different frame. No self-erasure.</p>
              </div>
              
              <div className="bg-slate-900 p-6 rounded-lg">
                <p className="text-pink-400 font-semibold mb-3">TESTING PATTERN → REDIRECT:</p>
                <p className="text-slate-400 mb-2">Instead of canceling plans to see if they'll chase you:</p>
                <p className="text-teal-400 italic">"I'm feeling insecure. Can you reassure me you want to hang out?"</p>
                <p className="text-slate-500 text-sm mt-2">Vulnerability instead of manipulation.</p>
              </div>
              
              <div className="bg-slate-900 p-6 rounded-lg">
                <p className="text-pink-400 font-semibold mb-3">SUCCESS SABOTAGE → REDIRECT:</p>
                <p className="text-slate-400 mb-2">Instead of abandoning the project:</p>
                <p className="text-teal-400 italic">"I'm going to work on THIS for 25 minutes. Then I can think about new ideas."</p>
                <p className="text-slate-500 text-sm mt-2">Contain the distraction. Complete instead of abandon.</p>
              </div>
            </div>
            
            <p className="text-white font-semibold text-lg pt-6 border-t border-zinc-800">
              Redirect gives you something TO DO. Not just something NOT TO DO.<br />
              That's why it works when willpower doesn't.
            </p>
          </div>
        </div>
      </section>

      {/* Why This Works */}
      <section className="py-16 px-5 bg-slate-950">
        <div className="max-w-[700px] mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
            WHY THIS WORKS WHEN EVERYTHING ELSE FAILS
          </h2>
          
          <div className="space-y-6 text-slate-300 leading-relaxed">
            <p>The Four Doors Protocol works because:</p>
            
            <ol className="space-y-3 pl-4">
              <li><span className="text-teal-400 font-semibold">1.</span> It intervenes at the right stage (between feeling and action, not after)</li>
              <li><span className="text-teal-400 font-semibold">2.</span> It doesn't require understanding WHY (just recognizing WHAT)</li>
              <li><span className="text-teal-400 font-semibold">3.</span> It's real-time (not in a therapy session, in the moment)</li>
              <li><span className="text-teal-400 font-semibold">4.</span> It's practical (specific actions, not abstract concepts)</li>
              <li><span className="text-teal-400 font-semibold">5.</span> It compounds (every interruption makes the next one easier)</li>
            </ol>
            
            <div className="bg-zinc-900 p-6 rounded-lg border-l-4 border-pink-500 mt-8">
              <p className="text-white font-semibold">
                This isn't about healing.<br />
                This isn't about processing.<br />
                This isn't about understanding your childhood.
              </p>
              <p className="text-teal-400 font-semibold mt-4 text-lg">
                This is about interruption.
              </p>
              <p className="text-slate-300 mt-2">
                And interruption is the only thing that actually stops patterns from running.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* This Is Not Therapy */}
      <section className="py-16 px-5 bg-black">
        <div className="max-w-[700px] mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
            THIS IS <span className="text-pink-400">NOT</span> THERAPY
          </h2>
          
          <div className="space-y-6 text-slate-300 leading-relaxed">
            <p>Therapy asks: <span className="text-white italic">"Why do I sabotage success?"</span></p>
            
            <p className="text-slate-400">
              Childhood wounds, fear of visibility, worthiness issues—all valid.
            </p>
            
            <p>
              The Four Doors Protocol asks: <span className="text-teal-400 italic">"What does Success Sabotage feel like in my body RIGHT NOW, and how do I interrupt it?"</span>
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <div className="bg-slate-900 p-6 rounded-lg text-center">
                <p className="text-white font-semibold mb-2">Therapy</p>
                <p className="text-slate-400">Explores your past</p>
              </div>
              <div className="bg-teal-900/30 border border-teal-500/30 p-6 rounded-lg text-center">
                <p className="text-teal-400 font-semibold mb-2">Four Doors Protocol</p>
                <p className="text-slate-300">Changes your present</p>
              </div>
            </div>
            
            <p className="text-slate-400 text-center mt-6">
              Both have value. They're solving different problems.
            </p>
            
            <p className="text-white font-semibold text-center">
              If you want to understand why, get therapy.<br />
              If you want to stop running patterns, use the Four Doors Protocol.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-5 bg-gradient-to-b from-slate-950 to-black">
        <div className="max-w-[700px] mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            READY TO LEARN?
          </h2>
          
          <p className="text-slate-300 mb-8">
            The Four Doors Protocol works on all nine patterns:<br />
            <span className="text-slate-400 text-sm">
              The Disappearing Act • The Apology Loop • The Testing Pattern • Attraction to Harm • Compliment Deflection • The Draining Bond • Success Sabotage • The Perfectionism Pattern • The Rage Pattern
            </span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/quiz"
              className="inline-block bg-teal-500 text-white font-semibold rounded-lg px-8 py-4 text-lg transition-all hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(20,184,166,0.4)]"
              data-testid="button-take-quiz"
            >
              Discover Your Pattern
            </Link>
            <Link 
              href="/"
              className="inline-block border border-slate-600 text-slate-300 font-semibold rounded-lg px-8 py-4 text-lg transition-all hover:border-teal-500 hover:text-teal-400"
              data-testid="link-back-home"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
