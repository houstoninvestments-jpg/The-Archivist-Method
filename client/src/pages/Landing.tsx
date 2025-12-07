import { useRef } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import HowItWorks from "@/components/HowItWorks";
import MethodSection from "@/components/MethodSection";
import PatternAccordion from "@/components/PatternAccordion";
import Guarantee from "@/components/Guarantee";
import Footer from "@/components/Footer";

export default function Landing() {
  const [, setLocation] = useLocation();
  const productsRef = useRef<HTMLDivElement>(null);

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLogin = () => {
    setLocation("/portal");
  };

  const handleBuy = (product: string) => {
    console.log(`Buying ${product}`);
    setLocation("/thank-you");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onLoginClick={handleLogin} />
      
      <Hero onCTAClick={scrollToProducts} />
      
      <section ref={productsRef} className="py-20 px-4" id="products">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-4" data-testid="text-products-title">
            Choose Your Path
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Start your pattern excavation journey today
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            <ProductCard
              title="7-Day Crash Course"
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
              subtitle="Master all patterns. Every context. Forever."
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

      <div className="gradient-divider max-w-4xl mx-auto" />
      
      <HowItWorks />
      <MethodSection />
      <PatternAccordion />
      <Guarantee />
      <Footer />
    </div>
  );
}
