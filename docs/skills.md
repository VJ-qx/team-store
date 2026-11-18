# Claude Code skills

Slash commands for Claude Code, stored in `.claude/skills/`. Type them in Claude Code from the project root. For example:

```text
/extract-styles "Landing Page.dc.html"
```

**Who starts them:** commands marked *you* only run when you type them, because they change code. Commands marked *Claude* are read-only checks, which Claude can also run on its own when they're relevant.

## One-command steps

Use these for normal work. Each one runs the building-block skills below in order, stops at the first stage that fails, and commits only when the automated check passes. None of them push.

| Command | Starts | What it does |
|---|---|---|
| `/extract-styles <page>` | you | Styles step. Checks the comparison is reliable on the untouched page, extracts the inline styles to SCSS, compiles, then compares and fixes until identical. Commits, then writes the manual check list. |
| `/migrate-to-vue <page>` | you | Vue step. Runs the safety check and a read-only prototype-shell check, converts the page to Vue, starts it, then compares behaviour and fixes until identical. Commits, then writes the manual check list. |
| `/add-approved-design <design image> "<what changed>"` | you | Approved changes. Adds a design the US team approved, which isn't in the prototype yet, to a converted Vue page and its SCSS. The prototype isn't touched. Checks that every existing state still matches the prototype, and checks the new states against the design (`npm run parity -- … --approved`). Commits, then lists the decisions it made and what the frontend dev must replace. |
| `/make-responsive <vue page>` | you | **Used for the landing page** (no mobile design exists for it). Responsive step, on converted Vue pages only. Plans and builds tablet and mobile layouts below 1024 px, keeps desktop identical, and reports every layout decision for the team to review. |

## Checks

| Command | Starts | What it does |
|---|---|---|
| `/compare-styles <page>` | Claude | Runs `npm run parity` in `styles` mode: computed styles, sizes, text and pixels of every element. |
| `/compare-behavior <page> --b <vue-url>` | Claude | Runs `npm run parity` in `behavior` mode: what a user sees and what the page does. |
| `/vue-conversion-safety-check <file>` | Claude | Assesses whether a file can be converted to Vue without changing it: SAFE / SAFE WITH CONDITIONS / NOT SAFE. |
| `/prototype-wrapper-checker-removal [path]` | Claude | Finds prototype-only shell code, such as device frames, preview toolbars and settings panels. Read-only. |

## Building blocks

The one-command steps use these, from the team's original command set. Run them directly only if you need a single step on its own.

| Command | Starts | What it does |
|---|---|---|
| `/separate-html-styles <folder>` | you | Moves inline `style=""` and `<style>` blocks in HTML into SCSS. |
| `/separate-jsx-styles <folder>` | you | Moves React `style={{ … }}` objects into SCSS classes. |
| `/convert-to-vue <file>` | you | Converts a file to Vue without changing its behaviour. Its React → Vue conventions are in `.claude/skills/convert-to-vue/react-to-vue-conventions.md`. |
| `/remove-prototype-wrapper [path]` | you | Removes the prototype shell after the check above. `/migrate-to-vue` doesn't use it, because the prototype must stay intact as the reference for comparison. |

## Rules every step follows

- **The original is the source of truth.** If the comparison finds a difference, the new version is fixed. The test flows are never changed to hide it.
- **The prototype's bugs are kept** in the styles and Vue steps, for example the broken sign-in redirect. They're listed in the reports and fixed separately.
- **Work happens on a branch.** Every step refuses to run on `main`, or with uncommitted changes.
- **One `_variables.scss` and one `_global.scss`.** Every page shares `styles/_variables.scss` and `styles/_global.scss`. A new page adds its values to the shared list (a new name when a value differs) and its base rules as its own section of `_global.scss`, never a copy of either file.
- **Styles are grouped by type, then by page.** Partials go in `styles/components/<page>/`, `styles/layouts/<page>/` and `styles/pages/<page>/` (`landing`, `workspace`, `workspace-mobile`), and load the shared variables with `@use "../../variables" as *;`. Each page's entry stays at the top: `styles/<page>.scss`.
- **Components several pages share go in `styles/components/shared/`.** Only when every page that uses one needs exactly the same values; if a page needs a different value, the component stays in that page's folder. Shared classes use the `ts-` prefix (the pages use `tsl-`, `wx-` and `wm-`), and each page that uses one imports it from its own entry. Until the first shared component, the folder holds only a README with these rules. Moving an existing component there must leave every page's compiled CSS unchanged.
- **The workspace's Vue code lives in `src/workspace/`.** Components go in `components/<area>/`, static fixtures in `data/`, sample-record factories in `seed/`, localStorage code in `storage/`, pure helpers in `lib/`, and colours in `theme.js`. Only code other pages share goes in `src/utils/`.
