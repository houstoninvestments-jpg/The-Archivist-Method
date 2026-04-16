// Four Doors color mapping. Each section maps to one door.
export type Door = 1 | 2 | 3 | 4;

export const DOOR_COLORS: Record<Door, { name: string; accent: string; ambient: string }> = {
  1: { name: "FOCUS",        accent: "#00FFC2", ambient: "rgba(0,255,194,0.035)" },
  2: { name: "EXCAVATION",   accent: "#D4A574", ambient: "rgba(212,165,116,0.04)" },
  3: { name: "INTERRUPTION", accent: "#EC4899", ambient: "rgba(236,72,153,0.04)" },
  4: { name: "REWRITE",      accent: "#00FFC2", ambient: "rgba(0,255,194,0.035)" },
};

// Map a section id to a door. Falls back to Door 2 (Excavation, amber) — the library warmth.
export function doorForSection(sectionId: string): Door {
  // Module 0: emergency protocol → Interruption
  if (sectionId.startsWith("m0-")) return 3;

  // Module 1: foundation → Focus
  if (sectionId.startsWith("m1-")) return 1;

  // Module 2: the four doors themselves
  if (sectionId === "m2-2.1") return 1;
  if (sectionId === "m2-2.2") return 1; // Door 1: Focus
  if (sectionId === "m2-2.3") return 2; // Door 2: Excavation
  if (sectionId === "m2-2.4") return 3; // Door 3: Interruption
  if (sectionId === "m2-2.5") return 4; // Door 4: Rewrite

  // Module 3 pattern chapters: map by subsection number
  // .0 At a Glance, .1 What It Is, .2 Context, .3 Markers → Focus
  // .4 Execution Log, .5 Circuit, .6 Archaeology, .7 Costs → Excavation
  // .8 How to Interrupt → Interruption
  // .9 Rewrite → Rewrite
  // .10 Troubleshooting, .11 Quick Reference → Interruption
  const pm = sectionId.match(/^p(\d+)-(\d+)\.(\d+)$/);
  if (pm) {
    const sub = parseInt(pm[3], 10);
    if (sub <= 3) return 1;
    if (sub <= 7) return 2;
    if (sub === 8) return 3;
    if (sub === 9) return 4;
    return 3;
  }

  // Module 4: 90-day implementation — map by week phase
  if (sectionId === "m4-4.1") return 1;
  if (sectionId === "m4-4.2") return 1; // weeks 1-2 focus
  if (sectionId === "m4-4.3") return 2; // weeks 3-4 excavation
  if (sectionId === "m4-4.4") return 3; // weeks 5-8 interruption
  if (sectionId === "m4-4.5") return 4; // weeks 9-12 rewrite
  if (sectionId.startsWith("m4-")) return 2;

  // Module 5: advanced protocols → Rewrite
  if (sectionId.startsWith("m5-")) return 4;

  // Module 6: context → Excavation
  if (sectionId.startsWith("m6-")) return 2;

  // Module 7: field notes → Excavation
  if (sectionId.startsWith("m7-")) return 2;

  // Module 8: resources → Focus
  if (sectionId.startsWith("m8-")) return 1;

  // Epilogue → Rewrite
  if (sectionId.startsWith("ep-")) return 4;

  return 2;
}
