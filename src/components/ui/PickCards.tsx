import { gtFormatMoney } from '@/lib/format';

interface Option {
  id: string;
  label: string;
  desc?: string;
  price?: number;
}

interface Props {
  value: string;
  options: readonly Option[];
  onChange: (v: string) => void;
  columns?: number;
}

export function PickCards({ value, options, onChange, columns = 2 }: Props) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 8 }}>
      {options.map((o) => {
        const active = o.id === value;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            style={{
              textAlign: 'left',
              padding: '12px 14px',
              border: '1.5px solid ' + (active ? 'var(--gt-accent)' : 'var(--gt-line-2)'),
              borderRadius: 'var(--gt-radius-sm)',
              background: active ? 'var(--gt-accent-soft)' : 'var(--gt-surface)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              transition: 'border-color .12s ease, background .12s ease',
            }}
          >
            <div
              style={{
                fontWeight: 600,
                fontSize: 14,
                color: active ? 'var(--gt-accent-2)' : 'var(--gt-ink)',
              }}
            >
              {o.label}
            </div>
            {o.desc && <div style={{ fontSize: 12, color: 'var(--gt-ink-3)' }}>{o.desc}</div>}
            {o.price != null && (
              <div
                style={{
                  fontFamily: 'var(--gt-mono)',
                  fontSize: 13,
                  color: active ? 'var(--gt-accent-2)' : 'var(--gt-ink-2)',
                  marginTop: 4,
                }}
              >
                {gtFormatMoney(o.price)}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
