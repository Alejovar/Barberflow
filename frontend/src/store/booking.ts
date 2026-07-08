import { create } from 'zustand';

export interface BookingCustomer {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

interface BookingStore {
  step: number;
  customer: BookingCustomer | null;
  serviceId: string | null;
  date: string | null; // YYYY-MM-DD
  startTime: string | null; // HH:mm
  setStep: (step: number) => void;
  setCustomer: (customer: BookingCustomer) => void;
  setService: (serviceId: string) => void;
  setDate: (date: string) => void;
  setTime: (time: string) => void;
  reset: () => void;
}

export const useBookingStore = create<BookingStore>((set) => ({
  step: 1,
  customer: null,
  serviceId: null,
  date: null,
  startTime: null,
  setStep: (step) => set({ step }),
  setCustomer: (customer) => set({ customer }),
  setService: (serviceId) => set({ serviceId, date: null, startTime: null }),
  setDate: (date) => set({ date, startTime: null }),
  setTime: (startTime) => set({ startTime }),
  reset: () => set({ step: 1, customer: null, serviceId: null, date: null, startTime: null }),
}));
