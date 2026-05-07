# Portal Audit — May 7, 2026

> Read-only audit ahead of Step 4 of the launch sequence. No code changes proposed inside this document. Aaron decides what to fix next, in a separate prompt.

---

## Executive summary

The portal has a working backbone: Stripe live + test wired for the $67 and $297 SKUs, Resend email infrastructure, JWT magic-link auth, Sentry on both client and server, a Vercel build with a serverless Express bundle, and a portal reader that successfully renders the book content via a custom markdown parser. The biggest blocker is that **the nine canonical crash course markdown files shipped in Step 3 are not wired to anything**. The `/crash-course/:patternId` route serves a hardcoded TypeScript component (`CrashCourse.tsx`) with seven inlined "days" of content that predates the new free-tier modules; the canonical files at `the-archivist-method/crash-course/` are not loaded, rendered, or referenced anywhere outside their git path. Closing the gap between the crash course content set and the portal that delivers it is the single highest-leverage item for Step 4. The agent pass also surfaced two security blockers that must be closed before public access: a hardcoded owner-tier JWT in the client bundle and a static dev-bypass header on the server.

The second blocker is **Pocket Archivist as a SKU**: it exists in the rate-limit code (15/75/300 messages/day per tier) and is named in every crash course Section 7, but the $14.99/month subscription is not in the Stripe config, no `customer.subscription.*` webhooks are handled, and no trial activation/expiration logic exists in the schema or code. The third blocker is **design-system drift**: the implementation is teal + magenta + dark grayscale on Bebas Neue / Inter / JetBrains Mono — not amber + teal on Cinzel / EB Garamond. Cinzel and EB Garamond load from Google Fonts but are not used as the system serif/sans defaults.

Effort estimate to close the three blockers: **medium**. The crash course wiring is mechanical (markdown loader + reader page + scope gate). The Pocket Archivist subscription is a focused Stripe + schema + webhook addition. The design refresh is the largest of the three because it touches every page; whether the team takes a "minimum viable amber+teal+Cinzel pass" or a full pass is a scoping call.

Polish items (404 page, email sequence copy, sitemap, account/billing UI) and several DEFERRED items (Vault V2, content automation pipeline) sit downstream of Step 4 and do not block soft launch.

---

## Findings by area

### Area 1 — Design system implementation

**Current state.** Tailwind is configured with class-based dark mode, with all theme colors bound to CSS variables in `client/src/index.css`. The variables resolve to a teal primary (`hsl(163 100% 50%)` / `#00FFC2`), a magenta accent (`#EC4899`), and dark grayscale neutrals — not amber + teal. The CSS variable convention is correct (HSL with alpha-value placeholders, shadcn-compatible), but the values do not match the locked spec. Cinzel and EB Garamond are loaded from Google Fonts in `client/index.html`, but the `--font-sans` / `--font-serif` / `--font-mono` variables resolve to Inter, Georgia, and JetBrains Mono. Three pages use EB Garamond via inline styles (Quiz, Archivist, Portal); Cinzel is loaded but never actually applied in any component. Glassmorphism appears in exactly one place (`client/src/components/Header.tsx` uses `backdrop-blur-[10px]`) and is not codified as a reusable utility or component.

**Findings.**
- Color tokens drift from spec: amber primary is absent; teal+magenta+dark grayscale are the de-facto palette across `client/src/index.css`, all page-level inline styles in `Portal.tsx`, `NewPortal.tsx`, `CrashCourse.tsx`, `Privacy.tsx`, `Terms.tsx`. **SHIP-CRITICAL.**
- Cinzel loaded but never applied as `--font-sans` or any other system token. Used in zero components. **SHIP-CRITICAL.**
- EB Garamond used only as inline `fontFamily` strings in three pages, not as the system serif. **SHIP-CRITICAL.**
- Glassmorphism is essentially absent (1 instance, in Header). The spec calls for a glassmorphic ancient-library aesthetic; the implementation is solid dark surfaces with neon accents. **SHIP-CRITICAL.**
- Purple / violet / fuchsia / indigo: zero usage. Clean. **HOLD.**
- FEIR acronym leak: zero usage in user-facing code. Framework named "Four Doors" with full names of Focus, Excavation, Interruption, Rewrite. Clean. **HOLD.**
- Dark mode: correctly configured via `darkMode: ["class"]` and hardcoded `class="dark"` on `<html>` in `client/index.html`. **HOLD.**
- Touch targets: shadcn `Button` default is `min-h-9` (36px), `sm` is 32px, `lg` is 40px. WCAG 2.1 minimum is 44x44. **POLISH** (real risk on phones but not a launch blocker).

### Area 2 — Portal route inventory

**Current state.** Routing uses Wouter. `client/src/App.tsx` registers fifteen routes with lazy-loaded page components and a generic 404 fallback. The route table in CLAUDE.md is partially out of date: routes for `/portal/onboarding`, `/portal/reader`, `/vault/workbench`, `/vault/archive` are documented but not registered (the actual reader lives at `/portal` via `Portal.tsx`, which loads book content from the `/api/portal/toc` and `/api/portal/section/:id` endpoints). The `Header` and `Footer` components are hidden on portal, quiz, results, admin, landing, and crash-course routes per the layout logic in `App.tsx`.

**Findings.**
- Registered routes: `/`, `/quiz`, `/results`, `/portal/login`, `/portal/crash-course` (redirects to `/portal`), `/crash-course/:patternId`, `/portal/dev`, `/portal`, `/admin`, `/admin/dashboard`, `/terms`, `/privacy`, `/contact`, `/checkout`, plus the 404. **HOLD** as inventory.
- No password-reset route. Auth is magic-link only via JWT — password reset is not applicable in the current model. **HOLD** (intentional design, not a gap).
- No sign-up route. Sign-up happens implicitly via quiz completion (which writes a `quizUsers` row) or via Stripe purchase (which writes a `portalUsers` row). **HOLD** if intentional; **FLAG as open question** if a standalone sign-up flow was intended.
- No standalone Field Guide content route. Field Guide and Complete Archive content are served through the same `/portal` reader; access is gated server-side by the `/api/portal/section/:id` endpoint based on `accessTier`. **HOLD** (architecturally intentional).
- No standalone Pocket Archivist interface route. The Pocket Archivist exists as the `ArchivistPanel` component embedded inside `Portal.tsx` (per `client/src/pages/portal/Archivist.tsx`). There is no independent surface a Pocket-Archivist-only subscriber would land on. **BLOCKER** if Pocket Archivist standalone is intended to ship in Step 4.
- No `/account` or `/billing` page. Users cannot view their tier, see purchase history, or manage subscription state from the portal UI. **SHIP-CRITICAL.**
- `not-found.tsx` is a generic placeholder ("Did you forget to add the page to the router?") with light-gray styling that visually clashes with the rest of the dark portal. **POLISH.**
- CLAUDE.md route table contains stale references to `/portal/onboarding`, `/portal/reader`, `/vault/workbench`, `/vault/archive`. **POLISH** (doc drift, not code drift).

### Area 3 — Crash course delivery

**Current state.** Two parallel crash-course delivery surfaces exist, only one of which connects to the canonical content. The first is `Portal.tsx` (the `/portal` route), which loads from `/api/portal/toc` and renders sections via `client/src/pages/portal/markdown.tsx`. That renderer parses ═══-delimited callouts but only recognizes book-style callouts identified by emoji prefixes (💎 GOLD NUGGET, 🔑 KEY TAKEAWAYS, ⚡ QUICK WIN, 🔌 CIRCUIT BREAK, 📜 THE ARCHIVIST OBSERVES, ⚠️ generic). The second is `CrashCourse.tsx` (the `/crash-course/:patternId` route), which displays a hardcoded seven-day program built from inline TypeScript objects (`DAYS`, `BODY_SIGNATURES`, `CIRCUIT_BREAKS`) — content unrelated to the canonical crash course markdown files.

The nine canonical files at `the-archivist-method/crash-course/` are not loaded anywhere. `api/_content.ts` maps pattern keys to book directories (`pattern-1-disappearing`, `pattern-2-apology-loop`, etc.) but does not include the `crash-course/` directory. `grep -r "crash-course/"` across `client/src`, `api`, and `server` returns only the URL path references, never a filesystem reference to the markdown files.

The crash course markdown files use a different callout convention than the book: bare ALL-CAPS labels in square brackets (`[FIELD OBSERVATION]`, `[RECOGNITION]`, `[MECHANISM]`, `[PATTERN SNAPSHOT]`, `[INTERRUPTION SCRIPT]`, `[REWRITE FRAME]`, `[FIELD ASSIGNMENT]`), per the canonical voice rules in CLAUDE.md (no emojis in user-facing copy). The existing `markdown.tsx` parser does not recognize this format.

**Findings.**
- The canonical crash course markdown files are not loaded by any portal route. **BLOCKER.**
- `CrashCourse.tsx` serves hardcoded "Day 1" through "Day 7" content with a single generic body-signature and circuit-break per pattern, not the nine 3,500-3,900-word per-pattern modules. **BLOCKER.**
- The portal markdown parser (`markdown.tsx`) does not recognize the crash course's seven canonical callouts. Even if the files were loaded, callouts would render as plain text without distinctive styling. **BLOCKER.**
- No per-pattern next/previous navigation between the nine crash course modules. **SHIP-CRITICAL.**
- Reading-progress tracking exists for book sections (`/api/portal/section/:id` writes a `progress` record) but no equivalent for crash course modules. **SHIP-CRITICAL.**
- Free-tier scope gate exists at the section level (server-side check in the portal section route) but no scope gate is wired for the crash course modules because they are not loaded by any route that runs through that gate. **BLOCKER** (entitlement check is missing for the new content).
- `api/_content.ts` should be extended to register the crash course directory if Step 4 routes the new files through the existing reader. **SHIP-CRITICAL** (path forward, not a free-standing finding).

### Area 4 — Auth + payment + product gating

**Current state.** Auth is a custom JWT magic-link implementation (`server/portal/auth.ts`, `server/portal/routes.ts`) with cookies (`auth_token`, httpOnly, 7-day max-age). The `@supabase/supabase-js` package is installed but not used for authentication; `client/src/lib/supabase.ts` is a localStorage-backed mock. The schema (`shared/schema.ts`) defines `quizUsers` (with `accessTier`, `chatSessionCount`, `crashCourseDay`, `magicLinkToken`, `onboardingCompleted`), `portalUsers`, and `purchases` tables. Stripe is wired with live and test price IDs for Field Guide ($67) and Complete Archive ($297), plus a $37 Field Guide upsell. The webhook at `/webhooks/stripe` (`api/portal-routes.ts:1088`) handles only `checkout.session.completed`. Product entitlement is calculated from the `purchases` table by `calculateUserAccess()` in `server/portal/products.tsx`, mirrored to `quizUsers.accessTier` on purchase, and read on every protected route. Pocket Archivist rate-limiting exists (`server/lib/pocket-rate-limit.ts`: 15/75/300 messages per day for free/Field Guide/Complete Archive tiers).

**Findings.**
- Pocket Archivist standalone subscription ($14.99/month) is not in `shared/stripe-config.ts`. **BLOCKER** if Pocket Archivist standalone ships in Step 4.
- No `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed` webhook handlers. **BLOCKER** for any subscription product.
- Schema has zero subscription fields: no `trial_end`, no `subscription_status`, no `subscription_id`, no `current_period_end`. **BLOCKER** for the Pocket Archivist trial logic the crash courses promise.
- Pocket Archivist 30-day trial activation logic is absent. The crash course Section 7 in every pattern names the trial as a Complete Archive benefit; the code has no mechanism to start, expire, or convert the trial. **BLOCKER.**
- Tier mirroring drift risk: `quizUsers.accessTier` and `purchases` table can drift if a webhook event is missed or replayed. No reconciliation cron. **POLISH** (low-likelihood drift, but worth flagging).
- Magic-link expiration is 1 hour (per email body copy in `server/portal/routes.ts:182`); no rate-limiting on link requests is visible. **POLISH** (anti-abuse).
- CLAUDE.md says "Auth: Supabase Auth (per package.json)" — code contradicts. Auth is custom JWT. Either the doc updates or Supabase Auth gets wired. **FLAG for direction.**
- **Hardcoded dev-bypass JWT in `client/src/pages/PortalLogin.tsx`** (per agent finding, lines 23–24): a literal owner-tier JWT string is embedded in the client bundle. Anyone who reads the bundle can authenticate as the owner. **BLOCKER** — must be removed or env-gated before public access.
- `localStorage.dev_bypass` flag + `X-Dev-Bypass: aaron-testing-bypass-2026` header (`api/portal-routes.ts:42–46`) allow bypassing all auth checks on `/dev/reader/*` endpoints. The header value is a static string. **BLOCKER** — must be removed or env-gated before public access.
- AdminDashboard access allowlists a single email (`admin@example.com` per agent finding). The allowlist string lives in code rather than env. **POLISH** (acceptable for solo operator, but flag for visibility).

### Area 5 — Email infrastructure

**Current state.** Resend is wired through `server/lib/resend.ts` (singleton lazy-initialized from `RESEND_API_KEY`). The `server/emails/` directory contains exactly two files: `queue.ts` (a queue manager that schedules and dispatches sequence emails) and `sequences.ts` (a definitions file with three sequences — `crash_course`, `field_guide`, `complete_archive` — each containing nine pattern-keyed entries with seven email slots at delays `[0, 2, 4, 6, 8, 11, 14]`). Subjects and bodies in `sequences.ts` are TODO placeholders, not finished copy. Purchase confirmation emails use a separate code path (`api/portal-routes.ts` after webhook) with inline HTML+text using teal accents and Helvetica Neue. Magic-link emails are sent inline from `server/portal/routes.ts` and `api/portal-routes.ts`.

**Findings.**
- Email sequence infrastructure (queue, scheduler, cron-driven dispatch) is complete. **HOLD.**
- All 63 crash course emails (9 patterns × 7 emails) and all 126 buyer-sequence emails are TODO scaffolds, not finished copy. **SHIP-CRITICAL** for the Phase 2 ROADMAP claim that the sequence is "live."
- Purchase confirmation emails styled with teal + Helvetica Neue + grayscale. Not amber + teal + Cinzel + EB Garamond per spec. **POLISH** (ship-acceptable; can be revised during the design refresh).
- Magic-link email body uses inline HTML with `#00FFD1` (teal) labels and Slate gray; not the locked design palette. **POLISH.**
- No abandoned-cart sequence visible. Whether one is intended for Step 4 is unclear. **FLAG for direction.**
- Resend SDK is on version `^6.9.3`; the React Email component library is not installed (templates are inline HTML strings). **HOLD** (deliberate, simpler).

### Area 6 — Mobile responsiveness

**Current state.** The viewport meta tag is set correctly (`width=device-width, initial-scale=1`). Landing page uses 11 breakpoint variants (sm:/md:/lg:) and is meaningfully responsive. Portal page (the book reader) uses a sidebar that is hidden behind a hamburger on mobile via the `Sidebar` component. The crash course route (`CrashCourse.tsx`) is constrained to `maxWidth: 480px` and stacks naturally on narrow viewports. Quiz uses inline-styled flex layouts with no breakpoint variants. AdminDashboard uses unwrapped `<table>` elements that will overflow on narrow viewports.

**Findings.**
- Landing page: substantially responsive. **HOLD.**
- CrashCourse.tsx (the legacy route): naturally narrow, mobile-friendly. **HOLD** (with the caveat that this route should be replaced per Area 3 findings).
- Portal reader (`Portal.tsx`): sidebar-and-content layout works on mobile based on code reading; **flag for real-device verification**. **POLISH** (likely OK, verify on phone).
- Quiz: no responsive breakpoints, relies on flex centering. Likely OK on phone but unverified. **POLISH.**
- AdminDashboard: unwrapped tables will overflow. Not a public-facing route. **DEFERRED.**
- Touch targets: shadcn `Button` defaults to 36px (`min-h-9`), below the 44x44 WCAG minimum. Affects every button in the portal. **POLISH.**
- Many pages set explicit `style={{ padding: ... }}` in pixel units rather than responsive Tailwind utilities. Difficult to audit without device testing. **POLISH.**

### Area 7 — Critical missing pieces

**Current state.** Sentry is wired client-side (`client/src/lib/sentry.ts`) and server-side (`server/sentry.ts`), gated on environment-variable presence. The 404 page exists but is a generic light-themed placeholder. Legal pages exist (`Terms.tsx`, `Privacy.tsx`, `Contact.tsx`). SEO basics are present in `client/index.html` (title, description, canonical URL, OG image at 1200x630, og:title, og:description). `public/robots.txt` exists. There is no `sitemap.xml`. There is no analytics integration visible (no `gtag`, no Plausible, no Posthog imports). There is no cookie consent banner.

**Findings.**
- 404 page (`not-found.tsx`) is a placeholder with light-gray styling that breaks the visual continuity of the dark portal. Mentions a debug-style message ("Did you forget to add the page to the router?"). **SHIP-CRITICAL.**
- Loading states: `App.tsx` has a single `PageLoader` component used as the Suspense fallback — a blank `#0A0A0A` div. Every lazy-loaded route shows the same blank screen on first navigation. **POLISH.**
- Empty states: hard to confirm without running the app. The Portal reader checks for missing TOC and missing sections, but other empty states (no purchases yet, no chat history, etc.) are not visible from a code read. **POLISH** (verify during Step 4).
- SEO: title, meta description, canonical, OG tags present. **HOLD.**
- Sitemap: absent. **POLISH.**
- Robots: present. **HOLD.**
- Analytics: no `<script>` tags or imports for any analytics platform. ROADMAP Phase 2 mentions "Basic analytics on funnel performance" — currently not wired. **SHIP-CRITICAL** if conversion tracking matters for soft launch.
- Sentry: wired both ends; gated on env vars. **HOLD.**
- Legal: Terms, Privacy, Contact present. No refund policy page. **POLISH.**
- Cookie consent: absent. Jurisdiction-dependent. **FLAG for direction.**
- Accessibility: shadcn UI components ship with reasonable ARIA coverage. Custom inline-styled buttons in `CrashCourse.tsx`, `Portal.tsx`, etc. are not consistently labeled. Color contrast on `#666666` muted text against `#0A0A0A` background is approximately 4.85:1 — passes WCAG AA for normal text. **POLISH.**
- Refund policy: not visible as a route. ROADMAP does not mention one. **FLAG for direction.**
- "Forgot magic link?" / "Resend link" UX: not visible. If a user lets a 1-hour magic link expire, the recovery path is to re-enter their email at `/portal/login`. Adequate. **HOLD.**

---

## Consolidated severity buckets

### BLOCKERS (cross-area)

1. **Crash course markdown files not wired to portal.** The nine canonical files at `the-archivist-method/crash-course/` are not loaded by any route. (Area 3)
2. **`CrashCourse.tsx` serves hardcoded content.** The current `/crash-course/:patternId` page is a seven-day TypeScript program unrelated to the new modules. (Area 3)
3. **Markdown parser does not recognize crash course callouts.** The `markdown.tsx` parser handles emoji-prefixed book callouts; the new bracketed labels (`[FIELD OBSERVATION]` etc.) will render as plain text. (Area 3)
4. **Free-tier scope gate is not connected to the new crash course content.** Entitlement check exists for book sections but not for the new modules. (Area 3)
5. **Pocket Archivist subscription not in Stripe config.** $14.99/month price ID is missing. (Area 4)
6. **No subscription webhook handlers.** `customer.subscription.*` and `invoice.payment_failed` events are not consumed. (Area 4)
7. **Schema has no subscription fields.** No `trial_end`, `subscription_status`, `subscription_id`, `current_period_end`. (Area 4)
8. **Pocket Archivist trial logic absent.** Activation, expiration, conversion all missing. (Area 4)
9. **Pocket Archivist standalone landing surface absent.** No route for a subscribers-only experience exists outside the embedded panel. (Area 2; only a blocker if standalone Pocket Archivist ships in Step 4.)
10. **Hardcoded dev-bypass JWT in `PortalLogin.tsx`.** Owner-tier auth credential in the client bundle. (Area 4)
11. **Static `X-Dev-Bypass` header value bypasses auth on `/dev/reader/*` endpoints.** Hardcoded string in server code. (Area 4)

### SHIP-CRITICAL (cross-area)

1. Color tokens drift from spec (teal+magenta deployed; amber primary missing). (Area 1)
2. Cinzel loaded but never applied. (Area 1)
3. EB Garamond used only as inline strings, not as system serif. (Area 1)
4. Glassmorphism is essentially absent across the portal. (Area 1)
5. No `/account` or `/billing` page; users cannot see their tier or manage subscription. (Area 2)
6. No per-pattern next/previous navigation across the nine crash course modules. (Area 3)
7. No reading-progress tracking for crash course modules. (Area 3)
8. Email sequences are TODO scaffolds; ROADMAP Phase 2 implicitly claims they are live copy. (Area 5)
9. 404 page is an off-brand placeholder. (Area 7)
10. Analytics not wired; conversion tracking unavailable for soft launch. (Area 7)

### POLISH (cross-area)

- Touch targets below 44x44 in shadcn buttons. (Area 1, Area 6)
- CLAUDE.md route table doc drift (`/portal/onboarding`, `/portal/reader`, `/vault/*`). (Area 2)
- Tier mirroring between `purchases` and `quizUsers.accessTier` lacks a reconciliation cron. (Area 4)
- Magic-link request rate-limiting not visible. (Area 4)
- Purchase confirmation and magic-link email styling does not match the locked palette. (Area 5)
- Quiz, AdminDashboard, and several portal pages have inconsistent or absent breakpoint coverage. (Area 6)
- Loading states are blank dark divs. (Area 7)
- No sitemap.xml. (Area 7)
- No refund policy page. (Area 7)
- Inline-styled buttons in `CrashCourse.tsx` and `Portal.tsx` lack consistent ARIA labels. (Area 7)

### DEFERRED (cross-area)

- Vault V2 (Workbench + Archive) — ROADMAP Phase 3, post-launch. (Area 2)
- Content automation pipeline (NotebookLM / ElevenLabs / Claude API / SORA) — ROADMAP Phase 4. (Area 7)
- AdminDashboard tables overflow on mobile — internal admin route. (Area 6)
- React Email component library upgrade — current inline HTML works; revisit if email volume grows. (Area 5)

---

## Recommended Step 4 scope

Step 4 should be a focused launch-readiness sprint with three workstreams: (1) wire the nine canonical crash course markdown files into the portal end-to-end — register them in `api/_content.ts`, replace the hardcoded `CrashCourse.tsx` with a markdown-driven reader, extend `markdown.tsx` to render the seven bracketed callout types with distinctive styling, add per-pattern next/previous navigation, and connect the existing free-tier scope gate to the new content; (2) ship Pocket Archivist as a real SKU — add the $14.99/month price to Stripe config, add `trial_end` / `subscription_status` / `current_period_end` columns to `quizUsers` (or a new `subscriptions` table), implement the four subscription webhook handlers, wire the 30-day trial activation on Complete Archive purchase, and add an `/account` route that shows tier and lets a user cancel; (3) close the design-system gap in a single targeted pass — rebind the CSS variables to amber-primary/teal-accent values, swap `--font-sans` and `--font-serif` to Cinzel and EB Garamond, replace the page-level inline color/font styles with utility classes, and introduce a single reusable glassmorphism utility (or component) that the portal reader, crash course reader, and `/account` page consume. Replace the 404 page in the same pass. Defer the email sequence copy, the analytics integration, and the loading-state polish to Step 4.5 unless soft launch is gated on conversion tracking — in which case promote analytics from POLISH to SHIP-CRITICAL and wire it in Step 4. Aaron is solo and time-constrained: do the three blockers + the 404 + the design-system pass, ship soft launch, then iterate.

---

## Open questions for Aaron

1. **Sign-up flow:** is the absence of a standalone sign-up route intentional (sign-up happens through quiz or Stripe), or was a dedicated route planned?
2. **Pocket Archivist standalone surface:** does Step 4 ship the Pocket Archivist as a $14.99/month subscription with a dedicated landing surface, or only as a Field-Guide / Complete-Archive bundled feature?
3. **Auth provider posture:** the JWT + magic-link implementation works. Is Supabase Auth still planned, or is the doc the thing that should change?
4. **Email sequence copy:** is it on hold pending the launch, or is the absence of finished copy the gap to close in Step 4?
5. **Abandoned cart / re-engagement sequences:** intended for Step 4, deferred, or never?
6. **Cookie consent:** required by jurisdiction, or out of scope?
7. **Refund policy page:** required for Stripe / payment processor compliance, or handled in the Terms?
8. **Analytics platform:** which one if any — Plausible, Posthog, Google Analytics, none?
9. **CLAUDE.md route-table refresh:** correct the stale entries (`/portal/onboarding`, `/portal/reader`, `/vault/*`) in the same pass, or after Step 4 lands?
10. **Design refresh scope:** minimum viable amber+teal+Cinzel pass, or full visual rebuild?
