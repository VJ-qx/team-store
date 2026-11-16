<!-- Converted from workspace-app.jsx: TextField — a text input with a floating label, optional prefix or
     suffix, and an error line. A style passed by the caller lands on the root, after its own, as the
     prototype's {...style}. React's useId is a module-level counter giving React 18's ids (:r0:, :r1:, …
     in base 32, in mount order), so labels and fields keep the prototype's ids. -->
<template>
  <div :style="{ position: 'relative', flex: 1 }">
    <div :style="{ position: 'relative', border: `1px solid ${error ? '#b81d14' : focus ? '#0e0e10' : '#d4d4d8'}`, borderRadius: '4px', background: readOnly ? '#fafafb' : '#fff', transition: 'border-color .15s' }">
      <div v-if="$slots.prefix" :style="{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }"><slot name="prefix" /></div>
      <label :for="id" :style="{ position: 'absolute', left: $slots.prefix ? '56px' : '12px', top: float ? '-7px' : '14px', fontSize: float ? '11px' : '13px', color: error ? '#b81d14' : focus ? '#0e0e10' : '#6b6b72', background: '#fff', padding: float ? '0 4px' : 0, pointerEvents: 'none', transition: 'all .12s ease', fontWeight: float ? 500 : 400 }">{{ label }}</label>
      <input ref="input" :id="id" :type="type" :name="name" :value="value || ''" :placeholder="focus ? placeholder : ''" :readonly="readOnly" @input="(e) => onChange && onChange(e.target.value)" @focus="() => setFocus(true)" @blur="(e) => { setFocus(false); onBlur && onBlur(e); }" :style="{ width: '100%', border: 0, outline: 0, background: 'transparent', padding: $slots.prefix ? '14px 12px 14px 56px' : $slots.suffix ? '14px 40px 14px 12px' : '14px 12px', fontSize: '14px', color: '#0e0e10' }" />
      <div v-if="$slots.suffix" :style="{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }"><slot name="suffix" /></div>
    </div>
    <div v-if="error" :style="{ color: '#b81d14', fontSize: '11px', marginTop: '4px', marginLeft: '2px' }">{{ error }}</div>
  </div>
</template>

<script>
let clientIdCounter = 0;

export default {
  name: 'TextField',
  props: {
    label: { type: String, default: undefined },
    value: { type: [String, Number], default: undefined },
    onChange: { type: Function, default: undefined },
    error: { type: String, default: undefined },
    type: { type: String, default: "text" },
    placeholder: { type: String, default: undefined },
    autoFocus: { type: Boolean, default: undefined },
    name: { type: String, default: undefined },
    onBlur: { type: Function, default: undefined },
    readOnly: { type: Boolean, default: undefined },
  },
  data() {
    return { id: `:r${(clientIdCounter++).toString(32)}:`, focus: false };
  },
  computed: {
    filled() { return this.value != null && String(this.value).length > 0; },
    float() { return this.focus || this.filled || this.placeholder; },
  },
  mounted() {
    // React's autoFocus.
    if (this.autoFocus) this.$refs.input.focus();
  },
  methods: {
    setFocus(v) { this.focus = v; },
  },
};
</script>
