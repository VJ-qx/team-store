// Sample stores. Moved unchanged from workspace-app.jsx and workspace-app-integrated.jsx; the
// integrated workspace has its own two seed stores, two archived stores and vault products.
// The function names stay as in the prototype: the parity tool seeds Math.random per calling
// function (makeSeedStores draws the random revenue figures).
import { INTEGRATION } from '../../../utils/integration.js';
import { vaultDefaultProducts } from './vault.js';

export const CREATED_STORES_KEY = "ts_created_stores_v1";

export function loadCreatedStores() {
  try {
    const raw = JSON.parse(localStorage.getItem(CREATED_STORES_KEY) || "[]");
    return Array.isArray(raw) ? raw.map((s) => ({ ...s, __fresh: false })) : [];
  } catch (e) { return []; }
}

export function saveCreatedStores(list) {
  try {
    localStorage.setItem(CREATED_STORES_KEY, JSON.stringify(list, (k, v) => {
      if (k === "thumbnail") return undefined; // React elements don't serialize
      if (v && typeof v === "object" && v.$$typeof) return undefined;
      return v;
    }));
  } catch (e) {}
}

export function makeSeedStores() {
  if (INTEGRATION.on) {
    const base = [
      // ownership: "mine" → created by the logged-in user. Both seed stores are Open League baseball stores.
      { name: "Knights Knation Baseball", city: "Baton Rouge", state: "Louisiana", color: "#1e3a6e", initials: "KK", ownership: "mine", createdBy: "Jack White", storeType: "league", dist: "coach", codeMode: "team", sport: "Baseball", revenue: 38420.5, announcement: "<p><strong>Orders close July 24</strong> \u2014 gear ships about 3 weeks after the store closes. Jerseys run true to size. Custom bats and gloves are made to order, so no returns or exchanges on personalized items.</p>" },
      { name: "Pelicans Baseball", city: "New Orleans", state: "Louisiana", color: "#0f766e", initials: "PB", ownership: "mine", createdBy: "Jack White", storeType: "league", dist: "coach", loc: "p1", codeMode: "team", sport: "Baseball", revenue: 27115.25 },
    ];
    return base.map((b, i) => ({
      id: "seed-" + i,
      ownership: b.ownership,
      createdByName: b.createdBy,
      seller: b.seller || "Marucci Team Stores",
      entitledBrands: b.entitledBrands || ["Marucci", "Victus", "Prolook"],
      storeTitle: b.name,
      teamName: b.name,
      storeType: b.storeType || "single",
      rosterProfile: b.rosterProfile,
      teamColors: [b.color, "#0e0e10", "#ffffff"],
      teamLogo: null,
      sport: b.sport || (b.storeType === "league" ? "Basketball" : "Football"),
      contactPref: "Email & Phone",
      email: "coach@example.com",
      phone: "555-123-4567",
      storeOpenMode: "set-window",
      // Staggered per-team windows — distinct start dates, spans of 30 / 60 / 90 days.
      storeOpenStart: ["2026-06-01", "2026-06-15"][i % 2],
      storeOpenEnd: ["2026-07-24", "2026-08-07"][i % 2],
      shipFirstName: "Bismo",
      shipLastName: "Funyuns",
      shipName: "Bismo Funyuns",
      shipStreet: b.loc ? "" : "123 Sports Way",
      shipCity: b.loc ? "" : b.city,
      shipState: b.loc ? "" : b.state,
      shipZip: b.loc ? "" : "92009",
      shipCountry: "United States",
      shipOption: "Ship to Coach",
      distributionModel: b.dist || "coach",
      shipLocationId: b.loc || null,
        codeMode: b.codeMode || "store",
        createdBy: b.createdBy,
      saveToAddressBook: true,
      collectTax: true,
      taxRate: "7.75",
      fundraisingEnabled: true,
      announcement: b.announcement || "",
      revenue: b.revenue != null ? b.revenue : Math.round((Math.random() * 1800 + 200) * 100) / 100,
    }));
  }
  const base = [
    // ownership: "mine" → created by the logged-in user; "joined" → granted admin access by others / inherited via org role.
    { name: "Jazz Bantum Boys Basketball", city: "Riverside", state: "California", color: "#7c1d2b", initials: "JB", ownership: "mine", createdBy: "Hingle McCringleberry", storeType: "league", dist: "coach", codeMode: "team", announcement: "<p><strong>Orders close June 19</strong> \u2014 uniforms arrive about 3 weeks after the store closes. Jerseys run small; most players size up one. All custom gear is made to order, so no returns or exchanges on personalized items.</p>" },
    { name: "Rams", city: "Perrisville", state: "California", color: "#ec6c2a", initials: "RA", ownership: "mine", createdBy: "George Harrison" },
    { name: "Honey Badgers", city: "Perrisville", state: "California", color: "#f5b400", initials: "HB", ownership: "joined", createdBy: "Marcy Feldman" },
    // Roster-optional real-world stores: team mapping done but zero rosters (fills from checkout)…
    { name: "Wasatch Elite Lacrosse", city: "Draper", state: "Utah", color: "#1e3a6e", initials: "WL", ownership: "mine", createdBy: "Hingle McCringleberry", storeType: "league", dist: "coach", loc: "p1", sport: "Lacrosse", rosterProfile: "teams-only", revenue: 18240.5 },
    // …and no teams at all — fan-gear only; team gear is locked until teams or divisions exist.
    { name: "Bayshore Summer Classic", city: "Huntington Beach", state: "California", color: "#0f766e", initials: "BC", ownership: "mine", createdBy: "Hingle McCringleberry", storeType: "league", dist: "coach", loc: "p1", sport: "Volleyball", rosterProfile: "unstructured", revenue: 46870.25 },
  ];
  return base.map((b, i) => ({
    id: "seed-" + i,
    ownership: b.ownership,
    createdByName: b.createdBy,
    storeTitle: b.name,
    teamName: b.name,
    storeType: b.storeType || "single",
    rosterProfile: b.rosterProfile,
    teamColors: [b.color, "#0e0e10", "#ffffff"],
    teamLogo: null,
    sport: b.sport || (b.storeType === "league" ? "Basketball" : "Football"),
    contactPref: "Email & Phone",
    email: "coach@example.com",
    phone: "555-123-4567",
    storeOpenMode: "set-window",
    // Staggered per-team windows — distinct start dates, spans of 30 / 60 / 90 days.
    storeOpenStart: ["2026-05-20", "2026-05-01", "2026-04-10", "2026-05-25"][i % 4],
    storeOpenEnd: ["2026-06-19", "2026-06-30", "2026-07-09", "2026-07-24"][i % 4],
    shipFirstName: "Bismo",
    shipLastName: "Funyuns",
    shipName: "Bismo Funyuns",
    shipStreet: b.loc ? "" : "123 Sports Way",
    shipCity: b.loc ? "" : b.city,
    shipState: b.loc ? "" : b.state,
    shipZip: b.loc ? "" : "92009",
    shipCountry: "United States",
    shipOption: "Ship to Coach",
    distributionModel: b.dist || "coach",
    shipLocationId: b.loc || null,
      createdBy: b.createdBy,
      codeMode: b.codeMode || "store",
    saveToAddressBook: true,
    collectTax: true,
    taxRate: "7.75",
    fundraisingEnabled: true,
    announcement: b.announcement || "",
    revenue: b.revenue != null ? b.revenue : Math.round((Math.random() * 1800 + 200) * 100) / 100,
  }));
}

export function makeSeededStores() {
  if (INTEGRATION.on) {
    const seeded = makeSeedStores();
    const curatedA = ["RCKLESS OG USA -8", "Code USA Baseball -10", "Blacksmith Wrap Adult Batting Gloves", "Blacksmith Wrap Youth Batting Gloves", "Lizard Skins Cypress 43A2LS 11.50\" I-Web", "CFT Mid Molded", "Belt"];
    const curatedB = ["F5 USA Baseball -10", "Fractal USA Baseball -12", "PWR Fade Batting Gloves", "PWR Fade Youth Batting Gloves", "Lizard Skins Cypress 98R3LS 12.75\" H-Web", "CFT Turf", "Belt", "Marucci Flow Rope Hat"];
    const active = seeded.map((s, i) => ({ ...s, seeded: true, live: true, status: "active", products: vaultDefaultProducts(s.id, i === 0 ? curatedA : curatedB) }));
    return [...active, ...makeArchivedStores()];
  }
  const seeded = makeSeedStores();
  const active = seeded.map((s, i) => {
    const TEAM = (s.teamName || "").toUpperCase();
    if (i === 0) {
      return { ...s, seeded: true, live: true, status: "active", products: [
        { id: s.id + "-p1", title: "Custom Basketball Jersey — Home", photo: "jersey-grizzlies", subtitle: "SFN Lite, V-Neck Jersey", sku: "QXSFNLJ", status: "published", teamSetting: "team-required", source: "design", hasOrders: true, storeCategory: "Team Gear", storeSubcategory: "Uniforms", rosters: [] },
        { id: s.id + "-p2", title: "City A Green Alternate Jersey", photo: "jersey-asteroid", subtitle: "Sublimated Set-In, 2-Button Jersey", status: "published", teamSetting: "team-required", rosters: ["sf-8", "sf-10", "sf-12", "sf-14"] },
        { id: s.id + "-p3", title: "Corner Canyon Shooting Shirt",        photo: "hooded-tech-tee", subtitle: "Sublimated Tapered, Full-Length, Elastic Cuff Pant", status: "draft",     teamSetting: "team-required", rosters: ["af-12", "af-14"] },
        { id: s.id + "-p4", title: "League Warm-Up Hoodie",         photo: "performance-hoodie", subtitle: "PLWH-220 · placement saved · art: Draft", sku: "PLWH-220", status: "draft",     teamSetting: "team-supplied", rosters: [], brand: "Prolook", source: "Decorated stock", category: "Fleece", deco: "draft", decoratable: true },
      ] };
    }
    if (i === 1) {
      return { ...s, seeded: true, live: true, status: "active", products: [
        { id: s.id + "-p1", title: "Team Tee", subtitle: "Sublimated Set-In, Full Button Jersey", status: "published", teamSetting: "team-supplied", source: "cart", hidden: true },
      ] };
    }
    if (i === 4) {
      // Wasatch Elite Lacrosse — live, teams mapped, rosters back-filling from orders.
      return { ...s, seeded: true, live: true, status: "active", products: [
        { id: s.id + "-p1", title: "Lacrosse Game Jersey — Home", subtitle: "Sublimated Set-In Lacrosse Jersey", status: "published", teamSetting: "team-required", rosters: [] },
        { id: s.id + "-p2", title: "Lacrosse Game Shorts", subtitle: "Sublimated Lacrosse Short", status: "published", teamSetting: "team-required", rosters: [] },
        { id: s.id + "-p3", title: "Shooter Shirt — Practice", subtitle: "Sublimated Long-Sleeve Shooter", status: "published", teamSetting: "team-supplied", rosters: [] },
        { id: s.id + "-p4", title: "Wasatch Elite Fan Tee", subtitle: "Cotton-Blend Fan Tee", status: "published", teamSetting: "fan-gear", rosters: [] },
      ] };
    }
    if (i === 5) {
      // Bayshore Summer Classic — live, fan-gear only. No teams or divisions exist,
      // so Team Required / Team Supplied can't be set and the roster bank stays empty.
      return { ...s, seeded: true, live: true, status: "active", products: [
        { id: s.id + "-p1", title: "Bayshore Classic Fan Tee", subtitle: "Cotton-Blend Event Tee", status: "published", teamSetting: "fan-gear", rosters: [] },
        { id: s.id + "-p2", title: "Bayshore Classic Hoodie", subtitle: "PLBH-310 · decorated · art: Approved", sku: "PLBH-310", status: "published", teamSetting: "fan-gear", rosters: [], brand: "Prolook", source: "Decorated stock", category: "Fleece", deco: "approved", decoratable: true },
        { id: s.id + "-p3", title: "Event Beach Towel", subtitle: "Oversized Logo Towel", status: "published", teamSetting: "fan-gear", rosters: [] },
        { id: s.id + "-p4", title: "Tournament Game Jersey", subtitle: "Sublimated Volleyball Jersey", status: "published", teamSetting: "fan-gear", rosters: [] },
        { id: s.id + "-p5", title: "Event Quarter-Zip", subtitle: "PLQZ-140 · art awaiting approval", sku: "PLQZ-140", status: "draft", teamSetting: "fan-gear", brand: "Prolook", source: "Decorated stock", category: "Fleece", deco: "submitted", decoratable: true },
        { id: s.id + "-p6", title: "Staff Polo", subtitle: "PLSP-55 · art rejected — see notes", sku: "PLSP-55", status: "draft", teamSetting: "fan-gear", brand: "Prolook", source: "Decorated stock", category: "Polos", deco: "rejected", decoratable: true },
      ] };
    }
    return { ...s, seeded: true };
  });
  return [...active, ...makeArchivedStores()];
}

export function makeArchivedStores() {
  if (INTEGRATION.on) {
    const base = [
      { name: "Knights Knation Fall Ball 2025", city: "Baton Rouge", state: "Louisiana", color: "#1e3a6e", initials: "KK", createdBy: "Jack White", sport: "Baseball", start: "2025-08-18", end: "2025-10-31", revenue: 21480.0 },
      { name: "Pelicans Summer Classic 2025", city: "New Orleans", state: "Louisiana", color: "#0f766e", initials: "PB", createdBy: "Jack White", sport: "Baseball", start: "2025-05-05", end: "2025-06-27", revenue: 9875.5 },
    ];
    return base.map((b, i) => ({
      id: "archived-" + i,
      ownership: "mine",
      createdByName: b.createdBy,
      storeTitle: b.name,
      teamName: b.name,
      storeType: "single",
      teamColors: [b.color, "#0e0e10", "#ffffff"],
      teamLogo: null,
      sport: b.sport,
      contactPref: "Email & Phone",
      email: "coach@example.com",
      phone: "555-123-4567",
      storeOpenMode: "set-window",
      storeOpenStart: b.start,
      storeOpenEnd: b.end,
      shipFirstName: "Bismo",
      shipLastName: "Funyuns",
      shipName: "Bismo Funyuns",
      shipStreet: b.loc ? "" : "123 Sports Way",
      shipCity: b.loc ? "" : b.city,
      shipState: b.loc ? "" : b.state,
      shipZip: b.loc ? "" : "92009",
      shipCountry: "United States",
      shipOption: "Ship to Coach",
      distributionModel: "coach",
      saveToAddressBook: true,
      collectTax: true,
      taxRate: "7.75",
      fundraisingEnabled: true,
      revenue: b.revenue,
      seeded: true,
      live: false,
      status: "archived",
      archived: true,
      archivedOn: ["2024-11-02", "2024-05-01", "2024-01-10"][i],
      products: [],
    }));
  }
  const base = [
    { name: "Falcons 2024 Fall Locker", city: "Escondido", state: "California", color: "#3b3f8c", initials: "FA", createdBy: "Hingle McCringleberry", sport: "Football", start: "2024-08-01", end: "2024-10-30", revenue: 4820.5 },
    { name: "Titans Spring Spirit Shop", city: "Vista", state: "California", color: "#0f766e", initials: "TI", createdBy: "George Harrison", sport: "Soccer", start: "2024-03-04", end: "2024-04-20", revenue: 1975.0 },
    { name: "Wildcats Holiday Pop-Up", city: "Carlsbad", state: "California", color: "#9a3412", initials: "WC", createdBy: "Marcy Feldman", sport: "Basketball", start: "2023-11-15", end: "2023-12-24", revenue: 6310.75 },
  ];
  return base.map((b, i) => ({
    id: "archived-" + i,
    ownership: "mine",
    createdByName: b.createdBy,
    storeTitle: b.name,
    teamName: b.name,
    storeType: "single",
    teamColors: [b.color, "#0e0e10", "#ffffff"],
    teamLogo: null,
    sport: b.sport,
    contactPref: "Email & Phone",
    email: "coach@example.com",
    phone: "555-123-4567",
    storeOpenMode: "set-window",
    storeOpenStart: b.start,
    storeOpenEnd: b.end,
    shipFirstName: "Bismo",
    shipLastName: "Funyuns",
    shipName: "Bismo Funyuns",
    shipStreet: b.loc ? "" : "123 Sports Way",
    shipCity: b.loc ? "" : b.city,
    shipState: b.loc ? "" : b.state,
    shipZip: b.loc ? "" : "92009",
    shipCountry: "United States",
    shipOption: "Ship to Coach",
    distributionModel: "coach",
    saveToAddressBook: true,
    collectTax: true,
    taxRate: "7.75",
    fundraisingEnabled: true,
    revenue: b.revenue,
    seeded: true,
    live: false,
    status: "archived",
    archived: true,
    archivedOn: ["2024-11-02", "2024-05-01", "2024-01-10"][i],
    products: [],
  }));
}

export function makeSampleLeagues() {
  return []; // Leagues management is out of MVP scope — tab + create/group flows hidden
  return [{
    id: "league-socal",
    name: "SoCal Youth Football League",
    location: "Perrisville, CA",
    avatarColor: "#1d3a8a",
    storeIds: ["seed-0", "seed-1", "seed-2"],
    groups: [
      { id: "grp-8u", name: "8U Division", storeIds: ["seed-0"] },
      { id: "grp-12u", name: "12U Division", storeIds: ["seed-1"] }
    ],
    members: [
      { id: "m-owner", name: "Matt Passmore", email: "matt@prolook.com", role: "Owner", color: "#1f9d55" }
    ]
  }];
}

// US state abbreviations for store locations (the integrated workspace adds Louisiana first).
export const STATE_ABBR = INTEGRATION.on
  ? { Louisiana: "LA", California: "CA", Texas: "TX", "New York": "NY", Florida: "FL", Washington: "WA", Oregon: "OR", Nevada: "NV", Arizona: "AZ", Colorado: "CO", Illinois: "IL", Massachusetts: "MA", Georgia: "GA", Ohio: "OH", Michigan: "MI", "North Carolina": "NC", "South Carolina": "SC", Virginia: "VA", Pennsylvania: "PA" }
  : { California: "CA", Texas: "TX", "New York": "NY", Florida: "FL", Washington: "WA", Oregon: "OR", Nevada: "NV", Arizona: "AZ", Colorado: "CO", Illinois: "IL", Massachusetts: "MA", Georgia: "GA", Ohio: "OH", Michigan: "MI", "North Carolina": "NC", "South Carolina": "SC", Virginia: "VA", Pennsylvania: "PA" };

// Demo prefill values for the create-store wizard (not converted yet).
export function makePrefill() {
  return {
    storeTitle: "",
    teamName: "",
    teamColors: [],
    teamLogo: null,
    connectTeam: "",
    sport: "",
    contactPref: "Email & Phone",
    email: "",
    phone: "",
    storeOpenMode: "set-window",
    storeOpenStart: "",
    storeOpenEnd: "",
    shipFirstName: "",
    shipLastName: "",
    shipName: "",
    shipStreet: "",
    shipApt: "",
    shipCountry: "United States",
    shipState: "",
    shipCity: "",
    shipZip: "",
    shipOption: "Ship to Coach",
    saveToAddressBook: true,
    collectTax: true,
    taxRate: "",
    // 6-step wizard fields
    storeSlug: "",
    connectedTeam: "",
    sports: [],
    contactEmailMode: "",
    contactPhoneMode: "",
    managerName: "",
    urgencyTimers: true,
    curatedProducts: [],
    collectPlayerName: true,
    collectRosterNumber: true,
    taxMode: "zip",
    flatTaxRate: "",
    heroTheme: "pitch",
    primaryColor: "#e1251b",
  };
}
