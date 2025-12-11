import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import archivistPortrait from "@assets/archivist-portrait-circle.jpg";

interface HeroProps {
  onCTAClick?: () => void;
}

export default function Hero({ onCTAClick }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-archivist-dark">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,217,192,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,0,128,0.1),transparent_50%)]" />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-archivist-teal/5 via-transparent to-archivist-pink/5 pointer-events-none" />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
            <div className="flex-shrink-0">
              <img
                src={archivistPortrait}
                alt="The Archivist"
                className="w-40 h-40 md:w-48 md:h-48 object-contain
                           drop-shadow-[0_0_40px_rgba(0,217,192,0.3)]
                           hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="flex-1 text-center md:text-left space-y-6">
              <h1 className="font-archivist text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight">
                THE ARCHIVIST METHOD™
              </h1>

              <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-archivist-teal">
                Pattern Archaeology, Not Therapy
              </p>

              <p className="text-base md:text-lg text-gray-300 max-w-2xl leading-relaxed">
                Stop running the same destructive patterns. Learn the proven
                method to interrupt trauma patterns in 7-90 days.
              </p>

              <div className="pt-4">
                <Button
                  onClick={onCTAClick}
                  size="lg"
                  className="btn-gradient-teal-pink text-base md:text-lg px-8 py-6 font-semibold
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
        </div>
      </div>
    </section>
  );
}
