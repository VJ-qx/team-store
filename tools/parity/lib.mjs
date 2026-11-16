// Shared by the parity tools: git, a static file server, and "sides". A side is a git ref
// (served from a temporary worktree), "." (the working tree), or an http(s) URL used as-is.

import { spawnSync } from 'node:child_process';
import { createServer } from 'node:http';
import { createReadStream, existsSync, mkdtempSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { extname, join, resolve, sep } from 'node:path';

export const repoRoot = spawnSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).stdout.trim() || process.cwd();

export function git(args) {
  const r = spawnSync('git', args, { cwd: repoRoot, encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`git ${args.join(' ')} failed: ${r.stderr.trim()}`);
  return r.stdout.trim();
}

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.jsx': 'text/javascript',
  '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp', '.woff': 'font/woff', '.woff2': 'font/woff2',
  '.otf': 'font/otf', '.ttf': 'font/ttf', '.mp4': 'video/mp4',
};

export function serveDir(root, port = 0) {
  return new Promise((done, fail) => {
    const server = createServer((req, res) => {
      let path;
      try { path = decodeURIComponent(new URL(req.url, 'http://x').pathname); } catch { res.writeHead(400).end(); return; }
      let file = resolve(root, '.' + path);
      if (file !== root && !file.startsWith(root + sep)) { res.writeHead(403).end(); return; }
      // The prototype's files live in prototype/ but are served from the root, as in the handover
      // (vite.config.js does the same). Files at the root win; older refs have everything there.
      const fromPrototype = resolve(root, 'prototype', '.' + path);
      if (!existsSync(file) && fromPrototype.startsWith(root + sep) && existsSync(fromPrototype)) file = fromPrototype;
      if (!existsSync(file) || !statSync(file).isFile()) { res.writeHead(404, { 'content-type': 'text/plain' }).end('Not found'); return; }
      res.writeHead(200, { 'content-type': TYPES[extname(file).toLowerCase()] || 'application/octet-stream', 'cache-control': 'no-store' });
      createReadStream(file).pipe(res);
    });
    server.on('error', (e) => fail(e.code === 'EADDRINUSE' ? new Error(`Port ${port} is already in use`) : e));
    server.listen(port, '127.0.0.1', () => done({ port: server.address().port, close: () => new Promise((r) => server.close(r)) }));
  });
}

export const encodePage = (page) => page.split('/').map(encodeURIComponent).join('/');

export async function openSide(spec, label, { keep = false, port = 0 } = {}) {
  if (/^https?:\/\//.test(spec)) return { label, spec, desc: spec, url: () => spec, close: async () => {} };
  let root = repoRoot;
  let worktree = null;
  let desc = 'working tree';
  if (spec !== '.') {
    const commit = git(['rev-parse', '--short', `${spec}^{commit}`]);
    worktree = mkdtempSync(join(tmpdir(), 'parity-'));
    git(['worktree', 'add', '--detach', worktree, spec]);
    root = worktree;
    desc = `${spec} (${commit})`;
  }
  let server;
  try {
    server = await serveDir(root, port);
  } catch (e) {
    if (worktree) git(['worktree', 'remove', '--force', worktree]);
    throw e;
  }
  return {
    label, spec, desc,
    url: (page) => `http://127.0.0.1:${server.port}/${encodePage(page)}`,
    close: async () => {
      await server.close();
      if (worktree && !keep) git(['worktree', 'remove', '--force', worktree]);
    },
  };
}
