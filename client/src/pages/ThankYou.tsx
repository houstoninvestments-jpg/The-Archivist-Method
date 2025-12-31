import { useEffect } from "react";
import { useLocation } from "wouter";

export default function ThankYou() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Auto-scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-archivist-dark text-white">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-archivist-dark/95 backdrop-blur-sm border-b border-archivist-teal/20">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => setLocation("/")}
            className="flex items-center gap-3 cursor-pointer"
          >
            <img
              src="/archivist-icon.png"
              alt="The Archivist"
              className="w-10 h-10 rounded-full"
            />
            <span className="text-xl font-bold">BROKEN PSYCHOLOGY LAB</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 pt-32 pb-20">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto bg-archivist-teal/20 rounded-full flex items-center justify-center">
              <svg 
                className="w-10 h-10 text-archivist-teal" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Check Your Email!
          </h1>

          <p className="text-xl text-gray-300 mb-8">
            Your 7-Day Crash Course is on its way.
          </p>

          {/* Download Card */}
          <div className="bg-gradient-to-br from-archivist-teal/10 to-archivist-pink/10 border border-archivist-teal/30 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-archivist-teal">
              Start Immediately
            </h2>
            <p className="text-gray-300 mb-6">
              Don't wait for the email - download your guide right now:
            </p>

            <a
              href="/7-day-crash-course.pdf"
              download
              className="inline-block bg-archivist-teal text-archivist-dark px-8 py-4 rounded-lg font-bold text-lg hover:bg-archivist-teal/90 transition-all transform hover:scale-105"
            >
              Download Your Free Guide
            </a>
          </div>

          {/* What's Included */}
          <div className="text-left bg-archivist-dark/50 border border-gray-800 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold mb-4 text-archivist-teal">
              What You're Getting:
            </h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-archivist-teal mt-1">✓</span>
                <span>30-page guide (ADHD-optimized)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-archivist-teal mt-1">✓</span>
                <span>Day-by-day protocol for one pattern</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-archivist-teal mt-1">✓</span>
                <span>Pattern assessment quiz</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-archivist-teal mt-1">✓</span>
                <span>First interrupt attempt by Day 5</span>
              </li>
            </ul>
          </div>

          {/* Upsell Section */}
          <div className="bg-gradient-to-br from-archivist-pink/10 to-archivist-teal/10 border border-archivist-pink/30 rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4">
              Ready for the Full System?
            </h3>
            <p className="text-gray-300 mb-6">
              The crash course covers 1 pattern. The Quick-Start System gives you all 7 patterns, 90 days of protocols, and everything you need to break destructive cycles.
            </p>
            <button
              onClick={() => setLocation("/#pricing")}
              className="bg-archivist-pink text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-archivist-pink/90 transition-all"
            >
              Upgrade to Quick-Start for $47 →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}