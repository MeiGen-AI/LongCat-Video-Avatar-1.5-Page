'use client';
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@fakhm/shared';
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Supabase is not configured');
  return createBrowserClient<Database>(url, key);
}
