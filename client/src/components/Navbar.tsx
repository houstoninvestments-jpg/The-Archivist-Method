import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import logoImage from "@assets/1764975447300-019af0bb-39c0-7323-97f9-1e4a0377aa15__1_-removeb_1765023942955.png";

interface NavbarProps {
  onLoginClick?: () => void;
}

export default function Navbar({ onLoginClick }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between gap-2 px-3 sm:px-4">
        <Link href="/" className="flex items-center shrink min-w-0">
          <img 
            src={logoImage} 
            alt="Broken Psychology Lab" 
            className="h-8 sm:h-10 md:h-12 w-auto max-w-[180px] sm:max-w-[240px] md:max-w-none object-contain"
            data-testid="img-logo"
          />
        </Link>
        <Button
          variant="outline"
          onClick={onLoginClick}
          size="sm"
          className="shrink-0 text-xs sm:text-sm"
          data-testid="button-member-login"
        >
          Member Login
        </Button>
      </div>
    </nav>
  );
}
