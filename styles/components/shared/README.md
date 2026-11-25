# Shared components

SCSS partials for components that two or more pages use with **exactly the same values**.

| Partial | Class | Used by |
|---|---|---|
| `_primary-tag.scss` | `.ts-primary-tag` | Workspace: My Account's brand list. Landing page: Choose a Customizer (team request, not in the prototype yet). |

- **Same values only.** If one page needs a different size, colour or spacing, the component stays in that page's own folder (`components/landing/`, `components/workspace/`, `components/workspace-mobile/`).
- **Class prefix `ts-`** (Team Stores). The pages use `tsl-` (landing), `wx-` (workspace) and `wm-` (Workspace Mobile), so a shared class never looks like it belongs to one page.
- **First line of every partial:** `@use "../../variables" as *;`
- **Import it from each page that uses it,** in that page's entry: `@use "components/shared/<name>";` (for example in `styles/app.scss` and `styles/workspace.scss`).
- **Moving an existing component here is a refactor.** Every page's compiled CSS must stay the same: run `npm run styles`, then `/compare-styles` for each page that uses it.
