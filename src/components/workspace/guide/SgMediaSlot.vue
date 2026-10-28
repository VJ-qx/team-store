<!-- Converted from workspace-app.jsx / workspace-app-integrated.jsx: SgMediaSlot — the Store Setup Guide's 16:9
     media slot, sized identically whether it holds a still or a looping clip, so media can drop in later
     without moving anything. Neutral for now. -->
<template>
  <div aria-hidden="true" class="wx-setup-guide__media">
    <IconImage :size="26" />
  </div>
</template>

<script>
import { IconImage } from '../icons.js';

export default {
  name: 'SgMediaSlot',
  components: { IconImage },
};
</script>
