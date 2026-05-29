'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CustomerHeader } from './Header';
import { Btn } from '../ui/Btn';
import { Field, Input, Select, Textarea } from '../ui/Field';
import { Icon } from '../ui/Icon';
import { Pill } from '../ui/Pill';
import { Segment } from '../ui/Segment';
import { PickCards } from '../ui/PickCards';
import Image from 'next/image';
import {
  BookingWindow,
  GT_PRICES,
  GT_SIZE_LABELS,
  GT_WASTE,
  GT_WINDOWS,
  Service,
  WasteType,
} from '@/lib/constants';
import { gtFormatMoney } from '@/lib/format';

interface Props {
  initialService: Service | null;
  blockedDates: Set<string>;
}

interface FormState {
  service: Service;
  size: string;
  waste: WasteType;
  name: string;
  phone: string;
  address: string;
  date: string;
  window: BookingWindow;
  days: number;
  notes: string;
}

const RORO_SIZES = ['10yd', '20yd', '40yd'];
const LORRY_SIZES = ['1T', '3T', '5T'];

export function BookingForm({ initialService, blockedDates }: Props) {
  const router = useRouter();
  const [chosenService, setChosenService] = useState<Service | null>(initialService);

  if (!chosenService) {
    return <ServicePickerStep onPick={setChosenService} />;
  }

  return (
    <BookingFormInner
      service={chosenService}
      onChangeService={setChosenService}
      blockedDates={blockedDates}
      router={router}
    />
  );
}

// ───── Step 1 — service picker (when no service chosen) ─────
function ServicePickerStep({ onPick }: { onPick: (s: Service) => void }) {
  const router = useRouter();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <CustomerHeader />
      <div className="gt-page gt-scroll">
        <div className="max-w-[720px] mx-auto px-4 md:px-6 pt-6 md:pt-7 pb-12 md:pb-[60px]">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <button
              onClick={() => router.push('/')}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--gt-ink-3)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 13,
                padding: 0,
              }}
            >
              <Icon name="arrow-l" size={14} /> Back to home
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
            <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, letterSpacing: '-0.01em' }}>
              Which service do you need?
            </h1>
            <span
              className="gt-mono"
              style={{ fontSize: 12, color: 'var(--gt-ink-3)', fontWeight: 600 }}
            >
              Step 1 of 2
            </span>
          </div>
          <p className="gt-section-sub" style={{ marginTop: 0, marginBottom: 24 }}>
            Pick one to start your booking — you can change this later.
          </p>

          <div className="gt-fade-in grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <button
              type="button"
              onClick={() => onPick('roro')}
              className="gt-card gt-svc-tile"
              style={{
                padding: 22,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                textAlign: 'left',
                cursor: 'pointer',
                fontFamily: 'inherit',
                color: 'inherit',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: 160,
                  borderRadius: 'var(--gt-radius-sm)',
                  overflow: 'hidden',
                  background: 'var(--gt-bg-2)',
                }}
              >
                <Image
                  src="/roro.png"
                  alt="Roll-on/Roll-off bin"
                  width={600}
                  height={450}
                  className="gt-svc-img"
                  sizes="(max-width: 767px) 100vw, 320px"
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon name="box" size={20} color="var(--gt-accent)" />
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Roll-on/Roll-off Bin</h3>
              </div>
              <div style={{ fontSize: 13, color: 'var(--gt-ink-3)', lineHeight: 1.5 }}>
                Drop-and-leave construction skip. We deliver, you fill, we collect.
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <Pill>8 m³</Pill>
                <Pill>15 m³</Pill>
                <Pill>30 m³</Pill>
              </div>
              <div
                style={{
                  fontFamily: 'var(--gt-mono)',
                  fontSize: 13,
                  color: 'var(--gt-ink-2)',
                  marginTop: 'auto',
                }}
              >
                from RM 850
              </div>
            </button>

            <button
              type="button"
              onClick={() => onPick('lorry')}
              className="gt-card gt-svc-tile"
              style={{
                padding: 22,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                textAlign: 'left',
                cursor: 'pointer',
                fontFamily: 'inherit',
                color: 'inherit',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: 160,
                  borderRadius: 'var(--gt-radius-sm)',
                  overflow: 'hidden',
                  background: 'var(--gt-bg-2)',
                }}
              >
                <Image
                  src="/lorry.png"
                  alt="Lorry Delta"
                  width={600}
                  height={450}
                  className="gt-svc-img"
                  sizes="(max-width: 767px) 100vw, 320px"
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon name="truck" size={20} color="var(--gt-accent)" />
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Lorry Delta</h3>
              </div>
              <div style={{ fontSize: 13, color: 'var(--gt-ink-3)', lineHeight: 1.5 }}>
                Daily lorry rental with driver. Pickup, moving, transport.
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <Pill>1 tonne</Pill>
                <Pill>3 tonnes</Pill>
                <Pill>5 tonnes</Pill>
              </div>
              <div
                style={{
                  fontFamily: 'var(--gt-mono)',
                  fontSize: 13,
                  color: 'var(--gt-ink-2)',
                  marginTop: 'auto',
                }}
              >
                from RM 380 / day
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ───── Step 2 — the full booking form ─────
function BookingFormInner({
  service,
  onChangeService,
  blockedDates,
  router,
}: {
  service: Service;
  onChangeService: (s: Service | null) => void;
  blockedDates: Set<string>;
  router: ReturnType<typeof useRouter>;
}) {
  const [form, setForm] = useState<FormState>({
    service,
    size: service === 'lorry' ? '3T' : '20yd',
    waste: 'construction',
    name: '',
    phone: '',
    address: '',
    date: '',
    window: 'am',
    days: 1,
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    if (form.service === 'roro' && !RORO_SIZES.includes(form.size)) update('size', '20yd');
    if (form.service === 'lorry' && !LORRY_SIZES.includes(form.size)) update('size', '3T');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.service]);

  const sizeOptions = useMemo(() => {
    return form.service === 'roro'
      ? [
          { id: '10yd', label: '8 m³', sub: 'RM 850' },
          { id: '20yd', label: '15 m³', sub: 'RM 1,250' },
          { id: '40yd', label: '30 m³', sub: 'RM 1,850' },
        ]
      : [
          { id: '1T', label: '1 tonne', sub: 'RM 380/day' },
          { id: '3T', label: '3 tonnes', sub: 'RM 580/day' },
          { id: '5T', label: '5 tonnes', sub: 'RM 780/day' },
        ];
  }, [form.service]);

  const baseRate = (GT_PRICES[form.service] as Record<string, number>)[form.size] ?? 0;
  const total = form.service === 'lorry' ? baseRate * (form.days || 1) : baseRate;

  const minDate = '2026-05-30';
  const dateBlocked = !!form.date && blockedDates.has(form.date);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.phone.trim()) e.phone = 'Required';
    else if (!/^[\d\s+\-]{8,}$/.test(form.phone)) e.phone = 'Looks too short';
    if (!form.address.trim()) e.address = 'Required';
    if (!form.date) e.date = 'Pick a date';
    else if (dateBlocked) e.date = 'Not available — pick another day';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, total }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Failed to create booking');
      }
      const { id } = await res.json();
      router.push(`/confirmation/${id}`);
    } catch (err) {
      setSubmitError((err as Error).message);
      setSubmitting(false);
    }
  };

  const serviceLabel =
    form.service === 'roro' ? 'Roll-off · ' + form.size : 'Lorry · ' + form.size;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <CustomerHeader />
      <div className="gt-page gt-scroll">
        <div className="max-w-[720px] mx-auto px-4 md:px-6 pt-6 md:pt-7 pb-12 md:pb-[60px]">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <button
              onClick={() => onChangeService(null)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--gt-ink-3)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 13,
                padding: 0,
              }}
            >
              <Icon name="arrow-l" size={14} /> Change service
            </button>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              marginBottom: 4,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, letterSpacing: '-0.01em' }}>
                Booking details
              </h1>
              <span
                className="gt-mono"
                style={{ fontSize: 12, color: 'var(--gt-ink-3)', fontWeight: 600 }}
              >
                Step 2 of 2
              </span>
            </div>
            <Pill tone="accent" dot>
              {serviceLabel}
            </Pill>
          </div>
          <p className="gt-section-sub" style={{ marginTop: 0, marginBottom: 24 }}>
            Fill once, no account needed.
          </p>

          <form
            onSubmit={submit}
            className="gt-fade-in"
            style={{ display: 'flex', flexDirection: 'column', gap: 22 }}
          >
            <div
              className="gt-card"
              style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}
            >
              <SectionHead n="①" title="Contact" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field label="Full name" error={errors.name}>
                  <Input
                    placeholder="e.g. Ahmad Faizal"
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                  />
                </Field>
                <Field
                  label="Phone (WhatsApp)"
                  error={errors.phone}
                  sub="We'll only call about your booking."
                >
                  <Input
                    placeholder="+60 14 557 5208"
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
                  />
                </Field>
              </div>
            </div>

            <div
              className="gt-card"
              style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}
            >
              <SectionHead n="②" title="Service" />
              <Field label="What do you need?">
                <Segment
                  value={form.service}
                  options={[
                    { id: 'roro', label: 'Roll-on/Roll-off Bin', sub: 'Construction skip' },
                    { id: 'lorry', label: 'Lorry Delta', sub: 'Daily rental' },
                  ]}
                  onChange={(v) => update('service', v as Service)}
                />
              </Field>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field label={form.service === 'roro' ? 'Bin size' : 'Lorry size'}>
                  <Segment value={form.size} options={sizeOptions} onChange={(v) => update('size', v)} />
                </Field>
                <Field label="Waste type">
                  <PickCards
                    value={form.waste}
                    options={GT_WASTE}
                    onChange={(v) => update('waste', v as WasteType)}
                    columns={1}
                  />
                </Field>
              </div>
              {form.service === 'lorry' && (
                <Field label="How many days?">
                  <Segment
                    value={String(form.days)}
                    options={[
                      { id: '1', label: '1 day' },
                      { id: '2', label: '2 days' },
                      { id: '3', label: '3 days' },
                      { id: '7', label: '1 week' },
                    ]}
                    onChange={(v) => update('days', parseInt(v, 10))}
                  />
                </Field>
              )}
            </div>

            <div
              className="gt-card"
              style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}
            >
              <SectionHead n="③" title="Delivery" />
              <Field
                label="Delivery address"
                error={errors.address}
                sub="Include landmarks, gate codes, or access notes."
              >
                <Textarea
                  rows={2}
                  placeholder="e.g. Lot 23, Jln Tuaran, 88450 Inanam, Kota Kinabalu, Sabah"
                  value={form.address}
                  onChange={(e) => update('address', e.target.value)}
                />
              </Field>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field
                  label="Service date"
                  error={errors.date}
                  sub={dateBlocked ? '' : 'Sundays unavailable.'}
                >
                  <Input
                    type="date"
                    min={minDate}
                    value={form.date}
                    onChange={(e) => update('date', e.target.value)}
                  />
                </Field>
                <Field label="Preferred window">
                  <Select
                    value={form.window}
                    onChange={(e) => update('window', e.target.value as BookingWindow)}
                  >
                    {GT_WINDOWS.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.label}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>
              <Field label="Notes for our team (optional)">
                <Textarea
                  rows={2}
                  placeholder="Gate code, side lane, when's a good time to call…"
                  value={form.notes}
                  onChange={(e) => update('notes', e.target.value)}
                />
              </Field>
            </div>

            <div className="gt-card gt-card--accent p-4 md:p-[18px] flex flex-col md:flex-row md:items-center gap-3 md:gap-3.5">
              <div className="flex-1">
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: 'var(--gt-accent-2)',
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                  }}
                >
                  Total
                </div>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                    color: 'var(--gt-accent-2)',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {gtFormatMoney(total)}
                </div>
                <div style={{ fontSize: 12, color: 'var(--gt-ink-3)' }}>
                  {form.service === 'roro'
                    ? `${
                        GT_SIZE_LABELS.roro[form.size as keyof typeof GT_SIZE_LABELS.roro]
                      } Roll-off · delivery & collection included`
                    : `${
                        GT_SIZE_LABELS.lorry[form.size as keyof typeof GT_SIZE_LABELS.lorry]
                      } lorry × ${form.days} day${form.days > 1 ? 's' : ''} · driver included`}
                </div>
              </div>
              <div className="w-full md:w-auto [&>button]:w-full md:[&>button]:w-auto">
                <Btn variant="primary" size="lg" type="submit" disabled={submitting}>
                  {submitting ? 'Submitting…' : 'Continue'} <Icon name="arrow-r" />
                </Btn>
              </div>
            </div>

            {submitError && (
              <div style={{ fontSize: 13, color: 'var(--gt-warn)' }}>{submitError}</div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

function SectionHead({ n, title }: { n: string; title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
      <span style={{ fontFamily: 'var(--gt-mono)', fontSize: 13, color: 'var(--gt-accent)', fontWeight: 600 }}>
        {n}
      </span>
      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{title}</h3>
    </div>
  );
}
