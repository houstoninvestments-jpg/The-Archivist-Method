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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-20 flex items-center ${
          isScrolled
            ? "bg-black/90 backdrop-blur-xl border-b border-white/10"
            : "bg-black/50 backdrop-blur-md"
        }`}
        data-testid="header"
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 cursor-pointer group">
            <img
              src="/archivist-icon.png"
              alt="The Archivist"
              className="w-10 h-10 md:w-12 md:h-12 transition-transform group-hover:scale-105 object-contain"
              style={{ background: 'transparent' }}
            />
            <span className="hidden sm:block text-lg md:text-xl font-bold text-white tracking-tight">
              THE ARCHIVIST METHOD<span className="text-teal-400">™</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-sm text-gray-400 hover:text-teal-400 transition-colors font-medium"
                data-testid={`nav-${link.label.toLowerCase()}`}
              >
                {link.label}
              </button>
            ))}
            
            {/* Portal Login - Teal outline button */}
            <Link 
              href="/portal/login"
              className="px-5 py-2 text-sm font-semibold text-teal-500 border-2 border-teal-500 rounded-lg transition-all duration-300 hover:bg-teal-500 hover:text-white"
              data-testid="button-portal-login"
            >
              Portal Login
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white"
            data-testid="button-mobile-menu"
            aria-label="Toggle menu"
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
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl pt-24"
          >
            <nav className="flex flex-col items-center gap-8 p-8">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="text-2xl text-white hover:text-teal-400 transition-colors font-medium"
                  data-testid={`mobile-nav-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </button>
              ))}
              <Link 
                href="/portal/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-4 px-8 py-3 text-lg font-semibold text-teal-500 border-2 border-teal-500 rounded-lg transition-all duration-300 hover:bg-teal-500 hover:text-white"
                data-testid="button-mobile-portal"
              >
                Portal Login
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
