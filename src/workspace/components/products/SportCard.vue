<!-- Converted from workspace-app.jsx: SportCard — one sport in Customize New Product's sport picker. -->
<template>
  <button type="button" @click="onPick(item)" @mouseenter="hover = true" @mouseleave="hover = false" @focus="hover = true" @blur="hover = false" :aria-label="item.label" :class="`wx-sport-card${hover ? ' wx-sport-card--hover' : ''}`">
    <span aria-hidden="true" class="wx-sport-card__letter">{{ item.label.charAt(0) }}</span>
    <span class="wx-sport-card__label">{{ item.label }}</span>
    <span class="wx-sport-card__count">{{ (SPORT_STYLE_COUNTS[item.id] || 12) + " styles" }}</span>
  </button>
</template>

<script>
import { SPORT_STYLE_COUNTS } from '../../data/products.js';

export default {
  name: 'SportCard',
  props: {
    item: { type: Object, default: undefined },
    onPick: { type: Function, default: undefined },
  },
  data() {
    return { hover: false, SPORT_STYLE_COUNTS };
  },
};
</script>
