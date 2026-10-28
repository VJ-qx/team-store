<!-- Converted from workspace-app.jsx / workspace-app-integrated.jsx: StoreGuideModal — "How your store comes
     together", a plain-language orientation (not a checklist, never a gate). Opens the first time a rep opens
     a store; reopenable from the workspace header. -->
<template>
  <Modal v-if="open" :open="true" :onClose="onClose" :width="640">
    <div class="wx-store-guide">
      <div class="wx-store-guide__head">
        <div>
          <div class="wx-store-guide__eyebrow">Store Setup Guide</div>
          <h2 class="wx-store-guide__title">How your store comes together</h2>
        </div>
        <button @click="onClose" aria-label="Close" class="wx-store-guide__close"><IconX :size="20" /></button>
      </div>
      <div class="wx-store-guide__lead">A quick orientation — nothing here is required, and you can reopen it anytime from the workspace header.</div>
      <!-- The prototype's sec(title, body) helper, written out at each call. -->
      <div class="wx-store-guide__items">
        <div class="wx-store-guide__item">
          <span class="wx-store-guide__bullet" />
          <div>
            <div class="wx-store-guide__item-title">The tabs</div>
            <div class="wx-store-guide__item-body">Products holds your catalog. Orders tracks buyer purchases. My Team(s) manages rosters and team codes. Reports covers sales and fundraising. Settings edits everything you set at creation.</div>
          </div>
        </div>
        <div class="wx-store-guide__item">
          <span class="wx-store-guide__bullet" />
          <div>
            <div class="wx-store-guide__item-title">How a product reaches the storefront</div>
            <div class="wx-store-guide__item-body">Add it (Add Products), configure it (sizes, category, pricing), turn its Visibility on, then launch the store. Hidden items stay in your catalog but never show to buyers.</div>
          </div>
        </div>
        <div class="wx-store-guide__item">
          <span class="wx-store-guide__bullet" />
          <div>
            <div class="wx-store-guide__item-title">Team Required vs. Team Supplied</div>
            <div class="wx-store-guide__item-body">Team Required gear must be bought by rostered players at their own cost. Team Supplied gear is already paid for — players pick sizes and pay $0. Both file under the Team Gear category.</div>
          </div>
        </div>
        <div class="wx-store-guide__item">
          <span class="wx-store-guide__bullet" />
          <div>
            <div class="wx-store-guide__item-title">The Stock Vault vs. a bundle</div>
            <div class="wx-store-guide__item-body">The Stock Vault is your library of blank stock gear — Pro Stock and Sideline Stock. A bundle is buyer-facing: several catalog items sold together as one storefront line. A Catalog Template is a saved set of this store's own gear you can reuse in a later store.</div>
          </div>
        </div>
        <div class="wx-store-guide__item">
          <span class="wx-store-guide__bullet" />
          <div>
            <div class="wx-store-guide__item-title">Launching, closing, re-opening</div>
            <div class="wx-store-guide__item-body">Launch controls live in the workspace on the Settings tab. A store needs at least one visible product to launch; you can close and re-open it anytime.</div>
          </div>
        </div>
      </div>
      <div class="wx-store-guide__foot">
        <button @click="onClose" class="wx-store-guide__done">Got it</button>
      </div>
    </div>
  </Modal>
</template>

<script>
import { IconX } from '../icons.js';
import Modal from '../common/Modal.vue';

export default {
  name: 'StoreGuideModal',
  components: { IconX, Modal },
  props: {
    open: { type: Boolean, default: false },
    onClose: { type: Function, default: undefined },
    onComplete: { type: Function, default: undefined },
  },
};
</script>
