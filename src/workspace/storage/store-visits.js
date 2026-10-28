// Store visits (Overview "Frequently visited"), kept in localStorage.
// Copied unchanged from the prototype (workspace-app.jsx / workspace-app-integrated.jsx); moved here from overview.js.

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
