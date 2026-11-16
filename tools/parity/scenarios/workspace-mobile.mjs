// "Workspace Mobile.dc.html": the mobile web prototype of the workspace, shown in an iPhone frame.
// One page with a navigation stack of 39 screens: the workspace (Overview, Stores, Earnings, the account
// sheet, the create-store wizard) and a store's screens (Home, My Teams, Products, Orders, Reports,
// Settings). Links are `data-go` attributes: a screen id, "back", or "toast:<message>" for actions the
// prototype only acknowledges. Toasts fade out after 2.2 s.
//
// The `startScreen` setting picks the first screen; it takes effect on "Restart prototype".

const go = (target, label) => ({ click: `[data-go="${target}"]`, label });
const back = { click: '[data-go="back"]', label: 'Tap the back arrow at the top left' };
const toast = (message, label) => [go(`toast:${message}`, label), { wait: 2300 }];
const button = (name, exact = true) => (exact ? `role=button[name="${name}" s]` : `role=button[name=/${name.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')}/i]`);
const chart = 'xpath=//*[name()="svg" and @viewBox="0 0 361 220"]/..';
const menuItem = (name) => `xpath=//button[starts-with(normalize-space(.), "${name}")]`;

// Store screens open from a store on the Stores tab (the first store in the list).
const toStoreHome = [
  go('ws-stores', 'Tap "Stores" in the top tabs'),
  go('home', 'Tap the first store in the list'),
];
// Reports and Settings are on the store's "More" screen.
const toStoreMore = [...toStoreHome, go('more', 'Tap "More" in the tab bar')];
const toStoreSettings = [...toStoreMore, go('settings', 'Tap "Settings"')];

export default {
  name: 'Workspace Mobile',
  page: 'Workspace Mobile.dc.html',
  ready: '[data-screen-label]',
  settleMs: 300,
  viewports: [{ width: 1440, height: 900 }],
  related: [
    {
      name: 'Desktop workspace',
      where: 'Workspace.dc.html',
      how: 'The mobile prototype mirrors the desktop workspace and never links to it. Actions it leaves to desktop show a toast ("Desktop only", "Not in this prototype").',
    },
    {
      name: 'Mobile design notes',
      where: 'reference/Workspace Mobile Mapping.dc.html',
      how: 'The design document behind this prototype (navigation models, page patterns, foundations spec). Open it directly.',
    },
  ],
  states: [
    // ── Workspace ──
    {
      name: 'overview', steps: [
        { hover: chart, label: 'Hover over the revenue chart' },
        { click: button('Day'), label: 'Tap "Day" above the chart' },
        { hover: chart, label: 'Hover over the revenue chart' },
        { click: button('Year'), label: 'Tap "Year"' },
        { click: button('Month'), label: 'Tap "Month"' },
        { click: 'xpath=//button[normalize-space(.)="More"]', label: 'Tap "More" under the chart description' },
      ],
    },
    {
      name: 'overview search', steps: [
        { click: button('Search Team Stores'), label: 'Tap the search icon' },
        { fill: ['input[placeholder="Search Team Stores"]', 'jazz'] },
        { fill: ['input[placeholder="Search Team Stores"]', 'zzz'] },
        { click: button('Cancel'), label: 'Tap "Cancel"' },
      ],
    },
    {
      name: 'overview store filter', steps: [
        { click: button('All Stores', false), label: 'Tap "All Stores"' },
        ...toast('Scoping stays on desktop in this prototype', 'Tap the first store in the menu'),
      ],
    },
    {
      name: 'overview sort', steps: [
        { click: button('Sort by', false), label: 'Tap "Sort by Revenue" on Top Performing Stores' },
        { click: menuItem('Orders'), label: 'Pick "Orders"' },
        { click: button('Sort by', false), label: 'Tap "Sort by Orders"' },
        { click: menuItem('Trend'), label: 'Pick "Trend"' },
        { click: button('Sort by', false), label: 'Tap "Sort by Trend"' },
        { click: '[data-screen-label="ws-overview"] h1', label: 'Tap outside the menu to close it' },
      ],
    },
    { name: 'stores tab', steps: [go('ws-stores', 'Tap "Stores" in the top tabs'), go('ws-overview', 'Tap "Overview" in the top tabs')] },
    { name: 'earnings tab', steps: [go('ws-earnings', 'Tap "Earnings" in the top tabs')] },
    {
      name: 'account sheet', steps: [
        go('ws-account', 'Tap the account avatar (HM)'),
        go('ws-vault', 'Tap "Stock Vault"'),
        back,
        go('ws-settings', 'Tap "Workspace Settings"'),
        back,
        ...toast('Logged out', 'Tap "Logout"'),
      ],
    },
    {
      name: 'create store wizard', steps: [
        go('wiz1', 'Tap "Add Store"'),
        go('wiz2', 'Tap "Continue to Divisions & Teams"'),
        { click: 'xpath=//*[@data-go="wiz3" and not(normalize-space(.)="Skip")]', label: 'Tap "Continue to Add Products"' },
        go('wiz4', 'Tap "Continue to Review"'),
        go('home-draft', 'Tap "Deploy as Draft"'),
      ],
    },
    {
      name: 'create store wizard skip', steps: [
        go('wiz1', 'Tap "Add Store"'),
        go('wiz2', 'Tap "Continue to Divisions & Teams"'),
        { click: 'xpath=//*[@data-go="wiz3" and normalize-space(.)="Skip"]', label: 'Tap "Skip"' },
      ],
    },

    // ── A store ──
    { name: 'store home', steps: [...toStoreMore, back] },
    { name: 'draft store', steps: [go('ws-stores', 'Tap "Stores" in the top tabs'), go('home-draft', 'Tap the draft store (Rams)')] },
    {
      name: 'my teams', steps: [
        ...toStoreHome,
        go('teams', 'Tap "My Teams"'),
        go('team-group', 'Tap the first division'),
        go('roster', 'Tap the first roster'),
        go('player', 'Tap the first player'),
        back,
        go('bank', 'Tap the Roster Bank row'),
        ...toast('2 players added', 'Tap "Add 2 to …"'),
      ],
    },
    { name: 'products', steps: [...toStoreHome, go('products', 'Tap "Products"'), go('product', 'Tap the first product')] },
    {
      name: 'orders', steps: [
        ...toStoreHome,
        go('orders', 'Tap "Orders"'),
        go('order', 'Tap the first order'),
        back,
        go('orders-pending', 'Tap the pending orders row'),
        go('submit-sheet', 'Tap "Submit" on a division'),
        ...toast('Submitted to factory', 'Tap "Submit to factory"'),
      ],
    },
    {
      name: 'reports', steps: [
        ...toStoreMore,
        go('reports', 'Tap "Reports"'),
        go('reports-need', 'Tap "Players ordered"'),
        ...toast('Reminders sent', 'Tap "Remind" on the first player'),
        back,
        go('reports-teams', 'Tap "Close report · May window"'),
        go('reports-drill', 'Tap the first team'),
      ],
    },
    {
      name: 'store settings', steps: [
        ...toStoreSettings,
        go('set-general', 'Tap "General"'),
        go('set-edit', 'Tap "Edit Store Name"'),
        back,
        back,
        go('set-codes', 'Tap "Store Codes"'),
        go('set-code', 'Tap the first code'),
      ],
    },
    {
      name: 'store settings schedule', steps: [
        ...toStoreSettings,
        go('set-schedule', 'Tap "Schedule & Status"'),
        go('close-sheet', 'Tap "Close Store"'),
        ...toast('Store closed', 'Tap "Close Store" in the sheet'),
      ],
    },
    {
      name: 'store settings team and people', steps: [
        ...toStoreSettings,
        go('set-team', 'Tap "Team & Roster"'),
        back,
        go('set-custom', 'Tap "Store Customization & Design"'),
        back,
        go('set-people', 'Tap "People & Access"'),
        ...toast('Invite sent', 'Tap "Send Invite"'),
        back,
        go('set-dist', 'Tap "Distribution"'),
        ...toast('Manager assigned', 'Tap "Assign"'),
      ],
    },

    // ── The startScreen setting (takes effect on "Restart prototype") ──
    { name: 'start screen stores', props: { startScreen: 'ws-stores' }, steps: [{ click: button('Restart prototype'), label: 'Click "Restart prototype" under the phone' }] },
    { name: 'start screen store home', props: { startScreen: 'home' }, steps: [{ click: button('Restart prototype'), label: 'Click "Restart prototype" under the phone' }] },
    { name: 'start screen store settings', props: { startScreen: 'settings' }, steps: [{ click: button('Restart prototype'), label: 'Click "Restart prototype" under the phone' }, back] },
  ],
};
