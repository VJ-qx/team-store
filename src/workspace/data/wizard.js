// Data for the Add Store wizard (Module 3, FR-3.1): step lists, the Basics choices, sports, salespeople,
// the Team Database, saved logos, team colors, jersey number options, the announcement placeholder and the
// tax tables. Copied unchanged from the prototype (workspace-app.jsx / workspace-app-integrated.jsx); the
// choice cards' icons are components instead of render functions.
import { IconBag, IconClock, IconLayers, IconLock, IconUsers } from '../components/icons.js';

export const WIZARD_STEPS = [
  { key: "basics", label: "Basics" },
  { key: "products", label: "Add Products" },
  { key: "review", label: "Review & Deploy" },
];
// Store-type-dependent step lists. League Stores get a Divisions & Teams step
// between Basics and Add Products. Before a Store Type is chosen the stepper
// shows the League (4-step) form — collapsing to 3 on picking Individual reads
// as a simplification; growing mid-task reads as the app changing the rules.

export const WIZARD_STEPS_LEAGUE = [
  { key: "basics", label: "Basics" },
  { key: "structure", label: "Divisions & Teams" },
  { key: "products", label: "Add Products" },
  { key: "review", label: "Review & Deploy" },
];

export const STORE_TYPES = [
  {
    key: "league",
    name: "League Store",
    tag: "League Store",
    icon: IconLayers,
    desc: "The Multi-Team Hub. Optimized for full leagues, multi-club organizations, and tournament circuits. Unlocks advanced structural hierarchies to manage distinct locations, tiered age divisions, endless uniform variations, and multi-roster sheets.",
    points: ["Divisions & teams on a visual canvas", "Product-to-team assignment", "Per-team branding & managers"],
  },
  {
    key: "single",
    name: "Individual Team Store",
    tag: "Individual Team Store",
    icon: IconUsers,
    desc: "The Single-Team Locker. Optimized for a standalone squad, independent club, or single school team. Outfitted with a streamlined workflow for one uniform profile, a single roster sheet, and immediate deployment.",
    points: ["One roster sheet", "One uniform profile", "Immediate deployment"],
  },
];

// Rich store-type dropdown — collapsed trigger shows the current selection;
// opening reveals both configurations with descriptive helper copy.

export const STORE_SCHEDULES = [
  { key: "popup", title: "Temporary Pop-Up", icon: IconClock, desc: "Best for player uniforms and seasonal spiritwear. Closes on a set date for bulk production." },
  { key: "locker", title: "Always-On Locker", icon: IconLock, desc: "Perfect for continuous school branding, year-round academy shirts, or coach merchandise." },
];

export const FULFILLMENT_METHODS = [
  { key: "coach", title: "Ship to Team Manager", badge: "FREE", icon: IconUsers, desc: "All orders are sorted by player roster name and dispatched in bulk directly to the Coach or Director." },
  { key: "home", title: "Direct-To-Home Residential Delivery", icon: IconBag, desc: "Individual carrier shipping rates applied — packages sent directly to each customer's door." },
];

// Teams pulled from the team database (mock).

export const WIZARD_SPORTS = ["Baseball", "Basketball", "Football", "Hockey", "Lacrosse", "Soccer", "Softball", "Track & Field", "Volleyball", "Wrestling", "Cheer", "Golf"];

// Account reps available as a point of contact (mock salesperson directory).

export const SALESPEOPLE = [
  { value: "braeden-stokes", label: "Braeden Stokes", email: "braeden@stokesathletics.com", phone: "208-654-8619" },
  { value: "maria-lopez", label: "Maria Lopez", email: "maria@prolook.com", phone: "801-555-0142" },
  { value: "devon-pierce", label: "Devon Pierce", email: "devon@prolook.com", phone: "801-555-0188" },
];

// PROLOOK service desk — the default footer contact.

export const TEAM_DATABASE = [
  { id: "carlsbad-padres", name: "Carlsbad Padres", address: "3557 Lancer Way, Carlsbad, CA 92008", mono: "CP", logoColor: "#1c2a5e", primary: "#1c2a5e", secondary: "#f5a800", sports: ["Baseball"], mascot: 9, master: 4 },
  { id: "valley-hoyas", name: "Valley Hoyas", address: "812 Mountain Rd, Provo, UT 84604", mono: "VH", logoColor: "#0e0e10", primary: "#0e0e10", secondary: "#9b1b30", sports: ["Basketball", "Track & Field"], mascot: 12, master: 5 },
  { id: "north-rams", name: "North Rams", address: "245 Field Ave, Perrisville, CA 92571", mono: "NR", logoColor: "#1f7a44", primary: "#1f8a55", secondary: "#f5a800", sports: ["Football", "Wrestling"], mascot: 0, master: 0 },
  { id: "honey-badgers", name: "Honey Badgers", address: "98 Canyon Blvd, Tucson, AZ 85704", mono: "HB", logoColor: "#b5760a", primary: "#f5a800", secondary: "#0e0e10", sports: ["Soccer"], mascot: 4, master: 1 },
  { id: "abbeville-christian", name: "Abbeville Christian Academy", address: "9 M L Tillis Dr, Abbeville, AL 36310", mono: "AC", logoColor: "#4a148c", primary: "#4a148c", secondary: "#c5b358", sports: ["Football", "Basketball", "Baseball"], mascot: 6, master: 2 },
  { id: "aaron-academy", name: "Aaron Academy", address: "645 East Main Street, Hendersonville, TN 37075", mono: "AA", logoColor: "#9b1b30", primary: "#9b1b30", secondary: "#0e0e10", sports: ["Soccer", "Volleyball"], mascot: 2, master: 1 },
  { id: "21st-century", name: "21st Century Charter School", address: "724 Washington St, Gary, IN 46402", mono: "21", logoColor: "#1f53c4", primary: "#1f53c4", secondary: "#f5a800", sports: ["Basketball", "Track & Field"], mascot: 8, master: 1 },
  { id: "91st-psalm", name: "91st Psalm Christian School", address: "2020 E Baseline Rd, Phoenix, AZ 85042", mono: "91", logoColor: "#2563eb", primary: "#2563eb", secondary: "#0e0e10", sports: ["Cheer", "Soccer"], mascot: 0, master: 0 },
];

// A single labeled progress bar — used for the Mascot Traced / Master Reference
// metrics columns in the team database rows.

export const SAVED_LOGOS_SEED = [
{ id: "l-padres", name: "Carlsbad Padres", mono: "CP", color: "#1d3a8a", favorite: true, recent: true },
{ id: "l-eazy-1", name: "Final Eazy Clean Utah", mono: "EC", color: "#b3a24c", favorite: false, recent: true },
{ id: "l-eazy-2", name: "Eazy Clean Utah", mono: "EU", color: "#8f8748", favorite: false, recent: false },
{ id: "l-broncos", name: "Broncos", mono: "D", color: "#e8590c", favorite: true, recent: false },
{ id: "l-hoyas", name: "Valley Hoyas", mono: "VH", color: "#0e0e10", favorite: false, recent: true },
{ id: "l-rams", name: "North Rams", mono: "NR", color: "#1f7a44", favorite: false, recent: false }];


// Renders a saved logo: real artwork if uploaded, otherwise a monogram disc.

export const PROLOOK_COLORS = [
{ code: "BK", name: "Black", hex: "#0e0e10" },
{ code: "WH", name: "White", hex: "#ffffff" },
{ code: "M", name: "Maroon", hex: "#4a1416" },
{ code: "SE", name: "Sangria", hex: "#6e1423" },
{ code: "C", name: "Cardinal", hex: "#9b1b30" },
{ code: "BRR", name: "Brick", hex: "#b3202a" },
{ code: "R", name: "Red", hex: "#e1251b" },
{ code: "UR", name: "Ultra Red", hex: "#e23744" },
{ code: "TX", name: "Texas Orange", hex: "#bf5700" },
{ code: "O", name: "Orange", hex: "#e8590c" },
{ code: "TO", name: "Tangerine", hex: "#f7941d" },

{ code: "G", name: "Gold", hex: "#f5a800" },
{ code: "Y", name: "Yellow", hex: "#ffd400" },
{ code: "OP", name: "Olive Pop", hex: "#9aab2e" },
{ code: "S", name: "Slime", hex: "#b5e61d" },
{ code: "DF", name: "Dark Forest", hex: "#14532d" },
{ code: "FG", name: "Forest Green", hex: "#2e7d32" },
{ code: "RG", name: "Rifle Green", hex: "#3a431e" },
{ code: "KG", name: "Kelly Green", hex: "#1f9d55" },
{ code: "MO", name: "Moss", hex: "#6b7a3a" },
{ code: "LG", name: "Light Green", hex: "#5cb85c" },
{ code: "MB", name: "Mint Blue", hex: "#18b39c" },

{ code: "T", name: "Teal", hex: "#2b8a8a" },
{ code: "IB", name: "Ice Blue", hex: "#6f93ad" },
{ code: "AB", name: "Azure Blue", hex: "#3f8edc" },
{ code: "CA", name: "Carolina", hex: "#6fb0e6" },
{ code: "CB", name: "Columbia Blue", hex: "#a9cce8" },
{ code: "DN", name: "Dark Navy", hex: "#16203f" },
{ code: "NB", name: "Navy Blue", hex: "#1c2a5e" },
{ code: "UN", name: "Union", hex: "#1f357a" },
{ code: "DR", name: "Deep Royal", hex: "#1746a2" },
{ code: "RB", name: "Royal Blue", hex: "#1f53c4" },
{ code: "AR", name: "Azure Royal", hex: "#2563eb" },

{ code: "DP", name: "Deep Purple", hex: "#371a6e" },
{ code: "P", name: "Purple", hex: "#4a148c" },
{ code: "LV", name: "Lavender", hex: "#b39ddb" },
{ code: "NP", name: "Neon Pink", hex: "#ff4da6" },
{ code: "PK", name: "Pink", hex: "#ffb6d5" },
{ code: "BR", name: "Brown", hex: "#3e2723" },
{ code: "YB", name: "Yukon Brown", hex: "#5d4037" },
{ code: "BG", name: "Bog", hex: "#7c6f2c" },
{ code: "OG", name: "Old Gold", hex: "#c39b1e" },
{ code: "VG", name: "Vegas Gold", hex: "#c5b358" },
{ code: "DS", name: "Desert Sand", hex: "#d6c7a1" },

{ code: "CR", name: "Cream", hex: "#f4efe1" },
{ code: "CG", name: "Charcoal Gray", hex: "#44474a" },
{ code: "GR", name: "Gray", hex: "#8b8d90" },
{ code: "CC", name: "Carbon", hex: "#54605a" },
{ code: "AG", name: "Ash Gray", hex: "#b2b6b8" },
{ code: "SG", name: "Silver Gray", hex: "#ccd0d2" }];


// Pick black/white text for legibility on a given swatch hex.

export const NUMBER_SELECTION_OPTS = [
  { key: "manager", title: "Team manager chooses on behalf of players", desc: "The manager assigns each player's jersey number on the roster. Buyers see their assigned number on the product page — no number entry at checkout." },
  { key: "player", title: "Players choose their own numbers", desc: "Buyers enter a jersey number on the product page when ordering numbered gear. The roster fills in as orders come through." },
];

export const ANN_PLACEHOLDER = "e.g. Welcome to the 2026 season store! Orders close Friday, May 22 — jerseys arrive about 3 weeks after the store closes. Sizing runs small; most players go up one size. All items are custom-made to order, so no returns or exchanges on personalized gear. Everything ships free to the coach for handout at practice.";

export const TEAMS_TO_CONNECT = [
{ value: "carlsbad-padres", label: "Carlsbad Padres" },
{ value: "valley-hoyas", label: "Valley Hoyas" },
{ value: "north-rams", label: "North Rams" },
{ value: "honey-badgers", label: "Honey Badgers" },
{ value: "general-fc", label: "General FC" },
{ value: "create-new", label: "+ Create new team…" }];

export const EG_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia",
  "Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland",
  "Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey",
  "New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina",
  "South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming",
];

// ─────────── Shared modal chrome ───────────

export const TAX_STATE_ABBR = { Alabama: "AL", Alaska: "AK", Arizona: "AZ", Arkansas: "AR", California: "CA", Colorado: "CO", Connecticut: "CT", Delaware: "DE", Florida: "FL", Georgia: "GA", Hawaii: "HI", Idaho: "ID", Illinois: "IL", Indiana: "IN", Iowa: "IA", Kansas: "KS", Kentucky: "KY", Louisiana: "LA", Maine: "ME", Maryland: "MD", Massachusetts: "MA", Michigan: "MI", Minnesota: "MN", Mississippi: "MS", Missouri: "MO", Montana: "MT", Nebraska: "NE", Nevada: "NV", "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY", "North Carolina": "NC", "North Dakota": "ND", Ohio: "OH", Oklahoma: "OK", Oregon: "OR", Pennsylvania: "PA", "Rhode Island": "RI", "South Carolina": "SC", "South Dakota": "SD", Tennessee: "TN", Texas: "TX", Utah: "UT", Vermont: "VT", Virginia: "VA", Washington: "WA", "West Virginia": "WV", Wisconsin: "WI", Wyoming: "WY" };
// Type-ahead single-select over EG_STATES; filters by name or abbreviation and
// stays browsable when nothing is typed. Selection auto-fills the tax rate.

export const STATE_TAX_RATES = {
  Alabama: 4.00, Alaska: 0.00, Arizona: 5.60, Arkansas: 6.50, California: 7.25, Colorado: 2.90,
  Connecticut: 6.35, Delaware: 0.00, Florida: 6.00, Georgia: 4.00, Hawaii: 4.00, Idaho: 6.00,
  Illinois: 6.25, Indiana: 7.00, Iowa: 6.00, Kansas: 6.50, Kentucky: 6.00, Louisiana: 4.45,
  Maine: 5.50, Maryland: 6.00, Massachusetts: 6.25, Michigan: 6.00, Minnesota: 6.875, Mississippi: 7.00,
  Missouri: 4.225, Montana: 0.00, Nebraska: 5.50, Nevada: 6.85, "New Hampshire": 0.00, "New Jersey": 6.625,
  "New Mexico": 5.125, "New York": 4.00, "North Carolina": 4.75, "North Dakota": 5.00, Ohio: 5.75,
  Oklahoma: 4.50, Oregon: 0.00, Pennsylvania: 6.00, "Rhode Island": 7.00, "South Carolina": 6.00,
  "South Dakota": 4.20, Tennessee: 7.00, Texas: 6.25, Utah: 6.10, Vermont: 6.00, Virginia: 5.30,
  Washington: 6.50, "West Virginia": 6.00, Wisconsin: 5.00, Wyoming: 4.00,
};
