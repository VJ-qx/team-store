<!-- Converted from workspace-app.jsx: CustReviewStep — Customize New Product, step 3: review & finalize
     (product settings, price settings, application sizes), then Add to Store.
     The prototype's middle-dot escape in the product's sport line is JSX text, so the page shows the escape
     itself (\u00b7); it is carried over verbatim. -->
<template>
  <div class="wx-cust-review">
    <div class="wx-cust-review__body">
      <div class="wx-cust-review__side">
        <div class="wx-cust-review__product">
          <div class="wx-cust-review__product-media">
            <img :src="photo" :alt="product ? product.name : 'Product'" class="wx-cust-review__product-img" />
          </div>
          <div class="wx-cust-review__product-text">
            <div class="wx-cust-review__product-name">{{ product ? product.name.toUpperCase() : "CUSTOM" }}</div>
            <div class="wx-cust-review__product-sport">{{ sport ? sport.label : "Sport" }} \u00b7 Uniform Jersey</div>
            <button @click="onBack" class="wx-cust-review__back"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>Customize</button>
          </div>
        </div>
      </div>

      <div class="wx-cust-review__main">
        <div class="wx-cust-review__card">
          <div class="wx-cust-review__card-title">Product Settings</div>
          <div v-for="opt in settingOptions" :key="opt.key" class="wx-cust-review__option">
            <BundleToggle :on="teamSetting === opt.key" :onChange="(v) => teamSetting = v ? opt.key : 'fan-gear'" />
            <span class="wx-cust-review__option-label">{{ opt.label }}</span>
            <InfoTooltip :title="opt.label" :body="opt.tip" />
          </div>
        </div>

        <PriceSettingsCard :pricing="pricing" :onChange="setPricing" :fundOn="false" :covered="teamSetting === 'team-supplied'" />

        <div class="wx-cust-review__sizes">
          <div class="wx-cust-review__card-title">Confirm Application Sizes</div>
          <div class="wx-cust-review__sizes-head">
            <div>TYPE</div><div>DETAILS</div><div>COLORS</div><div>SELECT SIZES</div><div>NOTES</div>
          </div>
          <div v-for="row in sizes" :key="row.id" class="wx-cust-review__sizes-row">
            <div>
              <div class="wx-cust-review__type">{{ row.type }}</div>
              <div class="wx-cust-review__placement">( {{ row.placement }} )</div>
            </div>
            <div class="wx-cust-review__details">
              <div class="wx-cust-review__details-icon">{{ row.iconKind === "hash" ? "#" : "T" }}</div>
              <div class="wx-cust-review__details-list">
                <div v-for="[k, v] in Object.entries(row.details)" :key="k"><span class="wx-cust-review__details-key">{{ k }}</span><span class="wx-cust-review__details-sep"> : </span><span>{{ v }}</span></div>
              </div>
            </div>
            <div class="wx-cust-review__colors">
              <div v-for="(c, i) in row.colors" :key="i" :class="`wx-cust-review__color${(c && c.toLowerCase() === '#ffffff') ? ' wx-cust-review__color--white' : ''}`" :style="{ background: c }" />
            </div>
            <div class="wx-cust-review__size-rows">
              <SizeRow label="ADULT" :value="row.adultSize" :options="sizeOptions" :onChange="(v) => updateRow(row.id, { adultSize: v })" />
              <SizeRow label="YOUTH" :value="row.youthSize" :options="sizeOptions" :onChange="(v) => updateRow(row.id, { youthSize: v })" />
            </div>
            <div>
              <textarea placeholder="Notes Here" :value="row.notes" v-controlled="row.notes" @input="(e) => updateRow(row.id, { notes: e.target.value })" class="wx-cust-review__notes" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="wx-cust-review__footer">
      <button @click="onCancel" class="wx-cust-review__cancel">Cancel</button>
      <button @click="handleAddToStore" class="wx-cust-review__add">Add to Store</button>
    </div>
  </div>
</template>

<script>
import { defaultApplicationSizes, defaultPricing } from '../../lib/products.js';
import BundleToggle from './BundleToggle.vue';
import InfoTooltip from './InfoTooltip.vue';
import PriceSettingsCard from './PriceSettingsCard.vue';
import SizeRow from './SizeRow.vue';

export default {
  name: 'CustReviewStep',
  components: { BundleToggle, InfoTooltip, PriceSettingsCard, SizeRow },
  props: {
    sport: { type: Object, default: undefined },
    product: { type: Object, default: undefined },
    onBack: { type: Function, default: undefined },
    onCancel: { type: Function, default: undefined },
    onAddToStore: { type: Function, default: undefined },
  },
  data() {
    return {
      teamSetting: "fan-gear",
      pricing: defaultPricing(),
      sizes: defaultApplicationSizes(),
      sizeOptions: ["AS SHOWN", "XS", "S", "M", "L", "XL", "XXL"],
      settingOptions: [{ key: "team-required", label: "Team Required", tip: "Mandatory gear rostered players must purchase to participate." }, { key: "team-supplied", label: "Team Supplied", tip: "Mandatory gear already paid for collectively — players pick sizes but pay $0." }],
    };
  },
  computed: {
    photo() { return this.product ? this.product.photo : "assets/products/jersey-warriors.png"; },
  },
  methods: {
    setPricing(v) { this.pricing = typeof v === "function" ? v(this.pricing) : v; },
    updatePricing(size, field, value) {
      this.setPricing((prev) => {
        const next = { ...prev, [size]: { ...prev[size], [field]: value } };
        const baseNum = parseFloat(next[size].base) || 0;
        const dealerNum = parseFloat(next[size].dealer) || 0;
        const dealerAmt = next[size].dealerUnit === "$" ? dealerNum : baseNum * dealerNum / 100;
        next[size].retail = (baseNum + dealerAmt).toFixed(2);
        return next;
      });
    },
    updateRow(id, patch) { this.sizes = this.sizes.map((r) => r.id === id ? { ...r, ...patch } : r); },
    handleAddToStore() {
      const { product, sport, pricing, photo } = this;
      const ts = Date.now();
      const photoKey = photo.replace("assets/products/", "").replace(".png", "");
      this.onAddToStore({
        id: `wx-${product ? product.id : "custom"}-${ts}`,
        title: ((product ? product.name : "Custom")) + " — Custom",
        style: (sport ? sport.label : "Sport") + " · Uniform Jersey",
        photo: photoKey,
        adult: pricing.adult.retail,
        youth: pricing.youth.retail,
        teamProfit: parseFloat(pricing.adult.team) || 15,
        teamSetting: this.teamSetting,
        applicationSizes: this.sizes,
        pricing,
        sizesConfirmed: true,
      });
    },
  },
};
</script>
