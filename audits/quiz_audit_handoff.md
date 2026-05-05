# Quiz Audit — Session Bail-out Handoff

## Status

**Bail-out.** Repeated stream idle timeouts blocked completion of the full quiz audit report in the prior session. No partial report exists at `/tmp/quiz_audit_report.md` — that file was checked and is absent. No usable intermediate audit data was successfully persisted to disk before bail-out.

A fresh Claude Code session should redo the audit cleanly from scratch.

## What carried over

Nothing structured. The prior session attempted multiple report writes that timed out before completion. Any in-context findings were lost when the session was bailed.

## Quiz files in scope (canonical list — confirmed present at bail-out)

These three files are the full quiz surface in the current repo:

- `client/src/lib/quizData.ts` — quiz question bank, scoring/weighting logic, pattern result mapping
- `client/src/pages/Quiz.tsx` — quiz UI, question flow, state machine
- `client/src/pages/QuizResult.tsx` — result page, pattern-to-copy rendering, post-quiz CTAs

A fresh audit should read all three end-to-end in a single pass before composing the report.

## Audit checklist for the fresh session

The fresh session should produce `audits/quiz_audit_report.md` covering, at minimum:

1. **Banned-word scan** against the canonical list in `docs/LANGUAGE.md` (mirrored in `CLAUDE.md` and `docs/character/pocket-archivist-system-prompt.md`). Flag every occurrence in user-facing strings — question text, answer choices, result copy, CTAs, microcopy.
2. **Pattern-name fidelity** — confirm all nine canonical pattern names appear exactly as locked in `CLAUDE.md` (no relabels, no invented names). Canonical list:
   1. The Disappearing Pattern
   2. The Apology Loop
   3. The Testing Pattern
   4. Attraction to Harm
   5. The Draining Bond
   6. Compliment Deflection
   7. The Perfectionism Trap
   8. Success Sabotage
   9. The Rage Pattern
3. **Per-pattern coverage** — verify the question bank can resolve to each of the nine patterns (no orphan patterns, no overweighted patterns, scoring tie-break behavior sane).
4. **Four Doors fidelity** — if the result page references the protocol, confirm only `Focus / Excavation / Interruption / Rewrite` appear (no FEIR, no Recognition-as-door, no Override-as-door).
5. **Callout label fidelity** — if any of the seven canonical callout labels appear in result copy, confirm exact spelling/casing (`[FIELD OBSERVATION]`, `[PATTERN SNAPSHOT]`, `[RECOGNITION]`, `[MECHANISM]`, `[INTERRUPTION SCRIPT]`, `[REWRITE FRAME]`, `[FIELD ASSIGNMENT]`).
6. **Brand-rule fidelity** — no emoji anywhere; pink (#EC4899) only on the word "NOT"; "Pattern Archaeology, NOT Therapy" tagline preserved; no banned avatar/persona language.
7. **Voice register check** — sample 2–3 result blocks and triangulate against the book at `the-archivist-method/` for drift.
8. **Structural particularity check** — internal experience hyperspecific, surface details open (no proper nouns, no platforms, no apps, no celebrity refs).

## Failure mode to avoid

The prior session tried to compose the entire audit report inside a single long `Write` call after gathering data across many tool calls. Stream idle timeouts hit during that final write. Recommended approach for the fresh session:

- Compose the report **section-by-section** with separate `Write` (first section) + `Edit` (append subsequent sections) calls, so each turn finishes inside the idle window.
- Or, write findings incrementally to `audits/quiz_audit_report.md` after each scan step, rather than buffering everything in context until the end.

## Ground rules for the fresh session

- Treat `the-archivist-method/` as voice canon and `CLAUDE.md` + `docs/LANGUAGE.md` as operational canon.
- Do not invent findings. If a check passes cleanly, say so in one line and move on.
- Do not propose copy rewrites in the audit report — flag-and-locate only. Rewrites happen in a separate pass.
- Push the completed report directly to `main` per `CLAUDE.md` git policy.
