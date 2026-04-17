-- ============================================================
-- Email Queue
-- Scheduled sends for the Crash Course and buyer sequences.
-- A Vercel cron job hits /api/cron/email-queue daily, finds
-- rows where scheduled_for has passed and sent = false, sends
-- them via Resend, and marks sent = true.
-- ============================================================

CREATE TABLE IF NOT EXISTS email_queue (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email     TEXT        NOT NULL,
  sequence       TEXT        NOT NULL, -- 'crash_course' | 'field_guide' | 'complete_archive'
  pattern        TEXT        NOT NULL, -- pattern key (disappearing, apologyLoop, ...)
  email_number   INTEGER     NOT NULL, -- 1..7
  scheduled_for  TIMESTAMPTZ NOT NULL,
  sent           BOOLEAN     NOT NULL DEFAULT FALSE,
  sent_at        TIMESTAMPTZ,
  cancelled      BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Fast lookup for the cron processor: "what's due right now?"
CREATE INDEX IF NOT EXISTS idx_email_queue_due
  ON email_queue (scheduled_for)
  WHERE sent = FALSE AND cancelled = FALSE;

-- Fast lookup for cancel-on-purchase: "all pending rows for this email"
CREATE INDEX IF NOT EXISTS idx_email_queue_user
  ON email_queue (user_email)
  WHERE sent = FALSE AND cancelled = FALSE;
