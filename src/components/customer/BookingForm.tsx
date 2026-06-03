'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CustomerHeader } from './Header';
import { Btn } from '../ui/Btn';
import { Field, Input, Select, Textarea } from '../ui/Field';
import { Icon } from '../ui/Icon';
import { Pill } from '../ui/Pill';
import { Segment } from '../ui/Segment';
import { PickCards } from '../ui/PickCards';
import {
  GT_COUNTRY,
  GT_LORRY_DAY_RATE,
  GT_RORO_DIMENSIONS_FT,
  GT_RORO_FLEET_SIZE,
  GT_SIZE_LABELS,
  GT_WASTE,
  GT_WHATSAPP_NAME,
  GT_WINDOWS,
  LorrySize,
  Service,
} from '@/lib/constants';
import { bookingFormSchema, BookingFormValues } from '@/lib/booking-schema';
import { computeBookingPrice, isCityEntered, quoteWhatsAppUrl } from '@/lib/pricing';
import { gtFormatMoney } from '@/lib/format';

interface Props {
  initialService: Service | null;
  blockedDates: Set<string>;
}

const RORO_SIZES = ['std'] as const;
const LORRY_SIZES: LorrySize[] = ['small', 'cargoarm'];

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
  const { w, h, l } = GT_RORO_DIMENSIONS_FT;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <CustomerHeader />
      <div className="gt-page gt-scroll">
        <div className="max-w-[720px] mx-auto px-4 md:px-6 pt-6 md:pt-7 pb-12 md:pb-[60px]">
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => router.push('/')}
              className="bg-transparent border-0 text-ink-3 cursor-pointer inline-flex items-center gap-1 text-[13px] p-0"
            >
              <Icon name="arrow-l" size={14} /> Back to home
            </button>
          </div>

          <div className="flex items-baseline gap-2.5 mb-1">
            <h1 className="text-[28px] font-bold m-0 tracking-[-0.01em]">
              Which service do you need?
            </h1>
            <span className="gt-mono text-xs text-ink-3 font-semibold">Step 1 of 2</span>
          </div>
          <p className="gt-section-sub mt-0 mb-6">
            Pick one to start your booking — you can change this later.
          </p>

          <div className="gt-fade-in grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Roro card */}
            <button
              type="button"
              onClick={() => onPick('roro')}
              className="gt-card gt-svc-tile p-5 flex flex-col gap-3 text-left cursor-pointer text-inherit"
            >
              <div className="w-full h-40 rounded-gt-sm overflow-hidden bg-bg-2">
                <Image
                  src="/roro.png"
                  alt="Roll-on/Roll-off bin"
                  width={600}
                  height={450}
                  className="gt-svc-img"
                  sizes="(max-width: 767px) 100vw, 320px"
                />
              </div>
              <div className="flex items-center gap-2">
                <Icon name="box" size={20} color="var(--gt-accent)" />
                <h3 className="m-0 text-[18px] font-bold">Roll-on/Roll-off Bin</h3>
              </div>
              <div className="text-[13px] text-ink-3 leading-relaxed">
                Drop-and-leave construction skip. We deliver, you fill, we collect.
              </div>
              <div className="flex gap-1.5 flex-wrap">
                <Pill>~5 m³</Pill>
                <Pill>{w} × {h} × {l} ft</Pill>
                <Pill tone="amber">{GT_RORO_FLEET_SIZE} in fleet</Pill>
              </div>
              <div className="font-mono text-[12.5px] text-ink-2 mt-auto flex flex-col gap-0.5">
                <span>Kota Kinabalu <span className="text-ink font-semibold">RM 350</span></span>
                <span>Penampang <span className="text-ink font-semibold">RM 300</span></span>
                <span className="text-[11px] text-ink-3 normal-case">Outstation → quote</span>
              </div>
            </button>

            {/* Lorry card */}
            <button
              type="button"
              onClick={() => onPick('lorry')}
              className="gt-card gt-svc-tile p-5 flex flex-col gap-3 text-left cursor-pointer text-inherit"
            >
              <div className="w-full h-40 rounded-gt-sm overflow-hidden bg-bg-2">
                <Image
                  src="/lorry.png"
                  alt="Lorry Delta"
                  width={600}
                  height={450}
                  className="gt-svc-img"
                  sizes="(max-width: 767px) 100vw, 320px"
                />
              </div>
              <div className="flex items-center gap-2">
                <Icon name="truck" size={20} color="var(--gt-accent)" />
                <h3 className="m-0 text-[18px] font-bold">Lorry Delta</h3>
              </div>
              <div className="text-[13px] text-ink-3 leading-relaxed">
                Daily lorry rental with driver. Pickup, moving, transport.
              </div>
              <div className="flex gap-1.5 flex-wrap">
                <Pill>1.5 tonne</Pill>
                <Pill>3 tonne</Pill>
              </div>
              <div className="font-mono text-[12.5px] text-ink-2 mt-auto flex flex-col gap-0.5">
                <span>Small 1.5 t <span className="text-ink font-semibold">RM 500 / day</span></span>
                <span>Cargo arm 3 t <span className="text-ink font-semibold">RM 700 / day</span></span>
                <span className="text-[11px] text-ink-3 normal-case">KK zone · outstation → quote</span>
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
  const [submitError, setSubmitError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    mode: 'onTouched',
    defaultValues: {
      service,
      size: service === 'lorry' ? 'cargoarm' : 'std',
      waste: 'construction',
      name: '',
      phone: '',
      address: '',
      city: '',
      state: 'Sabah',
      date: '',
      window: 'am',
      days: 1,
      notes: '',
    },
  });

  // Reactive form snapshot — drives pricing + label conditionals
  const values = watch();
  const { service: curService, size: curSize, city: curCity, state: curState, date: curDate, days: curDays } = values;

  // Realign size when service changes (different valid sizes per service)
  useEffect(() => {
    if (curService === 'roro' && !RORO_SIZES.includes(curSize as 'std')) {
      setValue('size', 'std', { shouldValidate: false });
    }
    if (curService === 'lorry' && !LORRY_SIZES.includes(curSize as LorrySize)) {
      setValue('size', 'cargoarm', { shouldValidate: false });
    }
  }, [curService, curSize, setValue]);

  // Date availability check (runtime, not Zod since blockedDates is dynamic)
  const dateBlocked = !!curDate && blockedDates.has(curDate);
  useEffect(() => {
    if (dateBlocked) {
      setError('date', { type: 'blocked', message: 'Not available — pick another day' });
    } else if (errors.date?.type === 'blocked') {
      clearErrors('date');
    }
  }, [dateBlocked, errors.date?.type, setError, clearErrors]);

  const lorrySizeOptions = useMemo(
    () => [
      { id: 'small', label: 'Small lorry', sub: '1.5 tonne · RM ' + GT_LORRY_DAY_RATE.small + '/day' },
      {
        id: 'cargoarm',
        label: 'Cargo arm lorry',
        sub: '3 tonne · RM ' + GT_LORRY_DAY_RATE.cargoarm + '/day',
      },
    ],
    [],
  );

  const cityEntered = isCityEntered(curCity);
  const { total, zone, needsQuote } = computeBookingPrice({
    service: curService,
    size: curSize,
    city: curCity,
    days: curDays,
  });
  const isOutstationQuote = cityEntered && needsQuote;

  const minDate = '2026-05-31';

  const onValid = async (data: BookingFormValues) => {
    if (blockedDates.has(data.date)) {
      setError('date', { type: 'blocked', message: 'Not available — pick another day' });
      return;
    }
    setSubmitError('');
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, country: GT_COUNTRY }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Failed to create booking');
      }
      const { id } = await res.json();
      router.push(`/confirmation/${id}`);
    } catch (err) {
      setSubmitError((err as Error).message);
    }
  };

  const sizeLabel =
    curService === 'roro'
      ? GT_SIZE_LABELS.roro.std
      : GT_SIZE_LABELS.lorry[curSize as LorrySize];

  const headerPillText =
    curService === 'roro' ? 'Roll-off · 5 m³' : 'Lorry · ' + (curSize === 'small' ? '1.5 t' : '3 t');

  const whatsappHref = quoteWhatsAppUrl({
    service: curService,
    size: curSize,
    city: curCity,
    state: curState,
    date: curDate,
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <CustomerHeader />
      <div className="gt-page gt-scroll">
        <div className="max-w-[720px] mx-auto px-4 md:px-6 pt-6 md:pt-7 pb-12 md:pb-[60px]">
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => onChangeService(null)}
              className="bg-transparent border-0 text-ink-3 cursor-pointer inline-flex items-center gap-1 text-[13px] p-0"
            >
              <Icon name="arrow-l" size={14} /> Change service
            </button>
          </div>

          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
            <div className="flex items-baseline gap-2.5">
              <h1 className="text-[28px] font-bold m-0 tracking-[-0.01em]">Booking details</h1>
              <span className="gt-mono text-xs text-ink-3 font-semibold">Step 2 of 2</span>
            </div>
            <Pill tone="accent" dot>
              {headerPillText}
            </Pill>
          </div>
          <p className="gt-section-sub mt-0 mb-6">Fill once, no account needed.</p>

          <form onSubmit={handleSubmit(onValid)} className="gt-fade-in flex flex-col gap-[22px]">
            {/* Contact */}
            <div className="gt-card p-5 flex flex-col gap-3.5">
              <SectionHead n="①" title="Contact" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field label="Full name" error={errors.name?.message}>
                  <Input placeholder="e.g. Ahmad Faizal" {...register('name')} />
                </Field>
                <Field
                  label="Phone (WhatsApp)"
                  error={errors.phone?.message}
                  sub="We'll only call about your booking."
                >
                  <Input placeholder="+60 14 557 5208" {...register('phone')} />
                </Field>
              </div>
            </div>

            {/* Service */}
            <div className="gt-card p-5 flex flex-col gap-3.5">
              <SectionHead n="②" title="Service" />
              <Field label="What do you need?">
                <Controller
                  control={control}
                  name="service"
                  render={({ field }) => (
                    <Segment
                      value={field.value}
                      options={[
                        { id: 'roro', label: 'Roll-on/Roll-off Bin', sub: '~5 m³ skip' },
                        { id: 'lorry', label: 'Lorry Delta', sub: 'Daily rental' },
                      ]}
                      onChange={(v) => field.onChange(v as Service)}
                    />
                  )}
                />
              </Field>

              {curService === 'roro' ? (
                <div className="gt-card gt-card--soft p-3.5 flex items-start gap-3">
                  <Icon name="box" size={18} color="var(--gt-accent)" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold">
                      Standard skip · {GT_RORO_DIMENSIONS_FT.w} × {GT_RORO_DIMENSIONS_FT.h} × {GT_RORO_DIMENSIONS_FT.l} ft (~5 m³)
                    </div>
                    <div className="text-xs text-ink-3 mt-0.5">
                      One size only · {GT_RORO_FLEET_SIZE} units in fleet · delivery & collection included.
                    </div>
                  </div>
                </div>
              ) : (
                <Field label="Lorry size">
                  <Controller
                    control={control}
                    name="size"
                    render={({ field }) => (
                      <Segment value={field.value} options={lorrySizeOptions} onChange={field.onChange} />
                    )}
                  />
                </Field>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field label="Waste type">
                  <Controller
                    control={control}
                    name="waste"
                    render={({ field }) => (
                      <PickCards
                        value={field.value}
                        options={GT_WASTE}
                        onChange={field.onChange}
                        columns={1}
                      />
                    )}
                  />
                </Field>
                {curService === 'lorry' ? (
                  <Field label="How many days?">
                    <Controller
                      control={control}
                      name="days"
                      render={({ field }) => (
                        <Segment
                          value={String(field.value)}
                          options={[
                            { id: '1', label: '1 day' },
                            { id: '2', label: '2 days' },
                            { id: '3', label: '3 days' },
                            { id: '7', label: '1 week' },
                          ]}
                          onChange={(v) => field.onChange(parseInt(v, 10))}
                        />
                      )}
                    />
                  </Field>
                ) : (
                  <div />
                )}
              </div>
            </div>

            {/* Delivery */}
            <div className="gt-card p-5 flex flex-col gap-3.5">
              <SectionHead n="③" title="Delivery" />
              <Field
                label="Street address"
                error={errors.address?.message}
                sub="Building, lot, street — landmarks and access notes welcome."
              >
                <Textarea
                  rows={2}
                  placeholder="e.g. Lot 23, Jln Tuaran, 88450 Inanam"
                  {...register('address')}
                />
              </Field>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Field
                  label="City / town"
                  error={errors.city?.message}
                  sub={
                    curCity
                      ? zone === 'kk'
                        ? 'Kota Kinabalu — standard pricing'
                        : zone === 'penampang'
                          ? 'Penampang — standard pricing'
                          : `Outstation — needs ${GT_WHATSAPP_NAME}'s quote`
                      : 'KK or Penampang have published rates.'
                  }
                >
                  <Input placeholder="e.g. Kota Kinabalu" {...register('city')} />
                </Field>
                <Field label="State" error={errors.state?.message}>
                  <Input placeholder="e.g. Sabah" {...register('state')} />
                </Field>
                <Field label="Country">
                  <Input value={GT_COUNTRY} disabled readOnly />
                </Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field
                  label="Service date"
                  error={errors.date?.message}
                  sub={dateBlocked ? '' : 'Sundays unavailable.'}
                >
                  <Input type="date" min={minDate} {...register('date')} />
                </Field>
                <Field label="Preferred window">
                  <Select {...register('window')}>
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
                  {...register('notes')}
                />
              </Field>
            </div>

            {/* Total / quote bar */}
            {!cityEntered ? (
              <div className="gt-card gt-card--soft p-4 md:p-[18px] flex flex-col md:flex-row md:items-center gap-3 md:gap-3.5">
                <div className="flex-1">
                  <div className="text-[11px] font-semibold text-ink-3 uppercase tracking-widest">
                    Total
                  </div>
                  <div className="text-[20px] font-semibold text-ink-3 tracking-[-0.01em]">
                    Enter your city to see pricing
                  </div>
                  <div className="text-xs text-ink-3">
                    Standard rates available for Kota Kinabalu and Penampang. Other locations are
                    quote-on-request.
                  </div>
                </div>
                <div className="w-full md:w-auto [&>button]:w-full md:[&>button]:w-auto">
                  <Btn variant="primary" size="lg" type="submit" disabled>
                    Continue <Icon name="arrow-r" />
                  </Btn>
                </div>
              </div>
            ) : isOutstationQuote ? (
              <div className="gt-card gt-card--accent p-4 md:p-[18px] flex flex-col gap-3">
                <div className="flex items-center gap-2.5">
                  <Pill tone="amber" dot>
                    Outstation
                  </Pill>
                  <span className="text-[13px] font-semibold text-accent-2">Quote on request</span>
                </div>
                <div className="text-[13px] text-ink-2 leading-relaxed">
                  We don&apos;t have a published rate for{' '}
                  <span className="font-semibold">{curCity.trim()}</span>.
                  Message {GT_WHATSAPP_NAME} on WhatsApp for a quote, or submit your request and we&apos;ll
                  follow up to confirm.
                </div>
                <div className="flex flex-col md:flex-row gap-2">
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gt-btn gt-btn--full md:!w-auto"
                  >
                    <Icon name="phone" size={14} /> Message {GT_WHATSAPP_NAME} on WhatsApp
                  </a>
                  <div className="w-full md:w-auto md:ml-auto [&>button]:w-full md:[&>button]:w-auto">
                    <Btn variant="primary" size="lg" type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Submitting…' : 'Request booking'} <Icon name="arrow-r" />
                    </Btn>
                  </div>
                </div>
              </div>
            ) : (
              <div className="gt-card gt-card--accent p-4 md:p-[18px] flex flex-col md:flex-row md:items-center gap-3 md:gap-3.5">
                <div className="flex-1">
                  <div className="text-[11px] font-semibold text-accent-2 uppercase tracking-widest">
                    Total
                  </div>
                  <div className="text-[28px] font-bold text-accent-2 tracking-[-0.01em]">
                    {gtFormatMoney(total)}
                  </div>
                  <div className="text-xs text-ink-3">
                    {curService === 'roro'
                      ? `${sizeLabel} · ${zone === 'kk' ? 'Kota Kinabalu' : 'Penampang'} · delivery & collection included`
                      : `${sizeLabel} × ${curDays} day${curDays > 1 ? 's' : ''} · driver included`}
                  </div>
                </div>
                <div className="w-full md:w-auto [&>button]:w-full md:[&>button]:w-auto">
                  <Btn variant="primary" size="lg" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting…' : 'Continue'} <Icon name="arrow-r" />
                  </Btn>
                </div>
              </div>
            )}

            {submitError && <div className="text-[13px] text-warn">{submitError}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}

function SectionHead({ n, title }: { n: string; title: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="gt-mono text-[13px] text-accent font-semibold">{n}</span>
      <h3 className="m-0 text-base font-bold">{title}</h3>
    </div>
  );
}
