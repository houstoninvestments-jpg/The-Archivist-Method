import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface NavbarProps {
  onLoginClick?: () => void;
}

export default function Navbar({ onLoginClick }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight" data-testid="text-logo">
            BROKEN PSYCHOLOGY LAB
          </span>
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
