import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const patchSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']).optional(),
  payment: z.enum(['unpaid', 'review', 'paid']).optional(),
});

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const booking = await prisma.booking.findUnique({ where: { id: params.id } });
  if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(booking);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const existing = await prisma.booking.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Verifying payment when current status is 'pending' auto-advances to 'confirmed' (mirrors prototype).
  const updates: { status?: 'pending' | 'confirmed' | 'completed' | 'cancelled'; payment?: 'unpaid' | 'review' | 'paid' } = { ...parsed.data };
  if (parsed.data.payment === 'paid' && existing.status === 'pending' && !parsed.data.status) {
    updates.status = 'confirmed';
  }

  const updated = await prisma.booking.update({
    where: { id: params.id },
    data: updates,
  });

  return NextResponse.json(updated);
}
