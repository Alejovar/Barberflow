import { useBusinessHours } from '@/hooks/useBusinessHours';

const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export function Schedule() {
  const { data: hours, isLoading } = useBusinessHours();
  const todayIndex = new Date().getDay();

  return (
    <section id="horarios" className="container-app py-24">
      <div className="grid gap-12 md:grid-cols-2">
        <div>
          <span className="text-xs font-medium uppercase tracking-wide text-brass">Horarios</span>
          <h2 className="mt-3 font-display text-3xl font-medium tracking-tight md:text-4xl">
            Cuándo estamos abiertos.
          </h2>
          <p className="mt-4 max-w-sm text-sm text-ash">
            Cerramos los domingos. Consulta la disponibilidad exacta al momento de reservar tu cita.
          </p>
        </div>

        <div className="divide-y divide-ink/10 dark:divide-paper/10">
          {isLoading &&
            Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse" />
            ))}

          {hours
            ?.slice()
            .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
            .map((h) => (
              <div
                key={h.dayOfWeek}
                className={`flex items-center justify-between py-3 text-sm ${
                  h.dayOfWeek === todayIndex ? 'font-semibold text-brass-dark dark:text-brass-bright' : ''
                }`}
              >
                <span>{dayNames[h.dayOfWeek]}</span>
                <span className="font-mono">
                  {h.isOpen ? `${h.openTime} – ${h.closeTime}` : 'Cerrado'}
                </span>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
