/**
 * Authentication service
 * Handles user registration and authentication API calls
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export interface RegisterRequest {
  nombre: string;
  email: string;
  contraseña: string;
}

export interface RegisterResponse {
  id: string;
  nombre: string;
  email: string;
  createdAt: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
}

/**
 * Registers a new user
 * @param data - User registration data
 * @returns Promise with user data on success
 * @throws Error with status code and message on failure
 */
export async function registerUser(data: RegisterRequest): Promise<RegisterResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: response.statusText || 'Error desconocido',
      statusCode: response.status,
    }));

    const error: ApiError = {
      message: errorData.message || 'Error al registrar usuario',
      statusCode: response.status,
    };

    throw error;
  }

  return response.json();
}

