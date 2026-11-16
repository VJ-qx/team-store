<!-- Converted from workspace-app.jsx: SelectTeamColorModal — the Prolook color grid behind Team Colors' +:
     tick colors on and off, then Save Colors. While open, Escape closes it and the page behind doesn't
     scroll. -->
<template>
  <div v-if="open" @click="onClose" class="wx-team-color">
    <div @click="(e) => e.stopPropagation()" class="wx-team-color__dialog">
      <div class="wx-team-color__header">
        <div class="wx-team-color__title-row">
          <h2 class="wx-team-color__title">SELECT TEAM COLOR</h2>
          <button @click="onClose" title="Close" class="wx-team-color__close" @mouseenter="(e) => { e.currentTarget.style.background = '#f1f1f3'; }" @mouseleave="(e) => { e.currentTarget.style.background = 'transparent'; }">
            <IconX :size="22" />
          </button>
        </div>
        <div class="wx-team-color__rule" />
        <p class="wx-team-color__note">*If a color isn't available, black or white will be used instead.</p>
      </div>
      <div class="wx-team-color__grid-wrap">
        <div class="wx-team-color__grid">
          <button v-for="c in PROLOOK_COLORS" :key="c.code" @click="() => toggle(c.hex)" :title="c.name" :class="`wx-team-color__swatch${(c.hex.toLowerCase() === '#ffffff') ? ' wx-team-color__swatch--white' : ''}${isOn(c.hex) ? ' wx-team-color__swatch--on' : ''}`" :style="{ background: c.hex, color: readableInk(c.hex) }">
            <IconCheck v-if="isOn(c.hex)" :size="18" :style="{ strokeWidth: 3 }" />
            <template v-else>{{ c.code }}</template>
          </button>
        </div>
      </div>
      <div class="wx-team-color__footer">
        <button @click="() => onSave(picked)" class="wx-team-color__save" @mouseenter="(e) => { e.currentTarget.style.background = '#c41d14'; }" @mouseleave="(e) => { e.currentTarget.style.background = '#e1251b'; }">Save Colors</button>
      </div>
    </div>
  </div>
</template>

<script>
import { PROLOOK_COLORS } from '../../data/wizard.js';
import { readableInk } from '../../lib/wizard.js';
import { IconCheck, IconX } from '../icons.js';

export default {
  name: 'SelectTeamColorModal',
  components: { IconCheck, IconX },
  props: {
    open: { type: Boolean, default: undefined },
    initial: { type: Array, default: undefined },
    onClose: { type: Function, default: undefined },
    onSave: { type: Function, default: undefined },
  },
  data() {
    return { picked: this.initial || [], PROLOOK_COLORS };
  },
  watch: {
    // React: useEffect on [open] seeds the picked colors (it also runs once after mount: see mounted),
    // and useEffect on [open, onClose] listens for Escape while open.
    open() { if (this.open) this.setPicked(this.initial || []); this.unlisten(); if (this.open) this.listen(); },
  },
  mounted() {
    if (this.open) { this.setPicked(this.initial || []); this.listen(); }
  },
  beforeUnmount() {
    this.unlisten();
  },
  methods: {
    readableInk,
    listen() {
      this.keyHandler = (e) => { if (e.key === "Escape") this.onClose(); };
      window.addEventListener("keydown", this.keyHandler);
      document.body.style.overflow = "hidden";
    },
    unlisten() {
      if (!this.keyHandler) return;
      window.removeEventListener("keydown", this.keyHandler);
      this.keyHandler = null;
      document.body.style.overflow = "";
    },
    setPicked(v) { this.picked = typeof v === "function" ? v(this.picked) : v; },
    isOn(hex) { return this.picked.some((c) => c.toLowerCase() === hex.toLowerCase()); },
    toggle(hex) {
      this.setPicked((p) =>
        p.some((c) => c.toLowerCase() === hex.toLowerCase()) ?
          p.filter((c) => c.toLowerCase() !== hex.toLowerCase()) :
          [...p, hex]);
    },
  },
};
</script>
