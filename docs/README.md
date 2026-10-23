# Team Store — developer docs

This repo holds the Team Store prototype that another team built in Claude Design. We take it to production one module at a time:

1. **Styles:** move every inline style into SCSS.
2. **Vue:** convert the page to Vue, our stack.
3. **Responsive:** add tablet and mobile layouts.

After each step, an automated check proves that nothing changed that shouldn't have.

| Doc | What's in it |
|---|---|
| [commands.md](commands.md) | The `npm run …` commands: compile styles, compare versions, preview side by side, manual check lists |
| [skills.md](skills.md) | The Claude Code slash commands (`/extract-styles`, `/migrate-to-vue`, …) and when to use each |

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
| 3. Responsive | `landing/responsive` | `/make-responsive <vue page>` | Desktop still identical; team approves the mobile layout |

Each step ends with a manual check list. Use it to review the result by hand before approving the pull request (see [commands.md](commands.md#npm-run-checklist)).

## Where things live

```text
Landing Page.dc.html, Workspace.dc.html, …   prototype pages (Claude Design format)
workspace-app.jsx, workspace-app-integrated.jsx   workspace code (React)
styles/                    SCSS: app.scss (landing page) → styles/app.css
                           workspace.scss + styles/workspace/ (workspace) → styles/workspace.css
tools/parity/              comparison, check list, and preview tools
tools/parity/scenarios/    user flows per page (one file per page or module)
.claude/skills/            Claude Code slash commands
.parity/                   reports and check lists (not committed)
```

## Known issues in the handover

- **Broken sign-in redirect:** successful sign-in and registration redirect to `Team Stores Workspace.dc.html`, which doesn't exist (the page is now `Workspace.dc.html`). The conversion steps keep this behaviour on purpose; it needs a separate fix. To reach the workspace, open `Workspace.dc.html?brand=prolook&auth=native` directly.
- **Out-of-date `CLAUDE.md`:** it refers to `Team Stores Workspace.dc.html` and `Team Stores Workspace - Third Party Integration.dc.html`, which have since been renamed.
