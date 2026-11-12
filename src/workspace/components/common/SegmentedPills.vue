<!-- Converted from workspace-app.jsx: SegmentedPills — the All Stores / My Stores / Joined Stores tabs on
     the Stores page (Module 3, FR-3.5 to FR-3.7). A black indicator slides under the selected tab; its
     position is measured from the DOM. The caller's style (the page's bottom margin) falls through to
     the root, as the prototype's style prop did. -->
<template>
  <div ref="host" role="tablist" class="wx-pills">
    <span v-if="ind" aria-hidden="true" class="wx-pills__indicator" :style="{ top: px(ind.y), width: px(ind.w), height: px(ind.h), transform: 'translateX(' + ind.x + 'px)' }" />
    <button v-for="t in items" :key="t.id" type="button" role="tab" :aria-selected="value === t.id" :data-seg="t.id" @click="() => onChange(t.id)" :class="`wx-pills__tab${value === t.id ? ' wx-pills__tab--on' : ''}`">{{ t.label }}<span v-if="t.count != null" :class="`wx-pills__count${value === t.id ? ' wx-pills__count--on' : ''}`">{{ t.count }}</span></button>
  </div>
</template>

<script>
import { px } from '../../lib/style.js';

export default {
  name: 'SegmentedPills',
  props: {
    items: { type: Array, required: true },
    value: { default: undefined },
    onChange: { type: Function, default: undefined },
  },
  data() {
    return { ind: null };
  },
  computed: {
    itemsKey() { return this.items.map((i) => i.label + ":" + i.count).join("|"); },
  },
  watch: {
    // React: useLayoutEffect on [measure, items key] — re-measure after the DOM has updated.
    value: { handler: 'measure', flush: 'post' },
    itemsKey: { handler: 'measure', flush: 'post' },
  },
  mounted() {
    this.measure();
    // React: useEffect on [measure] — re-measure on resize.
    this.onResize = () => this.measure();
    window.addEventListener("resize", this.onResize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.onResize);
  },
  methods: {
    px,
    measure() {
      const host = this.$refs.host; if (!host) return;
      const el = host.querySelector('[data-seg="' + this.value + '"]'); if (!el) { this.ind = null; return; }
      this.ind = { x: el.offsetLeft, w: el.offsetWidth, h: el.offsetHeight, y: el.offsetTop };
    },
  },
};
</script>
