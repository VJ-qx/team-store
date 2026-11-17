// Module 2, responsive: the workspace's Overview below 744px, which shows the mobile design from
// "Workspace Mobile.dc.html" (its ws-overview screen) instead of the desktop Overview.
//
// Side A is the mobile prototype, which draws the app inside an iPhone frame on a desktop page; side B is
// the Vue workspace (workspace.html) at the frame's size, 393 × 852, where the app fills the window. Only
// the app area (.wm-app) is compared: its accessibility tree, its fields and a screenshot of its box. A
// prototype-only setup step hides what the frame draws over the app (the island, status bar and home
// indicator) and squares its corners, as on a phone browser.
// The Overview's numbers are the prototype's sample data on both sides.
// Links into the mobile app's other screens (Stores, Earnings, the account sheet, Add Store, a store) are
// not converted yet: see `related`.

const button = (name, exact = true) => (exact ? `role=button[name="${name}" s]` : `role=button[name=/${name.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')}/i]`);
const chart = 'xpath=//*[name()="svg" and @viewBox="0 0 361 220"]/..';
const menuItem = (name) => `xpath=//button[starts-with(normalize-space(.), "${name}")]`;
const toast = (target, label) => [{ click: `[data-go="${target}"] >> nth=0`, label }, { wait: 2300, label: 'Wait 2.3 s for the message to fade' }];

export default {
  name: 'Workspace Overview, mobile (Module 2, below 744px)',
  page: 'Workspace Mobile.dc.html',
  ready: '[data-screen-label]',
  settleMs: 300,
  scope: '.wm-app',
  // The prototype's frame needs a desktop-size page; the Vue workspace opens at the frame's inner size.
  // 1441 wide puts the centred 393px frame on whole pixels (at 1440 its box starts at x = 523.5).
  viewports: [{ width: 1441, height: 1000, b: { width: 393, height: 852 } }],
  setup: [{
    on: 'prototype',
    eval: `(() => { const f = document.querySelector('[data-om-starter="ios-frame"]'); if (!f) return; f.style.borderRadius = '0'; for (const c of f.children) if (getComputedStyle(c).position === 'absolute') c.style.display = 'none'; })()`,
    label: 'Prototype only: hide what the iPhone frame draws over the app (island, status bar, home indicator) and square its corners',
  }, {
    on: 'vue',
    eval: `(() => { localStorage.clear(); sessionStorage.clear(); })()`,
    label: 'Vue only: clear what the workspace saves when it loads (its created stores and the welcome flag): the desktop app\'s, not the mobile screen\'s',
  }],
  related: [
    {
      name: 'The desktop Overview',
      where: 'OverviewDashboard (workspace-app.jsx), checked by workspace-overview.mjs',
      how: 'At 744px and up the workspace shows it, unchanged. Open workspace.html in a wide window.',
    },
    {
      name: "The mobile app's other screens",
      where: 'Workspace Mobile.dc.html (ws-stores, ws-earnings, ws-account, wiz1, home, orders, reports, settings …)',
      how: 'Stores, Earnings, the HM account sheet, Add Store, a store card, the attention cards, Orders and the Roster Bank rows open them in the prototype. Not converted yet: in Vue those taps do nothing. They come with their modules.',
    },
    {
      name: 'Mobile design notes',
      where: 'reference/Workspace Mobile Mapping.dc.html',
      how: 'Breakpoints, navigation model and open questions behind the mobile prototype. Open it directly.',
    },
  ],
  states: [
    {
      name: 'mobile overview', query: '?brand=prolook&auth=native-connected', steps: [
        { hover: chart, label: 'Hover over the revenue chart' },
        { click: button('Day'), label: 'Tap "Day" above the chart' },
        { hover: chart, label: 'Hover over the revenue chart' },
        { click: button('Year'), label: 'Tap "Year"' },
        { click: button('Month'), label: 'Tap "Month"' },
        { click: 'xpath=//button[normalize-space(.)="More"]', label: 'Tap "More" under the chart description' },
        { click: 'xpath=//button[normalize-space(.)="Less"]', label: 'Tap "Less"' },
      ],
    },
    {
      name: 'mobile overview search', query: '?brand=prolook&auth=native-connected', steps: [
        { click: button('Search Team Stores'), label: 'Tap the search icon' },
        { fill: ['input[placeholder="Search Team Stores"]', 'jazz'] },
        { fill: ['input[placeholder="Search Team Stores"]', 'zzz'] },
        { click: button('Cancel'), label: 'Tap "Cancel"' },
      ],
    },
    {
      name: 'mobile overview store filter', query: '?brand=prolook&auth=native-connected', steps: [
        { click: button('All Stores', false), label: 'Tap "All Stores"' },
        ...toast('toast:Scoping stays on desktop in this prototype', 'Tap the first store in the menu: a message'),
      ],
    },
    {
      name: 'mobile overview sort', query: '?brand=prolook&auth=native-connected', steps: [
        { click: button('Sort by', false), label: 'Tap "Sort by Revenue" on Top Performing Stores' },
        { click: menuItem('Orders'), label: 'Pick "Orders"' },
        { click: button('Sort by', false), label: 'Tap "Sort by Orders"' },
        { click: menuItem('Trend'), label: 'Pick "Trend"' },
        { click: button('Sort by', false), label: 'Tap "Sort by Trend"' },
        { click: '[data-screen-label="ws-overview"] h1', label: 'Tap outside the menu to close it' },
      ],
    },
    {
      name: 'mobile overview store menu', query: '?brand=prolook&auth=native-connected', steps: [
        ...toast('toast:Store menu is desktop-only here', 'Tap ⋯ on the first Frequently Visited card: a message'),
      ],
    },
  ],
};
