<!-- Converted from workspace-app.jsx: CustBuilderStep — Customize New Product, step 2: the builder (side rail,
     toolbar with Add to Store, the Details panel and the preview with its thumbnails). The rail's icons are
     the prototype's per-item SVGs, picked by key. -->
<template>
  <div class="wx-cust-builder">
    <div class="wx-cust-builder__rail">
      <button v-for="item in sidebarItems" :key="item.key" @click="tab = item.key" class="wx-cust-builder__rail-btn" v-patch-style="{ background: tab === item.key ? '#f1f1f3' : 'transparent', color: tab === item.key ? '#0e0e10' : '#9a9aa1' }" @mouseenter="(e) => railEnter(e, tab === item.key)" @mouseleave="(e) => railLeave(e, tab === item.key)">
        <svg v-if="item.key === 'details'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9" /><line x1="12" y1="9" x2="12" y2="13" /><circle cx="12" cy="16" r=".6" fill="currentColor" /></svg>
        <svg v-else-if="item.key === 'options'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.86H5v10h2v-5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v5h2V10h1.15a1 1 0 0 0 .99-.86l.58-3.57a2 2 0 0 0-1.34-2.23z" /></svg>
        <svg v-else-if="item.key === 'customize'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
        <svg v-else-if="item.key === 'applications'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 2 2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
        <svg v-else-if="item.key === 'summary'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><circle cx="3" cy="6" r="1" /><circle cx="3" cy="12" r="1" /><circle cx="3" cy="18" r="1" /></svg>
        <span :class="`wx-cust-builder__rail-label${tab === item.key ? ' wx-cust-builder__rail-label--active' : ''}`">{{ item.label }}</span>
      </button>
    </div>

    <div class="wx-cust-builder__main">
      <div class="wx-cust-builder__topbar">
        <button @click="onBack" class="wx-cust-builder__back"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M15 18l-6-6 6-6" /></svg>Back to {{ sportLabel }}</button>
        <div class="wx-cust-builder__tools">
          <button v-for="{ label, d } in tools" :key="label" class="wx-cust-builder__tool">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path :d="d" /></svg>
            <span class="wx-cust-builder__tool-label">{{ label }}</span>
          </button>
          <button class="wx-cust-builder__tool">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" /></svg>
            <span class="wx-cust-builder__tool-label">Help</span>
          </button>
        </div>
        <div class="wx-cust-builder__actions">
          <button @click="onAddToStore()" class="wx-cust-builder__add">Add to Store</button>
        </div>
      </div>

      <div class="wx-cust-builder__content">
        <div class="wx-cust-builder__panel">
          <div v-if="tab === 'details'">
            <div class="wx-cust-builder__panel-title">BLB, Set-In, Full Button Jersey</div>
            <div v-for="[k, v] in specs" :key="k" class="wx-cust-builder__spec">
              <span class="wx-cust-builder__spec-key">{{ k }}</span>
              <span class="wx-cust-builder__spec-value">{{ v }}</span>
            </div>
            <div class="wx-cust-builder__links">
              <span class="wx-cust-builder__link">Sizing Chart</span>
              <span class="wx-cust-builder__link">How to Measure</span>
            </div>
            <div class="wx-cust-builder__section-title">Materials</div>
            <div v-for="(f, i) in fabrics" :key="i" class="wx-cust-builder__fabric">
              <div class="wx-cust-builder__fabric-swatch" />
              <div>
                <div class="wx-cust-builder__fabric-label">{{ f.label }} <span v-if="f.extra" class="wx-cust-builder__fabric-extra">{{ f.extra }}</span></div>
                <div class="wx-cust-builder__fabric-desc">{{ f.desc }}</div>
              </div>
            </div>
          </div>
          <div v-if="tab !== 'details'" class="wx-cust-builder__empty">{{ (sidebarItems.find((s) => s.key === tab) || {}).label }} options</div>
        </div>

        <div class="wx-cust-builder__stage">
          <div class="wx-cust-builder__preview">
            <img :src="thumbs[activeThumb]" :alt="product ? product.name : 'Jersey'" class="wx-cust-builder__preview-img" />
          </div>
          <div class="wx-cust-builder__thumbs">
            <button v-for="(src, i) in thumbs" :key="i" @click="activeThumb = i" :class="`wx-cust-builder__thumb${(activeThumb === i) ? ' wx-cust-builder__thumb--active' : ''}`">
              <img :src="src" alt="" class="wx-cust-builder__thumb-img" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustBuilderStep',
  props: {
    sport: { type: Object, default: undefined },
    product: { type: Object, default: undefined },
    onBack: { type: Function, default: undefined },
    onAddToStore: { type: Function, default: undefined },
  },
  data() {
    return {
      tab: "details",
      activeThumb: 0,
      sidebarItems: [
        { key: "details", label: "Details" },
        { key: "options", label: "Options" },
        { key: "customize", label: "Customize" },
        { key: "applications", label: "Applications" },
        { key: "summary", label: "Summary" },
      ],
      tools: [{ label: "Undo", d: "M9 14 4 9l5-5M4 9h10.5a5.5 5.5 0 0 1 0 11H11" }, { label: "Redo", d: "M15 14l5-5-5-5M19 9H8.5a5.5 5.5 0 0 0 0 11H13" }],
      fabrics: [{ label: "Fabric Option 1 (Suggested)", extra: "", desc: "100% Polyester · 7.96 oz\nCircular knitted, midweight fabric with high stretch in all directions." }, { label: "Fabric Option 2", extra: "+$2.00/item", desc: "100% Polyester · 7.96 oz\nCircular knitted, midweight fabric with advanced moisture management." }],
    };
  },
  computed: {
    sportLabel() { return this.sport ? this.sport.label : "Basketball"; },
    photo() { return this.product ? this.product.photo : "assets/products/jersey-warriors.png"; },
    thumbs() { return [this.photo, this.photo, this.photo, this.photo]; },
    specs() { return [["Price Item","BSBQT2BJ"],["Product Line","Sublimated"],["Block","Set-In Full Button Jersey"],["Style","Astros"],["Gender", this.sport && this.sport.gender === "women" ? "Women/Girls" : "Men/Boys"],["Youth","$76.67"],["XS","$76.67"],["S – 3XL","$79.00"],["4XL – 5XL","$80.34"]]; },
  },
  methods: {
    railEnter(e, active) { e.currentTarget.style.background = active ? "#f1f1f3" : "#fafafa"; e.currentTarget.style.color = "#0e0e10"; },
    railLeave(e, active) { e.currentTarget.style.background = active ? "#f1f1f3" : "transparent"; e.currentTarget.style.color = active ? "#0e0e10" : "#9a9aa1"; },
  },
};
</script>
