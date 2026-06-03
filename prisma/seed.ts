import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Sizes follow new catalogue:
//   roro:  'std' (only)
//   lorry: 'small' (1.5 tonne) | 'cargoarm' (3 tonne)
// Prices reflect KK/Penampang zone pricing; outstation seeded with needsQuote=true, total=0.

type SeedBooking = {
  id: string;
  date: string;
  customer: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  service: 'roro' | 'lorry';
  size: 'std' | 'small' | 'cargoarm';
  waste: 'general' | 'construction';
  window: 'am' | 'pm' | 'flex';
  days: number;
  notes: string;
  total: number;
  needsQuote: boolean;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  payment: 'unpaid' | 'review' | 'paid';
  proofUrl: string | null;
};

const SEED_BOOKINGS: SeedBooking[] = [
  {
    id: 'GT-0180',
    date: '2026-06-06',
    customer: 'Ravi Kumar',
    phone: '+60 12 421 3398',
    address: 'Lot 12, Jln Lintas',
    city: 'Kota Kinabalu',
    state: 'Sabah',
    service: 'roro',
    size: 'std',
    waste: 'construction',
    window: 'am',
    days: 1,
    notes: 'Crane access from north side. Site manager: Suresh.',
    total: 350,
    needsQuote: false,
    status: 'completed',
    payment: 'paid',
    proofUrl: 'maybank-receipt.jpg',
  },
  {
    id: 'GT-0179',
    date: '2026-06-06',
    customer: 'Nor Aisyah',
    phone: '+60 11 2398 7711',
    address: 'B-3-7, Apartmen Sri Putra',
    city: 'Penampang',
    state: 'Sabah',
    service: 'lorry',
    size: 'small',
    waste: 'general',
    window: 'flex',
    days: 1,
    notes: '',
    total: 500,
    needsQuote: false,
    status: 'completed',
    payment: 'paid',
    proofUrl: 'cimb-receipt.pdf',
  },
  {
    id: 'GT-0181',
    date: '2026-06-07',
    customer: 'Tan Beng Hock',
    phone: '+60 12 778 4421',
    address: 'Lot 88, Kawasan Perindustrian KKIP',
    city: 'Kota Kinabalu',
    state: 'Sabah',
    service: 'lorry',
    size: 'cargoarm',
    waste: 'general',
    window: 'am',
    days: 2,
    notes: '2-day rental. Will tip driver directly.',
    total: 1400, // 700 × 2 days
    needsQuote: false,
    status: 'pending',
    payment: 'review',
    proofUrl: 'transfer-screenshot.png',
  },
  {
    id: 'GT-0182',
    date: '2026-06-07',
    customer: 'Siti Rahmah',
    phone: '+60 19 663 4218',
    address: 'No 12, Jln Kolam, Inanam',
    city: 'Kota Kinabalu',
    state: 'Sabah',
    service: 'roro',
    size: 'std',
    waste: 'general',
    window: 'pm',
    days: 1,
    notes: 'Driveway is narrow; please reverse in.',
    total: 350,
    needsQuote: false,
    status: 'confirmed',
    payment: 'paid',
    proofUrl: 'maybank-2.jpg',
  },
  {
    id: 'GT-0183',
    date: '2026-06-08',
    customer: 'Lim Wei Ling',
    phone: '+60 16 234 8821',
    address: 'No 14, Jln Kuhara',
    city: 'Tawau',
    state: 'Sabah',
    service: 'lorry',
    size: 'cargoarm',
    waste: 'general',
    window: 'am',
    days: 1,
    notes: 'Moving office furniture. Outstation — awaiting Cassey to confirm price.',
    total: 0,
    needsQuote: true,
    status: 'pending',
    payment: 'unpaid',
    proofUrl: null,
  },
  {
    id: 'GT-0184',
    date: '2026-06-08',
    customer: 'Ahmad Faizal',
    phone: '+60 14 557 5208',
    address: 'Lot 23, Mile 4, Jln Sandakan',
    city: 'Sandakan',
    state: 'Sabah',
    service: 'roro',
    size: 'std',
    waste: 'construction',
    window: 'am',
    days: 1,
    notes: 'Gate code 4421. Side access only. Outstation — awaiting Cassey quote.',
    total: 0,
    needsQuote: true,
    status: 'pending',
    payment: 'unpaid',
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
    // Upsert refreshes business fields so reseeding picks up catalogue/data tweaks.
    await prisma.booking.upsert({
      where: { id: b.id },
      update: {
        customer: b.customer,
        phone: b.phone,
        address: b.address,
        city: b.city,
        state: b.state,
        size: b.size,
        waste: b.waste,
        window: b.window,
        days: b.days,
        notes: b.notes,
        total: b.total,
        needsQuote: b.needsQuote,
      },
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
