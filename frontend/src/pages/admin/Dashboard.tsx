import { useQuery } from '@tanstack/react-query';
import { CalendarCheck, DollarSign, UserPlus, XCircle } from 'lucide-react';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';

interface DashboardStats {
  appointmentsToday: number;
  monthlyRevenue: number;
  newCustomersThisMonth: number;
  cancelledThisMonth: number;
}

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => api.get<DashboardStats, DashboardStats>('/appointments/stats/dashboard'),
  });

  const stats = [
    { label: 'Citas hoy', value: data?.appointmentsToday ?? '—', icon: CalendarCheck },
    { label: 'Ingresos del mes', value: data ? `$${data.monthlyRevenue.toFixed(0)}` : '—', icon: DollarSign },
    { label: 'Clientes nuevos (mes)', value: data?.newCustomersThisMonth ?? '—', icon: UserPlus },
    { label: 'Cancelaciones (mes)', value: data?.cancelledThisMonth ?? '—', icon: XCircle },
  ];

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-medium">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label} className="p-5">
            <Icon size={18} className="mb-3 text-brass" />
            <p className="text-2xl font-medium">{isLoading ? '…' : value}</p>
            <p className="mt-1 text-xs text-ash">{label}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
