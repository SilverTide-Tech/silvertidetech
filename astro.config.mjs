// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';
import { existsSync, readFileSync } from 'node:fs';

/**
 * Dev-only: serves the Vercel function in /api/ask.ts and dist/ai-knowledge.json under `astro dev`,
 * so the AI assistant can be tried locally. In production Vercel serves both itself.
 */
function devAiApi() {
  return {
    name: 'silvertide-dev-ai-api',
    apply: 'serve',
    configureServer(server) {
      Object.assign(process.env, { ...loadEnv('development', process.cwd(), ''), ...process.env });
      server.middlewares.use('/ai-knowledge.json', (_req, res) => {
        const file = new URL('./dist/ai-knowledge.json', import.meta.url);
        res.setHeader('Content-Type', 'application/json');
        if (!existsSync(file)) { res.statusCode = 404; return res.end('{}'); }
        res.end(readFileSync(file));
      });
      server.middlewares.use('/api/ask', async (req, res) => {
        const chunks = [];
        for await (const c of req) chunks.push(c);
        const url = `http://${req.headers.host}${req.url}`;
        const request = new Request(url, { method: req.method, headers: req.headers, body: ['GET', 'HEAD'].includes(req.method) ? undefined : Buffer.concat(chunks) });
        try {
          const mod = await server.ssrLoadModule('/api/ask.ts');
          const handler = mod[req.method] ?? mod.POST;
          const out = await handler(request);
          res.statusCode = out.status;
          out.headers.forEach((v, k) => res.setHeader(k, v));
          res.end(Buffer.from(await out.arrayBuffer()));
        } catch (e) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: 'dev-error' }));
        }
      });
    },
  };
}

/**
 * The production domain has not been decided yet. Set SITE_URL (e.g. https://www.example.com)
 * when building for production: canonical URLs, sitemap.xml, the robots.txt sitemap line,
 * Open Graph image URLs and absolute structured-data URLs are only emitted when it is set.
 */
const site = process.env.SITE_URL || undefined;

/** Pages kept out of the sitemap: internal reference page and legal pages still being prepared. */
const EXCLUDE_FROM_SITEMAP = ['/foundation/', '/privacy/', '/terms/', '/404/'];

// https://astro.build/config
export default defineConfig({
  site,
  // One ~20 KB stylesheet: inlining removes the only render-blocking request (Lighthouse).
  build: { inlineStylesheets: 'always' },
  vite: {
    plugins: [tailwindcss(), devAiApi()],
  },
  integrations: [
    react(),
    ...(site
      ? [sitemap({ filter: (page) => !EXCLUDE_FROM_SITEMAP.some((path) => new URL(page).pathname === path) })]
      : []),
  ],
});
