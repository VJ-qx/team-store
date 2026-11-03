<!-- Converted from workspace-app.jsx / workspace-app-integrated.jsx: Panel — a titled card on the
     Overview. "right" is a slot for a control beside the title. A style passed by the caller lands
     after the panel's own, as in the prototype's {...style}. -->
<template>
  <div class="wx-ov-panel">
    <div class="wx-ov-panel__head">
      <div>
        <h3 :class="`wx-ov-panel__title${INT ? ' wx-ov-panel__title--marucci' : ''}`">{{ title }}</h3>
        <div v-if="subtitle" class="wx-ov-panel__subtitle">{{ subtitle }}</div>
      </div>
      <slot name="right" />
      <button v-if="action" @click="onAction" class="wx-ov-panel__action">{{ action }}</button>
    </div>
    <slot />
  </div>
</template>

<script>
import { INTEGRATION } from '../../integration.js';

export default {
  name: 'Panel',
  props: {
    title: { type: String, default: undefined },
    subtitle: { type: String, default: undefined },
    action: { type: String, default: undefined },
    onAction: { type: Function, default: undefined },
  },
  data() {
    return { INT: INTEGRATION.on };
  },
};
</script>
