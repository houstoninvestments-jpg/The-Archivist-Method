import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import logoImage from "@assets/1764975447300-019af0bb-39c0-7323-97f9-1e4a0377aa15_(1)_1765023724795.jpg";

interface NavbarProps {
  onLoginClick?: () => void;
}

export default function Navbar({ onLoginClick }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center">
          <img 
            src={logoImage} 
            alt="Broken Psychology Lab" 
            className="h-12 w-auto"
            data-testid="img-logo"
          />
        </Link>
        <Button
          variant="outline"
          onClick={onLoginClick}
          data-testid="button-member-login"
        >
          Member Login
        </Button>
      </div>
    </nav>
  );
}
