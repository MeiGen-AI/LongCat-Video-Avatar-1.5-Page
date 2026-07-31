import { NextResponse } from 'next/server';
import { generationIdSchema } from '@fakhm/shared';
import { withApi } from '@/lib/api';
import { createAdmin } from '@/lib/supabase/admin';
import { getJob } from '@/lib/longcat';
export const POST = withApi({
  mode: 'user',
  params: generationIdSchema,
  handler: async ({ userId, params }) => {
    const db = createAdmin();
    const { data: g, error } = await db
      .from('generations')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', userId!)
      .single();
    if (error) throw error;
    if (!g.provider_job_id) return NextResponse.json({ generation: g });
    const job = await getJob(g.provider_job_id);
    const status =
      job.status === 'completed'
        ? 'succeeded'
        : job.status === 'failed'
          ? 'failed'
          : job.status === 'canceled'
            ? 'canceled'
            : 'processing';
    const { data, error: updateError } = await db
      .from('generations')
      .update({
        status,
        progress: job.progress ?? g.progress,
        error_message: job.error ?? null,
        completed_at: ['succeeded', 'failed', 'canceled'].includes(status)
          ? new Date().toISOString()
          : null,
      })
      .eq('id', g.id)
      .select()
      .single();
    if (updateError) throw updateError;
    return NextResponse.json({ generation: data });
  },
});
