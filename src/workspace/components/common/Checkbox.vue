<!-- Converted from workspace-app.jsx: Checkbox — a square box (click it to toggle) with an optional label.
     As in the prototype, only the box toggles: the label has no input to activate. A style passed by the
     caller lands on the root, after its own. -->
<template>
  <label :style="{ display: 'inline-flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }">
    <span @click="(e) => { e.preventDefault(); onChange(!checked); }" :style="{ width: px(size), height: px(size), flexShrink: 0, border: `1.5px solid ${checked ? '#0e0e10' : '#9a9aa1'}`, background: checked ? '#0e0e10' : '#fff', borderRadius: '3px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'all .12s ease', marginTop: '1px' }">
      <IconCheck v-if="checked" :size="size - 4" :style="{ color: '#fff', strokeWidth: 3 }" />
    </span>
    <span v-if="label" :style="{ fontSize: '13px', color: '#0e0e10', lineHeight: 1.4 }">{{ label }}</span>
  </label>
</template>

<script>
import { px } from '../../lib/style.js';
import { IconCheck } from '../icons.js';

export default {
  name: 'Checkbox',
  components: { IconCheck },
  props: {
    checked: { type: Boolean, default: undefined },
    onChange: { type: Function, default: undefined },
    label: { type: String, default: undefined },
    size: { type: Number, default: 16 },
  },
  methods: { px },
};
</script>
