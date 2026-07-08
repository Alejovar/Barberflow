import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Settings } from '@/types';

export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: () => api.get<Settings, Settings>('/settings'),
  });
}
