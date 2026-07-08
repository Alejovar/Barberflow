import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import { Service } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

interface FormState {
  id?: string;
  name: string;
  description: string;
  duration: number;
  price: number;
}

const emptyForm: FormState = { name: '', description: '', duration: 30, price: 0 };

export default function ServicesAdmin() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormState | null>(null);

  const { data: services, isLoading } = useQuery({
    queryKey: ['admin-services'],
    queryFn: () => api.get<Service[], Service[]>('/services'),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin-services'] });

  const createMutation = useMutation({
    mutationFn: (data: FormState) => api.post('/services', data),
    onSuccess: () => { invalidate(); setForm(null); },
  });

  const updateMutation = useMutation({
    mutationFn: (data: FormState) => api.patch(`/services/${data.id}`, data),
    onSuccess: () => { invalidate(); setForm(null); },
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/services/${id}`),
    onSuccess: invalidate,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    if (form.id) updateMutation.mutate(form);
    else createMutation.mutate(form);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-medium">Servicios</h1>
        <Button size="sm" onClick={() => setForm(emptyForm)}>
          <Plus size={16} /> Nuevo servicio
        </Button>
      </div>

      {form && (
        <Card className="mb-6 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Textarea label="Descripción" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={2} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Duración (min)" type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })} required />
              <Input label="Precio" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} required />
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="ghost" onClick={() => setForm(null)}>Cancelar</Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>Guardar</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading && Array.from({ length: 3 }).map((_, i) => <Card key={i} className="h-32 animate-pulse" />)}
        {services?.map((s) => (
          <Card key={s.id} className={`p-5 ${!s.isActive ? 'opacity-50' : ''}`}>
            <div className="flex items-start justify-between">
              <h3 className="font-medium">{s.name}</h3>
              <div className="flex gap-1">
                <button onClick={() => setForm({ id: s.id, name: s.name, description: s.description, duration: s.duration, price: Number(s.price) })} className="rounded p-1.5 hover:bg-ink/5 dark:hover:bg-paper/10">
                  <Pencil size={14} />
                </button>
                <button onClick={() => removeMutation.mutate(s.id)} className="rounded p-1.5 hover:bg-red-500/10 hover:text-red-500">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <p className="mt-1 text-xs text-ash">{s.description}</p>
            <div className="mt-3 flex justify-between font-mono text-xs text-ash">
              <span>{s.duration} min</span>
              <span>${Number(s.price).toFixed(0)}</span>
            </div>
            {!s.isActive && <span className="mt-2 block text-xs text-red-500">Inactivo</span>}
          </Card>
        ))}
      </div>
    </div>
  );
}
