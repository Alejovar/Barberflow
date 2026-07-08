import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, Users, Scissors, Clock, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/auth';

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/agenda', label: 'Agenda', icon: CalendarDays },
  { to: '/admin/clientes', label: 'Clientes', icon: Users },
  { to: '/admin/servicios', label: 'Servicios', icon: Scissors },
  { to: '/admin/horarios', label: 'Horarios', icon: Clock },
  { to: '/admin/configuracion', label: 'Configuración', icon: Settings },
];

export function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-paper/10 bg-ink p-5 text-paper">
      <div className="mb-8 flex items-center gap-2 px-2 font-display text-lg font-medium">
        <Scissors size={18} className="text-brass" />
        BarberFlow
      </div>

      <nav className="flex-1 space-y-1">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xs px-3 py-2.5 text-sm transition-colors ${
                isActive ? 'bg-brass text-ink font-medium' : 'text-paper/70 hover:bg-paper/5'
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-paper/10 pt-4">
        <p className="px-2 text-xs text-ash">{user?.name}</p>
        <button
          onClick={() => {
            logout();
            navigate('/admin/login');
          }}
          className="mt-2 flex w-full items-center gap-3 rounded-xs px-3 py-2.5 text-sm text-paper/70 hover:bg-paper/5"
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
