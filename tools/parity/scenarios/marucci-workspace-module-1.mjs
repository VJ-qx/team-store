// The same Module 1 states on the integrated workspace ("Marucci Workspace.dc.html" →
// workspace-app-integrated.jsx). CLAUDE.md: workspace changes apply to both files identically.
// Differences on this page: the rep is Jack White; the welcome pop-up is never rendered (WelcomeSSOModal is
// defined but unused); the sign-in method is fixed to "Team Stores account only", so the customizer-only
// view of My Account can't be reached; and there are two sample archived stores instead of three.

import workspace, { buildStates } from './workspace-module-1.mjs';

export default {
  ...workspace,
  name: 'Marucci workspace (Module 1)',
  page: 'Marucci Workspace.dc.html',
  related: workspace.related.map((r) => ({ ...r, how: r.how.replace(/Workspace\.dc\.html\?/g, 'Marucci Workspace.dc.html?').replace(/workspace\.html\?/g, 'workspace-integrated.html?') })),
  states: buildStates({ account: 'Jack White', welcome: false, customizerOnly: false, archivedStores: 2 }),
  // The approved Customizer loading screen is for the Prolook workspace only: the integrated workspace has no
  // Customizer hand-off (as for the welcome pop-up), so it ignores ?from=customizer.
  approved: [],
};
