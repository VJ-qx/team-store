<!-- Converted from workspace-app.jsx / workspace-app-integrated.jsx: Panel — a titled card on the
     Overview. "right" is a slot for a control beside the title. A style passed by the caller lands
     after the panel's own, as in the prototype's {...style}. -->
<template>
  <div :style="{ background: '#fff', border: `1px solid ${OV_LINE}`, borderRadius: '12px', padding: '20px 24px' }">
    <div :style="{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }">
      <div>
        <h3 :style="{ fontSize: INT ? '16px' : '15.5px', fontWeight: 800, margin: '0', color: OV_INK, letterSpacing: '.01em' }">{{ title }}</h3>
        <div v-if="subtitle" :style="{ fontSize: '12px', color: OV_MUTED, marginTop: '4px', lineHeight: 1.45 }">{{ subtitle }}</div>
      </div>
      <slot name="right" />
      <button v-if="action" @click="onAction" :style="{ background: 'transparent', border: '0', cursor: 'pointer', color: '#2563eb', fontSize: '13px', fontWeight: 600, padding: '0' }">{{ action }}</button>
    </div>
    <slot />
  </div>
</template>

<script>
import { INTEGRATION } from '../../../utils/integration.js';
import { OV_INK, OV_LINE, OV_MUTED } from './overview.js';

export default {
  name: 'Panel',
  props: {
    title: { type: String, default: undefined },
    subtitle: { type: String, default: undefined },
    action: { type: String, default: undefined },
    onAction: { type: Function, default: undefined },
  },
  data() {
    return { INT: INTEGRATION.on, OV_INK, OV_LINE, OV_MUTED };
  },
};
</script>
