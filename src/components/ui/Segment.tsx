type Option = string | { id: string; label: string; sub?: string };

interface Props {
  value: string;
  options: Option[];
  onChange: (v: string) => void;
  columns?: number;
}

export function Segment({ value, options, onChange, columns }: Props) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: columns ? `repeat(${columns}, 1fr)` : `repeat(${options.length}, 1fr)`,
        gap: 6,
        padding: 4,
        background: 'var(--gt-bg-2)',
        borderRadius: 8,
      }}
    >
      {options.map((o) => {
        const key = typeof o === 'string' ? o : o.id;
        const label = typeof o === 'string' ? o : o.label;
        const sub = typeof o === 'string' ? null : o.sub;
        const active = key === value;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            style={{
              padding: sub ? '10px 8px' : '8px 10px',
              background: active ? 'var(--gt-surface)' : 'transparent',
              color: active ? 'var(--gt-ink)' : 'var(--gt-ink-2)',
              border: '1px solid ' + (active ? 'var(--gt-line-2)' : 'transparent'),
              borderRadius: 6,
              fontWeight: active ? 600 : 500,
              fontSize: 13,
              cursor: 'pointer',
              boxShadow: active ? 'var(--gt-shadow-sm)' : 'none',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              transition: 'background .12s ease',
            }}
          >
            <div>{label}</div>
            {sub && <div style={{ fontSize: 11, fontWeight: 400, color: 'var(--gt-ink-3)' }}>{sub}</div>}
          </button>
        );
      })}
    </div>
  );
}
