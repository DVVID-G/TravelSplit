import { useQuery } from '@tanstack/react-query';
import { getTripById } from '@/services/trip.service';
import type { TripParticipant } from '@/types/trip.types';

/**
 * Hook to fetch trip participants using React Query
 * Caches participant data for the trip
 */
export function useTripParticipants(tripId: string | undefined) {
  const {
    data: trip,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['trip', tripId],
    queryFn: () => {
      if (!tripId) {
        throw new Error('Trip ID is required');
      }
      return getTripById(tripId);
    },
    enabled: !!tripId, // Only fetch if tripId exists
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry if tripId is missing
  });

  const participants: TripParticipant[] = trip?.participants || [];

  return {
    participants,
    trip,
    isLoading,
    error,
    refetch,
  };
}

