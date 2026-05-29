import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { GT_PRICES } from '@/lib/constants';
import { gtNextRef } from '@/lib/format';
import { sendBookingConfirmation } from '@/lib/email';

const createSchema = z.object({
  name: z.string().min(1).max(120),
  phone: z.string().regex(/^[\d\s+\-]{8,}$/),
  address: z.string().min(1).max(500),
  service: z.enum(['roro', 'lorry']),
  size: z.string(),
  waste: z.enum(['general', 'construction']),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  window: z.enum(['am', 'pm', 'flex']),
  days: z.number().int().positive().max(60).default(1),
  notes: z.string().max(2000).default(''),
  // Admin-only overrides — only honored when the request is authenticated.
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']).optional(),
  payment: z.enum(['unpaid', 'review', 'paid']).optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const bookings = await prisma.booking.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(bookings);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  const isAdmin = !!session?.user?.email;

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;

  // Validate size against service
  const validSizes =
    data.service === 'roro' ? ['10yd', '20yd', '40yd'] : ['1T', '3T', '5T'];
  if (!validSizes.includes(data.size)) {
    return NextResponse.json({ error: 'Invalid size for service' }, { status: 400 });
  }

  // Reject if date is blocked
  const blocked = await prisma.blockedDate.findUnique({ where: { date: data.date } });
  if (blocked) {
    return NextResponse.json({ error: 'Selected date is unavailable' }, { status: 409 });
  }

  // Authoritative price calculation
  const baseRate = (GT_PRICES[data.service] as Record<string, number>)[data.size];
  const total = data.service === 'lorry' ? baseRate * data.days : baseRate;

  // Generate next ref
  const existing = await prisma.booking.findMany({ select: { id: true } });
  const id = gtNextRef(existing.map((b) => b.id));

  const created = await prisma.booking.create({
    data: {
      id,
      customer: data.name,
      phone: data.phone,
      address: data.address,
      service: data.service,
      size: data.size,
      waste: data.waste,
      date: data.date,
      window: data.window,
      days: data.days,
      notes: data.notes,
      total,
      status: isAdmin && data.status ? data.status : 'pending',
      payment: isAdmin && data.payment ? data.payment : 'unpaid',
    },
  });

  // Best-effort email — failure does not block booking creation
  // (Customers can resend from their confirmation page; we don't yet collect email but
  // pass admin email for now; real flow would extend schema with customer email.)
  if (process.env.RESEND_DEFAULT_BCC) {
    sendBookingConfirmation(process.env.RESEND_DEFAULT_BCC, {
      ...created,
      createdAt: created.createdAt.toISOString().slice(0, 10),
    }).catch((e) => console.error('[booking] email failed', e));
  }

  return NextResponse.json({ id: created.id });
}
