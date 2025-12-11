import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import logoImage from "@assets/1764975447300-019af0bb-39c0-7323-97f9-1e4a0377aa15__1_-removeb_1765023942955.png";

interface HeroProps {
  onCTAClick?: () => void;
}

export default function Hero({ onCTAClick }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-archivist-dark">
      {/* Cosmic nebula background - very subtle */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,217,192,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,0,128,0.1),transparent_50%)]" />
      </div>

      {/* Atmospheric fog layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-archivist-teal/5 via-transparent to-archivist-pink/5 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-archivist-dark via-transparent to-archivist-dark pointer-events-none" />

      {/* Subtle star field */}
      <div className="absolute inset-0 opacity-20">
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

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-16">
          {/* THE ARCHIVIST - Large, prominent, with cosmic glow */}
          <div className="relative inline-block">
            {/* Multi-layer glow effect */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-archivist-teal/30 via-archivist-pink/20 to-archivist-teal/30 blur-[100px] animate-pulse"
              style={{ animationDuration: "4s" }}
            />
            <div className="absolute inset-0 bg-archivist-teal/10 blur-3xl" />

            {/* The Archivist avatar */}
            <div className="relative">
              <img
                src={logoImage}
                alt="The Archivist"
                className="relative w-72 h-72 md:w-96 md:h-96 mx-auto object-contain
                           drop-shadow-[0_0_60px_rgba(0,217,192,0.4)]
                           hover:scale-105 transition-all duration-700"
              />

              {/* Gradient ring - teal to pink */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(0,217,192,0.3) 0%, rgba(255,0,128,0.3) 100%)",
                  filter: "blur(2px)",
                  animation: "pulse 3s ease-in-out infinite",
                }}
              />
            </div>
          </div>

          {/* Content stack */}
          <div className="space-y-6">
            {/* Main headline */}
            <h1
              className="font-archivist text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-tight
                           drop-shadow-[0_0_30px_rgba(0,217,192,0.3)]"
            >
              THE ARCHIVIST METHOD™
            </h1>

            {/* Subheadline */}
            <p
              className="text-2xl md:text-3xl lg:text-4xl font-semibold text-archivist-teal
                          drop-shadow-[0_0_20px_rgba(0,217,192,0.5)]"
            >
              Pattern Archaeology, Not Therapy
            </p>

            {/* Hook text */}
            <p className="text-lg md:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed pt-4">
              Stop running the same destructive patterns. Learn the proven
              method to interrupt trauma patterns in 7-90 days.
            </p>
          </div>

          {/* CTA Button */}
          <div className="pt-8">
            <Button
              onClick={onCTAClick}
              size="lg"
              className="btn-gradient-teal-pink text-lg md:text-xl px-10 py-7 font-semibold
                         hover:scale-105 transition-all duration-300
                         shadow-[0_0_40px_rgba(0,217,192,0.4)]
                         hover:shadow-[0_0_60px_rgba(0,217,192,0.6)]
                         relative overflow-hidden group"
            >
              {/* Button glow effect on hover */}
              <span
                className="absolute inset-0 bg-gradient-to-r from-archivist-teal/0 via-white/20 to-archivist-pink/0 
                               translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
              />

              <span className="relative flex items-center gap-2">
                Start Free 7-Day Crash Course
                <ChevronDown className="h-5 w-5 animate-bounce" />
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom atmospheric fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-archivist-dark to-transparent pointer-events-none" />
    </section>
  );
}
