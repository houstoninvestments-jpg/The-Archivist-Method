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

function BulletItem({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span style={{ color: COLOR_TEAL }} className="mt-1.5 text-xs">&#9642;</span>
      <span>
        {title && <strong style={{ color: COLOR_TEXT }}>{title}</strong>}
        {title && " — "}
        {children}
      </span>
    </li>
  );
}

export default function Privacy() {
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
            Privacy Policy
          </h1>

          <p className="text-sm mb-12" style={{ color: COLOR_MUTED }}>
            Last updated: February 15, 2026
          </p>

          <p className="text-base leading-relaxed" style={{ color: "#A3A3A3" }}>
            The Archivist Method&trade; respects your privacy. This policy explains what we collect, why we collect it, and what we do with it. The short version: we collect what we need to run the system. We don't sell your data. We don't share it with advertisers. Your pattern work stays yours.
          </p>

          <SectionLabel>WHAT WE COLLECT</SectionLabel>
          <div className="space-y-4 text-base leading-relaxed" style={{ color: "#A3A3A3" }}>
            <p>We collect information you provide directly:</p>
            <ul className="space-y-2 pl-1">
              <BulletItem title="Email address">Provided during the quiz or account creation. Used for authentication and communication.</BulletItem>
              <BulletItem title="Quiz responses">Your answers to the Pattern Identification Quiz. Used to determine your primary pattern and deliver personalized content.</BulletItem>
              <BulletItem title="Payment information">Processed securely by Stripe. We never see or store your full card number.</BulletItem>
              <BulletItem title="AI chat conversations">Your messages with The Archivist AI. Stored to maintain conversation context within your session.</BulletItem>
              <BulletItem title="Notes and highlights">Content you save in the reader. Stored in your account for your reference.</BulletItem>
              <BulletItem title="Activation logs">Data you enter in the Vault Workbench. Stored in your account for pattern tracking.</BulletItem>
            </ul>
          </div>

          <SectionLabel>WHAT WE DON'T COLLECT</SectionLabel>
          <div className="space-y-4 text-base leading-relaxed" style={{ color: "#A3A3A3" }}>
            <ul className="space-y-2 pl-1">
              <BulletItem>We don't track you across websites.</BulletItem>
              <BulletItem>We don't sell data to third parties.</BulletItem>
              <BulletItem>We don't use your content for advertising.</BulletItem>
              <BulletItem>We don't share your pattern data with anyone.</BulletItem>
              <BulletItem>We don't use your AI conversations to train models.</BulletItem>
            </ul>
          </div>

          <SectionLabel>HOW WE USE YOUR DATA</SectionLabel>
          <div className="space-y-4 text-base leading-relaxed" style={{ color: "#A3A3A3" }}>
            <ul className="space-y-2 pl-1">
              <BulletItem title="Authentication">To verify your identity and grant access to purchased content.</BulletItem>
              <BulletItem title="Content delivery">To show you pattern-specific material based on your quiz results and purchases.</BulletItem>
              <BulletItem title="AI responses">To provide contextually relevant pattern recognition guidance within your chat sessions.</BulletItem>
              <BulletItem title="Progress tracking">To save your reading position, completed sections, and streak data.</BulletItem>
              <BulletItem title="Transactional emails">To send purchase confirmations and account-related notices. No marketing spam.</BulletItem>
            </ul>
          </div>

          <SectionLabel>COOKIES</SectionLabel>
          <div className="space-y-4 text-base leading-relaxed" style={{ color: "#A3A3A3" }}>
            <p>
              We use authentication cookies to keep you logged in. That's it. No tracking cookies. No advertising pixels. No third-party analytics cookies.
            </p>
            <ul className="space-y-2 pl-1">
              <BulletItem title="auth_token / quiz_token">Session cookies that authenticate your access to the portal. Expire when you close your browser or after a set period.</BulletItem>
            </ul>
          </div>

          <SectionLabel>THIRD-PARTY SERVICES</SectionLabel>
          <div className="space-y-4 text-base leading-relaxed" style={{ color: "#A3A3A3" }}>
            <ul className="space-y-2 pl-1">
              <BulletItem title="Stripe">Handles payment processing. They have their own privacy policy. We never store your card details.</BulletItem>
              <BulletItem title="Anthropic (Claude)">Powers The Archivist AI. Conversations are sent to their API for response generation. Subject to Anthropic's data handling policies.</BulletItem>
            </ul>
            <p>
              We do not use Google Analytics, Facebook Pixel, or any advertising/tracking services.
            </p>
          </div>

          <SectionLabel>DATA STORAGE &amp; SECURITY</SectionLabel>
          <div className="space-y-4 text-base leading-relaxed" style={{ color: "#A3A3A3" }}>
            <p>
              Your data is stored in a PostgreSQL database. Connections are encrypted. Passwords are hashed. We take reasonable measures to protect your information, but no system is perfectly secure.
            </p>
          </div>

          <SectionLabel>YOUR RIGHTS</SectionLabel>
          <div className="space-y-4 text-base leading-relaxed" style={{ color: "#A3A3A3" }}>
            <p>You can:</p>
            <ul className="space-y-2 pl-1">
              <BulletItem>Request a copy of your data.</BulletItem>
              <BulletItem>Request deletion of your account and all associated data.</BulletItem>
              <BulletItem>Correct inaccurate information.</BulletItem>
              <BulletItem>Opt out of any non-essential communications.</BulletItem>
            </ul>
            <p>
              Email{' '}
              <a href="mailto:support@thearchivistmethod.com" style={{ color: COLOR_TEAL }} className="underline">support@thearchivistmethod.com</a>
              {' '}for any of the above.
            </p>
          </div>

          <SectionLabel>CHILDREN</SectionLabel>
          <p className="text-base leading-relaxed" style={{ color: "#A3A3A3" }}>
            The Archivist Method is not intended for anyone under 18. We do not knowingly collect information from minors.
          </p>

          <SectionLabel>CHANGES</SectionLabel>
          <p className="text-base leading-relaxed" style={{ color: "#A3A3A3" }}>
            We may update this policy. If we do, we'll update the date at the top. Continued use means you accept the updated policy.
          </p>

          <SectionLabel>CONTACT</SectionLabel>
          <p className="text-base leading-relaxed" style={{ color: "#A3A3A3" }}>
            Questions about your privacy:{' '}
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
