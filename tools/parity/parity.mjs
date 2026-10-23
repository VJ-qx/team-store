#!/usr/bin/env node
// Parity checker: runs the same scenario against two versions of a page in headless Chrome
// and reports every difference.
//
//   --mode styles    Markup is expected to be identical (SCSS extraction). Compares every
//                    element's computed style, box, and text, plus a pixel diff.
//   --mode behavior  Markup may differ (Vue conversion). Compares what a user sees and what
//                    the page does: accessibility tree, form values, navigation, dialogs,
//                    console errors, requests, storage, plus a pixel diff.
//
// Usage:
//   node tools/parity/parity.mjs <scenario.mjs> --mode styles   [--a main] [--b .]
//   node tools/parity/parity.mjs <scenario.mjs> --mode behavior  --a main --b http://localhost:5173/
//   Options: --only <text>            run only states whose name contains <text>
//            --viewports 1440x900,...  override the scenario's viewports
//            --pixel-tolerance <n>     per-channel colour difference ignored as noise (default 10)
//            --keep                    keep the temporary git worktree for inspection
//
// A side (--a / --b) is a git ref (served from a temporary worktree), "." (the working tree),
// or an http(s) URL used as-is (for example a Vite dev server).
// Exit code: 0 = identical, 1 = differences found, 2 = the run itself failed.

import { mkdirSync, writeFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright-core';
import { git, openSide, repoRoot } from './lib.mjs';

// ── arguments ──
const opts = { a: 'main', b: '.', mode: null, only: null, keep: false };
const positional = [];
const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '--keep') opts.keep = true;
  else if (argv[i].startsWith('--')) opts[argv[i].slice(2)] = argv[++i];
  else positional.push(argv[i]);
}
if (!positional[0] || !['styles', 'behavior'].includes(opts.mode)) {
  console.error('Usage: node tools/parity/parity.mjs <scenario.mjs> --mode styles|behavior [--a <ref|.|url>] [--b <ref|.|url>] [--only <text>] [--keep]');
  process.exit(2);
}

// ── browser ──
// Software rendering with fixed settings, so identical pages render identical pixels
// (GPU rasterization anti-aliases rounded corners slightly differently between loads).
const CHROME_ARGS = ['--disable-gpu', '--disable-gpu-rasterization', '--disable-partial-raster', '--disable-skia-runtime-opts', '--force-color-profile=srgb', '--run-all-compositor-stages-before-draw'];
async function launch() {
  try { return await chromium.launch({ channel: 'chrome', args: CHROME_ARGS }); } catch {}
  try { return await chromium.launch({ args: CHROME_ARGS }); } catch {}
  throw new Error('No browser found. Install Google Chrome, or run: npx playwright install chromium');
}

// CDN files (React, Babel, Google Fonts) are fetched once and reused across every page load,
// so both sides get the same bytes at the same speed.
const cdnCache = new Map();
async function cacheCdn(context) {
  await context.route(/^https:\/\/(unpkg\.com|cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com|fonts\.googleapis\.com|fonts\.gstatic\.com)\//, async (route) => {
    const url = route.request().url();
    let hit = cdnCache.get(url);
    if (!hit) {
      const response = await route.fetch();
      const headers = { ...response.headers() };
      delete headers['content-encoding'];
      delete headers['content-length'];
      hit = { status: response.status(), headers, body: await response.body() };
      if (hit.status === 200) cdnCache.set(url, hit);
    }
    await route.fulfill(hit);
  });
}

const stripOrigin = (url) => url.replace(/^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?/, '');

// Pages that show random sample data (scenario `seedRandom: true`) get the same Math.random
// numbers on both sides. Each calling function gets its own seeded sequence, named after the
// nearest named function on the stack (makeSeedStores, …), so a Vue conversion that keeps the
// data functions draws the same numbers as the prototype, even though the frameworks themselves
// call Math.random a different number of times.
const SEEDED_RANDOM = `(() => {
  const streams = new Map();
  const seedOf = (name) => { let h = 0x811c9dc5; for (let i = 0; i < name.length; i++) { h ^= name.charCodeAt(i); h = Math.imul(h, 0x01000193); } return (h >>> 0) || 0x2545f491; };
  const SKIP = /^(random|map|forEach|filter|reduce|reduceRight|flatMap|some|every|find|findIndex|from|sort|call|apply|eval|Function|<anonymous>)$/;
  const caller = () => {
    for (const line of (new Error().stack || '').split('\\n').slice(2)) {
      const m = line.match(/^\\s*at (?:new |async )?([^\\s(]+) \\(/);
      if (!m) continue;
      const name = m[1].split('.').pop();
      if (!SKIP.test(name)) return name;
    }
    return '';
  };
  Math.random = function random() {
    const key = caller();
    let s = streams.has(key) ? streams.get(key) : seedOf(key);
    s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0;
    streams.set(key, s);
    return s / 4294967296;
  };
})();`;

// Console messages from the prototype host's in-browser JSX compiler (Babel), not from the page itself.
// A Vue build never prints them, so they are left out of the comparison.
const RUNTIME_NOISE = [/^\[BABEL\] Note: The code generator has deoptimised the styling of /];

async function openPage(browser, viewport, { seedRandom = false } = {}) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  await cacheCdn(context);
  if (seedRandom) await context.addInitScript(SEEDED_RANDOM);
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  const log = { errors: [], dialogs: [], requests: [], navigations: [], started: false };
  page.on('console', (m) => { if (m.type() === 'error' && !RUNTIME_NOISE.some((r) => r.test(m.text()))) log.errors.push(m.text()); });
  page.on('pageerror', (e) => log.errors.push(String(e?.message || e)));
  page.on('dialog', async (d) => { log.dialogs.push(`${d.type()}: ${d.message()}`); await d.dismiss().catch(() => {}); });
  page.on('request', (r) => {
    if (log.started && ['document', 'xhr', 'fetch'].includes(r.resourceType())) log.requests.push(`${r.method()} ${stripOrigin(r.url())}`);
  });
  page.on('framenavigated', (f) => { if (log.started && f === page.mainFrame()) log.navigations.push(stripOrigin(f.url())); });
  return { context, page, log };
}

async function applyProps(page, props) {
  return page.evaluate((p) => {
    if (typeof window.__dcSetProps === 'function') { window.__dcSetProps(window.__dcRootName(), p); return 'dc'; }
    if (typeof window.__paritySetProps === 'function') { window.__paritySetProps(p); return 'hook'; }
    return null;
  }, props);
}

// Let the page finish: network, a short real-time pause for rendering, then every CSS
// animation and transition jumped to its end (infinite ones paused at their start).
async function settle(page, ms) {
  await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
  await page.waitForTimeout(ms);
  await page.evaluate(async () => {
    // Wait until no font is still loading (a font requested late would otherwise change text widths).
    for (let i = 0; i < 20 && document.fonts && document.fonts.status !== 'loaded'; i++) await document.fonts.ready;
    for (const a of document.getAnimations()) {
      try {
        if (a.effect?.getComputedTiming?.().iterations === Infinity) { a.pause(); a.currentTime = 0; } else a.finish();
      } catch {}
    }
  }).catch(() => {});
}

function describe(step) {
  const [kind, value] = Object.entries(step).find(([k]) => k !== 'label' && k !== 'on');
  return Array.isArray(value) ? `${kind} ${JSON.stringify(value[0])} = ${JSON.stringify(value[1])}` : `${kind} ${JSON.stringify(value)}`;
}

async function runStep(page, step) {
  const loc = (sel) => page.locator(sel).first();
  if (step.click) await loc(step.click).click();
  else if (step.fill) await loc(step.fill[0]).fill(step.fill[1]);
  else if (step.type) await loc(step.type[0]).pressSequentially(step.type[1]);
  else if (step.hover) await loc(step.hover).hover();
  else if (step.focus) await loc(step.focus).focus();
  else if (step.select) await loc(step.select[0]).selectOption(step.select[1]);
  else if (step.press) await page.keyboard.press(step.press);
  else if (step.scroll) await loc(step.scroll).scrollIntoViewIfNeeded();
  else if (step.wait) await page.clock.runFor(step.wait);
  else if (step.eval) await page.evaluate(step.eval);
  else throw new Error(`Unknown step: ${JSON.stringify(step)}`);
  if (!step.hover && !step.wait && !step.eval) await page.mouse.move(0, 0);
}

// ── capture: styles mode ──
function collectStyles() {
  const SKIP = new Set(['SCRIPT', 'STYLE', 'LINK', 'META', 'TEMPLATE', 'NOSCRIPT', 'TITLE', 'BASE']);
  const hash = (s) => { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); } return (h >>> 0).toString(36); };
  // Sorted: Chrome enumerates custom properties in no fixed order.
  // Margins are compared by their computed CSS value ("auto", "12px"), not the resolved pixels:
  // Chrome sometimes reports an auto margin as 0px although the element is laid out the same.
  // Any visible effect of a margin still shows in the element's box and the pixel diff.
  const value = (cs, p, el) => {
    if (el && p.startsWith('margin') && el.computedStyleMap) { try { const v = el.computedStyleMap().get(p); if (v) return String(v); } catch {} }
    return cs.getPropertyValue(p);
  };
  const styleString = (cs, el) => Array.from(cs).sort().map((p) => p + ':' + value(cs, p, el)).join(';');
  const pseudo = (el, which) => {
    const cs = getComputedStyle(el, which);
    const c = cs.getPropertyValue('content');
    return c && c !== 'none' && c !== 'normal' ? which + '{' + styleString(cs) + '}' : '';
  };
  const els = new Map();
  const out = [];
  const visit = (el, key) => {
    els.set(key, el);
    const r = el.getBoundingClientRect();
    const text = Array.from(el.childNodes).filter((n) => n.nodeType === 3).map((n) => n.textContent).join(' ').replace(/\s+/g, ' ').trim().slice(0, 80);
    out.push({
      key, tag: el.tagName.toLowerCase(), id: el.id || '', cls: (el.getAttribute('class') || '').trim().split(/\s+/)[0] || '', text,
      hash: hash(styleString(getComputedStyle(el), el) + pseudo(el, '::before') + pseudo(el, '::after')),
      box: [r.x, r.y, r.width, r.height].map((v) => Math.round(v * 100) / 100),
    });
    const counts = {};
    for (const child of el.children) {
      if (SKIP.has(child.tagName)) continue;
      const t = child.tagName.toLowerCase();
      counts[t] = (counts[t] || 0) + 1;
      visit(child, `${key}>${t}:${counts[t]}`);
    }
  };
  visit(document.body, 'body');
  window.__parityEls = els;
  return out;
}
function styleDetails(keys) {
  const read = (cs, el) => {
    const o = {};
    for (let i = 0; i < cs.length; i++) {
      const p = cs[i];
      let v = cs.getPropertyValue(p);
      if (el && p.startsWith('margin') && el.computedStyleMap) { try { const t = el.computedStyleMap().get(p); if (t) v = String(t); } catch {} }
      o[p] = v;
    }
    return o;
  };
  return keys.map((k) => {
    const el = window.__parityEls?.get(k);
    return el ? { self: read(getComputedStyle(el), el), '::before': read(getComputedStyle(el, '::before')), '::after': read(getComputedStyle(el, '::after')) } : null;
  });
}
const label = (e) => `<${e.tag}${e.id ? '#' + e.id : ''}${e.cls ? '.' + e.cls : ''}>${e.text ? ` "${e.text.slice(0, 40)}"` : ''}`;
const shortKey = (k) => k.split('>').slice(-3).join('>');

async function compareStyles(pa, pb) {
  const [la, lb] = await Promise.all([pa.evaluate(collectStyles), pb.evaluate(collectStyles)]);
  const ma = new Map(la.map((e) => [e.key, e]));
  const mb = new Map(lb.map((e) => [e.key, e]));
  const diffs = [];
  for (const e of la) if (!mb.has(e.key)) diffs.push({ kind: 'missing', detail: `${label(e)} exists in A but not in B (${shortKey(e.key)})` });
  for (const e of lb) if (!ma.has(e.key)) diffs.push({ kind: 'extra', detail: `${label(e)} exists in B but not in A (${shortKey(e.key)})` });
  const styleKeys = [];
  for (const a of la) {
    const b = mb.get(a.key);
    if (!b) continue;
    if (a.hash !== b.hash) styleKeys.push(a.key);
    else if (a.box.join() !== b.box.join()) diffs.push({ kind: 'box', detail: `${label(b)} box [x,y,w,h] ${a.box.join(',')} → ${b.box.join(',')} (${shortKey(a.key)})` });
    if (a.text !== b.text) diffs.push({ kind: 'text', detail: `${label(b)} text "${a.text}" → "${b.text}"` });
  }
  const keys = styleKeys.slice(0, 200);
  if (keys.length) {
    const [da, db] = await Promise.all([pa.evaluate(styleDetails, keys), pb.evaluate(styleDetails, keys)]);
    keys.forEach((key, i) => {
      const changes = [];
      for (const part of ['self', '::before', '::after']) {
        const A = da[i]?.[part] || {};
        const B = db[i]?.[part] || {};
        for (const p of new Set([...Object.keys(A), ...Object.keys(B)])) {
          if (A[p] !== B[p]) changes.push(`${part === 'self' ? '' : part + ' '}${p}: ${A[p] ?? '(unset)'} → ${B[p] ?? '(unset)'}`);
        }
      }
      const a = ma.get(key);
      const b = mb.get(key);
      const box = a.box.join() !== b.box.join() ? ` · box ${a.box.join(',')} → ${b.box.join(',')}` : '';
      diffs.push({ kind: 'style', detail: `${label(b)} (${shortKey(key)})${box}`, changes });
    });
    if (styleKeys.length > keys.length) diffs.push({ kind: 'style', detail: `…and ${styleKeys.length - keys.length} more elements with style differences` });
  }
  return diffs;
}

// ── capture: behavior mode ──
async function captureBehavior(page) {
  const aria = await page.locator('body').ariaSnapshot().catch((e) => `(accessibility snapshot failed: ${e.message})`);
  const fields = await page.evaluate(() => Array.from(document.querySelectorAll('input, select, textarea'))
    .filter((el) => el.type !== 'hidden' && (el.offsetWidth || el.offsetHeight || el.getClientRects().length))
    .map((el) => ({
      field: el.getAttribute('aria-label') || el.getAttribute('placeholder') || el.getAttribute('name') || el.id || el.tagName.toLowerCase(),
      type: el.type, value: el.value, checked: el.type === 'checkbox' || el.type === 'radio' ? el.checked : undefined, disabled: el.disabled,
    }))).catch(() => []);
  const storage = await page.evaluate(() => JSON.stringify({ local: { ...localStorage }, session: { ...sessionStorage } })).catch(() => '{}');
  const title = await page.title().catch(() => '');
  return { aria, fields, storage, title };
}
function lineDiff(a, b) {
  if (a === b) return [];
  const A = a.split('\n');
  const B = b.split('\n');
  const n = A.length;
  const m = B.length;
  if (n * m > 25e6) return [`(snapshots too large to diff line by line: ${n} vs ${m} lines)`];
  const dp = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) dp[i][j] = A[i] === B[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const out = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (A[i] === B[j]) { i++; j++; } else if (dp[i + 1][j] >= dp[i][j + 1]) out.push('- ' + A[i++]); else out.push('+ ' + B[j++]);
  }
  while (i < n) out.push('- ' + A[i++]);
  while (j < m) out.push('+ ' + B[j++]);
  return out;
}
function compareBehavior(a, b) {
  const diffs = [];
  const aria = lineDiff(a.aria, b.aria);
  if (aria.length) diffs.push({ kind: 'aria', detail: 'What a user sees differs (accessibility tree, A → B)', changes: aria.slice(0, 80) });
  const fa = JSON.stringify(a.fields);
  const fb = JSON.stringify(b.fields);
  if (fa !== fb) diffs.push({ kind: 'fields', detail: 'Visible form fields differ', changes: lineDiff(a.fields.map((f) => JSON.stringify(f)).join('\n'), b.fields.map((f) => JSON.stringify(f)).join('\n')) });
  if (a.storage !== b.storage) diffs.push({ kind: 'storage', detail: `Storage differs: ${a.storage} → ${b.storage}` });
  if (a.title !== b.title) diffs.push({ kind: 'title', detail: `Title "${a.title}" → "${b.title}"` });
  return diffs;
}

// Events since the last checkpoint must match in both modes.
function compareEvents(la, lb) {
  const diffs = [];
  for (const [kind, name] of [['navigations', 'Navigation'], ['dialogs', 'Dialogs'], ['requests', 'Requests'], ['errors', 'Console errors']]) {
    const A = JSON.stringify(la[kind]);
    const B = JSON.stringify(lb[kind]);
    if (A !== B) diffs.push({ kind, detail: `${name} differ: ${A} → ${B}` });
  }
  return diffs;
}
function takeEvents(log) {
  const snap = { navigations: [...log.navigations], dialogs: [...log.dialogs], requests: [...log.requests], errors: [...log.errors] };
  log.navigations.length = 0;
  log.dialogs.length = 0;
  log.requests.length = 0;
  log.errors.length = 0;
  return snap;
}

// ── pixel diff, computed in a browser canvas so no image library is needed ──
let diffPage = null;
// A pixel only counts when a colour channel differs by more than `tolerance` (0–255):
// identical pages still show a few pixels of anti-aliasing noise (deltas of 1–8).
async function pixelDiff(browser, pngA, pngB, tolerance) {
  if (!diffPage) diffPage = await (await browser.newContext()).newPage();
  return diffPage.evaluate(async ([a, b, tol]) => {
    const load = (src) => new Promise((ok, fail) => { const i = new Image(); i.onload = () => ok(i); i.onerror = fail; i.src = src; });
    const [ia, ib] = await Promise.all([load(a), load(b)]);
    const w = Math.max(ia.width, ib.width);
    const h = Math.max(ia.height, ib.height);
    const pixels = (img) => { const c = new OffscreenCanvas(w, h); const x = c.getContext('2d'); x.drawImage(img, 0, 0); return x.getImageData(0, 0, w, h).data; };
    const da = pixels(ia);
    const db = pixels(ib);
    const out = new OffscreenCanvas(w, h);
    const ox = out.getContext('2d');
    const od = ox.createImageData(w, h);
    let diff = 0;
    const box = [w, h, -1, -1];
    for (let i = 0; i < da.length; i += 4) {
      if (Math.abs(da[i] - db[i]) > tol || Math.abs(da[i + 1] - db[i + 1]) > tol || Math.abs(da[i + 2] - db[i + 2]) > tol || Math.abs(da[i + 3] - db[i + 3]) > tol) {
        diff++; od.data[i] = 255; od.data[i + 3] = 255;
        const x = (i / 4) % w;
        const y = Math.floor(i / 4 / w);
        box[0] = Math.min(box[0], x); box[1] = Math.min(box[1], y); box[2] = Math.max(box[2], x); box[3] = Math.max(box[3], y);
      } else {
        const g = 255 - (255 - (da[i] + da[i + 1] + da[i + 2]) / 3) * 0.25;
        od.data[i] = od.data[i + 1] = od.data[i + 2] = g; od.data[i + 3] = 255;
      }
    }
    if (!diff) return { diff: 0, total: w * h, sizeA: [ia.width, ia.height], sizeB: [ib.width, ib.height] };
    ox.putImageData(od, 0, 0);
    const blob = await out.convertToBlob({ type: 'image/png' });
    const png = await new Promise((ok) => { const r = new FileReader(); r.onload = () => ok(r.result); r.readAsDataURL(blob); });
    return { diff, total: w * h, sizeA: [ia.width, ia.height], sizeB: [ib.width, ib.height], png, region: [box[0], box[1], box[2] - box[0] + 1, box[3] - box[1] + 1] };
  }, [`data:image/png;base64,${pngA.toString('base64')}`, `data:image/png;base64,${pngB.toString('base64')}`, tolerance]);
}

// ── run ──
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
const scenarioPath = resolve(positional[0]);
const scenario = (await import(pathToFileURL(scenarioPath).href)).default;
const scenarioName = scenario.name || basename(scenarioPath).replace(/\.m?js$/, '');
const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const outDir = join(repoRoot, '.parity', `${stamp}-${slug(scenarioName)}-${opts.mode}`);
mkdirSync(outDir, { recursive: true });
const viewports = opts.viewports
  ? opts.viewports.split(',').map((v) => { const [width, height] = v.split('x').map(Number); return { width, height }; })
  : scenario.viewports || [{ width: 1440, height: 900 }];
const states = (scenario.states || [{ name: 'default' }]).filter((s) => !opts.only || s.name.includes(opts.only));
const settleMs = scenario.settleMs ?? 150;
const pixelTolerance = Number(opts['pixel-tolerance'] ?? scenario.pixelTolerance ?? 10);

const results = [];
const notes = [];
let sides = [];
let browser = null;
const cleanup = async () => { await browser?.close().catch(() => {}); for (const s of sides) await s.close().catch(() => {}); };
process.on('SIGINT', async () => { await cleanup(); process.exit(2); });

try {
  git(['worktree', 'prune']);
  sides = [await openSide(opts.a, 'A', { keep: opts.keep }), await openSide(opts.b, 'B', { keep: opts.keep })];
  browser = await launch();
  console.log(`Parity (${opts.mode}): ${scenarioName}\n  A: ${sides[0].desc}\n  B: ${sides[1].desc}`);

  for (const viewport of viewports) {
    const vp = `${viewport.width}×${viewport.height}`;
    for (const state of states) {
      const pageOpts = { seedRandom: !!scenario.seedRandom };
      const pages = await Promise.all([openPage(browser, viewport, pageOpts), openPage(browser, viewport, pageOpts)]);
      const where = `${vp} · ${state.name}`;
      const dir = join(outDir, slug(vp), slug(state.name));
      try {
        // Load both, apply props, freeze timers so only `wait` steps advance them.
        const props = { ...(scenario.props || {}), ...(state.props || {}) };
        const startErrors = await Promise.all(pages.map(async (p, i) => {
          await p.page.goto(sides[i].url(scenario.page || '') + (state.query || ''), { waitUntil: 'load', timeout: 60000 });
          if (scenario.ready) await p.page.locator(scenario.ready).first().waitFor({ state: 'visible', timeout: 60000 });
          if (Object.keys(props).length && !(await applyProps(p.page, props))) return `${sides[i].label} has no way to set props (no window.__dcSetProps or window.__paritySetProps)`;
          // The installed clock keeps ticking until paused; leave a margin so the pause target is still ahead.
          await p.page.clock.install();
          await p.page.clock.pauseAt((await p.page.evaluate(() => Date.now())) + 250);
          await settle(p.page, settleMs);
          p.log.started = true;
          return null;
        }));
        if (startErrors.some(Boolean)) {
          notes.push(`Skipped ${where}: ${startErrors.filter(Boolean).join('; ')}`);
          console.log(`  SKIP  ${where}`);
          continue;
        }
        const startupErrors = pages.map((p) => [...p.log.errors]);
        pages.forEach((p) => { p.log.errors.length = 0; });
        if (startupErrors[0].length || startupErrors[1].length) {
          if (JSON.stringify(startupErrors[0]) === JSON.stringify(startupErrors[1])) notes.push(`${where}: console errors on load (both sides): ${JSON.stringify(startupErrors[0])}`);
          else results.push({ where, checkpoint: 'load', diffs: [{ kind: 'errors', detail: `Console errors on load differ: ${JSON.stringify(startupErrors[0])} → ${JSON.stringify(startupErrors[1])}` }] });
        }

        // A step with `on: 'prototype'` or `on: 'vue'` runs only on that kind of side, for example the
        // prototype's settings panel and the Vue version's __paritySetProps hook reaching the same state.
        // Side A is the prototype; side B is the prototype in styles mode and the Vue version in behavior mode.
        const kinds = ['prototype', opts.mode === 'behavior' ? 'vue' : 'prototype'];
        const runsOn = (step) => kinds.map((k) => !step || !step.on || step.on === k);
        const oneSided = (step) => { const r = runsOn(step); return r[0] !== r[1]; };
        const steps = [null, ...(state.steps || [])];
        for (let n = 0; n < steps.length; n++) {
          const step = steps[n];
          const runs = runsOn(step);
          if (!runs[0] && !runs[1]) continue;
          const checkpoint = step ? `${n}. ${describe(step)}${oneSided(step) ? ` (${step.on} only)` : ''}` : '0. start';
          const diffs = [];
          if (step) {
            const outcome = await Promise.all(pages.map((p, i) => (runs[i] ? runStep(p.page, step).then(() => null, (e) => e.message.split('\n')[0]) : null)));
            if (outcome[0] || outcome[1]) {
              if (outcome[0] !== outcome[1]) diffs.push({ kind: 'step', detail: `Step failed — A: ${outcome[0] || 'ok'} · B: ${outcome[1] || 'ok'}` });
              else notes.push(`${where}: step "${describe(step)}" failed on both sides: ${outcome[0]}`);
              results.push({ where, checkpoint, diffs });
              break;
            }
            await Promise.all(pages.map((p, i) => (runs[i] ? settle(p.page, settleMs) : null)));
            // One-sided steps are compared once both sides are back in step: after the last one in a row.
            if (oneSided(step) && n + 1 < steps.length && oneSided(steps[n + 1])) continue;
          }
          const events = pages.map((p) => takeEvents(p.log));
          diffs.push(...compareEvents(events[0], events[1]));
          const navigated = events[0].navigations.length || events[1].navigations.length;
          if (!navigated) {
            if (opts.mode === 'styles') diffs.push(...await compareStyles(pages[0].page, pages[1].page));
            else {
              const caps = await Promise.all(pages.map((p) => captureBehavior(p.page)));
              diffs.push(...compareBehavior(caps[0], caps[1]));
            }
            const shots = await Promise.all(pages.map((p) => p.page.screenshot({ fullPage: true, animations: 'disabled', caret: 'hide' })));
            const px = await pixelDiff(browser, shots[0], shots[1], pixelTolerance);
            if (px.diff) {
              mkdirSync(dir, { recursive: true });
              const base = join(dir, String(n).padStart(2, '0'));
              writeFileSync(`${base}-a.png`, shots[0]);
              writeFileSync(`${base}-b.png`, shots[1]);
              writeFileSync(`${base}-diff.png`, Buffer.from(px.png.split(',')[1], 'base64'));
              const size = px.sizeA.join() !== px.sizeB.join() ? ` · page size ${px.sizeA.join('×')} → ${px.sizeB.join('×')}` : '';
              diffs.push({ kind: 'pixels', detail: `${px.diff} of ${px.total} pixels differ (${((px.diff / px.total) * 100).toFixed(3)}%) within region [x,y,w,h] ${px.region.join(',')}${size} · ${base.slice(repoRoot.length + 1)}-{a,b,diff}.png` });
            }
          }
          results.push({ where, checkpoint, diffs });
          if (navigated) {
            notes.push(`${where}: "${checkpoint}" navigated to ${events[0].navigations.join(', ') || '(nowhere)'} on A and ${events[1].navigations.join(', ') || '(nowhere)'} on B — state ends here`);
            break;
          }
        }
        const bad = results.filter((r) => r.where === where && r.diffs.length).length;
        console.log(`  ${bad ? 'DIFF' : 'OK  '}  ${where}${bad ? ` (${bad} checkpoint${bad > 1 ? 's' : ''})` : ''}`);
      } catch (e) {
        notes.push(`Error in ${where}: ${e.message.split('\n')[0]}`);
        console.log(`  ERR   ${where}: ${e.message.split('\n')[0]}`);
      } finally {
        await Promise.all(pages.map((p) => p.context.close().catch(() => {})));
      }
    }
  }
} catch (e) {
  console.error(`Parity run failed: ${e.message}`);
  await cleanup();
  process.exit(2);
}
await cleanup();

// ── report ──
const failing = results.filter((r) => r.diffs.length);
const errored = notes.filter((n) => n.startsWith('Error in')).length;
const verdict = failing.length ? 'DIFFERENCES FOUND' : errored ? 'INCOMPLETE' : 'IDENTICAL';
const md = [
  `# Parity report: ${scenarioName} (${opts.mode})`, '',
  `- A: ${sides[0].desc}`, `- B: ${sides[1].desc}`, `- Date: ${new Date().toISOString()}`,
  `- Result: **${verdict}** — ${results.length - failing.length} of ${results.length} checkpoints identical`, '',
  '## Checkpoints', '', '| Where | Checkpoint | Result |', '|---|---|---|',
  ...results.map((r) => `| ${r.where} | ${r.checkpoint.replace(/\|/g, '\\|')} | ${r.diffs.length ? `${r.diffs.length} difference(s)` : 'identical'} |`), '',
];
if (failing.length) {
  md.push('## Differences', '');
  for (const r of failing) {
    md.push(`### ${r.where} — ${r.checkpoint}`, '');
    for (const d of r.diffs) {
      md.push(`- **${d.kind}**: ${d.detail}`);
      for (const c of (d.changes || []).slice(0, 80)) md.push(`  - \`${c.replace(/`/g, "'")}\``);
    }
    md.push('');
  }
}
if (notes.length) md.push('## Notes', '', ...notes.map((n) => `- ${n}`), '');
writeFileSync(join(outDir, 'report.md'), md.join('\n'));
writeFileSync(join(outDir, 'report.json'), JSON.stringify({ scenario: scenarioName, mode: opts.mode, a: sides[0].desc, b: sides[1].desc, verdict, results, notes }, null, 2));
console.log(`\n${verdict}: ${results.length - failing.length}/${results.length} checkpoints identical${notes.length ? `, ${notes.length} note(s)` : ''}`);
console.log(`Report: ${join(outDir, 'report.md').slice(repoRoot.length + 1)}`);
process.exit(failing.length ? 1 : errored ? 2 : 0);
