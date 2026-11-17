// Module 3: the Add Store wizard ("Workspace.dc.html" → workspace-app.jsx, CreateForm), BRD M-3.0 FR-3.1,
// part 2c: the last step, Review & Deploy (Step6Review): the setup summary (SummaryRowWiz), the products
// added (ReviewProducts, with "Edit products"), the managers, a League store's Divisions & Teams, and SAVE
// AND CONTINUE, which shows "Creating your store…" (LoadingOverlay) and opens the new store.
// Not reachable: the "Before this store can deploy" and Connected Team panels (UatReviewExtras), and
// ReviewProducts' "Products from …" note and remove buttons. They need a store started from another store
// (_dupSource), which the wizard drops (a prototype bug kept in part 2a).
// Parts 2a (the frame and Basics) and 2b (Add Products) are in workspace-create-store.mjs and
// workspace-create-store-products.mjs.
//
// Review & Deploy is Step 3 of 3 for an Individual store, Step 4 of 4 for a League store.
// The wizard scrolls up smoothly after a step change; states make scrolling instant first, so both sides
// are captured at rest.
// The same states run on the integrated page in marucci-workspace-create-store-review.mjs.
//
// Known difference in the Vue step (behavior mode), left for later (2026-11-17). Every checkpoint on Review
// & Deploy and "Creating your store…" matches; 2 of 114 differ on both workspaces, in a screen the Vue app
// doesn't have yet. ("review league" matches since Divisions & Teams was converted.)
// - "review save": after SAVE AND CONTINUE the new store opens on its Products tab, which isn't converted
//   yet (Vue shows the store page without the tab's contents). The store itself, the message and the Store
//   Setup Guide match.

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
const button = (name, exact = true) => (exact ? `role=button[name="${name}" s]` : `role=button[name=/${escapeRegex(name)}/i]`);
const startsWith = (name) => `role=button[name=/^${escapeRegex(name)}/]`;

const SIGNED_IN = '?brand=prolook&auth=native-connected'; // signed in, welcome pop-up already seen
const field = (placeholder, nth = 0) => `input[placeholder="${placeholder}"] >> nth=${nth}`;
const toggle = (title) => ({ click: `xpath=//div[normalize-space(text())="${title}"]/../../button`, label: `Click the "${title}" toggle` });
const instantScroll = {
  eval: `(() => { const st = document.createElement('style'); st.textContent = '*{scroll-behavior:auto!important}'; document.head.appendChild(st); for (const t of [window, Element.prototype]) for (const m of ['scrollTo', 'scroll', 'scrollBy']) { const o = t[m]; if (!o) continue; t[m] = function (a, b) { return o.call(this, a && typeof a === 'object' ? { ...a, behavior: 'instant' } : a, b); }; } const siv = Element.prototype.scrollIntoView; Element.prototype.scrollIntoView = function (a) { return siv.call(this, a && typeof a === 'object' ? { ...a, behavior: 'instant' } : a); }; })()`,
  label: 'In the browser console, make scrolling instant (the wizard scrolls smoothly after a step change)',
};
const cont = { click: 'role=button[name=/CONTINUE/]', label: 'Click CONTINUE at the bottom right' };

// Basics: store type, name, schedule, the Team Manager's contact as point of contact.
const basicsStart = (type) => [
  { click: button('Add Store'), label: 'Click "Add Store" at the top right of the Overview' },
  instantScroll,
  { click: startsWith(type), label: `Click "${type}"` },
  { fill: ['role=textbox[name="Store Name" s]', 'Coastal Hawks'], label: 'Type "Coastal Hawks" in Store Name' },
  { click: startsWith('Always-On Locker'), label: 'Click "Always-On Locker"' },
  { fill: [field('name@example.com'), 'coach@hawks.org'], label: "Type an email in the Team Manager's Email" },
  { fill: [field('111-000-3243'), '8015550142'], label: "Type a phone number in the Team Manager's Phone Number" },
  { click: startsWith('Team Manager Email'), label: 'Click "Team Manager Email" under Store Point of Contact' },
  { click: startsWith('Team Manager Phone'), label: 'Click "Team Manager Phone"' },
];
// The rest of Basics as the Add Products scenario fills it: Direct-To-Home, no sales tax.
const basicsEnd = [
  { click: startsWith('Direct-To-Home'), label: 'Click "Direct-To-Home Residential Delivery"' },
  toggle('Collect Sales Tax'),
];
// Individual store: Basics → Add Products → Review & Deploy.
const toProducts = [...basicsStart('Individual Team Store'), ...basicsEnd, { ...cont, label: 'Click CONTINUE: Step 2, Add Products' }];
const toReview = { ...cont, label: 'Click CONTINUE: Review & Deploy' };

const cardAdd = (n = 1) => `xpath=(//button[normalize-space(.)="Add to Store" and not(@data-tour)])[${n}]`;
const confirmBtn = '[data-tour="sizes-modal-confirm"]';
const categorySelect = 'xpath=//label[starts-with(normalize-space(.),"Category")]/following-sibling::select';
const popupClose = { wait: 200, label: 'Wait 0.2 s for the pop-up to close' };
// Adds the first saved design to the store (a product needs a category first).
const addDesign = [
  { click: cardAdd(1), label: 'Click "Add to Store" on the first saved design' },
  { select: [categorySelect, '__add_new__'], label: 'Under Category, choose "+ Add new category…"' },
  { fill: [field('New category name'), 'Jerseys'], label: 'Type "Jerseys"' },
  { press: 'Enter', label: 'Press Enter: the category is created and chosen' },
  { click: confirmBtn, label: 'Click "Add to Store"' },
  popupClose,
];

export const buildStates = () => [
  {
    name: 'review', query: SIGNED_IN, steps: [
      ...toProducts, toReview,
    ],
  },
  {
    name: 'review details', query: SIGNED_IN, steps: [
      ...basicsStart('Individual Team Store'),
      { click: button('Connect to Team'), label: 'Click "Connect to Team": the Team Database opens' },
      { click: `${button('Select')} >> nth=1`, label: 'Click "Select" on the second team: its logo, colors and sports come in' },
      { click: 'role=button[name=/Add another manager/]', label: 'Click "Add another manager"' },
      { fill: [field('Alex'), 'Alex'], label: 'Type "Alex" in the new manager\'s First Name' },
      { click: startsWith('Ship to Team Manager'), label: 'Click "Ship to Team Manager"' },
      { click: button('Saved pick-up location') },
      { click: 'xpath=//button[normalize-space(.)="Saved pick-up location"]/../following-sibling::div[1]/button[1]', label: 'Click the first saved pick-up location' },
      { click: field('Search by state or abbreviation'), label: 'Click the sales tax State box: the list opens' },
      { type: [field('Search by state or abbreviation'), 'cal'], label: 'Type "cal"' },
      { click: startsWith('California'), label: 'Click California: the tax rate fills in' },
      { click: 'xpath=//span[starts-with(normalize-space(.), "I acknowledge I am the taxing entity")]/preceding-sibling::span', label: 'Tick the box of the tax liability agreement' },
      { ...cont, label: 'Click CONTINUE: Step 2, Add Products' },
      toReview,
    ],
  },
  {
    name: 'review products', query: SIGNED_IN, steps: [
      ...toProducts,
      ...addDesign,
      toReview,
      { hover: button('Edit products'), label: 'Hover "Edit products" (to the right of "1 product")' },
      { click: button('Edit products'), label: 'Click "Edit products": back to Add Products' },
      toReview,
    ],
  },
  {
    name: 'review league', query: SIGNED_IN, steps: [
      ...basicsStart('League Store'), ...basicsEnd,
      { ...cont, label: 'Click CONTINUE: Step 2, Divisions & Teams' },
      { click: `${button('New Team')} >> nth=0`, label: 'Click "New Team": the league has a team' },
      { ...cont, label: 'Click CONTINUE: Step 3, Add Products' },
      { ...cont, label: 'Click CONTINUE: Step 4, Review & Deploy (League Managers, Divisions & Teams)' },
    ],
  },
  {
    name: 'review ship-to not set', query: SIGNED_IN, steps: [
      ...basicsStart('Individual Team Store'),
      { click: startsWith('Ship to Team Manager'), label: 'Click "Ship to Team Manager" and leave the address empty' },
      toggle('Collect Sales Tax'),
      { ...cont, label: 'Click CONTINUE: Step 2, Add Products' },
      { ...toReview, label: 'Click CONTINUE: Review & Deploy shows the Ship-To Address as not set' },
    ],
  },
  {
    name: 'review save', query: SIGNED_IN, steps: [
      ...toProducts,
      ...addDesign,
      toReview,
      { hover: startsWith('SAVE AND CONTINUE'), label: 'Hover "SAVE AND CONTINUE"' },
      { click: startsWith('SAVE AND CONTINUE'), label: 'Click "SAVE AND CONTINUE": "Creating your store…"' },
      { wait: 1800, label: 'Wait 1.8 s: the new store opens on its Products tab, with a message' },
      { wait: 2400, label: 'Wait 2.4 s for the message to go' },
    ],
  },
];

export default {
  name: 'Workspace Add Store wizard: Review & Deploy (Module 3)',
  page: 'Workspace.dc.html',
  ready: 'h1',
  seedRandom: true,
  settleMs: 300, // the workspace is a large page: give it longer to finish rendering after each step
  // As in the Add Products scenario: Configure & Add to Store's settings scroll inside a 64vh box, which the
  // full-page screenshot moved differently on each side; at 1800 px high it doesn't scroll.
  viewports: [{ width: 1440, height: 1800 }],
  related: [
    {
      name: 'The wizard frame and Basics',
      where: 'CreateForm and Step1Basics in workspace-app.jsx',
      how: 'Part 2a, checked by workspace-create-store.mjs. The states go through Basics to reach Review & Deploy.',
    },
    {
      name: 'Add Products',
      where: 'Step3Products in workspace-app.jsx',
      how: 'Part 2b, checked by workspace-create-store-products.mjs. "Edit products" on Review & Deploy goes back to it.',
    },
    {
      name: 'Divisions & Teams',
      where: 'Step2Structure in workspace-app.jsx',
      how: 'Step 2 of a League store; "New Team" adds the team the review lists. Part 2d.',
    },
    {
      name: 'The new store',
      where: 'handleFormSubmit and finalizeStore in workspace-app.jsx (App), ManageStoreWorkspace',
      how: 'SAVE AND CONTINUE creates the store and opens it: on its Products tab when it has products, otherwise on General, with a message. Those tabs aren\'t converted yet.',
    },
    {
      name: 'Before this store can deploy / Connected Team, and removing a product',
      where: 'UatReviewExtras and ReviewProducts (onRemove) in workspace-app.jsx',
      how: 'Not reachable: they need a store started from another store (_dupSource), which the wizard drops (part 2a\'s kept bug).',
    },
  ],
  states: buildStates(),
};
