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
  recognition: string;
}

export interface QuizQuestion {
  id: number;
  title: string;
  options: QuizOption[];
  isTripleWeighted?: boolean;
  isSingleSelect?: boolean;
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
  testing: "You create tests to see if people will stay. You push until they prove they won't leave—or until they do.",
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
      { id: "1a", text: "The urge to burn it down before it burns you", pattern: "successSabotage", recognition: "You end it before it ends you." },
      { id: "1b", text: "Suspicious. What's the trap?", pattern: "testing", recognition: "The pattern is already scanning." },
      { id: "1c", text: "Guilt. You don't get to have this.", pattern: "apologyLoop", recognition: "That's not humility. That's the wound." },
      { id: "1d", text: "Walls going up. Exit located.", pattern: "disappearing", recognition: "Your nervous system just confirmed it." },
      { id: "1e", text: "Nothing. You stopped feeling years ago.", pattern: "attractionToHarm", recognition: "Numbness is its own signal." },
    ],
  },
  {
    id: 2,
    title: "Someone says you're talented. You:",
    options: [
      { id: "2a", text: "Deflect. Change subject. Disappear into the wall.", pattern: "complimentDeflection", recognition: "You just rejected what was true." },
      { id: "2b", text: "Wonder what they're really after", pattern: "testing", recognition: "The pattern doesn't trust gifts." },
      { id: "2c", text: "Apologize for taking up space", pattern: "apologyLoop", recognition: "That's the pattern speaking." },
      { id: "2d", text: "Feel the pressure to never fail now", pattern: "perfectionism", recognition: "The bar just moved again." },
      { id: "2e", text: "Don't believe them. Can't.", pattern: "attractionToHarm", recognition: "The wound decides what's real." },
    ],
  },
  {
    id: 3,
    title: "You're angry. What runs?",
    options: [
      { id: "3a", text: "You explode. Say things you can't take back.", pattern: "rage", recognition: "The heat moved before you decided." },
      { id: "3b", text: "You swallow it. Apologize. Again.", pattern: "apologyLoop", recognition: "You made yourself smaller again." },
      { id: "3c", text: "You vanish. Door. Phone off. Gone.", pattern: "disappearing", recognition: "Exit before impact." },
      { id: "3d", text: "You stay. Take it. Like always.", pattern: "drainingBond", recognition: "Staying is its own pattern." },
      { id: "3e", text: "You weaponize it. Test them.", pattern: "testing", recognition: "Anger as a loyalty test." },
    ],
  },
  {
    id: 4,
    title: "Someone safe wants you. Gut check:",
    options: [
      { id: "4a", text: "Bored. Where's the chaos?", pattern: "attractionToHarm", recognition: "Safety doesn't feel like safety yet." },
      { id: "4b", text: "Waiting for the mask to slip", pattern: "testing", recognition: "The pattern expects betrayal." },
      { id: "4c", text: "Already planning your exit", pattern: "disappearing", recognition: "The door found before the feeling." },
      { id: "4d", text: "You don't deserve them", pattern: "apologyLoop", recognition: "That's not true. That's old." },
      { id: "4e", text: "You'll destroy this. Give it time.", pattern: "successSabotage", recognition: "The pattern already knows how this ends." },
    ],
  },
  {
    id: 5,
    title: "You need something. You:",
    options: [
      { id: "5a", text: "Apologize before the ask leaves your mouth", pattern: "apologyLoop", recognition: "Needs became dangerous early." },
      { id: "5b", text: "Drop hints. See if they care enough to notice.", pattern: "testing", recognition: "A test disguised as a need." },
      { id: "5c", text: "Say nothing. Need nothing. Want nothing.", pattern: "complimentDeflection", recognition: "Self-erasure as protection." },
      { id: "5d", text: "Get angry when they don't just know", pattern: "rage", recognition: "Unspoken needs become explosions." },
      { id: "5e", text: "Convince yourself you never needed it anyway", pattern: "perfectionism", recognition: "Denial as control." },
    ],
  },
  {
    id: 6,
    title: "Project's almost done. What happens?",
    options: [
      { id: "6a", text: "You stop. Walk away. Can't finish.", pattern: "successSabotage", recognition: "The pattern pulled the brake." },
      { id: "6b", text: "You tweak it forever. Never ships.", pattern: "perfectionism", recognition: "Perfect is the enemy of done and you know it." },
      { id: "6c", text: "You finish but tell no one", pattern: "complimentDeflection", recognition: "Done but hidden. Safe." },
      { id: "6d", text: "You finish but feel nothing", pattern: "attractionToHarm", recognition: "The reward doesn't land." },
      { id: "6e", text: "You're already onto the next thing", pattern: "disappearing", recognition: "Forward motion as escape." },
    ],
  },
  {
    id: 7,
    title: "Red flags feel like:",
    options: [
      { id: "7a", text: "Electricity", pattern: "attractionToHarm", recognition: "Familiar voltage." },
      { id: "7b", text: "A test you need to pass", pattern: "testing", recognition: "Danger as a loyalty exam." },
      { id: "7c", text: "Something you caused", pattern: "apologyLoop", recognition: "Their chaos became your fault." },
      { id: "7d", text: "Home", pattern: "drainingBond", recognition: "The pattern recognizes the pattern." },
      { id: "7e", text: "Permission to leave", pattern: "disappearing", recognition: "Finally. A reason." },
    ],
  },
  {
    id: 8,
    title: "Your relationship history:",
    options: [
      { id: "8a", text: "90 days. Max. Then you're gone.", pattern: "disappearing", recognition: "The timer was always running." },
      { id: "8b", text: "Toxic but alive. Safe feels dead.", pattern: "attractionToHarm", recognition: "You've been chasing that voltage." },
      { id: "8c", text: "You stayed until there was nothing left of you", pattern: "drainingBond", recognition: "You gave until empty." },
      { id: "8d", text: "You tested them until they proved you right", pattern: "testing", recognition: "You wrote the ending before they did." },
      { id: "8e", text: "You gave everything. Asked for nothing. Got nothing.", pattern: "apologyLoop", recognition: "That's the whole story." },
    ],
  },
  {
    id: 9,
    title: "You succeed. First feeling:",
    options: [
      { id: "9a", text: "Terror. It's about to collapse.", pattern: "successSabotage", recognition: "The pattern doesn't trust the win." },
      { id: "9b", text: "Fraud. They'll find out.", pattern: "perfectionism", recognition: "Impostor before the ink dries." },
      { id: "9c", text: "Guilt. Who are you to have this?", pattern: "apologyLoop", recognition: "Success feels like stealing." },
      { id: "9d", text: "Exposed. Too visible.", pattern: "complimentDeflection", recognition: "Good things make you a target." },
      { id: "9e", text: "Empty. What now?", pattern: "attractionToHarm", recognition: "The high didn't land." },
    ],
  },
  {
    id: 10,
    title: "Someone gets too close. Body response:",
    options: [
      { id: "10a", text: "Chest locks. Walls up. Where's the door?", pattern: "disappearing", recognition: "The body found the exit first." },
      { id: "10b", text: "Heart hammering. Scanning. What do they want?", pattern: "testing", recognition: "Closeness as threat assessment." },
      { id: "10c", text: "Shrinking. Taking up too much space.", pattern: "apologyLoop", recognition: "You got smaller so they'd stay." },
      { id: "10d", text: "Heat building. Pressure rising.", pattern: "rage", recognition: "Proximity as pressure." },
      { id: "10e", text: "Numb. Frozen. Stuck.", pattern: "drainingBond", recognition: "Shutdown as survival." },
    ],
  },
  {
    id: 11,
    title: "You mess up. First thought:",
    options: [
      { id: "11a", text: "Knew it. You always ruin it.", pattern: "successSabotage", recognition: "The pattern was waiting for proof." },
      { id: "11b", text: "They'll leave now. Watch.", pattern: "testing", recognition: "Mistakes as abandonment triggers." },
      { id: "11c", text: "You're too much. You're not enough. Both.", pattern: "apologyLoop", recognition: "The impossible standard." },
      { id: "11d", text: "Rage. At them. At yourself.", pattern: "rage", recognition: "Shame that moves like fire." },
      { id: "11e", text: "Whatever. Add it to the pile.", pattern: "complimentDeflection", recognition: "Numbness as armor." },
    ],
  },
  {
    id: 12,
    title: "Visibility makes you:",
    options: [
      { id: "12a", text: "Want to evaporate", pattern: "complimentDeflection", recognition: "Seen feels like exposed." },
      { id: "12b", text: "Suspicious. Why are they looking?", pattern: "testing", recognition: "Attention as threat." },
      { id: "12c", text: "Sorry for being seen", pattern: "apologyLoop", recognition: "Existing feels like an imposition." },
      { id: "12d", text: "Need to run", pattern: "disappearing", recognition: "Visibility triggers the exit." },
      { id: "12e", text: "Feel nothing. Already gone inside.", pattern: "attractionToHarm", recognition: "Checked out before they could." },
    ],
  },
  {
    id: 13,
    title: "Your relationships end because:",
    options: [
      { id: "13a", text: "You left before they could", pattern: "disappearing", recognition: "You wrote the ending first." },
      { id: "13b", text: "You pushed until they finally broke", pattern: "testing", recognition: "You needed to know for sure." },
      { id: "13c", text: "You stayed until you forgot who you were", pattern: "drainingBond", recognition: "You dissolved into them." },
      { id: "13d", text: "You burned it down in one conversation", pattern: "rage", recognition: "One moment. Everything gone." },
      { id: "13e", text: "You gave until empty then resented them for it", pattern: "apologyLoop", recognition: "Generosity as slow destruction." },
    ],
  },
  {
    id: 14,
    title: "Deepest fear:",
    options: [
      { id: "14a", text: "Trapped. No exit.", pattern: "disappearing", recognition: "The pattern lives in this fear." },
      { id: "14b", text: "Abandoned. Confirmed unlovable.", pattern: "testing", recognition: "Every test is really this question." },
      { id: "14c", text: "Burden. Too much. Not enough.", pattern: "apologyLoop", recognition: "The fear that runs the apology." },
      { id: "14d", text: "Seen. Really seen.", pattern: "complimentDeflection", recognition: "Visibility as vulnerability." },
      { id: "14e", text: "Stuck here forever.", pattern: "drainingBond", recognition: "The fear that keeps you staying." },
      { id: "14f", text: "Hurt again. By someone you let in.", pattern: "attractionToHarm", recognition: "The wound that picks the wrong people." },
    ],
  },
  {
    id: 15,
    title: "Someone finally treats you well. Consistently. No drama. You:",
    options: [
      { id: "15a", text: "Start waiting for it to end. It always does.", pattern: "successSabotage", recognition: "The pattern doesn't trust the good." },
      { id: "15b", text: "Feel suffocated. Where's the edge?", pattern: "attractionToHarm", recognition: "Peace feels like danger." },
      { id: "15c", text: "Wonder what you have to do to keep it.", pattern: "apologyLoop", recognition: "Love as transaction." },
      { id: "15d", text: "Feel nothing. Good doesn't register anymore.", pattern: "drainingBond", recognition: "You're already somewhere else." },
      { id: "15e", text: "Get uncomfortable. Too exposed.", pattern: "complimentDeflection", recognition: "Goodness as threat." },
    ],
  },
  {
    id: 16,
    title: "You're almost there. Finish line is visible. You:",
    options: [
      { id: "16a", text: "Find a reason it's not ready yet.", pattern: "perfectionism", recognition: "The bar moved again." },
      { id: "16b", text: "Suddenly can't remember why you started.", pattern: "successSabotage", recognition: "The pattern pulled the meaning out." },
      { id: "16c", text: "Let someone else cross it. You'll start over.", pattern: "complimentDeflection", recognition: "Victory handed off." },
      { id: "16d", text: "Push so hard you destroy what got you here.", pattern: "rage", recognition: "Burning the bridge you're standing on." },
      { id: "16e", text: "Convince yourself you never wanted it anyway.", pattern: "attractionToHarm", recognition: "Desire denied before loss." },
    ],
  },
  {
    id: 17,
    title: "They need you. Again. You know you should say no. You:",
    options: [
      { id: "17a", text: "Say yes. Feel resentment building instantly.", pattern: "drainingBond", recognition: "Yes as slow self-destruction." },
      { id: "17b", text: "Say yes. Apologize for not doing more.", pattern: "apologyLoop", recognition: "The yes that was never enough." },
      { id: "17c", text: "Say yes. Then disappear for three days after.", pattern: "disappearing", recognition: "Compliance then escape." },
      { id: "17d", text: "Say no. Then spend a week making up for it.", pattern: "perfectionism", recognition: "The no that costs everything." },
      { id: "17e", text: "Say yes. At least chaos feels like connection.", pattern: "attractionToHarm", recognition: "Need as the only intimacy you trust." },
    ],
  },
  {
    id: 18,
    title: "You're being praised publicly. Room full of people. Body:",
    options: [
      { id: "18a", text: "Heat. Jaw tight. Who gave them the right.", pattern: "rage", recognition: "Praise as provocation." },
      { id: "18b", text: "Shrink. Get smaller. Don't let them see you sweat.", pattern: "complimentDeflection", recognition: "Disappearing in plain sight." },
      { id: "18c", text: "Already composing the apology for taking up space.", pattern: "apologyLoop", recognition: "Gratitude converted to guilt." },
      { id: "18d", text: "Scanning every face for the one who doesn't mean it.", pattern: "testing", recognition: "The pattern finds the threat." },
      { id: "18e", text: "Mentally already out the door.", pattern: "disappearing", recognition: "Gone before the applause ends." },
    ],
  },
  {
    id: 19,
    title: "Right before you self-sabotage, your body feels:",
    options: [
      { id: "19a", text: "Electric. Like finally something real.", pattern: "attractionToHarm", recognition: "Destruction as aliveness." },
      { id: "19b", text: "Heavy. Like you knew this would happen.", pattern: "successSabotage", recognition: "The pattern fulfilling its own prophecy." },
      { id: "19c", text: "Numb. Disconnected. Watching yourself do it.", pattern: "drainingBond", recognition: "Dissociation as pattern execution." },
      { id: "19d", text: "Rageful. At everyone who got you here.", pattern: "rage", recognition: "Blame that moves faster than choice." },
      { id: "19e", text: "Relieved. At least you controlled the ending.", pattern: "disappearing", recognition: "Self-sabotage as exit strategy." },
    ],
  },
  {
    id: 20,
    title: "The one that lives in you right now:",
    isTripleWeighted: true,
    isSingleSelect: true,
    options: [
      { id: "20a", text: "I protect myself by leaving first. Always.", pattern: "disappearing", recognition: "That's the one." },
      { id: "20b", text: "I'm sorry for existing too loudly.", pattern: "apologyLoop", recognition: "That's the one." },
      { id: "20c", text: "I push people to prove they won't go.", pattern: "testing", recognition: "That's the one." },
      { id: "20d", text: "I explode. Then hate myself. Then do it again.", pattern: "rage", recognition: "That's the one." },
      { id: "20e", text: "I stay in things that are killing me because leaving feels worse.", pattern: "drainingBond", recognition: "That's the one." },
      { id: "20f", text: "Broken feels like home. Whole feels like a lie.", pattern: "attractionToHarm", recognition: "That's the one." },
      { id: "20g", text: "I burn it down right before it works. Every time.", pattern: "successSabotage", recognition: "That's the one." },
      { id: "20h", text: "I can't ship it. Can't finish it. Can't let it be seen.", pattern: "perfectionism", recognition: "That's the one." },
      { id: "20i", text: "Good things land on me and slide right off. I can't keep them.", pattern: "complimentDeflection", recognition: "That's the one." },
    ],
  },
];

// Max possible score: (19 questions × 3 max answers × 1 point) + (1 question × 1 answer × 3 points) = 60
export const MAX_POSSIBLE_SCORE = 60;

export function calculatePatternScores(answers: Record<number, string[]>): Record<PatternKey, number> {
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
    const selectedIds = answers[question.id] || [];
    for (const selectedId of selectedIds) {
      const option = question.options.find(o => o.id === selectedId);
      if (option) {
        const points = question.isTripleWeighted ? 3 : 1;
        scores[option.pattern] += points;
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

export function determineQuizResult(rawScores: Record<PatternKey, number>): QuizResult {
  // Convert raw scores to percentages
  const scores: Record<PatternKey, number> = {} as Record<PatternKey, number>;
  for (const key of Object.keys(rawScores) as PatternKey[]) {
    scores[key] = Math.round((rawScores[key] / MAX_POSSIBLE_SCORE) * 100);
  }

  const total = Object.values(rawScores).reduce((a, b) => a + b, 0);
  const sorted = (Object.entries(scores) as [PatternKey, number][])
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

  const primaryPattern = sorted[0][0];
  const secondaryPatterns = sorted.slice(1, 3).map(([pattern]) => pattern);

  return {
    type: "primary",
    primaryPattern,
    secondaryPatterns,
    scores,
    totalScore: total,
  };
}

export const feelSeenCopy: Record<PatternKey, string[]> = {
  disappearing: [
    "You leave before they can leave you. Three months in and your chest gets tight. You feel the walls closing. You're already planning your exit before they even know something's wrong.",
    "It's not that you don't care. You care so much it terrifies you. So you run. Every time."
  ],
  apologyLoop: [
    "Sorry. Sorry. Sorry. You apologize for asking. For needing. For taking up space. You make yourself small before anyone can tell you you're too much.",
    "You've turned \"sorry\" into a reflex. It leaves your mouth before you even know why. And every time, you shrink a little more."
  ],
  testing: [
    "You don't ask if they love you. You make them prove it. You pick fights at midnight. You push them away to see if they'll fight to stay.",
    "You already know how it ends. They leave. And part of you is relieved—because at least you were right."
  ],
  attractionToHarm: [
    "The safe ones bore you. The red flags feel like chemistry. You know they're bad for you—that's what makes it exciting.",
    "You've confused danger with desire so many times you don't know the difference anymore. Calm feels suspicious. Chaos feels like home."
  ],
  complimentDeflection: [
    "\"You're so talented.\" You flinch. You deflect. You explain why it wasn't that good. Visibility feels dangerous. Being seen feels like being a target.",
    "You've gotten so good at disappearing in plain sight that people don't even notice when you leave the room."
  ],
  drainingBond: [
    "You know you should leave. Everyone tells you to leave. Your body tells you to leave. You stay. The guilt of going feels worse than the pain of staying.",
    "You've forgotten what it feels like to have energy for yourself. Everything goes to them. Everything."
  ],
  successSabotage: [
    "You get close. Then you blow it up. Right before the win, something in you pulls the pin. You're not afraid of failure—you're afraid of what happens if you actually succeed.",
    "You've snatched defeat from victory so many times it almost feels intentional. Because it is. You just don't know why yet."
  ],
  perfectionism: [
    "If it's not perfect, it's garbage. So you tweak endlessly. Or you don't start at all. You're not lazy—you're terrified of the gap between your vision and your output.",
    "You have a graveyard of almost-finished things. Years of work no one has ever seen. Not because it isn't good—because it isn't perfect."
  ],
  rage: [
    "It comes fast. One second you're fine, the next you're saying things you can't take back. The anger takes over. Afterward, you barely recognize who that was.",
    "The shame hits harder than the anger ever did. You promise it won't happen again. Until it does."
  ],
};

export const breadcrumbData: Record<PatternKey, { triggers: string; costs: string; whyWillpowerFails: string }> = {
  disappearing: {
    triggers: "Intimacy crosses a threshold. Someone gets close enough to actually see you. Three months in, the chest tightens. You feel the walls before you even know you're building them.",
    costs: "Every relationship has an expiration date you set before it starts. You've lost people who actually loved you. The loneliness isn't the worst part—it's knowing you chose it.",
    whyWillpowerFails: "You can't just decide to stay. The exit reflex is wired into your nervous system. It fires before your conscious mind even registers what's happening. Willpower can't outrun a survival response.",
  },
  apologyLoop: {
    triggers: "Having a need. Taking up space. Saying something that lands wrong. Existing too loudly. The trigger is almost anything—because the real trigger is visibility itself.",
    costs: "You've made yourself so small that people forget you're in the room. Your needs go unmet because you never voice them. Resentment builds in the silence you created.",
    whyWillpowerFails: "You can't just stop apologizing. The reflex is a survival strategy from when making yourself small kept you safe. Your body still believes that being seen is dangerous.",
  },
  testing: {
    triggers: "Someone says they love you. Things get too good. Too stable. Too safe. Your nervous system reads peace as the calm before the storm—so you create the storm yourself.",
    costs: "You've driven away people who meant it. Every test has an expiration date, and eventually, they stop trying to pass. Then you point to their leaving as proof you were right.",
    whyWillpowerFails: "The testing isn't a choice—it's a compulsion. Your attachment system is wired to expect abandonment, so it manufactures evidence. You can't think your way out of a nervous system pattern.",
  },
  attractionToHarm: {
    triggers: "Safety. Boredom. The absence of chaos. When things are calm, your body reads it as wrong. The dangerous ones feel like electricity because your nervous system confused threat with connection early.",
    costs: "Your body is a map of relationships that hurt you. You've normalized pain as the price of passion. The safe ones never stood a chance—not because they weren't enough, but because enough felt like nothing.",
    whyWillpowerFails: "You can't just choose the safe person. Your attraction template was written before you had language. Chemistry isn't a preference—it's a trauma signature. The pull toward harm feels like desire because that's how your brain learned love.",
  },
  complimentDeflection: {
    triggers: "Someone sees you. Really sees you. A compliment. Recognition. Being put in the spotlight. Your body reads visibility as exposure, and exposure as danger.",
    costs: "Years of work no one has seen. Promotions you didn't apply for. Relationships you ended because being known felt like being hunted. You've hidden from the very thing you want most.",
    whyWillpowerFails: "You can't force yourself to accept praise. The deflection is a reflex, not a decision. Your nervous system learned early that being seen made you a target. Until you rewire that association, willpower just creates a performance of acceptance.",
  },
  drainingBond: {
    triggers: "Guilt. Obligation. The look on their face when you consider leaving. The voice that says you're the only one who understands them. You stay because leaving feels like destroying someone.",
    costs: "You've given yourself away in pieces until there's nothing left. Your health, your friendships, your ambitions—all sacrificed on the altar of someone else's need. You forgot what you wanted years ago.",
    whyWillpowerFails: "The bond isn't rational—it's biochemical. Trauma bonds hijack the same reward pathways as addiction. Your brain gets withdrawal symptoms when you try to leave. Willpower can't override chemistry.",
  },
  successSabotage: {
    triggers: "The finish line. The moment right before the win. The promotion. The relationship that's actually working. Success itself is the trigger—because your system doesn't have a template for what comes after.",
    costs: "A trail of almost-victories. Jobs you left at the worst time. Relationships you detonated right when they got good. You've built a life-sized monument to the gap between your potential and your reality.",
    whyWillpowerFails: "The sabotage happens at the neurological level. Your identity was formed around struggle, not success. When you get close to the win, your brain treats it as an identity threat. You can't willpower yourself into becoming someone your nervous system doesn't recognize.",
  },
  perfectionism: {
    triggers: "The gap between your vision and your output. The first draft. The imperfect attempt. Starting something where failure is possible. Your standards are the cage—impossibly high, perfectly designed to keep you frozen.",
    costs: "Years of unfinished work. Ideas that never left your head. The ache of watching less talented people succeed because they shipped while you perfected. You're not protecting quality—you're protecting yourself from judgment.",
    whyWillpowerFails: "You can't just lower your standards. Perfectionism isn't about quality—it's about control. It's the illusion that if you make it perfect enough, no one can hurt you. The real fear isn't imperfection. It's being seen as you actually are.",
  },
  rage: {
    triggers: "Disrespect. Feeling unheard. Boundaries crossed. The trigger is almost never the thing that sets it off—it's the accumulation of everything you swallowed before. The explosion comes when the pressure exceeds your capacity to contain it.",
    costs: "Relationships ended in a single conversation. Words you can never take back. The look on their face that you see every time you close your eyes. The shame spiral that follows is worse than whatever triggered the rage.",
    whyWillpowerFails: "The rage bypasses your prefrontal cortex entirely. By the time you're aware you're angry, your amygdala has already hijacked the controls. Willpower works in the calm moments—not in the 3-7 second window where the pattern fires.",
  },
};

export const circuitBreakData: Record<PatternKey, string> = {
  disappearing: "When the chest tightens and your hand reaches for the exit — stop. Put both feet flat on the floor. Name one thing you can see, one thing you can hear. You're not leaving yet. You're just standing still for ten seconds. That's the entire protocol: don't move until the wave passes.",
  apologyLoop: "Next time 'sorry' rises in your throat — hold it for five seconds. Replace it with what you actually mean: 'Thank you for waiting,' 'I have a question,' 'I need something.' The apology is a shield. Put it down once and feel what happens when you take up the space you already deserve.",
  testing: "The next time you feel the urge to test someone — text them something honest instead. Not a trap. Not a riddle. One true sentence: 'I'm scared you'll leave.' The test is a question you already know the answer to. Ask the real one instead.",
  attractionToHarm: "When the dangerous one lights you up — pause. Put your hand on your sternum and say: 'This is recognition, not love.' Your body learned to call alarm bells chemistry. Name the sensation for what it is. Familiar is not the same as safe.",
  complimentDeflection: "Next time someone compliments you, do not speak for three seconds. Let the words land. Don't deflect, don't explain, don't minimize. Just say 'Thank you' — and sit in the discomfort of being seen. The flinch will come. Let it pass through you without acting on it.",
  drainingBond: "Set one boundary this week that costs you nothing but guilt. 'I can't talk after 10pm.' That's it. Say it once. Don't explain. Don't apologize. The guilt you feel is the pattern fighting to survive — it is not evidence that you're a bad person.",
  successSabotage: "The next time something goes well — do nothing. Don't celebrate, don't deflect, don't blow it up. Just sit with the win for sixty seconds and notice what your body does. The itch to sabotage is loudest right after success. Name it: 'There's the pull.' Then don't follow it.",
  perfectionism: "Finish one thing at 80%. Send it, post it, ship it — before the revision voice kicks in. Set a timer for the amount of work left and when it rings, you're done. The gap between your vision and your output is not a flaw. It's where the work lives.",
  rage: "When you feel the heat rising — before you speak, press your tongue to the roof of your mouth and exhale through your nose for four seconds. You have a three-to-seven-second window before the pattern takes the wheel. This one breath is the entire gap. Use it.",
};
