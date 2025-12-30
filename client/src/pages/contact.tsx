export default function Contact() {
  return (
    <div className="min-h-screen bg-archivist-dark text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-archivist-dark/95 backdrop-blur-sm border-b border-archivist-teal/20">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <img 
              src="/archivist-icon.png" 
              alt="The Archivist" 
              className="w-10 h-10 rounded-full"
            />
            <span className="text-white font-bold text-lg md:text-xl">
              The Archivist Method™
            </span>
          </a>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-2xl">
          <h1 className="text-4xl font-bold mb-8 text-archivist-teal text-center">Contact Us</h1>

          <div className="bg-archivist-dark/50 border-2 border-archivist-teal/30 rounded-lg p-8 space-y-6">
            <p className="text-gray-300 text-center">
              Have questions about The Archivist Method™? We're here to help.
            </p>

            <div className="space-y-4 text-center">
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Email Support</h2>
                <a 
                  href="mailto:support@thearchivistmethod.com" 
                  className="text-archivist-teal hover:underline text-lg"
                >
                  support@thearchivistmethod.com
                </a>
              </div>

              <div className="pt-6 border-t border-archivist-teal/20">
                <h2 className="text-xl font-bold text-white mb-2">Response Time</h2>
                <p className="text-gray-400">We typically respond within 24-48 hours.</p>
              </div>

              <div className="pt-6 border-t border-archivist-teal/20">
                <h2 className="text-xl font-bold text-white mb-2">Refund Requests</h2>
                <p className="text-gray-400">
                  Remember our 90-day money-back guarantee. If you'd like a refund, 
                  just email us and we'll process it immediately. No questions asked.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}