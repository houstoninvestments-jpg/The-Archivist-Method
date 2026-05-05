# Quiz Audit — Section 6: Findings Summary

Top five issues, priority order. Diagnosis only.

## 1. Pattern coverage is uneven and structurally biases the result

`apologyLoop` carries 17 of 105 options while `perfectionism` carries 7 and `rage`/`successSabotage` carry 9 each — users with primary-pattern perfectionism or rage have a lower scoring ceiling than users with apologyLoop, and apologyLoop functions as a default-bin for guilt/shrink answers that architecturally belong elsewhere.

## 2. The free crash course handoff is missing from the result page

CLAUDE.md locks a 3,000–5,000-word pattern-specific crash course as the discovery-tier deliverable, but the result page never names it, links it, or previews it — it routes to `/portal` with a 3-second auto-redirect and offloads the entire discovery experience to the dashboard.

## 3. Banned-word and invented-claim leaks contradict canonical voice

User-facing copy contains `toxic` (`quizData.ts:134`), `triggers` (recognition lines at `:167, :180`), `boundaries` (`:439`), `Trauma bonds` (`:426`), and the unsourced `"47 protocols"` figure (`QuizResult.tsx:221, :869`); three pattern-specific copy dictionaries (`feelSeenCopy`, `breadcrumbData`, `patternDescriptions`) are dead code on the result page yet carry the densest banned-word concentration and will leak the moment any future surface imports them.

## 4. The result page primary bar visually contradicts the score number

The primary pattern bar always renders at 100% width (`QuizResult.tsx:645`) regardless of the actual percent shown next to it (`:659`), so a user with a 35% raw score sees a full pink bar labeled "35%" — the diagnostic chrome breaks recognition because the visual and the number disagree.

## 5. Paid-tier upsells and Pocket Archivist free-tier framing are misaligned

The Field Guide ($67) is named once only in the Pocket Archivist demo's done state, the Complete Archive ($297) is absent entirely, and the result page implements a 2-step demo rather than the locked free-tier spec (primary-pattern-only access, capped turns, no memory persistence) — users finish the quiz with the Pocket Archivist as the only named product and no clear path to the discovery → Field Guide → Complete Archive ladder.
