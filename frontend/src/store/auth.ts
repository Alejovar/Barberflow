import { create } from 'zustand';

interface AdminUser {
  id: string;
  name: string;
  email: string;
}

interface AuthStore {
  token: string | null;
  user: AdminUser | null;
  setSession: (token: string, user: AdminUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  token: localStorage.getItem('barberflow_admin_token'),
  user: JSON.parse(localStorage.getItem('barberflow_admin_user') || 'null'),
  setSession: (token, user) => {
    localStorage.setItem('barberflow_admin_token', token);
    localStorage.setItem('barberflow_admin_user', JSON.stringify(user));
    set({ token, user });
  },
  logout: () => {
    localStorage.removeItem('barberflow_admin_token');
    localStorage.removeItem('barberflow_admin_user');
    set({ token: null, user: null });
  },
}));
