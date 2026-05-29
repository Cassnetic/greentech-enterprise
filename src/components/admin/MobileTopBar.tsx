'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '../ui/Logo';
import { Icon, IconName } from '../ui/Icon';
import { Pill } from '../ui/Pill';
import { logoutAction } from '@/lib/auth-actions';
import { BookingDTO } from '@/lib/constants';

interface Props {
  active: 'bookings' | 'calendar' | 'payments';
  title: string;
  subtitle?: string;
  bookings: BookingDTO[];
  adminEmail: string;
  /** Right-side action (e.g. "New booking"). */
  action?: React.ReactNode;
}

interface NavItem {
  id: string;
  label: string;
  icon: IconName;
  href: string;
  count?: number;
  soft?: boolean;
  disabled?: boolean;
}

export function AdminMobileTopBar({
  active,
  title,
  subtitle,
  bookings,
  adminEmail,
  action,
}: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [open]);

  return (
    <>
      <header className="md:hidden flex items-center gap-2.5 h-14 px-3 border-b border-line bg-surface sticky top-0 z-30">
        <div className="flex-1 min-w-0 flex flex-col leading-tight pl-1">
          <span className="font-mono text-[10px] text-ink-3 uppercase tracking-[0.14em]">Admin</span>
          <span className="text-[15px] font-bold text-ink truncate tracking-[-0.005em]">{title}</span>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className="flex items-center justify-center w-10 h-10 rounded-full border border-line-2 bg-surface text-ink active:bg-bg-2 active:scale-95 transition-all"
        >
          <Icon name="menu" size={18} />
        </button>
      </header>

      {mounted && open
        ? createPortal(
            <AdminDrawer
              active={active}
              bookings={bookings}
              adminEmail={adminEmail}
              onClose={() => setOpen(false)}
            />,
            document.body,
          )
        : null}
      {/* Optional secondary subtitle line below the bar */}
      {subtitle ? (
        <div className="md:hidden px-4 py-2.5 border-b border-line bg-bg-2 text-[11.5px] text-ink-3 leading-snug">
          {subtitle}
        </div>
      ) : null}
    </>
  );
}

function AdminDrawer({
  active,
  bookings,
  adminEmail,
  onClose,
}: {
  active: Props['active'];
  bookings: BookingDTO[];
  adminEmail: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const pendingPayments = bookings.filter(
    (b) => b.payment === 'review' || b.payment === 'unpaid',
  ).length;
  const activeBookings = bookings.filter(
    (b) => b.status !== 'cancelled' && b.status !== 'completed',
  ).length;

  const items: NavItem[] = [
    {
      id: 'bookings',
      label: 'Bookings',
      icon: 'box',
      count: activeBookings,
      href: '/admin/bookings',
    },
    {
      id: 'payments',
      label: 'Payments',
      icon: 'check',
      count: pendingPayments,
      soft: true,
      href: '/admin/bookings?view=payments',
    },
    { id: 'calendar', label: 'Calendar', icon: 'calendar', href: '/admin/calendar' },
    { id: 'customers', label: 'Customers', icon: 'mail', href: '#', disabled: true },
    { id: 'settings', label: 'Settings', icon: 'menu', href: '#', disabled: true },
  ];

  return (
    <div className="gt-mobile-menu" role="dialog" aria-modal="true" aria-label="Admin navigation">
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="gt-mobile-menu__back"
      />
      <nav className="gt-mobile-menu__panel" aria-label="Admin primary">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <Link href="/" onClick={onClose} className="no-underline text-inherit">
            <Logo />
          </Link>
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="flex items-center justify-center w-10 h-10 -mr-1 rounded-full text-ink-2 hover:bg-bg-2 active:scale-95 transition-transform"
          >
            <Icon name="x" size={20} />
          </button>
        </div>

        <div className="px-5 pb-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-amber font-bold">
            Admin console
          </span>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-3 flex flex-col gap-0.5">
          {items.map((it) => {
            const isActive = it.id === active;
            const isDisabled = it.disabled;
            const onClick = () => {
              if (isDisabled) return;
              onClose();
              if (it.href !== '#') router.push(it.href);
            };
            return (
              <button
                key={it.id}
                type="button"
                disabled={isDisabled}
                onClick={onClick}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: isActive ? 'var(--gt-accent-soft)' : 'transparent',
                  color: isActive ? 'var(--gt-ink)' : 'var(--gt-ink-2)',
                }}
              >
                <span
                  className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
                  style={{
                    background: isActive ? 'var(--gt-accent)' : 'var(--gt-bg-2)',
                    color: isActive ? 'white' : 'var(--gt-ink-3)',
                  }}
                >
                  <Icon name={it.icon} size={15} />
                </span>
                <span
                  className="flex-1 text-[15px] font-semibold"
                  style={{ color: isActive ? 'var(--gt-accent-2)' : undefined }}
                >
                  {it.label}
                </span>
                {it.count != null && it.count > 0 && (
                  <Pill tone={it.soft ? 'amber' : isActive ? 'accent' : 'default'}>{it.count}</Pill>
                )}
                {isDisabled && (
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-4">
                    Soon
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-line bg-surface-2 px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] flex flex-col gap-2.5">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center justify-between px-3 py-2.5 rounded-lg no-underline text-ink-2 text-[13px] hover:bg-bg-2 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Icon name="arrow-l" size={13} /> View public site
            </span>
            <Icon name="arrow-r" size={12} color="var(--gt-ink-3)" />
          </Link>

          <div className="flex items-center gap-2.5 px-3 py-1.5">
            <div
              className="w-7 h-7 rounded-full bg-ink text-white flex items-center justify-center font-semibold text-[11px]"
              aria-hidden
            >
              {adminEmail.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-medium text-ink truncate">{adminEmail}</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-3">
                Signed in
              </div>
            </div>
          </div>

          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 h-11 rounded-lg border border-line-2 bg-surface text-ink-2 font-medium text-[13px] hover:bg-bg-2 transition-colors"
            >
              <Icon name="logout" size={13} /> Sign out
            </button>
          </form>
        </div>
      </nav>
    </div>
  );
}
