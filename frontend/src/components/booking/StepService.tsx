import { useServices } from '@/hooks/useServices';
import { useBookingStore } from '@/store/booking';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { clsx } from 'clsx';

export function StepService() {
  const { data: services, isLoading } = useServices();
  const { serviceId, setService, setStep } = useBookingStore();

  return (
    <div className="space-y-5">
      <h2 className="font-display text-2xl font-medium">Elige tu servicio</h2>

      <div className="grid gap-3 sm:grid-cols-2">
        {isLoading && Array.from({ length: 4 }).map((_, i) => <Card key={i} className="h-28 animate-pulse" />)}
        {services?.map((s) => (
          <Card
            key={s.id}
            onClick={() => setService(s.id)}
            className={clsx(
              'cursor-pointer p-5 transition-colors',
              serviceId === s.id ? 'border-brass ring-1 ring-brass' : 'hover:border-brass/40',
            )}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">{s.name}</h3>
                <p className="mt-1 text-xs text-ash">{s.description}</p>
              </div>
              <span className="font-mono text-sm font-medium text-brass-dark dark:text-brass-bright">
                ${Number(s.price).toFixed(0)}
              </span>
            </div>
            <span className="mt-3 block font-mono text-xs text-ash">{s.duration} min</span>
          </Card>
        ))}
      </div>

      <div className="flex justify-between pt-2">
        <Button variant="ghost" onClick={() => setStep(1)}>Atrás</Button>
        <Button disabled={!serviceId} onClick={() => setStep(3)}>Continuar</Button>
      </div>
    </div>
  );
}
