interface Props {
  label: string;
  value: string | number;
  tone?: 'default' | 'warn' | 'accent' | 'amber';
}

const VALUE_COLOR: Record<NonNullable<Props['tone']>, string> = {
  default: 'var(--gt-ink)',
  warn: 'var(--gt-warn)',
  accent: 'var(--gt-accent-2)',
  amber: 'var(--gt-amber)',
};

export function Stat({ label, value, tone = 'default' }: Props) {
  return (
    <div
      className="gt-card"
      style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}
    >
      <div
        style={{
          fontSize: 11,
          color: 'var(--gt-ink-3)',
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          fontWeight: 500,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: VALUE_COLOR[tone],
          letterSpacing: '-0.01em',
        }}
      >
        {value}
      </div>
    </div>
  );
}
