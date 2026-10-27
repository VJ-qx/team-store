<!-- Converted from workspace-app.jsx: NavTabs. A style passed by the caller lands on the <nav> after
     its own, as in the prototype's {...style}. -->
<template>
  <nav :style="{ display: 'flex', alignItems: 'stretch', gap: '4px', marginLeft: '44px', alignSelf: 'stretch' }">
    <a v-for="t in tabs" :key="t.id" href="#" @click="(e) => { e.preventDefault(); onChange && onChange(t.id); }" v-patch-style="tabStyle(active === t.id)" @mouseenter="(e) => { if (active !== t.id) e.currentTarget.style.color = '#0e0e10'; }" @mouseleave="(e) => { if (active !== t.id) e.currentTarget.style.color = '#3f3f46'; }">
      <span>{{ t.label }}</span>
    </a>
  </nav>
</template>

<script>
export default {
  name: 'NavTabs',
  props: {
    tabs: { type: Array, required: true },
    active: { type: String, default: undefined },
    onChange: { type: Function, default: undefined },
  },
  methods: {
    tabStyle(on) {
      return {
        display: 'inline-flex', alignItems: 'center', padding: '0 18px',
        textDecoration: 'none', color: on ? '#e1251b' : '#3f3f46',
        fontSize: '15px', fontWeight: 800, letterSpacing: '.08em', whiteSpace: 'nowrap',
        borderBottom: '3px solid ' + (on ? '#e1251b' : 'transparent'),
        transition: 'color .16s, border-color .16s',
      };
    },
  },
};
</script>
