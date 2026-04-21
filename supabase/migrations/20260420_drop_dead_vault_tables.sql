-- ============================================================
-- Drop the four dead vault tables.
--
-- Audit in docs/audit/vault-tables-usage.md proved none of these
-- tables are referenced by the running client or server code.
-- The /src/ tree that would have written to them is being removed
-- in the same commit. CASCADE handles indexes and any dangling
-- policies left over from src/sql/vault-schema.sql.
--
-- Aaron approves separately before this is applied in Supabase.
-- ============================================================

BEGIN;

DROP TABLE IF EXISTS activation_logs CASCADE;
DROP TABLE IF EXISTS brain_dumps     CASCADE;
DROP TABLE IF EXISTS user_activity   CASCADE;
DROP TABLE IF EXISTS user_streaks    CASCADE;

COMMIT;

-- Verification (run after apply):
--   SELECT tablename FROM pg_tables
--   WHERE schemaname = 'public'
--     AND tablename IN ('activation_logs','brain_dumps','user_activity','user_streaks');
--   → Expected: 0 rows.
