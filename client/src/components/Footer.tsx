import { Link } from "wouter";

const footerLinks = {
  method: [
    { label: "Pattern Archaeology", href: "/#origin" },
    { label: "The 9 Patterns", href: "/#patterns" },
    { label: "FEIR Framework", href: "/#method" },
    { label: "The Original Room", href: "/#origin" }
  ],
  products: [
    { label: "The Crash Course (Free)", href: "/quiz" },
    { label: "The Field Guide ($47)", href: "/portal" },
    { label: "The Complete Archive ($197)", href: "/portal" },
  ],
  legal: [
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Contact Us", href: "/contact" },
  ],
  connect: [
    { label: "Take the Quiz", href: "/quiz" },
    { label: "Portal Login", href: "/portal" },
  ]
};

function FooterLink({ href, label }: { href: string; label: string }) {
  const testId = `link-footer-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const className = "text-gray-500 hover:text-teal-500 transition-colors text-sm cursor-pointer block";
  
  if (href.startsWith("http")) {
    return (
      <a
        href={href}
        className={className}
        data-testid={testId}
        target="_blank"
        rel="noopener noreferrer"
      >
        {label}
      </a>
    );
  }
  
  if (href.startsWith("/#")) {
    return (
      <a
        href={href}
        className={className}
        data-testid={testId}
      >
        {label}
      </a>
    );
  }
  
  return (
    <Link href={href} className={className} data-testid={testId}>
      {label}
    </Link>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-[#1a1a1a]" data-testid="footer">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                Method
              </h4>
              <ul className="space-y-3">
                {footerLinks.method.map((link) => (
                  <li key={link.label}>
                    <FooterLink href={link.href} label={link.label} />
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                Products
              </h4>
              <ul className="space-y-3">
                {footerLinks.products.map((link) => (
                  <li key={link.label}>
                    <FooterLink href={link.href} label={link.label} />
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                Legal
              </h4>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.label}>
                    <FooterLink href={link.href} label={link.label} />
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
                Connect
              </h4>
              <ul className="space-y-3">
                {footerLinks.connect.map((link) => (
                  <li key={link.label}>
                    <FooterLink href={link.href} label={link.label} />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-[#1a1a1a] pt-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2" data-testid="text-footer-title">
                THE ARCHIVIST METHOD<span className="text-teal-400">™</span>
              </h3>
              <p className="text-sm mb-4" data-testid="text-footer-tagline">
                Pattern archaeology, <span style={{ color: "#EC4899" }}>not</span> therapy.
              </p>
              <p className="text-gray-600 text-sm" data-testid="text-footer-copyright">
                © {currentYear} The Archivist Method. All rights reserved.
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </footer>
  );
}
