<!-- Converted from workspace-app.jsx / workspace-app-integrated.jsx: BrandMark (the integrated
     workspace shows the Marucci mark). -->
<template>
  <img :src="INT ? 'assets/marucci-m.png' : 'assets/qx-logo.png'" :alt="INT ? 'Marucci' : 'Team Stores'" :style="{ height: px(height), width: 'auto', display: 'block' }" />
</template>

<script>
import { INTEGRATION } from '../../integration.js';
import { px } from '../../lib/style.js';

export default {
  name: 'BrandMark',
  props: {
    // Declared but unused, as in the prototype.
    variant: { type: String, default: 'ink' },
    height: { type: [Number, String], default: 38 },
  },
  data() {
    return { INT: INTEGRATION.on };
  },
  methods: { px },
};
</script>
