import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Menu, ChevronRight, Lock } from "lucide-react";
import { Sidebar, TocGroup } from "./portal/Sidebar";
import { Markdown } from "./portal/markdown";
import { feirForSection, FEIR_COLORS, FeirDoor } from "./portal/feir";
import { getPatternDetail } from "./portal/patterns";
import { PresenceCard, ChatPanel, InterruptButton, InterruptScreen } from "./portal/Archivist";

interface TocResponse {
  tier: "free" | "quick-start" | "archive";
  primaryPattern: string | null;
  groups: TocGroup[];
  firstSectionId: string;
  stats?: { completedSections: number; totalSections: number; percentComplete: number };
  progress?: Record<string, { completed: boolean; lastPosition: number }>;
}

interface SectionResponse {
  sectionId: string;
  title: string;
  content: string;
  readMinutes: number;
  locked: boolean;
  prev: string | null;
  next: string | null;
}

const moduleNumberForSection = (id: string): string => {
  const m = id.match(/^m(\d+)-/);
  if (m) return m[1].padStart(2, "0");
  const p = id.match(/^p(\d+)-/);
  if (p) return `03`;
  if (id.startsWith("ep-")) return "EP";
  return "00";
};

const moduleTitleForGroup = (groups: TocGroup[], sectionId: string): string => {
  for (const g of groups) {
    if (g.sections.some((s) => s.id === sectionId)) return g.title.toUpperCase();
  }
  return "";
};

function Breadcrumb({ sectionId, groups }: { sectionId: string | null; groups: TocGroup[] }) {
  if (!sectionId) return null;
  const num = moduleNumberForSection(sectionId);
  const title = moduleTitleForGroup(groups, sectionId);
  return (
    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.22em", color: "#8A857D", fontWeight: 500 }}>
      {num} <span style={{ color: "#3A3530", margin: "0 8px" }}>//</span>
      <span style={{ color: "#C8C0B2" }}>{title}</span>
    </div>
  );
}

function FeirPill({ door }: { door: FeirDoor }) {
  const c = FEIR_COLORS[door];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "5px 10px",
        border: `1px solid ${c.accent}66`,
        borderRadius: 999,
        background: `${c.accent}10`,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 9,
        letterSpacing: "0.2em",
        color: c.accent,
        fontWeight: 500,
        textTransform: "uppercase",
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.accent, boxShadow: `0 0 8px ${c.accent}` }} />
      {door} // {c.name}
    </span>
  );
}

function ContentSkeleton() {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 32px" }}>
      <div style={{ height: 44, width: "70%", background: "#121418", borderRadius: 4, marginBottom: 28 }} />
      <div style={{ height: 14, width: "100%", background: "#121418", borderRadius: 4, marginBottom: 10 }} />
      <div style={{ height: 14, width: "95%", background: "#121418", borderRadius: 4, marginBottom: 10 }} />
      <div style={{ height: 14, width: "88%", background: "#121418", borderRadius: 4, marginBottom: 28 }} />
      <div style={{ height: 14, width: "100%", background: "#121418", borderRadius: 4, marginBottom: 10 }} />
      <div style={{ height: 14, width: "92%", background: "#121418", borderRadius: 4, marginBottom: 10 }} />
      <div style={{ height: 14, width: "60%", background: "#121418", borderRadius: 4, marginBottom: 28 }} />
    </div>
  );
}

function LockOverlay() {
  return (
    <div style={{ maxWidth: 620, margin: "64px auto 0", padding: "48px 32px", textAlign: "center" }}>
      <Lock size={28} color="#D4A574" strokeWidth={1.5} style={{ marginBottom: 20, opacity: 0.7 }} />
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.26em", color: "#D4A574", marginBottom: 16, fontWeight: 500 }}>
        // LOCKED SECTION
      </div>
      <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, letterSpacing: "0.04em", color: "#F0EDE8", marginBottom: 14 }}>
        THIS IS IN THE FIELD GUIDE.
      </h2>
      <p style={{ fontFamily: "'EB Garamond', serif", fontStyle: "italic", fontSize: 16, color: "#9A958D", lineHeight: 1.6, marginBottom: 28 }}>
        The full pattern archaeology, the 90-day protocol, and every chapter — open when you unlock your tier.
      </p>
      <a
        href="/checkout?product=quickstart"
        style={{
          display: "inline-block",
          padding: "14px 24px",
          border: "1px solid #00FFC2",
          color: "#00FFC2",
          textDecoration: "none",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          letterSpacing: "0.22em",
          fontWeight: 500,
          textTransform: "uppercase",
          borderRadius: 4,
        }}
      >
        Unlock Field Guide
      </a>
    </div>
  );
}

function NextChapterCard({ nextId, groups, onSelect }: { nextId: string; groups: TocGroup[]; onSelect: (id: string) => void }) {
  let title = "Next";
  for (const g of groups) {
    const s = g.sections.find((s) => s.id === nextId);
    if (s) { title = s.title; break; }
  }
  return (
    <button
      type="button"
      onClick={() => onSelect(nextId)}
      style={{
        width: "100%",
        maxWidth: 720,
        margin: "56px auto 80px",
        padding: "22px 26px",
        background: "rgba(212,165,116,0.04)",
        border: "1px solid rgba(212,165,116,0.2)",
        borderRadius: 6,
        color: "#E8E3DC",
        textAlign: "left",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 20,
        fontFamily: "inherit",
        transition: "border-color 0.2s, background 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(212,165,116,0.5)";
        e.currentTarget.style.background = "rgba(212,165,116,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(212,165,116,0.2)";
        e.currentTarget.style.background = "rgba(212,165,116,0.04)";
      }}
    >
      <span style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "0.24em", color: "#D4A574", fontWeight: 500 }}>
          // NEXT CHAPTER
        </span>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: "0.04em", color: "#F0EDE8" }}>
          {title}
        </span>
      </span>
      <ChevronRight size={20} color="#D4A574" />
    </button>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// TEMP DEV BYPASS — remove before launch.
// If the URL has ?dev=true we skip the auth check and load mocked TOC + section
// content so the reader UI can be previewed without real portal credentials.
// ────────────────────────────────────────────────────────────────────────────
const DEV_MOCK_MARKDOWN = `# PREVIEW: PATTERN RECOGNITION

This section is mock content served by the dev bypass. The real content loads from the content API once auth is restored.

---

## WHAT TO NOTICE FIRST

Something triggered you. A word. A tone. A silence. A look on someone's face. Something that matched a file in your archive.

Your body responded before your brain caught up. Chest tightened. Stomach dropped. Heat rose. Throat closed. Something physical happened in under three seconds.

### THE THREE-SECOND WINDOW

Then a thought fired. Automatic. Fast. Familiar.

- "Here we go again."
- "I knew this would happen."
- "I have to get out."

Then you did the thing. The pattern ran. Start to finish. Three seconds to three minutes. Automatic.

💎 GOLD NUGGET
═══════════════════════════════════════════════
The pattern ran. You noticed. That is not failure.
That is the beginning of the end of automatic.
═══════════════════════════════════════════════

⚡ QUICK WIN
═══════════════════════════════════════════════
Place your hand where the sensation is. Name it out loud. "A pattern just ran." You have already interrupted the next one.
═══════════════════════════════════════════════

🔌 CIRCUIT BREAK
═══════════════════════════════════════════════
When you feel the pull to vanish, name it: "The pattern is running."
Stay 5 more minutes. That is the interrupt.
═══════════════════════════════════════════════

> You are not broken. You are running a program that installed itself a long time ago.

That's enough for right now.
`;

function isDevMode(): boolean {
  try {
    if (new URLSearchParams(window.location.search).get("dev") === "true") return true;
    // DEVELOPER ACCESS button on /portal/login sets this flag. When present,
    // we skip every /api/portal call and render the portal from mocked data,
    // so the owner can always reach /portal even with the API or DB offline.
    if (typeof localStorage !== "undefined" && localStorage.getItem("dev_bypass") === "true") return true;
  } catch {
    /* ignore */
  }
  return false;
}

function buildDevMockToc(): TocResponse {
  return {
    tier: "archive",
    primaryPattern: "disappearing",
    firstSectionId: "m0-0.1",
    stats: { completedSections: 0, totalSections: 4, percentComplete: 0 },
    progress: {},
    groups: [
      {
        id: "emergency",
        title: "Emergency Protocol",
        sections: [
          { id: "m0-0.1", title: "You Just Ran Your Pattern", locked: false },
          { id: "m0-0.2", title: "Five-Minute Emergency", locked: false },
        ],
      },
      {
        id: "four-doors",
        title: "The Four Doors",
        sections: [
          { id: "m2-2.3", title: "Door 2: Excavation", locked: false },
        ],
      },
      {
        id: "implementation",
        title: "90-Day Implementation",
        sections: [
          { id: "m4-4.4", title: "Weeks 5-8: Interruption", locked: false },
        ],
      },
    ],
  };
}

function buildDevMockSection(sectionId: string): SectionResponse {
  const ids = ["m0-0.1", "m0-0.2", "m2-2.3", "m4-4.4"];
  const idx = ids.indexOf(sectionId);
  return {
    sectionId,
    title: "Preview Section",
    content: DEV_MOCK_MARKDOWN,
    readMinutes: 3,
    locked: false,
    prev: idx > 0 ? ids[idx - 1] : null,
    next: idx >= 0 && idx < ids.length - 1 ? ids[idx + 1] : null,
  };
}
// ── END TEMP DEV BYPASS ─────────────────────────────────────────────────────

// /portal/dev route: NO auth, NO database, NO JWT. Hits the public
// /api/portal/dev/reader/* endpoints which read real markdown straight from
// the the-archivist-method/ directory. Hardcoded as Aaron Houston, archive
// tier, disappearing pattern.
function isDevRoute(): boolean {
  try {
    return typeof window !== "undefined" && window.location.pathname === "/portal/dev";
  } catch {
    return false;
  }
}

const DEV_ROUTE_USER = {
  name: "Aaron Houston",
  email: "houstoninvestments@gmail.com",
  primaryPattern: "disappearing",
  accessLevel: "archive" as const,
};

export default function Portal() {
  const [, navigate] = useLocation();

  const [toc, setToc] = useState<TocResponse | null>(null);
  const [section, setSection] = useState<SectionResponse | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loadingToc, setLoadingToc] = useState(true);
  const [loadingSection, setLoadingSection] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [interruptOpen, setInterruptOpen] = useState(false);

  // TEMP DEV BYPASS — remove before launch
  const devMode = useMemo(() => isDevMode(), []);
  const devRoute = useMemo(() => isDevRoute(), []);

  // Load TOC
  useEffect(() => {
    if (devMode && !devRoute) {
      const mock = buildDevMockToc();
      setToc(mock);
      const hash = window.location.hash.replace(/^#\/?/, "");
      const initial = hash && /^(m\d|p\d|ep-)/.test(hash) ? hash : mock.firstSectionId;
      setActiveId(initial);
      setLoadingToc(false);
      return;
    }
    const tocUrl = devRoute ? "/api/portal/dev/reader/toc" : "/api/portal/reader/toc";
    (async () => {
      try {
        const res = await fetch(tocUrl, devRoute ? {} : { credentials: "include" });
        if (!devRoute && res.status === 401) {
          setAuthError(true);
          return;
        }
        if (!res.ok) throw new Error(`TOC ${res.status}`);
        const data = (await res.json()) as TocResponse;
        setToc(data);
        // Determine initial section from URL hash or firstSectionId
        const hash = window.location.hash.replace(/^#\/?/, "");
        const initial = hash && /^(m\d|p\d|ep-)/.test(hash) ? hash : data.firstSectionId;
        setActiveId(initial);
      } catch {
        if (!devRoute) setAuthError(true);
      } finally {
        setLoadingToc(false);
      }
    })();
  }, [devMode, devRoute]);

  useEffect(() => {
    if (authError && !devMode && !devRoute) navigate("/portal/login");
  }, [authError, navigate, devMode, devRoute]);

  // Load section when activeId changes
  useEffect(() => {
    if (!activeId) return;
    if (devMode && !devRoute) {
      setSection(buildDevMockSection(activeId));
      setLoadingSection(false);
      try {
        window.history.replaceState(null, "", `?dev=true#/${activeId}`);
      } catch { /* ignore */ }
      return;
    }
    let cancelled = false;
    setLoadingSection(true);
    const sectionUrl = devRoute
      ? `/api/portal/dev/reader/section/${encodeURIComponent(activeId)}`
      : `/api/portal/reader/section/${encodeURIComponent(activeId)}`;
    (async () => {
      try {
        const res = await fetch(sectionUrl, devRoute ? {} : { credentials: "include" });
        if (!res.ok) throw new Error(`Section ${res.status}`);
        const data = (await res.json()) as SectionResponse;
        if (cancelled) return;
        setSection(data);
        // Update hash for deep-linking
        try {
          window.history.replaceState(null, "", `#/${activeId}`);
        } catch { /* ignore */ }
        // Scroll to top of reader
        requestAnimationFrame(() => {
          const el = document.getElementById("portal-reader-scroll");
          if (el) el.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
        });
      } catch {
        if (!cancelled) setSection(null);
      } finally {
        if (!cancelled) setLoadingSection(false);
      }
    })();
    return () => { cancelled = true; };
  }, [activeId, devMode, devRoute]);

  const patternDetail = useMemo(() => getPatternDetail(toc?.primaryPattern || null), [toc?.primaryPattern]);

  const feirDoor: FeirDoor = activeId ? feirForSection(activeId) : "E";
  const feirPalette = FEIR_COLORS[feirDoor];

  const handleSelectSection = (id: string) => {
    setActiveId(id);
    setMobileNavOpen(false);
  };

  // Compute day number for subject card (days since crash course start — best effort)
  const dayNumber: number | null = null;

  if (loadingToc) {
    return (
      <div style={{ minHeight: "100vh", background: "#080A0C" }}>
        <ContentSkeleton />
      </div>
    );
  }

  if (!toc) {
    return (
      <div style={{ minHeight: "100vh", background: "#080A0C", color: "#9A958D", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: "0.2em" }}>
        SUBJECT FILE UNAVAILABLE
      </div>
    );
  }

  return (
    <div
      data-feir={feirDoor}
      style={{
        minHeight: "100vh",
        background: "#080A0C",
        color: "#F0EDE8",
        position: "relative",
        // CSS custom properties for ambient color with transition
        ["--ambient-accent" as any]: feirPalette.accent,
        ["--ambient-color" as any]: feirPalette.ambient,
        transition: "background 1.2s ease",
      }}
    >
      <style>{`
        @keyframes archivistBreath {
          0%, 100% { box-shadow: 0 0 0 0 rgba(0,255,194,0.25); }
          50% { box-shadow: 0 0 0 6px rgba(0,255,194,0); }
        }
        @keyframes interruptPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(236,72,153,0.4), 0 8px 20px rgba(236,72,153,0.25); }
          50% { box-shadow: 0 0 0 10px rgba(236,72,153,0), 0 8px 20px rgba(236,72,153,0.25); }
        }
        @keyframes archivistSlideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .portal-sidebar-desktop { display: block; }
        .portal-main { margin-left: 290px; }
        @media (max-width: 900px) {
          .portal-sidebar-desktop { display: none; }
          .portal-main { margin-left: 0; }
        }
        .portal-mobile-hamburger { display: none; }
        @media (max-width: 900px) {
          .portal-mobile-hamburger { display: inline-flex; }
        }
      `}</style>

      {/* Ambient wash */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          background: `radial-gradient(ellipse at 70% 0%, ${feirPalette.ambient} 0%, transparent 60%)`,
          transition: "background 1.2s ease",
          zIndex: 0,
        }}
      />

      <Sidebar
        groups={toc.groups}
        activeSectionId={activeId}
        onSelect={handleSelectSection}
        onClose={() => setMobileNavOpen(false)}
        pattern={patternDetail}
        tier={toc.tier}
        dayNumber={dayNumber}
        mobileOpen={mobileNavOpen}
      />

      <main className="portal-main" style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        {/* Top bar */}
        <div
          style={{
            height: 56,
            borderBottom: "1px solid #14121A",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 24px",
            background: "rgba(8,10,12,0.85)",
            backdropFilter: "blur(10px)",
            position: "sticky",
            top: 0,
            zIndex: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button
              type="button"
              className="portal-mobile-hamburger"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open navigation"
              style={{
                width: 36,
                height: 36,
                background: "transparent",
                border: "1px solid #2A2830",
                borderRadius: 4,
                color: "#C8C0B2",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <Menu size={16} />
            </button>
            <Breadcrumb sectionId={activeId} groups={toc.groups} />
          </div>
          <div>
            <FeirPill door={feirDoor} />
          </div>
        </div>

        {/* Reader */}
        <div
          id="portal-reader-scroll"
          style={{
            flex: 1,
            overflowY: "auto",
            position: "relative",
            background: "transparent",
          }}
        >
          {/* Bookshelf edge gradient */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 60,
              background: "linear-gradient(to right, rgba(212,165,116,0.03) 0%, transparent 100%)",
              pointerEvents: "none",
            }}
          />

          {loadingSection && <ContentSkeleton />}

          {!loadingSection && section?.locked && <LockOverlay />}

          {!loadingSection && section && !section.locked && (
            <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 32px 0" }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.24em", color: feirPalette.accent, marginBottom: 20, fontWeight: 500 }}>
                // {section.sectionId.toUpperCase()} · {section.readMinutes} MIN
              </div>
              <Markdown content={section.content} accentColor={feirPalette.accent} />
              {section.next && (
                <NextChapterCard nextId={section.next} groups={toc.groups} onSelect={handleSelectSection} />
              )}
            </div>
          )}

          {!loadingSection && !section && (
            <div style={{ maxWidth: 620, margin: "80px auto", padding: "40px 32px", textAlign: "center", color: "#9A958D", fontFamily: "'EB Garamond', serif", fontStyle: "italic", fontSize: 17 }}>
              This section is not available yet. Select another from the sidebar.
            </div>
          )}
        </div>
      </main>

      {/* Floating UI */}
      <InterruptButton onOpen={() => setInterruptOpen(true)} hidden={chatOpen || interruptOpen} />
      <PresenceCard onOpen={() => setChatOpen(true)} hidden={chatOpen || interruptOpen} />
      <ChatPanel open={chatOpen} onClose={() => setChatOpen(false)} pattern={patternDetail} patternKey={toc.primaryPattern} tier={toc.tier} />
      <InterruptScreen open={interruptOpen} onClose={() => setInterruptOpen(false)} onOpenChat={() => setChatOpen(true)} pattern={patternDetail} />
    </div>
  );
}
