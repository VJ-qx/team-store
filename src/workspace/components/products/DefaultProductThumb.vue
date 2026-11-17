<!-- Converted from workspace-app.jsx: DefaultProductThumb — a product without a photo of its own shows one
     of the stock product photos, always the same one for the same product. -->
<template>
  <img :src="photoForKey(key_)" :alt="product?.title || 'Product'" class="wx-default-thumb" />
</template>

<script>
import { photoForKey } from '../../lib/products.js';

export default {
  name: 'DefaultProductThumb',
  props: {
    store: { type: Object, default: undefined },
    product: { type: Object, default: undefined },
  },
  computed: {
    key_() {
      const { store, product } = this;
      return product?.id || product?.__pendingId || product?.title || store?.id || store?.teamName || "team";
    },
  },
  methods: { photoForKey },
};
</script>
