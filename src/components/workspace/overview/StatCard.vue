<!-- Converted from workspace-app.jsx: StatCard — one KPI on the Overview. The icon comes in the "icon"
     slot. With onClick it becomes a button-like card with a hover lift. -->
<template>
  <div @click="onClick" :role="onClick ? 'button' : undefined" :title="onClick ? 'View all orders' : undefined" v-patch-style="{ background: '#fff', border: `1px solid ${OV_LINE}`, borderRadius: '12px', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px', cursor: onClick ? 'pointer' : 'default', transition: 'box-shadow .15s, border-color .15s, transform .15s' }" @mouseenter="onEnter" @mouseleave="onLeave">
    <div :style="{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }">
      <span :style="{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 700, letterSpacing: '.07em', color: OV_MUTED, textTransform: 'uppercase' }">{{ label }}<IconChevronRight v-if="onClick" :size="13" :style="{ color: '#c4c4c8' }" />
      </span>
      <span :style="{ width: '36px', height: '36px', borderRadius: '9px', background: '#f5f5f7', color: OV_INK, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }">
        <slot name="icon" />
      </span>
    </div>
    <div :style="{ fontFamily: 'Archivo, sans-serif', fontSize: '32px', fontWeight: 800, color: OV_INK, lineHeight: 1, letterSpacing: '-.01em' }">{{ value }}</div>
    <div :style="{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px' }">
      <span v-if="delta != null" :style="{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: deltaDir === 'up' ? OV_GREEN : OV_RED, fontWeight: 700 }">
        <IconTrendUp v-if="deltaDir === 'up'" :size="15" />
        <IconTrendDown v-else :size="15" /> {{ delta }}</span>
      <span :style="{ color: OV_MUTED }">{{ sub }}</span>
    </div>
  </div>
</template>

<script>
import { OV_GREEN, OV_INK, OV_LINE, OV_MUTED, OV_RED } from '../../../workspace/data/overview.js';
import { IconChevronRight, IconTrendDown, IconTrendUp } from '../icons.js';

export default {
  name: 'StatCard',
  components: { IconChevronRight, IconTrendDown, IconTrendUp },
  props: {
    label: { type: String, default: undefined },
    value: { type: String, default: undefined },
    delta: { type: String, default: undefined },
    deltaDir: { type: String, default: 'up' },
    sub: { type: String, default: undefined },
    onClick: { type: Function, default: undefined },
  },
  data() {
    return { OV_GREEN, OV_INK, OV_LINE, OV_MUTED, OV_RED };
  },
  methods: {
    // The prototype attaches these only when the card is clickable.
    onEnter(e) {
      if (!this.onClick) return;
      e.currentTarget.style.borderColor = "#c4c4c8"; e.currentTarget.style.boxShadow = "0 6px 18px rgba(20,20,30,.07)"; e.currentTarget.style.transform = "translateY(-1px)";
    },
    onLeave(e) {
      if (!this.onClick) return;
      e.currentTarget.style.borderColor = OV_LINE; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none";
    },
  },
};
</script>
