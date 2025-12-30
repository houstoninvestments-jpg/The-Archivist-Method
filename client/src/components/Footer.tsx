export default function Footer() {
  return (
    <footer className="bg-archivist-dark border-t border-gray-800 py-12 px-4">
      <div className="container mx-auto max-w-5xl text-center space-y-6">
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

        {/* Footer Links */}
        <div className="flex justify-center gap-6 text-sm">
          <a
            href="/terms"
            className="text-gray-400 hover:text-archivist-teal transition-colors"
          >
            Terms of Service
          </a>
          <a
            href="/privacy"
            className="text-gray-400 hover:text-archivist-teal transition-colors"
          >
            Privacy Policy
          </a>
          <a
            href="/contact"
            className="text-gray-400 hover:text-archivist-teal transition-colors"
          >
            Contact
          </a>
        </div>

        <p
          className="text-sm text-gray-500"
          data-testid="text-footer-copyright"
        >
          Copyright 2024. All rights reserved.
        </p>
        <p className="text-xs text-gray-500 mt-6 max-w-3xl mx-auto">
          Medical Disclaimer: The Archivist Method provides educational
          information about behavioral pattern recognition. This is not therapy,
          counseling, or medical advice. Always consult qualified healthcare
          professionals for medical or mental health concerns.
        </p>
      </div>
    </footer>
  );
}
