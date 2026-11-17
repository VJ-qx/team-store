<!-- Converted from workspace-app.jsx: CanvasPanelField — a labelled field in the team canvas's side panel. -->
<template>
  <div class="wx-canvas-field">
    <div class="wx-canvas-field__label">{{ label }}</div>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'CanvasPanelField',
  props: {
    label: { type: String, default: undefined },
  },
};
</script>
