// ============================================================
// THE ARCHIVIST METHOD — Email Sequences
//
// 63 Crash Course emails (9 patterns × 7 emails each), plus
// placeholder buyer sequences (Field Guide, Complete Archive).
//
// Delays are days from signup: 0, 2, 4, 6, 8, 11, 14.
//
// Subjects and bodies are scaffolded with TODO markers. The real
// copy will be pasted in and replaced one pattern at a time.
// ============================================================

export type PatternKey =
  | 'disappearing'
  | 'apologyLoop'
  | 'testing'
  | 'attractionToHarm'
  | 'complimentDeflection'
  | 'drainingBond'
  | 'successSabotage'
  | 'perfectionism'
  | 'rage';

export type SequenceType = 'crash_course' | 'field_guide' | 'complete_archive';

export interface SequenceEmail {
  /** Subject line as it appears in the inbox. */
  subject: string;
  /** Plain-text body. Resend accepts either `text` or `html`; we use plain text. */
  body: string;
  /** Delay in days from the sequence start (quiz signup or purchase). */
  delayDays: number;
}

/** The 7 send offsets that every sequence follows. */
export const SEQUENCE_DELAYS = [0, 2, 4, 6, 8, 11, 14] as const;

export const PATTERN_KEYS: readonly PatternKey[] = [
  'disappearing',
  'apologyLoop',
  'testing',
  'attractionToHarm',
  'complimentDeflection',
  'drainingBond',
  'successSabotage',
  'perfectionism',
  'rage',
] as const;

export const PATTERN_DISPLAY_NAMES: Record<PatternKey, string> = {
  disappearing: 'The Disappearing Pattern',
  apologyLoop: 'The Apology Loop',
  testing: 'The Testing Pattern',
  attractionToHarm: 'Attraction to Harm',
  complimentDeflection: 'Compliment Deflection',
  drainingBond: 'The Draining Bond',
  successSabotage: 'Success Sabotage',
  perfectionism: 'The Perfectionism Trap',
  rage: 'The Rage Pattern',
};

function placeholder(
  sequence: SequenceType,
  pattern: PatternKey,
  emailNumber: number,
  delayDays: number,
): SequenceEmail {
  const name = PATTERN_DISPLAY_NAMES[pattern];
  return {
    subject: `[${sequence}] ${name} — email ${emailNumber} (TODO: replace subject)`,
    body:
      `TODO: paste email ${emailNumber} of the ${sequence} sequence for ${name}. ` +
      `This will send ${delayDays} day(s) after the sequence begins.`,
    delayDays,
  };
}

function buildSequence(
  sequence: SequenceType,
): Record<PatternKey, SequenceEmail[]> {
  const out = {} as Record<PatternKey, SequenceEmail[]>;
  for (const pattern of PATTERN_KEYS) {
    out[pattern] = SEQUENCE_DELAYS.map((delay, i) =>
      placeholder(sequence, pattern, i + 1, delay),
    );
  }
  return out;
}

/** 9 patterns × 7 emails. Triggered when a user completes the quiz. */
export const CRASH_COURSE_SEQUENCES: Record<PatternKey, SequenceEmail[]> =
  buildSequence('crash_course');

/** 9 patterns × 7 emails. Triggered when a user buys the Field Guide. */
export const FIELD_GUIDE_SEQUENCES: Record<PatternKey, SequenceEmail[]> =
  buildSequence('field_guide');

/** 9 patterns × 7 emails. Triggered when a user buys the Complete Archive. */
export const COMPLETE_ARCHIVE_SEQUENCES: Record<PatternKey, SequenceEmail[]> =
  buildSequence('complete_archive');

export const SEQUENCES: Record<
  SequenceType,
  Record<PatternKey, SequenceEmail[]>
> = {
  crash_course: CRASH_COURSE_SEQUENCES,
  field_guide: FIELD_GUIDE_SEQUENCES,
  complete_archive: COMPLETE_ARCHIVE_SEQUENCES,
};

export function isPatternKey(value: unknown): value is PatternKey {
  return typeof value === 'string' && (PATTERN_KEYS as readonly string[]).includes(value);
}

export function isSequenceType(value: unknown): value is SequenceType {
  return (
    value === 'crash_course' ||
    value === 'field_guide' ||
    value === 'complete_archive'
  );
}

export type BuyerSequence = Exclude<SequenceType, 'crash_course'>;

/**
 * Map a Stripe product id ("quick-start" or "complete-archive") to the
 * corresponding buyer sequence. Returns null for unknown products.
 */
export function productIdToSequence(productId: string): BuyerSequence | null {
  if (productId === 'quick-start' || productId === 'field_guide') return 'field_guide';
  if (productId === 'complete-archive' || productId === 'complete_archive') return 'complete_archive';
  return null;
}
