<!-- Converted from workspace-app.jsx / workspace-app-integrated.jsx: CrLogo — the team logo, or a rounded
     square in the store's accent color with its first letter. Shared with the Store Close Report, so it
     keeps its inline styles. -->
<template>
  <img v-if="store?.teamLogo?.url" :src="store.teamLogo.url" alt="" :style="{ width: px(size), height: px(size), borderRadius: px(radius), objectFit: 'cover', flexShrink: 0 }" />
  <span v-else :style="{ width: px(size), height: px(size), borderRadius: px(radius), background: bg, color: '#fff', flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: px(size * 0.42), letterSpacing: '.02em' }">{{ mono }}</span>
</template>

<script>
import { crAccent } from './close-report.js';
import { px } from '../../../utils/style.js';

export default {
  name: 'CrLogo',
  props: {
    store: { type: Object, default: undefined },
    size: { type: Number, default: 34 },
    radius: { type: Number, default: 8 },
  },
  computed: {
    bg() { return this.store?.teamLogo?.color || crAccent(this.store); },
    mono() { return this.store?.teamLogo?.mono || (this.store?.teamName || "T")[0].toUpperCase(); },
  },
  methods: { px },
};
</script>
