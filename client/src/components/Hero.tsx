import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import heroImage from "@assets/generated_images/archivist_hero_character_image.png";
import fogOverlay from "@assets/generated_images/teal_pink_fog_overlay.png";

interface HeroProps {
  onCTAClick?: () => void;
}

export default function Hero({ onCTAClick }: HeroProps) {
  return (
    <section className="relative flex min-h-[calc(100vh-6rem)] flex-col items-center justify-center px-4 py-16 text-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
      <div 
        className="absolute inset-0 opacity-30 mix-blend-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${fogOverlay})` }}
      />
      
      <div className="relative z-10 max-w-4xl space-y-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl drop-shadow-lg" data-testid="text-headline">
          The Patterns Running Your Life Have a Blueprint
        </h1>
        <p className="text-xl font-semibold text-primary sm:text-2xl drop-shadow-md" data-testid="text-subheadline">
          Pattern Archaeology, Not Therapy
        </p>
        <p className="text-lg text-foreground/90 sm:text-xl drop-shadow-md" data-testid="text-tagline">
          See The Code. Break The Loop.
        </p>
        <p className="mx-auto max-w-2xl text-foreground/80 drop-shadow-md" data-testid="text-description">
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
