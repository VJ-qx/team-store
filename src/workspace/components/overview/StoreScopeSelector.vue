<!-- Converted from workspace-app.jsx: StoreScopeSelector — the "All Stores" filter on the Overview.
     The scope is a Set of store ids (empty = all stores). -->
<template>
  <div ref="root" :style="{ position: 'relative' }">
    <button @click="() => setOpen((o) => !o)" :style="{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: scope.size ? '#f1f1f3' : '#fff', border: `1px solid ${scope.size ? '#c4c4c8' : '#d4d4d8'}`, borderRadius: '8px', padding: '12px 16px', cursor: 'pointer', fontSize: '13.5px', fontWeight: 600, color: '#0e0e10' }">
      <IconStore :size="16" /> {{ label }} <IconChevron :size="15" :style="{ color: '#6b6b72' }" />
    </button>
    <div v-if="open" :style="{ position: 'absolute', top: 'calc(100% + 8px)', right: '0', zIndex: 60, width: '280px', background: '#fff', border: '1px solid #e5e5e9', borderRadius: '10px', boxShadow: '0 12px 32px rgba(20,20,30,.14)', overflow: 'hidden' }">
      <div :style="{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid #ececf0' }">
        <span :style="{ fontSize: '12px', fontWeight: 700, letterSpacing: '.04em', color: '#6b6b72', textTransform: 'uppercase' }">Filter by store</span>
        <button v-if="scope.size > 0" @click="() => onChange(new Set())" :style="{ background: 'none', border: '0', padding: '0', cursor: 'pointer', fontSize: '12.5px', fontWeight: 600, color: '#e1251b' }">Clear</button>
      </div>
      <div :style="{ maxHeight: '280px', overflowY: 'auto', padding: '8px 0' }">
        <button v-for="s in stores" :key="s.id" @click="() => toggle(s.id)" :style="{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '12px', background: scope.has(s.id) ? '#fafafb' : 'transparent', border: '0', cursor: 'pointer', padding: '8px 16px' }">
          <span :style="{ width: '16px', height: '16px', borderRadius: '4px', flexShrink: 0, background: scope.has(s.id) ? '#0e0e10' : '#fff', border: `1.5px solid ${scope.has(s.id) ? '#0e0e10' : '#c4c4c8'}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }">
            <svg v-if="scope.has(s.id)" :width="11" :height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 12l5 5L20 6" />
            </svg>
          </span>
          <span :style="{ width: '24px', height: '24px', borderRadius: '50%', background: s.teamColors?.[0] || '#1d3a8a', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '9.5px', flexShrink: 0 }">{{ nameOf(s).slice(0, 2).toUpperCase() }}</span>
          <span :style="{ fontSize: '13.5px', fontWeight: 600, color: '#0e0e10', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }">{{ nameOf(s) }}</span>
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
