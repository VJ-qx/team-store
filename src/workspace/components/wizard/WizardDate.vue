<!-- Converted from workspace-app.jsx: WizardDate — a date input with a floating label, in the look of the
     app's TextField (Store Timeline's launch and closing dates). -->
<template>
  <div class="wx-wizard-date">
    <div :class="`wx-wizard-date__box${focus ? ' wx-wizard-date__box--focus' : ''}${error ? ' wx-wizard-date__box--error' : ''}`">
      <label :class="`wx-wizard-date__label${focus ? ' wx-wizard-date__label--focus' : ''}${error ? ' wx-wizard-date__label--error' : ''}`">{{ label }}</label>
      <input type="date" :value="value || ''" @input="(e) => onChange(e.target.value)" @focus="() => setFocus(true)" @blur="() => setFocus(false)" :class="`wx-wizard-date__input${value ? ' wx-wizard-date__input--filled' : ''}`" />
    </div>
    <div v-if="error" class="wx-wizard-date__error">{{ error }}</div>
  </div>
</template>

<script>
export default {
  name: 'WizardDate',
  props: {
    label: { type: String, default: undefined },
    value: { type: String, default: undefined },
    onChange: { type: Function, default: undefined },
    error: { type: String, default: undefined },
  },
  data() {
    return { focus: false };
  },
  methods: {
    setFocus(v) { this.focus = v; },
  },
};
</script>
