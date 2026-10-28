<!-- Converted from workspace-app.jsx: TopSortHead — a sortable column heading in Top Performing Stores. -->
<template>
  <button @click="() => onSort(sortKey)" :title="active ? `Sorted ${sort.dir === 'desc' ? 'descending' : 'ascending'}` : 'Sort by ' + label" :style="{ display: 'inline-flex', alignItems: 'center', gap: '5px', justifyContent: align === 'right' ? 'flex-end' : 'flex-start', paddingRight: px(pad || 0), background: 'transparent', border: '0', cursor: 'pointer', padding: `0 ${pad || 0}px 0 0`, font: 'inherit', fontSize: '11px', fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', color: active ? OV_INK : OV_MUTED, whiteSpace: 'nowrap', minWidth: '0' }">
    <span :style="{ overflow: 'hidden', textOverflow: 'ellipsis' }">{{ label }}</span>
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" :style="{ flexShrink: 0, opacity: active ? 1 : 0.45 }">
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
import { OV_INK, OV_MUTED } from './overview.js';
import { px } from '../../../workspace/style.js';

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
  data() {
    return { OV_INK, OV_MUTED };
  },
  computed: {
    active() { return this.sort.key === this.sortKey; },
  },
  methods: { px },
};
</script>
