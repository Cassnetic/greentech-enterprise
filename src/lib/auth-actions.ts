'use server';

import { signIn, signOut } from '@/lib/auth';

export async function loginAction(formData: FormData) {
  const email = String(formData.get('email') || '');
  const password = String(formData.get('password') || '');
  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: '/admin/bookings',
    });
    return { ok: true } as const;
  } catch (err) {
    // NextAuth throws a NEXT_REDIRECT-like signal on success that bubbles up.
    // Real auth failures surface as CredentialsSignin error type.
    const message = (err as Error)?.message || '';
    if (message.includes('NEXT_REDIRECT')) throw err;
    return { ok: false, error: 'Invalid email or password' } as const;
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: '/' });
}
