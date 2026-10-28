// The prototype's editor settings (TWEAK_DEFAULTS, changed through Claude Design's Tweaks panel),
// pinned to the values each workspace shipped with. The Tweaks panel itself is prototype-only and
// not part of the Vue version; in development builds the parity tool sets these through
// window.__paritySetProps (see src/pages/WorkspacePage.vue).
import { INTEGRATION } from '../workspace/integration.js';

export const SETTINGS_DEFAULTS = {
  "overviewMode": false,
  "overviewEmpty": false,
  "zeroState": false,
  "seedData": true,
  "hasStoreAccess": true,
  "bypassGate": false,
  "checklistAccent": "red",
  "checklistPosition": "right",
  "portalHeadline": "fulfillment",
  "portalHero": "cinematic",
  "portalCta": "manager",
  "portalCtaColor": "black",
  "wizardAccent": "red",
  "wizardAthletes": 30,
  "templateLayout": "sidebar",
  "ssoWelcome": !INTEGRATION.on,
  "ssoMultiBrand": false,
  "ssoOriginBrand": INTEGRATION.on ? "victus" : "prolook",
  "authMode": INTEGRATION.on ? "native" : "linked",
};
