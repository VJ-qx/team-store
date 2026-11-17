<!-- Converted from workspace-app.jsx: RosterTreePanel — the League's child Teams as one checkable list (the
     multi-select's popover); with minOne, the last ticked team can't be unticked.
     Prototype bug, kept: the prototype defines its checkbox (Box) inside RosterTreePanel, so React mounts the
     boxes afresh on every render (they don't animate between states). Here each box gets a new key on every
     update, which does the same. -->
<template>
  <div class="wx-roster-tree__list">
    <button v-for="r in flatTeams()" :key="r.id" type="button" :disabled="lockLast(r)" :title="lockLast(r) ? 'Team Required / Team Supplied items must stay assigned to at least one Team' : undefined" @click="toggle(r.id)" :class="`wx-roster-tree__row${lockLast(r) ? ' wx-roster-tree__row--locked' : ''}`" v-patch-style="{ background: 'transparent' }" @mouseenter="(e) => e.currentTarget.style.background = '#fafafb'" @mouseleave="(e) => e.currentTarget.style.background = 'transparent'">
      <span :key="'box-' + generation" class="wx-roster-tree__box" :style="boxStyle(sel.has(r.id), boxMixed, r.color)">
        <IconCheck v-if="sel.has(r.id)" :size="12" :style="{ color: '#fff', strokeWidth: 3.2 }" />
        <span v-if="!sel.has(r.id) && boxMixed" class="wx-roster-tree__box-mark" :style="{ background: r.color || accent }" />
      </span>
      <span class="wx-roster-tree__avatar" :style="{ background: r.color }">{{ rInitials(r.name) }}</span>
      <span :class="`wx-roster-tree__name${sel.has(r.id) ? ' wx-roster-tree__name--on' : ''}`">{{ r.name }}</span>
      <span class="wx-roster-tree__group">{{ r.group }}</span>
    </button>
    <div v-if="flatTeams().length === 0" class="wx-roster-tree__empty">No Teams yet.</div>
  </div>
</template>

<script>
import { ROSTER_GROUP_SEED, STANDALONE_ROSTER_SEED } from '../../data/rosters.js';
import { rInitials } from '../../lib/rosters.js';
import { hexA } from '../../lib/wizard.js';
import { IconCheck } from '../icons.js';

export default {
  name: 'RosterTreePanel',
  components: { IconCheck },
  props: {
    value: { type: Array, default: undefined },
    onChange: { type: Function, default: undefined },
    accent: { type: String, default: undefined },
    minOne: { type: Boolean, default: false },
  },
  data() {
    // The prototype's Box takes a "mixed" state that RosterTreePanel never passes.
    return { boxMixed: undefined };
  },
  computed: {
    sel() { return new Set(this.value || []); },
  },
  created() {
    // Not reactive: read by the next render only.
    this.generation = 0;
  },
  beforeUpdate() {
    this.generation += 1;
  },
  methods: {
    rInitials,
    // Flattened parent → Team structure (no roster-group tier) — the multi-select
    // lists the League's child Teams only. Read on every render, as in the prototype (the lists grow when a
    // team is created).
    flatTeams() {
      const flatTeams = [];
      ROSTER_GROUP_SEED.forEach((g) => g.rosters.forEach((r) => flatTeams.push({ ...r, group: g.name, color: g.color })));
      STANDALONE_ROSTER_SEED.forEach((r) => flatTeams.push({ ...r, group: "Standalone", color: "#6b6b72" }));
      return flatTeams;
    },
    // The prototype's Box({ on, mixed, color }).
    boxStyle(on, mixed, color) {
      const { accent } = this;
      return { border: `1.6px solid ${on || mixed ? (color || accent) : "#c7c7cd"}`, background: on ? (color || accent) : mixed ? hexA(color || accent, 0.16) : "#fff" };
    },
    lockLast(r) { return this.minOne && this.sel.has(r.id) && this.sel.size === 1; },
    toggle(id) {
      const { sel } = this;
      if (this.minOne && sel.has(id) && sel.size === 1) return; // TR/TS items keep ≥1 Team
      const n = new Set(sel); n.has(id) ? n.delete(id) : n.add(id); this.onChange([...n]);
    },
  },
};
</script>
