import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface ProductCardProps {
  title: string;
  subtitle: string;
  price: number | "FREE";
  features: string[];
  tier: "free" | "popular" | "premium";
  badge?: string;
  ctaText: string;
  onBuyClick?: () => void;
}

export default function ProductCard({
  title,
  subtitle,
  price,
  features,
  tier,
  badge,
  ctaText,
  onBuyClick,
}: ProductCardProps) {
  const getGlowClass = () => {
    switch (tier) {
      case "free":
        return "shadow-[0_0_20px_rgba(0,217,192,0.15)]";
      case "popular":
        return "shadow-[0_0_25px_rgba(255,0,128,0.2)]"; // REDUCED from intense glow
      case "premium":
        return "shadow-[0_0_20px_rgba(0,217,192,0.15)]";
      default:
        return "";
    }
  };

  const getButtonClass = () => {
    switch (tier) {
      case "free":
        return "w-full bg-archivist-teal text-archivist-dark font-semibold hover:bg-archivist-teal/90";
      case "popular":
        return "w-full bg-archivist-pink text-white font-semibold hover:bg-archivist-pink/90";
      case "premium":
        return "w-full btn-gradient-teal-pink";
      default:
        return "w-full";
    }
  };

  const getCheckColor = () => {
    switch (tier) {
      case "free":
        return "text-archivist-teal";
      case "popular":
        return "text-archivist-pink";
      case "premium":
        return "text-archivist-teal";
      default:
        return "text-archivist-teal";
    }
  };

  return (
    <Card
      className={`relative bg-[#1a1d29] border border-gray-800 ${getGlowClass()} transition-all duration-300 hover:scale-105`}
    >
      {badge && (
        <Badge
          className={`absolute -top-3 left-1/2 transform -translate-x-1/2 ${
            tier === "free"
              ? "bg-archivist-teal text-archivist-dark"
              : tier === "popular"
                ? "bg-archivist-pink text-white"
                : "bg-gradient-to-r from-archivist-teal to-archivist-pink text-white"
          }`}
        >
          {badge}
        </Badge>
      )}

      <CardHeader className="text-center space-y-2">
        <div className="text-5xl font-bold text-white">
          {price === "FREE" ? "FREE" : `$${price}`}
        </div>
        <h3 className="text-2xl font-bold text-white">{title}</h3>
        <p className="text-gray-400">{subtitle}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <Check
              className={`w-5 h-5 ${getCheckColor()} flex-shrink-0 mt-0.5`}
            />
            <span className="text-gray-300 text-sm leading-relaxed">
              {feature}
            </span>
          </div>
        ))}
      </CardContent>

      <CardFooter>
        <Button onClick={onBuyClick} className={getButtonClass()} size="lg">
          {ctaText}
        </Button>
      </CardFooter>
    </Card>
  );
}
