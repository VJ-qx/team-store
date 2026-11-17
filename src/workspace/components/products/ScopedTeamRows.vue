<!-- Converted from workspace-app.jsx: ScopedTeamRows — the teams of one store as checkable rows; with minOne,
     the last ticked team can't be unticked. -->
<template>
  <div v-if="!teams.length" class="wx-scoped-teams__empty">No Teams in this store yet.</div>
  <div v-else>
    <button v-for="t in teams" :key="t.id" type="button" :disabled="lockLast(t)" :title="lockLast(t) ? 'Team Required / Team Supplied items must stay assigned to at least one Team' : undefined" @click="onChange(value.includes(t.id) ? value.filter((x) => x !== t.id) : [...value, t.id])" :class="`wx-scoped-teams__row${value.includes(t.id) ? ' wx-scoped-teams__row--on' : ''}${lockLast(t) ? ' wx-scoped-teams__row--locked' : ''}`">
      <span :class="`wx-scoped-teams__check${value.includes(t.id) ? ' wx-scoped-teams__check--on' : ''}`">{{ value.includes(t.id) ? "✓" : "" }}</span>
      <span class="wx-scoped-teams__name">{{ t.name }}</span>
      <span class="wx-scoped-teams__code">{{ t.code }}</span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'ScopedTeamRows',
  props: {
    teams: { type: Array, default: undefined },
    value: { type: Array, default: () => [] },
    onChange: { type: Function, default: undefined },
    minOne: { type: Boolean, default: false },
  },
  methods: {
    lockLast(t) { return this.minOne && this.value.includes(t.id) && this.value.length === 1; },
  },
};
</script>
