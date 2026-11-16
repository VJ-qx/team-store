// The same Add Store wizard Add Products states on the integrated workspace ("Marucci Workspace.dc.html" →
// workspace-app-integrated.jsx). CLAUDE.md: workspace changes apply to both files identically.
// Differences: the Source pill offers only connected Customizers (Victus); Stock Vault items are auto-added
// to every new store, so their cards show Remove / Add back (and a banner, Remove all / Add all back);
// Customize New Product's sports are Baseball and Softball.

import workspace, { buildStates } from './workspace-create-store-products.mjs';

export default {
  ...workspace,
  name: 'Marucci workspace Add Store wizard: Add Products (Module 3)',
  page: 'Marucci Workspace.dc.html',
  states: buildStates({ sourceOption: 0, sport: 'Baseball', vaultAuto: true }),
};
