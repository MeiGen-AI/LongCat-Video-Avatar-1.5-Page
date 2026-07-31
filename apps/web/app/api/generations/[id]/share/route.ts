import { NextResponse } from 'next/server';
import { createShareSlug, generationIdSchema, shareToggleSchema } from '@fakhm/shared';
import { withApi } from '@/lib/api';
import { createAdmin } from '@/lib/supabase/admin';
export const POST = withApi({
  mode: 'user',
  params: generationIdSchema,
  body: shareToggleSchema,
  handler: async ({ userId, params, body }) => {
    const { data, error } = await createAdmin()
      .from('generations')
      .update({
        visibility: body.shared ? 'unlisted' : 'private',
        share_slug: body.shared ? createShareSlug() : null,
      })
      .eq('id', params.id)
      .eq('user_id', userId!)
      .select('share_slug,visibility')
      .single();
    if (error) throw error;
    return NextResponse.json(data);
  },
});
