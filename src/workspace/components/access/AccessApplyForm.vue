<!-- Converted from workspace-app.jsx: AccessApplyForm — business verification (FR-1.10.2). The
     prototype's field() and sectionLabel() render helpers are expanded in place for each field. -->
<template>
  <div class="wx-access-form">
    <div class="wx-access-form__inner">
      <!-- header -->
      <div class="wx-access-form__brand">
        <BrandMark variant="black" :height="26" />
        <span class="wx-access-form__divider" />
        <span class="wx-access-form__tag">Business Verification</span>
      </div>
      <h1 class="wx-access-form__title">Register Your Organization</h1>
      <p class="wx-access-form__lead">We couldn't match your email to an existing dealership. Provide your organization's business-entity details — collected securely through<strong class="wx-access-form__strong"> Stripe</strong>. Team Stores access opens once your organization is approved.</p>
      <!-- card -->
      <div class="wx-access-form__card">
        <div class="wx-access-form__section-label">Business Identity</div>
        <div class="wx-access-form__fields">
          <input :value="vals.legalName" v-controlled="vals.legalName" @input="(e) => setVal('legalName', e)" placeholder="Legal business name" class="wx-access-form__input" v-patch-style="{ borderColor: errors.legalName ? RED : '#d9d9de', boxShadow: errors.legalName ? '0 0 0 3px rgba(225,37,27,.12)' : 'none' }" @focus="(e) => { if (!errors.legalName) { e.target.style.borderColor = RED; e.target.style.boxShadow = '0 0 0 3px rgba(225,37,27,.12)'; } }" @blur="(e) => { if (!errors.legalName) { e.target.style.borderColor = '#d9d9de'; e.target.style.boxShadow = 'none'; } }" />
          <div class="wx-access-form__row">
            <input :value="vals.dba" v-controlled="vals.dba" @input="(e) => setVal('dba', e)" placeholder="DBA / trade name (optional)" class="wx-access-form__input" v-patch-style="{ borderColor: errors.dba ? RED : '#d9d9de', boxShadow: errors.dba ? '0 0 0 3px rgba(225,37,27,.12)' : 'none' }" @focus="(e) => { if (!errors.dba) { e.target.style.borderColor = RED; e.target.style.boxShadow = '0 0 0 3px rgba(225,37,27,.12)'; } }" @blur="(e) => { if (!errors.dba) { e.target.style.borderColor = '#d9d9de'; e.target.style.boxShadow = 'none'; } }" />
            <input :value="vals.entityType" v-controlled="vals.entityType" @input="(e) => setVal('entityType', e)" placeholder="Entity type (LLC, S-Corp…)" class="wx-access-form__input" v-patch-style="{ borderColor: errors.entityType ? RED : '#d9d9de', boxShadow: errors.entityType ? '0 0 0 3px rgba(225,37,27,.12)' : 'none' }" @focus="(e) => { if (!errors.entityType) { e.target.style.borderColor = RED; e.target.style.boxShadow = '0 0 0 3px rgba(225,37,27,.12)'; } }" @blur="(e) => { if (!errors.entityType) { e.target.style.borderColor = '#d9d9de'; e.target.style.boxShadow = 'none'; } }" />
          </div>
          <input :value="vals.address" v-controlled="vals.address" @input="(e) => setVal('address', e)" placeholder="Registered business address" class="wx-access-form__input" v-patch-style="{ borderColor: errors.address ? RED : '#d9d9de', boxShadow: errors.address ? '0 0 0 3px rgba(225,37,27,.12)' : 'none' }" @focus="(e) => { if (!errors.address) { e.target.style.borderColor = RED; e.target.style.boxShadow = '0 0 0 3px rgba(225,37,27,.12)'; } }" @blur="(e) => { if (!errors.address) { e.target.style.borderColor = '#d9d9de'; e.target.style.boxShadow = 'none'; } }" />
        </div>
        <div class="wx-access-form__rule" />
        <div class="wx-access-form__section-label">Tax &amp; Banking</div>
        <div class="wx-access-form__fields">
          <div class="wx-access-form__row">
            <input :value="vals.ein" v-controlled="vals.ein" @input="(e) => setVal('ein', e)" placeholder="EIN (XX-XXXXXXX)" class="wx-access-form__input wx-access-form__input--mono" v-patch-style="{ borderColor: errors.ein ? RED : '#d9d9de', boxShadow: errors.ein ? '0 0 0 3px rgba(225,37,27,.12)' : 'none' }" @focus="(e) => { if (!errors.ein) { e.target.style.borderColor = RED; e.target.style.boxShadow = '0 0 0 3px rgba(225,37,27,.12)'; } }" @blur="(e) => { if (!errors.ein) { e.target.style.borderColor = '#d9d9de'; e.target.style.boxShadow = 'none'; } }" />
            <input :value="vals.routing" v-controlled="vals.routing" @input="(e) => setVal('routing', e)" placeholder="Bank routing number" class="wx-access-form__input wx-access-form__input--mono" v-patch-style="{ borderColor: errors.routing ? RED : '#d9d9de', boxShadow: errors.routing ? '0 0 0 3px rgba(225,37,27,.12)' : 'none' }" @focus="(e) => { if (!errors.routing) { e.target.style.borderColor = RED; e.target.style.boxShadow = '0 0 0 3px rgba(225,37,27,.12)'; } }" @blur="(e) => { if (!errors.routing) { e.target.style.borderColor = '#d9d9de'; e.target.style.boxShadow = 'none'; } }" />
          </div>
          <input :value="vals.account" v-controlled="vals.account" @input="(e) => setVal('account', e)" placeholder="Bank account number" class="wx-access-form__input wx-access-form__input--mono" v-patch-style="{ borderColor: errors.account ? RED : '#d9d9de', boxShadow: errors.account ? '0 0 0 3px rgba(225,37,27,.12)' : 'none' }" @focus="(e) => { if (!errors.account) { e.target.style.borderColor = RED; e.target.style.boxShadow = '0 0 0 3px rgba(225,37,27,.12)'; } }" @blur="(e) => { if (!errors.account) { e.target.style.borderColor = '#d9d9de'; e.target.style.boxShadow = 'none'; } }" />
        </div>
        <div class="wx-access-form__secure">
          <IconLock :size="16" :style="{ color: '#1f9d55', flexShrink: 0 }" />
          <span class="wx-access-form__secure-text">Banking &amp; EIN details are encrypted and used only for payout verification.</span>
        </div>
        <div class="wx-access-form__actions">
          <button @click="onCancel" class="wx-access-form__cancel" @mouseenter="(e) => { e.currentTarget.style.background = '#f7f7f8'; e.currentTarget.style.borderColor = '#b8b8be'; }" @mouseleave="(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#d4d4d8'; }">Cancel</button>
          <button @click="submit" class="wx-access-form__submit" @mouseenter="(e) => { e.currentTarget.style.background = '#000'; }" @mouseleave="(e) => { e.currentTarget.style.background = INK; }">Submit &amp; Verify<IconArrowRight :size="16" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BrandMark from '../common/BrandMark.vue';
import { IconArrowRight, IconLock } from '../icons.js';

const REQUIRED = ["legalName", "entityType", "address", "ein", "routing", "account"];

export default {
  name: 'AccessApplyForm',
  components: { BrandMark, IconArrowRight, IconLock },
  props: {
    onSubmit: { type: Function, default: undefined },
    onCancel: { type: Function, default: undefined },
  },
  data() {
    return {
      RED: "#e1251b",
      INK: "#0e0e10",
      vals: {
        legalName: "", dba: "", entityType: "", address: "",
        ein: "", routing: "", account: "",
      },
      errors: {},
    };
  },
  methods: {
    setVal(k, e) {
      this.vals = { ...this.vals, [k]: e.target.value };
    },
    submit() {
      const errs = {};
      REQUIRED.forEach((k) => { if (!this.vals[k].trim()) errs[k] = true; });
      this.errors = errs;
      if (Object.keys(errs).length === 0) this.onSubmit(this.vals);
    },
  },
};
</script>
