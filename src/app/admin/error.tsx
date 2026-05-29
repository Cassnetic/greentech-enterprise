'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { Icon } from '@/components/ui/Icon';

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AdminError({ error, reset }: Props) {
  const isConnection = /can't reach database|ECONNREFUSED|ETIMEDOUT|ENOTFOUND|Database/i.test(
    error.message ?? '',
  );

  useEffect(() => {
    console.error('[admin-error]', error);
  }, [error]);

  return (
    <div className="min-h-dvh flex items-center justify-center bg-bg px-5 py-10">
      <div className="max-w-[560px] w-full bg-surface border border-line rounded-2xl shadow-gt-sm overflow-hidden">
        {/* Status strip */}
        <div
          aria-hidden
          className="h-1.5 w-full"
          style={{
            background: isConnection
              ? 'repeating-linear-gradient(90deg, var(--gt-amber) 0 6px, transparent 6px 12px)'
              : 'repeating-linear-gradient(90deg, var(--gt-warn) 0 6px, transparent 6px 12px)',
          }}
        />
        <div className="p-6 md:p-8 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <Logo />
            <span
              className="font-mono text-[10px] uppercase tracking-[0.16em] font-bold px-2.5 py-1 rounded-full"
              style={{
                background: isConnection ? 'var(--gt-amber-soft)' : 'var(--gt-warn-soft)',
                color: isConnection ? 'var(--gt-amber)' : 'var(--gt-warn)',
              }}
            >
              {isConnection ? '503 · Service unavailable' : '500 · Internal error'}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="m-0 text-[22px] md:text-[26px] font-bold tracking-[-0.015em] leading-tight text-ink">
              {isConnection
                ? 'Database is unreachable.'
                : 'The dashboard hit an unexpected error.'}
            </h1>
            <p className="m-0 text-[13.5px] leading-[1.55] text-ink-2">
              {isConnection ? (
                <>
                  The pooler accepted the connection but Postgres didn&apos;t respond.
                  Likely causes: Supabase project paused, password rotation, or a brief
                  network blip. Check the dashboard, then retry.
                </>
              ) : (
                <>
                  This is on us, not you. Try the action again — if it keeps failing, the
                  error reference below will help track it down.
                </>
              )}
            </p>
          </div>

          {/* Error detail (dev only) */}
          {process.env.NODE_ENV !== 'production' && error.message && (
            <pre className="m-0 p-3 bg-bg-2 border border-line rounded-md font-mono text-[11.5px] text-ink-2 leading-snug overflow-x-auto whitespace-pre-wrap break-words max-h-[160px] overflow-y-auto">
              {error.message}
            </pre>
          )}

          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-lg bg-accent text-white font-semibold text-[13.5px] shadow-gt-sm hover:bg-accent-2 active:translate-y-px transition-all"
            >
              <Icon name="arrow-r" size={14} /> Retry
            </button>
            <Link
              href="/admin/bookings"
              className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-lg border border-line-2 bg-surface text-ink font-medium text-[13.5px] no-underline hover:bg-bg-2 transition-colors"
            >
              <Icon name="box" size={13} /> Back to bookings
            </Link>
            {isConnection && (
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-lg border border-amber-soft bg-amber-soft text-amber font-medium text-[13.5px] no-underline hover:opacity-90 transition-opacity"
              >
                Open Supabase ↗
              </a>
            )}
          </div>

          {error.digest && (
            <div className="pt-4 border-t border-line flex items-center justify-between text-[11px] text-ink-3">
              <span>Error reference</span>
              <span className="font-mono tabular-nums tracking-[0.04em] text-ink-2">
                {error.digest}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
