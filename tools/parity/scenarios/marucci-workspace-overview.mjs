// The same Overview states on the integrated workspace ("Marucci Workspace.dc.html" →
// workspace-app-integrated.jsx). CLAUDE.md: workspace changes apply to both files identically.
// Differences on this page: the only sample stores are two league stores (Knights Knation Baseball and
// Pelicans Baseball), so ticking both in the All Stores filter selects every store; the panel titles are
// 16px instead of 15.5px, and the empty Overview's heading is 24px instead of 27px.

import workspace, { buildStates } from './workspace-overview.mjs';

export default {
  ...workspace,
  name: 'Marucci workspace Overview (Module 2)',
  page: 'Marucci Workspace.dc.html',
  states: buildStates({ stores: { filterA: 'Knights Knation Baseball', filterB: 'Pelicans Baseball', top: 'Pelicans Baseball' } }),
};
