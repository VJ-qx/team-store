// Which store category a Stock Vault item files under.
// Copied unchanged from the prototype (workspace-app.jsx / workspace-app-integrated.jsx); moved here from vault.js.

export function vaultStoreCategory(it) {
  const st = it.stockType;
  const cat = it.vaultCategory || "";
  if (st === "pro" || st === "sideline" || /apparel/i.test(cat) || /\b(belt|hat|cap)\b/i.test(it.title || ""))
    return (it.gender === "Women" || /women/i.test(cat)) ? "Women's Apparel" : "Men's Apparel";
  return cat;
}
