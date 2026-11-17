// Add Products fixtures: the wizard's saved designs and carts, Customize New Product's sports and products,
// the product photo set, and the sizes a Stock Vault item can offer.
// Copied unchanged from the prototype (workspace-app.jsx / workspace-app-integrated.jsx).
import { INTEGRATION } from '../integration.js';

// Reps pull products from pre-existing saved work (Saved Designs + Saved Carts),
// mirroring the dashboard's "Add Saved Design" / "Add From Cart" injection paths.
export const WIZARD_SAVED_DESIGNS = INTEGRATION.on ? [
  { id: "sd2", title: "WARRIORS", sport: "Baseball", category: "Uniform Jersey", block: "Sublimated Traditional, Two-Button Jersey", photo: "jersey-warriors", adult: "65.41", youth: "58.13", teamProfit: 17.5 },
  { id: "sd3", title: "PADRES HOME", sport: "Baseball", category: "Uniform Jersey", block: "Sublimated Traditional, Full-Button Jersey", photo: "jersey-padres", adult: "62.00", youth: "55.00", teamProfit: 16.0 },
  { id: "sd4", title: "ASTEROID KIT", sport: "Football", category: "Uniform Jersey", block: "Sublimated, Set-in Sleeve Jersey", photo: "jersey-asteroid", adult: "70.00", youth: "62.00", teamProfit: 18.0 },
  { id: "sd6", title: "TEAM PANTS NAVY", sport: "Baseball", category: "Team Pants", block: "Sublimated Traditional, Knicker Length, Elastic Cuff Pant", photo: "pants-navy", adult: "39.50", youth: "34.00", teamProfit: 9.0 },
] : [
  { id: "sd1", title: "HOYAS WHITE", sport: "Basketball", category: "Uniform Jersey", block: "SFN Lite, V-Neck Jersey", photo: "jersey-grizzlies", adult: "65.41", youth: "58.13", teamProfit: 17.5 },
  { id: "sd2", title: "HOYAS DARK", sport: "Basketball", category: "Uniform Jersey", block: "2-Ply Reversible Jersey", photo: "jersey-warriors", adult: "65.41", youth: "58.13", teamProfit: 17.5 },
  { id: "sd3", title: "FALCONS HOME", sport: "Baseball", category: "Uniform Jersey", block: "Sublimated Traditional, Full-Button Jersey", photo: "jersey-padres", adult: "62.00", youth: "55.00", teamProfit: 16.0 },
  { id: "sd4", title: "ASTEROID KIT", sport: "Football", category: "Uniform Jersey", block: "Sublimated, Set-in Sleeve Jersey", photo: "jersey-asteroid", adult: "70.00", youth: "62.00", teamProfit: 18.0 },
  { id: "sd5", title: "LANCERS WARM-UP", sport: "Soccer", category: "Warm-Up Jacket", block: "Full-Zip, Tricot Warm-Up Jacket", photo: "jersey-lancers", adult: "72.00", youth: "64.00", teamProfit: 19.0 },
  { id: "sd6", title: "TEAM PANTS NAVY", sport: "Baseball", category: "Team Pants", block: "Sublimated Traditional, Knicker Length, Elastic Cuff Pant", photo: "pants-navy", adult: "39.50", youth: "34.00", teamProfit: 9.0 },
];

export const WIZARD_SAVED_CARTS = [
  { id: "sc1", name: "Hoyas — Jersey + Hat Bundle", total: 624.0, items: [
    { id: "sc1-0", title: "Home Jersey", photo: "jersey-grizzlies", adult: "65.41", youth: "58.13", teamProfit: 17.5 },
    { id: "sc1-1", title: "Away Jersey", photo: "jersey-warriors", adult: "65.41", youth: "58.13", teamProfit: 17.5 },
    { id: "sc1-2", title: "Team Shorts", photo: "shorts-green", adult: "28.00", youth: "24.00", teamProfit: 7.5 },
  ] },
  { id: "sc2", name: "Spring Practice Tees", total: 312.5, items: [
    { id: "sc2-0", title: "Practice Tee", photo: "jersey-padres", adult: "24.00", youth: "20.00", teamProfit: 6.0 },
    { id: "sc2-1", title: "Mesh Short", photo: "shorts-navy", adult: "26.00", youth: "22.00", teamProfit: 6.5 },
  ] },
  { id: "sc3", name: "Full Team Travel Kit", total: 980.0, items: [
    { id: "sc3-0", title: "Game Jersey", photo: "jersey-asteroid", adult: "70.00", youth: "62.00", teamProfit: 18.0 },
    { id: "sc3-1", title: "Team Pants", photo: "pants-navy", adult: "39.50", youth: "34.00", teamProfit: 9.0 },
    { id: "sc3-2", title: "Warm-Up Jacket", photo: "jersey-lancers", adult: "72.00", youth: "64.00", teamProfit: 19.0 },
    { id: "sc3-3", title: "Team Shorts", photo: "shorts-green", adult: "28.00", youth: "24.00", teamProfit: 7.5 },
  ] },
];

// Curated catalog of real product photos. Products are mapped to one of these
// deterministically so a given product always shows the same photo.
export const PRODUCT_PHOTOS = [
"assets/products/jersey-grizzlies.png",
"assets/products/jersey-lancers.png",
"assets/products/jersey-padres.png",
"assets/products/jersey-warriors.png",
"assets/products/jersey-asteroid.png",
"assets/products/pants-navy.png",
"assets/products/pants-orange.png",
"assets/products/shorts-green.png",
"assets/products/shorts-navy.png"];

// Men's catalog (order matches the reference design).
export const MEN_CATEGORIES = [
  { id: "accessories",  label: "Accessories",   sport: "Accessories",   img: "accessories.svg" },
  { id: "apparel",      label: "Apparel",        sport: "Apparel",       img: "apparel-m.svg" },
  { id: "basketball",   label: "Basketball",     sport: "Basketball",    img: "basketball-m.svg" },
  { id: "baseball",     label: "Baseball",       sport: "Baseball",      img: "baseball-m.svg" },
  { id: "cheer",        label: "Cheer",          sport: "Cheer",         img: "cheer-m.svg" },
  { id: "football",     label: "Football",       sport: "Football",      img: "football-m.svg" },
  { id: "lacrosse",     label: "Lacrosse",       sport: "Lacrosse",      img: "lacrosse-m.svg" },
  { id: "soccer",       label: "Soccer",         sport: "Soccer",        img: "soccer-m.svg" },
  { id: "tennis",       label: "Tennis",         sport: "Tennis",        img: "tennis-m.svg" },
  { id: "track-field",  label: "Track & Field",  sport: "Track & Field", img: "trackfield-m.svg" },
  { id: "volleyball",   label: "Volleyball",     sport: "Volleyball",    img: "volleyball-m.svg" },
  { id: "wrestling",    label: "Wrestling",      sport: "Wrestling",     img: "wrestling-m.svg" },
];

// Women's catalog (order matches the reference design).
export const WOMEN_CATEGORIES = [
  { id: "accessories",  label: "Accessories",   sport: "Accessories",   img: "accessories.svg" },
  { id: "apparel",      label: "Apparel",        sport: "Apparel",       img: "apparel-w.svg" },
  { id: "basketball",   label: "Basketball",     sport: "Basketball",    img: "basketball-w.svg" },
  { id: "cheer",        label: "Cheer",          sport: "Cheer",         img: "cheer-w.svg" },
  { id: "fastpitch",    label: "Fastpitch",      sport: "Softball",      img: "fastpitch-w.svg" },
  { id: "field-hockey", label: "Field Hockey",   sport: "Field Hockey",  img: "field-hockey-w.svg" },
  { id: "soccer",       label: "Soccer",         sport: "Soccer",        img: "soccer-w.svg" },
  { id: "tennis",       label: "Tennis",         sport: "Tennis",        img: "tennis-w.svg" },
  { id: "track-field",  label: "Track & Field",  sport: "Track & Field", img: "trackfield-w.svg" },
  { id: "volleyball",   label: "Volleyball",     sport: "Volleyball",    img: "volleyball-w.svg" },
  { id: "wrestling",    label: "Wrestling",      sport: "Wrestling",     img: "wrestling-w.svg" },
];

// Sports that only exist in the women's catalog — used to pick a sensible
// default tab when the store's sport implies a gender.
export const WOMEN_ONLY = ["Softball", "Field Hockey"];

// Integrated workspace (Marucci): customize-new-product picker is limited to these four sports.
const CUST_SPORTS = ["Accessories", "Apparel", "Baseball", "Softball"];
// Customize New Product's sport cards: the full catalogs, or the integrated workspace's four sports.
export const CUST_MEN_CATEGORIES = INTEGRATION.on ? [
  ...MEN_CATEGORIES.filter((c) => CUST_SPORTS.includes(c.sport)),
  { id: "fastpitch", label: "Softball", sport: "Softball", img: "baseball-m.svg" },
] : MEN_CATEGORIES;
export const CUST_WOMEN_CATEGORIES = INTEGRATION.on ? [
  ...WOMEN_CATEGORIES.filter((c) => CUST_SPORTS.includes(c.sport) && c.sport !== "Softball"),
  { id: "baseball", label: "Baseball", sport: "Baseball", img: "fastpitch-w.svg" },
  { id: "fastpitch", label: "Softball", sport: "Softball", img: "fastpitch-w.svg" },
] : WOMEN_CATEGORIES;

export const SPORT_STYLE_COUNTS = { accessories: 18, apparel: 32, basketball: 24, baseball: 28, cheer: 12, football: 30, lacrosse: 14, soccer: 22, tennis: 10, "track-field": 16, volleyball: 20, wrestling: 8, fastpitch: 18, "field-hockey": 10 };

// Step 1 – Product picker for the selected sport
export const CUST_BASKETBALL_PRODUCTS = [
  { id: "bb-hoyas",    name: "Hoyas",      photo: "assets/products/jersey-grizzlies.png" },
  { id: "bb-huskies",  name: "Huskies",    photo: "assets/products/jersey-warriors.png"  },
  { id: "bb-wolves",   name: "Wolves",     photo: "assets/products/jersey-asteroid.png"  },
  { id: "bb-gold",     name: "Gold State", photo: "assets/products/jersey-padres.png"    },
  { id: "bb-lancers",  name: "Lancers",    photo: "assets/products/jersey-lancers.png"   },
  { id: "bb-grizzly",  name: "Grizzlies",  photo: "assets/products/jersey-grizzlies.png" },
  { id: "bb-warriors", name: "Warriors",   photo: "assets/products/jersey-warriors.png"  },
  { id: "bb-memphis",  name: "Memphis",    photo: "assets/products/jersey-asteroid.png"  },
];

// Interstitial when adding a Pro Stock / Sideline item to a store: pick the
// sizes and color ways the store will offer (multi-select each).
export const VAULT_OFFER_ADULT = ["S", "M", "L", "XL", "2XL", "3XL"];
export const VAULT_OFFER_YOUTH = ["YS", "YM", "YL"];
