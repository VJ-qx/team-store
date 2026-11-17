<!-- Converted from workspace-app.jsx: ProfitInput — a $ / % amount field; "fill" stretches it to its column. -->
<template>
  <div class="wx-profit-input" :style="fill ? { width: '100%' } : {}">
    <div :class="`wx-profit-input__box${fill ? ' wx-profit-input__box--fill' : ''}`" :style="fill ? { width: '100%', height: '44px', boxSizing: 'border-box' } : {}">
      <span class="wx-profit-input__unit" :style="fill ? { alignSelf: 'stretch', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '40px', padding: '0', boxSizing: 'border-box' } : {}">{{ unit === "%" ? "%" : "$" }}</span>
      <input type="text" :value="value" v-controlled="value" @input="(e) => onValue(e.target.value)" :class="`wx-profit-input__input${fill ? ' wx-profit-input__input--fill' : ''}`" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfitInput',
  props: {
    unit: { type: String, default: undefined },
    value: { type: [String, Number], default: undefined },
    onUnit: { type: Function, default: undefined },
    onValue: { type: Function, default: undefined },
    fill: { type: Boolean, default: undefined },
  },
};
</script>
