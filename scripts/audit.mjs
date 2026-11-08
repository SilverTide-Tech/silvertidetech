/**
 * Accessibility + responsive audit of the production build (architecture §9, brand-direction §11).
 *
 * For every built page at 390 / 768 / 1024 / 1440 px:
 *   - axe-core, WCAG 2.0/2.1/2.2 A + AA rules
 *   - horizontal overflow
 *   - interactive targets smaller than 24 × 24 px (WCAG 2.2 SC 2.5.8, ignoring inline text links)
 *   - JavaScript errors
 * Plus a reduced-motion pass at 390 px (ambient animation must be off).
 *
 * Run: npm run build && npm run audit      (or set BASE_URL to audit a running server)
 * Exits with code 1 when any issue is found.
 */
import { spawn } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { launchChrome } from './lib/chrome.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'dist');
const WIDTHS = [390, 768, 1024, 1440];
const SKIP = new Set(['/foundation']); // internal reference page, not public

if (!existsSync(join(dist, 'index.html'))) {
  console.error('dist/ not found: run `npm run build` first.');
  process.exit(1);
}

function routes() {
  const out = [];
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) {
        if (name !== '_astro') walk(full);
      } else if (name === 'index.html' || name === '404.html') {
        const rel = relative(dist, full).split(sep).join('/');
        out.push(rel === 'index.html' ? '/' : rel === '404.html' ? '/404' : `/${rel.replace(/\/index\.html$/, '')}`);
      }
    }
  };
  walk(dist);
  return out.filter((r) => !SKIP.has(r)).sort();
}

let preview;
let base = process.env.BASE_URL;
if (!base) {
  const port = 4329;
  base = `http://127.0.0.1:${port}`;
  preview = spawn(process.execPath, [join(root, 'node_modules/astro/bin/astro.mjs'), 'preview', '--host', '127.0.0.1', '--port', String(port)], {
    cwd: root,
    stdio: ['ignore', 'ignore', 'pipe'],
  });
  let stderr = '';
  preview.stderr.on('data', (d) => (stderr += d));
  let up = false;
  for (let i = 0; i < 60 && !up; i++) {
    try {
      up = (await fetch(base)).ok;
    } catch {
      /* starting */
    }
    if (!up) await new Promise((r) => setTimeout(r, 250));
  }
  if (!up) {
    // Astro allows only one preview server at a time; never audit an error page by accident.
    console.error(`Could not start a preview server on ${base}.
${stderr.trim()}
Stop the other server, or re-run with BASE_URL pointing at it.`);
    preview.kill();
    process.exit(1);
  }
}

const axeSource = readFileSync(join(root, 'node_modules/axe-core/axe.min.js'), 'utf8');
const chrome = await launchChrome();
const jsErrors = [];
chrome.on((msg) => {
  if (msg.method === 'Runtime.exceptionThrown') jsErrors.push(msg.params.exceptionDetails.exception?.description ?? msg.params.exceptionDetails.text);
});

const issues = [];
const report = (route, width, kind, detail) => issues.push({ route, width, kind, detail });

const PAGE_CHECKS = `(() => {
  const html = document.documentElement;
  const overflow = html.scrollWidth > html.clientWidth ? html.scrollWidth - html.clientWidth : 0;
  const visible = (el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden' && !el.closest('[inert],[hidden]'); };
  const small = [...document.querySelectorAll('a[href], button, input, select, textarea, summary')]
    .filter(visible)
    // Inline links inside running text are exempt from SC 2.5.8.
    .filter((el) => !(el.tagName === 'A' && getComputedStyle(el).display === 'inline'))
    .map((el) => { const r = el.getBoundingClientRect(); return { name: (el.getAttribute('aria-label') || el.textContent || el.name || '').trim().slice(0, 40), w: Math.round(r.width), h: Math.round(r.height) }; })
    .filter((t) => t.w < 24 || t.h < 24);
  return { overflow, small };
})()`;

async function scrollThrough(height) {
  await chrome.evaluate(`(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += ${Math.round(height * 0.6)}) { scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); }
    scrollTo(0, 0); await new Promise(r => setTimeout(r, 700));
  })()`);
}

const pages = routes();
console.log(`Auditing ${pages.length} pages × ${WIDTHS.length} widths at ${base}\n`);

try {
  for (const route of pages) {
    for (const width of WIDTHS) {
      const height = width < 600 ? 844 : width < 1100 ? 1024 : 900;
      jsErrors.length = 0;
      await chrome.viewport(width, height);
      const url = `${base}${route === '/404' ? '/404.html' : route}`;
      const status = (await fetch(url)).status;
      if (status !== 200) report(route, width, 'http', `HTTP ${status}`);
      await chrome.goto(url, 1200);
      // Guard against auditing a browser error page instead of the site.
      const loaded = await chrome.evaluate(`location.href.startsWith(${JSON.stringify(base)}) && document.title.includes('Silver Tide Tech')`);
      if (!loaded) {
        report(route, width, 'load', 'page did not load from the audited server');
        continue;
      }
      await scrollThrough(height); // trigger scroll reveals so hidden-until-revealed content is audited

      const { overflow, small } = await chrome.evaluate(PAGE_CHECKS);
      if (overflow) report(route, width, 'overflow', `${overflow}px horizontal overflow`);
      for (const t of small) report(route, width, 'target-size', `"${t.name}" is ${t.w}×${t.h}px`);

      await chrome.evaluate(axeSource);
      const axe = await chrome.evaluate(`axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa'] }, resultTypes: ['violations'] })
        .then(r => r.violations.map(v => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.slice(0, 3).map(n => n.target.join(' ')) })))`);
      for (const v of axe) report(route, width, `axe:${v.id}`, `${v.impact}: ${v.help} → ${v.nodes.join(' | ')}`);
      for (const e of jsErrors) report(route, width, 'js-error', e.split('\n')[0]);
    }
  }

  // Reduced motion: ambient animation and reveals must be off.
  await chrome.viewport(390, 844, { reducedMotion: true });
  await chrome.goto(`${base}/`, 1500);
  const motion = await chrome.evaluate(`(() => {
    const path = document.querySelector('.tide-line path');
    const hidden = [...document.querySelectorAll('[data-reveal], [data-stagger] > *')].filter(el => getComputedStyle(el).opacity !== '1').length;
    const pause = [...document.querySelectorAll('button')].find(b => /motion/i.test(b.textContent));
    return { animation: path ? getComputedStyle(path).animationName : 'none', hidden, pauseShown: pause ? getComputedStyle(pause).display !== 'none' : false };
  })()`);
  if (motion.animation !== 'none') report('/', 390, 'reduced-motion', `tide animation still running (${motion.animation})`);
  if (motion.hidden) report('/', 390, 'reduced-motion', `${motion.hidden} reveal blocks hidden`);
  if (motion.pauseShown) report('/', 390, 'reduced-motion', 'pause control shown although nothing animates');
} finally {
  await chrome.close();
  preview?.kill();
}

if (issues.length) {
  console.log(`✖ ${issues.length} issue(s):`);
  for (const i of issues) console.log(`  ${i.route} @${i.width}px  [${i.kind}]  ${i.detail}`);
  process.exitCode = 1;
} else {
  console.log(`✔ No issues: ${pages.length} pages × ${WIDTHS.length} widths passed axe (WCAG 2.2 A/AA), overflow, target-size and JS-error checks; reduced motion verified.`);
}
