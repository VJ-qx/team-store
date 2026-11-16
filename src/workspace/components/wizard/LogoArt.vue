<!-- Converted from workspace-app.jsx: LogoArt — a saved logo: the uploaded image, or a colored monogram
     disc sized by the caller. -->
<template>
  <img v-if="logo.url" :src="logo.url" alt="" class="wx-logo-art__img" />
  <div v-else class="wx-logo-art__mono" :style="{ width: px(size), height: px(size), background: logo.color, fontSize: px(size * 0.36) }">{{ logo.mono }}</div>
</template>

<script>
import { px } from '../../lib/style.js';

export default {
  name: 'LogoArt',
  props: {
    logo: { type: Object, required: true },
    size: { type: Number, default: 92 },
  },
  methods: { px },
};
</script>
