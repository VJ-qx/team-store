// Customizer brands. Moved unchanged from workspace-app.jsx (standard) and
// workspace-app-integrated.jsx (integrated: adds Victus, and Victus is the accessible customizer).
import { INTEGRATION } from '../integration.js';

export const CUSTOMIZER_BRANDS = INTEGRATION.on
  ? {
    prolook: { name: "PROLOOK", logoInk: "assets/prolook-mark-ink.png", logoBlack: "assets/prolook-mark-black.png", logoWhite: "assets/prolook-mark.png" },
    victus: { name: "Victus", wordmark: "VICTUS", logo: "assets/brands/victus.png", logoInk: "assets/brands/victus.png", logoBlack: "assets/brands/victus.png" },
    "game-one": { name: "Game One", wordmark: "GAME ONE" },
    riddell: { name: "Riddell", wordmark: "Riddell", logo: "assets/brands/riddell.png" },
    legends: { name: "Legends", wordmark: "LEGENDS" },
    axe: { name: "Axe", wordmark: "AXE", logo: "assets/brands/axe.png", logoOnDark: true },
    alli: { name: "ALLI", wordmark: "ALLI", logo: "assets/brands/alli.png" },
    baden: { name: "Baden", wordmark: "BADEN", logo: "assets/brands/baden.png" },
    "perfect-game": { name: "Perfect Game", wordmark: "PERFECT GAME", logo: "assets/brands/perfect-game.png" },
  }
  : {
    prolook: { name: "PROLOOK", logoInk: "assets/prolook-mark-ink.png", logoBlack: "assets/prolook-mark-black.png", logoWhite: "assets/prolook-mark.png" },
    "game-one": { name: "Game One", wordmark: "GAME ONE" },
    riddell: { name: "Riddell", wordmark: "Riddell", logo: "assets/brands/riddell.png" },
    legends: { name: "Legends", wordmark: "LEGENDS" },
    axe: { name: "Axe", wordmark: "AXE", logo: "assets/brands/axe.png", logoOnDark: true },
    alli: { name: "ALLI", wordmark: "ALLI", logo: "assets/brands/alli.png" },
    baden: { name: "Baden", wordmark: "BADEN", logo: "assets/brands/baden.png" },
    "perfect-game": { name: "Perfect Game", wordmark: "PERFECT GAME", logo: "assets/brands/perfect-game.png" },
  };

export const ACCESSIBLE_CUSTOMIZERS = INTEGRATION.on ? ["victus"] : ["prolook"];
