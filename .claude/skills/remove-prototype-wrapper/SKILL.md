---
name: remove-prototype-wrapper
description: Remove the prototype presentation shell/wrapper from the generated project, only after the safety check confirmed SAFE TO REMOVE, while preserving the application's UI, functionality, and behavior exactly.
argument-hint: "[project-or-file-path]"
disable-model-invocation: true
---

# Remove Prototype Presentation Shell

## Objective

Remove the **prototype presentation shell/wrapper** from the generated project while preserving the actual application UI exactly as it is.

This process must only remove code that has been identified as **prototype-only infrastructure**.

---

## Core Rule

> **Remove the prototype wrapper. Do not change the application.**

The following must remain completely unchanged:

- Functionality
- Logic
- Behavior
- UI
- Design
- Layout
- Styling
- Responsive behavior
- User interactions
- Data flow
- API behavior
- State behavior

The only intended change is the removal of the confirmed prototype presentation shell/wrapper.

---

## Prerequisite

Before starting, the project must have already been assessed using:

`PROTOTYPE_WRAPPER_REMOVAL_SAFETY_CHECK.md`

Only proceed if the assessment confirms:

```text
SAFE TO REMOVE