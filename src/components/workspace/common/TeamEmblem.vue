<!-- Converted from workspace-app.jsx / workspace-app-integrated.jsx: TeamEmblem — the team's logo, or a circle
     in the team color with its initials. Shared with screens outside the store page, so it keeps its
     inline styles (not extracted to SCSS yet). -->
<template>
  <img v-if="store?.teamLogo?.url" :src="store.teamLogo.url" alt="" :style="{ width: px(size), height: px(size), borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }" />
  <span v-else :style="{ width: px(size), height: px(size), borderRadius: '50%', background: bg, flexShrink: 0, color: (bg || '').toLowerCase() === '#ffffff' ? '#0e0e10' : '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: px(size * 0.36), border: (bg || '').toLowerCase() === '#ffffff' ? '1px solid #d4d4d8' : 'none' }">{{ mono }}</span>
</template>

<script>
import { px } from '../../../utils/style.js';

export default {
  name: 'TeamEmblem',
  props: {
    store: { type: Object, default: undefined },
    size: { type: Number, default: 30 },
  },
  computed: {
    bg() { const { store } = this; return store?.teamLogo?.color || store?.teamColors?.[0] || "#1d3a8a"; },
    mono() { const { store } = this; return store?.teamLogo?.mono || (store?.teamName || store?.storeTitle || "T").slice(0, 2).toUpperCase(); },
  },
  methods: { px },
};
</script>
