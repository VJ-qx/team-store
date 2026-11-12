---
name: extract-styles
description: Run the whole SCSS step for one page in a single command. Checks the comparison is reliable, extracts the styles (/separate-html-styles or /separate-jsx-styles), compiles them, verifies with /compare-styles, fixes until the result is identical, and commits. Each stage must pass before the next one starts.
argument-hint: "<page> [--base <git-ref>]"
disable-model-invocation: true
---

# Extract Styles

Page: `$ARGUMENTS`

If no page was given, ask for it and stop.

## Objective

Take one page through the SCSS step from start to finish, using the team's skills in order:

```text
1. Preflight → 2. Baseline check → 3. Extract → 4. Compile → 5. Compare ⇄ Fix → 6. Commit → 7. Report
               /compare-styles     /separate-*-styles          /compare-styles
```

Each stage must pass before the next one starts. If a stage fails, stop and report. Do not skip ahead.

The extraction and comparison stages follow the existing skills' instructions exactly. Read each skill's `SKILL.md` in full when its stage starts. This skill only adds the order, the gates, and the commit.

---

## Stage 1: Preflight

1. **Branch:** if the current branch is `main` or `master`, stop and ask the user to create a branch first, for example `module-1/scss`.
2. **Clean tree:** `git status --porcelain` must print nothing, so the commit contains only this step. If it prints anything, stop and ask the user. Do not stash or discard their work.
3. **Dependencies:** if `node_modules/` is missing, run `npm install`.
4. **Base:** the original to compare against is `--base` if given, otherwise `main`.
5. **Scenario:** find the scenario in `tools/parity/scenarios/` whose `page` is this page.
   - If none exists, write one as described in `.claude/skills/compare-styles/SKILL.md` (step 1).
   - Commit it on its own (`Add parity scenario for <page>`) before continuing.

---

## Stage 2: Baseline Check

Before changing anything, run:

```bash
npm run parity -- tools/parity/scenarios/<scenario>.mjs --mode styles --a <base> --b .
```

The result must be `IDENTICAL`. Both sides are still the same page, so any difference means the check itself is unreliable, for example a selector that matches the wrong element or a missing `wait`.

If it isn't identical, fix the **scenario**, never the page, and rerun. If it can't be made identical, stop and report: an unreliable check can't prove the extraction.

---

## Stage 3: Extract

1. **Choose the skill:**
   - `style=""` attributes or `<style>` blocks in HTML, including Claude Design `.dc.html` pages → `/separate-html-styles`
   - React `style={{ ... }}` objects in `.jsx` or `.tsx` files → `/separate-jsx-styles`
2. Read that skill's `SKILL.md` in full and follow it. The target is the page's folder, but process **only this page**.
3. **Claude Design `.dc.html` pages:**
   - Leave `style-hover` and `style-focus` attributes in place. The Vue step converts them.
   - Keep `style="{{ … }}"` bindings inline. Their values are computed in the page's script, which the extraction skill forbids changing.
   - Link the compiled stylesheet inside `<helmet>`, after the design-system links.
   - Put prototype-only rules, such as `#__bundler_thumbnail`, in their own partial (for example `styles/pages/_prototype.scss`).
4. **One `_variables.scss` and one `_global.scss` for every page.** All pages share `styles/_variables.scss` and `styles/_global.scss`. Don't create page copies such as `styles/<page>/_variables.scss` or `styles/<page>/_global.scss`.
   - **Variables:** add the page's repeated values to the shared list. A name means one value on every page, so reuse a name only when the value is exactly the same. When the page needs a different value, add a new name (for example `$red-600` beside `$red`). Never change an existing value: other pages compile from it.
   - **Global rules:** add the page's base rules (resets, `html` and `body`, `:root` tokens, `@keyframes`) as a new section of `_global.scss`, `} @else if $page == "<page>" { … }`, before the final `@else` that reports an unknown page. Each section keeps one page's fonts, background and tokens away from the other pages.
   - **Entry:** each page has its own entry, `styles/<page>.scss`, compiled to `styles/<page>.css`. Its first line selects the page's section, `@use "global" with ($page: "<page>");`, so the page's base rules are emitted first, before its partials.
5. **Partials by type, then by page.** Put the page's partials in `styles/components/<page>/`, `styles/layouts/<page>/` and `styles/pages/<page>/` (for example `styles/components/workspace/_store-home.scss`), creating only the folders the page needs. Each partial starts with `@use "../../variables" as *;`, and the entry names it from `styles/`: `@use "components/<page>/<name>";`. Never add a `styles/<page>/` folder.
   - **Shared components:** a component another page already has with exactly the same values goes in `styles/components/shared/` (its README has the rules), with the `ts-` prefix instead of the page's prefix, and each page that uses it imports it from its own entry. If any value differs, keep separate partials in each page's folder. Moving another page's existing component into `shared/` changes that page too: compile and run `/compare-styles` for every page that uses it, and list the move in the report.

---

## Stage 4: Compile

```bash
npm run styles
```

This compiles every SCSS entry: `styles/app.scss` to `styles/app.css` (landing page), `styles/workspace.scss` to `styles/workspace.css` (workspace) and `styles/workspace-mobile.scss` to `styles/workspace-mobile.css` (Workspace Mobile). A new page gets its own entry, added to the `styles` script in `package.json`; its global rules go in its section of `styles/_global.scss` (Stage 3). It must compile without errors. Fix any errors before continuing.

---

## Stage 5: Compare and Fix

Follow `.claude/skills/compare-styles/SKILL.md`:

1. Run the same command as Stage 2. Now B is the extracted version.
2. If the result is `DIFFERENCES FOUND`:
   - Fix the extraction.
   - Recompile with `npm run styles`.
   - Rerun. Use `--only "<state>"` to iterate quickly on one state, then do a full run at the end.
3. Never make a difference go away by editing the scenario, skipping a state, or raising the pixel tolerance.
4. Stop after **5 rounds** of fixes. If differences remain, do not commit. Report what's left.

The stage passes only when a **full run** reports `IDENTICAL`.

---

## Stage 6: Commit

Before committing, make sure the scenario's `related` list names every place the page's flows lead outside the page. Check:

- Every navigation in the parity report's notes
- Every URL parameter the page hands to another page, for example `?access=none`

Add any that are missing, with how to open each one directly. Include the scenario change in this commit.

Commit on the current branch. Do not push.

```text
Extract <page> styles into SCSS

Skill: /separate-html-styles (or /separate-jsx-styles)
Parity: IDENTICAL, <n>/<n> checkpoints (tools/parity/scenarios/<scenario>.mjs vs <base>)
Kept inline: <count> computed style bindings
Left for the Vue step: <count> style-hover / style-focus attributes
```

Include the SCSS sources, the compiled CSS, and the updated page. The `.parity/` reports are not committed.

---

## Stage 7: Report

First generate the manual check list, so a reviewer can confirm the result by hand:

```bash
npm run checklist -- tools/parity/scenarios/<scenario>.mjs --mode styles
```

It lists every state the automated check covered, with the settings to apply and the clicks that reach it, plus the related pages outside this page. `npm run preview -- tools/parity/scenarios/<scenario>.mjs` opens the original and the new version side by side.

Show the state list, and the "Outside this page" list, in the report.

```text
Page:
Branch:
Base:

Stage 1 Preflight:      Passed / Stopped — [reason]
Stage 2 Baseline:       IDENTICAL [n/n] / Stopped — [reason]
Stage 3 Extract:        [skill] — [inline styles removed] removed, [n] kept inline
Stage 4 Compile:        Passed / Failed — [error]
Stage 5 Compare & fix:  IDENTICAL [n/n] after [rounds] round(s) / [n] differences left
Stage 6 Commit:         [hash] / Not committed — [reason]

Fixed during Stage 5:
- [difference] — [cause] — [fix]

Report: .parity/<run>/report.md

Manual check: .parity/checklist-<scenario>-styles.md ([n] states, [n] related pages)
Open both:    npm run preview -- tools/parity/scenarios/<scenario>.mjs

States to check:
| # | State | Settings | How to reach it |

Outside this page (not changed by this step):
- [page or component] — [file] — [how to open it]

Notes:
[Anything the team should review]
```
