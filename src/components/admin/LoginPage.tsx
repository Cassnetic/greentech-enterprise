'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Btn } from '../ui/Btn';
import { Field, Input } from '../ui/Field';
import { Icon } from '../ui/Icon';
import { Logo } from '../ui/Logo';
import { loginAction } from '@/lib/auth-actions';

export function AdminLoginPage() {
  const [email, setEmail] = useState('admin@greentech.my');
  const [pwd, setPwd] = useState('demo1234');
  const [error, setError] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [pending, startTransition] = useTransition();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !pwd) {
      setError('Email and password required');
      return;
    }
    setError('');
    const fd = new FormData();
    fd.append('email', email);
    fd.append('password', pwd);
    startTransition(async () => {
      const res = await loginAction(fd);
      if (res && !res.ok) setError(res.error);
    });
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <header className="gt-app-header">
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Logo />
        </Link>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Btn variant="ghost" size="sm">
            ← Back to site
          </Btn>
        </Link>
      </header>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div className="gt-card gt-fade-in" style={{ width: 400, padding: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'var(--gt-accent-soft)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon name="lock" size={20} color="var(--gt-accent)" />
            </div>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Admin sign in</h1>
              <div style={{ fontSize: 12, color: 'var(--gt-ink-3)' }}>GreenTech booking system</div>
            </div>
          </div>

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Field label="Email">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@greentech.my"
              />
            </Field>
            <Field label="Password">
              <div style={{ position: 'relative' }}>
                <Input
                  type={showPwd ? 'text' : 'password'}
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  placeholder="••••••••"
                  style={{ paddingRight: 40 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  style={{
                    position: 'absolute',
                    right: 4,
                    top: 4,
                    padding: 8,
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--gt-ink-3)',
                  }}
                >
                  <Icon name="eye" size={16} />
                </button>
              </div>
            </Field>
            {error && <div style={{ fontSize: 12, color: 'var(--gt-warn)' }}>{error}</div>}
            <Btn variant="primary" size="lg" type="submit" full disabled={pending}>
              {pending ? 'Signing in…' : 'Sign in'}
            </Btn>
            <div
              style={{
                fontSize: 11,
                color: 'var(--gt-ink-3)',
                textAlign: 'center',
                padding: '8px 0',
                borderTop: '1px solid var(--gt-line)',
                marginTop: 4,
              }}
            >
              Demo credentials pre-filled · click Sign in to continue
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
