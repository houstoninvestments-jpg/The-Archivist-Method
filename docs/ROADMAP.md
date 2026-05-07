# THE ARCHIVIST METHOD — ROADMAP

> Last updated: May 7, 2026

---

## The Bigger Vision

TAM is a digital products business. Four products, one funnel, hands-off operation after launch. The roadmap is designed to scale revenue without scaling complexity.

The four products:

- **Free Crash Course** — per-pattern portal modules, the discovery tier
- **Field Guide** ($67) — single pattern, full protocol depth
- **Complete Archive** ($297) — all nine patterns at field-guide depth, includes physical POD softcover of the book and a 30-day Pocket Archivist trial
- **Pocket Archivist** ($14.99/month standalone) — conversational AI interface; free-tier access to primary pattern only; free with Field Guide for the activated pattern; free for 30 days with Complete Archive

---

## Phase 1: Launch (Substantially complete, awaiting soft launch)

**Goal:** Soft launch and first sales. Build is substantially complete; revenue has not yet landed.

- Stripe live mode wired
- Resend email delivery wired (magic links and sequences)
- End-to-end payment flow exists
- Four products live: Free Crash Course (nine per-pattern portal modules, 3,000–5,000 words each), Field Guide ($67), Complete Archive ($297), Pocket Archivist ($14.99/month standalone with free-tier access to primary pattern)
- Resend email sequences active

**What success looks like:** Someone can find the site, take the quiz, get their pattern, sign up for the Free Crash Course, and buy a paid product — all without Aaron touching anything. **What remains:** soft launch and first sales.

---

## Phase 2: Nurture & Convert (Post-Launch Month 1)

**Goal:** Automated email sequences drive conversions from free to paid.

- 7-Day Crash Course email sequence live in Resend (11 emails, Day 0–21) — acquisition and onboarding funnel that feeds into the per-pattern portal modules. The email sequence and the portal Crash Course are distinct: the sequence does acquisition and nurture; the portal modules are the actual free-tier deliverable.
- Field Guide buyer onboarding live in Resend (5 emails, Day 0–60)
- Archive buyer onboarding live in Resend (5 emails, Day 0–90)
- Monitor conversion rates: Free Crash Course → $67, $67 → $297, direct → $297, Pocket Archivist trial → paid subscription
- Basic analytics on funnel performance

---

## Phase 3: Vault V2 (Post-Launch Month 2–3)

**Goal:** The Vault becomes the interactive post-purchase experience for Complete Archive buyers.

- Workbench wing: pattern activation logging, brain dumps, streak tracking, weekly stats
- Archive wing: browse/search all content, reading progress, bookmarks
- Vault integrated into portal dashboard
- Requires: Vault schema deployed to Supabase production, components connected

---

## Phase 4: Content Automation (Month 3–6)

**Goal:** Scale content production with AI pipeline to drive organic traffic and social growth.

### The Pipeline

```
NotebookLM → ElevenLabs → Claude API → Shorts + Long-form
```

- **Input:** TAM content (145 markdown files)
- **Output:**
  - 4 short-form videos/day (TikTok, Reels, Shorts)
  - 2 long-form videos/week (YouTube)
- **Tools:** NotebookLM for research summaries, ElevenLabs for voice generation, Claude API for script writing

### SORA AI Video Content

- AI-generated video content for bars/restaurants (separate revenue stream)
- Uses SORA (OpenAI video generation) [VERIFY — depends on availability]

---

## Phase 5: Revenue Scaling (Month 6–12)

**Target:** $200,000–$400,000 year one revenue.

Revenue model:
- Free Crash Course → $67 Field Guide conversion (target: 10–15%)
- Field Guide → $297 Archive upsell (target: 20–30%)
- Direct $297 purchases from organic traffic
- Pocket Archivist subscription MRR ($14.99/month standalone)
- Pocket Archivist trial-to-paid conversion (30-day trial activates with Complete Archive purchase)
- Content automation drives organic reach
- Email sequences do the selling

---

## What's NOT on the Roadmap

| Never | Why |
|-------|-----|
| Affiliate programs | TAM doesn't need network marketing. The product sells itself. |
| Coaching calls | TAM is a system, not a service. No 1:1 time-for-money model. |
| Group programs | Same as coaching — doesn't scale, doesn't fit the brand. |
| Live events | Digital-only. No physical presence needed. |
| Physical products beyond the book | The Complete Archive includes a print-on-demand softcover of the book. No other merch, no standalone printed books. |

---

## Guiding Principle

> Build the machine. Turn it on. Let it run.
>
> Every decision should move toward: a product that sells without Aaron present, delivers without Aaron present, and improves without Aaron present.
