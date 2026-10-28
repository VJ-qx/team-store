// The signed-in rep's sample profile and brand accounts (My Account).
// Copied unchanged from the prototype (workspace-app.jsx / workspace-app-integrated.jsx); moved here from account.js.
import { INTEGRATION } from '../integration.js';

// Read-only profile mirrored from the Product Customizer identity the rep used to sign in.
export const ACCOUNT_PROFILE = {
  firstName: INTEGRATION.on ? "Jack" : "Hingle",
  lastName: INTEGRATION.on ? "White" : "McCringleberry",
  email: INTEGRATION.on ? "jwhite@marucci.com" : "hinglemycringle@prolook.com",
  countryCode: "+1",
  countryFlag: "🇺🇸",
  phone: "801 123 4567",
  country: "United States",
  state: "Utah",
  city: "Salt Lake City",
  zip: "84117",
  dealership: "Team Gear Athletics ABC",
  dealershipId: "TGA-40912",
};

export const BRAND_ADD_DESC = {
  "game-one": "Team dealer catalog", riddell: "Football equipment & apparel", legends: "Performance team apparel",
  axe: "Bats & baseball gear", alli: "Team uniforms & spirit wear", baden: "Balls & team equipment", "perfect-game": "Baseball & softball events",
};

export const ACCOUNT_BRANDS = INTEGRATION.on
  ? [{ id: "victus", name: "Victus", desc: "Primary customizer & catalog", connected: true, sso: true }]
  : [{ id: "prolook", name: "Prolook", desc: "Primary customizer & catalog", connected: true, sso: true }];

// Demo states for the Add-a-brand picker (Account Page, Epic B). Everything else is "connect".
export const BRAND_ADD_STATE = { riddell: "no-account", legends: "pending" };
