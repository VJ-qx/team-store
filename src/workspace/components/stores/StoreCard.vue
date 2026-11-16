<!-- Converted from workspace-app.jsx: StoreCard — a store tile (status tag, type, logo, Manage Store),
     with an actions menu (Module 3, FR-3.8 to FR-3.11); "condensed" is the smaller tile on the Overview's
     Frequently Visited shelf. The contextIcon slot takes the small icon in front of the condensed tile's
     context line. -->
<template>
  <div v-if="condensed" @click="onManage" :title="'Open ' + (store.storeTitle || store.teamName || 'store')" class="wx-store-mini" @mouseenter="(e) => { e.currentTarget.style.boxShadow = '0 8px 22px rgba(20,20,30,.09)'; e.currentTarget.style.borderColor = '#d4d4d8'; }" @mouseleave="(e) => { e.currentTarget.style.boxShadow = '0 1px 2px rgba(20,20,30,.03)'; e.currentTarget.style.borderColor = '#ececf0'; }">
    <div class="wx-store-mini__media">
      <div class="wx-store-mini__tag" :style="{ background: tagBg, color: tagColor }">{{ tagLabel }}</div>
      <img v-if="store.teamLogo?.url" :src="store.teamLogo.url" alt="" class="wx-store-mini__logo" />
      <div v-else class="wx-store-mini__mono" :style="{ background: store.teamLogo?.color || store.teamColors?.[0] || '#1d3a8a', border: (store.teamColors?.[0] || '').toLowerCase() === '#ffffff' ? '1px solid #d4d4d8' : 'none' }">{{ store.teamLogo?.mono || (store.teamName || store.storeTitle || 'T').slice(0, 2).toUpperCase() }}</div>
    </div>
    <div class="wx-store-mini__body">
      <div class="wx-store-mini__name">{{ store.storeTitle || store.teamName || 'Team Store' }}</div>
      <div class="wx-store-mini__type">{{ typeLabel }} · {{ store.sport || 'Sport' }}</div>
      <div v-if="context" class="wx-store-mini__context">
        <span class="wx-store-mini__context-pill">
          <slot name="contextIcon" />
          <span class="wx-store-mini__context-text">{{ context }}</span>
        </span>
      </div>
    </div>
    <div class="wx-store-mini__foot">
      <button @click="(e) => { e.stopPropagation(); onManage && onManage(); }" class="wx-store-mini__manage" @mouseenter="(e) => { e.currentTarget.style.background = '#0e0e10'; e.currentTarget.style.color = '#fff'; }" @mouseleave="(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#0e0e10'; }">Manage Store</button>
    </div>
  </div>
  <div v-else class="wx-store-card" @mouseenter="(e) => { e.currentTarget.style.boxShadow = '0 8px 22px rgba(20,20,30,.09)'; e.currentTarget.style.borderColor = '#d4d4d8'; }" @mouseleave="(e) => { e.currentTarget.style.boxShadow = '0 1px 2px rgba(20,20,30,.03)'; e.currentTarget.style.borderColor = '#ececf0'; }">
    <div class="wx-store-card__media">
      <div class="wx-store-card__tags">
        <div class="wx-store-card__status" :style="{ background: tagBg, color: tagColor }">
          <svg v-if="archived" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="3" y="4" width="18" height="4" rx="1" />
            <path d="M5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8" />
            <path d="M10 12h4" />
          </svg>{{ tagLabel }}</div>
        <div :class="`wx-store-card__type${isLeague ? ' wx-store-card__type--league' : ''}`">
          <IconLayers v-if="isLeague" :size="12" :style="{ strokeWidth: 2.2 }" />
          <IconUsers v-else :size="12" :style="{ strokeWidth: 2.2 }" />{{ typeLabel }}</div>
      </div>
      <div ref="menu" class="wx-store-card__actions">
        <button @click="() => setMenuOpen((v) => !v)" class="wx-store-card__menu-btn" title="Store actions" @mouseenter="(e) => (e.currentTarget.style.background = '#ececf0')" @mouseleave="(e) => (e.currentTarget.style.background = 'transparent')">
          <span class="wx-store-card__dots">
            <span class="wx-store-card__dot" />
            <span class="wx-store-card__dot" />
            <span class="wx-store-card__dot" />
          </span>
        </button>
        <div v-if="menuOpen" class="wx-store-card__menu">
          <div v-for="label in menuLabels" :key="label" @click="() => menuClick(label)" class="wx-store-card__menu-item" @mouseenter="(e) => (e.currentTarget.style.background = '#fafafb')" @mouseleave="(e) => (e.currentTarget.style.background = 'transparent')">{{ label }}</div>
        </div>
      </div>
      <img v-if="store.teamLogo?.url" :src="store.teamLogo.url" alt="" :class="`wx-store-card__logo${archived ? ' wx-store-card__logo--archived' : ''}`" />
      <div v-else :class="`wx-store-card__mono${archived ? ' wx-store-card__mono--archived' : ''}`" :style="{ background: store.teamLogo?.color || store.teamColors?.[0] || '#1d3a8a', border: (store.teamColors?.[0] || '').toLowerCase() === '#ffffff' ? '1px solid #d4d4d8' : 'none' }">{{ store.teamLogo?.mono || (store.teamName || store.storeTitle || 'T').slice(0, 2).toUpperCase() }}</div>
    </div>
    <div class="wx-store-card__body">
      <div class="wx-store-card__name">{{ store.storeTitle || store.teamName || 'Team Store' }}</div>
      <div class="wx-store-card__sport">{{ store.sport || 'Sport' }}</div>
      <div class="wx-store-card__by">Created by {{ store.createdByName || store.managerName || store.contactName || '—' }}</div>
    </div>
    <div class="wx-store-card__foot">
      <button @click="onManage" class="wx-store-card__manage" @mouseenter="(e) => { e.currentTarget.style.background = '#0e0e10'; e.currentTarget.style.color = '#fff'; }" @mouseleave="(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#0e0e10'; }">Manage Store</button>
    </div>
  </div>
</template>

<script>
import { STATE_ABBR } from '../../data/states.js';
import { IconLayers, IconUsers } from '../icons.js';

export default {
  name: 'StoreCard',
  components: { IconLayers, IconUsers },
  props: {
    store: { type: Object, required: true },
    onManage: { type: Function, default: undefined },
    onArchive: { type: Function, default: undefined },
    onCreateTemplate: { type: Function, default: undefined },
    archived: { type: Boolean, default: false },
    onView: { type: Function, default: undefined },
    onUnarchive: { type: Function, default: undefined },
    condensed: { type: Boolean, default: false },
    context: { type: String, default: undefined },
  },
  data() {
    return { menuOpen: false };
  },
  computed: {
    // Computed but not shown, as in the prototype.
    city() { return this.store.shipCity || "Carlsbad"; },
    stateAbbr() { return STATE_ABBR[this.store.shipState] || (this.store.shipState || "CA").slice(0, 2).toUpperCase(); },
    isDraft() { return !this.store.live; },
    isHold() { return (this.store.status || "active") === "hold"; },
    tagBg() { return this.archived ? "#e4e4e7" : this.isDraft ? "#ebebed" : this.isHold ? "#fdeecb" : "#d8f5e3"; },
    tagColor() { return this.archived ? "#52525b" : this.isDraft ? "#6b6b72" : this.isHold ? "#92670b" : "#1f7a44"; },
    tagLabel() { return this.archived ? "Archived" : this.isDraft ? "Draft" : this.isHold ? "On Hold" : "Open"; },
    isLeague() { return this.store.storeType === "league"; },
    typeLabel() { return this.isLeague ? "League Store" : "Team Store"; },
    menuLabels() {
      return this.archived ? ["View", "Unarchive", "Use as Template"] : ["Edit", "Visit Store", "Use as Template", "Archive"];
    },
  },
  mounted() {
    // React: useEffect with [] — any mousedown outside the menu closes it.
    this.onDocMouseDown = (e) => { if (this.$refs.menu && !this.$refs.menu.contains(e.target)) this.setMenuOpen(false); };
    document.addEventListener("mousedown", this.onDocMouseDown);
  },
  beforeUnmount() {
    document.removeEventListener("mousedown", this.onDocMouseDown);
  },
  methods: {
    setMenuOpen(v) {
      this.menuOpen = typeof v === "function" ? v(this.menuOpen) : v;
    },
    menuClick(label) {
      const { onView, onManage, onUnarchive, onCreateTemplate, onArchive, store } = this;
      if (this.archived) {
        if (label === "View") { this.setMenuOpen(false); (onView || onManage) && (onView || onManage)(); }
        else if (label === "Unarchive") { this.setMenuOpen(false); onUnarchive && onUnarchive(); }
        else if (label === "Use as Template") { this.setMenuOpen(false); onCreateTemplate && onCreateTemplate(store); }
        return;
      }
      if (label === "Edit") { this.setMenuOpen(false); onManage && onManage(); }
      else if (label === "Visit Store") { this.setMenuOpen(false); }
      else if (label === "Use as Template") { this.setMenuOpen(false); onCreateTemplate && onCreateTemplate(store); }
      else if (label === "Archive") { this.setMenuOpen(false); onArchive && onArchive(); }
    },
  },
};
</script>
