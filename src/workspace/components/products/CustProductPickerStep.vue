<!-- Converted from workspace-app.jsx: CustProductPickerStep — Customize New Product, step 1: the products for
     the picked sport (the prototype's sample basketball designs for every sport), with a name search. -->
<template>
  <div class="wx-cust-product">
    <div class="wx-cust-product__header">
      <div class="wx-cust-product__header-row">
        <div>
          <h2 class="wx-cust-product__title">{{ sportLabel }}</h2>
          <div class="wx-cust-product__subtitle">{{ genderLabel }}</div>
        </div>
        <div class="wx-cust-product__tools">
          <button class="wx-cust-product__tool"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3" /><path d="M12 2v2m0 16v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M2 12h2m16 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>Customize Your Look</button>
          <button class="wx-cust-product__tool"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="20" y2="12" /><line x1="12" y1="18" x2="20" y2="18" /></svg>Show Filters</button>
          <button class="wx-cust-product__tool"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0 4-4m-4 4-4-4" /></svg>Sort By: Default</button>
          <div class="wx-cust-product__search">
            <input :value="search" v-controlled="search" @input="(e) => search = e.target.value" :placeholder="'Search ' + sportLabel" class="wx-cust-product__search-input" />
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9a9aa1" stroke-width="2" stroke-linecap="round" class="wx-cust-product__search-icon"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
          </div>
        </div>
      </div>
    </div>

    <div class="wx-cust-product__body">
      <div class="wx-cust-product__line">
        <div>
          <div class="wx-cust-product__line-title-row">
            <span class="wx-cust-product__line-title">SFN Lite Round Neck Jerseys</span>
            <span class="wx-cust-product__pro-sizing">PRO SIZING</span>
          </div>
          <div class="wx-cust-product__line-sub">SFN Lite &nbsp;·&nbsp; {{ genderLabel }} &nbsp;·&nbsp; QXSFNLJ &nbsp;·&nbsp;<span class="wx-cust-product__link">Size Guide</span></div>
        </div>
        <div class="wx-cust-product__line-meta">
          <div class="wx-cust-product__tags">
            <span class="wx-cust-product__tag-sublimation">Sublimation</span>
            <span class="wx-cust-product__tag-qxx">QXX</span>
            <span class="wx-cust-product__tag-ship">Estimated ship date 3/25/2026</span>
          </div>
          <div class="wx-cust-product__msrp">
            <span class="wx-cust-product__msrp-label">MSRP Pricing:</span>
            <span>{{ "  Adult " }}</span><strong>$89.45</strong>
            <span>{{ "  Youth " }}</span><strong>$89.45</strong>
          </div>
          <div class="wx-cust-product__team-pricing">Team pricing available</div>
        </div>
      </div>

      <div class="wx-cust-product__grid">
        <button v-for="p in products" :key="p.id" @click="onPick(p)" class="wx-cust-product__card" v-patch-style="{ border: '1px solid #ececf0' }" @mouseenter="(e) => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(20,20,30,.10)'; e.currentTarget.style.borderColor = '#c7c7cd'; }" @mouseleave="(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#ececf0'; }">
          <div class="wx-cust-product__card-media">
            <img :src="p.photo" :alt="p.name" class="wx-cust-product__card-img" />
          </div>
          <div class="wx-cust-product__card-name">{{ p.name }}</div>
        </button>
      </div>
    </div>

    <div class="wx-cust-product__footer">
      <button @click="onBack" class="wx-cust-product__back"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6" /></svg>Back to Sport Picker</button>
    </div>
  </div>
</template>

<script>
import { CUST_BASKETBALL_PRODUCTS } from '../../data/products.js';

export default {
  name: 'CustProductPickerStep',
  props: {
    sport: { type: Object, default: undefined },
    onBack: { type: Function, default: undefined },
    onPick: { type: Function, default: undefined },
  },
  data() {
    return { search: "" };
  },
  computed: {
    sportLabel() { return this.sport ? this.sport.label : "Basketball"; },
    genderLabel() { return this.sport && this.sport.gender === "women" ? "Women and Girls" : "Men and Boys"; },
    products() { return CUST_BASKETBALL_PRODUCTS.filter((p) => p.name.toLowerCase().includes(this.search.toLowerCase())); },
  },
};
</script>
