'use client';

import { useState } from 'react';
import { AdminSidebar } from './Sidebar';
import { AdminMobileTopBar } from './MobileTopBar';
import { Btn } from '../ui/Btn';
import { Icon } from '../ui/Icon';
import { Pill } from '../ui/Pill';
import { Toast } from '../ui/Toast';
import { BlockedDateDTO, BookingDTO } from '@/lib/constants';
import { gtFormatDateShort } from '@/lib/format';

interface Props {
  bookings: BookingDTO[];
  initialBlocks: BlockedDateDTO[];
  adminEmail: string;
}

const TODAY_ISO = '2026-05-29';

export function AdminCalendarPage({ bookings, initialBlocks, adminEmail }: Props) {
  const [blocks, setBlocks] = useState(initialBlocks);
  const [serviceFilter, setServiceFilter] = useState<'both' | 'roro' | 'lorry'>('both');
  const [month, setMonth] = useState({ year: 2026, m: 6 });
  const [toast, setToast] = useState<string | null>(null);

  const firstDay = new Date(month.year, month.m - 1, 1);
  const daysInMonth = new Date(month.year, month.m, 0).getDate();
  const offset = firstDay.getDay();
  const cells: (number | null)[] = Array.from({ length: offset + daysInMonth }, (_, i) =>
    i < offset ? null : i - offset + 1,
  );
  const monthName = firstDay.toLocaleDateString('en-MY', { month: 'long', year: 'numeric' });

  const isoFor = (d: number) =>
    `${month.year}-${String(month.m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const isSunday = (d: number) => new Date(month.year, month.m - 1, d).getDay() === 0;
  const blockForDay = (d: number) => blocks.find((b) => b.date === isoFor(d));
  const dayBookings = (d: number) => bookings.filter((b) => b.date === isoFor(d));

  const toggleBlock = async (d: number) => {
    const iso = isoFor(d);
    if (isSunday(d)) {
      setToast('Sundays are auto-blocked — use Settings to change.');
      return;
    }
    if (new Date(iso) < new Date(TODAY_ISO)) return;
    const existing = blocks.find((b) => b.date === iso);
    if (existing) {
      setBlocks((bs) => bs.filter((b) => b.date !== iso));
      setToast(`${gtFormatDateShort(iso)} reopened`);
      await fetch(`/api/calendar/blocks?date=${iso}`, { method: 'DELETE' });
    } else {
      const scope = serviceFilter === 'both' ? 'both' : serviceFilter;
      const newBlock: BlockedDateDTO = { date: iso, scope, reason: 'Manually blocked' };
      setBlocks((bs) => [...bs, newBlock]);
      setToast(`${gtFormatDateShort(iso)} blocked`);
      await fetch('/api/calendar/blocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBlock),
      });
    }
  };

  const navMonth = (dir: -1 | 1) => {
    setMonth((m) => {
      let nm = m.m + dir;
      let ny = m.year;
      if (nm < 1) {
        nm = 12;
        ny--;
      }
      if (nm > 12) {
        nm = 1;
        ny++;
      }
      return { year: ny, m: nm };
    });
  };

  return (
    <div className="flex h-dvh overflow-hidden">
      <AdminSidebar active="calendar" bookings={bookings} adminEmail={adminEmail} />

      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        <AdminMobileTopBar
          active="calendar"
          title="Availability"
          subtitle="Tap a date to block or unblock it"
          bookings={bookings}
          adminEmail={adminEmail}
        />

        <div className="hidden md:flex flex-wrap items-center gap-4 px-4 md:px-6 py-3 md:py-4 border-b border-line bg-surface shrink-0">
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Availability</h1>
            <div style={{ fontSize: 12, color: 'var(--gt-ink-3)' }}>
              Click any date to block / unblock
            </div>
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', gap: 4, padding: 4, background: 'var(--gt-bg-2)', borderRadius: 8 }}>
            {([
              ['both', 'All services'],
              ['roro', 'Roll-off'],
              ['lorry', 'Lorry'],
            ] as const).map(([k, l]) => (
              <button
                key={k}
                onClick={() => setServiceFilter(k)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 6,
                  border: 'none',
                  fontSize: 12,
                  fontWeight: serviceFilter === k ? 600 : 500,
                  cursor: 'pointer',
                  background: serviceFilter === k ? 'var(--gt-surface)' : 'transparent',
                  color: serviceFilter === k ? 'var(--gt-ink)' : 'var(--gt-ink-2)',
                  boxShadow: serviceFilter === k ? 'var(--gt-shadow-sm)' : 'none',
                }}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="gt-scroll flex-1 overflow-auto p-3 md:p-6">
          {/* Month nav */}
          <div className="flex items-center gap-3 mb-3 md:mb-4">
            <button
              type="button"
              onClick={() => navMonth(-1)}
              aria-label="Previous month"
              className="w-10 h-10 md:w-9 md:h-9 rounded-full border border-line-2 bg-surface text-ink-2 flex items-center justify-center active:scale-95 transition-transform hover:bg-bg-2"
            >
              <Icon name="arrow-l" size={14} />
            </button>
            <h2 className="m-0 flex-1 text-center font-bold tracking-[-0.01em] text-[20px] md:text-[22px]">
              {monthName}
            </h2>
            <button
              type="button"
              onClick={() => navMonth(1)}
              aria-label="Next month"
              className="w-10 h-10 md:w-9 md:h-9 rounded-full border border-line-2 bg-surface text-ink-2 flex items-center justify-center active:scale-95 transition-transform hover:bg-bg-2"
            >
              <Icon name="arrow-r" size={14} />
            </button>
          </div>

          {/* Mobile service filter — affects what gets blocked when tapping */}
          <div className="md:hidden flex items-center gap-2 mb-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3 font-semibold shrink-0">
              Block scope
            </span>
            <div className="flex gap-1 p-1 bg-bg-2 rounded-lg shrink-0">
              {([
                ['both', 'All'],
                ['roro', 'Roll-off'],
                ['lorry', 'Lorry'],
              ] as const).map(([k, l]) => (
                <button
                  key={k}
                  onClick={() => setServiceFilter(k)}
                  className="px-2.5 py-1 rounded-md text-[11.5px] font-medium whitespace-nowrap transition-colors"
                  style={{
                    background: serviceFilter === k ? 'var(--gt-surface)' : 'transparent',
                    color: serviceFilter === k ? 'var(--gt-ink)' : 'var(--gt-ink-2)',
                    fontWeight: serviceFilter === k ? 600 : 500,
                    boxShadow: serviceFilter === k ? 'var(--gt-shadow-sm)' : 'none',
                  }}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Weekday header — single letters on mobile, abbrev on desktop */}
          <div className="grid grid-cols-7 gap-1 md:gap-2 mb-1 md:mb-2">
            {(
              [
                ['Sun', 'S'],
                ['Mon', 'M'],
                ['Tue', 'T'],
                ['Wed', 'W'],
                ['Thu', 'T'],
                ['Fri', 'F'],
                ['Sat', 'S'],
              ] as const
            ).map(([full, short], idx) => (
              <div
                key={idx}
                className="text-center pb-1 md:pb-1.5 font-mono text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-3"
              >
                <span className="md:hidden">{short}</span>
                <span className="hidden md:inline">{full}</span>
              </div>
            ))}
          </div>

          {/* Month grid — square cells on mobile, taller on desktop */}
          <div className="grid grid-cols-7 gap-1 md:gap-2">
            {cells.map((d, i) => {
              if (d == null) return <div key={i} />;
              const iso = isoFor(d);
              const sun = isSunday(d);
              const blocked = blockForDay(d);
              const isPast = new Date(iso) < new Date(TODAY_ISO);
              const isToday = iso === TODAY_ISO;
              const bks = dayBookings(d);
              const isBlocked = !!blocked || sun;
              const roroCount = bks.filter((b) => b.service === 'roro').length;
              const lorryCount = bks.filter((b) => b.service === 'lorry').length;

              return (
                <button
                  key={i}
                  type="button"
                  className={
                    'gt-cal-cell relative flex flex-col aspect-square md:aspect-auto md:min-h-[100px] p-1.5 md:p-2.5 rounded-md md:rounded-lg text-left overflow-hidden' +
                    (isPast ? ' is-past pointer-events-none' : '')
                  }
                  disabled={isPast}
                  aria-label={`${monthName} ${d}${isBlocked ? ' — blocked' : ''}${isToday ? ' — today' : ''}`}
                  onClick={() => toggleBlock(d)}
                  style={{
                    border: '1.5px solid ' + (isToday ? 'var(--gt-accent)' : 'var(--gt-line)'),
                    background: isBlocked
                      ? 'repeating-linear-gradient(135deg, var(--gt-bg-2) 0 8px, var(--gt-surface-2) 8px 10px)'
                      : 'var(--gt-surface)',
                    opacity: isPast ? 0.4 : 1,
                  }}
                >
                  {/* Today badge — top right, desktop only (mobile uses the green border) */}
                  {isToday && (
                    <span
                      aria-hidden
                      className="hidden md:inline-block absolute top-1.5 right-1.5 font-mono text-[8.5px] font-bold uppercase tracking-[0.12em]"
                      style={{ color: 'var(--gt-accent)' }}
                    >
                      today
                    </span>
                  )}

                  {/* Day number — anchor of the cell */}
                  <span
                    className="font-mono leading-none"
                    style={{
                      fontSize: 'clamp(13px, 3.6vw, 15px)',
                      fontWeight: isToday ? 700 : 500,
                      color: isToday ? 'var(--gt-accent)' : 'var(--gt-ink)',
                    }}
                  >
                    {d}
                  </span>

                  {/* Blocked / closed label */}
                  {isBlocked && !isPast && (
                    <span
                      className="mt-1 self-start font-mono font-bold uppercase tracking-[0.08em] rounded-sm"
                      style={{
                        fontSize: 'clamp(8px, 2.2vw, 9.5px)',
                        padding: '1px 4px',
                        background: 'var(--gt-warn-soft)',
                        color: 'var(--gt-warn)',
                      }}
                    >
                      {sun ? 'closed' : 'blocked'}
                    </span>
                  )}

                  {/* Slot counts — desktop only (mobile is too tight) */}
                  {!isBlocked && !isPast && (
                    <div className="hidden md:flex flex-col gap-0.5 mt-1 font-mono text-[10px] text-ink-3 leading-tight">
                      <div>RR · {Math.max(0, 4 - roroCount)}/4</div>
                      <div>LD · {Math.max(0, 3 - lorryCount)}/3</div>
                    </div>
                  )}

                  {/* Bottom indicator strip — booking presence */}
                  {bks.length > 0 && !isBlocked && (
                    <div className="mt-auto flex items-end gap-0.5 pt-1">
                      {/* Mobile: simple color stripe spanning the bottom */}
                      <div className="md:hidden flex w-full h-[3px] rounded-full overflow-hidden">
                        {roroCount > 0 && (
                          <span
                            className="block h-full"
                            style={{
                              flex: roroCount,
                              background: 'var(--gt-accent)',
                            }}
                          />
                        )}
                        {lorryCount > 0 && (
                          <span
                            className="block h-full"
                            style={{
                              flex: lorryCount,
                              background: 'var(--gt-info)',
                            }}
                          />
                        )}
                      </div>
                      {/* Desktop: discrete dots */}
                      <div className="hidden md:flex gap-1">
                        {bks.slice(0, 3).map((b) => (
                          <span
                            key={b.id}
                            className="block w-2 h-2 rounded-sm"
                            style={{
                              background: b.service === 'roro' ? 'var(--gt-accent)' : 'var(--gt-info)',
                            }}
                            title={b.customer}
                          />
                        ))}
                        {bks.length > 3 && (
                          <span className="text-[9px] text-ink-3 leading-none">+{bks.length - 3}</span>
                        )}
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Compact legend — mobile shows 2 essentials, desktop shows full */}
          <div className="mt-4 md:mt-5 rounded-lg bg-bg-2 px-3.5 md:px-4 py-3 md:py-3.5">
            {/* Mobile: just blocked + bookings dot meaning */}
            <div className="md:hidden grid grid-cols-2 gap-y-2 gap-x-3 text-[11.5px] text-ink-2">
              <div className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="w-3.5 h-3.5 rounded-sm border border-line"
                  style={{
                    background:
                      'repeating-linear-gradient(135deg, var(--gt-bg-2) 0 5px, var(--gt-surface-2) 5px 6px)',
                  }}
                />
                <span>Blocked / closed</span>
              </div>
              <div className="flex items-center gap-2">
                <span aria-hidden className="block w-3 h-[3px] rounded-full bg-accent" />
                <span>Roll-off booked</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="w-3.5 h-3.5 rounded-sm border-[1.5px]"
                  style={{ borderColor: 'var(--gt-accent)' }}
                />
                <span>Today</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="block w-3 h-[3px] rounded-full"
                  style={{ background: 'var(--gt-info)' }}
                />
                <span>Lorry booked</span>
              </div>
            </div>

            {/* Desktop: full legend with tip */}
            <div className="hidden md:flex items-center gap-5 flex-wrap">
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded-sm border border-line bg-surface" />
                <span className="text-[12px] text-ink-2">Available · with slot counts</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div
                  className="w-3.5 h-3.5 rounded-sm border border-line"
                  style={{
                    background:
                      'repeating-linear-gradient(135deg, var(--gt-bg-2) 0 5px, var(--gt-surface-2) 5px 6px)',
                  }}
                />
                <span className="text-[12px] text-ink-2">Blocked (manual or Sunday)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-sm bg-accent" />
                <span className="text-[12px] text-ink-2">Roll-off booking</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-sm" style={{ background: 'var(--gt-info)' }} />
                <span className="text-[12px] text-ink-2">Lorry booking</span>
              </div>
              <div className="flex-1" />
              <span className="text-[12px] text-ink-3">
                Tip: click date to toggle · RR = Roll-off (4/day), LD = Lorry (3/day)
              </span>
            </div>
          </div>
        </div>
      </main>
      <Toast message={toast} onClose={() => setToast(null)} />
    </div>
  );
}
