import { useState } from "react";
import Hero from "../components/Hero";
import PatternQuiz from "../components/PatternQuiz";
import PatternAccordion from "../components/PatternAccordion";
import MethodSection from "../components/MethodSection";
import ComparisonTable from "../components/ComparisonTable";
import ProductCard from "../components/ProductCard";
import { ScrollReveal } from "../components/animations/ScrollReveal";
import ParticleField from "../components/ParticleField";

export default function Landing() {
  const [loadingProduct, setLoadingProduct] = useState<string | null>(null);

  const handleBuyFree = () => {
    window.location.href = "/free";
  };

  const handleBuyQuickStart = async () => {
    if (loadingProduct) return;
    setLoadingProduct("quick-start");
    
    try {
      const response = await fetch("/api/portal/checkout/quick-start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("No checkout URL returned");
        setLoadingProduct(null);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setLoadingProduct(null);
    }
  };

  const handleBuyComplete = async () => {
    if (loadingProduct) return;
    setLoadingProduct("complete-archive");
    
    try {
      const response = await fetch("/api/portal/checkout/complete-archive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("No checkout URL returned");
        setLoadingProduct(null);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setLoadingProduct(null);
    }
  };

  return (
    <div className="min-h-screen bg-archivist-dark text-white relative">
      <ParticleField />
      <Hero />
      
      {/* Pattern Identification Quiz */}
      <PatternQuiz />
      
      {/* Brief Intro Section */}
      <section className="py-20 px-4 bg-archivist-dark">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              What is <span className="text-teal-400">Pattern Archaeology</span>?
            </h2>
          </ScrollReveal>
          <ScrollReveal>
            <p className="text-lg text-gray-400 leading-relaxed mb-8">
              Pattern Archaeology is a systematic method for identifying and interrupting the unconscious behavioral loops that sabotage your relationships, career, and wellbeing. Unlike traditional therapy that asks "why," we focus on the "how" - mapping the exact sequence of triggers, reactions, and outcomes that keep you stuck in cycles you didn't choose.
            </p>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <ScrollReveal>
              <div className="p-6 rounded-xl bg-white/5 border border-white/10 h-full">
                <div className="text-teal-400 text-2xl font-bold mb-2">Identify</div>
                <p className="text-gray-400 text-sm">Recognize the 7 core patterns that drive 90% of self-sabotaging behavior</p>
              </div>
            </ScrollReveal>
            <ScrollReveal>
              <div className="p-6 rounded-xl bg-white/5 border border-white/10 h-full">
                <div className="text-teal-400 text-2xl font-bold mb-2">Interrupt</div>
                <p className="text-gray-400 text-sm">Learn circuit-breaking techniques that stop patterns mid-execution</p>
              </div>
            </ScrollReveal>
            <ScrollReveal>
              <div className="p-6 rounded-xl bg-white/5 border border-white/10 h-full">
                <div className="text-teal-400 text-2xl font-bold mb-2">Replace</div>
                <p className="text-gray-400 text-sm">Install new neural pathways through the FEIR framework</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <PatternAccordion />
      <MethodSection />
      <ComparisonTable />
      
      <section className="py-20 px-4 bg-archivist-dark" id="pricing">
        <div className="container mx-auto max-w-6xl">
          <ScrollReveal>
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
              Choose Your Path
            </h2>
            <p className="text-center text-muted-foreground mb-12">
              Start free or go deep with our complete systems
            </p>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-8">
            <ProductCard
              title="7-Day Crash Course"
              subtitle="Start recognizing your patterns"
              price="FREE"
              tier="free"
              ctaText="Get Free Access"
              features={[
                "Introduction to pattern recognition",
                "One core pattern deep-dive",
                "Daily email guidance",
                "Basic interruption techniques"
              ]}
              onBuyClick={handleBuyFree}
            />
            <ProductCard
              title="Quick-Start System"
              subtitle="Fast-track guide to identify your Original Room"
              price={47}
              tier="popular"
              badge="Most Popular"
              ctaText="Get Instant Access"
              features={[
                "All 7 destructive patterns",
                "90-day interruption protocol",
                "Circuit break library",
                "Daily tracker templates",
                "Emergency response cards"
              ]}
              onBuyClick={handleBuyQuickStart}
            />
            <ProductCard
              title="Complete Archive"
              subtitle="All 7 Core Patterns mapped in detail"
              price={197}
              tier="premium"
              badge="Best Value"
              ctaText="Unlock Everything"
              features={[
                "Everything in Quick-Start",
                "Advanced pattern combinations",
                "Relationship applications",
                "Lifetime updates",
                "Priority AI chat access"
              ]}
              onBuyClick={handleBuyComplete}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
