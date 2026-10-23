<!-- Converted from workspace-app.jsx / workspace-app-integrated.jsx: AccountProfile — My Account: personal
     info, sign-in methods, connected customizers and archived stores, with the add-a-customizer,
     password and brand sign-in modals. The integrated workspace links Victus instead of Prolook. -->
<template>
  <div class="wx-account">
    <div class="wx-account__inner">
      <!-- Page header -->
      <div class="wx-account__header">
        <div>
          <h1 class="wx-account__title">My Account</h1>
          <p class="wx-account__lead">{{ isCustomizerOnly ? "Your profile is synced from the Product Customizer account you signed in with. Review your details below." : "Your Team Stores account. Manage your details, sign-in methods and brand connections here." }}</p>
        </div>
        <button v-if="isCustomizerOnly" @click="onEditProfile" class="wx-account__edit-profile" @mouseenter="(e) => { e.currentTarget.style.borderColor = '#0e0e10'; }" @mouseleave="(e) => { e.currentTarget.style.borderColor = '#d4d4d8'; }">
          <IconEdit :size="16" /> Edit Profile <IconExternal :size="15" :style="{ color: '#9a9aa1' }" />
        </button>
      </div>
      <!-- Identity strip -->
      <div class="wx-account__identity">
        <div class="wx-account__avatar">{{ (info.firstName[0] || '') + (info.lastName[0] || '') }}</div>
        <div class="wx-account__identity-text">
          <div class="wx-account__name">{{ info.firstName }} {{ info.lastName }}</div>
          <div class="wx-account__email">
            <IconMail :size="15" /> {{ info.email }}</div>
        </div>
      </div>
      <div class="wx-account__cards">
        <!-- ─── Card A — Personal Info & Sign-in (source depends on sign-in method) ─── -->
        <SettingsCard :style="{ padding: '32px 36px' }">
          <div class="wx-account__info-header">
            <h2 class="wx-account__card-title">Personal Info</h2>
            <span v-if="isCustomizerOnly" class="wx-account__read-only">
              <IconLock :size="13" /> Read-only</span>
            <div v-else-if="editingInfo" class="wx-account__edit-actions">
              <button @click="() => { setDraft(info); setEditingInfo(false); }" class="wx-account__cancel">Cancel</button>
              <button @click="saveInfo" class="wx-account__save">Save changes</button>
            </div>
            <button v-else @click="() => { setDraft(info); setEditingInfo(true); }" class="wx-account__edit" @mouseenter="(e) => { e.currentTarget.style.borderColor = '#0e0e10'; }" @mouseleave="(e) => { e.currentTarget.style.borderColor = '#d4d4d8'; }">
              <IconEdit :size="15" /> Edit</button>
          </div>
          <p class="wx-account__info-lead"><template v-if="isCustomizerOnly">Pulled directly from your primary brand, <strong class="wx-account__strong">{{ primaryBrand.name }}</strong>. To edit these details, update them in your {{ primaryBrand.name }} Customizer account or change your primary brand below.</template><template v-else>Stored on your <strong class="wx-account__strong">Team Stores account</strong> and editable here. Your dealership and brand entitlements still come from your dealership records.</template></p>
          <div class="wx-account__fields">
            <ProfileReadField label="First Name" :value="shown.firstName" required :editable="editingInfo" :onChange="setD('firstName')" />
            <ProfileReadField label="Last Name" :value="shown.lastName" required :editable="editingInfo" :onChange="setD('lastName')" />
            <ProfileReadField label="Email Address" :value="shown.email" required />
            <ProfileReadField v-if="editingInfo" label="Phone Number" :value="shown.phone" required editable :onChange="setD('phone')" />
            <ProfileReadField v-else label="Phone Number" required>
              <div :class="`wx-account__phone${isCustomizerOnly ? ' wx-account__phone--locked' : ''}`">
                <div class="wx-account__phone-country">
                  <span class="wx-account__phone-flag">{{ profile.countryFlag }}</span>
                  <span class="wx-account__phone-code">{{ profile.countryCode }}</span>
                  <IconChevron :size="16" :style="{ color: '#a1a1aa' }" />
                </div>
                <div class="wx-account__phone-number">{{ shown.phone }}</div>
              </div>
            </ProfileReadField>
            <ProfileReadField label="Country" :value="shown.country" required dropdown :editable="editingInfo" :onChange="setD('country')" />
            <ProfileReadField label="State" :value="shown.state" required dropdown :editable="editingInfo" :onChange="setD('state')" />
            <ProfileReadField label="City" :value="shown.city" required dropdown :editable="editingInfo" :onChange="setD('city')" />
            <ProfileReadField label="Zip Code" :value="shown.zip" required mono :editable="editingInfo" :onChange="setD('zip')" />
          </div>
          <!-- Sign-in methods & security — both methods resolve to this one Team Stores user record -->
          <div class="wx-account__security">
            <div class="wx-account__security-label">Sign-in &amp; Security</div>
            <div class="wx-account__methods">
              <!-- Team Stores account -->
              <div class="wx-account__method">
                <span class="wx-account__method-badge">TS</span>
                <div class="wx-account__method-text">
                  <div class="wx-account__method-name">Team Stores account</div>
                  <div class="wx-account__method-detail"><template v-if="nativeSetUp">{{ info.email }} · Email &amp; password</template><template v-else>Not set up — add a password to sign in without a Customizer</template></div>
                </div>
                <button @click="() => openPw(nativeSetUp ? 'change' : 'create')" class="wx-account__outline-button" @mouseenter="(e) => { e.currentTarget.style.background = '#0e0e10'; e.currentTarget.style.color = '#fff'; }" @mouseleave="(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#0e0e10'; }">
                  <IconLock :size="15" /> {{ nativeSetUp ? "Change password" : "Create password" }}</button>
              </div>
              <!-- Customizer identity -->
              <div class="wx-account__method">
                <BrandTile :id="custBrand.id" :name="custBrand.name" :size="44" />
                <div class="wx-account__method-text">
                  <div class="wx-account__method-name">{{ custBrand.name }} Customizer</div>
                  <div class="wx-account__method-detail"><template v-if="custLinked">{{ info.email }} · Linked automatically — matching email</template><template v-else>Not linked — link it to sign in either way and reuse your Customizer profile</template></div>
                </div>
                <span v-if="custLinked" class="wx-account__ok-pill">
                  <IconCheck :size="16" /> Linked</span>
                <button v-else @click="() => openLogin({ id: custBrand.id, name: custBrand.name, desc: 'Primary customizer & catalog' }, false, true)" class="wx-account__outline-button" @mouseenter="(e) => { e.currentTarget.style.background = '#0e0e10'; e.currentTarget.style.color = '#fff'; }" @mouseleave="(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#0e0e10'; }">Link account</button>
              </div>
            </div>
            <div class="wx-account__security-note">
              <span class="wx-account__security-note-icon">
                <IconLock :size="15" />
              </span>
              <div class="wx-account__note-text"><template v-if="isCustomizerOnly">Your password is managed in the <button @click="onEditProfile" class="wx-account__inline-link">{{ custBrand.name }} Customizer</button>. Create a Team Stores password to sign in without one.</template><template v-else>Your Team Stores password applies only to Team Stores sign-in — it never changes your Customizer password. Stores, orders, access status and brand connections are shared across both sign-in methods.</template></div>
            </div>
          </div>
        </SettingsCard>
        <!-- ─── Card B — Brand Access & Authentication (editable) ─── -->
        <SettingsCard :style="{ padding: '32px 36px' }">
          <div class="wx-account__brands-header">
            <div class="wx-account__card-heading">
              <h2 class="wx-account__card-title">Connected Customizers</h2>
              <p class="wx-account__card-lead">The corporate entity you're attached to and the brands you're authorized to sell.</p>
            </div>
            <button @click="openAdd" class="wx-account__add" @mouseenter="(e) => { e.currentTarget.style.borderColor = '#0e0e10'; }" @mouseleave="(e) => { e.currentTarget.style.borderColor = '#d4d4d8'; }">
              <IconPlus :size="16" /> Add Customizer</button>
          </div>
          <!-- Dealership callout -->
          <div class="wx-account__dealer">
            <span class="wx-account__dealer-icon">
              <IconShield :size="22" />
            </span>
            <div class="wx-account__dealer-text">
              <div class="wx-account__dealer-label">Dealership</div>
              <div class="wx-account__dealer-name">{{ profile.dealership }}</div>
            </div>
            <span class="wx-account__verified">
              <IconCircleCheck :size="15" /> Verified</span>
          </div>
          <!-- Brand list -->
          <div class="wx-account__brands-label">Authorized Brands</div>
          <div class="wx-account__brands">
            <div v-for="b in accountBrands" :key="b.id" :class="`wx-account__brand${primaryId === b.id ? ' wx-account__brand--primary' : ''}`">
              <!-- Primary-brand star -->
              <div class="wx-account__star" @mouseenter="() => setHoverStar(b.id)" @mouseleave="() => setHoverStar(null)">
                <button @click="() => b.connected && setPrimaryId(b.id)" :aria-label="primaryId === b.id ? 'Primary brand' : 'Set as primary brand'" :class="`wx-account__star-button${b.connected ? '' : ' wx-account__star-button--disabled'}`">
                  <svg width="22" height="22" viewBox="0 0 24 24" :fill="primaryId === b.id ? '#f5b301' : 'none'" :stroke="primaryId === b.id ? '#f5b301' : '#a1a1aa'" stroke-width="1.8" stroke-linejoin="round">
                    <path d="M12 2.5l2.9 6.1 6.6.6-5 4.4 1.5 6.5L12 17.2 5.5 20.6l1.5-6.5-5-4.4 6.6-.6L12 2.5z" />
                  </svg>
                </button>
                <div v-if="hoverStar === b.id" class="wx-account__tooltip">{{ !b.connected
                  ? "Connect this brand to set it as your primary."
                  : primaryId === b.id
                    ? "Your primary brand. Your profile details are pulled from here."
                    : "Make this your primary brand — the account your profile details are pulled from." }}<span class="wx-account__tooltip-arrow" />
                </div>
              </div>
              <BrandTile :id="b.id" :name="b.name" :size="48" />
              <div class="wx-account__brand-text">
                <div class="wx-account__brand-name">{{ b.name }}<span v-if="primaryId === b.id" class="wx-account__primary-tag">Primary</span>
                </div>
                <div class="wx-account__brand-desc">{{ b.desc }}{{ b.connected && b.sso ? " · Single sign-on" : "" }}{{ b.connected && !b.sso && b.authEmail ? ` · Signed in as ${b.authEmail}` : "" }}</div>
              </div>
              <span v-if="b.connected" class="wx-account__ok-pill">
                <IconCheck :size="16" /> Connected</span>
              <button v-else @click="() => openLogin(b)" class="wx-account__outline-button" @mouseenter="(e) => { e.currentTarget.style.background = '#0e0e10'; e.currentTarget.style.color = '#fff'; }" @mouseleave="(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#0e0e10'; }">
                <IconLock :size="15" /> Log In to Brand</button>
            </div>
          </div>
        </SettingsCard>
        <!-- ─── Card C — Archived Stores (restore) ─── -->
        <SettingsCard :style="{ padding: '32px 36px' }">
          <div class="wx-account__archive-header">
            <div class="wx-account__card-heading">
              <h2 class="wx-account__card-title">Archived Stores</h2>
              <p class="wx-account__archive-lead">Permanently shut-down stores, kept as read-only records. Order history and reports are retained. Restore a store to move it back into your active stores list.</p>
            </div>
            <span v-if="archivedStores.length > 0" class="wx-account__archive-count">{{ archivedStores.length }} archived</span>
          </div>
          <div class="wx-account__archive-note">
            <span class="wx-account__archive-note-icon">
              <IconLock :size="15" />
            </span>
            <div class="wx-account__note-text">Archiving can’t be self-reversed. Restoring an archived store is a <strong class="wx-account__strong">managing rep</strong> action.</div>
          </div>
          <div v-if="archivedStores.length === 0" class="wx-account__empty">
            <div class="wx-account__empty-icon">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect x="3" y="4" width="18" height="4" rx="1" />
                <path d="M5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8" />
                <path d="M10 12h4" />
              </svg>
            </div>
            <div class="wx-account__empty-title">No archived stores</div>
            <div class="wx-account__empty-text">Stores you archive from the Stores tab will appear here.</div>
          </div>
          <div v-else class="wx-account__archive-grid">
            <StoreCard v-for="s in archivedStores" :key="s.id" :store="s" archived :onManage="() => onManageStore && onManageStore(s.id)" :onView="() => onManageStore && onManageStore(s.id)" :onUnarchive="() => onUnarchive && onUnarchive(s.id)" :onCreateTemplate="onCreateTemplate" />
          </div>
        </SettingsCard>
      </div>
    </div>
    <!-- Add a brand — picker (brands the account couldn't link automatically) -->
    <Modal :open="addOpen" :onClose="() => setAddOpen(false)" :width="520">
      <div class="wx-account__picker">
        <button type="button" @click="() => setAddOpen(false)" class="wx-account__modal-close" title="Close">
          <IconX :size="18" />
        </button>
        <div class="wx-account__modal-title">Add a customizer</div>
        <div class="wx-account__picker-lead">Brands linked to <strong class="wx-account__strong">{{ profile.email }}</strong> connect automatically. If your customizer account for a brand uses a different email, add it here and sign in once.</div>
        <div class="wx-account__search">
          <IconSearch :size="16" :style="{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9a9aa1' }" />
          <input :value="addQuery" v-controlled="addQuery" @input="(e) => setAddQuery(e.target.value)" v-autofocus placeholder="Search brands" class="wx-account__search-input" @focus="(e) => e.target.style.borderColor = '#0e0e10'" @blur="(e) => e.target.style.borderColor = '#d4d4d8'" />
        </div>
        <div class="wx-account__options">
          <div v-if="addableBrands.length === 0" class="wx-account__no-options">{{ addQuery.trim() ? `No brands match “${addQuery.trim()}”.` : "Every available brand is already on your account." }}</div>
          <div v-for="b in addableBrands" :key="b.id" :class="`wx-account__option${stOf(b) === 'no-account' ? ' wx-account__option--no-account' : ''}${stOf(b) === 'connect' ? ' wx-account__option--connect' : ''}`">
            <BrandTile :id="b.id" :name="b.name" :size="42" />
            <div class="wx-account__option-text">
              <div class="wx-account__option-name">{{ b.name }}</div>
              <div class="wx-account__option-desc">{{ stOf(b) === "no-account" ? "You don't have an account for this Customizer yet. Accounts are added by Prolook." : stOf(b) === "pending" ? "Access request sent to Prolook — we'll let you know when it's ready." : b.desc }}</div>
            </div>
            <button v-if="stOf(b) === 'connect'" @click="() => openLogin(b, true)" class="wx-account__option-connect" @mouseenter="(e) => { e.currentTarget.style.background = '#0e0e10'; e.currentTarget.style.color = '#fff'; }" @mouseleave="(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#0e0e10'; }">Connect</button>
            <span v-if="stOf(b) === 'pending'" class="wx-account__pending-pill">
              <IconClock :size="13" /> Access pending</span>
            <div v-if="stOf(b) === 'no-account'" class="wx-account__option-actions">
              <button @click="() => requestAccess(b)" class="wx-account__request">Request access to this brand</button>
              <button @click="() => openLogin(b, true)" class="wx-account__other-email">Sign in with a different email</button>
            </div>
          </div>
        </div>
        <div class="wx-account__picker-help">Don’t see your brand? Ask your managing rep to request access for <strong class="wx-account__help-strong">{{ profile.dealership }}</strong>.</div>
      </div>
    </Modal>
    <!-- Team Stores password — change (native/linked) or create (Customizer-only rep) -->
    <Modal :open="pwOpen" :onClose="() => { if (!pwSaving) setPwOpen(false); }" :width="440">
      <form @submit="submitPw" class="wx-account__modal-body">
        <button type="button" @click="() => { if (!pwSaving) setPwOpen(false); }" class="wx-account__modal-close" title="Close">
          <IconX :size="18" />
        </button>
        <div class="wx-account__modal-title">{{ pwMode === "create" ? "Create a Team Stores password" : "Change your Team Stores password" }}</div>
        <div class="wx-account__password-lead">{{ pwMode === "create" ? "Lets you sign in with your email and a password, without a Customizer. " : "Used only for Team Stores sign-in. " }}{{ custLinked ? `It never changes your ${custBrand.name} Customizer password.` : "" }}</div>
        <div class="wx-account__password-fields">
          <div v-if="pwMode === 'change'" class="wx-account__field">
            <label class="wx-account__label">Current password</label>
            <input type="password" v-autofocus :value="pw.current" v-controlled="pw.current" :disabled="pwSaving" @input="(e) => setPw((c) => ({ ...c, current: e.target.value }))" placeholder="••••••••••••" class="wx-account__input" @focus="(e) => e.target.style.borderColor = '#0e0e10'" @blur="(e) => e.target.style.borderColor = '#d4d4d8'" />
          </div>
          <div class="wx-account__field">
            <div class="wx-account__label-row">
              <label class="wx-account__label">New password</label>
              <button type="button" @click="() => setPw((c) => ({ ...c, show: !c.show }))" class="wx-account__show-toggle">{{ pw.show ? "Hide" : "Show" }}</button>
            </div>
            <input :type="pw.show ? 'text' : 'password'" v-autofocus="pwMode === 'create'" :value="pw.next" v-controlled="pw.next" :disabled="pwSaving" @input="(e) => setPw((c) => ({ ...c, next: e.target.value }))" placeholder="At least 12 characters" class="wx-account__input" @focus="(e) => e.target.style.borderColor = '#0e0e10'" @blur="(e) => e.target.style.borderColor = '#d4d4d8'" />
            <PasswordChecklist :rules="pwRules" />
            <div v-if="pwMode === 'change' && pw.current && pw.next && pw.current === pw.next" class="wx-account__error">New password must differ from your current password.</div>
          </div>
        </div>
        <button type="submit" :disabled="!pwReady || pwSaving" :class="`wx-account__password-submit${(!pwReady || pwSaving) ? ' wx-account__password-submit--disabled' : ''}`">{{ pwSaving ? "Saving…" : (pwMode === "create" ? "Create password" : "Update password") }}</button>
        <div v-if="pwMode === 'change'" class="wx-account__password-note">Your other Team Stores sessions will be signed out and a confirmation email sent to {{ info.email }}.</div>
      </form>
    </Modal>
    <!-- Brand sign-in modal -->
    <Modal :open="!!loginBrand" :onClose="closeLogin" :width="440">
      <form v-if="loginBrand" @submit="submitLogin" class="wx-account__modal-body">
        <button v-if="loginBrand.fromAdd" type="button" @click="backToAdd" class="wx-account__back">
          <IconChevron :size="14" :style="{ transform: 'rotate(90deg)' }" /> Back</button>
        <button type="button" @click="closeLogin" class="wx-account__modal-close" title="Close">
          <IconX :size="18" />
        </button>
        <!-- Brand logo + name -->
        <div class="wx-account__login-brand">
          <BrandTile :id="loginBrand.id" :name="loginBrand.name" :size="60" />
          <div>
            <div class="wx-account__modal-title">{{ loginBrand.link ? `Link your ${loginBrand.name} Customizer` : `Sign in to ${loginBrand.name}` }}</div>
            <div class="wx-account__login-lead">{{ loginBrand.link
              ? `Sign in with your ${loginBrand.name} Customizer credentials to link it to this Team Stores account. Stores, orders and access stay shared.`
              : loginBrand.fromAdd
                ? `Sign in with the email you use for ${loginBrand.name} — it can differ from ${profile.email}.`
                : `Enter your ${loginBrand.name} credentials to authorize selling across this brand.` }}</div>
          </div>
        </div>
        <div class="wx-account__login-fields">
          <div class="wx-account__field">
            <label class="wx-account__label">Email</label>
            <input type="email" v-autofocus :value="creds.email" v-controlled="creds.email" :disabled="signingIn" @input="(e) => setCreds((c) => ({ ...c, email: e.target.value }))" :placeholder="`you@${loginBrand.id}.com`" class="wx-account__input" @focus="(e) => e.target.style.borderColor = '#0e0e10'" @blur="(e) => e.target.style.borderColor = '#d4d4d8'" />
          </div>
          <div class="wx-account__field">
            <label class="wx-account__label">Password</label>
            <input type="password" :value="creds.password" v-controlled="creds.password" :disabled="signingIn" @input="(e) => setCreds((c) => ({ ...c, password: e.target.value }))" placeholder="••••••••" class="wx-account__input" @focus="(e) => e.target.style.borderColor = '#0e0e10'" @blur="(e) => e.target.style.borderColor = '#d4d4d8'" />
          </div>
        </div>
        <button type="submit" :disabled="!creds.email || !creds.password || signingIn" :class="`wx-account__login-submit${(!creds.email || !creds.password || signingIn) ? ' wx-account__login-submit--disabled' : ''}`"><template v-if="signingIn">Authenticating…</template><template v-else><IconLock :size="16" /> Sign In</template></button>
        <div class="wx-account__login-note">
          <IconLock :size="12" /> {{ loginBrand.fromAdd ? `Credentials are verified by ${loginBrand.name} and never stored here` : `Secured by ${loginBrand.name} SSO` }}</div>
      </form>
    </Modal>
  </div>
</template>

<script>
import { INTEGRATION } from '../../../workspace/integration.js';
import { ACCOUNT_BRANDS, ACCOUNT_PROFILE, BRAND_ADD_DESC, BRAND_ADD_STATE, tsPasswordRules } from '../../../workspace/data/account.js';
import { CUSTOMIZER_BRANDS } from '../../../workspace/data/brands.js';
import Modal from '../common/Modal.vue';
import { IconCheck, IconChevron, IconCircleCheck, IconClock, IconEdit, IconExternal, IconLock, IconMail, IconPlus, IconSearch, IconShield, IconX } from '../icons.js';
import StoreCard from '../stores/StoreCard.vue';
import BrandTile from './BrandTile.vue';
import PasswordChecklist from './PasswordChecklist.vue';
import ProfileReadField from './ProfileReadField.vue';
import SettingsCard from './SettingsCard.vue';

export default {
  name: 'AccountProfile',
  components: {
    BrandTile, IconCheck, IconChevron, IconCircleCheck, IconClock, IconEdit, IconExternal, IconLock, IconMail, IconPlus, IconSearch, IconShield, IconX,
    Modal, PasswordChecklist, ProfileReadField, SettingsCard, StoreCard,
  },
  props: {
    profile: { type: Object, default: () => ACCOUNT_PROFILE },
    // The account's starting brands (the prototype's brandsProp); the list itself is local state.
    brands: { type: Array, default: () => ACCOUNT_BRANDS },
    // Sign-in method persona: "linked" (Customizer + Team Stores), "native" (Team Stores only), "customizer" (Customizer only).
    authMode: { type: String, default: 'linked' },
    onEditProfile: { type: Function, default: undefined },
    onToast: { type: Function, default: undefined },
    archivedStores: { type: Array, default: () => [] },
    onManageStore: { type: Function, default: undefined },
    onUnarchive: { type: Function, default: undefined },
    onCreateTemplate: { type: Function, default: undefined },
  },
  data() {
    return {
      accountBrands: this.brands,
      custLinked: this.authMode !== "native",
      nativeSetUp: this.authMode !== "customizer",
      // Personal info: Customizer-sourced (read-only) or stored on the Team Stores account (editable).
      info: this.profile,
      draft: this.profile,
      editingInfo: false,
      // Team Stores password modal
      pwOpen: false,
      pwMode: "change",
      pw: { current: "", next: "", show: false },
      pwSaving: false,
      addStates: BRAND_ADD_STATE,
      primaryId: INTEGRATION.on ? "victus" : "prolook", // brand profile info is pulled from
      hoverStar: null,
      loginBrand: null, // brand pending sign-in
      creds: { email: "", password: "" },
      signingIn: false,
      addOpen: false, // "Add a brand" picker
      addQuery: "",
      // The Customizer this workspace links (the integrated workspace uses Victus).
      custBrand: INTEGRATION.on ? { id: "victus", name: "Victus" } : { id: "prolook", name: "Prolook" },
    };
  },
  computed: {
    isCustomizerOnly() { return this.authMode === "customizer"; },
    shown() { return this.editingInfo ? this.draft : this.info; },
    pwRules() { return tsPasswordRules(this.pw.next, this.info.email); },
    pwReady() { return this.pwRules.every((r) => r.ok) && (this.pwMode === "create" || (this.pw.current && this.pw.current !== this.pw.next)); },
    primaryBrand() { return this.accountBrands.find((b) => b.id === this.primaryId) || CUSTOMIZER_BRANDS[this.primaryId] || { name: "Product Customizer" }; },
    // Brands the rep could add manually — every known customizer brand not already on the account.
    addableBrands() {
      const { accountBrands, addQuery } = this;
      const addableBrands = Object.keys(CUSTOMIZER_BRANDS)
        .filter((id) => !accountBrands.some((b) => b.id === id))
        .map((id) => ({ id, name: CUSTOMIZER_BRANDS[id].name, desc: BRAND_ADD_DESC[id] || "Customizer & catalog", connected: false, sso: false }))
        .filter((b) => !addQuery.trim() || b.name.toLowerCase().includes(addQuery.trim().toLowerCase()));
      addableBrands.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
      return addableBrands;
    },
  },
  watch: {
    // React: useEffect on [authMode] (it also runs once after mount: see mounted).
    authMode() { this.syncAuthMode(); },
  },
  mounted() {
    this.syncAuthMode();
  },
  methods: {
    syncAuthMode() {
      this.custLinked = this.authMode !== "native";
      this.nativeSetUp = this.authMode !== "customizer";
      this.editingInfo = false;
    },
    setDraft(v) { this.draft = v; },
    setEditingInfo(v) { this.editingInfo = v; },
    setD(k) { return (v) => { this.draft = { ...this.draft, [k]: v }; }; },
    saveInfo() { this.info = this.draft; this.editingInfo = false; this.onToast && this.onToast("Personal info saved to your Team Stores account"); },
    setPwOpen(v) { this.pwOpen = v; },
    setPw(v) { this.pw = typeof v === "function" ? v(this.pw) : v; },
    openPw(mode) { this.pwMode = mode; this.pw = { current: "", next: "", show: false }; this.pwOpen = true; },
    submitPw(e) {
      e && e.preventDefault(); if (!this.pwReady) return;
      this.pwSaving = true;
      const pwMode = this.pwMode; // the value when submitted, as in the prototype's closure
      setTimeout(() => {
        this.pwSaving = false; this.pwOpen = false; this.nativeSetUp = true;
        this.onToast && this.onToast(pwMode === "create" ? "Team Stores password created — you can now sign in without a Customizer" : "Password updated — other sessions signed out, confirmation email sent");
      }, 800);
    },
    setPrimaryId(v) { this.primaryId = v; },
    setHoverStar(v) { this.hoverStar = v; },
    setCreds(v) { this.creds = typeof v === "function" ? v(this.creds) : v; },
    setAddOpen(v) { this.addOpen = v; },
    setAddQuery(v) { this.addQuery = v; },
    stOf(b) { return this.addStates[b.id] || "connect"; },
    requestAccess(b) {
      this.addStates = { ...this.addStates, [b.id]: "pending" };
      this.onToast && this.onToast(`Access to ${b.name} requested — Prolook will set up your account`);
    },
    openAdd() { this.addQuery = ""; this.addOpen = true; },
    openLogin(b, fromAdd, link) { this.creds = { email: "", password: "" }; this.addOpen = false; this.loginBrand = { ...b, fromAdd: !!fromAdd, link: !!link }; },
    closeLogin() { if (!this.signingIn) this.loginBrand = null; },
    backToAdd() { if (this.signingIn) return; this.loginBrand = null; this.addOpen = true; },
    submitLogin(e) {
      e && e.preventDefault();
      if (!this.loginBrand || !this.creds.email || !this.creds.password) return;
      this.signingIn = true;
      // The brand and email when submitted, as in the prototype's closure.
      const loginBrand = this.loginBrand;
      const creds = this.creds;
      setTimeout(() => {
        const b = loginBrand;
        const bs = this.accountBrands;
        this.accountBrands = bs.some((x) => x.id === b.id)
          ? bs.map((x) => x.id === b.id ? { ...x, connected: true, justAuthed: true } : x)
          : [...bs, { id: b.id, name: b.name, desc: b.desc, connected: true, sso: false, justAuthed: true, authEmail: creds.email }];
        this.signingIn = false;
        this.loginBrand = null;
        if (b.link) this.custLinked = true;
        this.onToast && this.onToast(b.link ? `${b.name} Customizer linked — sign in either way, same workspace` : b.fromAdd ? `${b.name} added — you can now sell across this brand` : `${b.name} authenticated — you can now sell across this brand`);
      }, 850);
    },
  },
};
</script>
