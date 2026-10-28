// Builds a store's default products from the Stock Vault.
// Copied unchanged from the prototype (workspace-app.jsx / workspace-app-integrated.jsx); moved here from vault.js.
import { MARUCCI_VAULT_ITEMS, PROSTOCK_ITEMS } from '../data/vault.js';
import { vaultStoreCategory } from '../lib/vault.js';

export function vaultDefaultProducts(storeId, curatedTitles) {
  const all = PROSTOCK_ITEMS.concat(MARUCCI_VAULT_ITEMS);
  return all.map((it) => {
    const cw = (it.colorways || [])[0] || {};
    // Team Gear / Fan Gear stay empty by default — vault items go to generic categories.
    const curated = false;
    const storeCat = vaultStoreCategory(it);
    const pricing = { adult: { retail: String(it.priceAdult != null ? it.priceAdult : it.retail || 0) } };
    if (it.priceYouth != null) pricing.youth = { retail: String(it.priceYouth) };
    return { id: storeId + "-vault-" + it.id, title: it.title, subtitle: it.sku + " · " + (it.source || "Stock Vault"), sku: it.sku, status: "published",
      teamSetting: curated ? "team-supplied" : "fan-gear", brand: it.brand || "Prolook", source: it.source || "Stock Vault", category: storeCat, storeCategory: storeCat,
      stock: "in", deco: "none", decoratable: it.stockType === "pro" || it.stockType === "sideline", photo: cw.front || null, pricing, fromVault: true, rosters: [] };
  });
}
