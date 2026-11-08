import { STATUS_META, type Status } from '../../lib/status';

export default function StatusBadge({ status, className = '' }: { status: Status; className?: string }) {
  const meta = STATUS_META[status];
  return (
    <span className={`status-badge ${meta.className} ${className}`} data-status={status}>
      {meta.label}
    </span>
  );
}
