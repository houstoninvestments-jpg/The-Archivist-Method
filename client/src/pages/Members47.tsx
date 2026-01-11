import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Video, FileText, ArrowRight, Mail } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Members47() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <Navbar onLoginClick={() => setLocation("/portal")} />
      
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Welcome Header */}
          <div className="text-center mb-12">
            <Badge className="bg-archivist-teal text-archivist-dark mb-4">MEMBER ACCESS</Badge>
            <h1 className="font-archivist text-4xl font-bold tracking-tight text-white sm:text-5xl mb-4" data-testid="text-members-headline">
              Welcome to The Archivist Method™
            </h1>
            <p className="text-xl text-muted-foreground">
              You now have lifetime access to the Quick-Start System
            </p>
          </div>

          {/* Video Section - Most Prominent */}
          <Card className="glow-card glow-card-pink mb-8">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-archivist-pink/20">
                  <Video className="h-6 w-6 text-archivist-pink" />
                </div>
                <div>
                  <Badge className="bg-archivist-pink text-white mb-1">WATCH THIS FIRST</Badge>
                  <h2 className="text-2xl font-bold">Pattern Interruption Orientation</h2>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="aspect-video rounded-lg overflow-hidden">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/vQRSALJ5hgc"
                  title="Pattern Interruption Orientation"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  data-testid="video-orientation"
                />
              </div>
              <p className="text-muted-foreground mt-4">
                Watch this 25-minute orientation, then download your guides below.
              </p>
            </CardContent>
          </Card>

          {/* Main Guide */}
          <Card className="glow-card glow-card-teal mb-8">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-archivist-teal/20">
                  <FileText className="h-6 w-6 text-archivist-teal" />
                </div>
                <h2 className="text-2xl font-bold">Your Main Guide</h2>
              </div>
            </CardHeader>
            <CardContent>
              <a
                href="/attached_assets/THE-ARCHIVIST-METHOD-QUICK-START_1765097351318.pdf"
                download
              >
                <Button className="w-full bg-archivist-teal text-archivist-dark font-semibold" data-testid="button-download-quickstart">
                  <Download className="mr-2 h-4 w-4" />
                  Download Quick-Start System PDF (75 pages)
                </Button>
              </a>
            </CardContent>
          </Card>

          {/* Bonus Templates */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-muted">
                  <Download className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold">Bonus Templates (Printable)</h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <a
                href="/attached_assets/BONUS-1-Daily-Tracker-Archivist-Method_1765097351316.pdf"
                download
              >
                <Button variant="outline" className="w-full justify-start" data-testid="button-download-daily">
                  <Download className="mr-2 h-4 w-4" />
                  Download Daily Tracker
                </Button>
              </a>
              <a
                href="/attached_assets/BONUS-2-Weekly-Review-Archivist-Method_1765097351316.pdf"
                download
              >
                <Button variant="outline" className="w-full justify-start" data-testid="button-download-weekly">
                  <Download className="mr-2 h-4 w-4" />
                  Download Weekly Review
                </Button>
              </a>
              <a
                href="/attached_assets/BONUS-3-Emergency-Cards-Archivist-Method_1765097351317.pdf"
                download
              >
                <Button variant="outline" className="w-full justify-start" data-testid="button-download-emergency">
                  <Download className="mr-2 h-4 w-4" />
                  Download Emergency Protocol Cards
                </Button>
              </a>
            </CardContent>
          </Card>

          {/* Upsell to Complete Archive */}
          <Card className="border-archivist-pink glow-card glow-card-gradient mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold mb-2">Want the Complete Archive?</h3>
                  <p className="text-muted-foreground">All 7 Core Patterns mapped with advanced combinations</p>
                  <p className="text-archivist-pink font-semibold">Upgrade for only $150 more (normally $197)</p>
                </div>
                <Button
                  className="bg-archivist-pink text-white shrink-0"
                  onClick={() => setLocation("/complete-archive")}
                  data-testid="button-upgrade-archive"
                >
                  Upgrade Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Support */}
          <div className="text-center text-muted-foreground">
            <div className="flex items-center justify-center gap-2">
              <Mail className="h-4 w-4" />
              <span>Questions? Email: support@brokenpsychologylab.com</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
