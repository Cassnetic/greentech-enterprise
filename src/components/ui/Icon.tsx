import { CSSProperties } from 'react';

export type IconName =
  | 'check'
  | 'arrow-r'
  | 'arrow-l'
  | 'plus'
  | 'x'
  | 'upload'
  | 'download'
  | 'phone'
  | 'mail'
  | 'pin'
  | 'calendar'
  | 'truck'
  | 'box'
  | 'menu'
  | 'search'
  | 'lock'
  | 'eye'
  | 'spark'
  | 'dot'
  | 'logout';

interface Props {
  name: IconName;
  size?: number;
  color?: string;
  style?: CSSProperties;
}

export function Icon({ name, size = 16, color = 'currentColor', style }: Props) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 20 20',
    fill: 'none',
    stroke: color,
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    style,
  };
  switch (name) {
    case 'check':
      return <svg {...common}><path d="M4 10l4 4 8-8" /></svg>;
    case 'arrow-r':
      return <svg {...common}><path d="M4 10h12M11 5l5 5-5 5" /></svg>;
    case 'arrow-l':
      return <svg {...common}><path d="M16 10H4M9 5l-5 5 5 5" /></svg>;
    case 'plus':
      return <svg {...common}><path d="M10 4v12M4 10h12" /></svg>;
    case 'x':
      return <svg {...common}><path d="M5 5l10 10M15 5l-10 10" /></svg>;
    case 'upload':
      return <svg {...common}><path d="M10 13V3M5 8l5-5 5 5M3 13v3a1 1 0 001 1h12a1 1 0 001-1v-3" /></svg>;
    case 'download':
      return <svg {...common}><path d="M10 3v10M5 8l5 5 5-5M3 17h14" /></svg>;
    case 'phone':
      return (
        <svg {...common}>
          <path d="M16 13.5v2a1.5 1.5 0 01-1.7 1.5C7.4 16.4 3.6 12.6 2.9 5.7A1.5 1.5 0 014.4 4h2a1 1 0 011 .8l.6 2.4a1 1 0 01-.3 1l-1.2 1.2a11 11 0 005 5l1.2-1.2a1 1 0 011-.3l2.4.6a1 1 0 01.8 1z" />
        </svg>
      );
    case 'mail':
      return (
        <svg {...common}>
          <rect x="2.5" y="4" width="15" height="12" rx="1.5" />
          <path d="M2.5 5.5L10 11l7.5-5.5" />
        </svg>
      );
    case 'pin':
      return (
        <svg {...common}>
          <path d="M10 18s6-5.4 6-10A6 6 0 004 8c0 4.6 6 10 6 10z" />
          <circle cx="10" cy="8" r="2" />
        </svg>
      );
    case 'calendar':
      return (
        <svg {...common}>
          <rect x="3" y="4.5" width="14" height="13" rx="1.5" />
          <path d="M3 8h14M7 3v3M13 3v3" />
        </svg>
      );
    case 'truck':
      return (
        <svg {...common}>
          <path d="M2 13V6h9v7M11 9h4l2 2.5V13M2 13h15" />
          <circle cx="6" cy="15" r="1.6" />
          <circle cx="14" cy="15" r="1.6" />
        </svg>
      );
    case 'box':
      return <svg {...common}><path d="M3 6.5L10 3l7 3.5M3 6.5v8L10 18M3 6.5L10 10l7-3.5M10 10v8M17 6.5v8L10 18" /></svg>;
    case 'menu':
      return <svg {...common}><path d="M3 6h14M3 10h14M3 14h14" /></svg>;
    case 'search':
      return (
        <svg {...common}>
          <circle cx="8.5" cy="8.5" r="5" />
          <path d="M16 16l-3.9-3.9" />
        </svg>
      );
    case 'lock':
      return (
        <svg {...common}>
          <rect x="4.5" y="9" width="11" height="8" rx="1.5" />
          <path d="M7 9V6.5a3 3 0 116 0V9" />
        </svg>
      );
    case 'eye':
      return (
        <svg {...common}>
          <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" />
          <circle cx="10" cy="10" r="2.5" />
        </svg>
      );
    case 'spark':
      return <svg {...common}><path d="M10 3v3M10 14v3M3 10h3M14 10h3M5 5l2 2M13 13l2 2M5 15l2-2M13 7l2-2" /></svg>;
    case 'dot':
      return (
        <svg {...common} fill={color} stroke="none">
          <circle cx="10" cy="10" r="3" />
        </svg>
      );
    case 'logout':
      return <svg {...common}><path d="M12 3h4a1 1 0 011 1v12a1 1 0 01-1 1h-4M7 7l-3 3 3 3M4 10h10" /></svg>;
    default:
      return null;
  }
}
