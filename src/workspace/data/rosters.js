// Sample divisions, teams and team managers. The two workspaces differ in the seeded divisions (ROSTER_GROUP_SEED).
// Copied unchanged from the prototype (workspace-app.jsx / workspace-app-integrated.jsx); moved here from overview.js and rosters.js.
import { INTEGRATION } from '../integration.js';

export const TEAMS_ONLY_GROUP_SEED = [
  { id: "wx-n", name: "North Region", sport: "Lacrosse", color: "#1e3a6e" },
  { id: "wx-c", name: "Central Region", sport: "Lacrosse", color: "#7c1d2b" },
  { id: "wx-s", name: "South Region", sport: "Lacrosse", color: "#1f5c3a" },
].map((g) => ({ ...g, rosters: ["8U", "10U", "12U", "14U", "16U", "18U"].map((d) => ({ id: g.id + "-" + d.toLowerCase(), name: d + " Boys Lacrosse", division: d, players: 0 })) }));

export const BB_FIRST = ["Mason", "Liam", "Noah", "Ethan", "Owen", "Carter", "Wyatt", "Luke", "Jack", "Levi", "Miles", "Eli", "Ava", "Mia", "Zoe", "Ruby", "Nora", "Isla", "Cole", "Reid", "Beckett", "Finn", "Hudson", "Tate", "Brooks", "Nash", "Ivy", "June", "Sage", "Wren"];

export const BB_LAST = ["Rivera", "Pruitt", "Chen", "Okafor", "Sorensen", "Whitaker", "Delgado", "Marsh", "Kowalski", "Bennett", "Vaughn", "Ferris", "Nakamura", "Ortiz", "Hale", "Barlow", "Quintana", "Mercer", "Solberg", "Ashton", "Ibarra", "Foss", "Redding", "Calloway", "Voss", "Tran", "Muir", "Ellison", "Padgett", "Rooks"];

export const ROSTER_GROUP_SEED = INTEGRATION.on ? [
  { id: "sf", name: "10U Division", sport: "Baseball", color: "#1e3a6e", rosters: [
    { id: "sf-8", name: "10U Knights", division: "10U", players: 12 },
    { id: "sf-10", name: "10U Bombers", division: "10U", players: 11 },
    { id: "sf-12", name: "10U Gators", division: "10U", players: 12 }] },
  { id: "af", name: "12U Division", sport: "Baseball", color: "#7c1d2b", rosters: [
    { id: "af-8", name: "12U Knights", division: "12U", players: 12 },
    { id: "af-10", name: "12U Riverhawks", division: "12U", players: 11 },
    { id: "af-12", name: "12U Stingers", division: "12U", players: 12 }] },
  { id: "pg", name: "14U Division", sport: "Baseball", color: "#1f5c3a", rosters: [
    { id: "pg-8", name: "14U Knights", division: "14U", players: 13 },
    { id: "pg-10", name: "14U Mudcats", division: "14U", players: 12 }] }]
  : [
  { id: "sf", name: "Lone Peak", sport: "Boys Basketball", color: "#7c1d2b", rosters: [
    { id: "sf-8", name: "8U Boys Basketball", division: "8U", players: 11 },
    { id: "sf-10", name: "10U Boys Basketball", division: "10U", players: 11 },
    { id: "sf-12", name: "12U Boys Basketball", division: "12U", players: 11 },
    { id: "sf-14", name: "14U Boys Basketball", division: "14U", players: 11 }] },
  { id: "af", name: "Corner Canyon", sport: "Boys Basketball", color: "#1e3a6e", rosters: [
    { id: "af-8", name: "8U Boys Basketball", division: "8U", players: 10 },
    { id: "af-10", name: "10U Boys Basketball", division: "10U", players: 9 },
    { id: "af-12", name: "12U Boys Basketball", division: "12U", players: 10 },
    { id: "af-14", name: "14U Boys Basketball", division: "14U", players: 10 }] },
  { id: "pg", name: "Farmington", sport: "Boys Basketball", color: "#1f5c3a", rosters: [
    { id: "pg-8", name: "8U Boys Basketball", division: "8U", players: 11 },
    { id: "pg-10", name: "10U Boys Basketball", division: "10U", players: 10 },
    { id: "pg-12", name: "12U Boys Basketball", division: "12U", players: 10 },
    { id: "pg-14", name: "14U Boys Basketball", division: "14U", players: 11 }] },
  { id: "or", name: "Lehi", sport: "Boys Basketball", color: "#4a2367", rosters: [
    { id: "or-8", name: "8U Boys Basketball", division: "8U", players: 11 },
    { id: "or-10", name: "10U Boys Basketball", division: "10U", players: 10 },
    { id: "or-12", name: "12U Boys Basketball", division: "12U", players: 11 },
    { id: "or-14", name: "14U Boys Basketball", division: "14U", players: 11 }] },
  { id: "pv", name: "Skyridge", sport: "Boys Basketball", color: "#b4531a", rosters: [
    { id: "pv-8", name: "8U Boys Basketball", division: "8U", players: 11 },
    { id: "pv-10", name: "10U Boys Basketball", division: "10U", players: 11 },
    { id: "pv-12", name: "12U Boys Basketball", division: "12U", players: 11 },
    { id: "pv-14", name: "14U Boys Basketball", division: "14U", players: 11 }] }];

export const STANDALONE_ROSTER_SEED = [
  { id: "loose-coaches", name: "Coaches & Staff", players: 12 },
  { id: "loose-allstars", name: "Tournament All-Stars", players: 15 }];

// ─────────── Team Manager & Freight Mapping (feature-gated) ───────────
// Delegates logistics to per-team managers/coaches. Strictly gated: only visible
// when the store chose "Ship to Team Manager" during Step 1. Two modes per
// division: League-level or Individual-Team — bulk freight routes to whoever
// is effective per team. Hidden entirely for direct-to-home shipping.
export const MANAGER_SEED = {
  "sf": { firstName: "Marcus", lastName: "Whitfield", name: "Marcus Whitfield", email: "marcus.w@jazzbantum.org", phone: "(480) 555-0132", address: "1420 E Highland Dr, Draper, UT 84020" },
  "af": { firstName: "Denise", lastName: "Alvarez", name: "Denise Alvarez", email: "denise.a@jazzbantum.org", phone: "(480) 555-0148", address: "883 Canyon View Rd, Sandy, UT 84094" },
  "pg": { name: "", email: "", phone: "" },
  "or": { firstName: "Terrence", lastName: "Cole", name: "Terrence Cole", email: "terrence.c@jazzbantum.org", phone: "(480) 555-0175", address: "2210 N Center St, Lehi, UT 84043" },
  "pv": { name: "", email: "", phone: "" },
};

// Individual team (roster) overrides — assigning at the team level does NOT
// require the rest of the group to be assigned. Seeded to demonstrate: one team
// overriding its group manager (sf-14), and one team in a group with no group
// manager (pg-8).
export const TEAM_MANAGER_SEED = {
  "sf-14": { firstName: "Rico", lastName: "DiBiase", name: "Rico DiBiase", email: "rico.d@jazzbantum.org", phone: "(480) 555-0166", address: "77 W Vine St, Murray, UT 84107" },
  "pg-8": { firstName: "Renee", lastName: "Park", name: "Renee Park", email: "renee.p@jazzbantum.org", phone: "(480) 555-0210", address: "512 S 900 E, Farmington, UT 84025" },
};
