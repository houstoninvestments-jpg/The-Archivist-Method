import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
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
        return "glow-card glow-card-teal";
      case "popular":
        return "glow-card glow-card-pink";
      case "premium":
        return "glow-card glow-card-gradient";
      default:
        return "glow-card";
    }
  };

  const getButtonClass = () => {
    switch (tier) {
      case "free":
        return "w-full bg-archivist-teal text-archivist-dark font-semibold";
      case "popular":
        return "w-full bg-archivist-pink text-white font-semibold";
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
        return "text-primary";
    }
  };

  const getBadgeClass = () => {
    switch (tier) {
      case "free":
        return "bg-archivist-teal text-archivist-dark";
      case "popular":
        return "bg-archivist-pink text-white";
      case "premium":
        return "btn-gradient-teal-pink";
      default:
        return "";
    }
  };

  return (
    <Card
      className={`flex flex-col ${getGlowClass()}`}
      data-testid={`card-product-${tier}`}
    >
      <CardHeader className="space-y-4">
        {badge && (
          <Badge
            className={`w-fit ${getBadgeClass()}`}
            data-testid="badge-product"
          >
            {badge}
          </Badge>
        )}
        <div>
          <p
            className="text-4xl font-bold"
            data-testid="text-price"
          >
            {typeof price === "number" ? `$${price}` : price}
          </p>
        </div>
        <div>
          <h3 className="text-xl font-semibold" data-testid="text-product-title">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1" data-testid="text-product-subtitle">
            {subtitle}
          </p>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className={`mt-0.5 h-5 w-5 shrink-0 ${getCheckColor()}`} />
              <span className="text-sm text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          className={getButtonClass()}
          onClick={onBuyClick}
          data-testid={`button-buy-${tier}`}
        >
          {ctaText}
        </Button>
      </CardFooter>
    </Card>
  );
}
