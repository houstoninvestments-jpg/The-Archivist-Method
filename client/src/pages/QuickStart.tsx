import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Video, FileText, Download, Shield, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function QuickStart() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const handleBuy = async () => {
    if (isLoading) return;
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/portal/checkout/quick-start", {
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

  const mainFeatures = [
    {
      icon: FileText,
      title: "Quick-Start System PDF (75 pages)",
      items: [
        "Complete 90-Day Protocol",
        "Pattern Assessment Quiz",
        "Circuit Break Library",
        "Original Room Excavation Guide",
        "Crisis Protocols",
        "Relationship Scripts",
      ],
    },
    {
      icon: Video,
      title: "25-Minute Video Training",
      items: [
        "Pattern Interruption Orientation",
        "Watch FIRST, then work through guide",
      ],
    },
    {
      icon: Download,
      title: "3 Printable Bonus Templates",
      items: ["Daily Tracker", "Weekly Review", "Emergency Protocol Cards"],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar onLoginClick={() => setLocation("/portal")} />

      <section className="fog-overlay bg-archivist-dark py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="bg-archivist-pink text-white mb-4">
              MOST POPULAR
            </Badge>
            <h1
              className="font-archivist text-4xl font-bold tracking-tight text-white sm:text-5xl mb-4"
              data-testid="text-quickstart-headline"
            >
              The Archivist Method™ Quick-Start System
            </h1>
            <p
              className="text-xl text-archivist-teal"
              data-testid="text-quickstart-subheadline"
            >
              Fix ONE pattern in 90 days
            </p>
          </div>

          {/* What's Included */}
          <div className="space-y-6 mb-12">
            <h2 className="text-2xl font-bold text-center mb-8">
              What's Included
            </h2>

            {mainFeatures.map((feature, index) => (
              <Card key={index} className="glow-card glow-card-pink">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="p-3 rounded-full bg-archivist-pink/20">
                    <feature.icon className="h-6 w-6 text-archivist-pink" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 ml-16">
                    {feature.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-archivist-teal" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pricing */}
          <Card className="glow-card glow-card-gradient text-center p-8">
            <div className="mb-6">
              <p className="text-muted-foreground line-through text-xl">
                Was $197
              </p>
              <p
                className="text-6xl font-bold text-archivist-pink"
                data-testid="text-price"
              >
                $47
              </p>
              <p className="text-muted-foreground mt-2">
                One-time payment. Lifetime access.
              </p>
            </div>

            <Button
              size="lg"
              className="w-full max-w-md bg-archivist-pink text-white font-semibold text-lg py-6"
              onClick={handleBuy}
              disabled={isLoading}
              data-testid="button-buy-quickstart"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Redirecting to Checkout...
                </>
              ) : (
                "Get Quick-Start System - $47"
              )}
            </Button>

            {/* Guarantee */}
            <div className="mt-8 flex items-center justify-center gap-2 text-muted-foreground">
              <Shield className="h-5 w-5" />
              <span>30-Day Money-Back Guarantee</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              If this doesn't interrupt your pattern, full refund.
            </p>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
