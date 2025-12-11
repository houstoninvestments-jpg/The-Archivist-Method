import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import logoImage from "@assets/1764975447300-019af0bb-39c0-7323-97f9-1e4a0377aa15__1_-removeb_1765023942955.png";

interface HeroProps {
  onCTAClick?: () => void;
}

export default function Hero({ onCTAClick }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-archivist-dark via-archivist-dark/95 to-archivist-dark">
      {/* Animated circuit pattern background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,217,192,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,217,192,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,217,192,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* Fog overlay - teal/pink gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-archivist-teal/10 via-transparent to-archivist-pink/10 pointer-events-none" />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          {/* THE ARCHIVIST - Large and Prominent */}
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-archivist-teal/20 blur-3xl rounded-full animate-pulse" />
            <img
              src={logoImage}
              alt="The Archivist"
              className="relative w-48 h-48 md:w-64 md:h-64 mx-auto object-contain drop-shadow-2xl
                         hover:scale-105 transition-transform duration-500"
            />
            {/* Glowing ring effect */}
            <div
              className="absolute inset-0 rounded-full border-2 border-archivist-teal/30 animate-ping"
              style={{ animationDuration: "3s" }}
            />
          </div>

          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="font-archivist text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight">
              THE ARCHIVIST METHOD™
            </h1>
            <p className="text-2xl md:text-3xl font-semibold text-archivist-teal">
              Pattern Archaeology, Not Therapy
            </p>
          </div>

          {/* Hook */}
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Stop running the same destructive patterns. Learn the proven method
            to interrupt trauma patterns in 7-90 days.
          </p>

          {/* CTA Button */}
          <div className="pt-4">
            <Button
              onClick={onCTAClick}
              size="lg"
              className="btn-gradient-teal-pink text-lg px-8 py-6 font-semibold
                         hover:scale-105 transition-all duration-300
                         shadow-[0_0_30px_rgba(0,217,192,0.3)]
                         hover:shadow-[0_0_50px_rgba(0,217,192,0.5)]"
            >
              Start Free 7-Day Crash Course
              <ChevronDown className="ml-2 h-5 w-5 animate-bounce" />
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom fade to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-archivist-dark to-transparent" />
    </section>
  );
}
