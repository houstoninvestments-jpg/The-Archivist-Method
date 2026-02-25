import { readFile } from "fs/promises";
import { join } from "path";

const CONTENT_ROOT = join(process.cwd(), "the-archivist-method");

export interface Section {
  id: string;
  title: string;
  filePath: string;
  module: string;
  estimatedReadMinutes?: number;
}

export interface TocGroup {
  id: string;
  title: string;
  sections: Section[];
}

export interface TocTree {
  groups: TocGroup[];
}

const patternKeyToDirMap: Record<string, string> = {
  disappearing: "pattern-1-disappearing",
  apologyLoop: "pattern-2-apology-loop",
  testing: "pattern-3-testing",
  attractionToHarm: "pattern-4-attraction-to-harm",
  drainingBond: "pattern-5-draining-bond",
  complimentDeflection: "pattern-6-compliment-deflection",
  perfectionism: "pattern-7-perfectionism",
  successSabotage: "pattern-8-success-sabotage",
  rage: "pattern-9-rage",
};

const patternDirToKeyMap: Record<string, string> = Object.fromEntries(
  Object.entries(patternKeyToDirMap).map(([k, v]) => [v, k])
);

const patternDisplayName: Record<string, string> = {
  disappearing: "The Disappearing Pattern",
  apologyLoop: "The Apology Loop",
  testing: "The Testing Pattern",
  attractionToHarm: "Attraction to Harm",
  drainingBond: "The Draining Bond",
  complimentDeflection: "Compliment Deflection",
  perfectionism: "Perfectionism",
  successSabotage: "Success Sabotage",
  rage: "Rage",
};

function titleFromFilename(filename: string): string {
  const name = filename.replace(/\.md$/, "").replace(/^\d+\.\d+-/, "").replace(/^\d+-/, "");
  return name
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function estimateReadTime(content: string): number {
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

const MODULE_0_SECTIONS: Section[] = [
  { id: "m0-0.1", title: "You Just Ran Your Pattern", filePath: "module-0-emergency/0.1-you-just-ran-your-pattern.md", module: "module-0" },
  { id: "m0-0.2", title: "Five-Minute Emergency", filePath: "module-0-emergency/0.2-five-minute-emergency.md", module: "module-0" },
  { id: "m0-0.3", title: "Which Pattern", filePath: "module-0-emergency/0.3-which-pattern.md", module: "module-0" },
  { id: "m0-0.4", title: "Crisis Triage", filePath: "module-0-emergency/0.4-crisis-triage.md", module: "module-0" },
];

const MODULE_1_SECTIONS: Section[] = [
  { id: "m1-1.1", title: "What This Is", filePath: "module-1-foundation/1.1-what-this-is.md", module: "module-1" },
  { id: "m1-1.2", title: "Why Not Therapy", filePath: "module-1-foundation/1.2-why-not-therapy.md", module: "module-1" },
  { id: "m1-1.3", title: "Why Different", filePath: "module-1-foundation/1.3-why-different.md", module: "module-1" },
  { id: "m1-1.4", title: "Who This Isn't For", filePath: "module-1-foundation/1.4-who-this-isnt-for.md", module: "module-1" },
  { id: "m1-1.5", title: "Nine Patterns Overview", filePath: "module-1-foundation/1.5-nine-patterns-overview.md", module: "module-1" },
  { id: "m1-1.6", title: "Identify Primary Pattern", filePath: "module-1-foundation/1.6-identify-primary-pattern.md", module: "module-1" },
];

const MODULE_2_SECTIONS: Section[] = [
  { id: "m2-2.1", title: "Framework Overview", filePath: "module-2-four-doors/2.1-framework-overview.md", module: "module-2" },
  { id: "m2-2.2", title: "Door 1: Recognition", filePath: "module-2-four-doors/2.2-door-1-recognition.md", module: "module-2" },
  { id: "m2-2.3", title: "Door 2: Excavation", filePath: "module-2-four-doors/2.3-door-2-excavation.md", module: "module-2" },
  { id: "m2-2.4", title: "Door 3: Interruption", filePath: "module-2-four-doors/2.4-door-3-interruption.md", module: "module-2" },
  { id: "m2-2.5", title: "Door 4: Override", filePath: "module-2-four-doors/2.5-door-4-override.md", module: "module-2" },
];

function getPatternSections(patternKey: string): Section[] {
  const dir = patternKeyToDirMap[patternKey];
  if (!dir) return [];
  const patternNum = dir.match(/pattern-(\d+)/)?.[1] || "1";
  const n = patternNum;
  return [
    { id: `p${n}-${n}.0`, title: "At a Glance", filePath: `module-3-patterns/${dir}/${n}.0-at-a-glance.md`, module: "module-3" },
    { id: `p${n}-${n}.1`, title: "What It Is", filePath: `module-3-patterns/${dir}/${n}.1-what-it-is.md`, module: "module-3" },
    { id: `p${n}-${n}.2`, title: "Pattern in Context", filePath: `module-3-patterns/${dir}/${n}.2-pattern-in-context.md`, module: "module-3" },
    { id: `p${n}-${n}.3`, title: "Pattern Markers", filePath: `module-3-patterns/${dir}/${n}.3-pattern-markers.md`, module: "module-3" },
    { id: `p${n}-${n}.4`, title: "Execution Log", filePath: `module-3-patterns/${dir}/${n}.4-execution-log.md`, module: "module-3" },
    { id: `p${n}-${n}.5`, title: "The Circuit", filePath: `module-3-patterns/${dir}/${n}.5-the-circuit.md`, module: "module-3" },
    { id: `p${n}-${n}.6`, title: "Pattern Archaeology", filePath: `module-3-patterns/${dir}/${n}.6-pattern-archaeology.md`, module: "module-3" },
    { id: `p${n}-${n}.7`, title: "What It Costs", filePath: `module-3-patterns/${dir}/${n}.7-what-it-costs.md`, module: "module-3" },
    { id: `p${n}-${n}.8`, title: "How to Interrupt", filePath: `module-3-patterns/${dir}/${n}.8-how-to-interrupt.md`, module: "module-3" },
    { id: `p${n}-${n}.9`, title: "The Override", filePath: `module-3-patterns/${dir}/${n}.9-the-override.md`, module: "module-3" },
    { id: `p${n}-${n}.10`, title: "Troubleshooting", filePath: `module-3-patterns/${dir}/${n}.10-troubleshooting.md`, module: "module-3" },
    { id: `p${n}-${n}.11`, title: "Quick Reference", filePath: `module-3-patterns/${dir}/${n}.11-quick-reference.md`, module: "module-3" },
  ];
}

const MODULE_4_SECTIONS: Section[] = [
  { id: "m4-4.1", title: "The 90-Day Map", filePath: "module-4-implementation/4.1-the-90-day-map.md", module: "module-4" },
  { id: "m4-4.2", title: "Weeks 1-2: Recognition", filePath: "module-4-implementation/4.2-weeks-1-2-recognition.md", module: "module-4" },
  { id: "m4-4.3", title: "Weeks 3-4: Excavation", filePath: "module-4-implementation/4.3-weeks-3-4-excavation.md", module: "module-4" },
  { id: "m4-4.4", title: "Weeks 5-8: Interruption", filePath: "module-4-implementation/4.4-weeks-5-8-interruption.md", module: "module-4" },
  { id: "m4-4.5", title: "Weeks 9-12: Override", filePath: "module-4-implementation/4.5-weeks-9-12-override.md", module: "module-4" },
  { id: "m4-4.6", title: "Daily Practice Protocol", filePath: "module-4-implementation/4.6-daily-practice-protocol.md", module: "module-4" },
  { id: "m4-4.7", title: "Weekly Check-In", filePath: "module-4-implementation/4.7-weekly-check-in.md", module: "module-4" },
  { id: "m4-4.8", title: "Progress Markers", filePath: "module-4-implementation/4.8-progress-markers.md", module: "module-4" },
];

const MODULE_5_SECTIONS: Section[] = [
  { id: "m5-5.1", title: "Multiple Patterns", filePath: "module-5-advanced/5.1-multiple-patterns.md", module: "module-5" },
  { id: "m5-5.2", title: "Pattern Combinations", filePath: "module-5-advanced/5.2-pattern-combinations.md", module: "module-5" },
  { id: "m5-5.3", title: "Relapse Protocol", filePath: "module-5-advanced/5.3-relapse-protocol.md", module: "module-5" },
];

const MODULE_6_SECTIONS: Section[] = [
  { id: "m6-6.1", title: "Patterns at Work", filePath: "module-6-context/6.1-patterns-at-work.md", module: "module-6" },
  { id: "m6-6.2", title: "Patterns in Relationships", filePath: "module-6-context/6.2-patterns-in-relationships.md", module: "module-6" },
  { id: "m6-6.3", title: "Patterns in Parenting", filePath: "module-6-context/6.3-patterns-in-parenting.md", module: "module-6" },
  { id: "m6-6.4", title: "Patterns and the Body", filePath: "module-6-context/6.4-patterns-and-the-body.md", module: "module-6" },
];

const MODULE_7_SECTIONS: Section[] = [
  { id: "m7-7.1", title: "Letters from the Field", filePath: "module-7-field-notes/7.1-letters-from-the-field.md", module: "module-7" },
];

const MODULE_8_SECTIONS: Section[] = [
  { id: "m8-8.1", title: "Recommended Reading", filePath: "module-8-resources/8.1-recommended-reading.md", module: "module-8" },
  { id: "m8-8.2", title: "When to Seek Professional Help", filePath: "module-8-resources/8.2-when-to-seek-professional-help.md", module: "module-8" },
  { id: "m8-8.3", title: "Finding a Therapist", filePath: "module-8-resources/8.3-finding-a-therapist.md", module: "module-8" },
  { id: "m8-8.4", title: "Supporting Someone with Patterns", filePath: "module-8-resources/8.4-supporting-someone-with-patterns.md", module: "module-8" },
  { id: "m8-8.5", title: "Glossary", filePath: "module-8-resources/8.5-glossary.md", module: "module-8" },
];

const EPILOGUE_SECTIONS: Section[] = [
  { id: "ep-1", title: "Epilogue", filePath: "epilogue/epilogue.md", module: "epilogue" },
];

export function getCrashCourseToc(): TocTree {
  return {
    groups: [
      { id: "day-1", title: "Day 1: Emergency Protocol", sections: MODULE_0_SECTIONS },
      { id: "day-2", title: "Day 2: What This Is", sections: MODULE_1_SECTIONS.slice(0, 3) },
      { id: "day-3", title: "Day 3: Know Your Pattern", sections: MODULE_1_SECTIONS.slice(3) },
      { id: "day-4", title: "Day 4: The Four Doors", sections: MODULE_2_SECTIONS.slice(0, 2) },
      { id: "day-5", title: "Day 5: Excavation", sections: [MODULE_2_SECTIONS[2]] },
      { id: "day-6", title: "Day 6: Interruption", sections: [MODULE_2_SECTIONS[3]] },
      { id: "day-7", title: "Day 7: Override", sections: [MODULE_2_SECTIONS[4]] },
    ],
  };
}

export function getFieldGuideToc(primaryPattern: string): TocTree {
  const crashCourse = getCrashCourseToc();
  const patternName = patternDisplayName[primaryPattern] || primaryPattern;
  const patternSections = getPatternSections(primaryPattern);

  return {
    groups: [
      ...crashCourse.groups,
      { id: "your-pattern", title: `Your Pattern: ${patternName}`, sections: patternSections },
      { id: "implementation", title: "90-Day Implementation", sections: MODULE_4_SECTIONS },
    ],
  };
}

export function getCompleteArchiveToc(primaryPattern?: string): TocTree {
  const allPatternGroups: TocGroup[] = Object.entries(patternKeyToDirMap).map(
    ([key]) => {
      const name = patternDisplayName[key] || key;
      const isUserPattern = key === primaryPattern;
      return {
        id: `pattern-${key}`,
        title: isUserPattern ? `${name} (yours)` : name,
        sections: getPatternSections(key),
      };
    }
  );

  return {
    groups: [
      { id: "emergency", title: "Emergency Protocol", sections: MODULE_0_SECTIONS },
      { id: "foundation", title: "Foundation", sections: MODULE_1_SECTIONS },
      { id: "four-doors", title: "The Four Doors", sections: MODULE_2_SECTIONS },
      ...allPatternGroups,
      { id: "implementation", title: "90-Day Implementation", sections: MODULE_4_SECTIONS },
      { id: "advanced", title: "Advanced Protocols", sections: MODULE_5_SECTIONS },
      { id: "context", title: "Patterns in Context", sections: MODULE_6_SECTIONS },
      { id: "field-notes", title: "Field Notes", sections: MODULE_7_SECTIONS },
      { id: "resources", title: "Resources", sections: MODULE_8_SECTIONS },
      { id: "epilogue", title: "Epilogue", sections: EPILOGUE_SECTIONS },
    ],
  };
}

export function getTocForTier(
  tier: "free" | "quick-start" | "archive",
  primaryPattern?: string
): TocTree {
  if (tier === "archive") return getCompleteArchiveToc(primaryPattern);
  if (tier === "quick-start" && primaryPattern) return getFieldGuideToc(primaryPattern);
  return getCrashCourseToc();
}

function getAllSectionIds(toc: TocTree): Set<string> {
  const ids = new Set<string>();
  for (const g of toc.groups) {
    for (const s of g.sections) {
      ids.add(s.id);
    }
  }
  return ids;
}

export function canAccessSection(
  sectionId: string,
  tier: "free" | "quick-start" | "archive",
  primaryPattern?: string
): boolean {
  const toc = getTocForTier(tier, primaryPattern);
  return getAllSectionIds(toc).has(sectionId);
}

export function findSectionById(sectionId: string): Section | null {
  const allToc = getCompleteArchiveToc();
  for (const g of allToc.groups) {
    for (const s of g.sections) {
      if (s.id === sectionId) return s;
    }
  }
  return null;
}

export async function getSectionContent(sectionId: string): Promise<{ content: string; readMinutes: number } | null> {
  const section = findSectionById(sectionId);
  if (!section) return null;

  try {
    const fullPath = join(CONTENT_ROOT, section.filePath);
    const content = await readFile(fullPath, "utf-8");
    return {
      content,
      readMinutes: estimateReadTime(content),
    };
  } catch {
    return null;
  }
}

export function getFirstSectionId(tier: "free" | "quick-start" | "archive", primaryPattern?: string): string {
  const toc = getTocForTier(tier, primaryPattern);
  return toc.groups[0]?.sections[0]?.id || "m0-0.1";
}

export function getAdjacentSections(
  sectionId: string,
  tier: "free" | "quick-start" | "archive",
  primaryPattern?: string
): { prev: string | null; next: string | null } {
  const toc = getTocForTier(tier, primaryPattern);
  const allSections: string[] = [];
  for (const g of toc.groups) {
    for (const s of g.sections) {
      allSections.push(s.id);
    }
  }
  const idx = allSections.indexOf(sectionId);
  return {
    prev: idx > 0 ? allSections[idx - 1] : null,
    next: idx >= 0 && idx < allSections.length - 1 ? allSections[idx + 1] : null,
  };
}

export function getLockedToc(
  fullToc: TocTree,
  accessibleIds: Set<string>
): { groups: (TocGroup & { sections: (Section & { locked: boolean })[] })[] } {
  return {
    groups: fullToc.groups.map((g) => ({
      ...g,
      sections: g.sections.map((s) => ({
        ...s,
        locked: !accessibleIds.has(s.id),
      })),
    })),
  };
}
