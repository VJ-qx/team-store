<!-- Converted from workspace-app.jsx: RestoreStoreModal — confirms restoring an archived store. Renders
     nothing without a store, as in the prototype. -->
<template>
  <Modal v-if="store" :open="open" :onClose="onClose" :width="480">
    <div :style="{ padding: '28px 28px 8px' }">
      <div :style="{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }">
        <span :style="{ width: '40px', height: '40px', borderRadius: '50%', background: '#e7f5ed', color: '#1f7a44', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }">
          <IconCheck :size="19" :style="{ strokeWidth: 2.4 }" />
        </span>
        <h2 :style="{ margin: '0', fontSize: '18px', fontWeight: 800 }">Restore {{ store.teamName || store.storeTitle }}?</h2>
      </div>
      <p :style="{ margin: '0 0 12px', fontSize: '13.5px', color: '#6b6b72', lineHeight: 1.6 }">Restoring this store will:</p>
      <ul :style="{ margin: '0 0 4px', paddingLeft: '20px', fontSize: '13.5px', color: '#0e0e10', lineHeight: 1.85 }">
        <li>Move it back into your active stores list</li>
        <li>Return it as a draft so you can review before re-opening</li>
        <li>Keep all retained order history and reports intact</li>
      </ul>
      <p :style="{ margin: '12px 0 0', fontSize: '13px', color: '#6b6b72', lineHeight: 1.6 }">The storefront stays closed to buyers until you re-open it.</p>
    </div>
    <div :style="{ padding: '20px 28px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }">
      <Button variant="secondary" :onClick="onClose">Cancel</Button>
      <button @click="onConfirm" :style="{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#0e0e10', border: '0', borderRadius: '6px', padding: '12px 20px', fontSize: '14px', fontWeight: 700, color: '#fff', cursor: 'pointer', fontFamily: 'inherit' }">
        <IconCheck :size="15" :style="{ strokeWidth: 2.4 }" /> Restore Store</button>
    </div>
  </Modal>
</template>

<script>
import Button from '../common/Button.vue';
import Modal from '../common/Modal.vue';
import { IconCheck } from '../icons.js';

export default {
  name: 'RestoreStoreModal',
  components: { Button, IconCheck, Modal },
  props: {
    open: { type: Boolean, default: undefined },
    store: { type: Object, default: undefined },
    onClose: { type: Function, default: undefined },
    onConfirm: { type: Function, default: undefined },
  },
};
</script>
