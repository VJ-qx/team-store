# How to open each screen

Where every converted screen is, and how to reach the states the BRD describes, in the Vue version and in the original prototype.

## How to run

In the project folder, run `npm run dev`. It opens the landing page in your browser. The same server opens the Vue pages and the original prototype pages:

| Page | Vue | Prototype |
|---|---|---|
| Landing page | http://localhost:5173/landing.html | http://localhost:5173/Landing%20Page.dc.html |
| Workspace | http://localhost:5173/workspace.html | http://localhost:5173/Workspace.dc.html |
| Marucci workspace | http://localhost:5173/workspace-integrated.html | http://localhost:5173/Marucci%20Workspace.dc.html |

The prototype's files are in `prototype/`, but they open at the root as above: the dev server serves that folder from the root.

The prototype's settings panel doesn't exist in the Vue pages. To change a setting, open the browser console and run the command given below for each version. Reload the page to go back to the defaults.

## Module 1

### Landing page

Open http://localhost:5173/landing.html (prototype: http://localhost:5173/Landing%20Page.dc.html). Sign-in, Forgot password, Sign in with Customizer and Create an account all start from the **SIGN IN** button at the top right.

Other states are settings. In Vue run `__paritySetProps({ … })`; in the prototype run `__dcSetProps(__dcRootName(), { … })` with the same settings:

| State | Settings |
|---|---|
| Signed in | `{ signedIn: true }` |
| Welcome pop-up, native sign-in (Connect buttons) | `{ signedIn: true, showWelcomeModal: true }` |
| Welcome pop-up, Customizer sign-in | `{ signedIn: true, showWelcomeModal: true, welcomeNativePath: false }` |
| Multi-brand welcome (Primary Brand Selection) | `{ signedIn: true, showWelcomeModal: true, welcomeNativePath: false, welcomeMultiBrand: true }` |

A successful sign-in redirects to `Team Stores Workspace.dc.html`, which isn't in the handover, so it ends on "Not found". Open the workspace addresses below directly instead.

**Sign-in paused (Vue only, [approved change](README.md#approved-changes)):** click **SIGN IN**, type any email, type the password `wrong`, and click **Sign in** 5 times. Sign-in for that email is paused for 15 minutes, with a countdown and a **Reset password** button. Another email isn't paused. Reload the page to clear the pause. The prototype doesn't have this yet: there, every wrong password shows "Email or password is incorrect".

### Workspace screens

These addresses are for the Vue workspace. For the prototype, use `Workspace.dc.html` in place of `workspace.html`. For the Marucci workspace, use `workspace-integrated.html` (prototype: `Marucci%20Workspace.dc.html`).

#### Register your organization (FR-1.10.2)

http://localhost:5173/workspace.html?brand=prolook&auth=native&access=none opens the business verification form. From that page, the other access screens:

| Screen | Vue | Prototype |
|---|---|---|
| Access gate | `__paritySetProps({ screen: 'gate' })` | Settings panel, **▶ Gate landing** |
| Awaiting approval | `__paritySetProps({ screen: 'access-pending' })`, or submit the filled-in form | Settings panel, **▶ Awaiting organization approval** |
| Stripe verification | `__paritySetProps({ screen: 'stripe-verify' })` | Settings panel, **▶ Stripe verification** |

The prototype's settings panel opens from the browser console: `window.postMessage({ type: "__activate_edit_mode" }, "*")`.

#### Welcome pop-up after sign-in (FR-1.8)

- **Native sign-in:** http://localhost:5173/workspace.html?brand=prolook&auth=native
- **Customizer sign-in:** http://localhost:5173/workspace.html?brand=prolook (or `brand=riddell`)
- **Multi-brand:** open the Customizer sign-in address, then run `__paritySetProps({ ssoMultiBrand: true })`. Prototype: settings panel, turn on **Multi-brand account**.

The pop-up shows once per browser session. To see it again, run `sessionStorage.clear()` and reload, or use an incognito window.

The ✕ at its top right, Escape, and a click outside the pop-up close it the same way as its button (**Continue to Workspace** / **Confirm & Enter**): the primary brand shown is kept.

#### My Account (FR-1.7.3, FR-1.12)

- Open http://localhost:5173/workspace.html?brand=prolook&auth=native-connected, hover the **HM** button at the top right, and click **My Account**.
- Brand Access & Authentication is the second card. The prototype and Vue now title it **Connected Customizers**, with an **Add Customizer** button.
- **Customizer-only version:** `__paritySetProps({ authMode: 'customizer' })`. Prototype: settings panel, **Sign-in method: Customizer only**.

## Store page and Store Setup Guide

- Open http://localhost:5173/workspace.html?brand=prolook&auth=native-connected and click **Manage Store** on a store under *Frequently visited*. Bayshore Summer Classic is the store in the BRD screenshot.
- The "How your store comes together" guide opens the first time you open any store. Click **Got it**. To see it again, run `localStorage.clear()` and reload.
- **Store Setup Guide:** click **Setup guide** at the top right. League stores have 7 cards; individual stores (Rams, Honey Badgers) have 6.
- Draft stores (Honey Badgers, Wasatch Elite Lacrosse) open the Setup Guide by themselves the first time.
- **6-card version on any store:** `window.dispatchEvent(new CustomEvent("setupguide:open", { detail: { storeType: "single" } }))`
- **Archived store (read-only):** My Account, then **Manage Store** on an archived store.

Not converted yet, so empty in Vue: the other store tabs (My Teams, Products, Orders, Reports and Settings show only their title), the Launch Store pop-ups, the Store Close Report, and **Back to Stores** (the store list).

## Module 2: Overview

Open http://localhost:5173/workspace.html?brand=prolook&auth=native-connected (prototype: http://localhost:5173/Workspace.dc.html?brand=prolook&auth=native-connected). For the Marucci workspace, use `workspace-integrated.html` (prototype: `Marucci%20Workspace.dc.html`). The [BRD M-2.0](https://docs.google.com/document/d/1gaYuVvpnUwYPefiVjtV8txcfZazXHL1N/edit) parts:

| BRD | On the Overview |
|---|---|
| FR-2.2 All Stores filter | **All Stores** at the top right: tick stores to filter the whole page; **Clear** resets it |
| FR-2.3 Search | **Search Team Stores** at the top right. Typing doesn't filter anything yet, in the prototype either |
| FR-2.4 Frequently visited | The row of store cards under the heading; **Manage Store** opens the store |
| FR-2.5 KPI cards | Total Revenue, Orders, Active Stores, Avg. Order Value. The Orders card opens the cross-store Orders page |
| FR-2.6 Revenue & Dealer Profit | **Day / Month / Year** at the panel's top right; point at the chart for a read-out |
| FR-2.7 Top Performing Stores | Click a column heading to sort (again to flip); click a row to open the store |
| FR-2.8 Active Ordering Windows | Below Top Performing Stores |
| FR-2.9 Roster Bank | At the bottom; **Review** opens the store's Roster tab |

**Empty Overview:** `__paritySetProps({ overviewEmpty: true })`. Prototype: settings panel, turn on **Overview empty state**.

**Not converted yet, so empty in Vue** (outside Module 2, to come back to): the screens these open: the Orders card (the cross-store Orders page) and **Review** (a store's Roster tab). The Vue comparison (`workspace-overview.mjs`) reports those 2 clicks as differences until the screens are converted. Both **All stores →** links and **Create a Store →** on the empty Overview open the Stores page, and **Add Store** opens the Add Store wizard, both converted in Module 3.

## Module 3: Stores page

Open http://localhost:5173/workspace.html?brand=prolook&auth=native-connected and click **STORES** in the header (prototype: http://localhost:5173/Workspace.dc.html?brand=prolook&auth=native-connected). For the Marucci workspace, use `workspace-integrated.html` (prototype: `Marucci%20Workspace.dc.html`). The [BRD M-3.0](https://docs.google.com/document/d/1DUE7F9qPHIC-QJt0qszqAVCHlxboWAwP/edit) parts on this page:

| BRD | On the Stores page |
|---|---|
| FR-3.2 Filters | **Show Filters** at the top right: Status, Sport and Location lists, built from the stores shown. The button reads the chosen filter ("Filter: Lacrosse"); **All** clears it |
| FR-3.3 Sort | **Sort By: Name (A-Z)**: Name A-Z / Z-A, Revenue high to low / low to high |
| FR-3.4 Search | **Search Team Stores**: matches the store name, team name, sport and city as you type |
| FR-3.5–3.7 Tabs | **All Stores / My Stores / Joined Stores**, with counts. A tab with nothing to show says so |
| FR-3.8 Store card | Status tag (Open / Draft / On Hold), store type, logo, sport, "Created by" |
| FR-3.9 Manage Store | Opens the store's page |
| FR-3.10 Edit | In the card's ⋮ menu; also opens the store's page |
| FR-3.11 ⋮ menu | Edit, Visit Store (does nothing in the prototype either), Use as Template, Archive |
| FR-3.11.1 Archive | **Archive** opens the "Archive <store>?" confirmation; **Archive Store** moves the store to My Account's archived list |

**Zero state** (no stores yet): `__paritySetProps({ zeroState: true })`, then click **STORES**. Prototype: settings panel, turn on **Zero state usability test**.

**Add Store** and **Create Your First Store** (zero state) open the Add Store wizard, below. **Not converted yet:** the **Use as Template** pop-up (nothing happens in Vue), and the page's league view, which the prototype can't show either (leagues are out of the MVP).

**Prototype differences from the BRD, for the frontend dev:** the ⋮ menu still has **Use as Template**, which FR-3.11 says was removed; the Status filter offers Active / On Hold where FR-3.2 lists Open / Draft / Closed.

## Module 3: Add Store wizard

Click **Add Store** on the Overview or the Stores page (prototype: the same on `Workspace.dc.html`). [BRD M-3.0](https://docs.google.com/document/d/1DUE7F9qPHIC-QJt0qszqAVCHlxboWAwP/edit) FR-3.1. Converted so far: the wizard's frame and **Step 1, Basics** (part 2a).

| On Basics | How to see it |
|---|---|
| Required fields | Click **CONTINUE** with nothing filled in: every required field shows its error, and the footer says "Please complete the required fields above" |
| Store type | **League Store** (4 steps) or **Individual Team Store** (3 steps); the stepper and the "Step N of M" badge follow |
| Store Timeline | Pick **Temporary Pop-Up**: launch and closing dates, and the urgency timers toggle |
| Team Database | **Connect to Team**: search, **Select** a team (its logo, colors and sports come in), then **Clear** |
| Logo and colors | Click the empty Team Logo box (My Logos), and **+** under Team Colors (Select Team Color) |
| Point of contact | Team Manager, Salesperson (pick one) or Custom, for email and phone |
| Ship-to | Pick **Ship to Team Manager**: a saved pick-up location or an address |
| Tax | Collect Sales Tax: pick a state (the rate fills in) and tick the agreement's box |
| Cancel | **CANCEL** opens "Discard this store?": **Keep Editing** or **Discard** |

**Navy accent:** `__paritySetProps({ wizardAccent: 'navy' })`. Prototype: settings panel, under Accent, **Navy**.

**Not converted yet, so empty in Vue** (the next parts of Module 3): the steps after Basics (Divisions & Teams, Add Products, Review & Deploy) and **SAVE AND CONTINUE**'s store creation. So the League → Individual warning ("Switching removes your divisions & teams"), which needs a team added in Divisions & Teams, can't be reached in Vue yet. Also not converted: the Marucci workspace's Stock Vault, which starts the wizard with Add Products pre-loaded.

**Prototype bugs kept, for the frontend dev:**
- In Store Point of Contact, the Custom email or phone field loses focus after each keystroke, so typing keeps only one character at a time (the prototype remounts those rows on every render).
- "Use as Template" → "Duplicate the whole store" opens on Basics instead of Review & Deploy, and the "Duplicated from …" line under the title never shows (the wizard drops the preset's _startAt and _dupSource).

## Other references

- **Compare with `main` side by side:** `npm run preview -- tools/parity/scenarios/<scenario>.mjs` opens the original on port 8001 and your version on port 8000. See [commands.md](commands.md#npm-run-preview).
- **Automated check against the prototype:** `npm run parity -- tools/parity/scenarios/<scenario>.mjs --mode behavior --b http://localhost:5173/workspace.html`. See [commands.md](commands.md#npm-run-parity).
- **Manual check lists, every state click by click:** `npm run checklist -- tools/parity/scenarios/<scenario>.mjs --mode behavior`, written to `.parity/checklist-<scenario>-behavior.md`.
- **Scenarios** (in `tools/parity/scenarios/`): `landing-page`, `workspace-module-1`, `marucci-workspace-module-1`, `workspace-store-home`, `marucci-workspace-store-home`, `workspace-mobile`.
- **BRD M-1.0:** https://docs.google.com/document/d/18UFKmsIhbKLlOutMd4mL5-GqYE1kxBQN/edit
- **Claude Design project (view only):** https://claude.ai/design/p/8d19c369-25d4-41a9-b7ff-59bddbe6183d
- **Known issues kept on purpose:** the sign-in redirect to the missing `Team Stores Workspace.dc.html`, and **Preview Store**, which redirects to the missing `Team Store Storefront.dc.html`. See [README.md](README.md#known-issues-in-the-handover).
