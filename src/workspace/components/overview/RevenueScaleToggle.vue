<!-- Converted from workspace-app.jsx: RevenueScaleToggle (Day / Month / Year). -->
<template>
  <div class="wx-ov-scale">
    <button v-for="s in scales" :key="s.key" @click="() => onChange(s.key)" :class="`wx-ov-scale__btn${scale === s.key ? ' wx-ov-scale__btn--active' : ''}`">{{ s.label }}</button>
  </div>
</template>

<script>
export default {
  name: 'RevenueScaleToggle',
  props: {
    scale: { type: String, default: undefined },
    onChange: { type: Function, default: undefined },
  },
  data() {
    return {
      scales: [
        { key: "day", label: "Day" },
        { key: "month", label: "Month" },
        { key: "year", label: "Year" },
      ],
    };
  },
};
</script>
