<!-- Converted from workspace-app.jsx: ProfileReadField — a labelled field on My Account: an input when
     editable, otherwise the slot content or a read-only value. -->
<template>
  <div :style="{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '0' }">
    <label :style="{ fontSize: '12px', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: '#3f3f46', display: 'inline-flex', alignItems: 'center', gap: '4px' }">{{ label }}</label>
    <input v-if="editable" :value="value" v-controlled="value" @input="(e) => onChange && onChange(e.target.value)" :placeholder="placeholder" v-patch-style="{ background: '#fff', border: '1px solid #d4d4d8', borderRadius: '8px', padding: '12px 16px', fontSize: '15px', color: '#0e0e10', minHeight: '48px', outline: 'none', width: '100%', fontFamily: mono ? 'JetBrains Mono, monospace' : 'inherit' }" @focus="(e) => e.target.style.borderColor = '#0e0e10'" @blur="(e) => e.target.style.borderColor = '#d4d4d8'" />
    <slot v-else>
      <div :style="{ position: 'relative', background: '#f5f5f7', border: '1px solid #ececf0', borderRadius: '8px', padding: '12px 16px', fontSize: '15px', color: '#52525b', minHeight: '48px', display: 'flex', alignItems: 'center', fontFamily: mono ? 'JetBrains Mono, monospace' : 'inherit', cursor: 'not-allowed' }">
        <span :style="{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }">{{ value }}</span>
        <IconChevron v-if="dropdown" :size="18" :style="{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#a1a1aa' }" />
      </div>
    </slot>
  </div>
</template>

<script>
import { IconChevron } from '../icons.js';

export default {
  name: 'ProfileReadField',
  components: { IconChevron },
  props: {
    label: { type: String, default: undefined },
    value: { type: String, default: undefined },
    required: { type: Boolean, default: undefined },
    mono: { type: Boolean, default: undefined },
    dropdown: { type: Boolean, default: undefined },
    editable: { type: Boolean, default: undefined },
    onChange: { type: Function, default: undefined },
    placeholder: { type: String, default: undefined },
  },
};
</script>
