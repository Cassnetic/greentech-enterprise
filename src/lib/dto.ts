import type { Booking } from '@prisma/client';
import { BookingDTO } from './constants';

export function bookingRowToDTO(b: Booking): BookingDTO {
  return {
    id: b.id,
    customer: b.customer,
    phone: b.phone,
    address: b.address,
    city: b.city,
    state: b.state,
    service: b.service,
    size: b.size,
    waste: b.waste,
    date: b.date,
    window: b.window,
    days: b.days,
    notes: b.notes,
    total: b.total,
    needsQuote: b.needsQuote,
    status: b.status,
    payment: b.payment,
    proofUrl: b.proofUrl,
    createdAt: b.createdAt.toISOString().slice(0, 10),
  };
}
