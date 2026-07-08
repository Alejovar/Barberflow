import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { Sidebar } from '@/components/admin/Sidebar';

export default function AdminLayout() {
  const token = useAuthStore((s) => s.token);

  if (!token) return <Navigate to="/admin/login" replace />;

  return (
    <div className="flex bg-paper-dim dark:bg-ink">
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </div>
    </div>
  );
}
