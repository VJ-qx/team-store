<!-- Converted from workspace-app.jsx / workspace-app-integrated.jsx: OverviewDashboard — the workspace
     Overview: Frequently Visited, KPIs, revenue chart, top stores, ordering windows and roster bank.
     isEmpty shows the empty-state variant. -->
<template>
  <div v-if="isEmpty" :style="{ flex: 1, minWidth: '0', padding: '28px 32px 80px', background: '#fbfbfc' }">
    <div :style="{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '24px' }">
      <div>
        <h1 :style="{ fontFamily: 'Archivo, sans-serif', fontSize: INT ? '24px' : '27px', fontWeight: 800, margin: '0', color: OV_INK, letterSpacing: INT ? '-.3px' : '-.01em' }">Overview</h1>
        <div :style="{ fontSize: '14px', color: OV_MUTED, marginTop: '4px' }">Launch your first store to start tracking performance</div>
      </div>
      <div :style="{ display: 'flex', alignItems: 'center', gap: '12px' }">
        <button @click="onAdd" :style="{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: OV_INK, border: '0', borderRadius: '8px', padding: '12px 16px', cursor: 'pointer', fontSize: '13.5px', fontWeight: 700, color: '#fff' }">
          <IconPlus :size="16" :style="{ strokeWidth: 2.4 }" /> Add Store</button>
        <button disabled :style="{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#f5f5f7', border: '1px solid #ececf0', borderRadius: '8px', padding: '12px 16px', cursor: 'not-allowed', fontSize: '13.5px', fontWeight: 600, color: '#c4c4c8' }">
          <IconStore :size="16" /> All Stores <IconChevron :size="15" />
        </button>
      </div>
    </div>
    <div :style="{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '16px' }">
      <div v-for="c in GHOST_KPI" :key="c.label" :style="{ background: '#fff', border: `1px solid ${OV_LINE}`, borderRadius: '12px', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }">
        <div :style="{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }">
          <span :style="{ fontSize: '12px', fontWeight: 700, letterSpacing: '.07em', color: '#c4c4c8', textTransform: 'uppercase' }">{{ c.label }}</span>
          <span :style="{ width: '36px', height: '36px', borderRadius: '9px', background: '#f5f5f7', color: '#d4d4d8', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }">
            <component :is="c.icon" :size="18" />
          </span>
        </div>
        <div :style="{ fontFamily: 'Archivo, sans-serif', fontSize: '32px', fontWeight: 800, color: '#d8d8dc', lineHeight: 1, letterSpacing: '-.01em' }">—</div>
        <div :style="{ fontSize: '12px', color: '#c4c4c8' }">{{ c.hint }}</div>
      </div>
    </div>
    <div :style="{ background: '#fff', border: `1px solid ${OV_LINE}`, borderRadius: '12px', padding: '20px 24px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }">
      <div :style="{ display: 'flex', alignItems: 'center', gap: '16px' }">
        <div :style="{ width: '44px', height: '44px', borderRadius: '10px', background: '#fff0ef', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }">
          <IconStore :size="22" :style="{ color: OV_RED }" />
        </div>
        <div>
          <div :style="{ fontSize: '15px', fontWeight: 800, color: OV_INK, marginBottom: '4px' }">Your dashboard is ready — no stores are live yet</div>
          <div :style="{ fontSize: '13.5px', color: OV_MUTED }">Revenue, orders, and analytics populate the moment a store goes live and receives its first order.</div>
        </div>
      </div>
      <button @click="onGoStores" :style="{ flexShrink: 0, background: OV_INK, color: '#fff', border: '0', borderRadius: '8px', padding: '12px 24px', fontSize: '13.5px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }">Create a Store →</button>
    </div>
    <div :style="{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 380px', gap: '16px', alignItems: 'start' }">
      <div :style="{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '0' }">
        <Panel title="Dealer Profit">
          <div :style="{ position: 'relative', height: '260px', paddingLeft: '48px', paddingBottom: '28px' }">
            <div :style="{ position: 'absolute', left: '0', top: '0', bottom: '28px', width: '44px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end' }">
              <div v-for="i in [0,1,2,3,4]" :key="i" :style="{ width: '28px', height: '12px', background: '#ebebed', borderRadius: '4px' }" />
            </div>
            <div :style="{ position: 'relative', height: '100%', borderLeft: `1px solid ${OV_LINE}`, borderBottom: `1px solid ${OV_LINE}` }">
              <div v-for="i in [0,1,2,3]" :key="i" :style="{ position: 'absolute', left: '0', right: '0', top: `${(i/4)*100}%`, borderTop: '1px dashed #f1f1f3' }" />
              <div :style="{ position: 'absolute', inset: '8px 8px 0', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '12px' }">
                <div v-for="(h, i) in GHOST_BARS" :key="i" :style="{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }">
                  <div :style="{ width: '100%', maxWidth: '32px', height: `${h}%`, borderRadius: '5px', background: '#ebebed' }" />
                  <span :style="{ fontSize: '11px', color: '#d4d4d8', position: 'absolute', bottom: '-24px' }">{{ GHOST_MONTHS[i] }}</span>
                </div>
              </div>
              <div :style="{ position: 'absolute', inset: '0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }">
                <div :style="{ width: '40px', height: '40px', borderRadius: '10px', background: '#f5f5f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }">
                  <IconTrendUp :size="20" :style="{ color: '#c4c4c8' }" />
                </div>
                <div :style="{ textAlign: 'center' }">
                  <div :style="{ fontSize: '14px', fontWeight: 700, color: OV_INK, marginBottom: '8px' }">Performance Charting</div>
                  <div :style="{ fontSize: '12.5px', color: OV_MUTED, maxWidth: '280px', lineHeight: 1.55 }">This space will evolve into a dynamic snapshot of your monthly team store profit margins as orders roll in.</div>
                </div>
              </div>
            </div>
          </div>
        </Panel>
        <Panel title="Top Performing Stores" action="All stores →" :onAction="onGoStores">
          <div>
            <div :style="{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 0.8fr', gap: '12px', padding: '0 0 12px', borderBottom: `1px solid ${OV_LINE}`, fontSize: '11.5px', fontWeight: 700, letterSpacing: '.05em', color: '#c4c4c8', textTransform: 'uppercase' }">
              <span>Store</span>
              <span :style="{ textAlign: 'right' }">Orders</span>
              <span :style="{ textAlign: 'right' }">Revenue</span>
              <span :style="{ textAlign: 'right' }">Trend</span>
            </div>
            <div v-for="(w, i) in [80,65,55,45,35]" :key="i" :style="{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 0.8fr', gap: '12px', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f4f4f6' }">
              <div :style="{ display: 'inline-flex', alignItems: 'center', gap: '12px' }">
                <div :style="{ width: '32px', height: '32px', borderRadius: '50%', background: '#ebebed', flexShrink: 0 }" />
                <div :style="{ display: 'flex', flexDirection: 'column', gap: '4px' }">
                  <div :style="{ width: px(w), height: '12px', background: '#ebebed', borderRadius: '4px' }" />
                  <div :style="{ width: px(Math.round(w * 0.6)), height: '8px', background: '#f1f1f3', borderRadius: '4px' }" />
                </div>
              </div>
              <div :style="{ display: 'flex', justifyContent: 'flex-end' }">
                <div :style="{ width: '28px', height: '12px', background: '#ebebed', borderRadius: '4px' }" />
              </div>
              <div :style="{ display: 'flex', justifyContent: 'flex-end' }">
                <div :style="{ width: '48px', height: '12px', background: '#ebebed', borderRadius: '4px' }" />
              </div>
              <div :style="{ display: 'flex', justifyContent: 'flex-end' }">
                <div :style="{ width: '32px', height: '12px', background: '#ebebed', borderRadius: '4px' }" />
              </div>
            </div>
            <div :style="{ padding: '24px 0 8px', textAlign: 'center' }">
              <div :style="{ fontSize: '13.5px', color: OV_MUTED, marginBottom: '12px' }">Store rankings will appear once sales begin</div>
              <button @click="onGoStores" :style="{ background: 'transparent', border: `1px solid ${OV_LINE}`, borderRadius: '7px', padding: '8px 16px', fontSize: '13px', fontWeight: 700, color: OV_INK, cursor: 'pointer' }">Create a Store →</button>
            </div>
          </div>
        </Panel>
      </div>
      <div :style="{ display: 'flex', flexDirection: 'column', gap: '16px' }">
        <Panel title="Active Ordering Windows">
          <div v-for="i in [0,1,2]" :key="i" :style="{ padding: '16px 0', borderBottom: `1px solid ${OV_LINE}` }">
            <div :style="{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }">
              <div :style="{ width: '32px', height: '32px', borderRadius: '50%', background: '#ebebed', flexShrink: 0 }" />
              <div :style="{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }">
                <div :style="{ width: '70%', height: '12px', background: '#ebebed', borderRadius: '4px' }" />
                <div :style="{ width: '45%', height: '8px', background: '#f1f1f3', borderRadius: '4px' }" />
              </div>
              <div :style="{ width: '36px', height: '24px', background: '#f1f1f3', borderRadius: '999px' }" />
            </div>
            <div :style="{ height: '8px', borderRadius: '999px', background: '#f1f1f3' }" />
          </div>
          <div :style="{ padding: '16px 0 4px', fontSize: '12.5px', color: OV_MUTED, lineHeight: 1.6 }">Active ordering window cutoffs will organize and countdown automatically here once your stores go live.</div>
        </Panel>
        <Panel title="Roster Bank">
          <div v-for="i in [0, 1]" :key="i" :style="{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 0', borderBottom: `1px solid ${OV_LINE}` }">
            <div :style="{ width: '32px', height: '32px', borderRadius: '50%', background: '#ebebed', flexShrink: 0 }" />
            <div :style="{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }">
              <div :style="{ width: '60%', height: '12px', background: '#ebebed', borderRadius: '4px' }" />
              <div :style="{ width: '40%', height: '8px', background: '#f1f1f3', borderRadius: '4px' }" />
            </div>
            <div :style="{ width: '84px', height: '24px', background: '#f1f1f3', borderRadius: '999px' }" />
          </div>
          <div :style="{ padding: '16px 0 4px', fontSize: '12.5px', color: OV_MUTED, lineHeight: 1.6 }">Team-gear checkout captures will queue here as proposed players once buyers opt in — commit them to rosters in one click.</div>
        </Panel>
        <Panel title="Payouts">
          <div :style="{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '16px' }">
            <div>
              <div :style="{ fontFamily: 'Archivo, sans-serif', fontSize: '26px', fontWeight: 800, color: '#d8d8dc', lineHeight: 1 }">$—</div>
              <div :style="{ fontSize: '12px', color: '#c4c4c8', marginTop: '4px' }">Available to pay out</div>
            </div>
            <div :style="{ width: '64px', height: '24px', background: '#f1f1f3', borderRadius: '999px' }" />
          </div>
          <div v-for="label in ['Pending clearance', 'Paid this season']" :key="label" :style="{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f4f4f6', fontSize: '13px' }">
            <span :style="{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#c4c4c8' }">
              <span :style="{ width: '8px', height: '8px', borderRadius: '50%', background: '#d8d8dc' }" /> {{ label }}</span>
            <span :style="{ fontWeight: 700, color: '#d8d8dc' }">$—</span>
          </div>
          <div :style="{ marginTop: '8px', paddingTop: '16px', borderTop: `1px solid ${OV_LINE}`, fontSize: '12.5px', color: '#9a9aa1', lineHeight: 1.6 }">Payout status, pending banking clearances, and active ordering window cutoffs will organize themselves automatically right here.</div>
        </Panel>
      </div>
    </div>
  </div>
  <div v-else :style="{ flex: 1, minWidth: '0', padding: '28px max(32px, calc((100% - 1376px)/2)) 80px', background: '#fbfbfc' }">
    <!-- Page heading -->
    <div :style="{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '24px' }">
      <div>
        <h1 :style="{ fontFamily: 'Archivo, sans-serif', fontSize: '24px', fontWeight: 800, margin: '0 0 8px', color: OV_INK, letterSpacing: '-.3px' }">Overview</h1>
        <div :style="{ fontSize: '14px', color: OV_MUTED }">Your stores at a glance: activity, performance, and what needs attention.</div>
      </div>
      <div :style="{ display: 'flex', alignItems: 'center', gap: '12px' }">
        <button @click="onAdd" :style="{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: OV_INK, border: '0', borderRadius: '8px', padding: '12px 16px', cursor: 'pointer', fontSize: '13.5px', fontWeight: 700, color: '#fff' }">
          <IconPlus :size="16" :style="{ strokeWidth: 2.4 }" /> Add Store</button>
        <StoreScopeSelector :stores="stores" :scope="scope" :onChange="setScope" />
        <div :style="{ position: 'relative', display: 'flex', alignItems: 'center', minWidth: '240px', border: '1px solid #d8d8de', borderRadius: '8px', background: '#fff' }">
          <input :value="search" v-controlled="search" @input="(e) => setSearch(e.target.value)" placeholder="Search Team Stores" :style="{ width: '100%', border: '0', outline: '0', background: 'transparent', padding: '12px 40px 12px 16px', fontSize: '13.5px' }" />
          <IconSearch :size="16" :style="{ position: 'absolute', right: '12px', color: '#9a9aa1' }" />
        </div>
      </div>
    </div>
    <!-- Quick access — frequently visited stores -->
    <FrequentlyVisitedShelf :stores="stores" :onManageStore="onManageStore" :onGoStores="onGoStores" />
    <!-- KPI row -->
    <div :style="{ paddingTop: '8px', display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '10px' }">
      <span :style="{ fontSize: '12px', fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', color: OV_MUTED }">Performance summary</span>
      <span :style="{ fontSize: '11.5px', color: '#9a9aa1' }">{{ scope.size
          ? `Performance across ${scope.size} selected store${scope.size > 1 ? 's' : ''}`
          : `Performance across ${stores.length} stores${leagues.length ? ` and ${leagues.length} league${leagues.length > 1 ? 's' : ''}` : ''}` }}</span>
    </div>
    <div :style="{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '16px' }">
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
    <div :style="{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '0' }">
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
          <div :style="{ display: 'grid', gridTemplateColumns: 'minmax(190px,1.8fr) repeat(7, 1fr)', gap: '12px', padding: '0 0 12px', borderBottom: `1px solid ${OV_LINE}`, fontSize: '11px', fontWeight: 700, letterSpacing: '.05em', color: OV_MUTED, textTransform: 'uppercase' }">
            <TopSortHead label="Store" sortKey="name" :sort="topSort" :onSort="toggleTopSort" />
            <TopSortHead label="Store Created" sortKey="created" :sort="topSort" :onSort="toggleTopSort" />
            <TopSortHead label="Orders" sortKey="orders" :sort="topSort" :onSort="toggleTopSort" align="right" :pad="24" />
            <TopSortHead label="Revenue" sortKey="revenue" :sort="topSort" :onSort="toggleTopSort" align="right" :pad="24" />
            <TopSortHead label="Avg. Order Value" sortKey="aov" :sort="topSort" :onSort="toggleTopSort" align="right" :pad="24" />
            <TopSortHead label="% of Total Rev." sortKey="pctOfTotal" :sort="topSort" :onSort="toggleTopSort" align="right" />
            <TopSortHead label="Completion" sortKey="completion" :sort="topSort" :onSort="toggleTopSort" align="right" />
            <TopSortHead label="Trend" sortKey="trend" :sort="topSort" :onSort="toggleTopSort" align="right" />
          </div>
          <button v-for="s in sortedTop" :key="s.id" @click="() => onManageStore && onManageStore(s.id)" v-patch-style="{ width: '100%', textAlign: 'left', background: 'transparent', border: '0', cursor: 'pointer', display: 'grid', gridTemplateColumns: 'minmax(190px,1.8fr) repeat(7, 1fr)', gap: '12px', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid #f4f4f6' }" @mouseenter="(e) => (e.currentTarget.style.background = '#fafafb')" @mouseleave="(e) => (e.currentTarget.style.background = 'transparent')">
            <span :style="{ display: 'inline-flex', alignItems: 'center', gap: '12px', minWidth: '0' }">
              <span :style="{ width: '32px', height: '32px', borderRadius: '50%', background: s.color, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '11px', flexShrink: 0 }">{{ s.mono }}</span>
              <span :style="{ minWidth: '0' }">
                <span :style="{ display: 'block', fontSize: '13.5px', fontWeight: 700, color: OV_INK, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }">{{ s.name }}</span>
                <span :style="{ display: 'block', fontSize: '12px', color: OV_MUTED }">{{ s.sport }}</span>
              </span>
            </span>
            <span :style="{ fontSize: '13px', color: OV_MUTED, fontFamily: 'JetBrains Mono, monospace' }">{{ s.created }}</span>
            <span :style="{ textAlign: 'right', paddingRight: '24px', fontSize: '13.5px', color: OV_INK, fontFamily: 'JetBrains Mono, monospace' }">{{ s.orders }}</span>
            <span :style="{ textAlign: 'right', paddingRight: '24px', fontSize: '13.5px', fontWeight: 700, color: OV_INK, fontFamily: 'JetBrains Mono, monospace' }">{{ ovFmt(s.revenue) }}</span>
            <span :style="{ textAlign: 'right', paddingRight: '24px', fontSize: '13.5px', color: OV_INK, fontFamily: 'JetBrains Mono, monospace' }">{{ ovFmt(s.aov) }}</span>
            <span :style="{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }">
              <span :style="{ fontSize: '13px', color: OV_INK, fontFamily: 'JetBrains Mono, monospace' }">{{ s.pctOfTotal.toFixed(1) }}%</span>
              <span :style="{ width: '70%', height: '4px', borderRadius: '999px', background: '#f1f1f3', overflow: 'hidden' }">
                <span :style="{ display: 'block', width: `${Math.min(s.pctOfTotal, 100)}%`, height: '100%', borderRadius: '999px', background: OV_INK }" />
              </span>
            </span>
            <span :style="{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }">
              <span :style="{ fontSize: '13px', color: OV_INK, fontFamily: 'JetBrains Mono, monospace' }">{{ s.completion }}% <span :style="{ color: OV_MUTED, fontFamily: 'inherit', fontSize: '11.5px' }">· {{ s.rosterOrdered }}/{{ s.rosterSize }}</span>
              </span>
              <span :style="{ width: '70%', height: '4px', borderRadius: '999px', background: '#f1f1f3', overflow: 'hidden' }">
                <span :style="{ display: 'block', width: `${Math.min(s.completion, 100)}%`, height: '100%', borderRadius: '999px', background: s.completion >= 80 ? OV_GREEN : '#e0a92b' }" />
              </span>
            </span>
            <span :style="{ textAlign: 'right', fontSize: '12.5px', fontWeight: 700, color: s.trend >= 0 ? OV_GREEN : OV_RED, display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }">
              <IconTrendUp v-if="s.trend >= 0" :size="14" />
              <IconTrendDown v-else :size="14" />{{ Math.abs(s.trend) }}%</span>
          </button>
          <div v-if="top.length === 0" :style="{ padding: '32px 0', textAlign: 'center', color: OV_MUTED, fontSize: '13px' }">No stores yet.</div>
        </div>
      </Panel>
      <Panel title="Active Ordering Windows">
        <template v-if="windows.length">
          <OrderingWindowRow v-for="w in windows" :key="w.id" v-bind="w" />
        </template>
        <div v-else :style="{ padding: '24px 0', textAlign: 'center', color: OV_MUTED, fontSize: '13px' }">No open windows.</div>
        <div :style="{ paddingTop: '16px', fontSize: '12.5px', color: OV_MUTED, display: 'flex', alignItems: 'center', gap: '8px' }">
          <IconClock :size="14" /> {{ windows.length }} window{{ windows.length === 1 ? '' : 's' }} open now</div>
      </Panel>
      <Panel title="Roster Bank" subtitle="Checkout captures awaiting roster review" :style="{ marginTop: '16px' }">
        <template v-if="bankRows.length">
          <RosterBankRow v-for="b in bankRows" :key="b.id" v-bind="b" :onReview="() => onManageStore && onManageStore(b.id, 'roster')" />
        </template>
        <div v-else :style="{ padding: '24px 0', textAlign: 'center', color: OV_MUTED, fontSize: '13px' }">No captures waiting — team-gear orders with roster opt-in land here.</div>
        <div :style="{ paddingTop: '16px', fontSize: '12.5px', color: OV_MUTED, display: 'flex', alignItems: 'center', gap: '8px' }">
          <IconBankInbox :size="14" /> {{ bankTotal }} proposed player{{ bankTotal === 1 ? '' : 's' }} across {{ bankRows.length }} store{{ bankRows.length === 1 ? '' : 's' }} — commit them in My Teams</div>
      </Panel>
    </div>
  </div>
</template>

<script>
import { INTEGRATION } from '../../../utils/integration.js';
import { BAYSHORE_BANK_SEED, bankSeedCounts, ovFmt, OV_GREEN, OV_INK, OV_LINE, OV_MUTED, OV_RED, WASATCH_BANK_SEED } from './overview.js';
import { px } from '../../../utils/style.js';
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
      INT: INTEGRATION.on, OV_GREEN, OV_INK, OV_LINE, OV_MUTED, OV_RED, GHOST_BARS, GHOST_MONTHS, GHOST_KPI,
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
