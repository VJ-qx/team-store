<!-- Converted from workspace-app.jsx: TeamDatabaseModal — "Connect to Team": search the team database by
     organization name and ZIP, and select a team to bring in its logo, colors and sports. While open,
     Escape closes it and the page behind doesn't scroll. -->
<template>
  <div v-if="open" @click="onClose" class="wx-team-db">
    <div @click="(e) => e.stopPropagation()" class="wx-team-db__dialog">
      <div class="wx-team-db__search-bar">
        <div class="wx-team-db__heading">
          <span class="wx-team-db__title">Team Database</span>
          <span class="wx-team-db__count">{{ rows.length.toLocaleString() }} organizations</span>
        </div>
        <input :value="name" @input="(e) => setName(e.target.value)" @keydown="(e) => e.key === 'Enter' && runSearch()" placeholder="Organization name" class="wx-team-db__search-name" />
        <input :value="zip" @input="(e) => setZip(e.target.value)" @keydown="(e) => e.key === 'Enter' && runSearch()" placeholder="ZIP code" class="wx-team-db__search-zip" />
        <button @click="runSearch" class="wx-team-db__search-btn" :style="{ background: accent }"><IconSearch :size="15" /> Search</button>
        <button @click="onClear" :disabled="onClearTeam ? !hasTeam : false" :title="onClearTeam ? (hasTeam ? 'Clear the connected team — removes its logo, colors, and sports' : 'No team selected to clear') : undefined" :class="`wx-team-db__clear${(onClearTeam && !hasTeam) ? ' wx-team-db__clear--disabled' : ''}`">Clear</button>
        <button @click="onClose" title="Close" class="wx-team-db__close" @mouseenter="(e) => { e.currentTarget.style.background = '#f1f1f3'; }" @mouseleave="(e) => { e.currentTarget.style.background = 'transparent'; }">
          <IconX :size="20" />
        </button>
      </div>
      <div class="wx-team-db__chips">
        <span class="wx-team-db__chip-wip">WIP Schools: 16,359</span>
        <span class="wx-team-db__chip-done">Completed Schools: 835</span>
        <span class="wx-team-db__total">Total Vectored Logos: 6,016 / 19,843</span>
      </div>
      <div class="wx-team-db__rows">
        <div v-for="t in rows" :key="t.id" class="wx-team-db__row">
          <div class="wx-team-db__logo" :style="{ background: t.logoColor }">{{ t.mono }}</div>
          <div class="wx-team-db__info">
            <div class="wx-team-db__name">{{ t.name }}</div>
            <div class="wx-team-db__address">{{ t.address }}</div>
            <div class="wx-team-db__sports">{{ t.sports.join(" · ") }}</div>
          </div>
          <div class="wx-team-db__metrics">
            <TeamMetricBar label="Mascot Traced" :value="t.mascot" :max="12" :color="accent" />
            <TeamMetricBar label="Master Reference" :value="t.master" :max="5" color="#0e0e10" />
          </div>
          <button @click="() => onSelect(t)" class="wx-team-db__select" @mouseenter="(e) => e.currentTarget.style.background = accent" @mouseleave="(e) => e.currentTarget.style.background = '#0e0e10'">Select <IconChevronRight :size="14" :style="{ strokeWidth: 2.6 }" /></button>
        </div>
        <div v-if="rows.length === 0" class="wx-team-db__empty">No organizations match your search</div>
      </div>
      <div class="wx-team-db__footer">
        <span class="wx-team-db__showing">Showing {{ rows.length }} of 17,194</span>
        <div class="wx-team-db__pages">
          <span v-for="(p, i) in PAGES" :key="i" :class="`wx-team-db__page${(p === '1') ? ' wx-team-db__page--current' : ''}${(p === '…') ? ' wx-team-db__page--gap' : ''}`" :style="{ background: p === '1' ? accent : 'transparent' }">{{ p }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { TEAM_DATABASE } from '../../data/wizard.js';
import { IconChevronRight, IconSearch, IconX } from '../icons.js';
import TeamMetricBar from './TeamMetricBar.vue';

const PAGES = ["1", "2", "3", "4", "5", "…", "860"];

export default {
  name: 'TeamDatabaseModal',
  components: { IconChevronRight, IconSearch, IconX, TeamMetricBar },
  props: {
    open: { type: Boolean, default: undefined },
    onClose: { type: Function, default: undefined },
    onSelect: { type: Function, default: undefined },
    accent: { type: String, default: undefined },
    hasTeam: { type: Boolean, default: undefined },
    onClearTeam: { type: Function, default: undefined },
  },
  data() {
    return { name: "", zip: "", q: { name: "", zip: "" }, PAGES };
  },
  computed: {
    rows() {
      const { q } = this;
      return TEAM_DATABASE.filter((t) =>
        (!q.name || t.name.toLowerCase().includes(q.name.toLowerCase())) &&
        (!q.zip || t.address.includes(q.zip))
      );
    },
  },
  watch: {
    // React: useEffect on [open] (it also runs once after mount: see mounted).
    open() { this.reset(); this.unlisten(); if (this.open) this.listen(); },
  },
  mounted() {
    this.reset();
    if (this.open) this.listen();
  },
  beforeUnmount() {
    this.unlisten();
  },
  methods: {
    reset() { if (this.open) { this.setName(""); this.setZip(""); this.setQ({ name: "", zip: "" }); } },
    // React: useEffect on [open, onClose] — while open, Escape closes and the body doesn't scroll.
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
    setName(v) { this.name = v; },
    setZip(v) { this.zip = v; },
    setQ(v) { this.q = v; },
    runSearch() { this.setQ({ name: this.name, zip: this.zip }); },
    clearSearch() { this.setName(""); this.setZip(""); this.setQ({ name: "", zip: "" }); },
    onClear() { this.clearSearch(); if (this.onClearTeam && this.hasTeam) this.onClearTeam(); },
  },
};
</script>
