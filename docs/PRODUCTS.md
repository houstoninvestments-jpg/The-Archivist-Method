# THE ARCHIVIST METHOD — PRODUCTS

> Last updated: May 5, 2026
>
> Source: live Stripe Dashboard, `supabase/stripe-config.ts`, `outputs/`, `scripts/`. Canonical voice for all product copy: `the-archivist-method/`.

---

## Business Model

The Archivist Method is a five-surface ecosystem. Each surface is a different depth of the same framework.

| # | Surface | Price | Role |
|---|---------|-------|------|
| 1 | Quiz / Free Crash Course | Free | Discovery + diagnosis |
| 2 | The Book | TBD (POD softcover bundled with Tier 4) | Atmosphere + framework mastery |
| 3 | The Field Guide | $67 | Pattern-specific application |
| 4 | The Complete Archive | $297 | Full system, all nine patterns + physical book + 30-day Pocket Archivist trial |
| 5 | The Pocket Archivist | $14.99/mo standalone (free with paid tiers; limited free tier) | Daily companion |

Future tier (designed, not yet shipped):
- **The Vault** — $497, premium leather-bound + advanced modules. Launch target: Month 2–3 post-book.

---

## Tier 1: Free Crash Course (with Quiz)

| Field | Value |
|-------|-------|
| **Price** | Free |
| **Purpose** | Lead magnet, email capture, discovery-tier diagnosis |
| **Access Level** | Quiz completion + email signup |
| **Product Slug** | `crash-course` |
| **Stripe** | N/A |

### What's Included

- Two-minute, nine-pattern quiz with instant primary-pattern result
- Pattern-specific crash-course module embedded in the portal — **bounded depth: 3,000–5,000 words for the user's primary pattern only**
- Body signature identification for the primary pattern
- Circuit Break script for the primary pattern
- 7-Day Crash Course PDF (overview of all nine patterns at brief depth)
- Limited Pocket Archivist free tier (primary pattern only, capped turns per session, no memory persistence)

### Crash Course PDF

- **Generator:** `scripts/generate_crash_course.py`
- **Output:** `outputs/THE-ARCHIVIST-METHOD-CRASH-COURSE.pdf`
- **Delivery:** email + portal download after email capture

---

## Tier 3: The Field Guide

| Field | Value |
|-------|-------|
| **Price** | $67 |
| **Purpose** | 90-day protocol for one pattern |
| **Access Level** | Portal access with purchase verification, full Pocket Archivist for that pattern |
| **Product Slug** | `field_guide` (DB tier: `field_guide`) |
| **Stripe Price ID (live)** | `price_1TOlJr11kGDis0LrBP8ITvIC` |

### What's Included

- Pattern-specific Field Guide PDF (one of nine, based on the user's primary pattern)
- Full deep dive on the selected pattern (all 12 sections from the canonical book chapter)
- At-a-glance overviews of the other eight patterns
- The Four Doors Protocol (full framework)
- Foundation content (What This Is, Why Not Therapy, Why This Is Different, Who This Isn't For)
- The 90-Day Protocol (map, daily practice, weekly check-in, progress markers)
- Crisis protocols (emergency, five-minute, triage)
- Tracking templates
- **Pocket Archivist active inside the Field Guide** for that pattern (no separate subscription required)
- Upsell to Complete Archive at end

### PDF Files

- **Generator:** `scripts/generate-field-guides.py` (multi-pattern) and `scripts/generate_field_guide.py <1-9>` (single)
- **Outputs:** `outputs/THE-ARCHIVIST-METHOD-FIELD-GUIDE-*.pdf` (one file per pattern)
- **Delivery:** portal download after purchase, via authenticated route

---

## Tier 4: The Complete Archive

| Field | Value |
|-------|-------|
| **Price** | $297 |
| **Purpose** | Full system across all nine patterns |
| **Access Level** | Lifetime portal access + physical book + 30-day Pocket Archivist trial + full Pocket Archivist depth |
| **Product Slug** | `complete_archive` (DB tier: `complete_archive`) |
| **Stripe Price ID (live)** | `price_1TOlGX11kGDis0LrvJl0SBhm` |

### What's Included

- **Complete Archive PDF** — all nine patterns at field-guide depth
- All nine patterns — full deep dive (not just overview)
- Emergency protocols and crisis triage
- Foundation content
- The Four Doors Protocol (all four doors in depth)
- Pattern combinations and interaction maps
- Relapse protocol
- Context-specific guides: Work, Relationships, Parenting, Body
- Letters from the field
- The 90-Day Protocol (all phases)
- Daily practice, weekly check-in, progress markers
- Resources: when to seek help, finding a therapist, supporting someone, glossary, reading list
- Epilogue
- **Physical book — POD softcover of `the-archivist-method/`** shipped to the buyer
- **30-day Pocket Archivist trial** redeemable at thearchivistmethod.com/reader (use the receipt or order number from the purchase; the 30 days begin at redemption)
- **Lifetime access** to the portal and the Complete Archive PDF

### PDF File

- **Generator:** `scripts/generate_complete_archive.py`
- **Output:** `outputs/THE-ARCHIVIST-METHOD-COMPLETE-ARCHIVE.pdf`
- **Delivery:** portal download after purchase via authenticated route

---

## Tier 5: The Pocket Archivist

| Field | Value |
|-------|-------|
| **Price (standalone)** | $14.99/month |
| **Free with** | Field Guide and Complete Archive purchases (Complete Archive bundles a 30-day trial; Field Guide unlocks the Pocket Archivist for that pattern continuously) |
| **Free tier** | Primary-pattern-only access, capped turns per session, no memory persistence |
| **Purpose** | Daily companion in the gap |

### What It Is

A conversational interface to The Archivist Method, voiced by the system prompt at `docs/character/pocket-archivist-system-prompt.md`. Same voice as the book. Knows the nine patterns, the four doors, the 3–7 second window. Tracks the user's specific pattern, body signature, and circuit break protocol from quiz results and purchase history.

### Free Tier Limits (locked spec)

- Access only to the user's primary pattern
- Capped turns per session (server-side limit; current cap configurable in env)
- No memory persistence across sessions

### Paid Tier Behavior

- All nine patterns accessible
- Full session length
- Persistent memory across sessions
- Available inside the Field Guide for the purchased pattern, inside the Complete Archive for all nine patterns, or as a standalone monthly subscription

### Crisis Routing

The Pocket Archivist does not perform crisis intervention. Crisis triggers route the user to 988 and exit the conversation.

---

## Tier (designed, not yet shipped): The Vault

| Field | Value |
|-------|-------|
| **Price** | $497 |
| **Status** | Designed, not yet shipped |
| **Launch target** | Month 2–3 post-book launch |
| **Includes** | Premium leather-bound book + advanced modules + extended Pocket Archivist depth |

---

## Product-to-Database Mapping

| Product | `purchases.product` value | `quiz_users.access_tier` | Access Granted |
|---------|--------------------------|--------------------------|----------------|
| Free Crash Course | n/a (no purchase) | `free` | Quiz result + crash course module + Pocket Archivist limited free tier |
| Field Guide | `field_guide` | `field_guide` | Portal + Field Guide PDF + Pocket Archivist for that pattern |
| Complete Archive | `complete_archive` | `complete_archive` | Portal + all PDFs + physical book + 30-day Pocket Archivist trial + lifetime access |
| Pocket Archivist standalone | `pocket_archivist_monthly` | unchanged | Subscription flag granting full Pocket Archivist depth across all nine patterns |
