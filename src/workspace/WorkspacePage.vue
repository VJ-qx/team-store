<!-- Converted from workspace-app.jsx / workspace-app-integrated.jsx: App, for the Module 1 screens — the
     access gate and business verification (FR-1.10.2), the welcome pop-up after sign-in, the Overview,
     and My Account — a store's page (its Home tab and the setup guides), the Overview (Module 2) and the
     Stores page (Module 3). The routing logic is the prototype's; screens that are not converted yet
     (the Add Store wizard, Earnings, Orders, …) render nothing.
     Prototype-only parts are not carried over: the Tweaks panel (its settings are pinned in
     data/settings.js), the #frame= deep links and the frame overview grid. -->
<template>
  <!-- ─── No-access flow: the gate, the application form, and the review states are full-viewport
       standalone pages (no prolook.com shell) ─── -->
  <template v-if="screen === 'gate' || screen === 'access-form' || screen === 'access-pending' || screen === 'stripe-verify'">
    <div v-if="screen === 'gate'" :style="{ minHeight: '100vh', background: '#fbfbfc', minWidth: '1280px', display: 'flex', flexDirection: 'column' }">
      <TeamStoresHeader active="" :onChange="() => {}" :accountName="accountName" :onMenuSelect="goLandingFile" :onGoLanding="goLandingFile" />
      <div :style="{ display: 'flex', minHeight: 'calc(100vh - 92px)' }">
        <FeatureGate embedded :onApply="() => setScreen('access-form')" :onBypass="() => unlockFromGate('Verified — welcome to Team Stores')" :onBack="goLandingFile" />
      </div>
    </div>
    <AccessApplyForm v-if="screen === 'access-form'" :onSubmit="() => setScreen('access-pending')" :onCancel="goLandingFile" />
    <StripeVerifying v-if="screen === 'stripe-verify'" :onDone="() => unlockFromGate('Verified with Stripe — welcome to Team Stores')" />
    <AccessPending v-if="screen === 'access-pending'" :email="ACCOUNT_PROFILE.email" :onApprove="() => unlockFromGate('Organization approved — welcome to Team Stores')" :onBack="goLandingFile" />
    <Toast :message="toast" :onDone="() => setToast(null)" />
  </template>
  <div v-else :style="{ minHeight: '100vh', background: '#fbfbfc', minWidth: '1280px' }">
    <TeamStoresHeader v-if="showSubTabs" :active="activeSubTab" :onChange="(id) => guardNav(() => onTabChange(id))" :accountName="accountName" :onMenuSelect="(id) => guardNav(() => onAccountMenu(id))" :onGoLanding="() => guardNav(goOverviewHome)" />
    <div :key="screen" :style="{ display: 'flex', minHeight: inEditor ? '100vh' : 'calc(100vh - 114px)', animation: 'pageIn .22s ease-out both' }">
      <OverviewDashboard v-if="screen === 'overview'" :key="overviewKey" :isEmpty="tweaks.overviewEmpty || tweaks.zeroState" :stores="activeStores" :leagues="leagues" :onManageStore="(id, tab) => { recordStoreVisit(id); setActiveStoreId(id); setDashboardTab(tab || 'home'); setScreen('dashboard'); }" :onGoStores="goStores" :onViewOrders="() => { setOrdersOrigin('overview'); setNavTab('overview'); setScreen('orders'); }" :onAdd="goCreate" />
      <AccountProfile v-if="screen === 'account'" :authMode="INT ? 'native' : tweaks.authMode" :onEditProfile="onEditProfile" :onToast="setToast" :archivedStores="archivedStores" :onManageStore="(id) => { setActiveStoreId(id); setDashboardTab('home'); setScreen('dashboard'); }" :onUnarchive="(id) => setRestoreTargetId(id)" :onCreateTemplate="(s) => setCreateTplStore(s)" />
      <StoreList v-if="screen === 'list'" :stores="activeStores" :zeroState="tweaks.zeroState" :onAdd="goCreate" :onAddLeague="() => setShowLeagueModal(true)" :onAddGroup="() => setShowGroupModal(true)" :onManage="(id) => { recordStoreVisit(id); setActiveStoreId(id); setDashboardTab('home'); setScreen('dashboard'); }" :onArchive="(id) => setArchiveTargetId(id)" :onCreateTemplate="(s) => setCreateTplStore(s)" :leagues="leagues" :activeLeagueId="activeLeagueId" :onSelectLeague="(id) => { setActiveLeagueId(id); setActiveGroupId(null); }" :activeGroupId="activeGroupId" :onOpenGroup="(gid) => setActiveGroupId(gid)" :onCloseGroup="() => setActiveGroupId(null)" :onOpenSettings="() => setScreen('league-settings')" :onBackToLeagues="goLeagues" />
      <ManageStoreWorkspace v-if="screen === 'dashboard' && activeStore" :store="activeStore" :readOnly="!!activeStore.archived" :onBack="goStores" :onCustomize="() => setScreen('customizer')" :initialTab="dashboardTab" :liveStores="stores.filter((s) => s.live)" :onLaunch="handleLaunch" :onSetStatus="handleSetStatus" :onViewStore="handleViewStore" :onSwitchStore="(id) => { setActiveStoreId(id); setScreen('dashboard'); }" :onProductsChange="(changes) => updateStore(activeStore.id, changes)" :onUpdateStore="(patch) => updateStore(activeStore.id, patch)" :onCreateTemplate="(s) => setCreateTplStore(s)" />
    </div>
    <ArchiveStoreModal :open="!!archiveTargetStore" :store="archiveTargetStore" :onClose="() => setArchiveTargetId(null)" :onConfirm="confirmArchive" />
    <RestoreStoreModal :open="!!restoreTargetStore" :store="restoreTargetStore" :onClose="() => setRestoreTargetId(null)" :onConfirm="confirmRestore" />
    <!-- Logout confirmation — confirm lands on the Team Stores landing page -->
    <Modal :open="showLogoutModal" :onClose="() => setShowLogoutModal(false)" :width="440">
      <div :style="{ padding: '28px 32px 8px' }">
        <h2 :style="{ margin: '0', fontFamily: 'Archivo, sans-serif', fontSize: '20px', fontWeight: 800, color: '#0e0e10', letterSpacing: '-.01em' }">Log out of Team Stores?</h2>
        <p :style="{ margin: '10px 0 0', fontSize: '14px', color: '#6b6b72', lineHeight: 1.55 }">You're about to sign out of your Team Stores workspace on this device.</p>
      </div>
      <div :style="{ display: 'flex', justifyContent: 'flex-end', gap: '12px', padding: '24px 32px 28px' }">
        <button @click="() => setShowLogoutModal(false)" :style="{ border: '1px solid #d8d8de', background: '#fff', color: '#0e0e10', borderRadius: '8px', padding: '12px 20px', cursor: 'pointer', fontSize: '13.5px', fontWeight: 700, fontFamily: 'inherit' }">Cancel</button>
        <button @click="() => { setShowLogoutModal(false); goLandingFile(); }" :style="{ border: '0', background: '#0e0e10', color: '#fff', borderRadius: '8px', padding: '12px 20px', cursor: 'pointer', fontSize: '13.5px', fontWeight: 700, fontFamily: 'inherit' }">Yes, log out</button>
      </div>
    </Modal>
    <Toast :message="toast" :onDone="() => setToast(null)" />
    <!-- Store Setup Guide — informational modal, replaces the corner checklist -->
    <StoreGuideModal :open="guideOpen && !isFrameRoute && !tweaks.overviewMode" :onClose="dismissGuide" :onComplete="() => persistFirstStore(false)" />
    <!-- The integrated workspace has no Customizer sign-in hand-off, so it never shows the welcome pop-up. -->
    <WelcomeSSOModal v-if="!INT" :open="showWelcome && !isFrameRoute && !tweaks.overviewMode" :originId="ssoOriginId" :multiBrand="tweaks.ssoMultiBrand" :native="tweaks.authMode === 'native'" :onConfirm="confirmWelcome" />
  </div>
</template>

<script>
import { INTEGRATION } from './integration.js';
import { ACCOUNT_PROFILE } from './data/account.js';
import { ACCESSIBLE_CUSTOMIZERS, CUSTOMIZER_BRANDS } from './data/brands.js';
import { recordStoreVisit } from './storage/store-visits.js';
import { SETTINGS_DEFAULTS } from './data/settings.js';
import { makePrefill, makeSampleLeagues, makeSeededStores } from './seed/stores.js';
import { loadCreatedStores, saveCreatedStores } from './storage/created-stores.js';
import AccessApplyForm from './components/access/AccessApplyForm.vue';
import AccessPending from './components/access/AccessPending.vue';
import FeatureGate from './components/access/FeatureGate.vue';
import StripeVerifying from './components/access/StripeVerifying.vue';
import AccountProfile from './components/account/AccountProfile.vue';
import Modal from './components/common/Modal.vue';
import Toast from './components/common/Toast.vue';
import TeamStoresHeader from './components/header/TeamStoresHeader.vue';
import OverviewDashboard from './components/overview/OverviewDashboard.vue';
import ManageStoreWorkspace from './components/store/ManageStoreWorkspace.vue';
import ArchiveStoreModal from './components/stores/ArchiveStoreModal.vue';
import RestoreStoreModal from './components/stores/RestoreStoreModal.vue';
import StoreList from './components/stores/StoreList.vue';
import StoreGuideModal from './components/guide/StoreGuideModal.vue';
import WelcomeSSOModal from './components/welcome/WelcomeSSOModal.vue';

// The page the access screens, the account menu and logout send the rep to. It doesn't exist in the
// handover (the landing page is now "Landing Page.dc.html"); kept as in the prototype.
const LANDING_FILE = "Team Stores Landing.dc.html";

export default {
  name: 'WorkspacePage',
  components: { AccessApplyForm, AccessPending, AccountProfile, ArchiveStoreModal, FeatureGate, ManageStoreWorkspace, Modal, OverviewDashboard, RestoreStoreModal, StoreGuideModal, StoreList, StripeVerifying, TeamStoresHeader, Toast, WelcomeSSOModal },
  data() {
    const tweaks = { ...SETTINGS_DEFAULTS };
    return {
      INT: INTEGRATION.on,
      ACCOUNT_PROFILE,
      tweaks,
      // The prototype's #frame= deep links (used by its design-overview iframes) are prototype-only.
      isFrameRoute: false,
      // State machine: overview | gate | list | leagues | empty | form | loading | dashboard | customizer
      // The Team Stores landing page is the entry point; reps arrive already on Overview. A signed-in
      // rep whose dealership has no access is handed off from the landing page with ?access=none and
      // lands straight on the business-details form.
      screen: (() => {
        try { if (new URLSearchParams(window.location.search).get("access") === "none") return "access-form"; } catch (e) {}
        return "overview";
      })(),
      navTab: "overview",
      showWelcome: false,
      showLogoutModal: false,
      // Store Setup Guide — informational modal; dismissal is per rep, not per store.
      guideOpen: false,
      // is_first_store: global flag (the onboarding tour, not converted yet, reads it).
      isFirstStore: (() => {
        try { return localStorage.getItem("prolook_is_first_store") !== "false"; } catch (e) { return true; }
      })(),
      ordersOrigin: "overview", // which tab the All-Stores Orders page was opened from
      primaryBrand: null,
      // Session grant: a no-access user who passes the splash unlocks Team Stores for the rest of the session.
      gatePassed: false,
      pendingNav: null,
      showCancelModal: false,
      stores: makeSeededStores().concat(loadCreatedStores()),
      activeStoreId: null,
      toast: null,
      presetData: null,
      templateMode: false,
      dashboardTab: "general",
      leagues: makeSampleLeagues(),
      activeLeagueId: null,
      activeGroupId: null,
      createTplStore: null,
      // The create-league and create-group pop-ups (not converted; leagues are out of the MVP).
      showLeagueModal: false,
      showGroupModal: false,
      // Archive confirmation triggered from a store card's ⋮ menu on the Stores page.
      archiveTargetId: null,
      // Restore confirmation triggered from the My Account archived-stores list.
      restoreTargetId: null,
      // Header logo → Overview. Bumping the key remounts the dashboard when already there (acts as a refresh).
      overviewKey: 0,
    };
  },
  computed: {
    // Auto-sign-in welcome: originating brand comes from the ?brand= hand-off param (falls back to the
    // setting). The integrated workspace only accepts its accessible customizers.
    ssoOriginId() {
      try { const b = new URLSearchParams(window.location.search).get("brand"); if (b && CUSTOMIZER_BRANDS[b]) return b; } catch (e) {}
      return INTEGRATION.on
        ? (ACCESSIBLE_CUSTOMIZERS.includes(this.tweaks.ssoOriginBrand) ? this.tweaks.ssoOriginBrand : "victus")
        : (this.tweaks.ssoOriginBrand || "prolook");
    },
    accountName() { return `${ACCOUNT_PROFILE.firstName} ${ACCOUNT_PROFILE.lastName}`; },
    archiveTargetStore() { return this.stores.find((s) => s.id === this.archiveTargetId); },
    restoreTargetStore() { return this.stores.find((s) => s.id === this.restoreTargetId); },
    activeStore() { return this.stores.find((s) => s.id === this.activeStoreId); },
    activeStores() { return this.stores.filter((s) => !s.archived); },
    archivedStores() { return this.stores.filter((s) => s.archived); },
    // Store-editor screens drop the storefront chrome entirely.
    inEditor() { return this.screen === "dashboard" || this.screen === "customizer"; },
    showSubTabs() {
      const { screen } = this;
      return !this.inEditor && (screen === "wsettings" || screen === "vault" || screen === "overview" || screen === "orders" || screen === "reports" || screen === "leagues" || screen === "empty" || screen === "account" || screen === "form" || screen === "template" || screen === "template-repo" || (screen === "list" && !this.activeLeagueId));
    },
    activeSubTab() {
      const { screen } = this;
      return screen === "wsettings" ? "none" : screen === "vault" ? "none" : screen === "reports" ? "reports" : (screen === "form" || screen === "template" || screen === "template-repo") ? "stores" : (screen === "account" ? "none" : (screen === "orders" ? this.ordersOrigin : (screen === "overview" ? "overview" : (screen === "leagues" ? "leagues" : "stores"))));
    },
    inCreateFlow() { return this.screen === "form" || this.screen === "template" || this.screen === "template-repo"; },
  },
  watch: {
    // React: useEffect on [stores] — user-created stores survive a reload.
    stores() { this.persistCreatedStores(); },
    // React: useEffect on [screen] — the Store Setup Guide opens the first time a rep opens a store.
    screen() { this.autoOpenGuide(); },
  },
  created() {
    this.primaryBrand = this.ssoOriginId;
    // Development builds only: lets the parity tool reach the states the prototype's Tweaks panel
    // reaches: settings ({ authMode: "customizer" }) and its "▶ …" screen shortcuts ({ screen: "gate" }).
    if (import.meta.env.DEV) {
      window.__paritySetProps = (props) => {
        const { screen, ...settings } = props;
        Object.assign(this.tweaks, settings);
        if (screen) this.setScreen(screen);
      };
    }
  },
  mounted() {
    // The prototype's effects, in their order.
    this.autoOpenGuide();
    this.persistCreatedStores();
    if (!INTEGRATION.on) {
      // Native sign-in / sign-up hand-off from the landing page (?auth=native | native-new) sets the persona.
      try {
        const a = new URLSearchParams(window.location.search).get("auth");
        if (a === "native" || a === "native-new") this.setTweak("authMode", "native");
        // Native sign-up that connected its matching-email brands: identities auto-link, no welcome re-ask.
        if (a === "native-connected") { this.setTweak("authMode", "linked"); try { sessionStorage.setItem("ts_sso_welcomed", "1"); } catch (e2) {} this.showWelcome = false; }
      } catch (e) {}
      // Interrupts the first overview landing per session.
      if (this.tweaks.ssoWelcome) {
        let seen = false;
        try { seen = sessionStorage.getItem("ts_sso_welcomed") === "1"; } catch (e) {}
        if (!seen) this.showWelcome = true;
      }
    }
  },
  methods: {
    recordStoreVisit,
    persistCreatedStores() {
      if (!this.isFrameRoute) saveCreatedStores(this.stores.filter((s) => s.__userCreated));
    },
    setTweak(key, value) { this.tweaks[key] = value; },
    setScreen(v) { this.screen = v; },
    setNavTab(v) { this.navTab = v; },
    setToast(v) { this.toast = v; },
    setActiveStoreId(v) { this.activeStoreId = v; },
    setDashboardTab(v) { this.dashboardTab = v; },
    setOrdersOrigin(v) { this.ordersOrigin = v; },
    setArchiveTargetId(v) { this.archiveTargetId = v; },
    setRestoreTargetId(v) { this.restoreTargetId = v; },
    setActiveLeagueId(v) { this.activeLeagueId = v; },
    setActiveGroupId(v) { this.activeGroupId = v; },
    setShowLeagueModal(v) { this.showLeagueModal = v; },
    setShowGroupModal(v) { this.showGroupModal = v; },
    setCreateTplStore(v) { this.createTplStore = v; },
    setShowLogoutModal(v) { this.showLogoutModal = v; },
    goLandingFile() { window.location.href = encodeURI(LANDING_FILE); },
    autoOpenGuide() {
      if (this.screen !== "dashboard" || this.isFrameRoute) return;
      let seen = false;
      try { seen = localStorage.getItem("ts_setup_guide_seen_v1") === "1"; } catch (e) {}
      if (!seen) this.guideOpen = true;
    },
    dismissGuide() { this.guideOpen = false; try { localStorage.setItem("ts_setup_guide_seen_v1", "1"); } catch (e) {} },
    persistFirstStore(v) {
      this.isFirstStore = v;
      try { localStorage.setItem("prolook_is_first_store", v ? "true" : "false"); } catch (e) {}
    },
    handleLaunch(id) {
      this.updateStore(id, { live: true, status: "active" });
      this.toast = "Your store is now live";
      // Milestone 3 signal for the onboarding tour.
      window.dispatchEvent(new CustomEvent("tour:store-live"));
    },
    handleSetStatus(id, status) {
      this.updateStore(id, { status });
      this.toast = status === "hold" ? "Store put on hold" : "Store is active again";
    },
    handleViewStore(s) {
      this.toast = `Opening ${s.teamName || s.storeTitle} storefront…`;
    },
    confirmWelcome(chosen) {
      this.primaryBrand = chosen || this.ssoOriginId;
      this.showWelcome = false;
      try { sessionStorage.setItem("ts_sso_welcomed", "1"); } catch (e) {}
    },
    updateStore(id, patch) {
      this.stores = this.stores.map((s) => s.id === id ? { ...s, ...patch } : s);
    },
    confirmArchive() {
      this.updateStore(this.archiveTargetId, { status: "archived", live: false, archived: true });
      this.archiveTargetId = null;
      this.toast = "Store archived";
    },
    confirmRestore() {
      this.updateStore(this.restoreTargetId, { status: "active", live: false, archived: false });
      this.restoreTargetId = null;
      this.toast = "Store restored — now a draft in your active stores";
    },
    onEditProfile() {
      if (INTEGRATION.on) { window.open("https://customizer.victus.com/account", "_blank", "noopener"); this.toast = "Opening Victus Customizer account settings in a new tab…"; }
      else { window.open("https://customizer.prolook.com/account", "_blank", "noopener"); this.toast = "Opening Product Customizer account settings in a new tab…"; }
    },
    goCreate() {
      this.presetData = makePrefill();
      this.templateMode = false;
      this.screen = "form";
    },
    // ─── Team Stores section sub-tabs (Overview / Stores / Leagues) ───
    goOverviewHome() {
      this.navTab = "overview"; this.activeLeagueId = null; this.activeGroupId = null; this.screen = "overview"; this.overviewKey = this.overviewKey + 1;
      try { window.scrollTo(0, 0); } catch (e) {}
    },
    onTabChange(id) {
      if (id === "overview") { this.navTab = "overview"; this.screen = "overview"; }
      else if (id === "reports") { this.ordersOrigin = "overview"; this.navTab = "reports"; this.activeLeagueId = null; this.activeGroupId = null; this.screen = "reports"; }
      else if (id === "stores") { this.navTab = "stores"; this.activeLeagueId = null; this.activeGroupId = null; this.screen = (this.tweaks.zeroState || this.stores.length) ? "list" : "empty"; }
      else if (id === "leagues") { this.navTab = "leagues"; this.activeLeagueId = null; this.activeGroupId = null; this.screen = "leagues"; }
      else if (id === "vault") { this.navTab = "vault"; if (!INTEGRATION.on) { this.activeLeagueId = null; this.activeGroupId = null; } this.screen = "vault"; }
      else if (id === "wsettings") { this.navTab = "wsettings"; this.activeLeagueId = null; this.activeGroupId = null; this.screen = "wsettings"; }
    },
    // ─── Account menu routing (header dropdown) ───
    onAccountMenu(id) {
      const { navTab } = this;
      if (id === "account") { this.activeLeagueId = null; this.activeGroupId = null; this.screen = "account"; }
      else if (!INTEGRATION.on && id === "customizer") { window.open("https://customizer.prolook.com/", "_blank", "noopener"); this.toast = "Opening the PROLOOK Customizer in a new tab…"; }
      else if (INTEGRATION.on && id === "customizer-victus") { window.open("https://customizer.victussports.com/", "_blank", "noopener"); this.toast = "Opening the Victus Customizer in a new tab…"; }
      else if (id === "orders") { const origin = navTab === "stores" || navTab === "vault" ? navTab : "overview"; this.ordersOrigin = origin; this.navTab = origin; this.activeLeagueId = null; this.activeGroupId = null; this.screen = "orders"; }
      else if (id === "reports") { const origin = navTab === "stores" || navTab === "vault" ? navTab : "overview"; this.ordersOrigin = origin; this.navTab = origin; this.activeLeagueId = null; this.activeGroupId = null; this.screen = "reports"; }
      else if (id === "vault") { this.navTab = "vault"; this.activeLeagueId = null; this.activeGroupId = null; this.screen = "vault"; }
      else if (id === "wsettings") { this.activeLeagueId = null; this.activeGroupId = null; this.screen = "wsettings"; }
      else if (id === "logout") { this.showLogoutModal = true; }
    },
    goStores() { this.onTabChange("stores"); },
    goLeagues() { this.onTabChange("leagues"); },
    unlockFromGate(msg) {
      this.gatePassed = true; this.navTab = "overview"; this.activeLeagueId = null; this.activeGroupId = null; this.screen = "overview"; this.toast = msg;
    },
    guardNav(fn) {
      // In the create flow, ask before leaving (the confirmation modal is not converted yet).
      if (this.inCreateFlow) { this.pendingNav = fn; this.showCancelModal = true; }
      else { fn(); }
    },
  },
};
</script>
