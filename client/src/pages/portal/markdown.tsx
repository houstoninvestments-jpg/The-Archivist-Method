import { ReactNode } from "react";

// Detects specialty callouts delimited by ═══ lines. Label is an emoji + ALL CAPS
// header line (e.g. "🔑 KEY TAKEAWAYS", "💎 GOLD NUGGET", "📜 THE ARCHIVIST OBSERVES").
const SEP_CHAR = "═";
const isSepLine = (l: string) => l.trim().length >= 6 && [...l.trim()].every((c) => c === SEP_CHAR);

type SpecialVariant = "gold" | "quick" | "circuit" | "key" | "observes" | "warning";

type Block =
  | { kind: "h1" | "h2" | "h3"; text: string }
  | { kind: "p"; text: string }
  | { kind: "hr" }
  | { kind: "ul" | "ol"; items: string[] }
  | { kind: "blockquote"; text: string }
  | { kind: "table"; headers: string[]; rows: string[][] }
  | { kind: "special"; variant: SpecialVariant; label: string; text: string }
  | { kind: "frame"; name: string };

// ![frame-01] / ![frame-02] etc. — shorthand for one of the chapter frame
// illustrations in /images/frame-XX.png. Stripping the wrapping gives "frame-01".
const FRAME_MARKER_RE = /^!\[(frame-\d{1,3})\]$/;

// Strip the leading emoji/icon from a label line, returning just the caps text.
function extractLabelText(line: string): string {
  // Remove leading emoji(s) + whitespace. An emoji sequence may include modifiers
  // like the variation selector U+FE0F, so we trim until we hit an ASCII letter.
  let s = line.trim();
  while (s.length > 0 && !/^[A-Za-z]/.test(s)) {
    s = s.slice(1).trim();
  }
  return s;
}

function detectSpecial(line: string): { variant: SpecialVariant; label: string } | null {
  const t = line.trim();
  // Known callouts with distinct styling.
  if (/^💎\s*GOLD NUGGET/i.test(t)) return { variant: "gold", label: "GOLD NUGGET" };
  if (/^⚡\s*QUICK WIN/i.test(t)) return { variant: "quick", label: extractLabelText(t) || "QUICK WIN" };
  if (/^🔌?\s*CIRCUIT BREAK/i.test(t)) return { variant: "circuit", label: "CIRCUIT BREAK" };
  if (/^🔑\s*KEY TAKEAWAYS/i.test(t)) return { variant: "key", label: "KEY TAKEAWAYS" };
  if (/^📜\s*THE ARCHIVIST OBSERVES/i.test(t)) return { variant: "observes", label: "THE ARCHIVIST OBSERVES" };
  // Generic: any line starting with an emoji followed by an ALL-CAPS label.
  // Catches ⚠️ BEFORE YOU EXCAVATE, ⚠️ THE GAP, ⚠️ IMPORTANT, etc.
  // Unicode property escapes are supported in modern browsers — used here to
  // match a leading pictographic / symbol codepoint.
  if (/^[\p{Extended_Pictographic}\p{Emoji_Presentation}][\uFE0F\u200D]?\s+[A-Z][A-Z0-9 ,:()'\-—]{2,}/u.test(t)) {
    return { variant: "warning", label: extractLabelText(t) || t };
  }
  return null;
}

export function parseMarkdown(md: string): Block[] {
  const lines = md.split(/\r?\n/);
  const out: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const raw = line ?? "";
    const t = raw.trim();

    // Special block: label line, then ═══, content, ═══
    const special = detectSpecial(raw);
    if (special && i + 1 < lines.length && isSepLine(lines[i + 1])) {
      let j = i + 2;
      const inner: string[] = [];
      while (j < lines.length && !isSepLine(lines[j])) {
        inner.push(lines[j]);
        j++;
      }
      out.push({ kind: "special", variant: special.variant, label: special.label, text: inner.join("\n").trim() });
      i = j + 1;
      continue;
    }

    if (t === "") {
      i++;
      continue;
    }

    // Frame marker: a standalone line like ![frame-01] resolves to a framed image.
    const frameMatch = t.match(FRAME_MARKER_RE);
    if (frameMatch) {
      out.push({ kind: "frame", name: frameMatch[1] });
      i++;
      continue;
    }

    if (/^---+$/.test(t) || /^\*\*\*+$/.test(t)) {
      out.push({ kind: "hr" });
      i++;
      continue;
    }

    if (t.startsWith("### ")) {
      out.push({ kind: "h3", text: t.slice(4) });
      i++;
      continue;
    }
    if (t.startsWith("## ")) {
      out.push({ kind: "h2", text: t.slice(3) });
      i++;
      continue;
    }
    if (t.startsWith("# ")) {
      out.push({ kind: "h1", text: t.slice(2) });
      i++;
      continue;
    }

    if (t.startsWith("> ")) {
      const buf: string[] = [t.slice(2)];
      let j = i + 1;
      while (j < lines.length && lines[j].trim().startsWith("> ")) {
        buf.push(lines[j].trim().slice(2));
        j++;
      }
      out.push({ kind: "blockquote", text: buf.join(" ") });
      i = j;
      continue;
    }

    // Table: header | header | ... followed by ---|---|---
    if (t.includes("|") && i + 1 < lines.length && /^\s*\|?\s*:?-+/.test(lines[i + 1]) && lines[i + 1].includes("|")) {
      const headers = t.split("|").map((s) => s.trim()).filter((s) => s.length > 0);
      let j = i + 2;
      const rows: string[][] = [];
      while (j < lines.length && lines[j].includes("|") && lines[j].trim() !== "") {
        const cells = lines[j].split("|").map((s) => s.trim());
        if (cells[0] === "") cells.shift();
        if (cells[cells.length - 1] === "") cells.pop();
        rows.push(cells);
        j++;
      }
      out.push({ kind: "table", headers, rows });
      i = j;
      continue;
    }

    if (/^[-*]\s+/.test(t)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*]\s+/, ""));
        i++;
      }
      out.push({ kind: "ul", items });
      continue;
    }

    if (/^\d+\.\s+/.test(t)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ""));
        i++;
      }
      out.push({ kind: "ol", items });
      continue;
    }

    // Paragraph — collect until blank line or structural line
    const buf: string[] = [raw];
    let j = i + 1;
    while (j < lines.length) {
      const nt = lines[j].trim();
      if (nt === "") break;
      if (/^#{1,3}\s/.test(nt)) break;
      if (/^---+$/.test(nt)) break;
      if (/^[-*]\s+/.test(nt)) break;
      if (/^\d+\.\s+/.test(nt)) break;
      if (nt.startsWith("> ")) break;
      if (FRAME_MARKER_RE.test(nt)) break;
      if (detectSpecial(lines[j])) break;
      buf.push(lines[j]);
      j++;
    }
    out.push({ kind: "p", text: buf.join(" ") });
    i = j;
  }
  return out;
}

// Inline: **bold**, *italic*, _italic_, `code`
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|_[^_]+_|`[^`]+`)/g;
  let lastIdx = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > lastIdx) nodes.push(text.slice(lastIdx, m.index));
    const tok = m[0];
    const key = `${keyPrefix}-${k++}`;
    if (tok.startsWith("**")) {
      nodes.push(<strong key={key} style={{ color: "#F0EDE8", fontWeight: 600 }}>{tok.slice(2, -2)}</strong>);
    } else if (tok.startsWith("*")) {
      nodes.push(<em key={key} style={{ fontStyle: "italic" }}>{tok.slice(1, -1)}</em>);
    } else if (tok.startsWith("_")) {
      nodes.push(<em key={key} style={{ fontStyle: "italic" }}>{tok.slice(1, -1)}</em>);
    } else if (tok.startsWith("`")) {
      nodes.push(
        <code key={key} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.9em", background: "#1A1820", padding: "2px 6px", borderRadius: 3, color: "#D4A574" }}>
          {tok.slice(1, -1)}
        </code>,
      );
    }
    lastIdx = m.index + tok.length;
  }
  if (lastIdx < text.length) nodes.push(text.slice(lastIdx));
  return nodes;
}

export interface MarkdownProps {
  content: string;
  accentColor: string; // ambient accent (FEIR)
}

export function Markdown({ content, accentColor }: MarkdownProps) {
  const blocks = parseMarkdown(content);
  return (
    <div style={{ color: "#D8D3CC", fontFamily: "'Inter', sans-serif", fontSize: 16, lineHeight: 1.75, fontWeight: 400 }}>
      {blocks.map((b, idx) => {
        const key = `b-${idx}`;
        if (b.kind === "h1") {
          return (
            <h1 key={key} style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 44, letterSpacing: "0.04em", color: "#F0EDE8", marginTop: idx === 0 ? 0 : 48, marginBottom: 24, lineHeight: 1.1 }}>
              {renderInline(b.text, key)}
            </h1>
          );
        }
        if (b.kind === "h2") {
          return (
            <h2 key={key} style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, letterSpacing: "0.18em", color: "#D4A574", marginTop: 44, marginBottom: 18, textTransform: "uppercase" }}>
              {renderInline(b.text, key)}
            </h2>
          );
        }
        if (b.kind === "h3") {
          return (
            <h3 key={key} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: "0.22em", color: accentColor, marginTop: 32, marginBottom: 14, textTransform: "uppercase", fontWeight: 500 }}>
              {renderInline(b.text, key)}
            </h3>
          );
        }
        if (b.kind === "p") {
          return (
            <p key={key} style={{ margin: "0 0 20px 0" }}>
              {renderInline(b.text, key)}
            </p>
          );
        }
        if (b.kind === "hr") {
          return (
            <hr key={key} style={{ border: 0, height: 1, background: `linear-gradient(to right, transparent 0%, ${accentColor}40 50%, transparent 100%)`, margin: "36px 0" }} />
          );
        }
        if (b.kind === "frame") {
          return (
            <figure
              key={key}
              style={{
                margin: "36px -8px",
                padding: 0,
                position: "relative",
                borderRadius: 6,
                overflow: "hidden",
                border: "1px solid rgba(212,165,116,0.15)",
                background: "#0A0C10",
              }}
            >
              <img
                src={`/images/${b.name}.png`}
                alt=""
                loading="lazy"
                style={{
                  display: "block",
                  width: "100%",
                  height: "auto",
                }}
              />
              {/* Dark overlay fade — seats the diagram into the reader's palette. */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                  background:
                    "linear-gradient(180deg, rgba(8,10,12,0.0) 0%, rgba(8,10,12,0.0) 55%, rgba(8,10,12,0.75) 100%)",
                }}
              />
            </figure>
          );
        }
        if (b.kind === "ul") {
          return (
            <ul key={key} style={{ margin: "0 0 24px 0", paddingLeft: 24 }}>
              {b.items.map((item, j) => (
                <li key={`${key}-${j}`} style={{ margin: "8px 0", paddingLeft: 8 }}>
                  {renderInline(item, `${key}-${j}`)}
                </li>
              ))}
            </ul>
          );
        }
        if (b.kind === "ol") {
          return (
            <ol key={key} style={{ margin: "0 0 24px 0", paddingLeft: 24 }}>
              {b.items.map((item, j) => (
                <li key={`${key}-${j}`} style={{ margin: "8px 0", paddingLeft: 8 }}>
                  {renderInline(item, `${key}-${j}`)}
                </li>
              ))}
            </ol>
          );
        }
        if (b.kind === "blockquote") {
          return (
            <blockquote key={key} style={{ margin: "24px 0", padding: "16px 22px", borderLeft: `2px solid ${accentColor}`, background: "rgba(212,165,116,0.04)", color: "#C8C0B2", fontFamily: "'EB Garamond', serif", fontStyle: "italic", fontSize: 18, lineHeight: 1.6 }}>
              {renderInline(b.text, key)}
            </blockquote>
          );
        }
        if (b.kind === "table") {
          return (
            <div key={key} style={{ overflowX: "auto", margin: "24px 0" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead>
                  <tr>
                    {b.headers.map((h, j) => (
                      <th key={`${key}-h-${j}`} style={{ padding: "10px 14px", textAlign: "left", borderBottom: `1px solid ${accentColor}40`, color: "#D4A574", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 500 }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {b.rows.map((row, j) => (
                    <tr key={`${key}-r-${j}`}>
                      {row.map((cell, k) => (
                        <td key={`${key}-c-${j}-${k}`} style={{ padding: "10px 14px", borderBottom: "1px solid #1C1A24", color: "#C8C0B2" }}>
                          {renderInline(cell, `${key}-c-${j}-${k}`)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        if (b.kind === "special") {
          const palette =
            b.variant === "gold"
              ? { border: "#D4A574", bg: "rgba(212,165,116,0.06)", label: "#D4A574", font: "'EB Garamond', serif", italic: true, fontSize: 19 }
              : b.variant === "quick"
                ? { border: "#00FFC2", bg: "rgba(0,255,194,0.05)", label: "#00FFC2", font: "'Inter', sans-serif", italic: false, fontSize: 15 }
                : b.variant === "circuit"
                  ? { border: "#EC4899", bg: "rgba(236,72,153,0.06)", label: "#EC4899", font: "'JetBrains Mono', monospace", italic: false, fontSize: 15 }
                  : b.variant === "key"
                    ? { border: "#D4A574", bg: "rgba(212,165,116,0.05)", label: "#D4A574", font: "'Inter', sans-serif", italic: false, fontSize: 15 }
                    : b.variant === "observes"
                      ? { border: "#D4A574", bg: "rgba(212,165,116,0.04)", label: "#D4A574", font: "'EB Garamond', serif", italic: true, fontSize: 18 }
                      : { border: "#EC4899", bg: "rgba(236,72,153,0.05)", label: "#EC4899", font: "'Inter', sans-serif", italic: false, fontSize: 15 };
          return (
            <div key={key} style={{ margin: "28px 0", padding: "22px 24px", borderLeft: `3px solid ${palette.border}`, background: palette.bg, borderRadius: "0 6px 6px 0" }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.28em", color: palette.label, marginBottom: 12, fontWeight: 500 }}>
                // {b.label}
              </div>
              <div style={{ fontFamily: palette.font, fontStyle: palette.italic ? "italic" : "normal", fontSize: palette.fontSize, lineHeight: 1.65, color: "#E8E3DC", whiteSpace: "pre-wrap" }}>
                {renderInline(b.text, key)}
              </div>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}
