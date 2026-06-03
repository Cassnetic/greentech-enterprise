import {
  GT_LORRY_DAY_RATE,
  GT_RORO_PRICE_BY_ZONE,
  GT_WHATSAPP_NAME,
  GT_WHATSAPP_NUMBER,
  LorrySize,
  PricingZone,
  Service,
} from './constants';

// Exact-token aliases for short forms (avoid matching `kk` inside a longer word).
const KK_EXACT = new Set(['kk', 'kota kinabalu', 'kotakinabalu']);
const PENAMPANG_EXACT = new Set(['penampang']);

// Substrings — anywhere in the normalized city counts (so "Kota Kinabalu, Sabah" still matches).
const KK_SUBSTRINGS = ['kota kinabalu', 'kotakinabalu'];
const PENAMPANG_SUBSTRINGS = ['penampang'];

export function normalizeCity(raw: string): string {
  return raw.toLowerCase().trim().replace(/[.,]/g, '').replace(/\s+/g, ' ');
}

export function zoneForCity(city: string): PricingZone {
  const n = normalizeCity(city);
  if (!n) return 'outstation'; // caller is expected to gate on empty-city before reading the zone
  if (KK_EXACT.has(n) || KK_SUBSTRINGS.some((s) => n.includes(s))) return 'kk';
  if (PENAMPANG_EXACT.has(n) || PENAMPANG_SUBSTRINGS.some((s) => n.includes(s))) return 'penampang';
  return 'outstation';
}

// Distinct helper so callers can tell "no city yet" from "real outstation".
export function isCityEntered(city: string): boolean {
  return normalizeCity(city).length > 0;
}

export interface PriceArgs {
  service: Service;
  size: string;
  city: string;
  days: number;
}

export interface PriceResult {
  total: number; // 0 when needsQuote
  zone: PricingZone;
  needsQuote: boolean;
}

export function computeBookingPrice({ service, size, city, days }: PriceArgs): PriceResult {
  const zone = zoneForCity(city);
  const needsQuote = zone === 'outstation';

  if (needsQuote) return { total: 0, zone, needsQuote: true };

  if (service === 'roro') {
    const price = GT_RORO_PRICE_BY_ZONE[zone];
    return { total: price ?? 0, zone, needsQuote: price == null };
  }

  // lorry: day rate × days; size must be a known lorry size
  const rate = GT_LORRY_DAY_RATE[size as LorrySize];
  if (rate == null) return { total: 0, zone, needsQuote: true };
  return { total: rate * Math.max(1, days), zone, needsQuote: false };
}

// Build a wa.me link with a pre-filled message asking Cassey for a quote.
export function quoteWhatsAppUrl(opts: {
  service: Service;
  size?: string;
  city?: string;
  state?: string;
  date?: string;
  bookingRef?: string;
}): string {
  const serviceLabel =
    opts.service === 'roro' ? 'a Roll-on/Roll-off bin' : 'a lorry rental';
  const where = [opts.city, opts.state].filter(Boolean).join(', ');
  const lines = [
    `Hi ${GT_WHATSAPP_NAME}, I'd like a quote for ${serviceLabel}.`,
    where ? `Delivery to: ${where}` : null,
    opts.date ? `Date: ${opts.date}` : null,
    opts.bookingRef ? `Booking ref: ${opts.bookingRef}` : null,
  ].filter(Boolean);
  const text = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/${GT_WHATSAPP_NUMBER}?text=${text}`;
}
