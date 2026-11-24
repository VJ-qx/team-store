// Approved change, not in the prototype yet: Confirm your email (docs/README.md#approved-changes).
// Design: docs/approved-changes/confirm-your-email.png ("G-9 · Option 1: \"Confirm your email\" step").
//
// After "Create account", sign-up stops at "Confirm your email" until the rep opens the link in that email. Demo
// version, for the frontend dev to replace: opening the landing page with ?confirm=<email> stands in for that link,
// and continues sign-up with the dealership check ("Account created / Checking …").

// The email the confirmation link is for, or null when the page wasn't opened from one.
export function confirmLinkEmail() {
  try {
    const email = (new URLSearchParams(window.location.search).get('confirm') || '').trim();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
  } catch (e) {
    return null;
  }
}
