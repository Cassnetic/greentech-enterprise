import { notFound } from 'next/navigation';
import { ConfirmationPage } from '@/components/customer/ConfirmationPage';
import { prisma } from '@/lib/prisma';
import { bookingRowToDTO } from '@/lib/dto';

export const dynamic = 'force-dynamic';

export default async function ConfirmationRoute({ params }: { params: { id: string } }) {
  const b = await prisma.booking.findUnique({ where: { id: params.id } });
  if (!b) notFound();
  return <ConfirmationPage initialBooking={bookingRowToDTO(b)} />;
}
