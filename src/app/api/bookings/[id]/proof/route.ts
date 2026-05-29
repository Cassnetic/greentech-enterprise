import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { uploadPaymentProof } from '@/lib/storage';

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'application/pdf'];

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const booking = await prisma.booking.findUnique({ where: { id: params.id } });
  if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const form = await req.formData();
  const file = form.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'File too large (max 10 MB)' }, { status: 413 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: 'Unsupported file type' }, { status: 415 });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const proofUrl = await uploadPaymentProof(booking.id, file.name, buf, file.type);

  await prisma.booking.update({
    where: { id: booking.id },
    data: { proofUrl, payment: 'review' },
  });

  return NextResponse.json({ proofUrl });
}
