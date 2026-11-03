<!-- Converted from workspace-app.jsx: OrderingWindowRow — one store's ordering window on the Overview. -->
<template>
  <div class="wx-ov-window">
    <div class="wx-ov-window__head">
      <span class="wx-ov-avatar" :style="{ background: color }">{{ mono }}</span>
      <div class="wx-ov-window__body">
        <div class="wx-ov-window__name">{{ name }}</div>
        <div class="wx-ov-window__meta">{{ dayCount }} day window</div>
      </div>
      <span class="wx-ov-window__raised">{{ ovFmt(raised) }} raised</span>
    </div>
    <div class="wx-ov-window__track">
      <div class="wx-ov-window__fill" :style="{ width: `${pct}%` }" />
    </div>
    <div class="wx-ov-window__dates">
      <span class="wx-ov-window__date">{{ startLabel }}</span>
      <span class="wx-ov-window__date">{{ endLabel }}</span>
    </div>
  </div>
</template>

<script>
import { fmtWindowDate, ovFmt } from '../../lib/overview.js';

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
  computed: {
    startLabel() { return fmtWindowDate(this.startDate); },
    endLabel() { return fmtWindowDate(this.endDate); },
    dayCount() { return Math.max(Math.round((this.endDate - this.startDate) / 86400000), 1); },
  },
  methods: { ovFmt },
};
</script>
