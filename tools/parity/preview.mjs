#!/usr/bin/env node
// Serves two versions of a scenario's page side by side for manual checking.
//
// Usage:
//   node tools/parity/preview.mjs <scenario.mjs> [--a main] [--b .] [--port-a 8001] [--port-b 8000]
//
// A side is a git ref (served from a temporary worktree), "." (the working tree), or a URL
// that is already running (for example the Vue dev server). Ctrl+C stops the servers and
// removes the temporary worktree.

import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { git, openSide } from './lib.mjs';

const opts = { a: 'main', b: '.', 'port-a': '8001', 'port-b': '8000' };
const positional = [];
const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i++) {
  if (argv[i].startsWith('--')) opts[argv[i].slice(2)] = argv[++i];
  else positional.push(argv[i]);
}
if (!positional[0]) {
  console.error('Usage: node tools/parity/preview.mjs <scenario.mjs> [--a <ref|.|url>] [--b <ref|.|url>] [--port-a 8001] [--port-b 8000]');
  process.exit(2);
}

const scenario = (await import(pathToFileURL(resolve(positional[0])).href)).default;
const sides = [];
const stop = async (code = 0) => { for (const s of sides) await s.close().catch(() => {}); process.exit(code); };
process.on('SIGINT', () => stop(0));
process.on('SIGTERM', () => stop(0));

try {
  git(['worktree', 'prune']);
  sides.push(await openSide(opts.a, 'Original', { port: Number(opts['port-a']) }));
  sides.push(await openSide(opts.b, 'New', { port: Number(opts['port-b']) }));
} catch (e) {
  console.error(`Preview failed: ${e.message}`);
  await stop(2);
}
for (const s of sides) console.log(`${s.label.padEnd(9)} ${s.desc.padEnd(22)} ${s.url(scenario.page)}`);
console.log('\nPress Ctrl+C to stop.');
