<!-- Converted from workspace-app.jsx / workspace-app-integrated.jsx: StoreSetupGuideHost — opens the Store
     Setup Guide by itself once per store while it's still a draft (the just-created moment), then only on
     demand: the "setupguide:open" event from the header button, the Home tab's link, or the Tweaks panel. -->
<template>
  <StoreSetupGuideOverlay v-if="open" :store="store" :storeType="open.storeType" :onClose="dismiss" />
</template>

<script>
import { crReadJSON, crWriteJSON } from '../../storage/close-report.js';
import { sgSeenKey } from '../../storage/setup-guide.js';
import StoreSetupGuideOverlay from './StoreSetupGuideOverlay.vue';

export default {
  name: 'StoreSetupGuideHost',
  components: { StoreSetupGuideOverlay },
  props: {
    store: { type: Object, default: undefined },
  },
  data() {
    return { open: null };
  },
  computed: {
    storeId() { return this.store?.id; },
  },
  watch: {
    // React: useEffect on [store?.id], with cleanup of the timer.
    storeId() { this.armAuto(); },
  },
  mounted() {
    this.armAuto();
    this.onOpenEvent = (e) => { this.open = { storeType: e.detail && e.detail.storeType }; };
    window.addEventListener("setupguide:open", this.onOpenEvent);
  },
  beforeUnmount() {
    clearTimeout(this.autoTimer);
    window.removeEventListener("setupguide:open", this.onOpenEvent);
  },
  methods: {
    armAuto() {
      clearTimeout(this.autoTimer);
      const { store } = this;
      if (!store || store.live) return;
      if (crReadJSON(sgSeenKey(store), false)) return;
      this.autoTimer = setTimeout(() => { this.open = {}; }, 400);
    },
    dismiss() { crWriteJSON(sgSeenKey(this.store), true); this.open = null; },
  },
};
</script>
