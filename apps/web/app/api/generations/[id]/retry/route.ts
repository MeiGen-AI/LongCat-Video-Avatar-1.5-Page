import { NextResponse } from 'next/server';
import { generationIdSchema } from '@fakhm/shared';
import { withApi } from '@/lib/api';
import { createAdmin } from '@/lib/supabase/admin';
export const POST = withApi({
  mode: 'user',
  params: generationIdSchema,
  handler: async ({ userId, params }) => {
    const { data, error } = await createAdmin()
      .from('generations')
      .update({
        status: 'queued',
        progress: 5,
        error_code: null,
        error_message: null,
        attempts: 1,
        queued_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .eq('user_id', userId!)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ generation: data });
  },
});
