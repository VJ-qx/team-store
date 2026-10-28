// The prototype's line icons (workspace-app.jsx, "Small SVG icon set"), the ones the converted
// screens use. Each is the Icon component with its path data, as in the prototype:
// <IconLock :size="16" /> renders <Icon :size="16" :d="[…]" />. Attributes (size, style, …) pass through.
import { h } from 'vue';
import Icon from './common/Icon.vue';

function icon(name, d, extra = {}) {
  const component = (props, { attrs }) => h(Icon, { ...attrs, ...extra, d });
  component.displayName = name;
  component.inheritAttrs = false;
  return component;
}

export const IconUser = icon("IconUser", ["M20 21a8 8 0 1 0-16 0", "M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10z"]);
export const IconBag = icon("IconBag", ["M6 7a6 6 0 1 1 12 0","M4 7h16l-1.4 12.2a2 2 0 0 1-2 1.8H7.4a2 2 0 0 1-2-1.8L4 7z"]);
export const IconStore = icon("IconStore", ["M3 9l1.5-5h15L21 9","M4 9v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9","M9 20v-5h6v5","M3 9h18"]);
export const IconDollar = icon("IconDollar", ["M12 1v22","M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"]);
export const IconSearch = icon("IconSearch", ["M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z","M16 16l4 4"]);
export const IconChevron = icon("IconChevron", "M6 9l6 6 6-6");
export const IconChevronRight = icon("IconChevronRight", "M9 6l6 6-6 6");
export const IconPlus = icon("IconPlus", ["M12 5v14","M5 12h14"]);
export const IconX = icon("IconX", ["M5 5l14 14","M19 5L5 19"]);
export const IconCheck = icon("IconCheck", "M4 12l5 5L20 6");
export const IconExternal = icon("IconExternal", ["M14 4h6v6","M20 4l-9 9","M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"]);
export const IconCircleCheck = icon("IconCircleCheck", ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z","M8.5 12l2.5 2.5L16 9"]);
export const IconClipboard = icon("IconClipboard", ["M9 4h6a1 1 0 0 1 1 1v1H8V5a1 1 0 0 1 1-1z","M8 6H6a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-2"]);
export const IconEdit = icon("IconEdit", ["M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3z","M14 6l4 4"]);
export const IconShield = icon("IconShield", ["M12 2l9 4v6c0 5-3.6 9.4-9 10-5.4-.6-9-5-9-10V6l9-4z","M9 12l2 2 4-4"]);
export const IconLock = icon("IconLock", ["M5 11h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1z","M8 11V7a4 4 0 0 1 8 0v4"]);
export const IconArrowRight = icon("IconArrowRight", ["M4 12h16","M14 6l6 6-6 6"]);
export const IconClock = icon("IconClock", ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z","M12 7v5l3 2"]);
export const IconUsers = icon("IconUsers", ["M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2","M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z","M22 21v-2a4 4 0 0 0-3-3.87","M16 3.13a4 4 0 0 1 0 7.75"]);
export const IconLayers = icon("IconLayers", ["M12 2l9 5-9 5-9-5 9-5z","M3 12l9 5 9-5","M3 17l9 5 9-5"]);
export const IconSettings = icon("IconSettings", ["M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z","M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"]);
export const IconMail = icon("IconMail", ["M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z","M3 7l9 6 9-6"]);
export const IconReceipt = icon("IconReceipt", ["M6 3h12a1 1 0 0 1 1 1v17l-3-2-2 2-2-2-2 2-2-2-3 2V4a1 1 0 0 1 1-1z","M9 8h6","M9 12h6"]);
export const IconTrendUp = icon("IconTrendUp", ["M3 17l6-6 4 4 8-8","M15 7h6v6"]);
export const IconTrendDown = icon("IconTrendDown", ["M3 7l6 6 4-4 8 8","M15 17h6v-6"]);
export const IconWallet = icon("IconWallet", ["M3 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v0H5a2 2 0 0 0-2 2z","M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z","M16 13h.01"]);
export const IconLogout = icon("IconLogout", ["M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4","M16 17l5-5-5-5","M21 12H9"]);
export const IconImage = icon("IconImage", ["M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z","M3 16l5-5 4 4 3-3 6 6","M9 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"]);
export const IconChevronLeft = icon("IconChevronLeft", "M15 18l-6-6 6-6");
export const IconInfo = icon("IconInfo", ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z","M12 11v5","M12 8h.01"]);
export const IconBarGraphBox = icon("IconBarGraphBox", ["M6 3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3z","M7.5 16.5v-2.25","M10.5 16.5V12","M13.5 16.5V9.75","M16.5 16.5v-9"]);
export const IconShirt = icon("IconShirt", ["M8 3l4 3 4-3 4.5 3.2-2.3 4-2.2-1.1V21H8V9.1L5.8 10.2 3.5 6.2 8 3z"]);
