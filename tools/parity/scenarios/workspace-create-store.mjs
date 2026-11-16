// Module 3: the Add Store wizard ("Workspace.dc.html" → workspace-app.jsx, CreateForm), BRD M-3.0 FR-3.1,
// part 2a: the wizard's frame (header, step badge, stepper, footer) and Step 1 Basics: store type,
// details and fundraising, schedule and timeline, announcement, team branding (Team Database, My Logos,
// team colors, sports), team & roster, managers, point of contact, fulfillment and ship-to, and tax.
// Steps 2 to 4 (Divisions & Teams, Add Products, Review & Deploy) are later parts; states that reach them
// end there.
//
// The wizard opens from "Add Store" (the Overview here; the Stores page's button is in
// workspace-stores.mjs). Its Accent is a prototype setting: the settings panel's "Accent" choice, and on
// the Vue version window.__paritySetProps (steps marked `on: 'prototype'` / `on: 'vue'`).
// "Use as Template" in a Stores page card's ⋮ menu also opens the wizard, pre-filled from the store.
// Prototype bug, kept: the wizard drops the preset's _startAt and _dupSource (buildWizardData doesn't copy
// them), so "Duplicate the whole store" opens on Basics instead of Review & Deploy, and the "Duplicated
// from …" / "Products from …" line under the title never shows.
// The League → Individual warning needs divisions or teams: the state adds a team in Step 2 first.
// After a step change the wizard scrolls up smoothly; states that change step make scrolling instant first,
// so both sides are captured at rest.
// The same states run on the integrated page in marucci-workspace-create-store.mjs.

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
const button = (name, exact = true) => (exact ? `role=button[name="${name}" s]` : `role=button[name=/${escapeRegex(name)}/i]`);
// A button whose accessible name starts with the text (choice cards: title, then description).
const startsWith = (name) => `role=button[name=/^${escapeRegex(name)}/]`;

const SIGNED_IN = '?brand=prolook&auth=native-connected'; // signed in, welcome pop-up already seen
const openWizard = { click: button('Add Store'), label: 'Click "Add Store" at the top right of the Overview' };
const cont = { click: 'role=button[name=/CONTINUE/]', label: 'Click CONTINUE at the bottom right' };
// The toggle at the end of a row, found from the row's title.
const toggle = (title) => ({ click: `xpath=//div[normalize-space(text())="${title}"]/../../button`, label: `Click the "${title}" toggle` });
// A stepper step, found from its label.
const stepperStep = (label) => ({ click: `xpath=//button[.//span[normalize-space(text())="${label}"]]`, label: `Click "${label}" in the stepper` });
const field = (placeholder, nth = 0) => `input[placeholder="${placeholder}"] >> nth=${nth}`;
const logoBox = 'xpath=//*[normalize-space(text())="Team Logo"]/following-sibling::div[1]';
const colorsBox = 'xpath=//*[normalize-space(text())="Team Colors"]/following-sibling::div[1]';
const swatch = (n) => `xpath=(//p[contains(., "If a color")]/../following-sibling::div[1]//button)[${n}]`;
const savedLogo = (name) => `xpath=//div[normalize-space(text())="${name}"]/preceding-sibling::button`;
const cardMenu = (name) => `xpath=//*[normalize-space(text())="${name}"]/ancestor::div[.//button[@title="Store actions"]][1]//button[@title="Store actions"]`;
const cardMenuItem = (label) => `xpath=//button[@title="Store actions"]/following-sibling::div/div[normalize-space(text())="${label}"]`;
const openStores = { click: 'role=link[name="STORES" s]', label: 'Click the STORES tab in the header' };
// The wizard scrolls up smoothly after a step change; a capture could land mid-scroll. This makes the
// page's scrollTo calls instant (same end position), so every capture is at rest.
const instantScroll = {
  eval: `(() => { for (const t of [window, Element.prototype]) { const o = t.scrollTo; t.scrollTo = function (a, b) { return o.call(this, a && typeof a === 'object' ? { ...a, behavior: 'instant' } : a, b); }; } })()`,
  label: 'In the browser console, make scrolling instant (the wizard scrolls up smoothly after a step change)',
};
const savedLocations = [
  { click: button('Saved pick-up location') },
  { click: 'xpath=//button[normalize-space(.)="Saved pick-up location"]/../following-sibling::div[1]/button[1]', label: 'Click the first saved pick-up location' },
];

const openSettings = {
  eval: `window.postMessage({ type: '__activate_edit_mode' }, '*')`, on: 'prototype',
  label: 'Open the prototype settings panel: in the browser console, run `window.postMessage({ type: "__activate_edit_mode" }, "*")`',
};
const closeSettings = { click: button('Close tweaks'), on: 'prototype', label: 'Close the settings panel (✕ at its top right)' };
const vueSettings = (props) => {
  const json = JSON.stringify(props).replace(/"/g, "'");
  return { eval: `window.__paritySetProps(${json})`, on: 'vue', label: `In the browser console, run \`__paritySetProps(${json})\`` };
};

// Fills what Basics requires, for the states that continue to the next step.
const fillRequired = (type) => [
  { click: startsWith(type), label: `Click "${type}"` },
  { fill: ['role=textbox[name="Store Name" s]', 'Coastal Hawks'], label: 'Type "Coastal Hawks" in Store Name (the web address follows)' },
  { click: startsWith('Always-On Locker'), label: 'Click "Always-On Locker"' },
  { fill: [field('name@example.com'), 'coach@hawks.org'], label: 'Type an email in the Team Manager\'s Email' },
  { fill: [field('111-000-3243'), '8015550142'], label: 'Type a phone number in the Team Manager\'s Phone Number' },
  { click: startsWith('Team Manager Email'), label: 'Click "Team Manager Email" under Store Point of Contact' },
  { click: startsWith('Team Manager Phone'), label: 'Click "Team Manager Phone"' },
  { click: startsWith('Direct-To-Home'), label: 'Click "Direct-To-Home Residential Delivery"' },
  toggle('Collect Sales Tax'),
];

// stores: league is a League store to start the wizard from with "Use as Template".
export const buildStates = ({ stores }) => [
  {
    name: 'wizard', query: SIGNED_IN, steps: [
      openWizard,
      { hover: startsWith('League Store'), label: 'Hover the "League Store" card' },
      { hover: button('Connect to Team'), label: 'Hover "Connect to Team"' },
      { hover: button('CANCEL') },
      { hover: 'role=button[name=/CONTINUE/]', label: 'Hover CONTINUE' },
    ],
  },
  { name: 'wizard required fields', query: SIGNED_IN, steps: [openWizard, { ...cont, label: 'Click CONTINUE with nothing filled in: every required field shows its error' }] },
  {
    name: 'wizard store type', query: SIGNED_IN, steps: [
      openWizard,
      { click: startsWith('Individual Team Store'), label: 'Click "Individual Team Store": the stepper has 3 steps' },
      { click: startsWith('League Store'), label: 'Click "League Store": 4 steps again' },
    ],
  },
  {
    name: 'wizard details and schedule', query: SIGNED_IN, steps: [
      openWizard,
      { fill: ['role=textbox[name="Store Name" s]', 'Coastal Hawks'], label: 'Type "Coastal Hawks" in Store Name' },
      { fill: [field('store-slug'), 'hawks-2026'], label: 'Replace the web address with "hawks-2026"' },
      toggle('Enable Team Fundraising'),
      { click: startsWith('Temporary Pop-Up'), label: 'Click "Temporary Pop-Up": Store Timeline appears' },
      { focus: 'input[type="date"] >> nth=0', label: 'Click in Store Launch Date' },
      { fill: ['input[type="date"] >> nth=0', '2026-12-01'], label: 'Set Store Launch Date to 12/01/2026' },
      toggle('Enable Urgency Timers'),
      { ...cont, label: 'Click CONTINUE: Store Closing Deadline shows its error' },
      { click: startsWith('Always-On Locker'), label: 'Click "Always-On Locker": Store Timeline goes away' },
    ],
  },
  {
    name: 'wizard announcement', query: SIGNED_IN, steps: [
      openWizard,
      { click: '.cz-edit', label: 'Click in the Announcement Message box' },
      { hover: '[title="Bold"]', label: 'Hover the B (bold) button' },
      { type: ['.cz-edit', 'Orders close Friday.'], label: 'Type "Orders close Friday."' },
      { click: 'h1', label: 'Click the "Create a Team Store" heading: the box loses focus' },
    ],
  },
  {
    name: 'wizard team database', query: SIGNED_IN, steps: [
      openWizard,
      { click: button('Connect to Team'), label: 'Click "Connect to Team": the Team Database opens' },
      { hover: `${button('Select')} >> nth=0`, label: 'Hover the first "Select"' },
      { fill: [field('Organization name'), 'Padres'], label: 'Type "Padres" in Organization name' },
      { click: button('Search') },
      { fill: [field('Organization name'), 'zzz'], label: 'Replace it with "zzz"' },
      { click: button('Search'), label: 'Click Search: no organization matches' },
      { fill: [field('Organization name'), ''], label: 'Empty Organization name' },
      { click: button('Search'), label: 'Click Search: the full list comes back' },
      { click: `${button('Select')} >> nth=1`, label: 'Click "Select" on Valley Hoyas: its logo, colors and sports come in' },
      { hover: button('Clear'), label: 'Hover "Clear" next to "Change Team"' },
      { click: button('Clear'), label: 'Click "Clear": the team, logo, colors and sports are removed, with a message' },
      { wait: 4000, label: 'Wait 4 s for the message to go' },
      { click: button('Connect to Team'), label: 'Click "Connect to Team" again' },
      { click: button('Close'), label: 'Click ✕ at the Team Database\'s top right' },
    ],
  },
  {
    name: 'wizard logo and colors', query: SIGNED_IN, steps: [
      openWizard,
      { click: logoBox, label: 'Click the empty Team Logo box: My Logos opens' },
      { hover: 'role=button[name=/ADD LOGO/]', label: 'Hover "ADD LOGO"' },
      { click: 'text="Favorites"', label: 'Click "Favorites"' },
      { click: 'text="Most Recent"', label: 'Click "Most Recent"' },
      { fill: [field('SEARCH BY KEYWORD'), 'zzz'], label: 'Type "zzz" in the search: no logo matches' },
      { fill: [field('SEARCH BY KEYWORD'), ''], label: 'Clear the search' },
      { click: 'text="All"', label: 'Click "All"' },
      { hover: savedLogo('Broncos'), label: 'Hover the Broncos logo' },
      { click: savedLogo('Broncos'), label: 'Click the Broncos logo: it becomes the team logo' },
      { click: '[title="Remove logo"]', label: 'Click the small ✕ on the logo: it is removed' },
      { click: `${colorsBox}//button[last()]`, label: 'Click + under Team Colors: Select Team Color opens' },
      { click: swatch(1), label: 'Click the first color' },
      { click: swatch(5), label: 'Click the fifth color' },
      { click: button('Save Colors') },
      { hover: `${colorsBox}/div/div[1]`, label: 'Hover the first team color: its ✕ shows' },
      { click: '[title="Remove"] >> nth=0', label: 'Click its ✕: the color is removed' },
    ],
  },
  {
    name: 'wizard sports and roster', query: SIGNED_IN, steps: [
      openWizard,
      { click: button('Baseball'), label: 'Click "Baseball" under Sports' },
      { click: button('Soccer'), label: 'Click "Soccer"' },
      toggle('Allow Duplicate Numbers'),
      { click: startsWith('Players choose their own numbers'), label: 'Click "Players choose their own numbers"' },
    ],
  },
  {
    name: 'wizard managers', query: SIGNED_IN, steps: [
      openWizard,
      { fill: [field('Jordan'), 'Sam'], label: 'Type "Sam" in the Team Manager\'s First Name' },
      { fill: [field('name@example.com'), 'sam@hawks.org'], label: 'Type an email in Email' },
      { click: 'role=button[name=/Add another manager/]', label: 'Click "Add another manager"' },
      { fill: [field('Alex'), 'Alex'], label: 'Type "Alex" in the new manager\'s First Name' },
      { click: 'xpath=//span[normalize-space(text())="Additional Manager"]/following-sibling::button', label: 'Click "Remove" on the additional manager' },
    ],
  },
  {
    name: 'wizard point of contact', query: SIGNED_IN, steps: [
      openWizard,
      { click: startsWith('Team Manager Email'), label: 'Click "Team Manager Email": no email on the Team Manager yet' },
      { click: startsWith('Salesperson Email'), label: 'Click "Salesperson Email"' },
      { click: 'xpath=//label[normalize-space(text())="Select a Salesperson"]/..', label: 'Click "Select a Salesperson"' },
      { click: 'text="Maria Lopez · maria@prolook.com"', label: 'Click "Maria Lopez"' },
      { click: startsWith('Custom Phone'), label: 'Click "Custom Phone"' },
      { fill: [field('000-000-0000'), '8015550188'], label: 'Type a phone number' },
    ],
  },
  {
    name: 'wizard fulfillment', query: SIGNED_IN, steps: [
      openWizard,
      { click: startsWith('Ship to Team Manager'), label: 'Click "Ship to Team Manager": Ship-To Destination appears, with address fields' },
      ...savedLocations,
      { click: button('Enter address manually') },
      { fill: ['role=textbox[name="Street Address" s]', '400 Ocean Ave'], label: 'Type a street address' },
      { click: startsWith('Direct-To-Home'), label: 'Click "Direct-To-Home Residential Delivery": Ship-To Destination goes away' },
    ],
  },
  {
    name: 'wizard tax', query: SIGNED_IN, steps: [
      openWizard,
      { click: field('Search by state or abbreviation'), label: 'Click the State box: the list opens' },
      { type: [field('Search by state or abbreviation'), 'cal'], label: 'Type "cal"' },
      { hover: startsWith('California'), label: 'Hover California' },
      { click: startsWith('California'), label: 'Click California: the tax rate fills in' },
      { click: 'text=/I acknowledge I am the taxing entity/', label: 'Tick the tax liability agreement' },
      toggle('Collect Sales Tax'),
    ],
  },

  // ── Clicks that leave Basics ──
  {
    name: 'wizard continue league', query: SIGNED_IN, steps: [
      openWizard, instantScroll, ...fillRequired('League Store'),
      { ...cont, label: 'Click CONTINUE: Step 2, Divisions & Teams' },
      { click: 'role=button[name=/BACK/]', label: 'Click BACK: Basics again, with step 2 reachable in the stepper' },
      stepperStep('Divisions & Teams'),
    ],
  },
  { name: 'wizard continue individual', query: SIGNED_IN, steps: [openWizard, instantScroll, ...fillRequired('Individual Team Store'), { ...cont, label: 'Click CONTINUE: Step 2, Add Products' }] },
  {
    name: 'wizard league to individual', query: SIGNED_IN, steps: [
      openWizard, instantScroll, ...fillRequired('League Store'),
      { ...cont, label: 'Click CONTINUE: Step 2, Divisions & Teams' },
      { click: `${button('New Team')} >> nth=0`, label: 'Click "New Team": the league has a team' },
      { click: 'role=button[name=/BACK/]', label: 'Click BACK' },
      { click: startsWith('Individual Team Store'), label: 'Click "Individual Team Store": the warning about discarding divisions and teams opens' },
      { click: button('Keep League Store') },
      { wait: 200, label: 'Wait 0.2 s for the pop-up to close' },
      { click: startsWith('Individual Team Store'), label: 'Click "Individual Team Store" again' },
      { click: button('Switch & Discard'), label: 'Click "Switch & Discard": the stepper has 3 steps' },
      { wait: 200, label: 'Wait 0.2 s for the pop-up to close' },
    ],
  },
  { name: 'wizard cancel', query: SIGNED_IN, steps: [openWizard, { click: button('CANCEL'), label: 'Click CANCEL: the wizard closes' }] },

  // ── Use as Template (a Stores page card's ⋮ menu) ──
  {
    name: 'wizard from a store', query: SIGNED_IN, steps: [
      openStores,
      { click: cardMenu(stores.league), label: `Click ⋮ on the ${stores.league} card` },
      { click: cardMenuItem('Use as Template'), label: 'Click "Use as Template"' },
      { click: button('Continue'), label: 'Click Continue ("Duplicate the whole store" is chosen)' },
      { click: button('Duplicate store') },
      { wait: 2000, label: 'Wait 2 s while the store is set up: the wizard opens on Basics, filled in from the store' },
    ],
  },

  // ── Navy accent (settings: "Accent") ──
  {
    name: 'wizard navy accent', query: SIGNED_IN, steps: [
      openSettings, { click: 'role=radio[name="Navy" s]', on: 'prototype', label: 'In the settings panel, under Accent, click "Navy"' }, closeSettings,
      vueSettings({ wizardAccent: 'navy' }),
      openWizard,
      { click: startsWith('League Store'), label: 'Click "League Store"' },
      { click: startsWith('Temporary Pop-Up'), label: 'Click "Temporary Pop-Up"' },
      toggle('Enable Team Fundraising'),
      { click: button('Basketball'), label: 'Click "Basketball" under Sports' },
      { click: startsWith('Team Manager Email'), label: 'Click "Team Manager Email"' },
      { click: startsWith('Ship to Team Manager'), label: 'Click "Ship to Team Manager"' },
      ...savedLocations,
      { click: button('Connect to Team'), label: 'Click "Connect to Team"' },
      { hover: `${button('Select')} >> nth=0`, label: 'Hover the first "Select"' },
    ],
  },
];

export default {
  name: 'Workspace Add Store wizard: frame and Basics (Module 3)',
  page: 'Workspace.dc.html',
  ready: 'h1',
  seedRandom: true,
  settleMs: 300, // the workspace is a large page: give it longer to finish rendering after each step
  viewports: [{ width: 1440, height: 900 }],
  related: [
    {
      name: 'Divisions & Teams, Add Products, Review & Deploy',
      where: 'Step2Structure, Step3Products and Step6Review in workspace-app.jsx',
      how: 'CONTINUE on Basics, the stepper, and "Use as Template" open them. The later parts of Module 3 (FR-3.1).',
    },
    {
      name: 'The Stores page',
      where: 'StoreList in workspace-app.jsx',
      how: 'CANCEL closes the wizard; "Use as Template" starts from a store card\'s ⋮ menu. Checked by workspace-stores.mjs.',
    },
    {
      name: 'Use as Template pop-up',
      where: 'UseAsTemplateModal in workspace-app.jsx',
      how: 'A Stores page card\'s ⋮ menu → "Use as Template". Opens the wizard pre-filled; the pop-up itself is part of the Stores page and not converted yet.',
    },
    {
      name: 'Started from a saved template',
      where: 'Step1Basics (data._fromUserTemplate) in workspace-app.jsx',
      how: 'The "Started from …" banner and the "Change breaks the template" pop-up. Not reachable: only the unused template screens set _fromUserTemplate.',
    },
    {
      name: 'Duplicated from / Products from line',
      where: 'CreateForm (data._dupSource) in workspace-app.jsx',
      how: 'The line under the wizard title. Not reachable: buildWizardData drops _dupSource (and _startAt) from the Use as Template preset.',
    },
  ],
  states: buildStates({ stores: { league: 'Bayshore Summer Classic' } }),
};
