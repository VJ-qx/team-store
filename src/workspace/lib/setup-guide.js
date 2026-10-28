// The Store Setup Guide cover card's status chip.
// Copied unchanged from the prototype (workspace-app.jsx / workspace-app-integrated.jsx); moved here from setup-guide.js.

export function sgStatusChip(store) {
  const live = !!store?.live;
  return live ? { label: "Open", dot: "#1f7a44" } : { label: "Draft · Not live yet", dot: "#9a9aa1" };
}
