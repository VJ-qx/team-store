<!-- Converted from workspace-app.jsx / workspace-app-integrated.jsx: CustomizerBrandGlyph. Falls back to
     a "C" tile if the logo doesn't load. -->
<template>
  <span :style="{ width: '19px', height: '19px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }">
    <span v-if="failed" :style="{ width: '19px', height: '19px', borderRadius: '4px', background: '#3f3f46', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '10.5px', fontWeight: 800 }">C</span>
    <img v-else :src="src" alt="" @error="() => setFailed(true)" :style="{ maxWidth: '19px', maxHeight: '17px', objectFit: 'contain', display: 'block' }" />
  </span>
</template>

<script>
export default {
  name: 'CustomizerBrandGlyph',
  props: {
    src: { type: String, default: 'assets/prolook-mark-ink.png' },
  },
  data() {
    return { failed: false };
  },
  methods: {
    setFailed(v) {
      this.failed = v;
    },
  },
};
</script>
