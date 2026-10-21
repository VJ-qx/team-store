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
- Place reusable styles in `/styles/components`.
- Place shared layout styles in `/styles/layouts`.
- Place page-specific styles in `/styles/pages`.
- Place responsive styles in `/styles/responsive`.
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

- Browsers can't load `.scss`. Compile `app.scss` to CSS (`npx sass styles/app.scss styles/app.css --no-source-map`) and link the compiled `.css` from the HTML. Never edit the compiled CSS by hand.
- Import partials in `app.scss` in the order their rules appeared in the original, so the cascade stays the same.
- An inline `style=""` beats every stylesheet rule. After moving one into a class, check whether another rule for the same element and property now wins. Fix it with import order or a more specific selector rather than `!important`, and list each case in the summary.
- Put the `@use` lines first in every partial, before any comment. dart-sass copies a `/* */` comment placed above `@use` into the compiled CSS ahead of other modules.
- Partials with the same file name in different folders (`pages/_landing.scss`, `responsive/_landing.scss`) collide on the default `@use` namespace. Alias one: `@use "responsive/landing" as responsive-landing;`.
- Don't invent breakpoints. If the original has no media queries, `responsive/` isn't needed.
- Put `@keyframes` in `_global.scss`; they are global.
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