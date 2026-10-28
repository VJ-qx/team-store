<!-- Converted from workspace-app.jsx / workspace-app-integrated.jsx: HomeTab — a store's Home tab: the status
     strip, "Needs your attention", "Recently worked on", the manager panel, and the right rail (In your
     store, League structure, Brand assets, the setup-guide link). -->
<template>
  <div data-screen-label="Home" class="wx-store-home">
    <!-- Status strip — the one place amber is allowed (canonical Closed pill). -->
    <div class="wx-store-home__status">
      <span :class="`wx-store-home__pill wx-store-home__pill--${pill.mod}`">
        <span class="wx-store-home__pill-dot" />{{ pill.label }}</span>
      <span v-if="lc.open && close" class="wx-store-home__meta">Closes <strong class="wx-store-home__strong">{{ close.label }}</strong> · {{ close.daysLeft }} days left</span>
      <span v-if="lc.closed && close" class="wx-store-home__meta">Closed <strong class="wx-store-home__strong">{{ close.label }}</strong></span>
      <span v-if="!lc.draft" class="wx-store-home__divider" />
      <span v-if="!lc.draft" class="wx-store-home__meta"><strong class="wx-store-home__strong">{{ oi.total }}</strong> orders · <strong class="wx-store-home__strong">{{ fmtMoney(raised) }}</strong> raised{{ lc.open ? " this window" : "" }}</span>
      <span class="wx-store-home__url">{{ url }}<button v-if="!readOnly" @click="copyUrl" class="wx-store-home__copy">{{ copied ? "Copied" : "Copy" }}</button></span>
    </div>
    <div class="wx-store-home__columns">
      <!-- Main column -->
      <div class="wx-store-home__main">
        <!-- Needs your attention — always renders, even empty. -->
        <div class="wx-store-home__section">
          <div class="wx-store-home__section-head">
            <span class="wx-store-home__section-title">Needs your attention</span>
            <span v-if="cards.length > 0" class="wx-store-home__count">{{ cards.length }}</span>
          </div>
          <HomeAttentionCard v-for="(card, i) in visible" :key="i" :card="card" :readOnly="readOnly" :onAction="() => run(card)" />
          <button v-if="hiddenCount > 0" @click="() => setShowAll(true)" class="wx-store-home__more">{{ hiddenCount }} more</button>
          <div v-if="cards.length === 0" class="wx-store-home__empty">{{ lc.archived ? "This store is archived and read-only — nothing is awaiting action." : lc.open ? "Nothing needs your attention right now. The store is open and taking orders." : "Nothing needs your attention right now." }}</div>
        </div>
        <!-- Recently worked on — absent entirely when there is nothing to show. -->
        <div v-if="trail.length > 0" class="wx-store-home__section">
          <span class="wx-store-home__section-title">Recently worked on</span>
          <div class="wx-store-home__panel">
            <div v-for="(r, i) in trail" :key="i" :class="`wx-store-home__trail-row${i < trail.length - 1 ? '' : ' wx-store-home__trail-row--last'}`">
              <span class="wx-store-home__trail-icon">
                <IconShirt v-if="r.icon === 'shirt'" :size="15" />
                <IconSettings v-else-if="r.icon === 'settings'" :size="15" />
                <IconUsers v-else :size="15" />
              </span>
              <div class="wx-store-home__row-text">
                <div class="wx-store-home__trail-name">{{ r.name }}</div>
                <div class="wx-store-home__row-sub">{{ r.when }} · {{ r.tabLabel }}</div>
              </div>
              <HomeLinkBtn label="Open ›" :onClick="() => onGoTab(r.tab)" />
            </div>
          </div>
        </div>
        <!-- Manager panel -->
        <div class="wx-store-home__panel">
          <div class="wx-store-home__panel-head">
            <span class="wx-store-home__panel-title">{{ isLeague ? "League Manager Information" : "Team Manager Information" }}</span>
            <button v-if="!readOnly" @click="() => onManagers(null)" class="wx-store-home__add">Add manager</button>
          </div>
          <div v-for="(m, i) in managerRows" :key="i" class="wx-store-home__manager">
            <div class="wx-store-home__row-text">
              <div class="wx-store-home__name-row">
                <span class="wx-store-home__row-label">{{ m.name }}</span>
                <span v-if="m.poc" class="wx-store-home__tag">Point of Contact</span>
              </div>
              <div class="wx-store-home__row-sub wx-store-home__row-sub--spaced">{{ [m.email, m.phone, m.pref].filter(Boolean).join(" · ") || "No contact details yet" }}</div>
            </div>
            <span v-if="!readOnly" class="wx-store-home__manager-actions">
              <HomeLinkBtn v-if="!m.poc" label="Invite" :onClick="() => onGoSettings('store')" />
              <HomeLinkBtn label="Edit ›" :onClick="() => { m.poc ? onGoSettings('store') : onManagers(null); }" />
            </span>
          </div>
          <div class="wx-store-home__panel-foot">Adding a manager creates a contact record only — it does not grant portal access. Send invites from <strong :class="`wx-store-home__foot-link${readOnly ? ' wx-store-home__foot-link--readonly' : ''}`" @click="() => { if (!readOnly) onGoSettings('store'); }">Settings → People &amp; Access</strong>.</div>
        </div>
      </div>
      <!-- Right rail -->
      <div class="wx-store-home__rail">
        <!-- In your store — one row per tab; first row matches the nav label exactly. -->
        <div class="wx-store-home__section">
          <span class="wx-store-home__section-title">In your store</span>
          <div class="wx-store-home__panel">
            <template v-for="(row, i) in storeRows" :key="row.id">
              <div @click="() => { if (!readOnly) onGoTab(row.id); }" :class="`wx-store-home__store-row${(row.id === 'products' && products.length > 0) ? ' wx-store-home__store-row--with-thumbs' : ''}${i < storeRows.length - 1 ? '' : ' wx-store-home__store-row--last'}${readOnly ? ' wx-store-home__store-row--readonly' : ''}`">
                <div class="wx-store-home__row-text">
                  <div class="wx-store-home__row-label">{{ row.label }}</div>
                  <div class="wx-store-home__row-sub">{{ row.sub }}<span v-if="row.extra"> · <span class="wx-store-home__extra" :style="{ color: row.extra.color }">{{ row.extra.text }}</span></span></div>
                </div>
                <span class="wx-store-home__chevron">›</span>
              </div>
              <div v-if="row.id === 'products' && products.length > 0" :class="`wx-store-home__thumbs${i < storeRows.length - 1 ? '' : ' wx-store-home__thumbs--last'}`">
                <span v-for="(p, j) in products.slice(0, 4)" :key="j" class="wx-store-home__thumb" />
                <span v-if="products.length > 4" class="wx-store-home__thumb-more">+{{ products.length - 4 }}</span>
              </div>
            </template>
          </div>
        </div>
        <!-- League structure — League stores only; bounded so it can't push the attention list off screen. -->
        <div v-if="isLeague" class="wx-store-home__panel">
          <div class="wx-store-home__panel-intro">
            <div class="wx-store-home__panel-title">League structure</div>
            <div class="wx-store-home__row-sub wx-store-home__row-sub--spaced">{{ st.divisions }} division{{ st.divisions === 1 ? "" : "s" }} · {{ st.teams }} team{{ st.teams === 1 ? "" : "s" }} · {{ st.players }} player{{ st.players === 1 ? "" : "s" }}</div>
          </div>
          <div class="wx-store-home__structure">
            <div v-if="st.groups.length === 0 && st.loose.length === 0" class="wx-store-home__structure-empty">No divisions yet — build the structure from {{ "My Teams" }}.</div>
            <div v-for="g in st.groups" :key="g.id" @click="() => { if (!readOnly) onRosterBank(); }" :class="`wx-store-home__structure-row${readOnly ? ' wx-store-home__structure-row--readonly' : ''}`">
              <div class="wx-store-home__row-text">
                <div class="wx-store-home__row-label">{{ g.name }}</div>
                <div class="wx-store-home__row-sub">{{ (g.rosters || []).length }} teams · {{ (g.rosters || []).reduce((n, r) => n + (r.players || 0), 0) }} players<span v-if="groupCaptures(g) > 0"> · <span class="wx-store-home__capture">{{ groupCaptures(g) }} capture{{ groupCaptures(g) === 1 ? "" : "s" }}</span></span></div>
              </div>
              <span class="wx-store-home__chevron">›</span>
            </div>
            <div v-for="(r, i) in st.loose" :key="r.id" @click="() => { if (!readOnly) onRosterBank(); }" :class="`wx-store-home__structure-row${i < st.loose.length - 1 ? '' : ' wx-store-home__structure-row--last'}${readOnly ? ' wx-store-home__structure-row--readonly' : ''}`">
              <div class="wx-store-home__row-text">
                <div class="wx-store-home__row-label">{{ r.name }} <span class="wx-store-home__tag wx-store-home__tag--standalone">STANDALONE</span></div>
                <div class="wx-store-home__row-sub">{{ r.players || 0 }} players<span v-if="(bank.byTeam[r.id] || 0) > 0"> · <span class="wx-store-home__capture">{{ bank.byTeam[r.id] || 0 }} capture{{ (bank.byTeam[r.id] || 0) === 1 ? "" : "s" }}</span></span></div>
              </div>
              <span class="wx-store-home__chevron">›</span>
            </div>
          </div>
        </div>
        <!-- Brand assets — editable after launch; only Archived locks it. -->
        <div class="wx-store-home__panel">
          <div class="wx-store-home__panel-intro wx-store-home__panel-title">Brand assets</div>
          <div class="wx-store-home__asset">
            <TeamEmblem :store="store" :size="34" />
            <div class="wx-store-home__row-text">
              <div class="wx-store-home__asset-label">Team Logo</div>
              <div class="wx-store-home__asset-sub">From the Team Database</div>
            </div>
            <HomeLinkBtn v-if="!readOnly" label="Edit ›" :onClick="() => onGoSettings('store')" />
          </div>
          <div class="wx-store-home__asset">
            <span class="wx-store-home__swatches">
              <span class="wx-store-home__swatch" :style="{ background: (store.teamColors && store.teamColors[0]) || '#e1e2dd' }" />
              <span class="wx-store-home__swatch" :style="{ background: (store.teamColors && store.teamColors[1]) || '#f4f4f5' }" />
            </span>
            <div class="wx-store-home__row-text">
              <div class="wx-store-home__asset-label">Team Colors</div>
            </div>
            <HomeLinkBtn v-if="!readOnly" label="Edit ›" :onClick="() => onGoSettings('store')" />
          </div>
          <div class="wx-store-home__asset wx-store-home__asset--top">
            <span class="wx-store-home__swatch wx-store-home__swatch--theme" :style="{ background: themeColor }" />
            <div class="wx-store-home__row-text">
              <div class="wx-store-home__name-row">
                <span class="wx-store-home__asset-label">Store Theme Color</span>
                <span class="wx-store-home__tag">{{ themeCustom ? "Custom" : "Team default" }}</span>
              </div>
              <div class="wx-store-home__asset-sub wx-store-home__asset-sub--spaced">Applies to storefront buttons and accents only.</div>
              <div v-if="themeCustom && !readOnly" @click="() => { onUpdateStore && onUpdateStore({ primaryColor: defaultTheme }); }" class="wx-store-home__reset">Reset to team color</div>
            </div>
            <HomeLinkBtn v-if="!readOnly" label="Edit ›" :onClick="() => onGoSettings('customization')" />
          </div>
          <div @click="() => { if (!readOnly) onGoSettings('store'); }" :class="`wx-store-home__artwork${readOnly ? ' wx-store-home__artwork--readonly' : ''}`">Team artwork library <span class="wx-store-home__artwork-note">— team-level, spans seasons</span> ›</div>
        </div>
        <div class="wx-store-home__orientation">Need orientation? <strong class="wx-store-home__orientation-link" @click="openGuide">Reopen the setup guide</strong>.</div>
      </div>
    </div>
  </div>
</template>

<script>
import { buildHomeAttention, homeFailedProducts, homeStructureInfo, tcStoreSlug } from '../../../workspace/data/store-home.js';
import { IconSettings, IconShirt, IconUsers } from '../icons.js';
import TeamEmblem from '../common/TeamEmblem.vue';
import HomeAttentionCard from './HomeAttentionCard.vue';
import HomeLinkBtn from './HomeLinkBtn.vue';

export default {
  name: 'HomeTab',
  components: { HomeAttentionCard, HomeLinkBtn, IconSettings, IconShirt, IconUsers, TeamEmblem },
  props: {
    store: { type: Object, default: undefined },
    org: { type: Object, default: undefined },
    readOnly: { type: Boolean, default: false },
    onGoTab: { type: Function, default: undefined },
    onPendingOrders: { type: Function, default: undefined },
    onAllOrders: { type: Function, default: undefined },
    onRosterBank: { type: Function, default: undefined },
    onManagers: { type: Function, default: undefined },
    onLaunch: { type: Function, default: undefined },
    onGoSettings: { type: Function, default: undefined },
    onUpdateStore: { type: Function, default: undefined },
  },
  data() {
    return { showAll: false, copied: false };
  },
  computed: {
    model() { return buildHomeAttention(this.store, this.org); },
    lc() { return this.model.lc; },
    oi() { return this.model.oi; },
    bank() { return this.model.bank; },
    close() { return this.model.close; },
    cards() { return this.model.cards; },
    st() { return homeStructureInfo(this.org); },
    isLeague() { return (this.store.storeType || "league") === "league"; },
    products() { return this.store.products || []; },
    failedProducts() { return homeFailedProducts(this.store); },
    slug() { return this.store.storeSlug || tcStoreSlug(this.store); },
    url() { return "prolook.com/store/" + this.slug; },
    raised() { return this.lc.draft ? 0 : (this.store.revenue || (this.store.seeded ? 3810 : 0)); },
    visible() { return this.showAll ? this.cards : this.cards.slice(0, 5); },
    hiddenCount() { return this.cards.length - this.visible.length; },
    pill() {
      const { lc } = this;
      return lc.archived ? { label: "Archived", mod: "archived" }
        : lc.closed ? { label: "Closed", mod: "closed" }
        : lc.open ? { label: "Open", mod: "open" }
        : { label: "Draft", mod: "draft" };
    },
    // Manager panel rows — the record buyers see is tagged Point of Contact (the exact name of the
    // setting it feeds).
    managerRows() {
      const { store, org } = this;
      const prefText = function (p) {
        const s = String(p || "").toLowerCase();
        if (s.indexOf("email") >= 0 && s.indexOf("phone") >= 0) return "Prefers email or phone";
        if (s.indexOf("phone") >= 0) return "Prefers phone";
        if (s.indexOf("email") >= 0) return "Prefers email";
        return null;
      };
      const primaryMgr = { name: store.managerName || store.shipName || "Team Manager", email: store.email || "", phone: store.phone || "", pref: prefText(store.contactPref), poc: true };
      const extras = [];
      const seen = {}; seen[(primaryMgr.email || "").toLowerCase()] = true;
      Object.keys((org && org.managers) || {}).forEach(function (k) {
        const m = org.managers[k]; if (!m) return;
        const nm = m.name || [m.firstName, m.lastName].filter(Boolean).join(" ");
        const em = String(m.email || "").toLowerCase();
        if (!nm || !em || seen[em]) return;
        seen[em] = true;
        extras.push({ name: nm, email: m.email, phone: m.phone, pref: null, poc: false });
      });
      return [primaryMgr].concat(extras.slice(0, 3));
    },
    // Recently worked on — activity trail. Absent when there is nothing to show (the normal case on a
    // Draft store). Rows read Open ›, never Resume.
    trail() {
      return (!this.store.seeded || this.lc.draft) ? [] : this.isLeague ? [
        { name: "Division 7 → U12 Blue — roster", when: "2 hours ago", tabLabel: "My Teams", tab: "roster", icon: "users" },
        { name: "Fan Gear — pricing", when: "Yesterday", tabLabel: "Products", tab: "products", icon: "shirt" },
        { name: "Announcement message", when: "Monday", tabLabel: "Settings", tab: "general", icon: "settings" }
      ] : [
        { name: "Home Jersey — pricing", when: "2 hours ago", tabLabel: "My Team", tab: "roster", icon: "shirt" },
        { name: "Imported 4 players", when: "Yesterday", tabLabel: "My Team", tab: "roster", icon: "users" },
        { name: "Store banner image", when: "Monday", tabLabel: "Settings", tab: "general", icon: "settings" }
      ];
    },
    defaultTheme() { return (this.store.teamColors && this.store.teamColors[1]) || null; },
    themeColor() { return this.store.primaryColor || this.defaultTheme || "#e1251b"; },
    themeCustom() { const { defaultTheme, store } = this; return !!(defaultTheme && store.primaryColor && String(store.primaryColor).toLowerCase() !== String(defaultTheme).toLowerCase()); },
    storeRows() {
      const { isLeague, st, bank, products, failedProducts, oi } = this;
      return [
        { id: "roster", label: isLeague ? "My Teams" : "My Team", sub: st.players + " players", extra: bank.total ? { text: bank.total + " Roster Bank capture" + (bank.total === 1 ? "" : "s"), color: "#2563eb" } : null },
        { id: "products", label: "Products", sub: products.length + " products", extra: failedProducts.length ? { text: failedProducts.length + " render failed", color: "#b81d14" } : null },
        { id: "orders", label: "Orders", sub: (oi.total) + " orders", extra: oi.pending ? { text: oi.pending + " to submit", color: "#2563eb" } : null },
        { id: "payouts", label: "Reports", sub: "Store analytics" }
      ];
    },
  },
  methods: {
    setShowAll(v) { this.showAll = v; },
    fmtMoney(n) { return "$" + Math.round(n).toLocaleString("en-US"); },
    run(card) {
      const { readOnly } = this;
      if (readOnly) return;
      if (card.kind === "products") this.onGoTab("products");
      else if (card.kind === "launch") this.onLaunch();
      else if (card.kind === "settings-store") this.onGoSettings("store");
      else if (card.kind === "assign") this.onManagers(card.target);
      else if (card.kind === "pending") this.onPendingOrders();
      else if (card.kind === "bank") this.onRosterBank();
      else if (card.kind === "schedule") this.onGoSettings("schedule");
      else if (card.kind === "report") window.dispatchEvent(new CustomEvent("closereport:open", { detail: { layer: "summary" } }));
      else if (card.kind === "orders") this.onAllOrders();
    },
    copyUrl() {
      try { navigator.clipboard && navigator.clipboard.writeText("https://" + this.url); } catch (e) {}
      this.copied = true; setTimeout(() => { this.copied = false; }, 1500);
    },
    groupCaptures(g) { const { bank } = this; return (g.rosters || []).reduce(function (n, r) { return n + (bank.byTeam[r.id] || 0); }, 0); },
    openGuide() { window.dispatchEvent(new CustomEvent("setupguide:open")); },
  },
};
</script>
