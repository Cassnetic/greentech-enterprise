import { z } from 'zod';

// Single source of truth for the booking form payload.
// The customer form (`BookingForm`) drives this directly via RHF; the API route
// re-validates it server-side before persisting.

export const bookingFormSchema = z.object({
  service: z.enum(['roro', 'lorry']),
  size: z.enum(['std', 'small', 'cargoarm']),
  waste: z.enum(['general', 'construction']),
  name: z.string().trim().min(1, 'Required').max(120),
  phone: z
    .string()
    .trim()
    .min(1, 'Required')
    .regex(/^[\d\s+\-]{8,}$/, 'Looks too short'),
  address: z.string().trim().min(1, 'Required').max(500),
  city: z.string().trim().min(1, 'Required').max(120),
  state: z.string().trim().min(1, 'Required').max(120),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Pick a date'),
  window: z.enum(['am', 'pm', 'flex']),
  days: z.number().int().positive().max(60),
  notes: z.string().max(2000).default(''),
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;

// Service ↔ size correspondence — used as a refinement once `service` is known.
export const VALID_SIZES_BY_SERVICE = {
  roro: ['std'] as const,
  lorry: ['small', 'cargoarm'] as const,
};
