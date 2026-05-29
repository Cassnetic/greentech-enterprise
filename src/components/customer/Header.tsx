'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '../ui/Logo';
import { Icon } from '../ui/Icon';

export function CustomerHeader() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Lock body scroll while menu is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
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

      {/* Tablet-only condensed nav (md..lg) */}
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

      {/* Mobile burger (<768px) */}
      <div className="md:hidden flex items-center gap-2">
        <button
          type="button"
          onClick={() => router.push('/book')}
          className="gt-hdr-btn gt-hdr-btn--accent !h-9 !px-3 !text-[12px]"
        >
          Book
          <Icon name="arrow-r" size={12} />
        </button>
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={open}
          className="flex items-center justify-center w-9 h-9 rounded-full border border-line-2 bg-surface text-ink hover:bg-bg-2 transition-colors"
          onClick={() => setOpen(true)}
        >
          <Icon name="menu" size={18} />
        </button>
      </div>

      {/* Slide-over menu (mobile + tablet) */}
      {open && (
        <>
          <div
            className="fixed inset-0 bg-[rgba(20,28,22,0.48)] z-[400] animate-fade-in-fast"
            onClick={() => setOpen(false)}
          />
          <nav
            aria-label="Mobile navigation"
            className="fixed top-0 right-0 bottom-0 w-[min(86vw,360px)] bg-surface shadow-gt-lg z-[401] animate-slide-in flex flex-col p-5"
          >
            <div className="flex items-center justify-between mb-5">
              <Logo />
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="bg-transparent border-0 cursor-pointer p-1.5 rounded-md text-ink-3 hover:bg-bg-2"
              >
                <Icon name="x" size={20} />
              </button>
            </div>

            <div className="text-[10px] font-semibold tracking-[0.12em] uppercase text-ink-3 mb-2 px-1">
              Explore
            </div>
            <Link
              href="/#services"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-3 rounded-lg no-underline text-ink text-[15px] font-medium hover:bg-bg-2"
            >
              <Icon name="box" size={16} color="var(--gt-accent)" /> Services
            </Link>
            <Link
              href="/#about"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-3 rounded-lg no-underline text-ink text-[15px] font-medium hover:bg-bg-2"
            >
              <Icon name="pin" size={16} color="var(--gt-accent)" /> About us
            </Link>
            <Link
              href="/book"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-3 rounded-lg no-underline text-ink text-[15px] font-medium hover:bg-bg-2"
            >
              <Icon name="plus" size={16} color="var(--gt-accent)" /> Start booking
            </Link>
            <a
              href="tel:+60145575208"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-3 rounded-lg no-underline text-ink hover:bg-bg-2"
            >
              <Icon name="phone" size={16} color="var(--gt-accent)" />
              <span className="flex flex-col leading-tight">
                <span className="text-[12px] text-ink-3">Call Cassey</span>
                <span className="font-mono text-[14px]">+60 14-557 5208</span>
              </span>
            </a>

            <div className="flex-1" />

            <div className="border-t border-line pt-4 mt-4 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  router.push('/book');
                }}
                className="gt-hdr-btn gt-hdr-btn--accent justify-center w-full !h-11"
              >
                Book a bin <Icon name="arrow-r" size={14} />
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  router.push('/admin/login');
                }}
                className="gt-hdr-btn justify-center w-full !h-11"
              >
                <Icon name="lock" size={14} /> Admin sign in
              </button>
            </div>
          </nav>
        </>
      )}
    </header>
  );
}
