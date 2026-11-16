<!-- Converted from workspace-app.jsx: ContactChannel — one point-of-contact column (email or phone): Team
     Manager (follows the manager record), Salesperson (pick one) or Custom.
     Prototype bug, kept: the prototype defines its Row component inside ContactChannel, so React mounts
     the rows afresh on every render (for example, the Custom input loses focus after each keystroke). Here
     the rows get a new key on every update, which does the same. -->
<template>
  <div class="wx-contact-channel">
    <div class="wx-contact-channel__head">
      <component :is="isEmail ? IconMail : IconPhone" :size="16" :style="{ color: accent }" />
      <span class="wx-contact-channel__title">{{ isEmail ? "Email" : "Phone" }}</span>
    </div>
    <div class="wx-contact-channel__rows">
      <button :key="'teammanager-' + generation" type="button" @click="() => onMode('teammanager')" class="wx-contact-channel__row">
        <div class="wx-contact-channel__row-inner">
          <RadioDot :on="m === 'teammanager'" :accent="accent" />
          <div class="wx-contact-channel__row-body">
            <div class="wx-contact-channel__row-label">{{ labels.tm }}</div>
            <div v-if="inherited || m === 'teammanager'" class="wx-contact-channel__inherited">
              <div :class="`wx-contact-channel__value${inherited ? ' wx-contact-channel__value--inherited' : ''}${(isEmail || !inherited) ? ' wx-contact-channel__value--plain' : ''}`">{{ inherited || ("No " + (isEmail ? "email" : "phone number") + " on the Team Manager record yet") }}</div>
              <div v-if="m === 'teammanager'" class="wx-contact-channel__follows">Follows the Team Manager record.{{ " " }}<span v-if="onEditManager" role="button" @click="(e) => { e.stopPropagation(); onEditManager(); }" class="wx-contact-channel__edit-link">Edit it there</span></div>
            </div>
          </div>
        </div>
      </button>
      <button :key="'salesperson-' + generation" type="button" @click="() => onMode('salesperson')" class="wx-contact-channel__row">
        <div class="wx-contact-channel__row-inner">
          <RadioDot :on="m === 'salesperson'" :accent="accent" />
          <div class="wx-contact-channel__row-body">
            <div class="wx-contact-channel__row-label">{{ labels.sp }}</div>
            <div v-if="m === 'salesperson'" @click="(e) => e.stopPropagation()" class="wx-contact-channel__select">
              <SelectField label="Select a Salesperson" :value="sp" :onChange="onSp" :options="SALESPEOPLE.map((s) => ({ value: s.value, label: s.label + ' · ' + s[spField] }))" />
            </div>
          </div>
        </div>
      </button>
      <button :key="'custom-' + generation" type="button" @click="() => onMode('custom')" class="wx-contact-channel__row">
        <div class="wx-contact-channel__row-inner">
          <RadioDot :on="m === 'custom'" :accent="accent" />
          <div class="wx-contact-channel__row-body">
            <div class="wx-contact-channel__row-label">{{ labels.custom }}</div>
            <input v-if="m === 'custom'" @click="(e) => e.stopPropagation()" :value="custom || ''" :placeholder="placeholder" :type="isEmail ? 'email' : 'tel'" @input="(e) => onCustom(isEmail ? e.target.value : formatPhone(e.target.value))" class="wx-contact-channel__input" />
          </div>
        </div>
      </button>
    </div>
  </div>
</template>

<script>
import { SALESPEOPLE } from '../../data/wizard.js';
import { formatPhone } from '../../lib/wizard.js';
import { IconMail, IconPhone } from '../icons.js';
import SelectField from '../common/SelectField.vue';
import RadioDot from './RadioDot.vue';

export default {
  name: 'ContactChannel',
  components: { RadioDot, SelectField },
  props: {
    kind: { type: String, default: undefined },
    mode: { type: String, default: undefined },
    onMode: { type: Function, default: undefined },
    sp: { type: String, default: undefined },
    onSp: { type: Function, default: undefined },
    custom: { type: String, default: undefined },
    onCustom: { type: Function, default: undefined },
    accent: { type: String, default: undefined },
    inherited: { type: String, default: undefined },
    onEditManager: { type: Function, default: undefined },
  },
  data() {
    return { SALESPEOPLE, IconMail, IconPhone };
  },
  computed: {
    isEmail() { return this.kind === "email"; },
    // Legacy "service" reads as Team Manager.
    m() { return this.mode === "service" ? "teammanager" : (this.mode || ""); },
    labels() {
      return this.isEmail
        ? { tm: "Team Manager Email", sp: "Salesperson Email", custom: "Custom Email" }
        : { tm: "Team Manager Phone", sp: "Salesperson Phone", custom: "Custom Phone" };
    },
    placeholder() { return this.isEmail ? "example@email.com" : "000-000-0000"; },
    spField() { return this.isEmail ? "email" : "phone"; },
  },
  created() {
    // Not reactive: read by the next render only.
    this.generation = 0;
  },
  beforeUpdate() {
    this.generation += 1;
  },
  methods: {
    formatPhone,
  },
};
</script>
