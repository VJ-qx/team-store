// Converted from workspace-app.jsx / workspace-app-integrated.jsx: the roster sample data a store's page
// reads (Dashboard's roster org: the Home tab's league structure, manager panel and Roster Bank counts),
// copied unchanged. The two workspaces differ only in the seeded divisions (ROSTER_GROUP_SEED).
import { INTEGRATION } from '../integration.js';
import { BAYSHORE_BANK_SEED, TEAMS_ONLY_GROUP_SEED, WASATCH_BANK_SEED } from './overview.js';

export const ROSTER_GROUP_SEED = INTEGRATION.on ? [
  { id: "sf", name: "10U Division", sport: "Baseball", color: "#1e3a6e", rosters: [
    { id: "sf-8", name: "10U Knights", division: "10U", players: 12 },
    { id: "sf-10", name: "10U Bombers", division: "10U", players: 11 },
    { id: "sf-12", name: "10U Gators", division: "10U", players: 12 }] },
  { id: "af", name: "12U Division", sport: "Baseball", color: "#7c1d2b", rosters: [
    { id: "af-8", name: "12U Knights", division: "12U", players: 12 },
    { id: "af-10", name: "12U Riverhawks", division: "12U", players: 11 },
    { id: "af-12", name: "12U Stingers", division: "12U", players: 12 }] },
  { id: "pg", name: "14U Division", sport: "Baseball", color: "#1f5c3a", rosters: [
    { id: "pg-8", name: "14U Knights", division: "14U", players: 13 },
    { id: "pg-10", name: "14U Mudcats", division: "14U", players: 12 }] }]
  : [
  { id: "sf", name: "Lone Peak", sport: "Boys Basketball", color: "#7c1d2b", rosters: [
    { id: "sf-8", name: "8U Boys Basketball", division: "8U", players: 11 },
    { id: "sf-10", name: "10U Boys Basketball", division: "10U", players: 11 },
    { id: "sf-12", name: "12U Boys Basketball", division: "12U", players: 11 },
    { id: "sf-14", name: "14U Boys Basketball", division: "14U", players: 11 }] },
  { id: "af", name: "Corner Canyon", sport: "Boys Basketball", color: "#1e3a6e", rosters: [
    { id: "af-8", name: "8U Boys Basketball", division: "8U", players: 10 },
    { id: "af-10", name: "10U Boys Basketball", division: "10U", players: 9 },
    { id: "af-12", name: "12U Boys Basketball", division: "12U", players: 10 },
    { id: "af-14", name: "14U Boys Basketball", division: "14U", players: 10 }] },
  { id: "pg", name: "Farmington", sport: "Boys Basketball", color: "#1f5c3a", rosters: [
    { id: "pg-8", name: "8U Boys Basketball", division: "8U", players: 11 },
    { id: "pg-10", name: "10U Boys Basketball", division: "10U", players: 10 },
    { id: "pg-12", name: "12U Boys Basketball", division: "12U", players: 10 },
    { id: "pg-14", name: "14U Boys Basketball", division: "14U", players: 11 }] },
  { id: "or", name: "Lehi", sport: "Boys Basketball", color: "#4a2367", rosters: [
    { id: "or-8", name: "8U Boys Basketball", division: "8U", players: 11 },
    { id: "or-10", name: "10U Boys Basketball", division: "10U", players: 10 },
    { id: "or-12", name: "12U Boys Basketball", division: "12U", players: 11 },
    { id: "or-14", name: "14U Boys Basketball", division: "14U", players: 11 }] },
  { id: "pv", name: "Skyridge", sport: "Boys Basketball", color: "#b4531a", rosters: [
    { id: "pv-8", name: "8U Boys Basketball", division: "8U", players: 11 },
    { id: "pv-10", name: "10U Boys Basketball", division: "10U", players: 11 },
    { id: "pv-12", name: "12U Boys Basketball", division: "12U", players: 11 },
    { id: "pv-14", name: "14U Boys Basketball", division: "14U", players: 11 }] }];

export const STANDALONE_ROSTER_SEED = [
  { id: "loose-coaches", name: "Coaches & Staff", players: 12 },
  { id: "loose-allstars", name: "Tournament All-Stars", players: 15 }];

// Deterministic, human-readable team code per group (e.g. "RT47A") — stable across renders.
export function rTeamCode(seed) {
  let h = 5381; const s = String(seed || "");
  for (let i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0;
  const L = "ABCDEFGHJKMNPQRSTUVWXYZ";
  return L[h % 23] + L[(h >>> 5) % 23] + String(10 + ((h >>> 10) % 90)) + L[(h >>> 17) % 23];
}

export function makeBankSeed(singleMode, startEmpty) {
  if (startEmpty) return {};
  const seed = (p) => [
    // Pre-grouped by shared contact email — includes a WRONG merge (Ellie is
    // Mason's sibling on the family email) for the split demo.
    { id: p + "-bz1", committed: false, captures: [
      { id: p + "-c1", player: "Mason Rivera", nameOnJersey: "Rivera", jersey: "23", size: "YM", item: "Home Game Jersey", tier: "team-required", email: "rivera.family@gmail.com", phone: "(385) 555-0114", address: "1180 Fox Hollow Ln, Draper, UT 84020", order: "435AFHSPY4D91", date: "Jul 21, 2026" },
      { id: p + "-c2", player: "Mason Rivera", nameOnJersey: "Rivera", jersey: "23", size: "YM", item: "Home Game Shorts", tier: "team-required", email: "rivera.family@gmail.com", phone: "(385) 555-0114", address: "1180 Fox Hollow Ln, Draper, UT 84020", order: "435AFHSPY4D91", date: "Jul 21, 2026" },
      { id: p + "-c3", player: "Ellie Rivera", nameOnJersey: "E. Rivera", jersey: "15", size: "YS", item: "Home Game Jersey", tier: "team-required", email: "rivera.family@gmail.com", phone: "(385) 555-0114", address: "1180 Fox Hollow Ln, Draper, UT 84020", order: "435AFHSPY4D92", date: "Jul 22, 2026" }] },
    // "Jonathan" vs "Jon" under different emails — the merge demo.
    { id: p + "-bz2", committed: false, captures: [
      { id: p + "-c4", player: "Jonathan Pruitt", nameOnJersey: "Pruitt", jersey: "4", size: "YL", item: "Away Game Jersey", tier: "team-required", email: "j.pruitt.home@gmail.com", phone: "(801) 555-0177", address: "44 S Cedar St, Lehi, UT 84043", order: "435AFHSPY4D93", date: "Jul 23, 2026" }] },
    { id: p + "-bz3", committed: false, captures: [
      { id: p + "-c5", player: "Jon Pruitt", nameOnJersey: "Pruitt", jersey: "4", size: "YL", item: "Team Warm-Up Hoodie", tier: "team-supplied", email: "jpruitt@velocityhvac.com", phone: "(801) 555-0142", address: "PO Box 210, Lehi, UT 84043", order: "435AFHSPY4D94", date: "Jul 24, 2026" }] },
    // Claims #15 — conflicts with Ellie's uncommitted capture above.
    { id: p + "-bz4", committed: false, captures: [
      { id: p + "-c6", player: "Ava Chen", nameOnJersey: "Chen", jersey: "15", size: "YM", item: "Home Game Jersey", tier: "team-required", email: "chenfam@yahoo.com", phone: "(385) 555-0163", address: "2210 E Aspen Way, Sandy, UT 84094", order: "435AFHSPY4D95", date: "Jul 25, 2026" }] }];
  // Live captures written by the storefront prototype's consent-gated checkout
  // (same-origin localStorage bridge) land alongside the seeded clusters.
  const liveFor = (prefix) => {
    let raw = [];
    try { raw = JSON.parse(localStorage.getItem("prolook_bank_captures_v1") || "[]"); } catch (e) {}
    if (!Array.isArray(raw)) raw = [];
    return raw.map((c, i) => ({
      id: prefix + "-live-" + (c.id || i), committed: false,
      captures: (c.items || []).map((it, j) => ({
        id: prefix + "-live-" + (c.id || i) + "-" + j, player: c.player || "Unknown player",
        nameOnJersey: it.nameOnJersey || "", jersey: String(it.jersey || ""), size: it.size || "",
        item: it.item || "Team item", tier: it.tier || "team-required",
        email: c.email || "", phone: c.phone || "", address: c.address || "",
        order: c.order || "", date: c.date || "" })),
    })).filter((cl) => cl.captures.length);
  };
  return singleMode
    ? { "single-roster": [...seed("single"), ...liveFor("single")] }
    : { "sf-8": [...seed("sf8"), ...liveFor("sf8")] };
}

// ─────────── Team Manager & Freight Mapping (feature-gated) ───────────
// Delegates logistics to per-team managers/coaches. Strictly gated: only visible
// when the store chose "Ship to Team Manager" during Step 1. Two modes per
// division: League-level or Individual-Team — bulk freight routes to whoever
// is effective per team. Hidden entirely for direct-to-home shipping.
export const MANAGER_SEED = {
  "sf": { firstName: "Marcus", lastName: "Whitfield", name: "Marcus Whitfield", email: "marcus.w@jazzbantum.org", phone: "(480) 555-0132", address: "1420 E Highland Dr, Draper, UT 84020" },
  "af": { firstName: "Denise", lastName: "Alvarez", name: "Denise Alvarez", email: "denise.a@jazzbantum.org", phone: "(480) 555-0148", address: "883 Canyon View Rd, Sandy, UT 84094" },
  "pg": { name: "", email: "", phone: "" },
  "or": { firstName: "Terrence", lastName: "Cole", name: "Terrence Cole", email: "terrence.c@jazzbantum.org", phone: "(480) 555-0175", address: "2210 N Center St, Lehi, UT 84043" },
  "pv": { name: "", email: "", phone: "" },
};

// Individual team (roster) overrides — assigning at the team level does NOT
// require the rest of the group to be assigned. Seeded to demonstrate: one team
// overriding its group manager (sf-14), and one team in a group with no group
// manager (pg-8).
export const TEAM_MANAGER_SEED = {
  "sf-14": { firstName: "Rico", lastName: "DiBiase", name: "Rico DiBiase", email: "rico.d@jazzbantum.org", phone: "(480) 555-0166", address: "77 W Vine St, Murray, UT 84107" },
  "pg-8": { firstName: "Renee", lastName: "Park", name: "Renee Park", email: "renee.p@jazzbantum.org", phone: "(480) 555-0210", address: "512 S 900 E, Farmington, UT 84025" },
};

// ─────────── Shared roster-org state (Rosters tab ⟷ Settings manager mapping) ───────────
export function makeRosterOrg(store, startEmpty) {
  const singleMode = (store && store.storeType) === "single";
  const singleName = (store && (store.teamName || store.storeTitle)) || "Team Roster";
  const profile = store && store.rosterProfile;
  // A league store created through the wizard carries its Divisions & Teams
  // structure — seed the workspace org from it instead of demo data.
  const ws = !singleMode && store && store.leagueStructure;
  if (ws && ((ws.groups || []).length || (ws.loose || []).length)) {
    const groups = (ws.groups || []).map((g) => ({ ...g, rosters: (g.rosters || []).map((r) => ({ ...r })) }));
    const modes = {}; groups.forEach((g) => { modes[g.id] = "league"; });
    return { groups, loose: (ws.loose || []).map((r) => ({ ...r })), managers: {}, modes, bank: {} };
  }
  if (!singleMode && !startEmpty && profile === "teams-only") {
    // Team mapping complete, zero rosters — the bank back-fills every team.
    const groups = TEAMS_ONLY_GROUP_SEED.map((g) => ({ ...g, rosters: g.rosters.map((r) => ({ ...r })) }));
    const modes = {}; groups.forEach((g) => { modes[g.id] = "league"; });
    return { groups, loose: [], managers: {}, modes, bank: JSON.parse(JSON.stringify(WASATCH_BANK_SEED)) };
  }
  if (!singleMode && !startEmpty && profile === "unstructured") {
    // No teams, no rosters — captures wait store-wide under "__store".
    return { groups: [], loose: [], managers: {}, modes: {}, bank: JSON.parse(JSON.stringify(BAYSHORE_BANK_SEED)) };
  }
  const groups = singleMode || startEmpty ? [] : ROSTER_GROUP_SEED.map((g) => ({ ...g, rosters: g.rosters.map((r) => ({ ...r })) }));
  const loose = singleMode ? [{ id: "single-roster", name: singleName, players: startEmpty ? 0 : 18 }]
    : startEmpty ? [] : STANDALONE_ROSTER_SEED.map((r) => ({ ...r }));
  const managers = {}, modes = {};
  if (!singleMode && !startEmpty) {
    groups.forEach((g) => {
      managers[g.id] = { ...(MANAGER_SEED[g.id] || { name: "", email: "", phone: "" }) };
      g.rosters.forEach((r) => { if (TEAM_MANAGER_SEED[r.id]) managers[r.id] = { ...TEAM_MANAGER_SEED[r.id] }; });
      // Per-group fulfillment mode: individual teams when any roster is seeded,
      // group manager when one is assigned, otherwise league manager.
      // Two modes only (flattened structure): league-level or individual teams.
      modes[g.id] = g.rosters.some((r) => TEAM_MANAGER_SEED[r.id]) ? "teams" : "league";
    });
  }
  return { groups, loose, managers, modes, bank: makeBankSeed(singleMode, startEmpty) };
}

export function phoneDigits(v) {return String(v || "").replace(/\D/g, "");}

export function isValidPhone(v) {return phoneDigits(v).length === 10;}

export function isValidEmail(v) {return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim());}

// A manager entry is submit-ready only when it has a full name, valid email,
// 10-digit phone, and a street address (required for order fulfillment).
export function managerComplete(m) {
  if (!m) return false;
  const hasName = (m.firstName && m.lastName) || m.name;
  return !!(hasName && isValidEmail(m.email) && isValidPhone(m.phone) && String(m.address || "").trim());
}

// Every team code inside the store — flattened from the shared roster org so the
// list always mirrors My Teams. Read-only here; teams are added on that tab.
export function owTeams(org, store) {
  const out = [];
  ((org && org.groups) || []).forEach((g) => (g.rosters || []).forEach((r) =>
    out.push({ id: r.id, name: r.name, division: g.name, color: g.color || "#3f3f46", players: r.players || 0, code: rTeamCode(r.id) })));
  ((org && org.loose) || []).forEach((r) =>
    out.push({ id: r.id, name: r.name, division: null, color: "#3f3f46", players: r.players || 0, code: rTeamCode(r.id) }));
  if (!out.length) out.push({ id: "store-team", name: (store && (store.teamName || store.storeTitle)) || "Team Roster", division: null, color: "#3f3f46", players: 0, code: rTeamCode((store && store.id) || "store") });
  return out;
}
