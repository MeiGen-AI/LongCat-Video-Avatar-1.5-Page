'use client';
import Link from 'next/link';
import { useState } from 'react';
import { createClient } from '../../lib/supabase/browser';
import { Button, Input } from '../../components/ui';
export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [done, setDone] = useState(false);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    await createClient().auth.updateUser({ password });
    setDone(true);
  };
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="glass w-full max-w-md rounded-3xl p-8">
        <Link href="/" className="text-2xl font-semibold">
          fakhm<span className="text-amber">.</span>
        </Link>
        <h1 className="mt-12 text-3xl font-semibold">Choose a new password.</h1>
        {done ? (
          <p className="mt-6 text-sm text-stone-400">
            Password updated.{' '}
            <Link className="text-amber" href="/login">
              Sign in
            </Link>
          </p>
        ) : (
          <form onSubmit={submit} className="mt-8 space-y-4">
            <Input
              required
              minLength={8}
              type="password"
              placeholder="New password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <Button className="w-full">Update password</Button>
          </form>
        )}
      </div>
    </main>
  );
}
