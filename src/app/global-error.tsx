'use client';

/**
 * Last-resort fallback when the root layout itself fails to render.
 * Must declare its own <html>/<body>. Keep dependencies minimal — no providers, no shared
 * components — because anything imported here is presumed to have just crashed.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f6f4ec',
          color: '#1d2a22',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          padding: '24px',
        }}
      >
        <div style={{ maxWidth: 480, width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <span
            style={{
              fontFamily: 'ui-monospace, SFMono-Regular, monospace',
              fontSize: 11,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#b8732a',
              fontWeight: 700,
            }}
          >
            Fatal · GreenTech Enterprise
          </span>
          <h1 style={{ margin: 0, fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            The page failed to load.
          </h1>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: '#475048' }}>
            Something broke before we could render anything. Please refresh, or call Cassey
            and she&apos;ll handle your booking directly.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
            <a
              href="tel:+60145575208"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                height: 48,
                padding: '0 20px',
                borderRadius: 999,
                background: '#2c6c43',
                color: '#fff',
                fontWeight: 600,
                fontSize: 14,
                textDecoration: 'none',
              }}
            >
              Call Cassey · +60 14-557 5208
            </a>
            <button
              type="button"
              onClick={reset}
              style={{
                height: 48,
                padding: '0 20px',
                borderRadius: 999,
                border: '1px solid #d5d2c4',
                background: '#fbfaf6',
                color: '#1d2a22',
                fontWeight: 500,
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              Refresh
            </button>
          </div>
          {error.digest && (
            <span
              style={{
                marginTop: 16,
                fontFamily: 'ui-monospace, monospace',
                fontSize: 10.5,
                color: '#9da39b',
                letterSpacing: '0.04em',
              }}
            >
              ref · {error.digest}
            </span>
          )}
        </div>
      </body>
    </html>
  );
}
