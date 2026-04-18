-- Archivist Method — Supabase schema sync
-- Run this in the Supabase SQL editor.
-- Adds: quiz_users.access_tier, quiz_users.chat_session_count, email_queue table.
-- All statements are idempotent (IF NOT EXISTS) so re-running is safe.

BEGIN;

-- 1. quiz_users — new tier + chat-session columns
ALTER TABLE quiz_users
  ADD COLUMN IF NOT EXISTS access_tier text DEFAULT 'free';

ALTER TABLE quiz_users
  ADD COLUMN IF NOT EXISTS chat_session_count integer DEFAULT 0;

-- Backfill: any existing row gets the defaults explicitly (covers rows
-- inserted before the defaults existed).
UPDATE quiz_users
   SET access_tier = COALESCE(access_tier, 'free'),
       chat_session_count = COALESCE(chat_session_count, 0);

-- 2. email_queue — scheduled email sends scanned by the daily Vercel cron
CREATE TABLE IF NOT EXISTS email_queue (
  id              varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email      text        NOT NULL,
  sequence        text        NOT NULL,
  pattern         text        NOT NULL,
  email_number    integer     NOT NULL,
  scheduled_for   timestamptz NOT NULL,
  sent            boolean     NOT NULL DEFAULT false,
  sent_at         timestamptz,
  cancelled       boolean     NOT NULL DEFAULT false,
  created_at      timestamptz DEFAULT now()
);

-- Cron-friendly index: find unsent, uncancelled rows whose time has come.
CREATE INDEX IF NOT EXISTS email_queue_due_idx
  ON email_queue (scheduled_for)
  WHERE sent = false AND cancelled = false;

-- Lookup index for per-user sequence management (cancel / resend flows).
CREATE INDEX IF NOT EXISTS email_queue_user_sequence_idx
  ON email_queue (user_email, sequence);

COMMIT;
