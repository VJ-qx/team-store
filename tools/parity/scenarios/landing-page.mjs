// Module 1: landing page, sign-in, and registration (all inside "Landing Page.dc.html").
//
// Each state starts from a fresh page load with the given props, then runs its steps.
// A checkpoint is captured at the start and after every step. Timers are frozen after
// load, so only `wait` steps advance them (the page's own setTimeout redirects included).
//
// Selectors are Playwright selectors; the first match is used. Prefer role selectors
// and input placeholders: they work the same on the prototype and on the Vue version.
// button("Sign in") matches the exact accessible name; button("Skip for now", false)
// matches any button whose name contains the text (case-insensitive).

const EMAIL = 'input[placeholder="you@dealership.com"]';
const PASSWORD = 'input[placeholder="Enter your password"]';
const SIGNUP_PASSWORD = 'input[placeholder="At least 12 characters"]';
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
const button = (name, exact = true) => (exact ? `role=button[name="${name}" s]` : `role=button[name=/${escapeRegex(name)}/i]`);

const openSignIn = { click: button('SIGN IN') };
const signIn = { click: button('Sign in') };
const close = { click: button('Close') };
const withCustomizer = { click: button('with Customizer', false) };
const continueBtn = { click: button('Continue') };
const createAnAccount = { click: button('Create an account') };

const registerSteps = [
  openSignIn,
  createAnAccount,
  { fill: [EMAIL, 'new@dealership.com'] },
  { fill: [SIGNUP_PASSWORD, 'short'] },
  { fill: [SIGNUP_PASSWORD, 'a long enough passphrase'] },
  continueBtn,
  { fill: ['input[placeholder="Jordan"]', 'Jordan'] },
  { fill: ['input[placeholder="Rivera"]', 'Rivera'] },
  { fill: ['input[placeholder="(801) 123-4567"]', '8011234567'] },
  { fill: ['input[placeholder="Search countries"]', 'Can'] },
  { click: button('Canada') },
  { fill: ['input[placeholder="Search states"]', 'Ont'] },
  { click: button('Ontario') },
  { fill: ['input[placeholder="Salt Lake City"]', 'Toronto'] },
  { fill: ['input[placeholder="84117"]', 'M5V 2T6'] },
  { hover: button('Create account', false) },
  { click: button('Create account', false) },
  { wait: 1500 },
];

// Approved change, not in the prototype yet: sign-in lockout. Five wrong passwords in a row.
const LOCKOUT_DESIGN = 'docs/approved-changes/sign-in-lockout.png';
// Approved change, not in the prototype yet: helper line and Confirm & Enter for a one-brand rep (G-6). The Customizer
// welcome pop-up's one-brand state differs from the prototype on purpose, so it's an approved state.
const WELCOME_ONE_BRAND_DESIGN = 'docs/approved-changes/welcome-one-brand-confirm.png';
// Approved change, not in the prototype yet: Confirm your email (G-9). "Create account" stops at "Confirm your email";
// opening the page with ?confirm=<email> stands in for the email's link and runs the dealership check, as the old
// "register dealership …" states did after "Create account". Those states are approved states now. The check starts
// as the page loads, so these states freeze the clock from the start (clockFromLoad).
const CONFIRM_EMAIL_DESIGN = 'docs/approved-changes/confirm-your-email.png';
const CONFIRM_LINK = '?confirm=new%40dealership.com';
const pauseSignIn = [openSignIn, { fill: [EMAIL, 'rep@dealership.com'] }, { fill: [PASSWORD, 'wrong'] }, signIn, signIn, signIn, signIn, signIn];

export default {
  name: 'Landing page (Module 1)',
  page: 'Landing Page.dc.html',
  ready: 'text=TEAM STORES',
  viewports: [{ width: 1440, height: 900 }],
  // Where the flows continue outside this page (listed in the manual check list).
  related: [
    {
      name: 'Workspace after sign-in',
      where: 'Workspace.dc.html, workspace-app.jsx',
      how: 'Successful sign-in redirects to "Team Stores Workspace.dc.html", which does not exist in the handover (404). Open Workspace.dc.html directly with the same parameters: ?brand=prolook&auth=native (native sign-in, or "Skip for now"), &auth=customizer (Customizer sign-in or the welcome pop-up), &auth=native-connected (after "Connect & Enter Team Stores").',
    },
    {
      name: 'Business verification form (FR-1.10.2)',
      where: 'AccessApplyForm in workspace-app.jsx',
      how: 'Reached through the same broken redirect with access=none: after "register dealership not found" (Workspace.dc.html?brand=prolook&auth=native-new&access=none) and after signing in without access (Workspace.dc.html?brand=prolook&auth=native&access=none). Open those URLs directly.',
    },
    {
      name: 'My Account · brand access card',
      where: 'AccountProfile in workspace-app.jsx',
      how: 'In the workspace, open My Account. Not linked from this page; listed because it covers brand authentication.',
    },
  ],
  states: [
    { name: 'page signed out', steps: [{ hover: button('SIGN IN') }, { click: 'summary >> nth=0', label: 'Click the first FAQ question to open it' }] },
    { name: 'page signed in', props: { signedIn: true } },
    { name: 'page without dashboard preview', props: { showDashboardPreview: false } },

    { name: 'sign-in wrong password', steps: [openSignIn, { fill: [EMAIL, 'rep@dealership.com'] }, { fill: [PASSWORD, 'wrong'] }, { click: button('Toggle password visibility') }, signIn] },
    { name: 'sign-in success', steps: [openSignIn, { fill: [EMAIL, 'rep@dealership.com'] }, { fill: [PASSWORD, 'correct-horse'] }, { hover: button('Sign in') }, signIn, { wait: 1700 }] },
    { name: 'sign-in without access', props: { hasAccess: false }, steps: [openSignIn, { fill: [EMAIL, 'rep@dealership.com'] }, { fill: [PASSWORD, 'correct-horse'] }, signIn] },
    { name: 'sign-in modal close', steps: [openSignIn, close] },

    { name: 'forgot password', steps: [openSignIn, { click: button('Forgot password?') }, { fill: [EMAIL, 'rep@dealership.com'] }, { click: button('Send reset link', false) }, { click: button('Back to sign in', false) }] },

    { name: 'customizer sign-in', props: { customizerAccountExists: true }, steps: [openSignIn, withCustomizer, { fill: [EMAIL, 'rep@dealership.com'] }, continueBtn, { hover: button('Customizer account found', false) }, { click: button('Customizer account found', false) }, { fill: ['input[placeholder="Enter your Customizer password"]', 'secret'] }, { click: button('Authenticate & Enter', false) }, { wait: 1700 }] },
    { name: 'customizer no account', props: { customizerAccountExists: false }, steps: [openSignIn, withCustomizer, { fill: [EMAIL, 'rep@dealership.com'] }, continueBtn, { click: button('Request access to this brand', false) }] },
    { name: 'customizer email not in dealer records', props: { emailInDealerRecords: false }, steps: [openSignIn, withCustomizer, { fill: [EMAIL, 'rep@dealership.com'] }, continueBtn] },

    { name: 'register email already taken', steps: [openSignIn, createAnAccount, { fill: [EMAIL, 'demo@dealership.com'] }, { fill: [SIGNUP_PASSWORD, 'a long enough passphrase'] }] },

    { name: 'welcome modal native', props: { signedIn: true, showWelcomeModal: true }, steps: [{ click: button('Connect') }, close] },
    { name: 'welcome modal multi-brand', props: { signedIn: true, showWelcomeModal: true, welcomeNativePath: false, welcomeMultiBrand: true }, steps: [{ click: button('Confirm & Enter', false) }] },
  ],
  // Approved changes the prototype doesn't have yet (docs/README.md#approved-changes), checked on the
  // Vue version only: npm run parity -- tools/parity/scenarios/landing-page.mjs --approved --b http://localhost:5173/landing.html
  approved: [
    { name: 'register confirm your email', design: CONFIRM_EMAIL_DESIGN, steps: [...registerSteps.slice(0, -1), { hover: button('Back to sign in', false) }, { click: button('Back to sign in', false) }] },
    { name: 'register confirm link dealership not found', design: CONFIRM_EMAIL_DESIGN, query: CONFIRM_LINK, clockFromLoad: true, steps: [{ wait: 1500, label: 'Wait 1.5 s: the dealership check ends' }, { wait: 2200, label: 'Wait 2.2 s: on to organization registration' }] },
    { name: 'register confirm link dealership found', design: CONFIRM_EMAIL_DESIGN, query: CONFIRM_LINK, clockFromLoad: true, props: { signupDealershipFound: true }, steps: [{ wait: 1500, label: 'Wait 1.5 s: the dealership check ends' }, { click: button('PROLOOK', false) }, { click: button('PROLOOK', false) }, { click: button('Connect & Enter Team Stores', false) }, { wait: 1500 }] },
    { name: 'register confirm link dealership found skip', design: CONFIRM_EMAIL_DESIGN, query: CONFIRM_LINK, clockFromLoad: true, props: { signupDealershipFound: true }, steps: [{ wait: 1500, label: 'Wait 1.5 s: the dealership check ends' }, { click: button('Skip for now', false) }, { wait: 1500 }] },
    { name: 'welcome modal federated', design: WELCOME_ONE_BRAND_DESIGN, props: { signedIn: true, showWelcomeModal: true, welcomeNativePath: false }, steps: [{ hover: button('Confirm & Enter', false) }, { click: button('Confirm & Enter', false) }] },
    // Sign-in lockout (BRD FR-1.11): the fifth wrong password in a row pauses sign-in for 15 minutes.
    { name: 'sign-in paused', design: LOCKOUT_DESIGN, steps: [...pauseSignIn, { wait: 9000, label: 'Wait 9 seconds: the countdown shows 14:51, as in the design' }] },
    { name: 'sign-in paused reset password', design: LOCKOUT_DESIGN, steps: [...pauseSignIn, { click: button('Reset password') }] },
    { name: 'sign-in paused other email', design: LOCKOUT_DESIGN, steps: [...pauseSignIn, { fill: [EMAIL, 'other@dealership.com'] }, { fill: [EMAIL, 'rep@dealership.com'] }] },
    { name: 'sign-in pause ends', design: LOCKOUT_DESIGN, steps: [...pauseSignIn, { wait: 15 * 60 * 1000, label: 'Wait 15 minutes: the pause ends' }, { fill: [PASSWORD, 'correct-horse'] }] },
  ],
};
