import { CSSProperties } from 'react';

interface Props {
  label: string;
  height?: number;
  style?: CSSProperties;
}

export function ImgSlot({ label, height = 120, style }: Props) {
  return (
    <div
      style={{
        height,
        border: '1.5px dashed var(--gt-line-2)',
        borderRadius: 'var(--gt-radius-sm)',
        background: 'repeating-linear-gradient(135deg, transparent 0 9px, var(--gt-bg-2) 9px 10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--gt-mono)',
        fontSize: 11,
        color: 'var(--gt-ink-3)',
        ...style,
      }}
    >
      {label}
    </div>
  );
}
