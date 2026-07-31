import { createClient } from './supabase/server';
export async function track(
  name: string,
  userId: string | null,
  properties: Record<string, unknown> = {},
  sessionId?: string,
) {
  await createClient()
    .from('analytics_events')
    .insert({ name, user_id: userId, properties, session_id: sessionId ?? null } as never);
}
