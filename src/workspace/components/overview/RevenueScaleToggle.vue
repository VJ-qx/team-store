<!-- Converted from workspace-app.jsx: RevenueScaleToggle (Day / Month / Year). -->
<template>
  <div :style="{ display: 'inline-flex', background: '#f5f5f7', border: `1px solid ${OV_LINE}`, borderRadius: '9px', padding: '4px', gap: '2px' }">
    <button v-for="s in scales" :key="s.key" @click="() => onChange(s.key)" :style="{ border: '0', cursor: 'pointer', borderRadius: '6px', padding: '8px 16px', fontSize: '12.5px', fontWeight: 700, fontFamily: 'inherit', background: scale === s.key ? '#fff' : 'transparent', color: scale === s.key ? OV_INK : OV_MUTED, boxShadow: scale === s.key ? '0 1px 2px rgba(20,20,30,.10)' : 'none', transition: 'background .12s, color .12s' }">{{ s.label }}</button>
  </div>
</template>

<script>
import { OV_INK, OV_LINE, OV_MUTED } from '../../theme.js';

export default {
  name: 'RevenueScaleToggle',
  props: {
    scale: { type: String, default: undefined },
    onChange: { type: Function, default: undefined },
  },
  data() {
    return {
      OV_INK, OV_LINE, OV_MUTED,
      scales: [
        { key: "day", label: "Day" },
        { key: "month", label: "Month" },
        { key: "year", label: "Year" },
      ],
    };
  },
};
</script>
