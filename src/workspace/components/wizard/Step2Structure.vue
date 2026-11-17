<!-- Converted from workspace-app.jsx: Step2Structure — the Add Store wizard's Step 2 for a League store,
     Divisions & Teams. It reuses the My Team(s) editor (TeamCanvasView) in wizard context: no branding, no
     team codes, no rosters — structure only, and always skippable. -->
<template>
  <div>
    <StepHeader :num="String(stepNum || 2)" :accent="accent" title="Divisions &amp; Teams" desc="Name your league's divisions and teams before adding products. This whole step is optional — skip it and build the structure anytime from the My Team(s) tab. Rosters aren't entered here; they fill in later or from orders." />
    <TeamCanvasView wizard :groups="org.groups" :loose="org.loose" :org="org" :setOrg="setOrg" :store="{ storeType: 'league', storeTitle: data.storeTitle }" :managerGated="false" :stats="{ totalGroups: org.groups.length, totalRosters: totalTeams, totalPlayers: 0 }" :onOpenRoster="() => {}" :setToast="setToast" />
    <Toast :message="toast" :onDone="() => setToast('')" />
  </div>
</template>

<script>
import Toast from '../common/Toast.vue';
import TeamCanvasView from '../teams/TeamCanvasView.vue';
import StepHeader from './StepHeader.vue';

export default {
  name: 'Step2Structure',
  components: { StepHeader, TeamCanvasView, Toast },
  props: {
    data: { type: Object, default: undefined },
    setStructure: { type: Function, default: undefined },
    accent: { type: String, default: undefined },
    stepNum: { type: Number, default: undefined },
  },
  data() {
    return { toast: "" };
  },
  computed: {
    s() { return this.data.leagueStructure || { groups: [], loose: [] }; },
    org() { const { s } = this; return { groups: s.groups || [], loose: s.loose || [], managers: {}, modes: {}, bank: {} }; },
    totalTeams() { const { org } = this; return org.groups.reduce((n, g) => n + (g.rosters || []).length, 0) + org.loose.length; },
  },
  methods: {
    setToast(v) { this.toast = v; },
    setOrg(fn) {
      this.setStructure((cur) => {
        const prev = { groups: cur.groups || [], loose: cur.loose || [], managers: {}, modes: {}, bank: {} };
        const next = typeof fn === "function" ? fn(prev) : fn;
        return { groups: next.groups || [], loose: next.loose || [] };
      });
    },
  },
};
</script>
