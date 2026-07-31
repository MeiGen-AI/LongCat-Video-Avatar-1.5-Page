import { NextResponse } from 'next/server';
import { createGenerationSchema, estimateCredits, listGenerationsSchema } from '@fakhm/shared';
import { withApi } from '@/lib/api';
import { createClient } from '@/lib/supabase/server';
import { createAdmin } from '@/lib/supabase/admin';
import { deductCredits, refundCredits } from '@/lib/credits';
import { getJob, submitJob } from '@/lib/longcat';
export const GET = withApi({
  mode: 'user',
  query: listGenerationsSchema,
  handler: async ({ userId, query }) => {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const from = (page - 1) * limit;
    let q = createClient()
      .from('generations')
      .select('*', { count: 'exact' })
      .eq('user_id', userId!)
      .order('created_at', { ascending: false })
      .range(from, from + limit - 1);
    if (query.status) q = q.eq('status', query.status);
    const { data, error, count } = await q;
    if (error) throw error;
    return NextResponse.json({
      items: data,
      total: count ?? 0,
      page,
      limit,
    });
  },
});
export const POST = withApi({
  mode: 'user',
  body: createGenerationSchema,
  handler: async ({ userId, body }) => {
    const resolution = body.resolution ?? '720p';
    const fps = body.fps ?? 30;
    const enhance = body.enhance ?? true;
    const db = createAdmin();
    const { data: assets, error: assetError } = await db
      .from('assets')
      .select('*')
      .in('id', [body.imageAssetId, body.audioAssetId])
      .eq('user_id', userId!);
    if (assetError) throw assetError;
    if (!assets || assets.length !== 2) throw new Error('Assets not found');
    const audio = assets.find((a) => a.kind === 'audio');
    const duration = (audio?.duration_ms ?? 1000) / 1000;
    const credits = estimateCredits(duration, resolution);
    const id = crypto.randomUUID();
    await deductCredits(userId!, credits, id);
    const { data: generation, error } = await db
      .from('generations')
      .insert({
        id,
        user_id: userId!,
        image_asset_id: body.imageAssetId,
        audio_asset_id: body.audioAssetId,
        status: 'queued',
        progress: 5,
        params: {
          resolution,
          fps,
          seed: body.seed,
          enhance,
        },
        credits_charged: credits,
        title: body.title ?? null,
      })
      .select()
      .single();
    if (error) {
      await refundCredits(userId!, credits, id);
      throw error;
    }
    await db
      .from('generation_events')
      .insert({ generation_id: id, status: 'queued', progress: 5, message: 'Generation queued' });
    try {
      const image = assets.find((a) => a.kind === 'image');
      const job = await submitJob({
        image_url: image?.path,
        audio_url: audio?.path,
        resolution,
        fps,
        seed: body.seed,
        enhance,
      });
      await db
        .from('generations')
        .update({
          provider_job_id: job.id,
          provider: 'longcat',
          status: 'processing',
          progress: 20,
          started_at: new Date().toISOString(),
        })
        .eq('id', id);
      return NextResponse.json(
        { generation: { ...generation, provider_job_id: job.id } },
        { status: 201 },
      );
    } catch (error) {
      await refundCredits(userId!, credits, id);
      await db
        .from('generations')
        .update({
          status: 'failed',
          error_code: 'UPSTREAM_ERROR',
          error_message: error instanceof Error ? error.message : 'Provider failed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', id);
      throw error;
    }
  },
});
