// Stores the rep created, kept in localStorage so they survive a reload.
// Copied unchanged from the prototype (workspace-app.jsx / workspace-app-integrated.jsx); moved here from stores.js.

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
