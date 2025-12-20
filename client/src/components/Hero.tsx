import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface HeroProps {
  onCTAClick?: () => void;
}

export default function Hero({ onCTAClick }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gothic Library Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/archivist-hero-background.png)' }}
      />

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-8">

          {/* Avatar Icon */}
          <div className="flex justify-center mb-8">
            <img 
              src="/archivist-icon.png" 
              alt="The Archivist" 
              className="w-32 h-32 md:w-40 md:h-40 rounded-full shadow-[0_0_40px_rgba(0,217,192,0.6)]"
            />
          </div>

          {/* Main Headline */}
          <h1 className="font-archivist text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-[1.1] drop-shadow-[0_0_30px_rgba(0,0,0,0.8)]">
            THE ARCHIVIST
            <br />
            METHOD™
          </h1>

          {/* Subheadline */}
          <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-archivist-teal drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]">
            Pattern Archaeology, Not Therapy
          </p>

          {/* Hook Text */}
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]">
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