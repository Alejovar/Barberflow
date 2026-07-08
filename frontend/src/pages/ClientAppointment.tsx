import { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { CheckCircle2, Scissors } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StatusBadge } from '@/components/ui/Badge';
import { api } from '@/lib/api';
import { Appointment } from '@/types';
import { useAvailability } from '@/hooks/useAvailability';

export default function ClientAppointment() {
  const { token = '' } = useParams();
  const location = useLocation();
  const justBooked = (location.state as any)?.justBooked;
  const queryClient = useQueryClient();
  const [rescheduling, setRescheduling] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { data: appointment, isLoading } = useQuery({
    queryKey: ['appointment', token],
    queryFn: () => api.get<Appointment, Appointment>(`/appointments/token/${token}`),
  });

  const { data: availability } = useAvailability(appointment?.serviceId ?? null, newDate || null);

  const cancelMutation = useMutation({
    mutationFn: () => api.patch(`/appointments/token/${token}/cancel`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['appointment', token] }),
    onError: (err: Error) => setError(err.message),
  });

  const rescheduleMutation = useMutation({
    mutationFn: () => api.patch(`/appointments/token/${token}/reschedule`, { date: newDate, startTime: newTime }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointment', token] });
      setRescheduling(false);
    },
    onError: (err: Error) => setError(err.message),
  });

  if (isLoading) {
    return <div className="container-app py-24 text-center text-sm text-ash">Cargando tu reservación...</div>;
  }

  if (!appointment) {
    return (
      <div>
        <Header />
        <div className="container-app py-24 text-center">
          <p className="text-sm text-ash">No se encontró esta reservación. Verifica el enlace.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const canModify = appointment.status === 'PENDING' || appointment.status === 'CONFIRMED';

  return (
    <div>
      <Header />
      <main className="container-app max-w-xl py-16">
        {justBooked && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-moss/30 bg-moss/5 p-4 text-sm text-moss dark:text-moss-bright">
            <CheckCircle2 size={18} />
            ¡Tu reservación fue creada! Te enviamos un correo con los detalles.
          </div>
        )}

        <Card className="p-6">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scissors size={18} className="text-brass" />
              <h1 className="font-display text-xl font-medium">{appointment.service.name}</h1>
            </div>
            <StatusBadge status={appointment.status} />
          </div>

          <div className="divide-y divide-ink/10 dark:divide-paper/10">
            {[
              ['Nombre', appointment.customerName],
              ['Fecha', format(parseISO(appointment.date), "EEEE d 'de' MMMM 'de' yyyy", { locale: es })],
              ['Hora', `${appointment.startTime} - ${appointment.endTime}`],
              ['Precio', `$${Number(appointment.service.price).toFixed(0)}`],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between py-2.5 text-sm">
                <span className="text-ash">{label}</span>
                <span className="font-medium capitalize">{value}</span>
              </div>
            ))}
          </div>

          {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

          {canModify && !rescheduling && (
            <div className="mt-6 flex gap-3">
              <Button variant="ghost" onClick={() => setRescheduling(true)}>Reagendar</Button>
              <Button variant="danger" onClick={() => cancelMutation.mutate()} disabled={cancelMutation.isPending}>
                {cancelMutation.isPending ? 'Cancelando...' : 'Cancelar cita'}
              </Button>
            </div>
          )}

          {canModify && rescheduling && (
            <div className="mt-6 space-y-4 border-t border-ink/10 pt-6 dark:border-paper/10">
              <h3 className="font-medium">Elige nueva fecha y hora</h3>
              <Input type="date" label="Nueva fecha" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
              {newDate && (
                <div className="grid grid-cols-4 gap-2">
                  {availability?.slots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setNewTime(slot)}
                      className={`rounded-xs border py-2 font-mono text-sm ${
                        newTime === slot ? 'border-brass bg-brass text-ink' : 'border-ink/10 dark:border-paper/10'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                  {availability && availability.slots.length === 0 && (
                    <p className="col-span-4 text-xs text-ash">Sin horarios disponibles ese día.</p>
                  )}
                </div>
              )}
              <div className="flex gap-3">
                <Button variant="ghost" onClick={() => setRescheduling(false)}>Cancelar</Button>
                <Button
                  disabled={!newDate || !newTime || rescheduleMutation.isPending}
                  onClick={() => rescheduleMutation.mutate()}
                >
                  {rescheduleMutation.isPending ? 'Guardando...' : 'Confirmar nueva fecha'}
                </Button>
              </div>
            </div>
          )}
        </Card>
      </main>
      <Footer />
    </div>
  );
}
