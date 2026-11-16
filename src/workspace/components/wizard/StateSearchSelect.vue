<!-- Converted from workspace-app.jsx: StateSearchSelect — a type-ahead State picker: filters by name or
     abbreviation, arrow keys and Enter pick, Escape or a mousedown outside closes the list. -->
<template>
  <div ref="wrap" class="wx-state-select">
    <div class="wx-state-select__label">{{ label }}</div>
    <input :value="open ? q : (value || '')" :placeholder="value || 'Search by state or abbreviation'" @focus="onFocus" @input="(e) => { setQ(e.target.value); setOpen(true); setHi(0); }" @keydown="onKeyDown" class="wx-state-select__input" />
    <div v-if="open" class="wx-state-select__menu">
      <div v-if="list.length === 0" class="wx-state-select__empty">No state matches "{{ q }}"</div>
      <button v-for="(s, i) in list" :key="s" type="button" @mouseenter="() => setHi(i)" @click="() => pick(s)" :class="`wx-state-select__option${(i === hi) ? ' wx-state-select__option--highlighted' : ''}${(value === s) ? ' wx-state-select__option--selected' : ''}`">
        <span>{{ s }}</span>
        <span class="wx-state-select__abbr">{{ TAX_STATE_ABBR[s] || "" }}</span>
      </button>
    </div>
  </div>
</template>

<script>
import { EG_STATES, TAX_STATE_ABBR } from '../../data/wizard.js';

export default {
  name: 'StateSearchSelect',
  props: {
    label: { type: String, default: "State" },
    value: { type: String, default: undefined },
    onChange: { type: Function, default: undefined },
  },
  data() {
    return { q: "", open: false, hi: 0, TAX_STATE_ABBR };
  },
  computed: {
    list() {
      const ql = this.q.trim().toLowerCase();
      return EG_STATES.filter((s) => !ql || s.toLowerCase().includes(ql) || (TAX_STATE_ABBR[s] || "").toLowerCase().startsWith(ql));
    },
  },
  mounted() {
    // React: useEffect with [] — a mousedown outside closes the list.
    this.onDocMouseDown = (e) => { if (this.$refs.wrap && !this.$refs.wrap.contains(e.target)) this.setOpen(false); };
    document.addEventListener("mousedown", this.onDocMouseDown);
  },
  beforeUnmount() {
    document.removeEventListener("mousedown", this.onDocMouseDown);
  },
  methods: {
    setQ(v) { this.q = v; },
    setOpen(v) { this.open = v; },
    setHi(v) { this.hi = typeof v === "function" ? v(this.hi) : v; },
    pick(s) { this.onChange(s); this.setQ(""); this.setOpen(false); },
    onFocus() { this.setOpen(true); this.setQ(""); this.setHi(0); },
    onKeyDown(e) {
      const { list } = this;
      if (e.key === "ArrowDown") { e.preventDefault(); this.setHi((h) => Math.min(h + 1, list.length - 1)); }
      else if (e.key === "ArrowUp") { e.preventDefault(); this.setHi((h) => Math.max(h - 1, 0)); }
      else if (e.key === "Enter") { e.preventDefault(); if (list[this.hi]) this.pick(list[this.hi]); }
      else if (e.key === "Escape") this.setOpen(false);
    },
  },
};
</script>
