# THE ARCHIVIST METHOD — FUNNEL

> Last updated: February 15, 2026
>
> Source: `TAM-HANDOFF-COMPLETE.md`, Replit codebase structure

---

## The User Journey

```
Landing Page → Quiz (15 questions) → Analyzing Screen → Results Page → Email Capture → Portal Access
```

---

## Step 1: Landing Page

**URL:** `thearchivistmethod.com` (root `/`)

**What the user sees:**
- Hero section with gothic library background aesthetic
- "THE ARCHIVIST METHOD" title
- "Pattern Archaeology, Not Therapy" tagline
- 9 Core Patterns accordion section (expandable, each pattern described)
- FEIR Method explanation
- Therapy vs. Archivist comparison table
- 3-tier pricing section (FREE / $47 / $197)
- FAQ section (accordion)
- Header navigation + Footer on all pages
- Archivist Chatbot widget (floating, bottom-right)

**What happens technically:**
- React SPA loads via Vite
- Framer Motion handles scroll animations and transitions
- Chatbot is a placeholder (not yet wired to Claude API)

**Where conversion happens:**
- CTA buttons in pricing section
- "Start Free" / "Get Started" for Crash Course → Quiz or email capture
- "Buy" buttons for $47 and $197 → Stripe Checkout

---

## Step 2: Quiz (15 Questions)

**URL:** [VERIFY — likely `/quiz` on Replit]

**What the user sees:**
- 15 pattern-identification questions
- Each question designed to surface a specific behavioral pattern
- Progress indicator
- Dark theme consistent with site design

**What happens technically:**
- Questions scored against the 9 patterns
- Responses weighted to determine primary pattern
- No account required at this stage

**The 15 questions:** [VERIFY — exact questions need to be pulled from Replit quiz component]

---

## Step 3: Analyzing Screen

**What the user sees:**
- Animated "analyzing" transition screen
- Creates anticipation and gravitas
- Feels like the system is working to identify their pattern

**What happens technically:**
- Timed delay (likely 3–5 seconds) for dramatic effect
- Quiz results already computed, just held during animation
- Framer Motion handles the transition

---

## Step 4: Results Page

**What the user sees:**
- Their primary pattern revealed (e.g., "Pattern 8: Success Sabotage")
- Pattern description and body signature
- "Does this sound like you?" confirmation moment — the "I see you" energy
- Validation without being soft
- This is the highest-emotion moment in the funnel

**What happens technically:**
- Pattern determined from quiz scoring
- Results displayed dynamically based on computed primary pattern
- Email capture form presented

---

## Step 5: Email Capture

**What the user sees:**
- Email input field
- CTA to receive the free 7-Day Crash Course
- Promise: "Get your pattern-specific crash course"

**What happens technically:**
- Email stored (ConvertKit signup or Supabase users table)
- Triggers 7-Day Crash Course email sequence
- User can access Crash Course PDF

---

## Step 6: Portal Access (Post-Purchase)

**URLs:**
- Login: `/portal/login`
- Dashboard: `/portal/dashboard`
- Preview: `/portal/preview`

**What the user sees:**
- Email-based magic link login (no password)
- Dashboard showing owned products and locked upsells
- PDF viewer modal for reading purchased content
- Download buttons for their purchased PDFs

**What happens technically:**
- Magic link sent via email (Resend)
- JWT token verified, HTTP-only cookie set
- Dashboard queries `purchases` table to show owned products
- PDF download endpoint verifies purchase before serving file

---

## Funnel Metrics Points

| Stage | Key Metric |
|-------|-----------|
| Landing Page | Page views, scroll depth, time on page |
| Quiz Start | Quiz initiation rate (% of visitors) |
| Quiz Complete | Quiz completion rate |
| Results Page | Engagement with results, "Does this sound like you?" |
| Email Capture | Email capture rate |
| Crash Course | Email open rates, click rates through 7-day sequence |
| Purchase ($47) | Conversion from free to Quick-Start |
| Purchase ($197) | Conversion to Complete Archive (direct or upsell) |
| Portal Login | Return rate, portal engagement |

---

## Upsell Points

1. **Crash Course PDF → Quick-Start ($47):** Day 7 of crash course + Day 21 email
2. **Quick-Start → Complete Archive ($197):** End of Field Guide PDF + Day 30 and Day 60 emails
3. **Results Page → Direct Purchase:** After quiz results, before email capture
4. **Portal Dashboard:** Locked product cards visible as upsells
