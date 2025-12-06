import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "wouter";

interface ThankYouContentProps {
  purchaseType?: "pattern_session" | "complete_archive";
  onUpgrade?: () => void;
}

export default function ThankYouContent({ 
  purchaseType = "pattern_session",
  onUpgrade 
}: ThankYouContentProps) {
  const [isAnimated] = useState(true);
  const showUpsell = purchaseType === "pattern_session";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-xl w-full space-y-8 text-center">
        <div className={`${isAnimated ? "animate-bounce" : ""}`}>
          <CheckCircle className="h-20 w-20 text-primary mx-auto" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-3xl font-bold" data-testid="text-welcome">
            Welcome to the Archive
          </h1>
          <p className="text-xl text-muted-foreground" data-testid="text-begins">
            Your pattern excavation begins now
          </p>
          <p className="text-muted-foreground" data-testid="text-email-notice">
            Check your email for access details
          </p>
        </div>

        {showUpsell && (
          <Card className="border-destructive/50 text-left" data-testid="card-upsell">
            <CardHeader>
              <h2 className="text-xl font-semibold">Ready to Break ALL Your Patterns?</h2>
              <p className="text-muted-foreground">
                Get the Complete Pattern Archive and unlock lifetime AI access
              </p>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-3xl font-bold text-destructive">
                Upgrade for only $50 more
              </p>
              <p className="text-sm text-muted-foreground">
                (saves $47 vs buying separately)
              </p>
            </CardContent>
            <CardFooter>
              <Button
                variant="destructive"
                className="w-full"
                onClick={onUpgrade}
                data-testid="button-upgrade"
              >
                Upgrade Now
              </Button>
            </CardFooter>
          </Card>
        )}

        <Link href="/portal">
          <Button size="lg" className="gap-2" data-testid="button-access-portal">
            Access Your Portal
            <ArrowRight className="h-5 w-5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
