-- ============================================================
-- RLS lockdown for the four UNRESTRICTED public-schema tables
-- identified in the Supabase dashboard on 2026-04-20.
--
--   quiz_users     — user-facing PII (email, magic_link_token, tier)
--   portal_users   — user-facing PII (email, stripe_customer_id)
--   email_queue    — server-only queue of scheduled sends
--   test_users     — admin-managed allowlist for free/god-mode access
--
-- The server connects via DATABASE_URL (pgpool) using a role that
-- bypasses RLS. All server paths continue to work unchanged.
--
-- The client includes @supabase/supabase-js with the anon key but
-- does NOT use Supabase Auth (no signIn/signUp calls anywhere).
-- Therefore auth.email() and auth.uid() return NULL from the browser,
-- and the "own row" policies below evaluate to FALSE from anon — which
-- is the desired behaviour today (block), and lights up correctly if
-- Supabase Auth is ever added (users read only their own row).
--
-- Aaron approves tables one at a time. This file is the final shape;
-- comment in/out the BEGIN/COMMIT wrap and leave only the part(s)
-- you've approved when you run it. Safe to re-run (idempotent).
-- ============================================================

BEGIN;

-- ── 1. quiz_users ───────────────────────────────────────────
-- Enable RLS. Grant the anon + authenticated roles nothing at
-- the table level. Authenticated users reading their own row
-- require Supabase Auth with a matching email (dormant today).

ALTER TABLE quiz_users ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON quiz_users FROM anon, authenticated;

DROP POLICY IF EXISTS "quiz_users_select_own" ON quiz_users;
CREATE POLICY "quiz_users_select_own"
  ON quiz_users
  FOR SELECT
  TO authenticated
  USING (auth.email() = email);

-- No INSERT / UPDATE / DELETE policies for anon or authenticated.
-- Mutations remain service-role-only (server via Drizzle).

-- ── 2. portal_users ─────────────────────────────────────────
-- Same shape as quiz_users.

ALTER TABLE portal_users ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON portal_users FROM anon, authenticated;

DROP POLICY IF EXISTS "portal_users_select_own" ON portal_users;
CREATE POLICY "portal_users_select_own"
  ON portal_users
  FOR SELECT
  TO authenticated
  USING (auth.email() = email);

-- No INSERT / UPDATE / DELETE policies.

-- ── 3. email_queue ──────────────────────────────────────────
-- Server-cron-only. No policies = deny all non-service-role.

ALTER TABLE email_queue ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON email_queue FROM anon, authenticated;

-- No policies defined. Service role still bypasses RLS.

-- ── 4. test_users ───────────────────────────────────────────
-- Admin-managed. Confirmed actively used by production code
-- (server/admin/routes.ts CRUD, server/portal/routes.ts magic-link
-- lookup, api/portal-routes.ts hardcoded-owner bootstrap). Keep
-- the table; lock it to service-role-only.

ALTER TABLE test_users ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON test_users FROM anon, authenticated;

-- No policies defined. Service role still bypasses RLS.

COMMIT;

-- ============================================================
-- Verification
-- ============================================================
--
-- 1. Confirm RLS is on for all four:
--   SELECT tablename, rowsecurity
--   FROM pg_tables
--   WHERE schemaname = 'public'
--     AND tablename IN ('quiz_users','portal_users','email_queue','test_users');
--   → All four should show rowsecurity = true.
--
-- 2. Confirm only the two expected SELECT policies exist:
--   SELECT tablename, policyname, cmd, roles, qual
--   FROM pg_policies
--   WHERE schemaname = 'public'
--     AND tablename IN ('quiz_users','portal_users','email_queue','test_users');
--   → Expected: exactly two rows
--     quiz_users_select_own   SELECT {authenticated}  auth.email() = email
--     portal_users_select_own SELECT {authenticated}  auth.email() = email
--
-- 3. Smoke test from an anonymous PostgREST call:
--   curl -s "$SUPABASE_URL/rest/v1/quiz_users?select=email" \
--     -H "apikey: $SUPABASE_ANON_KEY" \
--     -H "Authorization: Bearer $SUPABASE_ANON_KEY"
--   → Should return [] (not the list of user emails).
-- ============================================================
