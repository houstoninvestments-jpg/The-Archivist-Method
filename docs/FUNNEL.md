# THE ARCHIVIST METHOD — FUNNEL

> Last updated: May 5, 2026
>
> Source: live `client/src/`, `api/portal-routes.ts`, the back-matter chapters of `the-archivist-method/` (which describe the ecosystem doorway from the book outward).

---

## Overview

The funnel is not a single linear path. The five-surface ecosystem produces five reader entry paths, each ending at the same protocol depth.

```
         ┌──────────────────────┐
         │  Five Surfaces       │
         │  1. Quiz / Crash     │
         │  2. Book             │
         │  3. Field Guide      │
         │  4. Complete Archive │
         │  5. Pocket Archivist │
         └──────────────────────┘
                    │
   ┌────────────┬───┼──────────┬─────────────┬───────────────┐
   │            │              │             │               │
Social       Book           Recommender    Audio         Pocket Archivist
traffic      first          entry          entry         standalone
```

Every path resolves to the same destination: the user owns the framework, identifies their primary pattern, and has the daily companion (Pocket Archivist) available in the gap.

---

## Five Reader Paths

### Path A — Social Traffic

1. User sees a post, ad, or shared link → lands on `thearchivistmethod.com`
2. Hero section + nine-pattern tease + chatbot widget
3. CTA → Quiz (`/quiz`)
4. Quiz → Analyzing → Results (primary pattern revealed)
5. Email capture → Free Crash Course module (primary pattern, 3,000–5,000 words, embedded in portal)
6. Pocket Archivist limited free tier available
7. Upsell: Field Guide ($67) for that pattern, or Complete Archive ($297)

### Path B — Book First

1. Reader buys or receives a physical copy of the book (or reads the canonical markdown / web version)
2. Back-matter directs them to `thearchivistmethod.com/quiz` (the ecosystem doorway chapter)
3. Quiz identifies primary pattern
4. Reader can redeem 30-day Pocket Archivist trial (if they bought via thearchivistmethod.com — `/reader` redemption)
5. Field Guide / Complete Archive / Pocket Archivist tiers are available

### Path C — Recommender Entry

1. Therapist, coach, or other recommender sends a client to `thearchivistmethod.com`
2. Recommender appendix in the book provides framing for professionals
3. Client follows quiz → results → tier selection
4. Often lands directly at Field Guide or Complete Archive depending on recommender framing

### Path D — Audio Entry

1. Reader hears the work in audio form (audiobook or excerpt-driven content)
2. Lands on `thearchivistmethod.com` via the URL referenced in the audio
3. Quiz → results → tier selection
4. Same downstream as other paths

### Path E — Pocket Archivist Standalone

1. User finds the Pocket Archivist subscription directly ($14.99/mo)
2. Onboards via a brief diagnostic to identify primary pattern
3. Full Pocket Archivist depth across all nine patterns
4. Upsell back to Complete Archive ($297) for the bundled physical book + lifetime portal + lifetime PDF access

---

## Step-by-Step (Path A — primary funnel)

### Step 1: Landing Page

**URL:** `thearchivistmethod.com` (root `/`)

**What the user sees:**
- Hero with the approved confessional + reframe sequence (see `CLAUDE.md` "Approved Hero Section")
- Nine Core Patterns section (expandable cards, hyperspecific body signatures)
- Four Doors Protocol explanation
- Therapy vs. Archivist comparison
- Pricing section (Free / $67 / $297; Pocket Archivist subscription card)
- FAQ (accordion)
- Pocket Archivist chatbot widget (live, voiced by the system prompt)
- Footer with system log strip

**Conversion points:**
- "IDENTIFY MY PATTERN — FREE →" CTA → Quiz
- "Buy" buttons in pricing → Stripe Checkout
- Chatbot widget → Pocket Archivist conversation (limited free)

### Step 2: Quiz

**URL:** `/quiz`

15 pattern-identification questions, weighted scoring across the nine patterns. No account required.

### Step 3: Analyzing Screen

Animated transition. Glitch / settle effect on result reveal.

### Step 4: Results

**URL:** `/results`

- Primary pattern revealed (e.g., "Pattern 8: Success Sabotage")
- Body signature, costs, and the *how does he know* recognition moment
- Pattern probability percentages displayed
- Email capture form

### Step 5: Email Capture + Crash Course

- Email stored in `quiz_users` row with primary pattern, secondary patterns, scores
- 7-Day Crash Course email sequence triggered
- Crash Course PDF available
- Pattern-specific crash course module (3,000–5,000 words) accessible in portal

### Step 6: Portal

**URLs:**
- `/portal` — dashboard
- `/portal/onboarding` — first-time portal user setup
- `/portal/reader` — content reader (book, Field Guide, Complete Archive)

**Behavior:**
- Magic link login (Resend)
- Tier-gated content based on `quiz_users.access_tier` and `purchases`
- PDF reader with progress, bookmarks, highlights, notes
- Pocket Archivist available (limited free or full tier depending on access)

---

## Funnel Metrics

| Stage | Key Metric |
|-------|-----------|
| Landing | Page views, scroll depth, time on page |
| Quiz Start | Quiz initiation rate (% of visitors) |
| Quiz Complete | Quiz completion rate |
| Results | Engagement, recognition response, scroll-to-CTA |
| Email Capture | Email capture rate |
| Crash Course | Email open + click rates across the 7-day sequence |
| Field Guide ($67) | Free → Field Guide conversion |
| Complete Archive ($297) | Conversion to full system |
| Pocket Archivist (subscription) | Standalone subscription conversion + retention |
| Portal Engagement | Return rate, reader progress, Pocket Archivist usage |

---

## Upsell Points

1. **Crash Course → Field Guide ($67):** Day 7 of crash course email + Day 21 follow-up
2. **Field Guide → Complete Archive ($297):** End of Field Guide PDF + Day 30 and Day 60 buyer onboarding emails
3. **Results page → direct purchase:** post-quiz, before email capture (recognition-not-persuasion framing)
4. **Portal dashboard:** locked tier cards visible as upsells
5. **Pocket Archivist free tier → paid:** session cap message + upsell card
6. **Complete Archive → physical book + 30-day trial:** the trial drives sustained Pocket Archivist usage which drives subscription conversion after Day 30
