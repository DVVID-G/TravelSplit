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

/**
 * Backend response format for trips (uses camelCase)
 */
export interface TripResponse {
  id: string;
  name: string;
  currency: string;
  status: string;
  code: string;
  createdAt: string;
  updatedAt: string;
  totalAmount?: number; // Optional: Total amount of expenses in the trip
  // For backward compatibility
  created_at?: string;
  updated_at?: string;
}

export interface CreateTripRequest {
  name: string;
  memberEmails?: string[];
}

export interface TripListItem extends TripResponse {
  userRole: TripParticipantRole;
  participantCount: number;
  totalAmount: number;
}

/**
 * Balance/Debt between two users
 * Used in HomePage to display who owes whom
 */
export interface Balance {
  id: string; // Unique identifier for the balance
  fromName: string; // Person who owes
  toName: string; // Person who is owed
  amount: number; // Amount in COP
  badgeColor: 'red' | 'green' | 'blue'; // Badge color based on debt type
}

/**
 * Expense category types
 */
export type ExpenseCategory = 'food' | 'transport' | 'lodging' | 'entertainment' | 'other';

/**
 * Recent expense item for HomePage display
 */
export interface RecentExpense {
  id: string;
  category: ExpenseCategory;
  title: string;
  paidBy: string; // Name of the person who paid
  date: string; // ISO date string
  amount: number; // Amount in COP
  participantCount: number; // Number of people involved
}

