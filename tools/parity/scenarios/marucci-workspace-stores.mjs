// The same Stores page states on the integrated workspace ("Marucci Workspace.dc.html" →
// workspace-app-integrated.jsx). CLAUDE.md: workspace changes apply to both files identically.
// Differences on this page: the Status filter's option is "Open" instead of "Active", and the league
// view's heading is 24px instead of 26px. The sample stores are two league stores the rep created
// (Knights Knation Baseball and Pelicans Baseball), so the Joined Stores tab is empty; only Knights has a
// shipping city (Baton Rouge), so it is the one Location option.

import workspace, { buildStates } from './workspace-stores.mjs';

export default {
  ...workspace,
  name: 'Marucci workspace Stores page (Module 3)',
  page: 'Marucci Workspace.dc.html',
  states: buildStates({
    stores: { card: 'Pelicans Baseball', search: 'Baton', sport: 'Baseball', city: 'Baton Rouge', statusLabel: 'Open', noMatchSport: 'Baseball' },
  }),
};
