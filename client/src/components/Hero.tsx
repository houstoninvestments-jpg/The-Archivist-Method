import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import logoImage from "@assets/1764975447300-019af0bb-39c0-7323-97f9-1e4a0377aa15__1_-removeb_1765023942955.png";

interface HeroProps {
  onCTAClick?: () => void;
}

export default function Hero({ onCTAClick }: HeroProps) {
  return (
    <section className="fog-overlay bg-archivist-dark flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="max-w-4xl space-y-6">
        <img
          src={logoImage}
          alt="The Archivist"
          className="h-32 w-auto mx-auto mb-4"
          data-testid="img-hero-logo"
        />
        <h1 className="font-archivist text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl" data-testid="text-headline">
          THE ARCHIVIST METHOD™
        </h1>
        <p className="text-xl font-semibold text-archivist-teal sm:text-2xl" data-testid="text-subheadline">
          Pattern Archaeology, Not Therapy
        </p>
        <p className="mx-auto max-w-2xl text-gray-300 text-lg" data-testid="text-description">
          Stop running the same destructive patterns. Learn the proven method to interrupt trauma patterns in 7-90 days.
        </p>
        <div className="pt-6">
          <Button
            size="lg"
            onClick={onCTAClick}
            className="gap-2 text-lg bg-archivist-teal text-archivist-dark font-semibold"
            data-testid="button-cta-hero"
          >
            Start Free 7-Day Crash Course
            <ChevronDown className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
