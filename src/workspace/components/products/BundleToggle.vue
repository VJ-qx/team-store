<!-- Converted from workspace-app.jsx: BundleToggle — an iOS-style switch. -->
<template>
  <span @click="onChange(!on)" role="switch" :aria-checked="on" :class="`wx-bundle-toggle${on ? ' wx-bundle-toggle--on' : ''}`">
    <span :class="`wx-bundle-toggle__knob${on ? ' wx-bundle-toggle__knob--on' : ''}`" />
  </span>
</template>

<script>
export default {
  name: 'BundleToggle',
  props: {
    on: { type: Boolean, default: undefined },
    onChange: { type: Function, default: undefined },
  },
};
</script>
