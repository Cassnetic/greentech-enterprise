import { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'default' | 'primary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface Props extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  variant?: Variant;
  size?: Size;
  full?: boolean;
  type?: 'button' | 'submit' | 'reset';
  children: ReactNode;
}

export function Btn({
  variant = 'default',
  size = 'md',
  full,
  type = 'button',
  className = '',
  children,
  ...rest
}: Props) {
  const cls = ['gt-btn'];
  if (variant === 'primary') cls.push('gt-btn--primary');
  if (variant === 'ghost') cls.push('gt-btn--ghost');
  if (variant === 'danger') cls.push('gt-btn--danger');
  if (size === 'sm') cls.push('gt-btn--sm');
  if (size === 'lg') cls.push('gt-btn--lg');
  if (full) cls.push('gt-btn--full');
  if (className) cls.push(className);
  return (
    <button type={type} className={cls.join(' ')} {...rest}>
      {children}
    </button>
  );
}
