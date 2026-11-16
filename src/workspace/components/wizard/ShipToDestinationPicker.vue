<!-- Converted from workspace-app.jsx: ShipToDestinationPicker — where a coach-shipped store's bulk order
     goes: a saved pick-up location (a reference, not a copy of its address) or a manual address. With no
     saved locations it shows the address fields and a tip. The prototype's seg() helper is expanded in
     place. -->
<template>
  <div v-if="!locs.length">
    <ShipToAddressFields :value="v" :onChange="onChange" />
    <div class="wx-ship-to__tip">
      <IconInfo :size="15" :style="{ flexShrink: 0, marginTop: '1px' }" />
      <span>Ship somewhere often? Save a destination once in Workspace Settings → Pick-up Locations and reuse it across stores.</span>
    </div>
  </div>
  <div v-else>
    <div class="wx-ship-to__segs"><button key="saved" type="button" @click="() => onSeg('saved')" :class="`wx-ship-to__seg${(mode === 'saved') ? ' wx-ship-to__seg--on' : ''}`">Saved pick-up location</button><button key="manual" type="button" @click="() => onSeg('manual')" :class="`wx-ship-to__seg${(mode === 'manual') ? ' wx-ship-to__seg--on' : ''}`">Enter address manually</button></div>
    <div v-if="mode === 'saved'" class="wx-ship-to__locations">
      <button v-for="l in locs" :key="l.id" type="button" @click="() => onChange({ shipLocationId: l.id, ...SHIP_MANUAL_CLEAR })" class="wx-ship-to__location" :style="{ border: v.shipLocationId === l.id ? '2px solid ' + accent : '1px solid #e4e4e7', boxShadow: v.shipLocationId === l.id ? '0 0 0 3px ' + accent + '22' : 'none' }">
        <span class="wx-ship-to__location-dot" :style="{ border: v.shipLocationId === l.id ? '6px solid ' + accent : '2px solid #c9c9cf' }" />
        <span class="wx-ship-to__location-text">
          <span class="wx-ship-to__location-name">{{ l.name }}</span>
          <span class="wx-ship-to__location-address">{{ l.addr1 }}, {{ l.city }}, {{ l.state }} {{ l.zip }}</span>
        </span>
      </button>
      <div v-if="!v.shipLocationId" class="wx-ship-to__hint">Select a location, or switch to manual entry.</div>
    </div>
    <ShipToAddressFields v-else :value="v" :onChange="(p) => onChange({ shipLocationId: null, ...p })" />
  </div>
</template>

<script>
import { wsPickupLocations } from '../../lib/wizard.js';
import { IconInfo } from '../icons.js';
import ShipToAddressFields from './ShipToAddressFields.vue';

const SHIP_MANUAL_CLEAR = { shipStreet: "", shipApt: "", shipCity: "", shipState: "", shipZip: "" };

export default {
  name: 'ShipToDestinationPicker',
  components: { IconInfo, ShipToAddressFields },
  props: {
    value: { type: Object, default: undefined },
    onChange: { type: Function, default: undefined },
    accent: { type: String, default: "#e1251b" },
  },
  data() {
    const v = this.value || {};
    return { mode: v.shipLocationId ? "saved" : "manual", SHIP_MANUAL_CLEAR };
  },
  computed: {
    v() { return this.value || {}; },
    locs() { return wsPickupLocations(); },
  },
  watch: {
    // React: useEffect on [v.shipLocationId].
    'v.shipLocationId'() { if (this.v.shipLocationId) this.setModeState("saved"); },
  },
  methods: {
    setModeState(v) { this.mode = v; },
    onSeg(k) { this.setModeState(k); if (k === "manual" && this.v.shipLocationId) this.onChange({ shipLocationId: null }); },
  },
};
</script>
