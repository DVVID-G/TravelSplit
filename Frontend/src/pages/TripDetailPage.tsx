import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, Users, Calendar, DollarSign, Settings, Crown, User } from 'lucide-react';
import { Header } from '@/components';
import { ErrorState } from '@/components/molecules/ErrorState';
import { Button } from '@/components/atoms/Button';
import { useTripDetail } from '@/hooks/useTripDetail';
import { formatRelativeDate } from '@/utils/date';
import { formatCurrency } from '@/utils/currency';
import type { TripParticipantDetail } from '@/types/trip.types';

type StatCardProps = {
  label: string;
  value: string | number;
};

const StatCard = ({ label, value }: StatCardProps) => (
  <div className="rounded-lg border border-slate-200 p-4 bg-slate-50">
    <p className="text-xs text-slate-500 mb-1">{label}</p>
    <p className="text-lg font-semibold text-slate-900">{value}</p>
  </div>
);

/**
 * Loading state component
 * Shows skeleton while trip details are loading
 */
const LoadingState = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header title="Cargando..." />
      <main className="flex-1 px-6 py-8">
        <div className="space-y-6 animate-pulse">
          <div className="h-32 bg-slate-200 rounded-xl"></div>
          <div className="h-48 bg-slate-200 rounded-xl"></div>
          <div className="h-64 bg-slate-200 rounded-xl"></div>
        </div>
      </main>
    </div>
  );
};

/**
 * TripDetailPage
 * Displays detailed information about a specific trip
 * Shows trip info, participants, expenses, and statistics
 *
 * States:
 * - Loading: Shows skeleton
 * - Error: Shows error message with retry button
 * - Success: Shows trip details with participants and expenses
 */
export function TripDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'gastos' | 'saldos' | 'participantes'>('gastos');

  const {
    trip,
    tripLoading: isLoading,
    tripError: error,
    refetchTrip: refetch,
    stats,
    statsLoading,
    statsError,
    refetchStats,
  } = useTripDetail(id, { participantsPage: 1, participantsLimit: 20 });

  // Loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header title="Error" />
        <main className="flex-1 px-6 py-8">
          <ErrorState
            message={
              (error as { message?: string })?.message ||
              'No se pudo cargar la información del viaje'
            }
            onRetry={() => refetch()}
          />
        </main>
      </div>
    );
  }

  // No trip found
  if (!trip) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header title="Viaje no encontrado" />
        <main className="flex-1 px-6 py-8">
          <ErrorState
            message="El viaje que buscas no existe o no tienes acceso a él"
            onRetry={() => navigate('/trips')}
          />
        </main>
      </div>
    );
  }

  const totalAmount = trip.totalAmount ?? 0;
  const createdDate = formatRelativeDate(trip.createdAt);
  const participants = trip.participants ?? [];
  const participantCount = trip.participantsMeta?.total ?? participants.length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header title={trip.name} />

      <main className="flex-1 px-6 py-8 space-y-6">
        {/* Back button */}
        <button
          onClick={() => navigate('/trips')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Volver a Mis Viajes</span>
        </button>

        {/* Trip Info Card */}
        <div className="bg-white rounded-xl p-6 shadow-md space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h2 className="text-2xl font-heading font-bold text-slate-900">{trip.name}</h2>
              <p className="text-sm text-slate-500">Código: {trip.code}</p>
            </div>
            <button
              onClick={() => {
                /* TODO: Navigate to settings */
              }}
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Configuración"
            >
              <Settings size={20} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100">
                <Users className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Participantes</p>
                <p className="text-lg font-semibold text-slate-900">{participantCount}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Total gastado</p>
                <p className="text-lg font-semibold text-slate-900">
                  {formatCurrency(totalAmount)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-500 pt-2">
            <Calendar className="w-4 h-4" />
            <span>Creado {createdDate}</span>
          </div>

          <div className="pt-2">
            <span
              className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                trip.status === 'ACTIVE'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {trip.status === 'ACTIVE' ? 'Activo' : 'Cerrado'}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl p-2 shadow-sm border border-slate-200 flex gap-2">
          {[
            { key: 'gastos', label: 'Gastos' },
            { key: 'saldos', label: 'Saldos' },
            { key: 'participantes', label: 'Participantes' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-violet-100 text-violet-700 border border-violet-200'
                  : 'text-slate-600 hover:bg-slate-50 border border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Expenses Section */}
        {activeTab === 'gastos' && (
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-heading font-semibold text-slate-900">Gastos</h3>
              <Button size="sm" onClick={() => navigate(`/trips/${id}/expenses/new`)}>
                Agregar Gasto
              </Button>
            </div>
            <p className="text-sm text-slate-500">Próximamente: Lista de gastos del viaje</p>
            {/* TODO: Implement expenses list */}
          </div>
        )}

        {/* Statistics Section */}
        {activeTab === 'saldos' && (
          <div className="bg-white rounded-xl p-6 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-heading font-semibold text-slate-900">Saldos</h3>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => refetchStats()}
                disabled={statsLoading}
              >
                {statsLoading ? 'Actualizando...' : 'Actualizar'}
              </Button>
            </div>

            {statsError ? (
              <ErrorState
                message={
                  (statsError as { message?: string })?.message || 'No pudimos cargar los saldos'
                }
                onRetry={() => refetchStats()}
              />
            ) : statsLoading ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-16 bg-slate-100 rounded-lg" />
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-20 bg-slate-100 rounded-lg" />
                  ))}
                </div>
              </div>
            ) : stats ? (
              <>
                <div
                  className={`rounded-lg p-4 border text-sm font-medium flex items-center justify-between ${
                    stats.userBalance >= 0
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : 'bg-red-50 border-red-200 text-red-700'
                  }`}
                >
                  <span>Tu balance</span>
                  <span>{formatCurrency(stats.userBalance)}</span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <StatCard label="Gastos" value={stats.totalExpenses} />
                  <StatCard label="Monto total" value={formatCurrency(stats.totalAmount)} />
                  <StatCard label="Participantes" value={stats.totalParticipants} />
                </div>
              </>
            ) : (
              <p className="text-sm text-slate-500">Sin datos de saldo disponibles.</p>
            )}
          </div>
        )}

        {/* Participants Section */}
        {activeTab === 'participantes' && (
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-lg font-heading font-semibold text-slate-900 mb-4">
              Participantes
            </h3>
            {participants.length === 0 ? (
              <p className="text-sm text-slate-500">Aún no hay participantes</p>
            ) : (
              <ul className="space-y-3">
                {participants.map((participant: TripParticipantDetail) => (
                  <li
                    key={participant.id}
                    className="flex items-center justify-between rounded-lg border border-slate-200 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-slate-500" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {participant.user?.nombre || participant.user?.email}
                        </p>
                        <p className="text-xs text-slate-500">{participant.user?.email}</p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        participant.role === 'CREATOR'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {participant.role === 'CREATOR' ? <Crown size={14} /> : null}
                      {participant.role === 'CREATOR' ? 'Creador' : 'Miembro'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
