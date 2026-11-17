<!-- Converted from workspace-app.jsx and workspace-app-integrated.jsx: AddProductsBrowser — Add Products source
     browser (4C), one searchable grid across every source. Source is a filter chip, not a tab: every card
     carries its source badge, so a rep who knows the product name never has to guess which section holds it.
     The prototype's "right" element prop is the "right" slot. Integrated workspace: a group's note (an
     element the caller puts in the group) shows under the chips while that group is picked; here a group
     with note: true shows the caller's "note" slot. -->
<template>
  <div class="wx-product-browser">
    <div class="wx-product-browser__search-row">
      <div class="wx-product-browser__search">
        <span class="wx-product-browser__search-icon"><IconSearch :size="15" /></span>
        <input :value="q" v-controlled="q" @input="(e) => q = e.target.value" placeholder="Search all sources — designs, carts, vault blanks, templates, other stores" class="wx-product-browser__search-input" />
      </div>
      <slot name="right" />
    </div>
    <div class="wx-product-browser__chips">
      <button type="button" @click="pick('all')" :class="`wx-product-browser__chip${src === 'all' ? ' wx-product-browser__chip--on' : ''}`">All sources<span :class="`wx-product-browser__chip-count${src === 'all' ? ' wx-product-browser__chip-count--on' : ''}`">{{ total }}</span></button>
      <button v-for="g in list" :key="g.key" type="button" @click="pick(g.key)" :class="`wx-product-browser__chip${src === g.key ? ' wx-product-browser__chip--on' : ''}`">{{ g.label }}<span :class="`wx-product-browser__chip-count${src === g.key ? ' wx-product-browser__chip-count--on' : ''}`">{{ g.items.length }}</span></button>
      <span class="wx-product-browser__shown">{{ rows.length === total ? total + " item" + (total === 1 ? "" : "s") : rows.length + " of " + total + " shown" }}</span>
    </div>
    <slot v-if="INTEGRATION.on && src !== 'all' && (list.find((x) => x.key === src) || {}).note" name="note" />
    <div v-if="subsGroup" class="wx-product-browser__subs">
      <button v-for="t in [{ k: null, l: 'All' }].concat(subsGroup.subs)" :key="String(t.k)" type="button" @click="sub = t.k" :class="`wx-product-browser__sub${sub === t.k ? ' wx-product-browser__sub--on' : ''}`">{{ t.l }}</button>
    </div>
    <div v-if="rows.length === 0" class="wx-product-browser__empty">{{ needle ? "Nothing matches “" + q.trim() + "” in this source." : (src !== "all" && (list.find((x) => x.key === src) || {}).emptyHint) || (total === 0 ? "No products available yet." : "No products in this source yet.") }}</div>
    <div v-else class="wx-product-browser__grid">
      <SavedAssetCard v-for="it in rows" :key="it._key" :accent="accent" v-bind="it" />
    </div>
  </div>
</template>

<script>
import { INTEGRATION } from '../../integration.js';
import { IconSearch } from '../icons.js';
import SavedAssetCard from './SavedAssetCard.vue';

export default {
  name: 'AddProductsBrowser',
  components: { IconSearch, SavedAssetCard },
  props: {
    groups: { type: Array, default: undefined },
    accent: { type: String, default: undefined },
  },
  data() {
    return { q: "", src: "all", sub: null, INTEGRATION };
  },
  computed: {
    list() { return (this.groups || []).filter(Boolean); },
    total() { return this.list.reduce((n, g) => n + g.items.length, 0); },
    needle() { return this.q.trim().toLowerCase(); },
    rows() {
      const { needle, src, sub } = this;
      const match = (it) => !needle || ((it.title || "") + " " + (it.subtitle || "") + " " + (it.badge || "")).toLowerCase().indexOf(needle) >= 0;
      const rows = [];
      this.list.forEach((g) => { if (src === "all" || src === g.key) g.items.forEach((it) => { if (match(it) && (src === "all" || !sub || it.sub === sub)) rows.push(it); }); });
      return rows;
    },
    // The picked source's sub-filters (none for All sources, or a source without any).
    subsGroup() {
      if (this.src === "all") return null;
      const g = this.list.find((x) => x.key === this.src);
      if (!g || !g.subs || g.subs.length === 0) return null;
      return g;
    },
  },
  methods: {
    pick(key) { this.src = key; this.sub = null; },
  },
};
</script>
