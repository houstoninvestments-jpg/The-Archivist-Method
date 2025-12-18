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
    const base =
      "relative rounded-lg p-8 h-full flex flex-col transition-all duration-300";
    const border = "border-2";
    const hover = "hover:-translate-y-2";

    switch (tier) {
      case "free":
        return `${base} ${border} ${hover} border-archivist-teal/30 bg-archivist-dark/50 hover:shadow-[0_0_40px_rgba(0,217,192,0.3)]`;
      case "popular":
        return `${base} ${border} ${hover} border-archivist-pink/50 bg-archivist-dark/50 shadow-[0_0_25px_rgba(255,0,128,0.2)] hover:shadow-[0_0_50px_rgba(255,0,128,0.4)]`;
      case "premium":
        return `${base} ${border} ${hover} border-archivist-teal/30 bg-archivist-dark/50 hover:shadow-[0_0_40px_rgba(0,217,192,0.3)]`;
      default:
        return base;
    }
  };

  const getButtonClass = () => {
    switch (tier) {
      case "free":
        return "w-full bg-archivist-teal hover:bg-archivist-teal/90 hover:scale-105 transition-all duration-300";
      case "popular":
        return "w-full btn-gradient-pink hover:scale-105 transition-all duration-300";
      case "premium":
        return "w-full btn-gradient-teal-pink hover:scale-105 transition-all duration-300";
      default:
        return "w-full";
    }
  };

  return (
    <div className="relative h-full animate-fade-in">
      {/* Badge - Positioned OUTSIDE card */}
      {badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 animate-bounce-subtle">
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
        {/* Gothic decorative frame */}
        <div className="absolute inset-4 border border-archivist-teal rounded pointer-events-none"></div>
        <div className="absolute top-6 left-6 w-4 h-4 border-t-2 border-l-2 border-archivist-teal"></div>
        <div className="absolute top-6 right-6 w-4 h-4 border-t-2 border-r-2 border-archivist-teal"></div>
        <div className="absolute bottom-6 left-6 w-4 h-4 border-b-2 border-l-2 border-archivist-teal"></div>
        <div className="absolute bottom-6 right-6 w-4 h-4 border-b-2 border-r-2 border-archivist-teal"></div>

        {/* Content */}
        <div className="space-y-6 flex-grow">
          {/* Title - BIGGER & BOLDER */}
          <div className="text-center pt-4">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
              {title}
            </h3>
            <p className="text-gray-400 text-base">{subtitle}</p>
          </div>

          {/* Price - MUCH BIGGER */}
          <div className="text-center py-6">
            <div className="text-6xl md:text-7xl font-bold text-archivist-teal">
              {typeof price === "number" ? `$${price}` : price}
            </div>
          </div>

          {/* Features */}
          <ul className="space-y-3 flex-grow">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <Check className="h-5 w-5 text-archivist-teal shrink-0 mt-0.5" />
                <span className="text-gray-300 text-sm">{feature}</span>
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
