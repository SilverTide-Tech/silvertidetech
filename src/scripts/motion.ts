/**
 * Premium motion layer (GSAP). Loaded after idle from BaseLayout; skipped entirely under
 * prefers-reduced-motion. Content never depends on it: everything is visible without it.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

/** Spotlight runs even without GSAP; it is CSS-variable only. */
function initSpot() {
  if (!matchMedia('(pointer: fine)').matches) return;
  document.querySelectorAll<HTMLElement>('[data-spot]').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
      el.dataset.spotOn = '';
    });
    el.addEventListener('pointerleave', () => delete el.dataset.spotOn);
  });
}

export function initMotion() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  initSpot();

  const fine = matchMedia('(pointer: fine)').matches;

  // Momentum smooth scrolling (mouse devices only), wired into ScrollTrigger
  if (fine) {
    const lenis = new Lenis({ lerp: 0.1, anchors: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // Cursor follower: a ring that grows over interactive elements. The native cursor stays.
  if (fine) {
    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    ring.setAttribute('aria-hidden', 'true');
    document.body.appendChild(ring);
    const cx = gsap.quickTo(ring, 'x', { duration: 0.25, ease: 'power3.out' });
    const cy = gsap.quickTo(ring, 'y', { duration: 0.25, ease: 'power3.out' });
    addEventListener('pointermove', (e) => { ring.dataset.on = ''; cx(e.clientX); cy(e.clientY); }, { passive: true });
    document.addEventListener('pointerleave', () => delete ring.dataset.on);
    document.addEventListener('pointerover', (e) => {
      ring.toggleAttribute('data-hover', !!(e.target as Element).closest('a, button, [role="button"], input, summary'));
    });
  }

  // Text scramble: eyebrows decode from noise once as they enter view
  const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>_';
  document.querySelectorAll<HTMLElement>('[data-scramble]').forEach((el) => {
    if (el.children.length) return;
    const text = el.textContent ?? '';
    ScrollTrigger.create({
      trigger: el, start: 'top 90%', once: true,
      onEnter: () => {
        const t0 = performance.now(); const dur = 700;
        const tick = (now: number) => {
          const k = Math.min((now - t0) / dur, 1);
          const done = Math.floor(k * text.length);
          el.textContent = text.split('').map((c, i) => (c === ' ' || i < done ? c : glyphs[Math.floor(Math.random() * glyphs.length)])).join('');
          if (k < 1) requestAnimationFrame(tick); else el.textContent = text;
        };
        requestAnimationFrame(tick);
      },
    });
  });
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  gsap.registerPlugin(ScrollTrigger);

  // Reading progress bar
  const bar = document.querySelector<HTMLElement>('.scroll-progress');
  if (bar) {
    gsap.to(bar, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.2 } });
  }

  // Parallax: [data-parallax="40"] drifts by that many px across its section
  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
    const amount = Number(el.dataset.parallax) || 40;
    gsap.fromTo(el, { y: -amount }, { y: amount, ease: 'none', scrollTrigger: { trigger: el.parentElement ?? el, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  // Section transitions: heading blocks rise as sections enter
  document.querySelectorAll<HTMLElement>('[data-rise]').forEach((el) => {
    gsap.from(el, { y: 36, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
  });

  // Magnetic buttons (fine pointers only)
  if (matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
      const x = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' });
      const y = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' });
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        x((e.clientX - (r.left + r.width / 2)) * 0.25);
        y((e.clientY - (r.top + r.height / 2)) * 0.35);
      });
      el.addEventListener('pointerleave', () => { x(0); y(0); });
    });
  }

  // Tilt on the product showcase
  // Orb recedes as the hero scrolls away
  const visual = document.querySelector<HTMLElement>('[data-hero-visual]');
  if (visual?.parentElement) {
    gsap.to(visual, { scale: 0.86, opacity: 0.25, ease: 'none', scrollTrigger: { trigger: visual.parentElement, start: 'top top', end: 'bottom top', scrub: true } });
  }

  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((el) => {
    const host = el.dataset.tilt === 'self' ? el : el.parentElement ?? el;
    host.addEventListener('pointermove', (e) => {
      if ((e as PointerEvent).pointerType === 'touch') return;
      const r = host.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(el, { rotateY: px * 8, rotateX: -py * 6, transformPerspective: 1000, duration: 0.6, ease: 'power3.out' });
    });
    host.addEventListener('pointerleave', () => gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.8, ease: 'power3.out' }));
  });
}
