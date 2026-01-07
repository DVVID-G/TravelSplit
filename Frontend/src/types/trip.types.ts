/**
 * Type definitions for Trip-related entities
 */

export type TripParticipantRole = 'CREATOR' | 'MEMBER';

export interface TripParticipant {
  id: string;
  trip_id: string;
  user_id: string;
  role: TripParticipantRole;
  joined_at: string;
  is_active: boolean;
  // Relations
  user?: {
    id: string;
    nombre: string;
    email: string;
  };
}

export interface Trip {
  id: string;
  name: string;
  description?: string;
  invite_code: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  deleted_at?: string;
  // Relations
  participants?: TripParticipant[];
}

export type TripResponse = Omit<Trip, 'deleted_at'>;

