import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          'inline-flex items-center justify-center gap-2 rounded-xs font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed',
          variant === 'primary' &&
            'bg-brass text-ink hover:bg-brass-bright active:scale-[0.98]',
          variant === 'secondary' &&
            'bg-ink text-paper hover:bg-ink-soft dark:bg-paper dark:text-ink dark:hover:bg-paper-dim',
          variant === 'ghost' &&
            'bg-transparent text-current hover:bg-ink/5 dark:hover:bg-paper/10 border border-ink/15 dark:border-paper/15',
          variant === 'danger' && 'bg-red-600 text-white hover:bg-red-700',
          size === 'sm' && 'px-3 py-1.5 text-sm',
          size === 'md' && 'px-5 py-2.5 text-sm',
          size === 'lg' && 'px-7 py-3.5 text-base',
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';
