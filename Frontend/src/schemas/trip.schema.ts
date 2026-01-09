/**
 * Zod schema for trip form validation
 */

import { z } from 'zod';

export const createTripSchema = z.object({
  name: z.string().min(1, 'El nombre del viaje es requerido'),
});

export type CreateTripFormData = z.infer<typeof createTripSchema>;
