/**
 * Site-wide checks against the production build (run `npm run build` first).
 * Rules: docs/strategy/website-architecture.md §1, §4, §7, §9 and company-vision.md §6–§7.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist', import.meta.url));
const built = existsSync(join(dist, 'index.html'));
const opts = { skip: built ? false : 'dist/ not found: run `npm run build` first' };

/** route ("/about") → html */
function collectPages(): Map<string, string> {
  const pages = new Map<string, string>();
  if (!built) return pages;
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) {
        if (name !== '_astro') walk(full);
      } else if (name.endsWith('.html')) {
        const rel = relative(dist, full).split(sep).join('/');
        const route = rel === 'index.html' ? '/' : `/${rel.replace(/\/index\.html$/, '').replace(/\.html$/, '')}`;
        pages.set(route, readFileSync(full, 'utf8'));
      }
    }
  };
  walk(dist);
  return pages;
}

const pages = collectPages();
const visibleText = (html: string) =>
  html
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ');

const REQUIRED_ROUTES = [
  '/',
  '/about',
  '/businesses',
  '/businesses/education',
  '/businesses/technology-services',
  '/products',
  '/products/sarastech',
  '/vision',
  '/leadership',
  '/careers',
  '/contact',
  '/privacy',
  '/terms',
  '/404',
];

test('every sitemap page is built', opts, () => {
  for (const route of REQUIRED_ROUTES) assert.ok(pages.has(route), `missing page ${route}`);
});

test('every page has one h1, no skipped heading levels, a main landmark and a title', opts, () => {
  for (const [route, html] of pages) {
    const levels = [...html.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]));
    assert.equal(levels.filter((l) => l === 1).length, 1, `${route}: expected exactly one h1`);
    for (let i = 1; i < levels.length; i++) {
      assert.ok(levels[i] <= levels[i - 1] + 1, `${route}: heading jumps from h${levels[i - 1]} to h${levels[i]}`);
    }
    assert.match(html, /<main id="main"/, `${route}: missing main landmark`);
    assert.match(html, /<title>[^<]+<\/title>/, `${route}: missing title`);
    assert.match(html, /<html lang="en"/, `${route}: missing lang`);
  }
});

test('every internal link resolves to a built page', opts, () => {
  for (const [route, html] of pages) {
    for (const [, href] of html.matchAll(/<a\b[^>]*\shref="(\/[^"#?]*)/g)) {
      const target = href.replace(/\/$/, '') || '/';
      const isAsset = /\.[a-z0-9]+$/i.test(target);
      assert.ok(isAsset || pages.has(target), `${route}: broken link to ${href}`);
    }
  }
});

test('external links open safely in a new tab', opts, () => {
  for (const [route, html] of pages) {
    for (const [tag] of html.matchAll(/<a\b[^>]*\shref="https?:\/\/[^"]*"[^>]*>/g)) {
      assert.match(tag, /target="_blank"/, `${route}: external link without target: ${tag}`);
      assert.match(tag, /rel="noopener noreferrer"/, `${route}: external link without rel: ${tag}`);
    }
  }
});

test('no unsupported claims or invented titles anywhere', opts, () => {
  for (const [route, html] of pages) {
    const text = visibleText(html);
    assert.doesNotMatch(text, /coming soon|testimonial|trusted by|award[- ]winning|case stud|subsidiar/i, `${route}: unsupported claim`);
    assert.doesNotMatch(text, /\b(CEO|CTO|COO|CFO|Co-founder)\b/, `${route}: invented title`);
  }
});

test('planned vertical is labelled Planned and has no launch CTA', opts, () => {
  // Only the page's own content: the global header menu lists SarasTech (Available Now) on every page.
  const page = pages.get('/businesses/technology-services') ?? '';
  const html = page.slice(page.indexOf('<main'), page.indexOf('</main>'));
  assert.match(html, /data-status="planned"/);
  assert.doesNotMatch(html, /data-status="(available-now|early-access)"/);
  assert.doesNotMatch(html, /href="https?:\/\//, 'planned vertical must not link to a live product');
});

test('only launched products get product pages', opts, () => {
  const productPages = [...pages.keys()].filter((r) => r.startsWith('/products/'));
  assert.deepEqual(productPages, ['/products/sarastech']);
  assert.match(pages.get('/products/sarastech') ?? '', /data-status="available-now"/);
});

test('leadership lists the five founders by name', opts, () => {
  const text = visibleText(pages.get('/leadership') ?? '');
  assert.match(text, /Founders & Directors/);
  for (const name of ['Rajeev Kumar', 'Devanshu Deo', 'Abhinav Abhishek', 'Anuj Shahi', 'Sachin Kumar']) {
    assert.ok(text.includes(name), `missing ${name}`);
  }
});

test('legal pages are not indexed until their text is supplied', opts, () => {
  for (const route of ['/privacy', '/terms']) {
    const html = pages.get(route) ?? '';
    if (/This document is being prepared/.test(html)) assert.match(html, /<meta name="robots" content="noindex/);
  }
});

const attr = (html: string, re: RegExp) => html.match(re)?.[1];

test('every page has a unique title and a meta description', opts, () => {
  const titles = new Map<string, string>();
  for (const [route, html] of pages) {
    if (route === '/404' || route === '/foundation') continue;
    const title = attr(html, /<title>([^<]+)<\/title>/) ?? '';
    const description = attr(html, /<meta name="description" content="([^"]*)"/) ?? '';
    assert.ok(description.length >= 40, `${route}: meta description missing or too short`);
    assert.ok(!titles.has(title), `${route}: duplicate title "${title}" (also on ${titles.get(title)})`);
    titles.set(title, route);
    assert.match(html, /<meta property="og:title" content="[^"]+"/, `${route}: missing og:title`);
    assert.match(html, /<meta name="twitter:card" content="summary(_large_image)?"/, `${route}: missing twitter:card`);
  }
});

test('structured data is valid JSON-LD with the expected types', opts, () => {
  const types = (route: string) =>
    [...(pages.get(route) ?? '').matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => {
      const data = JSON.parse(m[1]);
      assert.equal(data['@context'], 'https://schema.org', `${route}: bad @context`);
      return data['@type'] as string;
    });
  assert.deepEqual(types('/').sort(), ['Organization', 'WebSite']);
  assert.ok(types('/products/sarastech').includes('SoftwareApplication'));
});

test('robots.txt, manifest and icons are published', opts, () => {
  const robots = readFileSync(join(dist, 'robots.txt'), 'utf8');
  assert.match(robots, /User-agent: \*/);
  assert.match(robots, /Disallow: \/foundation\//);
  const manifest = JSON.parse(readFileSync(join(dist, 'manifest.webmanifest'), 'utf8'));
  assert.equal(manifest.name, 'Silver Tide Tech');
  for (const file of ['favicon-32.png', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png', 'og-default.png']) {
    assert.ok(existsSync(join(dist, file)), `missing ${file}`);
  }
});

test('canonical URLs, when emitted, point at the page itself', opts, () => {
  for (const [route, html] of pages) {
    const canonical = attr(html, /<link rel="canonical" href="([^"]+)"/);
    if (!canonical) continue; // only emitted when SITE_URL is configured
    assert.equal(new URL(canonical).pathname.replace(/\/$/, '') || '/', route === '/404' ? '/404' : route);
  }
});

test('all five founder photos are served as optimised responsive pictures', opts, () => {
  const main = (pages.get('/leadership') ?? '').split('<main')[1]?.split('</main>')[0] ?? '';
  const cards = [...main.matchAll(/<li class="group[^"]*">([\s\S]*?)<\/li>/g)].map((m) => m[1]);
  assert.equal(cards.length, 5, 'expected five founder cards');
  for (const card of cards) {
    assert.match(card, /<picture/, 'every founder card should show a photo');
    assert.match(card, /type="image\/avif"/, 'missing AVIF source');
    assert.match(card, /type="image\/webp"/, 'missing WebP source');
    assert.match(card, /srcset="[^"]*\s\d+w,/, 'missing responsive srcset');
    assert.match(card, /loading="eager"/, 'Leadership photos are above the fold and load eagerly');
  }
});

test("the founders' note appears only once its supplied text is published", opts, () => {
  const note = pages.get('/leadership/founders-note');
  const norm = (s: string) =>
    visibleText(s).replace(/&#39;|&#x27;|[‘’]/g, "'").replace(/&quot;|&#34;|[“”]/g, '"').replace(/\s+/g, ' ').trim();
  for (const route of ['/', '/leadership']) {
    const html = pages.get(route) ?? '';
    if (!note) {
      assert.doesNotMatch(html, /founders-note/, `${route}: a draft note must not be previewed`);
      continue;
    }
    const link = html.match(/<a\b[^>]*href="\/leadership\/founders-note\/?"[^>]*>[\s\S]*?<\/a>/)?.[0] ?? '';
    assert.ok(link, `${route}: missing "Read the full note" link`);
    assert.match(link, /target="_blank"/, `${route}: the full note opens in a new tab`);
    assert.match(link, /rel="noopener noreferrer"/);
    assert.match(link, /opens in a new tab/, `${route}: new tab must be announced`);
    const excerpt = html.match(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/)?.[1] ?? '';
    assert.ok(norm(excerpt), `${route}: missing excerpt`);
    assert.ok(norm(note).includes(norm(excerpt)), `${route}: the preview quotes words the full note does not contain`);
  }
  if (!note) return;
  const text = visibleText(note);
  for (const name of ['Rajeev Kumar', 'Devanshu Deo', 'Abhinav Abhishek', 'Anuj Shahi', 'Sachin Kumar']) {
    assert.ok(text.includes(name), `founders' note: missing ${name}`);
  }
  assert.match(note, /<time datetime="\d{4}-\d{2}-\d{2}"/, "founders' note: missing date");
  assert.match(note, /"@type":"Article"/, "founders' note: missing Article structured data");
});

test('the official logo is used in the header, and the app-icon lockup on navy surfaces', opts, () => {
  const home = pages.get('/') ?? '';
  const header = home.split('<header')[1]?.split('</header>')[0] ?? '';
  assert.match(header, /<img[^>]+alt="Silver Tide Tech"/, 'header logo image missing');
  const footer = home.split('<footer')[1]?.split('</footer>')[0] ?? '';
  // An empty alt is serialised as a bare `alt` attribute (decorative image; the name follows as text).
  assert.match(footer, /<img[^>]+\balt(="")?[\s>][^>]*>[\s\S]*?Silver Tide Tech/, 'footer mark + name missing');
  assert.doesNotMatch(home, /favicon\.svg/, 'temporary favicon still referenced');
});
