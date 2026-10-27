<!-- Converted from workspace-app.jsx / workspace-app-integrated.jsx: SgCardView, SgCover and SgMediaSlot — one
     card of the Store Setup Guide: the cover (store name and status), or an eyebrow, a title, lines or copy,
     and an empty 16:9 media slot (sized so media can drop in later without moving anything). -->
<template>
  <CrFade v-if="card.kind === 'cover'" k="sg-cover" :reduce="reduce" :style="{ textAlign: 'center', maxWidth: '640px', margin: 'auto' }">
    <div class="wx-setup-guide__cover-logo"><CrLogo :store="store" :size="64" :radius="14" /></div>
    <h2 class="wx-setup-guide__cover-title">{{ store?.teamName || store?.storeTitle || "Your store" }}</h2>
    <p class="wx-setup-guide__cover-lead">Your store is created. Here's how the workspace fits together.</p>
    <div class="wx-setup-guide__chip">
      <span class="wx-setup-guide__chip-dot" :style="{ background: chip.dot }" />{{ chip.label }}</div>
    <div class="wx-setup-guide__cover-note">Nothing here is required — you can reopen this guide anytime from the workspace header.</div>
  </CrFade>
  <CrFade v-else :k="card.id" :reduce="reduce" :style="{ textAlign: 'center', maxWidth: '720px', width: '100%', margin: 'auto' }">
    <div class="wx-setup-guide__eyebrow">{{ card.eyebrow }}</div>
    <h2 class="wx-setup-guide__title">{{ card.title }}</h2>
    <div v-if="card.lines" class="wx-setup-guide__lines">
      <p v-for="l in card.lines" :key="l[0]" class="wx-setup-guide__line"><strong class="wx-setup-guide__line-term">{{ l[0] }}</strong> — {{ l[1] }}</p>
    </div>
    <p v-else class="wx-setup-guide__copy">{{ card.copy }}</p>
    <!-- SgMediaSlot -->
    <div aria-hidden="true" class="wx-setup-guide__media">
      <IconImage :size="26" />
    </div>
  </CrFade>
</template>

<script>
import { sgStatusChip } from '../../../workspace/data/setup-guide.js';
import { IconImage } from '../icons.js';
import CrFade from '../close-report/CrFade.vue';
import CrLogo from '../close-report/CrLogo.vue';

export default {
  name: 'SgCardView',
  components: { CrFade, CrLogo, IconImage },
  props: {
    card: { type: Object, default: undefined },
    store: { type: Object, default: undefined },
    reduce: { type: Boolean, default: false },
  },
  computed: {
    chip() { return sgStatusChip(this.store); },
  },
};
</script>
