import { NextResponse } from 'next/server';
import { profileUpdateSchema } from '@fakhm/shared';
import { withApi } from '@/lib/api';
import { createClient } from '@/lib/supabase/server';
export const GET = withApi({
  mode: 'user',
  handler: async ({ userId }) => {
    const db = createClient();
    const [{ data: profile, error }, { data: subscription }] = await Promise.all([
      db.from('profiles').select('*').eq('id', userId!).single(),
      db
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId!)
        .eq('status', 'active')
        .maybeSingle(),
    ]);
    if (error) throw error;
    return NextResponse.json({ profile, subscription });
  },
});
export const PATCH = withApi({
  mode: 'user',
  body: profileUpdateSchema,
  handler: async ({ userId, body }) => {
    const { data, error } = await createClient()
      .from('profiles')
      .update({
        display_name: body.displayName,
        locale: body.locale,
        theme: body.theme,
        marketing_opt_in: body.marketingOptIn,
      } as never)
      .eq('id', userId!)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ profile: data });
  },
});
