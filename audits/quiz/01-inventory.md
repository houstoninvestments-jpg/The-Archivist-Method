# Quiz Audit — Section 1: Inventory

Raw data only. No analysis.

## File sizes

| File | Lines |
|---|---|
| `client/src/lib/quizData.ts` | 455 |
| `client/src/pages/Quiz.tsx` | 875 |
| `client/src/pages/QuizResult.tsx` | 1032 |
| **Total** | **2362** |

## Question count

20 questions in `quizData.ts:51–278`.

- Q1–Q13: 5 options each
- Q14: 6 options (`quizData.ts:196–206`)
- Q15–Q19: 5 options each
- Q20: 9 options, `isTripleWeighted: true`, `isSingleSelect: true` (`quizData.ts:262–278`)

Total option entries: **105**.

## Pattern key vs CLAUDE.md canonical

CLAUDE.md lists pattern slug `perfectionismTrap`. Code uses `perfectionism` (`quizData.ts:9`). Display name is `"The Perfectionism Trap"` (`quizData.ts:35`). Slug-canon mismatch only; user-facing label matches the book.

## Pattern coverage map (option count per pattern)

| Pattern (key) | Option count |
|---|---:|
| `apologyLoop` | 17 |
| `testing` | 14 |
| `disappearing` | 14 |
| `attractionToHarm` | 14 |
| `complimentDeflection` | 11 |
| `drainingBond` | 10 |
| `successSabotage` | 9 |
| `rage` | 9 |
| `perfectionism` | 7 |
| **Total** | **105** |

Spread: 17 max → 7 min. No pattern absent. All nine appear.

Q20 (triple-weighted) covers all nine patterns one-to-one (`quizData.ts:268–276`).

## Em-dash count (`—`, U+2014)

| File | Count |
|---|---:|
| `quizData.ts` | 29 |
| `Quiz.tsx` | 3 |
| `QuizResult.tsx` | 5 |
| **Total** | **37** |

Concentration: nearly all em-dashes are inside `breadcrumbData` and `feelSeenCopy` long-form copy (`quizData.ts:358–443`), not inside quiz-question or option text.

## Banned-word hits (canonical: `docs/LANGUAGE.md`)

User-facing copy strings only. Code identifiers are flagged separately.

### `toxic`
- `quizData.ts:134` — option 8b text: `"Toxic but alive. Safe feels dead."`

### `triggers` / `trigger` (banned — use `body signature` or `pattern activation`)
User-facing copy hits:
- `quizData.ts:167` — option 11b recognition: `"Mistakes as abandonment triggers."`
- `quizData.ts:180` — option 12d recognition: `"Visibility triggers the exit."`
- `quizData.ts:404` — `breadcrumbData.apologyLoop.triggers`: `"…The trigger is almost anything—because the real trigger is visibility itself."`
- `quizData.ts:429` — `breadcrumbData.successSabotage.triggers`: `"…Success itself is the trigger—because…"`
- `quizData.ts:439` — `breadcrumbData.rage.triggers`: `"…The trigger is almost never the thing that sets it off…"`
- `quizData.ts:440` — `breadcrumbData.rage.costs`: `"…whatever triggered the rage."`

Structural field name (every pattern entry):
- `quizData.ts:397, 399, 404, 409, 414, 419, 424, 429, 434, 439` — the property key itself is named `triggers`. Property is internal but the word leaks if any UI surfaces the field name.

Code-only (acceptable per LANGUAGE.md note on identifiers):
- `Quiz.tsx:375, 376, 405, 406` — `triggerRecognition` callback name.
- `QuizResult.tsx:307` — `// Bar fill trigger` comment.

### `boundaries` (banned — use `circuit breaks`)
- `quizData.ts:439` — `breadcrumbData.rage.triggers`: `"…Boundaries crossed…"`

### `trauma` / `Trauma bonds` (banned standalone)
- `quizData.ts:416` — `breadcrumbData.attractionToHarm.whyWillpowerFails`: `"…it's a trauma signature."`
- `quizData.ts:426` — `breadcrumbData.drainingBond.whyWillpowerFails`: `"…Trauma bonds hijack the same reward pathways…"`

### Filler phrases (`I understand`, `Great question`, etc.)
None found.

### `TAM`, `FEIR`, `journey`, `healing`, `heal`, `self-care`, `empower`, `validate`, `hold space`, `unpack`, `safe space`, `coping`, `inner child`, `thrive`, `wellness`, `beta`, `early access`, `founding`
None found in user-facing strings.

## Result-page copy fixtures referenced (for later sections)

- `circuitBreakData` — 9 entries (`quizData.ts:445–455`).
- `breadcrumbData` — 9 entries with `triggers/costs/whyWillpowerFails` (`quizData.ts:397–443`). **Imported in QuizResult.tsx? Verified: only `circuitBreakData` is imported (`QuizResult.tsx:9`). `breadcrumbData` and `feelSeenCopy` are defined but not consumed by the result page.**
- `"47 interrupt protocols"` / `"47 protocols"` — appears at `QuizResult.tsx:221, 869`.
