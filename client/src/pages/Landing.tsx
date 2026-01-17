import { Link } from "wouter";
import { ArrowRight, Check } from "lucide-react";
import { ScrollReveal } from "../components/animations/ScrollReveal";
import ParticleField from "../components/ParticleField";
import heroBackground from "@assets/archivist-hero-background.png";

const patterns = [
  {
    number: 1,
    name: "DISAPPEARING",
    description: "You ghost when relationships get close."
  },
  {
    number: 2,
    name: "APOLOGY LOOP",
    description: "You apologize for existing. Twenty times per day."
  },
  {
    number: 3,
    name: "TESTING",
    description: "You push people away to see if they'll stay."
  },
  {
    number: 4,
    name: "ATTRACTION TO HARM",
    description: "Safe people feel boring. Chaos feels like chemistry."
  },
  {
    number: 5,
    name: "COMPLIMENT DEFLECTION",
    description: "You can't accept praise without deflecting it."
  },
  {
    number: 6,
    name: "DRAINING BOND",
    description: "You can't leave. Even when you know you should."
  },
  {
    number: 7,
    name: "SUCCESS SABOTAGE",
    description: "You destroy things right before they succeed."
  }
];

const steps = [
  {
    title: "IDENTIFY THE PATTERN",
    description: "Take the 2-minute quiz. Get your result."
  },
  {
    title: "LEARN YOUR BODY SIGNATURE",
    description: "Your body signals the pattern BEFORE it runs. Learn the 3-7 second warning."
  },
  {
    title: "CIRCUIT BREAK",
    description: "Speak your circuit break statement. This creates a pause in the execution."
  },
  {
    title: "CHOOSE DIFFERENT BEHAVIOR",
    description: "In the pause, choose a different response. Not by willpower—by interruption."
  },
  {
    title: "TRACK AND REFINE",
    description: "Every attempt generates data. You get better over time."
  }
];

const pricingTiers = [
  {
    title: "7-DAY CRASH COURSE",
    price: "FREE",
    badge: "RECOMMENDED",
    features: [
      "Pattern identification quiz",
      "Complete pattern analysis",
      "7-day interruption protocol",
      "Circuit break scripts",
      "Body signature guide",
      "AI pattern coach (basic)"
    ],
    ctaText: "Start Free - Take Quiz",
    ctaLink: "/quiz",
    isPrimary: true,
    tier: "free"
  },
  {
    title: "90-DAY QUICK-START SYSTEM",
    price: "$47",
    badge: null,
    features: [
      "Everything in crash course",
      "All 7 patterns (not just yours)",
      "90-day structured protocol",
      "Crisis intervention protocols",
      "Relationship scripts",
      "Unlimited AI coach"
    ],
    ctaText: "Learn More",
    ctaLink: "/quick-start",
    isPrimary: false,
    tier: "quickstart"
  },
  {
    title: "COMPLETE ARCHIVE",
    price: "$197",
    badge: "PREMIUM",
    features: [
      "Everything in Quick-Start",
      "Pattern combinations",
      "Long-term maintenance",
      "Workplace scenarios",
      "Parenting protocols",
      "Lifetime access + updates"
    ],
    ctaText: "Learn More",
    ctaLink: "/complete-archive",
    isPrimary: false,
    tier: "archive"
  }
];

function QuizCTA({ text = "Take the 2-Minute Quiz", size = "default", className = "", dataCta = "quiz-start" }: { text?: string; size?: "default" | "large"; className?: string; dataCta?: string }) {
  const sizeClasses = size === "large" 
    ? "px-12 py-6 text-lg md:text-xl" 
    : "px-10 py-5 text-base md:text-lg";
  
  return (
    <Link href="/quiz">
      <button 
        data-testid={`button-${dataCta}`}
        data-cta={dataCta}
        className={`bg-teal-500 hover:bg-teal-400 text-white font-bold rounded-lg transition-all duration-300 hover:scale-[1.02] inline-flex items-center gap-3 shadow-[0_0_20px_rgba(20,184,166,0.5)] hover:shadow-[0_0_30px_rgba(20,184,166,0.6),0_0_50px_rgba(236,72,153,0.4)] ${sizeClasses} ${className}`}
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
      
      {/* SECTION 1: HERO - PREMIUM */}
      <section className="min-h-screen flex items-center justify-center relative px-4 pt-32 pb-20">
        {/* Background Image Layer */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.35,
          }}
        />
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
        {/* Particle Effects */}
        <div className="absolute inset-0 z-0">
          <ParticleField />
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="text-teal-400 text-sm md:text-base tracking-[0.3em] mb-8 font-medium">
            PATTERN ARCHAEOLOGY SESSION
          </p>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-[1.1]">
            <span className="text-white">Which Pattern Is</span>
            <br />
            <span className="bg-gradient-to-r from-white via-teal-400 to-pink-500 bg-clip-text text-transparent">Running Your Life?</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Find yours in 2 minutes. Then interrupt it.
          </p>
          
          <QuizCTA size="large" dataCta="hero-quiz-start" />
          
          <p className="text-gray-500 text-sm mt-6 tracking-wide">
            Free • Private • Brutally Honest
          </p>
        </div>
      </section>

      {/* SECTION 2: TRUST BUILDER */}
      <section className="py-24 md:py-32 px-4 bg-[#111111]">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              WHAT IS <span className="text-teal-400">PATTERN ARCHAEOLOGY</span>?
            </h2>
          </ScrollReveal>
          
          <ScrollReveal>
            <p className="text-lg md:text-xl text-gray-400 mb-8">
              Not therapy. Not self-help. Not another "healing journey."
            </p>
          </ScrollReveal>
          
          <ScrollReveal>
            <p className="text-2xl md:text-3xl text-teal-400 font-semibold mb-16">
              This is behavioral forensics.
            </p>
          </ScrollReveal>
          
          {/* Visual Diagram */}
          <ScrollReveal>
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 mb-16 text-lg md:text-xl">
              <span className="text-white font-medium">Trigger</span>
              <span className="text-teal-400">→</span>
              <span className="text-white font-medium">Body Sensation</span>
              <span className="bg-gradient-to-r from-teal-400 to-pink-500 bg-clip-text text-transparent">→</span>
              <span className="text-white font-medium">Thought</span>
              <span className="text-pink-500">→</span>
              <span className="text-white font-medium">Behavior</span>
            </div>
            <p className="text-pink-400 text-lg mb-16 font-medium">
              [ 3-7 second window ]
            </p>
          </ScrollReveal>
          
          <ScrollReveal>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-4">
              Right now, those 3-7 seconds are automatic.
            </p>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-12">
              We teach you to catch it before it executes.
            </p>
          </ScrollReveal>
          
          <ScrollReveal>
            <QuizCTA text="Take the Quiz - Find Your Pattern" dataCta="trust-quiz-start" />
          </ScrollReveal>
        </div>
      </section>

      {/* SECTION 3: THE 7 PATTERNS - PREMIUM CARDS */}
      <section className="py-24 md:py-32 px-4 bg-[#0a0a0a]" id="patterns">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center mb-6">
              THE 7 DESTRUCTIVE PATTERNS
            </h2>
            <p className="text-gray-400 text-lg md:text-xl text-center mb-16 md:mb-20">
              One (or more) of these is running your life:
            </p>
          </ScrollReveal>
          
          <div className="grid md:grid-cols-2 gap-8">
            {patterns.map((pattern) => (
              <ScrollReveal key={pattern.number}>
                <div 
                  data-testid={`pattern-card-${pattern.number}`}
                  className="group p-8 md:p-10 bg-[#1a1a1a] rounded-xl transition-all duration-300 hover:translate-y-[-4px] hover:scale-[1.02] h-full cursor-pointer relative overflow-hidden"
                  style={{
                    border: '2px solid transparent',
                    backgroundImage: 'linear-gradient(#1a1a1a, #1a1a1a), linear-gradient(135deg, #14B8A6 0%, #EC4899 100%)',
                    backgroundOrigin: 'border-box',
                    backgroundClip: 'padding-box, border-box',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                  }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                      boxShadow: 'inset 0 0 30px rgba(20,184,166,0.1), 0 8px 30px rgba(20,184,166,0.2), 0 8px 50px rgba(236,72,153,0.15)',
                    }}
                  />
                  <h3 className="relative z-10 mb-4">
                    <span className="text-teal-400 text-2xl md:text-3xl font-bold">{pattern.number}</span>
                    <span className="text-pink-500 text-2xl md:text-3xl font-bold">.</span>
                    <span className="text-white text-xl md:text-2xl font-bold ml-2 group-hover:text-teal-400 transition-colors">{pattern.name}</span>
                  </h3>
                  <p className="text-gray-300 text-lg md:text-xl leading-relaxed relative z-10">
                    {pattern.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
          
          <ScrollReveal>
            <div className="text-center mt-16 md:mt-20">
              <p className="text-xl md:text-2xl text-white mb-10">
                Which pattern made your stomach drop?
              </p>
              <QuizCTA text="Take the Quiz to Find Out" dataCta="patterns-quiz-start" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* SECTION 4: HOW IT WORKS */}
      <section className="py-24 md:py-32 px-4 bg-[#111111]" id="method">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center mb-16 md:mb-20">
              HERE'S HOW PATTERN INTERRUPTION WORKS
            </h2>
          </ScrollReveal>
          
          <div className="space-y-12 md:space-y-16">
            {steps.map((step, index) => (
              <ScrollReveal key={index}>
                <div className="flex gap-6 md:gap-8 items-start">
                  <div className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-full border-[3px] border-teal-500 flex items-center justify-center shadow-[0_0_20px_rgba(20,184,166,0.3)]">
                    <span className="text-teal-400 text-2xl md:text-3xl font-bold">{index + 1}</span>
                  </div>
                  <div className="pt-2 md:pt-4">
                    <h3 className="text-teal-400 text-xl md:text-2xl font-bold mb-3">
                      STEP {index + 1}: {step.title}
                    </h3>
                    <p className="text-gray-300 text-lg md:text-xl leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
          
          <ScrollReveal>
            <div className="mt-16 md:mt-20 text-center">
              <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-12">
                This isn't therapy. It's catching the pattern mid-execution and installing new behavior in real-time.
              </p>
              <QuizCTA text="Start Your 7-Day Crash Course - Take Quiz" dataCta="method-quiz-start" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* SECTION 5: THE ORIGINAL ROOM */}
      <section className="py-24 md:py-32 px-4 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center mb-12 md:mb-16">
              WHY PATTERNS RUN AUTOMATICALLY
            </h2>
          </ScrollReveal>
          
          <ScrollReveal>
            <div className="text-lg md:text-xl text-gray-300 leading-relaxed space-y-6 mb-12">
              <p>These patterns installed in what we call <span className="text-white font-semibold">The Original Room</span>.</p>
              
              <p>Your childhood environment. The people who raised you. The situations that shaped your nervous system before you had language.</p>
            </div>
          </ScrollReveal>
          
          <ScrollReveal>
            <h3 className="text-2xl md:text-3xl text-teal-400 font-semibold mb-8 text-center">
              In The Original Room, you learned equations:
            </h3>
          </ScrollReveal>
          
          <ScrollReveal>
            <div className="space-y-6 mb-12 max-w-2xl mx-auto">
              <div className="flex items-center gap-4 text-lg md:text-xl">
                <span className="text-teal-400 font-medium">Closeness</span>
                <span className="text-gray-500">=</span>
                <span className="text-pink-500 font-medium">Danger</span>
                <span className="text-gray-500 text-base ml-2">(Disappearing Pattern)</span>
              </div>
              <div className="flex items-center gap-4 text-lg md:text-xl">
                <span className="text-teal-400 font-medium">Your Needs</span>
                <span className="text-gray-500">=</span>
                <span className="text-pink-500 font-medium">Burden to Others</span>
                <span className="text-gray-500 text-base ml-2">(Apology Loop)</span>
              </div>
              <div className="flex items-center gap-4 text-lg md:text-xl">
                <span className="text-teal-400 font-medium">Love</span>
                <span className="text-gray-500">=</span>
                <span className="text-pink-500 font-medium">Pain + Chaos</span>
                <span className="text-gray-500 text-base ml-2">(Attraction to Harm)</span>
              </div>
              <div className="flex items-center gap-4 text-lg md:text-xl">
                <span className="text-teal-400 font-medium">Success</span>
                <span className="text-gray-500">=</span>
                <span className="text-pink-500 font-medium">Threat Incoming</span>
                <span className="text-gray-500 text-base ml-2">(Success Sabotage)</span>
              </div>
            </div>
          </ScrollReveal>
          
          <ScrollReveal>
            <div className="text-lg md:text-xl text-gray-300 leading-relaxed space-y-6">
              <p>Those equations still run today. Not because you're broken—because your nervous system is doing exactly what it was trained to do.</p>
              
              <p>The patterns aren't personality traits. They're survival code that wrote itself when you needed it and never got uninstalled.</p>
              
              <p className="text-white text-xl md:text-2xl mt-8">
                Pattern interruption doesn't rewrite The Original Room. It teaches you to catch the pattern before it executes.
              </p>
            </div>
          </ScrollReveal>
          
          <ScrollReveal>
            <div className="text-center mt-12 md:mt-16">
              <QuizCTA text="Find Your Pattern - Take the Quiz" dataCta="original-room-quiz-start" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* SECTION 6: PRICING - PREMIUM HIERARCHY */}
      <section className="py-24 md:py-32 px-4 bg-[#111111]" id="pricing">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center mb-16 md:mb-20">
              THE COMPLETE SYSTEM
            </h2>
          </ScrollReveal>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <ScrollReveal key={index}>
                <div 
                  className={`p-8 md:p-10 rounded-xl h-full flex flex-col relative transition-all duration-300 hover:translate-y-[-4px] ${
                    tier.tier === 'free' 
                      ? 'border-[3px] border-teal-500 shadow-[0_0_30px_rgba(20,184,166,0.3)] scale-[1.02]' 
                      : tier.tier === 'archive'
                      ? 'border-2 border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.2)]'
                      : ''
                  }`}
                  style={tier.tier === 'quickstart' ? {
                    border: '2px solid transparent',
                    backgroundImage: 'linear-gradient(#1a1a1a, #1a1a1a), linear-gradient(135deg, #14B8A6 0%, #EC4899 100%)',
                    backgroundOrigin: 'border-box',
                    backgroundClip: 'padding-box, border-box',
                  } : {
                    backgroundColor: '#1a1a1a'
                  }}
                >
                  {tier.badge && (
                    <div className={`absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-sm font-bold ${
                      tier.tier === 'free' ? 'bg-teal-500 text-white' : 'bg-pink-500 text-white'
                    }`}>
                      {tier.badge}
                    </div>
                  )}
                  
                  <h3 className="text-lg md:text-xl font-bold text-white mb-4 mt-2">
                    {tier.title}
                  </h3>
                  <p className={`text-5xl md:text-6xl font-bold mb-8 ${
                    tier.tier === 'free' ? 'text-teal-400' 
                    : tier.tier === 'archive' ? 'text-pink-500'
                    : 'bg-gradient-to-r from-teal-400 to-pink-500 bg-clip-text text-transparent'
                  }`}>
                    {tier.price}
                  </p>
                  
                  <ul className="space-y-4 mb-10 flex-grow">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                          tier.tier === 'free' ? 'text-teal-400'
                          : tier.tier === 'archive' ? 'text-pink-500'
                          : i % 2 === 0 ? 'text-teal-400' : 'text-pink-500'
                        }`} />
                        <span className="text-gray-300 text-base md:text-lg">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link href={tier.ctaLink}>
                    <button 
                      data-testid={`button-pricing-${index}`}
                      data-cta={`pricing-${tier.tier}`}
                      className={`w-full py-4 rounded-lg font-bold text-lg transition-all duration-300 ${
                        tier.isPrimary 
                          ? "bg-teal-500 hover:bg-teal-400 text-white shadow-[0_0_20px_rgba(20,184,166,0.4)] hover:shadow-[0_0_30px_rgba(20,184,166,0.5),0_0_40px_rgba(236,72,153,0.3)]" 
                          : tier.tier === 'archive'
                          ? "bg-transparent border-2 border-pink-500 text-pink-400 hover:bg-pink-500/10"
                          : "bg-transparent border-2 border-teal-500 text-teal-400 hover:bg-teal-500/10"
                      }`}
                    >
                      {tier.ctaText} {tier.isPrimary && <ArrowRight className="w-5 h-5 inline ml-2" />}
                    </button>
                  </Link>
                </div>
              </ScrollReveal>
            ))}
          </div>
          
          <ScrollReveal>
            <div className="text-center mt-16">
              <p className="text-gray-400 text-lg mb-10">
                Start with the free crash course. Upgrade only if it works for you.
              </p>
              <QuizCTA text="Take the Quiz - Start Free" size="large" dataCta="pricing-quiz-start" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* SECTION 7: SOCIAL PROOF */}
      <section className="py-24 md:py-28 px-4 bg-[#0a0a0a]">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-10">
              YOU'RE EARLY TO THIS
            </h2>
          </ScrollReveal>
          
          <ScrollReveal>
            <div className="text-lg md:text-xl text-gray-300 leading-relaxed space-y-6">
              <p>The Archivist Method launched January 2026. You're one of the first.</p>
              
              <p>No "10,000+ success stories." No manufactured testimonials. No inflated claims.</p>
              
              <p>Just a method that either works for your nervous system or doesn't.</p>
              
              <p className="text-teal-400 text-xl">
                The 7-day crash course shows you which. One successful interrupt in 7 days = proof of concept.
              </p>
              
              <p>Then you decide if you want to continue.</p>
              
              <p className="text-white font-medium text-xl mt-8">Fast validation. No bullshit. Real results or honest failure.</p>
            </div>
          </ScrollReveal>
          
          <ScrollReveal>
            <div className="mt-12">
              <QuizCTA text="Take the Quiz - Find Your Pattern" dataCta="social-proof-quiz-start" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* SECTION 8: FINAL CTA */}
      <section className="py-20 md:py-24 px-4 bg-[#111111]">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-10">
              FIND YOUR PATTERN
            </h2>
            
            <div className="text-xl md:text-2xl text-gray-300 space-y-3 mb-12">
              <p>Take the 2-minute quiz.</p>
              <p>Get your result + what's driving it.</p>
              <p>Start the free 7-day crash course.</p>
            </div>
            
            <QuizCTA text="Take the Pattern Quiz" size="large" dataCta="final-cta-quiz-start" />
            
            <p className="text-gray-500 text-sm mt-6 tracking-wide">
              Free • Private • Brutally Honest
            </p>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
