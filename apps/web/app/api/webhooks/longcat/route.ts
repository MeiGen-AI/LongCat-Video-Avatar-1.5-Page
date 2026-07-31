import { NextRequest, NextResponse } from 'next/server';
import { mapProviderStatus, webhookJobSchema } from '@fakhm/shared';
import { verifyWebhookSignature } from '@/lib/longcat';
import { createAdmin } from '@/lib/supabase/admin';
import { copyOutput } from '@/lib/storage';
import { notify } from '@/lib/notifications';
import { track } from '@/lib/analytics';
import { refundCredits } from '@/lib/credits';
export async function POST(request: NextRequest) {
  const body = await request.text();
  if (!(await verifyWebhookSignature(body, request.headers.get('x-longcat-signature') ?? '')))
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  const payload = webhookJobSchema.parse(JSON.parse(body));
  const eventId = payload.event_id;
  const db = createAdmin();
  const { data: existing } = await db
    .from('webhook_events')
    .select('id')
    .eq('provider', 'longcat')
    .eq('external_id', eventId)
    .maybeSingle();
  if (existing) return NextResponse.json({ ok: true });
  await db.from('webhook_events').insert({
    provider: 'longcat',
    external_id: eventId,
    payload,
    processed_at: new Date().toISOString(),
  });
  const { data: generation } = await db
    .from('generations')
    .select('*')
    .eq('provider_job_id', payload.id)
    .single();
  if (!generation) return NextResponse.json({ ok: true });
  const status = mapProviderStatus(payload.status);
  const terminal = ['succeeded', 'failed', 'canceled'].includes(status);
  let outputAssetId = generation.output_asset_id;
  if (status === 'succeeded' && payload.video_url) {
    outputAssetId = crypto.randomUUID();
    const path = await copyOutput(payload.video_url, `${generation.user_id}/${outputAssetId}.mp4`);
    await db.from('assets').insert({
      id: outputAssetId,
      user_id: generation.user_id,
      kind: 'video',
      bucket: 'outputs',
      path,
      mime: 'video/mp4',
      bytes: 0,
    });
  }
  await db
    .from('generations')
    .update({
      status,
      progress: payload.progress ?? (terminal ? 100 : generation.progress),
      output_asset_id: outputAssetId,
      error_message: payload.error ?? null,
      completed_at: terminal ? new Date().toISOString() : null,
    })
    .eq('id', generation.id);
  await db.from('generation_events').insert({
    generation_id: generation.id,
    status,
    progress: payload.progress ?? 100,
    message: payload.error ?? status,
  });
  if (terminal) {
    if (status === 'failed' || status === 'canceled') {
      await refundCredits(generation.user_id, generation.credits_charged, generation.id);
    }
    await notify(
      generation.user_id,
      status === 'succeeded' ? 'Your video is ready' : 'Your generation finished',
      payload.error ?? 'Generation status updated',
      generation.id,
    );
    await track('generation_completed', generation.user_id, {
      status,
      generationId: generation.id,
    });
  }
  return NextResponse.json({ ok: true });
}
