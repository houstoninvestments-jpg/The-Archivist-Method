import { Link } from "wouter";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    method: [
      { label: "Pattern Archaeology", href: "/#method" },
      { label: "The 7 Patterns", href: "/#patterns" },
      { label: "FEIR Framework", href: "/#method" },
    ],
    products: [
      { label: "Free 7-Day Course", href: "/free", external: false },
      { label: "Quick-Start System", href: "/quick-start", external: false },
      { label: "Complete Archive", href: "/complete-archive", external: false },
    ],
    legal: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Refund Policy", href: "/terms#refund" },
    ],
    connect: [
      { label: "Contact Us", href: "/contact" },
      { label: "Portal Login", href: "/portal/login" },
      { label: "Support", href: "/contact" },
    ],
  };

  return (
    <footer className="relative bg-black border-t border-white/10">
      {/* Gradient Divider */}
      <div 
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent 0%, #14B8A6 50%, #EC4899 100%)",
        }}
      />

      {/* Top Section - Brand */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <img
                src="/archivist-icon.png"
                alt="The Archivist"
                className="w-16 h-16 object-contain"
                style={{ background: 'transparent' }}
              />
            </div>

            <h3 className="text-2xl font-bold text-white mb-2" data-testid="text-footer-title">
              THE ARCHIVIST METHOD<span className="text-teal-400">™</span>
            </h3>
            <p className="text-teal-400 text-sm mb-4" data-testid="text-footer-tagline">
              Pattern Archaeology, Not Therapy
            </p>
            <p className="text-gray-400 text-sm max-w-md mx-auto mb-8">
              Discover and interrupt the unconscious patterns that have been running your life.
            </p>

            <Link href="/free">
              <button
                className="px-8 py-3 text-sm font-semibold text-black rounded-lg transition-all hover:scale-105 hover:shadow-lg hover:shadow-teal-500/30"
                style={{
                  background: "linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)",
                }}
                data-testid="button-footer-cta"
              >
                Start Free Course
              </button>
            </Link>
          </div>

          {/* Link Columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {/* Method */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                Method
              </h4>
              <ul className="space-y-3">
                {footerLinks.method.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-teal-400 transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Products */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                Products
              </h4>
              <ul className="space-y-3">
                {footerLinks.products.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        className="text-gray-400 hover:text-teal-400 transition-colors text-sm cursor-pointer"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href}>
                        <span className="text-gray-400 hover:text-teal-400 transition-colors text-sm cursor-pointer">
                          {link.label}
                        </span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                Legal
              </h4>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href}>
                      <span className="text-gray-400 hover:text-teal-400 transition-colors text-sm cursor-pointer">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                Connect
              </h4>
              <ul className="space-y-3">
                {footerLinks.connect.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href}>
                      <span className="text-gray-400 hover:text-teal-400 transition-colors text-sm cursor-pointer">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-500 text-sm" data-testid="text-footer-copyright">
                © {currentYear} The Archivist Method. All rights reserved.
              </p>
              <p className="text-gray-600 text-xs text-center md:text-right max-w-lg">
                Medical Disclaimer: This is educational content about behavioral patterns, not therapy or medical advice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
