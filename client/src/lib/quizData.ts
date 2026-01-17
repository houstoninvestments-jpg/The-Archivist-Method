export type PatternKey = 
  | "disappearing" 
  | "apologyLoop" 
  | "testing" 
  | "attractionToHarm" 
  | "complimentDeflection" 
  | "drainingBond" 
  | "successSabotage";

export interface QuizOption {
  id: string;
  text: string;
  scores: Partial<Record<PatternKey, number>>;
  isNone?: boolean;
}

export interface QuizQuestion {
  id: number;
  title: string;
  subtitle: string;
  options: QuizOption[];
}

export const patternDisplayNames: Record<PatternKey, string> = {
  disappearing: "The Disappearing Pattern",
  apologyLoop: "The Apology Loop",
  testing: "The Testing Pattern",
  attractionToHarm: "Attraction to Harm",
  complimentDeflection: "Compliment Deflection",
  drainingBond: "The Draining Bond",
  successSabotage: "Success Sabotage",
};

export const patternDescriptions: Record<PatternKey, string> = {
  disappearing: "You pull away when intimacy increases. The closer someone gets, the more you need to escape.",
  apologyLoop: "You apologize for existing, taking up space, having needs. You make yourself small to feel safe.",
  testing: "You create tests to see if people will stay. You push until they prove they won't leave—or until they do.",
  attractionToHarm: "You're drawn to unavailable, chaotic, or slightly dangerous people. Safe feels boring.",
  complimentDeflection: "You can't accept positive acknowledgment. Praise makes you squirm, deflect, or disappear.",
  drainingBond: "You stay bonded to harmful people or situations long past when you should leave.",
  successSabotage: "You destroy things right before they succeed. Good things feel dangerous.",
};

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    title: "Intimacy Response",
    subtitle: "You've been dating someone for 3 months. They text: \"I think I'm falling for you.\" What happens?",
    options: [
      { id: "1a", text: "Chest gets tight, I feel trapped, need space NOW", scores: { disappearing: 3 } },
      { id: "1b", text: "I wonder if they really mean it or if they'll change their mind", scores: { testing: 3, apologyLoop: 1 } },
      { id: "1c", text: "I want to say it back but can't feel it - something's blocking me", scores: { attractionToHarm: 2, disappearing: 1 } },
      { id: "1d", text: "I deflect with humor or change the subject", scores: { complimentDeflection: 2, disappearing: 1 } },
      { id: "1e", text: "I apologize for not being ready to say it back yet", scores: { apologyLoop: 3 } },
      { id: "1f", text: "None of these - I feel happy and reciprocate", scores: {}, isNone: true },
    ],
  },
  {
    id: 2,
    title: "Conflict Response",
    subtitle: "You're in a disagreement with someone you care about. What happens?",
    options: [
      { id: "2a", text: "I apologize even if I'm not wrong, just to end it", scores: { apologyLoop: 3, drainingBond: 1 } },
      { id: "2b", text: "I pick bigger fights to see if they'll still stay after", scores: { testing: 3 } },
      { id: "2c", text: "I shut down emotionally and disappear", scores: { disappearing: 3 } },
      { id: "2d", text: "I stay and argue but feel drained for days after", scores: { drainingBond: 2, testing: 1 } },
      { id: "2e", text: "I assume this means they're going to leave me", scores: { testing: 2, disappearing: 1 } },
      { id: "2f", text: "None of these fit", scores: {}, isNone: true },
    ],
  },
  {
    id: 3,
    title: "Success Proximity",
    subtitle: "You're one week from launching something important (project, business, goal). What do you feel?",
    options: [
      { id: "3a", text: "Sudden dread - something bad is coming, I should stop now", scores: { successSabotage: 3 } },
      { id: "3b", text: "Anxious that people will see it and judge me", scores: { complimentDeflection: 2, apologyLoop: 1 } },
      { id: "3c", text: "Like I should quit before I fail publicly", scores: { successSabotage: 2, complimentDeflection: 1 } },
      { id: "3d", text: "I keep finding reasons to delay the launch", scores: { successSabotage: 2 } },
      { id: "3e", text: "Urge to blow it up or create a crisis", scores: { successSabotage: 3 } },
      { id: "3f", text: "None of these - I feel ready and excited", scores: {}, isNone: true },
    ],
  },
  {
    id: 4,
    title: "Receiving Praise",
    subtitle: "Your boss publicly praises your work in a team meeting. What's your immediate reaction?",
    options: [
      { id: "4a", text: "Physically uncomfortable - I want to disappear or leave", scores: { complimentDeflection: 3 } },
      { id: "4b", text: "\"It was nothing\" or \"Anyone could have done it\"", scores: { complimentDeflection: 3, apologyLoop: 1 } },
      { id: "4c", text: "I assume they're setting me up for more work or harder tasks", scores: { testing: 2, apologyLoop: 1 } },
      { id: "4d", text: "I immediately point out everything I did wrong", scores: { complimentDeflection: 2, successSabotage: 1 } },
      { id: "4e", text: "I apologize or minimize it somehow", scores: { apologyLoop: 2, complimentDeflection: 2 } },
      { id: "4f", text: "None of these - I say thank you and accept it", scores: {}, isNone: true },
    ],
  },
  {
    id: 5,
    title: "Asking For Help",
    subtitle: "You need help with something. What stops you or happens when you ask?",
    options: [
      { id: "5a", text: "I feel like a burden - they're busy, I shouldn't bother them", scores: { apologyLoop: 3 } },
      { id: "5b", text: "I can't ask because then I'll owe them something", scores: { drainingBond: 2, testing: 1 } },
      { id: "5c", text: "I'd rather struggle alone than risk being told no", scores: { disappearing: 2, apologyLoop: 2 } },
      { id: "5d", text: "I ask but apologize 5+ times while doing it", scores: { apologyLoop: 3 } },
      { id: "5e", text: "I downplay how much I actually need the help", scores: { apologyLoop: 2, complimentDeflection: 1 } },
      { id: "5f", text: "Nothing stops me - I ask directly when I need help", scores: {}, isNone: true },
    ],
  },
  {
    id: 6,
    title: "Relationship Selection",
    subtitle: "Think about people you've been most attracted to. What's true?",
    options: [
      { id: "6a", text: "Unavailable, chaotic, or slightly dangerous - \"boring\" people don't interest me", scores: { attractionToHarm: 3 } },
      { id: "6b", text: "Safe people who prove they care, but then I test them until they leave", scores: { testing: 2, disappearing: 1 } },
      { id: "6c", text: "People who need me or who I can fix", scores: { drainingBond: 3, apologyLoop: 1 } },
      { id: "6d", text: "Anyone who shows interest - I feel like I can't be picky", scores: { apologyLoop: 2, drainingBond: 1 } },
      { id: "6e", text: "Consistent people feel wrong or boring compared to inconsistent ones", scores: { attractionToHarm: 3 } },
      { id: "6f", text: "None of these fit my pattern", scores: {}, isNone: true },
    ],
  },
  {
    id: 7,
    title: "Leaving Bad Situations",
    subtitle: "You're in a job/relationship/friendship that's clearly harmful. What keeps you there?",
    options: [
      { id: "7a", text: "Leaving feels like abandoning them - I can't do that", scores: { drainingBond: 3 } },
      { id: "7b", text: "They need me / Things will get better / I owe them", scores: { drainingBond: 3, apologyLoop: 1 } },
      { id: "7c", text: "I know I should leave but being alone feels worse", scores: { drainingBond: 2, disappearing: 1 } },
      { id: "7d", text: "I keep hoping they'll change back to who they used to be", scores: { drainingBond: 2, attractionToHarm: 1 } },
      { id: "7e", text: "I feel guilty about the idea of leaving", scores: { apologyLoop: 2, drainingBond: 2 } },
      { id: "7f", text: "I left when it got bad - this doesn't apply", scores: {}, isNone: true },
    ],
  },
  {
    id: 8,
    title: "Good Things Happening",
    subtitle: "When things are going really well in your life, what typically happens?",
    options: [
      { id: "8a", text: "I blow it up - quit, pick a fight, make a drastic change", scores: { successSabotage: 3 } },
      { id: "8b", text: "I wait for the other shoe to drop - good things don't last", scores: { successSabotage: 2, testing: 1 } },
      { id: "8c", text: "I feel guilty, like I don't deserve it", scores: { apologyLoop: 2, complimentDeflection: 2 } },
      { id: "8d", text: "I get uncomfortable with sustained happiness and create problems", scores: { successSabotage: 3 } },
      { id: "8e", text: "I minimize the success or redirect credit to others", scores: { complimentDeflection: 2, apologyLoop: 1 } },
      { id: "8f", text: "Good things continue - I don't sabotage them", scores: {}, isNone: true },
    ],
  },
  {
    id: 9,
    title: "Stating Boundaries",
    subtitle: "Someone crosses a boundary. What do you do?",
    options: [
      { id: "9a", text: "Say nothing - I don't want to cause conflict or seem difficult", scores: { apologyLoop: 3, drainingBond: 1 } },
      { id: "9b", text: "I apologize for having boundaries in the first place", scores: { apologyLoop: 3 } },
      { id: "9c", text: "State it but then test if they'll respect it", scores: { testing: 2, apologyLoop: 1 } },
      { id: "9d", text: "Pull away completely rather than have the conversation", scores: { disappearing: 3 } },
      { id: "9e", text: "I feel guilty for setting the boundary", scores: { apologyLoop: 2, drainingBond: 1 } },
      { id: "9f", text: "I state the boundary clearly and hold it", scores: {}, isNone: true },
    ],
  },
  {
    id: 10,
    title: "Trust Response",
    subtitle: "Someone proves they're safe, consistent, and trustworthy. How do you respond?",
    options: [
      { id: "10a", text: "I create tests to make sure they really mean it", scores: { testing: 3 } },
      { id: "10b", text: "I pull away - this feels wrong or unfamiliar", scores: { disappearing: 2, attractionToHarm: 2 } },
      { id: "10c", text: "I stay but keep waiting for them to leave or hurt me", scores: { testing: 2, drainingBond: 1 } },
      { id: "10d", text: "They feel \"boring\" compared to people who are inconsistent", scores: { attractionToHarm: 3 } },
      { id: "10e", text: "I assume I'll ruin it eventually and start protecting myself", scores: { successSabotage: 2, testing: 1 } },
      { id: "10f", text: "I trust them and let the relationship develop", scores: {}, isNone: true },
    ],
  },
];

export function calculatePatternScores(answers: Record<number, string[]>): Record<PatternKey, number> {
  const scores: Record<PatternKey, number> = {
    disappearing: 0,
    apologyLoop: 0,
    testing: 0,
    attractionToHarm: 0,
    complimentDeflection: 0,
    drainingBond: 0,
    successSabotage: 0,
  };

  for (const question of quizQuestions) {
    const selectedIds = answers[question.id] || [];
    for (const optionId of selectedIds) {
      const option = question.options.find(o => o.id === optionId);
      if (option && !option.isNone) {
        for (const [pattern, points] of Object.entries(option.scores)) {
          scores[pattern as PatternKey] += points;
        }
      }
    }
  }

  return scores;
}

export interface QuizResult {
  type: "primary" | "multiple" | "fallback";
  primaryPattern: PatternKey | null;
  secondaryPatterns: PatternKey[];
  scores: Record<PatternKey, number>;
  totalScore: number;
}

export function determineQuizResult(scores: Record<PatternKey, number>): QuizResult {
  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  const sorted = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .filter(([_, score]) => score > 0);

  if (total === 0) {
    return {
      type: "fallback",
      primaryPattern: null,
      secondaryPatterns: [],
      scores,
      totalScore: 0,
    };
  }

  const primaryPattern = sorted[0]?.[0] as PatternKey;
  const primaryScore = sorted[0]?.[1] || 0;
  const secondaryPatterns = sorted
    .slice(1)
    .filter(([_, score]) => score >= 6)
    .map(([pattern]) => pattern as PatternKey);

  if (primaryScore >= 15) {
    return {
      type: "primary",
      primaryPattern,
      secondaryPatterns,
      scores,
      totalScore: total,
    };
  }

  if (sorted.length >= 3 && sorted[2][1] >= 8) {
    return {
      type: "multiple",
      primaryPattern,
      secondaryPatterns: sorted.slice(1, 4).map(([p]) => p as PatternKey),
      scores,
      totalScore: total,
    };
  }

  return {
    type: "primary",
    primaryPattern,
    secondaryPatterns,
    scores,
    totalScore: total,
  };
}
