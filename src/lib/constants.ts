export const GT_PRICES = {
  roro: { '10yd': 850, '20yd': 1250, '40yd': 1850 },
  lorry: { '1T': 380, '3T': 580, '5T': 780 },
} as const;

// Note: keys are kept as internal IDs (`10yd`, `1T`, etc.) for DB/route stability.
// Labels are metric: cubic metres for bins, metric tonnes for lorries.
//   10 yd³ ≈ 7.65 m³ → rounded to 8 m³
//   20 yd³ ≈ 15.29 m³ → rounded to 15 m³
//   40 yd³ ≈ 30.58 m³ → rounded to 30 m³
export const GT_SIZE_LABELS = {
  roro: { '10yd': '8 m³', '20yd': '15 m³', '40yd': '30 m³' },
  lorry: { '1T': '1 tonne', '3T': '3 tonnes', '5T': '5 tonnes' },
} as const;

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

export type BookingDTO = {
  id: string;
  customer: string;
  phone: string;
  address: string;
  service: Service;
  size: string;
  waste: WasteType;
  date: string;
  window: BookingWindow;
  days: number;
  notes: string;
  total: number;
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
