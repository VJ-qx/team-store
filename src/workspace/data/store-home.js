// Converted from workspace-app.jsx / workspace-app-integrated.jsx (identical in both apart from the
// pick-up location): a store's Home tab model, copied unchanged. One attention model feeds both the Home
// tab's "Needs your attention" cards and the side menu's red dots.
import { INTEGRATION } from '../integration.js';
import { makeOrdersDataset } from './orders.js';
import { managerComplete } from './rosters.js';

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

// Saved pick-up locations. In the prototype this is the global window.__wsPickup, which Workspace
// Settings → Pick-up locations edits; that screen isn't converted yet, so this is its seed list.
export const WS_PICKUP = INTEGRATION.on ? [
  { id: "p1", name: "Hitter's House Baton Rouge", addr1: "5801 Siegen Lane", city: "Baton Rouge", state: "LA", zip: "70809", hours: [["Mon – Fri", "9:00 AM – 5:00 PM"], ["Sat", "10:00 AM – 2:00 PM"], ["Sun", "Closed"]], enabled: true, note: "(225) 236-0166 · Ask for Team Stores pick-up at the front desk." },
] : [
  { id: "p1", name: "Prolook Headquarters", addr1: "1700 Lakeside Pkwy", city: "Flower Mound", state: "TX", zip: "75028", hours: [["Mon – Fri", "9:00 AM – 5:00 PM"], ["Sat", "10:00 AM – 2:00 PM"], ["Sun", "Closed"]], enabled: true, note: "Ask for Team Stores pick-up at the front desk." },
];

export function shipToSummary(s) {
  const loc = shipLocationOf(s);
  if (loc) return [loc.addr1, loc.city, [loc.state, loc.zip].filter(Boolean).join(" ")].filter(Boolean).join(", ");
  const v = s || {};
  const l1 = [v.shipStreet, v.shipApt].filter(Boolean).join(", ");
  const l2 = [v.shipCity, [v.shipState, v.shipZip].filter(Boolean).join(" ")].filter(Boolean).join(", ");
  return [l1, l2].filter(Boolean).join(", ");
}

// A store stores shipLocationId (a reference into the pick-up locations), never a copy of the location's address.
export function shipLocationOf(s) { if (!s || !s.shipLocationId) return null; return WS_PICKUP.find((l) => l.id === s.shipLocationId && l.enabled) || null; }

// The store's storefront slug (prolook.com/store/<slug>).
export function tcStoreSlug(store) {
  const st = store || (typeof window !== "undefined" ? window.__tcStore : null);
  const s = String((st && (st.storeTitle || st.teamName)) || "team-store").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return s.slice(0, 28) || "team-store";
}

export function homeLifecycle(store) {
  const archived = !!(store && (store.archived || store.status === "archived"));
  const closed = !archived && !!store && store.status === "closed";
  const open = !archived && !closed && !!(store && store.live);
  return { archived, closed, open, draft: !archived && !closed && !open };
}

export function homeOrdersInfo(store) {
  const data = store && store.seeded ? makeOrdersDataset(store) : { myOrders: [], fanOrders: [], pending: [] };
  const pendingGroups = data.pending || [];
  const pending = pendingGroups.reduce(function (n, g) { return n + ((g.rows || []).length); }, 0);
  const submitted = (data.myOrders || []).length + (data.fanOrders || []).length;
  return { pending, submitted, total: pending + submitted, pendingGroups };
}

export function homeBankInfo(org) {
  const bank = (org && org.bank) || {};
  let total = 0; const byTeam = {};
  Object.keys(bank).forEach(function (tid) {
    const n = (bank[tid] || []).filter(function (c) { return !c.committed; }).length;
    byTeam[tid] = n; total += n;
  });
  return { total, byTeam };
}

export function homeStructureInfo(org) {
  const groups = (org && org.groups) || [];
  const loose = (org && org.loose) || [];
  const teams = groups.reduce(function (n, g) { return n + (g.rosters || []).length; }, 0) + loose.length;
  const players = groups.reduce(function (n, g) { return n + (g.rosters || []).reduce(function (m, r) { return m + (r.players || 0); }, 0); }, 0)
    + loose.reduce(function (n, r) { return n + (r.players || 0); }, 0);
  return { groups, loose, teams, players, divisions: groups.length };
}

export function homeCloseInfo(store) {
  const raw = store && store.storeOpenEnd;
  if (!raw) return null;
  const end = new Date(raw + "T12:00:00");
  if (isNaN(end)) return null;
  const daysLeft = Math.max(0, Math.ceil((end - new Date()) / 86400000));
  return { label: end.toLocaleDateString("en-US", { month: "short", day: "numeric" }), daysLeft };
}

export function homeFailedProducts(store) {
  return ((store && store.products) || []).filter(function (p) {
    return p && (p.renderFailed || p.imageFailed || p.renderStatus === "failed" || p.imageStatus === "failed");
  });
}

// The one attention model both the Home tab and the nav-dot rule read.
// Rail tones: red = blocking, blue = action, grey = informational. Never amber,
// never a severity label — rail color and ordering carry it.
export function buildHomeAttention(store, org) {
  const lc = homeLifecycle(store);
  const oi = homeOrdersInfo(store);
  const bank = homeBankInfo(org);
  const close = homeCloseInfo(store);
  const cards = [];
  if (!lc.archived) {
    if (lc.draft) {
      if (((store.products || []).length) === 0) {
        cards.push({ tone: "red", navTab: "products", kind: "products", title: "Add a product before you launch", detail: "Customers need at least one thing to buy", action: "Go to Products" });
      } else {
        cards.push({ tone: "blue", kind: "launch", title: "Your store is ready to launch", detail: "Customers can start ordering as soon as you do", action: "Launch store" });
      }
      if (!shipToSummary(store)) {
        cards.push({ tone: "red", navTab: "general", kind: "settings-store", title: "Add a delivery address before orders can ship", detail: "Orders ship to the team manager, and there's no address on file yet", action: "Add address" });
      }
    } else {
      if (lc.open && (store.storeType || "league") === "league" && org) {
        const gatedNames = []; const gatedIds = {}; let target = null;
        (org.groups || []).forEach(function (g) {
          if (((org.modes || {})[g.id] || "league") !== "teams") return;
          const missing = (g.rosters || []).filter(function (r) { return !managerComplete((org.managers || {})[r.id]); });
          if (missing.length) { gatedNames.push(g.name); gatedIds[String(g.id).toLowerCase()] = true; if (!target) target = { groupId: g.id, rosterId: missing[0].id }; }
        });
        if (gatedNames.length) {
          const waiting = oi.pendingGroups.reduce(function (n, g) { return n + (gatedIds[String(g.shippingGroup || "").toLowerCase()] ? (g.rows || []).length : 0); }, 0);
          const names = gatedNames.length > 1 ? gatedNames.slice(0, -1).join(", ") + " and " + gatedNames[gatedNames.length - 1] : gatedNames[0];
          cards.push({ tone: "red", navTab: "general", kind: "assign", target: target,
            title: names + (gatedNames.length > 1 ? " need" : " needs") + " a manager before their orders can ship",
            detail: waiting ? waiting + " order" + (waiting === 1 ? " is" : "s are") + " waiting on this" : "Orders from these teams can't ship until a manager is assigned",
            action: "Assign managers" });
        }
      }
      const failed = homeFailedProducts(store);
      if (lc.open && failed.length) {
        cards.push({ tone: "red", navTab: "products", kind: "products",
          title: failed.length === 1 ? "Images failed for " + (failed[0].title || failed[0].name || "a product") : "Images failed for " + failed.length + " products",
          detail: (failed.length === 1 ? "It can't" : "They can't") + " go on the storefront until this is retried",
          action: "Retry" });
      }
      if (oi.pending > 0) {
        cards.push({ tone: "blue", kind: "pending", title: oi.pending + " pending order" + (oi.pending === 1 ? "" : "s") + " to submit", detail: "Oldest placed 3 days ago — orders reach the factory after you submit", action: "Go to Pending Orders" });
      }
      if (lc.open && bank.total > 0) {
        cards.push({ tone: "blue", kind: "bank", title: bank.total + " Roster Bank capture" + (bank.total === 1 ? "" : "s") + " awaiting review",
          detail: (store.storeType === "single") ? "Banked from storefront orders, not yet on this store's roster" : "Oldest captured 2 days ago — banked from storefront orders, not yet on a roster",
          action: "Open Roster Bank" });
      }
      if (lc.closed) {
        cards.push({ tone: "grey", kind: "report", link: true, title: "Your close report is ready", detail: "Totals, fundraising, and what shipped", action: "View report" });
        if (oi.submitted > 0) cards.push({ tone: "grey", kind: "orders", link: true, title: oi.submitted + " order" + (oi.submitted === 1 ? " is" : "s are") + " still being made", detail: "They'll ship as they're finished — nothing needed from you", action: "View orders" });
      }
      if (lc.open && close) {
        cards.push({ tone: "grey", kind: "schedule", link: true, title: "Ordering window closes " + close.label + " — " + close.daysLeft + " days left", detail: "Change the close date from the store schedule", action: "Edit Store Schedule" });
      }
    }
  }
  const rank = { red: 0, blue: 1, grey: 2 };
  cards.sort(function (a, b) { return rank[a.tone] - rank[b.tone]; });
  return { cards: cards, lc: lc, oi: oi, bank: bank, close: close };
}

// Red dot on a nav tab only when a red-rail card resolves to it.
export function homeRedNavTabs(store, org) {
  const s = new Set();
  buildHomeAttention(store, org).cards.forEach(function (c) { if (c.tone === "red" && c.navTab) s.add(c.navTab); });
  return s;
}
