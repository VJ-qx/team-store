<!-- Converted from workspace-app.jsx and workspace-app-integrated.jsx: WizardStepper — the wizard's progress
     track and step buttons (a reached step can be clicked to jump back). The integrated workspace's
     preDone marks a step done ahead of time (its Stock Vault pre-loads Add Products) and shows the
     "PRE-LOADED · REVIEW OPTIONAL" pill; the Prolook workspace never passes it. -->
<template>
  <div class="wx-wizard-stepper">
    <div class="wx-wizard-stepper__track">
      <div class="wx-wizard-stepper__fill" :style="{ width: `${pct}%`, background: accent }" />
    </div>
    <div class="wx-wizard-stepper__steps">
      <button v-for="(s, i) in steps" :key="s.key" type="button" :disabled="!(i <= maxReached)" @click="() => (i <= maxReached) && onJump(i)" :class="`wx-wizard-stepper__step${(i <= maxReached) ? ' wx-wizard-stepper__step--reachable' : ''}`">
        <span class="wx-wizard-stepper__dot" :style="dotStyle(s, i)">
          <IconCheck v-if="isDone(s, i)" :size="13" :style="{ strokeWidth: 3.4 }" />
          <template v-else>{{ i + 1 }}</template>
        </span>
        <span :class="`wx-wizard-stepper__label${(i === current || isDone(s, i)) ? ' wx-wizard-stepper__label--strong' : ''}${isDone(s, i) ? ' wx-wizard-stepper__label--done' : ''}${i === current ? ' wx-wizard-stepper__label--active' : ''}`">{{ s.label }}</span>
        <span v-if="isPre(s, i)" class="wx-wizard-stepper__preloaded">PRE-LOADED · REVIEW OPTIONAL</span>
      </button>
    </div>
  </div>
</template>

<script>
import { WIZARD_STEPS } from '../../data/wizard.js';
import { IconCheck } from '../icons.js';

export default {
  name: 'WizardStepper',
  components: { IconCheck },
  props: {
    current: { type: Number, default: undefined },
    maxReached: { type: Number, default: undefined },
    onJump: { type: Function, default: undefined },
    accent: { type: String, default: "#e1251b" },
    steps: { type: Array, default: () => WIZARD_STEPS },
    preDone: { type: Array, default: () => [] },
  },
  computed: {
    pct() { return (this.current / (this.steps.length - 1)) * 100; },
  },
  methods: {
    isPre(s, i) { return this.preDone.includes(s.key) && i !== this.current; },
    isDone(s, i) { return i < this.current || this.isPre(s, i); },
    dotStyle(s, i) {
      const done = this.isDone(s, i);
      const active = i === this.current;
      const { accent } = this;
      return { background: done ? accent : active ? "#fff" : "#f1f1f3", color: done ? "#fff" : active ? accent : "#9a9aa1", border: active ? `2px solid ${accent}` : done ? "none" : "1.5px solid #e5e5e9" };
    },
  },
};
</script>
