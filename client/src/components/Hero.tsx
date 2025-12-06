import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface HeroProps {
  onCTAClick?: () => void;
}

export default function Hero({ onCTAClick }: HeroProps) {
  return (
    <section className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="max-w-4xl space-y-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl" data-testid="text-headline">
          The Patterns Running Your Life Have a Blueprint
        </h1>
        <p className="text-xl font-semibold text-primary sm:text-2xl" data-testid="text-subheadline">
          Pattern Archaeology, Not Therapy
        </p>
        <p className="text-lg text-muted-foreground sm:text-xl" data-testid="text-tagline">
          See The Code. Break The Loop.
        </p>
        <p className="mx-auto max-w-2xl text-muted-foreground" data-testid="text-description">
          Excavate the hidden logic systems that shape your choices, relationships, and self-perception
        </p>
        <div className="pt-6">
          <Button
            size="lg"
            onClick={onCTAClick}
            className="gap-2 text-lg"
            data-testid="button-cta-hero"
          >
            Start Pattern Recognition
            <ChevronDown className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
