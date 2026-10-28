<!-- Converted from workspace-app.jsx / workspace-app-integrated.jsx: StoreSideNav — the icon side menu on a
     store's page. Items map to the dashboard's tab ids (general/orders/products/roster/payouts) under the
     menu's labels. -->
<template>
  <nav class="wx-store-nav">
    <!-- The background stays inline (v-patch-style): the hover handlers write it, and it changes with the tab. -->
    <button v-for="it in nav" :key="it.id" @click="() => onChange && onChange(it.id)" :title="labelFor(it)" class="wx-store-nav__item" v-patch-style="{ background: tab === it.id ? '#ececf0' : 'transparent' }" @mouseenter="(e) => { if (tab !== it.id) e.currentTarget.style.background = '#f6f6f8'; }" @mouseleave="(e) => { if (tab !== it.id) e.currentTarget.style.background = 'transparent'; }">
      <span :class="`wx-store-nav__icon${tab === it.id ? ' wx-store-nav__icon--active' : ''}`">
        <component :is="it.icon" :size="tab === it.id ? 22 : 24" :stroke="tab === it.id ? 2 : 1.7" />
        <span v-if="badges[it.id]" class="wx-store-nav__badge" />
      </span>
      <span :class="`wx-store-nav__label${tab === it.id ? ' wx-store-nav__label--active' : ''}`">{{ labelFor(it) }}</span>
    </button>
  </nav>
</template>

<script>
import { IconBarGraphBox, IconReceipt, IconSettings, IconShirt, IconUsers } from '../icons.js';
import IconHomeGlyph from './IconHomeGlyph.vue';

const WORKSPACE_NAV = [
  { id: "home", label: "Home", icon: IconHomeGlyph },
  { id: "roster", label: "Roster", icon: IconUsers },
  { id: "products", label: "Products", icon: IconShirt },
  { id: "orders", label: "Orders", icon: IconReceipt },
  { id: "payouts", label: "Reports", icon: IconBarGraphBox },
  { id: "general", label: "Settings", icon: IconSettings },
];

export default {
  name: 'StoreSideNav',
  props: {
    tab: { type: String, default: undefined },
    onChange: { type: Function, default: undefined },
    badges: { type: Object, default: () => ({}) },
    store: { type: Object, default: undefined },
  },
  computed: {
    // A constant list; components in it must not become reactive.
    nav() { return WORKSPACE_NAV; },
  },
  methods: {
    labelFor(it) { const { store } = this; return it.id === "roster" ? ((store && store.storeType === "league") ? "My Teams" : "My Team") : it.label; },
  },
};
</script>
