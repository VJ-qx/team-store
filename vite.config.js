import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

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

export default defineConfig({
  // Serve files as a plain static host would: an unknown page is a 404, like for the prototype
  // (instead of falling back to index.html).
  appType: 'mpa',
  plugins: [
    staticNotFound,
    vue({
      template: {
        // Keep asset URLs (assets/*.png) as written: they resolve at runtime relative to the page,
        // as in the prototype.
        transformAssetUrls: false,
        // Keep whitespace between tags, as the prototype runtime and plain HTML do.
        compilerOptions: { whitespace: 'preserve' },
      },
    }),
  ],
  // Scan only the Vue entry for dependencies, not the .dc.html prototypes or the workspace .jsx files.
  optimizeDeps: { entries: ['index.html'] },
});
