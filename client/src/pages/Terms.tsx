import { Link } from 'wouter';

const FONT_BODY = "'Inter', sans-serif";
const FONT_MONO = "'JetBrains Mono', monospace";
const COLOR_BG = "#0a0a0a";
const COLOR_TEXT = "#FAFAFA";
const COLOR_MUTED = "#999999";
const COLOR_TEAL = "#14B8A6";
const COLOR_PINK = "#EC4899";
const BODY_COLOR = "rgba(250,250,250,0.7)";

function SectionLabel({ children }: { children: string }) {
  return (
    <h2
      className="mt-12 mb-4"
      style={{
        color: COLOR_TEAL,
        fontFamily: FONT_BODY,
        fontWeight: 700,
        fontSize: "1rem",
        letterSpacing: "-0.01em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </h2>
  );
}

const bodyParagraphStyle = {
  fontFamily: FONT_BODY,
  fontWeight: 400,
  fontSize: "0.95rem",
  lineHeight: 1.8,
  color: BODY_COLOR,
};

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: COLOR_BG, fontFamily: FONT_BODY }}>
      <main className="flex-1 pt-28 pb-20 px-6">
        <div className="max-w-[800px] mx-auto">
          <p
            className="mb-4"
            style={{ color: COLOR_MUTED, fontFamily: FONT_MONO, fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase" }}
          >
            LEGAL
          </p>

          <h1
            className="mb-4"
            style={{
              fontFamily: FONT_BODY,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              textTransform: "uppercase",
              fontSize: "clamp(2rem, 5vw, 3.25rem)",
              color: COLOR_TEXT,
              lineHeight: 1.05,
            }}
          >
            Terms of Service
          </h1>

          <p className="mb-12" style={{ ...bodyParagraphStyle, fontSize: "0.85rem", color: COLOR_MUTED }}>
            Last updated: February 15, 2026
          </p>

          <p style={bodyParagraphStyle}>
            By using The Archivist Method&trade; (thearchivistmethod.com), you agree to the following terms.
          </p>

          <SectionLabel>WHAT THIS IS</SectionLabel>
          <div className="space-y-4" style={bodyParagraphStyle}>
            <p>
              The Archivist Method is a pattern interruption education system. It provides behavioral pattern recognition training, self-directed exercises, and digital tools for personal development.
            </p>
            <p>
              The Archivist Method isn't therapy — and that's the point. Therapy processes your past. This excavates the patterns running your present. It's built for people who already understand themselves and still can't stop. If you're in crisis or need clinical support, we'll always point you there first.
            </p>
          </div>

          <SectionLabel>YOUR ACCOUNT</SectionLabel>
          <p style={bodyParagraphStyle}>
            You are responsible for maintaining the security of your account credentials. One account per person. Don't share your login or purchased materials with others.
          </p>

          <SectionLabel>PURCHASES &amp; REFUNDS</SectionLabel>
          <div className="space-y-4" style={bodyParagraphStyle}>
            <p>
              All purchases are one-time payments. No subscriptions. No recurring charges.
            </p>
            <ul className="space-y-2 pl-1">
              <li className="flex items-start gap-3">
                <span style={{ color: COLOR_TEAL }} className="mt-1.5 text-xs">&#9642;</span>
                <span><strong style={{ color: COLOR_TEXT }}>The Crash Course ($0)</strong> — Free forever. No payment required.</span>
              </li>
              <li className="flex items-start gap-3">
                <span style={{ color: COLOR_TEAL }} className="mt-1.5 text-xs">&#9642;</span>
                <span><strong style={{ color: COLOR_TEXT }}>The Field Guide ($67)</strong> — One-time purchase. Includes your pattern-specific field guide, body signature mapping, interrupt scripts, and AI access.</span>
              </li>
              <li className="flex items-start gap-3">
                <span style={{ color: COLOR_TEAL }} className="mt-1.5 text-xs">&#9642;</span>
                <span><strong style={{ color: COLOR_TEXT }}>The Complete Archive ($297)</strong> — One-time purchase. Includes all 9 patterns fully documented, all four doors, cross-pattern analysis, advanced protocols, and full Vault access.</span>
              </li>
            </ul>
            <p>
              Refund requests are handled on a case-by-case basis within 30 days of purchase. Contact us at{' '}
              <a href="mailto:support@thearchivistmethod.com" style={{ color: COLOR_TEAL }} className="underline">support@thearchivistmethod.com</a>.
            </p>
          </div>

          <SectionLabel>YOUR CONTENT</SectionLabel>
          <p style={bodyParagraphStyle}>
            Anything you enter into the AI chat, brain dumps, or activation logs belongs to you. We don't sell your data. We don't share it. We don't use it for advertising.
          </p>

          <SectionLabel>INTELLECTUAL PROPERTY</SectionLabel>
          <p style={bodyParagraphStyle}>
            The Archivist Method&trade;, all written content, the FEIR framework, the Four Doors Protocol, pattern descriptions, field guides, and the Complete Archive are protected intellectual property. You may not redistribute, resell, or republish any materials without written permission.
          </p>

          <SectionLabel>THE AI</SectionLabel>
          <p style={bodyParagraphStyle}>
            The Archivist AI is a pattern recognition assistant. It is not a therapist. It does not provide medical, legal, or financial advice. Use your judgment. If something doesn't feel right, trust yourself over the AI.
          </p>

          <SectionLabel>LIABILITY</SectionLabel>
          <p style={bodyParagraphStyle}>
            The Archivist Method is provided as-is. We make no guarantees about specific outcomes. Pattern interruption is a practice — results depend on your engagement with the method. We are not liable for decisions you make based on the content or tools provided.
          </p>

          <SectionLabel>CHANGES</SectionLabel>
          <p style={bodyParagraphStyle}>
            We may update these terms. If we do, we'll update the date at the top. Continued use means you accept the updated terms.
          </p>

          <SectionLabel>CONTACT</SectionLabel>
          <p style={bodyParagraphStyle}>
            Questions about these terms:{' '}
            <a href="mailto:support@thearchivistmethod.com" style={{ color: COLOR_TEAL }} className="underline">support@thearchivistmethod.com</a>
          </p>
        </div>
      </main>

      <footer className="py-16 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-[800px] mx-auto text-center space-y-4">
          <p style={{ ...bodyParagraphStyle, fontSize: "0.85rem", color: COLOR_MUTED }}>
            Built in the fire. Years of observation. Systematized December 2025.
          </p>
          <p style={{ fontFamily: "'DM Serif Display', serif", fontStyle: "italic", fontSize: "0.85rem", color: "#525252" }}>
            — The Archivist
          </p>
          <div className="pt-6">
            <p className="text-xs" style={{ color: "#525252", fontFamily: FONT_BODY }}>
              &copy; 2026 The Archivist Method&trade;. Pattern archaeology, <span style={{ color: COLOR_PINK }}>not</span> therapy.
            </p>
          </div>
          <div className="flex justify-center gap-6 pt-2">
            <Link href="/terms" className="text-xs transition-colors" style={{ color: "#525252", fontFamily: FONT_BODY }}>Terms</Link>
            <Link href="/privacy" className="text-xs transition-colors" style={{ color: "#525252", fontFamily: FONT_BODY }}>Privacy</Link>
            <Link href="/contact" className="text-xs transition-colors" style={{ color: "#525252", fontFamily: FONT_BODY }}>Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
