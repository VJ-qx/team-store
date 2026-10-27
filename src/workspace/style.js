// React's inline-style rules, for the few places where a style value is computed at runtime.
// Literal values in the templates are already written the Vue way ('12px'); these helpers cover
// values that come from variables and style objects passed around as data.

const UNITLESS = new Set(['animationIterationCount', 'aspectRatio', 'borderImageOutset', 'borderImageSlice', 'borderImageWidth', 'boxFlex', 'boxFlexGroup', 'boxOrdinalGroup', 'columnCount', 'columns', 'flex', 'flexGrow', 'flexPositive', 'flexShrink', 'flexNegative', 'flexOrder', 'gridArea', 'gridRow', 'gridRowEnd', 'gridRowSpan', 'gridRowStart', 'gridColumn', 'gridColumnEnd', 'gridColumnSpan', 'gridColumnStart', 'fontWeight', 'lineClamp', 'lineHeight', 'opacity', 'order', 'orphans', 'scale', 'tabSize', 'widows', 'zIndex', 'zoom', 'fillOpacity', 'floodOpacity', 'stopOpacity', 'strokeDasharray', 'strokeDashoffset', 'strokeMiterlimit', 'strokeOpacity', 'strokeWidth']);

// A number gets "px", as React does: 12 → "12px", 0 → 0. Strings stay as they are.
export const px = (v) => (typeof v === 'number' && v !== 0 ? `${v}px` : v);

// A React style object → a Vue one: numbers get "px" except on unitless properties, and vendor
// prefixes keep their leading dash (WebkitBackdropFilter → "-webkit-backdrop-filter").
export function reactStyle(style) {
  if (!style) return style;
  const out = {};
  for (const [key, value] of Object.entries(style)) {
    const vendor = /^(Webkit|Moz|O)[A-Z]/.test(key) || /^ms[A-Z]/.test(key);
    const name = vendor ? '-' + key.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase()).replace(/^-/, '') : key;
    const bare = key.replace(/^(Webkit|Moz|O|ms)([A-Z])/, (_, p, c) => c.toLowerCase());
    out[name] = typeof value === 'number' && value !== 0 && !UNITLESS.has(key) && !UNITLESS.has(bare) ? `${value}px` : value;
  }
  return out;
}
