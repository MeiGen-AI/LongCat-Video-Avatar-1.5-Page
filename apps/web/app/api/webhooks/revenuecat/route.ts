import { NextRequest, NextResponse } from 'next/server';
import { verifyRevenueCat, planFromEntitlement } from '@/lib/revenuecat';
import { createAdmin } from '@/lib/supabase/admin';
import { z } from 'zod';
export async function POST(request: NextRequest) {
  if (!verifyRevenueCat(request))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const payload = z
    .object({
      event: z.object({
        id: z.string().min(1),
        type: z.string(),
        app_user_id: z.string().uuid(),
        entitlement_ids: z.array(z.string()).optional(),
      }),
    })
    .parse(await request.json());
  const event = payload.event;
  const db = createAdmin();
  const { data: profile } = await db
    .from('profiles')
    .select('id')
    .eq('id', event.app_user_id)
    .maybeSingle();
  if (!profile) return NextResponse.json({ error: 'Unknown user' }, { status: 400 });
  const { data: existing } = await db
    .from('webhook_events')
    .select('id')
    .eq('provider', 'revenuecat')
    .eq('external_id', event.id)
    .maybeSingle();
  if (existing) return NextResponse.json({ ok: true });
  await db.from('webhook_events').insert({
    provider: 'revenuecat',
    external_id: event.id,
    payload,
    processed_at: new Date().toISOString(),
  });
  const plan = planFromEntitlement(event.entitlement_ids?.[0] ?? '');
  if (plan && plan !== 'free')
    await db.from('subscriptions').upsert(
      {
        user_id: event.app_user_id,
        plan_id: plan,
        provider: 'revenuecat',
        provider_subscription_id: event.id,
        status: event.type === 'CANCELLATION' ? 'canceled' : 'active',
      },
      { onConflict: 'provider,provider_subscription_id' },
    );
  return NextResponse.json({ ok: true });
}
