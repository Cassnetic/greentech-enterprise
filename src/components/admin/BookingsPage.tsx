'use client';

import { useEffect, useMemo, useState } from 'react';
import { AdminSidebar } from './Sidebar';
import { KanbanCard } from './KanbanCard';
import { BookingDrawer } from './BookingDrawer';
import { QuickAddDrawer } from './QuickAddDrawer';
import { Btn } from '../ui/Btn';
import { Icon } from '../ui/Icon';
import { Pill, StatusPill } from '../ui/Pill';
import { Stat } from '../ui/Stat';
import { Toast } from '../ui/Toast';
import { BookingDTO, BookingStatus } from '@/lib/constants';
import { gtFormatDateShort, gtFormatMoney } from '@/lib/format';

interface Props {
  initialBookings: BookingDTO[];
  adminEmail: string;
  today: string;
  view?: 'bookings' | 'payments';
}

const COLS: { key: BookingStatus; label: string }[] = [
  { key: 'pending', label: 'Pending' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'completed', label: 'Completed' },
];

export function AdminBookingsPage({ initialBookings, adminEmail, today, view = 'bookings' }: Props) {
  const isPaymentsView = view === 'payments';
  const [bookings, setBookings] = useState(initialBookings);
  const [openId, setOpenId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<BookingStatus | null>(null);
  const [filter, setFilter] = useState<'all' | 'roro' | 'lorry'>('all');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  const filtered = useMemo(
    () =>
      bookings.filter((b) => {
        if (isPaymentsView && b.payment !== 'review' && b.payment !== 'unpaid') return false;
        if (filter !== 'all' && b.service !== filter) return false;
        if (search) {
          const q = search.toLowerCase();
          return (
            b.id.toLowerCase().includes(q) ||
            b.customer.toLowerCase().includes(q) ||
            b.phone.includes(q)
          );
        }
        return true;
      }),
    [bookings, filter, search, isPaymentsView],
  );

  const moveBooking = async (id: string, newStatus: BookingStatus) => {
    setBookings((bs) => bs.map((b) => (b.id === id ? { ...b, status: newStatus } : b)));
    setToast(`${id} → ${newStatus}`);
    await fetch(`/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
  };

  const verifyPayment = async (id: string) => {
    setBookings((bs) =>
      bs.map((b) =>
        b.id === id ? { ...b, payment: 'paid', status: b.status === 'pending' ? 'confirmed' : b.status } : b,
      ),
    );
    setToast(`Payment verified for ${id}`);
    await fetch(`/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payment: 'paid' }),
    });
  };

  const paymentReview = bookings.filter((b) => b.payment === 'review' || b.payment === 'unpaid');
  const openBooking = bookings.find((b) => b.id === openId) ?? null;

  // "n" or Cmd/Ctrl+N opens Quick add (when not typing in an input)
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (quickAddOpen) return;
      const target = e.target as HTMLElement | null;
      const inEditable =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        target?.isContentEditable;
      if (inEditable) return;
      const meta = e.metaKey || e.ctrlKey;
      if ((e.key === 'n' || e.key === 'N') && (meta || (!e.altKey && !e.shiftKey))) {
        if (meta) e.preventDefault();
        setQuickAddOpen(true);
      }
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [quickAddOpen]);

  const handleCreated = (created: BookingDTO) => {
    setBookings((bs) => [created, ...bs]);
    setQuickAddOpen(false);
    setToast(`Booking ${created.id} created`);
  };

  const stats = {
    active: bookings.filter((b) => b.status === 'pending' || b.status === 'confirmed').length,
    pendingPay: paymentReview.length,
    revenue: bookings.filter((b) => b.payment === 'paid').reduce((a, b) => a + b.total, 0),
    today: bookings.filter((b) => b.date === today).length,
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <AdminSidebar active={isPaymentsView ? 'payments' : 'bookings'} bookings={bookings} adminEmail={adminEmail} />

      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          minWidth: 0,
        }}
      >
        <div className="px-4 md:px-6 py-3 md:py-4 border-b border-line flex flex-wrap items-center gap-3 md:gap-4 bg-surface shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>
                {isPaymentsView ? 'Payments' : 'Bookings'}
              </h1>
              {isPaymentsView && <Pill tone="amber">Awaiting verification</Pill>}
            </div>
            <div style={{ fontSize: 12, color: 'var(--gt-ink-3)' }}>
              {isPaymentsView
                ? 'Bookings waiting for transfer proof or verification · open a card to verify'
                : 'Drag cards across columns to update status · click any card to open'}
            </div>
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ position: 'relative' }}>
            <div
              style={{
                position: 'absolute',
                left: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
              }}
            >
              <Icon name="search" size={14} color="var(--gt-ink-3)" />
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ref, name, phone…"
              style={{
                padding: '8px 12px 8px 32px',
                width: 240,
                border: '1px solid var(--gt-line-2)',
                borderRadius: 8,
                fontSize: 13,
                background: 'var(--gt-surface)',
                outline: 'none',
                fontFamily: 'inherit',
                color: 'inherit',
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: 4, padding: 4, background: 'var(--gt-bg-2)', borderRadius: 8 }}>
            {([
              ['all', 'All'],
              ['roro', 'Roll-off'],
              ['lorry', 'Lorry'],
            ] as const).map(([k, l]) => (
              <button
                key={k}
                onClick={() => setFilter(k)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 6,
                  border: 'none',
                  fontSize: 12,
                  fontWeight: filter === k ? 600 : 500,
                  cursor: 'pointer',
                  background: filter === k ? 'var(--gt-surface)' : 'transparent',
                  color: filter === k ? 'var(--gt-ink)' : 'var(--gt-ink-2)',
                  boxShadow: filter === k ? 'var(--gt-shadow-sm)' : 'none',
                }}
              >
                {l}
              </button>
            ))}
          </div>
          <Btn variant="primary" size="sm" onClick={() => setQuickAddOpen(true)}>
            <Icon name="plus" size={14} /> New booking
            <span className="hidden md:inline ml-1.5 font-mono text-[10px] opacity-70">N</span>
          </Btn>
        </div>

        <div className="px-4 md:px-6 pt-3.5 grid grid-cols-2 md:grid-cols-4 gap-3">
          {isPaymentsView ? (
            <>
              <Stat
                label="Awaiting verification"
                value={bookings.filter((b) => b.payment === 'review').length}
                tone="amber"
              />
              <Stat
                label="Awaiting transfer"
                value={bookings.filter((b) => b.payment === 'unpaid').length}
                tone={bookings.some((b) => b.payment === 'unpaid') ? 'warn' : 'default'}
              />
              <Stat label="Verified bookings" value={bookings.filter((b) => b.payment === 'paid').length} />
              <Stat label="Verified revenue" value={gtFormatMoney(stats.revenue)} tone="accent" />
            </>
          ) : (
            <>
              <Stat label="Active bookings" value={stats.active} tone="accent" />
              <Stat
                label="Awaiting payment"
                value={stats.pendingPay}
                tone={stats.pendingPay > 0 ? 'warn' : 'default'}
              />
              <Stat label="Bookings today" value={stats.today} />
              <Stat label="Verified revenue" value={gtFormatMoney(stats.revenue)} />
            </>
          )}
        </div>

        <div className="gt-scroll flex-1 overflow-auto p-4 md:p-6 md:pt-4">
          {isPaymentsView ? (
            <PaymentsListView
              bookings={filtered}
              onVerify={verifyPayment}
              onOpen={(id) => setOpenId(id)}
            />
          ) : (
            <BookingsKanbanView
              cols={COLS}
              filtered={filtered}
              dragOverCol={dragOverCol}
              draggingId={draggingId}
              setDragOverCol={setDragOverCol}
              setDraggingId={setDraggingId}
              moveBooking={moveBooking}
              setOpenId={setOpenId}
            />
          )}
        </div>
      </main>

      {openBooking && (
        <BookingDrawer
          booking={openBooking}
          onClose={() => setOpenId(null)}
          onStatusChange={(s) => moveBooking(openBooking.id, s)}
          onVerify={() => verifyPayment(openBooking.id)}
        />
      )}
      {quickAddOpen && (
        <QuickAddDrawer onClose={() => setQuickAddOpen(false)} onCreated={handleCreated} />
      )}
      <Toast message={toast} onClose={() => setToast(null)} />
    </div>
  );
}

/* ---------- BOOKINGS KANBAN ---------- */

interface KanbanProps {
  cols: { key: BookingStatus; label: string }[];
  filtered: BookingDTO[];
  dragOverCol: BookingStatus | null;
  draggingId: string | null;
  setDragOverCol: (k: BookingStatus | null) => void;
  setDraggingId: (id: string | null) => void;
  moveBooking: (id: string, s: BookingStatus) => void;
  setOpenId: (id: string) => void;
}

function BookingsKanbanView({
  cols,
  filtered,
  dragOverCol,
  draggingId,
  setDragOverCol,
  setDraggingId,
  moveBooking,
  setOpenId,
}: KanbanProps) {
  return (
    <div className="grid gap-3.5 min-h-full grid-cols-[280px_280px_280px] md:grid-cols-3">
      {cols.map((col) => {
        const rows = filtered.filter((b) => b.status === col.key);
        const isDragOver = dragOverCol === col.key;
        return (
          <div
            key={col.key}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOverCol(col.key);
            }}
            onDragLeave={() => setDragOverCol(dragOverCol === col.key ? null : dragOverCol)}
            onDrop={() => {
              if (draggingId) moveBooking(draggingId, col.key);
              setDraggingId(null);
              setDragOverCol(null);
            }}
            className="rounded-xl p-3 flex flex-col gap-2 transition-colors"
            style={{
              background: isDragOver ? 'var(--gt-accent-soft)' : 'var(--gt-bg-2)',
              border: '1.5px dashed ' + (isDragOver ? 'var(--gt-accent)' : 'transparent'),
            }}
          >
            <div className="flex items-center gap-1.5 px-1 py-0.5">
              <StatusPill status={col.key} />
              <span className="font-mono text-[12px] text-ink-3">{rows.length}</span>
            </div>
            {rows.map((b) => (
              <KanbanCard
                key={b.id}
                booking={b}
                onClick={() => setOpenId(b.id)}
                onDragStart={() => setDraggingId(b.id)}
                onDragEnd={() => setDraggingId(null)}
                dragging={draggingId === b.id}
              />
            ))}
            {rows.length === 0 && (
              <div className="text-center py-3.5 px-3 text-[12px] text-ink-3 border border-dashed border-line-2 rounded-lg">
                Drop bookings here
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ---------- PAYMENTS-ONLY VIEW ---------- */

interface PaymentsListProps {
  bookings: BookingDTO[];
  onVerify: (id: string) => void;
  onOpen: (id: string) => void;
}

function PaymentsListView({ bookings, onVerify, onOpen }: PaymentsListProps) {
  const review = bookings.filter((b) => b.payment === 'review');
  const unpaid = bookings.filter((b) => b.payment === 'unpaid');

  return (
    <div className="flex flex-col gap-12 pb-6">
      <PaymentsSection
        eyebrow="01"
        title="Awaiting verification"
        subtitle="Customer uploaded transfer proof. Confirm to release the booking."
        count={review.length}
        emptyHead="No proofs to review"
        emptyBody="Inbox zero — every uploaded transfer has been verified."
      >
        {review.map((b) => (
          <PaymentLedgerCard
            key={b.id}
            booking={b}
            variant="review"
            onVerify={() => onVerify(b.id)}
            onOpen={() => onOpen(b.id)}
          />
        ))}
      </PaymentsSection>

      <PaymentsSection
        eyebrow="02"
        title="Awaiting transfer"
        subtitle="Customer hasn't sent proof yet. Nudge after 24 hours."
        count={unpaid.length}
        emptyHead="Everyone's transferred"
        emptyBody="No outstanding follow-ups. Nothing to chase right now."
      >
        {unpaid.map((b) => (
          <PaymentLedgerCard
            key={b.id}
            booking={b}
            variant="unpaid"
            onOpen={() => onOpen(b.id)}
          />
        ))}
      </PaymentsSection>
    </div>
  );
}

function PaymentsSection({
  eyebrow,
  title,
  subtitle,
  count,
  emptyHead,
  emptyBody,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  count: number;
  emptyHead: string;
  emptyBody: string;
  children: React.ReactNode;
}) {
  const isEmpty = count === 0;
  return (
    <section className="flex flex-col gap-5">
      {/* Editorial section masthead */}
      <header className="flex items-end justify-between gap-6 border-b border-line pb-3">
        <div className="flex items-baseline gap-3 min-w-0">
          <span
            aria-hidden
            className="font-mono text-[12px] font-semibold text-ink-2 tracking-[0.18em] uppercase tabular-nums"
          >
            {eyebrow}
          </span>
          <h2 className="m-0 text-[26px] md:text-[30px] font-bold tracking-[-0.02em] leading-none text-ink">
            {title}
          </h2>
        </div>
        <span className="font-mono text-[12px] font-semibold text-ink-2 tracking-[0.1em] uppercase whitespace-nowrap">
          <span className="tabular-nums text-ink">{count.toString().padStart(2, '0')}</span> open
        </span>
      </header>
      <p className="m-0 -mt-2 text-[14px] text-ink-2 leading-snug max-w-[640px]">{subtitle}</p>

      {isEmpty ? (
        <div className="relative overflow-hidden rounded-xl bg-surface-2 px-6 py-9 flex flex-col items-start gap-2 border border-dashed border-line-2">
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.16em] uppercase text-accent-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent" />
            Clear
          </div>
          <div className="text-[18px] font-bold text-ink tracking-[-0.01em]">{emptyHead}</div>
          <div className="text-[13px] text-ink-3 max-w-[480px]">{emptyBody}</div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">{children}</div>
      )}
    </section>
  );
}

/* Editorial ledger card — the visual anchor is the AMOUNT (large tabular mono) */
function PaymentLedgerCard({
  booking: b,
  variant,
  onVerify,
  onOpen,
}: {
  booking: BookingDTO;
  variant: 'review' | 'unpaid';
  onVerify?: () => void;
  onOpen: () => void;
}) {
  const isReview = variant === 'review';
  const accent = isReview ? 'var(--gt-amber)' : 'var(--gt-warn)';
  const accentSoft = isReview ? 'var(--gt-amber-soft)' : 'var(--gt-warn-soft)';
  const sizeLabel =
    b.service === 'roro'
      ? `Roll-off · ${b.size}`
      : `Lorry · ${b.size}${b.days > 1 ? ` × ${b.days}d` : ''}`;
  const moneyParts = gtFormatMoney(b.total).split(' '); // ['RM', '1,560']

  return (
    <article
      className="group/card relative rounded-xl bg-surface overflow-hidden transition-shadow hover:shadow-gt"
      style={{
        border: `1px solid ${accentSoft}`,
        boxShadow: 'var(--gt-shadow-sm)',
      }}
    >
      {/* Top perforation strip — receipt detail */}
      <div
        aria-hidden
        className="h-1.5 w-full"
        style={{
          background: `repeating-linear-gradient(90deg, ${accent} 0 6px, transparent 6px 12px)`,
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 md:gap-10 p-5 md:p-6">
        {/* LEFT — customer + service + proof */}
        <div className="flex flex-col gap-4 min-w-0">
          {/* Ledger meta line */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-ink-3 tracking-[0.04em]">
            <span className="text-ink-2 font-semibold tabular-nums">{b.id}</span>
            <span className="text-line-2">/</span>
            <span className="tabular-nums">{gtFormatDateShort(b.date)}</span>
            <span className="text-line-2">/</span>
            <span className="uppercase">{b.service === 'roro' ? 'Roll-off' : 'Lorry'}</span>
            <span className="text-line-2">/</span>
            <span className="uppercase tracking-[0.08em] font-semibold" style={{ color: accent }}>
              {isReview ? 'Proof received' : 'No proof yet'}
            </span>
          </div>

          {/* Customer name — typographic anchor of left column */}
          <div className="flex flex-col gap-1.5">
            <h3 className="m-0 text-[22px] md:text-[24px] font-bold tracking-[-0.015em] leading-tight text-ink">
              {b.customer}
            </h3>
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[12.5px] text-ink-3">
              <span className="inline-flex items-center gap-1.5">
                <Icon name={b.service === 'roro' ? 'box' : 'truck'} size={13} color="var(--gt-ink-3)" />
                {sizeLabel}
              </span>
              <span className="text-line-2">·</span>
              <a
                href={`tel:${b.phone}`}
                className="font-mono no-underline text-ink-2 hover:text-ink tabular-nums"
              >
                {b.phone}
              </a>
            </div>
          </div>

          {/* Proof block */}
          {isReview ? (
            <ProofPanel proofUrl={b.proofUrl} accent={accent} accentSoft={accentSoft} />
          ) : (
            <PendingProofPanel />
          )}
        </div>

        {/* RIGHT — amount column. The hero */}
        <aside className="flex md:flex-col md:items-end items-baseline justify-between gap-3 md:gap-5 md:border-l md:border-line md:pl-10 md:min-w-[200px]">
          <div className="flex flex-col gap-1.5 md:items-end">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3 font-semibold">
              Amount
            </span>
            <div className="flex items-baseline gap-2 md:gap-2.5">
              <span
                className="font-mono text-[13px] font-semibold tracking-tight"
                style={{ color: accent }}
              >
                {moneyParts[0]}
              </span>
              <span
                className="font-mono font-bold tabular-nums leading-none tracking-[-0.02em]"
                style={{ fontSize: 'clamp(28px, 4vw, 38px)', color: accent }}
              >
                {moneyParts[1]}
              </span>
            </div>
            <span className="text-[11px] text-ink-3 font-mono uppercase tracking-[0.08em]">
              {isReview ? 'Pending review' : 'Awaiting transfer'}
            </span>
          </div>

          {/* Vertical action stack — desktop only */}
          <div className="hidden md:flex flex-col gap-2 w-full md:items-end">
            {isReview && onVerify ? (
              <button
                type="button"
                onClick={onVerify}
                disabled={!b.proofUrl}
                className="w-full inline-flex items-center justify-center gap-2 h-11 px-5 rounded-lg bg-accent text-white font-semibold text-[13.5px] tracking-[0.005em] transition-all hover:bg-accent-2 active:translate-y-px disabled:opacity-40 disabled:cursor-not-allowed shadow-gt-sm"
              >
                <Icon name="check" size={14} /> Verify payment
              </button>
            ) : (
              <a
                href={`https://wa.me/${b.phone.replace(/\D/g, '')}?text=Hi ${encodeURIComponent(b.customer.split(' ')[0])}, just checking in on payment for booking ${b.id}.`}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 h-11 px-5 rounded-lg bg-ink text-white font-semibold text-[13.5px] tracking-[0.005em] transition-all hover:opacity-90 active:translate-y-px shadow-gt-sm no-underline"
              >
                <Icon name="phone" size={14} /> WhatsApp nudge
              </a>
            )}
            <button
              type="button"
              onClick={onOpen}
              className="w-full inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-lg border border-line-2 bg-surface text-ink-2 font-medium text-[12.5px] hover:bg-bg-2 hover:text-ink transition-colors"
            >
              Open booking <Icon name="arrow-r" size={12} />
            </button>
          </div>
        </aside>
      </div>

      {/* Mobile action footer */}
      <div className="md:hidden flex items-center gap-2 px-5 pb-5 border-t border-line pt-4">
        {isReview && onVerify ? (
          <button
            type="button"
            onClick={onVerify}
            disabled={!b.proofUrl}
            className="flex-1 inline-flex items-center justify-center gap-2 h-11 px-4 rounded-lg bg-accent text-white font-semibold text-[13.5px] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Icon name="check" size={14} /> Verify
          </button>
        ) : (
          <a
            href={`https://wa.me/${b.phone.replace(/\D/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 h-11 px-4 rounded-lg bg-ink text-white font-semibold text-[13.5px] no-underline"
          >
            <Icon name="phone" size={14} /> WhatsApp
          </a>
        )}
        <button
          type="button"
          onClick={onOpen}
          className="inline-flex items-center justify-center gap-1.5 h-11 px-4 rounded-lg border border-line-2 bg-surface text-ink-2 font-medium text-[12.5px]"
        >
          Open <Icon name="arrow-r" size={12} />
        </button>
      </div>
    </article>
  );
}

function ProofPanel({
  proofUrl,
  accent,
  accentSoft,
}: {
  proofUrl: string | null;
  accent: string;
  accentSoft: string;
}) {
  if (!proofUrl) {
    return (
      <div
        className="rounded-lg flex items-center gap-3 px-4 py-4"
        style={{ background: 'var(--gt-warn-soft)', border: '1.5px dashed var(--gt-warn)' }}
      >
        <Icon name="upload" size={16} color="var(--gt-warn)" />
        <div className="flex flex-col">
          <span className="text-[13px] font-semibold text-warn">Proof missing</span>
          <span className="text-[11.5px] text-ink-3">Customer marked transfer but didn&apos;t attach a screenshot.</span>
        </div>
      </div>
    );
  }

  const filename = proofUrl.startsWith('http') ? 'transfer-proof' : proofUrl;
  return (
    <a
      href={proofUrl.startsWith('http') ? proofUrl : '#'}
      target={proofUrl.startsWith('http') ? '_blank' : undefined}
      rel="noreferrer"
      className="block group/proof rounded-lg overflow-hidden no-underline text-inherit"
      style={{ border: `1px solid ${accentSoft}` }}
    >
      {/* "Document" header */}
      <div
        className="flex items-center justify-between px-3.5 py-2 border-b"
        style={{ background: accentSoft, borderColor: accentSoft }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <Icon name="download" size={13} color={accent} />
          <span className="font-mono text-[11.5px] truncate" style={{ color: accent }}>
            {filename}
          </span>
        </div>
        <span
          className="font-mono text-[10px] uppercase tracking-[0.12em] font-semibold opacity-0 group-hover/proof:opacity-100 transition-opacity"
          style={{ color: accent }}
        >
          Open ↗
        </span>
      </div>
      {/* Preview area */}
      <div
        className="h-[120px] flex items-center justify-center relative"
        style={{
          background:
            'repeating-linear-gradient(135deg, var(--gt-surface-2) 0 8px, var(--gt-bg-2) 8px 16px)',
        }}
      >
        <div className="flex flex-col items-center gap-1.5 text-ink-3">
          <Icon name="eye" size={18} color="var(--gt-ink-3)" />
          <span className="text-[11px] font-medium uppercase tracking-[0.1em]">Tap to inspect</span>
        </div>
      </div>
    </a>
  );
}

function PendingProofPanel() {
  return (
    <div
      className="relative rounded-lg p-4 flex items-start gap-3 overflow-hidden"
      style={{ background: 'var(--gt-warn-soft)', border: '1px solid var(--gt-warn-soft)' }}
    >
      <span
        aria-hidden
        className="absolute inset-0 opacity-50"
        style={{
          background:
            'repeating-linear-gradient(135deg, transparent 0 10px, rgba(193,74,42,0.06) 10px 20px)',
        }}
      />
      <Icon name="upload" size={16} color="var(--gt-warn)" />
      <div className="relative flex flex-col gap-0.5">
        <span className="text-[13px] font-semibold" style={{ color: 'var(--gt-warn)' }}>
          Waiting on customer
        </span>
        <span className="text-[11.5px] text-ink-3 leading-snug max-w-[420px]">
          Booking is held until proof of transfer arrives. Send a friendly nudge if it&apos;s been a day.
        </span>
      </div>
    </div>
  );
}
