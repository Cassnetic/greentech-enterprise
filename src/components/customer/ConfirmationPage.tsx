'use client';

import { useState } from 'react';
import { CustomerHeader } from './Header';
import { UploadProofModal } from './UploadProofModal';
import { Btn } from '../ui/Btn';
import { Icon } from '../ui/Icon';
import { Pill } from '../ui/Pill';
import { Toast } from '../ui/Toast';
import { BookingDTO, GT_SIZE_LABELS, GT_WASTE, GT_WINDOWS } from '@/lib/constants';
import { gtFormatDate, gtFormatMoney } from '@/lib/format';

interface Props {
  initialBooking: BookingDTO;
}

export function ConfirmationPage({ initialBooking }: Props) {
  const [booking, setBooking] = useState(initialBooking);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const firstName = booking.customer.split(' ')[0];

  const serviceLine =
    booking.service === 'roro'
      ? `Roll-on/Roll-off Bin · ${GT_SIZE_LABELS.roro[booking.size as keyof typeof GT_SIZE_LABELS.roro]}`
      : `Lorry Delta · ${GT_SIZE_LABELS.lorry[booking.size as keyof typeof GT_SIZE_LABELS.lorry]}${
          booking.days > 1 ? ` × ${booking.days} days` : ''
        }`;
  const wasteLabel = GT_WASTE.find((w) => w.id === booking.waste)?.label || booking.waste;
  const windowLabel = GT_WINDOWS.find((w) => w.id === booking.window)?.label.split(' ')[0] || booking.window;

  const onUploaded = (proofUrl: string) => {
    setBooking((b) => ({ ...b, proofUrl, payment: 'review' }));
    setUploadOpen(false);
    setToast('Payment proof submitted!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <CustomerHeader />
      <div className="gt-page gt-scroll">
        <div className="max-w-[620px] mx-auto px-4 md:px-6 pt-7 md:pt-8 pb-12 md:pb-[60px] flex flex-col gap-[18px]">
          <div
            className="gt-fade-in"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
              paddingTop: 12,
            }}
          >
            <div
              style={{
                width: 68,
                height: 68,
                borderRadius: '50%',
                background: 'var(--gt-accent-soft)',
                border: '2px solid var(--gt-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'gtFadeIn .4s ease',
              }}
            >
              <Icon name="check" size={32} color="var(--gt-accent)" />
            </div>
            <h1 className="m-0 font-bold tracking-[-0.01em] text-center text-[24px] md:text-[32px]">
              Thanks, {firstName}!
            </h1>
            <p
              style={{
                fontSize: 15,
                color: 'var(--gt-ink-2)',
                textAlign: 'center',
                maxWidth: 480,
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              Your {booking.service === 'roro' ? 'Roll-on/Roll-off bin' : 'lorry'} booking is reserved. To confirm, please
              complete bank transfer and upload your receipt.
            </p>
          </div>

          <div
            className="gt-card"
            style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 12 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'var(--gt-ink-3)',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                }}
              >
                Booking reference
              </div>
              <div style={{ fontFamily: 'var(--gt-mono)', fontSize: 15, fontWeight: 600 }}>{booking.id}</div>
            </div>
            <div style={{ borderTop: '1px dashed var(--gt-line-2)' }} />
            {(
              [
                ['Service', serviceLine],
                ['Waste type', wasteLabel],
                ['Date', `${gtFormatDate(booking.date)} · ${windowLabel}`],
                ['Delivery to', booking.address],
                ['Contact', `${booking.customer} · ${booking.phone}`],
              ] as const
            ).map(([k, v]) => (
              <div
                key={k}
                style={{ display: 'flex', justifyContent: 'space-between', gap: 16, fontSize: 13 }}
              >
                <span style={{ color: 'var(--gt-ink-3)' }}>{k}</span>
                <span style={{ color: 'var(--gt-ink)', textAlign: 'right', maxWidth: '70%' }}>{v}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px dashed var(--gt-line-2)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'var(--gt-ink-3)',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                }}
              >
                Total due
              </div>
              <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.01em' }}>
                {gtFormatMoney(booking.total)}
              </div>
            </div>
          </div>

          {!booking.proofUrl ? (
            <div className="gt-card gt-card--accent p-4 md:p-[18px] flex flex-col md:flex-row md:items-center gap-3 md:gap-3.5">
              <div className="flex items-center gap-3 md:gap-3.5 flex-1 min-w-0">
                <div className="w-9 h-9 rounded-full bg-accent text-white flex items-center justify-center shrink-0 font-bold">
                  !
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-accent-2">Next: complete payment</div>
                  <div className="text-xs text-ink-2">
                    Transfer to Maybank <span className="gt-mono">5141 2233 7788</span>, ref{' '}
                    <span className="gt-mono">{booking.id}</span>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-auto [&>button]:w-full md:[&>button]:w-auto">
                <Btn variant="primary" onClick={() => setUploadOpen(true)}>
                  <Icon name="upload" /> Upload proof
                </Btn>
              </div>
            </div>
          ) : (
            <div
              className="gt-card"
              style={{
                padding: 18,
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                borderColor: 'var(--gt-accent-soft-2)',
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'var(--gt-accent)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon name="check" size={20} color="white" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>Payment proof received</div>
                <div style={{ fontSize: 12, color: 'var(--gt-ink-3)' }}>
                  We&apos;ll verify and email confirmation within 1 working day.
                </div>
              </div>
              <Pill tone="amber">Awaiting verification</Pill>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-2 pt-2">
            <Btn variant="ghost" size="sm">
              <Icon name="mail" /> Email me a copy
            </Btn>
            <Btn variant="ghost" size="sm">
              <Icon name="phone" /> SMS me
            </Btn>
            <Btn variant="ghost" size="sm" onClick={() => window.print()}>
              <Icon name="download" /> Print
            </Btn>
          </div>

          <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--gt-ink-3)', marginTop: 8 }}>
            Questions? Call Cassey at <span className="gt-mono">+60 14-557 5208</span> · Mon–Sat, 8am–6pm
          </div>
        </div>
      </div>

      {uploadOpen && (
        <UploadProofModal
          booking={booking}
          onClose={() => setUploadOpen(false)}
          onUploaded={onUploaded}
        />
      )}
      <Toast message={toast} onClose={() => setToast(null)} />
    </div>
  );
}
