<!-- Converted from workspace-app.jsx / workspace-app-integrated.jsx: HomeAttentionCard — one "Needs your
     attention" card on a store's Home tab. Rail tones: red = blocking, blue = action, grey = informational. -->
<template>
  <div :class="`wx-home-attention wx-home-attention--${rail}`">
    <div class="wx-home-attention__text">
      <div class="wx-home-attention__title">{{ card.title }}</div>
      <div class="wx-home-attention__detail">{{ card.detail }}</div>
    </div>
    <template v-if="!readOnly">
      <button v-if="card.link" @click="onAction" class="wx-home-attention__link">{{ card.action }} ›</button>
      <button v-else @click="onAction" :class="`wx-home-attention__action${card.tone === 'red' ? ' wx-home-attention__action--primary' : ''}`">{{ card.action }}</button>
    </template>
  </div>
</template>

<script>
export default {
  name: 'HomeAttentionCard',
  props: {
    card: { type: Object, default: undefined },
    readOnly: { type: Boolean, default: false },
    onAction: { type: Function, default: undefined },
  },
  computed: {
    rail() { const { card } = this; return card.tone === "red" ? "red" : card.tone === "blue" ? "blue" : "grey"; },
  },
};
</script>
