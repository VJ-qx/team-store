<!-- Converted from workspace-app.jsx: LogoDropZone — the Team Logo box: drop an image on it, or click the
     empty box to pick from My Logos; a logo shows with a small ✕ to remove it. -->
<template>
  <div @click="onBoxClick" @dragover="(e) => { e.preventDefault(); setDrag(true); }" @dragleave="() => setDrag(false)" @drop="(e) => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }" :class="`wx-logo-drop${logo ? ' wx-logo-drop--filled' : ''}${drag ? ' wx-logo-drop--drag' : ''}`" :style="{ border: `1px ${logo ? 'solid' : 'dashed'} ${drag ? '#0e0e10' : logo ? '#d4d4d8' : '#9a9aa1'}` }">
    <template v-if="logo">
      <img v-if="logo.url" :src="logo.url" alt="" class="wx-logo-drop__img" />
      <div v-else class="wx-logo-drop__mono" :style="{ background: logo.color || '#0e0e10' }">{{ logo.mono || "?" }}</div>
      <button @click="(e) => { e.stopPropagation(); onChange(null); }" title="Remove logo" class="wx-logo-drop__remove">
        <IconX :size="10" />
      </button>
    </template>
    <IconPlus v-else :size="18" :style="{ color: '#6b6b72' }" />
  </div>
  <MyLogosModal :open="libOpen" :onClose="() => setLibOpen(false)" :onSelect="(l) => { onChange(l); setLibOpen(false); }" />
</template>

<script>
import { IconPlus, IconX } from '../icons.js';
import MyLogosModal from './MyLogosModal.vue';

export default {
  name: 'LogoDropZone',
  components: { IconPlus, IconX, MyLogosModal },
  props: {
    logo: { type: Object, default: undefined },
    onChange: { type: Function, default: undefined },
  },
  data() {
    return { drag: false, libOpen: false };
  },
  methods: {
    setDrag(v) { this.drag = v; },
    setLibOpen(v) { this.libOpen = v; },
    // The prototype only has a click handler while the box is empty.
    onBoxClick() { if (!this.logo) this.setLibOpen(true); },
    handleFile(file) {
      if (!file) return;
      const url = URL.createObjectURL(file);
      this.onChange({ name: file.name, url });
    },
  },
};
</script>
