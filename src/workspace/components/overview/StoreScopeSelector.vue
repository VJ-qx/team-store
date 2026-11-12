<!-- Converted from workspace-app.jsx: StoreScopeSelector — the "All Stores" filter on the Overview.
     The scope is a Set of store ids (empty = all stores). -->
<template>
  <div ref="root" class="wx-ov-scope">
    <button @click="() => setOpen((o) => !o)" :class="`wx-ov-scope__btn${scope.size ? ' wx-ov-scope__btn--active' : ''}`">
      <IconStore :size="16" /> {{ label }} <IconChevron :size="15" :style="{ color: '#6b6b72' }" />
    </button>
    <div v-if="open" class="wx-ov-scope__menu">
      <div class="wx-ov-scope__menu-head">
        <span class="wx-ov-scope__menu-title">Filter by store</span>
        <button v-if="scope.size > 0" @click="() => onChange(new Set())" class="wx-ov-scope__clear">Clear</button>
      </div>
      <div class="wx-ov-scope__list">
        <button v-for="s in stores" :key="s.id" @click="() => toggle(s.id)" :class="`wx-ov-scope__item${scope.has(s.id) ? ' wx-ov-scope__item--on' : ''}`">
          <span :class="`wx-ov-scope__check${scope.has(s.id) ? ' wx-ov-scope__check--on' : ''}`">
            <svg v-if="scope.has(s.id)" :width="11" :height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 12l5 5L20 6" />
            </svg>
          </span>
          <span class="wx-ov-scope__avatar" :style="{ background: s.teamColors?.[0] || '#1d3a8a' }">{{ nameOf(s).slice(0, 2).toUpperCase() }}</span>
          <span class="wx-ov-scope__name">{{ nameOf(s) }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { IconChevron, IconStore } from '../icons.js';

export default {
  name: 'StoreScopeSelector',
  components: { IconChevron, IconStore },
  props: {
    stores: { type: Array, default: () => [] },
    scope: { type: Set, required: true },
    onChange: { type: Function, default: undefined },
  },
  data() {
    return { open: false };
  },
  computed: {
    label() {
      const { scope, stores } = this;
      return scope.size === 0 ? "All Stores" : scope.size === 1
        ? (stores.find((s) => scope.has(s.id))?.teamName || stores.find((s) => scope.has(s.id))?.storeTitle || "1 store")
        : `${scope.size} stores`;
    },
  },
  watch: {
    // React: useEffect on [open] — while open, a mousedown outside closes it.
    open(open) {
      this.unlisten();
      if (open) {
        this.onDoc = (e) => { if (this.$refs.root && !this.$refs.root.contains(e.target)) this.setOpen(false); };
        document.addEventListener("mousedown", this.onDoc);
      }
    },
  },
  beforeUnmount() {
    this.unlisten();
  },
  methods: {
    setOpen(v) {
      this.open = typeof v === "function" ? v(this.open) : v;
    },
    unlisten() {
      if (this.onDoc) document.removeEventListener("mousedown", this.onDoc);
      this.onDoc = null;
    },
    toggle(id) {
      const next = new Set(this.scope);
      next.has(id) ? next.delete(id) : next.add(id);
      this.onChange(next);
    },
    nameOf(s) {
      return s.teamName || s.storeTitle || "Store";
    },
  },
};
</script>
