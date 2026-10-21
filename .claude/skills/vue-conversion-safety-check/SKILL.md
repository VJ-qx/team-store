---
name: vue-conversion-safety-check
description: Read-only assessment of whether a file (React, HTML, or JavaScript) can be converted to Vue without changing its functionality or logic. Returns SAFE TO CONVERT, SAFE WITH CONDITIONS, or NOT SAFE TO CONVERT. Run before /convert-to-vue.
argument-hint: "<file-path>"
---

# Vue Conversion Safety Check

File to assess: `$ARGUMENTS`

If no file was given, ask for it and stop.

## Objective

Check whether the specified file is safe to convert to **Vue** without changing, removing, or affecting any existing functionality or logic.

This is an **assessment only**. Do not modify or convert the file.

---

## Core Rule

The conversion must preserve the existing implementation's:

* Functionality
* Logic
* Behavior
* User interactions
* Event handling
* Data flow
* API behavior
* Validation
* Conditional behavior
* Existing UI behavior

The goal is to change **only the implementation framework**, not how the file works.

---

## What to Check

Before approving the conversion, inspect the specified file and determine whether:

### 1. Logic can be preserved

Check all existing JavaScript/business logic.

Make sure the logic can be moved to Vue without changing:

* Conditions
* Calculations
* Functions
* Data processing
* Validation
* Loops
* Filtering
* Sorting
* State changes

### 2. Functionality can be preserved

Check all existing functionality, including:

* Buttons
* Forms
* Dropdowns
* Modals
* Tabs
* Filters
* Search
* Pagination
* User interactions
* Dynamic content

Make sure each existing behavior can work the same way in Vue.

### 3. Events can be preserved

Check existing events such as:

* Click
* Change
* Input
* Submit
* Keyboard events
* Custom events

Make sure converting them to Vue events will not change their behavior.

### 4. API and data handling can be preserved

Check whether the file uses:

* API calls
* Fetch
* AJAX
* Axios
* External data
* Local/session storage

The conversion must NOT change:

* API endpoints
* Request methods
* Parameters
* Payloads
* Response handling
* Error handling

### 5. Dependencies can be preserved

Check whether the file depends on:

* External libraries
* Plugins
* Global functions
* Global variables
* Other scripts
* Browser APIs

Make sure these dependencies can still work after conversion to Vue.

### 6. React sources

If the file is React (JSX/TSX), read `.claude/skills/convert-to-vue/react-to-vue-conventions.md` and list each pattern the file uses as a condition: numeric inline styles, callback props, effects with cleanup, fragment roots, inline render helpers, runtime `<style>` elements, and so on.

### 7. Target Vue project

Identify where the converted file will live and the conventions it must follow: Vue version, Options or Composition API, JavaScript or TypeScript, and folder structure. If there is no Vue project yet, list that as a condition.

---

# Safety Decision

After checking the file, provide one of these results:

### SAFE TO CONVERT

Use this when the file can be converted to Vue while preserving all existing functionality and logic.

### SAFE WITH CONDITIONS

Use this only when the conversion is possible but specific functionality or logic must be carefully preserved.

Clearly list the conditions.

### NOT SAFE TO CONVERT

Use this when converting the file would likely require changing existing functionality or logic.

Clearly explain what prevents a safe conversion.

---

# Important Rules

During the assessment:

* Do NOT modify the file.
* Do NOT convert the file.
* Do NOT refactor the file.
* Do NOT improve the existing logic.
* Do NOT fix unrelated issues.
* Do NOT remove existing functionality.
* Do NOT add new functionality.
* Do NOT change existing behavior.
* Do NOT assume that something is safe without checking it.

If something is unclear, mark it as a **risk** instead of assuming it is safe.

---

# Required Output

Return a short assessment using this format:

```text
File:
Target Framework: Vue

Status:
SAFE TO CONVERT / SAFE WITH CONDITIONS / NOT SAFE TO CONVERT

Summary:
[Short explanation]

Functionality Risks:
- [Risk, if any]

Logic Risks:
- [Risk, if any]

Dependencies/Risks:
- [Risk, if any]

Conditions:
- [Condition, if any]
```

If there are no risks, explicitly state:

```text
Functionality Risks:
None identified.

Logic Risks:
None identified.

Dependencies/Risks:
None identified.
```

---

# Final Rule

Only mark the file **SAFE TO CONVERT** when there is reasonable confidence that converting it to Vue will not change its existing functionality or logic.

When there is uncertainty, do not guess. Mark the specific area as a risk.
