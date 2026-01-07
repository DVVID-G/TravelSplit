/**
 * Zod schema for expense form validation
 */

import { z } from 'zod';

export const createExpenseSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  amount: z
    .number({
      required_error: 'El monto es requerido',
      invalid_type_error: 'El monto debe ser un número',
    })
    .positive('El monto debe ser positivo')
    .int('El monto no debe tener decimales'),
  category_id: z.number({
    required_error: 'La categoría es requerida',
    invalid_type_error: 'Debe seleccionar una categoría',
  }),
  payer_id: z.string().uuid('El pagador es requerido'),
  beneficiary_ids: z
    .array(z.string().uuid())
    .min(1, 'Debe seleccionar al menos un beneficiario'),
  receipt_url: z.string().url('URL inválida').optional().or(z.literal('')),
  expense_date: z.string().optional(),
});

export type CreateExpenseFormData = z.infer<typeof createExpenseSchema>;










