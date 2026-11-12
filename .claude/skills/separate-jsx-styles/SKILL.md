---
name: separate-jsx-styles
description: Extract React inline style objects (style={{ ... }} and style constants) from the .jsx/.tsx files in a target folder into a structured SCSS architecture, replacing them with className values, without changing the UI, component logic, or behavior. Use when asked to separate, extract, or move React or JSX styles into SCSS.
argument-hint: "<target-folder>"
disable-model-invocation: true
---

# Separate React Styles

Refactor the specified folder by extracting all React inline styles into a maintainable SCSS architecture while preserving the original UI, component behavior, and functionality.

## Target

The user will specify the target folder when invoking this command.

Target folder for this run: `$ARGUMENTS`

If no target folder was given, ask for it and stop.

Example:

```text
/separate-jsx-styles src/components
```

Process **ONLY** the specified folder and its subfolders.

Do **NOT** modify any files outside the specified folder.

## Instructions

The existing implementation is the single source of truth.

This is a **pure refactoring task**.

### Requirements

- Analyze every `.jsx` and `.tsx` file within the target folder.
- Remove every React inline style object (`style={{ ... }}`).
- Extract all inline styles into external SCSS files.
- Create a `/styles` directory inside the target folder if it does not already exist.
- Replace inline style objects with appropriate `className` values.
- Preserve all React component logic, hooks, props, state, context, refs, event handlers, and rendering behavior.
- Preserve the existing component structure and JSX hierarchy.
- Reuse existing class names where possible. Otherwise, create clear and semantic class names.

### SCSS Structure

```text
/styles
├── components/
├── layouts/
├── pages/
├── responsive/
├── _variables.scss
├── _mixins.scss
├── _global.scss
└── app.scss
```

Create only the folders that are required.

### Refactoring Rules

- Remove every `style={{ ... }}` inline style object.
- Extract repeated values into `_variables.scss` where appropriate.
- Place reusable component styles in `/styles/components/<page>/`.
- Place shared layout styles in `/styles/layouts/<page>/`.
- Place page-specific styles in `/styles/pages/<page>/`.
- Place responsive rules in `/styles/responsive/<page>/`.
- Group by type first, then by page: `<page>` is the page's folder name (for example `workspace`), so every page's components sit side by side under `/styles/components/`. Partials there load the shared variables with `@use "../../variables" as *;`.
- Import all SCSS partials through `app.scss`.
- Use SCSS features such as nesting and variables only when they improve maintainability without changing specificity or behavior.
- Preserve selector specificity and rendered output.

### Dynamic Styles

If an inline style depends on component state or props, preserve the existing behavior by using conditional `className` values whenever possible.

Only keep inline styles when they are truly dynamic and cannot be represented safely in SCSS (for example, runtime-calculated pixel values or values computed from JavaScript).

### Do NOT

- Redesign the UI.
- Change layouts.
- Change spacing.
- Change colors.
- Change typography.
- Change sizing.
- Change responsive behavior.
- Change animations.
- Change interactions.
- Modify React hooks.
- Modify component logic.
- Modify props.
- Modify state management.
- Modify event handlers.
- Convert components to HTML.
- Rename files.
- Modify files outside the specified folder.

## Lessons from the Team Store MVP

The team ran this refactor on the Team Store MVP. Follow what it learned.

**Finding inline styles**

- AI-generated prototypes (such as Claude Design output) often keep their JSX in `<script type="text/babel">` blocks inside `.html` files, or in `.jsx` files those blocks load. Treat that JSX as in scope.
- Inline styles aren't only `style={{ ... }}` literals. Style objects defined as constants (`style={card}`), merged (`style={{ ...base, color: c }}`), or returned by helper functions count too.
- Leave `<style>` elements that a component renders where they are. Their rules apply only while that component is mounted, so moving them to a global stylesheet changes when they apply. List them in the summary.

**Translating values**

- React adds `px` to numeric values; SCSS doesn't. `padding: 12` becomes `padding: 12px`, and `0` stays `0`. Unitless properties stay unitless: `lineHeight`, `fontWeight`, `opacity`, `zIndex`, `flex`, `flexGrow`, `flexShrink`, `order`.
- camelCase keys become kebab-case. Vendor prefixes keep their leading dash: `WebkitAppearance` becomes `-webkit-appearance`.

**Keeping the result identical**

- An inline style beats every stylesheet rule. After moving one into a class, check whether another rule for the same element and property now wins. Fix it with import order or a more specific selector rather than `!important`, and list each case in the summary.
- Hover or focus effects driven by `onMouseEnter`/`onMouseLeave` and state: keep the handlers and the state, and toggle a conditional `className`. Replacing them with `:hover` changes the logic.
- Prefix new class names per app or page (the MVP used `wx-` for the workspace and `sfx-` for the storefront) so they can't collide with existing classes.

**SCSS**

- Browsers can't load `.scss`. Compile `app.scss` (`npx sass styles/app.scss styles/app.css --no-source-map`), or import it from the entry file if the project has a Vite or webpack build, and load the result from the page. If that page is outside the target folder, don't edit it; tell the user what to add. Never edit compiled CSS by hand.
- Put the `@use` lines first in every partial, before any comment. dart-sass copies a `/* */` comment placed above `@use` into the compiled CSS ahead of other modules.
- Partials with the same file name in different folders (`pages/_landing.scss`, `responsive/_landing.scss`) collide on the default `@use` namespace. Alias one: `@use "responsive/landing" as responsive-landing;`.
- Don't invent breakpoints. If the original has no media queries, `responsive/` isn't needed.
- Put `@keyframes` in `_global.scss`; they are global.
- One `_variables.scss` and one `_global.scss` serve every page in the project. Don't create a second pair for a new page (`styles/<page>/_variables.scss`). Add the page's values to the shared `_variables.scss`: a name means one value everywhere, so when the page needs a different value, add a new name instead of changing an existing one. Add the page's base rules as its own `$page` section of `_global.scss`, which the page's entry selects with `@use "global" with ($page: "<page>");`.
- Put prototype-only styling (device frames, preview toolbars, scaling stages) in its own partial, such as `styles/pages/_prototype.scss`, imported by one commented `@use` in `app.scss`. The later `/remove-prototype-wrapper` step then only has to delete that import.
- Verify the result with `/compare-styles`. It runs the page's user flows on the original and the refactored version and compares every element's computed style; the refactor is done only when it reports `IDENTICAL`.

## Verification

Before completing the task, verify that:

- Every removable `style={{ ... }}` inline style has been extracted.
- Dynamic styles that must remain inline are documented and left unchanged.
- All extracted styles are located in the `/styles` directory.
- Components render visually identical to the original implementation.
- All React functionality behaves exactly the same.
- No files outside the specified folder were modified.