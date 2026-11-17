// The same Add Store wizard Review & Deploy states on the integrated workspace ("Marucci Workspace.dc.html" →
// workspace-app-integrated.jsx). CLAUDE.md: workspace changes apply to both files identically.
// Differences: its saved designs are the baseball ones, so the first one added is different.

import workspace, { buildStates } from './workspace-create-store-review.mjs';

export default {
  ...workspace,
  name: 'Marucci workspace Add Store wizard: Review & Deploy (Module 3)',
  page: 'Marucci Workspace.dc.html',
  states: buildStates(),
};
