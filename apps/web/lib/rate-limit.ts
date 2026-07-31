import { rateLimitKey } from '@fakhm/shared';
import { createAdmin } from './supabase/admin';
export async function checkRateLimit(
  userId: string | undefined,
  ip: string,
  limit = 60,
  windowSeconds = 60,
) {
  const { data, error } = await createAdmin().rpc('bump_rate_limit', {
    p_key: rateLimitKey(userId, ip),
    p_window: windowSeconds,
    p_limit: limit,
  });
  if (error) throw error;
  const result = data?.[0];
  return { allowed: result?.allowed ?? true, remaining: result?.remaining ?? limit };
}
