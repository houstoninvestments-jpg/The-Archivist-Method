import { Link } from "wouter";
import { ArrowRight, Check } from "lucide-react";
import { ScrollReveal } from "../components/animations/ScrollReveal";
import ParticleField from "../components/ParticleField";

const patterns = [
  {
    number: 1,
    name: "DISAPPEARING",
    description: "You ghost when relationships get close. Three months in, they say \"I love you\" and your chest gets tight. You watch yourself do it. You do it anyway."
  },
  {
    number: 2,
    name: "APOLOGY LOOP",
    description: "You apologize for existing. \"Sorry to bother you.\" \"Sorry, quick question.\" You apologize 20+ times per day for things that don't require apologies."
  },
  {
    number: 3,
    name: "TESTING",
    description: "You push people away to see if they'll stay. You create tests. They pass? You create bigger ones. You don't trust \"I'm not leaving\" until you've tested it 47 ways."
  },
  {
    number: 4,
    name: "ATTRACTION TO HARM",
    description: "Safe people feel boring. Chaos feels like chemistry. Red flags don't register as warnings—they register as attraction. Harm feels like home."
  },
  {
    number: 5,
    name: "COMPLIMENT DEFLECTION",
    description: "You can't accept praise. Someone says \"great work\" and you deflect, minimize, redirect. Visibility makes you squirm. Recognition makes you want to disappear."
  },
  {
    number: 6,
    name: "DRAINING BOND",
    description: "You can't leave. Toxic job, harmful relationship, depleting friendship—you know you should go. Everyone tells you to leave. You stay. Leaving feels like abandoning them."
  },
  {
    number: 7,
    name: "SUCCESS SABOTAGE",
    description: "You destroy things right before they succeed. Three weeks from launch, you quit. One week from promotion, you blow it up. Sustained success triggers panic, so you destroy it first."
  }
];

const steps = [
  {
    title: "IDENTIFY THE PATTERN",
    description: "Take the 2-minute quiz. Get your result. Understand what's been running your life."
  },
  {
    title: "LEARN YOUR BODY SIGNATURE",
    description: "Your body signals the pattern BEFORE it runs. Every time. That chest tightness? That sudden urge to flee? That crushing guilt? That's your 3-7 second warning."
  },
  {
    title: "CIRCUIT BREAK",
    description: "When you feel the body signature, you speak your circuit break statement. Out loud or in your head. This creates a pause in the automatic execution."
  },
  {
    title: "CHOOSE DIFFERENT BEHAVIOR",
    description: "In the pause the circuit break creates, you can choose a different response. Not by willpower. By interrupting the code before it runs."
  },
  {
    title: "TRACK AND REFINE",
    description: "Every attempt generates data. You learn what triggers you, when the pattern activates, what works to interrupt it. You get better over time."
  }
];

const pricingTiers = [
  {
    title: "7-DAY CRASH COURSE",
    price: "FREE",
    features: [
      "Pattern identification quiz",
      "Your complete pattern analysis",
      "7-day interruption protocol",
      "Circuit break scripts",
      "Body signature guide",
      "AI pattern coach (basic)"
    ],
    ctaText: "Start Free - Take Quiz",
    ctaLink: "/quiz",
    isPrimary: true
  },
  {
    title: "90-DAY QUICK-START SYSTEM",
    price: "$47",
    features: [
      "Everything in crash course",
      "All 7 patterns (not just yours)",
      "90-day structured protocol",
      "Crisis intervention protocols",
      "Relationship communication scripts",
      "Workplace applications",
      "Unlimited AI pattern coach"
    ],
    ctaText: "Learn More",
    ctaLink: "/quick-start",
    isPrimary: false
  },
  {
    title: "COMPLETE ARCHIVE",
    price: "$197",
    features: [
      "Everything in Quick-Start",
      "Pattern combinations (when 2-3 run together)",
      "Long-term maintenance protocols",
      "Advanced workplace scenarios",
      "Parenting with patterns",
      "Lifetime access + updates"
    ],
    ctaText: "Learn More",
    ctaLink: "/complete-archive",
    isPrimary: false
  }
];

function QuizCTA({ text = "Take the 2-Minute Quiz", size = "default", className = "", dataCta = "quiz-start" }: { text?: string; size?: "default" | "large"; className?: string; dataCta?: string }) {
  const sizeClasses = size === "large" 
    ? "px-10 py-5 text-lg md:text-xl" 
    : "px-8 py-4 text-base md:text-lg";
  
  return (
    <Link href="/quiz">
      <button 
        data-testid={`button-${dataCta}`}
        data-cta={dataCta}
        className={`bg-teal-500 hover:bg-teal-400 text-white font-bold rounded-lg transition-all duration-200 hover:scale-[1.02] inline-flex items-center gap-2 ${sizeClasses} ${className}`}
      >
        {text}
        <ArrowRight className="w-5 h-5" />
      </button>
    </Link>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative">
      <ParticleField />
      
      {/* SECTION 1: HERO */}
      <section className="min-h-screen flex items-center justify-center relative px-4 pt-20">
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <p className="text-gray-400 text-sm tracking-widest mb-6">
            PATTERN ARCHAEOLOGY SESSION
          </p>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Which Pattern Is Running Your Life?
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 mb-2">
            You watch yourself do it. You know it's happening. You do it anyway.
          </p>
          <p className="text-lg md:text-xl text-gray-400 mb-10">
            Find your pattern in 2 minutes — then get the free crash course to interrupt it.
          </p>
          
          <QuizCTA size="large" dataCta="hero-quiz-start" />
          
          <p className="text-gray-500 text-sm mt-4">
            Free • Private • Brutally Honest
          </p>
        </div>
      </section>

      {/* SECTION 2: TRUST BUILDER */}
      <section className="py-20 md:py-24 px-4 bg-[#111111]">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-teal-400 mb-8">
              WHAT IS PATTERN ARCHAEOLOGY?
            </h2>
          </ScrollReveal>
          
          <ScrollReveal>
            <div className="text-lg md:text-xl text-gray-300 leading-relaxed space-y-6">
              <p>Not therapy. Not self-help. Not another "healing journey."</p>
              <p className="text-white font-medium">This is behavioral forensics.</p>
              <p>
                Your destructive patterns run in a 3-7 second window:<br />
                <span className="text-teal-400">Trigger → Body sensation → Thought → Behavior</span>
              </p>
              <p>
                Right now, those 3-7 seconds are automatic. You don't see the pattern until after it's already run.
              </p>
              <p>
                Pattern archaeology teaches you to recognize the pattern BEFORE it executes. In that recognition, you create a gap. In that gap, you can interrupt the code.
              </p>
            </div>
          </ScrollReveal>
          
          <ScrollReveal>
            <div className="mt-12">
              <QuizCTA text="Take the Quiz - Find Your Pattern" dataCta="trust-quiz-start" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* SECTION 3: THE 7 PATTERNS */}
      <section className="py-20 md:py-24 px-4 bg-[#0a0a0a]" id="patterns">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center mb-4">
              THE 7 DESTRUCTIVE PATTERNS
            </h2>
            <p className="text-gray-400 text-lg md:text-xl text-center mb-12 md:mb-16">
              One (or more) of these is running your life:
            </p>
          </ScrollReveal>
          
          <div className="grid md:grid-cols-2 gap-6">
            {patterns.map((pattern) => (
              <ScrollReveal key={pattern.number}>
                <div 
                  data-testid={`pattern-card-${pattern.number}`}
                  className="p-6 md:p-8 bg-[#1a1a1a] border border-[#262626] rounded-xl hover:border-teal-500/50 hover:shadow-[0_0_30px_rgba(20,184,166,0.1)] transition-all duration-300 hover:scale-[1.02] h-full"
                >
                  <h3 className="text-teal-400 text-xl md:text-2xl font-bold mb-3">
                    {pattern.number}. {pattern.name}
                  </h3>
                  <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                    {pattern.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
          
          <ScrollReveal>
            <div className="text-center mt-12 md:mt-16">
              <p className="text-xl md:text-2xl text-white mb-8">
                Which pattern made your stomach drop?
              </p>
              <QuizCTA text="Take the Quiz to Find Out" dataCta="patterns-quiz-start" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* SECTION 4: HOW IT WORKS */}
      <section className="py-20 md:py-24 px-4 bg-[#111111]" id="method">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center mb-12 md:mb-16">
              HERE'S HOW PATTERN INTERRUPTION WORKS
            </h2>
          </ScrollReveal>
          
          <div className="space-y-10 md:space-y-12">
            {steps.map((step, index) => (
              <ScrollReveal key={index}>
                <div className="flex gap-4 md:gap-6">
                  <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-teal-500/20 border border-teal-500/50 flex items-center justify-center text-teal-400 font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-teal-400 text-lg md:text-xl font-bold mb-2">
                      STEP {index + 1}: {step.title}
                    </h3>
                    <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
          
          <ScrollReveal>
            <div className="mt-12 md:mt-16 text-center">
              <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10">
                This isn't therapy. It's not processing the original trauma. It's catching the pattern mid-execution and installing new behavior in real-time.
              </p>
              <QuizCTA text="Start Your 7-Day Crash Course - Take Quiz" dataCta="method-quiz-start" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* SECTION 5: THE ORIGINAL ROOM */}
      <section className="py-20 md:py-24 px-4 bg-[#0a0a0a]">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center mb-10 md:mb-12">
              WHY PATTERNS RUN AUTOMATICALLY
            </h2>
          </ScrollReveal>
          
          <ScrollReveal>
            <div className="text-lg md:text-xl text-gray-300 leading-relaxed space-y-6">
              <p>These patterns installed in what we call <span className="text-white font-medium">The Original Room</span>.</p>
              
              <p>Your childhood environment. The people who raised you. The situations that shaped your nervous system before you had language to process them.</p>
              
              <p>In The Original Room, you learned equations:</p>
              
              <ul className="space-y-3 my-6">
                <li className="flex items-start gap-3">
                  <span className="text-teal-400 mt-1">•</span>
                  <span>Closeness = Danger <span className="text-gray-500">(Disappearing Pattern)</span></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-400 mt-1">•</span>
                  <span>Your Needs = Burden to Others <span className="text-gray-500">(Apology Loop)</span></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-400 mt-1">•</span>
                  <span>Love = Pain + Chaos <span className="text-gray-500">(Attraction to Harm)</span></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-400 mt-1">•</span>
                  <span>Success = Threat Incoming <span className="text-gray-500">(Success Sabotage)</span></span>
                </li>
              </ul>
              
              <p>Those equations still run today. Not because you're broken. Because your nervous system is doing exactly what it was trained to do 20 years ago.</p>
              
              <p>The patterns aren't personality traits. They're survival code that wrote itself when you needed it—and never got uninstalled.</p>
              
              <p>Pattern interruption doesn't rewrite The Original Room. It teaches you to catch the pattern before it executes, so you can choose different behavior now.</p>
            </div>
          </ScrollReveal>
          
          <ScrollReveal>
            <div className="text-center mt-12">
              <QuizCTA text="Find Your Pattern - Take the Quiz" dataCta="original-room-quiz-start" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* SECTION 6: PRICING */}
      <section className="py-20 md:py-24 px-4 bg-[#111111]" id="pricing">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center mb-12 md:mb-16">
              THE COMPLETE SYSTEM
            </h2>
          </ScrollReveal>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {pricingTiers.map((tier, index) => (
              <ScrollReveal key={index}>
                <div className="p-6 md:p-8 bg-[#1a1a1a] border border-[#262626] rounded-xl h-full flex flex-col">
                  <h3 className="text-lg md:text-xl font-bold text-white mb-2">
                    {tier.title}
                  </h3>
                  <p className="text-3xl md:text-4xl font-bold text-teal-400 mb-6">
                    {tier.price}
                  </p>
                  
                  <ul className="space-y-3 mb-8 flex-grow">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300 text-sm md:text-base">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link href={tier.ctaLink}>
                    <button 
                      data-testid={`button-pricing-${index}`}
                      className={`w-full py-4 rounded-lg font-bold transition-all duration-200 ${
                        tier.isPrimary 
                          ? "bg-teal-500 hover:bg-teal-400 text-white" 
                          : "bg-transparent border border-teal-500 text-teal-400 hover:bg-teal-500/10"
                      }`}
                    >
                      {tier.ctaText} {tier.isPrimary && <ArrowRight className="w-4 h-4 inline ml-2" />}
                    </button>
                  </Link>
                </div>
              </ScrollReveal>
            ))}
          </div>
          
          <ScrollReveal>
            <div className="text-center mt-12">
              <p className="text-gray-400 text-lg mb-8">
                Start with the free crash course. Upgrade only if it works for you.
              </p>
              <QuizCTA text="Take the Quiz - Start Free" size="large" dataCta="pricing-quiz-start" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* SECTION 7: SOCIAL PROOF */}
      <section className="py-20 md:py-24 px-4 bg-[#0a0a0a]">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
              YOU'RE EARLY TO THIS
            </h2>
          </ScrollReveal>
          
          <ScrollReveal>
            <div className="text-lg md:text-xl text-gray-300 leading-relaxed space-y-6">
              <p>The Archivist Method launched January 2026. You're one of the first.</p>
              
              <p>No "10,000+ success stories." No manufactured testimonials. No inflated claims.</p>
              
              <p>Just a method that either works for your nervous system or doesn't.</p>
              
              <p>The 7-day crash course shows you which. One successful interrupt in 7 days = proof of concept. Then you decide if you want to continue.</p>
              
              <p className="text-white font-medium">Fast validation. No bullshit. Real results or honest failure.</p>
            </div>
          </ScrollReveal>
          
          <ScrollReveal>
            <div className="mt-10">
              <QuizCTA text="Take the Quiz - Find Your Pattern" dataCta="social-proof-quiz-start" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* SECTION 8: FINAL CTA */}
      <section className="py-16 md:py-20 px-4 bg-[#111111]">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8">
              FIND YOUR PATTERN
            </h2>
            
            <div className="text-lg md:text-xl text-gray-300 space-y-2 mb-10">
              <p>Take the 2-minute quiz.</p>
              <p>Get your result + what's driving it.</p>
              <p>Start the free 7-day crash course.</p>
            </div>
            
            <QuizCTA text="Take the Pattern Quiz" size="large" dataCta="final-cta-quiz-start" />
            
            <p className="text-gray-500 text-sm mt-4">
              Free • Private • Brutally Honest
            </p>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
