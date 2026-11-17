<!-- Converted from workspace-app.jsx: RosterAssignField — product-to-roster assignment (League stores): a
     multi-select over the store's teams. Two treatments (variant): "dropdown", a select-style field
     summarizing the selection, or "chips", the selected teams as removable pills. A mousedown outside closes
     the popover. The prototype's shared label and popover elements are written out in each variant. -->
<template>
  <div v-if="variant === 'chips'" ref="root" class="wx-roster-assign__chips-field">
    <div class="wx-roster-assign__chips-head">
      <span class="wx-roster-assign__eyebrow"><IconUsers :size="13" /> Assign to Teams</span>
      <button type="button" @click="open = !open" class="wx-roster-assign__edit" :style="{ color: accent }"><IconPlus :size="13" :style="{ strokeWidth: 2.6 }" /> {{ count ? "Edit" : "Assign teams" }}</button>
    </div>
    <div @click="open = true" :class="`wx-roster-assign__chips${count ? ' wx-roster-assign__chips--filled' : ''}`">
      <span v-if="count === 0" class="wx-roster-assign__chips-empty">No teams assigned — tap to choose which teams wear this.</span>
      <template v-for="id in value.slice(0, 6)" :key="id">
        <span v-if="assignRosterLabel(id)" class="wx-roster-assign__chip"><span class="wx-roster-assign__chip-dot" :style="{ background: assignRosterLabel(id).color }" />{{ assignRosterLabel(id).name }}<span @click="(e) => { e.stopPropagation(); remove(id); }" class="wx-roster-assign__chip-remove"><IconX :size="12" /></span></span>
      </template>
      <span v-if="count > 6" class="wx-roster-assign__chips-more">+{{ count - 6 }} more</span>
    </div>
    <div v-if="open" class="wx-roster-assign__panel" :style="panelStyle">
      <div class="wx-roster-assign__panel-head">
        <span class="wx-roster-assign__panel-count">{{ count }} team{{ count === 1 ? "" : "s" }} selected</span>
        <button type="button" @click="selectAll" class="wx-roster-assign__toggle-all" :style="{ color: accent }">{{ allOnNow() ? "Clear all" : "Select all" }}</button>
      </div>
      <ScopedTeamRows v-if="scoped()" :teams="scoped()" :value="value" :onChange="onChange" :minOne="minOne" /><RosterTreePanel v-else :value="value" :onChange="onChange" :accent="accent" :minOne="minOne" />
      <div class="wx-roster-assign__panel-foot">
        <button type="button" @click="open = false" class="wx-roster-assign__done">Done</button>
      </div>
    </div>
  </div>
  <div v-else ref="root" :class="`wx-roster-assign__dropdown${open ? ' wx-roster-assign__dropdown--open' : ''}`">
    <div class="wx-roster-assign__dropdown-label"><span class="wx-roster-assign__eyebrow"><IconUsers :size="13" /> Assign to Teams</span></div>
    <button type="button" @click="open = !open" class="wx-roster-assign__trigger" :style="{ border: `1.5px solid ${open ? accent : count ? '#c7c7cd' : '#d4d4d8'}`, boxShadow: open ? `0 0 0 3px ${hexA(accent, 0.12)}` : 'none' }">
      <span :class="`wx-roster-assign__summary${count ? ' wx-roster-assign__summary--filled' : ''}`">{{ summary() }}</span>
      <span v-if="count > 0" class="wx-roster-assign__count" :style="{ color: accent, background: hexA(accent, 0.1) }">{{ count }}</span>
      <IconChevron :size="18" :style="{ flexShrink: 0, color: '#6b6b72', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .16s' }" />
    </button>
    <div v-if="open" class="wx-roster-assign__panel" :style="panelStyle">
      <div class="wx-roster-assign__panel-head">
        <span class="wx-roster-assign__panel-count">{{ count }} team{{ count === 1 ? "" : "s" }} selected</span>
        <button type="button" @click="selectAll" class="wx-roster-assign__toggle-all" :style="{ color: accent }">{{ allOnNow() ? "Clear all" : "Select all" }}</button>
      </div>
      <ScopedTeamRows v-if="scoped()" :teams="scoped()" :value="value" :onChange="onChange" :minOne="minOne" /><RosterTreePanel v-else :value="value" :onChange="onChange" :accent="accent" :minOne="minOne" />
      <div class="wx-roster-assign__panel-foot">
        <button type="button" @click="open = false" class="wx-roster-assign__done">Done</button>
      </div>
    </div>
  </div>
</template>

<script>
import { assignAllRosterIds, assignRosterLabel, storeScopedTeams } from '../../lib/rosters.js';
import { hexA } from '../../lib/wizard.js';
import { IconChevron, IconPlus, IconUsers, IconX } from '../icons.js';
import RosterTreePanel from './RosterTreePanel.vue';
import ScopedTeamRows from './ScopedTeamRows.vue';

export default {
  name: 'RosterAssignField',
  components: { IconChevron, IconPlus, IconUsers, IconX, RosterTreePanel, ScopedTeamRows },
  props: {
    variant: { type: String, default: "dropdown" },
    value: { type: Array, default: () => [] },
    onChange: { type: Function, default: undefined },
    accent: { type: String, default: "#e1251b" },
    direction: { type: String, default: "up" },
    minOne: { type: Boolean, default: false },
    store: { type: Object, default: undefined },
  },
  data() {
    return { open: false };
  },
  computed: {
    count() { return this.value.length; },
    panelStyle() {
      return { ...(this.direction === "down" ? { top: "calc(100% + 8px)" } : { bottom: "calc(100% + 8px)" }), left: "0", right: "0", zIndex: 50, background: "#fff", border: "1px solid #e5e5e9", borderRadius: "12px", overflow: "hidden", boxShadow: "0 18px 44px rgba(20,20,30,.2)" };
    },
  },
  watch: {
    // React: useEffect on [open] — while open, a mousedown outside closes it.
    open(open) {
      this.unlisten();
      if (open) this.listen();
    },
  },
  beforeUnmount() {
    this.unlisten();
  },
  methods: {
    hexA,
    assignRosterLabel,
    // Read on every render, as in the prototype.
    scoped() { return storeScopedTeams(this.store); },
    total() { const scoped = this.scoped(); return scoped ? scoped.length : assignAllRosterIds().length; },
    allOnNow() { const total = this.total(); return this.count >= total && total > 0; },
    selectAll() {
      const scoped = this.scoped();
      const { value, minOne } = this;
      this.onChange(this.allOnNow() ? (minOne ? value.slice(0, 1) : []) : (scoped ? scoped.map((t) => t.id) : assignAllRosterIds()));
    },
    // Variant A — dropdown: a select-style field summarizing the selection.
    summary() {
      const scoped = this.scoped();
      const { count, value } = this;
      let summary = "Select teams…";
      if (this.allOnNow()) summary = "All teams";
      else if (count === 1) { const st = scoped && scoped.find((t) => t.id === value[0]); const l = st || assignRosterLabel(value[0]); summary = l ? l.name : "1 team"; }
      else if (count > 1) summary = `${count} teams selected`;
      return summary;
    },
    // Variant B — chips.
    remove(id) { this.onChange(this.value.filter((x) => x !== id)); },
    listen() {
      this.onDocDown = (e) => { if (this.$refs.root && !this.$refs.root.contains(e.target)) this.open = false; };
      document.addEventListener("mousedown", this.onDocDown);
    },
    unlisten() {
      if (this.onDocDown) document.removeEventListener("mousedown", this.onDocDown);
      this.onDocDown = null;
    },
  },
};
</script>
