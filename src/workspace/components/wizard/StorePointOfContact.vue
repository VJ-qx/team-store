<!-- Converted from workspace-app.jsx: StorePointOfContact — the Store Point of Contact panel: an intro and
     the email and phone columns. "Edit it there" scrolls to the Team Manager record (#tm-panel). -->
<template>
  <div class="wx-poc">
    <div class="wx-poc__intro">Displayed on the store's footer. Select the primary point of contact buyers will reach out to for this store.</div>
    <div class="wx-poc__channels">
      <div>
        <ContactChannel kind="email" :accent="accent" :inherited="data.email" :onEditManager="jumpToManagerPanel" :mode="data.contactEmailMode" :onMode="(v) => set({ contactEmailMode: v })" :sp="data.contactEmailSalesperson" :onSp="(v) => set({ contactEmailSalesperson: v })" :custom="data.contactEmailCustom" :onCustom="(v) => set({ contactEmailCustom: v })" />
        <div v-if="errors.contactEmailMode" class="wx-poc__error">{{ errors.contactEmailMode }}</div>
      </div>
      <div>
        <ContactChannel kind="phone" :accent="accent" :inherited="data.phone" :onEditManager="jumpToManagerPanel" :mode="data.contactPhoneMode" :onMode="(v) => set({ contactPhoneMode: v })" :sp="data.contactPhoneSalesperson" :onSp="(v) => set({ contactPhoneSalesperson: v })" :custom="data.contactPhoneCustom" :onCustom="(v) => set({ contactPhoneCustom: v })" />
        <div v-if="errors.contactPhoneMode" class="wx-poc__error">{{ errors.contactPhoneMode }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import ContactChannel from './ContactChannel.vue';

export default {
  name: 'StorePointOfContact',
  components: { ContactChannel },
  props: {
    data: { type: Object, required: true },
    set: { type: Function, default: undefined },
    accent: { type: String, default: undefined },
    errors: { type: Object, default: () => ({}) },
  },
  methods: {
    // Scroll the wizard to the Team Manager record (no-op where the panel isn't on screen).
    jumpToManagerPanel() {
      const el = document.getElementById("tm-panel");
      if (el) window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().top - 100, behavior: "smooth" });
    },
  },
};
</script>
