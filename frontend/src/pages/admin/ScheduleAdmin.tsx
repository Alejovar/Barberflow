import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import { BusinessHour } from '@/hooks/useBusinessHours';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

interface Holiday { id: string; date: string; label: string; }

export default function ScheduleAdmin() {
  const queryClient = useQueryClient();
  const { data: hours } = useQuery({
    queryKey: ['admin-business-hours'],
    queryFn: () => api.get<BusinessHour[], BusinessHour[]>('/business-hours'),
  });
  const { data: holidays } = useQuery({
    queryKey: ['admin-holidays'],
    queryFn: () => api.get<Holiday[], Holiday[]>('/holidays'),
  });

  const [localHours, setLocalHours] = useState<BusinessHour[]>([]);
  const [holidayDate, setHolidayDate] = useState('');
  const [holidayLabel, setHolidayLabel] = useState('');

  useEffect(() => {
    if (hours) setLocalHours(hours);
  }, [hours]);

  const saveHour = useMutation({
    mutationFn: (h: BusinessHour) => api.put('/business-hours', h),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-business-hours'] }),
  });

  const addHoliday = useMutation({
    mutationFn: () => api.post('/holidays', { date: holidayDate, label: holidayLabel }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-holidays'] });
      setHolidayDate('');
      setHolidayLabel('');
    },
  });

  const removeHoliday = useMutation({
    mutationFn: (id: string) => api.delete(`/holidays/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-holidays'] }),
  });

  return (
    <div className="space-y-10">
      <div>
        <h1 className="mb-6 font-display text-2xl font-medium">Horarios laborales</h1>
        <Card className="divide-y divide-ink/10 dark:divide-paper/10">
          {localHours.sort((a, b) => a.dayOfWeek - b.dayOfWeek).map((h, i) => (
            <div key={h.dayOfWeek} className="flex flex-wrap items-center gap-4 px-5 py-4">
              <span className="w-28 font-medium">{dayNames[h.dayOfWeek]}</span>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={h.isOpen}
                  onChange={(e) => {
                    const updated = [...localHours];
                    updated[i] = { ...h, isOpen: e.target.checked };
                    setLocalHours(updated);
                  }}
                />
                Abierto
              </label>
              {h.isOpen && (
                <>
                  <input type="time" value={h.openTime} onChange={(e) => {
                    const updated = [...localHours];
                    updated[i] = { ...h, openTime: e.target.value };
                    setLocalHours(updated);
                  }} className="rounded-xs border border-ink/15 bg-paper px-2 py-1 text-sm dark:border-paper/15 dark:bg-ink" />
                  <span className="text-ash">a</span>
                  <input type="time" value={h.closeTime} onChange={(e) => {
                    const updated = [...localHours];
                    updated[i] = { ...h, closeTime: e.target.value };
                    setLocalHours(updated);
                  }} className="rounded-xs border border-ink/15 bg-paper px-2 py-1 text-sm dark:border-paper/15 dark:bg-ink" />
                </>
              )}
              <Button size="sm" variant="ghost" className="ml-auto" onClick={() => saveHour.mutate(h)}>
                Guardar
              </Button>
            </div>
          ))}
        </Card>
      </div>

      <div>
        <h2 className="mb-6 font-display text-2xl font-medium">Días festivos</h2>
        <Card className="p-5">
          <form
            onSubmit={(e) => { e.preventDefault(); addHoliday.mutate(); }}
            className="mb-5 flex flex-wrap items-end gap-3"
          >
            <Input label="Fecha" type="date" value={holidayDate} onChange={(e) => setHolidayDate(e.target.value)} required />
            <Input label="Descripción" value={holidayLabel} onChange={(e) => setHolidayLabel(e.target.value)} placeholder="Navidad" required />
            <Button type="submit" size="sm">Agregar</Button>
          </form>

          <div className="divide-y divide-ink/10 dark:divide-paper/10">
            {holidays?.map((h) => (
              <div key={h.id} className="flex items-center justify-between py-2.5 text-sm">
                <span>{new Date(h.date).toLocaleDateString('es-MX')} — {h.label}</span>
                <button onClick={() => removeHoliday.mutate(h.id)} className="rounded p-1 hover:bg-red-500/10 hover:text-red-500">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            {holidays?.length === 0 && <p className="py-2 text-sm text-ash">Sin días festivos configurados.</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}
