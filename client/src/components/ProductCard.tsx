import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface ProductCardProps {
  title: string;
  subtitle: string;
  price: number | string;
  tier: "free" | "popular" | "premium";
  badge?: string;
  ctaText: string;
  features: string[];
  onBuyClick: () => void;
}

export default function ProductCard({
  title,
  subtitle,
  price,
  tier,
  badge,
  ctaText,
  features,
  onBuyClick,
}: ProductCardProps) {
  const getCardClass = () => {
    const base = "relative rounded-lg p-8 h-full flex flex-col";
    const border = "border-2";

    switch (tier) {
      case "free":
        return `${base} ${border} border-archivist-teal/30 bg-archivist-dark/50`;
      case "popular":
        return `${base} ${border} border-archivist-pink/50 bg-archivist-dark/50 shadow-[0_0_25px_rgba(255,0,128,0.2)]`;
      case "premium":
        return `${base} ${border} border-archivist-teal/30 bg-archivist-dark/50`;
      default:
        return base;
    }
  };

  const getButtonClass = () => {
    switch (tier) {
      case "free":
        return "w-full bg-archivist-teal hover:bg-archivist-teal/90";
      case "popular":
        return "w-full btn-gradient-pink";
      case "premium":
        return "w-full btn-gradient-teal-pink";
      default:
        return "w-full";
    }
  };

  return (
    <div className="relative h-full">
      {/* Badge - Positioned OUTSIDE card */}
      {badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <span
            className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider
            ${tier === "popular" ? "bg-archivist-pink text-white" : "bg-archivist-teal text-archivist-dark"}`}
          >
            {badge}
          </span>
        </div>
      )}

      {/* Card with Gothic frame */}
      <div className={getCardClass()}>
        {/* Gothic corner accents */}
        <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-archivist-teal/60"></div>
        <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-archivist-teal/60"></div>
        <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-archivist-teal/60"></div>
        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-archivist-teal/60"></div>
        {/* Content */}
        <div className="space-y-6 flex-grow">
          {/* Title */}
          <div className="text-center pt-4">
            <h3 className="text-3xl font-bold text-white mb-2">{title}</h3>
            <p className="text-gray-400">{subtitle}</p>
          </div>

          {/* Price */}
          <div className="text-center py-4">
            <div className="text-5xl font-bold text-archivist-teal">
              {typeof price === "number" ? `$${price}` : price}
            </div>
          </div>

          {/* Features */}
          <ul className="space-y-3 flex-grow">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <Check className="h-5 w-5 text-archivist-teal shrink-0 mt-0.5" />
                <span className="text-gray-300">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Button - Always at bottom */}
        <div className="mt-8">
          <Button className={getButtonClass()} size="lg" onClick={onBuyClick}>
            {ctaText}
          </Button>
        </div>
      </div>
    </div>
  );
}
