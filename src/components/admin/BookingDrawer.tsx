'use client';

import { Fragment } from 'react';
import { Btn } from '../ui/Btn';
import { Icon } from '../ui/Icon';
import { ImgSlot } from '../ui/ImgSlot';
import { Pill, StatusPill } from '../ui/Pill';
import { BookingDTO, BookingStatus, GT_SIZE_LABELS, GT_WASTE, GT_WINDOWS } from '@/lib/constants';
import { gtFormatDate, gtFormatMoney } from '@/lib/format';

interface Props {
  booking: BookingDTO;
  onClose: () => void;
  onStatusChange: (status: BookingStatus) => void;
  onVerify: () => void;
}

const STATUS_ORDER: BookingStatus[] = ['pending', 'confirmed', 'completed', 'cancelled'];

export function BookingDrawer({ booking: b, onClose, onStatusChange, onVerify }: Props) {
  const serviceLine =
    b.service === 'roro'
      ? `Roll-on/Roll-off Bin · ${GT_SIZE_LABELS.roro[b.size as keyof typeof GT_SIZE_LABELS.roro]}`
      : `Lorry Delta · ${GT_SIZE_LABELS.lorry[b.size as keyof typeof GT_SIZE_LABELS.lorry]}${
          b.days > 1 ? ' × ' + b.days + ' days' : ''
        }`;
  const wasteLabel = GT_WASTE.find((w) => w.id === b.waste)?.label || b.waste;
  const windowLabel = GT_WINDOWS.find((w) => w.id === b.window)?.label || b.window;
  const paymentTone =
    b.payment === 'paid' ? 'accent' : b.payment === 'review' ? 'amber' : b.payment === 'unpaid' ? 'warn' : 'default';

  return (
    <Fragment>
      <div className="gt-drawer-back" onClick={onClose} />
      <aside className="gt-drawer">
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--gt-line)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--gt-ink-3)',
              padding: 4,
            }}
          >
            <Icon name="x" size={18} />
          </button>
          <div style={{ flex: 1 }}>
            <div className="gt-mono" style={{ fontSize: 12, color: 'var(--gt-ink-3)' }}>
              {b.id}
            </div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{b.customer}</div>
          </div>
          <StatusPill status={b.status} />
        </div>

        <div
          className="gt-scroll"
          style={{
            flex: 1,
            overflow: 'auto',
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: 'var(--gt-ink-3)',
                textTransform: 'uppercase',
                letterSpacing: 1,
                marginBottom: 8,
              }}
            >
              Status
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
              {STATUS_ORDER.slice(0, 3).map((s) => {
                const reached = STATUS_ORDER.indexOf(s) <= STATUS_ORDER.indexOf(b.status);
                const isCurrent = s === b.status;
                return (
                  <button
                    key={s}
                    onClick={() => onStatusChange(s)}
                    style={{
                      padding: '10px 8px',
                      border: '1.5px solid ' + (isCurrent ? 'var(--gt-accent)' : 'var(--gt-line-2)'),
                      borderRadius: 8,
                      background: isCurrent
                        ? 'var(--gt-accent-soft)'
                        : reached
                          ? 'var(--gt-surface-2)'
                          : 'var(--gt-surface)',
                      color: isCurrent ? 'var(--gt-accent-2)' : reached ? 'var(--gt-ink)' : 'var(--gt-ink-3)',
                      fontWeight: isCurrent ? 600 : 500,
                      fontSize: 12,
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                    }}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => onStatusChange('cancelled')}
              style={{
                marginTop: 6,
                padding: '6px 10px',
                border: 'none',
                background: 'transparent',
                color: 'var(--gt-warn)',
                cursor: 'pointer',
                fontSize: 12,
              }}
            >
              Cancel booking
            </button>
          </div>

          <div className="gt-card" style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: 'var(--gt-ink-3)',
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              Customer
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="phone" size={14} color="var(--gt-ink-3)" />
              <span className="gt-mono" style={{ fontSize: 13 }}>
                {b.phone}
              </span>
              <a
                href={`https://wa.me/${b.phone.replace(/\D/g, '')}`}
                style={{
                  marginLeft: 'auto',
                  fontSize: 12,
                  color: 'var(--gt-accent)',
                  textDecoration: 'none',
                  fontWeight: 500,
                }}
              >
                WhatsApp →
              </a>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <Icon name="pin" size={14} color="var(--gt-ink-3)" />
              <span style={{ fontSize: 13 }}>{b.address}</span>
            </div>
          </div>

          <div className="gt-card" style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: 'var(--gt-ink-3)',
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              Service details
            </div>
            {(
              [
                ['Service', serviceLine],
                ['Waste type', wasteLabel],
                ['Date', gtFormatDate(b.date)],
                ['Window', windowLabel],
                ['Booked on', gtFormatDate(b.createdAt)],
              ] as const
            ).map(([k, v]) => (
              <div
                key={k}
                style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 13 }}
              >
                <span style={{ color: 'var(--gt-ink-3)' }}>{k}</span>
                <span style={{ textAlign: 'right' }}>{v}</span>
              </div>
            ))}
            {b.notes && (
              <div
                style={{
                  marginTop: 6,
                  padding: 10,
                  background: 'var(--gt-bg-2)',
                  borderRadius: 6,
                  fontSize: 12,
                  color: 'var(--gt-ink-2)',
                  borderLeft: '3px solid var(--gt-amber)',
                }}
              >
                <strong
                  style={{
                    display: 'block',
                    marginBottom: 2,
                    fontSize: 11,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    color: 'var(--gt-ink-3)',
                  }}
                >
                  Notes
                </strong>
                {b.notes}
              </div>
            )}
          </div>

          <div className="gt-card" style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'var(--gt-ink-3)',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                }}
              >
                Payment
              </div>
              <Pill tone={paymentTone}>{b.payment}</Pill>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: 12, color: 'var(--gt-ink-3)' }}>Total</span>
              <span style={{ fontSize: 22, fontWeight: 700 }}>{gtFormatMoney(b.total)}</span>
            </div>
            {b.proofUrl ? (
              <Fragment>
                <ImgSlot label={b.proofUrl.startsWith('http') ? 'View proof' : b.proofUrl} height={120} />
                {b.payment !== 'paid' && (
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Btn variant="primary" size="sm" full onClick={onVerify}>
                      <Icon name="check" size={14} /> Verify payment
                    </Btn>
                    <Btn variant="danger" size="sm">
                      Reject
                    </Btn>
                  </div>
                )}
              </Fragment>
            ) : (
              <div
                style={{
                  padding: 14,
                  border: '1.5px dashed var(--gt-warn)',
                  background: 'var(--gt-warn-soft)',
                  borderRadius: 6,
                  fontSize: 12,
                  color: 'var(--gt-warn)',
                  textAlign: 'center',
                }}
              >
                No payment proof uploaded yet
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            padding: '12px 20px',
            borderTop: '1px solid var(--gt-line)',
            display: 'flex',
            gap: 8,
          }}
        >
          <Btn variant="ghost" size="sm" style={{ flex: 1 }}>
            <Icon name="mail" size={14} /> Resend email
          </Btn>
          <Btn variant="ghost" size="sm" style={{ flex: 1 }}>
            <Icon name="phone" size={14} /> Send SMS
          </Btn>
        </div>
      </aside>
    </Fragment>
  );
}
