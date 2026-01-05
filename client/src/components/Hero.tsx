import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface HeroProps {
  onCTAClick?: () => void;
}

export default function Hero({ onCTAClick }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-archivist-dark">
      {/* Gothic Library Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/archivist-hero-background.png)" }}
      />

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Main Headline - FIXED */}
          <h1 className="font-archivist text-[clamp(2.5rem,10vw,6rem)] font-bold tracking-tight text-white leading-[1.1] drop-shadow-[0_0_30px_rgba(0,0,0,0.8)]">
            THE ARCHIVIST
            <br />
            METHOD™
          </h1>

          {/* Subheadline - FIXED */}
          <p className="text-[clamp(1.25rem,5vw,3rem)] font-bold text-archivist-teal drop-shadow-[0_0_20px_rgba(0,0,0,0.8)] leading-tight">
            Pattern Archaeology, Not Therapy
          </p>

          {/* Hook Text - FIXED */}
          <p className="text-[clamp(1rem,3vw,1.5rem)] text-gray-300 max-w-3xl mx-auto leading-relaxed drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]">
            Stop running the same destructive patterns.
            <br />
            Learn the proven method to interrupt trauma patterns in 7-90 days.
          </p>

          {/* CTA Button */}
          <div className="pt-8">
            <Button
              onClick={onCTAClick}
              size="lg"
              data-testid="button-hero-cta"
              className="btn-gradient-teal-pink text-lg md:text-xl px-12 py-8 font-bold hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(0,217,192,0.5)] hover:shadow-[0_0_60px_rgba(0,217,192,0.7)]"
            >
              Start Free 7-Day Crash Course
              <ChevronDown className="ml-3 h-6 w-6 animate-bounce" />
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-archivist-dark to-transparent pointer-events-none" />
    </section>
  );
}
