<!-- Converted from workspace-app.jsx: OrderingWindowRow — one store's ordering window on the Overview. -->
<template>
  <div :style="{ padding: '20px 0', borderBottom: `1px solid ${OV_LINE}` }">
    <div :style="{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }">
      <span :style="{ width: '32px', height: '32px', borderRadius: '50%', background: color, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '11px', flexShrink: 0 }">{{ mono }}</span>
      <div :style="{ flex: 1, minWidth: '0' }">
        <div :style="{ fontSize: '13.5px', fontWeight: 700, color: OV_INK, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }">{{ name }}</div>
        <div :style="{ fontSize: '12px', color: OV_MUTED, marginTop: '1px' }">{{ dayCount }} day window</div>
      </div>
      <span :style="{ flexShrink: 0, fontSize: '13px', fontWeight: 700, borderRadius: '999px', padding: '8px 16px', background: '#dcf6e3', color: '#1f9d55' }">{{ ovFmt(raised) }} raised</span>
    </div>
    <div :style="{ height: '8px', borderRadius: '999px', background: '#ececef', overflow: 'hidden' }">
      <div :style="{ width: `${pct}%`, height: '100%', borderRadius: '999px', background: '#5cb924' }" />
    </div>
    <div :style="{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }">
      <span :style="{ fontSize: '12.5px', fontWeight: 600, color: '#9a9aa1' }">{{ startLabel }}</span>
      <span :style="{ fontSize: '12.5px', fontWeight: 600, color: '#9a9aa1' }">{{ endLabel }}</span>
    </div>
  </div>
</template>

<script>
import { fmtWindowDate, ovFmt, OV_INK, OV_LINE, OV_MUTED } from '../../../workspace/data/overview.js';

export default {
  name: 'OrderingWindowRow',
  props: {
    // Passed along with the window ({...w} in the prototype) but not shown.
    id: { type: String, default: undefined },
    name: { type: String, default: undefined },
    color: { type: String, default: undefined },
    mono: { type: String, default: undefined },
    daysLeft: { type: Number, default: undefined },
    pct: { type: Number, default: undefined },
    raised: { type: Number, default: undefined },
    startDate: { type: Date, default: undefined },
    endDate: { type: Date, default: undefined },
  },
  data() {
    return { OV_INK, OV_LINE, OV_MUTED };
  },
  computed: {
    startLabel() { return fmtWindowDate(this.startDate); },
    endLabel() { return fmtWindowDate(this.endDate); },
    dayCount() { return Math.max(Math.round((this.endDate - this.startDate) / 86400000), 1); },
  },
  methods: { ovFmt },
};
</script>
