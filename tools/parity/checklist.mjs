#!/usr/bin/env node
// Writes a manual check list from a parity scenario: every state, the settings it needs,
// the clicks that reach it, and the related pages outside the page.
//
// Usage:
//   node tools/parity/checklist.mjs <scenario.mjs> [--mode styles|behavior] [--a-url <url>] [--b-url <url>] [--out <file>]
//
// URLs default to `npm run preview` (original on :8001, new on :8000). In behavior mode the
// new version defaults to the Vite dev server at http://localhost:5173/.

import { mkdirSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { encodePage, repoRoot } from './lib.mjs';

const opts = { mode: 'styles' };
const positional = [];
const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i++) {
  if (argv[i].startsWith('--')) opts[argv[i].slice(2)] = argv[++i];
  else positional.push(argv[i]);
}
if (!positional[0] || !['styles', 'behavior'].includes(opts.mode)) {
  console.error('Usage: node tools/parity/checklist.mjs <scenario.mjs> [--mode styles|behavior] [--a-url <url>] [--b-url <url>] [--out <file>]');
  process.exit(2);
}

const scenarioPath = resolve(positional[0]);
const scenario = (await import(pathToFileURL(scenarioPath).href)).default;
const name = scenario.name || basename(scenarioPath).replace(/\.m?js$/, '');
const slug = basename(scenarioPath).replace(/\.m?js$/, '');
const behavior = opts.mode === 'behavior';
const aUrl = opts['a-url'] || `http://127.0.0.1:8001/${encodePage(scenario.page)}`;
const bUrl = opts['b-url'] || (behavior ? 'http://localhost:5173/landing.html' : `http://127.0.0.1:8000/${encodePage(scenario.page)}`);

// Turn a Playwright selector into words a reviewer can follow.
function target(sel) {
  let m;
  if ((m = sel.match(/^role=(\w+)\[name="(.*)" s\]$/))) return `the "${m[2]}" ${m[1]}`;
  if ((m = sel.match(/^role=(\w+)\[name=\/(.*)\/i\]$/))) return `the ${m[1]} containing "${m[2].replace(/\\(.)/g, '$1')}"`;
  if ((m = sel.match(/^input\[placeholder="(.*)"\]$/))) return `the "${m[1]}" field`;
  if ((m = sel.match(/^text=(.*)$/))) return `the text "${m[1]}"`;
  return `\`${sel}\``;
}
function describe(step) {
  if (step.on && behavior) return `${step.on === 'vue' ? 'Vue only' : 'Prototype only'}: ${describeStep(step)}`;
  return describeStep(step);
}
function describeStep(step) {
  if (step.label) return step.label;
  if (step.click) return `Click ${target(step.click)}`;
  if (step.fill) return `Type "${step.fill[1]}" into ${target(step.fill[0])}`;
  if (step.type) return `Type "${step.type[1]}" into ${target(step.type[0])}`;
  if (step.hover) return `Hover over ${target(step.hover)}`;
  if (step.focus) return `Click into ${target(step.focus)}`;
  if (step.select) return `Choose "${step.select[1]}" in ${target(step.select[0])}`;
  if (step.press) return `Press ${step.press}`;
  if (step.scroll) return `Scroll to ${target(step.scroll)}`;
  if (step.wait) return `Wait about ${String(Math.round(step.wait / 100) / 10)} s: the page moves on by itself`;
  if (step.eval) return `In the browser console, run \`${step.eval}\``;
  return JSON.stringify(step);
}
function settings(props, vueOnly = false) {
  if (!Object.keys(props).length) return ['Settings: default (reload the page first)'];
  const json = JSON.stringify(props);
  if (vueOnly) return [`Settings: reload the page, then run in the browser console (⌥⌘J): \`__paritySetProps(${json})\``];
  const lines = ['Settings: reload the page, then run in the browser console (⌥⌘J):'];
  lines.push(`  - Original: \`__dcSetProps(__dcRootName(), ${json})\``);
  lines.push(behavior ? `  - Vue: \`__paritySetProps(${json})\` (development build only)` : `  - New: same command`);
  return lines;
}

const states = scenario.states || [];
// Approved changes the prototype doesn't have yet: checked on the Vue version only, so listed in behavior mode.
const approved = behavior ? scenario.approved || [] : [];
const viewports = (scenario.viewports || [{ width: 1440, height: 900 }]).map((v) => `${v.width}×${v.height}`).join(', ');
const md = [
  `# Manual check: ${name}`,
  '',
  behavior
    ? 'Vue step: the Vue version must look and behave exactly like the prototype.'
    : 'SCSS step: the new version must look and behave exactly like the original.',
  `Do every item in both versions and compare them. The automated check uses a ${viewports} window; use the same size.`,
  ...(scenario.seedRandom
    ? ['', 'This page shows random sample data, so numbers can differ between the two tabs. Compare layout and styling, not the figures. (The automated check gives both sides the same random numbers.)']
    : []),
  '',
  '## Open both versions',
  '',
  behavior
    ? `- Start the prototype: \`npm run preview -- ${positional[0]} --b ${bUrl}\`, and the Vue dev server (\`npm run dev\` in the Vue project).`
    : `- Start both side by side: \`npm run preview -- ${positional[0]}\``,
  `- Original: ${aUrl}`,
  `- ${behavior ? 'Vue' : 'New'}: ${bUrl}`,
  '',
  `## States (${states.length})`,
  '',
];
const item = (state, i, vueOnly = false) => {
  md.push(`- [ ] **${i + 1}. ${state.name}**`);
  if (vueOnly) md.push(`  - Design: ${state.design ? `\`${state.design}\`` : '(none given)'}`);
  if (state.query) md.push(vueOnly ? `  - Open: ${bUrl}${state.query}` : `  - Open: ${aUrl}${state.query} and ${bUrl}${state.query}`);
  for (const line of settings({ ...(scenario.props || {}), ...(state.props || {}) }, vueOnly)) md.push(`  ${line.startsWith('  ') ? line : '- ' + line}`);
  const steps = (state.steps || []).filter((s) => behavior || s.on !== 'vue');
  if (steps.length) {
    md.push('  - Steps:');
    steps.forEach((s, n) => md.push(`    ${n + 1}. ${vueOnly ? describeStep(s) : describe(s)}`));
  } else {
    md.push('  - Steps: none, check the page as it loads');
  }
};
states.forEach((state, i) => item(state, i));
if (approved.length) {
  md.push('', `## Approved changes, Vue only (${approved.length})`, '');
  md.push('The prototype doesn\'t have these yet. Check them on the Vue version against each state\'s approved design.', '');
  approved.forEach((state, i) => item(state, i, true));
}
if ((scenario.related || []).length) {
  md.push('', '## Outside this page', '');
  md.push(behavior
    ? 'Flows continue here. Check that the Vue version sends you to the same place.'
    : 'Not changed by this step. Listed so you know where the flows continue.');
  md.push('');
  for (const r of scenario.related) md.push(`- **${r.name}**${r.where ? ` (${r.where})` : ''}: ${r.how}`);
}
md.push('');

const out = opts.out ? resolve(opts.out) : join(repoRoot, '.parity', `checklist-${slug}-${opts.mode}.md`);
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, md.join('\n'));
console.log(`Manual check list (${states.length} states${approved.length ? `, ${approved.length} approved` : ''}${(scenario.related || []).length ? `, ${scenario.related.length} related` : ''}): ${out.startsWith(repoRoot) ? out.slice(repoRoot.length + 1) : out}`);
