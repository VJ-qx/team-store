// The same Add Store wizard Divisions & Teams states on the integrated workspace ("Marucci Workspace.dc.html" →
// workspace-app-integrated.jsx). CLAUDE.md: workspace changes apply to both files identically.

import workspace, { buildStates } from './workspace-create-store-structure.mjs';

export default {
  ...workspace,
  name: 'Marucci workspace Add Store wizard: Divisions & Teams (Module 3)',
  page: 'Marucci Workspace.dc.html',
  states: buildStates(),
};
