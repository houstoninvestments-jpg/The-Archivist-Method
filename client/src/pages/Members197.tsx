import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Video, FileText, BookOpen, Mail } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Members197() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <Navbar onLoginClick={() => setLocation("/portal")} />
      
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Welcome Header */}
          <div className="text-center mb-12">
            <Badge className="btn-gradient-teal-pink mb-4">LIFETIME ACCESS</Badge>
            <h1 className="font-archivist text-4xl font-bold tracking-tight text-white sm:text-5xl mb-4" data-testid="text-members-headline">
              Welcome to The Complete Archive
            </h1>
            <p className="text-xl text-muted-foreground">
              You have lifetime access to the full Archivist Method™
            </p>
          </div>

          {/* Main Download - Most Prominent */}
          <Card className="glow-card glow-card-gradient mb-8">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-archivist-teal/20">
                  <BookOpen className="h-6 w-6 text-archivist-teal" />
                </div>
                <div>
                  <Badge className="btn-gradient-teal-pink mb-1">YOUR COMPLETE ARCHIVE</Badge>
                  <h2 className="text-2xl font-bold">The Complete 685-Page Manual</h2>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                This includes everything: all 23 sections, all patterns, all contexts, lifetime reference.
              </p>
              <a
                href="/attached_assets/THE-ARCHIVIST-METHOD-COMPLETE-ARCHIVE_1765084919733.pdf"
                download
              >
                <Button className="w-full btn-gradient-teal-pink font-semibold text-lg py-6" data-testid="button-download-archive">
                  <Download className="mr-2 h-5 w-5" />
                  Download Complete Archive (685 pages)
                </Button>
              </a>
            </CardContent>
          </Card>

          {/* Bonus: Video Training */}
          <Card className="glow-card glow-card-pink mb-8">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-archivist-pink/20">
                  <Video className="h-6 w-6 text-archivist-pink" />
                </div>
                <div>
                  <Badge variant="outline" className="border-archivist-pink text-archivist-pink mb-1">BONUS</Badge>
                  <h2 className="text-2xl font-bold">Quick-Start Video Training</h2>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-archivist-dark rounded-lg flex items-center justify-center border border-muted">
                <div className="text-center">
                  <Video className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">25-Minute Video Training</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Video player will be added here
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground mt-4">
                Pattern Interruption Orientation - watch this to get started quickly.
              </p>
            </CardContent>
          </Card>

          {/* Bonus: Quick-Start PDF */}
          <Card className="glow-card glow-card-teal mb-8">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-archivist-teal/20">
                  <FileText className="h-6 w-6 text-archivist-teal" />
                </div>
                <div>
                  <Badge variant="outline" className="border-archivist-teal text-archivist-teal mb-1">BONUS</Badge>
                  <h2 className="text-2xl font-bold">Quick-Start System</h2>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <a
                href="/attached_assets/THE-ARCHIVIST-METHOD-QUICK-START_1765084919733.pdf"
                download
              >
                <Button variant="outline" className="w-full border-archivist-teal text-archivist-teal" data-testid="button-download-quickstart">
                  <Download className="mr-2 h-4 w-4" />
                  Download Quick-Start System PDF
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
                <div>
                  <Badge variant="outline" className="mb-1">BONUS</Badge>
                  <h2 className="text-2xl font-bold">Printable Templates</h2>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <a
                href="/attached_assets/BONUS-1-Daily-Tracker-Archivist-Method_1765084919726.pdf"
                download
              >
                <Button variant="outline" className="w-full justify-start" data-testid="button-download-daily">
                  <Download className="mr-2 h-4 w-4" />
                  Download Daily Tracker
                </Button>
              </a>
              <a
                href="/attached_assets/BONUS-2-Weekly-Review-Archivist-Method_1765084919728.pdf"
                download
              >
                <Button variant="outline" className="w-full justify-start" data-testid="button-download-weekly">
                  <Download className="mr-2 h-4 w-4" />
                  Download Weekly Review
                </Button>
              </a>
              <a
                href="/attached_assets/BONUS-3-Emergency-Cards-Archivist-Method_1765084919729.pdf"
                download
              >
                <Button variant="outline" className="w-full justify-start" data-testid="button-download-emergency">
                  <Download className="mr-2 h-4 w-4" />
                  Download Emergency Protocol Cards
                </Button>
              </a>
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
