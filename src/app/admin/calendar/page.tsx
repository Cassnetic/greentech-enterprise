import { redirect } from 'next/navigation';
import { AdminCalendarPage } from '@/components/admin/CalendarPage';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { BlockedDateDTO, BookingDTO } from '@/lib/constants';
import { bookingRowToDTO } from '@/lib/dto';

export const dynamic = 'force-dynamic';

export default async function AdminCalendarRoute() {
  const session = await auth();
  if (!session?.user?.email) redirect('/admin/login');

  const [rows, blockRows] = await Promise.all([
    prisma.booking.findMany(),
    prisma.blockedDate.findMany(),
  ]);

  const bookings: BookingDTO[] = rows.map(bookingRowToDTO);
  const blocks: BlockedDateDTO[] = blockRows.map((b) => ({ date: b.date, scope: b.scope, reason: b.reason }));

  return <AdminCalendarPage bookings={bookings} initialBlocks={blocks} adminEmail={session.user.email} />;
}
