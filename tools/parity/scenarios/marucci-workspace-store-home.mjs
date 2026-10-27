// The same store-page states on the integrated workspace ("Marucci Workspace.dc.html" →
// workspace-app-integrated.jsx). CLAUDE.md: workspace changes apply to both files identically.
// Differences on this page: the rep is Jack White, and the only sample stores are two open league
// stores, so there is no individual or draft store to open (the 6-card guide is still reached
// through the "setupguide:open" event).

import workspace, { buildStates } from './workspace-store-home.mjs';

export default {
  ...workspace,
  name: 'Marucci workspace store page',
  page: 'Marucci Workspace.dc.html',
  states: buildStates({
    account: 'Jack White',
    stores: { leagueRich: 'Knights Knation Baseball', leagueEmpty: 'Pelicans Baseball', team: null, draftTeam: null, draftLeague: null },
  }),
};
