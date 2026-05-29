import { BookingFormWrapper } from '@/components/customer/BookingFormWrapper';
import { prisma } from '@/lib/prisma';
import { Service } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export default async function BookPage({
  searchParams,
}: {
  searchParams: { service?: string };
}) {
  const raw = searchParams?.service;
  const service: Service | null = raw === 'roro' || raw === 'lorry' ? raw : null;
  const blocks = await prisma.blockedDate.findMany({ select: { date: true } });
  return <BookingFormWrapper initialService={service} blockedDates={blocks.map((b) => b.date)} />;
}
