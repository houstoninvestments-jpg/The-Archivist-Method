# Crash Course Specification v1.1

The free-tier discovery deliverable. One module per pattern. Nine modules total when complete.

## 1. PURPOSE

The crash course is the reader's first contact with The Archivist Method. It must produce recognition without delivering the operational depth of the Field Guide. It is a curated derivative of the book, redistributed for free-tier discovery. Verbatim redistribution from the canonical pattern chapters is the design intent, not a deviation.

## 2. FILE STRUCTURE

Path: `the-archivist-method/crash-course/{NN}-{slug}.md` where NN matches canonical pattern numbering.

One markdown file per pattern. No supporting files. No appendices.

## 3. THE SEVEN-SECTION STRUCTURE PER PATTERN

Each crash course module contains exactly seven sections in this order:

1. Recognition — opens with `[FIELD OBSERVATION]` callout, body prose, closes with `[RECOGNITION]` callout
2. Mechanism — biology, polyvagal, attachment. Includes `[MECHANISM]` callout
3. Four Doors Applied — the framework walked through this specific pattern. Closes with `[PATTERN SNAPSHOT]`
4. First Interruption — `[INTERRUPTION SCRIPT]` callout plus framing prose
5. First Rewrite — `[REWRITE FRAME]` callout plus framing prose
6. What This Does Not Do — scope-bounding. Names the Field Guide and Complete Archive without persuasion
7. Field Assignment — `[FIELD ASSIGNMENT]` callout plus the assignment

### Per-section word targets (HARD CEILINGS within +/-10%)

| Section | Floor | Target | Ceiling |
|---|---|---|---|
| 1 Recognition | 550 | 600 | 650 |
| 2 Mechanism | 650 | 700 | 750 |
| 3 Four Doors Applied | 850 | 900 | 950 |
| 4 First Interruption | 650 | 700 | 750 |
| 5 First Rewrite | 550 | 600 | 650 |
| 6 What This Does Not Do | 350 | 400 | 450 |
| 7 Field Assignment | 270 | 300 | 330 |

Total floor across all sections: 3,870 words.
Total ceiling across all sections: 4,920 words.

These are HARD ceilings. The 3,000-5,000 file-total range from CLAUDE.md, FUNNEL.md, STATUS.md, and PRODUCTS.md is the fallback bound, not a budget Claude can spend across sections that ran long. If a section runs over its ceiling, tighten that section. Do not absorb the overrun into the total budget.

## 4. THE SEVEN CANONICAL CALLOUT TYPES

Text labels, ALL CAPS, brackets, no emoji. Required types:

`[FIELD OBSERVATION]`, `[PATTERN SNAPSHOT]`, `[RECOGNITION]`, `[MECHANISM]`, `[INTERRUPTION SCRIPT]`, `[REWRITE FRAME]`, `[FIELD ASSIGNMENT]`

### Callout density rule
- Crash Course: 5-7 callouts per module (one per section minimum, two acceptable in Recognition and Four Doors sections)
- Field Guide: higher density permitted
- Complete Archive: full canonical density

### Callout compression rule
- Recognition callouts: 30-50 words. Tight. Compressed. The Recognition callout is the moment the reader feels seen. Length dilutes the hit. The book's canonical Recognition callouts run 25-40 words. Do not exceed 50.
- Mechanism callouts: 60-100 words. Architecture takes more language than recognition.
- Interruption Script callouts: variable by pattern. The script itself transfers verbatim from the book's pattern chapter.
- Rewrite Frame callouts: 40-80 words.
- Field Assignment callouts: 40-100 words depending on assignment complexity.
- Field Observation and Pattern Snapshot callouts: 30-80 words.

## 5. VOICE RULES

The book at `the-archivist-method/` is the voice canonical. The crash course inherits:

- Three-layer voice register: Mechanism, Action, Recognition
- Architecture specific, surface open. No proper nouns, no platforms, no celebrity references, no dated artifacts
- All seven callout type formatting standards
- Friction Protocol (all five rules), with explicit attention to rule 3: section transitions pick up mid-thought from a different angle. The opening line of each section after Section 1 should not naturally connect from the previous section's closer. It should pivot the camera. Example: previous section ends on a closing image of the pattern's cost; next section opens not with "Here is the mechanism" but with the structural reframe approached from a different vector entirely. The reader feels the shift. The connection lands a paragraph later, not at the seam.
- Spirit architecture structural only, never announced

## 6. BANNED WORDS

Per `docs/LANGUAGE.md`. Zero hits required before commit. Includes but not limited to: journey, healing, heal, toxic, triggers, boundaries, self-care, empower, transform, validate, hold space, unpack, trauma response, safe space, coping strategy, inner child, thrive, wellness, beta, founding member, FEIR, TAM (in user-facing copy).

## 7. EM-DASH BUDGET

Em-dashes only in deliberate human-choice moves. Book budget mostly spent. Crash course modules: zero em-dashes in body prose. Title line allowance only.

## 8. BUILD PATTERN

Three commits per pattern (sections 1-3, 4-5, 6-7). Stop and confirm between commits. Timeout-resistance pattern.

## 9. SCOPE GATES

The crash course delivers ONE Interruption Script, ONE Rewrite Frame, ONE Field Assignment per pattern. Levels 2-4 of the Rewrite are explicitly gated to the Field Guide. Pattern Archaeology is gated to the Complete Archive. Section 6 (What This Does Not Do) names these gates without persuasion language.

## 10. PATTERN ORDER

Reading order for crash course generation:
1. The Apology Loop (02) — DONE
2. Compliment Deflection (06)
3. The Perfectionism Trap (07)
4. The Disappearing Pattern (01)
5. The Testing Pattern (03)
6. The Draining Bond (05)
7. Attraction to Harm (04)
8. Success Sabotage (08)
9. The Rage Pattern (09)
