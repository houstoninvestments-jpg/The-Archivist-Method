export default function Terms() {
  return (
    <div className="min-h-screen bg-archivist-dark text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-archivist-dark/95 backdrop-blur-sm border-b border-archivist-teal/20">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <img
              src="/archivist-icon.png"
              alt="The Archivist"
              className="w-10 h-10 rounded-full"
            />
            <span className="text-white font-bold text-lg md:text-xl">
              The Archivist Method™
            </span>
          </a>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold mb-8 text-archivist-teal">
            Terms of Service
          </h1>

          <div className="space-y-6 text-gray-300 leading-relaxed">
            <p className="text-sm text-gray-400">
              Last Updated: December 20, 2024
            </p>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing and using The Archivist Method™, you accept and
                agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">
                2. Use License
              </h2>
              <p>
                Permission is granted to temporarily access the materials
                (information or software) on The Archivist Method™ for
                personal, non-commercial transitory viewing only.
              </p>
              <p className="mt-2">
                This license shall automatically terminate if you violate any of
                these restrictions and may be terminated by The Archivist
                Method™ at any time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">
                3. Educational Purpose
              </h2>
              <p>
                The Archivist Method™ provides educational content about
                pattern recognition and behavioral change. This is not therapy,
                medical advice, or mental health treatment. Always consult with
                qualified professionals for medical or psychological concerns.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">
                4. Refund Policy
              </h2>
              <p>
                We offer a 90-day money-back guarantee on paid products. If
                you're not satisfied, contact us within 90 days of purchase for
                a full refund.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">
                5. Disclaimer
              </h2>
              <p>
                The materials on The Archivist Method™ are provided on an 'as
                is' basis. The Archivist Method™ makes no warranties, expressed
                or implied, and hereby disclaims and negates all other
                warranties including, without limitation, implied warranties or
                conditions of merchantability, fitness for a particular purpose,
                or non-infringement of intellectual property or other violation
                of rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">
                6. Limitations
              </h2>
              <p>
                In no event shall The Archivist Method™ or its suppliers be
                liable for any damages (including, without limitation, damages
                for loss of data or profit, or due to business interruption)
                arising out of the use or inability to use the materials on The
                Archivist Method™.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">7. Contact</h2>
              <p>
                Questions about the Terms of Service should be sent to us via
                the{" "}
                <a
                  href="/contact"
                  className="text-archivist-teal hover:underline"
                >
                  contact page
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
