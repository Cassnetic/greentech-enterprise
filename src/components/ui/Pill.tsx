import { CSSProperties, ReactNode } from 'react';

type Tone = 'default' | 'accent' | 'warn' | 'info' | 'amber' | 'ink';

interface PillProps {
  children: ReactNode;
  tone?: Tone;
  dot?: boolean;
  style?: CSSProperties;
}

export function Pill({ children, tone = 'default', dot, style }: PillProps) {
  const cls = ['gt-pill'];
  if (tone === 'accent') cls.push('gt-pill--accent');
  if (tone === 'warn') cls.push('gt-pill--warn');
  if (tone === 'info') cls.push('gt-pill--info');
  if (tone === 'amber') cls.push('gt-pill--amber');
  if (tone === 'ink') cls.push('gt-pill--ink');
  if (dot) cls.push('gt-pill--dot');
  return (
    <span className={cls.join(' ')} style={style}>
      {children}
    </span>
  );
}

export function StatusPill({ status }: { status: string }) {
  return <span className={`gt-pill gt-status--${status}`}>{status}</span>;
}
