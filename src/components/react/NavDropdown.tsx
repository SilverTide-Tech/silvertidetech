import { useEffect, useId, useRef, useState } from 'react';
import type { NavGroup } from '../../lib/navigation';
import StatusBadge from './StatusBadge';

interface Props {
  group: NavGroup;
  current: boolean;
}

/**
 * Desktop menu panel (architecture §2.1). Split pattern: the label is a real link to the
 * overview page (works without JavaScript); the chevron button discloses the panel.
 */
export default function NavDropdown({ group, current }: Props) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="relative flex items-center"
      onBlur={(e) => {
        if (!rootRef.current?.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <a
        href={group.href}
        aria-current={current ? 'page' : undefined}
        className={`py-1.5 text-[0.9375rem] font-medium transition-colors hover:text-teal-700 ${
          current ? 'nav-active-stroke text-teal-700' : 'text-navy-900'
        }`}
      >
        {group.label}
      </a>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`${open ? 'Hide' : 'Show'} ${group.label} menu`}
        onClick={() => setOpen((v) => !v)}
        className="-mr-2 ml-0.5 grid h-8 w-8 place-items-center rounded-md text-ink-500 transition-colors hover:text-navy-900"
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          aria-hidden="true"
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M1.5 3.5 5 7l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div
        id={panelId}
        hidden={!open}
        className="absolute top-[calc(100%+0.75rem)] left-1/2 z-50 w-[26rem] -translate-x-1/2 rounded-[14px] border border-silver-200 bg-white p-2.5 shadow-[0_18px_40px_-18px_rgba(11,31,58,0.28)]"
      >
        <ul className="grid gap-0.5">
          {group.items.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="flex items-center justify-between gap-4 rounded-[10px] px-3.5 py-3 text-navy-900 transition-colors hover:bg-mist"
              >
                <span className="min-w-0">
                  <span className="block font-display font-bold">{item.name}</span>
                  {item.description && <span className="mt-0.5 block text-[0.8125rem] leading-snug text-ink-500">{item.description}</span>}
                </span>
                {item.status && <StatusBadge status={item.status} />}
              </a>
            </li>
          ))}
        </ul>
        <a
          href={group.href}
          className="mt-1.5 block rounded-[10px] border-t border-silver-200 px-3.5 pt-3.5 pb-3 text-sm font-semibold text-teal-700 hover:bg-mist"
        >
          {group.allLabel} <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  );
}
