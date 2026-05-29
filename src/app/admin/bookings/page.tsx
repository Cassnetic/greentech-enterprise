import { AdminBookingsPage } from '@/components/admin/BookingsPage';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { BookingDTO } from '@/lib/constants';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

const TODAY = '2026-05-29';

export default async function AdminBookingsRoute({
  searchParams,
}: {
  searchParams: { view?: string };
}) {
  const session = await auth();
  if (!session?.user?.email) redirect('/admin/login');

  const view = searchParams?.view === 'payments' ? 'payments' : 'bookings';
  const rows = await prisma.booking.findMany({ orderBy: { createdAt: 'desc' } });
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

  return (
    <AdminBookingsPage
      initialBookings={bookings}
      adminEmail={session.user.email}
      today={TODAY}
      view={view}
    />
  );
}
