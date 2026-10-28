// Overview helpers: number formatting, the revenue series, and ranking the frequently visited stores.
// Copied unchanged from the prototype (workspace-app.jsx / workspace-app-integrated.jsx); moved here from overview.js.
import { SEED_VISITS } from '../data/store-visits.js';

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

export function fmtWindowDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

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

export function bankSeedCounts(seed) { let p = 0, c = 0; Object.values(seed).forEach((a) => a.forEach((cl) => { p++; c += cl.captures.length; })); return { proposed: p, captures: c }; }
