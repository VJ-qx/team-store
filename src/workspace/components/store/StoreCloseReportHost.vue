<!-- Converted from workspace-app.jsx / workspace-app-integrated.jsx: StoreCloseReportHost — the Store Close
     Report's host on every store page. It keeps the close-event bookkeeping in local storage and decides when
     the report opens (automatically once per close event, or on "closereport:open"). The report itself
     (StoreCloseReportOverlay) is not converted yet, so nothing renders when it opens. The Tweaks panel's
     "Replay first-after-close" (closereport:replay, window.__crCanReplay) is prototype-only and left out. -->
<script>
import { crIsSeen, crSyncEvent } from '../../storage/close-report.js';

export default {
  name: 'StoreCloseReportHost',
  props: {
    store: { type: Object, default: undefined },
  },
  data() {
    return { ev: crSyncEvent(this.store), open: null, seenTick: 0 };
  },
  computed: {
    storeId() { return this.store?.id; },
    storeStatus() { return this.store?.status; },
    // React: the automatic trigger's dependencies [ev && ev.id, store?.status, seenTick].
    autoKey() { return [this.ev && this.ev.id, this.store?.status, this.seenTick]; },
  },
  watch: {
    // React: useEffect on [store?.id, store?.status].
    storeId() { this.ev = crSyncEvent(this.store); },
    storeStatus() { this.ev = crSyncEvent(this.store); },
    autoKey(next, prev) {
      if (next.every((v, i) => v === prev[i])) return;
      this.armAuto();
    },
  },
  mounted() {
    // The prototype's effects, in their order.
    this.ev = crSyncEvent(this.store);
    this.armAuto();
    this.openReview = (e) => { this.open = { mode: "review", layer: (e.detail && e.detail.layer) || "summary" }; };
    window.addEventListener("closereport:open", this.openReview);
  },
  beforeUnmount() {
    clearTimeout(this.autoTimer);
    window.removeEventListener("closereport:open", this.openReview);
  },
  methods: {
    // Automatic trigger: Closed + this user hasn't seen THIS close event yet.
    armAuto() {
      clearTimeout(this.autoTimer);
      const { ev, store } = this;
      if (!ev || store?.status !== "closed") return;
      if (crIsSeen(store, ev)) return;
      this.autoTimer = setTimeout(() => { this.open = { mode: "auto", layer: "summary" }; }, 350);
    },
  },
  render() {
    return null;
  },
};
</script>
