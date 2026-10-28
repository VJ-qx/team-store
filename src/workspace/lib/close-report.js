// Store Close Report helpers the store page uses: the readable accent colour and reduced motion.
// Copied unchanged from the prototype (workspace-app.jsx / workspace-app-integrated.jsx); moved here from close-report.js.
import { CR_INK } from '../theme.js';

// A readable accent: team color 1 unless it's too light to sit type on.
export function crLum(hex) {
  const h = String(hex || "#000").replace("#", "");
  const v = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(v, 16); if (isNaN(n)) return 0;
  return (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255;
}

export function crAccent(store) {
  const colors = (store?.teamColors || []).filter(Boolean);
  const pick = colors.find((c) => crLum(c) < 0.72);
  return pick || CR_INK;
}

// ─────────── Motion ───────────
export function crPrefersReduced() {
  try { return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; }
}
