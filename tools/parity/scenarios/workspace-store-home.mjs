// A store's own page in the workspace ("Workspace.dc.html" → workspace-app.jsx): the store top bar,
// the side menu, the Home tab, and the two setup guides: the single-page "How your store comes
// together" (StoreGuideModal, opens the first time any store is opened) and the Store Setup Guide
// (7 cards for a league store, 6 for an individual store; opens from "Setup guide", and by itself on
// a draft store not opened before).
//
// Stores are opened from the Overview's "Frequently visited" shelf, which the Module 1 step already
// converted. The other store tabs (My Teams, Products, Orders, Reports, Settings) and "Back to
// Stores" lead to screens outside this step, so the states only hover them.
// Timers are frozen: the guide's cards fade in after 20 ms, and the auto-opening guide waits 400 ms,
// so those steps are followed by a `wait`.
// The same states run on the integrated page in marucci-workspace-store-home.mjs.

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
const button = (name, exact = true) => (exact ? `role=button[name="${name}" s]` : `role=button[name=/${escapeRegex(name)}/i]`);

const SIGNED_IN = '?brand=prolook&auth=native-connected'; // signed in, welcome pop-up already seen

const manageStore = (name) => ({
  click: `xpath=//*[normalize-space(text())="${name}"]/ancestor::*[count(.//button[normalize-space(.)="Manage Store"])=1][1]//button[normalize-space(.)="Manage Store"]`,
  label: `On the Overview, click "Manage Store" on ${name} (Frequently visited)`,
});
const gotIt = { click: button('Got it'), label: 'Close the "How your store comes together" guide that opens with the store (Got it)' };
const fade = { wait: 30, label: 'Wait for the card to fade in' };
const openSetupGuide = [{ click: button('Setup guide'), label: 'Click "Setup guide" at the top right' }, fade];
const openMyAccount = (account) => [
  { hover: button(account), label: `Hover the account button (${account.split(' ').map((w) => w[0]).join('')}) at the top right` },
  { click: 'role=menuitem[name="My Account" s]', label: 'Click "My Account" in the menu' },
];

// stores: the sample stores each state opens. leagueRich: an open league store with divisions;
// leagueEmpty: an open league store with no teams (the screenshot); team: an open individual store;
// draftTeam / draftLeague: draft stores (null when the page has none). account: the signed-in rep.
export const buildStates = ({ account, stores }) => [
  // ── Home tab ──
  {
    name: 'store home league', query: SIGNED_IN, steps: [
      manageStore(stores.leagueRich),
      { hover: button('Got it') },
      gotIt,
      { hover: button('Back to Stores', false) },
      { hover: button('Setup guide') },
      { hover: button('Preview Store', false) },
      { hover: button('Products') },
      { hover: button('Add manager') },
      { click: button('Copy') },
      { wait: 1500, label: 'Wait 1.5 s: "Copied" changes back to "Copy"' },
    ],
  },
  { name: 'store home without teams', query: SIGNED_IN, steps: [manageStore(stores.leagueEmpty), gotIt] },
  ...(!stores.team ? [] : [{ name: 'store home individual', query: SIGNED_IN, steps: [manageStore(stores.team), gotIt, { hover: button('My Team') }] }]),
  ...(!stores.draftTeam ? [] : [{
    name: 'store home draft', query: SIGNED_IN, steps: [
      manageStore(stores.draftTeam),
      gotIt,
      { wait: 400, label: 'Wait 0.4 s: the Store Setup Guide opens by itself on a draft store' },
      fade,
      { click: button('Skip to workspace') },
    ],
  }]),
  ...(!stores.draftLeague ? [] : [{
    name: 'store home draft league', query: SIGNED_IN, steps: [
      manageStore(stores.draftLeague),
      gotIt,
      { wait: 400, label: 'Wait 0.4 s: the Store Setup Guide opens by itself on a draft store' },
      fade,
      { click: button('Close guide') },
    ],
  }]),
  {
    name: 'store home archived', query: SIGNED_IN, steps: [
      ...openMyAccount(account),
      { click: `${button('Manage Store')} >> nth=0`, label: 'Click "Manage Store" on the first archived store' },
      gotIt,
      { hover: button('Storefront Closed', false) },
    ],
  },
  { name: 'store guide close', query: SIGNED_IN, steps: [manageStore(stores.leagueEmpty), { hover: button('Close') }, { click: button('Close') }] },
  { name: 'preview store', query: SIGNED_IN, steps: [manageStore(stores.leagueEmpty), gotIt, { click: button('Preview Store', false) }] },

  // ── Store Setup Guide ──
  {
    name: 'setup guide league', query: SIGNED_IN, steps: [
      manageStore(stores.leagueEmpty),
      gotIt,
      ...openSetupGuide,
      { hover: button('Skip to workspace') },
      { hover: button('Next', false) },
      ...Array.from({ length: 6 }, (_, i) => [{ click: button('Next', false), label: `Click "Next" (card ${i + 2} of 7)` }, fade]).flat(),
      { hover: `${button('Done')} >> nth=1`, label: 'Hover the black "Done" button' },
      { click: button('Back') },
      fade,
      { click: button('Jump to end') },
      fade,
      { click: button('Card 3'), label: 'Click the third segment of the progress bar' },
      fade,
      { click: 'text="How a product reaches the storefront."', label: 'Click the card itself: it moves to the next card' },
      fade,
      { click: `${button('Done')} >> nth=0`, label: 'Click "Done" (the plain one, next to Next)' },
    ],
  },
  {
    name: 'setup guide keyboard', query: SIGNED_IN, steps: [
      manageStore(stores.team || stores.leagueRich),
      gotIt,
      { click: 'text="Reopen the setup guide"', label: 'Click "Reopen the setup guide" at the bottom of the right column' },
      fade,
      { press: 'ArrowRight' }, fade,
      { press: 'Enter' }, fade,
      { press: ' ', label: 'Press the space bar' }, fade,
      { press: 'ArrowLeft' }, fade,
      { press: 'Escape' },
    ],
  },
  {
    // The settings panel's "▶ Open · Individual (6 cards)" sends the same event the "Setup guide" button sends.
    name: 'setup guide individual on a league store', query: SIGNED_IN, steps: [
      manageStore(stores.leagueEmpty),
      gotIt,
      {
        eval: `window.dispatchEvent(new CustomEvent("setupguide:open", { detail: { storeType: "single" } }))`,
        label: 'Open the 6-card version: in the browser console, run `window.dispatchEvent(new CustomEvent("setupguide:open", { detail: { storeType: "single" } }))`',
      },
      fade,
      { click: button('Jump to end') },
      fade,
      { click: `${button('Done')} >> nth=1`, label: 'Click the black "Done" button' },
    ],
  },
];

export default {
  name: 'Workspace store page',
  page: 'Workspace.dc.html',
  ready: 'h1',
  seedRandom: true,
  settleMs: 300, // the workspace is a large page: give it longer to finish rendering after each step
  viewports: [{ width: 1440, height: 900 }],
  related: [
    {
      name: 'Other store tabs and the store list',
      where: 'Dashboard, StoreList in workspace-app.jsx',
      how: 'The side menu (My Teams, Products, Orders, Reports, Settings), the Home tab\'s cards and links, and "Back to Stores" open screens outside this step. Open a store from the Overview ("Manage Store" under Frequently visited) and click them there.',
    },
    {
      name: 'Storefront preview',
      where: 'Team Store Storefront.dc.html',
      how: '"Preview Store" redirects to "Team Store Storefront.dc.html", which does not exist in the handover (404). The storefront prototype is Storefront.html.',
    },
  ],
  states: buildStates({
    account: 'Hingle McCringleberry',
    stores: { leagueRich: 'Jazz Bantum Boys Basketball', leagueEmpty: 'Bayshore Summer Classic', team: 'Rams', draftTeam: 'Honey Badgers', draftLeague: 'Wasatch Elite Lacrosse' },
  }),
};
