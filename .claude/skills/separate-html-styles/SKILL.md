---
name: separate-html-styles
description: Extract every inline style="" attribute and embedded <style> block from the HTML files in a target folder into a structured SCSS architecture (components, layouts, pages, responsive, variables, mixins, app.scss) without changing the UI or behavior. Use when asked to separate, extract, or move HTML styles into SCSS.
argument-hint: "<target-folder>"
disable-model-invocation: true
---

# Separate Styles

Refactor the specified folder by extracting all inline and embedded styles into a maintainable SCSS architecture while preserving the original UI and functionality.

## Target

The user will specify the target folder when invoking this command.

Target folder for this run: `$ARGUMENTS`

If no target folder was given, ask for it and stop.

Example:

```text
/separate-html-styles src/pages/home
```

Process **ONLY** the specified folder and its subfolders.

Do **NOT** modify any files outside the specified folder.

## Instructions

The existing implementation is the single source of truth.

This is a **pure refactoring task**.

### Requirements

- Analyze every HTML file within the target folder.
- Remove every `style=""` inline style.
- Remove every embedded `<style>...</style>` block.
- Extract all styles into external SCSS files.
- Create a `/styles` directory inside the target folder if it does not already exist.
- Update the HTML files to reference the generated stylesheet(s).
- Preserve all existing HTML structure, class names, IDs, attributes, and JavaScript.

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

- Remove all inline styles.
- Remove all embedded `<style>` blocks.
- Preserve selector names whenever possible.
- Extract repeated values into `_variables.scss` where appropriate.
- Place reusable styles in `/styles/components/<page>/`.
- Place shared layout styles in `/styles/layouts/<page>/`.
- Place page-specific styles in `/styles/pages/<page>/`.
- Place responsive styles in `/styles/responsive/<page>/`, with the same type folders inside: `/styles/responsive/<page>/components/`, `/layouts/` and `/pages/` (partials there load the variables with `@use "../../../variables" as *;`).
- Group by type first, then by page: `<page>` is the page's folder name (for example `landing`), so every page's components sit side by side under `/styles/components/`. Partials there load the shared variables with `@use "../../variables" as *;`.
- A component that several pages use with exactly the same values goes in `/styles/components/shared/`, with a prefix that belongs to no page (`ts-` in Team Store, where the folder's README has the rules). Keep a component in its page's folder if any value differs.
- Import all partials through `app.scss`.
- Use SCSS features only where they improve maintainability without changing specificity or behavior.

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
- Rename classes or IDs.
- Rename files.
- Reorganize the HTML.
- Modify JavaScript.
- Modify files outside the specified folder.

## Lessons from the Team Store MVP

The team ran this refactor on the Team Store MVP. Follow what it learned:

- Browsers can't load `.scss`. Compile `app.scss` to CSS (`npx sass styles/app.scss styles/css/app.css --no-source-map`; Team Store keeps compiled CSS in `styles/css/` and runs `npm run styles`) and link the compiled `.css` from the HTML. Never edit the compiled CSS by hand.
- Import partials in `app.scss` in the order their rules appeared in the original, so the cascade stays the same.
- An inline `style=""` beats every stylesheet rule. After moving one into a class, check whether another rule for the same element and property now wins. Fix it with import order or a more specific selector rather than `!important`, and list each case in the summary.
- Put the `@use` lines first in every partial, before any comment. dart-sass copies a `/* */` comment placed above `@use` into the compiled CSS ahead of other modules.
- Partials with the same file name in different folders (`pages/landing/_landing.scss`, `responsive/landing/pages/_landing.scss`) collide on the default `@use` namespace. Alias one: `@use "responsive/landing/pages/landing" as responsive-landing;`.
- Don't invent breakpoints. If the original has no media queries, `responsive/` isn't needed.
- Put `@keyframes` in `_global.scss`; they are global.
- One `_variables.scss` and one `_global.scss` serve every page in the project. Don't create a second pair for a new page (`styles/<page>/_variables.scss`). Add the page's values to the shared `_variables.scss`: a name means one value everywhere, so when the page needs a different value, add a new name instead of changing an existing one. Add the page's base rules as its own `$page` section of `_global.scss`, which the page's entry selects with `@use "global" with ($page: "<page>");`.
- Put prototype-only styling (device frames, preview toolbars, scaling stages) in its own partial, such as `styles/pages/_prototype.scss`, imported by one commented `@use` in `app.scss`. The later `/remove-prototype-wrapper` step then only has to delete that import.
- When reorganizing SCSS that already compiles, compile before and after and `diff` the two CSS files. Apart from comments, they should match rule for rule.
- Verify the result with `/compare-styles`. It runs the page's user flows on the original and the refactored version and compares every element's computed style; the refactor is done only when it reports `IDENTICAL`.

## Verification

Before completing the task, verify that:

- Every inline `style=""` attribute has been removed.
- Every embedded `<style>` block has been removed.
- All extracted styles are located in the `/styles` directory.
- HTML files correctly reference the generated stylesheet(s).
- The rendered UI is visually identical to the original.
- No functionality has changed.
- No files outside the specified folder were modified.