<!-- Converted from workspace-app.jsx: TeamStoresHeader. The tab rail's left margin follows the
     measured width of the brand link, so the tabs line up with the page content on wide screens. -->
<template>
  <header :style="{ position: 'sticky', top: '0', zIndex: 50, height: '92px', background: '#fff', borderBottom: '1px solid #e8e8ec', display: 'flex', alignItems: 'stretch', padding: '0 40px' }">
    <!-- Left — brand mark + wordmark → landing -->
    <a ref="brand" href="#" @click="goLanding" title="Overview" :style="{ display: 'inline-flex', alignItems: 'center', gap: '20px', textDecoration: 'none', color: '#0e0e10', flexShrink: 0 }">
      <BrandMark variant="ink" :height="38" />
      <span :style="{ width: '1px', height: '28px', background: '#e4e4e7' }" />
      <span :style="{ fontSize: '17px', fontWeight: 800, letterSpacing: '.14em', whiteSpace: 'nowrap' }">TEAM STORES</span>
    </a>
    <!-- Center — section nav -->
    <NavTabs :tabs="tabs" :active="active" :onChange="onChange" :style="{ marginLeft: tabsMargin }" />
    <!-- Right — account menu (click or hover opens; no direct navigation) -->
    <AccountMenu :name="accountName" :onSelect="onMenuSelect" />
  </header>
</template>

<script>
import BrandMark from '../common/BrandMark.vue';
import AccountMenu from './AccountMenu.vue';
import NavTabs from './NavTabs.vue';

const TABS = [
  { id: "overview", label: "OVERVIEW" },
  { id: "stores", label: "STORES" },
  { id: "reports", label: "EARNINGS" },
];

export default {
  name: 'TeamStoresHeader',
  components: { AccountMenu, BrandMark, NavTabs },
  props: {
    active: { type: String, default: 'overview' },
    onChange: { type: Function, default: undefined },
    onGoLanding: { type: Function, default: undefined },
    onMenuSelect: { type: Function, default: undefined },
    accountName: { type: String, default: undefined },
  },
  data() {
    return { tabs: TABS, brandW: 0 };
  },
  computed: {
    // Align the tab rail's left edge with the page content edge (content is 1376px max, centered,
    // 32px min gutter) once the viewport is wide enough.
    tabsMargin() {
      return `max(44px, calc(max(32px, (100% - 1296px) / 2) - 40px - ${this.brandW}px))`;
    },
  },
  mounted() {
    // React: useLayoutEffect — measure the brand link now and whenever it resizes.
    const el = this.$refs.brand;
    if (!el) return;
    const measure = () => { this.brandW = el.getBoundingClientRect().width; };
    measure();
    this.ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    this.ro && this.ro.observe(el);
  },
  beforeUnmount() {
    this.ro && this.ro.disconnect();
  },
  methods: {
    goLanding(e) {
      e && e.preventDefault();
      this.onGoLanding && this.onGoLanding();
    },
  },
};
</script>
