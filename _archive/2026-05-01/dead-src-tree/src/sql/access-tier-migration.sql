-- ============================================================
-- Access-tier columns for Stripe-driven gating
-- Apply after: drizzle-kit push (auto-generated migrations)
-- Safe to re-run: uses IF NOT EXISTS.
-- ============================================================

-- Canonical tier written by the Stripe webhook:
-- "free" | "field_guide" | "complete_archive"
ALTER TABLE quiz_users
  ADD COLUMN IF NOT EXISTS access_tier TEXT DEFAULT 'free';

-- Count of distinct conversation sessions (UTC days) a free user has used.
ALTER TABLE quiz_users
  ADD COLUMN IF NOT EXISTS chat_session_count INTEGER DEFAULT 0;

-- Backfill existing rows so the gate resolves correctly for legacy buyers.
UPDATE quiz_users
SET access_tier = CASE
  WHEN access_level = 'archive' THEN 'complete_archive'
  WHEN access_level = 'quick-start' THEN 'field_guide'
  ELSE 'free'
END
WHERE access_tier IS NULL OR access_tier = 'free';
