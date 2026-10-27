// Converted from workspace-app.jsx / workspace-app-integrated.jsx (identical in both): the orders sample
// data, copied unchanged. A store's Home tab reads it for its order counts.
import { ROSTER_GROUP_SEED, STANDALONE_ROSTER_SEED, rTeamCode } from './rosters.js';

// ─────────── Demo dataset ───────────
export function makeOrdersDataset(store) {
  const teamColors = store?.teamColors || ["#1d3a8a", "#0e0e10", "#ffffff"];
  const teamName = (store?.teamName || "Bears").toUpperCase();
  // All orders in a store belong to that store's organization.
  const orgName = store?.teamName || store?.storeTitle || "Jazz Bantum Basketball";
  const rep = "Jared Winter";
  const dealership = "BSN Sports";
  const deliveryEmail = "jenegrin@email.com";
  const repEmail = "jwinter@email.com";

  const sharedPricing = {
    lines: [
    { label: "Adult", detail: "$77.78 x 18 items", amount: 933.36 },
    { label: "Youth", detail: "$77.78 x 18 items", amount: 933.36 }],

    charges: [
    { label: "Minimum Order Fee", detail: "", amount: 30.00 },
    { label: "90-Day Promo", detail: "$5.77/item", amount: 23.08 },
    { label: "Logo Removal", detail: "$2.44/item", amount: 29.34 }],

    subtotal: 1949.14
  };

  const sharedDelivery = {
    name: "James Orlando",
    street: "32 South, Carterville Road",
    cityLine: "Pleasant Grove, Utah 89205",
    email: deliveryEmail,
    phone: "+1 (801) 456-1234"
  };

  const sharedRep = {
    name: rep,
    email: repEmail,
    dealership,
    phone: "(801) 456-1234"
  };

  const baseOrderShape = {
    poNumber: "4500805069",
    tempShipDate: "10/18/2025",
    submitDate: "10/10/2025",
    delivery: sharedDelivery,
    repInfo: sharedRep,
    pricing: sharedPricing,
    partId: "45678-76543"
  };

  const products = {
    jerseyBears: { title: "Waist Cut, FB V-Neck Jersey BEARS", kind: "jersey", colors: teamColors, colorway: "Navy Jerseys", thumbLabel: "BEARS", thumbLabelBack: "LASTNAME" },
    jerseyBuffalo: { title: "Waist Cut, FB V-Neck Jersey BUFFALO", kind: "jersey", colors: ["#dadcd9", "#0e0e10", "#1d3a8a"], colorway: "Whte Jerseys", thumbLabel: "15", thumbLabelBack: "15" },
    jerseyLake: { title: "Waist Cut, FB V-Neck Jersey LAKE DALLAS", kind: "jersey", colors: ["#1a1f33", "#0e0e10", "#ffffff"], colorway: "Navy Jerseys", thumbLabel: "25", thumbLabelBack: "25" },
    integratedPant: { title: "Integrated Pant BEARS", kind: "shorts", colors: teamColors },
    sfnFaux: { title: "Set-In, Faux Full Button Jersey DIAMOND", kind: "shorts", colors: ["#dadcd9", "#0e0e10"] },
    loretta: { title: "Loretta Backpack BEARS", kind: "backpack", colors: ["#dadcd9", "#1d3a8a"] },
    sfnLite: { title: "SFN Lite, V-Neck Jersey", kind: "jersey", colors: ["#dadcd9", "#1d3a8a", "#0e0e10"], colorway: "Whte Jerseys", thumbLabel: "15", thumbLabelBack: "15" },
    sfnShort: { title: "SFN Lite Short HOYAS", kind: "shorts", colors: ["#dadcd9", "#1d3a8a"] }
  };

  const myOrders = [
  {
    id: "mo-1", product: products.jerseyBears, organization: orgName,
    factoryOrderNum: "267891235122", webOrderNum: "08a9fc6312f3", cartName: `PG Junior ${teamName.charAt(0)}${teamName.toLowerCase().slice(1)} BB`,
    rep, sport: "Basketball", quantity: 12, shippingGroup: "PMP",
    dueDate: "10/14/2025", status: "artwork-production",
    ...baseOrderShape
  },
  {
    id: "mo-2", product: products.jerseyBuffalo, organization: orgName,
    factoryOrderNum: "267891235122", webOrderNum: "08a9fc6312f3", cartName: `PG Junior ${teamName.charAt(0)}${teamName.toLowerCase().slice(1)} BB`,
    rep, sport: "Basketball", quantity: 12, shippingGroup: "PMP",
    dueDate: "10/10/2025", status: "shipped", tracking: "ZXY356TJGSAMAK23A",
    isReorder: true,
    ...baseOrderShape
  },
  {
    id: "mo-3", product: products.jerseyLake, organization: orgName,
    factoryOrderNum: "267891235122", webOrderNum: "08a9fc6312f3", cartName: `PG Junior ${teamName.charAt(0)}${teamName.toLowerCase().slice(1)} BB`,
    rep, sport: "Basketball", quantity: 12, shippingGroup: "PMP",
    dueDate: "10/10/2025", status: "on-hold",
    highlight: true,
    ...baseOrderShape
  },
  {
    id: "mo-4", product: products.integratedPant, organization: orgName,
    factoryOrderNum: "267891235122", webOrderNum: "08a9fc6312f3", cartName: `PG Junior ${teamName.charAt(0)}${teamName.toLowerCase().slice(1)} BB`,
    rep, sport: "Basketball", quantity: 12, shippingGroup: "PMP",
    dueDate: "10/09/2025", status: "delivered", tracking: "ZXY356TJGSAMAK23A",
    ...baseOrderShape
  }];


  const fanOrders = [
  {
    id: "fo-1", product: products.jerseyBears, organization: orgName,
    factoryOrderNum: "267891235122", webOrderNum: "08a9fc6312f3", cartName: `PG Junior ${teamName.charAt(0)}${teamName.toLowerCase().slice(1)} FB`,
    customer: "Jared Winter", sport: "Basketball", quantity: 1, shippingGroup: "PMP",
    dueDate: "10/14/2025", status: "artwork-production",
    ...baseOrderShape, rep
  },
  {
    id: "fo-2", product: products.jerseyBuffalo, organization: orgName,
    factoryOrderNum: "267891235122", webOrderNum: "08a9fc6312f3", cartName: `PG Junior ${teamName.charAt(0)}${teamName.toLowerCase().slice(1)} FB`,
    customer: "Jared Winter", sport: "Basketball", quantity: 2, shippingGroup: "PMP",
    dueDate: "10/10/2025", status: "shipped", tracking: "ZXY356TJGSAMAK23A", isReorder: true,
    ...baseOrderShape, rep
  },
  {
    id: "fo-3", product: products.jerseyLake, organization: orgName,
    factoryOrderNum: "267891235122", webOrderNum: "08a9fc6312f3", cartName: `PG Junior ${teamName.charAt(0)}${teamName.toLowerCase().slice(1)} FB`,
    customer: "Jared Winter", sport: "Basketball", quantity: 1, shippingGroup: "PMP",
    dueDate: "10/10/2025", status: "on-hold", highlight: true,
    ...baseOrderShape, rep
  },
  {
    id: "fo-4", product: products.integratedPant, organization: orgName,
    factoryOrderNum: "267891235122", webOrderNum: "08a9fc6312f3", cartName: `PG Junior ${teamName.charAt(0)}${teamName.toLowerCase().slice(1)} FB`,
    customer: "Jared Winter", sport: "Basketball", quantity: 1, shippingGroup: "PMP",
    dueDate: "10/09/2025", status: "delivered", tracking: "ZXY356TJGSAMAK23A",
    ...baseOrderShape, rep
  },
  {
    id: "fo-5", product: products.loretta, organization: orgName,
    factoryOrderNum: "26091234514", webOrderNum: "39d1fb6827e4", cartName: "Loretta Baseball",
    customer: "Kyle Morris", sport: "Basketball", quantity: 1, shippingGroup: "BLB",
    dueDate: "10/5/2025", status: "shipped", tracking: "ZXY356TJGSAMAK23A",
    ...baseOrderShape, rep
  }];


  // Pending orders — mirrors the flattened structure: league stores get one
  // container per division plus one per unassigned team; single-team stores
  // get a single container for all orders.
  const mkPending = (id, product, itemName, orderDate, customer, customerEmail, teamInfo, teamRoster, player, type, size) => ({
    id, product, itemName, orderDate, customer, customerEmail,
    teamInfo, teamRoster, player, type, size,
    factory: "PMP", quantity: 1, status: "submitted",
    ...baseOrderShape, rep,
  });
  const PENDING_CUSTOMERS = [
  ["Susan Quinones", "susanquinones@gmail.com"], ["Frank Wright", "fwright@outlook.com"],
  ["Kyle Morris", "kmorris@aol.com"], ["Irene George", "igeorge@gmail.com"],
  ["Kate Hall", "khall@aol.com"], ["Aaron Brown", "abrown@hotmail.com"]];
  const PENDING_PLAYERS = ["Jalen Hurts", "Omar Calzoni", "Cooper Curtis", "Davis Aminoff", "Lincoln Herwitz", "Corey Stanton"];
  const PENDING_TYPES = ["Team Required", "Team Supplied", "Fan Gear"];
  const prodCycle = [products.jerseyBears, products.integratedPant, products.jerseyBuffalo, products.sfnLite, products.sfnShort, products.jerseyLake];
  const pendSizes = ["YL", "AM", "AL", "YM", "AS", "AXL"];
  let pendId = 0;
  const pendingRows = (teamInfo, teamRoster, count, seed) => Array.from({ length: count }, (_, i) => {
    const c = PENDING_CUSTOMERS[(seed + i) % PENDING_CUSTOMERS.length];
    return mkPending(`pd-${++pendId}`, prodCycle[(seed + i) % prodCycle.length],
      (seed + i) % 3 === 0 ? "Home Game Jersey" : null,
      `10/0${((seed + i) % 8) + 1}/2025`, c[0], c[1], teamInfo, teamRoster,
      PENDING_PLAYERS[(seed + i) % PENDING_PLAYERS.length],
      PENDING_TYPES[(seed + i) % PENDING_TYPES.length],
      pendSizes[(seed + i) % pendSizes.length]);
  });
  const isLeague = (store?.storeType || "league") === "league";
  const pending = isLeague ?
  [
  ...ROSTER_GROUP_SEED.map((g, gi) => ({
    shippingGroup: g.id.toUpperCase(),
    title: `${g.name} • ${rTeamCode(g.id)}`,
    subtitle: g.rosters.map((r) => r.name).join(", "),
    pct: gi % 2 === 0 ? 54 + gi * 9 : 100,
    fee: gi % 2 === 0 ? 30.00 : 0,
    rows: pendingRows(g.name, g.rosters[gi % g.rosters.length].name, 2 + (gi % 2), gi * 3)
  })),
  ...STANDALONE_ROSTER_SEED.map((r, ri) => ({
    shippingGroup: r.id.replace("loose-", "").toUpperCase(),
    title: `${r.name} • ${rTeamCode(r.id)}`,
    subtitle: "Unassigned team",
    pct: ri === 0 ? 100 : 45,
    fee: ri === 0 ? 0 : 30.00,
    rows: pendingRows(r.name, null, 2, 11 + ri * 2)
  }))] :
  [{
    shippingGroup: "PMP", title: `${teamName} • ${rTeamCode(store?.id || "single")}`,
    pct: 62, fee: 30.00,
    rows: pendingRows(store?.teamName || "Team Roster", null, 3, 0)
  }];

  return { myOrders, fanOrders, pending };
}
