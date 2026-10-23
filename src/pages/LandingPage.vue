<!-- Converted from "Landing Page.dc.html" (Claude Design). The template mirrors the prototype's markup;
     the logic is the prototype's class, unchanged, in LandingPage.logic.js. -->
<template>
<div class="tsl-page">

  <!-- top bar -->
  <header class="tsl-header">
    <a class="tsl-header__brand" href="#">
      <img class="tsl-header__logo" src="assets/qx-logo.png" alt="Team Stores">
      <span class="tsl-header__divider"></span>
      <span class="tsl-header__title">TEAM STORES</span>
    </a>
    <template v-if="vals.signedIn">
      <a class="tsl-header__account" href="#">
        <span class="tsl-header__account-label">{{ str(vals.accountName) }}</span>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"></circle><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"></path></svg>
      </a>
    </template>
    <template v-if="vals.notSignedIn">
      <button class="tsl-header__sign-in" @click="vals.openSignIn">
        <span class="tsl-header__account-label">SIGN IN</span>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"></circle><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"></path></svg>
      </button>
    </template>
  </header>

  <!-- hero -->
  <section class="tsl-hero">
    <span class="tsl-hero__badge">
      <span class="tsl-hero__badge-dot"></span> TEAM STORES PLATFORM
    </span>
    <h1 class="tsl-hero__title">One dashboard to launch<br>every team store.</h1>
    <p class="tsl-hero__lead">Spin up branded online stores, source products across every brand you sell, and manage rosters, orders, and payouts — all from a single command center built for reps.</p>
    <div class="tsl-hero__actions">
      <button class="tsl-hero__enter" @click="vals.onEnter">
        Enter Team Stores
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>
      </button>
      <a class="tsl-hero__how" href="#features">See how it works</a>
    </div>
    

    <!-- dashboard mockup -->
    <template v-if="vals.showPreview">
    <div class="tsl-dash">
      <div class="tsl-dash__chrome">
        <span class="tsl-dash__chrome-dot"></span>
        <span class="tsl-dash__chrome-dot"></span>
        <span class="tsl-dash__chrome-dot"></span>
        
      </div>
      <div class="tsl-dash__body">
        
        <div class="tsl-dash__main">
          <div class="tsl-dash__head">
            <div>
              <div class="tsl-dash__title">Overview</div>
              <div class="tsl-dash__subtitle">Welcome back, Jordan — 24 active stores</div>
            </div>
            <span class="tsl-dash__range">Last 30 days</span>
          </div>
          <div class="tsl-dash__kpis">
            <div class="tsl-dash__card">
              <div class="tsl-dash__kpi-label">Total Revenue</div>
              <div class="tsl-dash__kpi-value">$128,450</div>
              <div class="tsl-dash__kpi-delta-up">▲ 12.4%</div>
            </div>
            <div class="tsl-dash__card">
              <div class="tsl-dash__kpi-label">Orders</div>
              <div class="tsl-dash__kpi-value">1,382</div>
              <div class="tsl-dash__kpi-delta-up">▲ 8.1%</div>
            </div>
            <div class="tsl-dash__card">
              <div class="tsl-dash__kpi-label">Active Stores</div>
              <div class="tsl-dash__kpi-value">24</div>
              <div class="tsl-dash__kpi-delta">24 total</div>
            </div>
            <div class="tsl-dash__card--dark">
              <div class="tsl-dash__kpi-label">Avg. Order Value</div>
              <div class="tsl-dash__kpi-value--dark">$92.94</div>
              <div class="tsl-dash__kpi-delta-down">▼ 3.2%</div>
            </div>
          </div>
          <div class="tsl-dash__panels">
            <div class="tsl-dash__card">
              <div class="tsl-dash__panel-head">
                <span class="tsl-dash__panel-title">Revenue trend</span>
                <span class="tsl-dash__panel-meta">WEEKLY</span>
              </div>
              <div class="tsl-dash__chart">
                <div class="tsl-dash__chart-bar-1"></div>
                <div class="tsl-dash__chart-bar-2"></div>
                <div class="tsl-dash__chart-bar-3"></div>
                <div class="tsl-dash__chart-bar-4"></div>
                <div class="tsl-dash__chart-bar-5"></div>
                <div class="tsl-dash__chart-bar-6"></div>
                <div class="tsl-dash__chart-bar-7"></div>
                <div class="tsl-dash__chart-bar-8"></div>
                <div class="tsl-dash__chart-bar-9"></div>
                <div class="tsl-dash__chart-bar-10"></div>
                <div class="tsl-dash__chart-bar-11"></div>
                <div class="tsl-dash__chart-bar-12"></div>
              </div>
            </div>
            <div class="tsl-dash__card">
              <span class="tsl-dash__panel-title">Active Ordering Windows</span>
              <div class="tsl-dash__stores">
                <div class="tsl-dash__store--first">
                  <div class="tsl-dash__store-row">
                    <span class="tsl-dash__avatar--ww">WW</span>
                    <div class="tsl-dash__store-info">
                      <div class="tsl-dash__store-name">Westside Warriors</div>
                      <div class="tsl-dash__store-revenue">Revenue: <span class="tsl-dash__store-amount">$41,200</span></div>
                    </div>
                    <span class="tsl-dash__tag--urgent">4d left</span>
                  </div>
                  <div class="tsl-dash__progress-wrap">
                    <div class="tsl-dash__progress"><div class="tsl-dash__progress-fill--ww"></div></div>
                  </div>
                </div>
                <div class="tsl-dash__store--middle">
                  <div class="tsl-dash__store-row">
                    <span class="tsl-dash__avatar--nl">NL</span>
                    <div class="tsl-dash__store-info">
                      <div class="tsl-dash__store-name">North League Elite</div>
                      <div class="tsl-dash__store-revenue">Revenue: <span class="tsl-dash__store-amount">$33,800</span></div>
                    </div>
                    <span class="tsl-dash__tag">12d left</span>
                  </div>
                  <div class="tsl-dash__progress-wrap">
                    <div class="tsl-dash__progress"><div class="tsl-dash__progress-fill--nl"></div></div>
                  </div>
                </div>
                <div class="tsl-dash__store--last">
                  <div class="tsl-dash__store-row">
                    <span class="tsl-dash__avatar--rc">RC</span>
                    <div class="tsl-dash__store-info">
                      <div class="tsl-dash__store-name">Ridgeview Cyclones</div>
                      <div class="tsl-dash__store-revenue">Revenue: <span class="tsl-dash__store-amount">$28,100</span></div>
                    </div>
                    <span class="tsl-dash__tag">26d left</span>
                  </div>
                  <div class="tsl-dash__progress-wrap">
                    <div class="tsl-dash__progress"><div class="tsl-dash__progress-fill--rc"></div></div>
                  </div>
                </div>
              </div>
              <div class="tsl-dash__panel-foot">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path></svg>
                3 windows open now
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </template>
  </section>

  <!-- features -->
  <section class="tsl-features" id="features">
    <div class="tsl-features__inner">
      <span class="tsl-features__eyebrow">WHAT YOU GET</span>
      <h2 class="tsl-features__title">Everything a rep needs to run stores without the mistakes.</h2>
      <div class="tsl-features__grid">
        <div class="tsl-features__card">
          <span class="tsl-features__icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z"></path></svg></span>
          <h3 class="tsl-features__card-title">Launch stores in minutes</h3>
          <p class="tsl-features__card-text">A guided flow — basics, products, review &amp; deploy — with safeguards that stop costly ordering errors before they happen.</p>
        </div>
        <div class="tsl-features__card">
          <span class="tsl-features__icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18"></path></svg></span>
          <h3 class="tsl-features__card-title">Source from every brand</h3>
          <p class="tsl-features__card-text">Add products from every brand you're entitled to sell, and pull saved Customizer designs and active carts straight into a store.</p>
        </div>
        <div class="tsl-features__card">
          <span class="tsl-features__icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"></path></svg></span>
          <h3 class="tsl-features__card-title">Roster-matched ordering</h3>
          <p class="tsl-features__card-text">Parents shop for multiple players with sizes and numbers matched to your roster — far fewer duplicate numbers and sizing mistakes.</p>
        </div>
        <div class="tsl-features__card">
          <span class="tsl-features__icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2h9l5 5v15H6z"></path><path d="M15 2v5h5M9 13h6M9 17h6"></path></svg></span>
          <h3 class="tsl-features__card-title">Required player packs</h3>
          <p class="tsl-features__card-text">Bundle mandatory uniform items so every athlete is fully equipped and ready by deadline day — no missing pieces.</p>
        </div>
        <div class="tsl-features__card">
          <span class="tsl-features__icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19V9M10 19V5M16 19v-7M22 19V3"></path></svg></span>
          <h3 class="tsl-features__card-title">One dashboard, full visibility</h3>
          <p class="tsl-features__card-text">KPI cards, revenue trends, top-performing stores, and active order windows — every store's health at a glance.</p>
        </div>
        <div class="tsl-features__card--dark">
          <span class="tsl-features__icon--accent"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z"></path><path d="M9 12l2 2 4-4"></path></svg></span>
          <h3 class="tsl-features__card-title--dark">Built-in safeguards</h3>
          <p class="tsl-features__card-text--dark">Coach-approval gates and locked ordering windows keep reps from bypassing critical checks — protecting you from expensive production errors.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- FAQ -->
  <section class="tsl-faq" id="faq">
    <div class="tsl-faq__inner">
      <div class="tsl-faq__head">
        <span class="tsl-faq__eyebrow">FAQ</span>
        <h2 class="tsl-faq__title">Sign-in, brands &amp; onboarding</h2>
      </div>
      <details class="tsl-faq__item">
        <summary class="tsl-faq__question">I'm already signed into my Customizer — do I log in again?<span class="tsl-faq__chev" data-chev="">+</span></summary>
        <p class="tsl-faq__answer">No. Team Stores recognizes you automatically and signs you in with the same Customizer credentials — no second login. It opens in a new browser tab so your Customizer work stays exactly where you left it, and routes you straight to your Overview.</p>
      </details>
      <details class="tsl-faq__item">
        <summary class="tsl-faq__question">The platform looks like my brand — how does that work?<span class="tsl-faq__chev" data-chev="">+</span></summary>
        <p class="tsl-faq__answer">Team Stores is brand-agnostic. When you sign in from a Customizer, the platform carries that Customizer's logo through your dashboard. If you're not signed in, you'll see the default PROLOOK branding until you choose a Customizer to continue.</p>
      </details>
      <details class="tsl-faq__item">
        <summary class="tsl-faq__question">I sell multiple brands — can I add products from all of them?<span class="tsl-faq__chev" data-chev="">+</span></summary>
        <p class="tsl-faq__answer">Yes. If you're authorized to sell other brands under the same email, you're automatically signed into those brand Customizers and can add their products to any store you build.</p>
      </details>
      <details class="tsl-faq__item">
        <summary class="tsl-faq__question">My dealership is new to Team Stores — what happens first?<span class="tsl-faq__chev" data-chev="">+</span></summary>
        <p class="tsl-faq__answer">You'll complete a short business-details form — legal entity, tax and banking info. We verify it instantly through Stripe, so there's no waiting period: once it's confirmed you go straight into your dashboard.</p>
      </details>
      <details class="tsl-faq__item">
        <summary class="tsl-faq__question">What if I'm not logged in when I click Team Stores?<span class="tsl-faq__chev" data-chev="">+</span></summary>
        <p class="tsl-faq__answer">You'll be asked to choose your Customizer, then sign in with your existing Customizer credentials. From there you continue straight to Overview — or, if your dealership is new, to the quick business-details form.</p>
      </details>
    </div>
  </section>

  <!-- CTA band -->
  <section class="tsl-cta">
    <div class="tsl-cta__inner">
      <div>
        <h2 class="tsl-cta__title">Ready to open your dashboard?</h2>
        <p class="tsl-cta__text">Enter Team Stores with your Customizer sign-in and land straight on your Overview.</p>
      </div>
      <button class="tsl-cta__button" @click="vals.onEnter">
        Enter Team Stores
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>
      </button>
    </div>
  </section>

  <!-- footer -->
  <footer class="tsl-footer">
    <div class="tsl-footer__brand">
      <img class="tsl-footer__logo" src="assets/prolook-mark.png" alt="PROLOOK">
      <span class="tsl-footer__title">TEAM STORES</span>
    </div>
    <div class="tsl-footer__links">
      <a class="tsl-footer__link" href="Team%20Store%20Storefront.dc.html">
        See a live team store
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>
      </a>
      <span class="tsl-footer__copy">© 2026 PROLOOK · Custom team apparel platform</span>
    </div>
  </footer></div><!-- ══════ AUTH MODAL — native sign-in (primary) + Customizer sign-in (federated) ══════ --><template v-if="vals.modalOpen">
  <div class="tsl-modal" @click="vals.closeModal">
    <div class="tsl-modal__dialog" @click="vals.stop">

      <template v-if="vals.showClose">
        <button class="tsl-modal__close" @click="vals.closeModal" aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"></path></svg>
        </button>
      </template>

      <!-- STEP: home — native sign-in (primary) -->
      <template v-if="vals.stepHome">
        <div class="tsl-auth__panel">
          <h3 class="tsl-auth__title">Sign in to Team Stores</h3>
          <p class="tsl-auth__lead">Use your Team Stores account, or sign in with a brand Customizer you already have.</p>
          <div class="tsl-auth__fields">

            <label class="tsl-field">
              <span class="tsl-field__label">Email address</span>
              <input class="tsl-field__input" type="email" :value="vals.emailValue ?? ''" v-controlled="vals.emailValue" @input="vals.onEmailInput" placeholder="you@dealership.com" v-autofocus>
            </label>

            <label class="tsl-field">
              <span class="tsl-field__label">Password</span>
              <input class="tsl-field__input--password" :type="vals.pwInputType" :value="vals.pwValue ?? ''" v-controlled="vals.pwValue" @input="vals.onPwInput" placeholder="Enter your password">
              <button class="tsl-field__toggle" @click="vals.togglePw" type="button" aria-label="Toggle password visibility">
                <template v-if="vals.pwHidden">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                </template>
                <template v-if="vals.pwShown">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7c2.1 0 3.9.6 5.4 1.5M22 12s-3.5 7-10 7c-2.1 0-3.9-.6-5.4-1.5"></path><path d="M9.9 9.9a3 3 0 004.2 4.2"></path><path d="M3 3l18 18"></path></svg>
                </template>
              </button>
            </label>
          </div>
          <template v-if="vals.signInError">
            <div class="tsl-auth__error">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 8v4M12 16h.01"></path></svg>
              Email or password is incorrect
            </div>
          </template>
          <div class="tsl-auth__forgot-row">
            <button class="tsl-auth__forgot" @click="vals.goForgot">Forgot password?</button>
          </div>
          <button @click="vals.doNativeSignIn" :disabled="vals.nativeSignInDisabled" :style="vals.nativeSignInStyle">Sign in</button>
          <div class="tsl-auth__divider">
            <span class="tsl-auth__divider-line"></span>
            <span class="tsl-auth__divider-text">OR</span>
            <span class="tsl-auth__divider-line"></span>
          </div>
          <button class="tsl-auth__customizer-btn" @click="vals.goCustomizer">
            Sign in With Customizer
          </button>
          <p class="tsl-auth__switch">New to Team Stores? <button class="tsl-auth__switch-link" @click="vals.goSignup">Create an account</button></p>
        </div>
      </template>

      <!-- STEP: sign up 1/2 — credentials + live password checklist -->
      <template v-if="vals.stepSignup1">
        <div class="tsl-auth__panel">

          <button class="tsl-auth__back" @click="vals.goHome">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"></path></svg> Back
          </button>
          <div class="tsl-auth__step"><span class="tsl-auth__step-label">Step 1 of 2 · Credentials</span></div>
          <h3 class="tsl-auth__title">Create your Team Stores account</h3>
          <p class="tsl-auth__lead--wide">You'll be able to connect any brand Customizers you're entitled to after you're in.</p>
          <div class="tsl-auth__fields">

            <label class="tsl-field">
              <span class="tsl-field__label">Email address</span>
              <input class="tsl-field__input" type="email" :value="vals.emailValue ?? ''" v-controlled="vals.emailValue" @input="vals.onEmailInput" placeholder="you@dealership.com" v-autofocus>
            </label>

            <label class="tsl-field">
              <span class="tsl-field__label">Password</span>
              <input class="tsl-field__input--password" :type="vals.pwInputType" :value="vals.pwValue ?? ''" v-controlled="vals.pwValue" @input="vals.onPwInput" placeholder="At least 12 characters">
              <button class="tsl-field__toggle" @click="vals.togglePw" type="button" aria-label="Toggle password visibility">
                <template v-if="vals.pwHidden">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                </template>
                <template v-if="vals.pwShown">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7c2.1 0 3.9.6 5.4 1.5M22 12s-3.5 7-10 7c-2.1 0-3.9-.6-5.4-1.5"></path><path d="M9.9 9.9a3 3 0 004.2 4.2"></path><path d="M3 3l18 18"></path></svg>
                </template>
              </button>
            </label>
          </div>
          <template v-if="vals.emailTaken">
            <div class="tsl-auth__notice">An account already exists for <strong class="tsl-auth__strong">{{ str(vals.emailValue) }}</strong>. <button class="tsl-auth__notice-link" @click="vals.goHome">Sign in</button> and we'll link your accounts automatically.</div>
          </template>
          <ul class="tsl-auth__rules">
            <template v-for="(r, $index) in list(vals.pwRules)" :key="$index">
              <li class="tsl-auth__rule">
                <span :style="r?.dotStyle">
                  <template v-if="r?.ok"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12l5 5L20 6"></path></svg></template>
                </span>
                <span :style="r?.textStyle">{{ str(r?.label) }}</span>
              </li>
            </template>
          </ul>
          <button @click="vals.goSignup2" :disabled="vals.signup1Disabled" :style="vals.signup1Style">Continue</button>
          <p class="tsl-auth__switch--signup">Already have an account? <button class="tsl-auth__switch-link" @click="vals.goHome">Sign in</button></p>
        </div>
      </template>

      <!-- STEP: sign up 2/2 — personal info (native reps enter this manually) -->
      <template v-if="vals.stepSignup2">
        <div class="tsl-auth__panel">

          <button class="tsl-auth__back" @click="vals.goSignup1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"></path></svg> Back
          </button>
          <div class="tsl-auth__step"><span class="tsl-auth__step-label">Step 2 of 2 · Your details</span></div>
          <h3 class="tsl-auth__title">Tell us about yourself</h3>
          <p class="tsl-auth__lead--wide">Reps who sign in with a Customizer have this pulled in automatically. You can edit it anytime from My Account.</p>
          <div class="tsl-auth__grid">

            <label class="tsl-field">
              <span class="tsl-field__label">First name</span>
              <input class="tsl-field__input" type="text" :value="vals.p?.firstName ?? ''" v-controlled="vals.p?.firstName" @input="vals.onFirst" placeholder="Jordan" v-autofocus>
            </label>

            <label class="tsl-field">
              <span class="tsl-field__label">Last name</span>
              <input class="tsl-field__input" type="text" :value="vals.p?.lastName ?? ''" v-controlled="vals.p?.lastName" @input="vals.onLast" placeholder="Rivera">
            </label>
            <div class="tsl-auth__grid-full">

            <label class="tsl-field">
              <span class="tsl-field__label">Phone number</span>
              <input class="tsl-field__input" type="tel" :value="vals.p?.phone ?? ''" v-controlled="vals.p?.phone" @input="vals.onPhone" placeholder="(801) 123-4567">
            </label>
            </div>

            <!-- Country · typeahead combobox (mimics a map-service lookup) -->
            <div class="tsl-combo">
              <span class="tsl-field__label">Country</span>
              <input class="tsl-combo__input" type="text" :value="vals.p?.country ?? ''" v-controlled="vals.p?.country" @input="vals.onCountry" @focus="vals.openCountry" @blur="vals.closeCombos" placeholder="Search countries" autoComplete="off">
              <button class="tsl-combo__toggle" type="button" @mousedown="vals.toggleCountry" aria-label="Show countries">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"></path></svg>
              </button>
              <template v-if="vals.countryOpen">
                <div class="tsl-combo__list">
                  <template v-for="(o, $index) in list(vals.countryOptions)" :key="$index">
                    <button class="tsl-combo__option" type="button" @mousedown="o.onPick" :style="o?.style">{{ str(o?.label) }}</button>
                  </template>
                  <template v-if="vals.countryEmpty">
                    <div class="tsl-combo__empty">No matches</div>
                  </template>
                </div>
              </template>
            </div>

            <!-- State · typeahead combobox, list depends on country -->
            <div class="tsl-combo">
              <span class="tsl-field__label">State</span>
              <input class="tsl-combo__input" type="text" :value="vals.p?.state ?? ''" v-controlled="vals.p?.state" @input="vals.onState" @focus="vals.openState" @blur="vals.closeCombos" placeholder="Search states" autoComplete="off">
              <button class="tsl-combo__toggle" type="button" @mousedown="vals.toggleState" aria-label="Show states">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"></path></svg>
              </button>
              <template v-if="vals.stateOpen">
                <div class="tsl-combo__list">
                  <template v-for="(o, $index) in list(vals.stateOptions)" :key="$index">
                    <button class="tsl-combo__option" type="button" @mousedown="o.onPick" :style="o?.style">{{ str(o?.label) }}</button>
                  </template>
                  <template v-if="vals.stateEmpty">
                    <div class="tsl-combo__empty">No matches</div>
                  </template>
                </div>
              </template>
            </div>

            <label class="tsl-field">
              <span class="tsl-field__label">City</span>
              <input class="tsl-field__input" type="text" :value="vals.p?.city ?? ''" v-controlled="vals.p?.city" @input="vals.onCity" placeholder="Salt Lake City">
            </label>

            <label class="tsl-field">
              <span class="tsl-field__label">Zip code</span>
              <input class="tsl-field__input" type="text" :value="vals.p?.zip ?? ''" v-controlled="vals.p?.zip" @input="vals.onZip" placeholder="84117">
            </label>
          </div>
          <button @click="vals.doSignup" :disabled="vals.signup2Disabled" :style="vals.signup2Style">Create account</button>
          <p class="tsl-auth__note">We'll check your email against our dealership records. If your dealership is new to Team Stores, you'll register your business next.</p>
        </div>
      </template>

      <!-- STEP: post sign-up — checking email against qx7 dealership records -->
      <template v-if="vals.stepChecking">
        <div class="tsl-auth__status">
          <div class="tsl-auth__spinner">
            <span class="tsl-auth__spinner-track"></span>
            <span class="tsl-auth__spinner-arc"></span>
          </div>
          <h3 class="tsl-auth__status-title">Account created</h3>
          <p class="tsl-auth__status-text">Checking <strong class="tsl-auth__strong">{{ str(vals.emailValue) }}</strong> against our dealership records…</p>
        </div>
      </template>

      <!-- STEP: post sign-up — no dealership matched: hand off to organization registration -->
      <template v-if="vals.stepNotFound">
        <div class="tsl-auth__status">
          <div class="tsl-auth__status-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"></path><path d="M5 21V7l7-4 7 4v14"></path><path d="M9 21v-6h6v6"></path></svg>
          </div>
          <h3 class="tsl-auth__status-title">No organization found</h3>
          <p class="tsl-auth__text"><strong class="tsl-auth__strong">{{ str(vals.emailValue) }}</strong> isn't linked to a dealership we know. Next, register your organization — Team Stores access opens once it's approved.</p>
          <p class="tsl-auth__status-note">Taking you to organization registration…</p>
        </div>
      </template>

      <!-- STEP: post sign-up — email matched a dealership: offer brand connections -->
      <template v-if="vals.stepConnect">
        <div class="tsl-auth__panel">
          <div class="tsl-auth__badge-row">
            <span class="tsl-auth__badge">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M8.5 12l2.5 2.5L16 9"></path></svg>
              Dealership found
            </span>
          </div>
          <h3 class="tsl-auth__title">Connect your brands?</h3>
          <p class="tsl-auth__lead--connect"><strong class="tsl-auth__strong">{{ str(vals.emailValue) }}</strong> is linked to <strong class="tsl-auth__strong">Team Gear Athletics ABC</strong>. Connecting a brand reuses your existing Customizer account and permissions so you can add its products.</p>
          <div class="tsl-auth__brands">
            <template v-for="(c, $index) in list(vals.connectBrands)" :key="$index">
              <button @click="c.onToggle" :style="c?.rowStyle">
                <span class="tsl-brand__logo">
                  <template v-if="c?.isImg"><img class="tsl-brand__img" src="assets/prolook-mark-black.png" alt="PROLOOK"></template>
                  <template v-if="c?.isWord"><span class="tsl-brand__initial">{{ str(c?.initial) }}</span></template>
                </span>
                <span class="tsl-brand__body--left">
                  <span class="tsl-brand__name">{{ str(c?.name) }}</span>
                  <span class="tsl-brand__sub">Customizer account found for your email</span>
                </span>
                <span :style="c?.checkStyle">
                  <template v-if="c?.selected"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12l5 5L20 6"></path></svg></template>
                </span>
              </button>
            </template>
          </div>
          <button @click="vals.doConnectEnter" :disabled="vals.connectDisabled" :style="vals.connectStyle">{{ str(vals.connectCta) }}</button>
          <div class="tsl-auth__skip-row">
            <button class="tsl-auth__skip" @click="vals.skipConnect">Skip for now — connect later from My Account</button>
          </div>
        </div>
      </template>

      <!-- STEP: forgot password -->
      <template v-if="vals.stepForgot">
        <div class="tsl-auth__panel--center">

          <button class="tsl-auth__back" @click="vals.goHome">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"></path></svg> Back
          </button>
          <h3 class="tsl-auth__title--small">Reset your password</h3>
          <p class="tsl-auth__text">Enter your Team Stores account email and we'll send a reset link.</p>
          <div class="tsl-auth__form">

            <label class="tsl-field">
              <span class="tsl-field__label">Email address</span>
              <input class="tsl-field__input" type="email" :value="vals.emailValue ?? ''" v-controlled="vals.emailValue" @input="vals.onEmailInput" placeholder="you@dealership.com" v-autofocus>
            </label>
          </div>
          <button @click="vals.doForgot" :disabled="vals.continueDisabled" :style="vals.continueStyleFull">Send reset link</button>
        </div>
      </template>

      <!-- STEP: forgot password — sent (same message whether or not the email has an account) -->
      <template v-if="vals.stepForgotSent">
        <div class="tsl-auth__panel--sent">
          <span class="tsl-auth__sent-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="M3 7l9 6 9-6"></path></svg>
          </span>
          <h3 class="tsl-auth__title--small">Check your email</h3>
          <p class="tsl-auth__text">If an account exists for <strong class="tsl-auth__strong">{{ str(vals.emailValue) }}</strong>, we've sent a reset link. It works once and expires in 60 minutes.</p>
          <button class="tsl-auth__primary-btn" @click="vals.goHome">Back to sign in</button>
        </div>
      </template>

      <!-- ── Customizer path (federated) ── -->
      <!-- STEP: intro (email intake gate) -->
      <template v-if="vals.stepIntro">
        <div class="tsl-auth__panel--center">

          <button class="tsl-auth__back" @click="vals.goHome">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"></path></svg> Back
          </button>
          <h3 class="tsl-auth__title--small">Continue with a Customizer</h3>
          <p class="tsl-auth__text">Enter the email tied to your Customizer account. We'll verify which brands you're entitled to before showing any sign-in options.</p>
          <div class="tsl-auth__form">

            <label class="tsl-field">
              <span class="tsl-field__label">Email address</span>
              <input class="tsl-field__input" type="email" :value="vals.emailValue ?? ''" v-controlled="vals.emailValue" @input="vals.onEmailInput" placeholder="you@dealership.com" v-autofocus>
            </label>
          </div>
          <div class="tsl-auth__actions">
            <button class="tsl-auth__cancel" @click="vals.goHome">Cancel</button>
            <button @click="vals.onContinueEmail" :disabled="vals.continueDisabled" :style="vals.continueStyle">Continue</button>
          </div>
        </div>
      </template>

      <!-- STEP: choose customizer (filtered by email entitlement, validated per brand) -->
      <template v-if="vals.stepChoose">
        <div class="tsl-auth__panel--choose">
          <h3 class="tsl-auth__status-title">Choose a Customizer</h3>
          <p class="tsl-auth__subtle">Brands linked to <strong class="tsl-auth__strong--semibold">{{ str(vals.emailValue) }}</strong>. The one you pick becomes your primary brand.</p>
          <template v-if="vals.hasEntitlements">
            <div class="tsl-auth__brand-list">
              <template v-for="(c, $index) in list(vals.customizers)" :key="$index">
                <!-- account exists: selectable row -->
                <template v-if="c?.hasAccount">
                  <button class="tsl-brand-row" @click="c.onSelect">
                    <span class="tsl-brand__logo">
                      <template v-if="c?.isImg"><img class="tsl-brand__img" src="assets/prolook-mark-black.png" alt="PROLOOK"></template>
                      <template v-if="c?.isWord"><span class="tsl-brand__initial">{{ str(c?.initial) }}</span></template>
                    </span>
                    <span class="tsl-brand__body">
                      <span class="tsl-brand__name">{{ str(c?.name) }}</span>
                      <span class="tsl-brand__sub">Customizer account found · Sign in</span>
                    </span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"></path></svg>
                  </button>
                </template>
                <!-- no account: request access / different email -->
                <template v-if="c?.noAccount">
                  <div class="tsl-auth__noaccount">
                    <div class="tsl-auth__noaccount-row">
                      <span class="tsl-brand__logo--outline">
                        <template v-if="c?.isImg"><img class="tsl-brand__img" src="assets/prolook-mark-black.png" alt="PROLOOK"></template>
                        <template v-if="c?.isWord"><span class="tsl-brand__initial">{{ str(c?.initial) }}</span></template>
                      </span>
                      <span class="tsl-brand__body">
                        <span class="tsl-brand__name">{{ str(c?.name) }}</span>
                        <span class="tsl-brand__sub--wrap">You don't have an account for this Customizer yet. Accounts are added by Prolook.</span>
                      </span>
                    </div>
                    <template v-if="c?.pending">
                      <span class="tsl-auth__pending">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path></svg>
                        Access pending · request sent to Prolook
                      </span>
                    </template>
                    <template v-if="c?.notPending">
                      <div class="tsl-auth__noaccount-actions">
                        <button class="tsl-auth__request" @click="c.onRequest">Request access to this brand</button>
                        <button class="tsl-auth__different" @click="vals.backToEmail">Sign in with a different email</button>
                      </div>
                    </template>
                  </div>
                </template>
              </template>
            </div>
            <template v-if="vals.noUsableBrand">
              <div class="tsl-auth__divider--spaced">
                <span class="tsl-auth__divider-line"></span><span class="tsl-auth__divider-text">OR</span><span class="tsl-auth__divider-line"></span>
              </div>
              <button class="tsl-auth__outline-btn" @click="vals.goSignup">Sign up with a Team Stores account</button>
            </template>
          </template>
          <template v-if="vals.noEntitlements">
            <div class="tsl-auth__notfound">
              <p class="tsl-auth__notfound-text">We couldn't find <strong class="tsl-auth__strong">{{ str(vals.emailValue) }}</strong> in our dealership records. Check the address, or create a Team Stores account to get started.</p>
              <button class="tsl-auth__primary-btn--signup" @click="vals.goSignup">Sign up for a Team Stores account</button>
            </div>
          </template>
          <button class="tsl-auth__text-btn" @click="vals.backToEmail">← Use a different email</button>
        </div>
      </template>

      <!-- STEP: Customizer password authentication -->
      <template v-if="vals.stepCreds">
        <div class="tsl-auth__panel--center">
          <template v-if="vals.chosenIsImg">
            <img class="tsl-auth__chosen-logo" src="assets/prolook-mark-black.png" alt="PROLOOK">
          </template>
          <template v-if="vals.chosenIsWord">
            <div class="tsl-auth__chosen-word">{{ str(vals.chosenWord) }}</div>
          </template>
          <h3 class="tsl-auth__creds-title">Sign in to {{ str(vals.chosenName) }}</h3>
          <p class="tsl-auth__creds-email">{{ str(vals.emailValue) }}</p>
          <div class="tsl-auth__form--plain">

            <label class="tsl-field">
              <span class="tsl-field__label">Password</span>
              <input class="tsl-field__input--password" :type="vals.pwInputType" :value="vals.pwValue ?? ''" v-controlled="vals.pwValue" @input="vals.onPwInput" placeholder="Enter your Customizer password" v-autofocus>
              <button class="tsl-field__toggle" @click="vals.togglePw" type="button" aria-label="Toggle password visibility">
                <template v-if="vals.pwHidden">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                </template>
                <template v-if="vals.pwShown">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7c2.1 0 3.9.6 5.4 1.5M22 12s-3.5 7-10 7c-2.1 0-3.9-.6-5.4-1.5"></path><path d="M9.9 9.9a3 3 0 004.2 4.2"></path><path d="M3 3l18 18"></path></svg>
                </template>
              </button>
            </label>
          </div>
          <div class="tsl-auth__actions">
            <button class="tsl-auth__back-btn" @click="vals.goChoose">Back</button>
            <button class="tsl-auth__submit" @click="vals.doSignIn">Authenticate &amp; Enter</button>
          </div>
        </div>
      </template>

      <!-- STEP: success -->
      <template v-if="vals.stepSuccess">
        <div class="tsl-auth__panel--success">
          <div class="tsl-auth__success-icon">
            <div class="tsl-auth__success-halo"></div>
            <div class="tsl-auth__success-pop">
              <span class="tsl-auth__success-circle">
                <svg class="tsl-auth__success-check" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12l5 5L20 6"></path></svg>
              </span>
            </div>
          </div>
          <h3 class="tsl-auth__success-title">{{ str(vals.successTitle) }}</h3>
          <p class="tsl-auth__success-text">{{ str(vals.successCopy) }}</p>
        </div>
      </template>

    </div>
  </div></template><!-- Auto-sign-in · Welcome & Primary Brand modal --><template v-if="vals.welcomeOpen">
  <div class="tsl-welcome">
    <div class="tsl-welcome__dialog">

      <button class="tsl-welcome__close" @click="vals.welcomeClose" aria-label="Close">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"></path></svg>
      </button>

      <template v-if="vals.welcomeFederated">
      <div class="tsl-welcome__badge-row">
        <span class="tsl-welcome__badge">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M8.5 12l2.5 2.5L16 9"></path></svg>
          Signed in automatically
        </span>
      </div>

      <h2 class="tsl-welcome__title">Welcome to Team Stores</h2>
      <p class="tsl-welcome__lead">We've automatically signed you in using your <strong class="tsl-welcome__strong">{{ str(vals.welcomeOriginName) }}</strong> Customizer account and set it as your primary brand for this workspace session.</p>
      </template>

      <!-- Native-path variant: no auto sign-in badge; connect brands found for the email -->
      <template v-if="vals.welcomeNative">
        <h2 class="tsl-welcome__title">Welcome to Team Stores</h2>
        <p class="tsl-welcome__lead">Your account is ready. Connect the brand Customizers you're entitled to so you can add their products to your stores.</p>
        <div class="tsl-welcome__block">
          <div class="tsl-welcome__eyebrow">Brands found for {{ str(vals.welcomeEmail) }}</div>
          <div class="tsl-welcome__brands">
            <template v-for="(c, $index) in list(vals.welcomeConnectBrands)" :key="$index">
              <div class="tsl-welcome__brand-row">
                <span class="tsl-welcome__brand-logo">
                  <template v-if="c?.isImg"><img class="tsl-welcome__brand-img" src="assets/prolook-mark-black.png" alt="PROLOOK"></template>
                  <template v-if="c?.isWord"><span class="tsl-welcome__brand-initial">{{ str(c?.initial) }}</span></template>
                </span>
                <span class="tsl-welcome__brand-body">
                  <span class="tsl-welcome__brand-name">{{ str(c?.name) }}</span>
                  <span class="tsl-welcome__brand-sub">{{ str(c?.sub) }}</span>
                </span>
                <template v-if="c?.connected">
                  <span class="tsl-welcome__connected">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12l5 5L20 6"></path></svg> Connected
                  </span>
                </template>
                <template v-if="c?.notConnected">
                  <button class="tsl-welcome__connect" @click="c.onConnect">Connect</button>
                </template>
              </div>
            </template>
          </div>
          <p class="tsl-welcome__hint">{{ str(vals.welcomeNativeHint) }}</p>
        </div>
      </template>

      <!-- Scenario 2 · multi-brand selector -->
      <template v-if="vals.welcomeMulti">
        <div class="tsl-welcome__block--spaced">
          <div class="tsl-welcome__eyebrow--select">Primary Brand Selection</div>
          <div class="tsl-welcome__grid">
            <template v-for="(c, $index) in list(vals.welcomeBrands)" :key="$index">
              <button class="tsl-welcome__tile" @click="c.onSelect" :title="c?.name">
                <template v-if="c?.selected">
                  <span class="tsl-welcome__tile-ring"></span>
                  <span class="tsl-welcome__tile-check">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12l5 5L20 6"></path></svg>
                  </span>
                </template>
                <span class="tsl-welcome__tile-logo">
                  <template v-if="c?.isImg">
                    <img class="tsl-welcome__tile-img" src="assets/prolook-mark-black.png" alt="PROLOOK">
                  </template>
                  <template v-if="c?.isWord">
                    <span class="tsl-welcome__tile-word">{{ str(c?.word) }}</span>
                  </template>
                </span>
                <span class="tsl-welcome__tile-name">{{ str(c?.name) }}</span>
              </button>
            </template>
          </div>
          <p class="tsl-welcome__note">You can change your primary brand anytime from My Account.</p>
        </div>
      </template>

      <!-- Scenario 1 · single-brand read-only badge -->
      <template v-if="vals.welcomeSingle">
        <div class="tsl-welcome__block">
          <div class="tsl-welcome__eyebrow--primary">Your Primary Brand</div>
          <div class="tsl-welcome__primary">
            <span class="tsl-welcome__primary-logo">
              <template v-if="vals.welcomeOriginIsImg">
                <img class="tsl-welcome__primary-img" src="assets/prolook-mark-black.png" alt="PROLOOK">
              </template>
              <template v-if="vals.welcomeOriginIsWord">
                <span class="tsl-welcome__primary-word">{{ str(vals.welcomeOriginWord) }}</span>
              </template>
            </span>
            <span class="tsl-welcome__primary-divider"></span>
            <span class="tsl-welcome__primary-name">{{ str(vals.welcomeOriginName) }}</span>
            <span class="tsl-welcome__primary-check">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M8.5 12l2.5 2.5L16 9"></path></svg>
              Primary
            </span>
          </div>
        </div>
      </template>

      <div class="tsl-welcome__footer">
        <button class="tsl-welcome__confirm" @click="vals.welcomeConfirm">
          <span v-if="shown(vals.welcomeCta)" class="sc-interp">{{ vals.welcomeCta }}</span>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16M14 6l6 6-6 6"></path></svg>
        </button>
      </div>

    </div>
  </div></template>
</template>

<script>
import { nextTick } from 'vue';
import Component from './LandingPage.logic.js';

// The prototype's editor settings (data-props in "Landing Page.dc.html"), pinned to the defaults the
// page shipped with. Claude Design's settings panel itself is prototype-only.
const DEFAULTS = {
  signedIn: false,
  hasAccess: true,
  brandCustomizer: 'PROLOOK',
  customizerAccountExists: false,
  emailInDealerRecords: true,
  signupDealershipFound: false,
  showDashboardPreview: true,
  showWelcomeModal: false,
  welcomeNativePath: true,
  welcomeMultiBrand: false,
};

export default {
  name: 'LandingPage',

  directives: {
    // React's autoFocus: focus the element every time it mounts (for example, each pop-up step).
    autofocus: {
      mounted: (el) => el.focus(),
    },
    // React's controlled inputs: after every input event the field shows its bound value, even when
    // the handler left state unchanged (for example, letters typed into the phone field).
    controlled: {
      mounted(el, { value }) {
        el._boundValue = value;
        el.addEventListener('input', () => nextTick(() => {
          const bound = el._boundValue == null ? '' : String(el._boundValue);
          if (el.value !== bound) el.value = bound;
        }));
      },
      updated(el, { value }) {
        el._boundValue = value;
      },
    },
  },

  data() {
    const config = { ...DEFAULTS };
    return { config, logic: new Component(config) };
  },

  computed: {
    // What the template renders against: the settings merged with renderVals(), as in the runtime.
    vals() {
      return { ...this.config, ...this.logic.renderVals() };
    },
  },

  watch: {
    // The runtime calls componentDidUpdate(prevProps) after each render. Only a settings change can
    // make prevProps differ, so it runs after the settings change, once the page has re-rendered.
    config: {
      deep: true,
      flush: 'post',
      handler() {
        const prevProps = this.prevProps;
        this.prevProps = { ...this.config };
        this.logic.componentDidUpdate(prevProps);
      },
    },
  },

  created() {
    this.prevProps = { ...this.config };
    // Development builds only: lets the parity tool set the pinned prototype settings the way
    // __dcSetProps does on the prototype (the defaults, overridden by the given settings).
    if (import.meta.env.DEV) {
      window.__paritySetProps = (props) => Object.assign(this.config, DEFAULTS, props);
    }
  },

  mounted() {
    this.logic.componentDidMount();
  },

  beforeUnmount() {
    this.logic.componentWillUnmount();
  },

  methods: {
    // Values in text render the way the runtime renders them: nothing for missing, null and true/false.
    shown(v) {
      return v !== undefined && v !== null && typeof v !== 'boolean';
    },
    str(v) {
      return this.shown(v) ? String(v) : '';
    },
    // Loops render nothing unless the value is an array.
    list(v) {
      return Array.isArray(v) ? v : [];
    },
  },
};
</script>
