// Stock Vault helpers: which store category an item files under, its gender and price lines, and its
// default color way.
// Copied unchanged from the prototype (workspace-app.jsx / workspace-app-integrated.jsx); moved here from vault.js.
import { INTEGRATION } from '../integration.js';

export function vaultStoreCategory(it) {
  const st = it.stockType;
  const cat = it.vaultCategory || "";
  if (st === "pro" || st === "sideline" || /apparel/i.test(cat) || /\b(belt|hat|cap)\b/i.test(it.title || ""))
    return (it.gender === "Women" || /women/i.test(cat)) ? "Women's Apparel" : "Men's Apparel";
  return cat;
}

// A Stock Vault item's gender and price lines, and its default color way (black when it has one).
// Copied unchanged from the prototype; the integrated workspace's single-price items show one price.
export function vaultGenderLine(it) { return it.gender ? it.gender + (it.youth ? "/Youth" : "") : ""; }
export function vaultPriceFmt(n) { return "$" + (Number(n) % 1 ? Number(n).toFixed(2) : String(Number(n))); }
export function vaultPriceLine(it) {
  if (it.priceAdult == null) return "";
  if (INTEGRATION.on && it.single) return vaultPriceFmt(it.priceAdult);
  return it.priceYouth != null ? "Adult " + vaultPriceFmt(it.priceAdult) + " · Youth " + vaultPriceFmt(it.priceYouth) : "Adult " + vaultPriceFmt(it.priceAdult);
}
export function hcmDefaultCw(item) {
  return item.colorways.find((c) => c.slug === "black") || item.colorways[0];
}
