import { AdminBookingsPage } from '@/components/admin/BookingsPage';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { BookingDTO } from '@/lib/constants';
import { bookingRowToDTO } from '@/lib/dto';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

const TODAY = '2026-05-30';

export default async function AdminBookingsRoute({
  searchParams,
}: {
  searchParams: { view?: string };
}) {
  const session = await auth();
  if (!session?.user?.email) redirect('/admin/login');

  const view = searchParams?.view === 'payments' ? 'payments' : 'bookings';
  const rows = await prisma.booking.findMany({ orderBy: { createdAt: 'desc' } });
  const bookings: BookingDTO[] = rows.map(bookingRowToDTO);

  return (
    <AdminBookingsPage
      initialBookings={bookings}
      adminEmail={session.user.email}
      today={TODAY}
      view={view}
    />
  );
}
