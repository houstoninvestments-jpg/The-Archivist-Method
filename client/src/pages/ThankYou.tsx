import { useEffect, useState } from "react";
import { Link, useSearch } from "wouter";
import { motion } from "framer-motion";
import { Loader2, Download, ArrowRight } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";

type PatternType = 
  | "disappearing"
  | "apology-loop"
  | "testing"
  | "attraction-to-harm"
  | "compliment-deflection"
  | "draining-bond"
  | "success-sabotage";

interface PatternInfo {
  name: string;
  description: string;
  nextStep: string;
}

const PATTERNS: Record<PatternType, PatternInfo> = {
  "disappearing": {
    name: "The Disappearing Pattern",
    description: "You vanish when relationships get close. Your crash course includes specific circuit breaks for intimacy triggers.",
    nextStep: "Day 1 focuses on recognizing your body's flight response before you ghost."
  },
  "apology-loop": {
    name: "The Apology Loop",
    description: "You apologize for existing. Your crash course includes scripts for replacing 'sorry' with direct communication.",
    nextStep: "Day 1 maps every situation where you minimize yourself."
  },
  "testing": {
    name: "The Testing Pattern",
    description: "You create loyalty tests to see if people will stay. Your crash course includes alternatives to testing behavior.",
    nextStep: "Day 1 identifies your specific testing triggers."
  },
  "attraction-to-harm": {
    name: "Attraction to Harm",
    description: "Chaos feels like chemistry. Your crash course helps you recognize the difference between danger and attraction.",
    nextStep: "Day 1 maps the 'boring vs exciting' confusion."
  },
  "compliment-deflection": {
    name: "Compliment Deflection",
    description: "Visibility triggers panic. Your crash course includes scripts for accepting praise without minimizing.",
    nextStep: "Day 1 tracks every deflection and what it costs you."
  },
  "draining-bond": {
    name: "The Draining Bond",
    description: "Guilt keeps you stuck. Your crash course addresses the difference between loyalty and self-destruction.",
    nextStep: "Day 1 examines why leaving feels like betrayal."
  },
  "success-sabotage": {
    name: "Success Sabotage",
    description: "Success feels dangerous. Your crash course helps you build tolerance for sustained wins.",
    nextStep: "Day 1 identifies your sabotage triggers and timeline."
  }
};

export default function ThankYou() {
  const [timeLeft, setTimeLeft] = useState(600);
  const [isExpired, setIsExpired] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const patternParam = params.get("pattern") as PatternType | null;
  const patternInfo = patternParam && PATTERNS[patternParam] ? PATTERNS[patternParam] : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleUpsellClick = async () => {
    if (isLoading || isExpired) return;
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/portal/checkout/quick-start-upsell", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("No checkout URL returned");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setIsLoading(false);
    }
  };

  const benefits = [
    "Interrupt all 9 destructive patterns",
    "90-day circuit break protocol",
    "Unlimited Archivist AI chat",
    "Emergency interruption cards",
  ];

  const journeySteps = [
    { day: "Day 1", title: "Pattern recognition starts" },
    { day: "Day 3", title: "Find your Original Room" },
    { day: "Day 7", title: "First circuit break" },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="pt-28 pb-24">
        <div className="container mx-auto px-4 max-w-3xl">
          
          {/* Hero Section - Pattern Personalized or Default */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            {patternInfo ? (
              <>
                <p className="text-gray-500 text-sm uppercase tracking-wider mb-2">Your Primary Pattern</p>
                <h1 
                  className="text-3xl md:text-4xl font-bold mb-4 tracking-tight"
                  style={{
                    background: "linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                  data-testid="text-pattern-name"
                >
                  {patternInfo.name}
                </h1>
                <p className="text-lg text-gray-300 mb-4" data-testid="text-pattern-description">
                  {patternInfo.description}
                </p>
                <div 
                  className="inline-block rounded-xl px-6 py-3 mb-6"
                  style={{ background: 'rgba(20, 184, 166, 0.1)', border: '1px solid rgba(20, 184, 166, 0.3)' }}
                >
                  <p className="text-teal-400 text-sm">
                    {patternInfo.nextStep}
                  </p>
                </div>
                
                {/* Download CTA */}
                <div className="flex flex-col items-center gap-4">
                  <a 
                    href="/generated_pdfs/THE-ARCHIVIST-METHOD-7-DAY-CRASH-COURSE.pdf" 
                    download
                    className="inline-block"
                  >
                    <Button
                      className="px-8 py-4 text-base font-semibold"
                      style={{
                        background: "linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)",
                      }}
                      data-testid="button-download-crash-course"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Your Crash Course
                    </Button>
                  </a>
                  <p className="text-gray-500 text-sm">
                    Check your email for additional resources
                  </p>
                </div>
              </>
            ) : (
              <>
                <h1 
                  className="text-4xl md:text-5xl font-bold mb-4 tracking-tight"
                  data-testid="text-success-title"
                >
                  Your Crash Course is Coming
                </h1>
                <p 
                  className="text-xl text-gray-400"
                  data-testid="text-success-subtitle"
                >
                  Check your email in the next 60 seconds
                </p>
              </>
            )}
          </motion.div>

          {/* Upsell Section - Main Focus */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-20"
          >
            {/* Glassmorphism Card */}
            <div
              className="relative rounded-2xl p-8 md:p-12 overflow-hidden"
              style={{
                background: "rgba(3, 3, 3, 0.97)",
                backdropFilter: "blur(32px)",
                border: "1px solid rgba(20, 184, 166, 0.3)",
                boxShadow: "0 0 80px rgba(20, 184, 166, 0.08), 0 0 160px rgba(236, 72, 153, 0.04)",
              }}
            >
              {/* Subtle gradient overlay */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  background: "radial-gradient(ellipse at top, rgba(20, 184, 166, 0.12) 0%, transparent 60%)",
                }}
              />

              {/* Headline */}
              <div className="text-center mb-10 relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
                  Don't Stop Now
                </h2>
                <p className="text-lg text-gray-400">
                  You just got the appetizer. Here's the full method.
                </p>
              </div>

              {/* Pricing Block */}
              <div className="text-center mb-10 relative z-10">
                <div className="flex items-baseline justify-center gap-4 mb-2">
                  <span className="text-6xl md:text-7xl font-bold text-white">$37</span>
                  <span className="text-2xl text-gray-600 line-through">$47</span>
                </div>
                <span 
                  className="text-lg font-semibold"
                  style={{
                    background: "linear-gradient(135deg, #14B8A6 0%, #EC4899 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Save $10
                </span>
                
                {/* Countdown - Inline, Clean */}
                {!isExpired && (
                  <div className="mt-4">
                    <span className="text-red-500 font-medium" data-testid="text-countdown">
                      Expires in {formatTime(timeLeft)}
                    </span>
                  </div>
                )}
                {isExpired && (
                  <div className="mt-4">
                    <span className="text-gray-500 font-medium" data-testid="text-countdown">
                      Offer expired
                    </span>
                  </div>
                )}
              </div>

              {/* Benefits List */}
              <div className="space-y-4 mb-10 relative z-10">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.08 }}
                    className="flex items-center gap-4"
                  >
                    <div 
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{
                        background: "linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)",
                      }}
                    />
                    <span className="text-gray-200">{benefit}</span>
                  </motion.div>
                ))}
              </div>

              {/* CTA Button */}
              <div className="relative z-10">
                <motion.button
                  onClick={handleUpsellClick}
                  disabled={isExpired || isLoading}
                  whileHover={{ scale: (isExpired || isLoading) ? 1 : 1.02 }}
                  whileTap={{ scale: (isExpired || isLoading) ? 1 : 0.98 }}
                  className={`w-full py-4 px-8 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                    isExpired
                      ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                      : isLoading
                        ? "text-black/70 cursor-wait"
                        : "text-black hover:shadow-xl hover:shadow-teal-500/20"
                  }`}
                  style={
                    isExpired
                      ? {}
                      : {
                          background: "linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)",
                        }
                  }
                  data-testid="button-upsell-accept"
                >
                  {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                  {isExpired ? "Offer Has Expired" : isLoading ? "Redirecting..." : "Get Quick-Start — $37"}
                </motion.button>

                {/* Decline Link */}
                <div className="text-center mt-6">
                  <Link href="/">
                    <span
                      className="text-gray-600 hover:text-gray-500 text-sm cursor-pointer transition-colors"
                      data-testid="link-decline"
                    >
                      Skip this offer
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* What Happens Next - 3 Clean Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <h3 className="text-xl font-bold text-center mb-8 text-gray-300">
              What Happens Next
            </h3>

            <div className="grid md:grid-cols-3 gap-4">
              {journeySteps.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="p-5 rounded-xl border border-white/10 bg-white/[0.02]"
                >
                  <div 
                    className="text-sm font-semibold mb-1"
                    style={{
                      background: "linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {item.day}
                  </div>
                  <div className="text-white font-medium">
                    {item.title}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
