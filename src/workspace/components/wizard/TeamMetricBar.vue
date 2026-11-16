<!-- Converted from workspace-app.jsx: TeamMetricBar — a labelled progress bar in a Team Database row
     (Mascot Traced, Master Reference). -->
<template>
  <div>
    <div class="wx-team-metric__label">{{ label }}: <span class="wx-team-metric__value">{{ value }}</span></div>
    <div class="wx-team-metric__track">
      <div class="wx-team-metric__fill" :style="{ width: `${pct}%`, background: color }" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'TeamMetricBar',
  props: {
    label: { type: String, default: undefined },
    value: { type: Number, default: undefined },
    max: { type: Number, default: undefined },
    color: { type: String, default: undefined },
  },
  computed: {
    pct() { const { value, max } = this; return Math.max(value > 0 ? 6 : 0, Math.min(100, (value / max) * 100)); },
  },
};
</script>
