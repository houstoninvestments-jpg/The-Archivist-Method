# THE ARCHIVIST METHOD — INTEGRATIONS

> Last updated: February 15, 2026
>
> Source: `TAM-HANDOFF-COMPLETE.md`, Replit codebase

---

## Stripe

### Products

| Product | Price | Stripe Price ID |
|---------|-------|-----------------|
| Quick-Start System | $47 | [VERIFY — stored in Replit Stripe config, test mode: `price_XXXXX`] |
| Complete Archive | $197 | [VERIFY — stored in Replit Stripe config, test mode: `price_XXXXX`] |

The Crash Course is free and does not go through Stripe.

### Checkout Flow

1. User clicks "Buy" on product page
2. Redirect to Stripe Checkout (hosted by Stripe)
3. User completes payment
4. Stripe fires `checkout.session.completed` webhook
5. Server receives at `POST /api/stripe/webhook`
6. Webhook handler:
   - Creates user in Supabase (if new) with email from Stripe session
   - Records purchase in `purchases` table
   - Links `stripe_customer_id` to user
   - Sends magic link email for portal access
7. User redirected to success/thank-you page

### Success URLs

- Quick-Start: `/thank-you-quick-start` [VERIFY — may be `/success/quick-start`]
- Complete Archive: `/thank-you-complete` [VERIFY]

### Webhook Events

Only one event is handled: `checkout.session.completed`

### Current Status

**TEST MODE.** Switching to live requires:
- Update `STRIPE_SECRET_KEY` to `sk_live_*`
- Update `STRIPE_PUBLISHABLE_KEY` to `pk_live_*`
- Update `STRIPE_WEBHOOK_SECRET` to live webhook secret
- Update payment links/price IDs to live versions
- Re-register webhook endpoint in Stripe dashboard

---

## Claude API (Anthropic)

### Where It's Used

The Archivist Chatbot (`ArchivistChatbot.tsx` in Replit codebase) — a floating chat widget on the landing page that uses Claude to embody The Archivist persona.

### Model

[VERIFY — likely `claude-3-haiku` or `claude-3-sonnet` based on cost considerations]

### System Prompt

Full system prompt is defined in `TAM-HANDOFF-COMPLETE.md` under "CHATBOT SYSTEM PROMPT." Key elements:
- Identity: "You are The Archivist, a direct, wise pattern archaeologist"
- Operates in mechanical layer, not emotional layer
- Full definitions of all 9 patterns with triggers and body signatures
- FEIR framework instructions
- Conversation style: direct, specific, 2–4 paragraphs max
- Critical rules: no therapy language, never condescending, name patterns clearly

### Current Status

Chatbot is a **placeholder** — needs to be wired to Claude API with the system prompt. Currently not functional.

---

## Email

### Resend

Planned email delivery service for transactional emails (magic links).

- **API Key:** `RESEND_API_KEY` (stored in Replit Secrets)
- **Status:** Not yet wired up. Magic links currently log to console in dev mode.
- **Use case:** Send magic link emails after purchase or login request

### ConvertKit (Kit)

Email sequence automation for nurture/onboarding emails.

- **Status:** Sequences are drafted (copy exists), not yet implemented in ConvertKit
- **Sequences:**
  1. **7-Day Crash Course** (11 emails, free signups) — Days 0, 1, 2, 3, 4, 5, 6, 7, 10, 14, 21
  2. **Quick-Start Buyer Onboarding** (5 emails) — Days 0, 1, 7, 30, 60
  3. **Archive Buyer Onboarding** (5 emails) — Days 0, 1, 7, 30, 90

---

## Fal.ai Voice

No fal.ai voice setup exists in the current codebase. This may be a future consideration for audio content delivery.

---

## Environment Variables

All stored in **Replit Secrets** (not in code).

```
# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx

# Supabase (client-side, prefixed for Vite)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxxxx

# Stripe
STRIPE_SECRET_KEY=sk_test_xxxxx        # Switch to sk_live_* for production
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx   # Switch to pk_live_* for production

# Auth
JWT_SECRET=xxxxx                        # Strong random string for JWT signing

# Email
RESEND_API_KEY=re_xxxxx                 # For magic link delivery

# AI
ANTHROPIC_API_KEY=sk-ant-xxxxx          # For Archivist Chatbot
```

**Important:** Never commit secrets to the repo. All values live in Replit Secrets panel.
