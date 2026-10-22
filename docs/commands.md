# Commands

Run these from the project root. **Keep the `--` after `npm run <name>`**: without it, npm treats options like `--mode` as its own settings and doesn't pass them on.

| Command | What it does |
|---|---|
| `npm install` | Installs the tools (`sass`, `playwright-core`). Run once, and again after `package.json` changes. |
| [`npm run styles`](#npm-run-styles) | Compiles `styles/app.scss` to `styles/app.css`. |
| [`npm run preview`](#npm-run-preview) | Serves the original and your version side by side for checking by hand. |
| [`npm run checklist`](#npm-run-checklist) | Writes a manual check list: every state, its settings, and how to reach it. |
| [`npm run parity`](#npm-run-parity) | Runs the page's user flows on two versions in Chrome and reports every difference. |

---

## npm run styles

```bash
npm run styles
```

Compiles `styles/app.scss` (and everything it imports) to `styles/app.css`, which the page links. Run it after every SCSS change.

**Never edit `styles/app.css` by hand.** It's overwritten on every compile.

---

## npm run preview

```bash
npm run preview -- tools/parity/scenarios/landing-page.mjs
```

Prints two links and keeps running until you press **Ctrl+C**:

```text
Original  main (ea4a86f)         http://127.0.0.1:8001/Landing%20Page.dc.html
New       working tree           http://127.0.0.1:8000/Landing%20Page.dc.html
```

The original is served from a temporary copy of `main`, which Ctrl+C removes.

| Option | Default | Meaning |
|---|---|---|
| `--a <ref \| . \| url>` | `main` | The original: a branch or commit, `.` for your working tree, or a URL that's already running |
| `--b <ref \| . \| url>` | `.` | The new version |
| `--port-a <n>` | `8001` | Port for the original |
| `--port-b <n>` | `8000` | Port for the new version |

For the Vue step, pass the Vue dev server as the new version: `npm run preview -- tools/parity/scenarios/landing-page.mjs --b http://localhost:5173/`.

### Reaching other states by hand

There are no real accounts in the prototype. States like "signed in" or "welcome pop-up" are **settings**, which you set in the browser console.

**To show both versions signed in:**

1. Open both links from `npm run preview`.
2. In the **original** tab, open the console (⌥⌘J on a Mac), paste this, and press Enter:
   ```js
   __dcSetProps(__dcRootName(), { signedIn: true })
   ```
3. Do the same in the **new** tab. Each tab has its own console, so the command has to be run in both.

Both tabs now show the signed-in header (the account name instead of the SIGN IN button). **Reload a tab** to return to the default settings.

Combine settings in one command:

```js
__dcSetProps(__dcRootName(), { signedIn: true, showWelcomeModal: true })                     // welcome pop-up
__dcSetProps(__dcRootName(), { signedIn: true, showWelcomeModal: true,
                               welcomeNativePath: false, welcomeMultiBrand: true })          // multi-brand welcome
__paritySetProps({ signedIn: true })                                                         // Vue version (development build)
```

**Signing in through the pop-up doesn't keep you signed in.** SIGN IN → email → password → Sign in shows "You're signed in". After about 1.7 seconds it redirects to `Team Stores Workspace.dc.html`, which doesn't exist in the handover, so both versions end on "Not found". That's expected, and it should happen the same way in both. To see the signed-in landing page, use the `signedIn` setting instead.

#### Landing page settings

| Setting | Default | What it controls |
|---|---|---|
| `signedIn` | `false` | Rep signed in: the header shows the account instead of SIGN IN |
| `hasAccess` | `true` | Dealership has Team Stores access. `false`: sign-in redirects with `access=none` |
| `brandCustomizer` | `"PROLOOK"` | Signed-in Customizer brand: `PROLOOK`, `Alli Sports`, `Riddell`, `Game One`, `Legends`, `Axe`, `Baden`, `Perfect Game` |
| `customizerAccountExists` | `false` | Customizer account exists for the email. `true`: "Sign in with Customizer" shows the brand to sign in to; `false`: "Request access" |
| `emailInDealerRecords` | `true` | Email found in dealership records. `false`: "Sign in with Customizer" finds no brands |
| `signupDealershipFound` | `false` | Dealership found after sign-up. `true`: "Connect your brands?"; `false`: business registration |
| `showDashboardPreview` | `true` | Show the dashboard preview in the hero |
| `showWelcomeModal` | `false` | Show the Welcome & Primary Brand pop-up |
| `welcomeNativePath` | `true` | Native sign-in version of the welcome pop-up. `false`: the Customizer version |
| `welcomeMultiBrand` | `false` | Multi-brand account (with `welcomeNativePath: false`): pick a primary brand |

`npm run checklist` lists the exact settings for every state the automated check covers.

---

## npm run checklist

```bash
npm run checklist -- tools/parity/scenarios/landing-page.mjs                    # SCSS step
npm run checklist -- tools/parity/scenarios/landing-page.mjs --mode behavior    # Vue step
```

Writes `.parity/checklist-<scenario>-<mode>.md`, with one checkbox per state. For each state it gives:

- **Settings:** the console command to run in each version.
- **Steps:** the clicks and typing that reach the state, in plain language.

It ends with **Outside this page**: where the flows lead next, such as the workspace after sign-in, and how to open each place directly. `/extract-styles` and `/migrate-to-vue` generate this list automatically at the end of their run.

| Option | Default | Meaning |
|---|---|---|
| `--mode styles \| behavior` | `styles` | Which step the list is for. `behavior` adds the Vue console commands. |
| `--a-url <url>` | preview's original URL | Link shown for the original |
| `--b-url <url>` | preview's new URL, or `http://localhost:5173/` in behavior mode | Link shown for the new version |
| `--out <file>` | `.parity/checklist-…md` | Where to write the list |

---

## npm run parity

```bash
# SCSS step: is the extracted page identical to main?
npm run parity -- tools/parity/scenarios/landing-page.mjs --mode styles

# Vue step: does the Vue page behave like the prototype?
npm run parity -- tools/parity/scenarios/landing-page.mjs --mode behavior --b http://localhost:5173/
```

Opens both versions in headless Chrome and runs every state in the scenario. It compares them at the start and after every step. A full landing-page run (18 states, 129 checkpoints) takes about 2 minutes.

| Mode | Compares |
|---|---|
| `styles` | Every element's computed CSS, position and size, and text, plus a pixel diff. The markup must be identical. |
| `behavior` | What a user sees (accessibility tree, text, buttons and their states), form values, navigation, dialogs, requests, storage and console errors, plus a pixel diff. The markup may differ. |

| Option | Default | Meaning |
|---|---|---|
| `--a <ref \| . \| url>` | `main` | The original |
| `--b <ref \| . \| url>` | `.` | The version being checked |
| `--only "<text>"` | | Run only states whose name contains the text, for example `--only "forgot"` |
| `--viewports 1440x900,1024x768` | from the scenario | Window sizes to test |
| `--pixel-tolerance <n>` | `10` | Per-channel colour difference ignored as anti-aliasing noise. Don't raise it to hide a difference. |
| `--keep` | | Keep the temporary copy of the original for inspection |

**Result:** `IDENTICAL` (exit code 0), `DIFFERENCES FOUND` (1), or a failed run (2). The report is written to `.parity/<date>-<scenario>-<mode>/report.md`:

- **style / box / text:** each element that changed, with the before → after values.
- **pixels:** `-a.png`, `-b.png` and `-diff.png` screenshots, with the changed pixels in red.
- **Notes:** states that end in a redirect, and anything skipped.

Timers on the page are frozen after it loads, so redirects and delays only happen at the scenario's `wait` steps.

### Scenarios

Each page or module has a scenario in `tools/parity/scenarios/`, listing every state to check and how to reach it. Use `landing-page.mjs` as the template. See the "Find or Write the Scenario" section of `.claude/skills/compare-styles/SKILL.md` for the format.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `Usage: node tools/parity/… <scenario.mjs>` | Add the scenario file: `npm run <command> -- tools/parity/scenarios/landing-page.mjs` |
| An option like `--mode` is ignored | Add `--` after `npm run <command>` |
| `Preview failed: Port 8001 is already in use` | Stop the other server, or choose ports: `--port-a 8101 --port-b 8100` |
| Signing in ends on "Not found" | Expected: the handover's sign-in redirect points to a missing file. Use the `signedIn` setting instead (see [Reaching other states by hand](#reaching-other-states-by-hand)). |
| A console setting only changed one tab | Each tab has its own console. Run the command in both. |
| `No browser found` | Install Google Chrome, or run `npx playwright install chromium` |
| Differences only in the pixels, a few pixels each | Rounded-corner anti-aliasing noise is already filtered. If it persists, open the `-diff.png` and check for a real change. |
| `Error: Can't find stylesheet to import` | A `@use` path is wrong. Partials in subfolders use `@use "../variables" as *;` |





