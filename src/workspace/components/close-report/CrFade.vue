<!-- Converted from workspace-app.jsx / workspace-app-integrated.jsx: CrFade — fades and lifts its content in
     each time `k` changes (20 ms after the change). Shared with the Store Close Report, so it keeps its
     inline styles; the caller's style merges after its own, as in the prototype. -->
<template>
  <div :style="{ opacity: on ? 1 : 0, transform: on ? 'none' : 'scale(.985) translateY(6px)', transition: reduce ? 'opacity .12s linear' : 'opacity .26s cubic-bezier(.2,0,0,1), transform .26s cubic-bezier(.2,0,0,1)' }">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'CrFade',
  props: {
    k: { type: [String, Number], default: undefined },
    reduce: { type: Boolean, default: false },
  },
  data() {
    return { on: this.reduce };
  },
  watch: {
    // React: useEffect on [k, reduce], with cleanup of the timer.
    k() { this.fade(); },
    reduce() { this.fade(); },
  },
  mounted() {
    this.fade();
  },
  beforeUnmount() {
    clearTimeout(this.timer);
  },
  methods: {
    fade() {
      clearTimeout(this.timer);
      if (this.reduce) { this.on = true; return; }
      this.on = false;
      this.timer = setTimeout(() => { this.on = true; }, 20);
    },
  },
};
</script>
