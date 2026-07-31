import { NextRequest, NextResponse } from 'next/server';
import { verifyRevenueCat, planFromEntitlement } from '@/lib/revenuecat';
import { createAdmin } from '@/lib/supabase/admin';
export async function POST(request: NextRequest) {
  if (!verifyRevenueCat(request))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const payload = (await request.json()) as {
    event?: { type?: string; app_user_id?: string; entitlement_ids?: string[] };
  };
  const event = payload.event;
  if (!event?.app_user_id) return NextResponse.json({ ok: true });
  const plan = planFromEntitlement(event.entitlement_ids?.[0] ?? '');
  if (plan && plan !== 'free')
    await createAdmin()
      .from('subscriptions')
      .upsert(
        {
          user_id: event.app_user_id,
          plan_id: plan,
          provider: 'revenuecat',
          status: event.type === 'CANCELLATION' ? 'canceled' : 'active',
        },
        { onConflict: 'provider_subscription_id' },
      );
  return NextResponse.json({ ok: true });
}
