import { HTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { AppointmentStatus } from '@/types';

const statusMap: Record<AppointmentStatus, { label: string; className: string }> = {
  PENDING: { label: 'Pendiente', className: 'bg-brass/15 text-brass-dark dark:text-brass-bright' },
  CONFIRMED: { label: 'Confirmada', className: 'bg-moss/15 text-moss dark:text-moss-bright' },
  FINISHED: { label: 'Finalizada', className: 'bg-ash/15 text-ash' },
  CANCELLED: { label: 'Cancelada', className: 'bg-red-500/10 text-red-500' },
};

export function StatusBadge({ status }: { status: AppointmentStatus }) {
  const { label, className } = statusMap[status];
  return (
    <span className={clsx('inline-flex items-center rounded-full px-3 py-1 text-xs font-medium', className)}>
      {label}
    </span>
  );
}

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full border border-ink/10 px-3 py-1 text-xs font-medium dark:border-paper/10',
        className,
      )}
      {...props}
    />
  );
}
