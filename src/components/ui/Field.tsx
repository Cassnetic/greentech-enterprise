import {
  CSSProperties,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';

interface FieldProps {
  label?: string;
  sub?: string;
  error?: string;
  children: ReactNode;
  style?: CSSProperties;
}

export function Field({ label, sub, error, children, style }: FieldProps) {
  return (
    <div className={'gt-field' + (error ? ' gt-field--error' : '')} style={style}>
      {label && <label className="gt-field__label">{label}</label>}
      {children}
      {error ? <div className="gt-field__err">{error}</div> : sub ? <div className="gt-field__sub">{sub}</div> : null}
    </div>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className = '', ...rest } = props;
  return <input className={`gt-input ${className}`.trim()} {...rest} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className = '', ...rest } = props;
  return <textarea className={`gt-textarea ${className}`.trim()} {...rest} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  const { className = '', children, ...rest } = props;
  return (
    <select className={`gt-select ${className}`.trim()} {...rest}>
      {children}
    </select>
  );
}
