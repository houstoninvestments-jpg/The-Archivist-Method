import { Link } from "wouter";
import { Check, Zap, Heart, MessageCircle, RefreshCw, ArrowRight, ArrowUp } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import heroBackground from "@assets/archivist-hero-background.png";
import ParticleField from "@/components/ParticleField";

// Hero headline component - matching older version with two lines
function HeroHeadline() {
  return (
    <h1
      className="hero-title-premium mb-8 text-center"
      data-testid="text-brand-title"
    >
      <span className="block">THE ARCHIVIST</span>
      <span className="block">METHOD™</span>
    </h1>
  );
}

// Geometric accent elements
function GeometricAccents() {
  return (
    <div className="geometric-accents">
      {/* Top-left accent */}
      <div className="geo-shape geo-tl">
        <div className="geo-line geo-line-h" />
        <div className="geo-line geo-line-v" />
        <div className="geo-corner" />
      </div>
      
      {/* Bottom-right accent */}
      <div className="geo-shape geo-br">
        <div className="geo-line geo-line-h" />
        <div className="geo-line geo-line-v" />
        <div className="geo-corner" />
      </div>
      
      {/* Center grid marker */}
      <div className="geo-center">
        <div className="geo-circle" />
        <div className="geo-crosshair-h" />
        <div className="geo-crosshair-v" />
      </div>
    </div>
  );
}

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
    description: "Take the 2-minute assessment. Get your pattern analysis and the specific survival code running your life."
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

// Comparison table data - Pain-point focused
const comparisonRows = [
  { therapy: "Processes trauma", archivist: "Interrupts patterns trauma created" },
  { therapy: "Takes years", archivist: "7-90 days to see results" },
  { therapy: "Talk about childhood", archivist: "Find Original Room, then interrupt" },
  { therapy: "Insight-focused", archivist: "Behavior-focused" },
  { therapy: "$200/session ongoing", archivist: "$47-$197 one-time" },
  { therapy: "You understand why you do it", archivist: "You stop doing it", highlight: true },
  { therapy: "Explores the pattern", archivist: "Interrupts the pattern", highlight: true },
  { therapy: "Validates your feelings", archivist: "Maps your body signature", highlight: true },
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
  const comparisonRef = useScrollReveal();
  const founderRef = useScrollReveal();
  const finalCtaRef = useScrollReveal();
  
  return (
    <div className="min-h-screen bg-black text-white font-['Inter',sans-serif]">
      {/* Floating Particles - All Pages */}
      <ParticleField />
      
      {/* SECTION 1: HERO - Premium Design */}
      <section 
        id="hero"
        className="hero-premium flex items-center justify-center"
        style={{
          backgroundImage: `url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0.6)] to-[rgba(0,0,0,0.8)] z-[4]" />
        
        {/* Geometric accents */}
        <GeometricAccents />
        
        <div className="hero-content-premium text-center relative z-10">
          {/* Main headline */}
          <HeroHeadline />
          
          {/* Tagline */}
          <p 
            className="hero-tagline-premium mb-10"
            data-testid="text-brand-tagline"
          >
            Pattern Archaeology, Not Therapy
          </p>
          
          {/* Problem/Agitate/Solution Copy */}
          <div className="max-w-[700px] mx-auto mb-10">
            {/* Problem - you recognize it */}
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
              You watch yourself do it. You know it's happening.
            </p>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-4">
              You do it anyway.
            </p>
            
            {/* Agitate - the pattern list (PINK) */}
            <p className="hero-pink-accent my-4" data-testid="text-pattern-list">
              Disappear. Apologize. Test. Sabotage. Repeat.
            </p>
            
            {/* Solution - the promise */}
            <p className="hero-solution-line mt-4" data-testid="text-solution">
              Interrupt the code in 7-90 days.
            </p>
          </div>
          
          {/* CTA */}
          <PrimaryCTA 
            text="Discover Your Pattern →" 
            dataTestId="button-hero-cta" 
            className="px-10 py-4 text-lg"
          />
          
          {/* Trust Indicators */}
          <p className="mt-6 text-sm text-gray-500" data-testid="text-trust-indicators">
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
            className="scroll-reveal glitch-header text-4xl md:text-5xl font-black text-white text-center mb-6"
            data-text="THE 7 DESTRUCTIVE PATTERNS"
            data-testid="text-patterns-headline"
          >
            THE 7 DESTRUCTIVE PATTERNS
          </h2>
          <p className="scroll-reveal text-lg md:text-xl text-gray-400 text-center mb-16">
            One (or more) of these is running your life:
          </p>
          
          {/* Pattern Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {patterns.map((pattern, index) => (
              <div 
                key={pattern.number}
                className={`scroll-reveal stagger-${index + 1} bg-[#1a1a1a] border border-[#333333] p-8 rounded-lg transition-all duration-300 hover:-translate-y-2 hover:border-teal-500 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4),0_0_30px_rgba(20,184,166,0.15)]`}
                data-testid={`card-pattern-${pattern.number}`}
              >
                <div className="mb-3">
                  <span className="text-pink-500 text-3xl font-black">{pattern.number}.</span>
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
            className="scroll-reveal glitch-header text-3xl md:text-[42px] font-black text-white mb-10 leading-snug"
            data-text="THESE AREN'T PERSONALITY TRAITS. THEY'RE SURVIVAL CODE."
            data-testid="text-origin-headline"
          >
            THESE AREN'T PERSONALITY TRAITS. THEY'RE <span className="text-pink-500">SURVIVAL CODE</span>.
          </h2>
          
          <div className="space-y-6">
            <p className="scroll-reveal stagger-1 text-lg text-gray-300 leading-relaxed">
              Your childhood. Before you had language for what was happening. Before you understood why closeness felt dangerous or why success triggered panic.
            </p>
            
            <p className="scroll-reveal stagger-2 text-lg text-gray-300 leading-relaxed">
              You weren't broken then. <span className="text-teal-500 font-semibold">You were adapting.</span>
            </p>
            
            <p className="scroll-reveal stagger-3 text-lg text-gray-300 leading-relaxed">
              Your nervous system learned what kept you safe:
            </p>
            
            <div className="scroll-reveal stagger-4 text-xl text-teal-500 leading-loose pl-5 my-8 border-l-2 border-teal-500/30">
              <p>Disappear before they leave you.</p>
              <p>Apologize before they get angry.</p>
              <p>Test them before you trust them.</p>
              <p>Destroy it before it destroys you.</p>
            </div>
            
            <p className="scroll-reveal stagger-5 text-lg text-gray-300 leading-relaxed">
              Twenty years later, those patterns are still running.
            </p>
            
            <p className="scroll-reveal stagger-6 text-lg text-gray-300 leading-relaxed">
              Right now, your patterns run in a <span className="text-teal-500 font-semibold">3-7 second window</span>:
            </p>
            
            {/* Pattern Window - Visual Timeline */}
            <div className="scroll-reveal stagger-7 my-12 p-6 md:p-8 bg-[rgba(20,184,166,0.05)] border-2 border-teal-500/20 rounded-xl">
              {/* Timeline */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-2">
                {/* Trigger */}
                <div className="flex-1 text-center">
                  <Zap className="w-8 h-8 mx-auto mb-2 text-teal-500" />
                  <div className="text-teal-500 text-sm font-bold tracking-wider mb-1">TRIGGER</div>
                  <div className="text-gray-500 text-xs">External event</div>
                </div>
                
                {/* Arrow */}
                <ArrowRight className="w-6 h-6 text-teal-500 md:rotate-0 rotate-90 flex-shrink-0" />
                
                {/* Body Signature - HIGHLIGHTED */}
                <div className="flex-1 text-center relative bg-pink-500/10 border-2 border-pink-500 rounded-lg p-4">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-pink-500 text-white text-[11px] font-bold px-3 py-1 rounded whitespace-nowrap">
                    3-7 SECOND WINDOW
                  </div>
                  <Heart className="w-8 h-8 mx-auto mb-2 text-pink-500" />
                  <div className="text-pink-500 text-sm font-bold tracking-wider mb-1">BODY SIGNATURE</div>
                  <div className="text-gray-500 text-xs">Physical response</div>
                </div>
                
                {/* Arrow */}
                <ArrowRight className="w-6 h-6 text-teal-500 md:rotate-0 rotate-90 flex-shrink-0" />
                
                {/* Thought */}
                <div className="flex-1 text-center">
                  <MessageCircle className="w-8 h-8 mx-auto mb-2 text-teal-500" />
                  <div className="text-teal-500 text-sm font-bold tracking-wider mb-1">THOUGHT</div>
                  <div className="text-gray-500 text-xs">Justification</div>
                </div>
                
                {/* Arrow */}
                <ArrowRight className="w-6 h-6 text-teal-500 md:rotate-0 rotate-90 flex-shrink-0" />
                
                {/* Behavior */}
                <div className="flex-1 text-center">
                  <RefreshCw className="w-8 h-8 mx-auto mb-2 text-teal-500" />
                  <div className="text-teal-500 text-sm font-bold tracking-wider mb-1">PATTERN EXECUTES</div>
                  <div className="text-gray-500 text-xs">Automatic behavior</div>
                </div>
              </div>
              
              {/* Interrupt Indicator */}
              <div className="text-center mt-6 text-pink-500 font-bold">
                <ArrowUp className="w-6 h-6 mx-auto" />
                <div className="text-sm tracking-wider">INTERRUPT HERE</div>
              </div>
            </div>
            
            <p className="scroll-reveal text-lg text-gray-300 leading-relaxed">
              You don't catch the pattern until after it's already executed.
            </p>
            
            <p className="scroll-reveal text-lg text-gray-300 leading-relaxed">
              <span className="text-teal-500 font-semibold">Pattern archaeology</span> teaches you to recognize the pattern BEFORE it runs. In that 3-7 second window. In that recognition, you create a gap. In that gap, you can interrupt the code.
            </p>
          </div>
          
          <div className="scroll-reveal mt-12 text-center">
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
            className="scroll-reveal glitch-header text-3xl md:text-[42px] font-black text-white text-center mb-16"
            data-text="HOW PATTERN INTERRUPTION WORKS"
            data-testid="text-method-headline"
          >
            HOW PATTERN <span className="text-pink-500">INTERRUPTION</span> WORKS
          </h2>
          
          {/* Steps */}
          <div className="space-y-12 mb-12">
            {steps.map((step, index) => (
              <div 
                key={step.number}
                className={`scroll-reveal stagger-${index + 1} flex flex-col md:flex-row gap-4 md:gap-8 items-start`}
                data-testid={`step-${step.number}`}
              >
                <div className="step-number-circle flex-shrink-0 w-[70px] h-[70px] md:w-[80px] md:h-[80px] rounded-full border-[3px] border-teal-500 flex items-center justify-center text-3xl md:text-4xl font-black text-teal-500">
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
          <p className="scroll-reveal text-lg md:text-xl text-gray-300 text-center leading-relaxed mb-10">
            The 7-day protocol gives you proof of concept. One successful interrupt = the method works for you. Then decide.
          </p>
          
          <div className="scroll-reveal text-center">
            <PrimaryCTA text="Start Your Free Protocol" dataTestId="button-method-cta" />
          </div>
        </div>
      </section>
      
      {/* SECTION 5: COMPARISON TABLE */}
      <section 
        id="comparison"
        ref={comparisonRef}
        className="bg-[#0d0d0d] py-20 md:py-24 px-5"
      >
        <div className="max-w-[900px] mx-auto">
          <h2 
            className="scroll-reveal text-3xl md:text-[42px] font-black text-center mb-4"
            data-testid="text-comparison-headline"
          >
            <span className="text-teal-500">Pattern Archaeology,</span> <span className="text-white">Not Therapy</span>
          </h2>
          <p className="scroll-reveal text-lg text-gray-400 text-center mb-12">
            What makes The Archivist Method™ different
          </p>
          
          {/* Comparison Table */}
          <div className="scroll-reveal">
            <table className="w-full border-collapse table-fixed">
              <thead>
                <tr>
                  <th className="text-left p-3 md:p-4 text-gray-500 font-bold text-sm md:text-lg border-b border-[#333] w-1/2">
                    THERAPY
                  </th>
                  <th className="text-left p-3 md:p-4 text-teal-500 font-bold text-sm md:text-lg border-b border-[#333] w-1/2">
                    THE ARCHIVIST METHOD™
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, index) => (
                  <tr 
                    key={index}
                    className={`border-b border-[#222] ${row.highlight ? 'bg-[#1a1a1a]' : ''}`}
                    data-testid={`comparison-row-${index + 1}`}
                  >
                    <td className="p-3 md:p-4 text-gray-400 text-sm md:text-base align-top">
                      {row.therapy}
                    </td>
                    <td className={`p-3 md:p-4 text-sm md:text-base align-top ${row.highlight ? 'text-pink-500 font-bold' : 'text-white'}`}>
                      {row.archivist}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* CTA after comparison */}
          <div className="scroll-reveal text-center mt-12">
            <PrimaryCTA text="Take the Assessment - Start Free 7-Day Course" dataTestId="button-comparison-cta" />
          </div>
        </div>
      </section>
      
      {/* SECTION 6: FINAL CTA */}
      <section 
        id="final-cta"
        ref={finalCtaRef}
        className="bg-black py-16 md:py-20 px-5 text-center"
      >
        <h2 
          className="scroll-reveal glitch-header text-3xl md:text-[42px] font-black text-white mb-8"
          data-text="STOP RUNNING THE PATTERN"
          data-testid="text-final-headline"
        >
          STOP RUNNING THE PATTERN
        </h2>
        
        <div className="scroll-reveal text-lg md:text-xl text-gray-300 leading-relaxed mb-10">
          <p>Take the 2-minute assessment.</p>
          <p>Get your 7-day protocol.</p>
          <p>Start breaking the cycle today.</p>
        </div>
        
        <div className="scroll-reveal">
          <Link
            href="/quiz"
            className="cta-shimmer inline-block bg-gradient-to-r from-teal-500 to-teal-600 text-white text-xl font-bold px-12 py-5 rounded-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_60px_rgba(20,184,166,0.5),0_6px_50px_rgba(236,72,153,0.2)]"
            data-testid="button-final-cta"
          >
            Take the Free Assessment
          </Link>
        </div>
        
        <p className="scroll-reveal text-gray-500 text-sm mt-4">
          Free • Private • No Email Required • Instant Results
        </p>
      </section>
      
      {/* SECTION 7: FOUNDER TEASER - "Built in Survival Mode" */}
      <section 
        id="founder"
        ref={founderRef}
        className="bg-[#0a0a0a] border-t border-teal-500/10 border-b border-teal-500/10 py-20 md:py-24 px-5"
      >
        <div className="max-w-[700px] mx-auto text-center">
          <h2 
            className="scroll-reveal text-[22px] md:text-[28px] font-bold tracking-[2px] text-teal-500 mb-8"
            data-testid="text-founder-headline"
          >
            BUILT IN SURVIVAL MODE
          </h2>
          
          <p className="scroll-reveal text-base md:text-[17px] text-gray-400 leading-[1.7] mb-5">
            The Archivist Method was built in December 2025.
          </p>
          
          <p className="scroll-reveal text-base md:text-[17px] text-gray-400 leading-[1.7] mb-5">
            Not in a lab. Not with funding. Not from stability.
          </p>
          
          <p className="scroll-reveal text-base md:text-[17px] text-gray-400 leading-[1.7] mb-5">
            Homeless. Failing equipment. No resources. Life actively collapsing.
          </p>
          
          <p className="scroll-reveal text-base md:text-[17px] text-gray-400 leading-[1.7] mb-5">
            Built while running every pattern it interrupts.
          </p>
          
          <p className="scroll-reveal text-base md:text-[17px] text-gray-400 leading-[1.7] mb-8">
            Because survival mode is when you see the code clearest.
          </p>
          
          <p className="scroll-reveal text-lg md:text-[19px] font-semibold text-white mb-6">
            If it works here, it works anywhere.
          </p>
          
          <p className="scroll-reveal text-[15px] italic text-gray-500">
            — The Archivist
          </p>
        </div>
      </section>
      
      {/* SECTION 8: MINIMAL FOOTER */}
      <footer className="bg-black border-t border-[#1a1a1a] py-16 px-5 text-center">
        {/* Brand Lockup - Matches Hero Styling */}
        <div className="mb-8">
          <h3 className="font-['Inter',sans-serif] text-xl font-bold tracking-[0.5px] text-white uppercase">
            THE ARCHIVIST METHOD™
          </h3>
          <p className="font-['Inter',sans-serif] text-sm font-semibold uppercase tracking-wider mt-2 text-teal-500">
            PATTERN ARCHAEOLOGY, NOT THERAPY
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
      
      {/* CSS Animations - Complete System */}
      <style>{`
        /* ===== BASE KEYFRAMES ===== */
        @keyframes archival-reveal {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes fade-in-delay {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        /* ===== GLITCH EFFECT ===== */
        @keyframes glitch-in {
          0% { opacity: 0; transform: translateX(-20px); filter: blur(4px); }
          20% { opacity: 1; transform: translateX(5px) skew(-2deg); }
          40% { transform: translateX(-3px) skew(1deg); }
          60% { transform: translateX(2px); }
          100% { opacity: 1; transform: translateX(0) skew(0deg); filter: blur(0); }
        }
        
        .glitch-header {
          animation: glitch-in 0.8s ease-out forwards;
          position: relative;
        }
        
        .glitch-header::before,
        .glitch-header::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          opacity: 0;
          pointer-events: none;
        }
        
        .glitch-header::before {
          animation: rgb-split-pink 0.3s ease-in-out 3;
          color: #EC4899;
          z-index: -1;
        }
        
        .glitch-header::after {
          animation: rgb-split-teal 0.3s ease-in-out 3;
          color: #14B8A6;
          z-index: -1;
        }
        
        @keyframes rgb-split-pink {
          0%, 100% { opacity: 0; transform: translateX(0); }
          50% { opacity: 0.4; transform: translateX(-3px); }
        }
        
        @keyframes rgb-split-teal {
          0%, 100% { opacity: 0; transform: translateX(0); }
          50% { opacity: 0.4; transform: translateX(3px); }
        }
        
        /* ===== PULSE GLOW ===== */
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(20, 184, 166, 0.4); }
          50% { box-shadow: 0 0 0 15px rgba(20, 184, 166, 0); }
        }
        
        @keyframes featured-pulse {
          0%, 100% { box-shadow: 0 0 30px rgba(20, 184, 166, 0.2); }
          50% { box-shadow: 0 0 50px rgba(20, 184, 166, 0.4); }
        }
        
        /* ===== CTA SHIMMER ===== */
        @keyframes cta-pulse {
          0%, 100% { box-shadow: 0 0 30px rgba(20, 184, 166, 0.3); }
          50% { box-shadow: 0 0 50px rgba(20, 184, 166, 0.5); }
        }
        
        @keyframes shimmer {
          from { left: -100%; }
          to { left: 100%; }
        }
        
        .cta-shimmer {
          position: relative;
          overflow: hidden;
          animation: cta-pulse 3s ease-in-out infinite;
        }
        
        .cta-shimmer::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          animation: shimmer 3s infinite;
        }
        
        /* ===== CHECKBOX TICK ===== */
        @keyframes check-pop {
          from { transform: translate(-50%, -50%) scale(0); }
          to { transform: translate(-50%, -50%) scale(1); }
        }
        
        @keyframes slide-in-check {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        /* ===== SCRAMBLE STYLES ===== */
        .scramble-text {
          font-family: 'Inter', sans-serif;
          letter-spacing: 0.5px;
        }
        
        .scramble-dud {
          color: #14B8A6;
          opacity: 0.8;
        }
        
        /* ===== SCROLL REVEAL SYSTEM ===== */
        .scroll-reveal {
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .scroll-reveal.visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        
        /* Stagger delays for cards */
        .scroll-reveal.stagger-1 { transition-delay: 0s; }
        .scroll-reveal.stagger-2 { transition-delay: 0.1s; }
        .scroll-reveal.stagger-3 { transition-delay: 0.2s; }
        .scroll-reveal.stagger-4 { transition-delay: 0.3s; }
        .scroll-reveal.stagger-5 { transition-delay: 0.4s; }
        .scroll-reveal.stagger-6 { transition-delay: 0.5s; }
        .scroll-reveal.stagger-7 { transition-delay: 0.6s; }
        
        /* ===== STEP NUMBER PULSE ===== */
        .step-number-circle {
          position: relative;
        }
        
        .step-number-circle.visible {
          animation: pulse-glow 2s ease-out;
        }
        
        /* ===== PERK CHECKBOX ===== */
        .perk-checkbox {
          position: relative;
        }
        
        .perk-checkbox::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0);
          width: 12px;
          height: 12px;
          background: #14B8A6;
          border-radius: 2px;
        }
        
        .perk-item.visible .perk-checkbox::after {
          animation: check-pop 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.3s forwards;
        }
        
        .perk-item {
          opacity: 0;
          transform: translateX(-20px);
        }
        
        .perk-item.visible {
          animation: slide-in-check 0.5s ease-out forwards;
        }
        
        .perk-item:nth-child(1).visible { animation-delay: 0s; }
        .perk-item:nth-child(2).visible { animation-delay: 0.1s; }
        .perk-item:nth-child(3).visible { animation-delay: 0.2s; }
        .perk-item:nth-child(4).visible { animation-delay: 0.3s; }
        
        /* ===== ARCHIVAL REVEAL ===== */
        .animate-archival-reveal {
          animation: archival-reveal 1.2s cubic-bezier(0.77, 0, 0.175, 1) 0.3s forwards;
          transform: translateY(100%);
          opacity: 0;
        }
        
        .animate-fade-in-delay {
          animation: fade-in-delay 0.8s ease-out 1.0s forwards;
        }
        
        /* ===== MOBILE OPTIMIZATIONS ===== */
        @media (max-width: 768px) {
          @keyframes mobile-fade-in {
            from { opacity: 0; transform: scale(0.98); }
            to { opacity: 1; transform: scale(1); }
          }
          
          .animate-archival-reveal {
            animation: mobile-fade-in 0.6s ease-out 0.3s forwards;
            transform: none;
          }
          
          .animate-fade-in-delay {
            animation: mobile-fade-in 0.6s ease-out 0.5s forwards;
          }
          
          .scroll-reveal {
            transition-duration: 0.4s;
            transition-delay: 0s !important;
          }
          
          .glitch-header::before,
          .glitch-header::after {
            display: none;
          }
          
          .perk-item.visible {
            animation-delay: 0s !important;
          }
        }
        
        /* ===== REDUCED MOTION ===== */
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
          
          .animate-archival-reveal,
          .animate-fade-in-delay,
          .scroll-reveal,
          .glitch-header,
          .perk-item {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          
          .cta-shimmer::before {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
