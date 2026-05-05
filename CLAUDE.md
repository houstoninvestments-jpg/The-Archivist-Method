# The Archivist Method — Claude Code Configuration

## Canonical Source of Truth

Three locked canonical artifacts. Every other surface in this repo derives from them.

| Surface | Canonical Artifact | Authority |
|--------|--------------------|-----------|
| Voice — long-form prose, framework, pattern descriptions, atmosphere | `the-archivist-method/` (the book) | The book is the voice bible. When voice drift is suspected anywhere — website, emails, social, ads, Pocket Archivist replies, quiz copy, crash course — resolve by comparing against the book. |
| Voice — AI surface (Pocket Archivist) | `docs/character/pocket-archivist-system-prompt.md` | Locked Archivist persona for the conversational interface. Reflects the book. |
| Operations — branches, deploy, env vars, brand rules, banned words | This file (`CLAUDE.md`) | Operational canonical. Banned-word list lives in `docs/LANGUAGE.md` and mirrors here + into the system prompt. |

**When in doubt about voice, copy, or pattern description, defer to the canonical book at `the-archivist-method/`.** Do not invent new pattern names, new framework labels, or new door names. Do not introduce alternative phrasings that contradict the book.

## Git Workflow

**Always commit directly to `main`. Never create feature branches or pull requests.**

- Default branch: `main`
- Push all changes directly to `main` with `git push -u origin main`
- Do not create `claude/*` branches
- Do not open pull requests
- Changes pushed to `main` deploy automatically to thearchivistmethod.com via Vercel

## Project Overview

The Archivist Method™ is a dark-themed pattern interruption ecosystem. Five surfaces, layered by depth:

1. **Quiz / Free Crash Course** — discovery + diagnosis. Two minutes, nine patterns, instant result. Pattern-specific crash course module embedded in the portal (3,000–5,000 words per pattern, bounded depth).
2. **The Book** — atmosphere + framework mastery. The locked canonical voice source at `the-archivist-method/`.
3. **The Field Guide** — $67. One pattern, full protocol depth. Pocket Archivist active inside it.
4. **The Complete Archive** — $297. All nine patterns at field-guide depth, advanced material, lifetime access. Includes physical POD softcover of the book and a 30-day Pocket Archivist trial (redeemable at thearchivistmethod.com/reader).
5. **The Pocket Archivist** — $14.99/mo standalone. Free with every paid tier. Free tier exists with primary-pattern-only access, capped turns per session, no memory persistence.

Full-stack TypeScript: React 18 + Express + PostgreSQL + Drizzle ORM, deployed on Vercel.

## Brand Rules

- Pink (#EC4899) ONLY on "NOT" in tagline
- NEVER use emoji anywhere — copy, UI, callouts, AI replies, social, email. Use Lucide icons styled with theme colors when an icon is needed.
- Always "Pattern Archaeology, NOT Therapy"
- AI persona: Direct, not harsh; warm, not soft; clinical when needed
- Typography (current site): Cinzel (display) + DM Serif Display (titles) + Inter (body) + JetBrains Mono (labels). Final typography stack is parked pending logo finalization.
- Colors: #000000 bg, #FAFAFA text, #14B8A6 teal accent, #EC4899 pink accent
- **Spirit Architecture is never announced and never marketed.** It is carried structurally only. The phrase "Spirit Craft" is retired — always "Spirit Architecture" if it must be referenced internally.
- **Audience framing: conditions, not avatars.** Do not write composite personas in internal strategy docs. Describe the condition (the pattern as it operates), not a fictional named buyer.
- **Recognition-not-persuasion.** Every marketing surface should produce the *how does he know* response, not persuasion-style copy.

## The Nine Patterns (canonical names — never altered)

1. The Disappearing Pattern
2. The Apology Loop
3. The Testing Pattern
4. Attraction to Harm
5. The Draining Bond
6. Compliment Deflection
7. The Perfectionism Trap
8. Success Sabotage
9. The Rage Pattern

## The Four Doors Protocol (canonical — no other names)

1. **Focus** — see the pattern while it is running.
2. **Excavation** — find the Original Room (optional).
3. **Interruption** — break the circuit in the 3–7 second gap.
4. **Rewrite** — install a replacement behavior.

There is no "FEIR" acronym. There is no door called "Recognition" and no door called "Override." Recognition is a callout type. Override is a verb (you override the pattern). Neither is a door.

## Three-Layer Voice Register

Every long-form piece operates in three registers:

- **Mechanism** — the science of why the pattern operates (the body signature, the gap, the circuit).
- **Action** — distilled tools (the Circuit Break, the Rewrite, the daily practice).
- **Recognition** — hyperspecific mirror of the reader's internal experience.

## Structural Particularity Rule

**Architecture specific, surface open.** Internal experience is hyperspecific (chest tightness, throat closing, the exact thought, the 3–7 second gap). Surface details stay open: no proper nouns, no specific platforms, no named apps, no celebrity references. The reader supplies the surface; the architecture is universal.

## Seven Canonical Callout Types

Text labels only. ALL CAPS. Square brackets. No emoji. No icons. No color-coded boxes labeled with anything other than the seven names below.

```
[FIELD OBSERVATION]
[PATTERN SNAPSHOT]
[RECOGNITION]
[MECHANISM]
[INTERRUPTION SCRIPT]
[REWRITE FRAME]
[FIELD ASSIGNMENT]
```

These are the only callout labels. Do not invent new ones. Do not relabel ("Key Takeaway", "Quick Win", "Gold Nugget", etc. are retired in long-form copy — visual card variants on the website may render these labels but the label text remains one of the seven).

## Locked Specs (post-book decisions)

These three decisions are locked. Do not redesign them.

1. **Free crash course modules** — bounded depth. 3,000–5,000 words per pattern. Embedded in the portal. Not a free version of the Field Guide; a discovery-tier pattern brief.
2. **Portal design** — one consistent aesthetic across all nine patterns. Subtle pattern-specific atmospheric signals (color accents, micro-copy variations) only. Not nine distinct designs.
3. **Pocket Archivist free tier** — primary-pattern-only access, capped turns per session, no memory persistence. Paid tiers unlock all nine patterns, full session length, and persistent memory.

## Banned Words (canonical — mirrors `docs/LANGUAGE.md` and the Pocket Archivist system prompt)

Never use these in user-facing copy, prose, docs, AI replies, email templates, or content:

journey, healing, heal, toxic, triggers (use "body signature" or "pattern activation" instead), boundaries, self-care, empower, empowerment, transform, validate, hold space, unpack, trauma response (unless clinical context is unambiguous), safe space, coping strategy, coping mechanism, emotional processing, inner child, trauma (as standalone term — "trauma response" with clinical framing OK), therapy-speak, thrive, thriving, wellness, beta, early access, founding (as in "founding member"), TAM (as user-facing abbreviation — always write "The Archivist Method" in full), FEIR (deprecated framework name).

Banned filler phrases: "I understand", "That must be difficult", "Let's explore that", "How does that make you feel?", "Hey friend!", "Hope you're having a great day!", "Great question", "Certainly", "As an AI", "That resonates".

Note: code identifiers (variable names, file names, route slugs) may keep "TAM" — the ban applies only to user-facing copy. Canonical source: `docs/LANGUAGE.md`. Any change to the banned list happens there first; mirror to `docs/character/pocket-archivist-system-prompt.md` and this file.

## Architecture Notes

- Frontend: `client/src/` — Wouter routing, Shadcn/ui, TanStack Query
- Backend: `server/` — Express REST API, all routes prefixed `/api`
- Shared types: `shared/`
- Build: `npm run build` (esbuild), Start: `npm run start`
- DB migrations: `npm run db:push`

## Routes

| Route | Page |
|-------|------|
| / | Landing.tsx |
| /quiz | Quiz.tsx |
| /results | QuizResult.tsx |
| /portal | PortalDashboard.tsx |
| /portal/onboarding | PortalOnboarding.tsx |
| /portal/reader | ContentReader.tsx |
| /vault/workbench | VaultWorkbench.tsx |
| /vault/archive | VaultArchive.tsx |
| /admin | AdminLogin.tsx |
| /admin/dashboard | AdminDashboard.tsx |

## Important Notes

- STRIPE_SECRET_KEY must be a `sk_test_` key for testing (current live key is expired)
- PDF downloads served from `public/downloads/` via authenticated routes
- God mode activated per-user from admin dashboard only

## Stripe Test Mode

The app supports a parallel test-mode Stripe flow alongside live. Mode is
controlled by `STRIPE_MODE` (server) and `VITE_STRIPE_MODE` (client). When
unset, mode defaults to `live` and existing live behavior is unchanged.

**Server env vars (Vercel → Project → Settings → Environment Variables):**

| Var | Where to get it |
|-----|-----------------|
| `STRIPE_MODE` | set to `test` to flip; unset or `live` for production |
| `STRIPE_TEST_SECRET_KEY` | Stripe Dashboard → toggle **Test mode** ON → Developers → API keys → "Secret key" (starts `sk_test_...`) |
| `STRIPE_TEST_WEBHOOK_SECRET` | Stripe Dashboard → toggle **Test mode** ON → Developers → Webhooks → your endpoint → "Signing secret" (starts `whsec_...`) |
| `STRIPE_TEST_PRICE_FIELD_GUIDE` | Stripe Dashboard (Test mode) → Products → Field Guide → Price ID |
| `STRIPE_TEST_PRICE_COMPLETE_ARCHIVE` | Stripe Dashboard (Test mode) → Products → Complete Archive → Price ID |
| `STRIPE_TEST_PRICE_FIELD_GUIDE_UPSELL` | Stripe Dashboard (Test mode) → Products → $37 upsell → Price ID (optional) |

**Client env vars (Vite — must be set BEFORE build):**

| Var | Where to get it |
|-----|-----------------|
| `VITE_STRIPE_MODE` | `test` to flip; unset or `live` for production |
| `VITE_STRIPE_TEST_PUBLISHABLE_KEY` | Stripe Dashboard (Test mode) → Developers → API keys → "Publishable key" (starts `pk_test_...`) |
| `VITE_STRIPE_TEST_PRICE_FIELD_GUIDE` | same Price ID as `STRIPE_TEST_PRICE_FIELD_GUIDE` |
| `VITE_STRIPE_TEST_PRICE_COMPLETE_ARCHIVE` | same Price ID as `STRIPE_TEST_PRICE_COMPLETE_ARCHIVE` |
| `VITE_STRIPE_TEST_PAYMENT_LINK_QUICK_START` | Stripe Dashboard (Test mode) → Payment links → create test link for Field Guide → copy URL (optional; only needed if Landing/Checkout buttons should hit a hosted test link) |
| `VITE_STRIPE_TEST_PAYMENT_LINK_COMPLETE_ARCHIVE` | Stripe Dashboard (Test mode) → Payment links → create test link for Complete Archive → copy URL (optional) |

**Webhook endpoint:** the same URL (`/api/portal/webhooks/stripe`) accepts
both live and test signatures — the handler tries every secret in
`STRIPE_WEBHOOK_SECRET` and `STRIPE_TEST_WEBHOOK_SECRET` until one verifies.
Add the production URL as a webhook endpoint in **both** the live Stripe
dashboard and the test-mode Stripe dashboard so events from each fire here.

**Flipping a single deploy into test mode without breaking live:**

The Production deploy on `main` always stays in live mode. Test mode runs
on a Vercel Preview URL — `main` is untouched.

Recommended (no extra branch needed):
```bash
# From main; creates a one-off preview build with test-mode env overrides.
vercel deploy \
  --build-env STRIPE_MODE=test \
  --build-env VITE_STRIPE_MODE=test \
  --build-env VITE_STRIPE_TEST_PUBLISHABLE_KEY=pk_test_... \
  --build-env VITE_STRIPE_TEST_PRICE_FIELD_GUIDE=price_test_... \
  --build-env VITE_STRIPE_TEST_PRICE_COMPLETE_ARCHIVE=price_test_... \
  --env STRIPE_TEST_SECRET_KEY=sk_test_... \
  --env STRIPE_TEST_WEBHOOK_SECRET=whsec_... \
  --env STRIPE_TEST_PRICE_FIELD_GUIDE=price_test_... \
  --env STRIPE_TEST_PRICE_COMPLETE_ARCHIVE=price_test_...
```
Vercel returns a preview URL. The live `main` deploy keeps live keys/prices.

End-to-end test on the preview:
- Use Stripe test card `4242 4242 4242 4242`, any future expiry, any CVC.
- Stripe sends the webhook to the production URL; the handler verifies with
  `STRIPE_TEST_WEBHOOK_SECRET` and inserts a `portal_users` row exactly like
  a real purchase, granting portal access.

**Never** set `STRIPE_MODE=test` on Production scope in the Vercel env UI —
that would route real customers through test prices and break live revenue.

## Automation Permissions

Claude is authorized to perform the following without asking for confirmation:

**GitHub (via `gh` CLI)**
- Merge PRs once a fix is complete and CI passes
- Create PRs, check PR status, view CI/build logs
- Push branches and force-push `claude/*` branches only

**Vercel (via `vercel` CLI)**
- Check environment variable status (`vercel env ls`)
- Report missing env vars and suggest values
- View deployment status and logs after a push

**General**
- Run `npm run build` and `npm run db:push` after schema/dependency changes
- Retry failed git pushes up to 4 times with exponential backoff
- Self-diagnose deployment failures using CLI tools before asking the user

## Setup Checklist (one-time, on developer machine)

```bash
brew install gh && gh auth login        # GitHub CLI
npm i -g vercel && vercel login         # Vercel CLI
```

Once both CLIs are authenticated, Claude handles the full deploy-and-verify loop automatically.

## Approved Hero Section (do not revert)
COPY (in order):
- Brand: "THE ARCHIVIST METHOD™"
- File tag: "// SUBJECT FILE LOADING..."
- Confessional lines: "You've watched yourself do it." / "You've tried to stop." / "You did it anyway."
- Reframe: "THAT'S NOT WHO YOU ARE." / "THAT'S A PATTERN RUNNING."
- Final: "THE PATTERN HAS A NAME." + blinking cursor
- Subtext: "Your body sends a signal 3 to 7 seconds before it fires. That signal is learnable. This is the method."
- CTA: "IDENTIFY MY PATTERN — FREE →"
- Meta: "2 MINUTES · 9 PATTERNS · INSTANT RESULTS"
- Tagline: "PATTERN ARCHAEOLOGY, NOT THERAPY." — NOT in magenta #EC4899
ANIMATION: Sequential reveal — brand → divider draws → file tag slides from left → confessional lines reveal upward → separator → reframe drops in bold → separator → final line flickers (CRT effect) → cursor blinks → subtext → CTA → meta
DESIGN: Archivist seated image background with parallax. Scanline effect rgba(0,255,194,0.04). Dark background. No solid fill on CTA button — teal border only.
