// The localStorage key that remembers a store's Store Setup Guide was seen.
// Copied unchanged from the prototype (workspace-app.jsx / workspace-app-integrated.jsx); moved here from setup-guide.js.

// First-minute orientation modal. Reuses the Store Close Report shell verbatim —
// same chrome, proportions, and type scale; only the card payload differs.
// Variant (Individual 6 cards / League 7) is data-driven off storeType and
// overridable via prop/event so both can be reviewed side by side.
export function sgSeenKey(store) { return "ts_setup_guide_seen_" + (store?.id || "store"); }
