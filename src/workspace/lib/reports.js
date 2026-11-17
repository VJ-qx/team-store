// Reports helpers.
// Copied unchanged from the prototype (workspace-app.jsx / workspace-app-integrated.jsx).
import { INTEGRATION } from '../integration.js';

// The rep viewing the workspace: whoever created most of "my" stores (the reports' viewer; a new store's
// createdBy). Each workspace has its own fallback name.
export function rptViewer(stores) {
  const mine = (stores || []).filter((s) => s.ownership === "mine" && s.createdBy);
  const c = {}; mine.forEach((s) => { c[s.createdBy] = (c[s.createdBy] || 0) + 1; });
  return Object.keys(c).sort((a, b) => c[b] - c[a])[0] || (INTEGRATION.on ? "Jack White" : "Hingle McCringleberry");
}
