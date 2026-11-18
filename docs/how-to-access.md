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

#### Loading screen from a Customizer (Vue only, [approved change](README.md#approved-changes))

Open http://localhost:5173/workspace.html?brand=riddell&from=customizer. `from=customizer` stands in for a Customizer's **Team Store** link (any brand works). The loading screen shows for 1.7 seconds under the Team Stores top bar, then the Overview opens, with the welcome pop-up on the first visit in the browser session (run `sessionStorage.clear()` and reload to see it again). On a narrower window it fits the screen: below 1024px the spinner and text stay centred, and below 744px (a phone) the top bar shows only the logo, TEAM STORES and the avatar. Without `from=customizer` the workspace opens as before. The Marucci workspace has no Customizer hand-off, so it ignores it. The prototype doesn't have this yet.

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

## Other references

- **Compare with `main` side by side:** `npm run preview -- tools/parity/scenarios/<scenario>.mjs` opens the original on port 8001 and your version on port 8000. See [commands.md](commands.md#npm-run-preview).
- **Automated check against the prototype:** `npm run parity -- tools/parity/scenarios/<scenario>.mjs --mode behavior --b http://localhost:5173/workspace.html`. See [commands.md](commands.md#npm-run-parity).
- **Manual check lists, every state click by click:** `npm run checklist -- tools/parity/scenarios/<scenario>.mjs --mode behavior`, written to `.parity/checklist-<scenario>-behavior.md`.
- **Scenarios** (in `tools/parity/scenarios/`): `landing-page`, `workspace-module-1`, `marucci-workspace-module-1`, `workspace-store-home`, `marucci-workspace-store-home`, `workspace-mobile`.
- **BRD M-1.0:** https://docs.google.com/document/d/18UFKmsIhbKLlOutMd4mL5-GqYE1kxBQN/edit
- **Claude Design project (view only):** https://claude.ai/design/p/8d19c369-25d4-41a9-b7ff-59bddbe6183d
- **Known issues kept on purpose:** the sign-in redirect to the missing `Team Stores Workspace.dc.html`, and **Preview Store**, which redirects to the missing `Team Store Storefront.dc.html`. See [README.md](README.md#known-issues-in-the-handover).
