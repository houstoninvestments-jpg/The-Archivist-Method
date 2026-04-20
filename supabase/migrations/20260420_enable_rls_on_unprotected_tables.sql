-- ============================================================
-- Enable RLS on tables that the repo declares without RLS.
--
-- Server code connects with the service role and bypasses RLS,
-- so this migration does NOT break any existing server route.
-- It DOES block the anon role (exposed to the browser via
-- VITE_SUPABASE_ANON_KEY) from reading these tables.
--
-- Safe to re-run: ENABLE ROW LEVEL SECURITY is idempotent.
-- Paired with: docs/security/rls-audit-2026-04-20.md
-- ============================================================

BEGIN;

-- Primary: table that decides who sees what. Contains emails and
-- unexpired magic_link_token values. MUST be locked before launch.
ALTER TABLE IF EXISTS quiz_users ENABLE ROW LEVEL SECURITY;

-- PII / server-only tables.
ALTER TABLE IF EXISTS email_queue          ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS users                ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS portal_users         ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS purchases            ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS test_users           ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS user_progress        ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS bookmarks            ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS highlights           ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS download_logs        ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS pdf_chat_history     ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS portal_chat_history  ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS interrupt_log        ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS reader_notes         ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS reading_progress     ENABLE ROW LEVEL SECURITY;

-- Already have RLS in src/sql/vault-schema.sql, but we re-assert
-- here so a fresh environment is safe even if the vault migration
-- was run with RLS accidentally disabled afterwards.
ALTER TABLE IF EXISTS user_activity        ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS activation_logs      ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS brain_dumps          ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS user_streaks         ENABLE ROW LEVEL SECURITY;

COMMIT;
