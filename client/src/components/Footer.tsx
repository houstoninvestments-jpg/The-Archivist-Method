export default function Footer() {
  return (
    <footer className="bg-archivist-dark border-t border-gray-800 py-12 px-4">
      <div className="container mx-auto max-w-5xl text-center space-y-4">
        {/* Archivist Icon */}
        <div className="flex justify-center mb-6">
          <img
            src="/archivist-icon.png"
            alt="The Archivist"
            className="w-16 h-16 rounded-full"
          />
        </div>

        <p
          className="text-lg font-semibold text-white"
          data-testid="text-footer-title"
        >
          THE ARCHIVIST METHOD™
        </p>

        <p
          className="text-sm text-archivist-teal"
          data-testid="text-footer-tagline"
        >
          Pattern Archaeology, Not Therapy
        </p>

        <p
          className="text-sm text-gray-500"
          data-testid="text-footer-copyright"
        >
          Copyright 2024. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
