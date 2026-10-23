---
name: compare-behavior
description: Verify that a Vue conversion behaves and looks exactly like the original prototype. Runs the same user flows on both in headless Chrome and compares what a user sees (accessibility tree, text, form values), what the page does (navigation, dialogs, requests, storage, console errors), and a pixel diff. Use after /convert-to-vue; repeat fixes until the result is IDENTICAL.
argument-hint: "<page-or-scenario> --b <vue-url> [--a <git-ref>]"
---

# Compare Behavior

Target: `$ARGUMENTS`

If no target was given, ask for it and stop.

## Objective

Prove that the Vue version of a page behaves and looks exactly like the original prototype, in every state and after every user action.

The tool is `tools/parity/parity.mjs` in `--mode behavior`. It compares two versions of the page:

- **A**: the original prototype. Defaults to `main`, served from a temporary git worktree.
- **B**: the Vue version, given as a URL. For example, the Vite dev server at `http://localhost:5173/`.

---

## Core Rule

> **The prototype is the source of truth. If anything differs, the conversion is wrong.**

Fix the Vue code until the result is `IDENTICAL`. This includes keeping the prototype's bugs, such as a redirect to a file that doesn't exist: `/convert-to-vue` forbids fixing them.

Never make a difference go away by removing a state from the scenario, skipping a step, or raising the pixel tolerance.

---

## What Is Compared

At the start of every state and after every step, on both versions:

- **What a user sees**: the accessibility tree, with every role, name, text, and state (disabled, checked, expanded)
- **Visible form fields**: their values, checked state, and disabled state
- **What the page does**: navigation URLs, dialogs, console errors, requests (`document`, `xhr`, `fetch`), local and session storage, and the page title
- **A full-page pixel diff**: differences of 10 or less per colour channel are ignored as anti-aliasing noise

Computed styles are **not** compared element by element in this mode, because Vue's markup can legitimately differ from the prototype's (for example, wrapper elements the prototype runtime adds). The pixel diff covers appearance.

Timers are frozen after the page loads. Only `wait` steps advance them. CSS animations and transitions are jumped to their end before each capture.

---

## Prerequisites

1. **The Vue page runs.** Start it (for example `npm run dev` in the Vue project) and note its URL.
2. **The scenario exists.** Reuse the page's scenario from `tools/parity/scenarios/`, the same one `/compare-styles` used. If none exists, write one as described in `/compare-styles`.
3. **The Vue page can take the scenario's props.** The prototype's settings (signed in, welcome modal, and so on) are applied with `window.__dcSetProps` on the prototype. The Vue version pins them as configuration, so to reach the same states it needs a development-only hook:

   ```js
   // Development builds only: lets the parity tool set the pinned prototype settings.
   if (import.meta.env.DEV) window.__paritySetProps = (props) => Object.assign(config, props);
   ```

   `config` must be reactive. Without the hook, every state that sets props is **skipped** and listed in the report's notes. Skipped states are not verified; say so in the report.

   Some prototypes keep their settings in an in-page panel instead (the workspace's Tweaks panel). Their scenarios reach those states with steps marked `on: 'prototype'` (the panel) and `on: 'vue'` (a `__paritySetProps` call), and the hook can take extra keys for the panel's shortcuts, for example `{ screen: "gate" }`. See `tools/parity/scenarios/workspace-module-1.mjs`.

   Console messages from the prototype host's in-browser Babel compiler are ignored: they come from the prototype runtime, not the page.

---

## Process

### 1. Run

```bash
npm run parity -- tools/parity/scenarios/<scenario>.mjs --mode behavior --b http://localhost:5173/
```

Useful options:

- `--a <git-ref>` chooses the prototype version.
- `--only "<state name>"` reruns a single state while fixing.
- `--viewports 1440x900,1024x768` runs other widths.

### 2. Read the Report and Fix

The report is written to `.parity/<run>/report.md`:

- **aria**: shows lines only in the prototype (`-`) and lines only in Vue (`+`).
- **navigations** and **requests**: show both sides' URLs.
- **pixels**: points to `-a.png`, `-b.png`, and `-diff.png` screenshots, with changed pixels in red.

For each difference, find the cause in the Vue code and fix it there. Common causes are listed in `.claude/skills/convert-to-vue/react-to-vue-conventions.md`, for example:

- Numeric styles missing `px`
- A changed callback signature
- A wrapper element added around a fragment
- Effects that run in a different order
- An inline handler that lost its `preventDefault`

Rerun until the result is `IDENTICAL`.

### 3. Report

```text
Target:
Scenario:
A: [prototype ref (commit)]
B: [Vue URL]

Result: IDENTICAL / DIFFERENCES FOUND
Checkpoints: [identical] of [total]
Skipped states: [none / list and reason]
Report: .parity/<run>/report.md

Fixed during this run:
- [difference] — [cause] — [fix]

Notes:
[States that end in a navigation, prototype bugs kept on purpose]
