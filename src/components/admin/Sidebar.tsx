'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '../ui/Logo';
import { Icon, IconName } from '../ui/Icon';
import { Pill } from '../ui/Pill';
import { logoutAction } from '@/lib/auth-actions';
import { BookingDTO } from '@/lib/constants';

interface Item {
  id: string;
  label: string;
  icon: IconName;
  count?: number;
  soft?: boolean;
  disabled?: boolean;
  href?: string;
}

interface Props {
  active: 'bookings' | 'calendar' | 'payments' | 'customers' | 'settings';
  bookings: BookingDTO[];
  adminEmail: string;
}

export function AdminSidebar({ active, bookings, adminEmail }: Props) {
  const router = useRouter();
  const pendingPayments = bookings.filter((b) => b.payment === 'review' || b.payment === 'unpaid').length;
  const items: Item[] = [
    {
      id: 'bookings',
      label: 'Bookings',
      icon: 'box',
      count: bookings.filter((b) => b.status !== 'cancelled' && b.status !== 'completed').length,
      href: '/admin/bookings',
    },
    { id: 'payments', label: 'Payments', icon: 'check', count: pendingPayments, soft: true, href: '/admin/bookings?view=payments' },
    { id: 'calendar', label: 'Calendar', icon: 'calendar', href: '/admin/calendar' },
    { id: 'customers', label: 'Customers', icon: 'mail', disabled: true },
    { id: 'settings', label: 'Settings', icon: 'menu', disabled: true },
  ];

  return (
    <aside className="hidden md:flex w-[220px] shrink-0 bg-surface-2 border-r border-line py-4 px-3 flex-col gap-1 overflow-hidden">
      <Link
        href="/"
        title="Back to GreenTech website"
        className="group/logo flex items-center gap-2 px-2.5 pt-1 pb-3.5 mb-1 no-underline text-inherit rounded-md transition-colors hover:bg-bg-2"
      >
        <Logo />
        <span className="ml-auto text-[10px] font-medium uppercase tracking-[0.1em] text-ink-4 opacity-0 transition-opacity group-hover/logo:opacity-100">
          Site
        </span>
      </Link>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        {items.map((it) => {
          const on = it.id === active;
          return (
            <button
              key={it.id}
              type="button"
              disabled={it.disabled}
              onClick={() => !it.disabled && it.href && router.push(it.href)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 10px',
                background: on ? 'var(--gt-surface)' : 'transparent',
                border: '1px solid ' + (on ? 'var(--gt-line)' : 'transparent'),
                borderRadius: 8,
                color: it.disabled ? 'var(--gt-ink-4)' : on ? 'var(--gt-ink)' : 'var(--gt-ink-2)',
                cursor: it.disabled ? 'not-allowed' : 'pointer',
                fontSize: 14,
                fontWeight: on ? 600 : 500,
                textAlign: 'left',
                boxShadow: on ? 'var(--gt-shadow-sm)' : 'none',
                transition: 'background .12s ease',
              }}
            >
              <Icon name={it.icon} size={16} color={on ? 'var(--gt-accent)' : undefined} />
              <span style={{ flex: 1 }}>{it.label}</span>
              {it.count != null && it.count > 0 && (
                <Pill tone={it.soft ? 'amber' : on ? 'ink' : 'default'} style={{ fontSize: 10, padding: '2px 6px' }}>
                  {it.count}
                </Pill>
              )}
            </button>
          );
        })}
      </div>

      <form action={logoutAction}>
        <button
          type="submit"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 10px',
            background: 'transparent',
            border: 'none',
            borderRadius: 8,
            color: 'var(--gt-ink-3)',
            cursor: 'pointer',
            fontSize: 13,
            textAlign: 'left',
          }}
        >
          <Icon name="logout" size={16} /> Sign out
        </button>
      </form>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 10px',
          fontSize: 11,
          color: 'var(--gt-ink-3)',
          borderTop: '1px solid var(--gt-line)',
          marginTop: 4,
        }}
      >
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: 'var(--gt-ink)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 11,
            fontWeight: 600,
          }}
        >
          {adminEmail.charAt(0).toUpperCase()}
        </div>
        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{adminEmail}</div>
      </div>
    </aside>
  );
}
