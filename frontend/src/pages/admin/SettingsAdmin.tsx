import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Settings } from '@/types';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function SettingsAdmin() {
  const queryClient = useQueryClient();
  const { data: settings } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: () => api.get<Settings, Settings>('/settings'),
  });

  const [form, setForm] = useState<Partial<Settings>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  const mutation = useMutation({
    mutationFn: () => api.put('/settings', form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    },
  });

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-medium">Configuración</h1>
      <Card className="max-w-xl p-6">
        <form
          onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }}
          className="space-y-4"
        >
          <Input label="Nombre de la barbería" value={form.businessName || ''} onChange={(e) => setForm({ ...form, businessName: e.target.value })} />
          <Input label="Dirección" value={form.address || ''} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Teléfono" value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Input label="Correo" type="email" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Instagram" value={form.instagram || ''} onChange={(e) => setForm({ ...form, instagram: e.target.value })} />
            <Input label="Facebook" value={form.facebook || ''} onChange={(e) => setForm({ ...form, facebook: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Horas mínimas para cancelar" type="number" value={form.cancelWindowHours ?? 24} onChange={(e) => setForm({ ...form, cancelWindowHours: Number(e.target.value) })} />
            <Input label="Horas mínimas para reagendar" type="number" value={form.rescheduleWindowHours ?? 2} onChange={(e) => setForm({ ...form, rescheduleWindowHours: Number(e.target.value) })} />
          </div>
          {saved && <p className="text-sm text-moss dark:text-moss-bright">Guardado correctamente.</p>}
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
