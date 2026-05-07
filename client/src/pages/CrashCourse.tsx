import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "wouter";
import { Markdown } from "./portal/markdown";

// ─── Design tokens ───────────────────────────────────────────────
const FONT_HEADING = "'Bebas Neue', sans-serif";
const FONT_MONO    = "'JetBrains Mono', monospace";
const FONT_BODY    = "'Inter', sans-serif";

const C_BG      = "#0A0A0A";
const C_TEAL    = "#00FFC2";
const C_AMBER   = "#D4A574";
const C_TEXT    = "#F5F5F5";
const C_MUTED   = "#A3A3A3";
const C_DIM     = "#666666";

// Canonical pattern order — used for prev/next nav and TOC rendering.
const CANONICAL_ORDER = [
  "disappearing",
  "apologyLoop",
  "testing",
  "attractionToHarm",
  "drainingBond",
  "complimentDeflection",
  "perfectionism",
  "successSabotage",
  "rage",
] as const;

type PatternKey = typeof CANONICAL_ORDER[number];

const PATTERN_DISPLAY: Record<PatternKey, string> = {
  disappearing:         "The Disappearing Pattern",
  apologyLoop:          "The Apology Loop",
  testing:              "The Testing Pattern",
  attractionToHarm:     "Attraction to Harm",
  drainingBond:         "The Draining Bond",
  complimentDeflection: "Compliment Deflection",
  perfectionism:        "The Perfectionism Trap",
  successSabotage:      "Success Sabotage",
  rage:                 "The Rage Pattern",
};

function isPatternKey(s: string | undefined): s is PatternKey {
  return !!s && (CANONICAL_ORDER as readonly string[]).includes(s);
}

// ─── Server response types ───────────────────────────────────────
interface StatusResponse {
  primaryPattern: string | null;
  accessLevel: string;
  crashCourseDay: number;
  crashCourseStarted: string | null;
}

interface ContentResponse {
  sectionId: string;
  patternKey: PatternKey;
  title: string | null;
  content: string;
  readMinutes: number;
  tier: "free" | "quick-start" | "archive";
  primaryPattern: string | null;
}

// ─── Loading screen ──────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div style={{ minHeight: "100vh", background: C_BG, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: "0.2em", color: C_DIM }}>
        LOADING…
      </p>
    </div>
  );
}

// ─── Locked state for non-primary patterns on free tier ──────────
function LockedState({ requestedKey, primaryPattern }: { requestedKey: PatternKey; primaryPattern: PatternKey }) {
  const [, navigate] = useLocation();
  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "80px 24px" }}>
      <p style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: "0.2em", color: C_DIM, margin: "0 0 24px" }}>
        ACCESS // RESTRICTED
      </p>
      <h1 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(36px, 8vw, 56px)", color: C_TEXT, margin: "0 0 16px", letterSpacing: "0.03em", lineHeight: 1.05 }}>
        This pattern is locked.
      </h1>
      <p style={{ fontFamily: FONT_BODY, fontSize: 16, color: C_MUTED, margin: "0 0 12px", lineHeight: 1.7 }}>
        Your free crash course covers <span style={{ color: C_TEXT }}>{PATTERN_DISPLAY[primaryPattern]}</span>.
      </p>
      <p style={{ fontFamily: FONT_BODY, fontSize: 16, color: C_MUTED, margin: "0 0 36px", lineHeight: 1.7 }}>
        {PATTERN_DISPLAY[requestedKey]} is part of the Complete Archive. Unlock all nine with the Field Guide ($67) or the Complete Archive ($297).
      </p>
      <button
        type="button"
        onClick={() => navigate(`/crash-course/${primaryPattern}`)}
        style={{
          display: "block", width: "100%", marginBottom: 12,
          padding: 16, background: "transparent",
          border: `1px solid ${C_TEAL}`, borderRadius: 4,
          color: C_TEAL, fontFamily: FONT_HEADING, fontSize: 16,
          letterSpacing: "0.15em", cursor: "pointer", textAlign: "center",
        }}
      >
        OPEN MY CRASH COURSE →
      </button>
      <a
        href="/checkout?product=fieldGuide"
        style={{
          display: "block", padding: 16, background: C_AMBER,
          color: "#000", fontFamily: FONT_HEADING, fontSize: 16,
          letterSpacing: "0.15em", textAlign: "center",
          textDecoration: "none", borderRadius: 4,
        }}
      >
        UNLOCK ALL NINE — $67 →
      </a>
    </div>
  );
}

// ─── End-of-document upsell shim ─────────────────────────────────
function UpsellShim() {
  return (
    <div style={{
      marginTop: 48, padding: 32,
      background: "rgba(212,165,116,0.04)",
      border: `1px solid rgba(212,165,116,0.30)`,
      borderRadius: 4,
    }}>
      <p style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: "0.2em", color: C_AMBER, margin: "0 0 14px" }}>
        // CONTINUE THE WORK
      </p>
      <h3 style={{ fontFamily: FONT_HEADING, fontSize: 28, color: C_TEXT, margin: "0 0 16px", letterSpacing: "0.03em", lineHeight: 1.1 }}>
        You finished the crash course.
      </h3>
      <p style={{ fontFamily: FONT_BODY, fontSize: 15, color: C_MUTED, margin: "0 0 24px", lineHeight: 1.7 }}>
        The crash course is recognition. The Field Guide is interruption. Ninety days inside one pattern, full protocol depth, every script and rewrite. The Complete Archive carries all nine plus the advanced material and the physical book.
      </p>
      <a
        href="/checkout?product=fieldGuide"
        style={{
          display: "block", width: "100%", padding: 16, marginBottom: 10,
          background: C_AMBER, color: "#000",
          fontFamily: FONT_HEADING, fontSize: 16, letterSpacing: "0.15em",
          textAlign: "center", textDecoration: "none", borderRadius: 4,
          boxSizing: "border-box",
        }}
      >
        GET THE FIELD GUIDE — $67 →
      </a>
      <a
        href="/checkout?product=completeArchive"
        style={{
          display: "block", width: "100%", padding: 16,
          background: "transparent", color: C_TEAL,
          border: `1px solid ${C_TEAL}`,
          fontFamily: FONT_HEADING, fontSize: 16, letterSpacing: "0.15em",
          textAlign: "center", textDecoration: "none", borderRadius: 4,
          boxSizing: "border-box",
        }}
      >
        GET THE COMPLETE ARCHIVE — $297 →
      </a>
    </div>
  );
}

// ─── TOC: locked-but-visible nine-pattern grid ───────────────────
function PatternGrid({ activeKey, primaryPattern, tier }: {
  activeKey: PatternKey;
  primaryPattern: PatternKey;
  tier: string;
}) {
  const [, navigate] = useLocation();
  const isPaid = tier !== "free";
  return (
    <div style={{ marginTop: 48, marginBottom: 24 }}>
      <p style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: "0.2em", color: C_DIM, margin: "0 0 16px" }}>
        // THE NINE PATTERNS
      </p>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 6 }}>
        {CANONICAL_ORDER.map((key) => {
          const isActive = key === activeKey;
          const isPrimary = key === primaryPattern;
          const unlocked = isPaid || isPrimary;
          return (
            <li key={key}>
              <button
                type="button"
                onClick={() => unlocked
                  ? navigate(`/crash-course/${key}`)
                  : navigate("/checkout?product=fieldGuide")}
                style={{
                  width: "100%", textAlign: "left", cursor: "pointer",
                  padding: "12px 14px",
                  background: isActive ? "rgba(0,255,194,0.06)" : "transparent",
                  border: `1px solid ${isActive ? C_TEAL : "#1A1820"}`,
                  borderRadius: 3,
                  color: unlocked ? C_TEXT : C_DIM,
                  fontFamily: FONT_BODY, fontSize: 14,
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                }}
              >
                <span>{PATTERN_DISPLAY[key]}</span>
                <span style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: "0.18em", color: unlocked ? (isActive ? C_TEAL : C_MUTED) : C_AMBER }}>
                  {isActive ? "READING" : isPrimary ? "YOURS" : unlocked ? "OPEN" : "LOCKED"}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ─── Prev/next nav (paid-tier full cycle, free-tier shows only one) ─
function PrevNextNav({ currentKey, primaryPattern, tier }: {
  currentKey: PatternKey;
  primaryPattern: PatternKey;
  tier: string;
}) {
  const [, navigate] = useLocation();
  const isPaid = tier !== "free";
  if (!isPaid) return null;
  const idx = CANONICAL_ORDER.indexOf(currentKey);
  const prev = idx > 0 ? CANONICAL_ORDER[idx - 1] : null;
  const next = idx < CANONICAL_ORDER.length - 1 ? CANONICAL_ORDER[idx + 1] : null;
  return (
    <div style={{ display: "flex", gap: 8, marginTop: 24 }}>
      <button
        type="button"
        disabled={!prev}
        onClick={() => prev && navigate(`/crash-course/${prev}`)}
        style={{
          flex: 1, padding: "14px 16px",
          background: "transparent",
          border: `1px solid ${prev ? "#2A2830" : "#14121A"}`,
          borderRadius: 3,
          color: prev ? C_MUTED : C_DIM,
          fontFamily: FONT_MONO, fontSize: 11, letterSpacing: "0.12em",
          cursor: prev ? "pointer" : "default", textAlign: "left",
        }}
      >
        ← {prev ? PATTERN_DISPLAY[prev].toUpperCase() : "FIRST PATTERN"}
      </button>
      <button
        type="button"
        disabled={!next}
        onClick={() => next && navigate(`/crash-course/${next}`)}
        style={{
          flex: 1, padding: "14px 16px",
          background: "transparent",
          border: `1px solid ${next ? "#2A2830" : "#14121A"}`,
          borderRadius: 3,
          color: next ? C_MUTED : C_DIM,
          fontFamily: FONT_MONO, fontSize: 11, letterSpacing: "0.12em",
          cursor: next ? "pointer" : "default", textAlign: "right",
        }}
      >
        {next ? PATTERN_DISPLAY[next].toUpperCase() : "LAST PATTERN"} →
      </button>
    </div>
  );
}

// ─── Main ────────────────────────────────────────────────────────
export default function CrashCourse() {
  const [, navigate] = useLocation();
  const params = useParams<{ patternId?: string }>();
  const requestedRaw = params?.patternId;

  const [primaryPattern, setPrimaryPattern] = useState<PatternKey | null>(null);
  const [tier, setTier] = useState<string>("free");
  const [statusLoaded, setStatusLoaded] = useState(false);
  const [content, setContent] = useState<ContentResponse | null>(null);
  const [locked, setLocked] = useState(false);
  const [contentLoading, setContentLoading] = useState(true);

  // Step 1: resolve user identity + primary pattern
  useEffect(() => {
    fetch("/api/portal/crash-course/status", { credentials: "include" })
      .then(async (res) => {
        if (res.status === 401) {
          navigate("/quiz", { replace: true });
          return null;
        }
        if (!res.ok) throw new Error("status-failed");
        return (await res.json()) as StatusResponse;
      })
      .then((data) => {
        if (!data) return;
        if (!data.primaryPattern || !isPatternKey(data.primaryPattern)) {
          navigate("/quiz", { replace: true });
          return;
        }
        setPrimaryPattern(data.primaryPattern);
        setTier(data.accessLevel || "free");
        setStatusLoaded(true);
      })
      .catch(() => navigate("/quiz", { replace: true }));
  }, [navigate]);

  // Resolve which pattern to show: requested if valid, otherwise the user's primary.
  const activeKey: PatternKey | null = useMemo(() => {
    if (!primaryPattern) return null;
    return isPatternKey(requestedRaw) ? (requestedRaw as PatternKey) : primaryPattern;
  }, [requestedRaw, primaryPattern]);

  // Step 2: fetch markdown content for the active pattern
  useEffect(() => {
    if (!statusLoaded || !activeKey) return;
    setContent(null);
    setLocked(false);
    setContentLoading(true);
    fetch(`/api/portal/crash-course/content/${activeKey}`, { credentials: "include" })
      .then(async (res) => {
        if (res.status === 401) {
          navigate("/quiz", { replace: true });
          return;
        }
        if (res.status === 409) {
          navigate("/quiz", { replace: true });
          return;
        }
        if (res.status === 403) {
          setLocked(true);
          setContentLoading(false);
          return;
        }
        if (!res.ok) {
          setContentLoading(false);
          return;
        }
        const data = (await res.json()) as ContentResponse;
        setContent(data);
        setContentLoading(false);
      })
      .catch(() => setContentLoading(false));
  }, [activeKey, statusLoaded, navigate]);

  // Scroll to top whenever the active pattern changes.
  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "auto" });
  }, [activeKey]);

  if (!statusLoaded || contentLoading) return <LoadingScreen />;
  if (!primaryPattern || !activeKey) return <LoadingScreen />;

  if (locked) {
    return (
      <div style={{ minHeight: "100vh", background: C_BG }}>
        <TopBar />
        <LockedState requestedKey={activeKey} primaryPattern={primaryPattern} />
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 24px 80px" }}>
          <PatternGrid activeKey={activeKey} primaryPattern={primaryPattern} tier={tier} />
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div style={{ minHeight: "100vh", background: C_BG, padding: "80px 24px" }}>
        <p style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: "0.2em", color: C_DIM, textAlign: "center" }}>
          CONTENT UNAVAILABLE.
        </p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: C_BG }}>
      <TopBar />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px 96px" }}>
        <p style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: "0.2em", color: C_DIM, margin: "0 0 12px" }}>
          CRASH COURSE // {PATTERN_DISPLAY[activeKey].toUpperCase()}
        </p>
        <Markdown content={content.content} accentColor={C_TEAL} />
        <UpsellShim />
        <PrevNextNav currentKey={activeKey} primaryPattern={primaryPattern} tier={tier} />
        <PatternGrid activeKey={activeKey} primaryPattern={primaryPattern} tier={tier} />
      </div>
    </div>
  );
}

// ─── Top bar (back to portal/landing) ────────────────────────────
function TopBar() {
  const [, navigate] = useLocation();
  return (
    <div style={{
      borderBottom: "1px solid #14121A",
      padding: "16px 24px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: "rgba(8,10,12,0.85)",
      position: "sticky", top: 0, zIndex: 20,
      backdropFilter: "blur(10px)",
    }}>
      <p style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: "0.2em", color: C_DIM, margin: 0 }}>
        THE ARCHIVIST METHOD
      </p>
      <button
        type="button"
        onClick={() => navigate("/portal")}
        style={{
          background: "transparent", border: "1px solid #2A2830",
          borderRadius: 3, padding: "6px 12px",
          color: C_MUTED, fontFamily: FONT_MONO, fontSize: 10,
          letterSpacing: "0.15em", cursor: "pointer",
        }}
      >
        ← FILE
      </button>
    </div>
  );
}
