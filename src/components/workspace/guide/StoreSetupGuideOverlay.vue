<!-- Converted from workspace-app.jsx / workspace-app-integrated.jsx: StoreSetupGuideOverlay — the Store Setup
     Guide: 7 cards for a league store, 6 for an individual store (storeType overrides the store's own type).
     Next, a click on the card, →, Enter or Space move forward; Back and ← move back; Escape, Done, Skip to
     workspace, × and a click on the backdrop close it. -->
<template>
  <div @mousedown="(e) => { if (e.target === e.currentTarget) onClose(); }" class="wx-setup-guide">
    <div role="dialog" aria-modal="true" aria-label="Store Setup Guide" class="wx-setup-guide__dialog">
      <!-- Top bar -->
      <div class="wx-setup-guide__top">
        <div class="wx-setup-guide__store">
          <CrLogo :store="store" :size="30" :radius="7" />
          <div class="wx-setup-guide__store-text">
            <div class="wx-setup-guide__store-name">{{ store?.teamName || store?.storeTitle || "Your store" }}</div>
            <div class="wx-setup-guide__store-sub">Store Setup Guide</div>
          </div>
        </div>
        <div class="wx-setup-guide__top-actions">
          <button @click="onClose" class="wx-setup-guide__skip">Skip to workspace</button>
          <button @click="onClose" aria-label="Close guide" class="wx-setup-guide__close"><IconX :size="20" /></button>
        </div>
      </div>
      <!-- Segmented progress — position in the sequence, never completion -->
      <div class="wx-setup-guide__progress">
        <button v-for="(c, i) in cards" :key="c.id" @click="() => setStep(i)" :aria-label="'Card ' + (i + 1)" class="wx-setup-guide__segment" :style="{ background: i <= step ? accent : '#ececf0' }" />
      </div>
      <!-- Stage -->
      <div @click="onStageClick" :class="`wx-setup-guide__stage${last ? ' wx-setup-guide__stage--last' : ''}`">
        <SgCardView :card="cards[step] || cards[0]" :store="store" :reduce="reduce" />
      </div>
      <!-- Footer controls -->
      <div class="wx-setup-guide__footer">
        <button @click="prev" :disabled="step === 0" :class="`wx-setup-guide__back${step === 0 ? ' wx-setup-guide__back--disabled' : ''}`"><IconChevronLeft :size="15" /> Back</button>
        <span class="wx-setup-guide__count">{{ step + 1 }} / {{ cards.length }}</span>
        <button @click="() => setStep(cards.length - 1)" :disabled="last" :class="`wx-setup-guide__jump${last ? ' wx-setup-guide__jump--disabled' : ''}`">Jump to end</button>
        <div class="wx-setup-guide__footer-end">
          <button @click="onClose" class="wx-setup-guide__done">Done</button>
          <button v-if="last" @click="onClose" class="wx-setup-guide__primary">Done</button>
          <button v-else @click="next" class="wx-setup-guide__primary">Next <IconChevronRight :size="15" /></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { crAccent, crPrefersReduced } from '../../../workspace/data/close-report.js';
import { sgCards } from '../../../workspace/data/setup-guide.js';
import { IconChevronLeft, IconChevronRight, IconX } from '../icons.js';
import CrLogo from '../close-report/CrLogo.vue';
import SgCardView from './SgCardView.vue';

export default {
  name: 'StoreSetupGuideOverlay',
  components: { CrLogo, IconChevronLeft, IconChevronRight, IconX, SgCardView },
  props: {
    store: { type: Object, default: undefined },
    storeType: { type: String, default: undefined },
    onClose: { type: Function, default: undefined },
  },
  data() {
    return { step: 0 };
  },
  computed: {
    type() { return this.storeType || this.store?.storeType || "single"; },
    cards() { return sgCards(this.type); },
    accent() { return crAccent(this.store); },
    reduce() { return crPrefersReduced(); },
    last() { return this.step >= this.cards.length - 1; },
  },
  mounted() {
    // React: useEffect on [cards.length, onClose] — the keyboard controls.
    this.onKey = (e) => {
      if (e.key === "Escape") { this.onClose(); return; }
      if (e.key === "ArrowRight" || e.key === " " || e.key === "Enter") { e.preventDefault(); this.next(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); this.prev(); }
    };
    window.addEventListener("keydown", this.onKey);
  },
  beforeUnmount() {
    window.removeEventListener("keydown", this.onKey);
  },
  methods: {
    setStep(v) { this.step = v; },
    next() { this.step = Math.min(this.step + 1, this.cards.length - 1); },
    prev() { this.step = Math.max(this.step - 1, 0); },
    onStageClick(e) { if (e.target === e.currentTarget || e.currentTarget.contains(e.target)) { if (!this.last) this.next(); } },
  },
};
</script>
