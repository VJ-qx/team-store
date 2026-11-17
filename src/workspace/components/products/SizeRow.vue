<!-- Converted from workspace-app.jsx: SizeRow — an ADULT / YOUTH size picker; a click outside closes its list. -->
<template>
  <div class="wx-size-row">
    <span class="wx-size-row__label">{{ label }} :</span>
    <div ref="root" class="wx-size-row__picker">
      <button @click="open = !open" class="wx-size-row__value">{{ value }}<IconChevron :size="12" /></button>
      <div v-if="open" class="wx-size-row__menu">
        <div v-for="o in options" :key="o" @click="() => { onChange(o); open = false; }" class="wx-size-row__option" v-patch-style="{ background: value === o ? '#fafafb' : 'transparent' }" @mouseenter="(e) => e.currentTarget.style.background = '#fafafb'" @mouseleave="(e) => e.currentTarget.style.background = value === o ? '#fafafb' : 'transparent'">{{ o }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { IconChevron } from '../icons.js';

export default {
  name: 'SizeRow',
  components: { IconChevron },
  props: {
    label: { type: String, default: undefined },
    value: { type: String, default: undefined },
    options: { type: Array, default: undefined },
    onChange: { type: Function, default: undefined },
  },
  data() {
    return { open: false };
  },
  // React: useEffect on [] — a mousedown outside the picker closes it.
  mounted() {
    this.onDocDown = (e) => { if (this.$refs.root && !this.$refs.root.contains(e.target)) this.open = false; };
    document.addEventListener("mousedown", this.onDocDown);
  },
  beforeUnmount() {
    document.removeEventListener("mousedown", this.onDocDown);
  },
};
</script>
