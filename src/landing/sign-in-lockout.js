// Approved change, not in the prototype yet: sign-in lockout (docs/README.md#approved-changes).
// BRD FR-1.11, Lockout: "Given 5 consecutive failed sign-in attempts on an account, then sign-in for
// that account is paused for 15 minutes, and the rep is shown the option to reset their password."
//
// Demo only, like the rest of the prototype's sign-in: failed attempts are counted in the page, per
// email, and forgotten when the page reloads. The real count and pause belong on the server.

export const MAX_FAILED_ATTEMPTS = 5;
export const PAUSE_MS = 15 * 60 * 1000;

const key = (email) => (email || '').trim().toLowerCase();

// When sign-in for this email is paused until, or 0 when it isn't paused.
export function pausedUntil(lockout, email, now) {
  const until = lockout[key(email)]?.pausedUntil || 0;
  return until > now ? until : 0;
}

// The lockout record after a failed attempt. The fifth failure in a row pauses sign-in and starts the count again.
export function recordFailure(lockout, email, now) {
  const failures = (lockout[key(email)]?.failures || 0) + 1;
  const paused = failures >= MAX_FAILED_ATTEMPTS;
  return { ...lockout, [key(email)]: { failures: paused ? 0 : failures, pausedUntil: paused ? now + PAUSE_MS : 0 } };
}

// Whether any email is still paused.
export function anyPaused(lockout, now) {
  return Object.values(lockout).some((l) => l.pausedUntil > now);
}

// The time left, as minutes and seconds ("14:51"), rounded up so it never shows 0:00 while paused.
export function formatRemaining(ms) {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
