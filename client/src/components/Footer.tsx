export default function Footer() {
  return (
    <footer className="border-t border-border py-12 px-4">
      <div className="container mx-auto max-w-5xl text-center space-y-4">
        <p className="text-lg font-bold" data-testid="text-footer-logo">
          BROKEN PSYCHOLOGY LAB
        </p>
        <p className="text-sm text-primary" data-testid="text-footer-tagline">
          Pattern Archaeology, Not Therapy
        </p>
        <p className="text-sm text-muted-foreground" data-testid="text-footer-copyright">
          Copyright 2024. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
