# THE ARCHIVIST METHOD — DESIGN SYSTEM

> Last updated: February 15, 2026
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

## Design Principles

1. **Not generic SaaS.** Keep the atmospheric, gothic library vibe.
2. **Typography-driven.** No stock photos, no illustrations. Text does the work.
3. **Dark is the brand.** The darkness is intentional — it creates the vault/archive feeling.
4. **Teal is trust.** Pink is urgency. Gold is value. Use deliberately.
5. **Breathe.** White space (dark space) matters. Don't crowd the page.
