<!-- Converted from workspace-app.jsx: SettingsCard. A style passed by the caller lands after the card's
     own, as in the prototype's {...style}. -->
<template>
  <div :style="{ background: '#fff', border: `1px solid ${danger ? '#f3c9c5' : '#ececf0'}`, borderRadius: '14px', padding: '32px 36px', boxShadow: '0 1px 2px rgba(20,20,30,.03)' }"><slot /></div>
</template>

<script>
export default {
  name: 'SettingsCard',
  props: {
    danger: { type: Boolean, default: undefined },
  },
};
</script>
