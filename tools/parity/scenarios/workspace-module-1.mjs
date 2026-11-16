// Module 1 parts of the workspace ("Workspace.dc.html" → workspace-app.jsx): the access gate and
// business verification (FR-1.10.2), the welcome pop-up after sign-in, and My Account.
//
// The workspace shows random sample data (overview, stores), so both sides get the same random
// numbers (seedRandom). Some screens are only reachable through the prototype's settings panel,
// which Claude Design's editor opens with a postMessage; the `eval` step sends the same message.
// The panel is prototype-only: the Vue version (behavior mode) reaches the same states through its
// development hook, window.__paritySetProps. Steps marked `on: 'prototype'` / `on: 'vue'` run only
// on that side; the two sides are compared again once both have reached the state.
// The same states run on the integrated page in marucci-workspace-module-1.mjs.

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
const button = (name, exact = true) => (exact ? `role=button[name="${name}" s]` : `role=button[name=/${escapeRegex(name)}/i]`);
const field = (name) => `role=textbox[name="${name}" s]`;

const ACCESS_NONE = '?brand=prolook&auth=native&access=none'; // a rep without access, as the landing page hands off
const SIGNED_IN = '?brand=prolook&auth=native-connected'; // signed in, welcome pop-up already seen

const openSettings = {
  eval: `window.postMessage({ type: '__activate_edit_mode' }, '*')`, on: 'prototype',
  label: 'Open the prototype settings panel: in the browser console, run `window.postMessage({ type: "__activate_edit_mode" }, "*")`',
};
const closeSettings = { click: button('Close tweaks'), on: 'prototype', label: 'Close the settings panel (✕ at its top right)' };
// The same setting or shortcut on the Vue version: window.__paritySetProps({ … }).
const vueSettings = (props) => {
  const json = JSON.stringify(props).replace(/"/g, "'");
  return { eval: `window.__paritySetProps(${json})`, on: 'vue', label: `In the browser console, run \`__paritySetProps(${json})\`` };
};
// "▶ …" screen shortcuts in the settings panel, and the screen each one opens.
const SHORTCUT_SCREENS = { 'Gate landing': 'gate', 'Awaiting organization approval': 'access-pending', 'Stripe verification': 'stripe-verify' };
const fromSettings = (name) => [
  openSettings, { click: button(name, false), on: 'prototype', label: `In the settings panel, click "▶ ${name}"` }, closeSettings,
  vueSettings({ screen: SHORTCUT_SCREENS[name] }),
];
const multiBrandSwitch = 'xpath=//*[normalize-space(text())="Multi-brand account"]/ancestor::*[.//*[@role="switch"]][1]//*[@role="switch"]';
const signInMethod = 'xpath=//*[normalize-space(text())="Sign-in method"]/ancestor::*[.//select][1]//select';
const openMyAccount = (account) => [
  { hover: button(account), label: `Hover the account button (${account.split(' ').map((w) => w[0]).join('')}) at the top right` },
  { click: 'role=menuitem[name="My Account" s]', label: 'Click "My Account" in the menu' },
];
// The welcome pop-up's ✕ (top right), and a click on the dark area around the pop-up. A plain click
// would land on the pop-up itself (the middle of the dark area), so the click is sent to the dark area.
const welcomeClose = '.wx-welcome >> role=button[name="Close" s]';
const clickOutsideWelcome = {
  eval: `document.querySelector('.wx-welcome').parentElement.parentElement.click()`,
  label: 'Click the dark area outside the pop-up: it closes, as "Continue to Workspace" does',
};

// account: the signed-in rep shown in the header. welcome: whether the page renders the welcome pop-up
// (the integrated workspace defines it but never renders it). customizerOnly: whether the settings panel
// offers the "Customizer only" sign-in method. archivedStores: how many sample archived stores My Account lists.
export const buildStates = ({ account = 'Hingle McCringleberry', welcome = true, customizerOnly = true, archivedStores = 3 } = {}) => [
  // ── Business verification (FR-1.10.2) and the access gate ──
  {
    name: 'business verification form', query: ACCESS_NONE, steps: [
      { hover: button('Submit & Verify', false) },
      { click: button('Submit & Verify', false), label: 'Click "Submit & Verify" with the form empty' },
      { focus: field('Legal business name') },
      { fill: [field('Legal business name'), 'Team Gear Athletics LLC'] },
      { fill: [field('DBA / trade name (optional)'), 'Team Gear'] },
      { fill: [field('Entity type (LLC, S-Corp…)'), 'LLC'] },
      { fill: [field('Registered business address'), '123 Main St, Salt Lake City, UT 84117'] },
      { fill: [field('EIN (XX-XXXXXXX)'), '12-3456789'] },
      { fill: [field('Bank routing number'), '124000054'] },
      { fill: [field('Bank account number'), '000123456789'] },
      { hover: button('Cancel') },
      { click: button('Submit & Verify', false) },
      { hover: button('Continue to Overview', false) },
    ],
  },
  { name: 'business verification cancel', query: ACCESS_NONE, steps: [{ click: button('Cancel') }] },
  {
    name: 'access gate', query: ACCESS_NONE, steps: [
      ...fromSettings('Gate landing'),
      { hover: button('Apply for Access', false) },
      { hover: button('Already verified', false) },
      { click: button('Apply for Access', false) },
    ],
  },
  { name: 'access gate already verified', query: ACCESS_NONE, steps: [...fromSettings('Gate landing'), { click: button('Already verified', false) }] },
  {
    name: 'awaiting approval', query: ACCESS_NONE, steps: [
      ...fromSettings('Awaiting organization approval'),
      { hover: button('Back to', false) },
      { hover: button('Continue to Overview', false) },
      { click: button('Continue to Overview', false) },
    ],
  },
  { name: 'stripe verification', query: ACCESS_NONE, steps: [...fromSettings('Stripe verification'), { wait: 1500 }, { wait: 900 }] },

  // ── Welcome pop-up after sign-in ──
  ...(!welcome ? [] : [
    {
      name: 'welcome native', query: '?brand=prolook&auth=native', steps: [
        { hover: button('Connect') },
        { click: button('Connect') },
        { hover: button('Continue to Workspace', false) },
        { click: button('Continue to Workspace', false) },
      ],
    },
    { name: 'welcome customizer', query: '?brand=prolook', steps: [{ hover: button('Continue to Workspace', false) }, { click: button('Continue to Workspace', false) }] },
    {
      name: 'welcome multi-brand', query: '?brand=prolook', steps: [
        openSettings,
        { click: multiBrandSwitch, on: 'prototype', label: 'In the settings panel, turn on "Multi-brand account"' },
        closeSettings,
        vueSettings({ ssoMultiBrand: true }),
        { hover: welcomeClose, label: 'Hover the ✕ at the top right of the pop-up' },
        { click: button('Continue to Workspace', false) },
      ],
    },
    // Closing the pop-up without its button: the ✕, Escape, or a click outside it.
    {
      name: 'welcome close', query: '?brand=prolook', steps: [
        { hover: welcomeClose, label: 'Hover the ✕ at the top right of the pop-up' },
        { click: welcomeClose, label: 'Click the ✕: the pop-up closes, as "Continue to Workspace" does' },
      ],
    },
    { name: 'welcome native close', query: '?brand=prolook&auth=native', steps: [{ click: welcomeClose, label: 'Click the ✕ without connecting a Customizer' }] },
    { name: 'welcome escape', query: '?brand=prolook', steps: [{ press: 'Escape', label: 'Press Escape: the pop-up closes' }] },
    { name: 'welcome click outside', query: '?brand=prolook', steps: [clickOutsideWelcome] },
  ]),

  // ── My Account ──
  {
    name: 'my account', query: SIGNED_IN, steps: [
      ...openMyAccount(account),
      { hover: button('Add Customizer', false) },
      { hover: button('Primary brand', false) },
      { click: button('Primary brand', false) },
    ],
  },
  { name: 'my account edit', query: SIGNED_IN, steps: [...openMyAccount(account), { click: button('Edit', false) }, { hover: button('Save changes') }, { click: button('Cancel') }] },
  { name: 'my account save', query: SIGNED_IN, steps: [...openMyAccount(account), { click: button('Edit', false) }, { click: button('Save changes') }] },
  {
    name: 'my account change password', query: SIGNED_IN, steps: [
      ...openMyAccount(account),
      { click: button('Change password', false) },
      { fill: ['input[placeholder="••••••••••••"]', 'old-password-123'] },
      { fill: ['input[placeholder="At least 12 characters"]', 'short'] },
      { click: button('Show') },
      { fill: ['input[placeholder="At least 12 characters"]', 'a new long passphrase'] },
      { hover: button('Update password') },
      { click: button('Update password') },
      { wait: 800 },
    ],
  },
  {
    name: 'my account password must differ', query: SIGNED_IN, steps: [
      ...openMyAccount(account),
      { click: button('Change password', false) },
      { fill: ['input[placeholder="••••••••••••"]', 'same-passphrase-123'] },
      { fill: ['input[placeholder="At least 12 characters"]', 'same-passphrase-123'] },
    ],
  },
  ...(!customizerOnly ? [] : [{
    name: 'my account customizer only', query: SIGNED_IN, steps: [
      openSettings,
      { select: [signInMethod, 'customizer'], on: 'prototype', label: 'In the settings panel, set "Sign-in method" to "Customizer only"' },
      closeSettings,
      vueSettings({ authMode: 'customizer' }),
      ...openMyAccount(account),
      { wait: 300, label: 'Move the mouse away and wait for the account menu to close' }, // it would cover "Edit Profile"
      { hover: button('Edit Profile', false) },
      { click: button('Create password', false) },
      { fill: ['input[placeholder="At least 12 characters"]', 'a new long passphrase'] },
    ],
  }]),
  {
    // Restoring every sample archived store shows the empty state.
    name: 'my account no archived stores', query: SIGNED_IN, steps: [
      ...openMyAccount(account),
      ...Array.from({ length: archivedStores }, (_, i) => i + 1).flatMap((n) => [
        { click: button('Store actions'), label: `Click the ⋯ menu on the first archived store (${n} of ${archivedStores})` },
        { click: 'text="Unarchive"', label: 'Click "Unarchive" in the menu' },
        { click: button('Restore Store', false) },
      ]),
    ],
  },
  {
    name: 'my account add customizer', query: SIGNED_IN, steps: [
      ...openMyAccount(account),
      { click: button('Add Customizer', false) },
      { hover: button('Connect') },
      { click: button('Connect') },
      { fill: ['input[placeholder^="you@"]', 'rep@dealership.com'] },
      { fill: ['input[placeholder="••••••••"]', 'secret-123'] },
      { hover: button('Sign In') },
      { click: button('Sign In') },
      { wait: 850 },
    ],
  },
  {
    name: 'my account add customizer search', query: SIGNED_IN, steps: [
      ...openMyAccount(account),
      { click: button('Add Customizer', false) },
      { fill: ['input[placeholder="Search brands"]', 'rid'] },
      { fill: ['input[placeholder="Search brands"]', 'zzz'] },
      { click: button('Close') },
    ],
  },
  {
    name: 'my account add customizer back', query: SIGNED_IN, steps: [
      ...openMyAccount(account),
      { click: button('Add Customizer', false) },
      { click: button('Connect') },
      { click: button('Back') },
      { wait: 400 },
      { click: button('Request access to this brand', false) },
    ],
  },
];

export default {
  name: 'Workspace (Module 1)',
  page: 'Workspace.dc.html',
  ready: 'h1',
  seedRandom: true,
  settleMs: 300, // the workspace is a large page: give it longer to finish rendering after each step
  viewports: [{ width: 1440, height: 900 }],
  related: [
    {
      name: 'Landing page',
      where: 'Landing Page.dc.html',
      how: 'Cancel and "Back to PROLOOK" on the access screens redirect to "Team Stores Landing.dc.html", which does not exist in the handover (404; the page is now "Landing Page.dc.html"). Open Landing Page.dc.html directly (Vue: http://localhost:5173/).',
    },
    {
      name: 'Workspace overview and other screens',
      where: 'workspace-app.jsx',
      how: 'Approving access, finishing Stripe verification, and closing the welcome pop-up lead to the overview. In Vue, only the Overview is converted so far (the Stores and Earnings tabs show an empty page). Open Workspace.dc.html?brand=prolook&auth=native-connected (Vue: http://localhost:5173/workspace.html?brand=prolook&auth=native-connected).',
    },
  ],
  states: buildStates(),
};
