/**
 * Minimal headless-Chrome driver over the DevTools protocol (no extra dependencies).
 * Set CHROME_PATH if Chrome is not at a standard location.
 */
import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CANDIDATES = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function launchChrome() {
  const executable = CANDIDATES.find((p) => existsSync(p));
  if (!executable) throw new Error('Chrome not found. Set CHROME_PATH to your Chrome/Chromium executable.');
  const profile = mkdtempSync(join(tmpdir(), 'stt-chrome-'));
  const port = 9400 + Math.floor(Math.random() * 400);
  const proc = spawn(executable, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, '--no-first-run', '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });

  let target;
  for (let i = 0; i < 75 && !target; i++) {
    await sleep(200);
    try {
      target = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.type === 'page');
    } catch {
      /* not ready yet */
    }
  }
  if (!target) throw new Error('Chrome did not start.');

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve);
    ws.addEventListener('error', reject);
  });
  let id = 0;
  const pending = new Map();
  const listeners = new Set();
  ws.addEventListener('message', (e) => {
    const msg = JSON.parse(e.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    } else if (msg.method) listeners.forEach((fn) => fn(msg));
  });

  const send = (method, params = {}) =>
    new Promise((resolve) => {
      const i = ++id;
      pending.set(i, resolve);
      ws.send(JSON.stringify({ id: i, method, params }));
    });
  const evaluate = async (expression) => {
    const res = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (res.result?.exceptionDetails) throw new Error(res.result.exceptionDetails.exception?.description ?? 'evaluation failed');
    return res.result?.result?.value;
  };

  await send('Page.enable');
  await send('Runtime.enable');

  return {
    send,
    evaluate,
    on: (fn) => listeners.add(fn),
    sleep,
    async viewport(width, height, { reducedMotion = false } = {}) {
      await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 600 });
      await send('Emulation.setEmulatedMedia', {
        features: [{ name: 'prefers-reduced-motion', value: reducedMotion ? 'reduce' : 'no-preference' }],
      });
    },
    async goto(url, settleMs = 1500) {
      await send('Page.navigate', { url });
      await sleep(settleMs);
    },
    async screenshot(clip) {
      const res = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, ...(clip && { clip: { scale: 1, ...clip } }) });
      return Buffer.from(res.result.data, 'base64');
    },
    async close() {
      ws.close();
      proc.kill();
      await sleep(600);
      try {
        rmSync(profile, { recursive: true, force: true });
      } catch {
        /* Chrome may still hold files briefly */
      }
    },
  };
}
