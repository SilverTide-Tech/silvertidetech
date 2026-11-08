/**
 * Derives all brand assets from the official masters in /brand-source:
 *   brand-source/silvertide-logo.png     full-colour logo on white
 *   brand-source/silvertide-favicon.png  ST app icon (rounded navy square on white)
 *
 * Outputs
 *   src/assets/brand/logo.png    trimmed logo with the white background made transparent (light surfaces)
 *   src/assets/brand/mark.png    ST app-icon artwork with transparent rounded corners (dark surfaces)
 *   public/favicon-32.png, icon-192.png, icon-512.png   (transparent rounded corners)
 *   public/apple-touch-icon.png  (180, square, navy corners: iOS applies its own mask)
 *   public/og-default.png        (1200×630 social image)
 *
 * Run: npm run assets   (re-run whenever the masters change)
 */
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';
import { launchChrome } from './lib/chrome.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const src = (p) => join(root, 'brand-source', p);
const out = (p) => join(root, p);
mkdirSync(out('src/assets/brand'), { recursive: true });

/** Make a white background transparent while preserving anti-aliased edges ("colour to alpha", white). */
async function whiteToAlpha(input) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
    const a = Math.max(255 - r, 255 - g, 255 - b) / 255;
    if (a < 0.02) {
      data[i + 3] = 0;
      continue;
    }
    data[i] = Math.round((r - 255 * (1 - a)) / a);
    data[i + 1] = Math.round((g - 255 * (1 - a)) / a);
    data[i + 2] = Math.round((b - 255 * (1 - a)) / a);
    data[i + 3] = Math.round(a * 255);
  }
  return sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } });
}

// 1. Logo for light surfaces.
const trimmedLogo = await sharp(src('silvertide-logo.png')).trim({ background: '#ffffff', threshold: 12 }).toBuffer();
await (await whiteToAlpha(trimmedLogo)).png({ compressionLevel: 9 }).toFile(out('src/assets/brand/logo.png'));
const logoMeta = await sharp(out('src/assets/brand/logo.png')).metadata();
console.log(`src/assets/brand/logo.png  ${logoMeta.width}×${logoMeta.height}`);

// 2. App-icon mark: trim the white margin, inset slightly to drop the anti-aliased white fringe,
//    then mask to a rounded square so the corners are transparent.
const favTrim = await sharp(src('silvertide-favicon.png')).trim({ background: '#ffffff', threshold: 24 }).toBuffer({ resolveWithObject: true });
const side = Math.min(favTrim.info.width, favTrim.info.height);
const inset = Math.round(side * 0.02);
const square = await sharp(favTrim.data)
  .extract({ left: inset, top: inset, width: side - inset * 2, height: side - inset * 2 })
  .resize(1024, 1024)
  .toBuffer();
const roundedMask = Buffer.from(`<svg width="1024" height="1024"><rect width="1024" height="1024" rx="250" ry="250" fill="#fff"/></svg>`);
const mark = await sharp(square).composite([{ input: roundedMask, blend: 'dest-in' }]).png().toBuffer();
await sharp(mark).resize(512, 512).png({ compressionLevel: 9 }).toFile(out('src/assets/brand/mark.png'));
console.log('src/assets/brand/mark.png  512×512');

for (const [file, size] of [['public/favicon-32.png', 32], ['public/icon-192.png', 192], ['public/icon-512.png', 512]]) {
  await sharp(mark).resize(size, size).png({ compressionLevel: 9 }).toFile(out(file));
  console.log(`${file}  ${size}×${size}`);
}

// 3. Apple touch icon: opaque square; corners filled with the icon's own navy (sampled near the top edge).
const { data: px } = await sharp(square).extract({ left: 512, top: 40, width: 1, height: 1 }).raw().toBuffer({ resolveWithObject: true });
const navy = { r: px[0], g: px[1], b: px[2] };
await sharp(mark).flatten({ background: navy }).resize(180, 180).png().toFile(out('public/apple-touch-icon.png'));
console.log(`public/apple-touch-icon.png  180×180 (corner fill rgb(${navy.r},${navy.g},${navy.b}))`);

// 4. Social image: rendered with the brand fonts in headless Chrome.
const font = (p) => pathToFileURL(join(root, 'node_modules', p)).href;
const logoUrl = pathToFileURL(out('src/assets/brand/logo.png')).href;
let tides = '';
for (let i = 0; i < 8; i++) {
  const y = 430 + i * 26;
  let d = '';
  for (let x = 0; x <= 1200; x += 12) d += `${x ? 'L' : 'M'}${x} ${(y + (8 + (i % 3) * 3) * Math.sin(((x + i * 47) / 360) * Math.PI * 2)).toFixed(1)}`;
  const accent = i === 2;
  tides += `<path d="${d}" fill="none" stroke="${accent ? '#14B3A8' : '#A9B4C2'}" stroke-opacity="${accent ? 0.85 : 0.35}" stroke-width="${accent ? 2.4 : 1.4}"/>`;
}
const ogHtml = `<!doctype html><html><head><meta charset="utf-8"><style>
  @font-face { font-family: Manrope; font-weight: 200 800; src: url('${font('@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2')}') format('woff2'); }
  html, body { margin: 0; }
  body { width: 1200px; height: 630px; background: #fff; position: relative; overflow: hidden; font-family: Manrope, sans-serif; }
  .logo { position: absolute; left: 88px; top: 84px; width: 640px; }
  h1 { position: absolute; left: 88px; top: 250px; margin: 0; color: #0B1F3A; font-weight: 700; font-size: 76px; line-height: 1.05; letter-spacing: -0.03em; }
  h1 span { color: #0B7C77; }
  svg { position: absolute; inset: 0; }
</style></head><body>
  <svg viewBox="0 0 1200 630" width="1200" height="630">${tides}</svg>
  <img class="logo" src="${logoUrl}" alt="">
  <h1>Building Technology.<br><span>Empowering People.</span></h1>
</body></html>`;

const work = mkdtempSync(join(tmpdir(), 'stt-assets-'));
const chrome = await launchChrome();
try {
  const page = join(work, 'og.html');
  writeFileSync(page, ogHtml);
  await chrome.viewport(1200, 630);
  await chrome.goto(pathToFileURL(page).href, 900);
  await chrome.evaluate('Promise.all([document.fonts.ready, ...[...document.images].map(i => i.decode())]).then(() => true)');
  writeFileSync(out('public/og-default.png'), await chrome.screenshot({ x: 0, y: 0, width: 1200, height: 630 }));
  console.log('public/og-default.png  1200×630');
} finally {
  await chrome.close();
  rmSync(work, { recursive: true, force: true });
}
