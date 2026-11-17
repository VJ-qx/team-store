// Module 3: the Add Store wizard ("Workspace.dc.html" → workspace-app.jsx, CreateForm), BRD M-3.0 FR-3.1,
// part 2d: Step 2 of a League store, Divisions & Teams (Step2Structure), which reuses the My Team(s) editor
// (TeamCanvasView) in its wizard mode: the canvas with divisions and team nodes (CanvasParentNode,
// CanvasTeamNode, CanvasAddTeamTile), dragging a team's handle onto a division to connect or move it
// (CanvasHandle), the side panel (CanvasPanelField: names, the division's teams, delete), the confirmations
// (CanvasConfirmModal), and the summary when nothing is selected.
// Not in the wizard (TeamCanvasView's My Team(s) features, a store's tab not converted yet): branding,
// team codes, managers, rosters, the Roster Bank and products.
// Parts 2a, 2b and 2c are in workspace-create-store.mjs, -products.mjs and -review.mjs.
//
// Dragging: the tool has no drag step, so the states press, move and release with pointer events (eval
// steps) on the handle (its title names it) and over the target node, one step each, so the dashed line
// is captured mid-drag.
// New divisions and teams take their id from the clock, which only `wait` steps move: a short wait
// between two additions keeps their ids apart.
// The wizard scrolls up smoothly after a step change; states make scrolling instant first.
// The same states run on the integrated page in marucci-workspace-create-store-structure.mjs.

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

// League store Basics, then Step 2, Divisions & Teams.
const toStructure = [
  { click: button('Add Store'), label: 'Click "Add Store" at the top right of the Overview' },
  instantScroll,
  { click: startsWith('League Store'), label: 'Click "League Store"' },
  { fill: ['role=textbox[name="Store Name" s]', 'Coastal Hawks'], label: 'Type "Coastal Hawks" in Store Name' },
  { click: startsWith('Always-On Locker'), label: 'Click "Always-On Locker"' },
  { fill: [field('name@example.com'), 'coach@hawks.org'], label: "Type an email in the Team Manager's Email" },
  { fill: [field('111-000-3243'), '8015550142'], label: "Type a phone number in the Team Manager's Phone Number" },
  { click: startsWith('Team Manager Email'), label: 'Click "Team Manager Email" under Store Point of Contact' },
  { click: startsWith('Team Manager Phone'), label: 'Click "Team Manager Phone"' },
  { click: startsWith('Direct-To-Home'), label: 'Click "Direct-To-Home Residential Delivery"' },
  toggle('Collect Sales Tax'),
  { ...cont, label: 'Click CONTINUE: Step 2, Divisions & Teams' },
];

const tick = { wait: 10, label: 'Wait a moment (new ids come from the clock)' };
const newDivision = { click: `${button('New Division')} >> nth=0`, label: 'Click "New Division" at the top right: the division is selected' };
const newTeam = { click: `${button('New Team')} >> nth=0`, label: 'Click "New Team" at the top right: an unassigned team, selected' };
// The canvas comes before the side panel, so the first match is the node.
const node = (name) => ({ click: `xpath=(//div[normalize-space(text())="${name}"])[1]`, label: `Click the "${name}" node on the canvas` });
const panelInput = (label) => `xpath=//div[normalize-space(text())="${label}"]/following-sibling::input`;
// The canvas is the dotted box around the nodes (found by its computed background, so the check works
// whether the style is inline or a class).
const canvasBackground = (name) => ({
  eval: `(() => { let el = [...document.querySelectorAll('div')].find((d) => d.children.length === 0 && d.textContent.trim() === ${JSON.stringify(name)}); while (el && !getComputedStyle(el).backgroundImage.includes('radial-gradient')) el = el.parentElement; el.click(); })()`,
  label: 'Click an empty spot on the canvas: nothing is selected, and the panel shows the summary',
});

// Pointer events for dragging a handle (title) onto a node (its name, first match = the canvas).
const pt = (sel) => `(() => { const el = ${sel}; const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`;
const ev = (type, p) => `new PointerEvent('${type}', { bubbles: true, cancelable: true, composed: true, pointerId: 1, pointerType: 'mouse', isPrimary: true, button: 0, buttons: ${type === 'pointerup' ? 0 : 1}, clientX: ${p}.x, clientY: ${p}.y })`;
const handleEl = (title, nth = 0) => `document.querySelectorAll('[title="${title}"]')[${nth}]`;
const nameEl = (name) => `[...document.querySelectorAll('div')].find((d) => d.children.length === 0 && d.textContent.trim() === ${JSON.stringify(name)})`;
const dragFrom = (title, nth = 0) => ({
  eval: `(() => { const h = ${handleEl(title, nth)}; const p = ${pt(handleEl(title, nth))}; h.dispatchEvent(${ev('pointerdown', 'p')}); })()`,
  label: `Press on the "${title}" handle (the dot on the node's edge)`,
});
const dragOver = (name) => ({
  eval: `(() => { const p = ${pt(nameEl(name))}; window.dispatchEvent(${ev('pointermove', 'p')}); })()`,
  label: `Move the pointer onto the "${name}" node: a dashed line follows, and the node lights up green`,
});
const dragDrop = (name) => ({
  eval: `(() => { const p = ${pt(nameEl(name))}; window.dispatchEvent(${ev('pointerup', 'p')}); })()`,
  label: `Release over "${name}"`,
});

export const buildStates = () => [
  {
    name: 'structure', query: SIGNED_IN, steps: [
      ...toStructure,
      { hover: `${button('New Team')} >> nth=0`, label: 'Hover "New Team"' },
      { hover: `${button('New Division')} >> nth=1`, label: 'Hover "New Division" in the empty canvas' },
    ],
  },
  {
    name: 'structure division', query: SIGNED_IN, steps: [
      ...toStructure,
      newDivision,
      { fill: [panelInput('Division / Region Name'), 'U12 Boys'], label: 'In the side panel, type "U12 Boys" as the Division / Region Name' },
      tick,
      { click: `${button('Add Team')} >> nth=0`, label: 'Click "Add Team" under the division on the canvas: a team is added, and nothing stays selected (the click also reaches the canvas)' },
      node('New Team'),
      { fill: [panelInput('Team Name'), 'Hawks Gold'], label: 'Type "Hawks Gold" as the Team Name' },
      tick,
      { click: '[title="Add team"]', label: 'Click + on the division node: another team, selected' },
      node('U12 Boys'),
      { hover: startsWith('Delete Division'), label: 'Hover "Delete Division"' },
      canvasBackground('U12 Boys'),
    ],
  },
  {
    name: 'structure connect', query: SIGNED_IN, steps: [
      ...toStructure,
      newTeam,
      tick,
      newDivision,
      dragFrom('Drag to a division to connect'),
      dragOver('New Division'),
      { ...dragDrop('New Division'), label: 'Release over "New Division": the team connects to it, with a message' },
      tick,
      { click: `${button('New Division')} >> nth=0`, label: 'Click "New Division" again: a second division' },
      dragFrom('Drag to another division to move this team'),
      { ...dragOver('New Division'), eval: `(() => { const els = [...document.querySelectorAll('div')].filter((d) => d.children.length === 0 && d.textContent.trim() === 'New Division'); const el = els[1]; const r = el.getBoundingClientRect(); const p = { x: r.left + r.width / 2, y: r.top + r.height / 2 }; window.dispatchEvent(${ev('pointermove', 'p')}); })()`, label: 'Move the pointer onto the second division' },
      { eval: `(() => { const els = [...document.querySelectorAll('div')].filter((d) => d.children.length === 0 && d.textContent.trim() === 'New Division'); const el = els[1]; const r = el.getBoundingClientRect(); const p = { x: r.left + r.width / 2, y: r.top + r.height / 2 }; window.dispatchEvent(${ev('pointerup', 'p')}); })()`, label: 'Release: "Move New Team?" asks first' },
      { click: button('Move Team'), label: 'Click "Move Team": it moves, with a message' },
      { wait: 200, label: 'Wait 0.2 s for the pop-up to close' },
    ],
  },
  {
    name: 'structure delete', query: SIGNED_IN, steps: [
      ...toStructure,
      newDivision,
      tick,
      { click: `${button('Add Team')} >> nth=0`, label: 'Click "Add Team" under the division' },
      node('New Division'),
      { click: startsWith('Delete Division'), label: 'Click "Delete Division": its team will be kept as standalone' },
      { click: button('Cancel'), label: 'Click "Cancel"' },
      { wait: 200, label: 'Wait 0.2 s for the pop-up to close' },
      { click: startsWith('Delete Division'), label: 'Click "Delete Division" again' },
      { click: button('Delete'), label: 'Click "Delete": the division goes, its team stays as an unassigned team' },
      { wait: 200, label: 'Wait 0.2 s for the pop-up to close' },
      node('New Team'),
      { click: startsWith('Delete Team'), label: 'Click "Delete Team"' },
      { click: button('Delete'), label: 'Click "Delete": the canvas is empty again' },
      { wait: 200, label: 'Wait 0.2 s for the pop-up to close' },
    ],
  },
  {
    name: 'structure review', query: SIGNED_IN, steps: [
      ...toStructure,
      newDivision,
      tick,
      { click: `${button('Add Team')} >> nth=0`, label: 'Click "Add Team" under the division' },
      tick,
      { click: `${button('Add Team')} >> nth=0`, label: 'Click "Add Team" again' },
      tick,
      newTeam,
      { ...cont, label: 'Click CONTINUE: Step 3, Add Products' },
      { ...cont, label: 'Click CONTINUE: Review & Deploy lists the division with its teams, and the standalone team' },
      { click: 'xpath=//button[.//span[normalize-space(text())="Divisions & Teams"]]', label: 'Click "Divisions & Teams" in the stepper: back to Step 2, as it was' },
    ],
  },
];

export default {
  name: 'Workspace Add Store wizard: Divisions & Teams (Module 3)',
  page: 'Workspace.dc.html',
  ready: 'h1',
  seedRandom: true,
  settleMs: 300, // the workspace is a large page: give it longer to finish rendering after each step
  viewports: [{ width: 1440, height: 1800 }],
  related: [
    {
      name: 'The wizard frame and Basics',
      where: 'CreateForm and Step1Basics in workspace-app.jsx',
      how: 'Part 2a, checked by workspace-create-store.mjs. The states go through Basics (a League store) to reach Divisions & Teams.',
    },
    {
      name: 'Add Products and Review & Deploy',
      where: 'Step3Products and Step6Review in workspace-app.jsx',
      how: 'Parts 2b and 2c, checked by workspace-create-store-products.mjs and -review.mjs. CONTINUE goes on to them; the teams made here are what Assign to Teams offers.',
    },
    {
      name: 'A store\'s My Team(s) tab',
      where: 'TeamCanvasView (outside wizard mode), BankZone, CpCatalogDrawer, CpDivisionPanel, CpTeamPanel in workspace-app.jsx',
      how: 'The same editor with branding, team codes, managers, rosters, the Roster Bank and products. Not converted yet.',
    },
  ],
  states: buildStates(),
};
