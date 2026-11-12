<!-- Converted from workspace-app.jsx: FrequentlyVisitedShelf — the stores the rep opens most, ranked from
     the visits stored in localStorage (re-read when the window regains focus). -->
<template>
  <div class="wx-ov-shelf">
    <div class="wx-ov-shelf__head">
      <div class="wx-ov-shelf__titles">
        <span class="wx-ov__eyebrow">Frequently Visited</span>
        <span class="wx-ov__caption">Updated automatically from your activity</span>
      </div>
      <button v-if="ranked.length > 0" @click="onGoStores" class="wx-ov-shelf__all">All stores →</button>
    </div>
    <div v-if="ranked.length > 0" class="wx-ov-shelf__row">
      <div v-for="r in ranked" :key="r.store.id" class="wx-ov-shelf__cell">
        <StoreCard :store="r.store" condensed :context="visitLabel(r)" :onManage="() => open(r.store.id)">
          <template #contextIcon>
            <IconClock :size="11" :style="{ color: '#9a9aa1', strokeWidth: 2 }" />
          </template>
        </StoreCard>
      </div>
    </div>
    <div v-else class="wx-ov-shelf__empty">
      <span class="wx-ov-shelf__empty-icon">
        <IconClock :size="18" :style="{ color: '#9a9aa1' }" />
      </span>
      <div class="wx-ov-shelf__empty-body">
        <div class="wx-ov-shelf__empty-title">Nothing to shortcut yet</div>
        <div class="wx-ov-shelf__empty-text">Open a store and it earns its place here — the stores you work most land in this row.</div>
      </div>
      <button @click="onGoStores" class="wx-ov-shelf__browse">Browse stores →</button>
    </div>
  </div>
</template>

<script>
import { rankFrequentStores, visitLabel } from '../../lib/overview.js';
import { readStoreVisits } from '../../storage/store-visits.js';
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
    return { visits: readStoreVisits() };
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
