import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { api } from '@/lib/api';
import { Appointment, AppointmentStatus } from '@/types';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';

const statusOptions: AppointmentStatus[] = ['PENDING', 'CONFIRMED', 'FINISHED', 'CANCELLED'];

export default function Agenda() {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const queryClient = useQueryClient();

  const { data: appointments, isLoading } = useQuery({
    queryKey: ['admin-appointments', statusFilter],
    queryFn: () =>
      api.get<Appointment[], Appointment[]>(
        `/appointments${statusFilter ? `?status=${statusFilter}` : ''}`,
      ),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: AppointmentStatus }) =>
      api.patch(`/appointments/${id}/status`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-appointments'] }),
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-medium">Agenda</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xs border border-ink/15 bg-paper px-3 py-2 text-sm dark:border-paper/15 dark:bg-ink"
        >
          <option value="">Todos los estados</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-left text-xs uppercase text-ash dark:border-paper/10">
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Servicio</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Hora</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/5 dark:divide-paper/5">
            {isLoading && (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-ash">Cargando...</td></tr>
            )}
            {appointments?.map((a) => (
              <tr key={a.id}>
                <td className="px-4 py-3">
                  <p className="font-medium">{a.customerName}</p>
                  <p className="text-xs text-ash">{a.customerEmail}</p>
                </td>
                <td className="px-4 py-3">{a.service.name}</td>
                <td className="px-4 py-3">{format(parseISO(a.date), 'd MMM yyyy', { locale: es })}</td>
                <td className="px-4 py-3 font-mono">{a.startTime}</td>
                <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                <td className="px-4 py-3">
                  <select
                    value={a.status}
                    onChange={(e) => updateStatus.mutate({ id: a.id, status: e.target.value as AppointmentStatus })}
                    className="rounded-xs border border-ink/15 bg-paper px-2 py-1 text-xs dark:border-paper/15 dark:bg-ink"
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {!isLoading && appointments?.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-ash">Sin reservaciones.</td></tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
