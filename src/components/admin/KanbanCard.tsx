'use client';

import { Icon } from '../ui/Icon';
import { Pill } from '../ui/Pill';
import { BookingDTO, GT_SIZE_LABELS_SHORT, LorrySize, RoroSize } from '@/lib/constants';
import { gtFormatDateShort, gtFormatMoney } from '@/lib/format';

interface Props {
  booking: BookingDTO;
  onClick: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  dragging: boolean;
}

export function KanbanCard({ booking: b, onClick, onDragStart, onDragEnd, dragging }: Props) {
  const sizeLabel =
    b.service === 'roro'
      ? `Roll-off · ${GT_SIZE_LABELS_SHORT.roro[b.size as RoroSize] ?? b.size}`
      : `Lorry · ${GT_SIZE_LABELS_SHORT.lorry[b.size as LorrySize] ?? b.size}${
          b.days > 1 ? ' × ' + b.days + 'd' : ''
        }`;
  const locationLabel = b.city || b.address.split(',')[0]?.trim() || '—';
  const paymentTone =
    b.payment === 'paid' ? 'accent' : b.payment === 'review' ? 'amber' : b.payment === 'unpaid' ? 'warn' : 'default';

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = 'move';
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      onClick={onClick}
      className="gt-card"
      style={{
        padding: 12,
        cursor: 'pointer',
        opacity: dragging ? 0.3 : 1,
        transition: 'box-shadow .12s ease, transform .12s ease',
        userSelect: 'none',
      }}
      onMouseOver={(e) => (e.currentTarget.style.boxShadow = 'var(--gt-shadow)')}
      onMouseOut={(e) => (e.currentTarget.style.boxShadow = 'var(--gt-shadow-sm)')}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="gt-mono" style={{ fontSize: 11, color: 'var(--gt-ink-3)' }}>
          {b.id}
        </span>
        <span className="gt-mono" style={{ fontSize: 11, color: 'var(--gt-ink-2)' }}>
          {gtFormatDateShort(b.date)}
        </span>
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>{b.customer}</div>
      <div
        style={{
          fontSize: 12,
          color: 'var(--gt-ink-3)',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          marginTop: 2,
        }}
      >
        <Icon name={b.service === 'roro' ? 'box' : 'truck'} size={12} />
        {sizeLabel}
      </div>
      <div
        style={{
          fontSize: 11,
          color: 'var(--gt-ink-3)',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          marginTop: 2,
        }}
      >
        <Icon name="pin" size={11} />
        {locationLabel}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 8,
        }}
      >
        <Pill tone={paymentTone}>{b.payment}</Pill>
        {b.needsQuote ? (
          <Pill tone="amber">Quote</Pill>
        ) : (
          <span className="gt-mono" style={{ fontSize: 12, fontWeight: 600 }}>
            {gtFormatMoney(b.total)}
          </span>
        )}
      </div>
    </div>
  );
}
