// Logic of "Landing Page.dc.html", copied verbatim from its <script type="text/x-dc">.
// Only the import and export lines are new, plus the approved changes marked "Approved change" below.
// DCLogic is a stand-in for the prototype runtime's base class.
import { DCLogic } from '../utils/dc-logic.js';
import { anyPaused, formatRemaining, pausedUntil, recordFailure } from './sign-in-lockout.js';

class Component extends DCLogic {
  state = {
    step: null, chosen: "prolook", email: "", pw: "", showPw: false, signInError: false,
    lockout: {}, // Approved change, not in the prototype yet: sign-in lockout. Email -> failed attempts and pause.
    profile: { firstName: "", lastName: "", phone: "", country: "", state: "", city: "", zip: "" },
    requested: {}, // brandId -> true once "Request access" was sent
    welcomePrimary: null, welcomeDismissed: false, welcomeConnected: {},
  };

  componentDidUpdate(prevProps) {
    if (this.props.showWelcomeModal && !prevProps.showWelcomeModal) {
      this.setState({ welcomeDismissed: false, welcomePrimary: null, welcomeConnected: {} });
    }
  }

  isValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v || "").trim()); }

  // Which brand Customizers an email is entitled to (dealership → brands in qx7).
  // MVP showcase: Prolook is the only connected Customizer for every account.
  entitlementsFor(email) {
    const e = (email || "").toLowerCase().trim();
    if (!this.isValidEmail(e)) return [];
    if (!(this.props.emailInDealerRecords ?? true)) return [];
    return ["prolook"];
  }

  customizerList() {
    return [
      { id: "prolook", name: "PROLOOK", img: "assets/prolook-mark-black.png" },
      { id: "alli", name: "Alli Sports", word: "ALLI SPORTS" },
      { id: "riddell", name: "Riddell", word: "Riddell" },
      { id: "game-one", name: "Game One", word: "GAME ONE" },
      { id: "legends", name: "Legends", word: "LEGENDS" },
      { id: "axe", name: "Axe", word: "AXE" },
      { id: "baden", name: "Baden", word: "BADEN" },
      { id: "perfect-game", name: "Perfect Game", word: "PERFECT GAME" },
    ];
  }

  brandToId(name) {
    return ({ "PROLOOK": "prolook", "Alli Sports": "alli", "Riddell": "riddell", "Game One": "game-one", "Legends": "legends", "Axe": "axe", "Baden": "baden", "Perfect Game": "perfect-game" })[name] || "prolook";
  }

  // Password criteria (Landing Page, Epic D): 12–128 chars, not common/breached, must not contain the email.
  pwRules() {
    const pw = this.state.pw || "";
    const email = (this.state.email || "").toLowerCase().trim();
    const local = email.split("@")[0];
    const common = ["password", "123456", "qwerty", "letmein", "teamstores", "welcome1"];
    const low = pw.toLowerCase();
    return [
      { ok: pw.length >= 12 && pw.length <= 128, label: "At least 12 characters (any characters, spaces included)" },
      { ok: pw.length > 0 && !common.some((c) => low.includes(c)), label: "Not a common or previously breached password" },
      { ok: pw.length > 0 && !(email && low.includes(email)) && !(local && local.length > 2 && low.includes(local)), label: "Doesn't contain your email address" },
    ];
  }

  // Location lookup — stands in for the map service used in production.
  countries() { return ["United States", "Canada", "Mexico", "United Kingdom", "Australia", "Germany", "France", "Japan", "Brazil"]; }
  statesFor(country) {
    const c = (country || "").trim().toLowerCase();
    if (c === "canada") return ["Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador", "Nova Scotia", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan"];
    if (c === "mexico") return ["Baja California", "Chihuahua", "Jalisco", "Mexico City", "Nuevo León", "Puebla", "Sonora", "Yucatán"];
    if (c === "australia") return ["New South Wales", "Queensland", "South Australia", "Tasmania", "Victoria", "Western Australia"];
    if (c && c !== "united states") return [];
    return ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];
  }
  comboOptions(list, query, selected, pick) {
    const q = (query || "").trim().toLowerCase();
    const exact = list.some((x) => x.toLowerCase() === q);
    const items = exact || !q ? list : list.filter((x) => x.toLowerCase().includes(q));
    return items.map((label) => ({ label,
      style: "display:block; width:100%; text-align:left; border:0; border-radius:7px; padding:10px 10px; font-family:inherit; font-size:14px; cursor:pointer; " + (label === selected ? "background:#f4f4f5; color:#09090b; font-weight:700;" : "background:transparent; color:#09090b;"),
      onPick: (e) => { e.preventDefault(); pick(label); } }));
  }

  gotoWorkspace(brandId, noAccess, auth) {
    const base = encodeURI("Team Stores Workspace.dc.html");
    const q = ["brand=" + (brandId || "prolook"), "auth=" + (auth || "customizer")];
    if (noAccess) q.push("access=none");
    window.location.href = base + "?" + q.join("&");
  }

  // Customizer password auth → gate → Overview.
  doSignIn() {
    const hasAccess = this.props.hasAccess ?? true;
    if (hasAccess) {
      this.setState({ step: "success" });
      setTimeout(() => this.gotoWorkspace(this.state.chosen, false, "customizer"), 1700);
    } else {
      this.gotoWorkspace(this.state.chosen, true, "customizer");
    }
  }

  // Native sign-in. Demo: any well-formed email + non-empty password succeeds;
  // the literal password "wrong" shows the non-revealing failure message.
  doNativeSignIn() {
    if (!this.isValidEmail(this.state.email) || !this.state.pw) return;
    // Approved change, not in the prototype yet: sign-in lockout (docs/README.md#approved-changes).
    // No attempt while sign-in for this email is paused. The fifth wrong password in a row pauses it,
    // clears the password, and shows the paused notice instead of the error.
    if (pausedUntil(this.state.lockout, this.state.email, Date.now())) return;
    if (this.state.pw.toLowerCase() === "wrong") {
      const lockout = recordFailure(this.state.lockout, this.state.email, Date.now());
      if (pausedUntil(lockout, this.state.email, Date.now())) {
        this.setState({ lockout, pw: "", signInError: false });
        this.watchPause();
      } else {
        this.setState({ lockout, signInError: true });
      }
      return;
    }
    const hasAccess = this.props.hasAccess ?? true;
    if (hasAccess) {
      this.setState({ step: "success", signInError: false });
      setTimeout(() => this.gotoWorkspace("prolook", false, "native"), 1700);
    } else {
      this.gotoWorkspace("prolook", true, "native");
    }
  }

  // Approved change, not in the prototype yet: sign-in lockout (docs/README.md#approved-changes).
  // While any email is paused, re-render every second so the countdown moves and the notice goes
  // away when the pause ends.
  watchPause() {
    if (this.pauseTimer) return;
    this.pauseTimer = setInterval(() => {
      const now = Date.now();
      this.setState({ pauseTick: now });
      if (!anyPaused(this.state.lockout, now)) { clearInterval(this.pauseTimer); this.pauseTimer = null; }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.pauseTimer);
  }

  // Native sign-up complete → dealership check against qx7.
  // Found → entitled brands surface for connection (workspace welcome, native variant).
  // Not found → business registration (Stripe form) and no access until Prolook approves.
  doSignup() {
    const found = this.props.signupDealershipFound ?? false;
    this.setState({ step: "checking" });
    setTimeout(() => {
      if (found) this.setState({ step: "connect", connectSel: { prolook: true } });
      else { // no dealership → Stripe organization registration, no access until approved
        this.setState({ step: "notfound" });
        setTimeout(() => this.gotoWorkspace("prolook", true, "native-new"), 2200);
      }
    }, 1500);
  }

  renderVals() {
    const signedIn = this.props.signedIn ?? true;
    const hasAccess = this.props.hasAccess ?? true;
    const brandName = this.props.brandCustomizer ?? "PROLOOK";
    const showPreview = this.props.showDashboardPreview ?? true;
    const accountExists = this.props.customizerAccountExists ?? true;
    const step = this.state.step;
    const s = this.state;

    const brandId = signedIn ? this.brandToId(brandName) : "prolook";
    const brandIsProlook = brandId === "prolook";

    // ── Welcome & Primary Brand modal ──
    const showWelcome = this.props.showWelcomeModal ?? false;
    const welcomeNative = this.props.welcomeNativePath ?? false;
    const welcomeMulti = !welcomeNative && (this.props.welcomeMultiBrand ?? false);
    const origin = this.customizerList().find((c) => c.id === brandId) || this.customizerList()[0];
    const welcomePrimary = s.welcomePrimary || origin.id;
    const accessible = [origin];
    const welcomeBrands = accessible.map((c) => ({ ...c, isImg: !!c.img, isWord: !c.img, selected: c.id === welcomePrimary, onSelect: () => this.setState({ welcomePrimary: c.id }) }));
    const welcomeConnectBrands = accessible.map((c) => {
      const connected = !!s.welcomeConnected[c.id];
      return { ...c, isImg: !!c.img, isWord: !c.img, initial: c.name[0], connected, notConnected: !connected,
        sub: connected ? "Connected · reuses your " + c.name + " Customizer account" : "Customizer account found for your email",
        onConnect: () => this.setState({ welcomeConnected: { ...s.welcomeConnected, [c.id]: true } }) };
    });
    const anyConnected = welcomeConnectBrands.some((c) => c.connected);
    const welcomeOpen = showWelcome && !s.welcomeDismissed;

    // ── Choose-a-Customizer: entitled brands, validated per brand for an existing account ──
    const entitledIds = this.entitlementsFor(s.email);
    const customizers = this.customizerList().filter((c) => entitledIds.includes(c.id)).map((c) => {
      const hasAccount = accountExists;
      const pending = !!s.requested[c.id];
      return { ...c, isImg: !!c.img, isWord: !c.img, initial: c.name[0], hasAccount, noAccount: !hasAccount, pending, notPending: !pending,
        onSelect: () => this.setState({ chosen: c.id, pw: "", showPw: false, step: "creds" }),
        onRequest: () => this.setState({ requested: { ...s.requested, [c.id]: true } }) };
    });
    const chosen = this.customizerList().find((c) => c.id === s.chosen) || this.customizerList()[0];
    const emailValid = this.isValidEmail(s.email);
    // Approved change, not in the prototype yet: sign-in lockout. When sign-in for the typed email is paused until.
    const now = Date.now();
    const paused = pausedUntil(s.lockout, s.email, now);
    const rules = this.pwRules();
    const pwOk = rules.every((r) => r.ok);
    const emailTaken = emailValid && /^(hinglemycringle|demo|existing)@/i.test(s.email.trim());
    const p = s.profile;
    const profileOk = p.firstName.trim() && p.lastName.trim() && p.phone.trim() && p.country.trim() && p.state.trim() && p.city.trim() && p.zip.trim();

    const btn = (enabled, mt) => "margin-top:" + mt + "px; width:100%; border:0; border-radius:8px; padding:13px; font-family:inherit; font-size:15px; font-weight:600; " +
      (enabled ? "background:#09090b; color:#fff; cursor:pointer;" : "background:#e4e4e7; color:#a1a1aa; cursor:not-allowed;");

    const onEnter = () => {
      if (signedIn) this.gotoWorkspace(brandId, !hasAccess, "customizer");
      else this.setState({ step: "home", email: "", pw: "", showPw: false, signInError: false });
    };
    const setP = (k) => (e) => this.setState({ profile: { ...this.state.profile, [k]: e.target.value } });
    const connectSel = s.connectSel || {};
    const connectBrands = this.customizerList().filter((c) => c.id === "prolook").map((c) => {
      const selected = !!connectSel[c.id];
      return { ...c, isImg: !!c.img, isWord: !c.img, initial: c.name[0], selected,
        rowStyle: "display:flex; align-items:center; gap:14px; width:100%; padding:14px 16px; border-radius:12px; cursor:pointer; font-family:inherit; " + (selected ? "background:#fff; border:2px solid #09090b;" : "background:#fafafa; border:2px solid #e4e4e7;"),
        checkStyle: "width:24px; height:24px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; flex-shrink:0; " + (selected ? "background:#09090b;" : "background:#fff; border:1.5px solid #d4d4d8;"),
        onToggle: () => this.setState({ connectSel: { ...connectSel, [c.id]: !selected } }) };
    });
    const connectAny = connectBrands.some((c) => c.selected);
    const countryOptions = this.comboOptions(this.countries(), p.country, p.country, (v) => this.setState({ profile: { ...this.state.profile, country: v, state: "" }, combo: null }));
    const stateOptions = this.comboOptions(this.statesFor(p.country), p.state, p.state, (v) => this.setState({ profile: { ...this.state.profile, state: v }, combo: null }));

    return {
      signedIn, notSignedIn: !signedIn, showPreview,
      accountName: "Hingle McCringleberry",
      headerIsImg: brandIsProlook, headerIsWord: !brandIsProlook, headerImg: "assets/prolook-mark-ink.png", headerWord: brandName,

      // modal state
      modalOpen: step !== null,
      stepHome: step === "home",
      stepSignup1: step === "signup1",
      stepSignup2: step === "signup2",
      stepChecking: step === "checking",
      stepNotFound: step === "notfound",
      stepConnect: step === "connect",
      stepForgot: step === "forgot",
      stepForgotSent: step === "forgot-sent",
      stepIntro: step === "intro",
      stepChoose: step === "choose",
      stepCreds: step === "creds",
      stepSuccess: step === "success",
      showClose: step !== null && step !== "success",
      successTitle: s.signupDone ? "You're all set" : "You're signed in",
      successCopy: s.signupDone ? (s.connectedAny ? "Brands connected — opening your Team Stores dashboard…" : "Opening your Team Stores dashboard…") : "Opening your Team Stores dashboard…",

      // post sign-up brand connection
      connectBrands,
      connectDisabled: !connectAny,
      connectStyle: btn(connectAny, 24),
      connectCta: connectAny ? "Connect & Enter Team Stores" : "Select a brand to connect",
      doConnectEnter: () => {
        if (!connectAny) return;
        this.setState({ step: "success", connectedAny: true });
        setTimeout(() => this.gotoWorkspace("prolook", false, "native-connected"), 1500);
      },
      skipConnect: () => {
        this.setState({ step: "success", connectedAny: false });
        setTimeout(() => this.gotoWorkspace("prolook", false, "native"), 1500);
      },

      // native sign-in
      signInError: s.signInError,
      // Approved change, not in the prototype yet: sign-in lockout (docs/README.md#approved-changes).
      signInPaused: paused > 0,
      signInPausedFor: formatRemaining(paused - now),
      nativeSignInDisabled: !(emailValid && s.pw) || paused > 0,
      nativeSignInStyle: btn(emailValid && s.pw && !paused, 18),
      doNativeSignIn: () => this.doNativeSignIn(),

      // sign-up
      pwRules: rules.map((r) => ({ ...r,
        dotStyle: "width:18px; height:18px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; flex-shrink:0; " + (r.ok ? "background:#16a34a;" : "background:#fff; border:1.5px solid #d4d4d8;"),
        textStyle: r.ok ? "color:#09090b;" : "color:#71717a;" })),
      emailTaken,
      signup1Disabled: !(emailValid && pwOk) || emailTaken,
      signup1Style: btn(emailValid && pwOk && !emailTaken, 20),
      p,
      onFirst: setP("firstName"), onLast: setP("lastName"),
      onPhone: (e) => {
        const d = e.target.value.replace(/\D/g, "").slice(0, 10);
        const f = d.length > 6 ? "(" + d.slice(0, 3) + ") " + d.slice(3, 6) + "-" + d.slice(6)
          : d.length > 3 ? "(" + d.slice(0, 3) + ") " + d.slice(3)
          : d.length > 0 ? "(" + d : "";
        this.setState({ profile: { ...this.state.profile, phone: f } });
      },
      onCountry: (e) => this.setState({ profile: { ...this.state.profile, country: e.target.value, state: "" }, combo: "country" }),
      onState: (e) => this.setState({ profile: { ...this.state.profile, state: e.target.value }, combo: "state" }),
      onCity: setP("city"), onZip: setP("zip"),
      // typeahead comboboxes
      countryOpen: s.combo === "country", stateOpen: s.combo === "state",
      openCountry: () => this.setState({ combo: "country" }), openState: () => this.setState({ combo: "state" }),
      toggleCountry: (e) => { e.preventDefault(); this.setState({ combo: s.combo === "country" ? null : "country" }); },
      toggleState: (e) => { e.preventDefault(); this.setState({ combo: s.combo === "state" ? null : "state" }); },
      closeCombos: () => setTimeout(() => this.setState({ combo: null }), 120),
      countryOptions, countryEmpty: countryOptions.length === 0,
      stateOptions, stateEmpty: stateOptions.length === 0,
      signup2Disabled: !profileOk,
      signup2Style: btn(profileOk, 24),
      doSignup: () => { if (profileOk) { this.setState({ signupDone: true }); this.doSignup(); } },

      // forgot password
      doForgot: () => { if (emailValid) this.setState({ step: "forgot-sent" }); },

      // Customizer path
      customizers,
      hasEntitlements: customizers.length > 0,
      noEntitlements: customizers.length === 0,
      noUsableBrand: customizers.length > 0 && customizers.every((c) => !c.hasAccount),
      chosenIsImg: !!chosen.img, chosenIsWord: !chosen.img, chosenImg: chosen.img, chosenWord: chosen.word, chosenName: chosen.name,
      emailValue: s.email,
      onEmailInput: (e) => this.setState({ email: e.target.value, signInError: false }),
      continueDisabled: !emailValid,
      continueStyle: "flex:1; border:0; border-radius:8px; padding:12px; font-family:inherit; font-size:15px; font-weight:500; " + (emailValid ? "background:#09090b; color:#fff; cursor:pointer;" : "background:#e4e4e7; color:#a1a1aa; cursor:not-allowed;"),
      continueStyleFull: btn(emailValid, 24),
      onContinueEmail: () => { if (emailValid) this.setState({ step: "choose" }); },
      backToEmail: () => this.setState({ step: "intro" }),
      pwValue: s.pw,
      onPwInput: (e) => this.setState({ pw: e.target.value, signInError: false }),
      pwInputType: s.showPw ? "text" : "password",
      pwHidden: !s.showPw, pwShown: s.showPw,
      togglePw: () => this.setState((st) => ({ showPw: !st.showPw })),

      // welcome & primary brand modal
      welcomeOpen,
      welcomeFederated: !welcomeNative,
      welcomeNative,
      welcomeMulti,
      welcomeSingle: !welcomeNative && !welcomeMulti,
      welcomeBrands,
      welcomeConnectBrands,
      welcomeEmail: "hinglemycringle@prolook.com",
      welcomeNativeHint: anyConnected ? "Set your primary brand anytime from My Account." : "No primary brand is set until you connect one. You can connect brands later from My Account.",
      welcomeOriginName: origin.name, welcomeOriginWord: origin.word, welcomeOriginIsImg: !!origin.img, welcomeOriginIsWord: !origin.img,
      // Approved change, not in the prototype yet: helper line and Confirm & Enter for a one-brand rep (docs/README.md#approved-changes).
      // A Customizer rep sees "Confirm & Enter" with one brand too; a Team Stores account keeps "Continue to Workspace".
      welcomeCta: welcomeMulti || !welcomeNative ? "Confirm & Enter" : "Continue to Workspace",
      welcomeConfirm: () => this.gotoWorkspace(welcomeNative ? "prolook" : welcomePrimary, !hasAccess, welcomeNative ? "native" : "customizer"),
      welcomeClose: () => this.setState({ welcomeDismissed: true }),

      // navigation
      onEnter,
      openSignIn: () => this.setState({ step: "home", email: "", pw: "", showPw: false, signInError: false }),
      goHome: () => this.setState({ step: "home", pw: "", showPw: false, signInError: false }),
      goSignup: () => this.setState({ step: "signup1", pw: "", showPw: false }),
      goSignup1: () => this.setState({ step: "signup1" }),
      goSignup2: () => { if (emailValid && pwOk && !emailTaken) this.setState({ step: "signup2" }); },
      goForgot: () => this.setState({ step: "forgot" }),
      goCustomizer: () => this.setState({ step: "intro", pw: "", showPw: false }),
      goChoose: () => this.setState({ step: "choose" }),
      doSignIn: () => this.doSignIn(),
      closeModal: () => this.setState({ step: null, signupDone: false }),
      stop: (e) => { e.stopPropagation(); },
    };
  }
}

export default Component;
