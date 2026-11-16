// The same Add Store wizard states (frame and Basics) on the integrated workspace ("Marucci Workspace.dc.html"
// → workspace-app-integrated.jsx). CLAUDE.md: workspace changes apply to both files identically.
// Its sample stores are two League stores (Knights Knation Baseball and Pelicans Baseball); "Use as
// Template" starts from Knights.
// One difference: the integrated workspace's Stock Vault can start a store with products pre-loaded, and
// the stepper then marks Add Products "PRE-LOADED · REVIEW OPTIONAL" (WizardStepper's preDone). The extra
// state at the end reaches it.

import workspace, { buildStates } from './workspace-create-store.mjs';

const fromVault = {
  name: 'wizard from the stock vault', query: '?brand=prolook&auth=native-connected', steps: [
    { hover: 'role=button[name="Jack White" s]', label: 'Hover the account button (JW) at the top right' },
    { click: 'role=menuitem[name="Stock Vault" s]', label: 'Click "Stock Vault" in the menu' },
    { hover: 'text="Scuba Hoodie"', label: 'Hover the first item, Scuba Hoodie: its tick box shows' },
    { click: 'role=button[name="Select item" s] >> nth=0', label: 'Tick it ("Select for a new store")' },
    { click: 'role=button[name=/^Start a new store with/]', label: 'Click "Start a new store with this item": the wizard opens, Add Products pre-loaded' },
    { hover: 'xpath=//button[.//span[normalize-space(text())="Add Products"]]', label: 'Hover "Add Products" in the stepper' },
  ],
};

export default {
  ...workspace,
  name: 'Marucci workspace Add Store wizard: frame and Basics (Module 3)',
  page: 'Marucci Workspace.dc.html',
  states: [...buildStates({ stores: { league: 'Knights Knation Baseball' } }), fromVault],
};
