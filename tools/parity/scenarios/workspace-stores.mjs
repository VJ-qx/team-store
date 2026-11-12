// Module 3: the workspace Stores page ("Workspace.dc.html" → workspace-app.jsx, StoreList), BRD M-3.0:
// the filters (FR-3.2), sort (FR-3.3), search (FR-3.4), the All / My / Joined Stores tabs (FR-3.5–3.7),
// the store card (FR-3.8), Manage Store (FR-3.9) and Edit (FR-3.10), the card's ⋮ menu (FR-3.11) and the
// archive confirmation (FR-3.11.1), plus the zero state ("Zero state usability test" in the settings panel).
// The Add Store wizard (FR-3.1) is the other part of Module 3 and has its own scenario.
//
// The page is reached from the STORES tab. It shows random sample data, so both sides get the same random
// numbers (seedRandom). The zero state is a prototype setting: the settings panel's switch, and on the
// Vue version window.__paritySetProps (steps marked `on: 'prototype'` / `on: 'vue'`).
// StoreList also has a league view (breadcrumbs, group cards, Add Group, League Settings), but leagues are
// out of the MVP: makeSampleLeagues returns [] and the Leagues tab is hidden, so no state can reach it.
// The same states run on the integrated page in marucci-workspace-stores.mjs.

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
const button = (name, exact = true) => (exact ? `role=button[name="${name}" s]` : `role=button[name=/${escapeRegex(name)}/i]`);

const SIGNED_IN = '?brand=prolook&auth=native-connected'; // signed in, welcome pop-up already seen
const SEARCH = 'input[placeholder="Search Team Stores"]';
const openStores = { click: 'role=link[name="STORES" s]', label: 'Click the STORES tab in the header' };
const tab = (name) => ({ click: `role=tab[name=/^${escapeRegex(name)}/]`, label: `Click the "${name}" tab` });
// The toolbar's Show Filters / Filter: … button, and its Sort By: … button.
const filterBtn = 'role=button[name=/^(Show Filters|Filter: )/]';
const sortBtn = 'role=button[name=/^Sort By: /]';
const menuItem = (label) => `role=menuitem[name="${label}" s]`;
// An option inside an opened Status / Sport / Location sub-list.
const subItem = (label) => `xpath=//div[@role="menuitem"]/following-sibling::div//span[normalize-space(text())="${label}"]`;
// A store card's controls, found from the store's name on the card.
const card = (name) => `xpath=//*[normalize-space(text())="${name}"]/ancestor::div[.//button[@title="Store actions"]][1]`;
const cardManage = (name) => `${card(name)}//button[normalize-space(.)="Manage Store"]`;
const cardMenu = (name) => `${card(name)}//button[@title="Store actions"]`;
const cardMenuItem = (label) => `xpath=//button[@title="Store actions"]/following-sibling::div/div[normalize-space(text())="${label}"]`;
const modalClose = { wait: 200, label: 'Wait 0.2 s for the pop-up to close' };

const openSettings = {
  eval: `window.postMessage({ type: '__activate_edit_mode' }, '*')`, on: 'prototype',
  label: 'Open the prototype settings panel: in the browser console, run `window.postMessage({ type: "__activate_edit_mode" }, "*")`',
};
const closeSettings = { click: button('Close tweaks'), on: 'prototype', label: 'Close the settings panel (✕ at its top right)' };
const vueSettings = (props) => {
  const json = JSON.stringify(props).replace(/"/g, "'");
  return { eval: `window.__paritySetProps(${json})`, on: 'vue', label: `In the browser console, run \`__paritySetProps(${json})\`` };
};
const zeroSwitch = {
  click: 'xpath=//*[normalize-space(text())="Zero state usability test"]/ancestor::*[.//*[@role="switch"]][1]//*[@role="switch"]',
  on: 'prototype', label: 'In the settings panel, turn on "Zero state usability test"',
};

// stores: card is a store to hover, open and archive; search is text that matches a store's city;
// sport / city are a Sport and a Location in the filter; statusLabel is the Status option's name;
// noMatchSport is a Sport no Joined store has.
export const buildStates = ({ stores }) => [
  {
    name: 'stores', query: SIGNED_IN, steps: [
      openStores,
      { hover: button('Add Store') },
      { hover: `text="${stores.card}"`, label: `Hover the ${stores.card} card` },
      { hover: cardManage(stores.card), label: 'Hover its "Manage Store" button' },
      { hover: cardMenu(stores.card), label: 'Hover its ⋮ button' },
    ],
  },
  { name: 'stores tabs', query: SIGNED_IN, steps: [openStores, tab('My Stores'), tab('Joined Stores'), tab('All Stores')] },
  {
    name: 'stores filter', query: SIGNED_IN, steps: [
      openStores,
      { click: filterBtn, label: 'Click "Show Filters"' },
      { hover: menuItem('Status') },
      { click: menuItem('Status') },
      { hover: subItem(stores.statusLabel), label: `Hover "${stores.statusLabel}" in the Status list` },
      { click: subItem(stores.statusLabel), label: `Click "${stores.statusLabel}": the button reads "Filter: ${stores.statusLabel}"` },
      { click: filterBtn, label: 'Click the filter button again' },
      { click: menuItem('Sport') },
      { click: subItem(stores.sport), label: `Click "${stores.sport}" in the Sport list` },
      { click: filterBtn, label: 'Click the filter button again' },
      { click: menuItem('Location') },
      { click: subItem(stores.city), label: `Click "${stores.city}" in the Location list` },
      { click: filterBtn, label: 'Click the filter button again' },
      { press: 'Escape', label: 'Press Escape: the list closes' },
      { click: filterBtn, label: 'Click the filter button again' },
      { click: menuItem('All'), label: 'Click "All": the button reads "Show Filters" again' },
    ],
  },
  {
    name: 'stores filter no match', query: SIGNED_IN, steps: [
      openStores,
      tab('Joined Stores'),
      { click: filterBtn, label: 'Click "Show Filters"' },
      { click: menuItem('Sport') },
      { click: subItem(stores.noMatchSport), label: `Click "${stores.noMatchSport}": no joined store has it, so the page says so` },
    ],
  },
  {
    name: 'stores sort', query: SIGNED_IN, steps: [
      openStores,
      { click: sortBtn, label: 'Click "Sort By: Name (A-Z)"' },
      { hover: menuItem('Name (Z-A)') },
      { click: menuItem('Name (Z-A)') },
      { click: sortBtn, label: 'Click the sort button again' },
      { click: menuItem('Revenue (high to low)') },
      { click: sortBtn, label: 'Click the sort button again' },
      { click: menuItem('Revenue (low to high)') },
      { click: sortBtn, label: 'Click the sort button again' },
      { click: menuItem('Name (A-Z)') },
    ],
  },
  {
    name: 'stores search', query: SIGNED_IN, steps: [
      openStores,
      { fill: [SEARCH, stores.search], label: `Type "${stores.search}" in Search Team Stores` },
      { fill: [SEARCH, 'zzz'], label: 'Replace it with "zzz": no store matches' },
      { fill: [SEARCH, ''], label: 'Clear the search' },
    ],
  },
  {
    name: 'stores card menu', query: SIGNED_IN, steps: [
      openStores,
      { click: cardMenu(stores.card), label: `Click ⋮ on the ${stores.card} card` },
      { hover: cardMenuItem('Edit'), label: 'Hover "Edit" in the menu' },
      { hover: cardMenuItem('Archive'), label: 'Hover "Archive" in the menu' },
      { click: 'h1', label: 'Click the "Stores" heading: the menu closes' },
      { click: cardMenu(stores.card), label: 'Click ⋮ again' },
      { click: cardMenuItem('Visit Store'), label: 'Click "Visit Store": the menu closes, nothing else happens in the prototype' },
    ],
  },
  {
    name: 'stores archive', query: SIGNED_IN, steps: [
      openStores,
      { click: cardMenu(stores.card), label: `Click ⋮ on the ${stores.card} card` },
      { click: cardMenuItem('Archive'), label: 'Click "Archive": the confirmation opens' },
      { hover: button('Archive Store') },
      { hover: button('Cancel') },
      { click: button('Cancel') },
      modalClose,
      { click: cardMenu(stores.card), label: 'Click ⋮ again' },
      { click: cardMenuItem('Archive'), label: 'Click "Archive"' },
      { click: button('Archive Store'), label: 'Click "Archive Store": the card leaves the list' },
      modalClose,
    ],
  },

  // ── Clicks that leave the Stores page ──
  { name: 'stores manage store', query: SIGNED_IN, steps: [openStores, { click: cardManage(stores.card), label: `Click "Manage Store" on the ${stores.card} card` }] },
  {
    name: 'stores edit from menu', query: SIGNED_IN, steps: [
      openStores,
      { click: cardMenu(stores.card), label: `Click ⋮ on the ${stores.card} card` },
      { click: cardMenuItem('Edit'), label: 'Click "Edit": the store opens' },
    ],
  },
  { name: 'stores add store', query: SIGNED_IN, steps: [openStores, { click: button('Add Store') }] },

  // ── Zero state (settings: "Zero state usability test") ──
  {
    name: 'stores zero state', query: SIGNED_IN, steps: [
      openSettings, zeroSwitch, closeSettings, vueSettings({ zeroState: true }),
      openStores,
      { hover: button('Create Your First Store') },
      { click: button('Create Your First Store') },
    ],
  },
];

export default {
  name: 'Workspace Stores page (Module 3)',
  page: 'Workspace.dc.html',
  ready: 'h1',
  seedRandom: true,
  settleMs: 300, // the workspace is a large page: give it longer to finish rendering after each step
  viewports: [{ width: 1440, height: 900 }],
  related: [
    {
      name: "A store's page",
      where: 'ManageStoreWorkspace in workspace-app.jsx',
      how: '"Manage Store" on a card, and "Edit" in its ⋮ menu, open the store. Checked by workspace-store-home.mjs.',
    },
    {
      name: 'New store',
      where: 'CreateForm in workspace-app.jsx',
      how: '"Add Store", and "Create Your First Store" in the zero state, open the Add Store wizard (FR-3.1), the other part of Module 3.',
    },
    {
      name: 'The league view of the Stores page',
      where: 'StoreList (activeLeague) and GroupCard in workspace-app.jsx',
      how: 'Breadcrumbs, group cards, "Add Group" and "League Settings". Not reachable: leagues are out of the MVP (makeSampleLeagues returns []).',
    },
    {
      name: 'No stores at all',
      where: 'EmptyState in workspace-app.jsx',
      how: 'Shown on the STORES tab when "Seed dummy data" is off in the settings panel and no store exists. A different screen from the zero state.',
    },
    {
      name: 'Archived stores',
      where: 'AccountProfile and RestoreStoreModal in workspace-app.jsx',
      how: 'An archived store moves to My Account (the account button at the top right), where "Unarchive" opens the restore confirmation. Module 1.',
    },
  ],
  states: buildStates({
    stores: { card: 'Rams', search: 'Perris', sport: 'Lacrosse', city: 'Riverside', statusLabel: 'Active', noMatchSport: 'Lacrosse' },
  }),
};
