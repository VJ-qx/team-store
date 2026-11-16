<!-- Converted from workspace-app.jsx: ShipToAddressFields — street, apt, city, state and ZIP of a manual
     ship-to address. -->
<template>
  <div class="wx-ship-address">
    <div class="wx-ship-address__row">
      <TextField label="Street Address" :value="v.shipStreet" :onChange="(x) => onChange({ shipStreet: x })" />
      <TextField label="Apt, Suite, etc" :value="v.shipApt" :onChange="(x) => onChange({ shipApt: x })" :style="{ flex: '.6' }" />
    </div>
    <div class="wx-ship-address__row">
      <TextField label="City" :value="v.shipCity" :onChange="(x) => onChange({ shipCity: x })" />
      <SelectField label="State" :value="v.shipState" :options="EG_STATES" :onChange="(x) => onChange({ shipState: x })" />
      <TextField label="ZIP Code" :value="v.shipZip" :onChange="(x) => onChange({ shipZip: x })" :style="{ flex: '.6' }" />
    </div>
  </div>
</template>

<script>
import { EG_STATES } from '../../data/wizard.js';
import SelectField from '../common/SelectField.vue';
import TextField from '../common/TextField.vue';

export default {
  name: 'ShipToAddressFields',
  components: { SelectField, TextField },
  props: {
    value: { type: Object, default: undefined },
    onChange: { type: Function, default: undefined },
  },
  data() {
    return { EG_STATES };
  },
  computed: {
    v() { return this.value || {}; },
  },
};
</script>
