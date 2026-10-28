// US state abbreviations for store addresses.
// Copied unchanged from the prototype (workspace-app.jsx / workspace-app-integrated.jsx); moved here from stores.js.
import { INTEGRATION } from '../integration.js';

// US state abbreviations for store locations (the integrated workspace adds Louisiana first).
export const STATE_ABBR = INTEGRATION.on
  ? { Louisiana: "LA", California: "CA", Texas: "TX", "New York": "NY", Florida: "FL", Washington: "WA", Oregon: "OR", Nevada: "NV", Arizona: "AZ", Colorado: "CO", Illinois: "IL", Massachusetts: "MA", Georgia: "GA", Ohio: "OH", Michigan: "MI", "North Carolina": "NC", "South Carolina": "SC", Virginia: "VA", Pennsylvania: "PA" }
  : { California: "CA", Texas: "TX", "New York": "NY", Florida: "FL", Washington: "WA", Oregon: "OR", Nevada: "NV", Arizona: "AZ", Colorado: "CO", Illinois: "IL", Massachusetts: "MA", Georgia: "GA", Ohio: "OH", Michigan: "MI", "North Carolina": "NC", "South Carolina": "SC", Virginia: "VA", Pennsylvania: "PA" };
