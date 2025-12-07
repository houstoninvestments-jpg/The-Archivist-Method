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
import Divider from "@/components/Divider";

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
    // todo: remove mock functionality - redirect to Stripe checkout
    console.log(`Buying ${product}`);
    setLocation("/thank-you");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onLoginClick={handleLogin} />
      
      <Hero onCTAClick={scrollToProducts} />
      
      <section ref={productsRef} className="py-20 px-4" id="products">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-4" data-testid="text-products-title">
            Choose Your Path
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Start your pattern excavation journey today
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            <ProductCard
              title="Pattern Recognition Session"
              price={47}
              features={[
                "90-minute Pattern Recognition video",
                "Pattern Recognition Workbook (PDF)",
                "30 days AI chatbot access",
                "Identify 2-3 dominant patterns",
                "Learn 4-step excavation method",
              ]}
              onBuyClick={() => handleBuy("pattern_session")}
            />
            <ProductCard
              title="The Complete Pattern Archive"
              price={97}
              features={[
                "Everything from $47 product",
                "250+ page pattern manual",
                "All 7 core patterns deep dive",
                "90-day week-by-week protocol",
                "Pattern combination strategies",
                "Lifetime AI chatbot access",
              ]}
              isPremium
              badge="COMPLETE SYSTEM"
              onBuyClick={() => handleBuy("complete_archive")}
            />
          </div>
        </div>
      </section>
      
      <Divider />
      <HowItWorks />
      <Divider />
      <MethodSection />
      <Divider />
      <PatternAccordion />
      <Divider />
      <Guarantee />
      <Divider />
      <Footer />
    </div>
  );
}
