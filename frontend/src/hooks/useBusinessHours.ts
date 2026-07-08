import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface BusinessHour {
  dayOfWeek: number;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  breaks: { start: string; end: string }[] | null;
}

export function useBusinessHours() {
  return useQuery({
    queryKey: ['business-hours'],
    queryFn: () => api.get<BusinessHour[], BusinessHour[]>('/business-hours'),
  });
}
