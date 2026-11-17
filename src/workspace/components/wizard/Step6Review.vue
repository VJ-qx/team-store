<!-- Converted from workspace-app.jsx: Step6Review — the Add Store wizard's last step, Review & Deploy: the
     setup summary, the products added (with "Edit products"), the managers, and a League store's Divisions &
     Teams. SAVE AND CONTINUE in the wizard's footer creates the store. The prototype's inline Divisions &
     Teams helper is written out in place. -->
<template>
  <div>
    <StepHeader :num="String(stepNum || 3)" :accent="accent" title="Review &amp; Deploy" desc="Confirm every setting — campaign URL, taxes, logistics, and projected yield — before deploying the store." />
    <div class="wx-review__body">
      <UatReviewExtras :data="data" :onEditBasics="onEditBasics" />
      <WizardPanel label="Review Your Setup" :style="{ marginBottom: '0' }">
        <SummaryRowWiz label="Domain Web Slug" mono :accent="accent" :value="`prolookstores.com/${data.storeSlug || '—'}`" />
        <SummaryRowWiz label="Connected Team" :value="(WIZARD_TEAMS.find((t) => t.value === data.connectedTeam) || {}).label || '—'" />
        <SummaryRowWiz label="Sports" :value="(data.sports && data.sports.length) ? data.sports.join(', ') : '—'" />
        <SummaryRowWiz label="Campaign Type" :value="FORMAT_LABELS[data.distributionFormat] || '—'" />
        <SummaryRowWiz label="Point of Contact" :value="contactSummary(data)" />
        <SummaryRowWiz label="Compliance Sales Tax Code" :value="taxValue" :accent="!data.collectTax ? '#1f7a44' : undefined" />
        <SummaryRowWiz label="Duplicate Numbers Default" :value="data.allowDuplicateNumbers ? 'Allowed — rosters can override' : 'Blocked — rosters can override'" />
        <SummaryRowWiz label="Jersey Number Selection" :value="(data.numberSelection || 'manager') === 'player' ? 'Players choose their own numbers' : 'Team manager chooses for players'" />
        <SummaryRowWiz label="Curated SKUs" :value="`${(data.curatedProducts || []).length} Product${(data.curatedProducts || []).length === 1 ? '' : 's'} Curated`" />
        <SummaryRowWiz label="Logistics Shipping Rule" :value="SHIP_LABELS[data.distributionModel] || '—'" :last="data.distributionModel !== 'coach'" />
        <SummaryRowWiz v-if="data.distributionModel === 'coach'" label="Ship-To Address" :value="shipToSummary(data) || 'Not set — orders can\'t be submitted for fulfillment until an address exists'" :accent="shipToSummary(data) ? undefined : '#b06f1e'" last />
      </WizardPanel>
      <ReviewProducts :products="data.curatedProducts || []" :accent="accent" :source="data._dupSource" :onEdit="onEditProducts" :onRemove="data._dupSource ? onRemoveProduct : null" />
      <WizardPanel :label="data.storeType === 'league' ? 'League Managers' : 'Team Managers'" :hint="((data.additionalManagers || []).length + 1) === 1 ? '1 manager' : ((data.additionalManagers || []).length + 1) + ' managers'" :style="{ marginTop: '16px', marginBottom: '0' }">
        <div v-for="(m, i) in managers" :key="m.id || i" :class="`wx-review__manager${(i === managers.length - 1) ? ' wx-review__manager--last' : ''}`">
          <span :class="`wx-review__manager-avatar${m.primary ? ' wx-review__manager-avatar--primary' : ''}`">{{ (nameOf(m) || "—").split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase() }}</span>
          <div class="wx-review__manager-text">
            <div class="wx-review__manager-name">{{ nameOf(m) || "Unnamed manager" }}</div>
            <div class="wx-review__manager-contact">{{ [m.email, m.phone].filter(Boolean).join(" · ") || "No contact details" }}</div>
          </div>
          <span v-if="m.primary" title="The Store Point of Contact inherits from this record" class="wx-review__primary-tag">Primary Contact</span>
        </div>
      </WizardPanel>
      <WizardPanel v-if="data.storeType === 'league'" label="Divisions &amp; Teams" :hint="league.nDiv + (league.nDiv === 1 ? ' division · ' : ' divisions · ') + league.nTeam + (league.nTeam === 1 ? ' team' : ' teams')" :style="{ marginTop: '16px', marginBottom: '0' }">
        <div v-if="league.nDiv === 0 && league.nTeam === 0" class="wx-review__empty">No divisions or teams yet — add them anytime from the My Team(s) tab.</div>
        <div v-else class="wx-review__divisions">
          <div v-for="g in (league.s.groups || [])" :key="g.id">
            <div class="wx-review__division-head">
              <span class="wx-review__division-dot" :style="{ background: g.color || '#3f3f46' }" />
              <span class="wx-review__division-name">{{ g.name }}</span>
              <span class="wx-review__division-count">{{ (g.rosters || []).length }} {{ (g.rosters || []).length === 1 ? "team" : "teams" }}</span>
            </div>
            <div class="wx-review__division-teams">
              <span v-if="(g.rosters || []).length === 0" class="wx-review__division-none">No teams yet</span>
              <template v-else><span v-for="t in (g.rosters || [])" :key="t.id" class="wx-review__team-chip">{{ t.name }}</span></template>
            </div>
          </div>
          <div v-if="(league.s.loose || []).length > 0">
            <div class="wx-review__standalone-label">Standalone Teams</div>
            <div class="wx-review__standalone-teams">
              <span v-for="t in (league.s.loose || [])" :key="t.id" class="wx-review__team-chip">{{ t.name }}</span>
            </div>
          </div>
        </div>
      </WizardPanel>
    </div>
    <p class="wx-review__note">On initialization, products index into centralized factory inventory and launch configurations propagate online immediately.</p>
  </div>
</template>

<script>
import { FORMAT_LABELS, SHIP_LABELS, WIZARD_TEAMS } from '../../data/wizard.js';
import { shipToSummary } from '../../lib/store-home.js';
import { contactSummary, estimateYield } from '../../lib/wizard.js';
import ReviewProducts from './ReviewProducts.vue';
import StepHeader from './StepHeader.vue';
import SummaryRowWiz from './SummaryRowWiz.vue';
import UatReviewExtras from './UatReviewExtras.vue';
import WizardPanel from './WizardPanel.vue';

export default {
  name: 'Step6Review',
  components: { ReviewProducts, StepHeader, SummaryRowWiz, UatReviewExtras, WizardPanel },
  props: {
    data: { type: Object, default: undefined },
    accent: { type: String, default: undefined },
    athletes: { type: Number, default: 30 },
    stepNum: { type: Number, default: undefined },
    onEditBasics: { type: Function, default: undefined },
    onEditProducts: { type: Function, default: undefined },
    onRemoveProduct: { type: Function, default: undefined },
  },
  data() {
    return { FORMAT_LABELS, SHIP_LABELS, WIZARD_TEAMS };
  },
  computed: {
    // Not shown; computed as in the prototype.
    yieldAmt() { return estimateYield(this.data, this.athletes); },
    taxValue() {
      const { data } = this;
      return data.collectTax
        ? `Collecting${data.taxState ? ` — ${data.taxState}` : ""} @ ${data.taxRate || "0"}%`
        : "Tax Exempt";
    },
    managers() {
      const { data } = this;
      return [{ id: "primary", primary: true, firstName: data.firstName, lastName: data.lastName, email: data.email, phone: data.phone }, ...(data.additionalManagers || [])];
    },
    league() {
      const s = this.data.leagueStructure || { groups: [], loose: [] };
      const nDiv = (s.groups || []).length;
      const nTeam = (s.groups || []).reduce((n, g) => n + (g.rosters || []).length, 0) + (s.loose || []).length;
      return { s, nDiv, nTeam };
    },
  },
  methods: {
    contactSummary,
    shipToSummary,
    nameOf(m) { return [m.firstName, m.lastName].filter(Boolean).join(" "); },
  },
};
</script>
