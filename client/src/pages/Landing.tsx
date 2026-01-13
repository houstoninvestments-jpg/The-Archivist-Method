import { useState } from "react";
import Hero from "../components/Hero";
import PatternAccordion from "../components/PatternAccordion";
import MethodSection from "../components/MethodSection";
import ComparisonTable from "../components/ComparisonTable";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import ArchivistChatbot from "../components/ArchivistChatbot";
import { MessageCircle } from "lucide-react";

export default function Landing() {
  const [showChat, setShowChat] = useState(false);

  const handleBuyFree = () => {
    window.location.href = "/free-download";
  };

  const handleBuyQuickStart = () => {
    window.location.href = "https://buy.stripe.com/dR629j5dI1NS1aq3cd";
  };

  const handleBuyComplete = () => {
    window.location.href = "https://buy.stripe.com/8x214f7hQdwv2augKm6c002";
  };

  return (
    <div className="min-h-screen bg-archivist-dark text-white">
      <Hero />
      
      {/* Brief Intro Section */}
      <section className="py-20 px-4 bg-archivist-dark">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            What is <span className="text-teal-400">Pattern Archaeology</span>?
          </h2>
          <p className="text-lg text-gray-400 leading-relaxed mb-8">
            Pattern Archaeology is a systematic method for identifying and interrupting the unconscious behavioral loops that sabotage your relationships, career, and wellbeing. Unlike traditional therapy that asks "why," we focus on the "how" - mapping the exact sequence of triggers, reactions, and outcomes that keep you stuck in cycles you didn't choose.
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <div className="text-teal-400 text-2xl font-bold mb-2">Identify</div>
              <p className="text-gray-400 text-sm">Recognize the 7 core patterns that drive 90% of self-sabotaging behavior</p>
            </div>
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <div className="text-teal-400 text-2xl font-bold mb-2">Interrupt</div>
              <p className="text-gray-400 text-sm">Learn circuit-breaking techniques that stop patterns mid-execution</p>
            </div>
            <div className="p-6 rounded-xl bg-white/5 border border-white/10">
              <div className="text-teal-400 text-2xl font-bold mb-2">Replace</div>
              <p className="text-gray-400 text-sm">Install new neural pathways through the FEIR framework</p>
            </div>
          </div>
        </div>
      </section>

      <PatternAccordion />
      <MethodSection />
      <ComparisonTable />
      
      <section className="py-20 px-4 bg-archivist-dark" id="pricing">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Choose Your Path
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            Start free or go deep with our complete systems
          </p>
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

      <Footer />
      
      {/* Floating Chat Button */}
      <button
        onClick={() => setShowChat(true)}
        data-testid="button-chat-floating"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-teal-500/30 transition-all hover:scale-110"
        style={{
          background: 'linear-gradient(135deg, #14B8A6 0%, #EC4899 100%)',
        }}
        aria-label="Open chat support"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </button>
      
      <ArchivistChatbot isOpen={showChat} onClose={() => setShowChat(false)} />
    </div>
  );
}
