<!-- Converted from workspace-app.jsx and workspace-app-integrated.jsx: SourcePill — brand/customizer selector
     shown wherever products are sourced (Add Products page, wizard Step 2). 40px tall, 12px side padding,
     8px radius. A mousedown outside closes its list. The integrated workspace offers only its connected
     Customizers (Victus). A style passed by the caller lands on the root, as in the prototype. -->
<template>
  <div ref="root" class="wx-source-pill">
    <button type="button" @click="open = !open" aria-haspopup="listbox" :aria-expanded="open" class="wx-source-pill__trigger">
      <span class="wx-source-pill__label">Source</span>
      <img v-if="logoOf(cur)" :src="logoOf(cur)" alt="" class="wx-source-pill__logo" :style="{ width: '24px', height: Math.round(24 * 2 / 3) + 'px' }" />
      <span v-else class="wx-source-pill__mono" :style="{ width: '24px', height: Math.round(24 * 2 / 3) + 'px' }">{{ (cur.name || "?").slice(0, 2).toUpperCase() }}</span>
      <span class="wx-source-pill__name">{{ cur.name }}</span>
      <IconChevron :size="14" :style="{ color: '#09090B', strokeWidth: 2.2, transition: 'transform .16s cubic-bezier(.2,0,0,1)', transform: open ? 'rotate(180deg)' : 'none' }" />
    </button>
    <div v-if="open" role="listbox" class="wx-source-pill__menu">
      <button v-for="k in keys" :key="k" type="button" role="option" :aria-selected="k === value" @click="() => { onChange && onChange(k); open = false; }" class="wx-source-pill__option" v-patch-style="{ background: k === value ? '#f4f4f5' : 'transparent' }" @mouseenter="(e) => { if (k !== value) e.currentTarget.style.background = '#fafafa'; }" @mouseleave="(e) => { if (k !== value) e.currentTarget.style.background = 'transparent'; }">
        <img v-if="logoOf(CUSTOMIZER_BRANDS[k])" :src="logoOf(CUSTOMIZER_BRANDS[k])" alt="" class="wx-source-pill__logo" :style="{ width: '21px', height: Math.round(21 * 2 / 3) + 'px' }" />
        <span v-else class="wx-source-pill__mono" :style="{ width: '21px', height: Math.round(21 * 2 / 3) + 'px' }">{{ (CUSTOMIZER_BRANDS[k].name || "?").slice(0, 2).toUpperCase() }}</span>
        <span class="wx-source-pill__option-name">{{ CUSTOMIZER_BRANDS[k].name }}</span>
        <IconCheck v-if="k === value" :size="14" :style="{ color: '#09090B', strokeWidth: 2.4 }" />
      </button>
    </div>
  </div>
</template>

<script>
import { ACCESSIBLE_CUSTOMIZERS, CUSTOMIZER_BRANDS } from '../../data/brands.js';
import { INTEGRATION } from '../../integration.js';
import { IconCheck, IconChevron } from '../icons.js';

export default {
  name: 'SourcePill',
  components: { IconCheck, IconChevron },
  props: {
    value: { type: String, default: INTEGRATION.on ? "victus" : "prolook" },
    onChange: { type: Function, default: undefined },
  },
  data() {
    return { open: false, CUSTOMIZER_BRANDS };
  },
  computed: {
    // Integrated workspace: only connected Customizers are selectable sources (Victus).
    keys() { return INTEGRATION.on ? ACCESSIBLE_CUSTOMIZERS.filter((k) => CUSTOMIZER_BRANDS[k]) : Object.keys(CUSTOMIZER_BRANDS); },
    cur() {
      if (INTEGRATION.on) return CUSTOMIZER_BRANDS[this.keys.includes(this.value) ? this.value : this.keys[0]] || CUSTOMIZER_BRANDS.victus;
      return CUSTOMIZER_BRANDS[this.value] || CUSTOMIZER_BRANDS.prolook;
    },
  },
  watch: {
    // React: useEffect on [open] — while open, a mousedown outside closes it.
    open(open) {
      this.unlisten();
      if (open) this.listen();
    },
  },
  beforeUnmount() {
    this.unlisten();
  },
  methods: {
    logoOf(b) { return b.logoBlack || b.logoInk || b.logo; },
    listen() {
      this.onDocDown = (e) => { if (this.$refs.root && !this.$refs.root.contains(e.target)) this.open = false; };
      document.addEventListener("mousedown", this.onDocDown);
    },
    unlisten() {
      if (this.onDocDown) document.removeEventListener("mousedown", this.onDocDown);
      this.onDocDown = null;
    },
  },
};
</script>
