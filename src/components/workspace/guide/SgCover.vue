<!-- Converted from workspace-app.jsx / workspace-app-integrated.jsx: SgCover — the Store Setup Guide's first card:
     the store's logo and name, and its status (Open, or Draft · Not live yet). -->
<template>
  <CrFade k="sg-cover" :reduce="reduce" :style="{ textAlign: 'center', maxWidth: '640px', margin: 'auto' }">
    <div class="wx-setup-guide__cover-logo"><CrLogo :store="store" :size="64" :radius="14" /></div>
    <h2 class="wx-setup-guide__cover-title">{{ store?.teamName || store?.storeTitle || "Your store" }}</h2>
    <p class="wx-setup-guide__cover-lead">Your store is created. Here's how the workspace fits together.</p>
    <div class="wx-setup-guide__chip">
      <span class="wx-setup-guide__chip-dot" :style="{ background: chip.dot }" />{{ chip.label }}</div>
    <div class="wx-setup-guide__cover-note">Nothing here is required — you can reopen this guide anytime from the workspace header.</div>
  </CrFade>
</template>

<script>
import { sgStatusChip } from '../../../workspace/data/setup-guide.js';
import CrFade from '../close-report/CrFade.vue';
import CrLogo from '../close-report/CrLogo.vue';

export default {
  name: 'SgCover',
  components: { CrFade, CrLogo },
  props: {
    store: { type: Object, default: undefined },
    reduce: { type: Boolean, default: false },
  },
  computed: {
    chip() { return sgStatusChip(this.store); },
  },
};
</script>
