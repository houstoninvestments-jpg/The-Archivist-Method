import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, BookOpen, Users, Map, Infinity, Shield, Loader2 } from "lucide-react";

export default function CompleteArchive() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const handleBuy = async () => {
    if (isLoading) return;
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/portal/checkout/complete-archive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("No checkout URL returned");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setIsLoading(false);
    }
  };

  const sections = [
    "The 90-Day Protocol",
    "Severe Trauma & Addiction",
    "Relationships & Repair Scripts",
    "Parenting & Generational Patterns",
    "Career & Money Patterns",
    "Neurodivergent Adaptations (ADHD, Autism, OCD)",
    "Sexuality & Intimacy",
    "Faith & Spiritual Integration",
    "Long-Term Maintenance",
  ];

  const patterns = [
    "Disappearing",
    "Apology Loop",
    "Testing",
    "Attraction to Harm",
    "Compliment Deflection",
    "Draining Bond",
    "Success Sabotage",
  ];

  return (
    <div className="min-h-screen bg-background pt-20">

      <section className="fog-overlay bg-archivist-dark py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="btn-gradient-teal-pink mb-4">
              LIFETIME MASTERY
            </Badge>
            <h1
              className="font-archivist text-4xl font-bold tracking-tight text-white sm:text-5xl mb-4"
              data-testid="text-archive-headline"
            >
              The Archivist Method™ Complete Archive
            </h1>
            <p
              className="text-xl text-archivist-teal"
              data-testid="text-archive-subheadline"
            >
              Master all patterns. Every context. Forever.
            </p>
          </div>

          {/* What's Included */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Complete Manual */}
            <Card className="glow-card glow-card-gradient">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-3 rounded-full bg-archivist-teal/20">
                  <BookOpen className="h-6 w-6 text-archivist-teal" />
                </div>
                <h3 className="text-xl font-semibold">
                  Complete 685-Page Manual
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  All 7 Core Patterns:
                </p>
                <div className="flex flex-wrap gap-2">
                  {patterns.map((pattern, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className="border-archivist-pink text-archivist-pink"
                    >
                      {pattern}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* All Sections */}
            <Card className="glow-card glow-card-gradient">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-3 rounded-full bg-archivist-pink/20">
                  <Infinity className="h-6 w-6 text-archivist-pink" />
                </div>
                <h3 className="text-xl font-semibold">All 23 Sections</h3>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {sections.map((section, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-archivist-teal shrink-0" />
                      <span className="text-sm text-muted-foreground">
                        {section}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Case Studies */}
            <Card className="glow-card glow-card-teal">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-3 rounded-full bg-archivist-teal/20">
                  <Users className="h-6 w-6 text-archivist-teal" />
                </div>
                <h3 className="text-xl font-semibold">15 Real Case Studies</h3>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  See exactly how others interrupted their patterns with
                  detailed walkthroughs.
                </p>
              </CardContent>
            </Card>

            {/* Visual Maps */}
            <Card className="glow-card glow-card-pink">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-3 rounded-full bg-archivist-pink/20">
                  <Map className="h-6 w-6 text-archivist-pink" />
                </div>
                <h3 className="text-xl font-semibold">Visual Pattern Maps</h3>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Complete glossary and visual guides for lifetime reference.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Bonus Note */}
          <div className="text-center mb-8">
            <p className="text-archivist-teal">
              Includes everything from the Quick-Start System + much more
            </p>
          </div>

          {/* Pricing */}
          <Card className="glow-card glow-card-gradient text-center p-8">
            <div className="mb-6">
              <p
                className="text-6xl font-bold bg-gradient-to-r from-archivist-teal to-archivist-pink bg-clip-text text-transparent"
                data-testid="text-price"
              >
                $197
              </p>
              <p className="text-muted-foreground mt-2">
                One-time payment. Lifetime access. All future updates included.
              </p>
            </div>

            <Button
              size="lg"
              className="w-full max-w-md btn-gradient-teal-pink font-semibold text-lg py-6"
              onClick={handleBuy}
              disabled={isLoading}
              data-testid="button-buy-archive"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Redirecting to Checkout...
                </>
              ) : (
                "Get Complete Archive - $197"
              )}
            </Button>

            {/* Guarantee */}
            <div className="mt-8 flex items-center justify-center gap-2 text-muted-foreground">
              <Shield className="h-5 w-5" />
              <span>30-Day Money-Back Guarantee</span>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
