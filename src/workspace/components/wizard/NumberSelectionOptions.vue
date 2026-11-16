<!-- Converted from workspace-app.jsx: NumberSelectionOptions — the two Jersey Number Selection choices
     (team manager chooses, or players choose). Two roots, like the prototype's fragment. -->
<template>
  <button v-for="o in NUMBER_SELECTION_OPTS" :key="o.key" type="button" @click="() => onChange(o.key)" :class="`wx-number-select__option${value === o.key ? ' wx-number-select__option--on' : ''}`">
    <span :class="`wx-number-select__radio${value === o.key ? ' wx-number-select__radio--on' : ''}`" />
    <span><strong class="wx-number-select__title">{{ o.title }}</strong><span class="wx-number-select__desc">{{ o.desc }}</span></span>
  </button>
</template>

<script>
import { NUMBER_SELECTION_OPTS } from '../../data/wizard.js';

export default {
  name: 'NumberSelectionOptions',
  props: {
    value: { type: String, default: undefined },
    onChange: { type: Function, default: undefined },
  },
  data() {
    return { NUMBER_SELECTION_OPTS };
  },
};
</script>
