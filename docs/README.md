# Team Store — developer docs

This repo holds the Team Store prototype that another team built in Claude Design. We take it to production one module at a time:

1. **Styles:** move every inline style into SCSS.
2. **Vue:** convert the page to Vue, our stack.
3. **Responsive (later):** add tablet and mobile layouts. Not needed yet: for now each module goes through steps 1 and 2 only.

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
| 3. Responsive (later) | `landing/responsive` | `/make-responsive <vue page>` | Not needed yet. When it is: desktop still identical, and the team approves the mobile layout |

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
                           pages/<page>/ (landing, workspace, workspace-mobile);
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
| Helper line and Confirm & Enter for a one-brand rep (G-6): the Customizer welcome pop-up with one brand gets "You can change your primary brand anytime from My Account." under the brand, and its button reads "Confirm & Enter" (a Team Stores account keeps "Continue to Workspace") | Workspace and landing page, welcome pop-up | FR-1.3.8 · BR-31, BR-32, AC-16 (the design's references) | [welcome-one-brand-confirm.png](approved-changes/welcome-one-brand-confirm.png) | `WelcomeSSOModal.vue` (`.wx-welcome__single-note`), `LandingPage.vue`, `LandingPage.logic.js` (`welcomeCta`) |
| Locked cards in the grid (G-7): in the several-brand welcome pop-up, brands that can't be primary stay in the grid, greyed with a lock and a tag ("Access pending" or "Request access"); they can't be picked, and hovering shows "Connect this brand to set it as your primary." The several-brand rep has the design's eight sample brands | Workspace, welcome pop-up (several brands) | FR-1.3.9 · BR-28, AC-14 (the design's references); BRD FR-1.8, "Brands with no Customizer account, or with an access request pending, cannot be selected as primary" | [welcome-locked-brands.png](approved-changes/welcome-locked-brands.png) | `WelcomeSSOModal.vue` (`lockedTag`, `.wx-welcome__tile--locked`, `.wx-welcome__tile-tag*`, `.wx-welcome__tile-tip`), `data/brands.js` (`MULTI_BRAND_SAMPLE`, `LOCKED_BRANDS`) |
| Show toggle on Current password (G-11): in My Account's "Change your Team Stores password" pop-up, Current password gets the same Show / Hide control as New password | Workspace, My Account (both workspaces) | FR-1.3.12 · BR-48 (the design's references); BRD FR-1.11, "Given any password field, then the rep can show or hide what they've typed" | [current-password-show.png](approved-changes/current-password-show.png) | `components/account/AccountProfile.vue` (`pw.showCurrent`) |
| Confirm your email (G-9): after "Create account", sign-up stops at "Confirm your email" (the "Check your email" card: a confirmation link was sent; "Back to sign in"). The dealership check ("Account created / Checking …") runs once the rep opens the link; in the demo, `?confirm=<email>` stands in for it | Landing page, sign-up | FR-1.3.11 · BR-39, AC-19, Flow 3 (the design's references); BRD FR-1.11, "must verify their email before the account is active" | [confirm-your-email.png](approved-changes/confirm-your-email.png) | `src/landing/confirm-email.js`, `LandingPage.logic.js` (`componentDidMount`, `doSignup`, `stepConfirmEmail`), `LandingPage.vue` |
| Choose a Customizer cards (**team request, not approved yet**): a brand with a Customizer account gets a Connect button instead of ">" (Connect opens its password step) and its line reads "Customizer account found" without " · Sign in"; a brand without one keeps "Sign in with a different email" but loses "Request access to this brand" (and so "Access pending") | Landing page, Choose a Customizer | None: a team request, with no design image yet | none | `LandingPage.vue` (`.tsl-brand-card`, `.tsl-brand-card__connect`), `styles/components/landing/_auth-modal.scss`, `styles/_states.scss` |
