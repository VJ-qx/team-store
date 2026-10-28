<!-- Converted from workspace-app.jsx: RevenueProfitChart — revenue and dealer profit on two axes, with
     a hover read-out. The chart is drawn for the measured width of its container. -->
<template>
  <div>
    <div :style="{ display: 'flex', flexWrap: 'wrap', gap: '12px' }">
      <div v-for="k in kpis" :key="k.label" :style="{ minWidth: '200px', boxSizing: 'border-box', border: '1px solid #d4d4d8', borderRadius: '8px', padding: '16px', background: '#fff', display: 'flex', flexDirection: 'column', gap: '3.5px', alignItems: 'flex-start' }">
        <div :style="{ fontSize: '12px', fontWeight: 700, letterSpacing: '.03em', lineHeight: '16px', color: '#71717a' }">{{ k.label }}</div>
        <div :style="{ display: 'flex', alignItems: 'baseline', gap: '8px' }">
          <span :style="{ fontSize: '24px', fontWeight: 700, lineHeight: '32px', letterSpacing: '-.01em', color: OV_INK }">{{ k.value }}</span>
          <span :style="{ fontSize: '14px', fontWeight: 700, lineHeight: '20px', letterSpacing: '.01em', color: k.up ? OV_GREEN : OV_RED }">{{ k.delta }}</span>
        </div>
      </div>
    </div>
    <div :style="{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '20px', padding: '14px 0 10px', fontSize: '12.5px', fontWeight: 600, color: OV_INK }">
      <span :style="{ display: 'inline-flex', alignItems: 'center', gap: '7px' }">
        <span :style="{ width: '9px', height: '9px', borderRadius: '999px', background: RPC_REV }" />Revenue <span :style="{ color: OV_MUTED, fontWeight: 400 }">(left axis)</span></span>
      <span :style="{ display: 'inline-flex', alignItems: 'center', gap: '7px' }">
        <span :style="{ width: '9px', height: '9px', borderRadius: '999px', background: RPC_PROF }" />Dealer Profit <span :style="{ color: OV_MUTED, fontWeight: 400 }">(right axis)</span></span>
    </div>
    <div ref="wrap" :style="{ position: 'relative' }">
      <svg :viewBox="`0 0 ${w} 380`" :style="{ width: '100%', height: '380px', display: 'block' }">
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
      <div v-for="(d, i) in pts" :key="'h' + i" @mouseenter="() => setHover(i)" @mouseleave="() => setHover(null)" :style="{ position: 'absolute', top: '0', bottom: '44px', left: px(x(i) - stepPx / 2), width: px(stepPx) }" />
      <div v-if="hover != null" :style="{ position: 'absolute', top: '-6px', left: px(x(hover)), transform: 'translateX(-50%)', background: OV_INK, color: '#fff', borderRadius: '8px', padding: '8px 12px', whiteSpace: 'nowrap', zIndex: 5, boxShadow: '0 6px 18px rgba(20,20,30,.22)', pointerEvents: 'none' }">
        <div :style="{ fontSize: '11px', color: '#a4a4ab', marginBottom: '3px' }">{{ pts[hover].label }}{{ pts[hover].current ? " · current" : "" }}</div>
        <div :style="{ fontSize: '12.5px', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: '#c4b5fd' }">{{ dollars(pts[hover].revenue) }} <span :style="{ color: '#a4a4ab', fontWeight: 400 }">rev</span></div>
        <div :style="{ fontSize: '12.5px', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: '#fcd34d' }">{{ dollars(pts[hover].profit) }} <span :style="{ color: '#a4a4ab', fontWeight: 400 }">profit · {{ Math.round(pts[hover].margin * 100) }}%</span></div>
      </div>
    </div>
  </div>
</template>

<script>
import { buildRevenueSeries, ovFmt } from '../../lib/overview.js';
import { OV_GREEN, OV_INK, OV_LINE, OV_MUTED, OV_RED, RPC_PROF, RPC_REV } from '../../theme.js';
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
    return { OV_GREEN, OV_INK, OV_LINE, OV_MUTED, OV_RED, RPC_PROF, RPC_REV, hover: null, w: 900, X0: 56, Y0: 16, Y1: 336 };
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
