import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Check, ArrowRight, Mail } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function FreeDownload() {
  const [, setLocation] = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDownload, setShowDownload] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate email submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setShowDownload(true);
    setIsSubmitting(false);
  };

  const features = [
    "30-page guide (ADHD-optimized)",
    "Day-by-day protocol",
    "Pattern assessment quiz",
    "First interrupt attempt by Day 5",
    "Decide if you want to continue"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar onLoginClick={() => setLocation("/portal")} />
      
      <section className="fog-overlay bg-archivist-dark py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="font-archivist text-4xl font-bold tracking-tight text-archivist-teal sm:text-5xl mb-4" data-testid="text-free-headline">
              Get The 7-Day Crash Course FREE
            </h1>
            <p className="text-xl text-gray-300" data-testid="text-free-subheadline">
              One week. One pattern. See if this works for you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* What You Get */}
            <Card className="glow-card glow-card-teal">
              <CardHeader>
                <h2 className="text-2xl font-bold text-archivist-teal">What You Get</h2>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-archivist-teal" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Email Capture Form */}
            <Card className="glow-card glow-card-pink">
              <CardHeader>
                <h2 className="text-2xl font-bold">Get Instant Access</h2>
              </CardHeader>
              <CardContent>
                {!showDownload ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Input
                        type="text"
                        placeholder="Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="bg-background"
                        data-testid="input-name"
                      />
                    </div>
                    <div>
                      <Input
                        type="email"
                        placeholder="Your Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-background"
                        data-testid="input-email"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-archivist-teal text-archivist-dark font-semibold"
                      disabled={isSubmitting}
                      data-testid="button-submit-free"
                    >
                      {isSubmitting ? (
                        "Sending..."
                      ) : (
                        <>
                          <Mail className="mr-2 h-4 w-4" />
                          Send Me The Free Course
                        </>
                      )}
                    </Button>
                  </form>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="p-4 bg-archivist-teal/10 rounded-md border border-archivist-teal">
                      <Check className="h-12 w-12 mx-auto text-archivist-teal mb-2" />
                      <p className="text-archivist-teal font-semibold">Success!</p>
                    </div>
                    <a
                      href="/attached_assets/THE-ARCHIVIST-METHOD-7-DAY-CRASH-COURSE_1765084919732.pdf"
                      download
                      className="inline-block"
                    >
                      <Button className="w-full btn-gradient-teal-pink" data-testid="button-download-free">
                        Download Your Free 7-Day Crash Course
                      </Button>
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Upsell */}
          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              Want the full 90-day system?
            </p>
            <Button
              variant="outline"
              onClick={() => setLocation("/quick-start")}
              className="border-archivist-pink text-archivist-pink"
              data-testid="link-upsell-quickstart"
            >
              Get Quick-Start for $47
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
