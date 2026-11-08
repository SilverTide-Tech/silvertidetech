/**
 * Product / service / roadmap status vocabulary.
 * Source of truth: docs/strategy/website-architecture.md §7.
 * Badges and ordering are always derived from this module; copy never hard-codes a status word.
 */
export const STATUSES = ['available-now', 'early-access', 'in-development', 'planned'] as const;

export type Status = (typeof STATUSES)[number];

interface StatusMeta {
  label: string;
  /** Tailwind classes for the badge text/background pair. */
  className: string;
  /** Display order within any list (architecture §7.3). */
  order: number;
}

export const STATUS_META: Record<Status, StatusMeta> = {
  'available-now': { label: 'Available Now', className: 'bg-status-live-bg text-status-live', order: 0 },
  'early-access': { label: 'Early Access', className: 'bg-status-early-bg text-status-early', order: 1 },
  'in-development': { label: 'In Development', className: 'bg-status-dev-bg text-status-dev', order: 2 },
  planned: { label: 'Planned', className: 'bg-status-planned-bg text-status-planned', order: 3 },
};

/** Statuses that may link to a live product or sign-up (architecture §7.2 rule 2). */
export const LAUNCHED_STATUSES: readonly Status[] = ['available-now', 'early-access'];

export function compareByStatusThenOrder(
  a: { status?: Status; order: number },
  b: { status?: Status; order: number },
): number {
  const sa = a.status ? STATUS_META[a.status].order : -1;
  const sb = b.status ? STATUS_META[b.status].order : -1;
  return sa - sb || a.order - b.order;
}
