import { Link } from 'react-router-dom';
import { Scissors } from 'lucide-react';
import { useServices } from '@/hooks/useServices';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export function Services() {
  const { data: services, isLoading } = useServices();

  return (
    <section id="servicios" className="container-app py-24">
      <div className="mb-14 max-w-lg">
        <span className="text-xs font-medium uppercase tracking-wide text-brass">Servicios</span>
        <h2 className="mt-3 font-display text-3xl font-medium tracking-tight md:text-4xl">
          Cada corte, a tu medida.
        </h2>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="h-48 animate-pulse p-6" />
          ))}

        {services?.map((s) => (
          <Card key={s.id} className="flex flex-col p-6 transition-colors hover:border-brass/40">
            <Scissors size={20} className="mb-4 text-brass" />
            <h3 className="font-display text-xl font-medium">{s.name}</h3>
            <p className="mt-2 flex-1 text-sm text-ash">{s.description}</p>
            <div className="mt-5 flex items-center justify-between border-t border-ink/10 pt-4 dark:border-paper/10">
              <span className="font-mono text-sm text-ash">{s.duration} min</span>
              <span className="font-mono text-lg font-medium text-brass-dark dark:text-brass-bright">
                ${Number(s.price).toFixed(0)}
              </span>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link to="/reservar">
          <Button size="lg">Reservar ahora</Button>
        </Link>
      </div>
    </section>
  );
}
