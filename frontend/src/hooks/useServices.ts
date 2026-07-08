import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Service } from '@/types';

export function useServices(onlyActive = true) {
  return useQuery({
    queryKey: ['services', onlyActive],
    queryFn: () => api.get<Service[], Service[]>(`/services?active=${onlyActive}`),
  });
}
