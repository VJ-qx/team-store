<!-- Converted from workspace-app.jsx: PSModeControl — the price settings' $ / % switch for a whole section. -->
<template>
  <span title="One mode for the whole section — switching clears the entered values" class="wx-ps-mode" :style="locked ? { pointerEvents: 'none', opacity: 0.55 } : {}">
    <button v-for="(m2, i) in ['$', '%']" :key="m2" type="button" @click="onChange(m2)" :class="`wx-ps-mode__btn${(i > 0) ? ' wx-ps-mode__btn--divided' : ''}${(mode === m2) ? ' wx-ps-mode__btn--on' : ''}`">{{ m2 }}</button>
  </span>
</template>

<script>
export default {
  name: 'PSModeControl',
  props: {
    mode: { type: String, default: undefined },
    onChange: { type: Function, default: undefined },
    locked: { type: Boolean, default: undefined },
  },
};
</script>
