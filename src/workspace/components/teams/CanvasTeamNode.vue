<!-- Converted from workspace-app.jsx: CanvasTeamNode — a team on the team canvas (under its division's rail,
     or among the unassigned teams): its badge, name, code and players, a Roster Bank count, and the handle
     dragged onto a division.
     Not converted yet (a store's My Team(s) tab only; the wizard never passes products): the product chips
     row (prods, CpChip, onProdClick, onProdAdd). The props stay declared. -->
<template>
  <div class="wx-canvas-team">
    <div v-if="rail" class="wx-canvas-team__rail">
      <span class="wx-canvas-team__rail-line" />
      <span class="wx-canvas-team__rail-branch" />
    </div>
    <div :ref="(el) => { nodeRefs.current['t:' + t.id] = el; }" @click="(e) => { e.stopPropagation(); onSelect(); }" :class="`wx-canvas-team__card${isTarget ? ' wx-canvas-team__card--target' : ''}${isSel ? ' wx-canvas-team__card--selected' : ''}`">
      <div class="wx-canvas-team__row">
        <span class="wx-canvas-team__badge" :style="{ background: rTint(color, 0.12), color }">{{ t.division || rInitials(t.name) }}</span>
        <div class="wx-canvas-team__text">
          <div class="wx-canvas-team__name">{{ t.name }}</div>
          <div class="wx-canvas-team__meta">{{ rTeamCode(t.id) }} · {{ t.players || 0 }} players</div>
        </div>
        <span v-if="bankCount > 0" :title="bankCount + ' proposed players waiting in the Roster Bank'" class="wx-canvas-team__bank"><IconBankInbox :size="11" /> {{ bankCount }}</span>
      </div>
      <CanvasHandle side="left" :active="!!(drag && drag.from.kind === 'team' && drag.from.id === t.id)" :title="parent ? 'Drag to another division to move this team' : 'Drag to a division to connect'" :onPointerDown="(e) => onHandleDown(e)" />
    </div>
  </div>
</template>

<script>
import { rInitials, rTeamCode, rTint } from '../../lib/rosters.js';
import IconBankInbox from '../common/IconBankInbox.vue';
import CanvasHandle from './CanvasHandle.vue';

export default {
  name: 'CanvasTeamNode',
  components: { CanvasHandle, IconBankInbox },
  props: {
    t: { type: Object, default: undefined },
    parent: { type: Object, default: undefined },
    rail: { type: Boolean, default: undefined },
    sel: { type: Object, default: undefined },
    drag: { type: Object, default: undefined },
    onSelect: { type: Function, default: undefined },
    onHandleDown: { type: Function, default: undefined },
    nodeRefs: { type: Object, default: undefined },
    bankCount: { type: Number, default: undefined },
    // A store's My Team(s) tab only (not converted yet).
    prods: { type: Array, default: undefined },
    store: { type: Object, default: undefined },
    onProdClick: { type: Function, default: undefined },
    onProdAdd: { type: Function, default: undefined },
  },
  computed: {
    isSel() { const { sel, t } = this; return sel && sel.kind === "team" && sel.id === t.id; },
    isTarget() { const { drag, t } = this; return drag && drag.over === "t:" + t.id; },
    color() { const { t, parent } = this; return t.colorOverride || (parent && parent.color) || "#3f3f46"; },
  },
  methods: { rInitials, rTeamCode, rTint },
};
</script>
