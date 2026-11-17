<!-- Converted from workspace-app.jsx: VaultOfferModal — interstitial when adding a Pro Stock / Sideline item
     to a store: pick the sizes and color ways the store will offer (multi-select each). -->
<template>
  <div @click="onClose" class="wx-vault-offer">
    <div @click="(e) => e.stopPropagation()" class="wx-vault-offer__dialog">
      <div class="wx-vault-offer__header">
        <span class="wx-vault-offer__title">{{ item.title }} — sizes &amp; color ways</span>
        <button type="button" @click="onClose" aria-label="Close" class="wx-vault-offer__close">✕</button>
      </div>
      <div class="wx-vault-offer__body">
        <div class="wx-vault-offer__section-head">
          <span class="wx-vault-offer__section-label">SIZES OFFERED</span>
          <span class="wx-vault-offer__section-count">{{ sizeList.length }} of {{ sizes.length }} sizes<button type="button" @click="toggleAllSizes" class="wx-vault-offer__toggle-all">{{ allSizes ? "Deselect all" : "Select all" }}</button></span>
        </div>
        <div class="wx-vault-offer__sizes">
          <button v-for="s in sizes" :key="s" type="button" :aria-pressed="!!selSizes[s]" @click="selSizes = { ...selSizes, [s]: !selSizes[s] }" :class="`wx-vault-offer__size${selSizes[s] ? ' wx-vault-offer__size--on' : ''}`"><span v-if="selSizes[s]" aria-hidden="true" class="wx-vault-offer__size-check">✓</span>{{ s }}</button>
        </div>
        <div class="wx-vault-offer__section-head">
          <span class="wx-vault-offer__section-label">COLOR WAYS OFFERED</span>
          <span class="wx-vault-offer__section-count">{{ cwListSel.length }} of {{ item.colorways.length }} selected<button type="button" @click="toggleAllCws" class="wx-vault-offer__toggle-all">{{ allCw ? "Deselect all" : "Select all" }}</button></span>
        </div>
        <div class="wx-vault-offer__colorways">
          <button v-for="c in item.colorways" :key="c.slug" type="button" :title="c.name" @click="selCws = { ...selCws, [c.slug]: !selCws[c.slug] }" :class="`wx-vault-offer__colorway${selCws[c.slug] ? ' wx-vault-offer__colorway--on' : ''}`">
            <span aria-hidden="true" :class="`wx-vault-offer__colorway-check${selCws[c.slug] ? ' wx-vault-offer__colorway-check--on' : ''}`">✓</span>
            <span class="wx-vault-offer__colorway-photo"><CatalogPhoto :photo="c.front" :alt="c.name" /></span>
            <span class="wx-vault-offer__colorway-label">
              <span :class="`wx-vault-offer__colorway-dot${(c.slug === 'white') ? ' wx-vault-offer__colorway-dot--white' : ''}`" :style="{ background: c.hex }" />
              <span class="wx-vault-offer__colorway-name">{{ c.name }}</span>
            </span>
          </button>
        </div>
      </div>
      <div class="wx-vault-offer__footer">
        <button type="button" @click="onClose" class="wx-vault-offer__cancel">Cancel</button>
        <button type="button" :disabled="!ready" @click="() => { if (ready) onConfirm(sizeList, cwListSel); }" :class="`wx-vault-offer__continue${ready ? ' wx-vault-offer__continue--ready' : ''}`">Continue</button>
      </div>
    </div>
  </div>
</template>

<script>
import { VAULT_OFFER_ADULT, VAULT_OFFER_YOUTH } from '../../data/products.js';
import CatalogPhoto from './CatalogPhoto.vue';

export default {
  name: 'VaultOfferModal',
  components: { CatalogPhoto },
  props: {
    item: { type: Object, default: undefined },
    onClose: { type: Function, default: undefined },
    onConfirm: { type: Function, default: undefined },
  },
  data() {
    const sizes = (this.item.youth ? VAULT_OFFER_YOUTH : []).concat(VAULT_OFFER_ADULT);
    const selSizes = {}; sizes.forEach((s) => { selSizes[s] = true; });
    const selCws = {}; this.item.colorways.forEach((c) => { selCws[c.slug] = true; });
    return { selSizes, selCws };
  },
  computed: {
    sizes() { return (this.item.youth ? VAULT_OFFER_YOUTH : []).concat(VAULT_OFFER_ADULT); },
    sizeList() { return this.sizes.filter((s) => this.selSizes[s]); },
    cwListSel() { return this.item.colorways.filter((c) => this.selCws[c.slug]); },
    allCw() { return this.cwListSel.length === this.item.colorways.length; },
    allSizes() { return this.sizeList.length === this.sizes.length; },
    ready() { return this.sizeList.length > 0 && this.cwListSel.length > 0; },
  },
  methods: {
    toggleAllSizes() { const o = {}; if (!this.allSizes) this.sizes.forEach((s) => { o[s] = true; }); this.selSizes = o; },
    toggleAllCws() { const o = {}; if (!this.allCw) this.item.colorways.forEach((c) => { o[c.slug] = true; }); this.selCws = o; },
  },
};
</script>
