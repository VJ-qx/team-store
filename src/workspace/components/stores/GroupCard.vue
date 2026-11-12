<!-- Converted from workspace-app.jsx: GroupCard — a group's card at the front of a league's grid on the
     Stores page; "Open Group" shows the group's stores. Leagues are out of the MVP, so the prototype
     never shows it. -->
<template>
  <div class="wx-group-card" @mouseenter="(e) => { e.currentTarget.style.boxShadow = '0 8px 22px rgba(20,20,30,.09)'; e.currentTarget.style.borderColor = '#d4d4d8'; }" @mouseleave="(e) => { e.currentTarget.style.boxShadow = '0 1px 2px rgba(20,20,30,.03)'; e.currentTarget.style.borderColor = '#ececf0'; }">
    <div class="wx-group-card__media">
      <div class="wx-group-card__tag">Group</div>
      <div class="wx-group-card__icon">
        <IconGrid :size="32" :stroke="1.7" />
      </div>
    </div>
    <div class="wx-group-card__body">
      <div class="wx-group-card__name">{{ group.name }}</div>
      <div class="wx-group-card__count">{{ count }} {{ count === 1 ? 'team' : 'teams' }}</div>
    </div>
    <div class="wx-group-card__foot">
      <button @click="onOpen" class="wx-group-card__open" @mouseenter="(e) => { e.currentTarget.style.background = '#0e0e10'; e.currentTarget.style.color = '#fff'; }" @mouseleave="(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#0e0e10'; }">Open Group</button>
    </div>
  </div>
</template>

<script>
import { IconGrid } from '../icons.js';

export default {
  name: 'GroupCard',
  components: { IconGrid },
  props: {
    group: { type: Object, required: true },
    onOpen: { type: Function, default: undefined },
  },
  computed: {
    count() { return (this.group.storeIds || []).length; },
  },
};
</script>
