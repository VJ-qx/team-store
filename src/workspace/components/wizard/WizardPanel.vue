<!-- Converted from workspace-app.jsx: WizardPanel — a white card with a small uppercase label (and an
     optional hint) that the wizard's steps are built from. A style passed by the caller lands on the root,
     as the prototype's {...style}. The hint is text, or an element in the "hint" slot (the prototype's hint
     prop can hold either). -->
<template>
  <div class="wx-wizard-panel">
    <div v-if="label" class="wx-wizard-panel__head">
      <div class="wx-wizard-panel__label">{{ label }}</div>
      <div v-if="hint || $slots.hint" class="wx-wizard-panel__hint"><slot name="hint">{{ hint }}</slot></div>
    </div>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'WizardPanel',
  props: {
    label: { type: String, default: undefined },
    hint: { type: String, default: undefined },
  },
};
</script>
