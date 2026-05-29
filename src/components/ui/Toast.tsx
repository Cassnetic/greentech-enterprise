'use client';

import { useEffect } from 'react';
import { Icon } from './Icon';

interface Props {
  message: string | null;
  onClose: () => void;
}

export function Toast({ message, onClose }: Props) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClose, 3200);
    return () => clearTimeout(t);
  }, [message, onClose]);

  if (!message) return null;
  return (
    <div
      style={{
        position: 'fixed',
        top: 80,
        right: 24,
        zIndex: 300,
        background: 'var(--gt-ink)',
        color: 'white',
        padding: '12px 16px',
        borderRadius: 10,
        boxShadow: 'var(--gt-shadow-lg)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        maxWidth: 360,
        animation: 'gtSlideIn .2s ease',
        fontSize: 13,
      }}
    >
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: '50%',
          background: 'var(--gt-accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon name="check" size={14} color="white" />
      </div>
      <div>{message}</div>
    </div>
  );
}

export function useToast() {
  // simple toast hook used by client pages
  // a more powerful version could use context; for now each page wires its own state
}
