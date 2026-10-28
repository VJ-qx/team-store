<!-- Converted from workspace-app.jsx / workspace-app-integrated.jsx: ManageStoreWorkspace — a store's page:
     the top bar, the archived-store banner, and the store dashboard (side menu + tab content). -->
<template>
  <div class="wx-store-workspace">
    <StoreWorkspaceBar :store="store" :liveStores="liveStores" :onViewStore="onViewStore" :onSetStatus="onSetStatus" :onSwitchStore="onSwitchStore" :onBack="onBack" :onCreateTemplate="onCreateTemplate" :readOnly="readOnly" />
    <div v-if="readOnly" class="wx-store-workspace__archived">
      <span class="wx-store-workspace__archived-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="3" y="4" width="18" height="4" rx="1" /><path d="M5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8" /><path d="M10 12h4" />
        </svg>
      </span>
      <div class="wx-store-workspace__archived-text">
        <div class="wx-store-workspace__archived-title">This store is archived — read-only</div>
        <div class="wx-store-workspace__archived-note">Order history and reports are retained as a record. Restore this store from My Account to make changes again — restoring is a managing-rep action.</div>
      </div>
    </div>
    <Dashboard embedded v-bind="$props" />
  </div>
</template>

<script>
import Dashboard from './Dashboard.vue';
import StoreWorkspaceBar from './StoreWorkspaceBar.vue';

export default {
  name: 'ManageStoreWorkspace',
  components: { Dashboard, StoreWorkspaceBar },
  props: {
    store: { type: Object, default: undefined },
    readOnly: { type: Boolean, default: false },
    onBack: { type: Function, default: undefined },
    onCustomize: { type: Function, default: undefined },
    initialTab: { type: String, default: undefined },
    liveStores: { type: Array, default: undefined },
    onLaunch: { type: Function, default: undefined },
    onSetStatus: { type: Function, default: undefined },
    onViewStore: { type: Function, default: undefined },
    onSwitchStore: { type: Function, default: undefined },
    onProductsChange: { type: Function, default: undefined },
    onUpdateStore: { type: Function, default: undefined },
    onCreateTemplate: { type: Function, default: undefined },
  },
};
</script>
