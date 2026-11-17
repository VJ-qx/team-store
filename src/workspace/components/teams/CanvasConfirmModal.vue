<!-- Converted from workspace-app.jsx: CanvasConfirmModal — the team canvas's confirmations: move a team to
     another division, delete a team, delete a division (in the wizard its teams are kept as standalone), or
     "Remove its teams first". It only exists while there is something to confirm, so it closes without the
     pop-up's closing animation, as in the prototype. -->
<template>
  <Modal v-if="confirm" :open="true" :onClose="onClose" :width="460">
    <div class="wx-canvas-confirm">
      <div class="wx-canvas-confirm__row">
        <div :class="`wx-canvas-confirm__icon${danger ? ' wx-canvas-confirm__icon--danger' : ''}`">
          <IconTrash v-if="danger" :size="20" :style="{ strokeWidth: 2 }" />
          <IconUsers v-else :size="20" />
        </div>
        <div>
          <h2 class="wx-canvas-confirm__title">{{ title }}</h2>
          <p class="wx-canvas-confirm__body">{{ body }}</p>
        </div>
      </div>
      <div class="wx-canvas-confirm__actions">
        <button v-if="!blocked" @click="onClose" class="wx-canvas-confirm__cancel">Cancel</button>
        <button @click="blocked ? onClose() : onConfirm()" :class="`wx-canvas-confirm__ok${danger ? ' wx-canvas-confirm__ok--danger' : ''}`">{{ blocked ? "Got it" : confirm.type === "reparent" ? "Move Team" : "Delete" }}</button>
      </div>
    </div>
  </Modal>
</template>

<script>
import Modal from '../common/Modal.vue';
import { IconTrash, IconUsers } from '../icons.js';

export default {
  name: 'CanvasConfirmModal',
  components: { IconTrash, IconUsers, Modal },
  props: {
    confirm: { type: Object, default: undefined },
    onClose: { type: Function, default: undefined },
    onConfirm: { type: Function, default: undefined },
  },
  computed: {
    danger() { const { confirm } = this; return confirm.type === "delete-team" || confirm.type === "delete-parent" || confirm.type === "delete-parent-rehome"; },
    blocked() { return this.confirm.type === "blocked-parent"; },
    title() {
      const { confirm } = this;
      return confirm.type === "reparent" ? `Move ${confirm.teamName}?`
        : confirm.type === "delete-team" ? "Delete team?"
        : confirm.type === "delete-parent" || confirm.type === "delete-parent-rehome" ? "Delete division?"
        : "Remove its teams first";
    },
    body() {
      const { confirm } = this;
      return confirm.type === "reparent"
        ? `${confirm.teamName} will leave ${confirm.fromName} and connect to ${confirm.toName}, inheriting its branding. Players, orders, and freight routing move with it.`
        : confirm.type === "delete-team"
        ? `Are you sure you want to delete "${confirm.name}"? Its roster and edge are removed. This can't be undone.`
        : confirm.type === "delete-parent"
        ? `Delete the empty division "${confirm.name}"? This can't be undone.`
        : confirm.type === "delete-parent-rehome"
        ? `Deleting "${confirm.name}" won't delete its ${confirm.count} ${confirm.count === 1 ? "team" : "teams"} — ${confirm.count === 1 ? "it" : "they"} will be kept as standalone. This can't be undone.`
        : `"${confirm.name}" still has ${confirm.count} ${confirm.count === 1 ? "team" : "teams"} connected. Delete or move its teams to another division first.`;
    },
  },
};
</script>
