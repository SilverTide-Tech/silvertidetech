import { useEffect, useRef, useState } from 'react';

/**
 * Hero tide lines (brand-direction §6.1, §10). The SVG is server-rendered and drifts with CSS alone;
 * hydration adds the pointer swell, the visible pause control and off-screen pausing.
 * Under prefers-reduced-motion the field is static and the control is hidden.
 */

const WIDTH = 1440;
const PERIOD = 360;

function wavePath(y: number, amplitude: number, phase: number): string {
  let d = '';
  for (let x = -PERIOD; x <= WIDTH + PERIOD; x += 12) {
    const yy = y + amplitude * Math.sin(((x + phase) / PERIOD) * Math.PI * 2);
    d += `${x === -PERIOD ? 'M' : 'L'}${x} ${yy.toFixed(1)}`;
  }
  return d;
}

interface Props {
  lines?: number;
  height?: number;
  /** Index of the single Sea Teal line. */
  accentIndex?: number;
  showControl?: boolean;
}

export default function TideField({ lines = 9, height = 640, accentIndex = 3, showControl = true }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const groupRefs = useRef<Array<SVGGElement | null>>([]);
  const [paused, setPaused] = useState(false);
  const [offscreen, setOffscreen] = useState(false);

  const top = height * 0.38;
  const gap = (height - top) / lines;
  const field = Array.from({ length: lines }, (_, i) => ({
    y: top + i * gap,
    d: wavePath(top + i * gap, 9 + (i % 3) * 4, i * 47),
    accent: i === accentIndex,
    opacity: i === accentIndex ? 0.95 : 0.16 + (i % 4) * 0.06,
    duration: 20 + i * 3.5,
  }));

  // Pause ambient motion when the hero is off-screen (§10.7).
  useEffect(() => {
    const el = rootRef.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([entry]) => setOffscreen(!entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Pointer swell: lines near the cursor rise slightly. Disabled for touch, reduced motion and when paused.
  useEffect(() => {
    const host = rootRef.current?.closest<HTMLElement>('[data-tide-host]');
    if (!host) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const reset = () => groupRefs.current.forEach((g) => g && (g.style.transform = ''));
    const onMove = (e: PointerEvent) => {
      if (paused || reduce.matches || e.pointerType === 'touch') return;
      const rect = host.getBoundingClientRect();
      const py = ((e.clientY - rect.top) / rect.height) * height;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        field.forEach((line, i) => {
          const k = Math.exp(-(((py - line.y) / 90) ** 2));
          const g = groupRefs.current[i];
          if (g) g.style.transform = `translateY(${(-18 * k).toFixed(1)}px)`;
        });
      });
    };
    host.addEventListener('pointermove', onMove);
    host.addEventListener('pointerleave', reset);
    if (paused) reset();
    return () => {
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', reset);
      cancelAnimationFrame(frame);
    };
    // field is derived from props only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, height]);

  return (
    // No z-index here: the SVG paints beneath the hero content (z-10) while the control (z-20) stays clickable.
    <div ref={rootRef} className="pointer-events-none absolute inset-0" data-tide-paused={paused || offscreen}>
      <svg
        className="h-full w-full"
        viewBox={`0 0 ${WIDTH} ${height}`}
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        focusable="false"
      >
        {field.map((line, i) => (
          <g
            key={i}
            ref={(el) => {
              groupRefs.current[i] = el;
            }}
            className="tide-line"
            style={{ ['--tide-duration' as string]: `${line.duration}s` }}
          >
            <path
              d={line.d}
              fill="none"
              stroke={line.accent ? '#14B3A8' : '#A9B4C2'}
              strokeOpacity={line.opacity}
              strokeWidth={line.accent ? 2 : 1.2}
              strokeLinecap="round"
            />
          </g>
        ))}
      </svg>

      {showControl && (
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          className="pointer-events-auto absolute right-6 bottom-6 z-20 inline-flex h-11 items-center gap-2 rounded-[var(--radius-btn)] border border-navy-700 bg-navy-900/70 px-3.5 text-[0.8125rem] font-medium text-silver-300 backdrop-blur-sm transition-colors hover:border-silver-300 hover:text-white motion-reduce:hidden md:right-8 md:bottom-8"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            {paused ? (
              <path d="M3 1.8v8.4L10 6z" fill="currentColor" />
            ) : (
              <path d="M3 1.5h2v9H3zM7 1.5h2v9H7z" fill="currentColor" />
            )}
          </svg>
          {paused ? 'Play motion' : 'Pause motion'}
        </button>
      )}
    </div>
  );
}
