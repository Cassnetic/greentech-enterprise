import { notFound } from 'next/navigation';
import { ConfirmationPage } from '@/components/customer/ConfirmationPage';
import { prisma } from '@/lib/prisma';
import { BookingDTO } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export default async function ConfirmationRoute({ params }: { params: { id: string } }) {
  const b = await prisma.booking.findUnique({ where: { id: params.id } });
  if (!b) notFound();

  const dto: BookingDTO = {
    id: b.id,
    customer: b.customer,
    phone: b.phone,
    address: b.address,
    service: b.service,
    size: b.size,
    waste: b.waste,
    date: b.date,
    window: b.window,
    days: b.days,
    notes: b.notes,
    total: b.total,
    status: b.status,
    payment: b.payment,
    proofUrl: b.proofUrl,
    createdAt: b.createdAt.toISOString().slice(0, 10),
  };

  return <ConfirmationPage initialBooking={dto} />;
}
