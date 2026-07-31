'use client';
import Link from 'next/link';
import { useState } from 'react';
import { createClient } from '../../lib/supabase/browser';
import { Button, Input } from '../../components/ui';
export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    await createClient().auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setSent(true);
  };
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="glass w-full max-w-md rounded-3xl p-8">
        <Link href="/" className="text-2xl font-semibold">
          fakhm<span className="text-amber">.</span>
        </Link>
        <h1 className="mt-12 text-3xl font-semibold">Find your way back.</h1>
        {sent ? (
          <p className="mt-6 text-sm text-stone-400">Check your inbox for a secure reset link.</p>
        ) : (
          <form onSubmit={submit} className="mt-8 space-y-4">
            <Input
              required
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <Button className="w-full">Send reset link</Button>
          </form>
        )}
      </div>
    </main>
  );
}
