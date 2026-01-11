import { useState } from "react";
import Hero from "../components/Hero";
import DiagnosticSection from "../components/DiagnosticSection";
import PatternAccordion from "../components/PatternAccordion";
import MethodSection from "../components/MethodSection";
import ComparisonTable from "../components/ComparisonTable";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import ArchivistChatbot from "../components/ArchivistChatbot";

export default function Landing() {
  const [showChat, setShowChat] = useState(false);

  const handleOpenChat = () => {
    setShowChat(true);
  };

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
      <Hero onOpenChat={handleOpenChat} />
      <DiagnosticSection onOpenChat={handleOpenChat} />
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
              subtitle="The complete 90-day protocol"
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
      <ArchivistChatbot isOpen={showChat} onClose={() => setShowChat(false)} />
    </div>
  );
}
