import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Appointment } from '@/types';
import { Card } from '@/components/ui/Card';

export default function Clients() {
  const { data: appointments, isLoading } = useQuery({
    queryKey: ['admin-appointments-all'],
    queryFn: () => api.get<Appointment[], Appointment[]>('/appointments'),
  });

  const clients = useMemo(() => {
    if (!appointments) return [];
    const map = new Map<string, { name: string; email: string; phone: string; visits: number; lastVisit: string }>();
    for (const a of appointments) {
      const existing = map.get(a.customerEmail);
      if (existing) {
        existing.visits += 1;
        if (a.date > existing.lastVisit) existing.lastVisit = a.date;
      } else {
        map.set(a.customerEmail, {
          name: a.customerName,
          email: a.customerEmail,
          phone: a.customerPhone,
          visits: 1,
          lastVisit: a.date,
        });
      }
    }
    return Array.from(map.values()).sort((a, b) => b.visits - a.visits);
  }, [appointments]);

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-medium">Clientes</h1>
      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-left text-xs uppercase text-ash dark:border-paper/10">
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Contacto</th>
              <th className="px-4 py-3">Visitas</th>
              <th className="px-4 py-3">Última visita</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/5 dark:divide-paper/5">
            {isLoading && <tr><td colSpan={4} className="px-4 py-6 text-center text-ash">Cargando...</td></tr>}
            {clients.map((c) => (
              <tr key={c.email}>
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3 text-ash">{c.email} · {c.phone}</td>
                <td className="px-4 py-3">{c.visits}</td>
                <td className="px-4 py-3">{new Date(c.lastVisit).toLocaleDateString('es-MX')}</td>
              </tr>
            ))}
            {!isLoading && clients.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-ash">Aún no hay clientes.</td></tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
