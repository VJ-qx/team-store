<!-- Converted from workspace-app.jsx: ColorSwatches — the Team Colors row: each color with a ✕ shown on
     hover (written by the event handlers, as in the prototype), and + to open Select Team Color. A
     mousedown outside closes the color grid. -->
<template>
  <div ref="root" class="wx-swatches">
    <div class="wx-swatches__list">
      <div v-for="(c, i) in colors" :key="i" class="wx-swatches__item" @mouseenter="(e) => setRemoveOpacity(e, '1')" @mouseleave="(e) => setRemoveOpacity(e, '0')">
        <div :class="`wx-swatches__swatch${(c.toLowerCase() === '#ffffff') ? ' wx-swatches__swatch--white' : ''}`" :style="{ background: c }" />
        <button @click="() => onChange(colors.filter((_, j) => j !== i))" title="Remove" class="rm wx-swatches__remove">
          <IconX :size="10" />
        </button>
      </div>
      <button @click="() => setAdding(true)" class="wx-swatches__add">
        <IconPlus :size="18" />
      </button>
    </div>
    <SelectTeamColorModal :open="adding" :initial="colors" :onClose="() => setAdding(false)" :onSave="(next) => { onChange(next); setAdding(false); }" />
  </div>
</template>

<script>
import { IconPlus, IconX } from '../icons.js';
import SelectTeamColorModal from './SelectTeamColorModal.vue';

export default {
  name: 'ColorSwatches',
  components: { IconPlus, IconX, SelectTeamColorModal },
  props: {
    colors: { type: Array, default: undefined },
    onChange: { type: Function, default: undefined },
  },
  data() {
    return { adding: false };
  },
  mounted() {
    // React: useEffect with [] — a mousedown outside closes the color grid.
    this.onDocMouseDown = (e) => { if (this.$refs.root && !this.$refs.root.contains(e.target)) this.setAdding(false); };
    document.addEventListener("mousedown", this.onDocMouseDown);
  },
  beforeUnmount() {
    document.removeEventListener("mousedown", this.onDocMouseDown);
  },
  methods: {
    setAdding(v) { this.adding = v; },
    setRemoveOpacity(e, v) { const x = e.currentTarget.querySelector(".rm"); if (x) x.style.opacity = v; },
  },
};
</script>
