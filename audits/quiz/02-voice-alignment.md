# Quiz Audit — Section 2: Voice Alignment

Canonical voice register (per `docs/LANGUAGE.md` and the book at `the-archivist-method/`):
direct, mechanical, declarative, second-person, present-tense; hyperspecific architecture, open surface; no therapy-speak.

## Question stems — voice check

Representative sample (verbatim):

- Q1, `quizData.ts:54`: `"Good things start happening. You feel:"`
- Q3, `quizData.ts:76`: `"You're angry. What runs?"`
- Q10, `quizData.ts:153`: `"Someone gets too close. Body response:"`
- Q19, `quizData.ts:253`: `"Right before you self-sabotage, your body feels:"`
- Q20, `quizData.ts:264`: `"The one that lives in you right now:"`

**Verdict:** Stems are on-voice. Second-person, present-tense, declarative, mechanical. No therapy-speak. The Q3 stem (`"What runs?"`) is the cleanest expression of the book's "the program is running" register. Q10 and Q19 explicitly invoke body signature, which matches the canonical pre-gap framing. Q20's `"The one that lives in you right now"` is the strongest line — it lands as recognition, not survey.

One soft stem:
- Q14, `quizData.ts:197`: `"Deepest fear:"` — generic survey label. Compare to Q19's `"Right before you self-sabotage, your body feels:"` which is architecture-specific. Q14 reads like a personality quiz.

One slightly soft stem:
- Q5, `quizData.ts:98`: `"You need something. You:"` — clean but low-architecture; could be sharper (e.g., naming the body signal of a need rising).

## Option text — voice check

Representative sample (verbatim):

- 1a, `quizData.ts:56`: `"The urge to burn it down before it burns you"` — on-voice. Architecture-specific.
- 3c, `quizData.ts:80`: `"You vanish. Door. Phone off. Gone."` — on-voice. Staccato, hyperspecific surface action, mechanical.
- 7d, `quizData.ts:125`: `"Home"` — on-voice. The book's recognition-register: one word that names the wound.
- 10a, `quizData.ts:155`: `"Chest locks. Walls up. Where's the door?"` — on-voice. Body signature → spatial → exit reflex. Canonical Disappearing architecture.
- 18a, `quizData.ts:244`: `"Heat. Jaw tight. Who gave them the right."` — on-voice. Body → cognition → rage signature.

**Verdict:** Option text is the strongest voice surface in the quiz. Body signatures, declarative fragments, no therapy-speak, no soft hedging. This is closest to canonical Archivist register.

## Recognition lines — voice check

Recognition strings (`quizData.ts` — every option carries one) fire post-selection.

Representative sample (verbatim):
- 1a, `quizData.ts:56`: `"You end it before it ends you."`
- 4a, `quizData.ts:89`: `"Safety doesn't feel like safety yet."`
- 9a, `quizData.ts:144`: `"The pattern doesn't trust the win."`
- 14b, `quizData.ts:200`: `"Every test is really this question."`
- 20a–20i, `quizData.ts:268–276`: all nine read `"That's the one."`

**Verdict:** Recognition lines are on-voice and produce the *how does he know* response the brand requires. They are short, declarative, present-tense, and hyperspecific to the architecture. The Q20 uniform `"That's the one."` is intentional and lands.

One concern: a few recognition lines use the banned register at the seams.

- 11b, `quizData.ts:167`: `"Mistakes as abandonment triggers."` — uses banned word `triggers`.
- 12d, `quizData.ts:180`: `"Visibility triggers the exit."` — uses banned word `triggers`.

These are the only voice violations inside quiz-display copy. The replacement per LANGUAGE.md is `body signature` or `pattern activation`.

## Long-form copy in `quizData.ts` — voice check

The data file also contains:
- `patternDescriptions` (`quizData.ts:39–49`) — short paragraph per pattern. Imported but not currently consumed by the result page.
- `feelSeenCopy` (`quizData.ts:358–395`) — two-paragraph recognition copy per pattern. Defined but not imported by `Quiz.tsx` or `QuizResult.tsx`.
- `breadcrumbData` (`quizData.ts:397–443`) — `triggers / costs / whyWillpowerFails` per pattern. Defined but not imported by `Quiz.tsx` or `QuizResult.tsx`.
- `circuitBreakData` (`quizData.ts:445–455`) — one paragraph per pattern. Imported and rendered (`QuizResult.tsx:432, 854`).

`circuitBreakData` is on-voice — every entry is mechanical, body-first, declarative, and within the canonical Four Doors frame (Focus → Excavation → Interruption → Rewrite). Example, `quizData.ts:454` (rage): `"…press your tongue to the roof of your mouth and exhale through your nose for four seconds. You have a three-to-seven-second window before the pattern takes the wheel."` This is the cleanest book-aligned prose in the file.

`breadcrumbData` and `feelSeenCopy` carry the banned-word hits flagged in Section 1 (`triggers`, `boundaries`, `trauma`, `Trauma bonds`). Since they are defined but unused, the violations do not currently render to the user — but they will the moment a future surface imports them.

The structural field name `triggers:` (the property key in `breadcrumbData`) is itself a banned-vocabulary leak in waiting; if any future UI labels the field by name, it surfaces.

## Interface chrome copy (Quiz.tsx, QuizResult.tsx)

On-voice strings:
- `Quiz.tsx:95`: `"PATTERN ARCHAEOLOGY INITIATED"`
- `Quiz.tsx:113`: `"Your nervous system already knows the answers."`
- `Quiz.tsx:256`: `"PATTERN IDENTIFIED"`
- `Quiz.tsx:267`: `"ROUTING TO YOUR RESULTS"`
- `Quiz.tsx:618`: `"FINAL SIGNAL"`
- `Quiz.tsx:630`: `"This is the one your body runs without asking permission."`
- `Quiz.tsx:669`: `"PICK EVERY ANSWER THAT LANDS. DON'T THINK."`
- `QuizResult.tsx:483`: `"FILED"`
- `QuizResult.tsx:492`: `"Your pattern has been filed."`
- `QuizResult.tsx:503`: `"Tell someone."`
- `QuizResult.tsx:954`: `"The pattern has a name. The exit has a door."`
- `QuizResult.tsx:1023`: `"No sales sequence. Just the work."`

Off-voice or weak strings:
- `Quiz.tsx:81`: `"Before we begin — if you're currently experiencing thoughts of self-harm or suicide, this isn't the right starting point. Please reach out to the 988 Suicide & Crisis Lifeline first. The archive will be here when you're ready."` — this is a crisis disclaimer; clinical register is intentional and correct, though the closing `"…will be here when you're ready"` softens to wellness register. Acceptable but borderline.
- `QuizResult.tsx:41`: API fallback string `"Your pattern is speaking. The method is listening."` — soft, slightly mystical; weaker than the rest.
- `QuizResult.tsx:399`: share caption `"…It named something I've never been able to explain."` — on-voice but reads as user-quote. Acceptable.
- `QuizResult.tsx:819`: `"COMPLIMENTARY CIRCUIT BREAK"` — `complimentary` is sales/marketing register, not Archivist register. Compare to `"Free session"` at `:921`.
- `QuizResult.tsx:1004`: button label `"Opening Archive..."` / `"SEND ME THE FIRST STEP"` — second is on-voice; first is soft.

## Summary

Quiz-question stems and option text are book-aligned. Recognition lines are book-aligned with two `triggers` violations. The four data dictionaries vary: `circuitBreakData` is canon-clean; `breadcrumbData` and `feelSeenCopy` carry the banned-word density and are also currently dead code on the result page. Interface chrome is mostly on-voice with two soft phrases (`"COMPLIMENTARY"`, `"Opening Archive…"`).
