import { NextResponse } from 'next/server';
import { generationIdSchema } from '@fakhm/shared';
import { withApi } from '@/lib/api';
import { createAdmin } from '@/lib/supabase/admin';
import { submitJob } from '@/lib/longcat';
import { refundCredits } from '@/lib/credits';
export const POST = withApi({
  mode: 'user',
  params: generationIdSchema,
  handler: async ({ userId, params }) => {
    const db = createAdmin();
    const { data: current, error: currentError } = await db
      .from('generations')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', userId!)
      .single();
    if (currentError || !current) throw currentError ?? new Error('Generation not found');
    const [{ data: image }, { data: audio }] = await Promise.all([
      db.from('assets').select('*').eq('id', current.image_asset_id).single(),
      db.from('assets').select('*').eq('id', current.audio_asset_id).single(),
    ]);
    const paramsValue = current.params as {
      resolution?: string;
      fps?: number;
      seed?: number;
      enhance?: boolean;
    };
    try {
      const job = await submitJob({
        image_url: image?.path,
        audio_url: audio?.path,
        resolution: paramsValue.resolution ?? '720p',
        fps: paramsValue.fps ?? 30,
        seed: paramsValue.seed,
        enhance: paramsValue.enhance ?? true,
      });
      const { data, error } = await db
        .from('generations')
        .update({
          status: 'queued',
          progress: 5,
          error_code: null,
          error_message: null,
          attempts: current.attempts + 1,
          provider_job_id: job.id,
          provider: 'longcat',
          queued_at: new Date().toISOString(),
        })
        .eq('id', params.id)
        .eq('user_id', userId!)
        .select()
        .single();
      if (error) throw error;
      return NextResponse.json({ generation: data });
    } catch (error) {
      await refundCredits(current.user_id, current.credits_charged, current.id);
      await db
        .from('generations')
        .update({
          status: 'failed',
          error_code: 'UPSTREAM_ERROR',
          error_message: error instanceof Error ? error.message : 'Provider failed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', current.id);
      throw error;
    }
  },
});
