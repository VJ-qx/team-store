<!-- Converted from workspace-app.jsx: Crosshairs — thin frame and corner crosshairs over the gate photo.
     The prototype's corner() render helper is expanded in place for each corner. Its tick() helper is
     never called and is not carried over. -->
<template>
  <div aria-hidden="true" class="wx-crosshairs">
    <!-- faint frame border -->
    <div class="wx-crosshairs__frame" />
    <div class="wx-crosshairs__corner" :style="reactStyle({ left: -8, top: -8 })">
      <span class="wx-crosshairs__corner-v" :style="{ background: color }" />
      <span class="wx-crosshairs__corner-h" :style="{ background: color }" />
    </div>
    <div class="wx-crosshairs__corner" :style="reactStyle({ right: -8, top: -8 })">
      <span class="wx-crosshairs__corner-v" :style="{ background: color }" />
      <span class="wx-crosshairs__corner-h" :style="{ background: color }" />
    </div>
    <div class="wx-crosshairs__corner" :style="reactStyle({ left: -8, bottom: -8 })">
      <span class="wx-crosshairs__corner-v" :style="{ background: color }" />
      <span class="wx-crosshairs__corner-h" :style="{ background: color }" />
    </div>
    <div class="wx-crosshairs__corner" :style="reactStyle({ right: -8, bottom: -8 })">
      <span class="wx-crosshairs__corner-v" :style="{ background: color }" />
      <span class="wx-crosshairs__corner-h" :style="{ background: color }" />
    </div>
  </div>
</template>

<script>
import { reactStyle } from '../../lib/style.js';

export default {
  name: 'Crosshairs',
  props: {
    color: { type: String, default: undefined },
  },
  methods: { reactStyle },
};
</script>
