// ============================================================
// THE ARCHIVIST VAULT — Interrupt Scripts
// Sourced from the book's "How to Interrupt" chapters (1.8–9.8)
// ============================================================

import type { InterruptScripts } from '../types/vault';

export const interruptScripts: InterruptScripts = {
  'disappearing': {
    circuitBreak:
      "STOP. The Disappearing Pattern just activated. You feel your chest tightening. The pattern wants you to pull away. You are choosing to stay and communicate instead.",
    shortCircuitBreak: "Pattern. Stay.",
    nextTenMinutes: [
      "Do not leave the room.",
      "Say one true sentence out loud: 'I am scared but I am here.'",
      "Breathe. The discomfort peaks at 90 seconds, fades by 3 minutes.",
      "If you must, say: 'I need a minute but I am not leaving.'"
    ],
    bodySignal: "Chest tightens. Legs want to stand. Hands want your phone. Eyes want the door.",
    gapDescription: "3–7 seconds between the 'I need to get out' thought and the behavior of creating distance.",
  },

  'apology-loop': {
    circuitBreak:
      "STOP. 'Sorry' is forming in your throat. Let it dissolve. You are about to apologize for existing. You have done nothing wrong.",
    shortCircuitBreak: "Not sorry. Thank you.",
    nextTenMinutes: [
      "Do not respond to that message yet.",
      "Get water.",
      "Breathe for 60 seconds.",
      "Then ask: 'Did I actually do something wrong?'",
      "Replace 'sorry' with 'thank you' — 'Sorry to bother you' becomes 'Thank you for your time.'"
    ],
    bodySignal: "Throat tightens before you speak. You physically shrink. 'Sorry' loads as the lead word.",
    gapDescription: "3–7 seconds between guilt arriving and 'sorry' coming out.",
  },

  'testing': {
    circuitBreak:
      "STOP. The Testing Pattern activated. You want to create a test to see if they really care. You are not creating a test. You are asking directly instead.",
    shortCircuitBreak: "Not a test. Ask directly.",
    nextTenMinutes: [
      "Put your phone down.",
      "Do not send that text.",
      "Box breathe: 4 seconds in, 4 hold, 4 out, 4 hold.",
      "Write what you actually need: 'I need to hear we are okay.'",
      "Then say it directly. No test. No trap."
    ],
    bodySignal: "Heart rate increases when checking phone. A provocative text is forming in your mind.",
    gapDescription: "Minutes to hours. The anxiety builds and ferments. Intervene in the first 15–30 minutes.",
  },

  'attraction-to-harm': {
    circuitBreak:
      "STOP. You feel intense chemistry. Check: are they safe or familiar? This is pattern recognition, not love. You are choosing not to pursue until you assess.",
    shortCircuitBreak: "Familiar, not safe.",
    nextTenMinutes: [
      "Do not text them back yet.",
      "Write a Safety Assessment on paper — not in your head.",
      "Safe indicators: texts back reasonably, keeps plans, consistent, calm feeling.",
      "Familiar-danger indicators: hot/cold, unpredictable, electricity at first meeting, reminds you of a parent.",
      "Apply the 72-Hour Rule. Do not act on this chemistry for 72 hours."
    ],
    bodySignal: "Intensity disproportionate to time spent. Emotional 9/10 after knowing someone a week. Obsession.",
    gapDescription: "Days to weeks. Opens at first 'chemistry' feeling. Closes as neurochemical bond forms (Week 2–3).",
  },

  'draining-bond': {
    circuitBreak:
      "STOP. You know you should leave this situation. You are staying out of pattern, not love or necessity. Leaving is self-preservation, not betrayal.",
    shortCircuitBreak: "Pattern, not loyalty.",
    nextTenMinutes: [
      "Say the circuit break out loud. Morning and evening.",
      "Write down three costs of this bond right now.",
      "Tell one outside person what is happening.",
      "If 'it is not that bad' surfaces — that phrase IS the pattern.",
      "Guilt peaks in 2–5 minutes, fades, then returns in cycles. Ride it."
    ],
    bodySignal: "Crushing physical guilt when considering your own well-being. Heaviness that lifts when you are away.",
    gapDescription: "Seconds to days. The moment between 'I should leave' and the guilt that cancels it.",
  },

  'compliment-deflection': {
    circuitBreak:
      "STOP. Someone just complimented you. You want to deflect. Say only: 'Thank you.' No deflection. No minimization. Close your mouth.",
    shortCircuitBreak: "Thank you. Full stop.",
    nextTenMinutes: [
      "Say 'Thank you' and stop talking.",
      "No 'but.' No joke. No minimization. No redirect.",
      "Feel the squirm. It peaks at 10–15 seconds, fades by 30.",
      "You did not lie by accepting praise. The wrongness feeling IS the pattern."
    ],
    bodySignal: "Heat — the spotlight feeling. Squirming. The urge to keep talking to complete the deflection.",
    gapDescription: "The moment between receiving the compliment and the deflection firing.",
  },

  'perfectionism': {
    circuitBreak:
      "STOP. You are revising again. This is the pattern, not quality control. Done is better than perfect. You are submitting now.",
    shortCircuitBreak: "Done. Submit.",
    nextTenMinutes: [
      "Close the file. Walk away.",
      "Do not reopen it.",
      "The discomfort is not a signal the work is not ready — it is the pattern losing control.",
      "Ask: 'Would someone without this pattern revise again?' If no, you are done.",
      "Set a timer next time. When it rings, stop and submit."
    ],
    bodySignal: "Your hand reaches for the scroll bar. Your mind says 'one more look.'",
    gapDescription: "The transition from 'working' to 'revising' — the moment you are about to go back for another pass.",
  },

  'success-sabotage': {
    circuitBreak:
      "STOP. Things are going well and you feel the urge to blow it up. This is the pattern. You do not have to act on this feeling. You can tolerate good.",
    shortCircuitBreak: "Tolerate good.",
    nextTenMinutes: [
      "Text someone you trust: 'The pattern is active. I want to [the thing]. I am waiting 48 hours.'",
      "Do not quit, send the text, pick the fight, or make the purchase.",
      "The pattern needs secrecy. Exposure weakens it immediately.",
      "Name the stability: 'Things are good right now. My discomfort with that is the pattern, not a warning.'",
      "Most sabotage impulses do not survive 48 hours. Wait."
    ],
    bodySignal: "Restlessness, agitation. The 'itch to blow something up.' Builds over days or weeks.",
    gapDescription: "Not seconds — a season. Restlessness builds over days/weeks. Prepare before you reach your set point.",
  },

  'rage': {
    circuitBreak:
      "STOP. The rage is here. It is not you. Leave this room for 20 minutes. You will return when you can speak, not explode.",
    shortCircuitBreak: "I need 20 minutes.",
    nextTenMinutes: [
      "Leave the room now. Do not wait for a response. Do not explain.",
      "Cold water on your wrists — activates the dive reflex, lowers heart rate.",
      "Breathe: 4 seconds in, 6 seconds out. Longer exhale activates parasympathetic.",
      "Walk slowly. Do not run — running can maintain activation.",
      "Do NOT rehearse the argument. Do NOT replay the trigger.",
      "Return check: Is the heat gone? Can you speak at normal volume? Can you see them as a person?"
    ],
    bodySignal: "Heat in chest. Voice getting tight. Fists clenching.",
    gapDescription: "Seconds or less — the smallest gap of all 9 patterns. The interrupt must be physical, not cognitive.",
  },
};
