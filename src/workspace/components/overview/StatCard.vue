<!-- Converted from workspace-app.jsx: StatCard — one KPI on the Overview. The icon comes in the "icon"
     slot. With onClick it becomes a button-like card with a hover lift. -->
<template>
  <div @click="onClick" :role="onClick ? 'button' : undefined" :title="onClick ? 'View all orders' : undefined" :class="`wx-ov-stat${onClick ? ' wx-ov-stat--link' : ''}`" @mouseenter="onEnter" @mouseleave="onLeave">
    <div class="wx-ov-stat__head">
      <span class="wx-ov-stat__label">{{ label }}<IconChevronRight v-if="onClick" :size="13" :style="{ color: '#c4c4c8' }" />
      </span>
      <span class="wx-ov-stat__icon">
        <slot name="icon" />
      </span>
    </div>
    <div class="wx-ov-stat__value">{{ value }}</div>
    <div class="wx-ov-stat__foot">
      <span v-if="delta != null" :class="`wx-ov-stat__delta ${deltaDir === 'up' ? 'wx-ov-stat__delta--up' : 'wx-ov-stat__delta--down'}`">
        <IconTrendUp v-if="deltaDir === 'up'" :size="15" />
        <IconTrendDown v-else :size="15" /> {{ delta }}</span>
      <span class="wx-ov-stat__sub">{{ sub }}</span>
    </div>
  </div>
</template>

<script>
import { OV_LINE } from '../../theme.js';
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
