import { NextResponse } from 'next/server';
import { notificationUpdateSchema } from '@fakhm/shared';
import { withApi } from '@/lib/api';
import { createClient } from '@/lib/supabase/server';
export const GET = withApi({
  mode: 'user',
  handler: async ({ userId }) => {
    const { data, error } = await createClient()
      .from('notifications')
      .select('*')
      .eq('user_id', userId!)
      .order('created_at', { ascending: false })
      .limit(50);
    if (error) throw error;
    return NextResponse.json({ items: data });
  },
});
export const PATCH = withApi({
  mode: 'user',
  body: notificationUpdateSchema,
  handler: async ({ userId, body }) => {
    let query = createClient()
      .from('notifications')
      .update({ read_at: new Date().toISOString() } as never)
      .eq('user_id', userId!);
    if (body.all) query = query.is('read_at', null);
    else query = query.in('id', body.ids ?? []);
    const { error } = await query;
    if (error) throw error;
    return NextResponse.json({ ok: true });
  },
});
