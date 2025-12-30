import { useRef } from "react";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import HowItWorks from "@/components/HowItWorks";
import MethodSection from "@/components/MethodSection";
import ComparisonTable from "@/components/ComparisonTable";
import PatternAccordion from "@/components/PatternAccordion";
import FAQ from "@/components/FAQ";
import Guarantee from "@/components/Guarantee";
import Footer from "@/components/Footer";

export default function Landing() {
  const pricingRef = useRef<HTMLDivElement>(null);

  const scrollToPricing = () => {
    pricingRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleBuy = (tier: string) => {
    const urls: Record<string, string> = {
      crash_course: "/free-download",
      quick_start: "https://buy.stripe.com/cNidR1eKi8cb16qalY6c001",
      complete_archive: "https://buy.stripe.com/8x214f7hQdwv2augKm6c002",
    };

    window.location.href = urls[tier] || "/";
  };

  return (
    <div className="min-h-screen bg-archivist-dark text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-archivist-dark/95 backdrop-blur-sm border-b border-archivist-teal/20">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src="/archivist-icon.png"
              alt="The Archivist"
              className="w-10 h-10 rounded-full"
            />
            <span className="text-white font-bold text-lg md:text-xl">
              The Archivist Method™
            </span>
          </div>

          {/* Menu */}
          <div className="flex items-center gap-8">
            <button
              onClick={scrollToPricing}
              className="text-gray-300 hover:text-archivist-teal transition-colors"
            >
              Pricing
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("method")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="text-gray-300 hover:text-archivist-teal transition-colors"
            >
              Method
            </button>
          </div>
        </div>
      </nav>

      {/* Add padding top to account for fixed navbar */}
      <div className="pt-16">
        {/* Hero */}
        <Hero onCTAClick={scrollToPricing} />

        {/* How It Works */}
        <HowItWorks />

        {/* Pricing Section */}
        <section
          ref={pricingRef}
          id="pricing"
          className="py-20 px-4 bg-archivist-dark"
        >
          <div className="container mx-auto max-w-7xl">
            <h2 className="text-3xl font-bold text-center mb-4">
              Choose Your Excavation Level
            </h2>
            <p className="text-center text-muted-foreground mb-12">
              Start your pattern excavation journey today
            </p>

            <div className="grid gap-6 md:grid-cols-3 items-start">
              <ProductCard
                title="7-Day Crash"
                subtitle="Can't commit to 90 days? Start here."
                price="FREE"
                tier="free"
                badge="FREE"
                ctaText="Start Free"
                features={[
                  "Pattern identification basics",
                  "Body signature recognition",
                  "First interrupt attempt",
                  "Core concepts introduction",
                  "Self-assessment tools",
                ]}
                onBuyClick={() => handleBuy("crash_course")}
              />
              <ProductCard
                title="Quick-Start System"
                subtitle="Fix ONE pattern in 90 days"
                price={47}
                tier="popular"
                badge="MOST POPULAR"
                ctaText="Get Quick-Start - $47"
                features={[
                  "Complete 90-day protocol",
                  "Crisis protocols",
                  "Tracking templates",
                  "Relationship scripts",
                  "Pattern interrupt techniques",
                ]}
                onBuyClick={() => handleBuy("quick_start")}
              />
              <ProductCard
                title="Complete Archive"
                subtitle="Master all patterns. Every context."
                price={197}
                tier="premium"
                badge="LIFETIME ACCESS"
                ctaText="Get Full Archive - $197"
                features={[
                  "685 pages of content",
                  "All 23 sections covered",
                  "Advanced applications",
                  "Lifetime reference",
                  "All bonuses included",
                  "Daily tracker templates",
                ]}
                onBuyClick={() => handleBuy("complete_archive")}
              />
            </div>
          </div>
        </section>

        {/* Method Section */}
        <div id="method">
          <MethodSection />
        </div>

        {/* Comparison Table */}
        <ComparisonTable />

        {/* Pattern Accordion */}
        <PatternAccordion />

        {/* FAQ */}
        <FAQ />

        {/* Guarantee */}
        <Guarantee />

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
