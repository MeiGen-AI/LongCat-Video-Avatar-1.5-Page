'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '../../lib/supabase/browser';
import { Button, Input } from '../../components/ui';
export default function Signup() {
  const next = useSearchParams().get('next') ?? '/studio';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const { error } = await createClient().auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    setMessage(error?.message ?? 'Check your inbox to confirm your account.');
  };
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="glass w-full max-w-md rounded-3xl p-8">
        <Link href="/" className="text-2xl font-semibold">
          fakhm<span className="text-amber">.</span>
        </Link>
        <h1 className="mt-12 text-3xl font-semibold">Make your entrance.</h1>
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
            minLength={8}
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <Button className="w-full">Create account</Button>
        </form>
        {message && <p className="mt-4 text-sm text-stone-400">{message}</p>}
        <p className="mt-6 text-sm text-stone-400">
          Already have an account?{' '}
          <Link className="text-amber" href="/login">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
