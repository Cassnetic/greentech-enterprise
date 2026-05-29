'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { Icon } from '@/components/ui/Icon';

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function CustomerError({ error, reset }: Props) {
  const isConnection = /can't reach database|ECONNREFUSED|ETIMEDOUT|ENOTFOUND|Database/i.test(
    error.message ?? '',
  );

  useEffect(() => {
    console.error('[customer-error]', error);
  }, [error]);

  return (
    <div className="min-h-dvh flex flex-col bg-bg">
      <header className="px-5 md:px-8 py-4 border-b border-line">
        <Link href="/" className="no-underline text-inherit">
          <Logo />
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-5 py-10">
        <div className="max-w-[560px] w-full flex flex-col gap-5">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-amber font-bold">
            {isConnection ? 'Service hiccup' : 'Unexpected error'}
          </span>
          <h1 className="m-0 text-[32px] md:text-[40px] font-bold tracking-[-0.02em] leading-[1.1] text-ink">
            {isConnection
              ? "We can't reach our booking system right now."
              : 'Something just went sideways.'}
          </h1>
          <p className="m-0 text-[15px] leading-[1.6] text-ink-2 max-w-[480px]">
            {isConnection ? (
              <>
                Our database is having a short break. New bookings can&apos;t be saved at the moment,
                but Cassey is still answering the phone — call her and she&apos;ll lock in your slot
                personally.
              </>
            ) : (
              <>
                Don&apos;t worry, your data is safe. You can try again, head back to the home page,
                or call Cassey if you need this sorted right now.
              </>
            )}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <a
              href="tel:+60145575208"
              className="inline-flex items-center justify-center gap-2 h-12 px-5 rounded-full bg-accent text-white font-semibold text-[14px] no-underline shadow-gt-sm hover:bg-accent-2 active:translate-y-px transition-all"
            >
              <Icon name="phone" size={15} /> Call Cassey · +60 14-557 5208
            </a>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 h-12 px-5 rounded-full border border-line-2 bg-surface text-ink font-medium text-[14px] hover:bg-bg-2 transition-colors"
            >
              <Icon name="arrow-r" size={14} />
              Try again
            </button>
          </div>

          <div className="mt-8 pt-5 border-t border-line flex items-baseline justify-between gap-3">
            <Link
              href="/"
              className="text-[13px] text-ink-3 hover:text-ink no-underline inline-flex items-center gap-1"
            >
              <Icon name="arrow-l" size={12} /> Back to home
            </Link>
            {error.digest && (
              <span
                className="font-mono text-[10.5px] text-ink-4 tracking-[0.04em]"
                title="Share this code with support"
              >
                ref · {error.digest}
              </span>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
