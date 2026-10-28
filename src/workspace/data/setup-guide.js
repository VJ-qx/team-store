// The Store Setup Guide's cards (7 for a league store, 6 for an individual store).
// Copied unchanged from the prototype (workspace-app.jsx / workspace-app-integrated.jsx); moved here from setup-guide.js.

export function sgCards(storeType) {
  const league = storeType === "league";
  return [
    { id: "cover", kind: "cover" },
    { id: "tabs", eyebrow: "The tabs", title: "Five tabs, five jobs.", lines: [
      ["Products", "everything the store can sell, visible or hidden."],
      ["Orders", "every order buyers place, in one table."],
      league ? ["My Teams", "your league's divisions and teams, each with its own roster."]
             : ["My Team", "your roster — the players this store serves."],
      ["Reports", "sales, fundraising, and profit numbers."],
      ["Settings", "schedule, contacts, and launch controls."],
    ] },
    { id: "products", eyebrow: "Products", title: "How a product reaches the storefront.", copy: "Add it, configure it, turn its visibility on, then launch the store. Hidden items stay in your catalog — they never show to buyers." },
    league ? { id: "org", eyebrow: "Divisions & teams", title: "How your league is organized.", copy: "Divisions sit under the league, and teams sit under divisions. Each team gets its own roster and team code. Products are assigned to specific teams, so a buyer only sees what their team ordered." } : null,
    { id: "gear", eyebrow: "Team gear", title: "Team Required vs. Team Supplied.", copy: "Required gear is bought by rostered players at their own cost. Supplied gear is already paid for — players just pick sizes and pay $0. Both file under Team Gear." },
    { id: "vault", eyebrow: "Stock Vault", title: "The Stock Vault vs. a bundle.", copy: "The Stock Vault is your library of blank stock gear. A bundle is buyer-facing — several catalog items sold together as one storefront line. A Catalog Template is a saved set of this store's own gear you can reuse in a later store." },
    { id: "live", eyebrow: "Going live", title: "Launching, closing, re-opening.", copy: "Launch controls live on the Settings tab, and a store needs at least one visible product to launch. You can close and re-open anytime." },
  ].filter(Boolean);
}
