# THE ARCHIVIST METHOD — PROJECT STATUS

> Last updated: May 5, 2026

---

## Overall: Pre-launch, framework canonical, derived surfaces in alignment pass

The book is locked as the canonical voice source. The repository cleanup waves are complete. The v4.1 master strategic doc is locked. The current phase is propagating the canonical state into every derived surface.

---

## What's Locked (canonical)

### The Book

- **`the-archivist-method/`** — locked as the canonical voice source for the entire ecosystem.
- Four-phase revision complete:
  - Phase 1: banned word + em-dash surgical pass
  - Phase 2: canonical callout extraction and relabeling (seven canonical labels)
  - Phase 3: architectural new writes
  - Phase 4: reading order, friction protocol, final cohesion pass
- Compiled outputs: `builds/the-archivist-method-FULL.md`, `builds/the-archivist-method-FULL.pdf`

### Operational Canonical

- `CLAUDE.md` — operational rules, branch policy (always commit to `main`), brand rules, banned words, locked specs (free crash course depth, portal design, Pocket Archivist free tier), seven callout types, the Four Doors, Spirit Architecture rule, audience framing
- `docs/LANGUAGE.md` — banned word list (canonical, mirrored to `CLAUDE.md` and the Pocket Archivist system prompt)
- `docs/character/pocket-archivist-system-prompt.md` — locked Pocket Archivist persona

### Repo Structure

- Wave 5C cleanup complete: legacy `content/book/` tree archived to `_archive/2026-05-01/` and replaced by `the-archivist-method/`
- `src/data/patterns.ts` and `src/data/interrupts.ts` removed; pattern reference now lives in `shared/schema.ts` (`PatternType`, `patternNames`)
- Replit-era infrastructure removed (auto-merge workflow, scratchpad, light-mode CSS, dead docs)
- Pricing canonical: $67 Field Guide (`price_1TOlJr11kGDis0LrBP8ITvIC`), $297 Complete Archive (`price_1TOlGX11kGDis0LrvJl0SBhm`), $14.99/mo Pocket Archivist standalone

---

## What's Pending for Launch

### Derived Ecosystem Documentation Alignment

This pass — propagating the canonical state into every surface and contributor-facing document. (The work this STATUS update is part of.)

### Quiz Audit + Revision

The 15-question quiz needs an audit pass against the canonical pattern descriptions in the book. Verify scoring weights, question phrasing, and that question copy uses the recognition-not-persuasion register.

### Crash Course Content Drafting

Pattern-specific crash course modules — bounded depth (3,000–5,000 words per pattern, locked spec). Nine modules, embedded in the portal. Distinct from the existing free 7-day email sequence.

### Portal Design Pass

One consistent aesthetic across all nine patterns with subtle pattern-specific atmospheric signals only (locked spec — not nine distinct designs). Reader, dashboard, and onboarding flows need the design pass before launch.

### Email Sequence Drafting

- 7-Day Crash Course nurture (drafted as copy, not yet implemented in automation)
- Field Guide buyer onboarding (5 emails)
- Complete Archive buyer onboarding (5 emails)
- Pocket Archivist trial-to-subscription sequence

### Pocket Archivist Rewrite

The system prompt at `docs/character/pocket-archivist-system-prompt.md` is voice-locked but the runtime implementation needs a pass to enforce the locked free-tier spec (primary pattern only, capped turns per session, no memory persistence) and the paid-tier behavior (all nine patterns, full session length, persistent memory).

### Integration + Upsell Architecture

End-to-end testing of:
- Stripe checkout (Field Guide and Complete Archive in live mode; both flows in test mode on a preview deploy)
- Webhook → portal user creation → tier assignment → magic link delivery (Resend)
- 30-day Pocket Archivist trial redemption flow at `/reader`
- Standalone Pocket Archivist subscription billing

### Final Pre-Launch Checklist

- Stripe live-mode end-to-end purchase test
- Email delivery verification (transactional + sequence)
- PDF download authenticated routes verified for all tiers
- Logo finalization (typography stack is parked pending logo)
- POD softcover print verification for Complete Archive bundling
- Crisis routing test in Pocket Archivist (988 referral)
- Recognition-not-persuasion audit on every public surface

---

## What's Complete

### Canonical Content
- All canonical book chapters in `the-archivist-method/` (modules 0, 1, 1a, 2, 2.5, 3, 4, 5, 6, 7, 8, epilogue, back-matter)
- All nine pattern chapters (12 sections each = 108 pattern files + module 3 index)
- Foundation, framework, implementation, advanced, context, field notes, resources, epilogue
- Back-matter: three-tier framing, ecosystem doorway, Pocket Archivist trial, recommender appendix, closing page
- Compiled book PDF + markdown for review

### PDF Generators (working)
- Complete Archive
- Crash Course (7-day overview)
- Per-pattern Field Guide
- Multi-pattern Field Guide

### Web App (Vercel)
- Landing page with approved hero section (locked, do not revert)
- Quiz, results, portal dashboard, portal onboarding, content reader, vault workbench, vault archive, admin login, admin dashboard
- Wouter routing, Shadcn/ui, TanStack Query, Framer Motion
- Express API on `/api`, `POST /api/portal/webhooks/stripe` for Stripe webhooks, `POST /api/portal/chat` for Pocket Archivist
- Drizzle ORM + Supabase PostgreSQL
- Stripe live mode wired; test mode wired in parallel via `STRIPE_MODE=test` on preview deploys
- Magic link auth (Resend)

### Documentation (this alignment pass)
- `CLAUDE.md` — operational canonical
- `docs/SOUL.md`, `docs/PATTERNS.md`, `docs/LANGUAGE.md`, `docs/COPY-VOICE.md`, `docs/STYLE.md`
- `docs/ARCHITECTURE.md`, `docs/DATABASE.md`, `docs/INTEGRATIONS.md`
- `docs/PRODUCTS.md`, `docs/FUNNEL.md`, `docs/CONTENT-MAP.md`
- `docs/STATUS.md` (this file), `docs/ROADMAP.md`, `docs/README.md`
- `docs/character/pocket-archivist-system-prompt.md`

---

## Parked (Post-Launch)

- Customer name display ("Welcome back, [Name]")
- Advanced progress tracking in portal
- Testimonial collection automation
- Advanced analytics
- The Vault tier ($497, leather-bound + advanced modules) — designed, launch Month 2–3
- SORA AI video content
- Content automation pipeline for Pocket Archivist update letters
- Audio surface (audiobook + excerpt-driven content)
