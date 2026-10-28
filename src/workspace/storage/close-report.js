// The Store Close Report's close events and "seen" state, kept in localStorage.
// Copied unchanged from the prototype (workspace-app.jsx / workspace-app-integrated.jsx); moved here from close-report.js.

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
