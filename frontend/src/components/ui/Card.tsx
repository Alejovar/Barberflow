import { HTMLAttributes } from 'react';
import { clsx } from 'clsx';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        'rounded-lg border border-ink/10 bg-paper-soft dark:border-paper/10 dark:bg-ink-soft',
        className,
      )}
      {...props}
    />
  );
}
