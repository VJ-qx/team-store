<!-- Converted from workspace-app.jsx: ListPageHeader — a list page's title with either a subtitle or the
     store count and revenue, and the actions on the right (the default slot). -->
<template>
  <div class="wx-list-head">
    <div>
      <h1 class="wx-list-head__title">{{ title }}</h1>
      <div v-if="subtitle" class="wx-list-head__subtitle">{{ subtitle }}</div>
      <div v-else class="wx-list-head__meta">
        <span class="wx-list-head__meta-item"><IconStore :size="16" /> {{ storeCount }} {{ storeCount === 1 ? 'Store' : 'Stores' }}</span>
        <span class="wx-list-head__meta-item">
          <IconDollar :size="16" :style="{ color: '#1f9d55' }" />
          <span class="wx-list-head__revenue">${{ revenueText }}</span>
        </span>
      </div>
    </div>
    <div class="wx-list-head__actions"><slot /></div>
  </div>
</template>

<script>
import { IconDollar, IconStore } from '../icons.js';

export default {
  name: 'ListPageHeader',
  components: { IconDollar, IconStore },
  props: {
    title: { type: String, default: undefined },
    storeCount: { type: Number, default: undefined },
    revenue: { type: Number, default: undefined },
    subtitle: { type: String, default: undefined },
  },
  computed: {
    revenueText() { return this.revenue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","); },
  },
};
</script>
