<!-- Converted from workspace-app.jsx: ToggleSwitch — the on/off switch at the end of a setting's row. The
     accent prop is accepted but unused, as in the prototype. -->
<template>
  <button type="button" @click="() => onChange(!on)" :class="`wx-toggle${on ? ' wx-toggle--on' : ''}`">
    <span :class="`wx-toggle__knob${on ? ' wx-toggle__knob--on' : ''}`" />
  </button>
</template>

<script>
export default {
  name: 'ToggleSwitch',
  props: {
    on: { type: Boolean, default: undefined },
    onChange: { type: Function, default: undefined },
    accent: { type: String, default: "#e1251b" },
  },
};
</script>
