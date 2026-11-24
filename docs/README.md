# Team Store — developer docs

This repo holds the Team Store prototype that another team built in Claude Design. We take it to production one module at a time:

1. **Styles:** move every inline style into SCSS.
2. **Vue:** convert the page to Vue, our stack.
3. **Responsive:** below 744px the workspace shows the other team's mobile design (`Workspace Mobile.dc.html`) instead of the desktop screens, in the same Vue app; desktop stays as it is. Started with Module 2's Overview.

After each step, an automated check proves that nothing changed that shouldn't have.

| Doc | What's in it |
|---|---|
| [commands.md](commands.md) | The `npm run …` commands: compile styles, compare versions, preview side by side, manual check lists |
| [skills.md](skills.md) | The Claude Code slash commands (`/extract-styles`, `/migrate-to-vue`, …) and when to use each |
| [how-to-access.md](how-to-access.md) | How to open each converted screen and reach the BRD's states, in Vue and in the prototype |

## Quick start

```bash
npm install                                              # once: installs sass and the browser driver
npm run preview -- tools/parity/scenarios/landing-page.mjs   # open the original and your branch side by side
```

The comparison uses your installed Google Chrome. Without Chrome, run `npx playwright install chromium` once.

## Per-module flow

Each step gets its own branch and pull request into `main`. Start the next branch from `main` after the previous one is merged.

| Step | Branch (example) | Run in Claude Code | Done when |
|---|---|---|---|
| 1. Styles | `landing/css` | `/extract-styles "Landing Page.dc.html"` | `/compare-styles` reports **IDENTICAL** |
| 2. Vue | `landing/vue` | `/migrate-to-vue "Landing Page.dc.html"` | `/compare-behavior` reports **IDENTICAL**, nothing skipped |
| 3. Responsive | `overview-mobile/vue` | `/migrate-to-vue` on the module's screens of `Workspace Mobile.dc.html` (its styles step is done) | The mobile screen matches the mobile prototype (for example `workspace-mobile-overview.mjs`: **IDENTICAL**), and the desktop scenarios are unchanged |

Each step ends with a manual check list. Use it to review the result by hand before approving the pull request (see [commands.md](commands.md#npm-run-checklist)).

## Where things live

```text
prototype/                 the Claude Design prototype the conversion follows (not part of the app):
                           Landing Page.dc.html, Workspace.dc.html, … (pages), workspace-app.jsx,
                           workspace-app-integrated.jsx (workspace code, React), support.js, ios-frame.jsx.
                           Served from the root: /Workspace.dc.html opens prototype/Workspace.dc.html
reference/                 handover files nothing uses, kept for reference
styles/                    SCSS: one entry per page, compiled to styles/css/<entry>.css:
                           app.scss (landing page), workspace.scss, workspace-mobile.scss
                           partials by type, then page: components/<page>/, layouts/<page>/,
                           pages/<page>/ (landing, workspace);
                           responsive/<page>/ (landing, workspace, storefront) for responsive
                           styles, with the same type folders inside (the workspace's mobile design);
                           components/shared/ for components several pages share
                           _variables.scss and _global.scss are shared by every page
landing.html, workspace.html, workspace-integrated.html   Vue pages (npm run dev)
src/workspace/             the Vue workspace: main.js, WorkspacePage.vue, components/,
                           data/ (fixtures), seed/ (sample-record factories), storage/ (localStorage),
                           lib/ (pure helpers), theme.js
src/landing/               the Vue landing page: main.js, LandingPage.vue, LandingPage.logic.js
src/utils/                 shared helpers: dc-logic.js (the Claude Design runtime's logic class)
tools/parity/              comparison, check list, and preview tools
tools/parity/scenarios/    user flows per page (one file per page or module)
.claude/skills/            Claude Code slash commands
.parity/                   reports and check lists (not committed)
```

## Running the Vue app

```bash
npm install
npm run dev     # http://localhost:5173/landing.html (landing page)
```

[how-to-access.md](how-to-access.md) gives the address of every converted screen.

The Vue app needs only these files. Nothing in `src/` imports the prototype files, so the app runs without them.

| File or folder | Why the app needs it |
|---|---|
| `src/` | The Vue code: `landing/`, `workspace/`, and `utils/` for code both pages share. |
| `styles/` | The SCSS sources. The landing page imports `styles/vue.scss` and the workspace imports `styles/workspace.scss`. Vite compiles them itself; the compiled `.css` files are for the prototype pages. |
| `_ds/` | The Prolook design system. The landing page (`landing.html`) loads its fonts, colours, typography and spacing. |
| `assets/` | The images the pages show, such as logos and brand logos. The code refers to them as `assets/…`, relative to the page. |
| `landing.html`, `workspace.html`, `workspace-integrated.html` | The three pages: landing, workspace, and Marucci workspace. |
| `vite.config.js` | Settings the pages depend on: a missing page returns "Not found" as on a static host, image paths stay as written, and the workspace components keep JSX's whitespace rules so text renders as in the prototype. |
| `package.json`, `package-lock.json` | Dependencies (Vue, Vite, Sass) and the `npm run` commands. |

Not needed to run the app:

- **Prototype for the conversion:** everything in [`prototype/`](../prototype/README.md): the prototype pages (`Landing Page.dc.html`, `Workspace.dc.html`, `Marucci Workspace.dc.html`, `Workspace Mobile.dc.html`), `workspace-app.jsx`, `workspace-app-integrated.jsx`, `support.js` and `ios-frame.jsx`. The screens not converted yet exist only here, and `tools/parity/` compares the Vue version against them. The dev server and the parity tools serve `prototype/` from the root (`/Workspace.dc.html` opens `prototype/Workspace.dc.html`), so the pages find `_ds/`, `assets/` and `styles/css/` as before.
- **Requirements:** the US team's feature specs, as `.md` files in `uploads/Team Store Workspace/` and `uploads/Consumer Storefront/`, and the [BRD M-1.0](https://docs.google.com/document/d/18UFKmsIhbKLlOutMd4mL5-GqYE1kxBQN/edit).
- **Not used by anything:** the handover files in [`reference/`](../reference/README.md): `Design Exploration.dc.html`, `Workspace Mobile Mapping.dc.html`, `Storefront.html` with `storefront-assets/`, `handoff/`, `export-assets/`, `scratch/`, `screenshots/` and `.thumbnail`.

## Known issues in the handover

- **Broken sign-in redirect:** successful sign-in and registration redirect to `Team Stores Workspace.dc.html`, which doesn't exist (the page is now `Workspace.dc.html`). The conversion steps keep this behaviour on purpose; it needs a separate fix. To reach the workspace, open `Workspace.dc.html?brand=prolook&auth=native` directly.
- **Broken "Preview Store" link:** on a store's page, "Preview Store" redirects to `Team Store Storefront.dc.html`, which doesn't exist (the storefront prototype is `reference/Storefront.html`). Kept on purpose, like the sign-in redirect.
- **Out-of-date `CLAUDE.md`:** it refers to `Team Stores Workspace.dc.html` and `Team Stores Workspace - Third Party Integration.dc.html`, which have since been renamed.

## Approved changes

Designs the US team approved that aren't in their prototype yet. They're in the Vue version only, so on these states the Vue version differs from the prototype on purpose. Each was added with `/add-approved-design`. Its states are in the scenario's `approved` list, checked with `npm run parity -- <scenario> --approved --b <vue-url>`. When the US team's prototype update includes a change, its states move into the scenario's `states` and the prototype becomes the reference again.

| Change | Page | Requirement | Design | Code |
|---|---|---|---|---|
| Sign-in lockout: the fifth wrong password in a row pauses sign-in for that email for 15 minutes, with a countdown and a Reset password button | Landing page, sign-in pop-up | BRD FR-1.11, Lockout | [sign-in-lockout.png](approved-changes/sign-in-lockout.png) | `src/landing/sign-in-lockout.js`, `LandingPage.logic.js`, `LandingPage.vue`, `styles/components/landing/_auth-modal.scss` (`.tsl-auth__paused*`) |
| Customizer loading screen: when the workspace opens from a Customizer's "Team Store" link, a short full-page loading screen under the Team Stores top bar (spinner, "You're signed in", "Opening your Team Stores dashboard…"), then the Overview, with the welcome pop-up on a first visit | Workspace (Prolook), on opening from a Customizer | BRD FR-1.9, Transitional state (the design cites FR-1.3.2 · BR-3, AC-2, Flow 1) | [customizer-loading-screen.png](approved-changes/customizer-loading-screen.png) | `src/workspace/lib/customizer-entry.js`, `components/welcome/CustomizerLoading.vue`, `WorkspacePage.vue`, `styles/components/workspace/_customizer-loading.scss` (`.wx-customizer-loading*`), and below 1024px `styles/responsive/workspace/components/_customizer-loading.scss` |
