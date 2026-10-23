// The same Module 1 states on the integrated workspace ("Marucci Workspace.dc.html" →
// workspace-app-integrated.jsx). CLAUDE.md: workspace changes apply to both files identically.
// Differences on this page: the rep is Jack White, and the welcome pop-up is never rendered
// (WelcomeSSOModal is defined but unused), so its states are left out.

import workspace, { buildStates } from './workspace-module-1.mjs';

export default {
  ...workspace,
  name: 'Marucci workspace (Module 1)',
  page: 'Marucci Workspace.dc.html',
  related: workspace.related.map((r) => ({ ...r, how: r.how.replace(/Workspace\.dc\.html\?/g, 'Marucci Workspace.dc.html?') })),
  states: buildStates({ account: 'Jack White', welcome: false }),
};
