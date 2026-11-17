<!-- Converted from workspace-app.jsx: CanvasAddTeamTile — the dashed "Add Team" tile under a division's teams.
     As in the prototype, its click also reaches the canvas behind it, which clears the selection. -->
<template>
  <div class="wx-canvas-add-team">
    <div v-if="rail" class="wx-canvas-add-team__rail">
      <span class="wx-canvas-add-team__rail-line" />
      <span class="wx-canvas-add-team__rail-branch" />
    </div>
    <button @click="onAdd" class="wx-canvas-add-team__btn"><IconPlus :size="13" :style="{ strokeWidth: 2.4 }" /> Add Team</button>
  </div>
</template>

<script>
import { IconPlus } from '../icons.js';

export default {
  name: 'CanvasAddTeamTile',
  components: { IconPlus },
  props: {
    onAdd: { type: Function, default: undefined },
    rail: { type: Boolean, default: undefined },
  },
};
</script>
