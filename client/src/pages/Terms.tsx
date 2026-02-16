import { Link } from 'wouter';
import ArchivistIcon from '@/components/ArchivistIcon';

const FONT_PLAYFAIR = "'Playfair Display', serif";
const FONT_BODY = "'Source Sans 3', sans-serif";
const FONT_MONO = "'JetBrains Mono', monospace";
const COLOR_BG = "#0A0A0A";
const COLOR_TEXT = "#F5F5F5";
const COLOR_MUTED = "#737373";
const COLOR_TEAL = "#14B8A6";
const COLOR_PINK = "#EC4899";

function SectionLabel({ children }: { children: string }) {
  return (
    <h2
      className="text-xs uppercase tracking-[0.2em] font-bold mt-12 mb-4"
      style={{ color: COLOR_TEAL, fontFamily: FONT_MONO }}
    >
      {children}
    </h2>
  );
}

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: COLOR_BG, fontFamily: FONT_BODY }}>
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm" style={{ background: "rgba(10,10,10,0.95)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-[800px] mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <ArchivistIcon size={36} />
            <span className="font-bold text-lg" style={{ color: COLOR_TEXT, fontFamily: FONT_PLAYFAIR }}>
              The Archivist Method
            </span>
          </a>
        </div>
      </nav>

      <main className="flex-1 pt-28 pb-20 px-6">
        <div className="max-w-[800px] mx-auto">
          <p
            className="text-[10px] uppercase tracking-[0.3em] mb-4"
            style={{ color: COLOR_MUTED, fontFamily: FONT_MONO }}
          >
            LEGAL
          </p>

          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: FONT_PLAYFAIR, color: COLOR_TEXT }}
          >
            Terms of Service
          </h1>

          <p className="text-sm mb-12" style={{ color: COLOR_MUTED }}>
            Last updated: February 15, 2026
          </p>

          <p className="text-base leading-relaxed" style={{ color: "#A3A3A3" }}>
            By using The Archivist Method&trade; (thearchivistmethod.com), you agree to the following terms.
          </p>

          <SectionLabel>WHAT THIS IS</SectionLabel>
          <div className="space-y-4 text-base leading-relaxed" style={{ color: "#A3A3A3" }}>
            <p>
              The Archivist Method is a pattern interruption education system. It provides behavioral pattern recognition training, self-directed exercises, and digital tools for personal development.
            </p>
            <p>
              This is not therapy. This is not medical advice. This is not a substitute for professional mental health treatment. If you are in crisis, contact a licensed professional or call 988 (Suicide &amp; Crisis Lifeline).
            </p>
          </div>

          <SectionLabel>YOUR ACCOUNT</SectionLabel>
          <p className="text-base leading-relaxed" style={{ color: "#A3A3A3" }}>
            You are responsible for maintaining the security of your account credentials. One account per person. Don't share your login or purchased materials with others.
          </p>

          <SectionLabel>PURCHASES &amp; REFUNDS</SectionLabel>
          <div className="space-y-4 text-base leading-relaxed" style={{ color: "#A3A3A3" }}>
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
                <span><strong style={{ color: COLOR_TEXT }}>The Field Guide ($47)</strong> — One-time purchase. Includes your pattern-specific field guide, body signature mapping, interrupt scripts, and AI access.</span>
              </li>
              <li className="flex items-start gap-3">
                <span style={{ color: COLOR_TEAL }} className="mt-1.5 text-xs">&#9642;</span>
                <span><strong style={{ color: COLOR_TEXT }}>The Complete Archive ($197)</strong> — One-time purchase. Includes all 9 patterns fully documented, all four doors, cross-pattern analysis, advanced protocols, and full Vault access.</span>
              </li>
            </ul>
            <p>
              Refund requests are handled on a case-by-case basis within 30 days of purchase. Contact us at{' '}
              <a href="mailto:support@thearchivistmethod.com" style={{ color: COLOR_TEAL }} className="underline">support@thearchivistmethod.com</a>.
            </p>
          </div>

          <SectionLabel>YOUR CONTENT</SectionLabel>
          <p className="text-base leading-relaxed" style={{ color: "#A3A3A3" }}>
            Anything you enter into the AI chat, brain dumps, or activation logs belongs to you. We don't sell your data. We don't share it. We don't use it for advertising.
          </p>

          <SectionLabel>INTELLECTUAL PROPERTY</SectionLabel>
          <p className="text-base leading-relaxed" style={{ color: "#A3A3A3" }}>
            The Archivist Method&trade;, all written content, the FEIR framework, the Four Doors Protocol, pattern descriptions, field guides, and the Complete Archive are protected intellectual property. You may not redistribute, resell, or republish any materials without written permission.
          </p>

          <SectionLabel>THE AI</SectionLabel>
          <p className="text-base leading-relaxed" style={{ color: "#A3A3A3" }}>
            The Archivist AI is a pattern recognition assistant. It is not a therapist. It does not provide medical, legal, or financial advice. Use your judgment. If something doesn't feel right, trust yourself over the AI.
          </p>

          <SectionLabel>LIABILITY</SectionLabel>
          <p className="text-base leading-relaxed" style={{ color: "#A3A3A3" }}>
            The Archivist Method is provided as-is. We make no guarantees about specific outcomes. Pattern interruption is a practice — results depend on your engagement with the method. We are not liable for decisions you make based on the content or tools provided.
          </p>

          <SectionLabel>CHANGES</SectionLabel>
          <p className="text-base leading-relaxed" style={{ color: "#A3A3A3" }}>
            We may update these terms. If we do, we'll update the date at the top. Continued use means you accept the updated terms.
          </p>

          <SectionLabel>CONTACT</SectionLabel>
          <p className="text-base leading-relaxed" style={{ color: "#A3A3A3" }}>
            Questions about these terms:{' '}
            <a href="mailto:support@thearchivistmethod.com" style={{ color: COLOR_TEAL }} className="underline">support@thearchivistmethod.com</a>
          </p>
        </div>
      </main>

      <footer className="py-16 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-[800px] mx-auto text-center space-y-4">
          <p className="text-sm leading-relaxed" style={{ color: COLOR_MUTED }}>
            Built in the fire. Years of observation. Systematized December 2025.
          </p>
          <p className="text-xs italic" style={{ color: "#525252" }}>
            — The Archivist
          </p>
          <div className="pt-6">
            <p className="text-xs" style={{ color: "#525252" }}>
              &copy; 2026 The Archivist Method&trade;. Pattern archaeology, <span style={{ color: COLOR_PINK }}>not</span> therapy.
            </p>
          </div>
          <div className="flex justify-center gap-6 pt-2">
            <Link href="/terms" className="text-xs transition-colors" style={{ color: "#525252" }}>Terms</Link>
            <Link href="/privacy" className="text-xs transition-colors" style={{ color: "#525252" }}>Privacy</Link>
            <Link href="/contact" className="text-xs transition-colors" style={{ color: "#525252" }}>Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
