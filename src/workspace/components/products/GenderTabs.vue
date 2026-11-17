<!-- Converted from workspace-app.jsx: GenderTabs — Men / Women tabs for Customize New Product's sport picker.
     Prototype bug, kept: the prototype defines its Tab component inside GenderTabs, so React mounts the tabs
     afresh on every render (a clicked tab doesn't keep focus). Here the tabs get a new key on every update,
     which does the same. -->
<template>
  <div class="wx-gender-tabs">
    <button :key="'men-' + generation" type="button" @click="onChange('men')" :class="`wx-gender-tabs__tab${gender === 'men' ? ' wx-gender-tabs__tab--active' : ''}`">Men</button>
    <button :key="'women-' + generation" type="button" @click="onChange('women')" :class="`wx-gender-tabs__tab${gender === 'women' ? ' wx-gender-tabs__tab--active' : ''}`">Women</button>
  </div>
</template>

<script>
export default {
  name: 'GenderTabs',
  props: {
    gender: { type: String, default: undefined },
    onChange: { type: Function, default: undefined },
  },
  created() {
    // Not reactive: read by the next render only.
    this.generation = 0;
  },
  beforeUpdate() {
    this.generation += 1;
  },
};
</script>
