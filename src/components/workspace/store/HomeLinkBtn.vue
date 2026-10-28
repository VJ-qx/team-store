<!-- Converted from workspace-app.jsx / workspace-app-integrated.jsx: HomeLinkBtn — the small text buttons on a
     store's Home tab (Open ›, Edit ›, Invite). -->
<template>
  <button @click="onClick" :class="`wx-home-link${muted ? ' wx-home-link--muted' : ''}`">{{ label }}</button>
</template>

<script>
export default {
  name: 'HomeLinkBtn',
  props: {
    label: { type: String, default: undefined },
    onClick: { type: Function, default: undefined },
    muted: { type: Boolean, default: false },
  },
};
</script>
