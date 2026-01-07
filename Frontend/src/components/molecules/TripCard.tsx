import { Map, Users, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { TripResponse } from '@/types/trip.types';
import { formatRelativeDate } from '@/utils/date';

interface TripCardProps {
  trip: TripResponse;
  onClick?: () => void;
}

/**
 * TripCard molecule component
 * Displays trip information in a card format
 * Follows Design System Guide: rounded-xl, shadow-md, microinteraction scale-98
 * Uses semantic Link element for accessibility
 */
export const TripCard = ({ trip, onClick }: TripCardProps) => {
  const participantCount = trip.participants?.filter((p) => p.is_active).length || 0;

  const cardContent = (
    <div className="bg-white rounded-xl p-6 shadow-md active:scale-[0.98] transition-transform focus-visible:outline-2 focus-visible:outline-violet-600 focus-visible:outline-offset-2">
      <div className="flex items-start gap-3 mb-4">
        <Map className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
        <h3 className="text-lg font-heading font-semibold text-slate-900 flex-1">{trip.name}</h3>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Users className="w-4 h-4" aria-hidden="true" />
          <span>{participantCount} {participantCount === 1 ? 'participante' : 'participantes'}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Calendar className="w-4 h-4" aria-hidden="true" />
          <span>{formatRelativeDate(trip.created_at)}</span>
        </div>
      </div>
    </div>
  );

  // If onClick is provided, use button wrapper, otherwise use Link
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="w-full text-left focus-visible:outline-2 focus-visible:outline-violet-600 focus-visible:outline-offset-2 rounded-xl"
      >
        {cardContent}
      </button>
    );
  }

  return (
    <Link
      to={`/trips/${trip.id}`}
      className="block focus-visible:outline-2 focus-visible:outline-violet-600 focus-visible:outline-offset-2 rounded-xl"
    >
      {cardContent}
    </Link>
  );
};

