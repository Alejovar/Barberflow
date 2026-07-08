import { TextareaHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, id, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink/70 dark:text-paper/70">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={id}
        className={clsx(
          'w-full rounded-xs border border-ink/15 bg-paper px-4 py-2.5 text-sm text-ink placeholder:text-ash outline-none transition-colors focus:border-brass dark:border-paper/15 dark:bg-ink dark:text-paper',
          className,
        )}
        {...props}
      />
    </div>
  ),
);
Textarea.displayName = 'Textarea';
