// ============================================================
// Email Queue Manager
//
// Schedules and dispatches the Crash Course and buyer sequences.
// All DB work goes through a Drizzle instance passed in by the
// caller so this module can be used from both `server/` (local
// dev) and `api/` (Vercel serverless).
// ============================================================

import { and, asc, eq, lte } from 'drizzle-orm';
import { emailQueue } from '../../shared/schema';
import type { Resend } from 'resend';
import {
  SEQUENCES,
  isPatternKey,
  isSequenceType,
  type PatternKey,
  type SequenceEmail,
  type SequenceType,
} from './sequences';

const DAY_MS = 24 * 60 * 60 * 1000;

/** Minimal shape of the Drizzle client we use. Kept as `any` so that both
 *  api/_db.ts and server/db.ts (which use different factory types) fit. */
type Db = any;

export interface ScheduleSequenceOptions {
  userEmail: string;
  pattern: PatternKey;
  sequence: SequenceType;
  /** Defaults to now. Day-0 emails fire on the next cron run after this. */
  startFrom?: Date;
}

/**
 * Insert 7 scheduled rows for a user's pattern + sequence combination.
 * Day-0 emails use `startFrom` directly so they fire on the next cron run.
 */
export async function scheduleSequence(
  db: Db,
  opts: ScheduleSequenceOptions,
): Promise<number> {
  const start = opts.startFrom ?? new Date();
  const emails = SEQUENCES[opts.sequence]?.[opts.pattern];
  if (!emails || emails.length === 0) return 0;

  const rows = emails.map((e: SequenceEmail, i: number) => ({
    userEmail: opts.userEmail.toLowerCase(),
    sequence: opts.sequence,
    pattern: opts.pattern,
    emailNumber: i + 1,
    scheduledFor: new Date(start.getTime() + e.delayDays * DAY_MS),
  }));

  await db.insert(emailQueue).values(rows);
  return rows.length;
}

/**
 * Cancel pending (unsent, not-yet-cancelled) emails for a user.
 * Pass `sequence` to cancel only that sequence; omit to cancel everything.
 */
export async function cancelPendingSequences(
  db: Db,
  userEmail: string,
  sequence?: SequenceType,
): Promise<number> {
  const conditions = [
    eq(emailQueue.userEmail, userEmail.toLowerCase()),
    eq(emailQueue.sent, false),
    eq(emailQueue.cancelled, false),
  ];
  if (sequence) conditions.push(eq(emailQueue.sequence, sequence));

  const result = await db
    .update(emailQueue)
    .set({ cancelled: true })
    .where(and(...conditions))
    .returning({ id: emailQueue.id });
  return result.length;
}

/**
 * Cancel the existing Crash Course sequence and start a buyer sequence.
 * Used when a user purchases the Field Guide or Complete Archive.
 */
export async function switchToSequence(
  db: Db,
  opts: {
    userEmail: string;
    pattern: PatternKey;
    sequence: Exclude<SequenceType, 'crash_course'>;
    startFrom?: Date;
  },
): Promise<{ cancelled: number; scheduled: number }> {
  const cancelled = await cancelPendingSequences(db, opts.userEmail);
  const scheduled = await scheduleSequence(db, {
    userEmail: opts.userEmail,
    pattern: opts.pattern,
    sequence: opts.sequence,
    startFrom: opts.startFrom,
  });
  return { cancelled, scheduled };
}

export interface ProcessQueueResult {
  attempted: number;
  sent: number;
  failed: number;
  skipped: number;
}

/**
 * Send every queued email whose scheduled_for has passed and that hasn't
 * been sent or cancelled. Intended to be run from a cron job.
 */
export async function processDueEmails(
  db: Db,
  resend: Resend,
  fromEmail: string,
  now: Date = new Date(),
  batchSize = 100,
): Promise<ProcessQueueResult> {
  const due = await db
    .select()
    .from(emailQueue)
    .where(
      and(
        eq(emailQueue.sent, false),
        eq(emailQueue.cancelled, false),
        lte(emailQueue.scheduledFor, now),
      ),
    )
    .orderBy(asc(emailQueue.scheduledFor))
    .limit(batchSize);

  let sent = 0;
  let failed = 0;
  let skipped = 0;

  for (const row of due) {
    if (!isSequenceType(row.sequence) || !isPatternKey(row.pattern)) {
      skipped++;
      continue;
    }
    const template =
      SEQUENCES[row.sequence as SequenceType][row.pattern as PatternKey][
        row.emailNumber - 1
      ];
    if (!template) {
      skipped++;
      continue;
    }

    try {
      await resend.emails.send({
        from: fromEmail,
        to: [row.userEmail],
        subject: template.subject,
        text: template.body,
      });
      await db
        .update(emailQueue)
        .set({ sent: true, sentAt: new Date() })
        .where(eq(emailQueue.id, row.id));
      sent++;
    } catch (err) {
      console.error('[email-queue] send failed', {
        id: row.id,
        to: row.userEmail,
        sequence: row.sequence,
        pattern: row.pattern,
        emailNumber: row.emailNumber,
        err,
      });
      failed++;
    }
  }

  return { attempted: due.length, sent, failed, skipped };
}
