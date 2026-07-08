export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number | string;
  isActive: boolean;
}

export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'FINISHED' | 'CANCELLED';

export interface Appointment {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceId: string;
  service: Service;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  managementToken: string;
  notes?: string | null;
}

export interface AvailabilityResponse {
  available: boolean;
  reason: 'FESTIVO' | 'CERRADO' | null;
  slots: string[];
}

export interface Settings {
  id: string;
  businessName: string;
  logoUrl?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  whatsapp?: string | null;
  cancelWindowHours: number;
  rescheduleWindowHours: number;
}
