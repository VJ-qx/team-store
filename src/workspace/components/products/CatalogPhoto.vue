<!-- Converted from workspace-app.jsx: CatalogPhoto — a product photo from assets/products/. -->
<template>
  <img :src="`assets/products/${photo}.png`" :alt="alt" class="wx-catalog-photo" />
</template>

<script>
export default {
  name: 'CatalogPhoto',
  props: {
    photo: { type: String, default: undefined },
    alt: { type: String, default: undefined },
  },
};
</script>
