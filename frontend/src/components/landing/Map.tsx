import { MapPin } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';

export function LocationMap() {
  const { data: settings } = useSettings();

  return (
    <section className="container-app pb-24">
      <div className="grid overflow-hidden rounded-lg border border-ink/10 md:grid-cols-2 dark:border-paper/10">
        <div className="flex flex-col justify-center gap-4 p-8">
          <span className="text-xs font-medium uppercase tracking-wide text-brass">Ubicación</span>
          <h3 className="font-display text-2xl font-medium">{settings?.businessName || 'BarberFlow'}</h3>
          <p className="flex items-start gap-2 text-sm text-ash">
            <MapPin size={16} className="mt-0.5 shrink-0" />
            {settings?.address || 'Av. Venustiano Carranza 123, Saltillo, Coahuila'}
          </p>
        </div>
        <iframe
          title="Ubicación BarberFlow"
          className="h-64 w-full md:h-full"
          loading="lazy"
          src="https://www.google.com/maps?q=Saltillo,Coahuila&output=embed"
        />
      </div>
    </section>
  );
}
