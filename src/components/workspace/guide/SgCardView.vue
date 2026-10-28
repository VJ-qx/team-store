<!-- Converted from workspace-app.jsx / workspace-app-integrated.jsx: SgCardView — one card of the Store Setup
     Guide: the cover (SgCover), or an eyebrow, a title, lines or copy, and the media slot. -->
<template>
  <SgCover v-if="card.kind === 'cover'" :store="store" :reduce="reduce" />
  <CrFade v-else :k="card.id" :reduce="reduce" :style="{ textAlign: 'center', maxWidth: '720px', width: '100%', margin: 'auto' }">
    <div class="wx-setup-guide__eyebrow">{{ card.eyebrow }}</div>
    <h2 class="wx-setup-guide__title">{{ card.title }}</h2>
    <div v-if="card.lines" class="wx-setup-guide__lines">
      <p v-for="l in card.lines" :key="l[0]" class="wx-setup-guide__line"><strong class="wx-setup-guide__line-term">{{ l[0] }}</strong> — {{ l[1] }}</p>
    </div>
    <p v-else class="wx-setup-guide__copy">{{ card.copy }}</p>
    <SgMediaSlot />
  </CrFade>
</template>

<script>
import CrFade from '../close-report/CrFade.vue';
import SgCover from './SgCover.vue';
import SgMediaSlot from './SgMediaSlot.vue';

export default {
  name: 'SgCardView',
  components: { CrFade, SgCover, SgMediaSlot },
  props: {
    card: { type: Object, default: undefined },
    store: { type: Object, default: undefined },
    reduce: { type: Boolean, default: false },
  },
};
</script>
