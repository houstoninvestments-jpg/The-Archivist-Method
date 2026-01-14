import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/#method", label: "Method" },
    { href: "/#pricing", label: "Pricing" },
    { href: "/contact", label: "Contact" },
  ];

  const handleNavClick = (href: string) => {
    if (href.startsWith("/#")) {
      const sectionId = href.replace("/#", "");
      if (location === "/") {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        window.location.href = href;
      }
    } else {
      window.location.href = href;
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "py-2 bg-black/90 backdrop-blur-xl border-b border-white/10"
            : "py-4 bg-transparent"
        }`}
        data-testid="header"
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer group">
              {/* Logo Icon */}
              <img
                src="/archivist-icon.png"
                alt="The Archivist"
                className="w-10 h-10 rounded-lg transition-transform group-hover:scale-105 object-cover"
              />
              {/* Brand Text */}
              <div className="hidden sm:block">
                <div className="text-lg font-bold text-white tracking-tight">
                  THE ARCHIVIST METHOD<span className="text-teal-400">™</span>
                </div>
                <div
                  className={`text-xs text-teal-400 transition-all duration-300 ${
                    isScrolled ? "opacity-0 h-0 overflow-hidden" : "opacity-100"
                  }`}
                >
                  Pattern Archaeology, Not Therapy
                </div>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-sm text-gray-300 hover:text-white transition-colors font-medium"
                data-testid={`nav-${link.label.toLowerCase()}`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Portal Login Button */}
          <div className="hidden md:block">
            <Link href="/portal/login">
              <button
                className="px-6 py-2.5 text-sm font-semibold text-black rounded-lg transition-all hover:scale-105 hover:shadow-lg hover:shadow-teal-500/30"
                style={{
                  background: "linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)",
                }}
                data-testid="button-portal-login"
              >
                Portal Login
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white"
            data-testid="button-mobile-menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl pt-20"
          >
            <nav className="flex flex-col items-center gap-6 p-8">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="text-xl text-gray-300 hover:text-white transition-colors font-medium"
                >
                  {link.label}
                </button>
              ))}
              <Link href="/portal/login">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mt-4 px-8 py-3 text-base font-semibold text-black rounded-lg"
                  style={{
                    background: "linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)",
                  }}
                >
                  Portal Login
                </button>
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
