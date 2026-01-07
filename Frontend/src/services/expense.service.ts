/**
 * Expense service
 * Handles expense-related API calls
 */

import type { CreateExpenseRequest, CreateExpenseResponse, ExpenseCategory } from '@/types/expense.types';
import type { ApiError } from '@/types/api.types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

/**
 * Creates a new expense
 * @param data - Expense data
 * @returns Promise with created expense on success
 * @throws Error with status code and message on failure
 */
export async function createExpense(data: CreateExpenseRequest): Promise<CreateExpenseResponse> {
  const token = localStorage.getItem('travelsplit_token');

  const response = await fetch(`${API_BASE_URL}/expenses`, {
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
      message: errorData.message || 'Error al crear el gasto',
      statusCode: response.status,
    };

    throw error;
  }

  return response.json();
}

/**
 * Gets all expense categories
 * @returns Promise with array of expense categories
 * @throws Error with status code and message on failure
 */
export async function getExpenseCategories(): Promise<ExpenseCategory[]> {
  const token = localStorage.getItem('travelsplit_token');

  const response = await fetch(`${API_BASE_URL}/expense-categories`, {
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
      message: errorData.message || 'Error al obtener categorías',
      statusCode: response.status,
    };

    throw error;
  }

  return response.json();
}

/**
 * Uploads a receipt image
 * @param file - Image file to upload
 * @returns Promise with image URL on success
 * @throws Error with status code and message on failure
 */
export async function uploadReceiptImage(file: File): Promise<{ url: string }> {
  const token = localStorage.getItem('travelsplit_token');

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/expenses/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: response.statusText || 'Error desconocido',
      statusCode: response.status,
    }));

    const error: ApiError = {
      message: errorData.message || 'Error al subir la imagen',
      statusCode: response.status,
    };

    throw error;
  }

  return response.json();
}

