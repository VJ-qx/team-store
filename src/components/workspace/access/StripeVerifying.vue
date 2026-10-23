<!-- Converted from workspace-app.jsx: StripeVerifying — automated approval. Shows the check after
     1.5 s, then calls onDone at 2.4 s. -->
<template>
  <div class="wx-stripe-verify">
    <div class="wx-stripe-verify__content">
      <div class="wx-stripe-verify__status">
        <template v-if="!done">
          <div class="wx-stripe-verify__track" />
          <div class="wx-stripe-verify__spinner" />
        </template>
        <span v-if="done" class="wx-stripe-verify__done">
          <IconCheck :size="38" :style="{ strokeWidth: 3 }" />
        </span>
        <div v-if="!done" class="wx-stripe-verify__icon">
          <IconLock :size="26" />
        </div>
      </div>
      <div class="wx-stripe-verify__eyebrow">{{ done ? "Verified" : "Verifying with Stripe" }}</div>
      <h1 class="wx-stripe-verify__title">{{ done ? "You're All Set" : "Verifying Your Business" }}</h1>
      <p class="wx-stripe-verify__lead">{{ done
        ? "Your business is verified. Opening your Team Stores dashboard…"
        : "We’re confirming your business entity and banking details through Stripe. This only takes a moment — no manual review, no waiting." }}</p>
    </div>
    <component :is="'style'">{{ css }}</component>
  </div>
</template>

<script>
import { IconCheck, IconLock } from '../icons.js';

export default {
  name: 'StripeVerifying',
  components: { IconCheck, IconLock },
  props: {
    onDone: { type: Function, default: undefined },
  },
  data() {
    return {
      done: false,
      css: '@keyframes accSpin { to { transform: rotate(360deg) } } @keyframes accPop { from { transform: scale(.3); opacity: 0 } to { transform: scale(1); opacity: 1 } }',
    };
  },
  mounted() {
    // React: useEffect with [] — both timers start on mount and are cleared on unmount.
    this.t1 = setTimeout(() => { this.done = true; }, 1500);
    this.t2 = setTimeout(() => { this.onDone && this.onDone(); }, 2400);
  },
  beforeUnmount() {
    clearTimeout(this.t1);
    clearTimeout(this.t2);
  },
};
</script>
