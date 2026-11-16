# Reference

Files from the Claude Design handover that nothing in the project uses: not the Vue app, not the prototype pages the conversion follows, not the parity tools. They're kept here, out of the way, for reference.

| File or folder | What it is |
|---|---|
| `Design Exploration.dc.html` | Design concepts explored in Claude Design (mobile Overview options, My Account options). Not applied to the workspace. |
| `Workspace Mobile Mapping.dc.html` | The design document behind the mobile prototype (navigation models, page patterns, foundations spec). |
| `Storefront.html`, `storefront-assets/` | The consumer storefront prototype, with its images. Not part of the workspace conversion. |
| `handoff/` | Claude Design's handoff notes and pages. |
| `export-assets/` | Image exports from Claude Design. |
| `scratch/` | Claude Design's working files (extracts, drafts, test outputs). |
| `screenshots/` | Screenshots from Claude Design. |
| `.thumbnail` | The Claude Design project's thumbnail. |

**Opening the pages:** open `Storefront.html` straight from this folder in the browser (double-click it). `npm run dev` can't serve it, here or at the root: Vite can't parse its HTML. `Design Exploration.dc.html` and `Workspace Mobile Mapping.dc.html` load `support.js`, `_ds/`, `assets/` and `ios-frame.jsx` from beside them, so they don't display properly from this folder. View them in the Claude Design project, or copy one into `prototype/` for a moment and open it at `http://localhost:5173/<name>` with `npm run dev`.

The prototype the conversion follows is in [`prototype/`](../prototype/README.md).
