'use client';

import { useState } from 'react';
import { AdminSidebar } from './Sidebar';
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
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <AdminSidebar active="calendar" bookings={bookings} adminEmail={adminEmail} />

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

        <div className="gt-scroll" style={{ flex: 1, overflow: 'auto', padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <Btn size="sm" onClick={() => navMonth(-1)}>
              <Icon name="arrow-l" size={14} />
            </Btn>
            <h2
              style={{
                margin: 0,
                fontSize: 22,
                fontWeight: 700,
                flex: 1,
                textAlign: 'center',
                letterSpacing: '-0.01em',
              }}
            >
              {monthName}
            </h2>
            <Btn size="sm" onClick={() => navMonth(1)}>
              <Icon name="arrow-r" size={14} />
            </Btn>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, marginBottom: 8 }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div
                key={d}
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'var(--gt-ink-3)',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  textAlign: 'center',
                  paddingBottom: 4,
                }}
              >
                {d}
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
            {cells.map((d, i) => {
              if (d == null) return <div key={i} />;
              const iso = isoFor(d);
              const sun = isSunday(d);
              const blocked = blockForDay(d);
              const isPast = new Date(iso) < new Date(TODAY_ISO);
              const isToday = iso === TODAY_ISO;
              const bks = dayBookings(d);
              const isBlocked = !!blocked || sun;

              return (
                <button
                  key={i}
                  type="button"
                  className={'gt-cal-cell' + (isPast ? ' is-past' : '')}
                  onClick={() => toggleBlock(d)}
                  style={{
                    minHeight: 100,
                    padding: 10,
                    border: '1.5px solid ' + (isToday ? 'var(--gt-accent)' : 'var(--gt-line)'),
                    borderRadius: 'var(--gt-radius-sm)',
                    background: isBlocked
                      ? 'repeating-linear-gradient(135deg, var(--gt-bg-2) 0 8px, var(--gt-surface-2) 8px 10px)'
                      : 'var(--gt-surface)',
                    opacity: isPast ? 0.5 : 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                    cursor: isPast ? 'default' : 'pointer',
                    textAlign: 'left',
                    fontFamily: 'inherit',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span
                      className="gt-mono"
                      style={{
                        fontSize: 13,
                        fontWeight: isToday ? 700 : 500,
                        color: isToday ? 'var(--gt-accent)' : 'var(--gt-ink)',
                      }}
                    >
                      {d}
                    </span>
                    {isToday && (
                      <span
                        style={{
                          fontSize: 9,
                          color: 'var(--gt-accent)',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: 0.5,
                        }}
                      >
                        today
                      </span>
                    )}
                  </div>

                  {isBlocked && !isPast && (
                    <Pill tone="warn" style={{ fontSize: 9, padding: '1px 6px', alignSelf: 'flex-start' }}>
                      {sun ? 'closed' : 'blocked'}
                    </Pill>
                  )}

                  {!isBlocked && !isPast && (
                    <div
                      style={{
                        fontFamily: 'var(--gt-mono)',
                        fontSize: 10,
                        color: 'var(--gt-ink-3)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                      }}
                    >
                      <div>RR · {Math.max(0, 4 - bks.filter((b) => b.service === 'roro').length)}/4</div>
                      <div>LD · {Math.max(0, 3 - bks.filter((b) => b.service === 'lorry').length)}/3</div>
                    </div>
                  )}

                  {bks.length > 0 && !isBlocked && (
                    <div style={{ marginTop: 'auto', display: 'flex', gap: 2 }}>
                      {bks.slice(0, 3).map((b) => (
                        <span
                          key={b.id}
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: 2,
                            background: b.service === 'roro' ? 'var(--gt-accent)' : 'var(--gt-info)',
                          }}
                          title={b.customer}
                        />
                      ))}
                      {bks.length > 3 && (
                        <span style={{ fontSize: 9, color: 'var(--gt-ink-3)' }}>+{bks.length - 3}</span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div
            style={{
              display: 'flex',
              gap: 18,
              alignItems: 'center',
              flexWrap: 'wrap',
              marginTop: 18,
              padding: '14px 16px',
              background: 'var(--gt-bg-2)',
              borderRadius: 8,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div
                style={{
                  width: 14,
                  height: 14,
                  border: '1.5px solid var(--gt-line)',
                  borderRadius: 4,
                  background: 'var(--gt-surface)',
                }}
              />
              <span style={{ fontSize: 12, color: 'var(--gt-ink-2)' }}>Available · with slot counts</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div
                style={{
                  width: 14,
                  height: 14,
                  border: '1.5px solid var(--gt-line)',
                  borderRadius: 4,
                  background:
                    'repeating-linear-gradient(135deg, var(--gt-bg-2) 0 5px, var(--gt-surface-2) 5px 6px)',
                }}
              />
              <span style={{ fontSize: 12, color: 'var(--gt-ink-2)' }}>Blocked (manual or Sunday)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--gt-accent)' }} />
              <span style={{ fontSize: 12, color: 'var(--gt-ink-2)' }}>Roll-off booking</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--gt-info)' }} />
              <span style={{ fontSize: 12, color: 'var(--gt-ink-2)' }}>Lorry booking</span>
            </div>
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: 12, color: 'var(--gt-ink-3)' }}>
              Tip: click date to toggle · RR = Roll-on/Roll-off Bin (4 slots/day), LD = Lorry Delta (3 slots/day)
            </span>
          </div>
        </div>
      </main>
      <Toast message={toast} onClose={() => setToast(null)} />
    </div>
  );
}
