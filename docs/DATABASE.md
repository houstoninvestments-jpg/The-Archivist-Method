# THE ARCHIVIST METHOD — DATABASE SCHEMA

> Last updated: May 5, 2026
>
> Source of truth: `shared/schema.ts` (Drizzle ORM table definitions) and `migrations/0001_supabase_schema.sql` (raw SQL). Run `npm run db:push` to apply schema changes.

---

## Overview

Database: **Supabase (PostgreSQL)** accessed via Drizzle ORM.

The schema covers four functional areas:

1. **Auth and accounts** — `users`, `quiz_users`, `portal_users`, `test_users`
2. **Purchases and access** — `purchases`, `email_queue`
3. **Reader and PDF interaction** — `user_progress`, `bookmarks`, `highlights`, `reader_notes`, `reading_progress`, `download_logs`
4. **Pattern interruption tracking and conversations** — `interrupt_log`, `pdf_chat_history`, `portal_chat_history`

Canonical table definitions live in `shared/schema.ts`. Names below mirror that file.

---

## Tables

### Auth and Accounts

| Table | Purpose |
|-------|---------|
| `users` | Internal admin/system users (username + password hash) |
| `quiz_users` | Quiz-takers and free-tier signups. Holds primary pattern, secondary patterns, pattern scores, access level/tier, magic link state, crash course progress, onboarding state |
| `portal_users` | Paying portal users created from Stripe webhooks; tier-gated access |
| `test_users` | Stripe test-mode user records |

### Purchases and Email

| Table | Purpose |
|-------|---------|
| `purchases` | Stripe-confirmed purchases — links Stripe payment IDs to users and tier |
| `email_queue` | Outbound email delivery queue (Resend) |

### Reader / PDF

| Table | Purpose |
|-------|---------|
| `user_progress` | Per-document page progress, percent complete, pages viewed |
| `bookmarks` | Per-page bookmarks with optional note |
| `highlights` | Text highlights inside PDFs |
| `reader_notes` | Long-form reader notes attached to documents |
| `reading_progress` | Reader-tier progress tracking (book/Field Guide reading) |
| `download_logs` | Audit log of PDF downloads |

### Pattern Interruption + Conversations

| Table | Purpose |
|-------|---------|
| `interrupt_log` | User-logged pattern interrupts and activations |
| `portal_chat_history` | Pocket Archivist conversation transcripts (authenticated portal chat) |
| `pdf_chat_history` | In-PDF chat interactions |

---

## Pattern Reference Constants

`shared/schema.ts` exports the canonical `PatternType` enum and `patternNames` map. The nine pattern keys (used as IDs in DB rows and quiz scoring) are:

```ts
DISAPPEARING:           "disappearing"
APOLOGY_LOOP:           "apologyLoop"
TESTING:                "testing"
ATTRACTION_TO_HARM:     "attractionToHarm"
DRAINING_BOND:          "drainingBond"
COMPLIMENT_DEFLECTION:  "complimentDeflection"
PERFECTIONISM_TRAP:     "perfectionismTrap"
SUCCESS_SABOTAGE:       "successSabotage"
RAGE:                   "rage"
```

The `patternNames` map renders the canonical user-facing pattern names — these match the names in `the-archivist-method/module-3-patterns/index.md`.

---

## Access Tiers

`AccessLevel` (in `shared/schema.ts`) and `quiz_users.access_tier` are the gating mechanism for portal features and Pocket Archivist limits:

| Tier | Source | Access |
|------|--------|--------|
| `free` | quiz signup, no purchase | Crash course module for primary pattern only; Pocket Archivist limited free tier (primary pattern only, capped turns, no memory persistence) |
| `field_guide` | $67 Stripe purchase | One Field Guide PDF + portal reader + full Pocket Archivist for that pattern |
| `complete_archive` | $297 Stripe purchase | All nine Field Guides + Complete Archive PDF + lifetime portal access + physical book + 30-day Pocket Archivist trial (then continues bundled while subscription active) |

Pocket Archivist standalone subscription ($14.99/mo) sets a separate flag and unlocks paid-tier behavior across all nine patterns even without a Field Guide / Archive purchase.

---

## Row Level Security (RLS)

All user-scoped tables run with RLS in Supabase. Policies enforce `auth.uid() = user_id` for SELECT/INSERT/UPDATE on user-owned rows. Server-side webhooks use `SUPABASE_SERVICE_ROLE_KEY` to bypass RLS for admin operations.

---

## Supabase Client

```ts
// server-side (api/)
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// client-side (client/src/)
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);
```

Environment variables:

- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` — server-side, bypasses RLS, used by webhooks and admin routes
- `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` — client-side, RLS-protected
