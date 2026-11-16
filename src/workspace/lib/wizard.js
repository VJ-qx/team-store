// Helpers for the Add Store wizard (Module 3, FR-3.1): the wizard's starting data, the step list, colors,
// the web address slug, phone formatting, the jersey number helper text and the announcement text helpers.
// Copied unchanged from the prototype (workspace-app.jsx / workspace-app-integrated.jsx). The integrated
// workspace's buildWizardData also keeps _fromVault (its Stock Vault starts a store with products).
// Saved pick-up locations are WS_PICKUP (data/pickup.js), the prototype's window.__wsPickup.
import { INTEGRATION } from '../integration.js';
import { WS_PICKUP } from '../data/pickup.js';
import { WIZARD_STEPS, WIZARD_STEPS_LEAGUE } from '../data/wizard.js';

export function wsPickupLocations() { return WS_PICKUP.filter((l) => l.enabled); }

export function buildWizardData(presetData) {
  const p = presetData || {};
  return {
    // Core branching flag — "league" (Multi-Team Hub) unlocks the division →
    // team canvas, product-to-team assignment, and team-manager mapping. "single"
    // (Single-Team Locker) enforces one roster and the streamlined flow.
    storeType: p.storeType || "",
    rosterAssignments: p.rosterAssignments || {},
    fundraisingEnabled: p.fundraisingEnabled ?? false,
    // existing store fields (carried through to finalize / dashboard)
    storeTitle: p.storeTitle || "",
    teamName: p.teamName || "",
    teamColors: p.teamColors || [],
    teamLogo: p.teamLogo || null,
    sport: p.sport || "",
    contactPref: p.contactPref || "Email & Phone",
    email: p.email || "",
    phone: p.phone || "",
    storeOpenMode: p.storeOpenMode || "set-window",
    storeOpenStart: p.storeOpenStart || "",
    storeOpenEnd: p.storeOpenEnd || "",
    // team + sport
    connectedTeam: p.connectedTeam || "",
    sports: p.sports || [],
    // store point of contact
    contactEmailMode: p.contactEmailMode || "",
    contactEmailSalesperson: p.contactEmailSalesperson || "",
    contactEmailCustom: p.contactEmailCustom || "",
    contactPhoneMode: p.contactPhoneMode || "",
    contactPhoneSalesperson: p.contactPhoneSalesperson || "",
    contactPhoneCustom: p.contactPhoneCustom || "",
    shipName: p.shipName || "",
    shipStreet: p.shipStreet || "",
    shipCity: p.shipCity || "",
    shipState: p.shipState || "",
    shipZip: p.shipZip || "",
    shipCountry: p.shipCountry || "United States",
    shipOption: p.shipOption || "",
    collectTax: p.collectTax !== false,
    taxRate: p.taxRate || "",
    // new wizard fields
    distributionFormat: p.distributionFormat || "",
    storeSlug: p.storeSlug || slugify(p.storeTitle || ""),
    _slugTouched: !!p.storeSlug,
    managerName: p.managerName || p.shipName || "",
    urgencyTimers: p.urgencyTimers != null ? p.urgencyTimers : true,
    distributionModel: p.distributionModel || "",
    curatedProducts: p.curatedProducts || [],
    // Step 1 additions — none are required; all have working defaults.
    allowDuplicateNumbers: p.allowDuplicateNumbers ?? false,
    numberSelection: p.numberSelection || "manager",
    additionalManagers: p.additionalManagers || [],
    shipApt: p.shipApt || "",
    // League Step 2 — Divisions & Teams (same shape as the workspace org).
    leagueStructure: p.leagueStructure || { groups: [], loose: [] },
    collectPlayerName: p.collectPlayerName != null ? p.collectPlayerName : true,
    collectRosterNumber: p.collectRosterNumber != null ? p.collectRosterNumber : true,
    taxMode: p.taxMode || (p.collectTax === false ? "exempt" : "zip"),
    flatTaxRate: p.flatTaxRate || "",
    taxState: p.taxState || "",
    taxLiabilityAgreed: p.taxLiabilityAgreed != null ? p.taxLiabilityAgreed : false,
    heroTheme: p.heroTheme || "pitch",
    primaryColor: p.primaryColor || p.teamColors && p.teamColors[1] || "#e1251b",
    announcement: p.announcement || "",
    // User-generated-template flow markers (Path B)
    _fromUserTemplate: !!p._fromUserTemplate,
    _templateName: p._templateName || "",
    _templateBlocks: p._templateBlocks || null,
    // Integrated workspace only: the Stock Vault's "Start a new store" marker.
    ...(INTEGRATION.on ? { _fromVault: !!p._fromVault } : {}),
  };
}

export function wizardStepsFor(storeType) {
  return storeType === "single" ? WIZARD_STEPS : WIZARD_STEPS_LEAGUE;
}

export function hexA(hex, a) {
  const h = (hex || "#e1251b").replace("#", "");
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

export function slugify(s) {
  return (s || "").toLowerCase().trim()
    .replace(/&/g, "and").replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

export function formatPhone(raw) {
  const d = String(raw || "").replace(/\D/g, "").slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

export function numberSelectionHelper(mode) {
  return mode === "manager" ? "Number entry lives on the roster (My Team tab). Duplicate-number rules from Roster Rules still apply." : "Number entry appears on the buyer product page. Duplicate-number rules from Roster Rules still apply.";
}

export function readableInk(hex) {
  const h = (hex || "").replace("#", "");
  if (h.length < 6) return "#0e0e10";
  const r = parseInt(h.slice(0, 2), 16),g = parseInt(h.slice(2, 4), 16),b = parseInt(h.slice(4, 6), 16);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.62 ? "#0e0e10" : "#ffffff";
}

export function annPlain(html) { return String(html || "").replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim(); }

export function annIsEmpty(html) { return annPlain(html).length === 0; }
// Sanitizing renderer — rep-authored markup renders formatted; script/embed/
// handler content is stripped, not escaped-and-displayed.

export function annSanitize(html) {
  return String(html || "")
    .replace(/<\s*(script|style|iframe|object|embed|link|meta)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, "")
    .replace(/<\s*(script|style|iframe|object|embed|link|meta)[^>]*\/?>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/javascript:/gi, "");
}

// Labels for the "Started from a template" banner.
export const tplTypeLabel = (k) => k === "single" ? "Individual Team Store" : "League Store";
export const tplDistLabel = (k) => k === "home" ? "Direct-To-Home" : "Ship to Team Manager";
