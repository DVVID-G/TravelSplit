/**
 * Trip service
 * Handles trip-related API calls
 */

import type { TripResponse, CreateTripRequest, TripListItem } from '@/types/trip.types';
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

  // Validate token exists before making request
  if (!token) {
    const error: ApiError = {
      message: 'No se encontró token de autenticación',
      statusCode: 401,
    };
    throw error;
  }

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

