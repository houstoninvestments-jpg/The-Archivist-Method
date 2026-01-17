import { Link } from "wouter";
import { Check } from "lucide-react";
import { ScrollReveal } from "../components/animations/ScrollReveal";
import ParticleField from "../components/ParticleField";
import heroBackground from "@assets/archivist-hero-background.png";

const patterns = [
  {
    number: 1,
    name: "DISAPPEARING",
    description: "You ghost when relationships get close. Three months in, they say \"I love you\"—your chest gets tight. Every time."
  },
  {
    number: 2,
    name: "APOLOGY LOOP",
    description: "You apologize for existing. \"Sorry to bother you.\" \"Sorry, quick question.\" Twenty times a day for things that need no apology."
  },
  {
    number: 3,
    name: "TESTING",
    description: "You push people away to see if they'll stay. They pass the test? You create a bigger one. You don't trust \"I'm not leaving\" until you've tested it 47 ways."
  },
  {
    number: 4,
    name: "ATTRACTION TO HARM",
    description: "Safe people feel boring. Chaos feels like chemistry. Red flags don't register as warnings—they register as attraction. Harm feels like home."
  },
  {
    number: 5,
    name: "COMPLIMENT DEFLECTION",
    description: "You can't accept praise. Someone says \"great work\"—you deflect, minimize, redirect. Visibility makes you squirm. Recognition makes you want to disappear."
  },
  {
    number: 6,
    name: "DRAINING BOND",
    description: "You can't leave. Toxic job, harmful relationship, depleting friendship. You know you should go. Everyone tells you to leave. You stay."
  },
  {
    number: 7,
    name: "SUCCESS SABOTAGE",
    description: "You destroy things right before they succeed. Three weeks from launch, you quit. One week from promotion, you blow it up. Sustained success triggers panic—so you destroy it first."
  }
];

const steps = [
  {
    number: 1,
    title: "IDENTIFY THE PATTERN",
    description: "Take the 2-minute assessment. Get your pattern analysis and the specific equation running your life."
  },
  {
    number: 2,
    title: "LEARN YOUR BODY SIGNATURE",
    description: "Your body signals the pattern 3-7 seconds before it runs. That chest tightness. That sudden urge to flee. That crushing guilt. Learn to recognize your warning."
  },
  {
    number: 3,
    title: "INSTALL YOUR CIRCUIT BREAK",
    description: "When you feel your body signature, speak your circuit break statement. Out loud or internal. This creates a pause in the automatic execution."
  },
  {
    number: 4,
    title: "PRACTICE & TRACK",
    description: "Attempt interruptions. Track what works. Refine your approach. You get better every time."
  }
];

const pricingTiers = [
  {
    title: "7-DAY CRASH COURSE",
    price: "FREE",
    description: "Start here. See if pattern interruption works for your nervous system.",
    features: [
      "2-minute pattern assessment",
      "Your complete pattern analysis",
      "7-day interruption protocol",
      "Circuit break scripts for your pattern",
      "Body signature identification guide",
      "Basic AI pattern coach"
    ],
    ctaText: "Start Free - Take Assessment",
    ctaLink: "/quiz",
    isPrimary: true,
    tier: "free"
  },
  {
    title: "90-DAY QUICK-START SYSTEM",
    price: "$47",
    priceNote: "one-time",
    description: "For people who got proof of concept in the crash course and want to master pattern interruption.",
    features: [
      "All 7 patterns (not just yours)",
      "90-day structured protocol",
      "Crisis intervention scripts",
      "Relationship communication guide",
      "Workplace application protocols",
      "Unlimited AI pattern coach"
    ],
    ctaText: "Learn More About Quick-Start",
    ctaLink: "/quick-start",
    isPrimary: false,
    tier: "quickstart"
  },
  {
    title: "COMPLETE ARCHIVE",
    price: "$197",
    priceNote: "one-time",
    description: "For people serious about breaking patterns long-term and handling complex situations.",
    features: [
      "Pattern combinations (when 2-3 run together)",
      "Long-term maintenance protocols (years 1-5)",
      "Advanced workplace scenarios",
      "Parenting with patterns (break the cycle)",
      "Lifetime access + all future updates"
    ],
    ctaText: "Learn More About Archive",
    ctaLink: "/complete-archive",
    isPrimary: false,
    tier: "archive"
  }
];

function PrimaryCTA({ text = "Take the Pattern Assessment", className = "", dataTestId = "button-cta" }: { text?: string; className?: string; dataTestId?: string }) {
  return (
    <Link 
      href="/quiz"
      data-testid={dataTestId}
      className={`bg-teal-500 hover:bg-teal-400 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-[1.02] inline-flex items-center gap-2 px-8 py-4 text-lg shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_30px_rgba(20,184,166,0.4),0_0_60px_rgba(236,72,153,0.2)] ${className}`}
    >
      {text} →
    </Link>
  );
}

function SecondaryCTA({ text, href, className = "", dataTestId = "button-secondary-cta" }: { text: string; href: string; className?: string; dataTestId?: string }) {
  return (
    <Link 
      href={href}
      data-testid={dataTestId}
      className={`border-2 border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(20,184,166,0.4),0_0_60px_rgba(236,72,153,0.2)] inline-flex items-center gap-2 px-8 py-4 text-lg ${className}`}
    >
      {text} →
    </Link>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-black text-white">
      
      {/* SECTION 1: HERO */}
      <section className="min-h-screen flex items-center justify-center relative px-4 pt-24 pb-20">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.3,
          }}
        />
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
        {/* Particle Effects */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <ParticleField />
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Brand Lockup */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-3 tracking-tight" data-testid="text-hero-title">
            THE ARCHIVIST METHOD<span className="text-teal-400">™</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl tracking-[0.2em] mb-12 font-medium" data-testid="text-hero-tagline">
            PATTERN ARCHAEOLOGY, <span className="text-pink-500">NOT</span> THERAPY
          </p>
          
          {/* Visual Break - 40px */}
          
          {/* Main Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight" data-testid="text-hero-headline">
            Stop Running the Same Destructive Patterns
          </h2>
          
          {/* Subhead */}
          <p className="text-xl md:text-2xl text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed" data-testid="text-hero-subhead">
            You watch yourself do it. You know it's happening.<br className="hidden sm:block" /> You do it anyway.
          </p>
          
          {/* Value Prop */}
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto" data-testid="text-hero-value-prop">
            Identify your pattern in 2 minutes. Get your 7-day interruption protocol. Start breaking the cycle today.
          </p>
          
          {/* CTA */}
          <div className="mb-8">
            <PrimaryCTA text="Take the Pattern Assessment" dataTestId="button-hero-cta" />
          </div>
          
          {/* Trust Indicators */}
          <p className="text-gray-500 text-sm tracking-wider" data-testid="text-hero-trust">
            Free • No Email Required • Instant Results
          </p>
        </div>
      </section>

      {/* SECTION 2: THE 7 PATTERNS */}
      <section className="py-24 md:py-32 px-4 bg-[#0d0d0d]" id="patterns">
        <ScrollReveal>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" data-testid="text-patterns-title">
                THE 7 DESTRUCTIVE PATTERNS
              </h2>
              <p className="text-xl text-gray-400" data-testid="text-patterns-subtitle">
                One (or more) of these is running your life:
              </p>
            </div>

            {/* Pattern Grid - 2 columns on desktop */}
            <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-12">
              {patterns.map((pattern) => (
                <div
                  key={pattern.number}
                  className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 md:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4),0_0_20px_rgba(20,184,166,0.1)]"
                  data-testid={`card-pattern-${pattern.number}`}
                >
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-teal-400 text-2xl md:text-3xl font-bold">{pattern.number}.</span>
                    <span className="text-white text-lg md:text-xl font-bold">{pattern.name}</span>
                  </div>
                  <p className="text-gray-400 text-base md:text-lg leading-relaxed">
                    {pattern.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Emotional Anchor */}
            <div className="text-center">
              <p className="text-xl md:text-2xl text-gray-300 mb-8 italic" data-testid="text-patterns-anchor">
                Which one made your stomach drop?
              </p>
              <PrimaryCTA text="Find Your Pattern - Take Assessment" dataTestId="button-patterns-cta" />
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* SECTION 3: THE ORIGIN (The Original Room) */}
      <section className="py-24 md:py-32 px-4 bg-black" id="origin">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2" data-testid="text-origin-title">
                THESE AREN'T PERSONALITY TRAITS.
              </h2>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-teal-400" data-testid="text-origin-title-2">
                THEY'RE SURVIVAL CODE.
              </h2>
            </div>

            <div className="space-y-8 text-lg md:text-xl text-gray-300 leading-relaxed">
              <p data-testid="text-origin-p1">
                The patterns installed in what we call <span className="text-white font-semibold">The Original Room</span>.
              </p>
              
              <p data-testid="text-origin-p2">
                Your childhood. The environment that shaped your nervous system before you had language to process what was happening.
              </p>

              <p data-testid="text-origin-p3">
                In The Original Room, you learned equations:
              </p>

              {/* Equations */}
              <div className="space-y-3 pl-4 md:pl-8 text-xl md:text-2xl" data-testid="text-origin-equations">
                <p><span className="text-teal-400">Closeness</span> = <span className="text-pink-500">Danger</span></p>
                <p><span className="text-teal-400">Your Needs</span> = <span className="text-pink-500">Burden to Others</span></p>
                <p><span className="text-teal-400">Love</span> = <span className="text-pink-500">Pain + Chaos</span></p>
                <p><span className="text-teal-400">Success</span> = <span className="text-pink-500">Threat Incoming</span></p>
              </div>

              <p data-testid="text-origin-p4">
                Those equations are still running. Not because you're broken. Because your nervous system is doing exactly what it was trained to do 20 years ago.
              </p>

              {/* The Mechanism */}
              <div className="border-l-2 border-teal-400/50 pl-6 py-4" data-testid="text-origin-mechanism">
                <p className="text-white font-medium mb-4">
                  Right now, your patterns run in a 3-7 second window:
                </p>
                <p className="text-2xl md:text-3xl font-medium text-center py-4">
                  <span className="text-gray-400">Trigger</span> → <span className="text-gray-300">Body Sensation</span> → <span className="text-gray-200">Thought</span> → <span className="text-white">Behavior</span>
                </p>
                <p className="text-gray-400">
                  You don't catch the pattern until after it's already executed.
                </p>
              </div>

              {/* The Solution */}
              <p data-testid="text-origin-solution">
                <span className="text-white font-semibold">Pattern archaeology</span> teaches you to recognize the pattern BEFORE it runs. In that 3-7 second window. In that recognition, you create a gap. In that gap, you can interrupt the code.
              </p>
            </div>

            <div className="text-center mt-12">
              <PrimaryCTA text="Learn Your Pattern - Take Assessment" dataTestId="button-origin-cta" />
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* SECTION 4: THE METHOD (4 Steps) */}
      <section className="py-24 md:py-32 px-4 bg-[#0d0d0d]" id="method">
        <ScrollReveal>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold" data-testid="text-method-title">
                HERE'S HOW YOU INTERRUPT A PATTERN
              </h2>
            </div>

            {/* 4 Steps */}
            <div className="space-y-12 md:space-y-16">
              {steps.map((step) => (
                <div key={step.number} className="flex gap-6 md:gap-8" data-testid={`step-${step.number}`}>
                  {/* Number Circle */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-teal-500 flex items-center justify-center">
                      <span className="text-teal-400 text-2xl md:text-4xl font-bold">{step.number}</span>
                    </div>
                  </div>
                  {/* Content */}
                  <div className="pt-2 md:pt-4">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-3">{step.title}</h3>
                    <p className="text-gray-400 text-base md:text-lg leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Timeline Callout */}
            <div className="mt-16 bg-[#1a1a1a] border border-[#333] rounded-lg p-6 md:p-8" data-testid="box-timeline">
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                The <span className="text-white font-semibold">7-day protocol</span> gives you proof of concept. One successful interrupt = the method works for you. Then decide if you want to continue.
              </p>
            </div>

            <div className="text-center mt-12">
              <PrimaryCTA text="Start Your Free Protocol" dataTestId="button-method-cta" />
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* SECTION 5: PRICING */}
      <section className="py-24 md:py-32 px-4 bg-black" id="pricing">
        <ScrollReveal>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold" data-testid="text-pricing-title">
                THE COMPLETE SYSTEM
              </h2>
            </div>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-16">
              {pricingTiers.map((tier) => (
                <div
                  key={tier.tier}
                  className={`bg-[#1a1a1a] rounded-xl p-6 md:p-10 transition-all duration-300 ${
                    tier.isPrimary 
                      ? "border-2 border-teal-500 md:scale-105 shadow-[0_0_30px_rgba(20,184,166,0.2)]" 
                      : "border border-[#333]"
                  }`}
                  data-testid={`card-pricing-${tier.tier}`}
                >
                  <h3 className="text-lg md:text-xl font-semibold text-white mb-3">{tier.title}</h3>
                  <div className="mb-4">
                    <span className="text-4xl md:text-5xl font-bold text-teal-400">{tier.price}</span>
                    {tier.priceNote && <span className="text-gray-500 ml-2 text-sm">{tier.priceNote}</span>}
                  </div>
                  <p className="text-gray-400 text-base leading-relaxed mb-6">{tier.description}</p>
                  
                  {tier.isPrimary && (
                    <p className="text-sm text-gray-500 mb-4">What's included:</p>
                  )}
                  {tier.tier === 'quickstart' && (
                    <p className="text-sm text-gray-500 mb-4">Everything in free, plus:</p>
                  )}
                  {tier.tier === 'archive' && (
                    <p className="text-sm text-gray-500 mb-4">Everything in Quick-Start, plus:</p>
                  )}
                  
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3 text-gray-300 text-sm md:text-base">
                        <Check className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {tier.isPrimary ? (
                    <PrimaryCTA text={tier.ctaText} className="w-full justify-center" dataTestId={`button-pricing-${tier.tier}`} />
                  ) : (
                    <SecondaryCTA text={tier.ctaText} href={tier.ctaLink} className="w-full justify-center" dataTestId={`button-pricing-${tier.tier}`} />
                  )}
                </div>
              ))}
            </div>

            {/* Positioning */}
            <div className="text-center max-w-2xl mx-auto">
              <p className="text-lg md:text-xl text-gray-300 mb-4" data-testid="text-pricing-positioning">
                Start with the free 7-day crash course.
              </p>
              <p className="text-gray-400 mb-4">
                One successful pattern interrupt in 7 days = proof the method works for you. Then decide if you want the 90-day system or the complete archive.
              </p>
              <p className="text-gray-500 italic">
                No pressure. No tricks. Just fast validation and honest results.
              </p>
            </div>

            <div className="text-center mt-12">
              <PrimaryCTA text="Take the Assessment - Start Free" dataTestId="button-pricing-final-cta" />
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* SECTION 6: THE TRUTH (Honest Social Proof) */}
      <section className="py-24 md:py-32 px-4 bg-black" id="truth">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8" data-testid="text-truth-title">
              YOU'RE EARLY TO THIS
            </h2>

            <div className="space-y-6 text-lg md:text-xl text-gray-300 leading-relaxed">
              <p data-testid="text-truth-p1">
                The Archivist Method launched January 2026. You're one of the first.
              </p>
              
              <p className="text-gray-500" data-testid="text-truth-p2">
                No "10,000+ transformed lives."<br />
                No manufactured testimonials.<br />
                No inflated claims about miracle results.
              </p>

              <p data-testid="text-truth-p3">
                Just a method that either works for your nervous system or it doesn't.
              </p>

              <p className="text-white font-medium" data-testid="text-truth-p4">
                The 7-day crash course shows you which.
              </p>

              <div className="py-6" data-testid="text-truth-binary">
                <p className="text-teal-400">One successful pattern interrupt = proof of concept.</p>
                <p className="text-gray-500">Zero successful interrupts = this isn't for you.</p>
              </div>

              <p className="text-gray-400 italic" data-testid="text-truth-p5">
                Fast validation. No bullshit. Real results or honest failure.
              </p>
            </div>

            <div className="mt-12">
              <PrimaryCTA text="Find Out If It Works - Take Assessment" dataTestId="button-truth-cta" />
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* SECTION 7: FINAL CTA */}
      <section className="py-24 md:py-32 px-4 bg-[#0d0d0d]" id="final-cta">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-10" data-testid="text-final-title">
              STOP RUNNING THE PATTERN
            </h2>

            <div className="space-y-2 text-lg md:text-xl text-gray-300 mb-10" data-testid="text-final-steps">
              <p>Take the 2-minute assessment.</p>
              <p>Get your 7-day interruption protocol.</p>
              <p>Start breaking the cycle today.</p>
            </div>

            <div className="mb-8">
              <PrimaryCTA text="Take the Pattern Assessment" className="px-10 py-5 text-xl" dataTestId="button-final-cta" />
            </div>

            {/* Trust Indicators */}
            <p className="text-gray-500 text-sm tracking-wider" data-testid="text-final-trust">
              Free • Private • No Email Required • Instant Results
            </p>
          </div>
        </ScrollReveal>
      </section>

    </div>
  );
}
