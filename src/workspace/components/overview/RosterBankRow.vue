<!-- Converted from workspace-app.jsx: RosterBankRow — one store's proposed players on the Overview. -->
<template>
  <div @mouseenter="() => setHover(true)" @mouseleave="() => setHover(false)" :style="{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 0', borderBottom: '1px solid #f4f4f6' }">
    <span :style="{ width: '32px', height: '32px', borderRadius: '50%', background: color, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '11px', flexShrink: 0 }">{{ mono }}</span>
    <span :style="{ flex: 1, minWidth: '0' }">
      <span :style="{ display: 'block', fontSize: '13.5px', fontWeight: 700, color: OV_INK, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }">{{ name }}</span>
      <span :style="{ display: 'block', fontSize: '12px', color: OV_MUTED, marginTop: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }">{{ team }} · {{ captures }} capture{{ captures === 1 ? '' : 's' }}</span>
    </span>
    <span :style="{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 800, color: '#8a5f10', background: '#fdf6e7', border: '1px solid #efdcae', borderRadius: '999px', padding: '4px 10px' }">
      <IconBankInbox :size="12" /> {{ proposed }} proposed</span>
    <button type="button" @click="onReview" :style="{ flexShrink: 0, background: hover ? '#fff' : 'transparent', border: `1px solid ${hover ? '#d4d4d8' : 'transparent'}`, color: '#0e0e10', borderRadius: '6px', padding: '7px 14px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }">Review</button>
  </div>
</template>

<script>
import { OV_INK, OV_MUTED } from '../../theme.js';
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
    return { OV_INK, OV_MUTED, hover: false };
  },
  methods: {
    setHover(v) {
      this.hover = v;
    },
  },
};
</script>
