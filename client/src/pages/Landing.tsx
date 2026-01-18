import { Link } from "wouter";
import { Check } from "lucide-react";
import { useEffect, useRef } from "react";
import heroBackground from "@assets/archivist-hero-background.png";
import ParticleField from "@/components/ParticleField";

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
    title: "IDENTIFY YOUR PATTERN",
    description: "Take the 2-minute assessment. Get your pattern analysis and the specific equation running your life."
  },
  {
    number: 2,
    title: "LEARN YOUR BODY SIGNATURE",
    description: "Your body signals the pattern 3-7 seconds before it runs. That chest tightness. That sudden urge to flee. That crushing guilt. Learn to recognize your warning."
  },
  {
    number: 3,
    title: "INTERRUPT & TRACK",
    description: "When you feel your body signature, speak your circuit break statement. Out loud or internal. Track attempts. Refine approach. You get better every time."
  }
];

const crashCoursePerks = [
  "Your experience shapes how we build this",
  "Featured on the site if you share your results",
  "Early access to new protocols before anyone else",
  "Beta tester badge (you were here first)"
];

const purchasePerks = [
  "Everything above, plus",
  "Private community access (coming soon)",
  "First to know about new features",
  "Input on which patterns we add next",
  "Permanent access to all future updates"
];

function PrimaryCTA({ text = "Take the Pattern Assessment", className = "", dataTestId = "button-cta" }: { text?: string; className?: string; dataTestId?: string }) {
  return (
    <Link 
      href="/quiz"
      data-testid={dataTestId}
      className={`inline-block bg-teal-500 text-white font-semibold rounded-lg transition-all duration-300 hover:-translate-y-0.5 px-10 py-5 text-lg shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_30px_rgba(236,72,153,0.4),0_6px_40px_rgba(236,72,153,0.3)] hover:bg-gradient-to-r hover:from-teal-500 hover:to-pink-500 ${className}`}
    >
      {text} →
    </Link>
  );
}

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -100px 0px' }
    );
    
    if (ref.current) {
      const elements = ref.current.querySelectorAll('.scroll-reveal');
      elements.forEach((el) => observer.observe(el));
    }
    
    return () => observer.disconnect();
  }, []);
  
  return ref;
}

export default function Landing() {
  const patternsRef = useScrollReveal();
  const originRef = useScrollReveal();
  const methodRef = useScrollReveal();
  const foundingRef = useScrollReveal();
  
  return (
    <div className="min-h-screen bg-black text-white font-['Inter',sans-serif]">
      {/* Floating Particles - All Pages */}
      <ParticleField />
      
      {/* SECTION 1: HERO */}
      <section 
        id="hero"
        className="relative min-h-screen flex items-center justify-center px-5 py-24"
        style={{
          backgroundImage: `url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Lighter overlay - reduced opacity for more background visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(10,10,10,0.5)] to-[rgba(10,10,10,0.7)]" />
        
        <div className="relative z-10 max-w-[900px] text-center">
          {/* Brand Lockup with Archival Reveal Animation */}
          <div className="overflow-hidden h-[120px] md:h-[140px] mb-10">
            <h1 
              className="font-['Bebas_Neue',Oswald,sans-serif] text-[40px] md:text-[64px] font-bold tracking-wider uppercase text-white m-0 leading-tight animate-archival-reveal"
              data-testid="text-brand-title"
            >
              THE ARCHIVIST METHOD™
            </h1>
            <p 
              className="font-['Inter',sans-serif] text-base md:text-xl font-normal tracking-wide uppercase text-white mt-2 opacity-0 animate-fade-in-delay"
              data-testid="text-brand-tagline"
            >
              PATTERN ARCHAEOLOGY, <span className="text-pink-500">NOT</span> THERAPY
            </p>
          </div>
          
          {/* Headline */}
          <h2 
            className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
            data-testid="text-hero-headline"
          >
            Stop Running the <span className="text-pink-500">Same Destructive</span> Patterns
          </h2>
          
          {/* Subhead */}
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-10">
            You watch yourself do it. You know it's happening.<br />
            You do it anyway.
          </p>
          
          {/* CTA */}
          <PrimaryCTA dataTestId="button-hero-cta" />
          
          {/* Trust Indicators */}
          <p className="mt-4 text-sm text-gray-500" data-testid="text-trust-indicators">
            Free • 2 Minutes • Instant Results
          </p>
        </div>
      </section>
      
      {/* SECTION 2: THE 7 PATTERNS */}
      <section 
        id="patterns"
        ref={patternsRef}
        className="bg-black py-24 md:py-32 px-5"
      >
        <div className="max-w-[1400px] mx-auto">
          <h2 
            className="scroll-reveal opacity-0 translate-y-2.5 transition-all duration-800 text-4xl md:text-5xl font-bold text-white text-center mb-6"
            data-testid="text-patterns-headline"
          >
            THE 7 DESTRUCTIVE PATTERNS
          </h2>
          <p className="scroll-reveal opacity-0 translate-y-2.5 transition-all duration-800 text-lg md:text-xl text-gray-400 text-center mb-16">
            One (or more) of these is running your life:
          </p>
          
          {/* Pattern Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {patterns.map((pattern, index) => (
              <div 
                key={pattern.number}
                className={`scroll-reveal opacity-0 translate-y-5 transition-all duration-600 bg-[#1a1a1a] border border-[#333333] p-8 rounded-lg hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4),0_0_20px_rgba(20,184,166,0.1)]`}
                style={{ transitionDelay: `${index * 100}ms` }}
                data-testid={`card-pattern-${pattern.number}`}
              >
                <div className="mb-3">
                  <span className="text-pink-500 text-3xl font-bold">{pattern.number}.</span>
                  <span className="text-white text-xl font-bold ml-2">{pattern.name}</span>
                </div>
                <p className="text-gray-300 text-base leading-relaxed">
                  {pattern.description}
                </p>
              </div>
            ))}
          </div>
          
          {/* Post-cards CTA */}
          <div className="text-center">
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Which one made your stomach drop?
            </p>
            <PrimaryCTA text="Find Your Pattern - Take Assessment" dataTestId="button-patterns-cta" />
          </div>
        </div>
      </section>
      
      {/* SECTION 3: THE ORIGIN */}
      <section 
        id="origin"
        ref={originRef}
        className="bg-[#0d0d0d] py-20 md:py-24 px-5"
      >
        <div className="max-w-[900px] mx-auto">
          <h2 
            className="scroll-reveal opacity-0 translate-y-2.5 transition-all duration-800 text-3xl md:text-[42px] font-bold text-white mb-10 leading-snug"
            data-testid="text-origin-headline"
          >
            THESE AREN'T PERSONALITY TRAITS. THEY'RE <span className="text-pink-500">SURVIVAL CODE</span>.
          </h2>
          
          <div className="space-y-6">
            <p className="scroll-reveal opacity-0 translate-y-2.5 transition-all duration-800 text-lg text-gray-300 leading-relaxed">
              The patterns installed in what we call The Original Room.
            </p>
            
            <p className="scroll-reveal opacity-0 translate-y-2.5 transition-all duration-800 text-lg text-gray-300 leading-relaxed">
              Your childhood. The environment that shaped your nervous system before you had language to process what was happening.
            </p>
            
            <p className="scroll-reveal opacity-0 translate-y-2.5 transition-all duration-800 text-lg text-gray-300 leading-relaxed">
              In The Original Room, you learned equations:
            </p>
            
            {/* Equations */}
            <div className="scroll-reveal opacity-0 translate-y-2.5 transition-all duration-800 text-xl text-teal-500 leading-loose pl-5 my-8">
              <p>Closeness = Danger</p>
              <p>Your Needs = Burden to Others</p>
              <p>Love = Pain + Chaos</p>
              <p>Success = Threat Incoming</p>
            </div>
            
            <p className="scroll-reveal opacity-0 translate-y-2.5 transition-all duration-800 text-lg text-gray-300 leading-relaxed">
              Those equations are still running. Not because you're broken. Because your nervous system is doing exactly what it was trained to do 20 years ago.
            </p>
            
            <p className="scroll-reveal opacity-0 translate-y-2.5 transition-all duration-800 text-lg text-gray-300 leading-relaxed">
              Right now, your patterns run in a 3-7 second window:
            </p>
            
            {/* Pattern Window */}
            <p className="scroll-reveal opacity-0 translate-y-2.5 transition-all duration-800 text-xl text-teal-500 font-semibold text-center my-8">
              Trigger → Body Sensation → Thought → Behavior
            </p>
            
            <p className="scroll-reveal opacity-0 translate-y-2.5 transition-all duration-800 text-lg text-gray-300 leading-relaxed">
              You don't catch the pattern until after it's already executed.
            </p>
            
            <p className="scroll-reveal opacity-0 translate-y-2.5 transition-all duration-800 text-lg text-gray-300 leading-relaxed">
              Pattern archaeology teaches you to recognize the pattern BEFORE it runs. In that 3-7 second window. In that recognition, you create a gap. In that gap, you can interrupt the code.
            </p>
          </div>
          
          <div className="mt-12 text-center">
            <PrimaryCTA text="Learn Your Pattern - Take Assessment" dataTestId="button-origin-cta" />
          </div>
        </div>
      </section>
      
      {/* SECTION 4: THE METHOD */}
      <section 
        id="method"
        ref={methodRef}
        className="bg-black py-20 md:py-24 px-5"
      >
        <div className="max-w-[1000px] mx-auto">
          <h2 
            className="scroll-reveal opacity-0 translate-y-2.5 transition-all duration-800 text-3xl md:text-[42px] font-bold text-white text-center mb-16"
            data-testid="text-method-headline"
          >
            HOW PATTERN <span className="text-pink-500">INTERRUPTION</span> WORKS
          </h2>
          
          {/* Steps */}
          <div className="space-y-12 mb-12">
            {steps.map((step, index) => (
              <div 
                key={step.number}
                className="scroll-reveal opacity-0 translate-y-2.5 transition-all duration-800 flex flex-col md:flex-row gap-4 md:gap-8 items-start"
                style={{ transitionDelay: `${index * 150}ms` }}
                data-testid={`step-${step.number}`}
              >
                <div className="flex-shrink-0 w-[60px] h-[60px] rounded-full border-[3px] border-teal-500 flex items-center justify-center text-3xl font-bold text-teal-500">
                  {step.number}
                </div>
                <div className="flex-1">
                  <h3 className="text-teal-500 text-xl md:text-2xl font-bold mb-2">
                    STEP {step.number}: {step.title}
                  </h3>
                  <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Closing */}
          <p className="scroll-reveal opacity-0 translate-y-2.5 transition-all duration-800 text-lg md:text-xl text-gray-300 text-center leading-relaxed mb-10">
            The 7-day protocol gives you proof of concept. One successful interrupt = the method works for you. Then decide.
          </p>
          
          <div className="text-center">
            <PrimaryCTA text="Start Your Free Protocol" dataTestId="button-method-cta" />
          </div>
        </div>
      </section>
      
      {/* SECTION 5: BETA LAUNCH PERKS */}
      <section 
        id="beta-perks"
        ref={foundingRef}
        className="relative bg-[#0d0d0d] py-24 md:py-32 px-5"
      >
        {/* Subtle teal glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(20,184,166,0.03)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="relative z-10 max-w-[1100px] mx-auto">
          <h2 
            className="scroll-reveal opacity-0 translate-y-2.5 transition-all duration-800 text-4xl md:text-5xl font-bold text-white text-center mb-8"
            data-testid="text-beta-headline"
          >
            YOU'RE EARLY TO THIS
          </h2>
          
          <div className="scroll-reveal opacity-0 translate-y-2.5 transition-all duration-800 text-lg md:text-xl text-gray-300 text-center leading-relaxed max-w-[800px] mx-auto mb-16">
            <p className="mb-6">The Archivist Method launched January 2026.</p>
            <p className="mb-6">
              No "10,000+ success stories." No manufactured testimonials.<br />
              No inflated claims.
            </p>
            <p>
              Just a method that either works for your nervous system or doesn't.<br />
              The 7-day crash course shows you which. One successful pattern interrupt = proof of concept.
            </p>
          </div>
          
          <h3 className="scroll-reveal opacity-0 translate-y-2.5 transition-all duration-800 text-2xl md:text-3xl font-bold text-center mb-8">
            <span className="text-pink-500">BETA</span> <span className="text-teal-500">LAUNCH PERKS</span>
          </h3>
          <p className="scroll-reveal opacity-0 translate-y-2.5 transition-all duration-800 text-gray-400 text-center mb-12">
            (Available through February 28, 2026)
          </p>
          
          {/* Crash Course Perks Box */}
          <div className="scroll-reveal opacity-0 translate-y-2.5 transition-all duration-800 bg-[#1a1a1a] border border-[#333333] rounded-xl p-8 md:p-10 mb-8">
            <h4 className="text-white text-xl font-bold mb-6">If you're one of the first 100 to complete the crash course:</h4>
            <ul className="space-y-4">
              {crashCoursePerks.map((perk, index) => (
                <li key={index} className="flex items-start gap-4 text-gray-300 text-lg">
                  <Check className="w-6 h-6 text-teal-500 flex-shrink-0 mt-0.5" />
                  <span>{perk}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Purchase Perks Box */}
          <div className="scroll-reveal opacity-0 translate-y-2.5 transition-all duration-800 bg-[#1a1a1a] border border-[#333333] rounded-xl p-8 md:p-10 mb-10">
            <h4 className="text-white text-xl font-bold mb-6">If you buy Quick-Start or Archive before March 1:</h4>
            <ul className="space-y-4">
              {purchasePerks.map((perk, index) => (
                <li key={index} className="flex items-start gap-4 text-gray-300 text-lg">
                  <Check className="w-6 h-6 text-teal-500 flex-shrink-0 mt-0.5" />
                  <span>{perk}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Closing statement */}
          <p className="scroll-reveal opacity-0 translate-y-2.5 transition-all duration-800 text-lg md:text-xl text-gray-300 text-center leading-relaxed max-w-[700px] mx-auto mb-6">
            This isn't about discounts. It's about being part of building something that actually works.
          </p>
          
          <p className="scroll-reveal opacity-0 translate-y-2.5 transition-all duration-800 text-white text-lg font-semibold text-center mb-10">
            Prices stay the same. Perks end February 28.
          </p>
          
          <div className="text-center">
            <PrimaryCTA text="Take the Assessment - Start Free 7-Day Course" dataTestId="button-beta-cta" />
          </div>
        </div>
      </section>
      
      {/* SECTION 6: FINAL CTA */}
      <section 
        id="final-cta"
        className="bg-black py-16 md:py-20 px-5 text-center"
      >
        <h2 
          className="text-3xl md:text-[42px] font-bold text-white mb-8"
          data-testid="text-final-headline"
        >
          STOP RUNNING THE PATTERN
        </h2>
        
        <div className="text-lg md:text-xl text-gray-300 leading-relaxed mb-10">
          <p>Take the 2-minute assessment.</p>
          <p>Get your 7-day protocol.</p>
          <p>Start breaking the cycle today.</p>
        </div>
        
        <PrimaryCTA className="text-xl px-12 py-5 shadow-[0_0_30px_rgba(20,184,166,0.4)] hover:shadow-[0_0_40px_rgba(20,184,166,0.5),0_6px_50px_rgba(236,72,153,0.2)] hover:scale-[1.02]" dataTestId="button-final-cta" />
        
        <p className="text-gray-500 text-sm mt-4">
          Free • Private • No Email Required • Instant Results
        </p>
      </section>
      
      {/* SECTION 7: MINIMAL FOOTER */}
      <footer className="bg-black border-t border-[#1a1a1a] py-16 px-5 text-center">
        {/* Brand Lockup */}
        <div className="mb-8">
          <h3 className="font-['Bebas_Neue',Oswald,sans-serif] text-2xl font-bold tracking-wide text-white">
            THE ARCHIVIST METHOD™
          </h3>
          <p className="text-gray-500 text-sm uppercase tracking-wider mt-2">
            PATTERN ARCHAEOLOGY, <span className="text-pink-500">NOT</span> THERAPY
          </p>
        </div>
        
        {/* Links */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-3 md:gap-5 mb-8">
          <Link href="/#method" className="text-gray-500 text-sm hover:text-teal-500 transition-colors">
            Method
          </Link>
          <Link href="/contact" className="text-gray-500 text-sm hover:text-teal-500 transition-colors">
            Contact
          </Link>
          <Link href="/portal/login" className="text-gray-500 text-sm hover:text-teal-500 transition-colors">
            Portal Login
          </Link>
          <Link href="/terms" className="text-gray-500 text-sm hover:text-teal-500 transition-colors">
            Terms
          </Link>
          <Link href="/privacy" className="text-gray-500 text-sm hover:text-teal-500 transition-colors">
            Privacy
          </Link>
        </div>
        
        {/* Copyright */}
        <p className="text-gray-600 text-sm">
          © 2026 The Archivist Method
        </p>
      </footer>
      
      {/* CSS Animations */}
      <style>{`
        @keyframes archival-reveal {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes fade-in-delay {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-archival-reveal {
          animation: archival-reveal 1.2s cubic-bezier(0.77, 0, 0.175, 1) 0.3s forwards;
          transform: translateY(100%);
          opacity: 0;
        }
        
        .animate-fade-in-delay {
          animation: fade-in-delay 0.8s ease-out 1.0s forwards;
        }
        
        .scroll-reveal.visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        
        /* Mobile - simpler, more reliable animation */
        @media (max-width: 768px) {
          @keyframes mobile-fade-in {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          
          .animate-archival-reveal {
            animation: mobile-fade-in 0.8s ease-out 0.3s forwards;
            transform: none;
          }
          
          .animate-fade-in-delay {
            animation: mobile-fade-in 0.8s ease-out 0.6s forwards;
          }
          
          .scroll-reveal {
            transition-delay: 0s !important;
          }
        }
        
        @media (prefers-reduced-motion: reduce) {
          .animate-archival-reveal,
          .animate-fade-in-delay {
            animation: none;
            transform: none;
            opacity: 1;
          }
          
          .scroll-reveal {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}
