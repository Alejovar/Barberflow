import { Route, Routes } from 'react-router-dom';
import Landing from './pages/Landing';
import Booking from './pages/Booking';
import ClientAppointment from './pages/ClientAppointment';
import AdminLogin from './pages/admin/Login';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Agenda from './pages/admin/Agenda';
import Clients from './pages/admin/Clients';
import ServicesAdmin from './pages/admin/ServicesAdmin';
import ScheduleAdmin from './pages/admin/ScheduleAdmin';
import SettingsAdmin from './pages/admin/SettingsAdmin';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/reservar" element={<Booking />} />
      <Route path="/mi-cita/:token" element={<ClientAppointment />} />

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="agenda" element={<Agenda />} />
        <Route path="clientes" element={<Clients />} />
        <Route path="servicios" element={<ServicesAdmin />} />
        <Route path="horarios" element={<ScheduleAdmin />} />
        <Route path="configuracion" element={<SettingsAdmin />} />
      </Route>
    </Routes>
  );
}
