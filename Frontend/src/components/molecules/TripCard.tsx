import { Map, Users, Calendar, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { TripResponse, TripListItem } from '@/types/trip.types';
import { formatRelativeDate } from '@/utils/date';
import { formatCurrency } from '@/utils/currency';

interface TripCardProps {
  trip: TripResponse;
  onClick?: () => void;
}

/**
 * Type guard to check if a trip has the extended TripListItem properties
 */
function isTripListItem(trip: TripResponse): trip is TripListItem {
  return 'participantCount' in trip;
}

/**
 * Get participant count from trip data
 * @param trip - Trip data (may be TripResponse or TripListItem)
 * @returns Number of participants (defaults to 1 for creator if count not available)
 */
function getParticipantCount(trip: TripResponse): number {
  return isTripListItem(trip) ? trip.participantCount : 1; // Default to 1 (creator)
}

/**
 * TripCard molecule component
 * Displays trip information in a card format
 * Follows Design System Guide: rounded-xl, shadow-md, microinteraction scale-98
 * Uses semantic Link element for accessibility
 */
export const TripCard = ({ trip, onClick }: TripCardProps) => {
  const participantCount = getParticipantCount(trip);
  const totalAmount = trip.totalAmount ?? 0;

  const cardContent = (
    <div className="bg-white rounded-xl p-6 shadow-md active:scale-[0.98] transition-transform focus-visible:outline-2 focus-visible:outline-violet-600 focus-visible:outline-offset-2">
      <div className="flex items-start gap-3 mb-4">
        <Map className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
        <h3 className="text-lg font-heading font-semibold text-slate-900 flex-1">{trip.name}</h3>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Users className="w-4 h-4" aria-hidden="true" />
          <span>
            {participantCount} {participantCount === 1 ? 'participante' : 'participantes'}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <DollarSign className="w-4 h-4 text-slate-500" aria-hidden="true" />
          <span className="font-semibold text-slate-900">{formatCurrency(totalAmount)}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Calendar className="w-4 h-4" aria-hidden="true" />
          <span>{formatRelativeDate(trip.createdAt)}</span>
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
