<!-- Converted from workspace-app.jsx: MultiSelectChips — a grid of pill buttons to pick several options
     (Sports); a picked chip takes the accent. -->
<template>
  <div class="wx-chips">
    <button v-for="o in options" :key="o" type="button" @click="() => toggle(o)" class="wx-chips__chip" :style="{ border: `1.5px solid ${isOn(o) ? accent : '#e5e5e9'}`, background: isOn(o) ? hexA(accent, 0.08) : '#fff', color: isOn(o) ? accent : '#4b4b52' }"><IconCheck v-if="isOn(o)" :size="13" :style="{ strokeWidth: 3 }" />{{ o }}</button>
  </div>
</template>

<script>
import { hexA } from '../../lib/wizard.js';
import { IconCheck } from '../icons.js';

export default {
  name: 'MultiSelectChips',
  components: { IconCheck },
  props: {
    options: { type: Array, default: undefined },
    value: { type: Array, default: undefined },
    onChange: { type: Function, default: undefined },
    accent: { type: String, default: "#e1251b" },
  },
  computed: {
    sel() { return this.value || []; },
  },
  methods: {
    hexA,
    isOn(o) { return this.sel.includes(o); },
    toggle(o) { const { sel } = this; this.onChange(sel.includes(o) ? sel.filter((x) => x !== o) : [...sel, o]); },
  },
};
</script>
