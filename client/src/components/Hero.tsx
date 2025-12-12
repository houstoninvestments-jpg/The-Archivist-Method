import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import archivistPortrait from "@assets/archivist-portrait-circle.jpg";

interface HeroProps {
  onCTAClick?: () => void;
}

export default function Hero({ onCTAClick }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-archivist-dark">
      {/* Large faded avatar as background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
        <img
          src={archivistPortrait}
          alt=""
          className="w-[800px] h-[800px] object-contain blur-sm"
        />
      </div>

      {/* Cosmic nebula background overlays */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,217,192,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(255,0,128,0.15),transparent_50%)]" />
      </div>

      {/* Atmospheric fog */}
      <div className="absolute inset-0 bg-gradient-to-b from-archivist-teal/5 via-transparent to-archivist-pink/10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-archivist-dark via-transparent to-archivist-dark pointer-events-none" />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Main headline */}
          <h1
            className="font-archivist text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-tight
                         drop-shadow-[0_0_40px_rgba(0,0,0,0.8)]"
          >
            THE ARCHIVIST METHOD™
          </h1>

          {/* Subheadline */}
          <p
            className="text-2xl md:text-3xl lg:text-4xl font-semibold text-archivist-teal
                        drop-shadow-[0_0_30px_rgba(0,0,0,0.8)]"
          >
            Pattern Archaeology, Not Therapy
          </p>

          {/* Hook text */}
          <p
            className="text-lg md:text-xl lg:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed
                        drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]"
          >
            Stop running the same destructive patterns. Learn the proven method
            to interrupt trauma patterns in 7-90 days.
          </p>

          {/* CTA Button */}
          <div className="pt-6">
            <Button
              onClick={onCTAClick}
              size="lg"
              className="btn-gradient-teal-pink text-lg md:text-xl px-10 py-7 font-semibold
                         hover:scale-105 transition-all duration-300
                         shadow-[0_0_40px_rgba(0,217,192,0.4)]
                         hover:shadow-[0_0_60px_rgba(0,217,192,0.6)]"
            >
              Start Free 7-Day Crash Course
              <ChevronDown className="ml-2 h-5 w-5 animate-bounce" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
