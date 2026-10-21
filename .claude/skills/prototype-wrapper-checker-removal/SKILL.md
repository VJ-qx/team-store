---
name: prototype-wrapper-checker-removal
description: Read-only assessment of whether the prototype presentation shell/wrapper (mobile/desktop switcher, restart controls, device frame, preview toolbar, stage containers, prototype-only providers) can be removed without affecting the application's functionality, logic, behavior, UI, or data flow. Run before /remove-prototype-wrapper.
argument-hint: "[project-or-file-path]"
---

# Prototype Presentation Shell Removal Safety Check

## Objective

Assess whether the **prototype presentation shell/wrapper** can be safely removed without affecting the actual application's:

- Functionality
- Logic
- Behavior
- UI
- Design
- User interactions
- Data flow

This is an **assessment only**.

Do not remove, modify, or refactor anything during the assessment.

---

## Core Rule

> **The prototype presentation shell/wrapper may only be removed if the actual application continues to work and look exactly the same without it.**

The following must remain completely unchanged:

- Functionality
- Logic
- Behavior
- UI design
- Layout
- Styling
- Responsive behavior
- User interactions
- State behavior
- API behavior
- Data handling

There must be **zero intentional changes** to the actual application.

---

## What Is the Prototype Presentation Shell/Wrapper?

Identify code that exists primarily to support the prototype or preview environment.

Examples may include:

- Mobile/Desktop switcher
- Restart controls
- Workspace navigation
- Device frame
- Preview toolbar
- Prototype-only controls
- Preview state management
- Prototype-specific providers
- Prototype-specific bridges
- Preview-only wrappers
- Device simulation
- Canvas/stage containers

Do not assume that these are safe to remove.

First determine what each component actually does.

---

## Assessment Process

### 1. Identify the Prototype Wrapper

Identify all components, functions, providers, styles, and files related to the prototype presentation shell/wrapper.

Document them.

Example:

```text
Prototype Wrapper:

- SFStoreProvider
- SFStatusBridge
- SFToolbar
- SFStage
- Device frame
- Mobile/Desktop controls
- Restart control