import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface HeroProps {
  onCTAClick?: () => void;
}

export default function Hero({ onCTAClick }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-archivist-dark">
      {/* Cosmic nebula background */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,217,192,0.25),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,0,128,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,217,192,0.15),transparent_40%)]" />
      </div>

      {/* Atmospheric fog layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-archivist-teal/5 via-transparent to-archivist-pink/10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-archivist-dark via-transparent to-archivist-dark pointer-events-none" />

      {/* Subtle star field */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute w-1 h-1 bg-archivist-teal rounded-full top-[10%] left-[15%] animate-pulse"
          style={{ animationDuration: "3s" }}
        />
        <div
          className="absolute w-1 h-1 bg-archivist-pink rounded-full top-[20%] right-[20%] animate-pulse"
          style={{ animationDuration: "4s" }}
        />
        <div
          className="absolute w-0.5 h-0.5 bg-white rounded-full top-[30%] left-[40%] animate-pulse"
          style={{ animationDuration: "5s" }}
        />
        <div
          className="absolute w-0.5 h-0.5 bg-archivist-teal rounded-full bottom-[25%] right-[30%] animate-pulse"
          style={{ animationDuration: "6s" }}
        />
        <div
          className="absolute w-1 h-1 bg-archivist-pink rounded-full bottom-[15%] left-[25%] animate-pulse"
          style={{ animationDuration: "4.5s" }}
        />
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Main Headline */}
          <h1
            className="font-archivist text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-[1.1]
                         drop-shadow-[0_0_30px_rgba(0,217,192,0.3)]"
          >
            THE ARCHIVIST
            <br />
            METHOD™
          </h1>

          {/* Subheadline */}
          <p
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-archivist-teal
                        drop-shadow-[0_0_20px_rgba(0,217,192,0.5)]"
          >
            Pattern Archaeology, Not Therapy
          </p>

          {/* Hook Text */}
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
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
              className="btn-gradient-teal-pink text-lg md:text-xl px-12 py-8 font-bold
                         hover:scale-105 transition-all duration-300
                         shadow-[0_0_40px_rgba(0,217,192,0.5)]
                         hover:shadow-[0_0_60px_rgba(0,217,192,0.7)]"
            >
              Start Free 7-Day Crash Course
              <ChevronDown className="ml-3 h-6 w-6 animate-bounce" />
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom atmospheric fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-archivist-dark to-transparent pointer-events-none" />
    </section>
  );
}
