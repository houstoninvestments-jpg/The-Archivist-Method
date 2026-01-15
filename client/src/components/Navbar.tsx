import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Home, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import logoImage from "@assets/1764975447300-019af0bb-39c0-7323-97f9-1e4a0377aa15__1_-removeb_1765023942955.png";

interface NavbarProps {
  onLoginClick?: () => void;
  showBack?: boolean;
  showHome?: boolean;
  showMemberLogin?: boolean;
}

export default function Navbar({
  onLoginClick,
  showBack = false,
  showHome = false,
  showMemberLogin = true,
}: NavbarProps) {
  const [location, setLocation] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const isHome = location === "/";

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 150);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBack = () => {
    window.history.back();
  };

  // On homepage, use scroll-triggered navbar
  if (isHome) {
    return (
      <nav
        className={`fixed top-0 z-50 w-full transition-all duration-500 ease-in-out
                    ${
                      isScrolled
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 -translate-y-4 pointer-events-none"
                    }`}
      >
        <div
          className="bg-archivist-dark/80 backdrop-blur-md border-b border-archivist-teal/20 
                        shadow-[0_4px_20px_rgba(0,217,192,0.1)]"
        >
          {/* Subtle cosmic fog gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-archivist-teal/5 via-transparent to-archivist-pink/5 pointer-events-none" />

          <div className="container mx-auto flex h-20 items-center justify-between px-4 relative">
            {/* Left: The Archivist icon with pulse */}
            <Link href="/" className="flex items-center group">
              <div className="relative">
                <div
                  className="absolute inset-0 bg-archivist-teal/20 rounded-full blur-lg animate-pulse"
                  style={{ animationDuration: "3s" }}
                />
                <img
                  src={logoImage}
                  alt="The Archivist"
                  className="relative h-12 w-12 object-contain transition-transform duration-300 
                             group-hover:scale-110 drop-shadow-[0_0_10px_rgba(0,217,192,0.5)]"
                />
              </div>
            </Link>
            {/* Center: Minimal navigation (optional - can remove if too cluttered) */}
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#products"
                className="text-sm text-gray-300 hover:text-archivist-teal transition-colors duration-200
                           hover:drop-shadow-[0_0_8px_rgba(0,217,192,0.6)]"
              >
                Pricing
              </a>
              <a
                href="#method"
                className="text-sm text-gray-300 hover:text-archivist-teal transition-colors duration-200
                           hover:drop-shadow-[0_0_8px_rgba(0,217,192,0.6)]"
              >
                Method
              </a>
            </div>
            {/* Right: Empty (or minimal help icon if needed) */}
            <div className="w-12" /> {/* Spacer for visual balance */}
          </div>
        </div>
      </nav>
    );
  }

  // For all other pages, use standard navbar
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-24 sm:h-28 md:h-32 items-center justify-between gap-2 px-3 sm:px-4">
        <div className="flex items-center gap-2 shrink min-w-0">
          {showBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          {showHome && !isHome && (
            <Link href="/">
              <Button variant="ghost" size="icon" data-testid="button-home">
                <Home className="h-5 w-5" />
              </Button>
            </Link>
          )}
          <Link href="/" className="flex items-center">
            <img
              src={logoImage}
              alt="The Archivist Method™"
              className="h-20 sm:h-24 md:h-28 w-auto max-w-[300px] sm:max-w-[400px] md:max-w-none object-contain"
              data-testid="img-logo"
            />
          </Link>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {!isHome && (
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:flex gap-2"
                data-testid="button-home-text"
              >
                <Home className="h-4 w-4" />
                Home
              </Button>
            </Link>
          )}
          {showMemberLogin && (
            <Button
              variant="outline"
              onClick={onLoginClick}
              size="sm"
              className="shrink-0 text-xs sm:text-sm"
              data-testid="button-member-login"
            >
              Member Login
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
