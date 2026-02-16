import { useState } from 'react';
import { Link } from 'wouter';
import { Mail, Send, ArrowRight } from 'lucide-react';
import ArchivistIcon from '@/components/ArchivistIcon';

const FONT_PLAYFAIR = "'Playfair Display', serif";
const FONT_BODY = "'Source Sans 3', sans-serif";
const FONT_MONO = "'JetBrains Mono', monospace";
const COLOR_BG = "#0A0A0A";
const COLOR_TEXT = "#F5F5F5";
const COLOR_MUTED = "#737373";
const COLOR_TEAL = "#14B8A6";
const COLOR_PINK = "#EC4899";
const CARD_BG = "rgba(255,255,255,0.03)";
const CARD_BORDER = "rgba(255,255,255,0.06)";

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Contact from ${name || 'a visitor'}`);
    const body = encodeURIComponent(`From: ${name}\nEmail: ${email}\n\n${message}`);
    window.open(`mailto:support@thearchivistmethod.com?subject=${subject}&body=${body}`, '_self');
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

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
            className="text-xs tracking-[0.3em] uppercase mb-4"
            style={{ color: COLOR_MUTED, fontFamily: FONT_MONO }}
          >
            GET IN TOUCH
          </p>
          <h1
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ fontFamily: FONT_PLAYFAIR, color: COLOR_TEXT }}
            data-testid="text-contact-headline"
          >
            Contact
          </h1>
          <p className="text-base leading-relaxed mb-12" style={{ color: "#A3A3A3" }}>
            Questions about your pattern, your access tier, or how the method works? Reach out directly.
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label
                className="block text-xs uppercase tracking-[0.15em] font-bold mb-3"
                style={{ color: COLOR_TEAL, fontFamily: FONT_MONO }}
              >
                YOUR NAME
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 rounded-md text-sm focus:outline-none transition-colors"
                style={{
                  background: CARD_BG,
                  border: `1px solid ${CARD_BORDER}`,
                  color: COLOR_TEXT,
                  fontFamily: FONT_BODY,
                }}
                data-testid="input-contact-name"
              />
            </div>

            <div>
              <label
                className="block text-xs uppercase tracking-[0.15em] font-bold mb-3"
                style={{ color: COLOR_TEAL, fontFamily: FONT_MONO }}
              >
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 rounded-md text-sm focus:outline-none transition-colors"
                style={{
                  background: CARD_BG,
                  border: `1px solid ${CARD_BORDER}`,
                  color: COLOR_TEXT,
                  fontFamily: FONT_BODY,
                }}
                data-testid="input-contact-email"
              />
            </div>

            <div>
              <label
                className="block text-xs uppercase tracking-[0.15em] font-bold mb-3"
                style={{ color: COLOR_TEAL, fontFamily: FONT_MONO }}
              >
                MESSAGE
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we help?"
                required
                rows={6}
                className="w-full px-4 py-3 rounded-md text-sm focus:outline-none transition-colors resize-none"
                style={{
                  background: CARD_BG,
                  border: `1px solid ${CARD_BORDER}`,
                  color: COLOR_TEXT,
                  fontFamily: FONT_BODY,
                }}
                data-testid="input-contact-message"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-medium tracking-wider uppercase transition-all cursor-pointer"
              style={{
                background: COLOR_TEAL,
                color: COLOR_BG,
                fontFamily: FONT_MONO,
              }}
              data-testid="button-contact-submit"
            >
              <Send className="w-4 h-4" /> SEND MESSAGE
            </button>

            {sent && (
              <p className="text-sm" style={{ color: COLOR_TEAL, fontFamily: FONT_MONO }}>
                Opening your email client...
              </p>
            )}
          </form>

          <div className="mt-16 pt-8" style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
            <p
              className="text-xs uppercase tracking-[0.15em] font-bold mb-3"
              style={{ color: COLOR_TEAL, fontFamily: FONT_MONO }}
            >
              DIRECT EMAIL
            </p>
            <a
              href="mailto:support@thearchivistmethod.com"
              className="inline-flex items-center gap-2 text-sm transition-colors"
              style={{ color: "#A3A3A3", fontFamily: FONT_BODY }}
              data-testid="link-contact-email"
            >
              <Mail className="w-4 h-4" style={{ color: COLOR_TEAL }} />
              support@thearchivistmethod.com
              <ArrowRight className="w-3 h-3" style={{ color: COLOR_MUTED }} />
            </a>
          </div>
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
