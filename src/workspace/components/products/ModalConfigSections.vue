<!-- Converted from workspace-app.jsx and workspace-app-integrated.jsx: ModalConfigSections — Product Settings +
     Price Settings sections rendered inside the sizes modal (used by the store-creation wizard so a product
     is fully configured before it's committed). Mirrors the ConfigureProduct page's settings + pricing UI.
     Categories are the workspace's shared list (data/catalog.js, the prototype's window.__prodCats), read on
     every render; "+ Add new category…" / "+ Add new subcategory…" add to it. -->
<template>
  <div class="wx-config-sections">
    <div v-if="!product || pteRestricted(product)" class="wx-config-sections__notice">
      <span class="wx-config-sections__notice-icon"><IconAlert :size="15" /></span>
      <span class="wx-config-sections__notice-text"><strong class="wx-config-sections__notice-strong">This item is made to order.</strong> Its design cannot be changed after it is added to the store, and no changes can be made after its first order.</span>
    </div>
    <div class="wx-config-sections__card">
      <div class="wx-config-sections__card-title">Category</div>
      <div class="wx-config-sections__fields">
        <div>
          <label class="wx-config-sections__field-label">Category<span class="wx-config-sections__required"> *</span></label>
          <input v-if="addingCat" v-autofocus :value="newCatName" v-controlled="newCatName" @input="(e) => newCatName = e.target.value" placeholder="New category name" @blur="commitNewCat" @keydown="onNewCatKey" class="wx-config-sections__add-input" />
          <select v-else @change="onCategory" :class="`wx-config-sections__category-select${config.catError ? ' wx-config-sections__category-select--error' : ''}`">
            <option value="" :selected="(config.storeCategory || '') === ''">Select a category</option>
            <option v-for="c in prodCats()" :key="c.id" :value="c.name" :selected="(config.storeCategory || '') === c.name">{{ c.name }}</option>
            <option value="__add_new__" :selected="(config.storeCategory || '') === '__add_new__'">+ Add new category…</option>
          </select>
        </div>
        <div>
          <label class="wx-config-sections__field-label">Subcategory</label>
          <input v-if="addingSub" v-autofocus :value="newSubName" v-controlled="newSubName" @input="(e) => newSubName = e.target.value" placeholder="New subcategory name" @blur="commitNewSub" @keydown="onNewSubKey" class="wx-config-sections__add-input" />
          <select v-else @change="onSubcategory" :disabled="!config.storeCategory" class="wx-config-sections__subcategory-select">
            <option value="" :selected="(config.storeSubcategory || '') === ''">{{ mSubs().length === 0 ? (!config.storeCategory ? "No subcategories" : "No subcategories yet") : "No subcategory" }}</option>
            <option v-for="s in mSubs()" :key="s" :value="s" :selected="(config.storeSubcategory || '') === s">{{ s }}</option>
            <option v-if="config.storeCategory" value="__add_new__" :selected="(config.storeSubcategory || '') === '__add_new__'">+ Add new subcategory…</option>
          </select>
        </div>
      </div>
      <div v-if="config.catError" class="wx-config-sections__error">Select a category before adding to the store — items no longer default to Fan Gear.</div>
    </div>
    <div class="wx-config-sections__card">
      <div class="wx-config-sections__card-title">Storefront</div>
      <div v-for="(r, i) in flagRows" :key="r.key" :class="`wx-config-sections__flag${(i === 0) ? ' wx-config-sections__flag--first' : ''}${(i === flagRows.length - 1) ? ' wx-config-sections__flag--last' : ''}${r.nested ? ' wx-config-sections__flag--nested' : ''}${(i > 0) ? ' wx-config-sections__flag--divided' : ''}`">
        <span :class="`wx-config-sections__flag-label${r.nested ? ' wx-config-sections__flag-label--nested' : ''}`">{{ r.label }}</span>
        <span class="wx-config-sections__flag-desc">{{ r.desc }}</span>
        <button type="button" @click="r.set(!r.on)" class="wx-config-sections__switch">
          <span :class="`wx-config-sections__switch-text${r.on ? ' wx-config-sections__switch-text--on' : ''}`">{{ r.on ? "On" : "Off" }}</span>
          <span :class="`wx-config-sections__switch-track${r.on ? ' wx-config-sections__switch-track--on' : ''}`">
            <span :class="`wx-config-sections__switch-knob${r.on ? ' wx-config-sections__switch-knob--on' : ''}`" />
          </span>
        </button>
      </div>
    </div>
    <TeamAssignPrompt :open="!!teamPrompt" :initial="config.rosters || []" :store="store" settingLabel="Required or team-paid" :onClose="closeTeamPrompt" :onConfirm="confirmTeamPrompt" />
    <div v-if="allowRosterAssign && store?.storeType === 'league'" class="wx-config-sections__card">
      <div class="wx-config-sections__assign-title">Assign to Teams</div>
      <div class="wx-config-sections__assign-note">
        <span v-if="tOn">Required or team-paid items must stay assigned to at least one Team.</span>
        <span v-else>Choose which Teams wear this product. Leave empty to make it <strong class="wx-config-sections__assign-strong">available league-wide</strong>.</span>
      </div>
      <RosterAssignField variant="dropdown" direction="down" :value="config.rosters || []" :onChange="(ids) => onChange({ ...config, rosters: ids })" accent="#e1251b" :minOne="tOn" :store="store" />
    </div>
    <PriceSettingsCard :pricing="pricing" :onChange="(next) => onChange({ ...config, pricing: next })" :fundOn="fundOn" :covered="!!config.optSupplied" :noYouth="noYouth" />
  </div>
</template>

<script>
import { workspaceGlobals } from '../../data/catalog.js';
import { pteRestricted } from '../../lib/products.js';
import { IconAlert } from '../icons.js';
import PriceSettingsCard from './PriceSettingsCard.vue';
import RosterAssignField from './RosterAssignField.vue';
import TeamAssignPrompt from './TeamAssignPrompt.vue';

export default {
  name: 'ModalConfigSections',
  components: { IconAlert, PriceSettingsCard, RosterAssignField, TeamAssignPrompt },
  props: {
    config: { type: Object, default: undefined },
    onChange: { type: Function, default: undefined },
    store: { type: Object, default: undefined },
    allowRosterAssign: { type: Boolean, default: undefined },
    product: { type: Object, default: undefined },
  },
  data() {
    return {
      teamPrompt: null, // { apply } | null
      // Inline "add new" for Category / Subcategory dropdowns.
      addingCat: false, addingSub: false, newCatName: "", newSubName: "",
    };
  },
  computed: {
    pricing() { return this.config.pricing; },
    fundOn() { return this.store?.fundraisingEnabled === true; },
    // Stock items without a youth price (e.g. most Sideline Stock) hide youth pricing.
    noYouth() { const { product } = this; return !!product && product.srcKind === "vault" && product.priceYouth == null; },
    tOn() { return !!(this.config.optRequired || this.config.optSupplied); },
    mGridCols() { return this.fundOn ? "70px 90px 1fr 1fr 1fr 90px" : "70px 90px 1fr 1fr 90px"; },
    flagRows() {
      const { config, onChange } = this;
      return [
        { key: "hidden", label: "Shown in store", desc: config.hidden ? "Hidden — buyers can't see or order this item." : "Buyers can see and order this once the store launches.", on: !config.hidden, set: (v) => onChange({ ...config, hidden: !v }) },
        { key: "optRequired", label: "Required for players", desc: "Rostered players need one to participate. Tracked per roster.", on: !!config.optRequired, set: (v) => this.setFlag("optRequired", v) },
        config.optRequired && { key: "optOut", label: "Opt-out allowed", desc: "“I already own this” counts as satisfied.", on: !!config.optOut, set: (v) => onChange({ ...config, optOut: v }), nested: true },
        { key: "optSupplied", label: "Paid by the team", desc: "Already covered by fees or fundraising — players pay $0. Pricing shows Covered.", on: !!config.optSupplied, set: (v) => this.setFlag("optSupplied", v) },
      ].filter(Boolean);
    },
  },
  watch: {
    // React: useEffect on [config.teamError] — confirm was blocked because a TR/TS item has no team
    // assigned: surface the prompt.
    'config.teamError'() { this.surfaceTeamError(); },
  },
  mounted() {
    this.surfaceTeamError();
  },
  methods: {
    pteRestricted,
    surfaceTeamError() {
      if (this.config.teamError) this.teamPrompt = { apply: (extra) => this.onChange({ ...this.config, teamError: false, ...(extra || {}) }) };
    },
    prodCats() { return workspaceGlobals.__prodCats || []; },
    mSubs() { return (((workspaceGlobals.__prodCats || []).find((c) => c.name === this.config.storeCategory)) || {}).subs || []; },
    commitNewCat() {
      const name = this.newCatName.trim();
      this.addingCat = false; this.newCatName = "";
      if (!name) return;
      const list = workspaceGlobals.__prodCats || (workspaceGlobals.__prodCats = []);
      let c = list.find((x) => x.name.toLowerCase() === name.toLowerCase());
      if (!c) { c = { id: "cat-" + name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), name, subs: [] }; workspaceGlobals.__prodCats = [...list, c]; }
      this.onChange({ ...this.config, storeCategory: c.name, storeSubcategory: "", catError: false });
    },
    commitNewSub() {
      const name = this.newSubName.trim();
      this.addingSub = false; this.newSubName = "";
      if (!name) return;
      const c = (workspaceGlobals.__prodCats || []).find((x) => x.name === this.config.storeCategory);
      if (!c) return;
      if (!(c.subs || []).some((s) => s.toLowerCase() === name.toLowerCase())) c.subs = [...(c.subs || []), name];
      this.onChange({ ...this.config, storeSubcategory: name });
    },
    onNewCatKey(e) { if (e.key === "Enter") this.commitNewCat(); if (e.key === "Escape") { this.addingCat = false; this.newCatName = ""; } },
    onNewSubKey(e) { if (e.key === "Enter") this.commitNewSub(); if (e.key === "Escape") { this.addingSub = false; this.newSubName = ""; } },
    onCategory(e) { if (e.target.value === "__add_new__") { this.addingCat = true; return; } this.onChange({ ...this.config, storeCategory: e.target.value, storeSubcategory: "", catError: false }); },
    onSubcategory(e) { if (e.target.value === "__add_new__") { this.addingSub = true; return; } this.onChange({ ...this.config, storeSubcategory: e.target.value }); },
    updatePricing(size, field, value) {
      const { pricing, store } = this;
      const next = { ...pricing, [size]: { ...pricing[size], [field]: value } };
      const baseNum = parseFloat(next[size].base) || 0;
      const dealerNum = parseFloat(next[size].dealer) || 0;
      const fundNum = parseFloat(next[size].fund) || 0;
      const dealerAmt = next[size].dealerUnit === "$" ? dealerNum : baseNum * dealerNum / 100;
      const fundAmt = next[size].fundUnit === "$" ? fundNum : baseNum * fundNum / 100;
      next[size].retail = (baseNum + dealerAmt + ((next.fundraisingOn ?? (store?.fundraisingEnabled === true)) ? fundAmt : 0)).toFixed(2);
      this.onChange({ ...this.config, pricing: next });
    },
    deriveTs(c) { return c.optRequired ? "team-required" : c.optSupplied ? "team-supplied" : "fan-gear"; },
    // Required / team-paid are independent per-item flags; teamSetting stays derived for legacy readers.
    setFlag(key, v) {
      const { config, allowRosterAssign, store } = this;
      const next = { ...config, [key]: v }; next.teamSetting = this.deriveTs(next);
      const apply = (extra) => this.onChange({ ...next, teamError: false, ...(extra || {}) });
      if (v && allowRosterAssign && store?.storeType === "league" && !(config.rosters || []).length) { this.teamPrompt = { apply }; return; }
      apply();
    },
    closeTeamPrompt() { this.teamPrompt = null; if (this.config.teamError) this.onChange({ ...this.config, teamError: false }); },
    confirmTeamPrompt(ids) { const a = this.teamPrompt && this.teamPrompt.apply; this.teamPrompt = null; if (a) a({ rosters: ids }); },
  },
};
</script>
