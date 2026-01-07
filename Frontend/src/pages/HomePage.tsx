import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Map as MapIcon, Users, Receipt, Calculator, Camera } from 'lucide-react';
import { Header } from '@/components';
import { EmptyState } from '@/components/molecules/EmptyState';
import { TripCard } from '@/components/molecules/TripCard';
import { ErrorState } from '@/components/molecules/ErrorState';
import { Button } from '@/components/atoms/Button';
import { useAuthContext } from '@/contexts/AuthContext';
import { getUserTrips } from '@/services/trip.service';
import { formatCurrency } from '@/utils/currency';
import type { TripResponse } from '@/types/trip.types';

/**
 * Loading state component
 * Shows skeleton or spinner while data is loading
 */
const LoadingState = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <main className="flex items-center justify-center flex-1">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-slate-200 rounded-lg mx-auto mb-4"></div>
            <div className="h-4 w-64 bg-slate-200 rounded-lg mx-auto"></div>
          </div>
        </div>
      </main>
    </div>
  );
};

/**
 * HomePage - Not Authenticated State (Landing Page)
 * Attractive landing page with information about TravelSplit and benefits
 * Follows Design System Guide: Modern Friendly, clear CTAs
 */
const HomePageNotAuthenticated = () => {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: <Users className="w-6 h-6 text-violet-600" aria-hidden="true" />,
      title: 'Invita a tus amigos',
      description: 'Agrega participantes a tu viaje y divide gastos de forma transparente',
    },
    {
      icon: <Receipt className="w-6 h-6 text-violet-600" aria-hidden="true" />,
      title: 'Registra todos los gastos',
      description: 'Sube recibos, categoriza gastos y mantén un registro completo',
    },
    {
      icon: <Calculator className="w-6 h-6 text-violet-600" aria-hidden="true" />,
      title: 'Cálculo automático',
      description: 'El sistema calcula quién debe a quién, sin complicaciones',
    },
    {
      icon: <Camera className="w-6 h-6 text-violet-600" aria-hidden="true" />,
      title: 'Evidencia de gastos',
      description: 'Guarda fotos de recibos para tener respaldo de cada gasto',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-6 py-12 md:py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-violet-100 rounded-full p-4">
              <MapIcon className="w-12 h-12 text-violet-600" aria-hidden="true" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4">
            Divide gastos de viaje sin complicaciones
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            TravelSplit te ayuda a gestionar los gastos de tus viajes grupales de forma simple y transparente. 
            Sin hojas de cálculo, sin confusiones.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <Button variant="primary" size="lg" className="w-full sm:w-auto" onClick={() => navigate('/register')}>
              Empezar ahora
            </Button>
            <Button variant="secondary" size="lg" className="w-full sm:w-auto" onClick={() => navigate('/login')}>
              Iniciar sesión
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-6 py-12 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-heading font-bold text-slate-900 text-center mb-8">
            Todo lo que necesitas para dividir gastos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="bg-slate-50 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">{benefit.icon}</div>
                  <div>
                    <h3 className="text-xl font-heading font-semibold text-slate-900 mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-slate-600 text-sm">{benefit.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-12 pb-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-heading font-bold text-slate-900 mb-4">
            ¿Listo para tu próximo viaje?
          </h2>
          <p className="text-slate-600 mb-6">
            Únete a TravelSplit y disfruta de dividir gastos sin estrés
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <Button variant="primary" size="lg" className="w-full sm:w-auto" onClick={() => navigate('/register')}>
              Empezar ahora
            </Button>
            <Button variant="secondary" size="lg" className="w-full sm:w-auto" onClick={() => navigate('/login')}>
              Ya tengo cuenta
            </Button>
          </div>
        </div>
      </section>
      </main>
    </div>
  );
};

/**
 * HomePage - Empty State (Authenticated but no trips)
 * Shows empty state with button to create first trip
 */
const HomePageEmptyState = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <main className="flex-1">
        <EmptyState
          icon={<MapIcon size={64} />}
          title="¿Planeando una escapada?"
          description="Crea tu primer viaje para empezar a dividir gastos fácilmente"
          action={
            <Button variant="primary" size="lg" className="w-full" onClick={() => navigate('/trips/new')}>
              + Crear mi primer viaje
            </Button>
          }
        />
      </main>
    </div>
  );
};

/**
 * Helper function to calculate total amount from trips
 * Note: TripResponse doesn't include total_amount yet, so this is a placeholder
 * @param trips - Array of trips
 * @returns Total amount (currently returns 0 as placeholder)
 */
const calculateTotalAmount = (trips: TripResponse[]): number => {
  // TODO: Calculate from expenses when backend adds total_amount or expense endpoint is available
  return 0;
};

/**
 * HomePage - With Trips State
 * Shows summary and recent trips for authenticated users with trips
 */
const HomePageWithTrips = ({ trips, totalAmount }: { trips: TripResponse[]; totalAmount: number }) => {
  const navigate = useNavigate();
  const recentTrips = trips.slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <main className="px-6 py-8">
        {/* Summary Section - Hidden until backend implements total_amount */}
        {/* TODO: Uncomment when backend adds total_amount to TripResponse
        {totalAmount > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-md mb-6">
            <h2 className="text-lg font-heading font-semibold text-slate-900 mb-2">Total gastado</h2>
            <p className="text-3xl font-bold text-slate-900">{formatCurrency(totalAmount)}</p>
          </div>
        )}
        */}

        {/* Recent Trips Section */}
        <div className="mb-6">
          <h2 className="text-lg font-heading font-semibold text-slate-900 mb-4">Viajes recientes</h2>
          <div className="space-y-4">
            {recentTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </div>

        {/* View All Trips Button */}
        {trips.length > 3 && (
          <Button variant="secondary" size="lg" className="w-full" onClick={() => navigate('/trips')}>
            Ver todos mis viajes
          </Button>
        )}
      </main>
    </div>
  );
};

/**
 * Home page component
 * Implements 3 states:
 * 1. Not authenticated - Shows login/register buttons
 * 2. Authenticated without trips - Shows empty state with create trip button
 * 3. Authenticated with trips - Shows summary and recent trips
 */
export const HomePage = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuthContext();

  // Query to get trips (only if authenticated)
  const { data: trips, isLoading: tripsLoading, error: tripsError, refetch } = useQuery({
    queryKey: ['user-trips'],
    queryFn: getUserTrips,
    enabled: isAuthenticated, // Only execute if authenticated
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Loading state
  if (authLoading) {
    return <LoadingState />;
  }

  // State 1: Not authenticated - Show landing page
  if (!isAuthenticated) {
    return <HomePageNotAuthenticated />;
  }

  // Error state - Only show if authenticated (query was enabled)
  if (tripsError) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <ErrorState
            message="No pudimos cargar tus viajes. Intenta de nuevo."
            onRetry={() => refetch()}
          />
        </main>
      </div>
    );
  }

  // Loading state - Show loading indicator during fetch/refetch
  if (tripsLoading) {
    return <LoadingState />;
  }

  // State 2: Authenticated without trips
  if (!trips || trips.length === 0) {
    return <HomePageEmptyState />;
  }

  // State 3: Authenticated with trips
  const totalAmount = calculateTotalAmount(trips);
  return <HomePageWithTrips trips={trips} totalAmount={totalAmount} />;
};
