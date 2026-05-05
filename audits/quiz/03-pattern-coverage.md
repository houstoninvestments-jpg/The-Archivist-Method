# Quiz Audit — Section 3: Pattern Coverage

For each of the nine patterns: option count, the questions it appears in, and a check on whether the option architecture matches the canonical mechanism (per the book at `the-archivist-method/` and the pattern descriptions in `quizData.ts`).

105 option entries across 20 questions. Q20 (triple-weighted, single-select) covers all nine patterns one-to-one.

## Distribution

| # | Pattern | Count | Share |
|---|---|---:|---:|
| 1 | apologyLoop | 17 | 16.2% |
| 2 | testing | 14 | 13.3% |
| 3 | disappearing | 14 | 13.3% |
| 4 | attractionToHarm | 14 | 13.3% |
| 5 | complimentDeflection | 11 | 10.5% |
| 6 | drainingBond | 10 | 9.5% |
| 7 | successSabotage | 9 | 8.6% |
| 8 | rage | 9 | 8.6% |
| 9 | perfectionism | 7 | 6.7% |

Even distribution = 11.7%. Skew: apologyLoop +4.5pp above even, perfectionism −5.0pp below even. Spread of 2.4× between most- and least-represented pattern.

## Per-pattern coverage and architecture fit

### 1. The Disappearing Pattern (14 options)
Questions hit: 1d, 3c, 4c, 6e, 7e, 8a, 10a, 12d, 13a, 14a, 17c, 18e, 19e, 20a.
Canonical mechanism: chest tightens at intimacy threshold, exit reflex, pre-emptive leaving.
Option architecture: 10a (`"Chest locks. Walls up. Where's the door?"`) and 14a (`"Trapped. No exit."`) are perfectly canonical. 17c (`"Say yes. Then disappear for three days after."`) is a clean compliance-then-escape variant. 19e (`"Relieved. At least you controlled the ending."`) maps to the canonical exit-reflex relief loop.
**Fit: strong.** Even spread across stem types. No drift.

### 2. The Apology Loop (17 options — overrepresented)
Questions hit: 1c, 2c, 3b, 4d, 5a, 7c, 8e, 9c, 10c, 11c, 12c, 13e, 14c, 15c, 17b, 18c, 20b.
Canonical mechanism: needs became dangerous early; self-erasure as protection; "sorry" as reflex.
Option architecture: most options are canonical (e.g., 5a `"Apologize before the ask leaves your mouth"`, 12c `"Sorry for being seen"`). However, several drift into territory that overlaps with `complimentDeflection` (e.g., 9c `"Guilt. Who are you to have this?"`, 18c `"Already composing the apology for taking up space"`).
**Fit: strong but bloated.** The pattern is over-mapped. Options like 13e (`"You gave until empty then resented them for it"`) sit equally well under `drainingBond`; 4d (`"You don't deserve them"`) overlaps with `attractionToHarm`'s self-worth core.
**Coverage flag:** apologyLoop functions as a default-bin for guilt/shrink answers. This will inflate apologyLoop scores for users whose primary pattern is actually compliment deflection or draining bond.

### 3. The Testing Pattern (14 options)
Questions hit: 1b, 2b, 3e, 4b, 5b, 7b, 8d, 10b, 11b, 12b, 13b, 14b, 18d, 20c.
Canonical mechanism: peace as calm-before-storm; manufacture evidence of abandonment; pre-emptive breakage.
Option architecture: 4b (`"Waiting for the mask to slip"`) and 14b (`"Abandoned. Confirmed unlovable."`) are canonical. 5b (`"Drop hints. See if they care enough to notice."`) is the textbook test-disguised-as-need. 8d (`"You tested them until they proved you right"`) is the canonical narrative arc.
**Fit: strong.** No drift.

### 4. Attraction to Harm (14 options)
Questions hit: 1e, 2e, 4a, 6d, 7a, 8b, 9e, 12e, 14f, 15b, 16e, 17e, 19a, 20f.
Canonical mechanism: chemistry = trauma signature; safety reads as boredom; numb to good.
Option architecture: 4a (`"Bored. Where's the chaos?"`) and 7a (`"Electricity"`) and 15b (`"Feel suffocated. Where's the edge?"`) are canonical and excellent. 8b (`"Toxic but alive. Safe feels dead."`) carries the mechanism but uses the banned word `Toxic` (see Section 1).
**Coverage flag:** several entries on this pattern's roster are numbness-based (1e, 6d, 9e, 12e, 16e). Numbness is a real signature of `attractionToHarm` (the book frames safe as nothing-registers), but the same numbness pattern bleeds into `drainingBond` (dissociation as survival). 12e (`"Feel nothing. Already gone inside."`) in particular reads as either pattern with no architectural delta.

### 5. Compliment Deflection (11 options)
Questions hit: 2a, 5c, 6c, 9d, 11e, 12a, 14d, 15e, 16c, 18b, 20i.
Canonical mechanism: visibility = exposure = danger; deflect, minimize, hide work.
Option architecture: 2a (`"Deflect. Change subject. Disappear into the wall."`) and 14d (`"Seen. Really seen."`) and 18b (`"Shrink. Get smaller. Don't let them see you sweat."`) are canonical.
**Coverage flag:** 5c (`"Say nothing. Need nothing. Want nothing."`) and 11e (`"Whatever. Add it to the pile."`) are scored to `complimentDeflection` but read closer to `apologyLoop` (self-erasure) and `drainingBond` (numb resignation), respectively. 16c (`"Let someone else cross it. You'll start over."`) reads more as `successSabotage` than as deflection of being seen.

### 6. The Draining Bond (10 options)
Questions hit: 3d, 7d, 8c, 10e, 13c, 14e, 15d, 17a, 19c, 20e.
Canonical mechanism: bond is biochemical, not rational; staying feels safer than the destruction of leaving; trauma-bonded reward pathway.
Option architecture: 7d (`"Home"` for red flags) and 8c (`"You stayed until there was nothing left of you"`) and 14e (`"Stuck here forever."`) and 17a (`"Say yes. Feel resentment building instantly."`) are canonical.
**Coverage flag:** 10e (`"Numb. Frozen. Stuck."`) and 19c (`"Numb. Disconnected. Watching yourself do it."`) collapse the pattern into a generic dissociation signature. The book's `drainingBond` is the bond itself, not freeze response; mapping freeze responses here muddies the signal.

### 7. Success Sabotage (9 options — underrepresented)
Questions hit: 1a, 4e, 6a, 9a, 11a, 15a, 16b, 19b, 20g.
Canonical mechanism: identity formed around struggle; finish-line trigger; pull-the-pin reflex.
Option architecture: 1a (`"The urge to burn it down before it burns you"`) and 6a (`"You stop. Walk away. Can't finish."`) and 9a (`"Terror. It's about to collapse."`) and 19b (`"Heavy. Like you knew this would happen."`) are canonical. The pattern is well-served by the options it has — but only nine of them.
**Coverage flag:** thin. The pattern sits 5pp below even share. With finish-line drama as core, more questions could legitimately offer it (Q5 `"You need something"`, Q12 `"Visibility makes you"`, Q17 `"They need you"`, Q18 `"Praise"` — none currently route to `successSabotage`).

### 8. The Perfectionism Trap (7 options — most underrepresented)
Questions hit: 2d, 5e, 6b, 9b, 16a, 17d, 20h.
Canonical mechanism: standards as cage; gap between vision and output; protection from being seen as you actually are.
Option architecture: 6b (`"You tweak it forever. Never ships."`) and 16a (`"Find a reason it's not ready yet."`) and 9b (`"Fraud. They'll find out."`) are canonical.
**Coverage flag:** acutely thin. Only seven options across 20 questions, three of those concentrated in finish-line/output stems (6, 16, 17). 5e (`"Convince yourself you never needed it anyway"`) is scored to perfectionism but architecturally is closer to attraction-to-harm (denial of want before loss). 2d (`"Feel the pressure to never fail now"`) is canonical but rare.
**Risk:** users whose primary pattern is perfectionism will have a structurally low ceiling on their score because there are simply fewer routes to score it. Q20's triple-weight on 20h partly compensates, but a single Q20 selection alone yields 3 points where another pattern can accrue 8–12 from non-Q20 questions.

### 9. The Rage Pattern (9 options — underrepresented)
Questions hit: 3a, 5d, 10d, 11d, 13d, 16d, 18a, 19d, 20d.
Canonical mechanism: amygdala bypass; pressure exceeds containment; 3–7 second window before the wheel is taken.
Option architecture: 3a (`"You explode. Say things you can't take back."`) and 10d (`"Heat building. Pressure rising."`) and 18a (`"Heat. Jaw tight. Who gave them the right."`) are canonical and excellent — the body-first signature is rendered correctly. 5d (`"Get angry when they don't just know"`) is the canonical unspoken-need-becomes-explosion arc.
**Fit: strong but thin.** Same structural underrepresentation problem as perfectionism. Several questions that could route to rage (Q4 `"Someone safe wants you"`, Q7 `"Red flags"`, Q12 `"Visibility"`, Q14 `"Deepest fear"`, Q15 `"Someone treats you well"`, Q17 `"They need you"`) do not.

## Cross-pattern ambiguity flags

Options that score one pattern but architecturally read as another:
- 4d (`apologyLoop`) ↔ `attractionToHarm` self-worth
- 5c (`complimentDeflection`) ↔ `apologyLoop` self-erasure
- 5e (`perfectionism`) ↔ `attractionToHarm` denial of want
- 9c (`apologyLoop`) ↔ `complimentDeflection` (success-as-stealing visibility)
- 10e (`drainingBond`) ↔ generic dissociation
- 11e (`complimentDeflection`) ↔ `drainingBond` resigned numbness
- 12e (`attractionToHarm`) ↔ `drainingBond` checked-out
- 13e (`apologyLoop`) ↔ `drainingBond`
- 16c (`complimentDeflection`) ↔ `successSabotage`
- 16e (`attractionToHarm`) ↔ `successSabotage` (denial protects against loss)
- 19c (`drainingBond`) ↔ `complimentDeflection` (dissociation while sabotaging)

## Coverage findings

1. Pattern bins are uneven: 17 (apologyLoop) → 7 (perfectionism). Spread is 2.4×.
2. apologyLoop is over-mapped — functions as default-bin for guilt/shrink answers and absorbs scores that belong elsewhere.
3. perfectionism and rage are structurally under-mapped — users with these as primary pattern have a lower scoring ceiling than users with apologyLoop or testing.
4. Roughly a dozen options exhibit cross-pattern ambiguity, each option points to a single pattern but architecturally fits two.
5. Q20's triple-weight is the structural counterweight. Without it, perfectionism and rage primary-pattern detection would skew low.
