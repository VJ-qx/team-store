<!-- Converted from workspace-app.jsx and workspace-app-integrated.jsx: Step3Products — the Add Store wizard's
     Add Products step: the Source pill, one browser across every source (Customizer saved designs and carts,
     Stock Vault, Catalog Templates, other stores), the Configure & Add to Store pop-up each item goes
     through (application sizes, product and price settings, and on League stores with teams, Assign to
     Teams), Customize New Product (sport → product → builder → review), and the remove confirmation.
     Integrated workspace: every Stock Vault item is auto-added to a new store (reps remove rather than add;
     a banner counts them, with Remove all / Add all back), the saved designs are its baseball ones, the
     Source pill defaults to Victus, and a store started from the Stock Vault says the step is already done.
     Catalog templates live in the workspace's shared list (data/catalog.js, the prototype's
     window.__catalogTemplates); renaming or deleting one bumps tplBump so the browser reads it again, as in
     the prototype.
     The remove confirmation can't be reached: the product card takes onRemove but shows no remove button. -->
<template>
  <div>
    <StepHeader :num="String(stepNum || 2)" :accent="accent" title="Add Products" :desc="INTEGRATION.on ? 'Pull products from the Customizer, the Stock Vault, a saved Catalog Template, or items already used in your other stores. Each item confirms its application sizes before it\'s added to the store.' : 'Every Stock Vault item is already in this store, hidden until you turn it on. Pull more from the Customizer, a saved Catalog Template, or items already used in your other stores. Each item confirms its application sizes before it\'s added to the store.'">
      <template #action>
        <button type="button" @click="openCustomizer" class="wx-products__customize-btn" v-patch-style="{ background: '#fff', color: '#0e0e10' }" @mouseenter="(e) => { e.currentTarget.style.background = '#0e0e10'; e.currentTarget.style.color = '#fff'; }" @mouseleave="(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#0e0e10'; }"><IconPlus :size="15" :style="{ strokeWidth: 2.6 }" /> Customize New Product</button>
      </template>
    </StepHeader>
    <SourcePill :value="srcBrand" :onChange="setSrcBrand" :style="{ marginBottom: '20px' }" />

    <div v-if="INTEGRATION.on && data._fromVault && curated.length > 0" class="wx-products__preloaded-banner">
      <span class="wx-products__vault-banner-icon"><IconCheck :size="16" :style="{ strokeWidth: 3 }" /></span>
      <div>
        <div class="wx-products__vault-banner-title">This step is already complete — {{ curated.length }} Vault item{{ curated.length === 1 ? "" : "s" }} staged as drafts</div>
        <div class="wx-products__preloaded-desc">Review is optional. Each item still confirms pricing, team setting, sizes and roster assignment before deploy, and entitlement is checked against this store's seller.</div>
      </div>
    </div>

    <AddProductsBrowser :accent="accent" :groups="groups">
      <template v-if="INTEGRATION.on" #note>
        <div class="wx-products__vault-banner">
          <span class="wx-products__vault-banner-icon"><IconCheck :size="16" :style="{ strokeWidth: 3 }" /></span>
          <div class="wx-products__vault-banner-text">
            <div class="wx-products__vault-banner-title">{{ vaultInStore === vaultAll.length ? `All ${vaultAll.length} Stock Vault items are already in this store` : `${vaultInStore} of ${vaultAll.length} Stock Vault items are in this store` }}</div>
            <div class="wx-products__vault-banner-desc">Vault items are auto-added to every new store and sorted into their respective categories. Remove any you don't want to sell — pricing and sizes are still confirmed before deploy.</div>
          </div>
          <button v-if="vaultInStore > 0" type="button" @click="set({ vaultRemoved: vaultAll.map((i) => i.id) })" class="wx-products__vault-banner-btn">Remove all</button>
          <button v-else type="button" @click="set({ vaultRemoved: [] })" class="wx-products__vault-banner-btn">Add all back</button>
        </div>
      </template>
    </AddProductsBrowser>

    <VaultOfferModal v-if="vaultOffer" :item="vaultOffer" :onClose="closeVaultOffer" :onConfirm="(sizes, cws) => confirmVaultOffer(vaultOffer, sizes, cws)" />

    <ConfirmSizesModal v-if="cfgItems" :open="!!cfgItems" :product="cfgItems[cfgActive]" :store="storeProxy" :rows="cfgState[cfgActive].applicationSizes" :onChange="updateActiveRows" :productConfig="cfgState[cfgActive]" :onConfigChange="updateActiveConfig" :items="cfgItems" :activeIndex="cfgActive" :onActiveIndexChange="setCfgActive" :confirmLabel="cfgEdit ? 'Save Changes' : cfgItems.length > 1 ? `Add ${cfgItems.length} Products to Store` : 'Add to Store'" :allowRosterAssign="hasWizardTeams" :onClose="closeConfig" :onConfirm="confirmConfig" />

    <Modal :open="customizerOpen" :onClose="closeCustomizer" width="min(1280px, 92vw)">
      <div class="wx-products__cust-modal">
        <div class="wx-products__cust-header">
          <h3 class="wx-products__cust-title">Customize New Product</h3>
          <button @click="closeCustomizer" class="wx-products__cust-close">
            <IconX :size="20" />
          </button>
        </div>
        <div class="wx-products__cust-body">
          <CustSportPickerStep v-if="custWizStep === 0" :storeSport="(data.sports && data.sports[0]) || 'Basketball'" :onPick="(item) => { custSport = item; custWizStep = 1; }" />
          <CustProductPickerStep v-if="custWizStep === 1" :sport="custSport" :onBack="() => custWizStep = 0" :onPick="(product) => { custProduct = product; custWizStep = 2; }" />
          <CustBuilderStep v-if="custWizStep === 2" :sport="custSport" :product="custProduct" :onBack="() => custWizStep = 1" :onAddToStore="() => custWizStep = 3" />
          <CustReviewStep v-if="custWizStep === 3" :sport="custSport" :product="custProduct" :onBack="() => custWizStep = 2" :onCancel="closeCustomizer" :onAddToStore="addCustomized" />
        </div>
      </div>
    </Modal>

    <Modal :open="!!removeTarget" :onClose="closeRemove" :width="460">
      <div class="wx-products__remove">
        <div class="wx-products__remove-head">
          <span class="wx-products__remove-icon"><IconTrash :size="20" /></span>
          <h3 class="wx-products__remove-title">Remove from store?</h3>
        </div>
        <p class="wx-products__remove-text">Are you sure you want to remove <strong class="wx-products__remove-name">{{ removeTarget?.title }}</strong> from this store? Its confirmed application sizes will be discarded — you can add it again later.</p>
        <div class="wx-products__remove-actions">
          <button @click="closeRemove" class="wx-products__remove-cancel">Cancel</button>
          <button @click="confirmRemove" class="wx-products__remove-confirm"><IconTrash :size="15" :style="{ strokeWidth: 2.2 }" /> Remove from Store</button>
        </div>
      </div>
    </Modal>

    <Toast :message="toast" :onDone="() => setToast(null)" />
  </div>
</template>

<script>
import { workspaceGlobals } from '../../data/catalog.js';
import { WIZARD_SAVED_CARTS, WIZARD_SAVED_DESIGNS } from '../../data/products.js';
import { MARUCCI_VAULT_ITEMS, PROSTOCK_ITEMS } from '../../data/vault.js';
import { INTEGRATION } from '../../integration.js';
import { defaultApplicationSizes, pendingPricing } from '../../lib/products.js';
import { hcmDefaultCw, vaultGenderLine, vaultPriceLine } from '../../lib/vault.js';
import Modal from '../common/Modal.vue';
import Toast from '../common/Toast.vue';
import { IconCheck, IconPlus, IconTrash, IconX } from '../icons.js';
import AddProductsBrowser from '../products/AddProductsBrowser.vue';
import ConfirmSizesModal from '../products/ConfirmSizesModal.vue';
import CustBuilderStep from '../products/CustBuilderStep.vue';
import CustProductPickerStep from '../products/CustProductPickerStep.vue';
import CustReviewStep from '../products/CustReviewStep.vue';
import CustSportPickerStep from '../products/CustSportPickerStep.vue';
import SourcePill from '../products/SourcePill.vue';
import VaultOfferModal from '../products/VaultOfferModal.vue';
import StepHeader from './StepHeader.vue';

export default {
  name: 'Step3Products',
  components: { AddProductsBrowser, ConfirmSizesModal, CustBuilderStep, CustProductPickerStep, CustReviewStep, CustSportPickerStep, IconCheck, IconPlus, IconTrash, IconX, Modal, SourcePill, StepHeader, Toast, VaultOfferModal },
  props: {
    data: { type: Object, default: undefined },
    set: { type: Function, default: undefined },
    errors: { type: Object, default: undefined },
    accent: { type: String, default: undefined },
    liveStores: { type: Array, default: undefined },
    stepNum: { type: Number, default: undefined },
  },
  data() {
    return {
      customizerOpen: false,
      cfgItems: null,   // product objects currently being configured
      cfgState: [],     // parallel per-item config (sizes/settings/pricing)
      cfgActive: 0,
      removeTarget: null, // { id, title }
      cfgEdit: false, // Edit Product re-uses the Configure & Add modal
      toast: null,
      assignVariant: "dropdown",
      // Customize New Product — XL 4-step wizard
      custWizStep: 0,   // 0=sport 1=products 2=builder 3=review
      custSport: null,
      custProduct: null,
      // ── Stock Vault + Other stores — Epic A/G (2026-08 revision) ──
      vaultOffer: null,
      tplBump: 0,
      srcBrand: INTEGRATION.on ? "victus" : "prolook",
      INTEGRATION,
    };
  },
  computed: {
    // Product-to-roster assignment (League stores only). Keyed by card id.
    isLeague() { return this.data.storeType === "league"; },
    assignments() { return this.data.rosterAssignments || {}; },
    curated() { return this.data.curatedProducts || []; },
    committedIds() { return new Set(this.curated.map((c) => c.srcId).filter(Boolean)); },
    // Teams drafted in Step 2 — only when a league store actually has some does the modal show Assign to Teams.
    wizardTeams() {
      const { data } = this;
      return this.isLeague ? (() => { const s = data.leagueStructure || { groups: [], loose: [] }; return [
        ...(s.groups || []).flatMap((g) => (g.rosters || []).map((r) => ({ id: r.id, name: r.name, code: g.name }))),
        ...(s.loose || []).map((r) => ({ id: r.id, name: r.name, code: "" })) ]; })() : [];
    },
    hasWizardTeams() { return this.wizardTeams.length > 0; },
    storeProxy() {
      const { data, hasWizardTeams, wizardTeams } = this;
      return { id: "wizard-store", teamName: data.storeTitle || "Team Store", teamColors: data.teamColors, storeType: data.storeType, fundraisingEnabled: data.fundraisingEnabled ?? false, ...(hasWizardTeams ? { wizardTeams } : {}) };
    },
    proStockItems() { return PROSTOCK_ITEMS.filter((i) => i.stockType !== "sideline"); },
    sidelineItems() { return PROSTOCK_ITEMS.filter((i) => i.stockType === "sideline"); },
    // Integrated workspace: every Stock Vault item is auto-added to a new store. Reps remove rather than add.
    marucciVaultItems() { return MARUCCI_VAULT_ITEMS.filter((i) => i.stockType === "marucci"); },
    victusVaultItems() { return MARUCCI_VAULT_ITEMS.filter((i) => i.stockType === "victus"); },
    vaultRemoved() { return new Set(this.data.vaultRemoved || []); },
    vaultAll() { return this.proStockItems.concat(this.sidelineItems, this.marucciVaultItems, this.victusVaultItems); },
    vaultInStore() { return this.vaultAll.length - this.vaultAll.filter((i) => this.vaultRemoved.has(i.id)).length; },
    otherStores() { return this.liveStores || []; },
    groups() {
      // Catalog templates are read again whenever one is renamed or deleted (tplBump), as in the prototype.
      void this.tplBump;
      const { curated, committedIds, proStockItems, sidelineItems, otherStores } = this;
      const vaultCard = (item) => ({ autoAdded: true, autoRemoved: this.vaultRemoved.has(item.id), onAutoRemove: () => this.vaultRemove(item.id), onAutoRestore: () => this.vaultRestore(item.id) });
      const designs = INTEGRATION.on ? WIZARD_SAVED_DESIGNS.filter((d) => d.sport === "Baseball") : WIZARD_SAVED_DESIGNS;
      return [
        { key: "catalog", label: "Customizer", subs: [{ k: "designs", l: "Saved Designs" }, { k: "carts", l: "Saved Carts" }], items: [].concat(
          designs.map((d) => ({ _key: "d-" + d.id, sub: "designs", kind: "design", badge: "Saved design", title: d.title, subtitle: d.block || `${d.sport} · ${d.category}`, photo: d.photo,
            committed: committedIds.has(d.id), onAdd: () => this.addDesign(d),
            committedSetting: (curated.find((c) => c.srcId === d.id) || {}).teamSetting,
            onEdit: () => this.beginEditCommitted(d.id),
            onRemove: () => this.setRemoveTarget({ id: d.id, title: d.title }) })),
          WIZARD_SAVED_CARTS.map((c) => ({ _key: "c-" + c.id, sub: "carts", kind: "cart", badge: "Saved cart", title: c.name, subtitle: `${c.items.length} items · $${c.total.toFixed(2)}`, items: c.items,
            committed: committedIds.has(c.id), onAdd: () => this.addCart(c),
            committedSetting: (curated.find((cc) => cc.srcId === c.id) || {}).teamSetting,
            onEdit: () => this.beginEditCommitted(c.id),
            onRemove: () => this.setRemoveTarget({ id: c.id, title: c.name }) })),
          curated.filter((c) => !c.srcId).map((p) => ({ _key: "x-" + p.id, sub: "designs", kind: "design", badge: "Custom", title: p.title, subtitle: p.style || "Custom product", photo: p.photo,
            committed: true, onAdd: () => {}, committedSetting: p.teamSetting,
            onEdit: () => this.beginEditCommitted(p.id),
            onRemove: () => this.setRemoveTarget({ id: p.id, title: p.title }) }))
        ) },
        INTEGRATION.on
          ? { key: "vault", label: "Stock Vault", note: true, subs: [{ k: "pro", l: "Pro Stock" }, { k: "sideline", l: "Sideline Stock" }, { k: "marucci", l: "Marucci" }, { k: "victus", l: "Victus / Lizard Skins" }], items: [].concat(
            this.marucciVaultItems.map((item) => ({ _key: "m-" + item.id, sub: "marucci", kind: "design", badge: "Marucci", title: item.title, subtitle: `${vaultGenderLine(item)} · ${item.colorways.length} color ways · ${vaultPriceLine(item)}`, photo: hcmDefaultCw(item) && hcmDefaultCw(item).front,
              ...vaultCard(item), committed: false, onAdd: () => this.addVaultItem(item), onEdit: () => this.beginEditCommitted(item.id), onRemove: () => {} })),
            this.victusVaultItems.map((item) => ({ _key: "vl-" + item.id, sub: "victus", kind: "design", badge: "Victus / Lizard Skins", title: item.title, subtitle: `${vaultGenderLine(item)} · ${item.colorways.length} color ways · ${vaultPriceLine(item)}`, photo: hcmDefaultCw(item) && hcmDefaultCw(item).front,
              ...vaultCard(item), committed: false, onAdd: () => this.addVaultItem(item), onEdit: () => this.beginEditCommitted(item.id), onRemove: () => {} })),
            proStockItems.map((item) => ({ _key: "v-" + item.id, sub: "pro", kind: "design", badge: "Pro Stock", title: item.title, subtitle: `${vaultGenderLine(item)} · ${item.colorways.length} color ways · ${vaultPriceLine(item)}`, photo: hcmDefaultCw(item) && hcmDefaultCw(item).front,
              ...vaultCard(item), committed: false, onAdd: () => this.addVaultItem(item), onEdit: () => this.beginEditCommitted(item.id), onRemove: () => {} })),
            sidelineItems.map((item) => ({ _key: "s-" + item.id, sub: "sideline", kind: "design", badge: "Sideline", title: item.title, subtitle: `${vaultGenderLine(item)} · ${item.colorways.length} color ways · ${vaultPriceLine(item)}`, photo: hcmDefaultCw(item) && hcmDefaultCw(item).front,
              ...vaultCard(item), committed: false, onAdd: () => this.addVaultItem(item), onEdit: () => this.beginEditCommitted(item.id), onRemove: () => {} })),
          ) }
          : { key: "vault", label: "Stock Vault", subs: [{ k: "pro", l: "Pro Stock" }, { k: "sideline", l: "Sideline Stock" }], items: [].concat(
            proStockItems.map((item) => ({ _key: "v-" + item.id, sub: "pro", kind: "design", badge: "Pro Stock", title: item.title, subtitle: `${vaultGenderLine(item)} · ${item.colorways.length} color ways · ${vaultPriceLine(item)}`, photo: hcmDefaultCw(item) && hcmDefaultCw(item).front,
              committed: committedIds.has(item.id), onAdd: () => this.addVaultItem(item), onEdit: () => this.beginEditCommitted(item.id), onRemove: () => {} })),
            sidelineItems.map((item) => ({ _key: "s-" + item.id, sub: "sideline", kind: "design", badge: "Sideline", title: item.title, subtitle: `${vaultGenderLine(item)} · ${item.colorways.length} color ways · ${vaultPriceLine(item)}`, photo: hcmDefaultCw(item) && hcmDefaultCw(item).front,
              committed: committedIds.has(item.id), onAdd: () => this.addVaultItem(item), onEdit: () => this.beginEditCommitted(item.id), onRemove: () => {} })),
          ) },
        { key: "templates", label: "Catalog Templates", subs: [], emptyHint: "No catalog templates yet — select items on a store's Products tab and choose Create Catalog Template. Templates carry their origin store's artwork; for the same gear without the branding, pull from Other stores instead.", items: (workspaceGlobals.__catalogTemplates || []).map((t) => ({ _key: "t-" + t.id, sub: null, kind: "cart", badge: "Template", title: t.name, subtitle: t.members.length + " items · $" + t.members.reduce((n, m) => n + (m.price || 0), 0).toFixed(2), items: t.members,
            committed: curated.some((c) => c.tplId === t.id), onAdd: () => this.addTemplate(t), onEdit: () => this.beginEditCommitted(t.id), onRemove: () => {},
            menu: [{ label: "Rename template", rename: true }, { label: "Delete template", danger: true, act: () => this.deleteTpl(t) }], onRenameCommit: (name) => this.renameTpl(t, name) })) },
        { key: "other", label: "Other stores", subs: otherStores.map((s) => ({ k: s.id, l: s.storeTitle || s.teamName || "Store" })), items: [].concat.apply([], otherStores.map((s) => ((s.products || []).filter((p) => !p.isBundle)).map((p) => ({
          _key: "o-" + s.id + "-" + p.id, sub: s.id, kind: "design", badge: s.storeTitle || s.teamName || "Store", title: p.title, subtitle: p.sku || p.subtitle || "Style block", photo: p.photo,
          committed: committedIds.has(p.id), onAdd: () => this.addFromOtherStore(p, s.storeTitle || s.teamName || "that store"), onEdit: () => this.beginEditCommitted(p.id), onRemove: () => {} })))) },
      ];
    },
  },
  methods: {
    setToast(v) { this.toast = v; },
    setSrcBrand(v) { this.srcBrand = v; },
    setCfgActive(v) { this.cfgActive = v; },
    setRemoveTarget(v) { this.removeTarget = v; },
    setAssign(cardId, ids) { this.set({ rosterAssignments: { ...this.assignments, [cardId]: ids } }); },
    openCustomizer() { this.customizerOpen = true; this.custWizStep = 0; this.custSport = null; this.custProduct = null; },
    closeCustomizer() { this.customizerOpen = false; },
    closeConfig() { this.cfgItems = null; this.cfgEdit = false; },
    closeRemove() { this.removeTarget = null; },
    closeVaultOffer() { this.vaultOffer = null; },

    // Open the per-item config modal (application sizes + product settings + price
    // settings) before anything is committed to the store.
    beginAdd(items) {
      const { assignments } = this;
      this.cfgItems = items;
      this.cfgState = items.map((it) => ({
        applicationSizes: defaultApplicationSizes(),
        teamSetting: "fan-gear",
        pricing: pendingPricing(it),
        rosters: assignments[it.srcId] || assignments[it.id] || [],
        sizesConfirmed: false,
      }));
      this.cfgEdit = false;
      this.cfgActive = 0;
    },

    // Edit Product on a committed card — re-opens the same Configure & Add modal seeded with the saved config.
    beginEditCommitted(srcId) {
      const { curated, assignments } = this;
      const items = curated.filter((c) => c.srcId === srcId || c.id === srcId || c.pkgId === srcId);
      if (!items.length) return;
      this.cfgItems = items.map((c) => ({ ...c }));
      this.cfgState = items.map((c) => ({
        applicationSizes: c.applicationSizes || defaultApplicationSizes(),
        teamSetting: c.teamSetting || "fan-gear",
        pricing: c.pricing || pendingPricing(c),
        rosters: c.rosters || assignments[c.srcId] || assignments[c.id] || [],
        storeCategory: c.storeCategory || "", storeSubcategory: c.storeSubcategory || "",
        optRequired: !!c.optRequired, optSupplied: !!c.optSupplied,
        sizesConfirmed: !!c.sizesConfirmed,
      }));
      this.cfgEdit = true;
      this.cfgActive = 0;
    },

    updateActiveConfig(next) { const { cfgActive } = this; this.cfgState = this.cfgState.map((c, i) => i === cfgActive ? next : c); },
    updateActiveRows(rows) { const { cfgActive } = this; this.cfgState = this.cfgState.map((c, i) => i === cfgActive ? { ...c, applicationSizes: rows } : c); },

    // Confirm config → commit every configured item into the store's product list.
    confirmConfig() {
      const { cfgItems, cfgState, cfgEdit, curated, data } = this;
      if (!cfgItems) return;
      const stamped = cfgItems.map((it, i) => {
        const cfg = cfgState[i];
        return {
          ...it,
          teamSetting: cfg.teamSetting,
          storeCategory: (cfg.optRequired || cfg.optSupplied || cfg.teamSetting === "team-required" || cfg.teamSetting === "team-supplied") ? "Team Gear" : (cfg.storeCategory || ""),
          storeSubcategory: cfg.storeSubcategory || "",
          optRequired: !!cfg.optRequired || cfg.teamSetting === "team-required", optSupplied: !!cfg.optSupplied || cfg.teamSetting === "team-supplied",
          applicationSizes: cfg.applicationSizes,
          pricing: cfg.pricing,
          rosters: cfg.rosters || [],
          adult: cfg.pricing.adult.retail,
          youth: cfg.pricing.youth.retail,
          sizesConfirmed: true,
        };
      });
      if (cfgEdit) {
        const byId = new Map(stamped.map((s) => [s.id, s]));
        const nextCurated = curated.map((c) => byId.has(c.id) ? { ...c, ...byId.get(c.id) } : c);
        const editAssignments = { ...(data.rosterAssignments || {}) };
        stamped.forEach((s) => { editAssignments[s.id] = s.rosters || []; });
        this.set({ curatedProducts: nextCurated, rosterAssignments: editAssignments });
        this.cfgItems = null;
        this.cfgEdit = false;
        this.setToast("Product updated");
        return;
      }
      const existing = new Set(curated.map((c) => c.id));
      const merged = [...curated, ...stamped.filter((s) => !existing.has(s.id))];
      const nextAssignments = { ...(data.rosterAssignments || {}) };
      stamped.forEach((s) => { if (!existing.has(s.id)) nextAssignments[s.id] = s.rosters || []; });
      this.set({ curatedProducts: merged, rosterAssignments: nextAssignments });
      this.cfgItems = null;
      this.setToast(`Added ${stamped.length} product${stamped.length === 1 ? "" : "s"} to the store`);
    },

    addDesign(d) {
      this.beginAdd(
        [{ id: `wd-${d.id}`, srcId: d.id, title: d.title, style: d.category, photo: d.photo, adult: d.adult, youth: d.youth, teamProfit: d.teamProfit }],
      );
    },
    addCart(c) {
      this.beginAdd(
        c.items.map((it) => ({ id: `wc-${it.id}`, srcId: c.id, title: it.title, style: "From " + c.name, photo: it.photo, adult: it.adult, youth: it.youth, teamProfit: it.teamProfit })),
      );
    },
    pickCustom(item) {
      this.customizerOpen = false;
      this.beginAdd(
        [{ id: `wx-${item.id}-${Date.now()}`, title: item.label + " — Custom", style: "Customized product", photo: "jersey-padres", adult: "60.00", youth: "52.00", teamProfit: 15.0 }],
      );
    },

    addVaultItem(item) { this.vaultOffer = item; },
    confirmVaultOffer(item, sizes, cws) {
      const cw = (cws && cws[0]) || hcmDefaultCw(item);
      this.vaultOffer = null;
      this.beginAdd([{ id: "wv-" + item.id, srcId: item.id, title: item.title, style: (item.source || "Stock Vault") + " · " + (item.vaultCategory || ""), srcKind: "vault", photo: cw && cw.front, sku: item.sku, priceAdult: item.priceAdult, priceYouth: item.priceYouth, adult: item.priceAdult, youth: item.priceYouth != null ? item.priceYouth : item.priceAdult, colorway: cw && cw.name, colorways: (cws && cws.length ? cws : item.colorways), offeredSizes: sizes }]);
    },
    addTemplate(t) { this.beginAdd(t.members.map((m) => ({ id: "wt-" + t.id + "-" + m.id, srcId: t.id + "-" + m.id, tplId: t.id, title: m.title, style: m.styleBlock, srcKind: "template", designLocked: !!m.locked, photo: m.photo, sku: m.sku }))); },
    addFromOtherStore(p, storeName) { this.beginAdd([{ id: "wo-" + p.id, srcId: p.id, title: p.title, style: (p.sku || p.subtitle || "Style block") + " · from " + storeName, srcKind: "other-store", photo: p.photo }]); },

    renameTpl(t, name) { workspaceGlobals.__catalogTemplates = (workspaceGlobals.__catalogTemplates || []).map((x) => x.id === t.id ? { ...x, name } : x); this.tplBump += 1; this.setToast("Template renamed to “" + name + "”"); },
    deleteTpl(t) { workspaceGlobals.__catalogTemplates = (workspaceGlobals.__catalogTemplates || []).filter((x) => x.id !== t.id); this.tplBump += 1; this.setToast("Template “" + t.name + "” deleted"); },

    // Integrated workspace: remove an auto-added Stock Vault item from the new store, or add it back.
    vaultRemove(id) { this.set({ vaultRemoved: Array.from(new Set([...(this.data.vaultRemoved || []), id])) }); },
    vaultRestore(id) { this.set({ vaultRemoved: (this.data.vaultRemoved || []).filter((x) => x !== id) }); },

    // Remove every committed product that originated from this saved asset.
    confirmRemove() {
      const { removeTarget, curated } = this;
      if (!removeTarget) return;
      const next = curated.filter((c) => c.srcId !== removeTarget.id && c.id !== removeTarget.id);
      this.set({ curatedProducts: next });
      const removedCount = curated.length - next.length;
      this.removeTarget = null;
      this.setToast(`Removed ${removedCount} product${removedCount === 1 ? "" : "s"} from the store`);
    },

    // Customize New Product's last step: add the customized product.
    addCustomized(finalProduct) {
      const existing = new Set(this.curated.map((c) => c.id));
      if (!existing.has(finalProduct.id)) this.set({ curatedProducts: [...this.curated, finalProduct] });
      this.customizerOpen = false;
      this.setToast("Added 1 product to the store");
    },
  },
};
</script>
