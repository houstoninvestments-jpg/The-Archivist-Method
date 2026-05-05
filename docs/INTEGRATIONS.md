# THE ARCHIVIST METHOD — INTEGRATIONS

> Last updated: May 5, 2026
>
> Source: live `server/`, `api/`, `vercel.json`, `CLAUDE.md` (Stripe Test Mode section). Canonical operational rules: `CLAUDE.md`.

---

## Stripe

### Live Products and Price IDs

| Product | Price | Live Stripe Price ID |
|---------|-------|----------------------|
| Field Guide | $67 | `price_1TOlJr11kGDis0LrBP8ITvIC` |
| Complete Archive | $297 | `price_1TOlGX11kGDis0LrvJl0SBhm` |
| Pocket Archivist (standalone subscription) | $14.99/mo | TBD — see Stripe Dashboard, Products |

The Crash Course is free and does not go through Stripe. Pocket Archivist access is bundled free with Field Guide and Complete Archive purchases (30-day trial with the Complete Archive includes a physical POD softcover of the book and is redeemable at thearchivistmethod.com/reader).

### Test Mode

A parallel test-mode flow is wired alongside live and controlled by `STRIPE_MODE` (server) and `VITE_STRIPE_MODE` (client). Test-mode env vars and Vercel preview-deploy procedure are documented in full in `CLAUDE.md` under "Stripe Test Mode." Production scope on Vercel always stays in live mode; test mode runs on preview URLs only.

### Checkout Flow

1. User clicks Buy on the landing or pricing surface
2. Redirect to Stripe Checkout (hosted)
3. User completes payment
4. Stripe fires `checkout.session.completed` webhook
5. Server receives at `POST /api/portal/webhooks/stripe`
6. Webhook handler:
   - Tries every secret in `STRIPE_WEBHOOK_SECRET` and `STRIPE_TEST_WEBHOOK_SECRET` until one verifies
   - Inserts a row in `portal_users` (Supabase) with email + tier
   - Sends magic link email for portal access
7. User redirected to thank-you page

### Webhook Endpoint

`/api/portal/webhooks/stripe` accepts both live and test signatures. Both the live Stripe dashboard and the test-mode Stripe dashboard must be configured to fire events at this URL.

### Webhook Events Handled

- `checkout.session.completed`

---

## Claude API (Anthropic) — Pocket Archivist

### Where It's Used

The Pocket Archivist conversational interface — authenticated `POST /api/portal/chat` endpoint inside `api/portal-routes.ts`. Free tier and paid tier both route through this endpoint; tier governs allowed turns, pattern access, and memory persistence.

### Model

Defaults to the latest Claude Sonnet/Haiku/Opus model per cost-and-latency tradeoff. Configured server-side; not exposed to the client.

### System Prompt

Locked at `docs/character/pocket-archivist-system-prompt.md`. The book at `the-archivist-method/` is the voice canonical that the system prompt mirrors. Any change to voice happens in the book first, then propagates to the system prompt.

Key elements:

- Identity: precision pattern intervention tool, not a chatbot
- Operates in mechanical layer, not emotional layer
- Full definitions of all nine patterns with body signatures
- Four Doors framework instructions
- Conversation style: short, declarative, second person, present tense
- Crisis routing: 988 referral, exit conversation
- Banned-word + banned-filler-phrase enforcement (mirrors `docs/LANGUAGE.md`)

---

## Email

### Resend (transactional)

Used for magic links and receipts.

- **API Key:** `RESEND_API_KEY` (Vercel env)
- **Status:** wired
- **Use case:** magic link delivery after purchase or login request, receipt emails

### Email Sequence Automation

Email sequences (Crash Course nurture, buyer onboarding) are drafted but not yet implemented in the automation provider. Status tracked in `docs/STATUS.md`.

---

## Supabase

PostgreSQL backend. Schema documented in `docs/DATABASE.md`. Connected via `@supabase/supabase-js` server-side and via Drizzle ORM for migrations.

---

## Environment Variables

All env vars live in **Vercel → Project → Settings → Environment Variables** (production, preview, development scopes as appropriate). Never commit secrets.

```
# Supabase
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Supabase (client-side, prefixed for Vite)
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# Stripe — live mode (Production scope)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PUBLISHABLE_KEY=pk_live_...

# Stripe — test mode (Preview scope only — never Production)
STRIPE_MODE=test
STRIPE_TEST_SECRET_KEY=sk_test_...
STRIPE_TEST_WEBHOOK_SECRET=whsec_...
STRIPE_TEST_PRICE_FIELD_GUIDE=price_test_...
STRIPE_TEST_PRICE_COMPLETE_ARCHIVE=price_test_...
VITE_STRIPE_MODE=test
VITE_STRIPE_TEST_PUBLISHABLE_KEY=pk_test_...
VITE_STRIPE_TEST_PRICE_FIELD_GUIDE=price_test_...
VITE_STRIPE_TEST_PRICE_COMPLETE_ARCHIVE=price_test_...

# Auth
JWT_SECRET=

# Email
RESEND_API_KEY=re_...

# AI
ANTHROPIC_API_KEY=sk-ant-...
```

See `CLAUDE.md` for the full test-mode flip procedure and the canonical list of where each test-mode value lives in the Stripe Dashboard.
