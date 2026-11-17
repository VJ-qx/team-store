<!-- Converted from workspace-app.jsx: UtilityBar — the prolook.com top utility strip (Cobrowse · Catalog ·
     Contact). The app shows it, with GlobalHeader, on screens outside the store editor that don't have the
     Team Stores tabs (such as "Creating your store…"). Its links go nowhere, as in the prototype. Inline
     styles, as in the prototype (the page frame's chrome wasn't extracted). -->
<template>
  <div :style="{ background: '#ededef', borderBottom: '1px solid #e2e2e6', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 32px' }">
    <nav :style="{ display: 'flex', alignItems: 'center', gap: '0' }">
      <template v-for="(l, i) in links" :key="l">
        <span v-if="i > 0" :style="{ width: '1px', height: '12px', background: '#c8c8ce', margin: '0 16px' }" />
        <a href="#" @click="(e) => e.preventDefault()" v-patch-style="{ textDecoration: 'none', color: '#3a3a40', fontSize: '13.5px', fontWeight: 500, transition: 'color .12s' }" @mouseenter="(e) => (e.currentTarget.style.color = '#0e0e10')" @mouseleave="(e) => (e.currentTarget.style.color = '#3a3a40')">{{ l }}</a>
      </template>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'UtilityBar',
  data() {
    return { links: ["Cobrowse", "Catalog", "Contact"] };
  },
};
</script>
