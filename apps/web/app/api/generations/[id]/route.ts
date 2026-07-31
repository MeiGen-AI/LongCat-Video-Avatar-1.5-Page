import { NextResponse } from 'next/server';
import { generationIdSchema } from '@fakhm/shared';
import { withApi } from '@/lib/api';
import { createAdmin } from '@/lib/supabase/admin';
import { cancelJob } from '@/lib/longcat';
import { refundCredits } from '@/lib/credits';
export const GET = withApi({
  mode: 'user',
  params: generationIdSchema,
  handler: async ({ userId, params }) => {
    const db = createAdmin();
    const { data, error } = await db
      .from('generations')
      .select('*,generation_events(*)')
      .eq('id', params.id)
      .eq('user_id', userId!)
      .single();
    if (error) throw error;
    return NextResponse.json({ generation: data });
  },
});
export const DELETE = withApi({
  mode: 'user',
  params: generationIdSchema,
  handler: async ({ userId, params }) => {
    const db = createAdmin();
    const { data, error } = await db
      .from('generations')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', userId!)
      .single();
    if (error) throw error;
    if (data.provider_job_id && data.status !== 'succeeded') await cancelJob(data.provider_job_id);
    if (!['succeeded', 'failed', 'canceled'].includes(data.status))
      await refundCredits(userId!, data.credits_charged, data.id);
    await db
      .from('generations')
      .update({ status: 'canceled', completed_at: new Date().toISOString() })
      .eq('id', data.id);
    return NextResponse.json({ ok: true });
  },
});
