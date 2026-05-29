import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const SEED_BOOKINGS = [
  {
    id: 'GT-0180',
    date: '2026-06-06',
    customer: 'Ravi Kumar',
    phone: '+60 12 421 3398',
    address: 'Lot 12, Jln Lintas, 88300 Likas, Kota Kinabalu, Sabah',
    service: 'roro' as const,
    size: '40yd',
    waste: 'construction' as const,
    window: 'am' as const,
    days: 1,
    notes: 'Crane access from north side. Site manager: Suresh.',
    total: 1850,
    status: 'completed' as const,
    payment: 'paid' as const,
    proofUrl: 'maybank-receipt.jpg',
  },
  {
    id: 'GT-0179',
    date: '2026-06-06',
    customer: 'Nor Aisyah',
    phone: '+60 11 2398 7711',
    address: 'B-3-7, Apartmen Sri Putra, 88200 Putatan, Sabah',
    service: 'lorry' as const,
    size: '1T',
    waste: 'general' as const,
    window: 'flex' as const,
    days: 1,
    notes: '',
    total: 380,
    status: 'completed' as const,
    payment: 'paid' as const,
    proofUrl: 'cimb-receipt.pdf',
  },
  {
    id: 'GT-0181',
    date: '2026-06-07',
    customer: 'Tan Beng Hock',
    phone: '+60 12 778 4421',
    address: 'Lot 88, Kawasan Perindustrian KKIP, 88460 Kota Kinabalu, Sabah',
    service: 'lorry' as const,
    size: '5T',
    waste: 'general' as const,
    window: 'am' as const,
    days: 2,
    notes: '2-day rental, 7–8 June. Will tip driver directly.',
    total: 1560,
    status: 'pending' as const,
    payment: 'review' as const,
    proofUrl: 'transfer-screenshot.png',
  },
  {
    id: 'GT-0182',
    date: '2026-06-07',
    customer: 'Siti Rahmah',
    phone: '+60 19 663 4218',
    address: 'No 12, Jln Kolam, 88400 Inanam, Kota Kinabalu, Sabah',
    service: 'roro' as const,
    size: '10yd',
    waste: 'general' as const,
    window: 'pm' as const,
    days: 1,
    notes: 'Driveway is narrow; please reverse in.',
    total: 850,
    status: 'confirmed' as const,
    payment: 'paid' as const,
    proofUrl: 'maybank-2.jpg',
  },
  {
    id: 'GT-0183',
    date: '2026-06-08',
    customer: 'Lim Wei Ling',
    phone: '+60 16 234 8821',
    address: 'No 14, Jln Kuhara, 91000 Tawau, Sabah',
    service: 'lorry' as const,
    size: '3T',
    waste: 'general' as const,
    window: 'am' as const,
    days: 1,
    notes: 'Moving office furniture.',
    total: 580,
    status: 'confirmed' as const,
    payment: 'paid' as const,
    proofUrl: 'rhb-receipt.pdf',
  },
  {
    id: 'GT-0184',
    date: '2026-06-08',
    customer: 'Ahmad Faizal',
    phone: '+60 14 557 5208',
    address: 'Lot 23, Mile 4, Jln Sandakan, 90000 Sandakan, Sabah',
    service: 'roro' as const,
    size: '20yd',
    waste: 'construction' as const,
    window: 'am' as const,
    days: 1,
    notes: 'Gate code 4421. Side access only.',
    total: 1250,
    status: 'pending' as const,
    payment: 'unpaid' as const,
    proofUrl: null,
  },
];

const SEED_BLOCKS = [
  { date: '2026-06-12', scope: 'lorry' as const, reason: 'Driver unavailable' },
  { date: '2026-06-13', scope: 'lorry' as const, reason: 'Driver unavailable' },
  { date: '2026-06-22', scope: 'both' as const, reason: 'Public holiday' },
];

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@greentech.my';
  const adminPassword = process.env.ADMIN_PASSWORD || 'demo1234';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { hashedPassword },
    create: { email: adminEmail, hashedPassword },
  });
  console.log(`✓ Admin user ${adminEmail}`);

  for (const b of SEED_BOOKINGS) {
    // Upsert refreshes address/phone too so reseeding picks up demo-data tweaks.
    await prisma.booking.upsert({
      where: { id: b.id },
      update: { customer: b.customer, phone: b.phone, address: b.address, notes: b.notes },
      create: b,
    });
  }
  console.log(`✓ Seeded ${SEED_BOOKINGS.length} bookings`);

  for (const block of SEED_BLOCKS) {
    await prisma.blockedDate.upsert({
      where: { date: block.date },
      update: {},
      create: block,
    });
  }
  console.log(`✓ Seeded ${SEED_BLOCKS.length} blocked dates`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
