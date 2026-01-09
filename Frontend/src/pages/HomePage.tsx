import { useQuery } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { Map as MapIcon, Users, Receipt, Calculator, Camera } from 'lucide-react';
import { Header } from '@/components';
import { EmptyState } from '@/components/molecules/EmptyState';
import { BalanceCard } from '@/components/molecules/BalanceCard';
import { RecentExpenseCard } from '@/components/molecules/RecentExpenseCard';
import { ErrorState } from '@/components/molecules/ErrorState';
import { Button } from '@/components/atoms/Button';
import { useAuthContext } from '@/contexts/AuthContext';
import { getUserTrips } from '@/services/trip.service';
import type { TripResponse, Balance, RecentExpense } from '@/types/trip.types';

/**
 * TODO: Replace with actual API endpoints when backend is ready
 * MOCK_BALANCES should come from GET /trips/:tripId/balances
 * MOCK_RECENT_EXPENSES should come from GET /trips/:tripId/expenses/recent?limit=3
 */
const MOCK_BALANCES: Balance[] = [
  {
    id: '1',
    fromName: 'Juan',
    toName: 'Pedro',
    amount: 50000,
    badgeColor: 'red',
  },
  {
    id: '2',
    fromName: 'Carlos',
    toName: 'Juan',
    amount: 25000,
    badgeColor: 'green',
  },
  {
    id: '3',
    fromName: 'María',
    toName: 'Pedro',
    amount: 15000,
    badgeColor: 'blue',
  },
];

const MOCK_RECENT_EXPENSES: RecentExpense[] = [
  {
    id: '1',
    category: 'food',
    title: 'Cena en La Vitrola',
    paidBy: 'Pedro',
    date: '2026-01-16',
    amount: 180000,
    participantCount: 4,
  },
  {
    id: '2',
    category: 'transport',
    title: 'Taxi al hotel',
    paidBy: 'Juan',
    date: '2026-01-15',
    amount: 25000,
    participantCount: 4,
  },
  {
    id: '3',
    category: 'food',
    title: 'Desayuno Café del Mar',
    paidBy: 'María',
    date: '2026-01-17',
    amount: 85000,
    participantCount: 3,
  },
];

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
 * HomePage - With Trips State
 * Shows dashboard with balances and recent expenses for authenticated users with trips
 * Displays general overview of all user's active debts and recent expenses across all trips
 */
const HomePageWithTrips = ({ trips }: { trips: TripResponse[] }) => {
  // Use first trip for navigation to "Ver todos" link
  const activeTrip = trips[0];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-24">
      <Header />
      <main className="px-6 py-8">
        <h1 className="sr-only">Resumen general de viajes</h1>
        
        {/* Saldos Section */}
        <section className="mb-8">
          <h2 className="text-lg font-heading font-semibold text-slate-900 mb-4">
            Saldos
          </h2>
          <div className="space-y-3">
            {MOCK_BALANCES.map((balance) => (
              <BalanceCard key={balance.id} balance={balance} />
            ))}
          </div>
        </section>

        {/* Gastos Recientes Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-heading font-semibold text-slate-900">
              Gastos Recientes
            </h2>
            <Link
              to={`/trips/${activeTrip.id}`}
              className="text-sm text-violet-600 font-medium hover:underline"
              aria-label="Ver todos los gastos recientes"
            >
              Ver todos
            </Link>
          </div>
          <div className="space-y-3">
            {MOCK_RECENT_EXPENSES.map((expense) => (
              <RecentExpenseCard key={expense.id} expense={expense} />
            ))}
          </div>
        </section>
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
  const { isAuthenticated, isLoading: authLoading, token } = useAuthContext();

  // Query to get trips (only if authenticated AND token exists)
  const { data: trips, isLoading: tripsLoading, error: tripsError, refetch } = useQuery({
    queryKey: ['user-trips'],
    queryFn: getUserTrips,
    enabled: isAuthenticated && !!token, // Only execute if authenticated AND token exists
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
  return <HomePageWithTrips trips={trips} />;
};
