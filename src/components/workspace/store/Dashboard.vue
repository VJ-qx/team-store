<!-- Converted from workspace-app.jsx / workspace-app-integrated.jsx: Dashboard, the embedded layout the workspace
     uses for a store's page: the icon side menu and the tab content. Only the Home tab is converted; the
     other tabs (Settings, Orders, Products, My Teams, Reports) show their page header and nothing under it
     yet, and the launch modals and the Store Close Report's overlay are not converted yet. Dashboard's
     other layout (header + tab strip) is not used by the workspace and is not converted. -->
<template>
  <div class="wx-store-dash">
    <StoreSideNav :tab="tab" :onChange="setTab" :badges="badges" :store="store" />
    <div :inert="readOnly" :class="`wx-store-dash__content${readOnly ? ' wx-store-dash__content--readonly' : ''}`">
      <!-- Draft-state launch banner (Store Status & Lifecycle, Epic A) -->
      <div v-if="isDraftStore" class="wx-store-dash__launch">
        <span class="wx-store-dash__launch-icon">
          <IconStore :size="24" />
        </span>
        <div class="wx-store-dash__launch-text">
          <div class="wx-store-dash__launch-title">Ready to launch?</div>
          <div class="wx-store-dash__launch-copy">{{ canLaunch
            ? "This store is a draft — buyers can't see it yet. Launch when you're ready to start taking orders."
            : "This store is a draft — add at least one product, then launch to start taking orders." }}</div>
        </div>
        <!-- The background stays inline (v-patch-style): the hover handlers write it, and it changes with canLaunch. -->
        <button :disabled="!canLaunch" @click="() => canLaunch && setShowLaunchModal(true)" :title="canLaunch ? 'Launch this team store' : 'Add at least one product to launch your store'" :class="`wx-store-dash__launch-btn${canLaunch ? '' : ' wx-store-dash__launch-btn--disabled'}`" v-patch-style="{ background: canLaunch ? '#0e0e10' : '#ececf0' }" @mouseenter="(e) => { if (canLaunch) e.currentTarget.style.background = '#1f1f22'; }" @mouseleave="(e) => { if (canLaunch) e.currentTarget.style.background = '#0e0e10'; }">Launch Store <IconArrowRight :size="15" /></button>
      </div>
      <!-- Page header (24/800) + Settings sub-nav pills -->
      <div v-if="tab !== 'home'" :style="{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: INT && (tab === 'products' || tab === 'orders') ? '12px' : '24px' }">
        <h1 :data-screen-label="tab" :style="{ fontFamily: 'Archivo, sans-serif', fontSize: '24px', fontWeight: 800, lineHeight: '32px', letterSpacing: '-.01em', color: '#09090b', margin: '0' }">{{ tab === "general" ? "Settings"
          : tab === "payouts" ? "Reports"
          : tab === "roster" ? ((store && store.storeType === "league") ? "My Teams" : "My Team")
          : tab === "products" ? "Products"
          : "Orders" }}</h1>
      </div>
      <StoreCloseReportHost :store="store" />
      <StoreSetupGuideHost :store="store" />
      <!-- Settings: StoreSettingsNav and the tab itself are not converted yet. -->
      <div v-if="tab === 'general'" :style="{ display: 'flex', gap: '36px', alignItems: 'flex-start' }">
        <div :style="{ flex: 1, minWidth: '0' }"></div>
      </div>
      <HomeTab v-else-if="tab === 'home'" :store="store" :org="org" :readOnly="readOnly" :onGoTab="setTab" :onPendingOrders="() => { setTab('orders'); pendingTabJump = pendingTabJump + 1; }" :onAllOrders="() => { setTab('orders'); allOrdersJump = allOrdersJump + 1; }" :onRosterBank="() => setTab('roster')" :onManagers="(t) => jumpToManagers(t && t.groupId, t && t.rosterId)" :onLaunch="() => { if ((store.products || []).length) setShowLaunchModal(true); }" :onGoSettings="(s) => { settingsSection = s || 'store'; setTab('general'); }" :onUpdateStore="onUpdateStore" />
    </div>
  </div>
</template>

<script>
import { INTEGRATION } from '../../../workspace/integration.js';
import { makeRosterOrg, owTeams } from './rosters.js';
import { homeRedNavTabs, loadBadgeState, saveBadgeState } from './store-home.js';
import { IconArrowRight, IconStore } from '../icons.js';
import StoreSetupGuideHost from '../guide/StoreSetupGuideHost.vue';
import HomeTab from './HomeTab.vue';
import StoreCloseReportHost from './StoreCloseReportHost.vue';
import StoreSideNav from './StoreSideNav.vue';

export default {
  name: 'Dashboard',
  components: { HomeTab, IconArrowRight, IconStore, StoreCloseReportHost, StoreSetupGuideHost, StoreSideNav },
  props: {
    store: { type: Object, default: undefined },
    onBack: { type: Function, default: undefined },
    onCustomize: { type: Function, default: undefined },
    initialTab: { type: String, default: undefined },
    onProductsChange: { type: Function, default: undefined },
    simulateOrders: { type: Boolean, default: undefined },
    liveStores: { type: Array, default: undefined },
    onLaunch: { type: Function, default: undefined },
    onSwitchStore: { type: Function, default: undefined },
    onSetStatus: { type: Function, default: undefined },
    onViewStore: { type: Function, default: undefined },
    onUpdateStore: { type: Function, default: undefined },
    onCreateTemplate: { type: Function, default: undefined },
    embedded: { type: Boolean, default: false },
    readOnly: { type: Boolean, default: false },
  },
  data() {
    return {
      INT: INTEGRATION.on,
      tab: this.initialTab || "home",
      // Shared roster structure + manager mapping — lifted here so the Settings tab's "Team Manager &
      // Freight Mapping" and the Rosters tab mirror each other live (both read/write the same org object).
      org: makeRosterOrg(this.store, !!this.store.__fresh),
      managerFocus: null, // {groupId, rosterId, n}
      // Settings page sub-nav (embedded workspace): Store Settings | Distribution & Fulfillment
      settingsSection: "store",
      showLaunchModal: false,
      showSuccessModal: false,
      // Bumped whenever something requests a jump to a specific pending order, so OrdersTabV2 can react
      // and open that order's drawer.
      pendingJump: 0,
      // Bumped to request a jump to the Orders tab's "All Orders" sub-tab.
      allOrdersJump: 0,
      // Bumped to request a jump to the Orders tab's "Pending Orders" sub-tab (no drawer).
      pendingTabJump: 0,
      // ─── Tab badges (Cody's matrix) ───
      viewed: loadBadgeState(this.store.id),
    };
  },
  computed: {
    managerGated() { return this.store.storeType === "league" && (this.store.distributionModel || "coach") === "coach"; },
    canLaunch() { return (this.store.products || []).length > 0; },
    isLive() { return !!this.store.live; },
    // Draft = never launched (Store Status & Lifecycle: Draft is the entry state only).
    isDraftStore() { return !this.isLive && this.store.status !== "closed" && this.store.status !== "archived"; },
    ordersCleared() { const { viewed } = this; return viewed.ordersTab && viewed.sub_pending && viewed.sub_all; },
    productsCleared() { return (this.store.products?.length || 0) >= 1; },
    badges() {
      const { viewed } = this;
      const homeRed = homeRedNavTabs(this.store, this.org);
      return {
        general: !viewed.general || homeRed.has("general"),
        orders: !this.ordersCleared || homeRed.has("orders"),
        products: !this.productsCleared || homeRed.has("products"),
        roster: !viewed.roster || homeRed.has("roster"),
        payouts: !viewed.payouts,
      };
    },
    storeId() { return this.store.id; },
    storeLive() { return this.store.live; },
  },
  watch: {
    // React: useEffect on [initialTab].
    initialTab(v) { if (v) this.tab = v; },
    // React: useEffect on [org, store.id].
    org() { this.registerTeamCodes(); },
    storeId() {
      this.registerTeamCodes();
      this.viewed = loadBadgeState(this.store.id);
      this.markTabViewed();
    },
    // React: useEffect on [tab] (tour signal) and [tab, markViewed] (clear-on-view).
    tab() {
      this.signalTab();
      this.markTabViewed();
    },
    // React: useEffect on [store.live] (cleanup removes the hooks, then they are set again).
    storeLive() {
      this.removeTabHooks();
      this.addTabHooks();
    },
  },
  mounted() {
    // The prototype's effects, in their order.
    this.registerTeamCodes();
    this.signalTab();
    window.__goToPendingOrder = () => { this.setTab("orders"); this.pendingJump = this.pendingJump + 1; };
    // 4 — the Settings card hands off to the Products tab's category control.
    this.openProductCats = () => this.setTab("products");
    window.addEventListener("ts:openProductCats", this.openProductCats);
    // Hooks for the onboarding checklist to drive navigation / launch.
    this.addTabHooks();
    this.viewed = loadBadgeState(this.store.id);
    this.markTabViewed();
    // Settings → "View in Products": switch tabs; the products list picks up the still-collecting filter
    // from the same event / pending flag.
    this.filterCollecting = () => { window.__pteFilterCollecting = true; this.setTab("products"); };
    window.addEventListener("pte:filter-collecting", this.filterCollecting);
  },
  beforeUnmount() {
    delete window.__goToPendingOrder;
    window.removeEventListener("ts:openProductCats", this.openProductCats);
    this.removeTabHooks();
    window.removeEventListener("pte:filter-collecting", this.filterCollecting);
  },
  methods: {
    setTab(v) { this.tab = v; },
    setShowLaunchModal(v) { this.showLaunchModal = v; },
    jumpToManagers(groupId, rosterId) { this.managerFocus = { groupId, rosterId, n: Date.now() }; this.settingsSection = "distribution"; this.setTab("general"); },
    // Workspace Settings → Pricing Tiers reads team codes from here (live mirror of this store's rosters).
    // Workspace.dc.html only.
    registerTeamCodes() {
      if (INTEGRATION.on) return;
      if (typeof owTeams !== "function") return;
      window.__wsTeamCodeRegistry = { ...(window.__wsTeamCodeRegistry || {}), [this.store.id]: owTeams(this.org, this.store).filter((t) => t.id !== "store-team") };
    },
    // Notify the onboarding tour which dashboard tab is active so it can advance.
    signalTab() { window.dispatchEvent(new CustomEvent("tour:dashboard-tab", { detail: this.tab })); },
    addTabHooks() {
      window.__goToDashTab = (t) => this.setTab(t);
      window.__openLaunchModal = () => { if (!this.store.live) this.setShowLaunchModal(true); };
    },
    removeTabHooks() { delete window.__goToDashTab; delete window.__openLaunchModal; },
    markViewed(patch) {
      const prev = this.viewed;
      const changed = Object.keys(patch).some((k) => prev[k] !== patch[k]);
      if (!changed) return;
      const next = { ...prev, ...patch };
      saveBadgeState(this.store.id, next);
      this.viewed = next;
    },
    // Clear-on-view for General / Payouts / Roster; Orders marks its main tab (sub-tabs report separately).
    markTabViewed() {
      const { tab } = this;
      if (tab === "general") this.markViewed({ general: true }); else
      if (tab === "payouts") this.markViewed({ payouts: true }); else
      if (tab === "roster") this.markViewed({ roster: true }); else
      if (tab === "orders") this.markViewed({ ordersTab: true });
    },
    confirmLaunch() {
      this.showLaunchModal = false;
      this.onLaunch && this.onLaunch(this.store.id);
      this.showSuccessModal = true;
    },
  },
};
</script>
