<!-- Converted from workspace-app.jsx: ChoiceCard — a selectable card for a radio-style choice (store type,
     schedule, fulfillment): accent ring, tint and check when active. The prototype's icon prop (an element)
     is the "icon" slot. -->
<template>
  <button type="button" @click="onSelect" @mouseenter="() => setHover(true)" @mouseleave="() => setHover(false)" :class="`wx-choice-card${active ? ' wx-choice-card--active' : ''}`" :style="{ minHeight: px(minHeight), border: `1.5px solid ${active ? accent : hover ? '#c7c7cd' : '#e5e5e9'}`, boxShadow: active ? `0 0 0 3px ${hexA(accent, 0.12)}` : 'none' }">
    <div class="wx-choice-card__top">
      <span v-if="$slots.icon" :class="`wx-choice-card__icon${active ? ' wx-choice-card__icon--active' : ''}`" :style="{ background: active ? accent : '#f1f1f3' }"><slot name="icon" /></span>
      <span class="wx-choice-card__check" :style="{ border: `1.5px solid ${active ? accent : '#cfcfd5'}`, background: active ? accent : '#fff' }">
        <IconCheck v-if="active" :size="13" :style="{ color: '#fff', strokeWidth: 3.4 }" />
      </span>
    </div>
    <div class="wx-choice-card__title-row">
      <span class="wx-choice-card__title">{{ title }}</span>
      <span v-if="badge" class="wx-choice-card__badge">{{ badge }}</span>
    </div>
    <span class="wx-choice-card__desc">{{ desc }}</span>
    <span v-if="points && points.length > 0" class="wx-choice-card__points">
      <span v-for="pt in points" :key="pt" :class="`wx-choice-card__point${active ? ' wx-choice-card__point--active' : ''}`"><IconCheck :size="12" :style="{ strokeWidth: 3, color: accent }" /> {{ pt }}</span>
    </span>
  </button>
</template>

<script>
import { hexA } from '../../lib/wizard.js';
import { px } from '../../lib/style.js';
import { IconCheck } from '../icons.js';

export default {
  name: 'ChoiceCard',
  components: { IconCheck },
  props: {
    active: { type: Boolean, default: undefined },
    onSelect: { type: Function, default: undefined },
    title: { type: String, default: undefined },
    desc: { type: String, default: undefined },
    badge: { type: String, default: undefined },
    points: { type: Array, default: undefined },
    accent: { type: String, default: "#e1251b" },
    minHeight: { type: Number, default: 0 },
  },
  data() {
    return { hover: false };
  },
  methods: {
    hexA,
    px,
    setHover(v) { this.hover = v; },
  },
};
</script>
