// Saved pick-up locations (Workspace Settings → Pick-up locations, not converted yet). In the prototype this is the global window.__wsPickup.
// Copied unchanged from the prototype (workspace-app.jsx / workspace-app-integrated.jsx); moved here from store-home.js.
import { INTEGRATION } from '../integration.js';

// Saved pick-up locations. In the prototype this is the global window.__wsPickup, which Workspace
// Settings → Pick-up locations edits; that screen isn't converted yet, so this is its seed list.
export const WS_PICKUP = INTEGRATION.on ? [
  { id: "p1", name: "Hitter's House Baton Rouge", addr1: "5801 Siegen Lane", city: "Baton Rouge", state: "LA", zip: "70809", hours: [["Mon – Fri", "9:00 AM – 5:00 PM"], ["Sat", "10:00 AM – 2:00 PM"], ["Sun", "Closed"]], enabled: true, note: "(225) 236-0166 · Ask for Team Stores pick-up at the front desk." },
] : [
  { id: "p1", name: "Prolook Headquarters", addr1: "1700 Lakeside Pkwy", city: "Flower Mound", state: "TX", zip: "75028", hours: [["Mon – Fri", "9:00 AM – 5:00 PM"], ["Sat", "10:00 AM – 2:00 PM"], ["Sun", "Closed"]], enabled: true, note: "Ask for Team Stores pick-up at the front desk." },
];
