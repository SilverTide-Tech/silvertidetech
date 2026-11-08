import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { NavGroup } from '../../lib/navigation';
import type { NavLink } from '../../lib/site';
import StatusBadge from './StatusBadge';

interface Props {
  /** Ordered top-level entries; `group` entries render as expandable sections. */
  items: Array<{ link: NavLink; current: boolean } | { group: NavGroup; current: boolean }>;
  contact: NavLink;
  homeLabel: string;
  /** ST app-icon mark (for the navy panel). */
  markSrc: string;
}

/**
 * Mobile / tablet menu (< 1024 px), brand-direction §9: full-height navy panel,
 * focus trapped while open, closes on Esc, restores focus to the menu button.
 */
export default function MobileMenu({ items, contact, homeLabel, markSrc }: Props) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    // Close if the viewport grows into the desktop layout.
    const desktop = window.matchMedia('(min-width: 1024px)');
    const onDesktop = (e: MediaQueryListEvent) => e.matches && setOpen(false);

    document.addEventListener('keydown', onKeyDown);
    desktop.addEventListener('change', onDesktop);
    return () => {
      root.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
      desktop.removeEventListener('change', onDesktop);
    };
  }, [open, close]);

  const linkClass = (current: boolean) =>
    `flex min-h-14 items-center border-b border-navy-800 font-display text-[1.375rem] font-semibold ${
      current ? 'text-teal-300' : 'text-white'
    }`;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="grid h-11 w-11 place-items-center rounded-[10px] border border-silver-300 text-navy-900 transition-colors hover:border-navy-900"
      >
        <svg width="18" height="14" viewBox="0 0 18 14" aria-hidden="true">
          <path d="M1 2h16M1 7h16M1 12h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>

      <div
        ref={panelRef}
        id={panelId}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        data-tone="dark"
        className={`fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-navy-900 transition-[opacity,transform,visibility] duration-300 ease-[var(--ease-tide-out)] ${
          open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-3 opacity-0'
        }`}
      >
        <div className="container-site flex h-[4.5rem] shrink-0 items-center justify-between border-b border-navy-700">
          <a href="/" className="inline-flex items-center gap-2.5 whitespace-nowrap">
            <img src={markSrc} alt="" width={28} height={28} className="h-7 w-7 rounded-[24%]" />
            <span className="font-display text-[1.1875rem] leading-none font-extrabold tracking-[-0.02em] text-white">
              {homeLabel}
            </span>
            <span className="sr-only">, home</span>
          </a>
          <button
            ref={closeRef}
            type="button"
            aria-label="Close menu"
            onClick={close}
            className="grid h-11 w-11 place-items-center rounded-[10px] border border-navy-700 text-white transition-colors hover:border-silver-300"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M1 1l12 12M13 1 1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <nav aria-label="Primary" className="container-site flex-1 py-4">
          <ul>
            {items.map((entry) => {
              if ('link' in entry) {
                return (
                  <li key={entry.link.href}>
                    <a href={entry.link.href} aria-current={entry.current ? 'page' : undefined} className={linkClass(entry.current)}>
                      {entry.link.label}
                    </a>
                  </li>
                );
              }
              const { group } = entry;
              const isOpen = expanded === group.label;
              const subId = `${panelId}-${group.label.toLowerCase()}`;
              return (
                <li key={group.href} className="border-b border-navy-800">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={subId}
                    onClick={() => setExpanded(isOpen ? null : group.label)}
                    className={`flex min-h-14 w-full items-center justify-between font-display text-[1.375rem] font-semibold ${
                      entry.current ? 'text-teal-300' : 'text-white'
                    }`}
                  >
                    {group.label}
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 10 10"
                      aria-hidden="true"
                      className={`text-silver-300 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    >
                      <path d="M1.5 3.5 5 7l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <ul id={subId} hidden={!isOpen} className="pb-3">
                    {group.items.map((item) => (
                      <li key={item.href}>
                        <a href={item.href} className="flex min-h-11 items-center justify-between gap-3 pl-3.5 text-[0.9375rem] font-medium text-silver-300 hover:text-white">
                          <span>{item.name}</span>
                          {item.status && <StatusBadge status={item.status} />}
                        </a>
                      </li>
                    ))}
                    <li>
                      <a href={group.href} className="flex min-h-11 items-center pl-3.5 text-[0.9375rem] font-semibold text-teal-300">
                        {group.allLabel}&nbsp;<span aria-hidden="true">→</span>
                      </a>
                    </li>
                  </ul>
                </li>
              );
            })}
          </ul>
          <a
            href={contact.href}
            className="mt-6 flex h-12 w-full items-center justify-center rounded-[var(--radius-btn)] bg-teal-500 font-semibold text-navy-900 transition-colors hover:bg-teal-300"
          >
            {contact.label}
          </a>
        </nav>
      </div>
    </>
  );
}
