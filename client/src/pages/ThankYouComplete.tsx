import { useEffect } from "react";
import { useLocation } from "wouter";
import { Check, Download } from "lucide-react";

export default function ThankYouComplete() {
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
            <div className="w-20 h-20 mx-auto bg-archivist-pink/20 rounded-full flex items-center justify-center">
              <Check className="w-10 h-10 text-archivist-pink" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Welcome to The Complete Archive</h1>
          <p className="text-xl text-gray-300 mb-4">Thank you for your purchase!</p>
          <p className="text-lg text-gray-400 mb-8">You now have lifetime access to the complete 685-page system.</p>
          <div className="bg-gradient-to-br from-archivist-pink/10 to-archivist-teal/10 border border-archivist-pink/30 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-archivist-pink">Download Your Complete Archive</h2>
            <p className="text-gray-300 mb-6">Click below to download:</p>
            <a href="/complete-archive.pdf" download className="inline-flex items-center gap-2 bg-archivist-pink text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-archivist-pink/90 transition-all" data-testid="link-download-archive">
              <Download className="w-5 h-5" />
              Download Complete Archive
            </a>
          </div>
          <div className="text-left bg-archivist-dark/50 border border-gray-800 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold mb-4 text-archivist-pink">What Is Inside:</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-3"><Check className="w-5 h-5 text-archivist-pink mt-0.5 shrink-0" /><span>685-page complete system</span></li>
              <li className="flex items-start gap-3"><Check className="w-5 h-5 text-archivist-pink mt-0.5 shrink-0" /><span>All patterns plus advanced content</span></li>
              <li className="flex items-start gap-3"><Check className="w-5 h-5 text-archivist-pink mt-0.5 shrink-0" /><span>Relationship and parenting applications</span></li>
              <li className="flex items-start gap-3"><Check className="w-5 h-5 text-archivist-pink mt-0.5 shrink-0" /><span>Lifetime access to updates</span></li>
            </ul>
          </div>
          <div className="bg-archivist-teal/10 border border-archivist-teal/30 rounded-lg p-6">
            <p className="text-gray-300">Need help? Contact support@archivistmethod.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
