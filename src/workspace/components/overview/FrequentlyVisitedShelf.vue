<!-- Converted from workspace-app.jsx: FrequentlyVisitedShelf — the stores the rep opens most, ranked from
     the visits stored in localStorage (re-read when the window regains focus). -->
<template>
  <div :style="{ marginBottom: '20px' }">
    <div :style="{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }">
      <div :style="{ display: 'flex', alignItems: 'baseline', gap: '10px' }">
        <span :style="{ fontSize: '12px', fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', color: OV_MUTED }">Frequently Visited</span>
        <span :style="{ fontSize: '11.5px', color: '#9a9aa1' }">Updated automatically from your activity</span>
      </div>
      <button v-if="ranked.length > 0" @click="onGoStores" :style="{ background: 'transparent', border: '0', padding: '0', cursor: 'pointer', color: '#2563eb', fontSize: '13px', fontWeight: 600 }">All stores →</button>
    </div>
    <div v-if="ranked.length > 0" :style="{ display: 'flex', gap: '12px', alignItems: 'stretch', justifyContent: 'flex-start', overflowX: 'auto', overflowY: 'hidden', paddingBottom: '6px', scrollbarWidth: 'thin' }">
      <div v-for="r in ranked" :key="r.store.id" :style="{ flex: '0 0 300px', width: '300px', minWidth: '0' }">
        <StoreCard :store="r.store" condensed :context="visitLabel(r)" :onManage="() => open(r.store.id)">
          <template #contextIcon>
            <IconClock :size="11" :style="{ color: '#9a9aa1', strokeWidth: 2 }" />
          </template>
        </StoreCard>
      </div>
    </div>
    <div v-else :style="{ border: '1px dashed #d8d8de', borderRadius: '10px', background: '#fff', padding: '18px 22px', display: 'flex', alignItems: 'center', gap: '16px' }">
      <span :style="{ width: '38px', height: '38px', borderRadius: '9px', background: '#f5f5f7', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }">
        <IconClock :size="18" :style="{ color: '#9a9aa1' }" />
      </span>
      <div :style="{ flex: 1, minWidth: '0' }">
        <div :style="{ fontSize: '13.5px', fontWeight: 800, color: OV_INK }">Nothing to shortcut yet</div>
        <div :style="{ fontSize: '12.5px', color: OV_MUTED, marginTop: '3px' }">Open a store and it earns its place here — the stores you work most land in this row.</div>
      </div>
      <button @click="onGoStores" :style="{ flexShrink: 0, background: '#fff', border: '1px solid ' + OV_INK, borderRadius: '7px', padding: '9px 16px', fontSize: '12.5px', fontWeight: 700, color: OV_INK, cursor: 'pointer' }">Browse stores →</button>
    </div>
  </div>
</template>

<script>
import { rankFrequentStores, visitLabel } from '../../lib/overview.js';
import { readStoreVisits } from '../../storage/store-visits.js';
import { OV_INK, OV_MUTED } from '../../theme.js';
import { IconClock } from '../icons.js';
import StoreCard from '../stores/StoreCard.vue';

export default {
  name: 'FrequentlyVisitedShelf',
  components: { IconClock, StoreCard },
  props: {
    stores: { type: Array, default: () => [] },
    onManageStore: { type: Function, default: undefined },
    onGoStores: { type: Function, default: undefined },
  },
  data() {
    return { OV_INK, OV_MUTED, visits: readStoreVisits() };
  },
  computed: {
    ranked() {
      return rankFrequentStores(this.stores, this.visits);
    },
  },
  mounted() {
    // React: useEffect with [] — re-read the visits when the window regains focus.
    this.onFocus = () => { this.visits = readStoreVisits(); };
    window.addEventListener("focus", this.onFocus);
  },
  beforeUnmount() {
    window.removeEventListener("focus", this.onFocus);
  },
  methods: {
    visitLabel,
    open(id) {
      this.onManageStore && this.onManageStore(id);
    },
  },
};
</script>
