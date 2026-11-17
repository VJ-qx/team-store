<!-- Converted from workspace-app.jsx: UatReviewExtras — on Review & Deploy for a store started from another
     store (_dupSource): the Connected Team copied from the source (full duplicates) and what must be done
     before the store can deploy. Renders nothing otherwise; the wizard drops _dupSource (a prototype bug kept
     in part 2a), so it can't be reached yet. The prototype's fragment is a multi-root template. -->
<template>
  <template v-if="prov">
    <WizardPanel v-if="prov.mode === 'full'" label="Connected Team" hint="Copied from the source — change it if this store is for a different team" :style="{ marginBottom: '16px' }">
      <div class="wx-review-extras__team">
        <img v-if="data.teamLogo && data.teamLogo.url" :src="data.teamLogo.url" alt="" class="wx-review-extras__team-logo" />
        <span v-else class="wx-review-extras__team-mono" :style="{ background: logoColor }">{{ (data.teamLogo && data.teamLogo.mono) || String(team).slice(0, 2).toUpperCase() }}</span>
        <div class="wx-review-extras__team-text">
          <div class="wx-review-extras__team-name">{{ team }}</div>
          <div class="wx-review-extras__team-note">Same team as {{ prov.sourceName }}{{ prov.mine ? "" : " (" + prov.owner + "’s store)" }} · owned by you{{ prov.viewer ? " — " + prov.viewer : "" }}</div>
        </div>
        <Button variant="secondary" :onClick="onEditBasics">Change team</Button>
      </div>
    </WizardPanel>
    <WizardPanel label="Before this store can deploy" :hint="reqs.length + (reqs.length === 1 ? ' requirement' : ' requirements')" :style="{ marginBottom: '16px' }">
      <div class="wx-review-extras__reqs">
        <div v-for="(r, i) in reqs" :key="r.k" :class="`wx-review-extras__req${i ? ' wx-review-extras__req--divided' : ''}`">
          <span class="wx-review-extras__req-dot" />
          <div class="wx-review-extras__req-text">
            <div class="wx-review-extras__req-title">{{ r.k }}</div>
            <div class="wx-review-extras__req-desc">{{ r.d }}</div>
          </div>
          <button v-if="r.fix" type="button" @click="onEditBasics" class="wx-review-extras__req-fix">Edit in Basics</button>
        </div>
        <div v-if="prov.mode === 'full'" class="wx-review-extras__rosters">
          <span class="wx-review-extras__rosters-dot" />
          <div class="wx-review-extras__req-text">
            <div class="wx-review-extras__req-title">Rosters are empty</div>
            <div class="wx-review-extras__req-desc">Players never copy. Rosters are optional — the store can deploy without them, and you can add players from My Team(s) anytime.</div>
          </div>
        </div>
      </div>
    </WizardPanel>
  </template>
</template>

<script>
import { WIZARD_TEAMS } from '../../data/wizard.js';
import Button from '../common/Button.vue';
import WizardPanel from './WizardPanel.vue';

export default {
  name: 'UatReviewExtras',
  components: { Button, WizardPanel },
  props: {
    data: { type: Object, default: undefined },
    onEditBasics: { type: Function, default: undefined },
  },
  computed: {
    prov() { return this.data._dupSource; },
    reqs() {
      const { data } = this;
      const reqs = [];
      if (data.distributionFormat !== "locker" && !(data.storeOpenStart && data.storeOpenEnd)) reqs.push({ k: "Set the ordering window", d: "The source store’s dates weren’t copied — last season’s close date doesn’t belong on this store.", fix: true });
      reqs.push({ k: "Confirm the web address", d: "prolookstores.com/" + (data.storeSlug || "—") + " was generated from the new name.", fix: true });
      if (!data.email) reqs.push({ k: "Add a point of contact", d: "No manager contact was copied, so the store has no email or phone yet.", fix: true });
      return reqs;
    },
    team() { const { data } = this; return (WIZARD_TEAMS.find((t) => t.value === data.connectedTeam) || {}).label || data.teamName || "—"; },
    logoColor() { const { data } = this; return (data.teamLogo && data.teamLogo.color) || (data.teamColors && data.teamColors[0]) || "#1d3a8a"; },
  },
};
</script>
