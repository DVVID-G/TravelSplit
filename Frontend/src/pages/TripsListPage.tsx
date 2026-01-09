import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Map as MapIcon, Plus } from 'lucide-react';
import { Header } from '@/components';
import { EmptyState } from '@/components/molecules/EmptyState';
import { TripCard } from '@/components/molecules/TripCard';
import { ErrorState } from '@/components/molecules/ErrorState';
import { Button } from '@/components/atoms/Button';
import { useAuthContext } from '@/contexts/AuthContext';
import { getUserTrips } from '@/services/trip.service';

/**
 * Loading state component
 * Shows skeleton while trips are loading
 */
const LoadingState = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header title="Mis Viajes" />
      <main className="flex-1 px-6 py-8">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-24 bg-slate-200 rounded-xl"></div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

/**
 * TripsListPage
 * Displays all trips for the authenticated user
 * Allows creation of new trips via "Crear Viaje" button
 * 
 * States:
 * - Loading: Shows skeleton
 * - Error: Shows error message with retry button
 * - Empty: Shows empty state with "Crear mi primer viaje" button
 * - Success: Shows list of TripCard components
 */
export function TripsListPage() {
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuthContext();

  // Query to get all user trips
  const { data: trips, isLoading, error, refetch } = useQuery({
    queryKey: ['user-trips'],
    queryFn: getUserTrips,
    enabled: isAuthenticated && !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header title="Mis Viajes" />
        <main className="flex-1 flex items-center justify-center px-6">
          <ErrorState
            message="No pudimos cargar tus viajes. Intenta de nuevo."
            onRetry={() => refetch()}
          />
        </main>
      </div>
    );
  }

  // Empty state - No trips
  if (!trips || trips.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header title="Mis Viajes" />
        <main className="flex-1">
          <EmptyState
            icon={<MapIcon size={64} />}
            title="¿Planeando una escapada?"
            description="Crea tu primer viaje para empezar a dividir gastos fácilmente"
            action={
              <Button 
                variant="primary" 
                size="lg" 
                className="w-full"
                onClick={() => navigate('/trips/new')}
              >
                + Crear mi primer viaje
              </Button>
            }
          />
        </main>
      </div>
    );
  }

  // Success state - Show trips list
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-24">
      <Header 
        title="Mis Viajes"
        actions={
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/trips/new')}
            className="flex items-center gap-2"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Crear Viaje</span>
          </Button>
        }
      />
      <main className="flex-1 px-6 py-8">
        <div className="space-y-4 max-w-2xl mx-auto">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      </main>
    </div>
  );
}
