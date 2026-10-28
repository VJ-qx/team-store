<!-- Converted from workspace-app.jsx / workspace-app-integrated.jsx: AccessPending — the manual-review
     waiting state after the business verification form. -->
<template>
  <div class="wx-access-pending">
    <div class="wx-access-pending__content">
      <!-- spinner + clock -->
      <div class="wx-access-pending__status">
        <div class="wx-access-pending__track" />
        <div class="wx-access-pending__spinner" />
        <div class="wx-access-pending__icon">
          <IconClock :size="26" />
        </div>
      </div>
      <div class="wx-access-pending__eyebrow">Registration Received</div>
      <h1 class="wx-access-pending__title">Your Organization Is<br />Awaiting Approval</h1>
      <p class="wx-access-pending__lead">Thanks for registering. We're reviewing your organization's business entity, EIN, and banking details — this typically takes <strong class="wx-access-pending__strong">24–48 hours</strong>. You'll land here each time you sign in until it's approved, and we'll email <strong class="wx-access-pending__strong">{{ email || (INT ? "jane@marucci.com" : "jane@prolook.com") }}</strong> the moment a decision is made.</p>
      <div class="wx-access-pending__actions">
        <button @click="onBack" class="wx-access-pending__back" @mouseenter="(e) => { e.currentTarget.style.background = 'rgba(255,255,255,.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.4)'; }" @mouseleave="(e) => { e.currentTarget.style.background = 'rgba(255,255,255,.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.22)'; }">Back to PROLOOK</button>
        <button @click="onApprove" class="wx-access-pending__continue" @mouseenter="(e) => { e.currentTarget.style.background = '#c41d14'; e.currentTarget.style.transform = 'translateY(-1px)'; }" @mouseleave="(e) => { e.currentTarget.style.background = RED; e.currentTarget.style.transform = 'none'; }">Continue to Overview<IconArrowRight :size="16" />
        </button>
      </div>
      <div class="wx-access-pending__note">Prototype only — this button will not exist in production</div>
    </div>
    <component :is="'style'">{{ css }}</component>
  </div>
</template>

<script>
import { INTEGRATION } from '../../integration.js';
import { IconArrowRight, IconClock } from '../icons.js';

export default {
  name: 'AccessPending',
  components: { IconArrowRight, IconClock },
  props: {
    onApprove: { type: Function, default: undefined },
    onBack: { type: Function, default: undefined },
    email: { type: String, default: undefined },
  },
  data() {
    return { RED: "#e1251b", INT: INTEGRATION.on, css: '@keyframes accSpin { to { transform: rotate(360deg) } }' };
  },
};
</script>
