# THE ARCHIVIST METHOD — DATABASE SCHEMA

> Last updated: February 15, 2026
>
> Source: `TAM-HANDOFF-COMPLETE.md`, `src/sql/vault-schema.sql`, `src/types/vault.ts`

---

## Overview

Database: **Supabase (PostgreSQL)**

Two schema layers:
1. **Core tables** — users and purchases (defined in handoff, created in Supabase)
2. **Vault tables** — activation logs, brain dumps, streaks, activity (defined in `src/sql/vault-schema.sql`)

---

## Core Tables

### `users`

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT `gen_random_uuid()` | User ID |
| `email` | TEXT | UNIQUE, NOT NULL | User's email address |
| `created_at` | TIMESTAMPTZ | DEFAULT `NOW()` | Account creation timestamp |
| `last_login` | TIMESTAMPTZ | Nullable | Last login timestamp |
| `stripe_customer_id` | TEXT | Nullable | Stripe customer ID for payment linking |

### `purchases`

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT `gen_random_uuid()` | Purchase ID |
| `user_id` | UUID | FK → `users(id)` ON DELETE CASCADE | Buyer |
| `product` | TEXT | NOT NULL, CHECK IN ('crash-course', 'quick-start', 'complete-archive') | Product purchased |
| `stripe_payment_id` | TEXT | UNIQUE, NOT NULL | Stripe payment intent/session ID |
| `amount` | INTEGER | NOT NULL | Amount in cents |
| `status` | TEXT | NOT NULL, DEFAULT 'active' | Purchase status |
| `purchased_at` | TIMESTAMPTZ | DEFAULT `NOW()` | Purchase timestamp |

**Indexes:**
- `idx_purchases_user_id` on `purchases(user_id)`
- `idx_purchases_stripe_payment_id` on `purchases(stripe_payment_id)`

---

## Vault Tables

### `activation_logs`

Tracks each time a user logs a pattern activation.

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT `uuid_generate_v4()` | Log entry ID |
| `user_id` | UUID | FK → `users(id)` ON DELETE CASCADE | User |
| `pattern_id` | INTEGER | NOT NULL, CHECK 1–9 | Which pattern activated |
| `intensity` | INTEGER | NOT NULL, CHECK 1–5 | Activation intensity |
| `context` | TEXT | Nullable | Free-text context about what triggered it |
| `interrupted` | BOOLEAN | NOT NULL, DEFAULT FALSE | Did the user interrupt the pattern? |
| `timestamp` | TIMESTAMPTZ | DEFAULT `NOW()` | When it happened |

**Indexes:**
- `idx_activation_logs_user_id` on `activation_logs(user_id)`
- `idx_activation_logs_timestamp` on `activation_logs(user_id, timestamp DESC)`
- `idx_activation_logs_week` on `activation_logs(user_id, timestamp)` WHERE `timestamp > NOW() - INTERVAL '14 days'`

### `brain_dumps`

Free-form text entries that can be converted to activation logs.

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT `uuid_generate_v4()` | Entry ID |
| `user_id` | UUID | FK → `users(id)` ON DELETE CASCADE | User |
| `content` | TEXT | NOT NULL | Free-form text |
| `suggested_pattern` | INTEGER | Nullable, CHECK 1–9 or NULL | AI-suggested pattern match |
| `converted_to_log` | BOOLEAN | DEFAULT FALSE | Whether this became an activation log |
| `timestamp` | TIMESTAMPTZ | DEFAULT `NOW()` | When it was written |

**Indexes:**
- `idx_brain_dumps_user_id` on `brain_dumps(user_id)`
- `idx_brain_dumps_timestamp` on `brain_dumps(user_id, timestamp DESC)`

### `user_streaks`

Tracks consecutive interrupt streaks (one row per user).

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| `user_id` | UUID | PRIMARY KEY, FK → `users(id)` ON DELETE CASCADE | User |
| `current_streak` | INTEGER | DEFAULT 0 | Current consecutive interrupt days |
| `longest_streak` | INTEGER | DEFAULT 0 | All-time best streak |
| `last_interrupt_date` | DATE | Nullable | Date of most recent interrupt |

### `user_activity`

Tracks reading/interaction with Archive content.

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT `uuid_generate_v4()` | Activity ID |
| `user_id` | UUID | FK → `users(id)` ON DELETE CASCADE | User |
| `artifact_id` | TEXT | NOT NULL | ID of the content artifact |
| `action` | TEXT | NOT NULL, CHECK IN ('opened', 'completed', 'bookmarked') | What the user did |
| `timestamp` | TIMESTAMPTZ | DEFAULT `NOW()` | When it happened |

**Indexes:**
- `idx_user_activity_user_id` on `user_activity(user_id)`
- `idx_user_activity_timestamp` on `user_activity(user_id, timestamp DESC)`

---

## Row Level Security (RLS)

All Vault tables have RLS enabled. Users can only access their own data.

| Table | Policy | Rule |
|-------|--------|------|
| `user_activity` | SELECT | `auth.uid() = user_id` |
| `user_activity` | INSERT | `auth.uid() = user_id` |
| `activation_logs` | SELECT | `auth.uid() = user_id` |
| `activation_logs` | INSERT | `auth.uid() = user_id` |
| `brain_dumps` | SELECT | `auth.uid() = user_id` |
| `brain_dumps` | INSERT | `auth.uid() = user_id` |
| `brain_dumps` | UPDATE | `auth.uid() = user_id` |
| `user_streaks` | SELECT | `auth.uid() = user_id` |
| `user_streaks` | ALL | `auth.uid() = user_id` |

---

## Relationships

```
users (1) ──→ (many) purchases
users (1) ──→ (many) activation_logs
users (1) ──→ (many) brain_dumps
users (1) ──→ (1)    user_streaks
users (1) ──→ (many) user_activity
```

---

## Supabase Client

Frontend connects via `@supabase/supabase-js`:

```typescript
// src/lib/supabase.ts
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

Environment variables:
- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Supabase anonymous key (client-side, RLS-protected)
- `SUPABASE_SERVICE_ROLE_KEY` — Server-side only, bypasses RLS (used in webhooks)
