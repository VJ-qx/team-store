// Builds a store's sample roster org: divisions, managers and Roster Bank captures.
// Copied unchanged from the prototype (workspace-app.jsx / workspace-app-integrated.jsx); moved here from overview.js and rosters.js.
import { BB_FIRST, BB_LAST, MANAGER_SEED, ROSTER_GROUP_SEED, STANDALONE_ROSTER_SEED, TEAM_MANAGER_SEED, TEAMS_ONLY_GROUP_SEED } from '../data/rosters.js';

export function bulkRng(seed) { let a = seed >>> 0; return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

export function makeBulkBank(prefix, teamIds, clusterCount, items) {
  const rnd = bulkRng(prefix.length * 7349 + clusterCount);
  const pick = (a) => a[Math.floor(rnd() * a.length)];
  const bank = {};
  teamIds.forEach((t) => { bank[t] = []; });
  for (let i = 0; i < clusterCount; i++) {
    const tid = teamIds[i % teamIds.length];
    const first = pick(BB_FIRST), last = pick(BB_LAST);
    const player = first + " " + last;
    const email = (first + "." + last).toLowerCase() + (rnd() < 0.3 ? ".family" : "") + "@" + pick(["gmail.com", "yahoo.com", "outlook.com", "icloud.com"]);
    const phone = "(" + pick(["385", "801", "435", "619", "760"]) + ") 555-0" + String(100 + Math.floor(rnd() * 900)).slice(0, 3);
    const address = String(40 + Math.floor(rnd() * 9600)) + " " + pick(["Fox Hollow Ln", "Cedar St", "Aspen Way", "Harbor Dr", "Canyon Rd", "Willow Ct", "Seacrest Ave", "Alpine Loop"]) + ", " + pick(["Draper, UT 84020", "Lehi, UT 84043", "Sandy, UT 84094", "Provo, UT 84601", "Huntington Beach, CA 92646", "Carlsbad, CA 92009"]);
    const jersey = String(Math.floor(rnd() * 100));
    const date = "Jul " + (8 + Math.floor(rnd() * 18)) + ", 2026";
    const order = "435" + Array.from({ length: 10 }, () => pick(["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "M", "N", "P", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "2", "3", "4", "5", "6", "7", "8", "9"])).join("");
    const caps = [];
    const n = rnd() < 0.72 ? 1 : 2;
    for (let j = 0; j < n; j++) {
      const it = pick(items);
      caps.push({ id: prefix + "-c" + i + "-" + j, player, nameOnJersey: last, jersey, size: pick(["YS", "YM", "YL", "AS", "AM", "AL"]), item: it.item, tier: it.tier, email, phone, address, order, date });
    }
    bank[tid].push({ id: prefix + "-bz" + i, committed: false, captures: caps });
  }
  return bank;
}

export const WASATCH_BANK_SEED = makeBulkBank("wx", TEAMS_ONLY_GROUP_SEED.flatMap((g) => g.rosters.map((r) => r.id)), 216,
  [{ item: "Lacrosse Game Jersey — Home", tier: "team-required" }, { item: "Lacrosse Game Shorts", tier: "team-required" }, { item: "Shooter Shirt — Practice", tier: "team-supplied" }]);

export const BAYSHORE_BANK_SEED = {};

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
