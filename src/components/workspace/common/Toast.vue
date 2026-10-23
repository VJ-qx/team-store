<!-- Converted from workspace-app.jsx: Toast. Calls onDone 2.4 s after the message appears; as in the
     prototype, the timer restarts whenever the message or the onDone callback changes. -->
<template>
  <div v-if="message" :style="{ position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)', background: '#0e0e10', color: '#fff', padding: '12px 20px', borderRadius: '6px', fontSize: '13px', fontWeight: 500, zIndex: 200, boxShadow: '0 8px 24px rgba(20,20,30,.30)', display: 'flex', alignItems: 'center', gap: '12px', animation: 'toastIn .25s ease' }">
    <IconCheck :size="16" :style="{ color: '#3acc7a' }" />{{ message }}<component :is="'style'">{{ css }}</component>
  </div>
</template>

<script>
import { IconCheck } from '../icons.js';

export default {
  name: 'Toast',
  components: { IconCheck },
  props: {
    message: { type: String, default: null },
    onDone: { type: Function, default: undefined },
  },
  data() {
    return { css: '@keyframes toastIn{from{opacity:0;transform:translate(-50%, 8px)}to{opacity:1;transform:translate(-50%, 0)}}' };
  },
  watch: {
    message() { this.restart(); },
    onDone() { this.restart(); },
  },
  mounted() {
    this.restart();
  },
  beforeUnmount() {
    clearTimeout(this.timer);
  },
  methods: {
    // React: useEffect on [message, onDone] with a cleanup that clears the timer.
    restart() {
      clearTimeout(this.timer);
      if (!this.message) return;
      this.timer = setTimeout(() => this.onDone(), 2400);
    },
  },
};
</script>
