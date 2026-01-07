/**
 * Date utility functions
 * Handles formatting dates in relative format for the UI
 */

import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Formats a date string to a relative format
 * Examples: "Hoy", "Ayer", "Hace 2 días", "Hace 1 semana"
 * @param dateString - ISO date string
 * @returns Formatted relative date string
 */
export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 7) return `Hace ${diffDays} días`;

  return formatDistanceToNow(date, { addSuffix: true, locale: es });
}


