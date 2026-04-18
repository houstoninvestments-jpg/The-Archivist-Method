import { Link } from "wouter";

const footerLinks = {
  method: [
    { label: "Pattern Archaeology", href: "/#credibility", scrollTarget: "section-credibility" },
    { label: "The 9 Patterns", href: "/#patterns", scrollTarget: "section-patterns" },
    { label: "The Four Doors", href: "/#method", scrollTarget: "section-how-it-works" },
    { label: "The Original Room", href: "/#founder", scrollTarget: "section-founder" }
  ],
  products: [
    { label: "The Crash Course (Free)", href: "/quiz" },
    { label: "The Field Guide ($67)", href: "/portal" },
    { label: "The Complete Archive ($297)", href: "/portal" },
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

const socialLinks = [
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@thearchivistmethod",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.1Z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/thearchivistmethod",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@thearchivistmethod",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.6 3.6 12 3.6 12 3.6s-7.6 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.8.5 9.4.5 9.4.5s7.6 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6z" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "https://x.com/archivistmethod",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/thearchivistmethod",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.51 1.49-3.9 3.78-3.9 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/the-archivist-method",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
      </svg>
    ),
  },
];

function FooterLink({ href, label, scrollTarget }: { href: string; label: string; scrollTarget?: string }) {
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
  
  if (scrollTarget) {
    return (
      <a
        href={href}
        className={className}
        data-testid={testId}
        onClick={(e) => {
          e.preventDefault();
          if (window.location.pathname !== "/") {
            window.location.href = href;
            return;
          }
          document.querySelector(`[data-testid="${scrollTarget}"]`)?.scrollIntoView({ behavior: "smooth" });
        }}
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
                    <FooterLink href={link.href} label={link.label} scrollTarget={link.scrollTarget} />
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
              <div className="flex justify-center gap-5 mb-6" data-testid="footer-social-links">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="text-gray-500 hover:text-teal-500 transition-colors"
                    data-testid={`link-social-${s.label.toLowerCase()}`}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
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
