// Which workspace this is. The prototype has two copies of the workspace: "Workspace.dc.html"
// (workspace-app.jsx) and the third-party integration "Marucci Workspace.dc.html"
// (workspace-app-integrated.jsx). The Vue version is one codebase: the integrated entry turns this
// flag on before anything else loads, and the data and components read it.
export const INTEGRATION = { on: false };
