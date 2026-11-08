/**
 * Content-rule tests against the built homepage (run `npm run build` first).
 * Rules: docs/strategy/company-vision.md §6–§7 and website-architecture.md §3, §7.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const file = new URL('../dist/index.html', import.meta.url);
const built = existsSync(file);
const html = built ? readFileSync(file, 'utf8') : '';
const text = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const opts = { skip: built ? false : 'dist/index.html not found: run `npm run build` first' };

test('exactly one h1, and heading levels never skip', opts, () => {
  const levels = [...html.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]));
  assert.equal(levels.filter((l) => l === 1).length, 1);
  for (let i = 1; i < levels.length; i++) {
    assert.ok(levels[i] <= levels[i - 1] + 1, `heading jumps from h${levels[i - 1]} to h${levels[i]}`);
  }
});

test('all planned homepage sections are present, in order', opts, () => {
  const ids = ['hero-title', 'build-title', 'featured-title', 'vision-title', 'roadmap-title', 'services-title', 'founders-title', 'careers-title', 'contact-cta-title'];
  const positions = ids.map((id) => html.indexOf(`id="${id}"`));
  positions.forEach((p, i) => assert.ok(p > -1, `missing section ${ids[i]}`));
  assert.deepEqual([...positions].sort((a, b) => a - b), positions);
});

test('tagline and verbatim vision, mission, purpose', opts, () => {
  assert.match(text, /Building Technology\. Empowering People\./);
  for (const s of [
    'To create technology that makes people’s lives, work and opportunities better.',
    'To build meaningful technology products and solutions that empower people, simplify work and create long-term value.',
    'To bring innovation closer to people through accessible, practical and impactful technology.',
  ]) {
    assert.ok(text.includes(s), `missing statement: ${s}`);
  }
});

test('the five founders appear by name, with no invented titles', opts, () => {
  for (const name of ['Rajeev Kumar', 'Devanshu Deo', 'Abhinav Abhishek', 'Anuj Shahi', 'Sachin Kumar']) {
    assert.ok(text.includes(name), `missing founder ${name}`);
  }
  assert.doesNotMatch(text, /\b(CEO|CTO|COO|CFO|Co-founder)\b/);
});

test('planned offerings are never labelled as launched', opts, () => {
  const planned = ['AI Platform for Students', 'Online Learning with Human Teachers', 'Physical Learning Centres', 'Web and Software Development', 'Cloud and Backend Engineering'];
  const items = [...html.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/g)].map((m) => m[1]);
  for (const name of planned) {
    const withBadge = items.filter((li) => li.includes(name) && li.includes('data-status='));
    for (const li of withBadge) {
      assert.match(li, /data-status="planned"/, `${name} has a non-planned badge`);
      assert.doesNotMatch(li, /data-status="(available-now|early-access)"/);
    }
  }
  assert.match(html, /SarasTech[\s\S]{0,4000}data-status="available-now"/);
});

test('no unsupported claims', opts, () => {
  assert.doesNotMatch(text, /coming soon|testimonial|trusted by|award[- ]winning|case stud/i);
});

test('external SarasTech link opens safely in a new tab', opts, () => {
  const link = html.match(/<a[^>]+href="https:\/\/www\.sarastech\.co\.in"[^>]*>/);
  assert.ok(link, 'SarasTech external link missing');
  assert.match(link[0], /target="_blank"/);
  assert.match(link[0], /rel="noopener noreferrer"/);
});

test('the SarasTech panel shows the supplied product image, optimised and described', opts, () => {
  const section = html.slice(html.indexOf('id="featured-title"'), html.indexOf('id="vision-title"'));
  const picture = section.match(/<picture>[\s\S]*?<\/picture>/)?.[0] ?? '';
  assert.ok(picture, 'SarasTech product image missing');
  assert.match(picture, /type="image\/avif"/, 'missing AVIF source');
  assert.match(picture, /type="image\/webp"/, 'missing WebP source');
  assert.match(picture, /srcset="[^"]*\s1536w/, 'missing full-resolution candidate');
  assert.match(picture, /alt="SarasTech, your AI Teaching Partner[^"]+"/, 'missing descriptive alt text');
  assert.match(picture, /loading="lazy"/, 'below-the-fold image should lazy-load');
  assert.doesNotMatch(section, /viewBox="0 0 600 420"/, 'abstract wave fallback should be replaced');
});
