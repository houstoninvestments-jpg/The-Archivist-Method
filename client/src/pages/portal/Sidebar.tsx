import { useState, useMemo, useEffect } from "react";
import { Lock, Lamp, ChevronDown, Repeat, ArrowUpRight } from "lucide-react";
import type { PatternDetail } from "./patterns";
import { PATTERN_DETAILS } from "./patterns";

export interface TocSection {
  id: string;
  title: string;
  locked: boolean;
}
export interface TocGroup {
  id: string;
  title: string;
  sections: TocSection[];
}

interface SidebarProps {
  groups: TocGroup[];
  activeSectionId: string | null;
  onSelect: (sectionId: string) => void;
  onClose: () => void;
  pattern: PatternDetail;
  patternKey: string | null;
  tier: string;
  dayNumber: number | null;
  mobileOpen: boolean;
  onPatternSwitched?: () => void;
}

const tierLabel = (tier: string): string => {
  if (tier === "archive") return "COMPLETE ARCHIVE";
  if (tier === "quick-start") return "FIELD GUIDE";
  return "CRASH COURSE";
};

export function Sidebar({ groups, activeSectionId, onSelect, onClose, pattern, patternKey, tier, dayNumber, mobileOpen, onPatternSwitched }: SidebarProps) {
  // Expanded groups: default to the active group, plus collapsed others
  const activeGroupId = useMemo(() => {
    for (const g of groups) if (g.sections.some((s) => s.id === activeSectionId)) return g.id;
    return groups[0]?.id;
  }, [groups, activeSectionId]);

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const isOpen = (gid: string) => (expanded[gid] !== undefined ? expanded[gid] : gid === activeGroupId);

  const toggle = (gid: string) => setExpanded((p) => ({ ...p, [gid]: !isOpen(gid) }));

  // ── Item 11: Switch Pattern (Field Guide tier only) ─────────────────────
  // Field Guide buyers get one pattern deep-dive but should be able to swap
  // to a secondary at any time without re-purchasing. Complete Archive sees
  // all 9, so they don't need the switcher.
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [switching, setSwitching] = useState<string | null>(null);
  const [switchError, setSwitchError] = useState<string | null>(null);

  const allPatternKeys = useMemo(() => Object.keys(PATTERN_DETAILS), []);

  const switchPattern = async (newKey: string) => {
    if (newKey === patternKey || switching) return;
    setSwitching(newKey);
    setSwitchError(null);
    try {
      const res = await fetch("/api/portal/onboarding-update-pattern", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ pattern: newKey }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSwitcherOpen(false);
      onPatternSwitched?.();
    } catch (err) {
      setSwitchError(err instanceof Error ? err.message : "Failed to switch pattern");
    } finally {
      setSwitching(null);
    }
  };

  // ── Item 9: Upgrade-to-Archive CTA (Field Guide tier only) ──────────────
  // Pull live price label so it reflects the $67 Field Guide credit.
  const [upgradeLabel, setUpgradeLabel] = useState<string>("$230 (Field Guide credit applied)");
  const [upgradePending, setUpgradePending] = useState(false);
  useEffect(() => {
    if (tier !== "quick-start") return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/portal/pricing/archive", { credentials: "include" });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && data?.label) setUpgradeLabel(data.label);
      } catch { /* keep default label */ }
    })();
    return () => { cancelled = true; };
  }, [tier]);

  const startUpgrade = async () => {
    if (upgradePending) return;
    setUpgradePending(true);
    try {
      const res = await fetch("/api/portal/checkout/archive-upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      if (data?.url) {
        window.location.assign(data.url);
        return;
      }
    } catch { /* fall through */ }
    setUpgradePending(false);
  };

  const sidebar = (
    <aside
      style={{
        width: 290,
        background: "#0A0C10",
        borderRight: "1px solid #1C1A24",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Brand header */}
      <div style={{ padding: "28px 24px 20px", borderBottom: "1px solid #14121A", position: "relative" }}>
        <div style={{ fontFamily: "'Cinzel', serif", fontWeight: 600, fontSize: 15, letterSpacing: "0.12em", color: "#E8E3DC", lineHeight: 1.2 }}>
          THE ARCHIVIST
          <br />
          METHOD
        </div>
        <div style={{ fontFamily: "'EB Garamond', serif", fontStyle: "italic", fontSize: 13, color: "#8A857D", marginTop: 6, letterSpacing: "0.02em" }}>
          Pattern Archaeology, Not Therapy
        </div>
        {/* Gothic arch decoration */}
        <svg
          aria-hidden="true"
          viewBox="0 0 120 40"
          style={{ position: "absolute", right: 16, top: 28, width: 80, height: 26, opacity: 0.1, pointerEvents: "none" }}
        >
          <path d="M10,40 L10,20 Q10,2 60,2 Q110,2 110,20 L110,40" stroke="#D4A574" strokeWidth="1" fill="none" />
          <path d="M30,40 L30,24 Q30,12 60,12 Q90,12 90,24 L90,40" stroke="#D4A574" strokeWidth="0.6" fill="none" />
        </svg>
      </div>

      {/* Pattern file card */}
      <div style={{ padding: "20px 24px 20px", borderBottom: "1px solid #14121A" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <Lamp size={12} color="#D4A574" strokeWidth={1.5} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "0.22em", color: "#D4A574", fontWeight: 500 }}>
            // SUBJECT FILE // ACTIVE
          </span>
        </div>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: "0.06em", color: "#F0EDE8", lineHeight: 1.2, marginBottom: 10 }}>
          {pattern.name}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: "0.18em", color: "#00FFC2", border: "1px solid rgba(0,255,194,0.3)", padding: "3px 8px", borderRadius: 3, background: "rgba(0,255,194,0.04)" }}>
            {tierLabel(tier)}
          </span>
          {dayNumber !== null && (
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: "0.18em", color: "#8A857D" }}>
              DAY {dayNumber}/90
            </span>
          )}
        </div>

        {/* Item 11: Switch Pattern — Field Guide tier only */}
        {tier === "quick-start" && (
          <div style={{ marginTop: 14 }}>
            <button
              type="button"
              data-testid="button-switch-pattern"
              onClick={() => setSwitcherOpen((v) => !v)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 12px",
                background: switcherOpen ? "rgba(212,165,116,0.08)" : "transparent",
                border: "1px solid rgba(212,165,116,0.35)",
                borderRadius: 4,
                color: "#D4A574",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 9,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <Repeat size={11} />
                Switch Pattern
              </span>
              <ChevronDown
                size={11}
                style={{ transform: switcherOpen ? "rotate(0deg)" : "rotate(-90deg)", transition: "transform 0.2s", opacity: 0.6 }}
              />
            </button>
            {switcherOpen && (
              <div
                style={{
                  marginTop: 8,
                  background: "#0E1014",
                  border: "1px solid #1C1A24",
                  borderRadius: 4,
                  padding: "8px 6px",
                  maxHeight: 280,
                  overflowY: "auto",
                }}
              >
                <p style={{
                  fontFamily: "'EB Garamond', serif",
                  fontStyle: "italic",
                  fontSize: 12,
                  color: "#8A857D",
                  margin: "4px 8px 8px",
                  lineHeight: 1.4,
                }}>
                  Field Guide includes one pattern. Switching replaces the chapters you see.
                </p>
                {allPatternKeys.map((k) => {
                  const detail = PATTERN_DETAILS[k];
                  const active = k === patternKey;
                  return (
                    <button
                      type="button"
                      key={k}
                      onClick={() => switchPattern(k)}
                      disabled={active || switching !== null}
                      data-testid={`button-pattern-${k}`}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "8px 10px",
                        margin: "1px 0",
                        background: active ? "rgba(0,255,194,0.06)" : "transparent",
                        border: 0,
                        borderLeft: active ? "2px solid #00FFC2" : "2px solid transparent",
                        borderRadius: 2,
                        color: active ? "#00FFC2" : switching === k ? "#D4A574" : "#C8C0B2",
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 12,
                        cursor: active || switching ? "default" : "pointer",
                        opacity: switching && switching !== k ? 0.5 : 1,
                      }}
                    >
                      {detail.name.charAt(0).toUpperCase() + detail.name.slice(1).toLowerCase()}
                      {switching === k && (
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, marginLeft: 8, color: "#D4A574" }}>...</span>
                      )}
                    </button>
                  );
                })}
                {switchError && (
                  <p style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10,
                    color: "#ef4444",
                    margin: "8px 10px 4px",
                  }}>
                    {switchError}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Item 9: Upgrade-to-Archive CTA — Field Guide tier only.
          Renders inline above the chapter list so it stays visible on every
          chapter, not just locked ones. */}
      {tier === "quick-start" && (
        <div style={{ padding: "14px 18px 0" }}>
          <button
            type="button"
            data-testid="button-upgrade-archive"
            onClick={startUpgrade}
            disabled={upgradePending}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
              padding: "12px 14px",
              background: "rgba(0,255,194,0.06)",
              border: "1px solid rgba(0,255,194,0.4)",
              borderRadius: 4,
              color: "#00FFC2",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              cursor: upgradePending ? "wait" : "pointer",
              fontWeight: 500,
              opacity: upgradePending ? 0.7 : 1,
              textAlign: "left",
            }}
          >
            <span style={{ display: "flex", flexDirection: "column", gap: 4, lineHeight: 1.3 }}>
              <span>UPGRADE TO COMPLETE ARCHIVE</span>
              <span style={{ color: "#C8C0B2", fontSize: 9, letterSpacing: "0.12em", textTransform: "none" }}>
                {upgradePending ? "Opening checkout…" : upgradeLabel}
              </span>
            </span>
            <ArrowUpRight size={14} />
          </button>
        </div>
      )}

      {/* Navigation list */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "12px 10px 40px" }}>
        {groups.map((g, gi) => {
          const open = isOpen(g.id);
          const allLocked = g.sections.every((s) => s.locked);
          return (
            <div key={g.id} style={{ marginBottom: 4 }}>
              <button
                type="button"
                onClick={() => toggle(g.id)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  background: "transparent",
                  border: 0,
                  color: allLocked ? "#3A3530" : "#D4A574",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  textAlign: "left",
                  fontWeight: 500,
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ color: allLocked ? "#3A3530" : "#D4A574", fontWeight: 600 }}>
                    {String(gi).padStart(2, "0")}
                  </span>
                  <span style={{ color: allLocked ? "#5A5550" : "#C8C0B2" }}>{g.title}</span>
                </span>
                <ChevronDown
                  size={12}
                  style={{ transform: open ? "rotate(0deg)" : "rotate(-90deg)", transition: "transform 0.2s", opacity: 0.5 }}
                />
              </button>
              {open && (
                <div style={{ paddingLeft: 22, paddingRight: 8, paddingBottom: 4 }}>
                  {g.sections.map((s) => {
                    const active = s.id === activeSectionId;
                    return (
                      <button
                        type="button"
                        key={s.id}
                        onClick={() => !s.locked && onSelect(s.id)}
                        disabled={s.locked}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "8px 10px",
                          margin: "1px 0",
                          background: active ? "rgba(212,165,116,0.08)" : "transparent",
                          borderLeft: active ? "2px solid #D4A574" : "2px solid transparent",
                          border: "0",
                          borderRadius: 2,
                          color: s.locked ? "#3A3530" : active ? "#F0EDE8" : "#9A958D",
                          fontFamily: "'Inter', sans-serif",
                          fontSize: 13,
                          fontWeight: active ? 500 : 400,
                          lineHeight: 1.4,
                          textAlign: "left",
                          cursor: s.locked ? "not-allowed" : "pointer",
                          transition: "background 0.15s, color 0.15s",
                          boxShadow: active ? "inset 2px 0 12px -4px rgba(212,165,116,0.3)" : "none",
                        }}
                      >
                        {s.locked ? (
                          <Lock size={10} color="#3A3530" strokeWidth={1.8} />
                        ) : (
                          <span style={{ width: 10 }} />
                        )}
                        <span>{s.title}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );

  // Mobile drawer mode
  return (
    <>
      {/* Desktop: always visible */}
      <div style={{ position: "fixed", left: 0, top: 0, bottom: 0, zIndex: 40 }} className="portal-sidebar-desktop">
        {sidebar}
      </div>
      {/* Mobile overlay + drawer */}
      {mobileOpen && (
        <>
          <div
            onClick={onClose}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 60 }}
            className="portal-sidebar-mobile-overlay"
          />
          <div style={{ position: "fixed", left: 0, top: 0, bottom: 0, zIndex: 70 }} className="portal-sidebar-mobile">
            {sidebar}
          </div>
        </>
      )}
    </>
  );
}
