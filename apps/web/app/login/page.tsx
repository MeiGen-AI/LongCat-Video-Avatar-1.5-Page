'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '../../lib/supabase/browser';
import { Button, Input } from '../../components/ui';
export default function Login() {
  const next = useSearchParams().get('next') ?? '/studio';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const { error: authError } = await createClient().auth.signInWithPassword({ email, password });
    if (authError) setError(authError.message);
    else window.location.href = next;
  };
  const oauth = (provider: 'google' | 'apple') =>
    createClient().auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="glass w-full max-w-md rounded-3xl p-8">
        <Link href="/" className="text-2xl font-semibold">
          fakhm<span className="text-amber">.</span>
        </Link>
        <h1 className="mt-12 text-3xl font-semibold">Welcome back.</h1>
        <form onSubmit={submit} className="mt-8 space-y-4">
          <Input
            required
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Input
            required
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <Button className="w-full">Sign in</Button>
        </form>
        {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
        <div className="mt-5 grid grid-cols-2 gap-2">
          <Button variant="secondary" onClick={() => oauth('google')}>
            Google
          </Button>
          <Button variant="secondary" onClick={() => oauth('apple')}>
            Apple
          </Button>
        </div>
        <p className="mt-6 text-sm text-stone-400">
          <Link href="/forgot-password" className="text-amber">
            Forgot password?
          </Link>{' '}
          · New to Fakhm?{' '}
          <Link className="text-amber" href="/signup">
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}
