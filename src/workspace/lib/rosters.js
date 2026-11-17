// Roster helpers: team codes, contact validation, whether a manager entry is complete, initials, and the
// teams a product can be assigned to.
// Copied unchanged from the prototype (workspace-app.jsx / workspace-app-integrated.jsx); moved here from rosters.js.
import { workspaceGlobals } from '../data/catalog.js';
import { ROSTER_GROUP_SEED, STANDALONE_ROSTER_SEED } from '../data/rosters.js';

// Deterministic, human-readable team code per group (e.g. "RT47A") — stable across renders.
export function rTeamCode(seed) {
  let h = 5381; const s = String(seed || "");
  for (let i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0;
  const L = "ABCDEFGHJKMNPQRSTUVWXYZ";
  return L[h % 23] + L[(h >>> 5) % 23] + String(10 + ((h >>> 10) % 90)) + L[(h >>> 17) % 23];
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

export function rInitials(name) { const w = String(name || "").trim().split(/\s+/).filter((x) => /[a-z0-9]/i.test(x)); if (w.length === 0) return "?"; if (w.length === 1) return w[0].slice(0, 2).toUpperCase(); return (w[0][0] + w[1][0]).toUpperCase(); }

// ─────────── Product-to-Roster Assignment (League stores) ───────────
// Flatten selection helpers shared by both variants.
export function assignAllRosterIds() {
  const ids = [];
  ROSTER_GROUP_SEED.forEach((g) => g.rosters.forEach((r) => ids.push(r.id)));
  STANDALONE_ROSTER_SEED.forEach((r) => ids.push(r.id));
  return ids;
}

// Teams offered for assignment are scoped to the store: a store with no team
// structure yet (unstructured profile, e.g. Bayshore) exposes ONLY teams created
// for it — never another store's seed tree. Returns null → use the global tree.
export function storeScopedTeams(store) {
  // Store-creation wizard: teams drafted in Step 2 (Divisions & Teams), plus any created inline.
  if (store && Array.isArray(store.wizardTeams)) { workspaceGlobals.__storeTeams = workspaceGlobals.__storeTeams || {}; return [...store.wizardTeams, ...(workspaceGlobals.__storeTeams[store.id] || [])]; }
  if (!store || store.rosterProfile !== "unstructured") return null;
  workspaceGlobals.__storeTeams = workspaceGlobals.__storeTeams || {};
  return workspaceGlobals.__storeTeams[store.id] || [];
}

export function assignRosterLabel(id) {
  for (const g of ROSTER_GROUP_SEED) {
    const r = g.rosters.find((x) => x.id === id);
    if (r) return { name: r.name, group: g.name, color: g.color };
  }
  const l = STANDALONE_ROSTER_SEED.find((x) => x.id === id);
  if (l) return { name: l.name, group: "Standalone", color: "#6b6b72" };
  return null;
}
