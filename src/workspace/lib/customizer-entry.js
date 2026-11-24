// Approved change, not in the prototype yet: Customizer loading screen (docs/README.md#approved-changes).
// Design: docs/approved-changes/customizer-loading-screen.png ("G-2 · Option 1: Full-page loading screen").
//
// Demo version, for the frontend dev to replace:
// - How the workspace knows it was opened from a Customizer's "Team Store" link: here, ?from=customizer in the
//   address. The real hand-off decides this (the rep is already signed in to that Customizer).
// - How long the screen shows: here, a fixed time. The real screen shows until the session is ready and the
//   Overview can open.

// As long as the landing page's "You're signed in" card shows before it opens the dashboard (1.7 s).
export const CUSTOMIZER_LOADING_MS = 1700;

// True when the workspace was opened from a Customizer's "Team Store" link.
export function openedFromCustomizer() {
  try { return new URLSearchParams(window.location.search).get('from') === 'customizer'; } catch (e) { return false; }
}
