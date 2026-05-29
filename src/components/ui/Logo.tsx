interface Props {
  size?: number;
}

export function Logo({ size = 32 }: Props) {
  return (
    <div className="gt-logo">
      <div className="gt-logo__mark" style={{ width: size, height: size, fontSize: size * 0.5 }}>
        G
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span style={{ fontWeight: 700, fontSize: 15 }}>GreenTech</span>
        <span
          style={{
            fontSize: 10,
            color: 'var(--gt-ink-3)',
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            fontWeight: 500,
          }}
        >
          Enterprise
        </span>
      </div>
    </div>
  );
}
