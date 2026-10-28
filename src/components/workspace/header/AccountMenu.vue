<!-- Converted from workspace-app.jsx / workspace-app-integrated.jsx: AccountMenu. Hover or click opens
     it; it closes on mouse-leave (after a short delay), outside click, Escape, or focus leaving it. -->
<template>
  <div ref="root" @mouseenter="() => openMenu()" @mouseleave="onMouseLeave" @focusout="(e) => { if ($refs.root && !$refs.root.contains(e.relatedTarget)) closeMenu(); }" :style="{ marginLeft: 'auto', position: 'relative', display: 'flex', alignItems: 'center', alignSelf: 'stretch' }">
    <button ref="btn" @click="() => (open && vis ? closeMenu() : openMenu())" aria-haspopup="menu" :aria-expanded="open && vis" title="Account menu" @mousedown="(e) => { e.currentTarget.style.opacity = '.55'; }" @mouseup="(e) => { e.currentTarget.style.opacity = '1'; }" v-patch-style="{ display: 'inline-flex', alignItems: 'center', gap: '12px', background: 'transparent', border: '0', cursor: 'pointer', color: '#0e0e10', padding: '8px 2px', borderRadius: '6px', outlineOffset: '4px', transition: 'opacity .1s ease', fontFamily: 'inherit' }">
      <span :aria-label="name || 'My account'" :style="{ width: '36px', height: '36px', borderRadius: '50%', background: '#0e0e10', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, letterSpacing: '.02em' }">{{ String(name || 'MA').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase() }}</span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" :style="{ marginLeft: '-2px', transform: open && vis ? 'rotate(180deg)' : 'none', transition: 'transform .16s ease' }">
        <path d="M6 9l6 6 6-6" />
      </svg>
    </button>
    <div v-if="open" role="menu" aria-label="Account" :style="{ position: 'absolute', top: '100%', right: '0', width: '252px', zIndex: 80, marginTop: '-6px', background: '#fff', border: '1px solid #e8e8ec', borderRadius: '10px', boxShadow: '0 16px 40px rgba(20,20,30,.16)', overflow: 'hidden', opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(-6px)', transition: 'opacity .14s ease, transform .14s ease' }">
      <button v-for="(it, i) in items" :key="it.id" role="menuitem" @click="() => pick(it.id)" v-patch-style="{ display: 'flex', alignItems: 'center', gap: '14px', width: '100%', background: 'transparent', border: '0', borderTop: i > 0 ? '1px solid #f1f1f3' : '0', padding: '15px 20px', cursor: 'pointer', textAlign: 'left', fontSize: '15px', fontWeight: 600, color: '#0e0e10', fontFamily: 'inherit', transition: 'background .1s ease' }" @mouseenter="(e) => (e.currentTarget.style.background = '#f7f7f8')" @mouseleave="(e) => (e.currentTarget.style.background = 'transparent')">
        <CustomizerBrandGlyph v-if="it.glyph" :src="it.glyphSrc" />
        <component :is="it.icon" v-else :size="19" :stroke="1.8" :style="{ flexShrink: 0 }" />
        <span>{{ it.label }}</span>
      </button>
    </div>
  </div>
</template>

<script>
import { markRaw } from 'vue';
import { INTEGRATION } from '../../../utils/integration.js';
import { IconBag, IconLayers, IconLogout, IconSettings, IconUser } from '../icons.js';
import CustomizerBrandGlyph from './CustomizerBrandGlyph.vue';

// The integrated workspace links the Victus Customizer instead of the PROLOOK one.
const ITEMS = markRaw([
  { id: "account", label: "My Account", icon: IconUser },
  INTEGRATION.on
    ? { id: "customizer-victus", label: "Victus Customizer", glyph: true, glyphSrc: "assets/brands/victus.png" }
    : { id: "customizer", label: "Customizer", glyph: true },
  { id: "orders", label: "Orders", icon: IconBag },
  { id: "vault", label: "Stock Vault", icon: IconLayers },
  { id: "wsettings", label: "Workspace Settings", icon: IconSettings },
  { id: "logout", label: "Logout", icon: IconLogout },
]);

export default {
  name: 'AccountMenu',
  components: { CustomizerBrandGlyph },
  props: {
    name: { type: String, default: undefined },
    onSelect: { type: Function, default: undefined },
  },
  data() {
    return { open: false, vis: false };
  },
  computed: {
    items: () => ITEMS,
  },
  watch: {
    // React: useEffect on [open] — while open, outside clicks and Escape close the menu.
    open(open) {
      this.unlisten();
      if (open) this.listen();
    },
  },
  beforeUnmount() {
    this.unlisten();
    clearTimeout(this.timer);
  },
  methods: {
    openMenu() {
      clearTimeout(this.timer);
      this.open = true;
      requestAnimationFrame(() => requestAnimationFrame(() => { this.vis = true; }));
    },
    closeMenu() {
      clearTimeout(this.timer);
      this.vis = false;
      this.timer = setTimeout(() => { this.open = false; }, 150);
    },
    onMouseLeave() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => { this.vis = false; setTimeout(() => { this.open = false; }, 150); }, 120);
    },
    pick(id) {
      this.closeMenu();
      this.onSelect && this.onSelect(id);
    },
    listen() {
      this.onDoc = (e) => { if (this.$refs.root && !this.$refs.root.contains(e.target)) this.closeMenu(); };
      this.onKey = (e) => { if (e.key === "Escape") { this.closeMenu(); this.$refs.btn && this.$refs.btn.focus(); } };
      document.addEventListener("mousedown", this.onDoc);
      window.addEventListener("keydown", this.onKey);
    },
    unlisten() {
      if (!this.onDoc) return;
      document.removeEventListener("mousedown", this.onDoc);
      window.removeEventListener("keydown", this.onKey);
      this.onDoc = this.onKey = null;
    },
  },
};
</script>
