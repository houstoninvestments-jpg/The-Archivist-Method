import { Link } from 'wouter';

const FONT_BODY = "'Inter', sans-serif";
const FONT_MONO = "'JetBrains Mono', monospace";
const COLOR_BG = "#0a0a0a";
const COLOR_TEXT = "#FAFAFA";
const COLOR_MUTED = "#999999";
const COLOR_TEAL = "#14B8A6";
const COLOR_PINK = "#EC4899";
const BODY_COLOR = "rgba(250,250,250,0.7)";

const bodyParagraphStyle = {
  fontFamily: FONT_BODY,
  fontWeight: 400,
  fontSize: "0.95rem",
  lineHeight: 1.8,
  color: BODY_COLOR,
};

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
            Privacy Policy
          </h1>

          <p className="mb-12" style={{ ...bodyParagraphStyle, fontSize: "0.85rem", color: COLOR_MUTED }}>
            Last updated: April 16, 2026
          </p>

          <p style={bodyParagraphStyle}>
            The Archivist Method&trade; respects your privacy. This policy explains what we collect, why we collect it, and what we do with it. The short version: we collect what we need to run the system. We don't sell your data. We don't share it with advertisers. Your pattern work stays yours.
          </p>

          <SectionLabel>WHAT WE COLLECT</SectionLabel>
          <div className="space-y-4" style={bodyParagraphStyle}>
            <p>We collect information you provide directly:</p>
            <ul className="space-y-2 pl-1">
              <BulletItem title="Email address">Provided during the quiz or account creation. Used for authentication and communication.</BulletItem>
              <BulletItem title="Quiz responses">Your answers to the Pattern Identification Quiz. Used to determine your primary pattern and deliver personalized content.</BulletItem>
              <BulletItem title="Payment information">Processed securely by Stripe. We never see or store your full card number.</BulletItem>
              <BulletItem title="AI chat conversations">Your messages with the Pocket Archivist. Stored to maintain conversation context within your session.</BulletItem>
              <BulletItem title="Reading progress">Your position in the portal content. Stored to resume where you left off.</BulletItem>
              <BulletItem title="Pattern logs">Data you enter when logging an interrupt or tracking a pattern activation. Stored in your account.</BulletItem>
              <BulletItem title="Pattern identification data">Your primary pattern, secondary patterns, and pattern scores from the quiz. Used to personalize your portal content and Pocket Archivist responses.</BulletItem>
            </ul>
          </div>

          <SectionLabel>WHAT WE DON'T COLLECT</SectionLabel>
          <div className="space-y-4" style={bodyParagraphStyle}>
            <ul className="space-y-2 pl-1">
              <BulletItem>We don't track you across websites.</BulletItem>
              <BulletItem>We don't sell data to third parties.</BulletItem>
              <BulletItem>We don't use your content for advertising.</BulletItem>
              <BulletItem>We don't share your pattern data with anyone.</BulletItem>
              <BulletItem>We don't use your AI conversations to train models.</BulletItem>
            </ul>
          </div>

          <SectionLabel>HOW WE USE YOUR DATA</SectionLabel>
          <div className="space-y-4" style={bodyParagraphStyle}>
            <ul className="space-y-2 pl-1">
              <BulletItem title="Authentication">To verify your identity and grant access to purchased content.</BulletItem>
              <BulletItem title="Content delivery">To show you pattern-specific material based on your quiz results and purchases.</BulletItem>
              <BulletItem title="AI responses">To provide contextually relevant pattern recognition guidance within your chat sessions.</BulletItem>
              <BulletItem title="Progress tracking">To save your reading position and completed sections.</BulletItem>
              <BulletItem title="Transactional emails">To send purchase confirmations and account-related notices. No marketing spam.</BulletItem>
            </ul>
          </div>

          <SectionLabel>COOKIES</SectionLabel>
          <div className="space-y-4" style={bodyParagraphStyle}>
            <p>
              We use authentication cookies to keep you logged in. That's it. No tracking cookies. No advertising pixels. No third-party analytics cookies.
            </p>
            <ul className="space-y-2 pl-1">
              <BulletItem title="auth_token">Authentication cookie that verifies your portal access. Expires after 7 days.</BulletItem>
              <BulletItem title="quiz_auth_token">Stored in localStorage after quiz completion to enable portal access.</BulletItem>
            </ul>
          </div>

          <SectionLabel>THIRD-PARTY SERVICES</SectionLabel>
          <div className="space-y-4" style={bodyParagraphStyle}>
            <ul className="space-y-2 pl-1">
              <BulletItem title="Stripe">Handles payment processing. They have their own privacy policy. We never store your card details.</BulletItem>
              <BulletItem title="Anthropic (Claude)">Powers the Pocket Archivist. Conversations are sent to their API for response generation. Subject to Anthropic's data handling policies.</BulletItem>
              <BulletItem title="Resend">Handles email delivery for magic link authentication and transactional emails. Subject to Resend's privacy policy.</BulletItem>
              <BulletItem title="Supabase">Database hosting. Your data is stored on Supabase's infrastructure. Subject to Supabase's privacy policy.</BulletItem>
              <BulletItem title="Vercel">Hosts the website. Subject to Vercel's privacy policy.</BulletItem>
            </ul>
            <p>
              We do not use Google Analytics, Facebook Pixel, or any advertising/tracking services.
            </p>
          </div>

          <SectionLabel>DATA STORAGE &amp; SECURITY</SectionLabel>
          <div className="space-y-4" style={bodyParagraphStyle}>
            <p>
              Your data is stored in a PostgreSQL database. Connections are encrypted. Passwords are hashed. We take reasonable measures to protect your information, but no system is perfectly secure.
            </p>
          </div>

          <SectionLabel>YOUR RIGHTS</SectionLabel>
          <div className="space-y-4" style={bodyParagraphStyle}>
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
          <p style={bodyParagraphStyle}>
            The Archivist Method is not intended for anyone under 18. We do not knowingly collect information from minors.
          </p>

          <SectionLabel>CHANGES</SectionLabel>
          <p style={bodyParagraphStyle}>
            We may update this policy. If we do, we'll update the date at the top. Continued use means you accept the updated policy.
          </p>

          <SectionLabel>CONTACT</SectionLabel>
          <p style={bodyParagraphStyle}>
            Questions about your privacy:{' '}
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
