import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Home, ArrowLeft } from "lucide-react";
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
  showMemberLogin = true 
}: NavbarProps) {
  const [location, setLocation] = useLocation();
  const isHome = location === "/";

  const handleBack = () => {
    window.history.back();
  };

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
          {(showHome && !isHome) && (
            <Link href="/">
              <Button
                variant="ghost"
                size="icon"
                data-testid="button-home"
              >
                <Home className="h-5 w-5" />
              </Button>
            </Link>
          )}
          <Link href="/" className="flex items-center">
            <img 
              src={logoImage} 
              alt="Broken Psychology Lab" 
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
