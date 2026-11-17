---
name: make-responsive
description: Add tablet and mobile layouts to a converted Vue page or component that only has a desktop layout, keeping desktop exactly as it is. Because the prototypes have no mobile design, it decides a per-section mobile layout, implements it with the project's shared breakpoint mixins, and reports every decision for the team to review. Run after /convert-to-vue, never on the .dc.html prototypes.
argument-hint: "<vue-page-or-component-path>"
disable-model-invocation: true
---

# Make Responsive

Target: `$ARGUMENTS`

If no target was given, ask for it and stop.

## Objective

Add tablet and mobile layouts to a page or component that currently only has a desktop layout.

The prototypes were designed for desktop only, and there is no mobile design. This process decides the mobile layout, implements it, and reports every decision. The team reviews the finished result; there is no approval step before implementing.

---

## Core Rule

> **Desktop stays exactly as it is. Tablet and mobile become usable.**

At desktop widths, the following must remain completely unchanged:

- Layout
- Spacing
- Typography
- Colors
- Behavior

At every width, functionality, logic, data flow, and API behavior must remain unchanged.

---

## Prerequisites

- The target must be a converted Vue file. If it is a `.dc.html` prototype or a React file, stop: responsive work happens after `/convert-to-vue`, so the layout is built once in the final stack.
- Work on a dedicated branch (for example `module-1/responsive`), not on `main`.

---

## Step 1: Breakpoints

Use one set of breakpoints for the whole project.

1. Look for existing breakpoints in this order: the Vue project's SCSS variables and mixins, then the design system (`_ds/`).
2. If they exist, use them.
3. If none exist, add these defaults and list them in the report:

```scss
// _variables.scss
$bp-tablet: 768px;   // tablet: 768–1023px
$bp-desktop: 1024px; // desktop: 1024px and up

// _mixins.scss
@mixin tablet-down { @media (max-width: #{$bp-desktop - 1px}) { @content; } }
@mixin mobile-down { @media (max-width: #{$bp-tablet - 1px}) { @content; } }
```

Add them once. Every later page uses the same ones.

Rules only apply **below** the desktop breakpoint (`max-width`). Desktop styles are never wrapped or rewritten, which is what keeps desktop unchanged.

---

## Step 2: Plan the Layout

1. Render the target at 375px, 768px, and 1024px. Cover every state the page can show, such as signed in or out, every modal step, and empty or filled forms.
2. For each section of the page, list what breaks: horizontal overflow, fixed widths, side-by-side columns, large paddings or headings, tables, and modals or forms that don't fit.
3. For each section, decide what changes at tablet and at mobile:

```text
Section: [name]
Problem at 375px: [what breaks]
Tablet (768–1023px): [change, or "no change"]
Mobile (<768px): [change]
Markup change needed: No / Yes — [what and why CSS alone can't do it]
```

4. Keep this plan. It goes into the completion report so the team can review each decision.

Keep decisions conservative: stack columns, reduce padding, scale headings, let modals fill the screen, wrap or scroll wide content. Do not redesign, add features, or remove content.

---

## Step 3: Implement

- Use the shared breakpoint mixins. Never write raw `@media` queries.
- Put the rules where the project keeps responsive styles: `styles/responsive/<page>/` in the team's SCSS structure, with the same type folders inside (`styles/responsive/<page>/components/`, `layouts/`, `pages/`), unless the Vue project already does it another way.
- Use Flexbox and Grid. Do not create separate mobile versions of markup or components.
- Change markup only where CSS alone can't do it (for example a menu toggle). Keep those changes minimal, and keep new state limited to layout (open or closed).
- On mobile:
  - Make tap targets at least 44×44px.
  - Use at least 16px font size in inputs so iOS doesn't zoom in on focus.
  - Give hover-only interactions a tap equivalent.

---

## Do NOT

- Change any desktop style, or anything at 1024px and wider.
- Change functionality, logic, events, data flow, or API behavior.
- Add, remove, or reword content.
- Introduce a second set of breakpoints.
- Duplicate a layout for mobile.

---

## Verification

Before completing the task, verify that:

- At 1024px and 1440px, the page is identical to before this branch. Check it with the parity tool (`tools/parity`), passing both versions as URLs: A is the page before this branch (run a git worktree of `main` on a second port), and B is this branch. Add `--viewports 1440x900,1024x768`. Use `/compare-styles` if no markup changed, otherwise `/compare-behavior`. The result must be `IDENTICAL`.
- At 375px, 768px, and 1023px, in every state:
  - There is no horizontal scrolling.
  - All content is reachable.
  - Modals and forms fit the screen and can be completed.
- Tap targets and input font sizes meet the mobile rules above.
- All functionality behaves exactly as before at every width.

---

## Completion Report

```text
Target:
Breakpoints: [existing / newly added defaults — values]

Decisions to review:
| Section | Problem at 375px | Tablet (768–1023px) | Mobile (<768px) | Markup changed |

Desktop:
Unchanged / Issue Found

Functionality:
Preserved / Issue Found

Notes:
[Anything deferred, or open questions for the team]
```

---

## Final Rule

The work is successful only if desktop is unchanged and every width from 375px up is usable.

> **Add the mobile layout. Do not change the desktop or the application.**
