<!-- Converted from workspace-app.jsx and workspace-app-integrated.jsx: SavedAssetCard — unified saved-asset
     card, identical dimensions for designs and carts: photo (or a cart's stacked thumbnails), title (with a
     ⋯ menu and inline rename for templates), subtitle, and Add to Store / Edit Product.
     Integrated workspace: Stock Vault items are auto-added to every new store, so their cards show In store ·
     Remove, or Removed from store · Add back; its cards have their own border.
     The prototype passes every browser row's fields as props; the ones the card doesn't take (such as _key
     and sub) don't reach the page (inheritAttrs: false). -->
<template>
  <div @mouseenter="hover = true" @mouseleave="hover = false" :class="INTEGRATION.on ? `wx-asset-card-marucci${hover ? ' wx-asset-card-marucci--hover' : ''}` : `wx-asset-card${hover ? ' wx-asset-card--hover' : ''}${committed ? ' wx-asset-card--committed' : ''}`" :style="INTEGRATION.on ? { border: `1px ${autoRemoved ? 'dashed' : 'solid'} ${committed ? '#1f9d55' : hover ? '#c7c7cd' : autoRemoved ? '#d4d4d8' : '#ececf0'}` } : {}">
    <div class="wx-asset-card__media">
      <StackedThumbs v-if="kind === 'cart'" :items="items" />
      <div v-else-if="photo" :class="INTEGRATION.on ? `wx-asset-card__photo-auto${autoRemoved ? ' wx-asset-card__photo-auto--removed' : ''}` : 'wx-asset-card__photo'"><CatalogPhoto :photo="photo" :alt="title" /></div>
      <div v-else class="wx-asset-card__letter">{{ letter || (title || "P").slice(0, 1) }}</div>
      <span v-if="kind === 'cart'" class="wx-asset-card__items-tag"><IconLayers :size="12" /> {{ items.length }} items</span>
      <span v-if="committed" class="wx-asset-card__in-store"><IconCheck :size="13" :style="{ strokeWidth: 2.8 }" /> In Store</span>
    </div>
    <div class="wx-asset-card__body">
      <div class="wx-asset-card__title-row">
        <input v-if="renaming != null" v-autofocus :value="renaming" v-controlled="renaming" @input="(e) => renaming = e.target.value" @blur="onRenameBlur" @keydown="onRenameKey" class="wx-asset-card__rename" />
        <div v-else class="wx-asset-card__title">{{ title }}</div>
        <span v-if="menu && menu.length > 0" class="wx-asset-card__menu-wrap">
          <button type="button" @click="menuOpen = !menuOpen" aria-label="Template actions" :class="`wx-asset-card__menu-btn${menuOpen ? ' wx-asset-card__menu-btn--open' : ''}`">⋯</button>
          <span v-if="menuOpen" @click="menuOpen = false" class="wx-asset-card__menu-backdrop" />
          <div v-if="menuOpen" class="wx-asset-card__menu">
            <button v-for="(mi, i) in menu" :key="i" type="button" @click="() => { menuOpen = false; if (mi.rename) renaming = title || ''; else mi.act && mi.act(); }" :class="`wx-asset-card__menu-item${mi.danger ? ' wx-asset-card__menu-item--danger' : ''}`">{{ mi.label }}</button>
          </div>
        </span>
      </div>
      <div class="wx-asset-card__subtitle">{{ subtitle }}</div>
      <RosterAssignField v-if="assignEnabled && !committed" :variant="assignVariant" direction="down" :value="assigned || []" :onChange="onAssign" :accent="accent" />
      <div class="wx-asset-card__foot">
        <div v-if="committed && assignEnabled" class="wx-asset-card__assigned">
          <div class="wx-asset-card__assigned-row">
            <IconUsers :size="13" :style="{ flexShrink: 0, marginTop: '2px', color: '#9a9aa1' }" />
            <div class="wx-asset-card__assigned-text">
              <div class="wx-asset-card__assigned-label">Assigned to</div>
              <span v-if="isLeagueWide()" class="wx-asset-card__assigned-all">Entire league · all teams</span>
              <div v-else class="wx-asset-card__assigned-names">
                <span v-for="(n, i) in assignedNames().slice(0, 3)" :key="i" class="wx-asset-card__assigned-name">{{ n }}</span>
                <span v-if="assignedNames().length > 3" class="wx-asset-card__assigned-more">+{{ assignedNames().length - 3 }}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-if="INTEGRATION.on && autoAdded && !autoRemoved" class="wx-asset-card__auto-row">
          <span class="wx-asset-card__auto-status"><span class="wx-asset-card__auto-check"><IconCheck :size="10" :style="{ strokeWidth: 4 }" /></span>In store <span class="wx-asset-card__auto-note">· auto-added</span></span>
          <button type="button" @click="onAutoRemove" class="wx-asset-card__auto-remove" v-patch-style="{ color: '#6b6b72' }" @mouseenter="(e) => e.currentTarget.style.color = '#e1251b'" @mouseleave="(e) => e.currentTarget.style.color = '#6b6b72'">Remove</button>
        </div>
        <div v-else-if="INTEGRATION.on && autoAdded && autoRemoved" class="wx-asset-card__auto-row">
          <span class="wx-asset-card__auto-removed">Removed from store</span>
          <button type="button" @click="onAutoRestore" class="wx-asset-card__auto-add-back">Add back</button>
        </div>
        <button v-else-if="committed" type="button" @click="onEdit" :class="`wx-asset-card__edit${assignEnabled ? ' wx-asset-card__edit--spaced' : ''}`" v-patch-style="{ background: '#fff', border: '1px solid #d4d4d8' }" @mouseenter="(e) => { e.currentTarget.style.borderColor = '#0e0e10'; e.currentTarget.style.background = '#f7f7f8'; }" @mouseleave="(e) => { e.currentTarget.style.borderColor = '#d4d4d8'; e.currentTarget.style.background = '#fff'; }"><IconEdit :size="15" :style="{ strokeWidth: 2.2 }" /> Edit Product</button>
        <button v-else-if="disabledReason" type="button" disabled :title="disabledReason" :class="`wx-asset-card__disabled${assignEnabled ? ' wx-asset-card__disabled--spaced' : ''}`">{{ disabledReason }}</button>
        <button v-else type="button" @click="onAdd" :class="`wx-asset-card__add${assignEnabled ? ' wx-asset-card__add--spaced' : ''}`" v-patch-style="{ background: '#0e0e10' }" @mouseenter="(e) => e.currentTarget.style.background = accent" @mouseleave="(e) => e.currentTarget.style.background = '#0e0e10'"><IconPlus :size="15" :style="{ strokeWidth: 2.6 }" /> Add to Store</button>
      </div>
    </div>
  </div>
</template>

<script>
import { INTEGRATION } from '../../integration.js';
import { assignAllRosterIds, assignRosterLabel } from '../../lib/rosters.js';
import { IconCheck, IconEdit, IconLayers, IconPlus, IconUsers } from '../icons.js';
import CatalogPhoto from './CatalogPhoto.vue';
import RosterAssignField from './RosterAssignField.vue';
import StackedThumbs from './StackedThumbs.vue';

export default {
  name: 'SavedAssetCard',
  components: { CatalogPhoto, IconCheck, IconEdit, IconLayers, IconPlus, IconUsers, RosterAssignField, StackedThumbs },
  inheritAttrs: false,
  props: {
    kind: { type: String, default: undefined },
    title: { type: String, default: undefined },
    subtitle: { type: String, default: undefined },
    photo: { type: String, default: undefined },
    letter: { type: String, default: undefined },
    badge: { type: String, default: undefined },
    disabledReason: { type: String, default: undefined },
    items: { type: Array, default: undefined },
    committed: { type: Boolean, default: undefined },
    onAdd: { type: Function, default: undefined },
    onRemove: { type: Function, default: undefined },
    onEdit: { type: Function, default: undefined },
    accent: { type: String, default: undefined },
    assignEnabled: { type: Boolean, default: undefined },
    assignVariant: { type: String, default: undefined },
    assigned: { type: Array, default: undefined },
    onAssign: { type: Function, default: undefined },
    committedSetting: { type: String, default: undefined },
    menu: { type: Array, default: undefined },
    onRenameCommit: { type: Function, default: undefined },
    // Integrated workspace only.
    autoAdded: { type: Boolean, default: undefined },
    autoRemoved: { type: Boolean, default: undefined },
    onAutoRemove: { type: Function, default: undefined },
    onAutoRestore: { type: Function, default: undefined },
  },
  data() {
    return { hover: false, menuOpen: false, renaming: null, INTEGRATION };
  },
  methods: {
    onRenameBlur() { const v = (this.renaming || "").trim(); this.renaming = null; if (v && v !== this.title && this.onRenameCommit) this.onRenameCommit(v); },
    onRenameKey(e) { if (e.key === "Enter") e.currentTarget.blur(); if (e.key === "Escape") this.renaming = null; },
    isLeagueWide() { const ids = this.assigned || []; const allTeams = assignAllRosterIds(); return ids.length === 0 || ids.length >= allTeams.length; },
    assignedNames() { return (this.assigned || []).map((id) => (assignRosterLabel(id) || {}).name).filter(Boolean); },
  },
};
</script>
