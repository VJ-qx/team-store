<!-- Converted from workspace-app.jsx: StackedThumbs — overlapping thumbnail stack for a Saved Cart card
     (multiple products inside). -->
<template>
  <div class="wx-stacked-thumbs">
    <div v-for="(it, i) in shown" :key="it.id" class="wx-stacked-thumbs__item" :style="{ left: `calc(50% - 48px + ${(i - (shown.length - 1) / 2) * 42}px)`, transform: `translateY(-50%) rotate(${(i - (shown.length - 1) / 2) * 5}deg)`, zIndex: i }">
      <CatalogPhoto :photo="it.photo" :alt="it.title" />
    </div>
    <span v-if="extra > 0" class="wx-stacked-thumbs__more">+{{ extra }}</span>
  </div>
</template>

<script>
import CatalogPhoto from './CatalogPhoto.vue';

export default {
  name: 'StackedThumbs',
  components: { CatalogPhoto },
  props: {
    items: { type: Array, default: undefined },
  },
  computed: {
    shown() { return this.items.slice(0, 3); },
    extra() { return this.items.length - this.shown.length; },
  },
};
</script>
