// ───── Service catalogue ─────
//
// Ro-Ro Bin: one SKU, ~5 m³ (2 × 7 × 12 ft), 10 units in fleet.
//   Pricing varies by delivery zone (KK / Penampang / outstation).
// Lorry: two SKUs, flat daily rate (KK zone). Outstation → quote on request.

export const GT_RORO_DIMENSIONS_FT = { w: 2, h: 7, l: 12 } as const;
export const GT_RORO_FLEET_SIZE = 10;

export type RoroSize = 'std';
export type LorrySize = 'small' | 'cargoarm';
export type SizeId = RoroSize | LorrySize;

// Roro is priced per-booking, by zone; not by size.
export const GT_RORO_PRICE_BY_ZONE = {
  kk: 350,
  penampang: 300,
  outstation: null, // quote on request
} as const;

// Lorry is priced per day (zone-agnostic for now; outstation still quote-required).
export const GT_LORRY_DAY_RATE: Record<LorrySize, number> = {
  small: 500,
  cargoarm: 700,
};

export const GT_SIZE_LABELS = {
  roro: { std: 'Standard skip' },
  lorry: {
    small: 'Small lorry · 1.5 tonne',
    cargoarm: 'Cargo arm lorry · 3 tonne',
  },
} as const satisfies {
  roro: Record<RoroSize, string>;
  lorry: Record<LorrySize, string>;
};

export const GT_SIZE_LABELS_SHORT = {
  roro: { std: '5 m³' },
  lorry: { small: '1.5 t', cargoarm: '3 t' },
} as const satisfies {
  roro: Record<RoroSize, string>;
  lorry: Record<LorrySize, string>;
};

export const GT_WASTE = [
  { id: 'general', label: 'General waste', desc: 'Household, retail, office' },
  { id: 'construction', label: 'Construction', desc: 'Concrete, wood, demolition' },
] as const;

export const GT_WINDOWS = [
  { id: 'am', label: 'Morning (8am–12pm)' },
  { id: 'pm', label: 'Afternoon (12pm–5pm)' },
  { id: 'flex', label: 'Flexible' },
] as const;

export type Service = 'roro' | 'lorry';
export type WasteType = 'general' | 'construction';
export type BookingWindow = 'am' | 'pm' | 'flex';
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'review' | 'paid';
export type BlockScope = 'both' | 'roro' | 'lorry';
export type PricingZone = 'kk' | 'penampang' | 'outstation';

export const GT_COUNTRY = 'Malaysia';

// WhatsApp contact link (without `+`, per wa.me convention).
export const GT_WHATSAPP_NUMBER = '60145575208';
export const GT_WHATSAPP_NAME = 'Cassey';

export type BookingDTO = {
  id: string;
  customer: string;
  phone: string;
  address: string; // street line
  city: string;
  state: string;
  service: Service;
  size: string;
  waste: WasteType;
  date: string;
  window: BookingWindow;
  days: number;
  notes: string;
  total: number;
  needsQuote: boolean;
  status: BookingStatus;
  payment: PaymentStatus;
  proofUrl: string | null;
  createdAt: string;
};

export type BlockedDateDTO = {
  date: string;
  scope: BlockScope;
  reason: string;
};
