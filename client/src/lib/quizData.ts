export type PatternKey = 
  | "disappearing" 
  | "apologyLoop" 
  | "testing" 
  | "attractionToHarm" 
  | "complimentDeflection" 
  | "drainingBond" 
  | "successSabotage"
  | "perfectionism"
  | "rage";

export interface QuizOption {
  id: string;
  text: string;
  pattern: PatternKey;
}

export interface QuizQuestion {
  id: number;
  title: string;
  options: QuizOption[];
  weight?: number;
}

export const patternDisplayNames: Record<PatternKey, string> = {
  disappearing: "The Disappearing Pattern",
  apologyLoop: "The Apology Loop",
  testing: "The Testing Pattern",
  attractionToHarm: "Attraction to Harm",
  complimentDeflection: "Compliment Deflection",
  drainingBond: "The Draining Bond",
  successSabotage: "Success Sabotage",
  perfectionism: "The Perfectionism Pattern",
  rage: "The Rage Pattern",
};

export const patternDescriptions: Record<PatternKey, string> = {
  disappearing: "You pull away when intimacy increases. The closer someone gets, the more you need to escape.",
  apologyLoop: "You apologize for existing, taking up space, having needs. You make yourself small to feel safe.",
  testing: "You create tests to see if people will stay. You push until they prove they won't leave\u2014or until they do.",
  attractionToHarm: "You're drawn to unavailable, chaotic, or slightly dangerous people. Safe feels boring.",
  complimentDeflection: "You can't accept positive acknowledgment. Praise makes you squirm, deflect, or disappear.",
  drainingBond: "You stay bonded to harmful people or situations long past when you should leave.",
  successSabotage: "You destroy things right before they succeed. Good things feel dangerous.",
  perfectionism: "If it's not perfect, it's garbage. So you don't finish. Or you don't start. Years of almost-finished projects.",
  rage: "It comes out of nowhere. One second you're fine, the next you're saying things you can't take back.",
};

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    title: "Good things start happening. You feel:",
    options: [
      { id: "1a", text: "The urge to burn it down before it burns you", pattern: "successSabotage" },
      { id: "1b", text: "Suspicious. What's the trap?", pattern: "testing" },
      { id: "1c", text: "Guilt. You don't get to have this.", pattern: "apologyLoop" },
      { id: "1d", text: "Walls going up. Exit located.", pattern: "disappearing" },
      { id: "1e", text: "Nothing. You stopped feeling years ago.", pattern: "drainingBond" },
    ],
  },
  {
    id: 2,
    title: "Someone says you're talented. You:",
    options: [
      { id: "2a", text: "Deflect. Change subject. Disappear into the wall.", pattern: "complimentDeflection" },
      { id: "2b", text: "Wonder what they're really after", pattern: "testing" },
      { id: "2c", text: "Apologize for taking up space", pattern: "apologyLoop" },
      { id: "2d", text: "Feel the pressure to never fail now", pattern: "perfectionism" },
      { id: "2e", text: "Don't believe them. Can't.", pattern: "drainingBond" },
    ],
  },
  {
    id: 3,
    title: "You're angry. What runs?",
    options: [
      { id: "3a", text: "You explode. Say things you can't take back.", pattern: "rage" },
      { id: "3b", text: "You swallow it. Apologize. Again.", pattern: "apologyLoop" },
      { id: "3c", text: "You vanish. Door. Phone off. Gone.", pattern: "disappearing" },
      { id: "3d", text: "You stay. Take it. Like always.", pattern: "drainingBond" },
      { id: "3e", text: "You weaponize it. Test them.", pattern: "testing" },
    ],
  },
  {
    id: 4,
    title: "Someone safe wants you. Gut check:",
    options: [
      { id: "4a", text: "Bored. Where's the chaos?", pattern: "attractionToHarm" },
      { id: "4b", text: "Waiting for the mask to slip", pattern: "testing" },
      { id: "4c", text: "Already planning your exit", pattern: "disappearing" },
      { id: "4d", text: "You don't deserve them", pattern: "apologyLoop" },
      { id: "4e", text: "You'll destroy this. Give it time.", pattern: "successSabotage" },
    ],
  },
  {
    id: 5,
    title: "You need something. You:",
    options: [
      { id: "5a", text: "Apologize before the ask leaves your mouth", pattern: "apologyLoop" },
      { id: "5b", text: "Drop hints. See if they care enough to notice.", pattern: "testing" },
      { id: "5c", text: "Say nothing. Need nothing. Want nothing.", pattern: "complimentDeflection" },
      { id: "5d", text: "Get angry when they don't just know", pattern: "rage" },
      { id: "5e", text: "Convince yourself you never needed it anyway", pattern: "drainingBond" },
    ],
  },
  {
    id: 6,
    title: "Project's almost done. What happens?",
    options: [
      { id: "6a", text: "You stop. Walk away. Can't finish.", pattern: "successSabotage" },
      { id: "6b", text: "You tweak it forever. Never ships.", pattern: "perfectionism" },
      { id: "6c", text: "You finish but tell no one", pattern: "complimentDeflection" },
      { id: "6d", text: "You finish but feel nothing", pattern: "drainingBond" },
      { id: "6e", text: "You're already onto the next thing", pattern: "disappearing" },
    ],
  },
  {
    id: 7,
    title: "Red flags feel like:",
    options: [
      { id: "7a", text: "Electricity", pattern: "attractionToHarm" },
      { id: "7b", text: "A test you need to pass", pattern: "testing" },
      { id: "7c", text: "Something you caused", pattern: "apologyLoop" },
      { id: "7d", text: "Home", pattern: "drainingBond" },
      { id: "7e", text: "Permission to leave", pattern: "disappearing" },
    ],
  },
  {
    id: 8,
    title: "Your relationship history:",
    options: [
      { id: "8a", text: "90 days. Max. Then you're gone.", pattern: "disappearing" },
      { id: "8b", text: "Toxic but alive. Safe feels dead.", pattern: "attractionToHarm" },
      { id: "8c", text: "You stayed until there was nothing left of you", pattern: "drainingBond" },
      { id: "8d", text: "You tested them until they proved you right", pattern: "testing" },
      { id: "8e", text: "You gave everything. Asked for nothing. Got nothing.", pattern: "apologyLoop" },
    ],
  },
  {
    id: 9,
    title: "You succeed. First feeling:",
    options: [
      { id: "9a", text: "Terror. It's about to collapse.", pattern: "successSabotage" },
      { id: "9b", text: "Fraud. They'll find out.", pattern: "perfectionism" },
      { id: "9c", text: "Guilt. Who are you to have this?", pattern: "apologyLoop" },
      { id: "9d", text: "Exposed. Too visible.", pattern: "complimentDeflection" },
      { id: "9e", text: "Empty. What now?", pattern: "drainingBond" },
    ],
  },
  {
    id: 10,
    title: "Someone gets too close. Body response:",
    options: [
      { id: "10a", text: "Chest locks. Walls up. Where's the door?", pattern: "disappearing" },
      { id: "10b", text: "Heart hammering. Scanning. What do they want?", pattern: "testing" },
      { id: "10c", text: "Shrinking. Taking up too much space.", pattern: "apologyLoop" },
      { id: "10d", text: "Heat building. Pressure rising.", pattern: "rage" },
      { id: "10e", text: "Numb. Frozen. Stuck.", pattern: "drainingBond" },
    ],
  },
  {
    id: 11,
    title: "You mess up. First thought:",
    options: [
      { id: "11a", text: "Knew it. You always ruin it.", pattern: "successSabotage" },
      { id: "11b", text: "They'll leave now. Watch.", pattern: "testing" },
      { id: "11c", text: "You're too much. You're not enough. Both.", pattern: "apologyLoop" },
      { id: "11d", text: "Rage. At them. At yourself.", pattern: "rage" },
      { id: "11e", text: "Whatever. Add it to the pile.", pattern: "drainingBond" },
    ],
  },
  {
    id: 12,
    title: "Visibility makes you:",
    options: [
      { id: "12a", text: "Want to evaporate", pattern: "complimentDeflection" },
      { id: "12b", text: "Suspicious. Why are they looking?", pattern: "testing" },
      { id: "12c", text: "Sorry for being seen", pattern: "apologyLoop" },
      { id: "12d", text: "Need to run", pattern: "disappearing" },
      { id: "12e", text: "Feel nothing. You're already gone inside.", pattern: "drainingBond" },
    ],
  },
  {
    id: 13,
    title: "Your relationships end because:",
    options: [
      { id: "13a", text: "You left before they could", pattern: "disappearing" },
      { id: "13b", text: "You pushed until they finally broke", pattern: "testing" },
      { id: "13c", text: "You stayed until you forgot who you were", pattern: "drainingBond" },
      { id: "13d", text: "You burned it down in one conversation", pattern: "rage" },
      { id: "13e", text: "You gave until you were empty, then resented them for it", pattern: "apologyLoop" },
    ],
  },
  {
    id: 14,
    title: "Deepest fear:",
    options: [
      { id: "14a", text: "Trapped. No exit.", pattern: "disappearing" },
      { id: "14b", text: "Abandoned. Confirmed unlovable.", pattern: "testing" },
      { id: "14c", text: "Burden. Too much. Not enough.", pattern: "apologyLoop" },
      { id: "14d", text: "Seen. Really seen.", pattern: "complimentDeflection" },
      { id: "14e", text: "Stuck here forever.", pattern: "drainingBond" },
      { id: "14f", text: "Hurt again. By someone you let in.", pattern: "attractionToHarm" },
    ],
  },
  {
    id: 15,
    title: "Which one lives in your body?",
    weight: 2,
    options: [
      { id: "15a", text: "Chest crushing. Walls closing. Get out get out get out.", pattern: "disappearing" },
      { id: "15b", text: "Throat tight. Shrinking. Sorry. Sorry. Sorry.", pattern: "apologyLoop" },
      { id: "15c", text: "Heart slamming. Scanning. Waiting for proof.", pattern: "testing" },
      { id: "15d", text: "Heat rising. Jaw locked. About to blow.", pattern: "rage" },
      { id: "15e", text: "Heavy. Stuck. Can't move. Can't leave.", pattern: "drainingBond" },
      { id: "15f", text: "Danger feels like home. Safety feels like boredom.", pattern: "attractionToHarm" },
      { id: "15g", text: "Paralyzed. Can't start. Can't fail if you don't try.", pattern: "perfectionism" },
      { id: "15h", text: "Panic at the finish line. Snatch defeat from victory.", pattern: "successSabotage" },
      { id: "15i", text: "Exposed. Seen. Want to disappear into the floor.", pattern: "complimentDeflection" },
    ],
  },
];

export function calculatePatternScores(answers: Record<number, string>): Record<PatternKey, number> {
  const scores: Record<PatternKey, number> = {
    disappearing: 0,
    apologyLoop: 0,
    testing: 0,
    attractionToHarm: 0,
    complimentDeflection: 0,
    drainingBond: 0,
    successSabotage: 0,
    perfectionism: 0,
    rage: 0,
  };

  for (const question of quizQuestions) {
    const selectedId = answers[question.id];
    if (!selectedId) continue;
    const option = question.options.find(o => o.id === selectedId);
    if (option) {
      const weight = question.weight || 1;
      scores[option.pattern] += weight;
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
  const secondaryPatterns = sorted
    .slice(1)
    .filter(([_, score]) => score >= 2)
    .map(([pattern]) => pattern as PatternKey);

  return {
    type: sorted.length >= 3 && sorted[1][1] === sorted[0][1] ? "multiple" : "primary",
    primaryPattern,
    secondaryPatterns,
    scores,
    totalScore: total,
  };
}
