# Quiz Audit — Section 4: Result Page

What `client/src/pages/QuizResult.tsx` tells the user, in order of render.

## Imports from `quizData.ts`

`QuizResult.tsx:5–10` imports four things: `PatternKey`, `patternDisplayNames`, `QuizResult` type, `circuitBreakData`. **It does not import `feelSeenCopy`, `breadcrumbData`, or `patternDescriptions`.** Three of the four pattern-specific copy dictionaries in `quizData.ts` are dead code from this surface.

## Render order

1. **Reveal section** (`:572–792`) — bars animate, `"PATTERN IDENTIFIED"` label, primary pattern name crashes in, secondary pattern cards, focus-pattern selection prompt.
2. **Circuit Break section** (`:798–873`) — gated on `focusPattern` being chosen; renders the canonical `circuitBreakData` paragraph for the selected pattern.
3. **Pocket Archivist preview + email gate** (`:876–1028`) — gated on `focusPattern`; sales card for Pocket Archivist + email capture.
4. **Share prompt overlay** (`:463–569`) — modal after email submit.

## Verbatim copy — Reveal section

- `:596` label: `"PATTERN IDENTIFIED"`
- `:615` chip: `"PRIMARY SIGNAL"`
- `:632` heading: pattern display name (e.g., `"The Disappearing Pattern"`)
- `:659` percent readout: `"{primaryScore}%"`
- `:688` chip on each secondary card: `"ALSO ACTIVE"`
- `:742` prompt: `"Which pattern do you want to understand first?"`

**Voice check:** clean. `"PATTERN IDENTIFIED"`, `"PRIMARY SIGNAL"`, `"ALSO ACTIVE"` are field-manual register. The italicized prompt at `:742` is soft (DM Serif italic), but the copy itself is direct.

**Mechanism note:** the primary pattern bar is always rendered at `100%` (`:645`) regardless of actual score. The numeric percent shown (`:659`) is the raw `scores[primaryPattern]` value (already converted to a percentage of `MAX_POSSIBLE_SCORE` by `determineQuizResult` in `quizData.ts:328`). Secondary bars are scaled relative to primary score (`:438–439`). This decouples the bar visual from the percent number — a user with a primary score of 35% sees a full pink bar labeled `35%`. **This will read as inconsistent.**

## Verbatim copy — Circuit Break section

- `:819` label: `"COMPLIMENTARY CIRCUIT BREAK"` — `complimentary` is sales-marketing register, off-voice.
- `:832` headline: `"Here's one thing you can do the moment you feel it."` — on-voice.
- `:854` body: pulls from `circuitBreakData[activePattern]` — on-voice (e.g., disappearing: `"When the chest tightens and your hand reaches for the exit — stop. Put both feet flat on the floor…"`).
- `:869` teaser: `"This is one of 47 protocols in your pattern's full interrupt sequence."` — **the number 47 is invented.** No source in the book or `docs/`.

## Verbatim copy — Pocket Archivist preview + email gate

- `:903` chip: `"THE POCKET ARCHIVIST"`
- `:912` headline: `"The only tool built for the moment it fires."` — on-voice.
- `:921` subhead: `"One free session. No email required."`
- `:937` button: `"TRY A SESSION →"`
- `:954` headline: `"The pattern has a name. The exit has a door."` — on-voice. This is the closest line to the homepage hero's `"THE PATTERN HAS A NAME."`
- `:961` input placeholder: `"your@email.com"`
- `:1004` button label: `"SEND ME THE FIRST STEP"` (or `"Opening Archive…"` while submitting)
- `:1023` no-spam line: `"No sales sequence. Just the work."` — on-voice.

## Verbatim copy — Pocket Archivist demo modal (PocketArchivistModal)

- `:88` chip: `"THE POCKET ARCHIVIST"`
- `:98` chip: `"{patternName} PATTERN — FREE SESSION"`
- `:110` initial prompt: `"What do you feel in your body right before your {patternName} pattern fires?"` — on-voice, body-signature framed.
- `:135` placeholder: `"Type your response..."`
- `:180` button: `"READING..."` / `"SEND →"`
- `:212` chip on completion: `"FULL ACCESS INCLUDED WITH THE FIELD GUIDE"`
- `:221` body: `"Unlimited sessions, all 47 interrupt protocols, and the complete pattern map for your sequence."` — **second instance of the invented `47 interrupt protocols` number.**
- `:41` API fallback: `"Your pattern is speaking. The method is listening."` — soft, slightly mystical.

## Verbatim copy — Share-prompt overlay

- `:483`: `"FILED"`
- `:492`: `"Your pattern has been filed."`
- `:503`: `"Tell someone."` (DM Serif italic) — strong.
- `:528`: `"SHARE TO X"` button
- `:548`: `"INSTAGRAM STORIES"` button
- `:565`: `"Continue to portal →"`
- `:399` share caption (Instagram): `"I just identified my {patternDisplayName} with The Archivist Method. It named something I've never been able to explain. thearchivistmethod.com"`
- `:449` share caption (X): `"I just identified my {patternDisplayName} with The Archivist Method. thearchivistmethod.com"`

## Recognition test

The book's voice produces the *how does he know* response by hyperspecific architecture and open surface. Result-page test:

- `"PATTERN IDENTIFIED"` + the canonical pattern display name + the `circuitBreakData` body = on-voice and produces recognition.
- The bars/percentages are not voice — they are diagnostic chrome. They do not produce recognition; they carry data.
- The prompt `"Which pattern do you want to understand first?"` works because the user is presented with their own three highest-scored patterns by name. The architecture is theirs, not generic.
- The Pocket Archivist preview (`"The only tool built for the moment it fires."`) is on-voice but is sales register — it pivots from recognition to transaction. This is intentional but is the moment the page changes register.

The result page produces the recognition response in the first section (reveal + circuit break) and switches to sales/conversion register in the second section (Pocket Archivist preview + email gate).

## Routing on submit

`handleSubmit` (`:361–396`):
- POSTs to `/api/quiz/submit` with `{ email, primaryPattern, secondaryPatterns, patternScores }`.
- Stores `quiz_auth_token` in localStorage if returned.
- Stores `quizResultPattern`, `userEmail`, `quizScores` in localStorage.
- Sets `submittedPattern` and shows the share overlay (`setShowSharePrompt(true)`).
- The share overlay auto-redirects to `/portal` after **3 seconds** (`:355–358`) — short, easy to miss the share buttons before redirect.

## Where the user goes next

- Auto-redirect: `/portal` (`PortalDashboard.tsx`).
- Manual: `"Continue to portal →"` button (`:553`) → also `/portal`.
- No route to `/portal/onboarding`, no route to `/portal/reader`, no route to a free-tier crash course.
- No surface link to the Field Guide product, the Complete Archive product, or the Pocket Archivist standalone.

## What the result page does **not** do

- Does not show `patternDescriptions` (the short paragraph per pattern — defined in `quizData.ts:39–49`).
- Does not show `feelSeenCopy` (the two-paragraph recognition copy per pattern — defined in `quizData.ts:358–395`).
- Does not show `breadcrumbData` (`triggers / costs / whyWillpowerFails` — defined in `quizData.ts:397–443`).
- Does not preview the free crash course module (locked spec: 3,000–5,000 words per pattern, embedded in the portal).
- Does not name the price points ($67 Field Guide, $297 Complete Archive). Pocket Archivist standalone price ($14.99/mo) also not present.

## Issues observed

1. The primary bar is always 100% even when the raw percent is 35–55%. The bar visual contradicts the number next to it (`:645, :659`).
2. `"COMPLIMENTARY CIRCUIT BREAK"` uses sales-marketing register at the moment the page should still be in recognition register (`:819`).
3. `"47 protocols"` / `"47 interrupt protocols"` is unsourced. Appears at `:221, :869`.
4. Three pattern-specific copy dictionaries (`patternDescriptions`, `feelSeenCopy`, `breadcrumbData`) are imported nowhere — the result page renders only `circuitBreakData`. The reveal section contains no pattern recognition prose at all between the name crash-in and the circuit break.
5. The auto-redirect to `/portal` runs at 3 seconds, faster than most users will read `"Your pattern has been filed. Tell someone."` and click a share button.
6. No route from result page to the free-tier crash course (the locked discovery-tier spec). User goes to `/portal` regardless of whether they have purchased anything.
