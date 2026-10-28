<!-- Converted from workspace-app.jsx: StoreCard — a store tile (status tag, type, logo, Manage Store),
     with an actions menu; "condensed" is the smaller tile on the Overview's Frequently Visited shelf.
     The contextIcon slot takes the small icon in front of the condensed tile's context line. -->
<template>
  <div v-if="condensed" @click="onManage" :title="'Open ' + (store.storeTitle || store.teamName || 'store')" v-patch-style="{ background: '#fff', border: '1px solid #ececf0', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 1px 2px rgba(20,20,30,.03)', display: 'flex', flexDirection: 'column', height: '100%', cursor: 'pointer', transition: 'box-shadow .15s ease, border-color .15s ease' }" @mouseenter="(e) => { e.currentTarget.style.boxShadow = '0 8px 22px rgba(20,20,30,.09)'; e.currentTarget.style.borderColor = '#d4d4d8'; }" @mouseleave="(e) => { e.currentTarget.style.boxShadow = '0 1px 2px rgba(20,20,30,.03)'; e.currentTarget.style.borderColor = '#ececf0'; }">
    <div :style="{ position: 'relative', background: '#fafafb', padding: '12px', minHeight: '78px', display: 'flex', alignItems: 'center', justifyContent: 'center' }">
      <div :style="{ position: 'absolute', top: '9px', left: '9px', background: tagBg, color: tagColor, padding: '3px 8px', borderRadius: '999px', fontSize: '10px', fontWeight: 700 }">{{ tagLabel }}</div>
      <img v-if="store.teamLogo?.url" :src="store.teamLogo.url" alt="" :style="{ maxWidth: '64px', maxHeight: '54px', objectFit: 'contain' }" />
      <div v-else :style="{ width: '42px', height: '42px', borderRadius: '50%', background: store.teamLogo?.color || store.teamColors?.[0] || '#1d3a8a', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '13.5px', fontFamily: 'Archivo, sans-serif', border: (store.teamColors?.[0] || '').toLowerCase() === '#ffffff' ? '1px solid #d4d4d8' : 'none' }">{{ store.teamLogo?.mono || (store.teamName || store.storeTitle || 'T').slice(0, 2).toUpperCase() }}</div>
    </div>
    <div :style="{ padding: '10px 12px 9px', textAlign: 'center', flex: 1, minWidth: '0' }">
      <div :style="{ fontSize: '13px', fontWeight: 800, color: '#0e0e10', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }">{{ store.storeTitle || store.teamName || 'Team Store' }}</div>
      <div :style="{ fontSize: '11px', color: '#9a9aa1', marginTop: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }">{{ typeLabel }} · {{ store.sport || 'Sport' }}</div>
      <div v-if="context" :style="{ marginTop: '7px', display: 'flex', justifyContent: 'center' }">
        <span :style="{ display: 'inline-flex', alignItems: 'center', gap: '5px', maxWidth: '100%', fontSize: '10.5px', fontWeight: 600, color: '#6b6b72', background: '#f5f5f7', borderRadius: '999px', padding: '3px 9px', whiteSpace: 'nowrap', overflow: 'hidden' }">
          <slot name="contextIcon" />
          <span :style="{ overflow: 'hidden', textOverflow: 'ellipsis' }">{{ context }}</span>
        </span>
      </div>
    </div>
    <div :style="{ borderTop: '1px solid #ececf0', padding: '9px 10px' }">
      <button @click="(e) => { e.stopPropagation(); onManage && onManage(); }" v-patch-style="{ width: '100%', background: '#fff', border: '1px solid #0e0e10', color: '#0e0e10', padding: '8px 12px', borderRadius: '6px', fontSize: '11.5px', fontWeight: 700, cursor: 'pointer', transition: 'all .12s' }" @mouseenter="(e) => { e.currentTarget.style.background = '#0e0e10'; e.currentTarget.style.color = '#fff'; }" @mouseleave="(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#0e0e10'; }">Manage Store</button>
    </div>
  </div>
  <div v-else v-patch-style="{ background: '#fff', border: '1px solid #ececf0', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 1px 2px rgba(20,20,30,.03)', display: 'flex', flexDirection: 'column', transition: 'box-shadow .15s ease, border-color .15s ease' }" @mouseenter="(e) => { e.currentTarget.style.boxShadow = '0 8px 22px rgba(20,20,30,.09)'; e.currentTarget.style.borderColor = '#d4d4d8'; }" @mouseleave="(e) => { e.currentTarget.style.boxShadow = '0 1px 2px rgba(20,20,30,.03)'; e.currentTarget.style.borderColor = '#ececf0'; }">
    <div :style="{ position: 'relative', background: '#fafafb', padding: '20px', minHeight: '172px', display: 'flex', alignItems: 'center', justifyContent: 'center' }">
      <div :style="{ position: 'absolute', top: '16px', left: '16px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }">
        <div :style="{ background: tagBg, color: tagColor, padding: '4px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '5px' }">
          <svg v-if="archived" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="3" y="4" width="18" height="4" rx="1" />
            <path d="M5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8" />
            <path d="M10 12h4" />
          </svg>{{ tagLabel }}</div>
        <div :style="{ background: isLeague ? '#0e0e10' : '#fff', color: isLeague ? '#fff' : '#0e0e10', border: isLeague ? '1px solid #0e0e10' : '1px solid #d4d4d8', padding: '4px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }">
          <IconLayers v-if="isLeague" :size="12" :style="{ strokeWidth: 2.2 }" />
          <IconUsers v-else :size="12" :style="{ strokeWidth: 2.2 }" />{{ typeLabel }}</div>
      </div>
      <div ref="menu" :style="{ position: 'absolute', top: '12px', right: '12px' }">
        <button @click="() => setMenuOpen((v) => !v)" v-patch-style="{ background: 'transparent', border: '0', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: '8px', borderRadius: '6px' }" title="Store actions" @mouseenter="(e) => (e.currentTarget.style.background = '#ececf0')" @mouseleave="(e) => (e.currentTarget.style.background = 'transparent')">
          <span :style="{ display: 'inline-flex', gap: '4px' }">
            <span :style="{ width: '4px', height: '4px', borderRadius: '50%', background: '#1a1a1d' }" />
            <span :style="{ width: '4px', height: '4px', borderRadius: '50%', background: '#1a1a1d' }" />
            <span :style="{ width: '4px', height: '4px', borderRadius: '50%', background: '#1a1a1d' }" />
          </span>
        </button>
        <div v-if="menuOpen" :style="{ position: 'absolute', top: '36px', right: '0', zIndex: 5, background: '#fff', border: '1px solid #ececf0', borderRadius: '6px', boxShadow: '0 8px 24px rgba(20,20,30,.10)', padding: '4px', minWidth: '140px' }">
          <div v-for="label in menuLabels" :key="label" @click="() => menuClick(label)" v-patch-style="{ padding: '8px 12px', fontSize: '13px', cursor: 'pointer', borderRadius: '4px' }" @mouseenter="(e) => (e.currentTarget.style.background = '#fafafb')" @mouseleave="(e) => (e.currentTarget.style.background = 'transparent')">{{ label }}</div>
        </div>
      </div>
      <img v-if="store.teamLogo?.url" :src="store.teamLogo.url" alt="" :style="{ maxWidth: '120px', maxHeight: '104px', objectFit: 'contain', filter: archived ? 'grayscale(1)' : 'none', opacity: archived ? 0.5 : 1 }" />
      <div v-else :style="{ width: '92px', height: '92px', borderRadius: '50%', background: store.teamLogo?.color || store.teamColors?.[0] || '#1d3a8a', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '28px', fontFamily: 'Archivo, sans-serif', border: (store.teamColors?.[0] || '').toLowerCase() === '#ffffff' ? '1px solid #d4d4d8' : 'none', filter: archived ? 'grayscale(1)' : 'none', opacity: archived ? 0.5 : 1 }">{{ store.teamLogo?.mono || (store.teamName || store.storeTitle || 'T').slice(0, 2).toUpperCase() }}</div>
    </div>
    <div :style="{ padding: '16px 16px 16px', textAlign: 'center', flex: 1 }">
      <div :style="{ fontSize: '15px', fontWeight: 800, marginBottom: '4px', color: '#0e0e10' }">{{ store.storeTitle || store.teamName || 'Team Store' }}</div>
      <div :style="{ fontSize: '12.5px', color: '#9a9aa1', marginBottom: '4px' }">{{ store.sport || 'Sport' }}</div>
      <div :style="{ fontSize: '12.5px', color: '#6b6b72' }">Created by {{ store.createdByName || store.managerName || store.contactName || '—' }}</div>
    </div>
    <div :style="{ borderTop: '1px solid #ececf0', padding: '16px' }">
      <button @click="onManage" v-patch-style="{ width: '100%', background: '#fff', border: '1px solid #0e0e10', color: '#0e0e10', padding: '12px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', transition: 'all .12s' }" @mouseenter="(e) => { e.currentTarget.style.background = '#0e0e10'; e.currentTarget.style.color = '#fff'; }" @mouseleave="(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#0e0e10'; }">Manage Store</button>
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
