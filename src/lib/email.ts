import { Resend } from 'resend';
import {
  BookingDTO,
  GT_COUNTRY,
  GT_SIZE_LABELS,
  GT_WASTE,
  GT_WHATSAPP_NAME,
  GT_WINDOWS,
  LorrySize,
  RoroSize,
} from './constants';
import { gtFormatDate, gtFormatMoney } from './format';

let cached: Resend | null = null;

function getClient(): Resend | null {
  if (cached) return cached;
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  cached = new Resend(key);
  return cached;
}

export async function sendBookingConfirmation(
  email: string,
  booking: BookingDTO,
): Promise<{ ok: boolean; id?: string; reason?: string }> {
  const client = getClient();
  const from = process.env.RESEND_FROM || 'GreenTech Enterprise <onboarding@resend.dev>';

  if (!client) {
    console.warn(`[email] Resend not configured — would send confirmation for ${booking.id} to ${email}`);
    return { ok: false, reason: 'not-configured' };
  }

  const sizeLabel =
    booking.service === 'roro'
      ? `Roll-on/Roll-off Bin · ${GT_SIZE_LABELS.roro[booking.size as RoroSize] ?? booking.size}`
      : `${GT_SIZE_LABELS.lorry[booking.size as LorrySize] ?? booking.size}${
          booking.days > 1 ? ` × ${booking.days} days` : ''
        }`;
  const waste = GT_WASTE.find((w) => w.id === booking.waste)?.label || booking.waste;
  const window = GT_WINDOWS.find((w) => w.id === booking.window)?.label || booking.window;
  const fullAddress = [booking.address, booking.city, booking.state, GT_COUNTRY]
    .filter(Boolean)
    .join(', ');
  const subject = booking.needsQuote
    ? `GreenTech booking ${booking.id} — awaiting quote`
    : `GreenTech booking ${booking.id} reserved`;
  const totalRow = booking.needsQuote
    ? `<p style="margin:14px 0 4px; font-size:16px;"><strong>Total:</strong> Quote pending — ${GT_WHATSAPP_NAME} will confirm.</p>`
    : `<p style="margin:14px 0 4px; font-size:18px;"><strong>Total:</strong> ${escapeHtml(gtFormatMoney(booking.total))}</p>`;
  const nextStep = booking.needsQuote
    ? `<p style="color:#475048; margin:18px 0 6px;">Your delivery zone is outstation — published rates don't cover it. ${GT_WHATSAPP_NAME} will WhatsApp you with a quote shortly. Booking ref <strong>${escapeHtml(booking.id)}</strong>.</p>`
    : `<p style="color:#475048; margin:18px 0 6px;">Transfer to Maybank <strong>5141 2233 7788</strong>, ref <strong>${escapeHtml(booking.id)}</strong>, then upload your receipt at your confirmation page.</p>`;

  const html = `
    <div style="font-family: 'DM Sans', system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
      <h2 style="margin:0 0 6px;">Thanks, ${escapeHtml(booking.customer.split(' ')[0])}!</h2>
      <p style="color:#475048; margin:0 0 18px;">
        Your booking <strong>${escapeHtml(booking.id)}</strong> ${booking.needsQuote ? 'is received — pricing pending.' : 'is reserved. Complete bank transfer to confirm.'}
      </p>
      <div style="background:#fbfaf6; border:1px solid #e8e5dc; border-radius:10px; padding:18px;">
        <p style="margin:4px 0;"><strong>Service:</strong> ${escapeHtml(sizeLabel)}</p>
        <p style="margin:4px 0;"><strong>Waste:</strong> ${escapeHtml(waste)}</p>
        <p style="margin:4px 0;"><strong>Date:</strong> ${escapeHtml(gtFormatDate(booking.date))} · ${escapeHtml(window)}</p>
        <p style="margin:4px 0;"><strong>Delivery:</strong> ${escapeHtml(fullAddress)}</p>
        ${totalRow}
      </div>
      ${nextStep}
      <p style="color:#7d857d; font-size:12px; margin-top:24px;">
        Questions? ${GT_WHATSAPP_NAME} · +60 14-557 5208 · Mon–Sat, 8am–6pm
      </p>
    </div>
  `;

  try {
    const { data, error } = await client.emails.send({
      from,
      to: email,
      subject,
      html,
    });
    if (error) {
      console.error('[email] Resend error', error);
      return { ok: false, reason: error.message };
    }
    return { ok: true, id: data?.id };
  } catch (e) {
    console.error('[email] Resend threw', e);
    return { ok: false, reason: (e as Error).message };
  }
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
}
