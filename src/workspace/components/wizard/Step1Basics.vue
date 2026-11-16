<!-- Converted from workspace-app.jsx: Step1Basics — the Add Store wizard's Step 1: store type, details and
     fundraising, schedule and timeline, announcement, team branding (Team Database, logo, colors, sports),
     team & roster, managers, point of contact, fulfillment and tax, with the League → Individual warning and
     the template-break pop-up. The template banner and its pop-up only show for a store linked to a saved
     template (data._fromUserTemplate), which nothing in the prototype sets. -->
<template>
  <div>
    <StepHeader num="1" :accent="accent" title="Store Basics" desc="Set up the store, choose how it distributes orders, connect it to a team, assign a point of contact, and configure sales tax." />

    <div v-if="data._fromUserTemplate" class="wx-basics__template" :style="{ border: `1.5px solid ${accent}`, background: `${accent}0a` }">
      <div class="wx-basics__template-head">
        <span class="wx-basics__template-icon" :style="{ background: accent }"><IconTemplateGrid :size="18" /></span>
        <div class="wx-basics__template-text">
          <div class="wx-basics__template-title">Started from {{ data._templateName || "a saved template" }}</div>
          <div class="wx-basics__template-desc">Structure, distribution, and {{ (data.curatedProducts || []).length }} product{{ (data.curatedProducts || []).length === 1 ? "" : "s" }} are pre-loaded. Just add your team's branding below.</div>
        </div>
      </div>
      <div class="wx-basics__template-chips">
        <span class="wx-basics__template-chip"><IconUsers v-if="data.storeType === 'single'" :size="13" /><IconLayers v-else :size="13" /> {{ tplTypeLabel(data.storeType) }}</span>
        <span class="wx-basics__template-chip"><IconBag v-if="data.distributionModel === 'home'" :size="13" /><IconUsers v-else :size="13" /> {{ tplDistLabel(data.distributionModel) }}</span>
        <span class="wx-basics__template-chip"><IconShirt :size="13" /> {{ (data.curatedProducts || []).length }} products pre-loaded</span>
      </div>
    </div>

    <WizardPanel label="Store Type" hint="Determines the structural workflow across the whole store">
      <div class="wx-basics__two-col">
        <ChoiceCard v-for="t in STORE_TYPES" :key="t.key" :accent="accent" :minHeight="172" :active="data.storeType === t.key" :onSelect="() => requestStoreType(t.key)" :title="t.name" :desc="t.desc" :points="t.points">
          <template #icon><component :is="t.icon" :size="22" /></template>
        </ChoiceCard>
      </div>
      <div v-if="errors.storeType" class="wx-basics__error">{{ errors.storeType }}</div>
      <div v-if="data.storeType" class="wx-basics__type-note">
        <IconInfo :size="15" :style="{ flexShrink: 0, marginTop: '1px', color: accent }" />
        <span>{{ data.storeType === "single" ? "Single-Team Locker keeps one team — the multi-team canvas and product-to-team assignment stay off across this store." : "Multi-Team Hub unlocks the division → team canvas, per-team branding, product-to-team assignment, and manager mapping throughout the workspace." }}</span>
      </div>
    </WizardPanel>

    <WizardPanel label="Store Details">
      <TextField label="Store Name" :value="data.storeTitle" :onChange="(v) => set({ storeTitle: v, ...(data._slugTouched ? {} : { storeSlug: slugify(v) }) })" :error="errors.storeTitle" />

      <div class="wx-basics__web-address">
        <div class="wx-basics__label">Web Address</div>
        <div :class="`wx-basics__slug-box${errors.storeSlug ? ' wx-basics__slug-box--error' : ''}`">
          <span class="wx-basics__slug-prefix">prolookstores.com/</span>
          <input :value="data.storeSlug || ''" @input="(e) => set({ storeSlug: slugify(e.target.value), _slugTouched: true })" placeholder="store-slug" class="wx-basics__slug-input" />
        </div>
        <div v-if="errors.storeSlug" class="wx-basics__slug-error">{{ errors.storeSlug }}</div>
      </div>

      <div class="wx-basics__section">
        <div class="wx-basics__eyebrow">Team Fundraising</div>
        <div class="wx-basics__toggle-row">
          <span :class="`wx-basics__toggle-icon${(data.fundraisingEnabled ?? false) ? ' wx-basics__toggle-icon--on' : ''}`" :style="{ color: (data.fundraisingEnabled ?? false) ? accent : '#6b6b72' }"><IconDollar :size="20" /></span>
          <div class="wx-basics__toggle-text">
            <div class="wx-basics__toggle-title">Enable Team Fundraising</div>
            <div class="wx-basics__toggle-desc">{{ (data.fundraisingEnabled ?? false) ? "Items can collect a per-item fundraising amount, and a Fundraising Report is available under Reports." : "New items stop collecting fundraising. Items with orders keep collecting, and entered amounts are kept." }}</div>
          </div>
          <ToggleSwitch :on="data.fundraisingEnabled ?? false" :onChange="(v) => set({ fundraisingEnabled: v })" :accent="accent" />
        </div>
      </div>
    </WizardPanel>

    <WizardPanel label="Store Schedule">
      <div class="wx-basics__two-col">
        <ChoiceCard v-for="f in STORE_SCHEDULES" :key="f.key" :accent="accent" :minHeight="172" :active="data.distributionFormat === f.key" :onSelect="() => guardTemplateSet('Store Schedule', { distributionFormat: f.key, storeOpenMode: f.key === 'locker' ? 'stay-open' : 'set-window' }, data.distributionFormat, f.key)" :title="f.title" :desc="f.desc">
          <template #icon><component :is="f.icon" :size="22" /></template>
        </ChoiceCard>
      </div>
      <div v-if="errors.distributionFormat" class="wx-basics__error">{{ errors.distributionFormat }}</div>
    </WizardPanel>

    <WizardPanel v-if="isPopup" label="Store Timeline">
      <div class="wx-basics__two-col">
        <WizardDate label="Store Launch Date" :value="data.storeOpenStart" :onChange="(v) => set({ storeOpenStart: v })" :error="errors.storeOpenStart" />
        <WizardDate label="Store Closing Deadline" :value="data.storeOpenEnd" :onChange="(v) => set({ storeOpenEnd: v })" :error="errors.storeOpenEnd" />
      </div>
      <div class="wx-basics__urgency">
        <span class="wx-basics__urgency-icon"><IconClock :size="20" /></span>
        <div class="wx-basics__toggle-text">
          <div class="wx-basics__toggle-title">Enable Urgency Timers</div>
          <div class="wx-basics__toggle-desc">Show a real-time closing countdown on the storefront.</div>
        </div>
        <ToggleSwitch :on="data.urgencyTimers" :onChange="(v) => set({ urgencyTimers: v })" :accent="accent" />
      </div>
    </WizardPanel>

    <WizardPanel label="Announcement Message" hint="Optional — buyers see it at the top of your storefront">
      <AnnouncementEditor :value="data.announcement || ''" :onChange="(v) => set({ announcement: v })" :accent="accent" />
      <div class="wx-basics__notes">
        <div class="wx-basics__note">
          <IconInfo :size="14" :style="{ flexShrink: 0, marginTop: '1px' }" />
          <span>Leave it blank and the storefront shows <b>no banner at all</b> — skipping this is a clean outcome, not an unfinished step.</span>
        </div>
        <div v-if="data.storeType === 'league'" class="wx-basics__note">
          <IconInfo :size="14" :style="{ flexShrink: 0, marginTop: '1px' }" />
          <span>This is the <b>store-level</b> message. Divisions and standalone teams can carry their own later from Settings — they're built in the next step.</span>
        </div>
      </div>
    </WizardPanel>

    <WizardPanel label="Team Branding &amp; Sport">
      <div :class="`wx-basics__team-card${data.connectedTeam ? ' wx-basics__team-card--connected' : ''}`" :style="{ border: `1.5px solid ${data.connectedTeam ? accent : '#e5e5e9'}` }">
        <div class="wx-basics__team-main">
          <span class="wx-basics__team-icon" :style="{ background: data.connectedTeam ? accent : '#0e0e10' }"><IconGroupAdd :size="20" /></span>
          <div class="wx-basics__team-text">
            <div class="wx-basics__team-title">{{ data.connectedTeam ? `Connected — ${connectedLabel}` : "Import Team Profile" }}</div>
            <div class="wx-basics__team-desc">{{ data.connectedTeam ? "Official logo, colors, and sports were imported below. Reconnect to switch teams." : "Connect directly to our team database to automatically import the official school colors and logos used on your physical player uniforms." }}</div>
          </div>
        </div>
        <div class="wx-basics__team-actions">
          <button v-if="data.connectedTeam" type="button" @click="clearTeam" :title="data.connectedTeam ? 'Remove the connected team’s logo, colors, and sports' : 'No team selected to clear'" :class="`wx-basics__team-clear${data.connectedTeam ? ' wx-basics__team-clear--active' : ''}`" @mouseenter="(e) => { if (data.connectedTeam) e.currentTarget.style.borderColor = '#0e0e10'; }" @mouseleave="(e) => { e.currentTarget.style.borderColor = '#d4d4d8'; }">Clear</button>
          <button type="button" @click="() => setTeamModalOpen(true)" class="wx-basics__team-connect" @mouseenter="(e) => e.currentTarget.style.background = accent" @mouseleave="(e) => e.currentTarget.style.background = '#0e0e10'">{{ data.connectedTeam ? "Change Team" : "Connect to Team" }}</button>
        </div>
      </div>
      <div v-if="errors.connectedTeam" class="wx-basics__team-error">{{ errors.connectedTeam }}</div>

      <div class="wx-basics__team-name">
        <div class="wx-basics__field-label">Team Name</div>
        <input type="text" :value="data.teamName || ''" @input="(e) => set({ teamName: e.target.value })" placeholder="e.g. Carlsbad Padres" class="wx-basics__input" />
        <div class="wx-basics__team-name-hint">{{ data.connectedTeam ? "Pulled from the connected team profile — edit if needed." : "Auto-fills when you connect to a team in the database." }}</div>
      </div>

      <div class="wx-basics__branding">
        <div class="wx-basics__brand-card">
          <div class="wx-basics__brand-title">Team Logo</div>
          <LogoDropZone :logo="data.teamLogo" :onChange="(v) => set({ teamLogo: v })" />
          <div class="wx-basics__brand-hint">Used to brand the storefront header and pre-set product customization.</div>
        </div>
        <div class="wx-basics__brand-card">
          <div class="wx-basics__brand-title">Team Colors</div>
          <ColorSwatches :colors="data.teamColors || []" :onChange="(v) => set({ teamColors: v })" />
        </div>
      </div>

      <div class="wx-basics__sports-label">Sports <span class="wx-basics__sports-hint">· select all that apply</span></div>
      <MultiSelectChips :options="WIZARD_SPORTS" :value="data.sports" :onChange="(v) => set({ sports: v })" :accent="accent" />
    </WizardPanel>

    <WizardPanel label="Team &amp; Roster" hint="Defaults for every roster in this store — override per team later in My Team(s)">
      <div class="wx-basics__toggle-row">
        <span :class="`wx-basics__toggle-icon${(data.allowDuplicateNumbers ?? false) ? ' wx-basics__toggle-icon--on' : ''}`" :style="{ color: (data.allowDuplicateNumbers ?? false) ? accent : '#6b6b72' }"><IconUsers :size="20" /></span>
        <div class="wx-basics__toggle-text">
          <div class="wx-basics__toggle-title">Allow Duplicate Numbers</div>
          <div class="wx-basics__toggle-desc">Sets the default for every team's roster in this store. Any individual roster can override it later from the My Team(s) tab — a bulk default, not a lock.</div>
        </div>
        <ToggleSwitch :on="data.allowDuplicateNumbers ?? false" :onChange="(v) => set({ allowDuplicateNumbers: v })" :accent="accent" />
      </div>
      <div class="wx-basics__section">
        <div class="wx-basics__jersey-label">Jersey Number Selection</div>
        <div class="wx-basics__jersey-desc">Decide who chooses jersey numbers for numbered team gear.</div>
        <NumberSelectionOptions :value="data.numberSelection || 'manager'" :onChange="(v) => set({ numberSelection: v })" />
        <div class="wx-basics__jersey-hint">{{ numberSelectionHelper(data.numberSelection || "manager") }}</div>
      </div>
    </WizardPanel>

    <WizardPanel :label="data.storeType === 'league' ? 'League Manager' : 'Team Manager'" :hint="data.storeType === 'league' ? 'League director' : 'Team coach'">
      <span id="tm-panel" class="wx-basics__anchor"></span>
      <div class="wx-basics__name-row">
        <div>
          <div class="wx-basics__field-label">First Name</div>
          <input type="text" :value="data.firstName || ''" @input="(e) => set({ firstName: e.target.value })" placeholder="Jordan" class="wx-basics__input" />
        </div>
        <div>
          <div class="wx-basics__field-label">Last Name</div>
          <input type="text" :value="data.lastName || ''" @input="(e) => set({ lastName: e.target.value })" placeholder="Rivera" class="wx-basics__input" />
        </div>
      </div>
      <div class="wx-basics__two-col">
        <div>
          <div class="wx-basics__field-label">Email</div>
          <input type="email" :value="data.email || ''" @input="(e) => set({ email: e.target.value })" placeholder="name@example.com" class="wx-basics__input" :style="{ ...(errors.email ? { borderColor: '#b81d14' } : {}) }" />
          <div v-if="errors.email" class="wx-basics__field-error">{{ errors.email }}</div>
        </div>
        <div>
          <div class="wx-basics__field-label">Phone Number</div>
          <input type="tel" :value="data.phone || ''" @input="(e) => set({ phone: formatPhone(e.target.value) })" placeholder="111-000-3243" class="wx-basics__phone-input" :style="{ ...(errors.phone ? { borderColor: '#b81d14' } : {}) }" />
          <div v-if="errors.phone" class="wx-basics__field-error">{{ errors.phone }}</div>
        </div>
      </div>

      <div v-for="m in (data.additionalManagers || [])" :key="m.id" class="wx-basics__section">
        <div class="wx-basics__manager-head">
          <span class="wx-basics__manager-tag">Additional Manager</span>
          <span class="wx-basics__manager-note">Contact record only — doesn't feed the point of contact</span>
          <span class="wx-basics__spacer" />
          <button type="button" @click="() => set({ additionalManagers: (data.additionalManagers || []).filter((x) => x.id !== m.id) })" class="wx-basics__manager-remove"><IconTrash :size="13" :style="{ strokeWidth: 2 }" /> Remove</button>
        </div>
        <div class="wx-basics__name-row">
          <div>
            <div class="wx-basics__field-label">First Name</div>
            <input type="text" :value="m.firstName || ''" @input="(e) => patchAddedManager(m.id, { firstName: e.target.value })" placeholder="Alex" class="wx-basics__input" />
          </div>
          <div>
            <div class="wx-basics__field-label">Last Name</div>
            <input type="text" :value="m.lastName || ''" @input="(e) => patchAddedManager(m.id, { lastName: e.target.value })" placeholder="Nguyen" class="wx-basics__input" />
          </div>
        </div>
        <div class="wx-basics__two-col">
          <div>
            <div class="wx-basics__field-label">Email</div>
            <input type="email" :value="m.email || ''" @input="(e) => patchAddedManager(m.id, { email: e.target.value })" placeholder="name@example.com" class="wx-basics__input" />
          </div>
          <div>
            <div class="wx-basics__field-label">Phone Number</div>
            <input type="tel" :value="m.phone || ''" @input="(e) => patchAddedManager(m.id, { phone: formatPhone(e.target.value) })" placeholder="111-000-3243" class="wx-basics__phone-input" />
          </div>
        </div>
      </div>
      <div class="wx-basics__add-manager">
        <button type="button" @click="addManager" class="wx-basics__add-manager-btn"><IconPlus :size="14" :style="{ strokeWidth: 2.4 }" /> Add another manager</button>
        <span class="wx-basics__add-manager-note">Optional. These are contact records, not portal invitations — Team Manager Portal invites live in Settings → People &amp; Access.</span>
      </div>
    </WizardPanel>

    <WizardPanel label="Store Point of Contact">
      <StorePointOfContact :data="data" :set="set" :accent="accent" :errors="errors" />
    </WizardPanel>

    <WizardPanel label="Fulfillment Method">
      <div class="wx-basics__two-col">
        <ChoiceCard v-for="m in FULFILLMENT_METHODS" :key="m.key" :accent="accent" :minHeight="172" :active="data.distributionModel === m.key" :onSelect="() => guardTemplateSet('Fulfillment Method', { distributionModel: m.key }, data.distributionModel, m.key)" :title="m.title" :desc="m.desc" :badge="m.badge">
          <template #icon><component :is="m.icon" :size="22" /></template>
        </ChoiceCard>
      </div>
      <div v-if="errors.distributionModel" class="wx-basics__error">{{ errors.distributionModel }}</div>
      <div v-if="data.distributionModel === 'coach'" class="wx-basics__ship-section">
        <div class="wx-basics__ship-title">Ship-To Destination</div>
        <div class="wx-basics__ship-desc">Where the bulk shipment goes — a saved pick-up location or the {{ data.storeType === "league" ? "league" : "team" }} manager's address. Optional for now, but orders can't be submitted for fulfillment until a destination exists. Editable later in Settings → Distribution &amp; Fulfillment.</div>
        <ShipToDestinationPicker :value="data" :onChange="(patch) => set(patch)" :accent="accent" />
      </div>
    </WizardPanel>

    <WizardPanel label="Compliance &amp; Taxation" hint="Turn this toggle off to mark the store as tax exempt — no sales tax is collected from storefront buyers">
      <div class="wx-basics__toggle-row">
        <span :class="`wx-basics__toggle-icon${data.collectTax ? ' wx-basics__toggle-icon--on' : ''}`" :style="{ color: data.collectTax ? accent : '#6b6b72' }"><IconDollar :size="20" /></span>
        <div class="wx-basics__toggle-text">
          <div class="wx-basics__toggle-title">Collect Sales Tax</div>
          <div class="wx-basics__toggle-desc">{{ data.collectTax ? "Tax is applied to buyers in your designated state at checkout." : "Tax-exempt checkout — no tax is applied and no extra inputs are required." }}</div>
        </div>
        <ToggleSwitch :on="data.collectTax" :onChange="(v) => set({ collectTax: v })" :accent="accent" />
      </div>
      <div v-if="data.collectTax" class="wx-basics__tax-details">
        <div class="wx-basics__two-col">
          <StateSearchSelect label="State" :value="data.taxState" :onChange="(v) => set({ taxState: v, taxRate: STATE_TAX_RATES[v] != null ? String(STATE_TAX_RATES[v]) : data.taxRate })" />
          <TextField label="Tax Rate %" :value="data.taxState ? data.taxRate : ''" readOnly placeholder="Select a state" :error="errors.taxRate">
            <template #suffix><span class="wx-basics__tax-suffix">%</span></template>
          </TextField>
        </div>
        <div class="wx-basics__tax-hint">The tax rate is set automatically from the selected state. Tax is output exclusively to buyers in the selected state.</div>
        <div :class="`wx-basics__tax-agree${errors.taxLiability ? ' wx-basics__tax-agree--error' : ''}`">
          <Checkbox :checked="data.taxLiabilityAgreed" :onChange="(v) => set({ taxLiabilityAgreed: v })" label="I acknowledge I am the taxing entity responsible for collecting and remitting sales tax, and that PROLOOK provides the collection tools only." />
          <div v-if="errors.taxLiability" class="wx-basics__tax-error">{{ errors.taxLiability }}</div>
        </div>
      </div>
    </WizardPanel>

    <TeamDatabaseModal :open="teamModalOpen" :onClose="() => setTeamModalOpen(false)" :onSelect="applyTeam" :accent="accent" :hasTeam="!!data.connectedTeam" :onClearTeam="clearTeam" />
    <Toast :message="teamToast" :onDone="() => setTeamToast('')" />

    <Modal :open="!!typeSwitch" :onClose="() => setTypeSwitch(null)" :width="470">
      <div class="wx-basics__modal">
        <div class="wx-basics__modal-icon">
          <IconAlert :size="20" />
        </div>
        <h3 class="wx-basics__modal-title">Switching removes your divisions &amp; teams</h3>
        <p class="wx-basics__modal-text">An Individual Team Store has no Divisions &amp; Teams step. Switching discards the {{ structCounts.divisions }} {{ structCounts.divisions === 1 ? "division" : "divisions" }} and {{ structCounts.teams }} {{ structCounts.teams === 1 ? "team" : "teams" }} you set up — this can't be undone.</p>
        <div class="wx-basics__modal-actions">
          <Button variant="ghost" :onClick="() => setTypeSwitch(null)">Keep League Store</Button>
          <Button variant="danger" :onClick="confirmTypeSwitch">Switch &amp; Discard</Button>
        </div>
      </div>
    </Modal>

    <Modal v-if="breakModal" :open="!!breakModal" :onClose="() => setBreakModal(null)" :width="460">
      <div class="wx-basics__modal">
        <div class="wx-basics__modal-icon">
          <IconAlert :size="20" />
        </div>
        <h3 class="wx-basics__modal-title">Change breaks the template</h3>
        <p class="wx-basics__break-text"><strong class="wx-basics__strong">{{ breakModal.label }}</strong> was pre-selected by <strong class="wx-basics__strong">{{ data._templateName || "the saved template" }}</strong>. Changing it unlinks this store from the template. Everything else the template pre-loaded stays exactly as it is.</p>
        <div class="wx-basics__break-values">
          <span class="wx-basics__break-from">{{ readableVal(breakModal.label, breakModal.current) }}</span>
          <IconChevronRight :size="15" :style="{ color: '#c7c7cd', flexShrink: 0 }" />
          <span class="wx-basics__break-to">{{ readableVal(breakModal.label, breakModal.next) }}</span>
        </div>
        <div class="wx-basics__modal-actions">
          <Button variant="ghost" :onClick="() => setBreakModal(null)">Keep Template</Button>
          <Button variant="danger" :onClick="confirmBreak">Change &amp; Unlink</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import { FULFILLMENT_METHODS, STATE_TAX_RATES, STORE_SCHEDULES, STORE_TYPES, TEAM_DATABASE, WIZARD_SPORTS } from '../../data/wizard.js';
import { formatPhone, numberSelectionHelper, slugify, tplDistLabel, tplTypeLabel } from '../../lib/wizard.js';
import Button from '../common/Button.vue';
import Checkbox from '../common/Checkbox.vue';
import Modal from '../common/Modal.vue';
import TextField from '../common/TextField.vue';
import Toast from '../common/Toast.vue';
import { IconAlert, IconBag, IconChevronRight, IconClock, IconDollar, IconGroupAdd, IconInfo, IconLayers, IconPlus, IconShirt, IconTrash, IconUsers } from '../icons.js';
import AnnouncementEditor from './AnnouncementEditor.vue';
import ChoiceCard from './ChoiceCard.vue';
import ColorSwatches from './ColorSwatches.vue';
import IconTemplateGrid from './IconTemplateGrid.vue';
import LogoDropZone from './LogoDropZone.vue';
import MultiSelectChips from './MultiSelectChips.vue';
import NumberSelectionOptions from './NumberSelectionOptions.vue';
import ShipToDestinationPicker from './ShipToDestinationPicker.vue';
import StateSearchSelect from './StateSearchSelect.vue';
import StepHeader from './StepHeader.vue';
import StorePointOfContact from './StorePointOfContact.vue';
import TeamDatabaseModal from './TeamDatabaseModal.vue';
import ToggleSwitch from './ToggleSwitch.vue';
import WizardDate from './WizardDate.vue';
import WizardPanel from './WizardPanel.vue';

export default {
  name: 'Step1Basics',
  components: {
    AnnouncementEditor, Button, Checkbox, ChoiceCard, ColorSwatches, IconAlert, IconBag, IconChevronRight, IconClock, IconDollar,
    IconGroupAdd, IconInfo, IconLayers, IconPlus, IconShirt, IconTemplateGrid, IconTrash, IconUsers, LogoDropZone, Modal,
    MultiSelectChips, NumberSelectionOptions, ShipToDestinationPicker, StateSearchSelect, StepHeader, StorePointOfContact,
    TeamDatabaseModal, TextField, Toast, ToggleSwitch, WizardDate, WizardPanel,
  },
  props: {
    data: { type: Object, required: true },
    set: { type: Function, default: undefined },
    errors: { type: Object, default: () => ({}) },
    accent: { type: String, default: undefined },
    // Passed with the other step props; unused here, as in the prototype.
    liveStores: { type: Array, default: undefined },
    stepNum: { type: Number, default: undefined },
  },
  data() {
    return {
      teamModalOpen: false, breakModal: null, typeSwitch: null, teamToast: "",
      STORE_TYPES, STORE_SCHEDULES, FULFILLMENT_METHODS, WIZARD_SPORTS, STATE_TAX_RATES,
    };
  },
  computed: {
    isPopup() { return this.data.distributionFormat === "popup"; },
    connectedLabel() { const connectedTeam = TEAM_DATABASE.find((t) => t.id === this.data.connectedTeam); return (connectedTeam || {}).name || this.data.teamName; },
    structCounts() {
      const s = this.data.leagueStructure || { groups: [], loose: [] };
      const teams = (s.groups || []).reduce((n, g) => n + (g.rosters || []).length, 0) + (s.loose || []).length;
      return { divisions: (s.groups || []).length, teams };
    },
  },
  methods: {
    formatPhone, numberSelectionHelper, slugify, tplDistLabel, tplTypeLabel,
    setTeamModalOpen(v) { this.teamModalOpen = v; },
    setBreakModal(v) { this.breakModal = v; },
    setTypeSwitch(v) { this.typeSwitch = v; },
    setTeamToast(v) { this.teamToast = v; },
    // While a store is still linked to a saved template, changing a template-defining option (store type,
    // schedule, fulfillment) asks first; confirming applies that change and unlinks the store.
    guardTemplateSet(label, patch, current, next) {
      if (this.data._fromUserTemplate && current !== next) this.setBreakModal({ label, current, next, patch });
      else this.set(patch);
    },
    confirmBreak() {
      if (this.breakModal) this.set({ ...this.breakModal.patch, _fromUserTemplate: false, _templateName: "" });
      this.setBreakModal(null);
    },
    // League → Individual removes the Divisions & Teams step: with structure built, confirm first.
    requestStoreType(key) {
      const { data, structCounts } = this;
      if (key === "single" && data.storeType === "league" && (structCounts.divisions > 0 || structCounts.teams > 0)) {
        this.setTypeSwitch(key);
        return;
      }
      this.guardTemplateSet("Store Type", { storeType: key }, data.storeType, key);
    },
    confirmTypeSwitch() {
      this.guardTemplateSet("Store Type", { storeType: this.typeSwitch, leagueStructure: { groups: [], loose: [] } }, this.data.storeType, this.typeSwitch);
      this.setTypeSwitch(null);
    },
    // Inherit the selected team's official branding into the wizard.
    applyTeam(t) {
      const { data } = this;
      this.set({
        connectedTeam: t.id,
        teamName: t.name,
        storeTitle: data.storeTitle && data.storeTitle.trim() ? data.storeTitle : t.name,
        ...(data._slugTouched ? {} : { storeSlug: slugify(data.storeTitle || t.name) }),
        teamLogo: { mono: t.mono, color: t.logoColor },
        teamColors: [t.primary, t.secondary, "#ffffff"],
        primaryColor: t.primary,
        sports: t.sports,
      });
      this.setTeamModalOpen(false);
    },
    // Clear the connected team — removes the imported logo, colors, and sports.
    clearTeam() {
      this.set({ connectedTeam: "", teamLogo: null, teamColors: [], sports: [] });
      this.setTeamModalOpen(false);
      this.setTeamToast("Team cleared — logo, colors, and sports removed");
    },
    patchAddedManager(id, patch) { this.set({ additionalManagers: (this.data.additionalManagers || []).map((x) => x.id === id ? { ...x, ...patch } : x) }); },
    addManager() { this.set({ additionalManagers: [...(this.data.additionalManagers || []), { id: "mgr-" + Date.now(), firstName: "", lastName: "", email: "", phone: "" }] }); },
    readableVal(label, val) {
      return label === "Store Type" ? tplTypeLabel(val)
        : label === "Store Schedule" ? (val === "locker" ? "Always-On Locker" : "Temporary Pop-Up")
        : label === "Fulfillment Method" ? (val === "home" ? "Direct-To-Home" : "Ship to Team Manager")
        : String(val);
    },
  },
};
</script>
