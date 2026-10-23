<!-- Converted from workspace-app.jsx: Button. Extra attributes and a style passed by the caller land on
     the <button>, after the component's own styles, as in the prototype's {...style} {...rest}. -->
<template>
  <button :type="type" :disabled="disabled" @click="onClick" @mousedown="() => !disabled && setPressed(true)" @mouseup="() => setPressed(false)" @mouseleave="() => setPressed(false)" :style="[base, styles]"><slot /></button>
</template>

<script>
export default {
  name: 'Button',
  props: {
    variant: { type: String, default: 'primary' },
    size: { type: String, default: 'md' },
    disabled: { type: Boolean, default: undefined },
    onClick: { type: Function, default: undefined },
    type: { type: String, default: 'button' },
  },
  data() {
    return { pressed: false };
  },
  computed: {
    base() {
      const { size, disabled, pressed } = this;
      return {
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        gap: '8px', fontWeight: 700, letterSpacing: '.01em',
        border: '1px solid transparent', borderRadius: '4px',
        padding: size === 'sm' ? '8px 14px' : size === 'lg' ? '14px 28px' : '11px 22px',
        fontSize: size === 'sm' ? '12px' : '13px',
        transition: 'background .12s ease, border-color .12s ease, color .12s ease, box-shadow .12s ease, transform .1s ease',
        cursor: disabled ? 'not-allowed' : 'pointer',
        whiteSpace: 'nowrap',
        transform: (pressed && !disabled) ? 'scale(.972)' : 'scale(1)',
      };
    },
    styles() {
      const { disabled } = this;
      return {
        primary: { background: disabled ? '#d4d4d8' : '#0e0e10', color: '#fff', borderColor: disabled ? '#d4d4d8' : '#0e0e10' },
        secondary: { background: '#fff', color: '#0e0e10', borderColor: '#0e0e10' },
        ghost: { background: 'transparent', color: disabled ? '#9a9aa1' : '#0e0e10', borderColor: 'transparent' },
        danger: { background: '#fff', color: '#b81d14', borderColor: '#b81d14' },
      }[this.variant];
    },
  },
  methods: {
    setPressed(v) {
      this.pressed = v;
    },
  },
};
</script>
