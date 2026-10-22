---
name: migrate-to-vue
description: Run the whole Vue step for one page in a single command. Checks the page is safe to convert, identifies prototype-only shell code, converts the page with /convert-to-vue, starts it, verifies it against the prototype with /compare-behavior, fixes until the result is identical, and commits. Each stage must pass before the next one starts.
argument-hint: "<page> [--vue <vue-project-path>] [--base <git-ref>]"
disable-model-invocation: true
---

# Migrate to Vue

Page: `$ARGUMENTS`

If no page was given, ask for it and stop.

## Objective

Take one prototype page through the Vue step from start to finish, using the team's skills in order:

```text
1. Preflight → 2. Safety check → 3. Shell check → 4. Convert → 5. Run → 6. Compare ⇄ Fix → 7. Commit → 8. Report
               /vue-conversion-   /prototype-wrapper-   /convert-to-vue            /compare-behavior
               safety-check       checker-removal
```

Each stage must pass before the next one starts. If a stage fails, stop and report. Do not skip ahead.

Each stage follows an existing skill's instructions exactly. Read that skill's `SKILL.md` in full when its stage starts. This skill only adds the order, the gates, and the commit.

**The prototype is never modified.** It stays the reference that `/compare-behavior` compares the Vue version against.

---

## Stage 1: Preflight

1. **Vue project:**
   - Use `--vue <path>` if given. Otherwise look in this repository for a `package.json` that depends on `vue`.
   - If there is none, stop and ask the user where the Vue version should live:
     - in this repository, set up like the Team Store MVP (Vite + Vue 3), or
     - in the team's existing Vue app.
   - Do not create a project without an answer.
2. **Branch:** in the repository that holds the Vue project, the current branch must not be `main` or `master`. If it is, stop and ask the user to create a branch first, for example `module-1/vue`.
3. **Clean tree:** in that repository, `git status --porcelain` must print nothing. If it prints anything, stop and ask the user. Do not stash or discard their work.
4. **Dependencies:** run `npm install` in this repository and in the Vue project if their `node_modules/` is missing.
5. **Base:** the prototype version to compare against is `--base` if given, otherwise `main` of this repository.
6. **Scenario:** find the page's scenario in `tools/parity/scenarios/`. It normally exists from the SCSS step. If none exists, write one as described in `.claude/skills/compare-styles/SKILL.md` (step 1).

---

## Stage 2: Safety Check

Follow `.claude/skills/vue-conversion-safety-check/SKILL.md` for the page and for every script file it loads.

| Result | What to do |
|---|---|
| `SAFE TO CONVERT` | Continue. |
| `SAFE WITH CONDITIONS` | Continue. Every condition becomes a requirement of Stage 4 and is listed in the report. |
| `NOT SAFE TO CONVERT` | Stop. Report the reasons. |

This result satisfies `/convert-to-vue`'s safety-check requirement. Do not stop to ask for review unless the result is `NOT SAFE TO CONVERT`.

---

## Stage 3: Prototype Shell Check

Follow `.claude/skills/prototype-wrapper-checker-removal/SKILL.md` for the page. This stage is read-only: **do not remove anything from the prototype.**

Use the result in Stage 4:

- **Prototype-only items are not carried into Vue.** For example: editor settings metadata (`data-props`), `__bundler_thumbnail` templates, device frames, preview toolbars, and host messaging.
- **Settings the prototype's controls provided are pinned as configuration,** with the values the page uses by default. A Mobile/Desktop switcher becomes a viewport rule that gives the same results.
- **Anything uncertain stays in the Vue version** and is listed in the report as a risk.

---

## Stage 4: Convert

Follow `.claude/skills/convert-to-vue/SKILL.md` and `.claude/skills/convert-to-vue/react-to-vue-conventions.md` for the page, in the Vue project's existing structure and conventions. Also:

- Carry out every condition from Stage 2.
- Leave out the prototype-only items from Stage 3.
- Add the development-only props hook so every scenario state can be compared:

  ```js
  // Development builds only: lets the parity tool set the pinned prototype settings.
  if (import.meta.env.DEV) window.__paritySetProps = (props) => Object.assign(config, props);
  ```

  `config` must be the reactive object that holds the pinned settings.
- Use the same SCSS files and class names the SCSS step produced. Do not copy styles into components.
- Keep the prototype's behavior exactly, including its bugs (for example, a redirect to a file that doesn't exist). List each bug kept in the report.

---

## Stage 5: Run

1. Start the Vue dev server in the background (for example `npm run dev`).
2. Wait until the page responds.
3. Note its URL, for example `http://localhost:5173/`.

If it doesn't start or the page shows errors, fix them before continuing.

---

## Stage 6: Compare and Fix

Follow `.claude/skills/compare-behavior/SKILL.md`:

```bash
npm run parity -- tools/parity/scenarios/<scenario>.mjs --mode behavior --a <base> --b <vue-url>
```

1. If the result is `DIFFERENCES FOUND`, or any state was skipped:
   - Fix the Vue code.
   - Rerun. Use `--only "<state>"` to iterate quickly on one state, then do a full run.
2. Never make a difference go away by editing the scenario, skipping a state, or raising the pixel tolerance.
3. Stop after **5 full runs**. If differences remain, do not commit. Report what's left.

The stage passes only when a **full run** reports `IDENTICAL` **with no skipped states**.

---

## Stage 7: Commit

Before committing, make sure the scenario's `related` list names every place the page's flows lead outside the page. Check:

- Every navigation in the parity report's notes
- Every URL parameter the page hands to another page

Add any that are missing, with how to open each one directly. Commit that scenario change in this repository.

Stop the dev server. Commit in the Vue project's repository, on the current branch. Do not push.

```text
Convert <page> to Vue

Safety check: SAFE TO CONVERT / SAFE WITH CONDITIONS (<n> conditions)
Parity: IDENTICAL, <n>/<n> checkpoints (tools/parity/scenarios/<scenario>.mjs vs <base>)
Prototype-only items left out: <list>
Prototype bugs kept: <list or none>
```

---

## Stage 8: Report

First generate the manual check list, so a reviewer can confirm the result by hand:

```bash
npm run checklist -- tools/parity/scenarios/<scenario>.mjs --mode behavior --b-url <vue-url>
```

It lists every state the automated check covered, with the settings to apply on the prototype and on Vue (the `__paritySetProps` hook) and the clicks that reach it, plus the related pages outside this page.

Show the state list, and the "Outside this page" list, in the report.

```text
Page:
Vue project:
Branch:
Base:

Stage 1 Preflight:       Passed / Stopped — [reason]
Stage 2 Safety check:    SAFE TO CONVERT / SAFE WITH CONDITIONS / NOT SAFE TO CONVERT
Stage 3 Shell check:     [n] prototype-only items left out, [n] settings pinned
Stage 4 Convert:         [files created]
Stage 5 Run:             [URL] / Failed — [error]
Stage 6 Compare & fix:   IDENTICAL [n/n] after [runs] run(s) / [n] differences left / [n] states skipped
Stage 7 Commit:          [hash] / Not committed — [reason]

Conditions carried out (Stage 2):
- [condition] — [how]

Fixed during Stage 6:
- [difference] — [cause] — [fix]

Prototype bugs kept:
- [bug]

Report: .parity/<run>/report.md

Manual check: .parity/checklist-<scenario>-behavior.md ([n] states, [n] related pages)
Open both:    npm run preview -- tools/parity/scenarios/<scenario>.mjs --b <vue-url>
              (and the Vue dev server)

States to check:
| # | State | Settings (prototype / Vue) | How to reach it |

Outside this page (the Vue version must send you to the same place):
- [page or component] — [file] — [how to open it]

Notes:
[Risks and anything the team should review]
```
