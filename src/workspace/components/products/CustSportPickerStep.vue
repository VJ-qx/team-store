<!-- Converted from workspace-app.jsx and workspace-app-integrated.jsx: CustSportPickerStep — Customize New
     Product, step 0: Men / Women tabs and the sport grid (the integrated workspace offers its four sports). -->
<template>
  <div class="wx-cust-sport">
    <div class="wx-cust-sport__inner">
      <div class="wx-cust-sport__head">
        <GenderTabs :gender="gender" :onChange="setGender" />
        <span class="wx-cust-sport__count">{{ items.length + " categories · pick one to start customizing" }}</span>
      </div>
      <div class="wx-cust-sport__grid">
        <SportCard v-for="it in items" :key="gender + '-' + it.id" :item="it" :onPick="() => onPick({ ...it, gender })" />
      </div>
    </div>
  </div>
</template>

<script>
import { CUST_MEN_CATEGORIES, CUST_WOMEN_CATEGORIES, WOMEN_ONLY } from '../../data/products.js';
import GenderTabs from './GenderTabs.vue';
import SportCard from './SportCard.vue';

export default {
  name: 'CustSportPickerStep',
  components: { GenderTabs, SportCard },
  props: {
    storeSport: { type: String, default: undefined },
    onPick: { type: Function, default: undefined },
  },
  data() {
    return { gender: WOMEN_ONLY.includes(this.storeSport) ? "women" : "men" };
  },
  computed: {
    items() { return this.gender === "women" ? CUST_WOMEN_CATEGORIES : CUST_MEN_CATEGORIES; },
  },
  methods: {
    setGender(v) { this.gender = v; },
  },
};
</script>
