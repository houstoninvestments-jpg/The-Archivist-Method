# Quiz Audit — Section 5: Funnel Mechanics

Email capture, route handoff, upsell architecture, Pocket Archivist surfacing.

## Email capture timing

Email is captured **after** the user (a) completes the quiz, (b) views the reveal section, (c) selects a focus pattern from their top three, and (d) sees the circuit break. Only at step 4 does the email gate render (`QuizResult.tsx:876–1028`).

The gate is conditional on `focusPattern` (`:876`). A user who completes the quiz but does not click one of the three pattern buttons in the reveal section never sees the email gate.

The Pocket Archivist demo (`PocketArchivistModal`) is reachable above the email gate (`:923–938`, `"TRY A SESSION →"`) and explicitly says `"One free session. No email required."` (`:921`). Users can run the demo without giving an email.

## What the gate does on submit

`handleSubmit` (`QuizResult.tsx:361–396`):

- POSTs `/api/quiz/submit` with `{ email, primaryPattern, secondaryPatterns, patternScores }`.
- Persists `quiz_auth_token` (if returned), `quizResultPattern`, `userEmail`, `quizScores` to localStorage.
- Sets `submittedPattern` and triggers `showSharePrompt` overlay.
- On error: surfaces the error string in red (`:393, 1008–1011`), keeps the gate visible, lets the user retry.

The `quiz_auth_token` is the portal-access token. The route handed back from the server here is what gates `/portal` access. **Email submission is the portal entry, not just a marketing capture.**

## What happens after submit

Share overlay (`:463–569`):
- Headline: `"Your pattern has been filed."` + italic `"Tell someone."`
- Two share CTAs: `"SHARE TO X"` and `"INSTAGRAM STORIES"` (Instagram = clipboard copy + toast).
- One escape link: `"Continue to portal →"`.
- Auto-redirect to `/portal` at 3000ms (`:355–358`).

The 3-second timer fires whether or not the user has clicked any button. If they do nothing, they land on `/portal`.

## Free crash course handoff — present?

**No.** There is no link, button, or route from the result page to the free crash course module. The result page routes to `/portal` (the dashboard). The CLAUDE.md locked spec says: *"Pattern-specific crash course module embedded in the portal (3,000–5,000 words per pattern, bounded depth)."* The handoff therefore relies on the portal to surface the crash course — the result page does not name it, link it, or preview it.

Note: `client/src/pages/ContentReader.tsx` is the `/portal/reader` route. That route is reachable from `/portal` but there is no observable evidence on the quiz result page that the user is being routed into a *free crash course* specifically. The label `"FILED"` and `"Continue to portal →"` are voice-correct but do not communicate "you are about to read 3,000–5,000 words on this pattern, free."

## Field Guide ($67) and Complete Archive ($297) upsells

**Not present on the quiz result page.**

- No price shown (`$67` does not appear in `QuizResult.tsx`; `$297` does not appear).
- No CTA labeled "Field Guide" or "Complete Archive".
- The phrase `"FULL ACCESS INCLUDED WITH THE FIELD GUIDE"` (`:212`) appears once — only inside the `PocketArchivistModal` "done" state, after a user runs the two-step demo. It is not a price-named or routed upsell; it is a soft chip.
- The Pocket Archivist preview card (`:887–939`) is the only commerce-adjacent surface on the page. It does not lead to checkout.

The funnel from quiz → paid tiers is therefore mediated entirely by the portal dashboard, not by the result page. The result page's only conversion event is the email submission.

## Pocket Archivist surfacing

The Pocket Archivist appears in **three** places on the result page:

1. **Demo modal** (`PocketArchivistModal`, `:17–244`) — interactive 2-step exchange POSTing to `/api/archivist-demo`. Modal opens from the `"TRY A SESSION →"` button.
2. **Preview card** (`:887–939`) — `"THE POCKET ARCHIVIST" / "The only tool built for the moment it fires." / "One free session. No email required." / [TRY A SESSION →]`.
3. **Modal "done" state** (`:202–240`) — chip `"FULL ACCESS INCLUDED WITH THE FIELD GUIDE"` and copy `"Unlimited sessions, all 47 interrupt protocols, and the complete pattern map for your sequence."`

The Pocket Archivist is the **only** named product on the result page. The Field Guide is named once, only as the upgrade tier inside the Pocket Archivist demo's done-state. The Complete Archive is not named anywhere.

## Free-tier vs paid-tier framing — alignment with locked spec

CLAUDE.md locked spec for Pocket Archivist free tier: *"primary-pattern-only access, capped turns per session, no memory persistence."*

What the result page communicates:
- `"One free session. No email required."` (`:921`)
- The demo is a 2-step exchange (`step: 1` then `step: 2`, hard-coded transition at `:47`).
- After 2 steps, the modal hits the done state.

This implements the **demo experience**, not the free tier itself. The locked free-tier spec (capped turns, no memory) is not the same architecture as the 2-step demo. The page does not communicate that the user can return to the Pocket Archivist later (e.g., from `/portal/reader` or anywhere else) on a free tier — the demo presents as a one-shot inside the result-page funnel.

## Crisis disclaimer — present

`Quiz.tsx:81` shows the 988 Suicide & Crisis Lifeline disclaimer in the opening ritual. This precedes the quiz itself. It does not reappear on the result page.

## Skip-shortcut

`Quiz.tsx:307–333` — `?skip=true` URL param bypasses the quiz and routes to `/results` with a hard-coded result (`successSabotage` primary, `perfectionism` and `disappearing` secondary). This is a dev/QA shortcut. It bypasses the opening ritual and the calculating screen. Intentional.

## Funnel mechanics summary

- **Email gate**: positioned after focus-pattern selection. Soft (a user can stall by not picking a focus pattern).
- **Submit creates portal account**: token returned and persisted as `quiz_auth_token`.
- **Auto-redirect to `/portal` at 3 seconds**: aggressive. Users who try to share will be interrupted.
- **No free crash course handoff** on the result page itself. The handoff is implicit and relies on the portal.
- **No paid-tier upsells** ($67 Field Guide, $297 Complete Archive) on the result page. The only commerce-adjacent surface is the Pocket Archivist preview.
- **Pocket Archivist is the only named product** on the result page; Field Guide named only inside the demo's done state; Complete Archive absent.
- **The 47-protocols claim** appears twice (`:221, :869`) without source.
