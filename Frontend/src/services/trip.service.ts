/**
 * Trip service
 * Handles trip-related API calls
 */

import type { TripResponse, TripParticipant } from '@/types/trip.types';
import type { ApiError } from '@/types/api.types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

/**
 * Gets a trip by ID
 * @param id - Trip ID
 * @returns Promise with trip data including participants
 * @throws Error with status code and message on failure
 */
export async function getTripById(id: string): Promise<TripResponse> {
  const token = localStorage.getItem('travelsplit_token');

  const response = await fetch(`${API_BASE_URL}/trips/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: response.statusText || 'Error desconocido',
      statusCode: response.status,
    }));

    const error: ApiError = {
      message: errorData.message || 'Error al obtener el viaje',
      statusCode: response.status,
    };

    throw error;
  }

  return response.json();
}

/**
 * Gets all trips for the authenticated user
 * @returns Promise with array of trips
 * @throws Error with status code and message on failure
 */
export async function getUserTrips(): Promise<TripResponse[]> {
  const token = localStorage.getItem('travelsplit_token');

  const response = await fetch(`${API_BASE_URL}/trips`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: response.statusText || 'Error desconocido',
      statusCode: response.status,
    }));

    const error: ApiError = {
      message: errorData.message || 'Error al obtener los viajes',
      statusCode: response.status,
    };

    throw error;
  }

  return response.json();
}

