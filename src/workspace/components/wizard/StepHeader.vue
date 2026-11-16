<!-- Converted from workspace-app.jsx: StepHeader — a wizard step's numbered heading and description. The
     prototype's action prop (an element shown at the right of the title) is the "action" slot. -->
<template>
  <div class="wx-step-header">
    <div class="wx-step-header__row">
      <div class="wx-step-header__title-group">
        <span class="wx-step-header__num" :style="{ background: accent }">{{ num }}</span>
        <h2 class="wx-step-header__title">{{ title }}</h2>
      </div>
      <slot name="action" />
    </div>
    <p v-if="desc" class="wx-step-header__desc">{{ desc }}</p>
  </div>
</template>

<script>
export default {
  name: 'StepHeader',
  props: {
    num: { type: [String, Number], default: undefined },
    title: { type: String, default: undefined },
    desc: { type: String, default: undefined },
    accent: { type: String, default: "#e1251b" },
  },
};
</script>
