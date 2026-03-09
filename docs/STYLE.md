# THE ARCHIVIST METHOD — DESIGN SYSTEM

> Last updated: February 17, 2026
>
> Source: `TAM-HANDOFF-COMPLETE.md`, PDF generator scripts

---

## Mode

**Dark mode only.** There is no light mode. The entire experience — website, PDFs, portal — uses a dark background.

---

## Colors

### Primary Palette

| Name | Hex | Usage |
|------|-----|-------|
| Dark Background | `#0A0A0A` | Site background |
| PDF Background | `#1A1A1A` | PDF page background |
| White | `#FFFFFF` | Headlines, primary text on site |
| Text Primary | `#F5F5F5` / `#E5E5E5` | Body text |
| Text Muted | `#737373` | Secondary/muted text on site |
| Text Secondary | `#9CA3AF` | Secondary text in PDFs |
| Text Dim | `#6B7280` | Footers, metadata |

### Accent Colors

| Name | Hex | Usage |
|------|-----|-------|
| Teal (Primary) | `#14B8A6` | Primary accent, headers, links, pattern names, CTA |
| Teal Dim | `#0F7B6E` | Dimmed teal for dividers, borders |
| Pink (CTA) | `#EC4899` | CTA highlights, "NOT" in tagline, emphasis |
| Cyan | `#06B6D4` | Secondary accent |
| Gold | `#F59E0B` | "Gold Nugget" callout boxes, premium tier highlights |
| Red | `#EF4444` | Warnings, danger callouts |
| Green | `#22C55E` | "Quick Win" callout boxes |

### Surface Colors

| Name | Hex | Usage |
|------|-----|-------|
| Card Background | `#242424` | Callout boxes, cards |
| Code Background | `#222222` | Code blocks, table headers |
| Border | `#333333` | Subtle borders, dividers |

---

## Typography

### Web (Tailwind)

| Role | Font | Weight |
|------|------|--------|
| Headlines | Playfair Display | Bold |
| Body | Source Sans 3 | Regular |
| Monospace accents | JetBrains Mono | Regular |

### PDFs (ReportLab)

PDFs use Helvetica (built-in ReportLab font):

| Role | Font | Size | Leading |
|------|------|------|---------|
| Cover title | Helvetica-Bold | 42pt | 48 |
| Chapter title | Helvetica-Bold | 26pt | 32 |
| Section header | Helvetica-Bold | 16pt | 21 |
| Subsection header | Helvetica-Bold | 13pt | 17 |
| Body text | Helvetica | 11pt (Archive) / 9.5pt (Field Guides/Crash Course) | 17.6 / 14 |
| Callout title | Helvetica-Bold | 10pt | 14 |
| Callout body | Helvetica | 10pt | 15 |
| Code | Courier | 9pt | 13 |
| Timestamp | Courier | 10pt | 14 |

---

## Card Styles

- Background: `#242424`
- Left border: 3px solid (color varies by callout type)
- Border radius: 4px
- Padding: 12px
- No outer border, just left accent line

### Callout Types

| Type | Border Color | Background | Title Color |
|------|-------------|-----------|-------------|
| Info | Teal Dim `#0F7B6E` | `#242424` | Teal `#14B8A6` |
| Gold Nugget | Gold `#F59E0B` | `#242010` | Gold `#F59E0B` |
| Key Takeaway | Teal `#14B8A6` | `#1A2420` | Teal `#14B8A6` |
| Quick Win | Green `#22C55E` | `#1A2A1A` | Green `#22C55E` |
| Warning | Red `#EF4444` | `#2A1A1A` | Red `#EF4444` |
| Archivist Observes | Teal Dim `#0F7B6E` | `#1E2428` | Teal `#14B8A6` |

---

## Button Styles

### Primary (Site)
- White border, transparent background
- Text: white
- Hover: inverted (white background, dark text)

### CTA
- Teal accent or gradient (teal-to-pink for emphasis)

---

## Visual Effects

- **Particle effects** — subtle ambient particles on dark background
- **Scroll animations** — Framer Motion-driven entrance animations
- **Gothic library aesthetic** — dark, mysterious, professional
- **No images** — typography-driven design throughout
- **Gradient text** — teal-to-pink gradient on emphasis headlines

---

## PDF Design Elements

### Page Layout
- Page size: US Letter (8.5" × 11")
- Margins: 0.75" left/right, 0.7" top/bottom

### Headers/Footers (body pages)
- Header: "THE ARCHIVIST METHOD" left, product name right, thin border line
- Footer: "THE ARCHIVIST METHOD™ | CLASSIFIED" left, page number right

### Cover Pages
- Teal accent lines at top and bottom (15%–85% width)
- Diamond (◆) icon in teal as logo stand-in
- Title in white, subtitle in teal

### Part Dividers
- Full-page, dark background, centered text
- Part number in dim teal, title in white, description in secondary text
- Teal diamond divider ornament

### Pull Quotes (Complete Archive)
- Full-page, left teal accent border
- Large italic text, centered vertically
- Inserted approximately every 35 pages for visual rhythm

### Teal Divider Ornament
- Horizontal lines with a 45°-rotated teal diamond at center
- Used between major sections

---

## Cinematic UI Elements (Added Feb 17, 2026)

### Micro-Coordinates

Section labels styled as classified document coordinates. Placed in the upper-left corner of major sections.

**Format:**
```
LAT 40.7128° N / LON 74.0060° W  ·  REF: TAM-[SECTION-CODE]-[ID]
```

**Rules:**
- Font: `JetBrains Mono`, `text-xs`, muted teal (`#14B8A6` at 40% opacity)
- Always above the section headline, never below
- Use section-specific `REF:` codes (e.g., `REF: TAM-HERO-001`, `REF: TAM-CASE-017`)
- Coordinates can be stylized/fictional — they signal authenticity, not GPS precision
- Do not use on every element. Reserve for major section anchors only

---

### Background Scroll Evolution

The page background evolves as the user scrolls to reinforce the "going deeper into the archive" metaphor.

| Zone | Background Treatment | Trigger |
|------|---------------------|---------|
| Top (Hero) | Grain texture overlay, high noise | Default / `scroll-y: 0` |
| Mid (Content) | Subtle grid / graph paper lines | ~`scroll-y: 30–60%` |
| Bottom (CTA / Footer) | Clean dark, no texture | ~`scroll-y: 70%+` |

**Implementation notes:**
- Grain: CSS `noise` filter or SVG feTurbulence, ~8% opacity
- Grid: 1px lines at 40px intervals, `#333333` at 6% opacity
- Transition: `opacity` crossfade over 200px scroll range
- Never abrupt — always a slow dissolve

---

### System Log Footer

An animated strip at the very bottom of the page (above the actual footer) that mimics a live operational log. Gives the UI a living-system feel.

**Entry format:**
```
[HH:MM:SS]  SYSTEM  ›  [log message]
```

**Example entries:**
```
[14:32:07]  SYSTEM  ›  Pattern recognition engine: active
[14:32:09]  ARCHIVE ›  685 pages indexed. All records verified.
[14:32:12]  VAULT   ›  Secure access channel established
[14:32:15]  SYSTEM  ›  Awaiting operator input...
```

**Styling:**
- Font: `JetBrains Mono`, `text-xs`
- Color: `#14B8A6` at 60% opacity
- Background: `#0A0A0A` with 1px top border `#333333`
- Scroll horizontally (marquee-style) or cycle entries with a 3s interval
- Entries should feel procedural, not conversational

---

### Case File / Redacted Document Styling

The "From The Archives" section uses document-style cards that look like classified case files.

**Card anatomy:**
- Background: `#0F0F0F` with a 1px border `#2A2A2A`
- Top-left stamp: `CASE FILE #[XXX]` in `JetBrains Mono`, teal, uppercase
- Classification bar: red stripe `#EF4444` at 4px height at card top
- File date: muted, right-aligned, monospace
- Body text: normal serif or sans at 90% opacity

**Redacted text:**
- Hidden text wrapped in `<span class="redacted">` or equivalent
- Default state: black bar covering text (`background: #000`, `color: transparent`)
- Hover state: bar fades, text becomes readable
- CSS:
  ```css
  .redacted {
    background: #000;
    color: transparent;
    transition: background 0.4s ease, color 0.4s ease;
    border-radius: 2px;
    padding: 0 2px;
  }
  .redacted:hover {
    background: transparent;
    color: #E5E5E5;
  }
  ```
- Use for names, locations, diagnosis labels — never for core copy

---

### Skeleton Blueprint Loading

Loading states styled as technical blueprint / draft drawings instead of generic grey boxes.

**Rules:**
- Background: `#0A1520` (very dark blue-tint)
- Skeleton lines: `#1A3A5A` animated shimmer
- Occasional dashed outlines instead of solid borders
- Grid overlay at 20px intervals, `#0F2A40` at 20% opacity
- Use `animate-pulse` (Tailwind) with custom teal shimmer color
- Add `[LOADING ARCHIVE DATA...]` text label in `JetBrains Mono`, dim teal

---

### Glitch Transition

Used on quiz result reveal — a brief distortion effect before the final result settles.

**Sequence:**
1. Result text appears corrupted (characters replaced with `█`, `▓`, `░`, `▒`)
2. Rapid flicker: 3–4 frames of garbled text over ~400ms
3. Text snaps to correct content with a subtle horizontal shift
4. Final state: clean, no distortion

**CSS approach:**
```css
@keyframes glitch {
  0%   { transform: translate(0); filter: none; }
  20%  { transform: translate(-3px, 1px); filter: hue-rotate(90deg); }
  40%  { transform: translate(3px, -1px); filter: hue-rotate(180deg); }
  60%  { transform: translate(-2px, 2px); filter: hue-rotate(270deg); }
  80%  { transform: translate(2px, -2px); filter: hue-rotate(0deg); }
  100% { transform: translate(0); filter: none; }
}
.glitch-active {
  animation: glitch 0.4s ease forwards;
}
```
- Only trigger once on mount/reveal
- Do not loop
- Character swap should happen in JS, not CSS

---

## Design Principles

1. **Not generic SaaS.** Keep the atmospheric, gothic library vibe.
2. **Typography-driven.** No stock photos, no illustrations. Text does the work.
3. **Dark is the brand.** The darkness is intentional — it creates the vault/archive feeling.
4. **Teal is trust.** Pink is urgency. Gold is value. Use deliberately.
5. **Breathe.** White space (dark space) matters. Don't crowd the page.
6. **Every detail signals depth.** Micro-coordinates, system logs, redacted text — these aren't decoration. They reinforce that this system is real, classified, and specific to the user.
