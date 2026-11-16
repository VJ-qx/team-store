# Prototype

The Claude Design prototype that the Vue app is converted from. It isn't part of the app: the Vue pages (`index.html`, `workspace.html`, `workspace-integrated.html`, `src/`) run without it.

| File | What it is |
|---|---|
| `Landing Page.dc.html` | Landing page, sign-in and registration |
| `Workspace.dc.html` | The workspace (Prolook). Loads `workspace-app.jsx` |
| `Marucci Workspace.dc.html` | The third-party integration workspace (Marucci). Loads `workspace-app-integrated.jsx` |
| `Workspace Mobile.dc.html` | The mobile workspace. Loads `ios-frame.jsx` |
| `workspace-app.jsx`, `workspace-app-integrated.jsx` | The workspace code (React). Changes go to both files, identically |
| `support.js` | The Claude Design runtime the pages run on |

**Why keep it:** the screens not converted yet exist only here, the parity tools compare the Vue pages against these pages, and updates from Claude Design arrive as changes to these files.

**Opening a page:** run `npm run dev` and open it at the root, for example http://localhost:5173/Workspace.dc.html. The dev server (`vite.config.js`) and the parity tools (`tools/parity/lib.mjs`) serve this folder from the root, so the pages find `_ds/`, `assets/` and `styles/css/` at the project root, as in the Claude Design export. Opening a file straight from this folder doesn't work for the same reason.

**Updates from Claude Design:** the export has these files at its root. Apply the changes to the files here rather than copying them over: the SCSS steps have moved the converted screens' inline styles into `styles/`.
