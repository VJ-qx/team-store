<!-- Converted from workspace-app.jsx: GlobalHeader — the prolook.com primary header: logo and storefront nav
     (DISCOVER, BUILD MEN'S, BUILD WOMEN'S, TEAM STORES). `active` is one of "discover" | "build-mens" |
     "build-womens" | "team-stores" | "none". Inline styles, as in the prototype (the page frame's chrome
     wasn't extracted). -->
<template>
  <header :style="{ height: '80px', background: '#fff', borderBottom: '1px solid #e8e8ec', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', position: 'sticky', top: '0', zIndex: 50 }">
    <div :style="{ display: 'flex', alignItems: 'center', gap: '52px' }">
      <a href="#" @click="(e) => { e.preventDefault(); onNavigate && onNavigate('discover'); }" title="PROLOOK home" :style="{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }">
        <BrandMark variant="black" :height="34" />
      </a>
      <nav :style="{ display: 'flex', alignItems: 'stretch', gap: '36px', height: '80px' }">
        <a v-for="t in tabs" :key="t.id" href="#" @click="(e) => { e.preventDefault(); onNavigate && onNavigate(t.id); }" v-patch-style="{ position: 'relative', display: 'inline-flex', alignItems: 'center', textDecoration: 'none', color: active === t.id ? '#0e0e10' : '#1a1a1d', fontWeight: 800, fontSize: '15px', letterSpacing: '.035em', whiteSpace: 'nowrap', transition: 'opacity .12s' }" @mouseenter="(e) => { if (active !== t.id) e.currentTarget.style.opacity = '.6'; }" @mouseleave="(e) => { if (active !== t.id) e.currentTarget.style.opacity = '1'; }">
          <span>{{ t.label }}</span>
          <span v-if="active === t.id" aria-hidden="true" :style="{ position: 'absolute', left: '0', right: '0', bottom: '24px', height: '2.5px', background: '#0e0e10' }" />
        </a>
      </nav>
    </div>
  </header>
</template>

<script>
import BrandMark from '../common/BrandMark.vue';

export default {
  name: 'GlobalHeader',
  components: { BrandMark },
  props: {
    active: { type: String, default: "none" },
    onNavigate: { type: Function, default: undefined },
    // Declared but unused, as in the prototype.
    cartCount: { type: Number, default: 3 },
    hideAccountCart: { type: Boolean, default: false },
  },
  data() {
    return {
      tabs: [
        { id: "discover", label: "DISCOVER" },
        { id: "build-mens", label: "BUILD MEN'S" },
        { id: "build-womens", label: "BUILD WOMEN'S" },
        { id: "team-stores", label: "TEAM STORES" },
      ],
    };
  },
};
</script>
