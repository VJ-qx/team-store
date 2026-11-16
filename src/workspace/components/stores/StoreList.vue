<!-- Converted from workspace-app.jsx / workspace-app-integrated.jsx: StoreList — the Stores page
     (Module 3, BRD M-3.0): the heading, the All / My / Joined Stores tabs, the filter / sort / search
     toolbar, the cards grid with its "No stores…" messages, the zero state ("Zero state usability test"),
     and the league view (breadcrumbs, group cards, League Settings, Add Group), which leagues being out
     of the MVP keeps unreachable. The integrated workspace calls the Status option "Open" and uses a
     smaller league heading. -->
<template>
  <div class="wx-stores">
    <div v-if="activeLeague" class="wx-stores__league-head">
      <div>
        <div class="wx-stores__crumbs">
          <button @click="onBackToLeagues" class="wx-stores__crumb">LEAGUES</button>
          <IconChevronRight :size="14" :style="{ color: '#c9c9cf' }" />
          <template v-if="activeGroup">
            <button @click="onCloseGroup" class="wx-stores__crumb">{{ (activeLeague.name || 'LEAGUE').toUpperCase() }}</button>
            <IconChevronRight :size="14" :style="{ color: '#c9c9cf' }" />
            <span class="wx-stores__crumb-current">{{ activeGroup.name.toUpperCase() }}</span>
          </template>
          <span v-else class="wx-stores__crumb-current">{{ activeLeague.name.toUpperCase() }}</span>
        </div>
        <h1 :class="`wx-stores__league-title${INT ? ' wx-stores__league-title--marucci' : ''}`">{{ activeGroup ? activeGroup.name : activeLeague.name }}</h1>
        <div class="wx-stores__league-meta">
          <span class="wx-stores__meta-item"><IconStore :size="16" /> {{ storeCount }} {{ storeCount === 1 ? 'Store' : 'Stores' }}</span>
          <span class="wx-stores__meta-item"><IconDollar :size="16" :style="{ color: '#1f9d55' }" /><span class="wx-stores__revenue">${{ totalRevenueText }}</span></span>
        </div>
      </div>
      <div class="wx-stores__league-actions">
        <button v-if="!activeGroup" @click="onOpenSettings" class="wx-stores__settings-btn"><IconSettings :size="17" /> League Settings</button>
        <ListToolbar searchPlaceholder="Search Team Stores" :searchValue="search" :onSearch="setSearch" :filter="filterSpec" :sort="sortSpec" />
      </div>
    </div>
    <ListPageHeader v-else title="Stores" :subtitle="subtitle">
      <button @click="onAdd" class="wx-stores__add"><IconPlus :size="16" :style="{ strokeWidth: 2.4 }" /> Add Store</button>
      <ListToolbar searchPlaceholder="Search Team Stores" :searchValue="search" :onSearch="setSearch" :filter="filterSpec" :sort="sortSpec" />
    </ListPageHeader>
    <SegmentedPills v-if="!activeLeague && !zeroTop" :value="ownership" :onChange="setOwnership" :style="{ marginBottom: '24px' }" :items="pillItems" />
    <div v-if="zeroTop" class="wx-stores__zero">
      <div class="wx-stores__zero-icon">
        <svg width="78" height="78" viewBox="0 0 64 64" fill="none" stroke="#a1a1aa" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M8 24 L12 12 H52 L56 24" />
          <path d="M8 24 v28 a2 2 0 0 0 2 2 h44 a2 2 0 0 0 2 -2 V24" />
          <path d="M8 24 h48" />
          <path d="M20 24 v-3 M32 24 v-3 M44 24 v-3" opacity="0.55" />
          <path d="M24 54 V38 a8 8 0 0 1 16 0 V54" />
        </svg>
      </div>
      <h2 class="wx-stores__zero-title">You don&rsquo;t have any Team Stores yet.</h2>
      <p class="wx-stores__zero-text">Create an always-on locker or a temporary pop-up store to start assigning customized gear collections to your teams.</p>
      <button @click="onAdd" class="wx-stores__zero-btn" @mouseenter="(e) => (e.currentTarget.style.background = '#1f1f22')" @mouseleave="(e) => (e.currentTarget.style.background = '#0e0e10')"><IconPlus :size="18" :style="{ strokeWidth: 2.6 }" /> Create Your First Store</button>
    </div>
    <div v-else class="wx-stores__grid">
      <template v-if="activeLeague && !activeGroup">
        <GroupCard v-for="g in groups" :key="g.id" :group="g" :onOpen="() => onOpenGroup(g.id)" />
      </template>
      <StoreCard v-for="s in finalStores" :key="s.id" :store="s" :onManage="() => onManage(s.id)" :onArchive="() => onArchive && onArchive(s.id)" :onCreateTemplate="onCreateTemplate" />
      <div v-if="finalStores.length === 0 && !(activeLeague && !activeGroup && groups.length)" class="wx-stores__none">{{ emptyMessage }}</div>
    </div>
    <div v-if="activeLeague" class="wx-stores__fab">
      <button @click="onAddGroup" class="wx-stores__add-group"><IconGroupAdd :size="17" /> Add Group</button>
    </div>
  </div>
</template>

<script>
import { INTEGRATION } from '../../integration.js';
import { IconChevronRight, IconDollar, IconGroupAdd, IconPlus, IconSettings, IconStore } from '../icons.js';
import ListPageHeader from '../common/ListPageHeader.vue';
import ListToolbar from '../common/ListToolbar.vue';
import SegmentedPills from '../common/SegmentedPills.vue';
import GroupCard from './GroupCard.vue';
import StoreCard from './StoreCard.vue';

const STORE_SORT_OPTIONS = ["Name (A-Z)", "Name (Z-A)", "Revenue (high to low)", "Revenue (low to high)"];
// The Status filter's option for a store that is not on hold: "Open" on the integrated workspace.
const OPEN_LABEL = INTEGRATION.on ? "Open" : "Active";

export default {
  name: 'StoreList',
  components: { GroupCard, IconChevronRight, IconDollar, IconGroupAdd, IconPlus, IconSettings, IconStore, ListPageHeader, ListToolbar, SegmentedPills, StoreCard },
  props: {
    stores: { type: Array, required: true },
    onAdd: { type: Function, default: undefined },
    onAddLeague: { type: Function, default: undefined },
    onAddGroup: { type: Function, default: undefined },
    onManage: { type: Function, default: undefined },
    onArchive: { type: Function, default: undefined },
    onCreateTemplate: { type: Function, default: undefined },
    leagues: { type: Array, default: () => [] },
    activeLeagueId: { default: undefined },
    onSelectLeague: { type: Function, default: undefined },
    activeGroupId: { default: undefined },
    onOpenGroup: { type: Function, default: undefined },
    onCloseGroup: { type: Function, default: undefined },
    onOpenSettings: { type: Function, default: undefined },
    onBackToLeagues: { type: Function, default: undefined },
    zeroState: { type: Boolean, default: false },
  },
  data() {
    return {
      INT: INTEGRATION.on,
      ownership: "all",
      sort: "Name (A-Z)",
      filter: "All",
      search: "",
    };
  },
  computed: {
    // Zero-state usability test: strip the top-level stores landing to a true first-run milestone —
    // no cards, pills, org labels or ownership counts.
    zeroTop() { return this.zeroState && !this.activeLeagueId; },
    activeLeague() { return this.leagues.find((l) => l.id === this.activeLeagueId); },
    groups() { return this.activeLeague?.groups || []; },
    activeGroup() { return this.activeGroupId ? this.groups.find((g) => g.id === this.activeGroupId) : null; },
    leagueStores() { return this.activeLeague ? this.stores.filter((s) => this.activeLeague.storeIds.includes(s.id)) : this.stores; },
    visibleStores() {
      const { activeGroup, activeLeague, leagueStores, groups, ownership, stores } = this;
      if (activeGroup) {
        return leagueStores.filter((s) => activeGroup.storeIds.includes(s.id));
      } else if (activeLeague) {
        const grouped = new Set(groups.flatMap((g) => g.storeIds || []));
        return leagueStores.filter((s) => !grouped.has(s.id));
      }
      return ownership === "mine" ? stores.filter((s) => s.ownership === "mine") :
        ownership === "joined" ? stores.filter((s) => s.ownership === "joined") :
        stores; // "all" — every storefront accessible to the logged-in user
    },
    // Toolbar sort + filter. Options are derived from the stores currently in scope so a choice never
    // points at data that isn't present.
    scopePool() { return this.activeLeague ? this.leagueStores : this.stores; },
    sportsPresent() { return [...new Set(this.scopePool.map((s) => s.sport).filter(Boolean))].sort(); },
    citiesPresent() { return [...new Set(this.scopePool.map((s) => s.shipCity).filter(Boolean))].sort(); },
    hasHold() { return this.scopePool.some((s) => (s.status || "active") === "hold"); },
    storeFilterOptions() {
      return [
        "All",
        { label: "Status", sub: this.hasHold ? [OPEN_LABEL, "On Hold"] : [OPEN_LABEL] },
        ...(this.sportsPresent.length ? [{ label: "Sport", sub: this.sportsPresent }] : []),
        ...(this.citiesPresent.length ? [{ label: "Location", sub: this.citiesPresent }] : []),
      ];
    },
    finalStores() { return this.zeroTop ? [] : this.applySort(this.visibleStores.filter(this.matchesFilter).filter(this.matchesSearch)); },
    filterSpec() { return { value: this.filter, options: this.storeFilterOptions, onChange: this.setFilter, width: 232 }; },
    sortSpec() { return { value: this.sort, options: STORE_SORT_OPTIONS, onChange: this.setSort, width: 224 }; },
    scopeStores() { return this.activeGroup ? this.visibleStores : this.leagueStores; },
    totalRevenue() { return (this.activeLeague ? this.scopeStores : this.finalStores).reduce((sum, s) => sum + (s.revenue || 0), 0); },
    totalRevenueText() { return this.totalRevenue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","); },
    storeCount() { return this.activeLeague ? this.scopeStores.length : this.finalStores.length; },
    subtitle() {
      const inLeague = new Set(this.leagues.flatMap((l) => l.storeIds || []));
      const teamN = this.stores.filter((s) => !inLeague.has(s.id)).length;
      return `${teamN} Team Stores • ${this.stores.length - teamN} League Stores`;
    },
    pillItems() {
      return [
        { id: "all", label: "All Stores", count: this.stores.length },
        { id: "mine", label: "My Stores", count: this.stores.filter((s) => s.ownership === "mine").length },
        { id: "joined", label: "Joined Stores", count: this.stores.filter((s) => s.ownership === "joined").length },
      ];
    },
    emptyMessage() {
      const { filter, ownership } = this;
      return filter !== "All" ? `No stores match “${filter}”.` :
        ownership === "mine" ? "You haven’t created any stores yet." : ownership === "joined" ? "No stores have been shared with you yet." : "No stores here yet.";
    },
  },
  methods: {
    setOwnership(v) { this.ownership = v; },
    setSort(v) { this.sort = v; },
    setFilter(v) { this.filter = v; },
    setSearch(v) { this.search = v; },
    nameOf(s) { return (s.storeTitle || s.teamName || "").toLowerCase(); },
    matchesFilter(s) {
      const { filter, sportsPresent, citiesPresent } = this;
      switch (filter) {
        case "All": return true;
        case OPEN_LABEL: return (s.status || "active") !== "hold";
        case "On Hold": return (s.status || "active") === "hold";
        default:
          if (sportsPresent.includes(filter)) return (s.sport || "") === filter;
          if (citiesPresent.includes(filter)) return (s.shipCity || "") === filter;
          return true;
      }
    },
    applySort(arr) {
      const { sort, nameOf } = this;
      const a = [...arr];
      if (sort === "Name (A-Z)") a.sort((x, y) => nameOf(x).localeCompare(nameOf(y)));
      else if (sort === "Name (Z-A)") a.sort((x, y) => nameOf(y).localeCompare(nameOf(x)));
      else if (sort === "Revenue (high to low)") a.sort((x, y) => (y.revenue || 0) - (x.revenue || 0));
      else if (sort === "Revenue (low to high)") a.sort((x, y) => (x.revenue || 0) - (y.revenue || 0));
      return a;
    },
    matchesSearch(s) {
      const q = this.search.trim().toLowerCase();
      if (!q) return true;
      return [s.storeTitle, s.teamName, s.sport, s.shipCity].some((v) => (v || "").toLowerCase().includes(q));
    },
  },
};
</script>
