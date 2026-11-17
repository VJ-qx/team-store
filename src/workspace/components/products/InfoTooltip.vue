<!-- Converted from workspace-app.jsx: InfoTooltip — hover-triggered info tooltip for product settings. Its
     keyframes are a <style> element that exists while it is mounted, as in the prototype. -->
<template>
  <span @mouseenter="open = true" @mouseleave="open = false" @focus="open = true" @blur="open = false" tabindex="0" class="wx-info-tooltip">
    <span :class="`wx-info-tooltip__icon${open ? ' wx-info-tooltip__icon--open' : ''}`">i</span>
    <span v-if="open" role="tooltip" class="wx-info-tooltip__bubble">
      <span class="wx-info-tooltip__title">{{ title }}</span>
      <span class="wx-info-tooltip__body">{{ body }}</span>
      <span class="wx-info-tooltip__arrow" />
    </span>
    <component :is="'style'">{{ css }}</component>
  </span>
</template>

<script>
export default {
  name: 'InfoTooltip',
  props: {
    title: { type: String, default: undefined },
    body: { type: String, default: undefined },
  },
  data() {
    return { open: false, css: '@keyframes tipIn { from { opacity: 0; transform: translate(-50%, 4px) } to { opacity: 1; transform: translate(-50%, 0) } }' };
  },
};
</script>
