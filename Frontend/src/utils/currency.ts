/**
 * Currency utility functions
 * Handles formatting and parsing of Colombian Peso (COP) amounts
 */

/**
 * Formats a number as Colombian Peso currency
 * Format: "$ 25.000" (no decimals, thousands separator with dot)
 * @param amount - Amount to format
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number): string {
  if (isNaN(amount) || amount < 0) {
    return '$ 0';
  }

  // Check if amount is finite and within safe integer range after rounding
  if (!Number.isFinite(amount) || Math.round(amount) > Number.MAX_SAFE_INTEGER) {
    return '$ 0';
  }

  // Round to nearest whole unit and format with thousands separator
  const integerAmount = Math.round(amount);
  const formatted = integerAmount.toLocaleString('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return `$ ${formatted}`;
}

/**
 * Parses a currency string to a number
 * Removes currency symbols, dots (thousands separators), and commas (decimal separators)
 * @param value - Currency string to parse (e.g., "$ 25.000" or "25000")
 * @returns Parsed number or 0 if invalid
 */
export function parseCurrency(value: string): number {
  if (!value || typeof value !== 'string') {
    return 0;
  }

  // Remove currency symbols, spaces, and dots (thousands separators)
  // Keep only digits
  const cleaned = value.replace(/[^\d]/g, '');

  if (cleaned === '') {
    return 0;
  }

  const parsed = parseInt(cleaned, 10);

  return isNaN(parsed) ? 0 : parsed;
}










