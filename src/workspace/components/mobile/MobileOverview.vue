<!-- Converted from "Workspace Mobile.dc.html": the mobile Overview screen (ws-overview) — the workspace bar,
     Overview · Stores · Earnings, search, the store-scope menu, Needs attention, Frequently Visited, the
     performance summary, the Revenue & Dealer Profit chart (Day / Month / Year, with its hover tooltip), Top
     Performing Stores (with its sort menu), Active Ordering Windows and the Roster Bank.
     Its numbers are the prototype's own sample data (the same five stores as the desktop seed), as in the
     prototype; connecting them to the workspace's stores is not part of this conversion.
     Taps on data-go links are handled by the mobile app (MobileWorkspace); the app calls onAppTap first, which
     closes an open menu, as the prototype's onTap does. -->
<template>
  <div class="wm-screen" data-screen-label="ws-overview">
    <div class="wm-topbar wm-topbar--workspace">
      <div class="wm-topbar__brand-row"><img src="assets/prolook-mark-ink.png" alt="PROLOOK" class="wm-topbar__logo"><button class="wm-icon-button" data-go="ws-account"><span class="wm-avatar">HM</span></button></div>
    </div>
    <div class="wm-overview__content">
      <div class="wm-segmented"><span class="wm-segmented__item wm-segmented__item--active" data-go="ws-overview">Overview</span><span class="wm-segmented__item" data-go="ws-stores">Stores</span><span class="wm-segmented__item" data-go="ws-earnings">Earnings</span></div>

      <div class="wm-overview__intro">
        <div><h1 class="wm-overview__title">Overview</h1><div class="wm-subtle wm-subtle--lead">Performance across 6 stores</div></div>
        <div class="wm-overview__toolbar">
          <template v-if="!searchOpen">
            <button class="wm-overview__add-store" data-go="wiz1"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"></path></svg>Add Store</button>
            <button @click="toggleScope" class="wm-overview__scope-button"><span class="wm-truncate">All Stores</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"></path></svg></button>
            <button @click="openSearch" aria-label="Search Team Stores" class="wm-overview__search-button"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"></circle><path d="M20 20l-3.5-3.5"></path></svg></button>
          </template>
          <template v-if="searchOpen">
            <div class="wm-overview__search-field"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9a9aa1" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"></circle><path d="M20 20l-3.5-3.5"></path></svg><input :ref="(el) => searchRef(el)" :value="search" v-controlled="search" @input="(e) => search = e.target.value" placeholder="Search Team Stores" class="wm-overview__search-input"></div>
            <button @click="closeSearch" class="wm-overview__search-cancel">Cancel</button>
          </template>
          <template v-if="scopeOpen && !searchOpen">
            <div class="wm-overview__scope-menu">
              <div class="wm-overview__menu-label">Scope to stores</div>
              <button v-for="s in STORES" :key="s.id" data-go="toast:Scoping stays on desktop in this prototype" class="wm-overview__scope-option"><span class="wm-overview__scope-mark" :style="{ background: s.color }">{{ s.mono }}</span><span class="wm-overview__scope-name">{{ s.name }}</span></button>
            </div>
          </template>
        </div>
      </div>

      <div class="wm-section">
        <div class="wm-overline">Needs attention <span class="wm-overview__section-hint">across stores</span></div>
        <div class="wm-overview__attention-card" data-go="set-dist"><div class="wm-grow"><div class="wm-callout__title">Division 7 needs a manager before their orders can ship</div><div class="wm-overview__attention-meta">Jazz Bantum Boys Basketball · 3 orders waiting</div></div><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c4c4c8" stroke-width="2.2" stroke-linecap="round"><path d="M9 5l7 7-7 7"></path></svg></div>
        <div class="wm-overview__pending-card" data-go="orders-pending"><div class="wm-grow"><div class="wm-callout__title">4 pending orders to submit</div><div class="wm-overview__attention-meta">Jazz Bantum Boys Basketball · oldest 3 days</div></div><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c4c4c8" stroke-width="2.2" stroke-linecap="round"><path d="M9 5l7 7-7 7"></path></svg></div>
        <div class="wm-callout" data-go="reports"><div class="wm-grow"><div class="wm-callout__title">Close report is ready</div><div class="wm-overview__attention-meta">Bayshore Summer Classic · closed Jul 24</div></div><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c4c4c8" stroke-width="2.2" stroke-linecap="round"><path d="M9 5l7 7-7 7"></path></svg></div>
      </div>

      <div class="wm-section">
        <div class="wm-overview__section-header">
          <div class="wm-overview__section-heading"><div class="wm-overline">Frequently Visited</div><div class="wm-overview__section-desc">Updated automatically from your activity</div></div>
          <button class="wm-overview__all-stores-link" data-go="ws-stores">All stores →</button>
        </div>
        <div class="wm-overview__carousel">
          <div v-for="s in frequent" :key="s.id" class="wm-overview__visited-card" :data-go="s.go">
            <div class="wm-spread"><span class="wm-overview__status-pill" :style="{ background: s.pillBg, color: s.pillFg }"><span class="wm-overview__status-dot" :style="{ background: s.pillDot }"></span>{{ s.status }}</span><button data-go="toast:Store menu is desktop-only here" aria-label="More" class="wm-overview__card-menu-button"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"></circle><circle cx="12" cy="12" r="2"></circle><circle cx="19" cy="12" r="2"></circle></svg></button></div>
            <div class="wm-overview__visited-store"><span class="wm-store-mark" :style="{ background: s.color }">{{ s.mono }}</span><div class="wm-overview__section-heading"><div class="wm-overview__visited-name">{{ s.name }}</div><div class="wm-overview__visited-type">{{ s.type }}</div></div></div>
            <span class="wm-overview__visited-visits"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#9a9aa1" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path></svg>{{ s.visitLabel }}</span>
          </div>
        </div>
      </div>

      <div class="wm-section">
        <div><div class="wm-overline">Performance summary</div><div class="wm-overview__section-desc">Performance across 6 stores</div></div>
        <div class="wm-grid-2">
          <div class="wm-overview__kpi-card"><div class="wm-overview__kpi-header"><span class="wm-overview__kpi-label">Total Revenue</span><span class="wm-overview__kpi-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7"></path><path d="M3 4v5h5"></path><path d="M12 7v5l3 2"></path></svg></span></div><div class="wm-overview__kpi-value">$69,923</div><div class="wm-overview__kpi-trend"><span class="wm-overview__delta-up"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l6-6 4 4 8-8"></path><path d="M14 7h7v7"></path></svg>12.4%</span><span class="wm-muted">vs last month</span></div></div>
          <div data-go="orders" class="wm-overview__kpi-card"><div class="wm-overview__kpi-header"><span class="wm-overview__kpi-label">Orders</span><span class="wm-overview__kpi-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7"></path><path d="M3 4v5h5"></path><path d="M12 7v5l3 2"></path></svg></span></div><div class="wm-overview__kpi-value">1,520</div><div class="wm-overview__kpi-trend"><span class="wm-overview__delta-up"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l6-6 4 4 8-8"></path><path d="M14 7h7v7"></path></svg>8.1%</span><span class="wm-muted">vs last month</span></div></div>
          <div class="wm-overview__kpi-card"><div class="wm-overview__kpi-header"><span class="wm-overview__kpi-label">Avg. Order Value</span><span class="wm-overview__kpi-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7"></path><path d="M3 4v5h5"></path><path d="M12 7v5l3 2"></path></svg></span></div><div class="wm-overview__kpi-value">$46</div><div class="wm-overview__kpi-trend"><span class="wm-overview__delta-down"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7l6 6 4-4 8 8"></path><path d="M14 17h7v-7"></path></svg>3.2%</span><span class="wm-muted">vs last month</span></div></div>
          <div class="wm-overview__kpi-card"><div class="wm-overview__kpi-header"><span class="wm-overview__kpi-label">Active Stores</span><span class="wm-overview__kpi-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7"></path><path d="M3 4v5h5"></path><path d="M12 7v5l3 2"></path></svg></span></div><div class="wm-overview__kpi-value">4</div><div class="wm-overview__kpi-trend"><span class="wm-muted">6 total</span></div></div>
        </div>
      </div>

      <div class="wm-panel">
        <div>
          <div class="wm-overview__chart-title">Revenue &amp; Dealer Profit</div>
          <template v-if="!descOpen"><div class="wm-overview__chart-desc">Gross revenue across all stores vs. dealer profit — revenue minus manufacturing cost (COGS), platform fee, sales tax, and team fundraising.</div><button @click="descOpen = !descOpen" class="wm-overview__chart-more">More</button></template>
          <template v-if="descOpen"><div class="wm-overview__section-desc">Gross revenue across all stores vs. dealer profit — revenue minus manufacturing cost (COGS), platform fee, sales tax, and team fundraising.</div><button @click="descOpen = !descOpen" class="wm-overview__chart-more">Less</button></template>
        </div>
        <div class="wm-overview__scale-tabs">
          <button v-for="sc in scales" :key="sc.label" @click="sc.pick" class="wm-overview__scale-tab" :style="{ background: sc.bg, color: sc.fg, boxShadow: sc.shadow }">{{ sc.label }}</button>
        </div>
        <div class="wm-overview__chart-kpis">
          <div v-for="k in chart.kpis" :key="k.label" class="wm-overview__chart-kpi"><div class="wm-overview__chart-kpi-label">{{ k.label }}</div><div class="wm-overview__chart-kpi-value">{{ k.value }}</div><div class="wm-overview__chart-kpi-delta" :style="{ color: k.deltaColor }">{{ k.delta }}</div></div>
        </div>
        <div class="wm-overview__legend"><span class="wm-overview__legend-item"><span class="wm-overview__legend-revenue"></span>Revenue <span class="wm-overview__legend-axis">(left)</span></span><span class="wm-overview__legend-item"><span class="wm-overview__legend-profit"></span>Dealer Profit <span class="wm-overview__legend-axis">(right)</span></span></div>
        <div class="wm-overview__chart" @pointerdown="onChartPointer" @pointermove="onChartPointer" @pointerup="onChartLeave" @pointerleave="onChartLeave" @pointercancel="onChartLeave">
          <svg viewBox="0 0 361 220" class="wm-overview__chart-svg" ref="chart">
            <g stroke="#e4e4e8" stroke-dasharray="3 4"><line v-for="(t, i) in chart.revTicks" :key="i" x1="44" :y1="t.y" x2="317" :y2="t.y"></line></g>
            <line x1="44" y1="190" x2="317" y2="190" stroke="#ececf0"></line>
            <line v-if="chart.hasHover" :x1="chart.hoverX" y1="10" :x2="chart.hoverX" y2="190" stroke="#d4d4d8" stroke-dasharray="3 3"></line>
            <path :d="chart.revPath" fill="none" stroke="#7c3aed" stroke-width="2.5" stroke-linecap="round"></path>
            <path :d="chart.profPath" fill="none" stroke="#d97706" stroke-width="2.5" stroke-linecap="round"></path>
            <circle :cx="chart.dotX" :cy="chart.dotRevY" r="4" fill="#fff" stroke="#7c3aed" stroke-width="2.5"></circle>
            <circle :cx="chart.dotX" :cy="chart.dotProfY" r="4" fill="#fff" stroke="#d97706" stroke-width="2.5"></circle>
          </svg>
          <div v-for="(t, i) in chart.revTicks" :key="'l' + i" class="wm-overview__tick-left" :style="{ top: t.pct }">{{ t.label }}</div>
          <div v-for="(t, i) in chart.profTicks" :key="'r' + i" class="wm-overview__tick-right" :style="{ top: t.pct }">{{ t.label }}</div>
          <div v-for="l in chart.xLabels" :key="l.label" class="wm-overview__x-label" :style="{ left: l.pct, fontWeight: l.weight, color: l.fill }">{{ l.label }}</div>
          <div v-if="chart.hasHover" class="wm-overview__tooltip" :style="{ left: chart.tipLeft, transform: `translateX(${chart.tipShift})` }"><div class="wm-overview__tooltip-label">{{ chart.tipLabel }}</div><div class="wm-overview__tooltip-revenue">{{ chart.tipRev }} <span class="wm-overview__tooltip-unit">rev</span></div><div class="wm-overview__tooltip-profit">{{ chart.tipProf }} <span class="wm-overview__tooltip-unit">profit · {{ chart.tipMargin }}</span></div></div>
        </div>
      </div>

      <div class="wm-panel wm-panel--gap-12">
        <div class="wm-overview__section-header">
          <div class="wm-overview__section-heading"><div class="wm-overview__chart-title">Top Performing Stores</div><div class="wm-overview__section-desc">Ranked across all stores</div></div>
          <button class="wm-overview__all-stores-link" data-go="ws-stores">All stores →</button>
        </div>
        <div class="wm-screen--sheet">
          <button @click="toggleSort" class="wm-overview__sort-button"><span><span class="wm-overview__sort-prefix">Sort by</span> {{ sortDef[1] }}</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"></path></svg></button>
          <div v-if="sortOpen" class="wm-overview__sort-menu">
            <button v-for="o in sortOptions" :key="o.label" @click="o.pick" class="wm-overview__sort-option" :style="{ background: o.bg }">{{ o.label }}<span class="wm-overview__sort-mark">{{ o.mark }}</span></button>
          </div>
        </div>
        <div class="wm-section wm-section--gap-8">
          <div v-for="s in topStores" :key="s.id" class="wm-overview__top-store" :data-go="s.go">
            <div class="wm-overview__visited-store"><span class="wm-overview__top-store-mark" :style="{ background: s.color }">{{ s.mono }}</span><div class="wm-grow"><div class="wm-overview__visited-name">{{ s.name }}</div><div class="wm-overview__sort-mark">{{ s.sport }}</div></div><div class="wm-trailing"><div class="wm-overview__top-store-revenue">{{ s.revenueFmt }}</div><div class="wm-overview__top-store-trend" :style="{ color: s.trendColor }"><svg v-if="s.trend >= 0" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l6-6 4 4 8-8"></path><path d="M14 7h7v7"></path></svg><svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7l6 6 4-4 8 8"></path><path d="M14 17h7v-7"></path></svg>{{ s.trendFmt }}</div></div></div>
            <div class="wm-overview__top-store-stats"><span class="wm-overview__top-store-stat">{{ s.orders }}</span> orders · <span class="wm-overview__top-store-stat">{{ s.aovFmt }}</span> avg. order · <span class="wm-overview__top-store-stat">{{ s.pctFmt }}</span> of total · Created {{ s.created }}</div>
            <div class="wm-overview__visited-store"><span class="wm-overview__completion-track"><span class="wm-overview__completion-fill" :style="{ width: s.completionW, background: s.completionColor }"></span></span><span class="wm-overview__completion-value">{{ s.completion }}% <span class="wm-overview__completion-roster">· {{ s.rosterFmt }}</span></span></div>
          </div>
        </div>
      </div>

      <div class="wm-overview__windows-card">
        <div class="wm-overview__chart-title">Active Ordering Windows</div>
        <div class="wm-overview__section-desc">Set-window stores not yet closed</div>
        <div v-for="w in windows" :key="w.id" class="wm-overview__window">
          <div class="wm-overview__window-header"><span class="wm-overview__window-mark" :style="{ background: w.color }">{{ w.mono }}</span><div class="wm-grow"><div class="wm-overview__window-name">{{ w.name }}</div><div class="wm-overview__visited-type">{{ w.days }} day window</div></div><span class="wm-overview__window-raised">{{ w.raisedFmt }} raised</span></div>
          <div class="wm-overview__window-track"><div class="wm-overview__window-fill" :style="{ width: w.pctW }"></div></div>
          <div class="wm-overview__window-dates"><span class="wm-overview__window-date">{{ w.start }}</span><span class="wm-overview__window-date">{{ w.end }}</span></div>
        </div>
        <div class="wm-overview__card-footer"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path></svg>4 windows open now</div>
      </div>

      <div class="wm-overview__windows-card">
        <div class="wm-overview__chart-title">Roster Bank</div>
        <div class="wm-overview__section-desc">Checkout captures awaiting roster review</div>
        <div v-for="b in bankRows" :key="b.id" class="wm-overview__bank-row" :data-go="b.go">
          <span class="wm-overview__window-mark" :style="{ background: b.color }">{{ b.mono }}</span>
          <div class="wm-grow"><div class="wm-overview__window-name">{{ b.name }}</div><div class="wm-overview__bank-meta">{{ b.meta }}</div></div>
          <span class="wm-overview__bank-review">Review <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0e0e10" stroke-width="2.2" stroke-linecap="round"><path d="M9 5l7 7-7 7"></path></svg></span>
        </div>
        <div class="wm-overview__card-note"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="wm-overview__note-icon"><path d="M3 13h5l2 3h4l2-3h5"></path><path d="M5 6h14l2 7v6H3v-6z"></path></svg><span>494 proposed players across 4 stores — commit them in My Teams</span></div>
      </div>
    </div>
    <div class="wm-safe-area"></div>
  </div>
</template>

<script>
// The prototype's sample stores (its script's STORES and TOTAL), copied unchanged.
const STORES = [
  { id: 'jazz', name: 'Jazz Bantum Boys Basketball', mono: 'JB', color: '#7c1d2b', type: 'League Store', sport: 'Basketball', status: 'Active', rev: 3813, visits: 24, created: '2026-05-20', winStart: '2026-05-20', winEnd: '2026-06-19', bankTeam: 'Lone Peak 8U · Basketball', proposed: 4, captures: 6, go: 'home' },
  { id: 'rams', name: 'Rams', mono: 'RA', color: '#ec6c2a', type: 'Team Store', sport: 'Football', status: 'Active', rev: 0, visits: 19, created: '2026-05-01', winStart: '2026-05-01', winEnd: '2026-06-30', bankTeam: 'Rams · Football', proposed: 4, captures: 6, go: 'home-draft' },
  { id: 'honey', name: 'Honey Badgers', mono: 'HB', color: '#f5b400', type: 'Team Store', sport: 'Football', status: 'Draft', rev: 1000, visits: 15, created: '2026-04-10', winStart: '2026-04-10', winEnd: '2026-07-09', bankTeam: 'Honey Badgers · Football', proposed: 4, captures: 6, go: 'home' },
  { id: 'wasatch', name: 'Wasatch Elite Lacrosse', mono: 'WL', color: '#1e3a6e', type: 'League Store', sport: 'Lacrosse', status: 'Active', rev: 18240, visits: 9, created: '2026-05-25', winStart: '2026-05-25', winEnd: '2026-07-24', bankTeam: '18 teams mapped · no rosters yet · Lacrosse', proposed: 482, captures: 272, go: 'home' },
  { id: 'bayshore', name: 'Bayshore Summer Classic', mono: 'BC', color: '#0f766e', type: 'League Store', sport: 'Volleyball', status: 'Active', rev: 46870, visits: 6, created: '2026-05-20', winStart: '2026-05-20', winEnd: '2026-06-19', bankTeam: 'No teams set up · team gear locked', proposed: 0, captures: 0, go: 'home' },
];
const TOTAL = 69923;
const SORT_DEFS = [['revenue', 'Revenue', 'rev'], ['orders', 'Orders', 'orders'], ['aov', 'AOV', 'aov'], ['pct', '% of total', 'pct'], ['completion', 'Completion', 'completion'], ['trend', 'Trend', 'trend'], ['created', 'Created', 'createdTs']];
// The chart's drawing box (viewBox 361 × 220).
const X0 = 44, X1 = 317, Y0 = 10, Y1 = 190;

export default {
  name: 'MobileOverview',
  data() {
    return { STORES, searchOpen: false, search: '', scopeOpen: false, descOpen: false, scale: 'month', sortKey: 'revenue', sortOpen: false, hover: null };
  },
  computed: {
    frequent() {
      const pills = { Active: ['#d8f5e3', '#1f7a44', '#1f9d55'], Draft: ['#dbeafe', '#1d4ed8', '#3b82f6'] };
      return [...STORES].sort((a, b) => b.visits - a.visits).map((s) => ({ ...s, pillBg: pills[s.status][0], pillFg: pills[s.status][1], pillDot: pills[s.status][2], visitLabel: s.visits + ' visits' }));
    },
    scales() {
      const S = this;
      return [['day', 'Day'], ['month', 'Month'], ['year', 'Year']].map(([k, label]) => ({ label, pick: () => { this.scale = k; this.hover = null; }, bg: S.scale === k ? '#fff' : 'transparent', fg: S.scale === k ? '#0e0e10' : '#6b6b72', shadow: S.scale === k ? '0 1px 2px rgba(20,20,30,.10)' : 'none' }));
    },
    pts() { return this.series(this.scale).map((d, i) => { const margin = 0.3 + 0.08 * (((i * 37) % 10) / 10); return { ...d, profit: Math.round(d.revenue * margin), margin }; }); },
    chart() {
      const { pts } = this;
      const n = pts.length, last = pts[n - 1], prev = pts[n - 2] || last;
      const pctd = (a, b) => (b ? Math.round((Math.abs(a - b) / b) * 100) : 0), mPts = Math.round((last.margin - prev.margin) * 100);
      const v = {};
      v.kpis = [
        { label: 'Revenue · ' + last.label, value: this.fmt(last.revenue), up: last.revenue >= prev.revenue, delta: (last.revenue >= prev.revenue ? '+' : '-') + pctd(last.revenue, prev.revenue) + '%' },
        { label: 'Dealer Profit · ' + last.label, value: this.fmt(last.profit), up: last.profit >= prev.profit, delta: (last.profit >= prev.profit ? '+' : '-') + pctd(last.profit, prev.profit) + '%' },
        { label: 'Margin · ' + last.label, value: Math.round(last.margin * 100) + '%', up: mPts >= 0, delta: (mPts >= 0 ? '+' : '') + mPts + ' pts' },
      ].map((k) => ({ ...k, deltaColor: k.up ? '#1f9d55' : '#e1251b' }));
      const tickStep = (val) => { const raw = Math.max(val, 1) / 3, p = Math.pow(10, Math.floor(Math.log10(raw))), m = raw / p; return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10) * p; };
      const revTop = Math.max(...pts.map((d) => d.revenue), 1), profTop = Math.max(...pts.map((d) => d.profit), 1);
      const rs = tickStep(revTop), ps = tickStep(profTop), revMax = Math.ceil(revTop / rs) * rs, profMax = Math.ceil(profTop / ps) * ps;
      const x = (i) => X0 + (i * (X1 - X0)) / (n - 1), yR = (val) => Y1 - (val / revMax) * (Y1 - Y0), yP = (val) => Y1 - (val / profMax) * (Y1 - Y0);
      const kfmt = (t) => t === 0 ? '$0' : t >= 1000 ? '$' + (t / 1000).toFixed(t % 1000 ? 1 : 0) + 'K' : '$' + t;
      v.revTicks = Array.from({ length: Math.round(revMax / rs) + 1 }, (_, i) => i * rs).map((t) => ({ y: yR(t), pct: (yR(t) / 220 * 100) + '%', label: kfmt(t) }));
      v.profTicks = Array.from({ length: Math.round(profMax / ps) + 1 }, (_, i) => i * ps).map((t) => ({ y: yP(t), pct: (yP(t) / 220 * 100) + '%', label: kfmt(t) }));
      const smooth = (arr) => arr.map((p, i) => { if (i === 0) return 'M' + p[0] + ',' + p[1]; const q = arr[i - 1], c = (p[0] - q[0]) / 2; return 'C' + (q[0] + c) + ',' + q[1] + ' ' + (p[0] - c) + ',' + p[1] + ' ' + p[0] + ',' + p[1]; }).join(' ');
      v.revPath = smooth(pts.map((d, i) => [x(i), yR(d.revenue)])); v.profPath = smooth(pts.map((d, i) => [x(i), yP(d.profit)]));
      const every = n > 12 ? 3 : n > 6 ? 2 : 1;
      v.xLabels = pts.map((d, i) => ({ x: x(i), pct: (x(i) / 361 * 100) + '%', label: d.label, weight: i === n - 1 ? 700 : 400, fill: i === n - 1 ? '#0e0e10' : '#9a9aa1' })).filter((_, i) => (n - 1 - i) % every === 0);
      const h = this.hover != null && this.hover < n ? this.hover : null, di = h != null ? h : n - 1;
      v.hasHover = h != null; v.hoverX = x(di); v.dotX = x(di); v.dotRevY = yR(pts[di].revenue); v.dotProfY = yP(pts[di].profit);
      v.tipLeft = (x(di) / 361 * 100) + '%'; v.tipShift = di < 2 ? '-10%' : di > n - 3 ? '-90%' : '-50%';
      v.tipLabel = pts[di].label + (pts[di].current ? ' · current' : ''); v.tipRev = this.fmt(pts[di].revenue); v.tipProf = this.fmt(pts[di].profit); v.tipMargin = Math.round(pts[di].margin * 100) + '%';
      return v;
    },
    sortDef() { return SORT_DEFS.find((d) => d[0] === this.sortKey) || SORT_DEFS[0]; },
    sortOptions() {
      return SORT_DEFS.map((d) => ({ label: d[1], mark: d[0] === this.sortKey ? 'Selected' : '', bg: d[0] === this.sortKey ? '#f5f5f7' : 'transparent', pick: (e) => { e.stopPropagation(); this.sortKey = d[0]; this.sortOpen = false; } }));
    },
    topStores() {
      const byRev = [...STORES].sort((a, b) => b.rev - a.rev);
      const roster = [58, 55, 62, 48, 40], done = [92, 85, 78, 71, 64], trend = [12.4, 8.1, -3.2, 5.6, 2.1];
      const top = byRev.map((s, i) => { const orders = Math.round(s.rev / 44) + 6, size = roster[i], comp = done[i]; return { ...s, orders, aov: s.rev / orders, pct: (s.rev / TOTAL) * 100, completion: comp, rosterSize: size, rosterOrdered: Math.round((comp / 100) * size), trend: trend[i], createdTs: this.loc(s.created).getTime() }; });
      const cur = this.sortDef;
      return [...top].sort((a, b) => (b[cur[2]] || 0) - (a[cur[2]] || 0)).map((s) => ({ ...s, revenueFmt: this.fmt(s.rev), trendColor: s.trend >= 0 ? '#1f9d55' : '#e1251b', trendFmt: Math.abs(s.trend) + '%', aovFmt: this.fmt(s.aov), pctFmt: s.pct.toFixed(1) + '%', created: this.fmtDate(s.created), completionW: s.completion + '%', completionColor: s.completion >= 80 ? '#1f9d55' : '#e0a92b', rosterFmt: s.rosterOrdered + '/' + s.rosterSize }));
    },
    windows() {
      const today = this.loc('2026-06-04');
      return STORES.map((s) => { const a = this.loc(s.winStart), b = this.loc(s.winEnd), total = Math.max((b - a) / 86400000, 1), el = Math.min(Math.max((today - a) / 86400000, 0), total); return { ...s, days: Math.round(total), pctW: Math.round((el / total) * 100) + '%', daysLeft: Math.max(Math.round((b - today) / 86400000), 0), raisedFmt: this.fmt(s.rev), start: this.fmtDate(a), end: this.fmtDate(b) }; }).sort((a, b) => a.daysLeft - b.daysLeft).slice(0, 4);
    },
    bankRows() { return [...STORES].sort((a, b) => b.proposed - a.proposed).slice(0, 4).map((s) => ({ ...s, meta: s.captures + ' capture' + (s.captures === 1 ? '' : 's') })); },
  },
  methods: {
    fmt(n) { return '$' + Math.round(n).toLocaleString('en-US'); },
    loc(d) { return typeof d === 'string' ? new Date(d + 'T00:00') : new Date(d); },
    fmtDate(d) { return this.loc(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); },
    series(scale) {
      const total = TOTAL;
      if (scale === 'day') { const now = new Date(), daily = total / 30, out = []; for (let i = 13; i >= 0; i--) { const d = new Date(now); d.setDate(now.getDate() - i); const w = 0.55 + 0.9 * Math.abs(Math.sin((d.getDate() + d.getMonth() * 3) * 1.3)); out.push({ label: d.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' }), revenue: Math.round(daily * w), current: i === 0 }); } return out; }
      if (scale === 'year') { const y = new Date().getFullYear(); return [0.42, 0.61, 0.78, 1.0].map((f, i) => ({ label: String(y - 3 + i), revenue: Math.round(total * 12 * f), current: i === 3 })); }
      const weights = [0.6, 0.8, 1.1, 0.7, 0.9, 1.2, 1.35, 1.5, 1.0, 1.15, 1.3, 1.05], wsum = weights.reduce((a, b) => a + b, 0), now = new Date();
      return weights.map((w, i) => { const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1); return { label: d.toLocaleDateString('en-US', { month: 'short' }), revenue: Math.round((total * w) / wsum), current: i === 11 }; });
    },
    // The prototype focuses the search field on every render while search is open.
    searchRef(el) { if (el && this.searchOpen && document.activeElement !== el) el.focus(); },
    openSearch() { this.searchOpen = true; this.scopeOpen = false; },
    closeSearch() { this.searchOpen = false; this.search = ''; },
    toggleScope(e) { e.stopPropagation(); this.scopeOpen = !this.scopeOpen; this.sortOpen = false; },
    toggleSort(e) { e.stopPropagation(); this.sortOpen = !this.sortOpen; this.scopeOpen = false; },
    onChartPointer(e) {
      const el = this.$refs.chart; if (!el) return;
      if (e.type === 'pointermove' && e.pointerType !== 'mouse' && e.buttons === 0) return;
      const n = this.pts.length;
      const r = el.getBoundingClientRect(); const px = ((e.clientX - r.left) / r.width) * 361;
      const i = Math.max(0, Math.min(n - 1, Math.round(((px - X0) / (X1 - X0)) * (n - 1))));
      if (i !== this.hover) this.hover = i;
    },
    onChartLeave(e) { if (e.type === 'pointerup' && e.pointerType === 'mouse') return; this.hover = null; },
    // The prototype's onTap, first part: a tap anywhere but a menu closes an open menu.
    onAppTap(e) { if ((this.scopeOpen || this.sortOpen) && !e.target.closest('[data-menu]')) { this.scopeOpen = false; this.sortOpen = false; } },
  },
};
</script>
