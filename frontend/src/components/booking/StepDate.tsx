import { useState } from 'react';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isBefore,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfToday,
  subMonths,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { useBookingStore } from '@/store/booking';
import { Button } from '../ui/Button';

export function StepDate() {
  const { date, setDate, setStep } = useBookingStore();
  const [month, setMonth] = useState(startOfMonth(new Date()));
  const today = startOfToday();

  const firstDay = startOfMonth(month);
  const lastDay = endOfMonth(month);
  const days = eachDayOfInterval({ start: firstDay, end: lastDay });
  const leadingBlanks = getDay(firstDay);

  return (
    <div className="space-y-5">
      <h2 className="font-display text-2xl font-medium">Elige una fecha</h2>

      <div className="rounded-lg border border-ink/10 p-5 dark:border-paper/10">
        <div className="mb-4 flex items-center justify-between">
          <button onClick={() => setMonth(subMonths(month, 1))} aria-label="Mes anterior" className="rounded p-1 hover:bg-ink/5 dark:hover:bg-paper/10">
            <ChevronLeft size={18} />
          </button>
          <span className="font-medium capitalize">{format(month, 'MMMM yyyy', { locale: es })}</span>
          <button onClick={() => setMonth(addMonths(month, 1))} aria-label="Mes siguiente" className="rounded p-1 hover:bg-ink/5 dark:hover:bg-paper/10">
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs text-ash">
          {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'].map((d) => (
            <span key={d} className="py-1">{d}</span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: leadingBlanks }).map((_, i) => (
            <div key={`blank-${i}`} />
          ))}
          {days.map((day) => {
            const dayOfWeek = getDay(day);
            const isSunday = dayOfWeek === 0;
            const isPast = isBefore(day, today) && !isToday(day);
            const disabled = isSunday || isPast;
            const dateStr = format(day, 'yyyy-MM-dd');
            const isSelected = date === dateStr;

            return (
              <button
                key={dateStr}
                disabled={disabled}
                onClick={() => setDate(dateStr)}
                className={clsx(
                  'aspect-square rounded-xs text-sm transition-colors',
                  disabled && 'cursor-not-allowed text-ash/40',
                  !disabled && !isSelected && 'hover:bg-brass/10',
                  isSelected && 'bg-brass text-ink font-medium',
                  isToday(day) && !isSelected && 'ring-1 ring-brass/50',
                  !isSameMonth(day, month) && 'opacity-30',
                )}
              >
                {format(day, 'd')}
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-ash">No recibimos reservaciones los domingos ni en días festivos.</p>

      <div className="flex justify-between pt-2">
        <Button variant="ghost" onClick={() => setStep(2)}>Atrás</Button>
        <Button disabled={!date} onClick={() => setStep(4)}>Continuar</Button>
      </div>
    </div>
  );
}
