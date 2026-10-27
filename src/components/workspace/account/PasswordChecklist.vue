<!-- Converted from workspace-app.jsx: PasswordChecklist. -->
<template>
  <ul :style="{ listStyle: 'none', margin: '14px 0 0', padding: '12px 14px', background: '#fafafa', border: '1px solid #ececee', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }">
    <li v-for="(r, i) in rules" :key="i" :style="{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: r.ok ? '#09090b' : '#71717a' }">
      <span :style="{ width: '18px', height: '18px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: r.ok ? '#16a34a' : '#fff', border: r.ok ? '0' : '1.5px solid #d4d4d8', color: '#fff' }">
        <IconCheck v-if="r.ok" :size="11" />
      </span>{{ r.label }}</li>
  </ul>
</template>

<script>
import { IconCheck } from '../icons.js';

export default {
  name: 'PasswordChecklist',
  components: { IconCheck },
  props: {
    rules: { type: Array, required: true },
  },
};
</script>
