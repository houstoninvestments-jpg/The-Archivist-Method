import { useEffect } from "react";
import { useLocation } from "wouter";
import { Check, Download, ArrowRight } from "lucide-react";

export default function ThankYou() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-archivist-dark text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-archivist-dark/95 backdrop-blur-sm border-b border-archivist-teal/20">
        <div className="container mx-auto px-6 py-4">
          <button onClick={() => setLocation("/")} className="flex items-center gap-3" data-testid="button-home">
            <span className="text-xl font-bold">BROKEN PSYCHOLOGY LAB</span>
          </button>
        </div>
      </nav>
      <div className="container mx-auto px-6 pt-32 pb-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto bg-archivist-teal/20 rounded-full flex items-center justify-center">
              <Check className="w-10 h-10 text-archivist-teal" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Check Your Email!</h1>
          <p className="text-xl text-gray-300 mb-8">Your 7-Day Crash Course is on its way.</p>
          <div className="bg-gradient-to-br from-archivist-teal/10 to-archivist-pink/10 border border-archivist-teal/30 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-archivist-teal">Start Immediately</h2>
            <p className="text-gray-300 mb-6">Download your guide right now:</p>
            <a href="/7-day-crash-course.pdf" download className="inline-flex items-center gap-2 bg-archivist-teal text-archivist-dark px-8 py-4 rounded-lg font-bold text-lg" data-testid="link-download-guide">
              <Download className="w-5 h-5" />
              Download Your Free Guide
            </a>
          </div>
          <div className="text-left bg-archivist-dark/50 border border-gray-800 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold mb-4 text-archivist-teal">What You Are Getting:</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-archivist-teal mt-0.5 shrink-0" />
                <span>30-page guide</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-archivist-teal mt-0.5 shrink-0" />
                <span>Day-by-day protocol</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-archivist-teal mt-0.5 shrink-0" />
                <span>Pattern assessment quiz</span>
              </li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-archivist-pink/10 to-archivist-teal/10 border border-archivist-pink/30 rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4">Ready for the Full System?</h3>
            <p className="text-gray-300 mb-6">The Quick-Start System gives you all 7 patterns and 90 days of protocols.</p>
            <a href="https://buy.stripe.com/cNidR1eKi8cb16qalY6c001" className="inline-flex items-center gap-2 bg-archivist-pink text-white px-8 py-4 rounded-lg font-bold text-lg" data-testid="link-upgrade">
              Upgrade to Quick-Start for $47
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
