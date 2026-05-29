import { redirect } from 'next/navigation';
import { AdminCalendarPage } from '@/components/admin/CalendarPage';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { BlockedDateDTO, BookingDTO } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export default async function AdminCalendarRoute() {
  const session = await auth();
  if (!session?.user?.email) redirect('/admin/login');

  const [rows, blockRows] = await Promise.all([
    prisma.booking.findMany(),
    prisma.blockedDate.findMany(),
  ]);

  const bookings: BookingDTO[] = rows.map((b) => ({
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
  }));
  const blocks: BlockedDateDTO[] = blockRows.map((b) => ({ date: b.date, scope: b.scope, reason: b.reason }));

  return <AdminCalendarPage bookings={bookings} initialBlocks={blocks} adminEmail={session.user.email} />;
}
