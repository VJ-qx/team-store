<!-- Converted from workspace-app.jsx: CanvasParentNode — a division on the team canvas: its color, name and
     team count, "+" to add a team, and the handle dragged onto a team to connect it. -->
<template>
  <div :ref="(el) => { nodeRefs.current['p:' + g.id] = el; }" @click="(e) => { e.stopPropagation(); onSelect(); }" :class="`wx-canvas-division${isTarget ? ' wx-canvas-division--target' : ''}${isSel ? ' wx-canvas-division--selected' : ''}${(canTarget && !isTarget) ? ' wx-canvas-division--can-target' : ''}`" :style="{ background: g.color }">
    <span class="wx-canvas-division__initials">{{ rInitials(g.name) }}</span>
    <div class="wx-canvas-division__text">
      <div class="wx-canvas-division__name">{{ g.name }}</div>
      <div class="wx-canvas-division__meta">{{ drag && drag.from.kind === "prod" ? "Drop = all " + g.rosters.length + " " + (g.rosters.length === 1 ? "team" : "teams") : prodCount != null ? g.rosters.length + " " + (g.rosters.length === 1 ? "team" : "teams") + " · " + prodCount + " prod" : "Division · " + g.rosters.length + " " + (g.rosters.length === 1 ? "team" : "teams") }}</div>
    </div>
    <button title="Add team" @click="(e) => { e.stopPropagation(); onAddTeam(); }" class="wx-canvas-division__add"><IconPlus :size="14" :style="{ strokeWidth: 2.6 }" /></button>
    <CanvasHandle side="bottom" :active="!!(drag && drag.from.kind === 'parent' && drag.from.id === g.id)" title="Drag to a team to connect it" :onPointerDown="(e) => onHandleDown(e)" />
  </div>
</template>

<script>
import { rInitials } from '../../lib/rosters.js';
import { IconPlus } from '../icons.js';
import CanvasHandle from './CanvasHandle.vue';

export default {
  name: 'CanvasParentNode',
  components: { CanvasHandle, IconPlus },
  props: {
    g: { type: Object, default: undefined },
    sel: { type: Object, default: undefined },
    drag: { type: Object, default: undefined },
    onSelect: { type: Function, default: undefined },
    onAddTeam: { type: Function, default: undefined },
    onHandleDown: { type: Function, default: undefined },
    nodeRefs: { type: Object, default: undefined },
    prodCount: { type: Number, default: undefined },
  },
  computed: {
    isSel() { const { sel, g } = this; return sel && sel.kind === "parent" && sel.id === g.id; },
    isTarget() { const { drag, g } = this; return drag && drag.over === "p:" + g.id; },
    canTarget() { const { drag } = this; return drag && (drag.from.kind === "team" || drag.from.kind === "prod"); },
  },
  methods: { rInitials },
};
</script>
