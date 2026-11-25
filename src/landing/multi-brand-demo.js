// DUMMY DATA (demo only, not real): Choose a Customizer with several brands. Not in the prototype.
//
// In the prototype every email is linked to PROLOOK only, and one setting (customizerAccountExists) decides
// whether every brand has a Customizer account or none does. An email starting with "multi@" (for example
// multi@dealership.com) is instead linked to the brands below, some with an account and some without, so the
// step can be previewed with mixed brands. Every other email works as in the prototype. For the frontend dev to
// replace with the rep's real brands and Customizer accounts from qx7.

// DUMMY DATA: sample brands and account states, not the rep's real ones.
// Brand id → whether the rep has a Customizer account for it.
export const MULTI_BRAND_DEMO = {
  prolook: true,
  riddell: true,
  legends: false,
  axe: false,
};

// Whether the email is the multi-brand demo email.
export function isMultiBrandDemo(email) {
  return /^multi@/i.test((email || '').trim());
}
