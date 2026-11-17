// The workspace's catalog templates, product categories and store-created teams. The prototype keeps these
// on window (window.__catalogTemplates, window.__prodCats, window.__storeTeams) and replaces or extends them
// as the rep edits; nothing reactive watches them, and each screen reads them again when it re-renders.
// Here they live on one shared object with the same names, so the converted code reads and writes them
// exactly as the prototype does. Seed values copied unchanged from workspace-app.jsx /
// workspace-app-integrated.jsx (identical in both).
export const workspaceGlobals = {
  // Catalog Templates — branded snapshots saved from a store's catalog (Products
  // tab → Select → Create Catalog Template). Members arrive in a destination
  // store wearing the origin store's artwork; locked members (source: Saved
  // Design, Saved Cart, or Customize) can never be re-branded, stock members can
  // via Edit artwork. Pricing, team setting, sizes, category and team assignment
  // are re-confirmed per item on deploy — only artwork carries.
  __catalogTemplates: [
    { id: "tpl-grizzlies-2025", name: "Grizzlies Basketball 2025–26", originStore: "Grizzlies Basketball", members: [
      { id: "m-gz-jersey", title: "Home Jersey", styleBlock: "SFN Lite, Round Neck Jersey — Grizzlies", photo: "jersey-grizzlies", sku: "SFN-JR-100", price: 89.00, locked: true },
      { id: "m-gz-short", title: "Team Shorts", styleBlock: "Performance Mesh Short — Green", photo: "shorts-green", sku: "MSH-SH-200", price: 46.00, locked: false },
      { id: "m-gz-warm", title: "Warm-Up Jacket", styleBlock: "Full-Zip Travel Jacket — Grizzlies", photo: "jersey-lancers", sku: "WU-JK-300", price: 78.00, locked: true },
    ] },
    { id: "tpl-padres-spring", name: "Padres Spring Season", originStore: "Padres Baseball", members: [
      { id: "m-pd-home", title: "Home Jersey", styleBlock: "Set-in Faux, Full-Button Jersey — Padres", photo: "jersey-padres", sku: "SIF-JR-410", price: 92.00, locked: true },
      { id: "m-pd-pant", title: "Team Pants", styleBlock: "Pro-Cut Knit Bottom — Navy", photo: "pants-navy", sku: "PCK-PT-430", price: 54.00, locked: false },
    ] },
  ],
  // ── 3.3 Product categories & subcategories (workspace defaults) ──
  __prodCats: [
    { id: "team-gear", name: "Team Gear", subs: ["Uniforms", "Practice Gear"] },
    { id: "fan-gear", name: "Fan Gear", subs: ["Apparel", "Accessories"] },
  ],
  // Teams created for a store (by store id); set up on first use, as in the prototype.
  __storeTeams: undefined,
};
