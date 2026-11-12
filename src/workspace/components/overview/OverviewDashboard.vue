<!-- Converted from workspace-app.jsx / workspace-app-integrated.jsx: OverviewDashboard — the workspace
     Overview: Frequently Visited, KPIs, revenue chart, top stores, ordering windows and roster bank.
     isEmpty shows the empty-state variant. -->
<template>
  <div v-if="isEmpty" class="wx-ov-empty">
    <div class="wx-ov__head">
      <div>
        <h1 :class="`wx-ov-empty__title${INT ? ' wx-ov-empty__title--marucci' : ''}`">Overview</h1>
        <div class="wx-ov-empty__lead">Launch your first store to start tracking performance</div>
      </div>
      <div class="wx-ov__actions">
        <button @click="onAdd" class="wx-ov__add">
          <IconPlus :size="16" :style="{ strokeWidth: 2.4 }" /> Add Store</button>
        <button disabled class="wx-ov-empty__scope">
          <IconStore :size="16" /> All Stores <IconChevron :size="15" />
        </button>
      </div>
    </div>
    <div class="wx-ov__kpis">
      <div v-for="c in GHOST_KPI" :key="c.label" class="wx-ov-empty__kpi">
        <div class="wx-ov-empty__kpi-head">
          <span class="wx-ov-empty__kpi-label">{{ c.label }}</span>
          <span class="wx-ov-empty__kpi-icon">
            <component :is="c.icon" :size="18" />
          </span>
        </div>
        <div class="wx-ov-empty__kpi-value">—</div>
        <div class="wx-ov-empty__kpi-hint">{{ c.hint }}</div>
      </div>
    </div>
    <div class="wx-ov-empty__banner">
      <div class="wx-ov-empty__banner-main">
        <div class="wx-ov-empty__banner-icon">
          <IconStore :size="22" :style="{ color: OV_RED }" />
        </div>
        <div>
          <div class="wx-ov-empty__banner-title">Your dashboard is ready — no stores are live yet</div>
          <div class="wx-ov-empty__banner-text">Revenue, orders, and analytics populate the moment a store goes live and receives its first order.</div>
        </div>
      </div>
      <button @click="onGoStores" class="wx-ov-empty__banner-btn">Create a Store →</button>
    </div>
    <div class="wx-ov-empty__grid">
      <div class="wx-ov-empty__col wx-ov-empty__col--main">
        <Panel title="Dealer Profit">
          <div class="wx-ov-empty__chart">
            <div class="wx-ov-empty__chart-axis">
              <div v-for="i in [0,1,2,3,4]" :key="i" class="wx-ov-empty__chart-tick" />
            </div>
            <div class="wx-ov-empty__chart-plot">
              <div v-for="i in [0,1,2,3]" :key="i" class="wx-ov-empty__chart-grid" :style="{ top: `${(i/4)*100}%` }" />
              <div class="wx-ov-empty__chart-bars">
                <div v-for="(h, i) in GHOST_BARS" :key="i" class="wx-ov-empty__chart-col">
                  <div class="wx-ov-empty__chart-bar" :style="{ height: `${h}%` }" />
                  <span class="wx-ov-empty__chart-month">{{ GHOST_MONTHS[i] }}</span>
                </div>
              </div>
              <div class="wx-ov-empty__chart-overlay">
                <div class="wx-ov-empty__chart-icon">
                  <IconTrendUp :size="20" :style="{ color: '#c4c4c8' }" />
                </div>
                <div class="wx-ov-empty__chart-copy">
                  <div class="wx-ov-empty__chart-title">Performance Charting</div>
                  <div class="wx-ov-empty__chart-text">This space will evolve into a dynamic snapshot of your monthly team store profit margins as orders roll in.</div>
                </div>
              </div>
            </div>
          </div>
        </Panel>
        <Panel title="Top Performing Stores" action="All stores →" :onAction="onGoStores">
          <div>
            <div class="wx-ov-empty__top-head">
              <span>Store</span>
              <span class="wx-ov-empty__right">Orders</span>
              <span class="wx-ov-empty__right">Revenue</span>
              <span class="wx-ov-empty__right">Trend</span>
            </div>
            <div v-for="(w, i) in [80,65,55,45,35]" :key="i" class="wx-ov-empty__top-row">
              <div class="wx-ov-empty__top-store">
                <div class="wx-ov-empty__avatar" />
                <div class="wx-ov-empty__lines">
                  <div class="wx-ov-empty__line" :style="{ width: px(w) }" />
                  <div class="wx-ov-empty__subline" :style="{ width: px(Math.round(w * 0.6)) }" />
                </div>
              </div>
              <div class="wx-ov-empty__num">
                <div class="wx-ov-empty__num-bar wx-ov-empty__num-bar--orders" />
              </div>
              <div class="wx-ov-empty__num">
                <div class="wx-ov-empty__num-bar wx-ov-empty__num-bar--revenue" />
              </div>
              <div class="wx-ov-empty__num">
                <div class="wx-ov-empty__num-bar wx-ov-empty__num-bar--trend" />
              </div>
            </div>
            <div class="wx-ov-empty__top-foot">
              <div class="wx-ov-empty__top-foot-text">Store rankings will appear once sales begin</div>
              <button @click="onGoStores" class="wx-ov-empty__top-foot-btn">Create a Store →</button>
            </div>
          </div>
        </Panel>
      </div>
      <div class="wx-ov-empty__col">
        <Panel title="Active Ordering Windows">
          <div v-for="i in [0,1,2]" :key="i" class="wx-ov-empty__window">
            <div class="wx-ov-empty__window-head">
              <div class="wx-ov-empty__avatar" />
              <div class="wx-ov-empty__lines wx-ov-empty__lines--fill">
                <div class="wx-ov-empty__line wx-ov-empty__line--70" />
                <div class="wx-ov-empty__subline wx-ov-empty__subline--45" />
              </div>
              <div class="wx-ov-empty__pill wx-ov-empty__pill--window" />
            </div>
            <div class="wx-ov-empty__window-track" />
          </div>
          <div class="wx-ov-empty__note">Active ordering window cutoffs will organize and countdown automatically here once your stores go live.</div>
        </Panel>
        <Panel title="Roster Bank">
          <div v-for="i in [0, 1]" :key="i" class="wx-ov-empty__bank">
            <div class="wx-ov-empty__avatar" />
            <div class="wx-ov-empty__lines wx-ov-empty__lines--fill">
              <div class="wx-ov-empty__line wx-ov-empty__line--60" />
              <div class="wx-ov-empty__subline wx-ov-empty__subline--40" />
            </div>
            <div class="wx-ov-empty__pill wx-ov-empty__pill--bank" />
          </div>
          <div class="wx-ov-empty__note">Team-gear checkout captures will queue here as proposed players once buyers opt in — commit them to rosters in one click.</div>
        </Panel>
        <Panel title="Payouts">
          <div class="wx-ov-empty__pay-head">
            <div>
              <div class="wx-ov-empty__pay-amount">$—</div>
              <div class="wx-ov-empty__pay-label">Available to pay out</div>
            </div>
            <div class="wx-ov-empty__pill wx-ov-empty__pill--payout" />
          </div>
          <div v-for="label in ['Pending clearance', 'Paid this season']" :key="label" class="wx-ov-empty__pay-row">
            <span class="wx-ov-empty__pay-name">
              <span class="wx-ov-empty__pay-dot" /> {{ label }}</span>
            <span class="wx-ov-empty__pay-value">$—</span>
          </div>
          <div class="wx-ov-empty__pay-note">Payout status, pending banking clearances, and active ordering window cutoffs will organize themselves automatically right here.</div>
        </Panel>
      </div>
    </div>
  </div>
  <div v-else class="wx-ov">
    <!-- Page heading -->
    <div class="wx-ov__head">
      <div>
        <h1 class="wx-ov__title">Overview</h1>
        <div class="wx-ov__lead">Your stores at a glance: activity, performance, and what needs attention.</div>
      </div>
      <div class="wx-ov__actions">
        <button @click="onAdd" class="wx-ov__add">
          <IconPlus :size="16" :style="{ strokeWidth: 2.4 }" /> Add Store</button>
        <StoreScopeSelector :stores="stores" :scope="scope" :onChange="setScope" />
        <div class="wx-ov__search">
          <input :value="search" v-controlled="search" @input="(e) => setSearch(e.target.value)" placeholder="Search Team Stores" class="wx-ov__search-input" />
          <IconSearch :size="16" :style="{ position: 'absolute', right: '12px', color: '#9a9aa1' }" />
        </div>
      </div>
    </div>
    <!-- Quick access — frequently visited stores -->
    <FrequentlyVisitedShelf :stores="stores" :onManageStore="onManageStore" :onGoStores="onGoStores" />
    <!-- KPI row -->
    <div class="wx-ov__kpi-head">
      <span class="wx-ov__eyebrow">Performance summary</span>
      <span class="wx-ov__caption">{{ scope.size
          ? `Performance across ${scope.size} selected store${scope.size > 1 ? 's' : ''}`
          : `Performance across ${stores.length} stores${leagues.length ? ` and ${leagues.length} league${leagues.length > 1 ? 's' : ''}` : ''}` }}</span>
    </div>
    <div class="wx-ov__kpis">
      <StatCard label="Total Revenue" :value="ovFmt(totalRevenue)" delta="12.4%" deltaDir="up" sub="vs last month">
        <template #icon>
          <IconDollar :size="18" />
        </template>
      </StatCard>
      <StatCard label="Orders" :value="orders.toLocaleString()" delta="8.1%" deltaDir="up" sub="vs last month" :onClick="onViewOrders">
        <template #icon>
          <IconReceipt :size="18" />
        </template>
      </StatCard>
      <StatCard label="Active Stores" :value="String(liveCount)" :sub="`${stores.length} total`">
        <template #icon>
          <IconStore :size="18" />
        </template>
      </StatCard>
      <StatCard label="Avg. Order Value" :value="ovFmt(aov)" delta="3.2%" deltaDir="down" sub="vs last month">
        <template #icon>
          <IconWallet :size="18" />
        </template>
      </StatCard>
    </div>
    <!-- Main content — full-width stacked panels -->
    <div class="wx-ov__panels">
      <!-- Dealer-side money only — team revenue & fundraising live on each store's Reports tab. -->
      <Panel title="Revenue &amp; Dealer Profit" subtitle="Gross revenue across all stores vs. dealer profit — revenue minus manufacturing cost (COGS), platform fee, sales tax, and team fundraising.">
        <template #right>
          <RevenueScaleToggle :scale="moneyScale" :onChange="setMoneyScale" />
        </template>
        <RevenueProfitChart :totalRevenue="totalRevenue" :scale="moneyScale" />
      </Panel>
      <Panel title="Top Performing Stores" action="All stores →" :onAction="onGoStores">
        <div>
          <!-- head -->
          <div class="wx-ov-top__head">
            <TopSortHead label="Store" sortKey="name" :sort="topSort" :onSort="toggleTopSort" />
            <TopSortHead label="Store Created" sortKey="created" :sort="topSort" :onSort="toggleTopSort" />
            <TopSortHead label="Orders" sortKey="orders" :sort="topSort" :onSort="toggleTopSort" align="right" :pad="24" />
            <TopSortHead label="Revenue" sortKey="revenue" :sort="topSort" :onSort="toggleTopSort" align="right" :pad="24" />
            <TopSortHead label="Avg. Order Value" sortKey="aov" :sort="topSort" :onSort="toggleTopSort" align="right" :pad="24" />
            <TopSortHead label="% of Total Rev." sortKey="pctOfTotal" :sort="topSort" :onSort="toggleTopSort" align="right" />
            <TopSortHead label="Completion" sortKey="completion" :sort="topSort" :onSort="toggleTopSort" align="right" />
            <TopSortHead label="Trend" sortKey="trend" :sort="topSort" :onSort="toggleTopSort" align="right" />
          </div>
          <button v-for="s in sortedTop" :key="s.id" @click="() => onManageStore && onManageStore(s.id)" class="wx-ov-top__row" @mouseenter="(e) => (e.currentTarget.style.background = '#fafafb')" @mouseleave="(e) => (e.currentTarget.style.background = 'transparent')">
            <span class="wx-ov-top__store">
              <span class="wx-ov-avatar" :style="{ background: s.color }">{{ s.mono }}</span>
              <span class="wx-ov-top__name-wrap">
                <span class="wx-ov-top__name">{{ s.name }}</span>
                <span class="wx-ov-top__sport">{{ s.sport }}</span>
              </span>
            </span>
            <span class="wx-ov-top__created">{{ s.created }}</span>
            <span class="wx-ov-top__num">{{ s.orders }}</span>
            <span class="wx-ov-top__num wx-ov-top__num--strong">{{ ovFmt(s.revenue) }}</span>
            <span class="wx-ov-top__num">{{ ovFmt(s.aov) }}</span>
            <span class="wx-ov-top__meter">
              <span class="wx-ov-top__meter-value">{{ s.pctOfTotal.toFixed(1) }}%</span>
              <span class="wx-ov-top__bar">
                <span class="wx-ov-top__fill" :style="{ width: `${Math.min(s.pctOfTotal, 100)}%` }" />
              </span>
            </span>
            <span class="wx-ov-top__meter">
              <span class="wx-ov-top__meter-value">{{ s.completion }}% <span class="wx-ov-top__meter-note">· {{ s.rosterOrdered }}/{{ s.rosterSize }}</span>
              </span>
              <span class="wx-ov-top__bar">
                <span :class="`wx-ov-top__fill ${s.completion >= 80 ? 'wx-ov-top__fill--done' : 'wx-ov-top__fill--short'}`" :style="{ width: `${Math.min(s.completion, 100)}%` }" />
              </span>
            </span>
            <span :class="`wx-ov-top__trend ${s.trend >= 0 ? 'wx-ov-top__trend--up' : 'wx-ov-top__trend--down'}`">
              <IconTrendUp v-if="s.trend >= 0" :size="14" />
              <IconTrendDown v-else :size="14" />{{ Math.abs(s.trend) }}%</span>
          </button>
          <div v-if="top.length === 0" class="wx-ov-top__none">No stores yet.</div>
        </div>
      </Panel>
      <Panel title="Active Ordering Windows">
        <template v-if="windows.length">
          <OrderingWindowRow v-for="w in windows" :key="w.id" v-bind="w" />
        </template>
        <div v-else class="wx-ov__none">No open windows.</div>
        <div class="wx-ov__panel-foot">
          <IconClock :size="14" /> {{ windows.length }} window{{ windows.length === 1 ? '' : 's' }} open now</div>
      </Panel>
      <Panel title="Roster Bank" subtitle="Checkout captures awaiting roster review" :style="{ marginTop: '16px' }">
        <template v-if="bankRows.length">
          <RosterBankRow v-for="b in bankRows" :key="b.id" v-bind="b" :onReview="() => onManageStore && onManageStore(b.id, 'roster')" />
        </template>
        <div v-else class="wx-ov__none">No captures waiting — team-gear orders with roster opt-in land here.</div>
        <div class="wx-ov__panel-foot">
          <IconBankInbox :size="14" /> {{ bankTotal }} proposed player{{ bankTotal === 1 ? '' : 's' }} across {{ bankRows.length }} store{{ bankRows.length === 1 ? '' : 's' }} — commit them in My Teams</div>
      </Panel>
    </div>
  </div>
</template>

<script>
import { INTEGRATION } from '../../integration.js';
import { bankSeedCounts, ovFmt } from '../../lib/overview.js';
import { BAYSHORE_BANK_SEED, WASATCH_BANK_SEED } from '../../seed/rosters.js';
import { OV_RED } from '../../theme.js';
import { px } from '../../lib/style.js';
import IconBankInbox from '../common/IconBankInbox.vue';
import { IconChevron, IconClock, IconDollar, IconPlus, IconReceipt, IconSearch, IconStore, IconTrendDown, IconTrendUp, IconWallet } from '../icons.js';
import FrequentlyVisitedShelf from './FrequentlyVisitedShelf.vue';
import OrderingWindowRow from './OrderingWindowRow.vue';
import Panel from './Panel.vue';
import RevenueProfitChart from './RevenueProfitChart.vue';
import RevenueScaleToggle from './RevenueScaleToggle.vue';
import RosterBankRow from './RosterBankRow.vue';
import StatCard from './StatCard.vue';
import StoreScopeSelector from './StoreScopeSelector.vue';
import TopSortHead from './TopSortHead.vue';
import { markRaw } from 'vue';

const GHOST_BARS = [32, 48, 68, 42, 58, 78, 88, 92, 55];
const GHOST_MONTHS = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const GHOST_KPI = markRaw([
  { label: "Total Revenue", icon: IconDollar, hint: "Your total cumulative payout revenue and performance trends will track here in real time." },
  { label: "Orders", icon: IconReceipt, hint: "Order volume across all active stores will accumulate and display here as your athletes shop." },
  { label: "Active Stores", icon: IconStore, hint: "The count of live, order-accepting stores in your portfolio will reflect here automatically." },
  { label: "Avg. Order Value", icon: IconWallet, hint: "Average dollars spent per order — a key indicator of athlete basket size — will populate here." },
]);

export default {
  name: 'OverviewDashboard',
  components: {
    FrequentlyVisitedShelf, IconBankInbox, IconChevron, IconClock, IconDollar, IconPlus, IconReceipt, IconSearch, IconStore, IconTrendDown, IconTrendUp, IconWallet,
    OrderingWindowRow, Panel, RevenueProfitChart, RevenueScaleToggle, RosterBankRow, StatCard, StoreScopeSelector, TopSortHead,
  },
  props: {
    stores: { type: Array, default: () => [] },
    leagues: { type: Array, default: () => [] },
    onManageStore: { type: Function, default: undefined },
    onGoStores: { type: Function, default: undefined },
    onViewOrders: { type: Function, default: undefined },
    onAdd: { type: Function, default: undefined },
    isEmpty: { type: Boolean, default: false },
  },
  data() {
    return {
      INT: INTEGRATION.on, OV_RED, GHOST_BARS, GHOST_MONTHS, GHOST_KPI,
      // #9 — multi-select store scope. Empty = all stores (default). Selecting a subset recomputes
      // every KPI / panel below against just those stores.
      search: "",
      scope: new Set(),
      moneyScale: "month",
      topSort: { key: "revenue", dir: "desc" },
    };
  },
  computed: {
    scoped() { return this.scope.size ? this.stores.filter((s) => this.scope.has(s.id)) : this.stores; },
    totalRevenue() { return this.scoped.reduce((s, x) => s + (x.revenue || 0), 0) || 18420; },
    // Profit = gross revenue minus COGS, platform fee, sales tax, and team fundraising (when
    // applicable). Modeled here at a blended ~34% net margin. Computed but not shown, as in the prototype.
    totalProfit() { return Math.round(this.totalRevenue * 0.34); },
    liveCount() { return this.scoped.filter((s) => s.live || s.status === "active").length || this.scoped.length; },
    orders() { return Math.max(Math.round(this.totalRevenue / 46), this.scoped.length * 8); },
    aov() { return this.orders ? this.totalRevenue / this.orders : 0; },
    // Active ordering windows (set-window stores not yet closed).
    windows() {
      const today = new Date("2026-06-04");
      // Staggered seed windows — distinct start dates per team, spans of 30 / 60 / 90 days.
      const seedWinStart = ["2026-05-20", "2026-05-01", "2026-04-10", "2026-05-25"];
      const seedWinSpan = [30, 60, 90, 60];
      return this.scoped
        .map((s, i) => {
          const startISO = s.storeOpenStart || seedWinStart[i % 4];
          const start = new Date(startISO);
          const end = s.storeOpenEnd
            ? new Date(s.storeOpenEnd)
            : new Date(new Date(startISO).getTime() + seedWinSpan[i % 4] * 86400000);
          const total = Math.max((end - start) / 86400000, 1);
          const elapsed = Math.min(Math.max((today - start) / 86400000, 0), total);
          const daysLeft = Math.max(Math.round((end - today) / 86400000), 0);
          return {
            id: s.id,
            name: s.teamName || s.storeTitle,
            color: s.teamColors?.[0] || "#1d3a8a",
            mono: (s.teamName || s.storeTitle || "T").slice(0, 2).toUpperCase(),
            pct: Math.round((elapsed / total) * 100),
            daysLeft,
            raised: s.revenue || 0,
            startDate: start,
            endDate: end,
          };
        })
        .sort((a, b) => a.daysLeft - b.daysLeft)
        .slice(0, 4);
    },
    // Roster Bank rollup — proposed players waiting in each store's bank zone (seeded captures + live
    // storefront captures from the consent-gated gate). The prototype reads the live captures from
    // localStorage on every render; here they are read when the stores or the scope change.
    bankRows() {
      let liveCaps = 0;
      try { liveCaps = (JSON.parse(localStorage.getItem("prolook_bank_captures_v1") || "[]") || []).length; } catch (e) {}
      return this.scoped.map((s) => {
        const prof = s.rosterProfile;
        const bulk = prof === "teams-only" ? { ...bankSeedCounts(WASATCH_BANK_SEED), team: "18 teams mapped · no rosters yet · " + (s.sport || "—") }
          : prof === "unstructured" ? { ...bankSeedCounts(BAYSHORE_BANK_SEED), team: "No teams set up · team gear locked" } : null;
        return {
          id: s.id,
          name: s.teamName || s.storeTitle,
          color: s.teamColors?.[0] || "#1d3a8a",
          mono: (s.teamName || s.storeTitle || "T").slice(0, 2).toUpperCase(),
          team: bulk ? bulk.team : ((s.storeType || "league") === "league" ? (INTEGRATION.on ? "10U Knights" : "Lone Peak 8U") : (s.teamName || "Team Roster")) + " · " + (s.sport || "—"),
          proposed: bulk ? bulk.proposed : 4 + liveCaps,
          captures: bulk ? bulk.captures : 6 + liveCaps,
        };
      }).sort((a, b) => b.proposed - a.proposed).slice(0, 4);
    },
    bankTotal() { return this.bankRows.reduce((n, b) => n + b.proposed, 0); },
    // Top stores leaderboard
    top() {
      const { totalRevenue } = this;
      return [...this.scoped]
        .sort((a, b) => (b.revenue || 0) - (a.revenue || 0))
        .slice(0, 5)
        .map((s, i) => {
          const rev = s.revenue || 0;
          const ords = Math.round(rev / 44) + 6;
          const rosterSize = [58, 55, 62, 48, 40][i] ?? 50;
          const ordered = [92, 85, 78, 71, 64][i] ?? 60;
          const seedCreated = ["2026-01-14", "2026-02-03", "2026-02-27", "2026-03-19", "2026-04-08"];
          const createdISO = s.createdDate || s.storeOpenStart || seedCreated[i % 5];
          const created = new Date(createdISO).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
          const createdTs = new Date(createdISO).getTime();
          return {
            id: s.id,
            name: s.teamName || s.storeTitle,
            color: s.teamColors?.[0] || "#1d3a8a",
            mono: (s.teamName || s.storeTitle || "T").slice(0, 2).toUpperCase(),
            sport: s.sport || "—",
            created,
            createdTs,
            orders: ords,
            revenue: rev,
            aov: ords ? rev / ords : 0,
            pctOfTotal: totalRevenue ? (rev / totalRevenue) * 100 : 0,
            rosterSize,
            rosterOrdered: Math.round((ordered / 100) * rosterSize),
            completion: ordered,
            trend: [12.4, 8.1, -3.2, 5.6, 2.1][i] ?? 1.0,
          };
        });
    },
    sortedTop() {
      const { key, dir } = this.topSort;
      const mul = dir === "asc" ? 1 : -1;
      return [...this.top].sort((a, b) => {
        if (key === "name") return a.name.localeCompare(b.name) * mul;
        const ka = key === "created" ? a.createdTs : a[key];
        const kb = key === "created" ? b.createdTs : b[key];
        return ((ka || 0) - (kb || 0)) * mul;
      });
    },
  },
  methods: {
    px,
    ovFmt,
    setSearch(v) { this.search = v; },
    setScope(v) { this.scope = v; },
    setMoneyScale(v) { this.moneyScale = v; },
    toggleTopSort(key) {
      const s = this.topSort;
      this.topSort = s.key === key ? { key, dir: s.dir === "desc" ? "asc" : "desc" } : { key, dir: "desc" };
    },
  },
};
</script>
