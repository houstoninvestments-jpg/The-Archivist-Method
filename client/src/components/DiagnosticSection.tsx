interface DiagnosticSectionProps {
  onOpenChat: () => void;
}

export default function DiagnosticSection({
  onOpenChat,
}: DiagnosticSectionProps) {
  return (
    <section className="relative py-24 px-4 bg-archivist-charcoal">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Headline */}
        <h2 className="text-4xl md:text-5xl font-bold">
          Not Sure Which Pattern You're Running?
        </h2>

        {/* Subheadline */}
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          The Archivist can identify it in 2 minutes.
        </p>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 py-8">
          <div className="space-y-2">
            <div className="text-archivist-teal text-3xl font-bold">01</div>
            <h3 className="font-bold">Tell The Archivist</h3>
            <p className="text-gray-400 text-sm">
              Describe what's happening in your life
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-archivist-teal text-3xl font-bold">02</div>
            <h3 className="font-bold">Get Your Diagnosis</h3>
            <p className="text-gray-400 text-sm">
              AI identifies which of the 7 patterns you're running
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-archivist-teal text-3xl font-bold">03</div>
            <h3 className="font-bold">Receive Your Course</h3>
            <p className="text-gray-400 text-sm">
              Get a personalized 7-day plan to interrupt YOUR pattern
            </p>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={onOpenChat}
          className="px-10 py-5 bg-gradient-to-r from-archivist-teal to-archivist-pink text-black text-lg font-bold rounded-xl hover:opacity-90 transition-all transform hover:scale-105"
        >
          Start Pattern Diagnosis
        </button>

        {/* Social Proof Placeholder */}
        <p className="text-gray-500 text-sm">
          Join 1,247 people who discovered their pattern this month
        </p>
      </div>
    </section>
  );
}
