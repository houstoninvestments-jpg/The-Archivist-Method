export interface PatternDetail {
  name: string;
  bodySignature: string;
  circuitBreak: string;
}

export const PATTERN_DETAILS: Record<string, PatternDetail> = {
  disappearing: {
    name: "THE DISAPPEARING PATTERN",
    bodySignature: "Tightness in chest, urge to physically leave, numbness spreading through limbs.",
    circuitBreak: "When you feel the pull to vanish, name it: 'The pattern is running.' Stay 5 more minutes. That's the interrupt.",
  },
  apologyLoop: {
    name: "THE APOLOGY LOOP",
    bodySignature: "Shoulders hunching, voice getting quieter, stomach dropping before speaking.",
    circuitBreak: "Catch the 'sorry' before it leaves your mouth. Replace it with a statement: 'I need...' or 'I want...' That's the interrupt.",
  },
  testing: {
    name: "THE TESTING PATTERN",
    bodySignature: "Restless energy, scanning for threats, jaw clenching during calm moments.",
    circuitBreak: "When you create a test, ask: 'Am I testing or trusting?' Choose trust for 24 hours. That's the interrupt.",
  },
  attractionToHarm: {
    name: "ATTRACTION TO HARM",
    bodySignature: "Boredom with safety, excitement with instability, confusion between love and adrenaline.",
    circuitBreak: "When 'boring' appears, reframe: 'This is what safe feels like.' Sit with safe for one hour. That's the interrupt.",
  },
  complimentDeflection: {
    name: "COMPLIMENT DEFLECTION",
    bodySignature: "Heat in face, urge to look away, immediate mental list of why they're wrong.",
    circuitBreak: "When a compliment lands, say only: 'Thank you.' Nothing else. No qualifier. That's the interrupt.",
  },
  drainingBond: {
    name: "THE DRAINING BOND",
    bodySignature: "Guilt when considering boundaries, physical heaviness when near the person, exhaustion mistaken for love.",
    circuitBreak: "Ask: 'If a friend described this exact situation, what would I tell them?' Listen to your own advice. That's the interrupt.",
  },
  successSabotage: {
    name: "SUCCESS SABOTAGE",
    bodySignature: "Anxiety increasing as deadline approaches, sudden urge to destroy what you've built, feeling like a fraud.",
    circuitBreak: "When the urge to sabotage hits, finish one more step. Just one. Don't evaluate — execute. That's the interrupt.",
  },
  perfectionism: {
    name: "THE PERFECTIONISM PATTERN",
    bodySignature: "Paralysis. Dread. A widening gap between the vision in your head and reality on the page.",
    circuitBreak: "Perfectionism is telling you it's not ready. Done is better than perfect. Ship it. That's the interrupt.",
  },
  rage: {
    name: "THE RAGE PATTERN",
    bodySignature: "Heat rising from chest to face. Jaw tight. Pressure building behind your eyes like a dam about to break.",
    circuitBreak: "You feel the anger rising. This is the Rage Pattern. Don't say anything for 10 seconds. Breathe. That's the interrupt.",
  },
};

export function getPatternDetail(key: string | null | undefined): PatternDetail {
  if (key && PATTERN_DETAILS[key]) return PATTERN_DETAILS[key];
  return {
    name: "YOUR PATTERN",
    bodySignature: "Your body sends a signal 3 to 7 seconds before the pattern fires.",
    circuitBreak: "Name it out loud: 'A pattern is running.' That's the interrupt.",
  };
}
