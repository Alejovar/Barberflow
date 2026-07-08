import { clsx } from 'clsx';

const steps = ['Tus datos', 'Servicio', 'Fecha', 'Horario', 'Confirmar'];

export function StepIndicator({ current }: { current: number }) {
  return (
    <div className="mb-10 flex items-center justify-between">
      {steps.map((label, i) => {
        const stepNumber = i + 1;
        const isActive = stepNumber === current;
        const isDone = stepNumber < current;
        return (
          <div key={label} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-2">
              <div
                className={clsx(
                  'flex h-9 w-9 items-center justify-center rounded-full font-mono text-sm transition-colors',
                  isActive && 'bg-brass text-ink',
                  isDone && 'bg-moss text-paper',
                  !isActive && !isDone && 'bg-ink/5 text-ash dark:bg-paper/10',
                )}
              >
                {String(stepNumber).padStart(2, '0')}
              </div>
              <span className={clsx('hidden text-xs sm:block', isActive ? 'font-medium' : 'text-ash')}>
                {label}
              </span>
            </div>
            {stepNumber < steps.length && (
              <div className={clsx('mx-2 h-px flex-1', isDone ? 'bg-moss' : 'bg-ink/10 dark:bg-paper/10')} />
            )}
          </div>
        );
      })}
    </div>
  );
}
