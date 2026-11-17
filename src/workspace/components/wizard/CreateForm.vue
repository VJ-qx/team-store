<!-- Converted from workspace-app.jsx and workspace-app-integrated.jsx: CreateForm — the Add Store wizard's
     frame: header with the "Step N of M" badge, the stepper, the step card, and the footer (CANCEL, BACK,
     CONTINUE, or SAVE AND CONTINUE on the last step). League stores have 4 steps, Individual stores 3.
     Converted so far: Step 1, Basics, and Add Products. Divisions & Teams and Review & Deploy are the later
     parts of Module 3 (FR-3.1); until then their step shows an empty card, and SAVE AND CONTINUE has no
     onSubmit.
     The integrated workspace's Stock Vault start (_fromVault) makes Add Products reachable and pre-loaded. -->
<template>
  <div id="wizard-scroll" class="wx-wizard">
    <div class="wx-wizard__header">
      <div class="wx-wizard__header-row">
        <div>
          <div class="wx-wizard__eyebrow">Team Store Setup</div>
          <h1 class="wx-wizard__title">{{ templateMode ? "Finish Your Template Store" : "Create a Team Store" }}</h1>
          <div v-if="data._dupSource" class="wx-wizard__source">
            <IconLayers :size="13" :style="{ strokeWidth: 2 }" />
            <span>{{ data._dupSource.mode === "full" ? "Duplicated from " : "Products from " }}<strong class="wx-wizard__source-name">{{ data._dupSource.sourceName }}</strong> · {{ (data.curatedProducts || []).length }} product{{ (data.curatedProducts || []).length === 1 ? "" : "s" }}{{ !data._dupSource.mine && data._dupSource.owner ? " · " + data._dupSource.owner + "’s store" : "" }}</span>
          </div>
        </div>
        <span class="wx-wizard__step-badge" :style="{ border: `1.5px solid ${accent}`, color: accent }">Step {{ step + 1 }} of {{ STEPS.length }}</span>
      </div>

      <WizardStepper :current="step" :maxReached="maxReached" :onJump="goTo" :accent="accent" :steps="STEPS" :preDone="data._fromVault ? ['products'] : []" />
    </div>

    <div class="wx-wizard__body">
      <div class="wx-wizard__card">
        <Step1Basics v-if="STEPS[step].key === 'basics'" :data="data" :set="set" :errors="errors" :accent="accent" :liveStores="liveStores" :stepNum="step + 1" />
        <Step3Products v-if="STEPS[step].key === 'products'" :data="data" :set="set" :errors="errors" :accent="accent" :liveStores="liveStores" :stepNum="step + 1" />
      </div>
    </div>

    <div class="wx-wizard__footer">
      <Button variant="ghost" :onClick="onCancel">CANCEL</Button>
      <div class="wx-wizard__actions">
        <span v-if="!isLast && Object.keys(errors).length > 0" class="wx-wizard__error-note"><IconAlert :size="15" :style="{ strokeWidth: 2.2, flexShrink: 0 }" /> Please complete the required fields above</span>
        <Button v-if="step > 0" variant="secondary" :onClick="back"><IconChevronLeft :size="15" /> BACK</Button>
        <button v-if="isLast" @click="deploy" class="wx-wizard__save" @mouseenter="(e) => e.currentTarget.style.background = '#1f1f22'" @mouseleave="(e) => e.currentTarget.style.background = '#0e0e10'"><IconCheck :size="16" :style="{ strokeWidth: 3 }" /> SAVE AND CONTINUE</button>
        <Button v-else variant="primary" :onClick="next">CONTINUE <IconChevronRight :size="15" /></Button>
      </div>
    </div>
  </div>
</template>

<script>
import { TEAMS_TO_CONNECT } from '../../data/wizard.js';
import { isValidEmail, isValidPhone } from '../../lib/rosters.js';
import { buildWizardData, wizardStepsFor } from '../../lib/wizard.js';
import Button from '../common/Button.vue';
import { IconAlert, IconCheck, IconChevronLeft, IconChevronRight, IconLayers } from '../icons.js';
import Step1Basics from './Step1Basics.vue';
import Step3Products from './Step3Products.vue';
import WizardStepper from './WizardStepper.vue';

export default {
  name: 'CreateForm',
  components: { Button, IconAlert, IconCheck, IconChevronLeft, IconChevronRight, IconLayers, Step1Basics, Step3Products, WizardStepper },
  props: {
    onCancel: { type: Function, default: undefined },
    onSubmit: { type: Function, default: undefined },
    presetData: { type: Object, default: undefined },
    accent: { type: String, default: "#e1251b" },
    athletes: { type: Number, default: 30 },
    templateMode: { type: Boolean, default: false },
    liveStores: { type: Array, default: undefined },
  },
  data() {
    const data = buildWizardData(this.presetData);
    // One source of truth for every step number, badge and label (League = 4 steps, Individual = 3).
    const base = wizardStepsFor(data.storeType);
    const steps = (this.templateMode || data._skipProducts) ? base.filter((s) => s.key !== "products") : base;
    // A store started from another store lands on Review & Deploy with every earlier step reachable;
    // a Stock Vault start (integrated workspace) has Add Products reachable.
    const step = data._startAt === "review" ? steps.length - 1 : 0;
    const maxReached = data._startAt === "review" ? steps.length - 1 : (this.presetData && this.presetData._fromVault ? 1 : 0);
    return { data, step, maxReached, errors: {} };
  },
  computed: {
    STEPS() {
      const base = wizardStepsFor(this.data.storeType);
      return (this.templateMode || this.data._skipProducts) ? base.filter((s) => s.key !== "products") : base;
    },
    isLast() { return this.step === this.STEPS.length - 1; },
  },
  watch: {
    // React: useEffect on [STEPS.length] — keep the indices valid when the list shrinks (League → Individual).
    'STEPS.length'() { this.clampSteps(); },
  },
  mounted() {
    this.clampSteps();
  },
  methods: {
    clampSteps() {
      if (this.step > this.STEPS.length - 1) this.setStep(this.STEPS.length - 1);
      if (this.maxReached > this.STEPS.length - 1) this.setMaxReached(this.STEPS.length - 1);
    },
    setStep(v) { this.step = typeof v === "function" ? v(this.step) : v; },
    setMaxReached(v) { this.maxReached = typeof v === "function" ? v(this.maxReached) : v; },
    setErrors(v) { this.errors = v; },
    set(patch) { this.data = { ...this.data, ...patch }; },
    // Divisions & Teams structure (League Step 2), same shape as the workspace org.
    setStructure(fn) {
      const cur = this.data.leagueStructure || { groups: [], loose: [] };
      const next = typeof fn === "function" ? fn(cur) : fn;
      this.data = { ...this.data, leagueStructure: { groups: next.groups || [], loose: next.loose || [] } };
    },
    scrollTop() {
      const el = document.getElementById("wizard-scroll");
      if (el && el.scrollHeight > el.clientHeight + 4) el.scrollTo({ top: 0, behavior: "smooth" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    validateStep(s) {
      const { data } = this;
      const e = {};
      if ((this.STEPS[s] || {}).key === "basics") {
        if (!data.storeTitle || !data.storeTitle.trim()) e.storeTitle = "Store name is required";
        if (!data.storeSlug || !data.storeSlug.trim()) e.storeSlug = "Web address is required";
        // Team Manager is the default point-of-contact source — any channel left on that mode makes the
        // corresponding record field required (the error lands there).
        const emMode = data.contactEmailMode === "service" ? "teammanager" : (data.contactEmailMode || "");
        const phMode = data.contactPhoneMode === "service" ? "teammanager" : (data.contactPhoneMode || "");
        if (!emMode) e.contactEmailMode = "Select an email point of contact";
        if (!phMode) e.contactPhoneMode = "Select a phone point of contact";
        if (!data.storeType) e.storeType = "Select a store type";
        if (!data.distributionFormat) e.distributionFormat = "Select a store schedule";
        if (!data.distributionModel) e.distributionModel = "Select a fulfillment method";
        if (emMode === "teammanager" && !isValidEmail(data.email)) e.email = "Required — the store's point of contact follows this record";
        if (phMode === "teammanager" && !isValidPhone(data.phone)) e.phone = "Enter a 10-digit phone — the store's point of contact follows this record";
        if (data.distributionFormat === "popup") {
          if (!data.storeOpenStart) e.storeOpenStart = "Launch date is required";
          if (!data.storeOpenEnd) e.storeOpenEnd = "Closing date is required";
        }
        if (data.collectTax) {
          if (!data.taxRate || isNaN(parseFloat(data.taxRate))) e.taxRate = "Enter a rate or select a state";
          if (!data.taxLiabilityAgreed) e.taxLiability = "You must accept the tax liability agreement to continue";
        }
      }
      this.setErrors(e);
      return Object.keys(e).length === 0;
    },
    goTo(s) {
      if (s <= this.maxReached) { this.setStep(s); this.setErrors({}); this.scrollTop(); }
    },
    next() {
      if (!this.validateStep(this.step)) return;
      const n = Math.min(this.step + 1, this.STEPS.length - 1);
      this.setStep(n);
      this.setMaxReached((m) => Math.max(m, n));
      this.scrollTop();
    },
    back() { this.setStep((s) => Math.max(0, s - 1)); this.setErrors({}); this.scrollTop(); },
    deploy() {
      const { data } = this;
      if (!this.validateStep(this.step)) return;
      const SP = [
        { value: "braeden-stokes", email: "braeden@stokesathletics.com", phone: "208-654-8619" },
        { value: "maria-lopez", email: "maria@prolook.com", phone: "801-555-0142" },
        { value: "devon-pierce", email: "devon@prolook.com", phone: "801-555-0188" }];
      const findSp = (v) => SP.find((s) => s.value === v) || {};
      // Team Manager mode inherits the manager record; salesperson/custom override.
      const derivedEmail = data.contactEmailMode === "salesperson" ? findSp(data.contactEmailSalesperson).email || data.email :
        data.contactEmailMode === "custom" ? data.contactEmailCustom || data.email :
        data.email;
      const derivedPhone = data.contactPhoneMode === "salesperson" ? findSp(data.contactPhoneSalesperson).phone || data.phone :
        data.contactPhoneMode === "custom" ? data.contactPhoneCustom || data.phone :
        data.phone;
      const mapped = {
        ...data,
        email: derivedEmail || data.email,
        phone: derivedPhone || data.phone,
        teamName: data.teamName || (TEAMS_TO_CONNECT.find((t) => t.value === data.connectedTeam) || {}).label || data.teamName,
        collectTax: !!data.collectTax,
        taxRate: data.collectTax ? data.taxRate || "0" : "0",
        taxState: data.collectTax ? data.taxState : "",
        taxMode: data.collectTax ? "flat" : "exempt",
        shipName: data.managerName || data.shipName,
        shipOption: data.distributionModel === "home" ? "Ship to each Player" : "Ship to Coach",
        storeOpenMode: data.distributionFormat === "locker" ? "stay-open" : "set-window",
        teamColors: data.teamColors && data.teamColors.length ? data.teamColors : [data.primaryColor, "#0e0e10", "#ffffff"],
      };
      this.onSubmit(mapped);
    },
  },
};
</script>
