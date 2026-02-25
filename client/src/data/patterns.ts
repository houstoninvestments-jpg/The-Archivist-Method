// ============================================================
// THE ARCHIVIST VAULT — Pattern Definitions
// ============================================================

import type { Pattern, PatternId } from '../types/vault';

export const patterns: Pattern[] = [
  {
    id: 'disappearing',
    number: 1,
    name: 'The Disappearing Pattern',
    shortName: 'Disappearing',
    description: 'The urge to pull away, exit, vanish when connection gets real.',
    bodySignal: 'Chest tightens',
    gapLength: '3–7 seconds',
  },
  {
    id: 'apology-loop',
    number: 2,
    name: 'The Apology Loop',
    shortName: 'Apology Loop',
    description: 'Compulsive apologizing for existing, asking, needing.',
    bodySignal: 'Throat constricts',
    gapLength: '3–7 seconds',
  },
  {
    id: 'testing',
    number: 3,
    name: 'The Testing Pattern',
    shortName: 'Testing',
    description: 'Creating secret tests to see if people really care.',
    bodySignal: 'Heart rate spikes when checking phone',
    gapLength: 'Minutes to hours',
  },
  {
    id: 'attraction-to-harm',
    number: 4,
    name: 'Attraction to Harm',
    shortName: 'Attraction to Harm',
    description: 'Mistaking danger for chemistry, familiar for safe.',
    bodySignal: 'Disproportionate intensity',
    gapLength: 'Days to weeks',
  },
  {
    id: 'draining-bond',
    number: 5,
    name: 'The Draining Bond',
    shortName: 'Draining Bond',
    description: 'Staying in what depletes you out of pattern, not loyalty.',
    bodySignal: 'Physical heaviness returning',
    gapLength: 'Seconds to days',
  },
  {
    id: 'compliment-deflection',
    number: 6,
    name: 'Compliment Deflection',
    shortName: 'Compliment Deflection',
    description: 'The reflex to reject, minimize, or redirect praise.',
    bodySignal: 'Heat, squirming',
    gapLength: 'Seconds',
  },
  {
    id: 'perfectionism',
    number: 7,
    name: 'The Perfectionism Pattern',
    shortName: 'Perfectionism',
    description: 'Revising endlessly because done never feels safe.',
    bodySignal: 'Hand reaching to revise again',
    gapLength: 'At the revision point',
  },
  {
    id: 'success-sabotage',
    number: 8,
    name: 'Success Sabotage',
    shortName: 'Success Sabotage',
    description: 'The itch to blow things up when they start going well.',
    bodySignal: 'Restlessness, agitation',
    gapLength: 'Days to weeks (a season)',
  },
  {
    id: 'rage',
    number: 9,
    name: 'The Rage Pattern',
    shortName: 'Rage',
    description: 'When frustration bypasses thought and becomes explosion.',
    bodySignal: 'Chest heat, fists clenching',
    gapLength: 'Seconds or less',
  },
];

export const patternMap: Record<PatternId, Pattern> = Object.fromEntries(
  patterns.map((p) => [p.id, p])
) as Record<PatternId, Pattern>;

export const patternNumberToId: Record<number, PatternId> = Object.fromEntries(
  patterns.map((p) => [p.number, p.id])
) as Record<number, PatternId>;

export const patternIdToNumber: Record<PatternId, number> = Object.fromEntries(
  patterns.map((p) => [p.id, p.number])
) as Record<PatternId, number>;
