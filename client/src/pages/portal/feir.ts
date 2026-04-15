// FEIR door color mapping. Each section maps to Focus / Excavation / Interruption / Rewrite.
export type FeirDoor = "F" | "E" | "I" | "R";

export const FEIR_COLORS: Record<FeirDoor, { name: string; accent: string; ambient: string }> = {
  F: { name: "FOCUS",        accent: "#00FFC2", ambient: "rgba(0,255,194,0.035)" },
  E: { name: "EXCAVATION",   accent: "#D4A574", ambient: "rgba(212,165,116,0.04)" },
  I: { name: "INTERRUPTION", accent: "#EC4899", ambient: "rgba(236,72,153,0.04)" },
  R: { name: "REWRITE",      accent: "#00FFC2", ambient: "rgba(0,255,194,0.035)" },
};

// Map a section id to a FEIR door. Falls back to Excavation (amber) — the library warmth.
export function feirForSection(sectionId: string): FeirDoor {
  // Module 0: emergency protocol → Interruption
  if (sectionId.startsWith("m0-")) return "I";

  // Module 1: foundation → Focus
  if (sectionId.startsWith("m1-")) return "F";

  // Module 2: the four doors themselves
  if (sectionId === "m2-2.1") return "F";
  if (sectionId === "m2-2.2") return "F"; // Door 1: Recognition
  if (sectionId === "m2-2.3") return "E"; // Door 2: Excavation
  if (sectionId === "m2-2.4") return "I"; // Door 3: Interruption
  if (sectionId === "m2-2.5") return "R"; // Door 4: Override (FEIR: Rewrite)

  // Module 3 pattern chapters: map by subsection number
  // .0 At a Glance, .1 What It Is, .2 Context, .3 Markers → Focus
  // .4 Execution Log, .5 Circuit, .6 Archaeology, .7 Costs → Excavation
  // .8 How to Interrupt → Interruption
  // .9 Override → Rewrite
  // .10 Troubleshooting, .11 Quick Reference → Interruption
  const pm = sectionId.match(/^p(\d+)-(\d+)\.(\d+)$/);
  if (pm) {
    const sub = parseInt(pm[3], 10);
    if (sub <= 3) return "F";
    if (sub <= 7) return "E";
    if (sub === 8) return "I";
    if (sub === 9) return "R";
    return "I";
  }

  // Module 4: 90-day implementation — map by week phase
  if (sectionId === "m4-4.1") return "F";
  if (sectionId === "m4-4.2") return "F"; // weeks 1-2 recognition
  if (sectionId === "m4-4.3") return "E"; // weeks 3-4 excavation
  if (sectionId === "m4-4.4") return "I"; // weeks 5-8 interruption
  if (sectionId === "m4-4.5") return "R"; // weeks 9-12 override
  if (sectionId.startsWith("m4-")) return "E";

  // Module 5: advanced protocols → Rewrite
  if (sectionId.startsWith("m5-")) return "R";

  // Module 6: context → Excavation
  if (sectionId.startsWith("m6-")) return "E";

  // Module 7: field notes → Excavation
  if (sectionId.startsWith("m7-")) return "E";

  // Module 8: resources → Focus
  if (sectionId.startsWith("m8-")) return "F";

  // Epilogue → Rewrite
  if (sectionId.startsWith("ep-")) return "R";

  return "E";
}
