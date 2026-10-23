<!-- Converted from workspace-app.jsx: FeatureGate — the splash shown to reps without Team Stores access.
     The workspace always shows it embedded under the Team Stores header. -->
<template>
  <div :class="`wx-gate${embedded ? ' wx-gate--embedded' : ''}`">
    <!-- ── Full-bleed hero photo ───────────────────────────────── -->
    <img src="assets/hero-baseball.jpg" alt="" aria-hidden="true" class="wx-gate__photo" />
    <!-- dark cinematic wash: deep on the left for text legibility, revealing the team on the right -->
    <div aria-hidden="true" class="wx-gate__wash" />
    <!-- bottom + top vignette to anchor pillars and header -->
    <div aria-hidden="true" class="wx-gate__vignette" />
    <!-- warm red edge bloom, BRUTL-style, kept subtle -->
    <div aria-hidden="true" class="wx-gate__bloom" />
    <!-- ── Olympiq-style crosshair frame ───────────────────────── -->
    <Crosshairs :color="RED" />
    <!-- ── Micro-header (standalone only — hidden when embedded under the prolook.com header) ── -->
    <header v-if="!embedded" class="wx-gate__header">
      <div class="wx-gate__brand">
        <img src="assets/prolook-mark.png" alt="PROLOOK" class="wx-gate__logo" />
        <span class="wx-gate__divider" />
        <span class="wx-gate__tag">Team Stores</span>
      </div>
      <button @click="onBack" title="Return to prolook.com" class="wx-gate__back" @mouseenter="(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,.5)'; }" @mouseleave="(e) => { e.currentTarget.style.color = 'rgba(255,255,255,.82)'; e.currentTarget.style.borderBottomColor = 'transparent'; }">
        <span class="wx-gate__back-arrow">←</span> Back to PROLOOK</button>
    </header>
    <!-- ── Hero content (left-anchored) ────────────────────────── -->
    <div class="wx-gate__hero">
      <div class="wx-gate__eyebrow">
        <span class="wx-gate__eyebrow-rule" />Team Apparel Logistics</div>
      <h1 class="wx-gate__title">Take Control of Your Team's <span class="wx-gate__accent">Apparel Logistics</span>
      </h1>
      <p class="wx-gate__lead">Launch custom online shops for leagues, schools, and clubs. Handle roster tracking, required player gear runs, and custom profit margins in one centralized spot.</p>
      <!-- compliance line -->
      <div class="wx-gate__notice">
        <IconLock :size="16" :style="{ color: RED, flexShrink: 0 }" />
        <span class="wx-gate__notice-text">
          <strong class="wx-gate__notice-strong">Verification required.</strong> Business entity, EIN, and banking details are reviewed by a PROLOOK admin — typical turnaround <strong class="wx-gate__notice-strong">24–48 hours</strong>.</span>
      </div>
      <!-- CTA -->
      <div class="wx-gate__actions">
        <button @click="onApply" class="wx-gate__apply" @mouseenter="(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = INK; e.currentTarget.style.transform = 'translateY(-2px)'; }" @mouseleave="(e) => { e.currentTarget.style.background = RED; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'none'; }">
          <IconLock :size="17" />Apply for Access<IconArrowRight :size="17" />
        </button>
        <button @click="onBypass" class="wx-gate__enter" @mouseenter="(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,.6)'; }" @mouseleave="(e) => { e.currentTarget.style.color = 'rgba(255,255,255,.7)'; e.currentTarget.style.borderBottomColor = 'transparent'; }">Already verified? Enter <span class="wx-gate__enter-arrow">→</span>
        </button>
      </div>
    </div>
    <!-- ── Pillar grid (bottom third) ──────────────────────────── -->
    <div class="wx-gate__pillars">
      <div v-for="(p, i) in pillars" :key="p.title" :class="`wx-gate__pillar${i === 0 ? ' wx-gate__pillar--first' : ''}`">
        <span class="wx-gate__pillar-icon">
          <component :is="p.icon" :size="22" />
        </span>
        <div>
          <div class="wx-gate__pillar-title">{{ p.title }}</div>
          <div class="wx-gate__pillar-body">{{ p.body }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { markRaw } from 'vue';
import { IconArrowRight, IconClipboard, IconDollar, IconLayers, IconLock } from '../icons.js';
import Crosshairs from './Crosshairs.vue';

const PILLARS = markRaw([
  {
    icon: IconClipboard,
    title: "Automated Roster Tracking",
    body: "Monitor exactly which players have ordered required uniforms — and who is still incomplete.",
  },
  {
    icon: IconDollar,
    title: "Flexible Profit Margins",
    body: "Easily adjust dealer, coach, and organization payouts inside the configuration tool.",
  },
  {
    icon: IconLayers,
    title: "Batched Window Ordering",
    body: "Open and close ordering campaigns on a timeline aligned with production schedules.",
  },
]);

export default {
  name: 'FeatureGate',
  components: { Crosshairs, IconArrowRight, IconLock },
  props: {
    onApply: { type: Function, default: undefined },
    onBypass: { type: Function, default: undefined },
    onBack: { type: Function, default: undefined },
    embedded: { type: Boolean, default: undefined },
  },
  data() {
    return { RED: "#e1251b", INK: "#0e0e10", pillars: PILLARS };
  },
};
</script>
