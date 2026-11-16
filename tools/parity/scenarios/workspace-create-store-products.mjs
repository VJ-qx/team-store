// Module 3: the Add Store wizard ("Workspace.dc.html" → workspace-app.jsx, CreateForm), BRD M-3.0 FR-3.1,
// part 2b: Step 3, Add Products (Step3Products): the source pill, the product browser (Customizer saved
// designs and carts, Stock Vault, Catalog Templates, other stores; search), a product card (add, edit,
// template rename and delete), the Stock Vault offer pop-up, the per-item Configure & Add pop-up
// (category, storefront flags, price settings, application sizes, several items from a cart, Assign to
// Teams on a League store with teams), and Customize New Product's four steps.
// Not reachable: the "Remove from store?" pop-up (the card takes onRemove but shows no remove button).
// Part 2a (the frame and Basics) is in workspace-create-store.mjs.
//
// Add Products is Step 2 of 3 for an Individual store, which the states use; Step 3 of 4 for a League
// store, after Divisions & Teams, where "New Team" adds the team Assign to Teams needs.
// The wizard scrolls up smoothly after a step change; states make scrolling instant first, so both sides
// are captured at rest.
// The same states run on the integrated page in marucci-workspace-create-store-products.mjs.

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
// Basics filled in for an Individual or League store, then on to the next step.
const basics = (type) => [
  { click: button('Add Store'), label: 'Click "Add Store" at the top right of the Overview' },
  instantScroll,
  { click: startsWith(type), label: `Click "${type}"` },
  { fill: ['role=textbox[name="Store Name" s]', 'Coastal Hawks'], label: 'Type "Coastal Hawks" in Store Name' },
  { click: startsWith('Always-On Locker'), label: 'Click "Always-On Locker"' },
  { fill: [field('name@example.com'), 'coach@hawks.org'], label: "Type an email in the Team Manager's Email" },
  { fill: [field('111-000-3243'), '8015550142'], label: "Type a phone number in the Team Manager's Phone Number" },
  { click: startsWith('Team Manager Email'), label: 'Click "Team Manager Email" under Store Point of Contact' },
  { click: startsWith('Team Manager Phone'), label: 'Click "Team Manager Phone"' },
  { click: startsWith('Direct-To-Home'), label: 'Click "Direct-To-Home Residential Delivery"' },
  toggle('Collect Sales Tax'),
];
const toProducts = [...basics('Individual Team Store'), { ...cont, label: 'Click CONTINUE: Step 2, Add Products' }];
const toProductsLeague = [
  ...basics('League Store'), { ...cont, label: 'Click CONTINUE: Step 2, Divisions & Teams' },
  { click: `${button('New Team')} >> nth=0`, label: 'Click "New Team": the league has a team' },
  { ...cont, label: 'Click CONTINUE: Step 3, Add Products' },
];

// A source chip ("All sources", "Customizer", …) and a sub-tab under it.
const chip = (label) => ({ click: startsWith(label), label: `Click the "${label}" source` });
const subTab = (label) => ({ click: button(label), label: `Click "${label}"` });
// The n-th "Add to Store" on a product card (the pop-up's own button has data-tour).
const cardAdd = (n = 1) => `xpath=(//button[normalize-space(.)="Add to Store" and not(@data-tour)])[${n}]`;
const confirmBtn = '[data-tour="sizes-modal-confirm"]';
const categorySelect = 'xpath=//label[starts-with(normalize-space(.),"Category")]/following-sibling::select';
const flag = (label) => ({ click: `xpath=//span[normalize-space(text())="${label}"]/following-sibling::button`, label: `Click the "${label}" switch` });
// Adds a new category from the Category list, which a product needs before it can be added.
const newCategory = (name) => [
  { select: [categorySelect, '__add_new__'], label: 'Under Category, choose "+ Add new category…"' },
  { fill: [field('New category name'), name], label: `Type "${name}"` },
  { press: 'Enter', label: 'Press Enter: the category is created and chosen' },
];
const popupClose = { wait: 200, label: 'Wait 0.2 s for the pop-up to close' };
// A button inside Customize New Product (the cards behind it have their own "Add to Store").
const custButton = (label) => `xpath=//h3[normalize-space(text())="Customize New Product"]/../..//button[normalize-space(.)="${label}"]`;

// sourceOption: which brand to pick in the Source pill; sport: a sport in Customize New Product; vaultAuto: whether
// Stock Vault items are auto-added to the store (the integrated workspace), so their cards show Remove / Add back.
export const buildStates = ({ sourceOption = 1, sport = 'Basketball', vaultAuto = false } = {}) => [
  {
    name: 'products', query: SIGNED_IN, steps: [
      ...toProducts,
      { hover: startsWith('Customize New Product'), label: 'Hover "Customize New Product"' },
      { hover: cardAdd(1), label: 'Hover the first card\'s "Add to Store"' },
    ],
  },
  {
    name: 'products sources', query: SIGNED_IN, steps: [
      ...toProducts,
      chip('Customizer'), subTab('Saved Carts'), subTab('Saved Designs'),
      chip('Stock Vault'), subTab('Sideline Stock'),
      chip('Catalog Templates'),
      chip('Other stores'),
      chip('All sources'),
      { fill: [field('Search all sources — designs, carts, vault blanks, templates, other stores'), 'zzz'], label: 'Type "zzz" in the search: nothing matches' },
      { fill: [field('Search all sources — designs, carts, vault blanks, templates, other stores'), 'hoodie'], label: 'Replace it with "hoodie"' },
    ],
  },
  {
    name: 'products source pill', query: SIGNED_IN, steps: [
      ...toProducts,
      { click: startsWith('Source'), label: 'Click the Source pill: the brands list opens' },
      { hover: `role=option >> nth=${sourceOption}`, label: `Hover brand ${sourceOption + 1} in the list` },
      { click: `role=option >> nth=${sourceOption}`, label: `Click brand ${sourceOption + 1}` },
    ],
  },
  {
    name: 'products configure', query: SIGNED_IN, steps: [
      ...toProducts,
      { click: cardAdd(1), label: 'Click "Add to Store" on the first saved design: Configure & Add to Store opens' },
      { click: confirmBtn, label: 'Click "Add to Store" in the pop-up without a category: the category error shows' },
      ...newCategory('Jerseys'),
      { click: `${button('%')} >> nth=0`, label: 'Under Price settings, click "%"' },
      flag('Required for players'),
      flag('Opt-out allowed'),
      flag('Paid by the team'),
      flag('Shown in store'),
      { click: `${button('AS SHOWN')} >> nth=0`, label: 'Click the first ADULT size ("AS SHOWN"): its list opens' },
      { click: 'xpath=(//div[normalize-space(text())="M"])[1]', label: 'Click "M"' },
      { fill: ['textarea[placeholder="Notes Here"] >> nth=0', 'Front only'], label: 'Type a note in the first row' },
      { click: confirmBtn, label: 'Click "Add to Store": the card shows "In Store" and a message' },
      popupClose,
      { wait: 3000, label: 'Wait 3 s for the message to go' },
    ],
  },
  {
    name: 'products edit', query: SIGNED_IN, steps: [
      ...toProducts,
      { click: cardAdd(1), label: 'Click "Add to Store" on the first saved design' },
      ...newCategory('Jerseys'),
      { click: confirmBtn, label: 'Click "Add to Store"' }, popupClose,
      { hover: `${startsWith('Edit Product')} >> nth=0`, label: 'Hover "Edit Product" on the card' },
      { click: `${startsWith('Edit Product')} >> nth=0`, label: 'Click "Edit Product": the pop-up opens with "Save Changes"' },
      { click: confirmBtn, label: 'Click "Save Changes": "Product updated"' }, popupClose,
    ],
  },
  {
    name: 'products cart', query: SIGNED_IN, steps: [
      ...toProducts,
      chip('Customizer'), subTab('Saved Carts'),
      { click: cardAdd(1), label: 'Click "Add to Store" on the first saved cart: the pop-up shows ITEM 1 OF N' },
      { click: startsWith('Confirm & Next Product'), label: 'Click "Confirm & Next Product"' },
      { click: button('Back'), label: 'Click "Back"' },
      { click: button('Cancel'), label: 'Click "Cancel"' }, popupClose,
    ],
  },
  {
    name: 'products stock vault', query: SIGNED_IN, steps: vaultAuto ? [
      ...toProducts,
      chip('Stock Vault'),
      { click: `${button('Remove')} >> nth=0`, label: 'Click "Remove" on the first auto-added Stock Vault item' },
      { click: `${button('Add back')} >> nth=0`, label: 'Click "Add back"' },
      { click: button('Remove all'), label: 'Click "Remove all" in the green banner' },
      { click: button('Add all back'), label: 'Click "Add all back"' },
    ] : [
      ...toProducts,
      chip('Stock Vault'),
      { click: cardAdd(1), label: 'Click "Add to Store" on the first Pro Stock item: sizes and color ways open' },
      { click: button('Continue'), label: 'Click "Continue": Configure & Add to Store opens, without application sizes' },
      { click: button('Cancel'), label: 'Click "Cancel"' }, popupClose,
    ],
  },
  {
    name: 'products template', query: SIGNED_IN, steps: [
      ...toProducts,
      chip('Catalog Templates'),
      { click: `${button('Template actions')} >> nth=0`, label: 'Click ⋯ on the first template' },
      { click: button('Rename template') },
      { fill: ['xpath=(//input[not(@placeholder)])[1]', 'Spring Kit'], label: 'Type "Spring Kit"' },
      { press: 'Enter', label: 'Press Enter: the template is renamed, with a message' },
      { click: `${button('Template actions')} >> nth=0`, label: 'Click ⋯ again' },
      { click: button('Delete template'), label: 'Click "Delete template": it is removed, with a message' },
    ],
  },
  {
    name: 'products customize', query: SIGNED_IN, steps: [
      ...toProducts,
      { click: startsWith('Customize New Product'), label: 'Click "Customize New Product": pick a sport' },
      { click: button('Women'), label: 'Click "Women"' },
      { click: button('Men'), label: 'Click "Men"' },
      { click: `${button(sport)} >> nth=0`, label: `Click "${sport}": pick a product` },
      { click: `${button('Hoyas', false)} >> nth=0`, label: 'Click the "Hoyas" design: the builder opens' },
      { click: custButton('Add to Store'), label: 'Click "Add to Store" in the builder: review and sizes' },
      { click: custButton('Add to Store'), label: 'Click "Add to Store": the product is added, with a message' },
      popupClose,
    ],
  },
  {
    name: 'products league teams', query: SIGNED_IN, steps: [
      ...toProductsLeague,
      { click: cardAdd(1), label: 'Click "Add to Store" on the first saved design: the pop-up has Assign to Teams' },
      ...newCategory('Jerseys'),
      flag('Required for players'),
      { click: button('+ New Team'), label: 'In Assign to Teams, click "+ New Team"' },
      { fill: [field('Team name'), 'Hawks Gold'], label: 'Type "Hawks Gold"' },
      { click: button('Create Team'), label: 'Click "Create Team": the team is ticked' },
      { click: button('Assign & Save'), label: 'Click "Assign & Save"' },
      { click: confirmBtn, label: 'Click "Add to Store": the card shows who it is assigned to' },
      popupClose,
    ],
  },
];

export default {
  name: 'Workspace Add Store wizard: Add Products (Module 3)',
  page: 'Workspace.dc.html',
  ready: 'h1',
  seedRandom: true,
  settleMs: 300, // the workspace is a large page: give it longer to finish rendering after each step
  // Taller than the other scenarios: Configure & Add to Store's settings scroll inside a 64vh box, and the
  // full-page screenshot changes the viewport, which moved that scroll by a different amount on each side.
  // At 1800 px high the box fits its content and doesn't scroll.
  viewports: [{ width: 1440, height: 1800 }],
  related: [
    {
      name: 'The wizard frame and Basics',
      where: 'CreateForm and Step1Basics in workspace-app.jsx',
      how: 'Part 2a, checked by workspace-create-store.mjs. The states go through Basics to reach Add Products.',
    },
    {
      name: 'Divisions & Teams',
      where: 'Step2Structure in workspace-app.jsx',
      how: 'Step 2 of a League store; "New Team" adds the team Assign to Teams needs. Part 2d.',
    },
    {
      name: 'Review & Deploy',
      where: 'Step6Review in workspace-app.jsx',
      how: 'CONTINUE after Add Products. Part 2c.',
    },
    {
      name: "A store's Products tab",
      where: 'AddProductsPage, ConfigureProduct and EditProductDrawer in workspace-app.jsx',
      how: 'Use the same product browser, Configure & Add pop-up, price settings and Customize flow. Not converted yet.',
    },
    {
      name: 'Remove from store?',
      where: 'Step3Products (removeTarget) in workspace-app.jsx',
      how: 'Not reachable: the product card takes onRemove but shows no remove button.',
    },
  ],
  states: buildStates(),
};
