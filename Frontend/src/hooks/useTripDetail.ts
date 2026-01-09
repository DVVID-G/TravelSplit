import { useQuery } from '@tanstack/react-query';
import { getTripById, getTripStats } from '@/services/trip.service';
import type { TripStats, TripResponse } from '@/types/trip.types';

interface UseTripDetailOptions {
  participantsPage?: number;
  participantsLimit?: number;
}

interface UseTripDetailResult {
  trip?: TripResponse;
  tripLoading: boolean;
  tripError: unknown;
  refetchTrip: () => Promise<unknown>;
  stats?: TripStats;
  statsLoading: boolean;
  statsError: unknown;
  refetchStats: () => Promise<unknown>;
}

/**
 * Custom hook to fetch trip details and statistics.
 * Encapsulates query keys and pagination defaults for participants.
 */
export function useTripDetail(
  tripId: string | undefined,
  options: UseTripDetailOptions = {},
): UseTripDetailResult {
  const participantsPage = options.participantsPage ?? 1;
  const participantsLimit = options.participantsLimit ?? 20;

  const {
    data: trip,
    isLoading: tripLoading,
    error: tripError,
    refetch: refetchTrip,
  } = useQuery({
    queryKey: ['trip', tripId, { participantsPage, participantsLimit }],
    queryFn: () => getTripById(tripId!, { participantsPage, participantsLimit }),
    enabled: !!tripId,
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });

  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ['trip-stats', tripId],
    queryFn: () => getTripStats(tripId!),
    enabled: !!tripId,
    staleTime: 60 * 1000,
    retry: 1,
  });

  return {
    trip,
    tripLoading,
    tripError,
    refetchTrip,
    stats,
    statsLoading,
    statsError,
    refetchStats,
  };
}
