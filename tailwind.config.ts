import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--gt-bg)',
        'bg-2': 'var(--gt-bg-2)',
        surface: 'var(--gt-surface)',
        'surface-2': 'var(--gt-surface-2)',
        ink: 'var(--gt-ink)',
        'ink-2': 'var(--gt-ink-2)',
        'ink-3': 'var(--gt-ink-3)',
        'ink-4': 'var(--gt-ink-4)',
        line: 'var(--gt-line)',
        'line-2': 'var(--gt-line-2)',
        accent: 'var(--gt-accent)',
        'accent-2': 'var(--gt-accent-2)',
        'accent-soft': 'var(--gt-accent-soft)',
        'accent-soft-2': 'var(--gt-accent-soft-2)',
        warn: 'var(--gt-warn)',
        'warn-soft': 'var(--gt-warn-soft)',
        info: 'var(--gt-info)',
        'info-soft': 'var(--gt-info-soft)',
        amber: 'var(--gt-amber)',
        'amber-soft': 'var(--gt-amber-soft)',
        // shadcn token bridge (Tailwind v3 ↔ shadcn css vars)
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground, var(--primary-foreground))',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
      },
      borderRadius: {
        gt: 'var(--gt-radius)',
        'gt-sm': 'var(--gt-radius-sm)',
        'gt-lg': 'var(--gt-radius-lg)',
      },
      boxShadow: {
        gt: 'var(--gt-shadow)',
        'gt-sm': 'var(--gt-shadow-sm)',
        'gt-lg': 'var(--gt-shadow-lg)',
      },
      fontFamily: {
        sans: ['var(--gt-font)'],
        mono: ['var(--gt-mono)'],
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'none' },
        },
        slideIn: {
          from: { transform: 'translateX(20px)', opacity: '0' },
          to: { transform: 'none', opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fadeIn .26s ease',
        'slide-in': 'slideIn .28s ease',
        'fade-in-fast': 'fadeIn .15s ease',
      },
    },
  },
  plugins: [],
};

export default config;
