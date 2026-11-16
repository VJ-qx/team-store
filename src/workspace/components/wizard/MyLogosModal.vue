<!-- Converted from workspace-app.jsx: MyLogosModal — the rep's saved-logo library (the Team Logo box opens
     it): filter, search, favorite, upload, or pick a logo. It stays mounted while closed, so its logos,
     search and filter persist, as in the prototype. While open, Escape closes it and the page behind
     doesn't scroll. -->
<template>
  <div v-if="open" @click="onClose" class="wx-my-logos">
    <div @click="(e) => e.stopPropagation()" class="wx-my-logos__dialog">
      <div class="wx-my-logos__header">
        <div class="wx-my-logos__brand">
          <img src="assets/prolook-logo.png" alt="PROLOOK" class="wx-my-logos__brand-logo" />
          <div class="wx-my-logos__brand-text">
            <div class="wx-my-logos__brand-name">PROLOOK</div>
            <div class="wx-my-logos__brand-sub">Design Studio</div>
          </div>
        </div>
        <div class="wx-my-logos__title">MY LOGOS</div>
        <button @click="onClose" title="Close" class="wx-my-logos__close" @mouseenter="(e) => { e.currentTarget.style.background = '#f1f1f3'; }" @mouseleave="(e) => { e.currentTarget.style.background = 'transparent'; }">
          <IconX :size="22" />
        </button>
      </div>
      <div class="wx-my-logos__body">
        <aside class="wx-my-logos__sidebar">
          <div class="wx-my-logos__panel">
            <div class="wx-my-logos__panel-head">
              <span class="wx-my-logos__panel-title">MY LOGOS</span>
              <IconChevron :size="18" :style="{ color: '#6b6b72' }" />
            </div>
            <div class="wx-my-logos__search">
              <input :value="search" @input="(e) => setSearch(e.target.value)" placeholder="SEARCH BY KEYWORD" class="wx-my-logos__search-input" />
              <IconSearch :size="18" :style="{ position: 'absolute', right: '12px', top: '12px', color: '#9a9aa1' }" />
            </div>
            <div class="wx-my-logos__filters">
              <label v-for="f in FILTERS" :key="f.id" class="wx-my-logos__filter">
                <span :class="`wx-my-logos__filter-box${(filter === f.id) ? ' wx-my-logos__filter-box--on' : ''}`">
                  <IconCheck v-if="filter === f.id" :size="13" :style="{ color: '#fff', strokeWidth: 3 }" />
                </span>
                <input type="checkbox" :checked="filter === f.id" @change="(e) => onFilterChange(e, f.id)" class="wx-my-logos__filter-input" />
                <span class="wx-my-logos__filter-label">{{ f.label }}</span>
              </label>
            </div>
          </div>
        </aside>
        <div class="wx-my-logos__main">
          <input ref="file" type="file" accept="image/png,image/jpeg,image/svg+xml,application/pdf,.ai,.eps" @change="(e) => handleFile(e.target.files[0])" class="wx-my-logos__file-input" />
          <div class="wx-my-logos__grid">
            <div>
              <button @click="() => $refs.file?.click()" class="wx-my-logos__add" @mouseenter="(e) => { e.currentTarget.style.borderColor = '#0e0e10'; e.currentTarget.style.background = '#fafafb'; }" @mouseleave="(e) => { e.currentTarget.style.borderColor = '#d4d4d8'; e.currentTarget.style.background = '#fff'; }">
                <IconPlus :size="40" :style="{ color: '#0e0e10', strokeWidth: 1.4 }" />
                <span class="wx-my-logos__add-label">ADD LOGO</span>
              </button>
              <div class="wx-my-logos__types">
                <span class="wx-my-logos__types-pill"><span class="wx-my-logos__types-icon">i</span>Supported File types</span>
              </div>
            </div>
            <div v-for="l in visible" :key="l.id">
              <button @click="() => onSelect({ name: l.name, url: l.url || null, mono: l.mono, color: l.color })" class="wx-my-logos__logo" @mouseenter="(e) => { e.currentTarget.style.boxShadow = '0 8px 22px rgba(20,20,30,.10)'; e.currentTarget.style.borderColor = '#d4d4d8'; }" @mouseleave="(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#ececf0'; }">
                <LogoArt :logo="l" />
                <span @click="(e) => { e.stopPropagation(); toggleFav(l.id); }" title="Favorite" class="wx-my-logos__favorite">
                  <HeartIcon :filled="l.favorite" />
                </span>
              </button>
              <div class="wx-my-logos__logo-name">{{ l.name }}</div>
            </div>
          </div>
          <div v-if="visible.length === 0" class="wx-my-logos__empty">No logos match your search</div>
          <div v-else class="wx-my-logos__end">All logos are loaded</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { SAVED_LOGOS_SEED } from '../../data/wizard.js';
import { IconCheck, IconChevron, IconPlus, IconSearch, IconX } from '../icons.js';
import HeartIcon from './HeartIcon.vue';
import LogoArt from './LogoArt.vue';

const FILTERS = [
  { id: "all", label: "All" },
  { id: "favorites", label: "Favorites" },
  { id: "recent", label: "Most Recent" }];

export default {
  name: 'MyLogosModal',
  components: { HeartIcon, IconCheck, IconChevron, IconPlus, IconSearch, IconX, LogoArt },
  props: {
    open: { type: Boolean, default: undefined },
    onClose: { type: Function, default: undefined },
    onSelect: { type: Function, default: undefined },
  },
  data() {
    return { logos: SAVED_LOGOS_SEED, search: "", filter: "all", FILTERS };
  },
  computed: {
    visible() {
      const q = this.search.trim().toLowerCase();
      const { filter } = this;
      return this.logos.filter((l) => {
        if (q && !l.name.toLowerCase().includes(q)) return false;
        if (filter === "favorites") return l.favorite;
        if (filter === "recent") return l.recent;
        return true;
      });
    },
  },
  watch: {
    // React: useEffect on [open, onClose] — while open, Escape closes and the body doesn't scroll.
    open() { this.unlisten(); if (this.open) this.listen(); },
  },
  mounted() {
    if (this.open) this.listen();
  },
  beforeUnmount() {
    this.unlisten();
  },
  methods: {
    listen() {
      this.keyHandler = (e) => { if (e.key === "Escape") this.onClose(); };
      window.addEventListener("keydown", this.keyHandler);
      document.body.style.overflow = "hidden";
    },
    unlisten() {
      if (!this.keyHandler) return;
      window.removeEventListener("keydown", this.keyHandler);
      this.keyHandler = null;
      document.body.style.overflow = "";
    },
    setSearch(v) { this.search = v; },
    setFilter(v) { this.filter = v; },
    // The hidden checkbox is controlled in the prototype: after a change it shows the state again.
    onFilterChange(e, id) { this.setFilter(id); e.target.checked = this.filter === id; },
    setLogos(v) { this.logos = typeof v === "function" ? v(this.logos) : v; },
    handleFile(file) {
      if (!file) return;
      const url = URL.createObjectURL(file);
      const next = { id: "up-" + Date.now(), name: file.name.replace(/\.[^.]+$/, ""), url, favorite: false, recent: true };
      this.setLogos((l) => [next, ...l]);
      this.onSelect({ name: next.name, url });
    },
    toggleFav(id) { this.setLogos((l) => l.map((x) => x.id === id ? { ...x, favorite: !x.favorite } : x)); },
  },
};
</script>
