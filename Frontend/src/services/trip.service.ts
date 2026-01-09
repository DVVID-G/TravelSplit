/**
 * Trip service
 * Handles trip-related API calls
 */

import type { TripResponse, CreateTripRequest, TripListItem, TripStats } from '@/types/trip.types';
import type { ApiError } from '@/types/api.types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

/**
 * Gets a trip by ID
 * @param id - Trip ID
 * @returns Promise with trip data including participants
 * @throws Error with status code and message on failure
 */
export async function getTripById(
  id: string,
  options?: { participantsPage?: number; participantsLimit?: number },
): Promise<TripResponse> {
  const token = localStorage.getItem('travelsplit_token');

  // Validate token exists before making request
  if (!token) {
    const error: ApiError = {
      message: 'No se encontró token de autenticación',
      statusCode: 401,
    };
    throw error;
  }

  const params = new URLSearchParams();
  if (options?.participantsPage)
    params.append('participantsPage', String(options.participantsPage));
  if (options?.participantsLimit)
    params.append('participantsLimit', String(options.participantsLimit));

  const response = await fetch(
    `${API_BASE_URL}/trips/${id}${params.toString() ? `?${params.toString()}` : ''}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: response.statusText || 'Error desconocido',
      statusCode: response.status,
    }));

    let message = errorData.message || 'Error al obtener el viaje';

    // Provide specific error messages based on status code
    if (response.status === 404) {
      message = 'El viaje no existe o ha sido eliminado';
    } else if (response.status === 403) {
      message = 'No tienes permisos para ver este viaje. Solo los participantes pueden acceder.';
    } else if (response.status === 401) {
      message = 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.';
    }

    const error: ApiError = {
      message,
      statusCode: response.status,
    };

    throw error;
  }

  return response.json();
}

/**
 * Gets all trips for the authenticated user
 * @returns Promise with array of trips with extended information
 * @throws Error with status code and message on failure
 */
export async function getUserTrips(): Promise<TripListItem[]> {
  const token = localStorage.getItem('travelsplit_token');

  // Validate token exists before making request
  if (!token) {
    const error: ApiError = {
      message: 'No se encontró token de autenticación',
      statusCode: 401,
    };
    throw error;
  }

  const response = await fetch(`${API_BASE_URL}/trips`, {
    method: 'GET',
    headers: {
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

/**
 * Creates a new trip
 * @param data - Trip creation data (name, optional memberEmails)
 * @returns Promise with created trip data
 * @throws Error with status code and message on failure
 */
export async function createTrip(data: CreateTripRequest): Promise<TripResponse> {
  const token = localStorage.getItem('travelsplit_token');

  // Validate token exists before making request
  if (!token) {
    const error: ApiError = {
      message: 'No se encontró token de autenticación',
      statusCode: 401,
    };
    throw error;
  }

  const response = await fetch(`${API_BASE_URL}/trips`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: response.statusText || 'Error desconocido',
      statusCode: response.status,
    }));

    const error: ApiError = {
      message: errorData.message || 'Error al crear el viaje',
      statusCode: response.status,
    };

    throw error;
  }

  return response.json();
}

/**
 * Join an existing trip by code
 * @param code - 8-character trip code (uppercase alphanumeric)
 * @returns Promise with joined trip data
 * @throws Error with status code and message on failure
 */
export async function joinTripByCode(code: string): Promise<TripResponse> {
  const token = localStorage.getItem('travelsplit_token');

  // Validate token exists before making request
  if (!token) {
    const error: ApiError = {
      message: 'No se encontró token de autenticación',
      statusCode: 401,
    };
    throw error;
  }

  const response = await fetch(`${API_BASE_URL}/trips/join`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: response.statusText || 'Error desconocido',
      statusCode: response.status,
    }));

    const error: ApiError = {
      message: errorData.message || 'Error al unirse al viaje',
      statusCode: response.status,
    };

    throw error;
  }

  return response.json();
}

/**
 * Gets trip statistics
 * @param id - Trip ID
 * @returns Trip statistics (totals and user balance)
 */
export async function getTripStats(id: string): Promise<TripStats> {
  const token = localStorage.getItem('travelsplit_token');

  if (!token) {
    const error: ApiError = {
      message: 'No se encontró token de autenticación',
      statusCode: 401,
    };
    throw error;
  }

  const response = await fetch(`${API_BASE_URL}/trips/${id}/stats`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: response.statusText || 'Error desconocido',
      statusCode: response.status,
    }));

    const error: ApiError = {
      message: errorData.message || 'Error al obtener estadísticas del viaje',
      statusCode: response.status,
    };

    throw error;
  }

  return response.json();
}
