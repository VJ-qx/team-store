<!-- Converted from workspace-app.jsx: ConfirmSizesModal — "Configure & Add to Store": the product, its
     settings and pricing (ModalConfigSections, when a productConfig is given), and its application sizes;
     several items step through ITEM N OF M. Stock items (Pro Stock / Sideline Stock) have no decoration
     applications, so they skip sizing. A category (and, on League stores, a team for Team Required / Team
     Supplied items) is required before the item commits. -->
<template>
  <Modal :open="open" :onClose="onClose" :width="1080">
    <div class="wx-configure">
      <div class="wx-configure__header">
        <div class="wx-configure__product">
          <div class="wx-configure__thumb">
            <CatalogPhoto v-if="product.photo" :photo="product.photo" :alt="product.title" />
            <div v-else class="wx-configure__thumb-default"><DefaultProductThumb :store="store" :product="product" /></div>
          </div>
          <div class="wx-configure__product-name">{{ product.title || "[Product name]" }}</div>
        </div>
        <button @click="onClose" class="wx-configure__close">
          <IconX :size="20" />
        </button>
      </div>

      <h3 class="wx-configure__title">Configure &amp; Add to Store</h3>

      <div v-if="multi" class="wx-configure__items">
        <div class="wx-configure__items-current">
          <span class="wx-configure__items-label">ITEM {{ activeIndex + 1 }} OF {{ items.length }}</span>
          <span class="wx-configure__items-title">{{ items[activeIndex]?.title }}</span>
        </div>
        <div class="wx-configure__items-nav">
          <button @click="onActiveIndexChange(Math.max(0, activeIndex - 1))" :disabled="activeIndex === 0" :class="`wx-configure__nav-btn${(activeIndex === 0) ? ' wx-configure__nav-btn--disabled' : ''}`"><IconChevronLeft :size="16" /></button>
          <button @click="onActiveIndexChange(Math.min(items.length - 1, activeIndex + 1))" :disabled="activeIndex === items.length - 1" :class="`wx-configure__nav-btn${(activeIndex === items.length - 1) ? ' wx-configure__nav-btn--disabled' : ''}`"><IconChevronRight :size="16" /></button>
        </div>
      </div>

      <div :class="`wx-configure__scroll${rich ? ' wx-configure__scroll--rich' : ''}`">
        <ModalConfigSections v-if="rich" :config="productConfig" :onChange="onConfigChange" :store="store" :allowRosterAssign="allowRosterAssign" :product="product" />
        <div v-if="showSizes" :class="`wx-configure__sizes${rich ? ' wx-configure__sizes--rich' : ''}`">
          <div class="wx-configure__sizes-title">Confirm Application Sizes</div>
          <div class="wx-configure__sizes-head">
            <div>TYPE</div>
            <div>DETAILS</div>
            <div>COLORS</div>
            <div>SELECT SIZES</div>
            <div>NOTES</div>
          </div>
          <div :class="`wx-configure__sizes-rows${rich ? ' wx-configure__sizes-rows--rich' : ''}`">
            <div v-for="row in rows" :key="row.id" class="wx-configure__sizes-row">
              <div>
                <div class="wx-configure__type">{{ row.type }}</div>
                <div class="wx-configure__placement">( {{ row.placement }} )</div>
              </div>
              <div class="wx-configure__details">
                <div class="wx-configure__details-icon">{{ row.iconKind === "hash" ? "#" : "T" }}</div>
                <div class="wx-configure__details-list">
                  <div v-for="[k, v] in Object.entries(row.details)" :key="k">
                    <span class="wx-configure__details-key">{{ k }}</span>
                    <span class="wx-configure__details-sep"> : </span>
                    <span>{{ v }}</span>
                  </div>
                </div>
              </div>
              <div class="wx-configure__colors">
                <div v-for="(c, i) in row.colors" :key="i" :class="`wx-configure__color${(c?.toLowerCase() === '#ffffff') ? ' wx-configure__color--white' : ''}`" :style="{ background: c }">B</div>
              </div>
              <div class="wx-configure__size-rows">
                <SizeRow label="ADULT" :value="row.adultSize" :options="sizeOptions" :onChange="(v) => updateRow(row.id, { adultSize: v })" />
                <SizeRow label="YOUTH" :value="row.youthSize" :options="sizeOptions" :onChange="(v) => updateRow(row.id, { youthSize: v })" />
              </div>
              <div>
                <textarea placeholder="Notes Here" :value="row.notes" v-controlled="row.notes" @input="(e) => updateRow(row.id, { notes: e.target.value })" class="wx-configure__notes" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div :class="`wx-configure__footer${multi ? ' wx-configure__footer--multi' : ''}`">
        <span v-if="multi" class="wx-configure__footer-count">Product {{ activeIndex + 1 }} of {{ items.length }}</span>
        <div class="wx-configure__actions">
          <button v-if="multi && activeIndex > 0" @click="onActiveIndexChange(activeIndex - 1)" class="wx-configure__secondary">Back</button>
          <button @click="onClose" class="wx-configure__secondary">Cancel</button>
          <button v-if="multi && activeIndex < items.length - 1" @click="onActiveIndexChange(activeIndex + 1)" class="wx-configure__next">Confirm &amp; Next Product <IconChevronRight :size="16" /></button>
          <button v-else data-tour="sizes-modal-confirm" @click="confirm" class="wx-configure__confirm">{{ confirmLabel || "Confirm" }}</button>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script>
import { pteRestricted } from '../../lib/products.js';
import Modal from '../common/Modal.vue';
import { IconChevronLeft, IconChevronRight, IconX } from '../icons.js';
import CatalogPhoto from './CatalogPhoto.vue';
import DefaultProductThumb from './DefaultProductThumb.vue';
import ModalConfigSections from './ModalConfigSections.vue';
import SizeRow from './SizeRow.vue';

export default {
  name: 'ConfirmSizesModal',
  components: { CatalogPhoto, DefaultProductThumb, IconChevronLeft, IconChevronRight, IconX, Modal, ModalConfigSections, SizeRow },
  props: {
    open: { type: Boolean, default: undefined },
    product: { type: Object, default: undefined },
    store: { type: Object, default: undefined },
    rows: { type: Array, default: undefined },
    onChange: { type: Function, default: undefined },
    onClose: { type: Function, default: undefined },
    onConfirm: { type: Function, default: undefined },
    productConfig: { type: Object, default: undefined },
    onConfigChange: { type: Function, default: undefined },
    items: { type: Array, default: undefined },
    activeIndex: { type: Number, default: undefined },
    onActiveIndexChange: { type: Function, default: undefined },
    confirmLabel: { type: String, default: undefined },
    allowRosterAssign: { type: Boolean, default: undefined },
  },
  data() {
    return { sizeOptions: ["AS SHOWN", "XS", "S", "M", "L", "XL", "XXL"] };
  },
  computed: {
    multi() { return this.items && this.items.length > 1; },
    rich() { return !!this.productConfig; },
    // Stock items (Pro Stock / Sideline Stock) have no decoration applications — skip sizing.
    showSizes() { return !this.product || pteRestricted(this.product); },
  },
  methods: {
    updateRow(id, patch) { this.onChange(this.rows.map((r) => r.id === id ? { ...r, ...patch } : r)); },
    confirm() {
      const { rich, productConfig, onConfigChange, allowRosterAssign, store } = this;
      // 2.4 / 3.1 — category (or TR/TS) required before the item commits.
      if (rich && productConfig) {
        const tOn2 = !!(productConfig.optRequired || productConfig.optSupplied);
        if (!productConfig.storeCategory) { onConfigChange && onConfigChange({ ...productConfig, catError: true }); return; }
        // League stores: TR/TS items must be assigned to ≥1 team or division.
        if (tOn2 && allowRosterAssign && store?.storeType === "league" && !(productConfig.rosters || []).length) { onConfigChange && onConfigChange({ ...productConfig, teamError: true }); return; }
      }
      this.onConfirm();
    },
  },
};
</script>
