import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "wouter";
import ArchivistIcon from "@/components/ArchivistIcon";
import { Menu, X } from "lucide-react";

const mobileNavLinks = [
  { label: "The Patterns", scrollTarget: "section-patterns" },
  { label: "The Method", scrollTarget: "section-how-it-works" },
  { label: "Pricing", scrollTarget: "section-pricing" },
  { label: "Take the Quiz", href: "/quiz" },
  { label: "Portal Login", href: "/portal" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [location] = useLocation();
  const isLanding = location === "/" || location === "";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isLanding) return;
    const sectionIds = mobileNavLinks
      .filter((l) => l.scrollTarget)
      .map((l) => l.scrollTarget!);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.getAttribute("data-testid"));
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    );

    sectionIds.forEach((id) => {
      const el = document.querySelector(`[data-testid="${id}"]`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isLanding]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleNavClick = useCallback((link: typeof mobileNavLinks[number]) => {
    setMenuOpen(false);
    if (link.scrollTarget) {
      const el = document.querySelector(`[data-testid="${link.scrollTarget}"]`);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
      }
    }
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 px-5 md:px-10 py-5 flex items-center justify-between ${
          isScrolled || menuOpen
            ? "bg-[rgba(10,10,10,0.95)] backdrop-blur-[10px] border-b border-white/10"
            : "bg-transparent"
        }`}
        data-testid="header"
      >
        <Link href="/" className="flex items-center gap-3 no-underline group">
          <ArchivistIcon size={36} />
          <span className="font-['Bebas_Neue',Oswald,sans-serif] text-base md:text-xl font-bold tracking-wide text-white uppercase">
            THE ARCHIVIST METHOD™
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-4 md:gap-6">
          <Link
            href="/quiz"
            className="text-slate-300 hover:text-teal-400 no-underline text-sm font-medium transition-colors"
            data-testid="link-quiz-nav"
          >
            Take the Quiz
          </Link>
          <Link
            href="/portal"
            className="text-teal-500 no-underline text-sm font-semibold px-4 py-2 border border-teal-500 rounded-md transition-all duration-200 hover:bg-teal-500 hover:text-white"
            data-testid="button-portal-login"
          >
            Portal Login
          </Link>
        </nav>

        <button
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-md transition-colors"
          style={{
            background: menuOpen ? "rgba(20, 184, 166, 0.1)" : "transparent",
            border: menuOpen ? "1px solid rgba(20, 184, 166, 0.3)" : "1px solid transparent",
          }}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          data-testid="button-mobile-menu"
        >
          {menuOpen ? (
            <X className="w-5 h-5 text-teal-400" />
          ) : (
            <Menu className="w-5 h-5 text-white" />
          )}
        </button>
      </header>

      {menuOpen && (
        <div
          className="fixed inset-0 z-[999] md:hidden"
          style={{ background: "rgba(10, 10, 10, 0.97)", paddingTop: "80px" }}
          data-testid="mobile-nav-overlay"
        >
          <nav className="flex flex-col items-center gap-1 px-6 pt-8">
            {mobileNavLinks.map((link) => {
              const isActive = link.scrollTarget
                ? activeSection === link.scrollTarget
                : location === link.href;
              const isPortal = link.href === "/portal";

              if (isPortal) {
                return (
                  <Link
                    key={link.label}
                    href="/portal"
                    onClick={() => setMenuOpen(false)}
                    className="no-underline w-full"
                    data-testid={`mobile-nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <div
                      className="text-center py-4 mt-4 rounded-md transition-all duration-200"
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "13px",
                        textTransform: "uppercase",
                        letterSpacing: "0.15em",
                        color: "white",
                        border: "1px solid rgba(20, 184, 166, 0.5)",
                        background: "rgba(20, 184, 166, 0.08)",
                      }}
                    >
                      {link.label}
                    </div>
                  </Link>
                );
              }

              if (link.href) {
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="no-underline w-full"
                    data-testid={`mobile-nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <div
                      className="text-center py-4 rounded-md transition-all duration-200"
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "13px",
                        textTransform: "uppercase",
                        letterSpacing: "0.15em",
                        color: isActive ? "#14B8A6" : "rgba(255, 255, 255, 0.4)",
                        textShadow: isActive ? "0 0 12px rgba(20, 184, 166, 0.5)" : "none",
                      }}
                    >
                      {link.label}
                    </div>
                  </Link>
                );
              }

              return (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link)}
                  className="w-full transition-all duration-200"
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: "16px 0",
                  }}
                  data-testid={`mobile-nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <div className="flex items-center justify-center gap-3">
                    <div
                      className="transition-all duration-300"
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: isActive ? "#14B8A6" : "transparent",
                        border: `1.5px solid ${isActive ? "#14B8A6" : "rgba(255, 255, 255, 0.15)"}`,
                        boxShadow: isActive ? "0 0 8px rgba(20, 184, 166, 0.6)" : "none",
                      }}
                    />
                    <span
                      className="transition-all duration-200"
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "13px",
                        textTransform: "uppercase",
                        letterSpacing: "0.15em",
                        color: isActive ? "#14B8A6" : "rgba(255, 255, 255, 0.4)",
                        textShadow: isActive ? "0 0 12px rgba(20, 184, 166, 0.5)" : "none",
                      }}
                    >
                      {link.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}
