---
name: convert-to-vue
description: Convert a React, HTML, or JavaScript file to Vue after it has passed /vue-conversion-safety-check, changing only the framework and preserving functionality, logic, events, API behavior, and UI exactly. Includes the React-to-Vue conventions the team learned on the Team Store MVP.
argument-hint: "<file-path>"
disable-model-invocation: true
---

# Vue Conversion Guidelines

File to convert: `$ARGUMENTS`

If no file was given, ask for it and stop.

If this conversation has no `/vue-conversion-safety-check` result for this file, run the assessment in `.claude/skills/vue-conversion-safety-check/SKILL.md`, show the result, and stop so the user can review it. Convert only after `SAFE TO CONVERT`, or `SAFE WITH CONDITIONS` with every condition handled. Stop on `NOT SAFE TO CONVERT`.

If the file is React, read [react-to-vue-conventions.md](react-to-vue-conventions.md) before converting. It lists the React patterns that change output when translated directly.

## Objective

Convert the specified source file to **Vue** while preserving its existing functionality, logic, behavior, and UI exactly as they are.

The conversion must change the **implementation framework only**.

---

# Core Rule

> **Do not change any existing functionality or logic.**

The converted Vue file must behave the same way as the original file.

Do not:

* Add functionality
* Remove functionality
* Change functionality
* Rewrite business logic
* Change API behavior
* Change validation behavior
* Change event behavior
* Change data flow
* Change user interactions
* Redesign the UI
* Change the existing UI behavior

---

# Standard Vue Folder and File Structure

When converting a file to Vue, follow this standard structure unless the existing project already has an established Vue structure.

The existing project structure takes priority over this standard.

```text
project/
├── src/
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   │
│   ├── components/
│   │   ├── common/
│   │   ├── forms/
│   │   ├── modals/
│   │   └── tables/
│   │
│   ├── layouts/
│   │   └── [layout].vue
│   │
│   ├── pages/
│   │   └── [page].vue
│   │
│   ├── composables/
│   │   └── [feature].js
│   │
│   ├── services/
│   │   └── [service].js
│   │
│   ├── utils/
│   │   └── [utility].js
│   │
│   ├── styles/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── responsive/
│   │   ├── _variables.scss
│   │   ├── _mixins.scss
│   │   ├── _global.scss
│   │   └── app.scss
│   │
│   ├── App.vue
│   └── main.js
│
├── public/
│   └── ...
│
├── package.json
└── ...
```

## File Placement Rules

### Pages

Page-level Vue files should be placed under:

```text
src/pages/
```

Example:

```text
src/pages/OrderList.vue
src/pages/OrderDetails.vue
```

A page should contain the page-level structure and logic.

---

### Components

Reusable UI elements should be placed under:

```text
src/components/
```

Example:

```text
src/components/common/Button.vue
src/components/forms/SearchForm.vue
src/components/tables/OrderTable.vue
```

Do NOT extract elements into components simply for the sake of refactoring.

Only create a separate component when:

* The original implementation already represents a reusable component, or
* The conversion requires it for proper Vue functionality.

Do not change functionality just to create a cleaner component structure.

---

### Composables

Reusable Vue-specific logic may be placed under:

```text
src/composables/
```

Example:

```text
src/composables/useOrders.js
```

Only create a composable when logic is actually shared or when the existing project already follows this pattern.

Do not move logic unnecessarily.

---

### Services

API-related functionality may be placed under:

```text
src/services/
```

Example:

```text
src/services/orderService.js
```

Existing API behavior must remain unchanged.

Do not modify API endpoints, payloads, response handling, or error handling during the conversion.

---

### Utilities

Generic helper functions may be placed under:

```text
src/utils/
```

Example:

```text
src/utils/formatDate.js
```

Only move existing utility logic when appropriate.

Do not rewrite or optimize the logic.

---

# Structure Preservation Rule

The standard structure must NOT override an existing project architecture.

If the project already uses:

```text
src/
├── views/
├── components/
├── stores/
├── composables/
└── ...
```

follow the existing structure instead of creating another architecture.

The goal is consistency with the existing project.

---

# Single File Conversion

When converting only one specific file, do not create unnecessary folders or files.

For example, if converting:

```text
pages/orders.html
```

the preferred result may simply be:

```text
src/pages/Orders.vue
```

If the conversion requires supporting files, create only the files that are necessary.

Example:

```text
src/
├── pages/
│   └── Orders.vue
├── components/
│   └── OrderTable.vue
└── services/
    └── orderService.js
```

Do not create empty or unused folders.

---

# Important Rule

Folder and file organization must never take priority over functionality preservation.

The priority order is:

```text
1. Preserve functionality
2. Preserve logic
3. Preserve behavior
4. Preserve UI
5. Follow existing project architecture
6. Apply standard Vue structure where appropriate
```

If following the standard structure would require changing existing functionality or logic:

**Do not apply the structural change.**

Keep the existing project structure and report the reason.

---

# Conversion Rules

## 1. Preserve Existing Logic

Move the existing JavaScript logic into the appropriate Vue structure.

Preserve:

* Functions
* Conditions
* Calculations
* Loops
* Filtering
* Sorting
* Validation
* State changes
* Data processing
* Error handling

Do not optimize or rewrite the logic unless required purely by Vue syntax.

If JavaScript logic needs to be adapted to Vue, preserve the **same logic and result**.

---

## 2. Preserve Existing Functionality

Every existing feature must remain functional.

Examples:

* Buttons
* Forms
* Dropdowns
* Modals
* Tabs
* Filters
* Search
* Pagination
* Validation
* Dynamic content
* User interactions

Do not remove or simplify any existing functionality.

---

## 3. Convert Events to Vue

Convert existing event handlers to the appropriate Vue event syntax.

Examples:

```html
onclick
```

may become:

```vue
@click
```

and:

```html
onchange
```

may become:

```vue
@change
```

However, the behavior of the event must remain unchanged.

Preserve:

* Event order
* Event parameters
* Event conditions
* Event side effects
* Event propagation behavior where applicable

---

## 4. Preserve Data and State

Move existing state into the appropriate Vue state mechanism when necessary.

Depending on the project setup, use the appropriate Vue approach such as:

* `ref`
* `reactive`
* `computed`
* `watch`

Do not change how the data behaves.

The goal is to reproduce the existing state behavior in Vue, not redesign the state architecture.

---

## 5. Preserve API Behavior

Existing API calls must remain functionally identical.

Do NOT change:

* Endpoints
* HTTP methods
* Request parameters
* Request payloads
* Headers
* Authentication
* Response handling
* Error handling

Only adapt the implementation when necessary for Vue.

---

## 6. Preserve Existing HTML Structure

Convert the existing HTML into Vue template syntax while keeping the structure as close to the original as possible.

Do NOT unnecessarily:

* Rename classes
* Rename IDs
* Remove attributes
* Reorganize elements
* Change element hierarchy
* Replace elements without a functional reason

The resulting Vue template should visually and structurally match the original implementation.

---

## 7. Preserve Styling

Do not redesign or modify the existing UI.

Preserve:

* Classes
* IDs
* Layout
* Spacing
* Typography
* Colors
* Borders
* Shadows
* Responsive behavior
* States
* Existing CSS/SCSS behavior

If the project already has a styling architecture, follow the existing project structure.

Do not introduce a new styling architecture unless specifically requested.

---

## 8. Preserve Dependencies

Keep all dependencies required by the existing file.

If the file depends on:

* Libraries
* Plugins
* Utility functions
* Global functions
* Global variables
* Browser APIs
* Other project modules

make sure they continue to work after conversion.

Do not replace dependencies with alternatives unless explicitly requested.

---

# Vue Implementation

Use the Vue version and project conventions already used by the project.

If the project uses Vue 3, follow the existing Vue 3 structure.

Do not introduce a different framework or architecture.

If the project uses:

```text
Vue 3 + TypeScript
```

follow that setup.

If the project uses:

```text
Vue 3 + JavaScript
```

follow that setup.

---

# Lifecycle Behavior

If the original implementation depends on initialization behavior such as:

```javascript
DOMContentLoaded
window.onload
```

preserve the same behavior using the appropriate Vue lifecycle mechanism.

Do not change the timing or sequence of important initialization logic.

---

# Important: No Logic Improvements

Do NOT use the conversion as an opportunity to:

* Refactor
* Optimize
* Clean up
* Simplify
* Rename
* Improve
* Modernize unrelated code

For example, do NOT turn:

```javascript
if (condition) {
    doSomething();
}
```

into a different implementation simply because it is "cleaner."

The priority is:

> **Behavior preservation over code improvement.**

---

# Conversion Scope

Only convert the **specified file** unless another file must be updated for the converted file to function correctly.

If another file must be modified:

1. Explain why it is required.
2. Make the smallest necessary change.
3. Do not modify unrelated functionality.

---

# Before Conversion

Before modifying the file:

1. Read the entire source file.
2. Understand its existing functionality.
3. Identify its JavaScript logic.
4. Identify its events.
5. Identify its data/state.
6. Identify its dependencies.
7. Identify its API calls.
8. Identify its styling dependencies.
9. Understand how the file currently behaves.

If the file has not passed the **Vue Conversion Safety Check**, do not proceed with conversion.

---

# During Conversion

Convert the file carefully and incrementally.

For every part of the original implementation, ask:

> "What is the Vue equivalent that produces the exact same behavior?"

Do not ask:

> "How can I improve this implementation?"

---

# After Conversion

Verify that the Vue implementation preserves:

* [ ] All existing functionality
* [ ] All existing logic
* [ ] All event behavior
* [ ] All API behavior
* [ ] All validation
* [ ] All data processing
* [ ] All state behavior
* [ ] All user interactions
* [ ] All UI behavior
* [ ] All styling
* [ ] All responsive behavior
* [ ] All dependencies

---

# Conversion Completion Report

After conversion, provide a short report:

```text
File:
Converted To:
Status:

Functionality:
Preserved / Issue Found

Logic:
Preserved / Issue Found

API/Data Handling:
Preserved / Issue Found

UI/Behavior:
Preserved / Issue Found

Notes:
[Short explanation]
```

If no issues were found:

```text
Functionality:
Preserved

Logic:
Preserved

API/Data Handling:
Preserved

UI/Behavior:
Preserved

Notes:
The file was converted to Vue while preserving the existing functionality and logic.
```

---

# Team Store Notes

- Keep the original React file unchanged until the Vue version is verified. It is the reference for checking parity.
- For large files, convert in units: leaf components first, then the components that use them. Verify each unit before starting the next.
- Carry existing bugs over as they are and list them under Notes in the report. Fixing them is a separate task.
- To verify markup, render the original and the conversion and compare the DOM. The Team Store MVP did this with parity tests (`tests/parity-*.mjs`): the React side through `react-dom/server`, the Vue side through Vue SSR, both normalized (sorted attributes, parsed style declarations, collapsed whitespace, ids ignored). SSR checks markup only, so review interactive behavior (handlers, timers, listeners) line by line.
- Verify the finished conversion with `/compare-behavior`. It runs the same user flows on the prototype and the Vue page and compares what a user sees and what the page does; the conversion is done only when it reports `IDENTICAL`. When pinning the prototype's settings as configuration, add the development-only `window.__paritySetProps` hook described there, so every state can be compared.

---

# Final Rule

The conversion is successful only if the Vue implementation behaves the same way as the original implementation.

> **Convert the framework. Do not change the application.**
