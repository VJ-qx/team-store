<!-- Converted from workspace-app.jsx: ToolbarMenu — the white list the toolbar's Show Filters and
     Sort By buttons open. Options are strings, or { label, sub: [...] } for a row that expands into a
     sub-list (Status, Sport, Location). A mousedown outside the list, or Escape, closes it. -->
<template>
  <div ref="root" :class="`wx-toolbar-menu wx-toolbar-menu--${align}`" :style="{ width: px(width) }">
    <div v-for="(opt, i) in options" :key="labelOf(opt)">
      <div role="menuitem" @click="() => rowClick(opt)" :class="`wx-toolbar-menu__row${i > 0 ? ' wx-toolbar-menu__row--divided' : ''}${value === labelOf(opt) && !subOf(opt) ? ' wx-toolbar-menu__row--selected' : ''}`" @mouseenter="(e) => (e.currentTarget.style.background = '#f6f6f8')" @mouseleave="(e) => (e.currentTarget.style.background = value === labelOf(opt) && !subOf(opt) ? '#fafafb' : '#fff')">
        <span>{{ labelOf(opt) }}</span>
        <IconChevron v-if="subOf(opt)" :size="15" :style="{ color: '#9a9aa1', transform: openSub === labelOf(opt) ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }" />
        <IconCheck v-else-if="value === labelOf(opt)" :size="15" :style="{ color: '#0e0e10' }" />
      </div>
      <div v-if="subOf(opt) && openSub === labelOf(opt)" class="wx-toolbar-menu__sub">
        <div v-for="s in subOf(opt)" :key="subLabel(s)" @click="() => { onSelect(subLabel(s)); onClose(); }" :class="`wx-toolbar-menu__sub-row${value === subLabel(s) ? ' wx-toolbar-menu__sub-row--selected' : ''}`" @mouseenter="(e) => (e.currentTarget.style.background = '#eeeef1')" @mouseleave="(e) => (e.currentTarget.style.background = value === subLabel(s) ? '#f1f1f3' : '#fafafb')">
          <span>{{ subLabel(s) }}</span>
          <IconCheck v-if="value === subLabel(s)" :size="14" :style="{ color: '#0e0e10' }" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { px } from '../../lib/style.js';
import { IconCheck, IconChevron } from '../icons.js';

export default {
  name: 'ToolbarMenu',
  components: { IconCheck, IconChevron },
  props: {
    options: { type: Array, required: true },
    value: { default: undefined },
    onSelect: { type: Function, default: undefined },
    onClose: { type: Function, default: undefined },
    align: { type: String, default: "left" },
    width: { default: 232 },
  },
  data() {
    return { openSub: null };
  },
  mounted() {
    // React: useEffect on [onClose] — a mousedown outside the list, or Escape, closes it.
    this.onDocMouseDown = (e) => { if (this.$refs.root && !this.$refs.root.contains(e.target)) this.onClose(); };
    this.onDocKeyDown = (e) => { if (e.key === "Escape") this.onClose(); };
    document.addEventListener("mousedown", this.onDocMouseDown);
    document.addEventListener("keydown", this.onDocKeyDown);
  },
  beforeUnmount() {
    document.removeEventListener("mousedown", this.onDocMouseDown);
    document.removeEventListener("keydown", this.onDocKeyDown);
  },
  methods: {
    px,
    labelOf(opt) { return typeof opt === "string" ? opt : opt.label; },
    subOf(opt) { return typeof opt === "object" ? opt.sub : null; },
    subLabel(s) { return typeof s === "string" ? s : s.label; },
    rowClick(opt) {
      const label = this.labelOf(opt);
      const sub = this.subOf(opt);
      const subOpen = this.openSub === label;
      if (sub) this.openSub = subOpen ? null : label; else { this.onSelect(label); this.onClose(); }
    },
  },
};
</script>
