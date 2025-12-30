import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageSquare } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-archivist-dark py-20">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Contact <span className="text-archivist-teal">The Archivist</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Have questions about your pattern work? Reach out below.
          </p>
        </div>
        <Card className="bg-archivist-dark/50 border-archivist-teal/30 p-8">
          <form className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2 text-sm">Your Name</label>
              <Input
                type="text"
                placeholder="Enter your name"
                className="bg-archivist-dark border-archivist-teal/30 text-white"
                data-testid="input-contact-name"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2 text-sm">Email Address</label>
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-archivist-dark border-archivist-teal/30 text-white"
                data-testid="input-contact-email"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2 text-sm">Message</label>
              <Textarea
                placeholder="How can we help you?"
                className="bg-archivist-dark border-archivist-teal/30 text-white min-h-[150px]"
                data-testid="input-contact-message"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-archivist-teal hover:bg-archivist-teal/90"
              size="lg"
              data-testid="button-contact-submit"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Send Message
            </Button>
          </form>
          <div className="mt-8 pt-8 border-t border-archivist-teal/20 text-center">
            <p className="text-gray-400 flex items-center justify-center gap-2">
              <Mail className="h-4 w-4" />
              support@archivistmethod.com
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
