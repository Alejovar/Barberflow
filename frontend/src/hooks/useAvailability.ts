import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { AvailabilityResponse } from '@/types';

export function useAvailability(serviceId: string | null, date: string | null) {
  return useQuery({
    queryKey: ['availability', serviceId, date],
    queryFn: () =>
      api.get<AvailabilityResponse, AvailabilityResponse>(
        `/appointments/availability?serviceId=${serviceId}&date=${date}`,
      ),
    enabled: !!serviceId && !!date,
  });
}
