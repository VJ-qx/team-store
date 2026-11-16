import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import * as compilerSfc from 'vue/compiler-sfc';
import { createCallExpression, CREATE_TEXT, getConstantType, NodeTypes } from '@vue/compiler-core';

// Dev server: answer a missing file the way a plain static host does (404 with the text "Not found"),
// so a redirect to a missing page ends on the same page as it does for the prototype.
const staticNotFound = {
  name: 'static-not-found',
  configureServer(server) {
    return () => server.middlewares.use((req, res, next) => {
      const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      if (path === '/' || existsSync(resolve(server.config.root, '.' + path))) return next();
      res.statusCode = 404;
      res.setHeader('content-type', 'text/plain');
      res.end('Not found');
    });
  },
};

// The prototype's files live in prototype/ but are served from the root, as in the handover:
// /Workspace.dc.html opens prototype/Workspace.dc.html. A page's relative links (assets/, _ds/,
// styles/css/, support.js, its .jsx) and its redirects then resolve exactly as before. Files at the
// root win, so the Vue pages are never affected. tools/parity/lib.mjs (serveDir) does the same.
const prototypeAtRoot = {
  name: 'prototype-at-root',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      const root = server.config.root;
      if (path !== '/' && !existsSync(resolve(root, '.' + path)) && existsSync(resolve(root, 'prototype', '.' + path))) {
        req.url = '/prototype' + req.url;
      }
      next();
    });
  },
};

// The workspace components are converted from JSX, which drops the whitespace between elements on
// separate lines. Vue's "condense" mode does the same, so those files compile with it, plus splitText
// below. The landing page keeps "preserve": its prototype is HTML, where that whitespace renders.
const CONDENSE = /[\\/]src[\\/]workspace[\\/]/;
const condense = (filename) => CONDENSE.test(filename || '');

// JSX makes each text chunk and each {expression} its own DOM text node; Vue joins neighbouring text
// and {{ }} into one. Chrome shapes text per node (kerning stops at a node boundary), so joined text
// can render a fraction of a pixel differently from the prototype. For the converted workspace files,
// this keeps them apart: each text chunk and each {{ }} becomes its own text node, as in React.
// It runs before Vue's own text transform, which then leaves those nodes alone.
const splitText = (node, context) => {
  if (![NodeTypes.ROOT, NodeTypes.ELEMENT, NodeTypes.FOR, NodeTypes.IF_BRANCH].includes(node.type)) return undefined;
  return () => {
    const { children } = node;
    const isText = (c) => c.type === NodeTypes.TEXT || c.type === NodeTypes.INTERPOLATION;
    if (!children.some((c, i) => isText(c) && children[i + 1] && isText(children[i + 1]))) return;
    children.forEach((child, i) => {
      if (!isText(child)) return;
      const args = [child];
      if (getConstantType(child, context) === 0) args.push('1 /* TEXT */');
      children[i] = { type: NodeTypes.TEXT_CALL, content: child, loc: child.loc, codegenNode: createCallExpression(context.helper(CREATE_TEXT), args) };
    });
  };
};

const compiler = {
  ...compilerSfc,
  parse: (source, options = {}) => compilerSfc.parse(source, condense(options.filename)
    ? { ...options, templateParseOptions: { ...options.templateParseOptions, whitespace: 'condense' } }
    : options),
  compileTemplate: (options) => compilerSfc.compileTemplate(condense(options.filename)
    ? { ...options, compilerOptions: { ...options.compilerOptions, whitespace: 'condense', nodeTransforms: [...(options.compilerOptions?.nodeTransforms || []), splitText] } }
    : options),
};

export default defineConfig({
  // Serve files as a plain static host would: an unknown page is a 404, like for the prototype
  // (instead of falling back to index.html).
  appType: 'mpa',
  plugins: [
    prototypeAtRoot,
    staticNotFound,
    vue({
      compiler,
      template: {
        // Keep asset URLs (assets/*.png) as written: they resolve at runtime relative to the page,
        // as in the prototype.
        transformAssetUrls: false,
        // Keep whitespace between tags, as the prototype runtime and plain HTML do.
        compilerOptions: { whitespace: 'preserve' },
      },
    }),
  ],
  // One page per prototype page: the landing page, the workspace, and the integrated (Marucci) workspace.
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        workspace: resolve(__dirname, 'workspace.html'),
        'workspace-integrated': resolve(__dirname, 'workspace-integrated.html'),
      },
    },
  },
  // Scan only the Vue entries for dependencies, not the .dc.html prototypes or the workspace .jsx files.
  optimizeDeps: { entries: ['index.html', 'workspace.html', 'workspace-integrated.html'] },
});
