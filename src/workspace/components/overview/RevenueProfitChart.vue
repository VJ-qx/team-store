<!-- Converted from workspace-app.jsx: RevenueProfitChart — revenue and dealer profit on two axes, with
     a hover read-out. The chart is drawn for the measured width of its container. -->
<template>
  <div>
    <div class="wx-ov-rpc__kpis">
      <div v-for="k in kpis" :key="k.label" class="wx-ov-rpc__kpi">
        <div class="wx-ov-rpc__kpi-label">{{ k.label }}</div>
        <div class="wx-ov-rpc__kpi-row">
          <span class="wx-ov-rpc__kpi-value">{{ k.value }}</span>
          <span :class="`wx-ov-rpc__kpi-delta ${k.up ? 'wx-ov-rpc__kpi-delta--up' : 'wx-ov-rpc__kpi-delta--down'}`">{{ k.delta }}</span>
        </div>
      </div>
    </div>
    <div class="wx-ov-rpc__legend">
      <span class="wx-ov-rpc__legend-item">
        <span class="wx-ov-rpc__dot wx-ov-rpc__dot--rev" />Revenue <span class="wx-ov-rpc__legend-note">(left axis)</span></span>
      <span class="wx-ov-rpc__legend-item">
        <span class="wx-ov-rpc__dot wx-ov-rpc__dot--profit" />Dealer Profit <span class="wx-ov-rpc__legend-note">(right axis)</span></span>
    </div>
    <div ref="wrap" class="wx-ov-rpc__plot">
      <svg :viewBox="`0 0 ${w} 380`" class="wx-ov-rpc__svg">
        <g stroke="#f1f1f3" stroke-dasharray="3 4">
          <line v-for="t in revTicks.slice(1)" :key="t" :x1="X0" :y1="yR(t)" :x2="X1" :y2="yR(t)" />
        </g>
        <line :x1="X0" :y1="Y1" :x2="X1" :y2="Y1" :stroke="OV_LINE" />
        <g font-size="11" fill="#a4a4ab" text-anchor="end" font-family="JetBrains Mono, monospace">
          <text v-for="t in revTicks" :key="t" :x="X0 - 7" :y="yR(t) + 3.5">{{ t === 0 ? "$0" : ovFmt(t) }}</text>
        </g>
        <g font-size="11" fill="#b45309" text-anchor="start" font-family="JetBrains Mono, monospace">
          <text v-for="t in profTicks" :key="t" :x="X1 + 7" :y="yP(t) + 3.5">{{ t === 0 ? "$0" : ovFmt(t) }}</text>
        </g>
        <line v-if="hover != null" :x1="x(hover)" :y1="Y0" :x2="x(hover)" :y2="Y1" stroke="#d4d4d8" stroke-dasharray="3 3" />
        <path :d="revPath" fill="none" :stroke="RPC_REV" stroke-width="2.5" stroke-linecap="round" />
        <path :d="profPath" fill="none" :stroke="RPC_PROF" stroke-width="2.5" stroke-linecap="round" />
        <g v-if="hover != null">
          <circle :cx="x(hover)" :cy="yR(pts[hover].revenue)" r="4" fill="#fff" :stroke="RPC_REV" stroke-width="2.5" />
          <circle :cx="x(hover)" :cy="yP(pts[hover].profit)" r="4" fill="#fff" :stroke="RPC_PROF" stroke-width="2.5" />
        </g>
        <g v-if="hover == null">
          <circle :cx="X1" :cy="yR(last.revenue)" r="4" fill="#fff" :stroke="RPC_REV" stroke-width="2.5" />
          <circle :cx="X1" :cy="yP(last.profit)" r="4" fill="#fff" :stroke="RPC_PROF" stroke-width="2.5" />
        </g>
        <g :font-size="dense ? 9.5 : 11" fill="#9a9aa1" text-anchor="middle">
          <text v-for="(d, i) in pts" :key="d.label + i" :x="x(i)" :y="364" :font-weight="d.current || i === n - 1 ? 700 : 400" :fill="d.current || i === n - 1 ? OV_INK : '#9a9aa1'">{{ d.label }}</text>
        </g>
      </svg>
      <div v-for="(d, i) in pts" :key="'h' + i" @mouseenter="() => setHover(i)" @mouseleave="() => setHover(null)" class="wx-ov-rpc__hit" :style="{ left: px(x(i) - stepPx / 2), width: px(stepPx) }" />
      <div v-if="hover != null" class="wx-ov-rpc__tip" :style="{ left: px(x(hover)) }">
        <div class="wx-ov-rpc__tip-label">{{ pts[hover].label }}{{ pts[hover].current ? " · current" : "" }}</div>
        <div class="wx-ov-rpc__tip-value wx-ov-rpc__tip-value--rev">{{ dollars(pts[hover].revenue) }} <span class="wx-ov-rpc__tip-unit">rev</span></div>
        <div class="wx-ov-rpc__tip-value wx-ov-rpc__tip-value--profit">{{ dollars(pts[hover].profit) }} <span class="wx-ov-rpc__tip-unit">profit · {{ Math.round(pts[hover].margin * 100) }}%</span></div>
      </div>
    </div>
  </div>
</template>

<script>
import { buildRevenueSeries, ovFmt } from '../../lib/overview.js';
import { OV_INK, OV_LINE, RPC_PROF, RPC_REV } from '../../theme.js';
import { px } from '../../lib/style.js';

const tickStep = (v) => { const raw = Math.max(v, 1) / 5; const p = Math.pow(10, Math.floor(Math.log10(raw))); const m = raw / p; const s = m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10; return s * p; };
const pctd = (a, b) => (b ? Math.round((Math.abs(a - b) / b) * 100) : 0);

export default {
  name: 'RevenueProfitChart',
  props: {
    totalRevenue: { type: Number, default: 0 },
    scale: { type: String, default: 'month' },
  },
  data() {
    return { OV_INK, OV_LINE, RPC_PROF, RPC_REV, hover: null, w: 900, X0: 56, Y0: 16, Y1: 336 };
  },
  computed: {
    rev() { return buildRevenueSeries(this.totalRevenue, this.scale); },
    // Per-period margin varies ~30–38% (deterministic) so the profit line carries its own shape
    // instead of tracing revenue exactly.
    pts() {
      return this.rev.map((d, i) => {
        const margin = 0.3 + 0.08 * (((i * 37) % 10) / 10);
        return { ...d, profit: Math.round(d.revenue * margin), margin };
      });
    },
    revTop() { return Math.max(...this.pts.map((d) => d.revenue), 1); },
    profTop() { return Math.max(...this.pts.map((d) => d.profit), 1); },
    revStep() { return tickStep(this.revTop); },
    profStep() { return tickStep(this.profTop); },
    revMax() { return Math.ceil(this.revTop / this.revStep) * this.revStep; },
    profMax() { return Math.ceil(this.profTop / this.profStep) * this.profStep; },
    revTicks() { return Array.from({ length: Math.round(this.revMax / this.revStep) + 1 }, (_, i) => i * this.revStep); },
    profTicks() { return Array.from({ length: Math.round(this.profMax / this.profStep) + 1 }, (_, i) => i * this.profStep); },
    X1() { return this.w - 56; },
    n() { return this.pts.length; },
    revPath() { return this.smooth(this.pts.map((d, i) => [this.x(i), this.yR(d.revenue)])); },
    profPath() { return this.smooth(this.pts.map((d, i) => [this.x(i), this.yP(d.profit)])); },
    last() { return this.pts[this.n - 1]; },
    prev() { return this.pts[this.n - 2] || this.last; },
    dense() { return this.n > 12; },
    stepPx() { return (this.X1 - this.X0) / (this.n - 1); },
    marginPts() { return Math.round((this.last.margin - this.prev.margin) * 100); },
    kpis() {
      const { last, prev, marginPts, dollars } = this;
      return [
        { label: "Revenue · " + last.label, value: dollars(last.revenue), up: last.revenue >= prev.revenue, delta: (last.revenue >= prev.revenue ? "+" : "-") + pctd(last.revenue, prev.revenue) + "%" },
        { label: "Dealer Profit · " + last.label, value: dollars(last.profit), up: last.profit >= prev.profit, delta: (last.profit >= prev.profit ? "+" : "-") + pctd(last.profit, prev.profit) + "%" },
        { label: "Margin · " + last.label, value: Math.round(last.margin * 100) + "%", up: marginPts >= 0, delta: (marginPts >= 0 ? "+" : "") + marginPts + " pts" },
      ];
    },
  },
  mounted() {
    // React: useEffect with [] — track the container's width.
    const el = this.$refs.wrap;
    if (!el) return;
    this.ro = new ResizeObserver(() => { this.w = el.clientWidth || 900; });
    this.ro.observe(el);
    this.w = el.clientWidth || 900;
  },
  beforeUnmount() {
    this.ro && this.ro.disconnect();
  },
  methods: {
    px,
    ovFmt,
    setHover(v) { this.hover = v; },
    x(i) { return this.X0 + (i * (this.X1 - this.X0)) / (this.n - 1); },
    yR(v) { return this.Y1 - (v / this.revMax) * (this.Y1 - this.Y0); },
    yP(v) { return this.Y1 - (v / this.profMax) * (this.Y1 - this.Y0); },
    smooth(arr) {
      return arr.map((p, i) => {
        if (i === 0) return "M" + p[0] + "," + p[1];
        const q = arr[i - 1], c = (p[0] - q[0]) / 2;
        return "C" + (q[0] + c) + "," + q[1] + " " + (p[0] - c) + "," + p[1] + " " + p[0] + "," + p[1];
      }).join(" ");
    },
    dollars(v) { return "$" + Math.round(v).toLocaleString("en-US"); },
  },
};
</script>
