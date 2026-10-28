// Per-store "viewed" flags behind the store side menu's red dots, kept in localStorage.
// Copied unchanged from the prototype (workspace-app.jsx / workspace-app-integrated.jsx); moved here from store-home.js.

// ─────────── Tab badge persistence ───────────
// Red "needs attention" badges on the dashboard tabs. Dismissal is per-store and
// persisted to localStorage so cleared badges don't reappear after a refresh.
export const BADGE_KEY = "prolook_tab_badges_v1";

export function loadBadgeState(storeId) {
  try {
    const all = JSON.parse(localStorage.getItem(BADGE_KEY) || "{}");
    return all[storeId] || {};
  } catch (e) {return {};}
}

export function saveBadgeState(storeId, state) {
  try {
    const all = JSON.parse(localStorage.getItem(BADGE_KEY) || "{}");
    all[storeId] = state;
    localStorage.setItem(BADGE_KEY, JSON.stringify(all));
  } catch (e) {}
}
