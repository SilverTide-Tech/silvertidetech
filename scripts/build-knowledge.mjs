/**
 * Builds dist/ai-knowledge.json from the *built* pages, so the AI assistant only ever knows what
 * the public website actually says. Runs automatically after `npm run build` (npm "postbuild").
 * Internal/unfinished pages are excluded.
 */
import { readdirSync, readFileSync, writeFileSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const dist = new URL('../dist/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const EXCLUDE = new Set(['/404', '/foundation', '/privacy', '/terms']);

const decode = (s) =>
  s
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#(x?)([0-9a-fA-F]+);/g, (_, hex, n) => String.fromCodePoint(parseInt(n, hex ? 16 : 10)));

const toText = (html) =>
  decode(
    html
      .replace(/<(script|style|svg|noscript|template|dialog)[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<\/(p|div|li|h[1-6]|section|tr|article|ul|ol)>|<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, ' '),
  )
    .split('\n').map((l) => l.replace(/\s+/g, ' ').trim()).filter(Boolean).join('\n');

const walk = (dir, out = []) => {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) { if (name !== '_astro') walk(full, out); }
    else if (name.endsWith('.html')) out.push(full);
  }
  return out;
};

if (!existsSync(dist)) { console.error('[knowledge] dist/ not found; run astro build first'); process.exit(0); }

const pages = [];
let footer = '';
for (const file of walk(dist)) {
  const rel = relative(dist, file).split(sep).join('/');
  const path = '/' + rel.replace(/(^|\/)index\.html$/, '').replace(/\.html$/, '');
  const route = path === '/' ? '/' : path.replace(/\/$/, '');
  if (EXCLUDE.has(route)) continue;
  const html = readFileSync(file, 'utf8');
  const title = decode((html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? route).trim());
  const main = html.match(/<main[\s\S]*?<\/main>/i)?.[0] ?? '';
  if (!footer) footer = toText(html.match(/<footer[\s\S]*?<\/footer>/i)?.[0] ?? '');
  const text = toText(main);
  if (text) pages.push({ path: route, title, text });
}
if (footer) pages.push({ path: '(site footer: contact and company details)', title: 'Site footer', text: footer });

pages.sort((a, b) => a.path.localeCompare(b.path));
writeFileSync(join(dist, 'ai-knowledge.json'), JSON.stringify({ generated: new Date().toISOString(), pages }));
console.log(`[knowledge] ${pages.length} pages, ${pages.reduce((n, p) => n + p.text.length, 0)} characters`);
