// Module 2: the workspace Overview ("Workspace.dc.html" → workspace-app.jsx, OverviewDashboard), BRD M-2.0:
// the All Stores filter (FR-2.2), search (FR-2.3), Frequently visited (FR-2.4), the KPI cards (FR-2.5),
// Revenue & Dealer Profit (FR-2.6), Top Performing Stores (FR-2.7), Active Ordering Windows (FR-2.8) and
// Roster Bank (FR-2.9), plus the empty Overview.
//
// The Overview shows random sample data, so both sides get the same random numbers (seedRandom). The
// empty Overview is a prototype setting: the settings panel's "Overview empty state" switch, and on the
// Vue version window.__paritySetProps (steps marked `on: 'prototype'` / `on: 'vue'`).
// Clicks that leave the Overview (a store's page, the store list, the cross-store Orders page, the new
// store flow) end their state; those screens are listed in `related`.
// The same states run on the integrated page in marucci-workspace-overview.mjs.
//
// Known differences in the Vue step (behavior mode), left for later (2026-11-03). Every checkpoint on the
// Overview itself matches; 3 of 49 checkpoints differ, on both workspaces, all outside Module 2:
// - 2 states end on a click into a screen the Vue app doesn't have yet, so Vue shows it empty: the Orders
//   card (cross-store Orders) and "Review" (a store's Roster tab). They match once those screens are
//   converted. (Both "All stores →" and "Create a Store →" open the Stores page, converted in Module 3 on
//   2026-11-12, and "Add Store" opens the Add Store wizard, converted on 2026-11-16; they match since.)
// - "overview chart scale", the Year click: the prototype logs "Cannot read properties of undefined (reading
//   'revenue')". The click lands while the pointer is still over a day on the chart, and React redraws the
//   year chart with the day's hover position; the screen is unchanged. Vue redraws after the hover clears,
//   so it logs nothing. When the pointer reaches Year before the click, as a mouse does, both match.

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
const button = (name, exact = true) => (exact ? `role=button[name="${name}" s]` : `role=button[name=/${escapeRegex(name)}/i]`);

const SIGNED_IN = '?brand=prolook&auth=native-connected'; // signed in, welcome pop-up already seen
const SEARCH = 'input[placeholder="Search Team Stores"]';
const ORDERS_CARD = '[title="View all orders"]';
// Top Performing Stores column headings (the text is shown in capitals).
const sortHead = (label) => ({ click: `role=button[name=/^${escapeRegex(label)}$/i]`, label: `Click the "${label}" column heading in Top Performing Stores` });
// A leaderboard row: the only button holding the store's name in its own span.
const topRow = (name) => `xpath=//button[.//span[normalize-space(text())="${name}"]]`;
// The chart's hover zones: the boxes laid over the Revenue & Dealer Profit chart, one per period.
const chartPoint = (n, what) => ({
  hover: `xpath=(//*[local-name()="svg"][.//*[local-name()="path"][@stroke="#7c3aed"]]/following-sibling::div)[${n}]`,
  label: `Point at the ${what} on the Revenue & Dealer Profit chart`,
});

const openSettings = {
  eval: `window.postMessage({ type: '__activate_edit_mode' }, '*')`, on: 'prototype',
  label: 'Open the prototype settings panel: in the browser console, run `window.postMessage({ type: "__activate_edit_mode" }, "*")`',
};
const closeSettings = { click: button('Close tweaks'), on: 'prototype', label: 'Close the settings panel (✕ at its top right)' };
const vueSettings = (props) => {
  const json = JSON.stringify(props).replace(/"/g, "'");
  return { eval: `window.__paritySetProps(${json})`, on: 'vue', label: `In the browser console, run \`__paritySetProps(${json})\`` };
};
const emptySwitch = {
  click: 'xpath=//*[normalize-space(text())="Overview empty state"]/ancestor::*[.//*[@role="switch"]][1]//*[@role="switch"]',
  on: 'prototype', label: 'In the settings panel, turn on "Overview empty state"',
};

// stores: filterA / filterB are two stores to tick in the All Stores filter; top is a Top Performing
// Stores row to open.
export const buildStates = ({ stores }) => [
  {
    name: 'overview', query: SIGNED_IN, steps: [
      { hover: button('Add Store') },
      { hover: ORDERS_CARD, label: 'Hover the Orders card' },
      { hover: 'div[title^="Open "] >> nth=0', label: 'Hover the first Frequently visited card' },
      { hover: `${button('Manage Store')} >> nth=0`, label: 'Hover its "Manage Store" button' },
      chartPoint(6, 'sixth month'),
      { hover: topRow(stores.top), label: `Hover ${stores.top} in Top Performing Stores` },
      { hover: `${button('Review')} >> nth=0`, label: 'Hover the first "Review" button in Roster Bank' },
    ],
  },
  {
    name: 'overview chart scale', query: SIGNED_IN, steps: [
      { click: button('Day') },
      chartPoint(10, 'tenth day'),
      { click: button('Year') },
      chartPoint(2, 'second year'),
      { click: button('Month') },
    ],
  },
  {
    name: 'overview store filter', query: SIGNED_IN, steps: [
      { click: button('All Stores') },
      { click: button(stores.filterA, false), label: `Tick ${stores.filterA} in the list` },
      { click: button(stores.filterB, false), label: `Tick ${stores.filterB} in the list` },
      { click: button('Clear') },
      { click: button(stores.filterA, false), label: `Tick ${stores.filterA} again` },
      { click: 'h1', label: 'Click the "Overview" heading: the list closes, and the page shows only that store' },
    ],
  },
  { name: 'overview search', query: SIGNED_IN, steps: [{ fill: [SEARCH, stores.filterA] }] },
  {
    name: 'overview leaderboard sort', query: SIGNED_IN, steps: [
      ...['Store', 'Store Created', 'Orders', 'Revenue', 'Avg. Order Value', '% of Total Rev.', 'Completion', 'Trend'].map(sortHead),
      { ...sortHead('Trend'), label: 'Click "Trend" again: the order flips' },
    ],
  },

  // ── Clicks that leave the Overview ──
  { name: 'overview open store from leaderboard', query: SIGNED_IN, steps: [{ click: topRow(stores.top), label: `Click ${stores.top} in Top Performing Stores` }] },
  { name: 'overview orders card', query: SIGNED_IN, steps: [{ click: ORDERS_CARD, label: 'Click the Orders card' }] },
  { name: 'overview frequently visited all stores', query: SIGNED_IN, steps: [{ click: `${button('All stores →')} >> nth=0`, label: 'Click "All stores →" next to Frequently visited' }] },
  { name: 'overview top stores all stores', query: SIGNED_IN, steps: [{ click: `${button('All stores →')} >> nth=1`, label: 'Click "All stores →" on Top Performing Stores' }] },
  { name: 'overview roster bank review', query: SIGNED_IN, steps: [{ click: `${button('Review')} >> nth=0`, label: 'Click the first "Review" button in Roster Bank' }] },
  { name: 'overview add store', query: SIGNED_IN, steps: [{ click: button('Add Store') }] },

  // ── Empty Overview (settings: "Overview empty state") ──
  {
    name: 'overview empty', query: SIGNED_IN, steps: [
      openSettings, emptySwitch, closeSettings, vueSettings({ overviewEmpty: true }),
      { hover: button('Add Store') },
      { click: `${button('Create a Store →')} >> nth=0`, label: 'Click "Create a Store →" in the banner' },
    ],
  },
];

export default {
  name: 'Workspace Overview (Module 2)',
  page: 'Workspace.dc.html',
  ready: 'h1',
  seedRandom: true,
  settleMs: 300, // the workspace is a large page: give it longer to finish rendering after each step
  viewports: [{ width: 1440, height: 900 }],
  related: [
    {
      name: "A store's page",
      where: 'ManageStoreWorkspace in workspace-app.jsx',
      how: 'A Top Performing Stores row, "Manage Store" on a Frequently visited card, and "Review" in Roster Bank open the store. Checked by workspace-store-home.mjs.',
    },
    {
      name: 'Store list',
      where: 'StoreList in workspace-app.jsx',
      how: 'Both "All stores →" links and "Create a Store →" (empty Overview) open the Stores tab. Not part of Module 2.',
    },
    {
      name: 'Cross-store Orders',
      where: 'OrdersOverview in workspace-app.jsx',
      how: 'The Orders card opens the All-Stores Orders page, with the header still on Overview. Not part of Module 2.',
    },
    {
      name: 'New store',
      where: 'the create flow in workspace-app.jsx',
      how: '"Add Store" opens the new store flow. Not part of Module 2.',
    },
  ],
  states: buildStates({ stores: { filterA: 'Rams', filterB: 'Honey Badgers', top: 'Wasatch Elite Lacrosse' } }),
};
