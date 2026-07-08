import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { clsx } from 'clsx';
import { useAvailability } from '@/hooks/useAvailability';
import { useBookingStore } from '@/store/booking';
import { Button } from '../ui/Button';

export function StepTime() {
  const { serviceId, date, startTime, setTime, setStep } = useBookingStore();
  const { data, isLoading } = useAvailability(serviceId, date);

  return (
    <div className="space-y-5">
      <h2 className="font-display text-2xl font-medium">Elige un horario</h2>
      {date && (
        <p className="text-sm text-ash">
          Horarios disponibles para el{' '}
          <span className="font-medium text-ink dark:text-paper">
            {format(parseISO(date), "EEEE d 'de' MMMM", { locale: es })}
          </span>
        </p>
      )}

      {isLoading && (
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-11 animate-pulse rounded-xs bg-ink/5 dark:bg-paper/10" />
          ))}
        </div>
      )}

      {!isLoading && data && !data.available && (
        <div className="rounded-lg border border-ink/10 p-6 text-center text-sm text-ash dark:border-paper/10">
          {data.reason === 'FESTIVO' && 'Esta fecha es un día festivo. Elige otra fecha.'}
          {data.reason === 'CERRADO' && 'Cerramos ese día. Elige otra fecha.'}
          {!data.reason && 'No hay horarios disponibles para esta fecha. Elige otra fecha.'}
        </div>
      )}

      {!isLoading && data?.available && (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
          {data.slots.map((slot) => (
            <button
              key={slot}
              onClick={() => setTime(slot)}
              className={clsx(
                'rounded-xs border py-2.5 font-mono text-sm transition-colors',
                startTime === slot
                  ? 'border-brass bg-brass text-ink font-medium'
                  : 'border-ink/10 hover:border-brass/40 dark:border-paper/10',
              )}
            >
              {slot}
            </button>
          ))}
        </div>
      )}

      <div className="flex justify-between pt-2">
        <Button variant="ghost" onClick={() => setStep(3)}>Atrás</Button>
        <Button disabled={!startTime} onClick={() => setStep(5)}>Continuar</Button>
      </div>
    </div>
  );
}
