<!-- Converted from workspace-app.jsx: RosterBankRow — one store's proposed players on the Overview. -->
<template>
  <div @mouseenter="() => setHover(true)" @mouseleave="() => setHover(false)" class="wx-ov-bank">
    <span class="wx-ov-avatar" :style="{ background: color }">{{ mono }}</span>
    <span class="wx-ov-bank__body">
      <span class="wx-ov-bank__name">{{ name }}</span>
      <span class="wx-ov-bank__meta">{{ team }} · {{ captures }} capture{{ captures === 1 ? '' : 's' }}</span>
    </span>
    <span class="wx-ov-bank__proposed">
      <IconBankInbox :size="12" /> {{ proposed }} proposed</span>
    <button type="button" @click="onReview" :class="`wx-ov-bank__review${hover ? ' wx-ov-bank__review--hover' : ''}`">Review</button>
  </div>
</template>

<script>
import IconBankInbox from '../common/IconBankInbox.vue';

export default {
  name: 'RosterBankRow',
  components: { IconBankInbox },
  props: {
    // Passed along with the row ({...b} in the prototype) but not shown.
    id: { type: String, default: undefined },
    name: { type: String, default: undefined },
    color: { type: String, default: undefined },
    mono: { type: String, default: undefined },
    team: { type: String, default: undefined },
    proposed: { type: Number, default: undefined },
    captures: { type: Number, default: undefined },
    onReview: { type: Function, default: undefined },
  },
  data() {
    return { hover: false };
  },
  methods: {
    setHover(v) {
      this.hover = v;
    },
  },
};
</script>
