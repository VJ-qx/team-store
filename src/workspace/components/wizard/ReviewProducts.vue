<!-- Converted from workspace-app.jsx: ReviewProducts — the products the manager curated in Add Products,
     shown on Review & Deploy, with "Edit products" back to that step. For a store started from another store
     (source), the panel names it, explains what came across, and each product can be removed; the wizard
     drops that source (a prototype bug kept in part 2a), so those parts can't be reached. -->
<template>
  <WizardPanel v-if="!products || products.length === 0" :label="label" :style="{ marginTop: '16px', marginBottom: '0' }">
    <div class="wx-review-products__empty">No products were added to this store.</div>
  </WizardPanel>
  <WizardPanel v-else :label="label" :style="{ marginTop: '16px', marginBottom: '0' }">
    <template #hint><span class="wx-review-products__hint">{{ `${products.length} product${products.length === 1 ? "" : "s"}` }}<button v-if="onEdit" type="button" @click="onEdit" class="wx-review-products__edit">Edit products</button></span></template>
    <div v-if="source && !onEdit" class="wx-review-products__source-note">You didn’t go through an Add Products step — this is the place to check what came across. Remove anything this store shouldn’t sell; you can add more from the Products tab after it’s created.</div>
    <div class="wx-review-products__grid">
      <div v-for="(p, i) in products" :key="p.id || i" class="wx-review-products__card">
        <button v-if="onRemove" type="button" @click="onRemove(i)" title="Remove from this store" aria-label="Remove product" class="wx-review-products__remove">✕</button>
        <div class="wx-review-products__media">
          <div v-if="p.photo" class="wx-review-products__photo"><CatalogPhoto :photo="p.photo" :alt="p.title || 'Product'" /></div>
          <IconShirt v-else :size="34" :style="{ color: '#c7c7cd' }" />
        </div>
        <div class="wx-review-products__info">
          <div class="wx-review-products__title">{{ p.title || "Untitled product" }}</div>
          <div class="wx-review-products__meta">
            <span class="wx-review-products__category">{{ [p.sport, p.category || p.style].filter(Boolean).join(" · ") || "Product" }}</span>
            <span v-if="priceOf(p) != null" class="wx-review-products__price" :style="{ color: accent }">${{ Number(priceOf(p)).toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </div>
  </WizardPanel>
</template>

<script>
import { IconShirt } from '../icons.js';
import CatalogPhoto from '../products/CatalogPhoto.vue';
import WizardPanel from './WizardPanel.vue';

export default {
  name: 'ReviewProducts',
  components: { CatalogPhoto, IconShirt, WizardPanel },
  props: {
    products: { type: Array, default: undefined },
    accent: { type: String, default: undefined },
    source: { type: Object, default: undefined },
    onEdit: { type: Function, default: undefined },
    onRemove: { type: Function, default: undefined },
  },
  computed: {
    label() { return this.source ? "Products from " + this.source.sourceName : "Products Added"; },
  },
  methods: {
    priceOf(p) { return p.adult != null ? p.adult : (p.retail != null ? p.retail : null); },
  },
};
</script>
