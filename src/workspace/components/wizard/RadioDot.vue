<!-- Converted from workspace-app.jsx: RadioDot — a small radio circle, filled with the accent when on. -->
<template>
  <span class="wx-radio-dot" :style="{ border: `1.5px solid ${on ? accent : '#cfcfd5'}` }">
    <span v-if="on" class="wx-radio-dot__inner" :style="{ background: accent }" />
  </span>
</template>

<script>
export default {
  name: 'RadioDot',
  props: {
    on: { type: Boolean, default: undefined },
    accent: { type: String, default: "#e1251b" },
  },
};
</script>
