<!-- Converted from workspace-app.jsx: SelectField — a dropdown with a floating label: click to open, pick
     an option (on mousedown), a mousedown outside closes it. A style passed by the caller lands on the
     root, after its own. Options are values or { value, label }. -->
<template>
  <div ref="root" :style="{ position: 'relative', flex: 1 }">
    <div tabindex="0" @focus="() => setFocus(true)" @blur="() => setFocus(false)" @click="() => setOpen((v) => !v)" :style="{ position: 'relative', border: `1px solid ${error ? '#b81d14' : open || focus ? '#0e0e10' : '#d4d4d8'}`, borderRadius: '4px', background: '#fff', padding: '16px 40px 16px 12px', cursor: 'pointer', userSelect: 'none', minHeight: '48px', fontSize: '14px' }">
      <label :style="{ position: 'absolute', left: '12px', top: float ? '-7px' : '14px', fontSize: float ? '11px' : '13px', color: error ? '#b81d14' : open || focus ? '#0e0e10' : '#6b6b72', background: '#fff', padding: float ? '0 4px' : 0, pointerEvents: 'none', transition: 'all .12s ease', fontWeight: float ? 500 : 400 }">{{ label }}</label>
      <div :style="{ color: filled ? '#0e0e10' : 'transparent' }">{{ selected?.label || selected?.toString() || "—" }}</div>
      <IconChevron :size="18" :style="{ position: 'absolute', right: '12px', top: '50%', transform: `translateY(-50%) rotate(${open ? 180 : 0}deg)`, transition: 'transform .15s', color: '#6b6b72' }" />
    </div>
    <div v-if="open" :style="{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: '#fff', border: '1px solid #e5e5e9', borderRadius: '6px', boxShadow: '0 8px 24px rgba(20,20,30,.10)', zIndex: 30, maxHeight: '280px', overflowY: 'auto' }">
      <div v-for="o in options" :key="o.value || o" @mousedown="(e) => { e.preventDefault(); onChange(o.value || o); setOpen(false); }" v-patch-style="{ padding: '12px 16px', cursor: 'pointer', fontSize: '14px', background: (o.value || o) === value ? '#f7f7f8' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }" @mouseenter="(e) => { if ((o.value || o) !== value) e.currentTarget.style.background = '#fafafb'; }" @mouseleave="(e) => { if ((o.value || o) !== value) e.currentTarget.style.background = 'transparent'; }">
        <span>{{ o.label || o }}</span>
        <IconCheck v-if="(o.value || o) === value" :size="16" />
      </div>
    </div>
    <div v-if="error" :style="{ color: '#b81d14', fontSize: '11px', marginTop: '4px', marginLeft: '2px' }">{{ error }}</div>
  </div>
</template>

<script>
import { patchStyle } from '../../directives.js';
import { IconCheck, IconChevron } from '../icons.js';

export default {
  name: 'SelectField',
  components: { IconCheck, IconChevron },
  directives: { patchStyle },
  props: {
    label: { type: String, default: undefined },
    value: { type: String, default: undefined },
    onChange: { type: Function, default: undefined },
    options: { type: Array, default: undefined },
    error: { type: String, default: undefined },
    placeholder: { type: String, default: undefined },
  },
  data() {
    return { open: false, focus: false };
  },
  computed: {
    filled() { return !!this.value; },
    float() { return this.focus || this.filled || this.open; },
    selected() { return this.options?.find((o) => (o.value || o) === this.value); },
  },
  mounted() {
    // React: useEffect with [] — a mousedown outside closes the list.
    this.onDocMouseDown = (e) => { if (this.$refs.root && !this.$refs.root.contains(e.target)) this.setOpen(false); };
    document.addEventListener("mousedown", this.onDocMouseDown);
  },
  beforeUnmount() {
    document.removeEventListener("mousedown", this.onDocMouseDown);
  },
  methods: {
    setOpen(v) { this.open = typeof v === "function" ? v(this.open) : v; },
    setFocus(v) { this.focus = v; },
  },
};
</script>
