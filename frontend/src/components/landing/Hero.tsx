import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAvailability } from '@/hooks/useAvailability';
import { useServices } from '@/hooks/useServices';

export function Hero() {
  const { data: services } = useServices();
  const today = new Date().toISOString().split('T')[0];
  const firstServiceId = services?.[0]?.id ?? null;
  const { data: availability, isLoading } = useAvailability(firstServiceId, today);

  return (
    <section className="relative overflow-hidden bg-ink text-paper">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(115deg, #F5F0E8 0px, #F5F0E8 1px, transparent 1px, transparent 80px)',
        }}
      />
      <div className="container-app relative grid gap-14 py-24 md:grid-cols-2 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-brass/30 px-4 py-1.5 text-xs font-medium tracking-wide text-brass-bright">
            Reservaciones en línea, sin llamadas
          </span>
          <h1 className="font-display text-5xl font-medium leading-[1.05] tracking-tight md:text-6xl">
            Tu barbero,
            <br />
            <span className="text-brass-bright">sin líneas de espera.</span>
          </h1>
          <p className="mt-6 max-w-md text-base text-paper/70">
            Elige tu servicio, tu horario y confirma tu cita en menos de un minuto.
            Sin cuentas, sin esperas, sin sorpresas.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link to="/reservar">
              <Button size="lg" className="group">
                Reservar cita
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <a href="#servicios">
              <Button size="lg" variant="ghost" className="border-paper/20 text-paper hover:bg-paper/10">
                Ver servicios
              </Button>
            </a>
          </div>
        </motion.div>

        {/* Elemento firma: franja de horarios disponibles hoy, en vivo */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
          className="self-center"
        >
          <div className="rounded-lg border border-paper/10 bg-paper/[0.03] p-6 backdrop-blur-sm">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-ash">
                Disponibilidad de hoy
              </span>
              <span className="flex items-center gap-1.5 text-xs text-moss-bright">
                <span className="h-1.5 w-1.5 animate-pulseSlot rounded-full bg-moss-bright" />
                En vivo
              </span>
            </div>

            {isLoading && (
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-10 animate-pulse rounded-xs bg-paper/10" />
                ))}
              </div>
            )}

            {!isLoading && availability && availability.slots.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {availability.slots.slice(0, 9).map((slot) => (
                  <div
                    key={slot}
                    className="rounded-xs border border-paper/10 bg-paper/[0.02] py-2 text-center font-mono text-sm text-paper/80"
                  >
                    {slot}
                  </div>
                ))}
              </div>
            )}

            {!isLoading && (!availability || availability.slots.length === 0) && (
              <p className="text-sm text-ash">
                No hay horarios disponibles hoy. Elige otra fecha al reservar.
              </p>
            )}

            <Link to="/reservar" className="mt-5 block text-center text-sm font-medium text-brass-bright hover:underline">
              Ver todos los horarios →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
