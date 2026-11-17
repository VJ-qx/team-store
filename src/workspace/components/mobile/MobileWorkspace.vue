<!-- Converted from "Workspace Mobile.dc.html": the mobile app (.wm-app) — its navigation stack, taps on
     data-go links (a screen id, "back", or "toast:<message>" for actions the prototype only acknowledges)
     and the toast (2.2 s). The workspace shows it below 744px (WorkspacePage).
     Converted so far: the Overview screen (Module 2). Links to the mobile app's other screens (Stores,
     Earnings, the account sheet, the create-store wizard, a store's screens) do nothing until those screens
     are converted with their modules; the toasts work as in the prototype.
     Prototype-only, left out: the iPhone frame (ios-frame.jsx), "Restart prototype", and the startScreen
     setting. The frame's look for the app area comes from .wm-root (styles/responsive/workspace/layouts/_root). -->
<template>
  <div class="wm-root">
    <div @click="onTap" class="wm-app">
      <MobileOverview v-if="current === 'ws-overview'" ref="screen" />
      <div v-if="toast" class="wm-toast">{{ toast }}</div>
    </div>
  </div>
</template>

<script>
import MobileOverview from './MobileOverview.vue';

// The mobile screens converted to Vue so far.
const CONVERTED = ['ws-overview'];
// Where "back" goes from a screen at the bottom of the stack (the prototype's PARENT, for the converted screens).
const PARENT = {};

export default {
  name: 'MobileWorkspace',
  components: { MobileOverview },
  data() {
    return { stack: ['ws-overview'], toast: '', toastN: 0 };
  },
  computed: {
    current() { return this.stack[this.stack.length - 1]; },
  },
  beforeUnmount() {
    clearTimeout(this.toastTimer);
  },
  methods: {
    go(id) {
      // Screens not converted yet: the tap does nothing.
      if (!CONVERTED.includes(id)) return;
      const i = this.stack.lastIndexOf(id);
      this.stack = i >= 0 ? this.stack.slice(0, i + 1) : [...this.stack, id];
    },
    back() {
      if (this.stack.length > 1) { this.stack = this.stack.slice(0, -1); return; }
      const p = PARENT[this.stack[0]];
      if (p) this.stack = [p];
    },
    showToast(msg) {
      this.toast = msg; this.toastN += 1;
      clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => { this.toast = ''; }, 2200);
    },
    // The prototype's onTap: close an open menu, then follow the tapped data-go link.
    onTap(e) {
      const screen = this.$refs.screen;
      if (screen && screen.onAppTap) screen.onAppTap(e);
      const el = e.target.closest('[data-go],[data-stop]');
      if (!el || !el.hasAttribute('data-go')) return;
      const t = el.getAttribute('data-go');
      if (t === 'back') this.back();
      else if (t.startsWith('toast:')) { this.showToast(t.slice(6)); if (/sheet$/.test(this.current)) this.back(); }
      else this.go(t);
    },
  },
};
</script>
