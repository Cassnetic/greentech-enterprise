'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '../ui/Logo';
import { Icon } from '../ui/Icon';

export function CustomerHeader() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Portal needs the DOM; render only after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll while menu is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Close on Esc
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
      <header className="gt-app-header">
        <Link href="/" className="no-underline text-inherit shrink-0">
          <Logo />
        </Link>

        {/* Desktop nav (≥1024px) */}
        <nav className="hidden lg:flex items-center gap-3">
          <div className="gt-nav-pill" role="navigation" aria-label="Primary">
            <Link href="/#services" className="gt-nav-pill__item">
              Services
            </Link>
            <Link href="/#about" className="gt-nav-pill__item">
              About us
            </Link>
            <a href="tel:+60145575208" className="gt-nav-pill__item font-mono text-[12px] tracking-tight">
              <Icon name="phone" size={13} />
              <span className="hidden xl:inline">Cassey ·</span> +60 14-557 5208
            </a>
          </div>

          <span className="h-6 w-px bg-line mx-1" aria-hidden />

          <button
            type="button"
            onClick={() => router.push('/admin/login')}
            className="gt-hdr-btn"
            aria-label="Admin sign in"
          >
            <Icon name="lock" size={13} />
            Admin sign in
          </button>

          <button
            type="button"
            onClick={() => router.push('/book')}
            className="gt-hdr-btn gt-hdr-btn--accent"
          >
            Book a bin
            <Icon name="arrow-r" size={13} />
          </button>
        </nav>

        {/* Tablet condensed (md..lg) */}
        <nav className="hidden md:flex lg:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => router.push('/admin/login')}
            className="gt-hdr-btn"
          >
            <Icon name="lock" size={13} />
            Admin
          </button>
          <button
            type="button"
            onClick={() => router.push('/book')}
            className="gt-hdr-btn gt-hdr-btn--accent"
          >
            Book a bin
            <Icon name="arrow-r" size={13} />
          </button>
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            className="ml-1 flex items-center justify-center w-9 h-9 rounded-full border border-line-2 bg-surface text-ink hover:bg-bg-2 transition-colors"
            onClick={() => setOpen(true)}
          >
            <Icon name="menu" size={18} />
          </button>
        </nav>

        {/* Mobile (<768px) */}
        <div className="md:hidden flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.push('/book')}
            className="gt-hdr-btn gt-hdr-btn--accent !h-9 !px-3.5 !text-[12.5px]"
          >
            Book
            <Icon name="arrow-r" size={12} />
          </button>
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            className="flex items-center justify-center w-10 h-10 rounded-full border border-line-2 bg-surface text-ink active:scale-95 transition-transform"
            onClick={() => setOpen(true)}
          >
            <Icon name="menu" size={18} />
          </button>
        </div>
      </header>

      {/* Slide-over — PORTALED to body so it escapes the header's backdrop-filter containing block */}
      {mounted && open
        ? createPortal(<MobileMenu onClose={() => setOpen(false)} router={router} />, document.body)
        : null}
    </>
  );
}

/* ---------- Mobile menu (rendered outside the header via portal) ---------- */

function MobileMenu({
  onClose,
  router,
}: {
  onClose: () => void;
  router: ReturnType<typeof useRouter>;
}) {
  return (
    <div className="gt-mobile-menu" role="dialog" aria-modal="true" aria-label="Navigation menu">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="gt-mobile-menu__back"
      />

      {/* Panel */}
      <nav className="gt-mobile-menu__panel" aria-label="Mobile primary">
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <Logo />
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="flex items-center justify-center w-10 h-10 -mr-1 rounded-full text-ink-2 hover:bg-bg-2 active:scale-95 transition-transform"
          >
            <Icon name="x" size={20} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-3 pb-3 flex flex-col">
          <div className="px-3 pt-2 pb-1.5 text-[10px] font-bold tracking-[0.18em] uppercase text-ink-3">
            Explore
          </div>

          <MenuLink href="/#services" icon="box" onClose={onClose}>
            Services
            <span className="text-[12px] text-ink-3 font-normal">Roll-off bins & lorry rental</span>
          </MenuLink>
          <MenuLink href="/#about" icon="pin" onClose={onClose}>
            About us
            <span className="text-[12px] text-ink-3 font-normal">Kota Kinabalu · since 2018</span>
          </MenuLink>
          <MenuLink href="/book" icon="plus" onClose={onClose}>
            Start booking
            <span className="text-[12px] text-ink-3 font-normal">2-minute form</span>
          </MenuLink>

          <div className="px-3 pt-5 pb-1.5 text-[10px] font-bold tracking-[0.18em] uppercase text-ink-3">
            Get in touch
          </div>

          <a
            href="tel:+60145575208"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-3 rounded-xl no-underline text-ink active:bg-bg-2"
          >
            <span className="shrink-0 w-9 h-9 rounded-full bg-accent-soft flex items-center justify-center">
              <Icon name="phone" size={15} color="var(--gt-accent-2)" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-[11.5px] uppercase tracking-[0.08em] text-ink-3 font-semibold">
                Call Cassey
              </span>
              <span className="font-mono text-[15px] font-medium text-ink">+60 14-557 5208</span>
            </span>
            <Icon name="arrow-r" size={14} color="var(--gt-ink-3)" style={{ marginLeft: 'auto' }} />
          </a>
        </div>

        {/* Sticky footer CTAs */}
        <div className="border-t border-line bg-surface-2 px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] flex flex-col gap-2">
          <button
            type="button"
            onClick={() => {
              onClose();
              router.push('/book');
            }}
            className="gt-hdr-btn gt-hdr-btn--accent justify-center w-full !h-12 !text-[14px]"
          >
            Book a bin <Icon name="arrow-r" size={14} />
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              router.push('/admin/login');
            }}
            className="gt-hdr-btn justify-center w-full !h-11 !text-[13px]"
          >
            <Icon name="lock" size={13} /> Admin sign in
          </button>
        </div>
      </nav>
    </div>
  );
}

function MenuLink({
  href,
  icon,
  onClose,
  children,
}: {
  href: string;
  icon: 'box' | 'pin' | 'plus';
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClose}
      className="group/menu flex items-center gap-3 px-3 py-3 rounded-xl no-underline text-ink active:bg-bg-2 transition-colors"
    >
      <span className="shrink-0 w-9 h-9 rounded-full bg-accent-soft flex items-center justify-center">
        <Icon name={icon} size={15} color="var(--gt-accent-2)" />
      </span>
      <span className="flex flex-col leading-tight flex-1 min-w-0 text-[15px] font-semibold">
        {children}
      </span>
      <Icon name="arrow-r" size={14} color="var(--gt-ink-3)" />
    </Link>
  );
}
