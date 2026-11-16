<!-- Converted from workspace-app.jsx: ArchiveStoreModal — the "Archive <store>?" confirmation a card's ⋮
     menu opens (Module 3, FR-3.11.1). Renders nothing without a store, as in the prototype. -->
<template>
  <Modal v-if="store" :open="open" :onClose="onClose" :width="480">
    <div class="wx-archive-modal__body">
      <div class="wx-archive-modal__head">
        <span class="wx-archive-modal__icon">
          <IconAlert :size="19" :style="{ strokeWidth: 2.2 }" />
        </span>
        <h2 class="wx-archive-modal__title">Archive {{ store.teamName || store.storeTitle }}?</h2>
      </div>
      <p class="wx-archive-modal__lead">Archiving a store will:</p>
      <ul class="wx-archive-modal__list">
        <li>Hide the storefront from all buyers immediately</li>
        <li>Stop all new orders and close any active ordering window</li>
        <li>Remove it from your active stores list</li>
      </ul>
      <p class="wx-archive-modal__note">Order history and reports are retained. This can be undone by support.</p>
    </div>
    <div class="wx-archive-modal__foot">
      <Button variant="secondary" :onClick="onClose">Cancel</Button>
      <button @click="onConfirm" class="wx-archive-modal__confirm">
        <IconTrash :size="14" :style="{ strokeWidth: 2.2 }" /> Archive Store</button>
    </div>
  </Modal>
</template>

<script>
import Button from '../common/Button.vue';
import Modal from '../common/Modal.vue';
import { IconAlert, IconTrash } from '../icons.js';

export default {
  name: 'ArchiveStoreModal',
  components: { Button, IconAlert, IconTrash, Modal },
  props: {
    open: { type: Boolean, default: undefined },
    store: { type: Object, default: undefined },
    onClose: { type: Function, default: undefined },
    onConfirm: { type: Function, default: undefined },
  },
};
</script>
