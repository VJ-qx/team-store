<!-- Converted from workspace-app.jsx / workspace-app-integrated.jsx: StoreWorkspaceBar — the dark bar across
     the top of a store's page: Back to Stores, the team name, Setup guide and Preview Store. -->
<template>
  <div class="wx-store-bar">
    <!-- Left — back to stores -->
    <div class="wx-store-bar__start">
      <button @click="() => onBack && onBack()" class="wx-store-bar__back" @mouseenter="(e) => (e.currentTarget.style.opacity = '.62')" @mouseleave="(e) => (e.currentTarget.style.opacity = '1')">
        <IconChevronLeft :size="20" /> Back to Stores</button>
    </div>
    <!-- Center — team identity, emblem stacked above the name -->
    <div class="wx-store-bar__identity">
      <TeamEmblem :store="store" :size="34" />
      <h1 class="wx-store-bar__name">{{ store.teamName || store.storeTitle || "[TEAM NAME]" }}</h1>
    </div>
    <!-- Right — store guide + preview store + actions menu -->
    <div class="wx-store-bar__end">
      <button @click="openGuide" title="Reopen the store setup guide" class="wx-store-bar__guide" @mouseenter="(e) => (e.currentTarget.style.color = '#fff')" @mouseleave="(e) => (e.currentTarget.style.color = 'rgba(255,255,255,.85)')">
        <IconInfo :size="16" /> Setup guide</button>
      <button @click="onPreviewClick" :disabled="readOnly" :title="readOnly ? 'Storefront is closed for archived stores' : 'Preview the customer storefront'" :class="`wx-store-bar__preview${readOnly ? ' wx-store-bar__preview--readonly' : ''}`" @mouseenter="previewEnter" @mouseleave="previewLeave">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.8" />
          <path d="M10 8.5l5 3.5-5 3.5z" fill="currentColor" />
        </svg>{{ readOnly ? "Storefront Closed" : "Preview Store" }}</button>
    </div>
  </div>
</template>

<script>
import { INTEGRATION } from '../../../workspace/integration.js';
import { IconChevronLeft, IconInfo } from '../icons.js';
import TeamEmblem from '../common/TeamEmblem.vue';

export default {
  name: 'StoreWorkspaceBar',
  components: { IconChevronLeft, IconInfo, TeamEmblem },
  props: {
    store: { type: Object, default: undefined },
    liveStores: { type: Array, default: () => [] },
    onViewStore: { type: Function, default: undefined },
    onSetStatus: { type: Function, default: undefined },
    onSwitchStore: { type: Function, default: undefined },
    onBack: { type: Function, default: undefined },
    onCreateTemplate: { type: Function, default: undefined },
    readOnly: { type: Boolean, default: false },
  },
  data() {
    // An actions menu the workspace no longer renders (Workspace.dc.html only); its outside-click
    // listener is kept as in the prototype, where it never finds the menu.
    return { menuOpen: false };
  },
  mounted() {
    if (!INTEGRATION.on) {
      this.outsideClick = (e) => { if (this.$refs.menu && !this.$refs.menu.contains(e.target)) this.menuOpen = false; };
      document.addEventListener("mousedown", this.outsideClick);
    }
  },
  beforeUnmount() {
    if (this.outsideClick) document.removeEventListener("mousedown", this.outsideClick);
  },
  methods: {
    previewStore() { window.location.href = encodeURI("Team Store Storefront.dc.html"); },
    openGuide() { window.dispatchEvent(new CustomEvent("setupguide:open")); },
    // React: onClick={readOnly ? undefined : previewStore}
    onPreviewClick() { if (!this.readOnly) this.previewStore(); },
    previewEnter(e) { if (this.readOnly) return; e.currentTarget.style.background = "rgba(255,255,255,.1)"; e.currentTarget.style.borderColor = "rgba(255,255,255,.7)"; },
    previewLeave(e) { if (this.readOnly) return; e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(255,255,255,.4)"; },
  },
};
</script>
