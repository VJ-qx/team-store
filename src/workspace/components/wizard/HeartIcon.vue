<!-- Converted from workspace-app.jsx: HeartIcon — a saved logo's Favorite heart in My Logos (red when
     filled). -->
<template>
  <svg :width="size" :height="size" viewBox="0 0 24 24" :fill="filled ? '#e1251b' : 'none'" :stroke="filled ? '#e1251b' : '#9a9aa1'" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 21s-7.5-4.8-10-9.3C.4 8.3 2 4.6 5.4 4.6c2 0 3.4 1.2 4.6 2.7 1.2-1.5 2.6-2.7 4.6-2.7 3.4 0 5 3.7 3.4 7.1C19.5 16.2 12 21 12 21z" />
  </svg>
</template>

<script>
export default {
  name: 'HeartIcon',
  props: {
    filled: { type: Boolean, default: undefined },
    size: { type: Number, default: 16 },
  },
};
</script>
