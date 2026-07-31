import { createClient } from '@supabase/supabase-js';
import type { Database } from '@fakhm/shared';
import { getEnv } from '../env';
export function createAdmin() {
  const env = getEnv();
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY)
    throw new Error('Supabase admin is not configured');
  return createClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
