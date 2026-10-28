<!-- Converted from workspace-app.jsx: Icon (the line-icon base; the named icons are in ../icons.js). -->
<template>
  <svg :width="size" :height="size" viewBox="0 0 24 24" :fill="fill" stroke="currentColor" :stroke-width="stroke" stroke-linecap="round" stroke-linejoin="round">
    <template v-if="Array.isArray(d)">
      <path v-for="(p, i) in d" :key="i" :d="p" />
    </template>
    <path v-else :d="d" />
  </svg>
</template>

<script>
export default {
  name: 'Icon',
  props: {
    d: { type: [String, Array], default: undefined },
    size: { type: [Number, String], default: 18 },
    stroke: { type: [Number, String], default: 1.6 },
    fill: { type: String, default: 'none' },
  },
};
</script>
