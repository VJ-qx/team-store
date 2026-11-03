---
name: add-approved-design
description: Add a design change that the US team approved, but that isn't in the prototype yet, to a converted Vue page. Reads the approved design and the BRD, builds the change in the page's SCSS and Vue code without touching the prototype, proves every existing state still matches the prototype with /compare-behavior, checks the new states against the design, records the change, and commits. Each stage must pass before the next one starts.
argument-hint: "<design-image> \"<what changed>\" [--page <vue-page>]"
disable-model-invocation: true
---

# Add Approved Design

Change: `$ARGUMENTS`

If no design image or description was given, ask for them and stop.

## Objective

Add one approved design change to the Vue version, using the team's skills and conventions:

```text
1. Preflight → 2. Understand → 3. Baseline → 4. Build → 5. Compare existing ⇄ Fix → 6. Check new states ⇄ Fix → 7. Record → 8. Commit → 9. Report
                               /compare-behavior        /compare-behavior            parity --approved
```

Each stage must pass before the next one starts. If a stage fails, stop and report. Do not skip ahead.

**The prototype is never modified.** The change goes into the Vue version and its SCSS only. The prototype stays the reference for everything else, so every existing state must still match it exactly.

An approved change is a design the US team (who own the prototype) has approved, but that isn't in the prototype yet. Their next prototype update should include it; see [When the prototype gets the change](#when-the-prototype-gets-the-change).

---

## Stage 1: Preflight

1. **Branch:** if the current branch is `main` or `master`, stop and ask the user to create a branch first, for example `landing/sign-in-lockout`.
2. **Clean tree:** `git status --porcelain` must print nothing. If it prints anything, stop and ask the user. Do not stash or discard their work.
3. **Dependencies:** if `node_modules/` is missing, run `npm install`.
4. **Converted page:** the change must go on a page that has been through the Vue step: a Vue page in `src/<page>/` and a scenario in `tools/parity/scenarios/`. If the page isn't converted yet, stop: it needs `/migrate-to-vue` first.
5. **Design:** copy the approved design image to `docs/approved-changes/<change>.png`, with a short kebab-case name for the change (for example `sign-in-lockout`). This copy is the reference for Stage 6, kept with the code the way the prototype is.

---

## Stage 2: Understand

Before changing any code, write down:

1. **Requirement:** find the requirement the change implements in the BRD (Google Drive; the link is in `docs/how-to-access.md`) and in the US team's specs (`uploads/*/*.md`). Quote it with its number, for example FR-1.11. If nothing matches, say so in the report.
2. **What the design shows:** every element, with its copy word for word, its colours, and its sizes and spacing.
   - Sample colours from the image's pixels, and use the matching value in `styles/_variables.scss` when there is one.
   - Measure sizes against an element that is already on the page (for example a field's width) to find the image's scale, then convert to CSS pixels.
   - Ignore what belongs to the screenshot, not the design: browser autofill colours, the text cursor, the mouse pointer.
3. **States:** every state the change adds or alters, how the user gets into each one, and how they get out. For example: 5 wrong passwords → sign-in paused; the timer ends → sign-in works again.
4. **Where it goes:** the Vue component, the logic, and the SCSS partial, following the page's existing structure.
5. **Gaps:** anything the design and the requirement don't settle.
   - If the page already has a convention for it (for example the prototype's demo password `wrong`), follow it.
   - If a gap changes what the user sees and nothing settles it, ask the user before building.
   - List every decision in the report.
6. **Behaviour that needs a server** (counting attempts, sending email, timers that last across devices) belongs to the frontend dev. Build the demo version the prototype would have, and list what the frontend dev must replace in the report.

---

## Stage 3: Baseline

Before changing any code, follow `.claude/skills/compare-behavior/SKILL.md`:

```bash
npm run dev    # in the background
npm run parity -- tools/parity/scenarios/<scenario>.mjs --mode behavior --b <vue-url>
```

The result must be `IDENTICAL`, with no skipped states. If it isn't, the Vue version already differs from the prototype: stop and report. That must be fixed first, on its own.

---

## Stage 4: Build

**Styles.** Follow the conventions of the extraction skill the page went through (`.claude/skills/separate-html-styles/SKILL.md` or `.claude/skills/separate-jsx-styles/SKILL.md`):

- Add the new classes to the page's existing partial, with the page's prefix and BEM names (for example `.tsl-auth__paused-title`).
- Take every value from `styles/_variables.scss`. A new value gets a new variable there, with a new name; an existing name never changes its value. Never copy the file.
- Values computed while the page runs stay inline, as in the rest of the page.
- Compile with `npm run styles`.

**Vue.** Follow `.claude/skills/convert-to-vue/SKILL.md`, its conventions file, and the feature-folder layout in Stage 4 of `.claude/skills/migrate-to-vue/SKILL.md`:

- Change only what the approved change needs. Every existing state must look and behave as before.
- Put new logic in its own module in the page's folder where you can (for example `src/landing/sign-in-lockout.js`), so the frontend dev can find it and replace the demo parts.
- Mark every edit to code converted from the prototype with a comment naming the change: `Approved change, not in the prototype yet: <change> (docs/README.md#approved-changes).`
- Make each new state reachable with ordinary clicks if you can. Otherwise add a setting that `window.__paritySetProps` can set, with a default that leaves the page as it was.
- **Workspace:** the Vue workspace serves both Prolook and Marucci. A workspace change applies to both unless the change says otherwise, and both workspaces' scenarios are checked in Stages 5 and 6.

---

## Stage 5: Compare Existing States and Fix

Run the same command as Stage 3. Now the Vue version has the change.

1. If the result is `DIFFERENCES FOUND`, or any state was skipped, the change altered something that was already there. Fix the Vue code or SCSS and rerun. Use `--only "<state>"` to iterate quickly, then do a full run.
2. Never make a difference go away by editing the scenario, skipping a state, or raising the pixel tolerance.
3. Stop after **5 full runs**. If differences remain, do not commit. Report what's left.

The stage passes only when a full run reports `IDENTICAL` with no skipped states.

---

## Stage 6: Check the New States and Fix

1. Add the new states to the scenario's `approved` list, in the same format as `states`, each with `design: 'docs/approved-changes/<change>.png'`. The format is in the "Find or Write the Scenario" section of `.claude/skills/compare-styles/SKILL.md`. Reach each state the way a user would. Where a timer matters, add a `wait` step, for example to show a countdown at the time the design shows.
2. Run them on the Vue version:

   ```bash
   npm run parity -- tools/parity/scenarios/<scenario>.mjs --approved --b <vue-url>
   ```

   Both sides are the Vue version, so the result must be `IDENTICAL`: each state loads the same way every time, with no console errors.
3. Compare each screenshot in the report's "Compare with the approved design" section with the design, element by element: copy, colours, sizes, spacing, alignment and icons. Fix what differs and rerun.
4. Stop after **5 rounds**. Report anything that still differs, and why.

The stage passes when the run is `IDENTICAL` and the screenshots match the design.

---

## Stage 7: Record

So the team knows the Vue version differs from the prototype on purpose:

1. **`docs/README.md`, section "Approved changes":** add a row for the change. If the section is missing, create it after "Known issues in the handover", with a sentence saying these changes are in the Vue version only, approved by the US team, and waiting for their prototype update.

   | Change | Page | Requirement | Design | Code |
   |---|---|---|---|---|

2. **`docs/how-to-access.md`:** how to reach each new state, in the page's section.
3. **Scenario `related`:** if the change leads somewhere outside the page, add it.

---

## Stage 8: Commit

Stop the dev server. Commit on the current branch. Do not push.

```text
Add <change> to the Vue <page> (approved, not in the prototype yet)

Design: docs/approved-changes/<change>.png
Requirement: <FR number and short quote, or none found>
Existing states: IDENTICAL, <n>/<n> checkpoints (tools/parity/scenarios/<scenario>.mjs vs the prototype)
New states: <n> approved states, IDENTICAL <n>/<n>, checked against the design
Decisions: <list or none>
```

---

## Stage 9: Report

First generate the manual check list. It lists the new states in their own section, with the design to compare against:

```bash
npm run checklist -- tools/parity/scenarios/<scenario>.mjs --mode behavior --b-url <vue-url>
```

```text
Change:
Page:
Branch:
Design:       docs/approved-changes/<change>.png
Requirement:  [FR number — quote] / none found

Stage 1 Preflight:          Passed / Stopped — [reason]
Stage 2 Understand:         [n] elements, [n] new states, [n] decisions
Stage 3 Baseline:           IDENTICAL [n/n] / Stopped — [reason]
Stage 4 Build:              [files changed]
Stage 5 Compare existing:   IDENTICAL [n/n] after [runs] run(s) / [n] differences left
Stage 6 Check new states:   IDENTICAL [n/n], matches the design after [rounds] round(s) / [differences left]
Stage 7 Record:             [docs updated]
Stage 8 Commit:             [hash] / Not committed — [reason]

New states:
| # | State | How to reach it | Screenshot |

Decisions (gaps the design and the requirement didn't settle):
- [gap] — [decision] — [why]

For the frontend dev (demo behaviour to replace):
- [what] — [where in the code]

Differences from the design left:
- [difference] — [why]

Manual check: .parity/checklist-<scenario>-behavior.md
```

---

## When the Prototype Gets the Change

The US team's update makes the prototype the reference again:

1. Move the change's states from `approved` into `states` in the scenario.
2. Run `/compare-behavior`. Wherever the Vue version differs from the prototype, fix the Vue version: the prototype wins.
3. Remove the change's row from "Approved changes" in `docs/README.md`, and its code comments.
