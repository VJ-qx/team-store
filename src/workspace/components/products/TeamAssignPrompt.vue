<!-- Converted from workspace-app.jsx: TeamAssignPrompt — required team assignment (League stores). Shown when
     Team Required / Team Supplied is set with no Team assigned: the setting can't save until ≥1 Team is
     chosen. Offers inline Team creation when the league has no Teams yet, so the rep isn't dead-ended. -->
<template>
  <div v-if="open" @click="onClose" class="wx-team-prompt">
    <div @click="(e) => e.stopPropagation()" class="wx-team-prompt__dialog">
      <div class="wx-team-prompt__head">
        <div class="wx-team-prompt__title">Assign to Teams</div>
        <div class="wx-team-prompt__desc">{{ settingLabel }} items must be assigned to at least one Team before the setting can save.</div>
      </div>
      <div class="wx-team-prompt__body">
        <div v-if="hasTeams()" class="wx-team-prompt__list"><ScopedTeamRows v-if="scoped()" :teams="scoped()" :value="ids" :onChange="setIds" /><RosterTreePanel v-else :value="ids" :onChange="setIds" accent="#e1251b" /></div>
        <div v-else class="wx-team-prompt__empty">This store has no Teams yet — create one below to continue.</div>
        <div v-if="creating" class="wx-team-prompt__create">
          <input v-autofocus :value="newName" v-controlled="newName" @input="(e) => newName = e.target.value" @keydown="(e) => { if (e.key === 'Enter') createTeam(); }" placeholder="Team name" class="wx-team-prompt__input" />
          <span class="wx-team-prompt__code-note">Team code auto-generates</span>
          <button type="button" @click="createTeam" :disabled="!newName.trim()" :class="`wx-team-prompt__create-btn${(newName.trim()) ? ' wx-team-prompt__create-btn--ready' : ''}`">Create Team</button>
        </div>
        <button v-else type="button" @click="creating = true" class="wx-team-prompt__new-team">+ New Team</button>
        <div class="wx-team-prompt__manage">Manage Teams, codes and rosters in <span class="wx-team-prompt__manage-link">My Team(s)</span>.</div>
      </div>
      <div class="wx-team-prompt__actions">
        <button type="button" @click="onClose" class="wx-team-prompt__cancel">Cancel</button>
        <button type="button" @click="ids.length && onConfirm(ids)" :disabled="!ids.length" :class="`wx-team-prompt__save${ids.length ? ' wx-team-prompt__save--ready' : ''}`">Assign &amp; Save</button>
      </div>
    </div>
  </div>
</template>

<script>
import { workspaceGlobals } from '../../data/catalog.js';
import { STANDALONE_ROSTER_SEED } from '../../data/rosters.js';
import { assignAllRosterIds, storeScopedTeams } from '../../lib/rosters.js';
import RosterTreePanel from './RosterTreePanel.vue';
import ScopedTeamRows from './ScopedTeamRows.vue';

export default {
  name: 'TeamAssignPrompt',
  components: { RosterTreePanel, ScopedTeamRows },
  props: {
    open: { type: Boolean, default: undefined },
    initial: { type: Array, default: () => [] },
    settingLabel: { type: String, default: "Required" },
    store: { type: Object, default: undefined },
    onClose: { type: Function, default: undefined },
    onConfirm: { type: Function, default: undefined },
  },
  data() {
    return { ids: this.initial, creating: false, newName: "" };
  },
  watch: {
    // React: useEffect on [open] — opening resets the selection and the new-team field.
    open() { this.resetOnOpen(); },
  },
  mounted() {
    this.resetOnOpen();
  },
  methods: {
    // Read while open, on every render (as in the prototype: the store's teams grow when one is created).
    scoped() { return storeScopedTeams(this.store); },
    hasTeams() { const scoped = this.scoped(); return scoped ? scoped.length > 0 : assignAllRosterIds().length > 0; },
    resetOnOpen() { if (this.open) { this.ids = this.initial || []; this.creating = false; this.newName = ""; } },
    setIds(v) { this.ids = typeof v === "function" ? v(this.ids) : v; },
    teamCode(name) { return ((name || "TEAM").replace(/[^A-Za-z]/g, "").slice(0, 4).toUpperCase() || "TEAM") + "-" + String(Math.floor(1000 + Math.random() * 9000)); },
    createTeam() {
      const name = this.newName.trim();
      if (!name) return;
      const id = "tm-new-" + Date.now();
      const rec = { id, name, players: 0, code: this.teamCode(name) };
      const scoped = this.scoped();
      const { store } = this;
      if (scoped) workspaceGlobals.__storeTeams[store.id] = [...(workspaceGlobals.__storeTeams[store.id] || []), rec];
      STANDALONE_ROSTER_SEED.push(rec);
      this.setIds((cur) => [...cur, id]);
      this.newName = ""; this.creating = false;
    },
  },
};
</script>
