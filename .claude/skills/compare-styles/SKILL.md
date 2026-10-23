---
name: compare-styles
description: Verify that a style refactor (such as /separate-html-styles or /separate-jsx-styles) changed nothing visible. Runs the same user flows on the original and the refactored page in headless Chrome and compares every element's computed style, size, position, and text, plus a pixel diff. Use after any styles-only change; repeat fixes until the result is IDENTICAL.
argument-hint: "<page-or-scenario> [--a <git-ref>] [--b <git-ref or .>]"
---

# Compare Styles

Target: `$ARGUMENTS`

If no target was given, ask for it and stop.

## Objective

Prove that a styles-only change, such as extracting inline styles into SCSS, left the page looking exactly the same in every state.

The tool is `tools/parity/parity.mjs` in `--mode styles`. It compares two versions of the page:

- **A**: the original. Defaults to `main`, served from a temporary git worktree.
- **B**: the refactored version. Defaults to `.`, the working tree, so nothing needs to be committed first.

---

## Core Rule

> **The original is the source of truth. If anything differs, the refactor is wrong.**

Fix the refactor until the result is `IDENTICAL`. Never make a difference go away by removing a state from the scenario, skipping a step, or raising the pixel tolerance.

---

## What Is Compared

At the start of every state and after every step, on both versions:

- **Every element's computed style**: all CSS properties, including `::before` and `::after`
- **Every element's box**: position and size
- **Every element's own text**
- **The element tree**: an element present on only one side means the markup changed, which a styles-only refactor must not do
- **A full-page pixel diff**: differences of 10 or less per colour channel are ignored as anti-aliasing noise
- **Events**: navigation, dialogs, console errors, and requests

Timers are frozen after the page loads. Only `wait` steps advance them, so redirects and delays happen at the same moment on both sides. CSS animations and transitions are jumped to their end before each capture.

---

## Process

### 1. Find or Write the Scenario

Scenarios live in `tools/parity/scenarios/`, one per page or module. If the target is a page, look for a scenario whose `page` matches it.

If none exists, write one. It must cover **every state the page can show**:

- Every combination of props that changes the page (read them from the page's `data-props` or its settings)
- Every modal and every step inside it
- Hover and focus on interactive elements, especially elements with `style-hover` or `style-focus`
- Form validation states: empty, invalid, and valid
- Timer-driven transitions: add a `wait` step with the page's delay

Use `tools/parity/scenarios/landing-page.mjs` as the template. Prefer role selectors (`role=button[name="Sign in" s]`) and input placeholders; they also work on the Vue version later.

Step types: `click`, `fill: [selector, value]`, `type: [selector, value]`, `select: [selector, option value]` (a `<select>` dropdown), `hover`, `focus`, `press`, `scroll`, `wait` (milliseconds), `eval` (a JavaScript expression run in the page, for example to open a prototype's settings panel).

Other options:

- **`query`** on a state: URL parameters added to the page address for that state, for example `'?brand=prolook&access=none'`.
- **`seedRandom: true`** on the scenario: gives both sides the same random numbers, for pages that show random sample data. Each calling function gets its own seeded sequence, so a Vue conversion that keeps the prototype's data functions (and their names) draws the same numbers.
- **`on: 'prototype'` / `on: 'vue'`** on a step: runs it only on that kind of side, for states the prototype reaches through prototype-only controls (its settings panel) and the Vue version through `window.__paritySetProps`. In styles mode both sides are the prototype: `prototype` steps run on both and `vue` steps are skipped. In behavior mode the two sides are compared again after the last one-sided step in a row.

Two optional fields feed the manual check list (`npm run checklist`):

- **`label`** on a step: the plain-language description of the step, for selectors that don't read well on their own. For example: `{ click: 'summary >> nth=0', label: 'Click the first FAQ question to open it' }`.
- **`related`** on the scenario: the places the page's flows lead outside the page, as `{ name, where, how }`. For example, the page another page's sign-in redirects to, and how to open it directly.

### 2. Run

```bash
npm run parity -- tools/parity/scenarios/<scenario>.mjs --mode styles
```

Useful options:

- `--a <git-ref>` and `--b <git-ref or .>` choose the versions.
- `--only "<state name>"` reruns a single state while fixing.
- `--viewports 1440x900,1024x768` runs other widths.

If dependencies are missing, run `npm install`. The tool uses the installed Google Chrome; without it, run `npx playwright install chromium`.

### 3. Read the Report and Fix

The report is written to `.parity/<run>/report.md`:

- **style**: lists each property that changed, with its value on A and on B.
- **box**: lists each element whose position or size changed.
- **pixels**: points to `-a.png`, `-b.png`, and `-diff.png` screenshots, with changed pixels in red.

For each difference, find the cause in the refactored code and fix it there. Common causes:

- A selector that is less specific than the inline style it replaced, so another rule now wins
- A unit lost in translation, for example `12` instead of `12px`
- Partials imported in a different order than the original rules
- A compiled CSS file that is out of date: recompile it before running again

Rerun until the result is `IDENTICAL`.

### 4. Report

```text
Target:
Scenario:
A: [ref (commit)]
B: [working tree / ref]

Result: IDENTICAL / DIFFERENCES FOUND
Checkpoints: [identical] of [total]
Report: .parity/<run>/report.md

Fixed during this run:
- [difference] — [cause] — [fix]

Notes:
[States that end in a navigation, or anything skipped]
