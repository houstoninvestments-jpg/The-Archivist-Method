export default function Privacy() {
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
            Privacy Policy
          </h1>

          <div className="space-y-6 text-gray-300 leading-relaxed">
            <p className="text-sm text-gray-400">
              Last Updated: December 20, 2024
            </p>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">
                1. Information We Collect
              </h2>
              <p>
                We collect information you provide directly to us when you
                create an account, make a purchase, or contact us. This may
                include:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                <li>Name and email address</li>
                <li>Payment information (processed securely by Stripe)</li>
                <li>Communication preferences</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">
                2. How We Use Your Information
              </h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send you technical notices and support messages</li>
                <li>Respond to your comments and questions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">
                3. Information Sharing
              </h2>
              <p>
                We do not sell, trade, or rent your personal information to
                third parties. We may share your information only in the
                following circumstances:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                <li>With your consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and safety</li>
                <li>
                  With service providers who assist in our operations (e.g.,
                  payment processing)
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">
                4. Data Security
              </h2>
              <p>
                We take reasonable measures to help protect your personal
                information from loss, theft, misuse, and unauthorized access.
                However, no internet transmission is ever fully secure or
                error-free.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">5. Cookies</h2>
              <p>
                We use cookies and similar tracking technologies to track
                activity on our service and hold certain information. You can
                instruct your browser to refuse all cookies or to indicate when
                a cookie is being sent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">
                6. Your Rights
              </h2>
              <p>You have the right to:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Opt-out of marketing communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">
                7. Contact Us
              </h2>
              <p>
                If you have questions about this Privacy Policy, please contact
                us via the{" "}
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
