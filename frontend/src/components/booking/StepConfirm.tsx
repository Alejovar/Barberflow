import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { useBookingStore } from '@/store/booking';
import { useServices } from '@/hooks/useServices';
import { api } from '@/lib/api';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { Appointment } from '@/types';

export function StepConfirm() {
  const navigate = useNavigate();
  const { customer, serviceId, date, startTime, setStep, reset } = useBookingStore();
  const { data: services } = useServices();
  const service = services?.find((s) => s.id === serviceId);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () =>
      api.post<Appointment, Appointment>('/appointments', {
        ...customer,
        serviceId,
        date,
        startTime,
        notes: notes || undefined,
      }),
    onSuccess: (appointment) => {
      reset();
      navigate(`/mi-cita/${appointment.managementToken}`, { state: { justBooked: true } });
    },
    onError: (err: Error) => setError(err.message),
  });

  if (!customer || !service || !date || !startTime) {
    return <p className="text-sm text-ash">Faltan datos. Vuelve al paso anterior.</p>;
  }

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-medium">Confirma tu reservación</h2>

      <div className="divide-y divide-ink/10 rounded-lg border border-ink/10 dark:divide-paper/10 dark:border-paper/10">
        {[
          ['Nombre', customer.customerName],
          ['Correo', customer.customerEmail],
          ['Teléfono', customer.customerPhone],
          ['Servicio', service.name],
          ['Fecha', format(parseISO(date), "EEEE d 'de' MMMM 'de' yyyy", { locale: es })],
          ['Hora', startTime],
          ['Precio', `$${Number(service.price).toFixed(0)}`],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between px-5 py-3 text-sm">
            <span className="text-ash">{label}</span>
            <span className="font-medium capitalize">{value}</span>
          </div>
        ))}
      </div>

      <Textarea
        label="Notas (opcional)"
        placeholder="Alguna indicación para tu barbero..."
        rows={3}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      {error && (
        <div className="rounded-xs border border-red-500/30 bg-red-500/5 p-3 text-sm text-red-500">
          {error}
        </div>
      )}

      <div className="flex justify-between pt-2">
        <Button variant="ghost" onClick={() => setStep(4)} disabled={mutation.isPending}>
          Atrás
        </Button>
        <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
          {mutation.isPending ? 'Confirmando...' : 'Confirmar reservación'}
        </Button>
      </div>
    </div>
  );
}
