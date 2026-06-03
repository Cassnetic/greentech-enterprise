import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { classifyError } from '@/lib/db-errors';
import { gtNextRef } from '@/lib/format';
import { sendBookingConfirmation } from '@/lib/email';
import { computeBookingPrice } from '@/lib/pricing';

const createSchema = z.object({
  name: z.string().min(1).max(120),
  phone: z.string().regex(/^[\d\s+\-]{8,}$/),
  address: z.string().min(1).max(500),
  city: z.string().min(1).max(120),
  state: z.string().min(1).max(120),
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

const VALID_SIZES = {
  roro: ['std'],
  lorry: ['small', 'cargoarm'],
} as const;

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const bookings = await prisma.booking.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(bookings);
  } catch (err) {
    const c = classifyError(err);
    console.error('[api/bookings GET]', c.kind, err);
    return NextResponse.json({ error: c.message, kind: c.kind }, { status: c.status });
  }
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

  if (!VALID_SIZES[data.service].includes(data.size as never)) {
    return NextResponse.json({ error: 'Invalid size for service' }, { status: 400 });
  }

  try {
    const blocked = await prisma.blockedDate.findUnique({ where: { date: data.date } });
    if (blocked) {
      return NextResponse.json({ error: 'Selected date is unavailable' }, { status: 409 });
    }

    // Server-authoritative pricing — clients never decide the total.
    const { total, needsQuote } = computeBookingPrice({
      service: data.service,
      size: data.size,
      city: data.city,
      days: data.days,
    });

    const existing = await prisma.booking.findMany({ select: { id: true } });
    const id = gtNextRef(existing.map((b) => b.id));

    const created = await prisma.booking.create({
      data: {
        id,
        customer: data.name,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        service: data.service,
        size: data.size,
        waste: data.waste,
        date: data.date,
        window: data.window,
        days: data.days,
        notes: data.notes,
        total,
        needsQuote,
        status: isAdmin && data.status ? data.status : 'pending',
        payment: isAdmin && data.payment ? data.payment : 'unpaid',
      },
    });

    if (process.env.RESEND_DEFAULT_BCC) {
      sendBookingConfirmation(process.env.RESEND_DEFAULT_BCC, {
        ...created,
        createdAt: created.createdAt.toISOString().slice(0, 10),
      }).catch((e) => console.error('[booking] email failed', e));
    }

    return NextResponse.json({ id: created.id });
  } catch (err) {
    const c = classifyError(err);
    console.error('[api/bookings POST]', c.kind, err);
    return NextResponse.json({ error: c.message, kind: c.kind }, { status: c.status });
  }
}
