// Overview data and formatting. Moved unchanged from workspace-app.jsx (identical in
// workspace-app-integrated.jsx): colours, money formatting, the revenue series, store visits for the
// Frequently Visited shelf, and the seeded roster-bank captures.


export const OV_INK = "#0e0e10";

export const OV_MUTED = "#6b6b72";

export const OV_LINE = "#ececf0";

export const OV_RED = "#e1251b";

export const OV_GREEN = "#1f9d55";

export function ovFmt(n) {
  return "$" + Math.round(n).toLocaleString("en-US");
}

export function buildRevenueSeries(total, scale) {
  if (scale === "day") {
    const days = 14;
    const now = new Date();
    const daily = total / 30; // approx daily run-rate
    const out = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const w = 0.55 + 0.9 * Math.abs(Math.sin((d.getDate() + d.getMonth() * 3) * 1.3));
      out.push({
        label: d.toLocaleDateString("en-US", { month: "numeric", day: "numeric" }),
        revenue: Math.round(daily * w),
      });
    }
    return out;
  }
  if (scale === "year") {
    const nowY = new Date().getFullYear();
    const factors = [0.42, 0.61, 0.78, 1.0]; // growth curve into the current year
    const annual = total * 12; // annualized run-rate
    return factors.map((f, i) => ({
      label: String(nowY - (factors.length - 1) + i),
      revenue: Math.round(annual * f),
      current: i === factors.length - 1,
    }));
  }
  // month (default) — trailing 12 months ending in the current month.
  const weights = [0.6, 0.8, 1.1, 0.7, 0.9, 1.2, 1.35, 1.5, 1.0, 1.15, 1.3, 1.05];
  const wsum = weights.reduce((a, b) => a + b, 0);
  const now = new Date();
  return weights.map((w, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
    return { label: d.toLocaleDateString("en-US", { month: "short" }), revenue: Math.round((total * w) / wsum), current: i === 11 };
  });
}

export const RPC_REV = "#7c3aed";

export const RPC_PROF = "#d97706";

export function fmtWindowDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export const VISITS_KEY = "prolook_store_visits_v1";

export function readStoreVisits() {
  try { return JSON.parse(localStorage.getItem(VISITS_KEY) || "{}") || {}; } catch (e) { return {}; }
}

export function recordStoreVisit(id) {
  if (!id) return;
  try {
    const v = readStoreVisits();
    const cur = v[id] || { n: 0, ts: 0 };
    v[id] = { n: cur.n + 1, ts: Date.now() };
    localStorage.setItem(VISITS_KEY, JSON.stringify(v));
  } catch (e) {}
}

export const SEED_VISITS = [24, 19, 15, 9, 6, 4];

export function rankFrequentStores(stores, visits) {
  return stores
    .map((s, i) => {
      const rec = visits[s.id];
      const seeded = s.seeded ? SEED_VISITS[i % SEED_VISITS.length] : 0;
      return { store: s, n: seeded + (rec ? rec.n : 0), ts: rec ? rec.ts : 0 };
    })
    .filter((r) => r.n > 0)
    .sort((a, b) => (b.n - a.n) || (b.ts - a.ts))
    .slice(0, 5);
}

export function visitLabel(r) {
  if (!r.ts) return r.n + " visits";
  const days = Math.floor((Date.now() - r.ts) / 86400000);
  const when = days <= 0 ? "today" : days === 1 ? "yesterday" : new Date(r.ts).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return r.n + " visits · " + when;
}

export const TEAMS_ONLY_GROUP_SEED = [
  { id: "wx-n", name: "North Region", sport: "Lacrosse", color: "#1e3a6e" },
  { id: "wx-c", name: "Central Region", sport: "Lacrosse", color: "#7c1d2b" },
  { id: "wx-s", name: "South Region", sport: "Lacrosse", color: "#1f5c3a" },
].map((g) => ({ ...g, rosters: ["8U", "10U", "12U", "14U", "16U", "18U"].map((d) => ({ id: g.id + "-" + d.toLowerCase(), name: d + " Boys Lacrosse", division: d, players: 0 })) }));

export function bulkRng(seed) { let a = seed >>> 0; return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

export const BB_FIRST = ["Mason", "Liam", "Noah", "Ethan", "Owen", "Carter", "Wyatt", "Luke", "Jack", "Levi", "Miles", "Eli", "Ava", "Mia", "Zoe", "Ruby", "Nora", "Isla", "Cole", "Reid", "Beckett", "Finn", "Hudson", "Tate", "Brooks", "Nash", "Ivy", "June", "Sage", "Wren"];

export const BB_LAST = ["Rivera", "Pruitt", "Chen", "Okafor", "Sorensen", "Whitaker", "Delgado", "Marsh", "Kowalski", "Bennett", "Vaughn", "Ferris", "Nakamura", "Ortiz", "Hale", "Barlow", "Quintana", "Mercer", "Solberg", "Ashton", "Ibarra", "Foss", "Redding", "Calloway", "Voss", "Tran", "Muir", "Ellison", "Padgett", "Rooks"];

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

export function bankSeedCounts(seed) { let p = 0, c = 0; Object.values(seed).forEach((a) => a.forEach((cl) => { p++; c += cl.captures.length; })); return { proposed: p, captures: c }; }
