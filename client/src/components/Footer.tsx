import logoImage from "@assets/1764975447300-019af0bb-39c0-7323-97f9-1e4a0377aa15_(1)_1765023724795.jpg";

export default function Footer() {
  return (
    <footer className="border-t border-border py-12 px-4">
      <div className="container mx-auto max-w-5xl text-center space-y-4">
        <img 
          src={logoImage} 
          alt="Broken Psychology Lab" 
          className="h-12 w-auto mx-auto"
          data-testid="img-footer-logo"
        />
        <p className="text-sm text-muted-foreground" data-testid="text-footer-copyright">
          Copyright 2024. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
