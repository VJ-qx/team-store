<!-- Converted from workspace-app.jsx: Modal. Stays mounted for 160 ms after it closes, to play the
     closing animation. While open, Escape closes it and the page behind does not scroll. -->
<template>
  <div v-if="visible" :style="{ position: 'fixed', inset: '0', zIndex: 100, background: 'rgba(20,20,30,.45)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: closing ? 'fadeOut .16s ease forwards' : 'fadeIn .18s ease-out' }" @click="onClose">
    <div @click="(e) => e.stopPropagation()" :style="{ background: '#fff', borderRadius: '8px', width: px(width), maxWidth: 'calc(100vw - 32px)', boxShadow: '0 24px 48px rgba(20,20,30,.20)', animation: closing ? 'popOut .16s cubic-bezier(.4,0,1,1) forwards' : 'popIn .2s cubic-bezier(.16,.9,.3,1)' }">
      <slot />
    </div>
    <component :is="'style'">{{ css }}</component>
  </div>
</template>

<script>
import { px } from '../../../utils/style.js';

const CSS = `
        @keyframes fadeIn  { from{opacity:0}                                       to{opacity:1} }
        @keyframes fadeOut { from{opacity:1}                                       to{opacity:0} }
        @keyframes popIn   { from{opacity:0;transform:scale(.95) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes popOut  { from{opacity:1;transform:scale(1) translateY(0)}     to{opacity:0;transform:scale(.96) translateY(4px)} }
        @media (prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:1ms!important;transition-duration:1ms!important}}
      `;

export default {
  name: 'Modal',
  props: {
    open: { type: Boolean, default: undefined },
    onClose: { type: Function, default: undefined },
    width: { type: [Number, String], default: 480 },
  },
  data() {
    return { visible: this.open, closing: false, css: CSS };
  },
  watch: {
    // React: useEffect on [open] (with cleanup of the closing timer).
    open(open) {
      clearTimeout(this.closeTimer);
      if (open) { this.visible = true; this.closing = false; }
      else if (this.visible) {
        this.closing = true;
        this.closeTimer = setTimeout(() => { this.visible = false; this.closing = false; }, 160);
      }
    },
    // React: useEffect on [visible, onClose] — while visible, Escape closes and the body doesn't scroll.
    visible(visible) {
      this.unlisten();
      if (visible) this.listen();
    },
  },
  mounted() {
    if (this.visible) this.listen();
  },
  beforeUnmount() {
    clearTimeout(this.closeTimer);
    this.unlisten();
  },
  methods: {
    px,
    listen() {
      this.keyHandler = (e) => { if (e.key === 'Escape') this.onClose(); };
      window.addEventListener('keydown', this.keyHandler);
      document.body.style.overflow = 'hidden';
    },
    unlisten() {
      if (!this.keyHandler) return;
      window.removeEventListener('keydown', this.keyHandler);
      this.keyHandler = null;
      document.body.style.overflow = '';
    },
  },
};
</script>
