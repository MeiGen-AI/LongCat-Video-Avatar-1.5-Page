import { createClient } from './supabase/server';
export interface NotificationProvider {
  send(userId: string, title: string, body: string): Promise<void>;
}
const noOpProvider: NotificationProvider = {
  async send() {
    return;
  },
};
export async function notify(userId: string, title: string, body: string, generationId?: string) {
  const client = createClient();
  const { error } = await client.from('notifications').insert({
    user_id: userId,
    type: 'generation',
    title,
    body,
    generation_id: generationId ?? null,
  } as never);
  if (error) throw error;
  await noOpProvider.send(userId, title, body);
}
