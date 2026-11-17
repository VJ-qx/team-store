// Product helpers used by Add Products: default application sizes and pricing, the shared price settings'
// arithmetic, the made-to-order check, and the stable photo for a product.
// Copied unchanged from the prototype (workspace-app.jsx / workspace-app-integrated.jsx).
import { PRODUCT_PHOTOS } from '../data/products.js';
import { INTEGRATION } from '../integration.js';

export function defaultApplicationSizes() {
  return [
  {
    id: "front-number", type: "FRONT NUMBER", placement: "FRONT",
    iconKind: "hash",
    details: { TEXT: "15", ACCENT: "TWO COLOR", FONT: "HAWKS", PATTERN: "NONE", LAYOUT: "NONE" },
    colors: ["#0e0e10", "#0e0e10"],
    adultSize: "AS SHOWN", youthSize: "AS SHOWN",
    notes: ""
  },
  {
    id: "team-name", type: "TEAM NAME", placement: "FRONT",
    iconKind: "text",
    details: { TEXT: "HOYAS", ACCENT: "TWO COLOR", FONT: "HAWKS", PATTERN: "NONE", LAYOUT: "STRAIGHT" },
    colors: ["#0e0e10", "#0e0e10"],
    adultSize: "AS SHOWN", youthSize: "AS SHOWN",
    notes: ""
  },
  {
    id: "back-number", type: "BACK NUMBER", placement: "BACK",
    iconKind: "hash",
    details: { TEXT: "15", ACCENT: "TWO COLOR", FONT: "HAWKS", PATTERN: "NONE", LAYOUT: "NONE" },
    colors: ["#0e0e10", "#0e0e10"],
    adultSize: "AS SHOWN", youthSize: "AS SHOWN",
    notes: ""
  }];

}

export function defaultPricing() {
  return {
    youth: { base: "43.13", dealerUnit: "$", dealer: "0.00", fundUnit: "$", fund: "0.00", retail: "43.13" },
    adult: { base: "50.41", dealerUnit: "$", dealer: "0.00", fundUnit: "$", fund: "0.00", retail: "50.41" }
  };
}

// Seed the config modal from a pending item's real prices (Vault Pro Stock /
// Sideline Stock carry priceAdult/priceYouth); custom items keep the defaults.
export function pendingPricing(it) {
  if (!it || it.priceAdult == null) return defaultPricing();
  const tier = (b) => ({ base: b.toFixed(2), dealerUnit: "$", dealer: "0.00", fundUnit: "$", fund: "0.00", retail: b.toFixed(2) });
  const a = parseFloat(it.priceAdult) || 0;
  const y = it.priceYouth != null ? (parseFloat(it.priceYouth) || 0) : a;
  return { youth: tier(y), adult: tier(a) };
}

// ─────────── Governing rule 3 — shared price settings ($ / % mode) ───────────
// One mode governs a whole section; % resolves against each row's own base
// cost, rounded to the cent before summing; switching modes clears the values.
export function psAmt(unit, val, base) {
  const n = parseFloat(val) || 0;
  return unit === "%" ? Math.round(base * n) / 100 : n;
}
export function psRowRetail(row, fundOn) {
  const base = parseFloat(row.base) || 0;
  const total = base + psAmt(row.dealerUnit, row.dealer, base) + (fundOn ? psAmt(row.fundUnit || "$", row.fund, base) : 0);
  return total.toFixed(2);
}
export function pricingMode(pricing) {
  const rows = [pricing && pricing.youth, pricing && pricing.adult].filter(Boolean);
  return rows.some((r) => r.dealerUnit === "%" || r.fundUnit === "%") ? "%" : "$";
}
export function switchPricingMode(pricing, mode, fundOn) {
  const conv = (r) => {
    if (!r) return r;
    const next = { ...r, dealerUnit: mode, fundUnit: mode, dealer: "", fund: "" };
    delete next.dealerBulk; delete next.fundBulk;
    next.retail = psRowRetail(next, fundOn);
    return next;
  };
  return { ...pricing, youth: conv(pricing.youth), adult: conv(pricing.adult) };
}

// Where a product came from, as its badge reads. The integrated workspace also knows the Vault and its
// seller catalog.
export function pteSourceBadge(p) {
  if (INTEGRATION.on) {
    const s = String(p.srcKind || p.source || "").toLowerCase();
    const sub = String(p.subtitle || "").toLowerCase() + " " + String(p.style || "").toLowerCase();
    if (s === "vault" || s.includes("vault") || sub.includes("vault")) return "Vault";
    if (s.includes("marucci") || s.includes("stock")) return "Marucci Catalog";
    if (s.includes("design")) return "Saved Design";
    if (s.includes("cart")) return "Saved Cart";
    return "Custom";
  }
  const s = String(p.source || "").toLowerCase();
  if (s.includes("design")) return "Saved Design";
  if (s.includes("cart")) return "Saved Cart";
  return "Custom";
}

// Pro Stock / Sideline Stock (Vault) items are stock — not made to order; no design or order locks.
// Integrated workspace: Vault / seller-catalog items are not made to order — no design or order locks.
export function pteRestricted(p) {
  if (INTEGRATION.on) {
    const b = pteSourceBadge(p);
    return b !== "Vault" && b !== "Marucci Catalog";
  }
  if (!p) return true;
  const sk = String(p.srcKind || "").toLowerCase();
  const src = String(p.source || "").toLowerCase();
  return !(sk === "vault" || src === "prostock" || src === "sideline stock");
}

export function photoForKey(key) {
  const s = String(key || "");
  let h = 0;
  for (let i = 0; i < s.length; i++) h = h * 31 + s.charCodeAt(i) >>> 0;
  return PRODUCT_PHOTOS[h % PRODUCT_PHOTOS.length];
}
