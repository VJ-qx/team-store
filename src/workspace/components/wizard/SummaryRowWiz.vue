<!-- Converted from workspace-app.jsx: SummaryRowWiz — one label / value row of Review & Deploy's setup
     summary; the value can be monospaced and take the accent (or another) color. -->
<template>
  <div :class="`wx-summary-row${last ? ' wx-summary-row--last' : ''}`">
    <span class="wx-summary-row__label">{{ label }}</span>
    <span :class="`wx-summary-row__value${mono ? ' wx-summary-row__value--mono' : ''}`" :style="{ color: accent || '#0e0e10' }">{{ value }}</span>
  </div>
</template>

<script>
export default {
  name: 'SummaryRowWiz',
  props: {
    label: { type: String, default: undefined },
    value: { type: String, default: undefined },
    mono: { type: Boolean, default: undefined },
    accent: { type: String, default: undefined },
    last: { type: Boolean, default: undefined },
  },
};
</script>
