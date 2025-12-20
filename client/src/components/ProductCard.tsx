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
  const borderColor =
    tier === "popular"
      ? "border-archivist-pink/50"
      : "border-archivist-teal/30";

  const shadowColor =
    tier === "popular"
      ? "shadow-[0_0_25px_rgba(255,0,128,0.2)] hover:shadow-[0_0_50px_rgba(255,0,128,0.4)]"
      : "hover:shadow-[0_0_40px_rgba(0,217,192,0.3)]";

  const buttonClass =
    tier === "popular"
      ? "w-full btn-gradient-pink hover:scale-105 transition-all duration-300"
      : tier === "premium"
        ? "w-full btn-gradient-teal-pink hover:scale-105 transition-all duration-300"
        : "w-full bg-archivist-teal hover:bg-archivist-teal/90 hover:scale-105 transition-all duration-300";

  const badgeColor =
    tier === "popular"
      ? "bg-archivist-pink text-white"
      : "bg-archivist-teal text-archivist-dark";

  return (
    <div className="relative h-full">
      {/* Badge */}
      {/* Badge */}
      {/* Badge */}
      {badge && (
        <div className="absolute -top-4 left-0 right-0 flex justify-center z-10">
          <span
            className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${badgeColor}`}
          >
            {badge}
          </span>
        </div>
      )}
      
      {/* Card */}
      <div
        className={`relative border-2 ${borderColor} ${shadowColor} rounded-lg p-8 bg-archivist-dark/50 h-full flex flex-col hover:-translate-y-2 transition-all duration-300`}
      >
        {/* Title Section */}
        <div className="w-full mb-8">
          <h3 className="text-4xl font-bold text-white text-center mb-3">
            {title}
          </h3>
          <p className="text-gray-400 text-center">{subtitle}</p>
        </div>

        {/* Price Section */}
        <div className="w-full mb-8">
          <div className="text-7xl font-bold text-archivist-teal text-center">
            {typeof price === "number" ? `$${price}` : price}
          </div>
        </div>

        {/* Features */}
        <ul className="space-y-3 mb-8 flex-grow w-full">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="h-5 w-5 text-archivist-teal shrink-0 mt-0.5" />
              <span className="text-gray-300 text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        {/* Button */}
        <div className="w-full">
          <Button className={buttonClass} size="lg" onClick={onBuyClick}>
            {ctaText}
          </Button>
        </div>
      </div>
    </div>
  );
}