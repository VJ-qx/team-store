<!-- Converted from workspace-app.jsx: WelcomeSSOModal — the welcome pop-up after sign-in (native sign-in:
     connect the brands found for the email; customizer sign-in: the primary brand, or a choice of
     brands for multi-brand accounts). The prototype's brandGlyph() helper is expanded in place.
     The ✕, Escape and a click outside the pop-up do what its button does.
     The integrated workspace defines this component but never shows it. -->
<template>
  <Modal :open="open" :onClose="() => onConfirm(native ? (anyConnected ? originId : null) : primary)" :width="isMulti ? 640 : 520">
    <div class="wx-welcome">
      <button aria-label="Close" @click="() => onConfirm(native ? (anyConnected ? originId : null) : primary)" class="wx-welcome__close" @mouseenter="(e) => { e.currentTarget.style.background = '#f4f4f5'; e.currentTarget.style.color = '#09090b'; }" @mouseleave="(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#71717a'; }">
        <IconX :size="18" />
      </button>
      <div v-if="!native" class="wx-welcome__badge-row">
        <span class="wx-welcome__badge">
          <IconCircleCheck :size="15" /> Signed in automatically</span>
      </div>
      <h2 class="wx-welcome__title">Welcome to Team Stores</h2>
      <p class="wx-welcome__lead"><template v-if="native">Your account is ready. Connect the brand Customizers you're entitled to so you can add their products to your stores.</template><template v-else>We've automatically signed you in using your <strong class="wx-welcome__strong">{{ origin.name }}</strong> Customizer account and set it as your primary brand for this workspace session.</template></p>
      <div v-if="native" class="wx-welcome__native">
        <div class="wx-welcome__native-label">Brands found for {{ email }}</div>
        <div class="wx-welcome__native-list">
          <div v-for="b in brands" :key="b.id" class="wx-welcome__native-brand">
            <span class="wx-welcome__native-logo">
              <img v-if="b.logoBlack || b.logoInk" :src="b.logoBlack || b.logoInk" :alt="b.name" class="wx-welcome__logo" :style="{ height: px(18) }" />
              <span v-else class="wx-welcome__wordmark" :style="{ fontSize: px(Math.round(18 * 0.62)) }">{{ b.wordmark || b.name }}</span>
            </span>
            <span class="wx-welcome__native-text">
              <span class="wx-welcome__native-name">{{ b.name }}</span>
              <span class="wx-welcome__native-detail">{{ !!connected[b.id] ? `Connected · reuses your ${b.name} Customizer account` : "Customizer account found for your email" }}</span>
            </span>
            <span v-if="!!connected[b.id]" class="wx-welcome__connected">
              <IconCheck :size="14" /> Connected</span>
            <button v-else @click="() => setConnected((c) => ({ ...c, [b.id]: true }))" class="wx-welcome__connect" @mouseenter="(e) => { e.currentTarget.style.background = '#09090b'; e.currentTarget.style.color = '#fff'; }" @mouseleave="(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#09090b'; }">Connect</button>
          </div>
        </div>
        <p class="wx-welcome__native-note">{{ anyConnected ? "Set your primary brand anytime from My Account." : "No primary brand is set until you connect one. You can connect brands later from My Account." }}</p>
      </div>
      <div v-else-if="isMulti" class="wx-welcome__multi">
        <div class="wx-welcome__multi-label">Primary Brand Selection</div>
        <div class="wx-welcome__grid">
          <!-- The tile's background and border stay inline: they depend on the selection, and the hover
               handlers write the same properties (v-patch-style writes only changed values, as React does). -->
          <button v-for="b in brands" :key="b.id" @click="() => { if (!isLocked(b.id)) setPrimary(b.id); }" :title="isLocked(b.id) ? null : b.name" :aria-disabled="isLocked(b.id) ? 'true' : null" :class="`wx-welcome__tile${isLocked(b.id) ? ' wx-welcome__tile--locked' : ''}`" v-patch-style="{ background: primary === b.id ? '#fff' : (isLocked(b.id) ? '#fafafa' : '#f4f4f5'), border: `2px solid ${primary === b.id ? '#09090b' : '#f4f4f5'}` }" @mouseenter="(e) => { if (primary !== b.id && !isLocked(b.id)) { e.currentTarget.style.borderColor = '#d4d4d8'; e.currentTarget.style.background = '#fff'; } }" @mouseleave="(e) => { if (primary !== b.id && !isLocked(b.id)) { e.currentTarget.style.borderColor = '#f4f4f5'; e.currentTarget.style.background = '#f4f4f5'; } }">
            <span v-if="primary === b.id" class="wx-welcome__tile-check">
              <IconCheck :size="13" />
            </span>
            <span class="wx-welcome__logo-box">
              <img v-if="b.logoBlack || b.logoInk" :src="b.logoBlack || b.logoInk" :alt="b.name" class="wx-welcome__logo" :style="{ height: px(22) }" />
              <span v-else class="wx-welcome__wordmark" :style="{ fontSize: px(Math.round(22 * 0.62)) }">{{ b.wordmark || b.name }}</span>
            </span>
            <span class="wx-welcome__tile-name">{{ b.name }}</span>
            <!-- Approved change, not in the prototype yet: locked cards in the welcome pop-up's grid (docs/README.md#approved-changes).
                 A brand that can't be primary: greyed, with a lock; it can't be picked, and hovering shows why. The design's
                 "Access pending" / "Request access" tag was removed at a team request, so every locked brand looks the same. -->
            <template v-if="isLocked(b.id)">
              <span class="wx-welcome__tile-lock"><IconLock :size="12" /></span>
              <span class="wx-welcome__tile-tip">Connect this brand to set it as your primary.<span class="wx-welcome__tile-tip-arrow" /></span>
            </template>
          </button>
        </div>
        <p class="wx-welcome__multi-note">You can change your primary brand anytime from My Account.</p>
      </div>
      <div v-else class="wx-welcome__single">
        <div class="wx-welcome__single-label">Your Primary Brand</div>
        <div class="wx-welcome__primary">
          <span class="wx-welcome__logo-box">
            <img v-if="origin.logoBlack || origin.logoInk" :src="origin.logoBlack || origin.logoInk" :alt="origin.name" class="wx-welcome__logo" :style="{ height: px(24) }" />
            <span v-else class="wx-welcome__wordmark" :style="{ fontSize: px(Math.round(24 * 0.62)) }">{{ origin.wordmark || origin.name }}</span>
          </span>
          <span class="wx-welcome__divider" />
          <span class="wx-welcome__primary-name">{{ origin.name }}</span>
          <span class="wx-welcome__primary-tag">
            <IconCircleCheck :size="15" /> Primary</span>
        </div>
        <!-- Approved change, not in the prototype yet: helper line and Confirm & Enter for a one-brand rep (docs/README.md#approved-changes). -->
        <p class="wx-welcome__single-note">You can change your primary brand anytime from My Account.</p>
      </div>
      <!-- Approved change, not in the prototype yet: helper line and Confirm & Enter for a one-brand rep (docs/README.md#approved-changes).
           A Customizer rep sees "Confirm & Enter" with one brand too; a Team Stores account keeps "Continue to Workspace". -->
      <div class="wx-welcome__footer">
        <button @click="() => onConfirm(native ? (anyConnected ? originId : null) : primary)" class="wx-welcome__confirm" @mouseenter="(e) => e.currentTarget.style.background = '#dc2626'" @mouseleave="(e) => e.currentTarget.style.background = '#09090b'">{{ isMulti || !native ? "Confirm & Enter" : "Continue to Workspace" }} <IconArrowRight :size="17" />
        </button>
      </div>
    </div>
  </Modal>
</template>

<script>
import { INTEGRATION } from '../../integration.js';
import { ACCOUNT_PROFILE } from '../../data/account.js';
import { ACCESSIBLE_CUSTOMIZERS, CUSTOMIZER_BRANDS, LOCKED_BRANDS, MULTI_BRAND_SAMPLE } from '../../data/brands.js';
import { px } from '../../lib/style.js';
import Modal from '../common/Modal.vue';
import { IconArrowRight, IconCheck, IconCircleCheck, IconLock, IconX } from '../icons.js';

export default {
  name: 'WelcomeSSOModal',
  components: { IconArrowRight, IconCheck, IconCircleCheck, IconLock, IconX, Modal },
  props: {
    open: { type: Boolean, default: undefined },
    originId: { type: String, default: INTEGRATION.on ? "victus" : "prolook" },
    accessibleIds: { type: Array, default: () => ACCESSIBLE_CUSTOMIZERS },
    multiBrand: { type: Boolean, default: true },
    native: { type: Boolean, default: false },
    email: { type: String, default: ACCOUNT_PROFILE.email },
    onConfirm: { type: Function, default: undefined },
  },
  data() {
    return { primary: this.originId, connected: {} };
  },
  computed: {
    origin() {
      return CUSTOMIZER_BRANDS[this.originId] || CUSTOMIZER_BRANDS.prolook;
    },
    brands() {
      // Approved change, not in the prototype yet: locked cards in the welcome pop-up's grid (docs/README.md#approved-changes).
      // A several-brand rep gets the design's sample brands (MULTI_BRAND_SAMPLE) instead of the prototype's one accessible brand.
      return (this.multiBrand && !this.native ? MULTI_BRAND_SAMPLE : [this.originId]).map((id) => ({ id, ...CUSTOMIZER_BRANDS[id] })).filter((b) => b.name);
    },
    isMulti() {
      return !this.native && this.multiBrand && this.brands.length > 1;
    },
    anyConnected() {
      return Object.keys(this.connected).length > 0;
    },
  },
  watch: {
    // React: useEffect on [open, originId] (it also runs once after mount: see mounted).
    open() { this.reset(); },
    originId() { this.reset(); },
  },
  mounted() {
    this.reset();
  },
  methods: {
    // Approved change, not in the prototype yet: locked cards in the welcome pop-up's grid (docs/README.md#approved-changes).
    // Whether the brand can't be set as primary.
    isLocked(id) { return LOCKED_BRANDS.includes(id); },
    px,
    reset() {
      if (this.open) { this.setPrimary(this.originId); this.setConnected({}); }
    },
    setPrimary(v) {
      this.primary = v;
    },
    setConnected(v) {
      this.connected = typeof v === "function" ? v(this.connected) : v;
    },
  },
};
</script>
