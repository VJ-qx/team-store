// Converted from workspace-app.jsx / workspace-app-integrated.jsx (identical in both): the Store Close
// Report helpers a store's page uses, copied unchanged: the shared colors, the accent color the setup
// guide reuses, and the close-event bookkeeping (local storage) the report's host keeps on every store.
// The report itself (StoreCloseReportOverlay) is not converted yet.

export const CR_INK = "#0e0e10";

export const CR_MUTED = "#6b6b72";

export const CR_LINE = "#ececf0";

export const CR_NUM = { fontVariantNumeric: "tabular-nums lining-nums" };

// A readable accent: team color 1 unless it's too light to sit type on.
export function crLum(hex) {
  const h = String(hex || "#000").replace("#", "");
  const v = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(v, 16); if (isNaN(n)) return 0;
  return (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255;
}

export function crAccent(store) {
  const colors = (store?.teamColors || []).filter(Boolean);
  const pick = colors.find((c) => crLum(c) < 0.72);
  return pick || CR_INK;
}

// ─────────── Close-event bookkeeping (per store) + seen state (per user) ───────────
export function crEventKey(store) { return "ts_close_event_" + (store?.id || "store"); }

export function crReadJSON(key, fallback) { try { const v = JSON.parse(window.localStorage.getItem(key) || "null"); return v == null ? fallback : v; } catch (e) { return fallback; } }

export function crWriteJSON(key, val) { try { window.localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }

// Reconciles the persisted close event with the store's current status.
// Closed → Open → Closed produces a NEW event (the trigger re-arms); prior
// events are retained, never overwritten.
export function crSyncEvent(store) {
  if (!store) return null;
  const key = crEventKey(store);
  const prev = crReadJSON(key, null);
  const status = store.status;
  if (status === "closed") {
    if (prev && prev.active) return prev;
    const next = {
      id: (prev?.id || 0) + 1,
      closedAt: new Date().toISOString(),
      openedAt: store.storeOpenStart || null,
      active: true,
      auto: false,
    };
    crWriteJSON(key, next);
    return next;
  }
  if (status === "archived") {
    if (prev) return prev;
    const next = { id: 1, closedAt: store.storeOpenEnd || new Date().toISOString(), openedAt: store.storeOpenStart || null, active: true, auto: true };
    crWriteJSON(key, next);
    return next;
  }
  if (prev && prev.active) { const next = { ...prev, active: false }; crWriteJSON(key, next); return next; }
  return prev;
}

export function crUserId(store) { return store?.role === "manager" ? "team-manager" : "rep"; }

export function crSeenKey(store) { return "ts_close_report_seen_" + crUserId(store); }

export function crIsSeen(store, ev) {
  if (!ev) return true;
  const seen = crReadJSON(crSeenKey(store), {});
  return !!seen[(store?.id || "store") + ":" + ev.id];
}

export function crMarkSeen(store, ev) {
  if (!ev) return;
  const k = crSeenKey(store);
  const seen = crReadJSON(k, {});
  seen[(store?.id || "store") + ":" + ev.id] = Date.now();
  crWriteJSON(k, seen);
}

export function crClearSeen(store, ev) {
  if (!ev) return;
  const k = crSeenKey(store);
  const seen = crReadJSON(k, {});
  delete seen[(store?.id || "store") + ":" + ev.id];
  crWriteJSON(k, seen);
}

// ─────────── Motion ───────────
export function crPrefersReduced() {
  try { return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; }
}
