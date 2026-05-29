import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const blockSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  scope: z.enum(['both', 'roro', 'lorry']).default('both'),
  reason: z.string().max(200).default(''),
});

export async function GET() {
  const blocks = await prisma.blockedDate.findMany();
  return NextResponse.json(blocks);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const parsed = blockSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const block = await prisma.blockedDate.upsert({
    where: { date: parsed.data.date },
    update: { scope: parsed.data.scope, reason: parsed.data.reason },
    create: parsed.data,
  });
  return NextResponse.json(block);
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const date = new URL(req.url).searchParams.get('date');
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'Missing or invalid `date`' }, { status: 400 });
  }
  await prisma.blockedDate.delete({ where: { date } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
