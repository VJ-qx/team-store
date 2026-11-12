<!-- Converted from workspace-app.jsx: TopSortHead — a sortable column heading in Top Performing Stores. -->
<template>
  <button @click="() => onSort(sortKey)" :title="active ? `Sorted ${sort.dir === 'desc' ? 'descending' : 'ascending'}` : 'Sort by ' + label" :class="`wx-ov-sort${align === 'right' ? ' wx-ov-sort--right' : ''}${active ? ' wx-ov-sort--active' : ''}`" :style="{ padding: `0 ${pad || 0}px 0 0` }">
    <span class="wx-ov-sort__label">{{ label }}</span>
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" :class="`wx-ov-sort__icon${active ? ' wx-ov-sort__icon--active' : ''}`">
      <template v-if="active && sort.dir === 'desc'">
        <path d="M12 5v14" />
        <path d="M6 13l6 6 6-6" />
      </template>
      <template v-else-if="active">
        <path d="M12 19V5" />
        <path d="M6 11l6-6 6 6" />
      </template>
      <template v-else>
        <path d="M8 9l4-4 4 4" />
        <path d="M8 15l4 4 4-4" />
      </template>
    </svg>
  </button>
</template>

<script>
export default {
  name: 'TopSortHead',
  props: {
    label: { type: String, default: undefined },
    sortKey: { type: String, default: undefined },
    sort: { type: Object, required: true },
    onSort: { type: Function, default: undefined },
    align: { type: String, default: undefined },
    pad: { type: Number, default: undefined },
  },
  computed: {
    active() { return this.sort.key === this.sortKey; },
  },
};
</script>
