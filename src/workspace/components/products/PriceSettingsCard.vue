<!-- Converted from workspace-app.jsx: PriceSettingsCard — the shared PRICE SETTINGS card: header-mounted
     $ / % control, per-row column headers, read-only base cost, prefix affordances, derived retail, the
     per-item fundraising switch, and the "Retail is what customers pay" footer. bare = body only (no card
     chrome). Team Supplied (covered) replaces the whole component with Covered (Governing rule 3).
     The prototype's body fragment and fundraising row are written out at each place they render. -->
<template>
  <div v-if="covered && bare" class="wx-price-settings__covered-row">
    <span class="wx-price-settings__covered">Covered</span>
    <span class="wx-price-settings__covered-note">Team Supplied — the team has already paid for this gear, so shoppers pay $0 at checkout. No pricing applies.</span>
  </div>
  <div v-else-if="covered" class="wx-price-settings">
    <div class="wx-price-settings__title">Price settings</div>
    <div class="wx-price-settings__covered-row">
      <span class="wx-price-settings__covered">Covered</span>
      <span class="wx-price-settings__covered-note">Team Supplied — the team has already paid for this gear, so shoppers pay $0 at checkout. No pricing applies.</span>
    </div>
  </div>
  <div v-else-if="bare" :style="locked ? { opacity: 0.55 } : undefined">
    <div class="wx-price-settings__sizes" :style="{ gridTemplateColumns: 'repeat(' + sizes.length + ', minmax(0, 1fr))', ...(locked ? { pointerEvents: 'none' } : {}) }">
      <div v-for="size in sizes" :key="size" class="wx-price-settings__size">
        <div class="wx-price-settings__size-head">
          <span class="wx-price-settings__size-name">{{ size.charAt(0).toUpperCase() + size.slice(1) }}</span>
          <span class="wx-price-settings__base-cost">Base cost <strong class="wx-price-settings__base">{{ "$" + pricing[size].base }}</strong></span>
        </div>
        <div :class="`wx-price-settings__fields${fundActive ? ' wx-price-settings__fields--fund-active' : ''}`">
          <div class="wx-price-settings__field">
            <div class="wx-price-settings__field-label">Dealer profit</div>
            <ProfitInput fill :unit="mode" :value="pricing[size].dealer" :onValue="(v) => update(size, 'dealer', v)" />
            <div v-if="pricing[size].dealerBulk" class="wx-price-settings__bulk-note"><span class="wx-price-settings__bulk-dot" />Set by bulk pricing</div>
          </div>
          <div v-if="fundActive" class="wx-price-settings__field">
            <div class="wx-price-settings__field-label">Fundraising</div>
            <ProfitInput fill :unit="mode" :value="pricing[size].fund ?? ''" :onValue="(v) => update(size, 'fund', v)" />
            <div v-if="pricing[size].fundBulk" class="wx-price-settings__bulk-note"><span class="wx-price-settings__bulk-dot" />Set by bulk pricing</div>
          </div>
        </div>
        <div class="wx-price-settings__retail-row">
          <span class="wx-price-settings__retail-label">Retail</span>
          <span class="wx-price-settings__retail">{{ "$" + pricing[size].retail }}</span>
        </div>
      </div>
    </div>
    <div class="wx-price-settings__fund-row" :style="locked ? { opacity: 0.55, pointerEvents: 'none' } : {}">
      <div class="wx-price-settings__fund-text">
        <div class="wx-price-settings__fund-title">Fundraising on this item</div>
        <div class="wx-price-settings__fund-desc">{{ fundDesc }}</div>
      </div>
      <button type="button" @click="setFund(!fundActive)" class="wx-price-settings__fund-switch">
        <span :class="`wx-price-settings__switch-track${fundActive ? ' wx-price-settings__switch-track--fund-active' : ''}`">
          <span :class="`wx-price-settings__switch-knob${fundActive ? ' wx-price-settings__switch-knob--fund-active' : ''}`" />
        </span>
        <span :class="`wx-price-settings__switch-text${fundActive ? ' wx-price-settings__switch-text--fund-active' : ''}`">{{ fundActive ? "On" : "Off" }}</span>
      </button>
    </div>
    <div v-if="!locked" class="wx-price-settings__retail-note">Retail is what customers pay. {{ mode === "%" ? "Percentages apply to each size's own base cost. " : "" }}Switching $ / % clears the entered values.</div>
  </div>
  <div v-else class="wx-price-settings" :style="locked ? { opacity: 0.55 } : {}">
    <div class="wx-price-settings__head">
      <span class="wx-price-settings__title-inline">Price settings</span>
      <PSModeControl :mode="mode" :onChange="setMode" :locked="locked" />
    </div>
    <div class="wx-price-settings__sizes" :style="{ gridTemplateColumns: 'repeat(' + sizes.length + ', minmax(0, 1fr))', ...(locked ? { pointerEvents: 'none' } : {}) }">
      <div v-for="size in sizes" :key="size" class="wx-price-settings__size">
        <div class="wx-price-settings__size-head">
          <span class="wx-price-settings__size-name">{{ size.charAt(0).toUpperCase() + size.slice(1) }}</span>
          <span class="wx-price-settings__base-cost">Base cost <strong class="wx-price-settings__base">{{ "$" + pricing[size].base }}</strong></span>
        </div>
        <div :class="`wx-price-settings__fields${fundActive ? ' wx-price-settings__fields--fund-active' : ''}`">
          <div class="wx-price-settings__field">
            <div class="wx-price-settings__field-label">Dealer profit</div>
            <ProfitInput fill :unit="mode" :value="pricing[size].dealer" :onValue="(v) => update(size, 'dealer', v)" />
            <div v-if="pricing[size].dealerBulk" class="wx-price-settings__bulk-note"><span class="wx-price-settings__bulk-dot" />Set by bulk pricing</div>
          </div>
          <div v-if="fundActive" class="wx-price-settings__field">
            <div class="wx-price-settings__field-label">Fundraising</div>
            <ProfitInput fill :unit="mode" :value="pricing[size].fund ?? ''" :onValue="(v) => update(size, 'fund', v)" />
            <div v-if="pricing[size].fundBulk" class="wx-price-settings__bulk-note"><span class="wx-price-settings__bulk-dot" />Set by bulk pricing</div>
          </div>
        </div>
        <div class="wx-price-settings__retail-row">
          <span class="wx-price-settings__retail-label">Retail</span>
          <span class="wx-price-settings__retail">{{ "$" + pricing[size].retail }}</span>
        </div>
      </div>
    </div>
    <div class="wx-price-settings__fund-row" :style="locked ? { opacity: 0.55, pointerEvents: 'none' } : {}">
      <div class="wx-price-settings__fund-text">
        <div class="wx-price-settings__fund-title">Fundraising on this item</div>
        <div class="wx-price-settings__fund-desc">{{ fundDesc }}</div>
      </div>
      <button type="button" @click="setFund(!fundActive)" class="wx-price-settings__fund-switch">
        <span :class="`wx-price-settings__switch-track${fundActive ? ' wx-price-settings__switch-track--fund-active' : ''}`">
          <span :class="`wx-price-settings__switch-knob${fundActive ? ' wx-price-settings__switch-knob--fund-active' : ''}`" />
        </span>
        <span :class="`wx-price-settings__switch-text${fundActive ? ' wx-price-settings__switch-text--fund-active' : ''}`">{{ fundActive ? "On" : "Off" }}</span>
      </button>
    </div>
    <div v-if="!locked" class="wx-price-settings__retail-note">Retail is what customers pay. {{ mode === "%" ? "Percentages apply to each size's own base cost. " : "" }}Switching $ / % clears the entered values.</div>
  </div>
</template>

<script>
import { pricingMode, psAmt, psRowRetail, switchPricingMode } from '../../lib/products.js';
import ProfitInput from './ProfitInput.vue';
import PSModeControl from './PSModeControl.vue';

export default {
  name: 'PriceSettingsCard',
  components: { ProfitInput, PSModeControl },
  props: {
    pricing: { type: Object, default: undefined },
    onChange: { type: Function, default: undefined },
    fundOn: { type: Boolean, default: undefined },
    locked: { type: Boolean, default: undefined },
    noYouth: { type: Boolean, default: undefined },
    bare: { type: Boolean, default: undefined },
    covered: { type: Boolean, default: undefined },
  },
  computed: {
    sizes() { return (this.noYouth ? ["adult"] : ["youth", "adult"]).filter((s) => this.pricing && this.pricing[s]); },
    mode() { return pricingMode(this.pricing); },
    // Per-item fundraising — the item's own toggle, defaulting to the store's Team Fundraising setting.
    fundActive() { return this.pricing.fundraisingOn ?? this.fundOn; },
    // Entered amounts survive the toggle — hint at what's saved while off.
    savedFund() {
      const { pricing } = this;
      return this.sizes
        .map((s) => ({ s, amt: psAmt(pricing[s].fundUnit || "$", pricing[s].fund, parseFloat(pricing[s].base) || 0) }))
        .filter((x) => x.amt > 0);
    },
    fundDesc() {
      const { fundActive, savedFund, mode, pricing } = this;
      return fundActive
        ? "Added on top of retail for this item. Defaults to the store's Team Fundraising setting."
        : savedFund.length > 0
          ? "Off — saved amount" + (savedFund.length > 1 ? "s" : "") + " (" + savedFund.map((x) => x.s.toUpperCase() + " " + (mode === "%" ? (parseFloat(pricing[x.s].fund) || 0) + "%" : "$" + x.amt.toFixed(2))).join(" · ") + ") kept and restored if re-enabled."
          : "Off — this item doesn't collect fundraising.";
    },
  },
  methods: {
    update(size, field, value) {
      const { pricing } = this;
      const row = { ...pricing[size], [field]: value };
      if (field === "dealer") delete row.dealerBulk; // typing overrides bulk-pricing provenance
      if (field === "fund") delete row.fundBulk;
      const next = { ...pricing, [size]: row };
      next[size].retail = psRowRetail(next[size], this.fundActive);
      this.onChange(next);
    },
    setMode(m2) { if (m2 !== this.mode) this.onChange(switchPricingMode(this.pricing, m2, this.fundActive)); },
    setFund(on) {
      const { pricing } = this;
      const conv = (r) => r ? { ...r, retail: psRowRetail(r, on) } : r;
      this.onChange({ ...pricing, fundraisingOn: on, youth: conv(pricing.youth), adult: conv(pricing.adult) });
    },
  },
};
</script>
