<!-- Converted from workspace-app.jsx: CancelConfirmModal — "Discard this store?", asked when CANCEL (or a
     header link) would leave the Add Store wizard. Its styles stay inline: like the shared basics, it
     hasn't been through the SCSS step. -->
<template>
  <Modal :open="open" :onClose="onClose" :width="420">
    <div :style="{ padding: '28px 24px 20px' }">
      <div :style="{ width: '44px', height: '44px', borderRadius: '50%', background: '#fff3f2', color: '#b81d14', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }">
        <IconAlert :size="20" />
      </div>
      <h3 :style="{ fontSize: '16px', fontWeight: 700, margin: 0, marginBottom: '8px' }">Discard this store?</h3>
      <p :style="{ fontSize: '13px', color: '#6b6b72', margin: 0, marginBottom: '24px', lineHeight: 1.55 }">You'll lose any details you've entered. This can't be undone.</p>
      <div :style="{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }">
        <Button variant="ghost" :onClick="onClose">Keep Editing</Button>
        <Button variant="danger" :onClick="onConfirm">Discard</Button>
      </div>
    </div>
  </Modal>
</template>

<script>
import Button from '../common/Button.vue';
import Modal from '../common/Modal.vue';
import { IconAlert } from '../icons.js';

export default {
  name: 'CancelConfirmModal',
  components: { Button, IconAlert, Modal },
  props: {
    open: { type: Boolean, default: undefined },
    onClose: { type: Function, default: undefined },
    onConfirm: { type: Function, default: undefined },
  },
};
</script>
