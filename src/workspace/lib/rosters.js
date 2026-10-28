// Roster helpers: team codes, contact validation, and whether a manager entry is complete.
// Copied unchanged from the prototype (workspace-app.jsx / workspace-app-integrated.jsx); moved here from rosters.js.

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
