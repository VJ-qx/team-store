<!-- Converted from workspace-app.jsx: ListToolbar — the Show Filters · Sort By · Search row the Stores
     page uses (Module 3, FR-3.2 to FR-3.4), shared with the Leagues grid and a store's Roster and
     Products tabs. With `sort` / `filter` ({ value, options, onChange, width }) the buttons open a
     ToolbarMenu; without them it is the prototype's static ("legacy") toolbar. -->
<template>
  <div v-if="legacy" class="wx-list-toolbar">
    <button class="wx-list-toolbar__btn" @mouseenter="(e) => (e.currentTarget.style.background = '#fafafb')" @mouseleave="(e) => (e.currentTarget.style.background = '#fff')"><IconFilter :size="16" /> Show Filters</button>
    <button class="wx-list-toolbar__btn" @mouseenter="(e) => (e.currentTarget.style.background = '#fafafb')" @mouseleave="(e) => (e.currentTarget.style.background = '#fff')"><IconSort :size="16" /> Sort By: Default</button>
    <div class="wx-list-toolbar__search">
      <input :placeholder="searchPlaceholder" class="wx-list-toolbar__input" />
      <IconSearch :size="16" :style="{ position: 'absolute', right: '12px', color: '#9a9aa1' }" />
    </div>
  </div>
  <div v-else class="wx-list-toolbar">
    <div v-if="filter" class="wx-list-toolbar__dropdown">
      <button :class="`wx-list-toolbar__btn${open === 'filter' ? ' wx-list-toolbar__btn--active' : ''}`" @click="() => setOpen(open === 'filter' ? null : 'filter')"><IconFilter :size="16" /> {{ filterLabel }}</button>
      <ToolbarMenu v-if="open === 'filter'" :options="filter.options" :value="filter.value" :width="filter.width || 232" :onSelect="filter.onChange" :onClose="() => setOpen(null)" />
    </div>
    <div v-if="sort" class="wx-list-toolbar__dropdown">
      <button :class="`wx-list-toolbar__btn${open === 'sort' ? ' wx-list-toolbar__btn--active' : ''}`" @click="() => setOpen(open === 'sort' ? null : 'sort')"><IconSort :size="16" /> Sort By: {{ sort.value }}</button>
      <ToolbarMenu v-if="open === 'sort'" :options="sort.options" :value="sort.value" :width="sort.width || 232" align="left" :onSelect="sort.onChange" :onClose="() => setOpen(null)" />
    </div>
    <div v-if="showSearch" class="wx-list-toolbar__search">
      <input :value="searchValue || ''" @input="(e) => onSearch && onSearch(e.target.value)" :placeholder="searchPlaceholder" class="wx-list-toolbar__input" />
      <IconSearch :size="16" :style="{ position: 'absolute', right: '12px', color: '#9a9aa1' }" />
    </div>
  </div>
</template>

<script>
import { IconFilter, IconSearch, IconSort } from '../icons.js';
import ToolbarMenu from './ToolbarMenu.vue';

export default {
  name: 'ListToolbar',
  components: { IconFilter, IconSearch, IconSort, ToolbarMenu },
  props: {
    searchPlaceholder: { type: String, default: "Search Team Stores" },
    sort: { type: Object, default: undefined },
    filter: { type: Object, default: undefined },
    showSearch: { type: Boolean, default: true },
    searchValue: { type: String, default: undefined },
    onSearch: { type: Function, default: undefined },
  },
  data() {
    return { open: null }; // 'sort' | 'filter' | null
  },
  computed: {
    legacy() { return !this.sort && !this.filter; },
    filterLabel() { return this.filter && this.filter.value && this.filter.value !== "All" ? `Filter: ${this.filter.value}` : "Show Filters"; },
  },
  methods: {
    setOpen(v) { this.open = v; },
  },
};
</script>
