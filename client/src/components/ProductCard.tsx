import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface ProductCardProps {
  title: string;
  price: number;
  features: string[];
  isPremium?: boolean;
  badge?: string;
  onBuyClick?: () => void;
}

export default function ProductCard({
  title,
  price,
  features,
  isPremium = false,
  badge,
  onBuyClick,
}: ProductCardProps) {
  return (
    <Card
      className={`flex flex-col ${isPremium ? "border-destructive/50" : ""}`}
      data-testid={`card-product-${isPremium ? "premium" : "standard"}`}
    >
      <CardHeader className="space-y-4">
        {badge && (
          <Badge
            variant="destructive"
            className="w-fit"
            data-testid="badge-premium"
          >
            {badge}
          </Badge>
        )}
        <div>
          <p
            className={`text-4xl font-bold ${isPremium ? "text-destructive" : "text-primary"}`}
            data-testid="text-price"
          >
            ${price}
          </p>
        </div>
        <h3 className="text-xl font-semibold" data-testid="text-product-title">
          {title}
        </h3>
      </CardHeader>
      <CardContent className="flex-1">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className={`mt-0.5 h-5 w-5 shrink-0 ${isPremium ? "text-destructive" : "text-primary"}`} />
              <span className="text-sm text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          variant={isPremium ? "destructive" : "default"}
          onClick={onBuyClick}
          data-testid={`button-buy-${isPremium ? "premium" : "standard"}`}
        >
          {isPremium ? `Get Complete Archive - $${price}` : `Get Pattern Recognition - $${price}`}
        </Button>
      </CardFooter>
    </Card>
  );
}
