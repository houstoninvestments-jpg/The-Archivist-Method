import logoImage from "@assets/1764975447300-019af0bb-39c0-7323-97f9-1e4a0377aa15__1_-removeb_1765023942955.png";

export default function Footer() {
  return (
    <footer className="bg-archivist-dark border-t border-gray-800 py-12 px-4">
      <div className="container mx-auto max-w-5xl text-center space-y-4">
        <img 
          src={logoImage} 
          alt="The Archivist Method" 
          className="h-20 sm:h-24 md:h-28 w-auto max-w-[300px] sm:max-w-[400px] md:max-w-none mx-auto object-contain"
          data-testid="img-footer-logo"
        />
        <p className="text-lg font-semibold text-white" data-testid="text-footer-title">
          THE ARCHIVIST METHOD™ | BROKEN PSYCHOLOGY LAB
        </p>
        <p className="text-sm text-archivist-teal" data-testid="text-footer-tagline">
          Pattern Archaeology, Not Therapy
        </p>
        <p className="text-sm text-gray-500" data-testid="text-footer-copyright">
          Copyright 2024. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
