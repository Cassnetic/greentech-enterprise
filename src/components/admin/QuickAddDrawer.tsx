'use client';

import { Fragment, useEffect, useMemo, useState } from 'react';
import { Btn } from '../ui/Btn';
import { Field, Input, Select, Textarea } from '../ui/Field';
import { Icon } from '../ui/Icon';
import {
  BookingDTO,
  BookingStatus,
  BookingWindow,
  GT_COUNTRY,
  GT_SIZE_LABELS,
  GT_WASTE,
  GT_WHATSAPP_NAME,
  GT_WINDOWS,
  LorrySize,
  PaymentStatus,
  RoroSize,
  Service,
  WasteType,
} from '@/lib/constants';
import { computeBookingPrice } from '@/lib/pricing';
import { gtFormatMoney } from '@/lib/format';

interface Props {
  onClose: () => void;
  onCreated: (b: BookingDTO) => void;
}

interface FormState {
  service: Service;
  size: string;
  waste: WasteType;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  date: string;
  window: BookingWindow;
  days: number;
  notes: string;
  status: BookingStatus;
  payment: PaymentStatus;
}

const VALID_SIZES = { roro: ['std'], lorry: ['small', 'cargoarm'] } as const;
const DEFAULT_SIZE = { roro: 'std', lorry: 'cargoarm' } as const;

function tomorrowIso(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

function defaultForm(): FormState {
  return {
    service: 'roro',
    size: 'std',
    waste: 'general',
    name: '',
    phone: '',
    address: '',
    city: '',
    state: 'Sabah',
    date: tomorrowIso(),
    window: 'flex',
    days: 1,
    notes: '',
    status: 'confirmed', // admin took the call → start confirmed
    payment: 'unpaid', // collect transfer later (most common)
  };
}

export function QuickAddDrawer({ onClose, onCreated }: Props) {
  const [form, setForm] = useState<FormState>(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync size when service changes (different valid sizes per service)
  useEffect(() => {
    setForm((f) => {
      const validSizes: readonly string[] = VALID_SIZES[f.service];
      return validSizes.includes(f.size) ? f : { ...f, size: DEFAULT_SIZE[f.service] };
    });
  }, [form.service]);

  // Esc to close
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !submitting) onClose();
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [onClose, submitting]);

  const priceResult = useMemo(
    () =>
      computeBookingPrice({
        service: form.service,
        size: form.size,
        city: form.city,
        days: form.days,
      }),
    [form.service, form.size, form.city, form.days],
  );

  const sizes: readonly string[] = VALID_SIZES[form.service];
  const sizeLabels = form.service === 'roro' ? GT_SIZE_LABELS.roro : GT_SIZE_LABELS.lorry;
  const sizeLabelFor = (s: string) =>
    form.service === 'roro'
      ? GT_SIZE_LABELS.roro[s as RoroSize] ?? s
      : GT_SIZE_LABELS.lorry[s as LorrySize] ?? s;

  const isValid =
    form.name.trim().length > 0 &&
    /^[\d\s+\-]{8,}$/.test(form.phone) &&
    form.address.trim().length > 0 &&
    form.city.trim().length > 0 &&
    form.state.trim().length > 0 &&
    /^\d{4}-\d{2}-\d{2}$/.test(form.date);

  async function submit() {
    if (!isValid) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          country: GT_COUNTRY,
          service: form.service,
          size: form.size,
          waste: form.waste,
          date: form.date,
          window: form.window,
          days: form.service === 'lorry' ? form.days : 1,
          notes: form.notes.trim(),
          status: form.status,
          payment: form.payment,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? 'Something went wrong');
        setSubmitting(false);
        return;
      }
      const created: BookingDTO = {
        id: data.id,
        customer: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        service: form.service,
        size: form.size,
        waste: form.waste,
        date: form.date,
        window: form.window,
        days: form.service === 'lorry' ? form.days : 1,
        notes: form.notes.trim(),
        total: priceResult.total,
        needsQuote: priceResult.needsQuote,
        status: form.status,
        payment: form.payment,
        proofUrl: null,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      onCreated(created);
    } catch (e) {
      setError('Network error — try again');
      setSubmitting(false);
    }
  }

  return (
    <Fragment>
      <div className="gt-drawer-back" onClick={() => !submitting && onClose()} />
      <aside className="gt-drawer" aria-label="Quick add booking">
        {/* Header */}
        <div className="px-5 py-4 border-b border-line flex items-center gap-3">
          <button
            onClick={onClose}
            disabled={submitting}
            aria-label="Close"
            className="bg-transparent border-0 cursor-pointer p-1 text-ink-3 hover:text-ink disabled:opacity-40"
          >
            <Icon name="x" size={18} />
          </button>
          <div className="flex-1 min-w-0">
            <div className="font-mono text-[11px] text-ink-3 uppercase tracking-[0.14em]">
              Admin · new entry
            </div>
            <div className="text-[17px] font-bold tracking-[-0.01em]">Quick add booking</div>
          </div>
          <span className="hidden md:inline-flex items-center gap-1 font-mono text-[10.5px] text-ink-3 px-2 py-1 rounded border border-line bg-bg-2">
            <kbd className="font-mono">Esc</kbd> close
          </span>
        </div>

        {/* Body */}
        <div className="gt-scroll flex-1 overflow-auto p-5 flex flex-col gap-5">
          {/* Service */}
          <Section title="Service">
            <div className="grid grid-cols-2 gap-2">
              {(['roro', 'lorry'] as const).map((s) => (
                <ServicePick
                  key={s}
                  active={form.service === s}
                  onClick={() => setForm((f) => ({ ...f, service: s }))}
                  icon={s === 'roro' ? 'box' : 'truck'}
                  title={s === 'roro' ? 'Roll-off bin' : 'Lorry Delta'}
                  sub={s === 'roro' ? 'Skip — drop & leave' : 'Day rental w/ driver'}
                />
              ))}
            </div>
          </Section>

          {/* Customer */}
          <Section title="Customer">
            <div className="flex flex-col gap-3">
              <Field label="Name">
                <Input
                  autoFocus
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Tan Beng Hock"
                />
              </Field>
              <Field label="Phone" sub="Malaysian mobile; used for WhatsApp">
                <Input
                  type="tel"
                  inputMode="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="+60 12 345 6789"
                />
              </Field>
              <Field label="Street address">
                <Textarea
                  rows={2}
                  value={form.address}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                  placeholder="Lot / building / street — drop-off or pickup"
                />
              </Field>
              <div className="grid grid-cols-3 gap-2">
                <Field label="City / town">
                  <Input
                    value={form.city}
                    onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                    placeholder="e.g. Kota Kinabalu"
                  />
                </Field>
                <Field label="State">
                  <Input
                    value={form.state}
                    onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
                    placeholder="e.g. Sabah"
                  />
                </Field>
                <Field label="Country">
                  <Input value={GT_COUNTRY} disabled readOnly />
                </Field>
              </div>
            </div>
          </Section>

          {/* Service details */}
          <Section title="Service details">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Size">
                <Select
                  value={form.size}
                  onChange={(e) => setForm((f) => ({ ...f, size: e.target.value }))}
                >
                  {sizes.map((s) => (
                    <option key={s} value={s}>
                      {sizeLabelFor(s)}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Waste type">
                <Select
                  value={form.waste}
                  onChange={(e) => setForm((f) => ({ ...f, waste: e.target.value as WasteType }))}
                >
                  {GT_WASTE.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.label}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Date">
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                />
              </Field>
              <Field label="Window">
                <Select
                  value={form.window}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, window: e.target.value as BookingWindow }))
                  }
                >
                  {GT_WINDOWS.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.label}
                    </option>
                  ))}
                </Select>
              </Field>
              {form.service === 'lorry' && (
                <Field label="Days" sub="Lorry rental duration" style={{ gridColumn: 'span 2' }}>
                  <Input
                    type="number"
                    min={1}
                    max={60}
                    value={form.days}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        days: Math.max(1, parseInt(e.target.value, 10) || 1),
                      }))
                    }
                  />
                </Field>
              )}
            </div>
            <Field label="Notes" sub="Site instructions, gate codes, contractor refs">
              <Textarea
                rows={2}
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder="e.g. Leave at gate · ring bell · contractor Ahmad onsite"
              />
            </Field>
          </Section>

          {/* Admin-only block */}
          <Section
            title="Admin overrides"
            hint="Defaults: phone bookings start confirmed, transfer due later"
          >
            <div className="flex flex-col gap-3">
              <Field label="Status">
                <div className="grid grid-cols-3 gap-1.5">
                  {(['pending', 'confirmed', 'completed'] as const).map((s) => (
                    <ToggleBtn
                      key={s}
                      active={form.status === s}
                      onClick={() => setForm((f) => ({ ...f, status: s }))}
                    >
                      {s}
                    </ToggleBtn>
                  ))}
                </div>
              </Field>
              <Field label="Payment">
                <div className="grid grid-cols-3 gap-1.5">
                  {(['unpaid', 'review', 'paid'] as const).map((p) => (
                    <ToggleBtn
                      key={p}
                      active={form.payment === p}
                      onClick={() => setForm((f) => ({ ...f, payment: p }))}
                    >
                      {p}
                    </ToggleBtn>
                  ))}
                </div>
              </Field>
            </div>
          </Section>

          {/* Total */}
          <div className="rounded-xl border border-accent-soft-2 bg-accent-soft px-4 py-3.5 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-accent-2 font-semibold">
                {priceResult.needsQuote ? 'Outstation' : 'Estimated total'}
              </span>
              <span className="text-[11.5px] text-ink-2">
                {form.service === 'lorry'
                  ? `${sizeLabelFor(form.size)} × ${form.days} day${form.days > 1 ? 's' : ''}`
                  : sizeLabelFor(form.size)}
                {!priceResult.needsQuote && ` · ${priceResult.zone === 'kk' ? 'Kota Kinabalu' : 'Penampang'}`}
              </span>
            </div>
            {priceResult.needsQuote ? (
              <span className="text-[15px] font-bold tracking-[-0.01em] text-amber text-right">
                Quote pending<br />
                <span className="font-normal text-[10.5px] text-ink-3 normal-case">
                  {GT_WHATSAPP_NAME} confirms via WhatsApp
                </span>
              </span>
            ) : (
              <span className="font-mono text-[24px] font-bold tabular-nums text-ink tracking-[-0.02em]">
                {gtFormatMoney(priceResult.total)}
              </span>
            )}
          </div>

          {error && (
            <div className="rounded-lg border border-warn bg-warn-soft text-warn text-[13px] px-3.5 py-2.5 flex items-start gap-2">
              <Icon name="x" size={14} color="var(--gt-warn)" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-line flex gap-2 bg-surface-2">
          <Btn variant="ghost" size="sm" onClick={onClose} disabled={submitting}>
            Cancel
          </Btn>
          <div className="flex-1" />
          <Btn
            variant="primary"
            size="sm"
            onClick={submit}
            disabled={!isValid || submitting}
          >
            {submitting ? (
              <>Creating…</>
            ) : (
              <>
                <Icon name="check" size={13} /> Create booking
              </>
            )}
          </Btn>
        </div>
      </aside>
    </Fragment>
  );
}

/* ---------- Local UI primitives ---------- */

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-2.5">
      <div className="flex items-baseline justify-between gap-2 border-b border-line pb-1">
        <h3 className="m-0 text-[11px] font-bold text-ink-2 uppercase tracking-[0.14em]">{title}</h3>
        {hint && <span className="text-[11px] text-ink-3 leading-tight max-w-[60%] text-right">{hint}</span>}
      </div>
      {children}
    </section>
  );
}

function ServicePick({
  active,
  onClick,
  icon,
  title,
  sub,
}: {
  active: boolean;
  onClick: () => void;
  icon: 'box' | 'truck';
  title: string;
  sub: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left rounded-lg p-3 flex items-start gap-2.5 transition-colors"
      style={{
        background: active ? 'var(--gt-accent-soft)' : 'var(--gt-surface)',
        border: '1.5px solid ' + (active ? 'var(--gt-accent)' : 'var(--gt-line-2)'),
      }}
    >
      <span
        className="shrink-0 w-8 h-8 rounded-md flex items-center justify-center"
        style={{
          background: active ? 'var(--gt-accent)' : 'var(--gt-bg-2)',
          color: active ? 'white' : 'var(--gt-ink-2)',
        }}
      >
        <Icon name={icon} size={16} />
      </span>
      <span className="flex flex-col min-w-0">
        <span
          className="text-[13.5px] font-semibold"
          style={{ color: active ? 'var(--gt-accent-2)' : 'var(--gt-ink)' }}
        >
          {title}
        </span>
        <span className="text-[11.5px] text-ink-3 leading-tight">{sub}</span>
      </span>
    </button>
  );
}

function ToggleBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-md py-2 text-[12px] font-medium capitalize transition-colors"
      style={{
        background: active ? 'var(--gt-ink)' : 'var(--gt-surface)',
        color: active ? 'white' : 'var(--gt-ink-2)',
        border: '1px solid ' + (active ? 'var(--gt-ink)' : 'var(--gt-line-2)'),
      }}
    >
      {children}
    </button>
  );
}
