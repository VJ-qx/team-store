<!-- Converted from workspace-app.jsx: BrandTile — the brand's logo on a square tile, or its initial. -->
<template>
  <span :style="{ width: px(size), height: px(size), borderRadius: px(Math.round(size * 0.21)), flexShrink: 0, overflow: 'hidden', background: dark ? '#0e0e10' : '#f1f1f3', border: `1px solid ${dark ? '#0e0e10' : '#e5e5e9'}`, color: '#0e0e10', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: px(Math.round(size * 0.35)), fontWeight: 800, fontFamily: 'Archivo, sans-serif' }"><img v-if="src" :src="src" :alt="name" :style="{ width: '100%', height: '100%', objectFit: 'contain', padding: px(id === 'prolook' ? Math.round(size * 0.18) : 0), boxSizing: 'border-box' }" /><template v-else>{{ name[0] }}</template></span>
</template>

<script>
import { CUSTOMIZER_BRANDS } from '../../data/brands.js';
import { px } from '../../lib/style.js';

export default {
  name: 'BrandTile',
  props: {
    id: { type: String, default: undefined },
    name: { type: String, default: undefined },
    size: { type: Number, default: 48 },
  },
  computed: {
    meta() {
      return CUSTOMIZER_BRANDS[this.id] || {};
    },
    src() {
      return this.meta.logo || this.meta.logoBlack;
    },
    dark() {
      return !!this.meta.logoOnDark;
    },
  },
  methods: { px },
};
</script>
