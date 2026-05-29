'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { CustomerHeader } from './Header';
import { Btn } from '../ui/Btn';
import { Icon } from '../ui/Icon';
import { Pill } from '../ui/Pill';
import { Logo } from '../ui/Logo';

export function LandingPage() {
  const router = useRouter();
  const goBook = (service: 'roro' | 'lorry') => router.push(`/book?service=${service}`);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <CustomerHeader />
      <div className="gt-page gt-scroll">
        <div className="max-w-[1120px] mx-auto px-4 md:px-8 pt-6 md:pt-10 pb-7">
          {/* Hero + services */}
          <div className="grid grid-cols-1 md:grid-cols-[1.05fr_1fr] gap-8 md:gap-12 items-center">
            <div className="gt-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Pill tone="accent" dot>
                  Kota Kinabalu · Sabah · East Malaysia
                </Pill>
              </div>
              <h1
                className="m-0 font-bold tracking-[-0.02em] leading-[1.1] md:leading-[1.05] text-[36px] md:text-[52px]"
              >
                Waste hauled.
                <br />
                Lorry rented.
                <br />
                <span style={{ color: 'var(--gt-accent)' }}>Sorted by tomorrow.</span>
              </h1>
              <p
                style={{
                  fontSize: 16,
                  color: 'var(--gt-ink-2)',
                  maxWidth: 460,
                  margin: 0,
                  lineHeight: 1.55,
                }}
              >
                Book a Roll-on/Roll-off construction bin or hire a Lorry Delta in under 2 minutes. Pay by bank transfer,
                we confirm by email within one working day.
              </p>
              <div style={{ display: 'flex', gap: 10, marginTop: 6, flexWrap: 'wrap' }}>
                <Btn variant="primary" size="lg" onClick={() => router.push('/book')}>
                  Start booking <Icon name="arrow-r" />
                </Btn>
                <Btn
                  size="lg"
                  onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  How it works
                </Btn>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-3 md:gap-6 mt-2.5 text-xs text-ink-3">
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Icon name="check" size={14} color="var(--gt-accent)" />
                  Licensed waste contractor
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Icon name="check" size={14} color="var(--gt-accent)" />
                  Next-day delivery
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Icon name="check" size={14} color="var(--gt-accent)" />
                  SST-registered
                </div>
              </div>
            </div>

            <div id="services" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'var(--gt-ink-3)',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                }}
              >
                Pick a service
              </div>

              <div
                className="gt-card gt-svc-tile"
                style={{ padding: 18, display: 'flex', gap: 16 }}
                onClick={() => goBook('roro')}
              >
                <div className="shrink-0 w-[104px] h-[88px] sm:w-[130px] sm:h-[100px] rounded-gt-sm overflow-hidden bg-bg-2">
                  <Image
                    src="/roro.png"
                    alt="Roll-on/Roll-off bin"
                    width={300}
                    height={230}
                    className="gt-svc-img"
                    sizes="(max-width: 767px) 100vw, 130px"
                    priority
                  />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Icon name="box" size={18} color="var(--gt-accent)" />
                      <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Roll-on/Roll-off Bin</h3>
                    </div>
                    <div style={{ fontFamily: 'var(--gt-mono)', fontSize: 13, color: 'var(--gt-ink-2)' }}>
                      from RM 850
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--gt-ink-3)' }}>
                    Drop-and-leave construction skip. We deliver, you fill, we collect.
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                    <Pill>8 m³</Pill>
                    <Pill>15 m³</Pill>
                    <Pill>30 m³</Pill>
                  </div>
                </div>
              </div>

              <div
                className="gt-card gt-svc-tile"
                style={{ padding: 18, display: 'flex', gap: 16 }}
                onClick={() => goBook('lorry')}
              >
                <div className="shrink-0 w-[104px] h-[88px] sm:w-[130px] sm:h-[100px] rounded-gt-sm overflow-hidden bg-bg-2">
                  <Image
                    src="/lorry.png"
                    alt="Lorry Delta"
                    width={300}
                    height={230}
                    className="gt-svc-img"
                    sizes="(max-width: 767px) 100vw, 130px"
                    priority
                  />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Icon name="truck" size={18} color="var(--gt-accent)" />
                      <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Lorry Delta</h3>
                    </div>
                    <div style={{ fontFamily: 'var(--gt-mono)', fontSize: 13, color: 'var(--gt-ink-2)' }}>
                      from RM 380 / day
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--gt-ink-3)' }}>
                    Daily lorry rental with driver. Pickup, moving, transport.
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                    <Pill>1 tonne</Pill>
                    <Pill>3 tonnes</Pill>
                    <Pill>5 tonnes</Pill>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* How it works */}
          <div id="how" style={{ marginTop: 72, display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
              <h2 className="gt-section-title" style={{ margin: 0 }}>
                How it works
              </h2>
              <div style={{ flex: 1, borderBottom: '1px solid var(--gt-line)' }} />
              <div className="gt-section-sub">Four steps, two minutes</div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(
                [
                  ['01', 'Pick a service', 'Roll-on/Roll-off Bin or Lorry Delta'],
                  ['02', 'Fill the booking', 'Address, date, size, waste type'],
                  ['03', 'Bank transfer', 'Upload your transfer proof'],
                  ['04', 'We confirm', 'Email confirmation within 1 working day'],
                ] as const
              ).map(([n, h, s]) => (
                <div
                  key={n}
                  className="gt-card"
                  style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 6 }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--gt-mono)',
                      fontSize: 12,
                      color: 'var(--gt-accent)',
                      fontWeight: 600,
                    }}
                  >
                    {n}
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>{h}</div>
                  <div style={{ fontSize: 13, color: 'var(--gt-ink-3)' }}>{s}</div>
                </div>
              ))}
            </div>
          </div>

          {/* About us */}
          <section id="about" className="mt-16 md:mt-20 scroll-mt-[80px]">
            <div className="flex items-baseline gap-3 mb-6">
              <h2 className="gt-section-title m-0">About us</h2>
              <div className="flex-1 border-b border-line" />
              <div className="gt-section-sub">Kota Kinabalu · since 2018</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1.15fr_1fr] gap-8 md:gap-12 items-start">
              {/* Narrative */}
              <div className="flex flex-col gap-4">
                <Pill tone="accent" dot>
                  Family-run · Sabah-owned
                </Pill>
                <h3 className="m-0 font-bold tracking-[-0.01em] leading-[1.15] text-[26px] md:text-[32px]">
                  Sabah&apos;s hands-on waste &amp; lorry crew — answering the phone since 2018.
                </h3>
                <p className="m-0 text-[15px] leading-[1.6] text-ink-2">
                  We started with a single roll-on/roll-off lorry running construction sites in Inanam.
                  Seven years on we run a small fleet across the KK corridor — Likas, Penampang, Donggongon,
                  Putatan — for contractors, renovators and households who just want the bin to arrive on
                  the day they said.
                </p>
                <p className="m-0 text-[15px] leading-[1.6] text-ink-2">
                  No middlemen, no call centres. Cassey handles dispatch, our drivers handle the rest.
                  If something&apos;s off, you can WhatsApp the boss directly.
                </p>

                {/* Trust list */}
                <ul className="m-0 mt-2 list-none p-0 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
                  {[
                    'Licensed Sabah SWM contractor (#2241)',
                    'SST-registered (B16-1808)',
                    'Owner-operated, no subcontractors',
                    'Cash, transfer, DuitNow accepted',
                  ].map((line) => (
                    <li key={line} className="flex items-start gap-2 text-[13.5px] text-ink-2 leading-snug">
                      <span className="mt-[3px] shrink-0">
                        <Icon name="check" size={14} color="var(--gt-accent)" />
                      </span>
                      {line}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Stat block + Cassey card */}
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {(
                    [
                      ['7+', 'years operating'],
                      ['1.2k', 'bins delivered'],
                      ['4', 'lorries on road'],
                    ] as const
                  ).map(([n, label]) => (
                    <div
                      key={label}
                      className="gt-card flex flex-col gap-1 p-3 sm:p-4"
                    >
                      <div className="font-mono text-[20px] sm:text-[22px] md:text-[26px] font-bold text-ink leading-none tracking-[-0.02em]">
                        {n}
                      </div>
                      <div className="text-[10.5px] sm:text-[11px] uppercase tracking-[0.06em] sm:tracking-[0.08em] text-ink-3 font-medium leading-tight">
                        {label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cassey card */}
                <div className="gt-card gt-card--accent p-5 flex gap-4 items-start">
                  <div
                    aria-hidden
                    className="shrink-0 w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center font-bold text-[18px] shadow-gt-sm"
                  >
                    C
                  </div>
                  <div className="flex flex-col gap-1.5 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="font-semibold text-[14px] text-ink">Cassey Liew</span>
                      <span className="text-[11px] uppercase tracking-[0.08em] text-accent-2 font-semibold">
                        Owner · dispatch
                      </span>
                    </div>
                    <p className="m-0 text-[13.5px] text-ink-2 leading-[1.5]">
                      &ldquo;If we said tomorrow, it&apos;s tomorrow. Call me if it isn&apos;t.&rdquo;
                    </p>
                    <a
                      href="tel:+60145575208"
                      className="inline-flex items-center gap-1.5 mt-1 font-mono text-[12.5px] text-accent-2 no-underline hover:underline"
                    >
                      <Icon name="phone" size={13} /> +60 14-557 5208
                    </a>
                  </div>
                </div>

                {/* Service area */}
                <div className="gt-card flex items-center gap-3 p-4">
                  <Icon name="pin" size={18} color="var(--gt-accent)" />
                  <div className="flex flex-col leading-tight">
                    <div className="text-[13px] font-semibold text-ink">Serving Greater Kota Kinabalu</div>
                    <div className="text-[12px] text-ink-3">
                      Inanam · Likas · Penampang · Donggongon · Putatan · Kepayan
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="mt-12 md:mt-16 pt-6 border-t border-line flex flex-col md:flex-row md:justify-between md:items-center gap-3 flex-wrap">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                fontSize: 12,
                color: 'var(--gt-ink-3)',
              }}
            >
              <Logo size={24} />
              <span>© 2026 GreenTech Enterprise Sdn Bhd</span>
            </div>
            <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--gt-ink-3)', flexWrap: 'wrap' }}>
              <span>Sabah SWM Lic. #2241</span>
              <span>SST #B16-1808</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
